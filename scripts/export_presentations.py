"""用 Windows PowerPoint 导出演示副本；原文件始终只读。

依赖：pywin32、Pillow、FFmpeg。输出的时间线需通过 calibrate_presentations.py
对最终视频核验后，才可用于网页。中间 PPTX/PNG 留在忽略上传的 output/。
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import shutil
import subprocess
import time
import io
import posixpath
import re
import zipfile
import xml.etree.ElementTree as ET

import win32com.client

ROOT = Path(__file__).resolve().parents[1]
FOLDERS = {'care': '多形态可重构陪护机器人', 'grooming': '男士面部护理仪',
           'printer': '食品打印机', 'frog': '牛蛙自动宰杀机'}


def digest(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def animated_images(source):
    """GIF 不是 PowerPoint MediaFormat；必须单独计算完整播放周期。"""
    from PIL import Image
    result, durations = {}, {}
    with zipfile.ZipFile(source) as archive:
        for name in archive.namelist():
            if name.lower().endswith('.gif'):
                with Image.open(io.BytesIO(archive.read(name))) as image:
                    duration = 0
                    for index in range(image.n_frames):
                        image.seek(index)
                        duration += image.info.get('duration', 0)/1000
                durations[name] = round(duration, 3)
        for name in archive.namelist():
            match = re.fullmatch(r'ppt/slides/_rels/slide(\d+)\.xml.rels', name)
            if match:
                records = []
                for relation in ET.fromstring(archive.read(name)):
                    target = posixpath.normpath('ppt/slides/'+relation.get('Target',''))
                    if target in durations:
                        records.append({'file':target,'duration':durations[target]})
                result[int(match[1])] = records
    return result


def prepare_slide(slide, gifs=None):
    """保留效果及相对延时；为缺失排练计时的点击效果补上自动触发。"""
    transition = slide.SlideShowTransition
    original_advance = float(transition.AdvanceTime) if transition.AdvanceOnTime else 0
    records, media = [], []
    for shape in slide.Shapes:
        if shape.Type == 16:
            fmt = shape.MediaFormat
            duration = max(0, (fmt.EndPoint - fmt.StartPoint) / 1000)
            if duration == 0:
                duration = fmt.Length / 1000
            media.append({'id': shape.Id, 'name': shape.Name, 'duration': duration})
    # Read original triggers before modifying any effect (COM can normalize its neighbours).
    effects = [(slide.TimeLine.MainSequence.Item(i),
                slide.TimeLine.MainSequence.Item(i).Timing.TriggerType,
                float(slide.TimeLine.MainSequence.Item(i).Timing.TriggerDelayTime))
               for i in range(1, slide.TimeLine.MainSequence.Count + 1)]
    group_origin = previous_end = maximum_end = 0.0
    for effect, trigger, delay in effects:
        timing = effect.Timing
        if trigger == 1:  # Click -> after previous, only in the export copy.
            timing.TriggerType = 3
            delay = max(.5, delay)
            timing.TriggerDelayTime = delay
            trigger = 3
        if trigger != 2:
            group_origin = previous_end
        start = group_origin + delay
        length = max(0, float(timing.Duration))
        if effect.EffectType == 83:
            length = max(length, next((m['duration'] for m in media if m['id'] == effect.Shape.Id), 0))
        repeat = float(timing.RepeatCount)
        if 1 < repeat < 100:
            length *= repeat
        if timing.AutoReverse:
            length *= 2
        end = start + length
        records.append({'shape': effect.Shape.Id, 'effect': effect.EffectType,
                        'trigger': trigger, 'start': round(start, 3), 'end': round(end, 3)})
        previous_end = end
        maximum_end = max(maximum_end, end)
    media_ids = {r['shape'] for r in records if r['effect'] == 83}
    for shape in slide.Shapes:
        if shape.Type == 16 and shape.Id not in media_ids:
            shape.AnimationSettings.PlaySettings.PlayOnEntry = True
            maximum_end = max(maximum_end, next(m['duration'] for m in media if m['id'] == shape.Id))
    # Keep valid source timings. Otherwise allow complete animations plus a reading pause.
    gif_cycle = max((image['duration'] for image in (gifs or [])), default=0)
    needed = max(8, math.ceil(maximum_end + gif_cycle + 2))
    advance = original_advance if original_advance >= maximum_end + gif_cycle + .2 else needed
    transition.AdvanceOnTime = True
    transition.AdvanceOnClick = False
    transition.AdvanceTime = advance
    transition.Hidden = False
    return {'page': slide.SlideIndex, 'advance': advance,
            'transition': float(transition.Duration), 'originalAdvance': original_advance,
            'effects': records, 'media': media, 'animatedImages': gifs or []}


def export(source, key, resolution, fps):
    work = ROOT / 'output/presentation-export' / key
    work.mkdir(parents=True, exist_ok=True)
    assets = ROOT / 'assets/presentations'
    assets.mkdir(parents=True, exist_ok=True)
    original = next((source / FOLDERS[key]).glob('*.pptx'))
    original_hash = digest(original)
    gifs = animated_images(original)
    copy = work / 'timed-copy.pptx'
    shutil.copy2(original, copy)
    app = win32com.client.Dispatch('PowerPoint.Application')
    presentation = app.Presentations.Open(str(copy), False, False, False)
    try:
        records = []
        slides_dir = work / 'slides'
        slides_dir.mkdir(exist_ok=True)
        for slide in presentation.Slides:
            slide.Export(str(slides_dir / f'{slide.SlideIndex:02}.png'), 'PNG', 1280, 720)
            records.append(prepare_slide(slide, gifs.get(slide.SlideIndex)))
        report = {'project': key, 'source': original.name, 'sourceSha256': original_hash,
                  'slides': records, 'resolution': resolution, 'fps': fps}
        (work / 'timing.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
        presentation.Save()
        raw = work / 'powerpoint.mp4'
        print(key, 'exporting', len(records), 'pages; planned hold', sum(r['advance'] for r in records), flush=True)
        presentation.CreateVideo(str(raw), True, 8, resolution, fps, 85)
        deadline = time.monotonic() + 3600
        while time.monotonic() < deadline:
            status = presentation.CreateVideoStatus
            if status == 3:
                break
            if status == 4:
                raise RuntimeError(f'{key}: PowerPoint export failed')
            time.sleep(3)
        else:
            raise TimeoutError(f'{key}: PowerPoint export exceeded one hour')
    finally:
        presentation.Close()
    if digest(original) != original_hash:
        raise RuntimeError('Original presentation changed unexpectedly')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(raw), '-c:v', 'libx264',
                    '-preset', 'fast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac',
                    '-b:a', '128k', '-movflags', '+faststart', str(assets / f'{key}.mp4')], check=True)
    from PIL import Image
    with Image.open(slides_dir / '01.png') as image:
        image.save(assets / f'{key}.webp', quality=90)
    print(key, 'export complete', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path, help='原始材料目录')
    parser.add_argument('--projects', nargs='+', choices=list(FOLDERS), default=list(FOLDERS))
    parser.add_argument('--resolution', type=int, default=1080)
    parser.add_argument('--fps', type=int, default=30)
    options = parser.parse_args()
    for project in options.projects:
        export(options.source.resolve(), project, options.resolution, options.fps)
