"""从最终视频画面校准页码，生成可逐页核查的截图与网页数据。

PowerPoint 的计时仅作为搜索窗口；实际边界来自视频帧与原幻灯片的顺序匹配。
生成后必须查看 contact-*.jpg 和动画抽样图，不能把匹配成功当作视觉验收。
"""
import argparse
import json
from pathlib import Path
import subprocess
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT, FPS = 160, 90, 5


def probe(path):
    return json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries',
        'format=duration:stream=width,height,codec_type', '-of', 'json', str(path)]))


def frame(path, seconds):
    import io
    data = subprocess.check_output(['ffmpeg', '-v', 'error', '-ss', str(seconds), '-i', str(path),
        '-frames:v', '1', '-vf', 'scale=640:360', '-f', 'image2pipe', '-vcodec', 'png', '-'])
    return Image.open(io.BytesIO(data)).convert('RGB')


def calibrate(key, skip_samples=False):
    work = ROOT / 'output/presentation-export' / key
    timing = json.loads((work/'timing.json').read_text(encoding='utf-8'))
    video = ROOT / 'assets/presentations' / f'{key}.mp4'
    duration = float(probe(video)['format']['duration'])
    slides = timing['slides']
    nominal = np.array([0] + list(np.cumsum([s['advance'] + s['transition'] for s in slides])))
    # Only restrict the image search window with source timings; do not publish these estimates.
    estimate = nominal * duration / nominal[-1]
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(video), '-vf',
        f'fps={FPS},scale={WIDTH}:{HEIGHT}', '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-'])
    frames = np.frombuffer(raw, dtype=np.uint8).reshape(-1, HEIGHT, WIDTH, 3).astype(np.float32) / 255
    refs = np.array([np.asarray(Image.open(work/'slides'/f'{i+1:02}.png').convert('RGB').resize(
        (WIDTH, HEIGHT), Image.Resampling.BILINEAR), dtype=np.float32)/255 for i in range(len(slides))])
    weights = np.ones((HEIGHT, WIDTH, 1), dtype=np.float32)
    weights[:10, :100] = 200  # Page title dominates animated charts and media overlays.
    costs = np.empty((len(frames), len(slides)), dtype=np.float32)
    times = np.arange(len(frames))/FPS
    for i, ref in enumerate(refs):
        costs[:, i] = np.mean(abs(frames-ref)*weights, axis=(1,2,3))
        outside = (times < estimate[i]-30) | (times > estimate[i+1]+30)
        costs[outside, i] += 100
    dp = np.full_like(costs, np.inf)
    moved = np.zeros_like(costs, dtype=bool)
    dp[0, 0] = costs[0, 0]
    for t in range(1, len(frames)):
        stay = dp[t-1]
        advance = np.r_[np.inf, dp[t-1, :-1]]
        moved[t] = advance < stay
        dp[t] = np.minimum(stay, advance) + costs[t]
    labels = np.zeros(len(frames), dtype=int)
    current = len(slides)-1
    for t in range(len(frames)-1, -1, -1):
        labels[t] = current
        if moved[t, current]:
            current -= 1
    starts = [0.0]
    for i in range(1, len(slides)):
        matched = np.flatnonzero(labels == i)
        if not len(matched):
            raise ValueError(f'{key}: could not match slide {i+1}')
        # A paused chapter selection must show the new slide, not a half-morphed old one.
        # Continuous playback still includes the complete original transition.
        starts.append(round(matched[0]/FPS + slides[i]['transition'] + .25, 2))
    audit = {'project': key, 'duration': duration, 'sourceSha256': timing['sourceSha256'],
             'videoSha256': __import__('hashlib').file_digest(video.open('rb'), 'sha256').hexdigest(),
             'method': 'ordered visual frame matching at 5 fps; source timings used only as search windows',
             'slides': []}
    overrides = ROOT/'scripts/presentation-timing-overrides.json'
    if overrides.exists():
        correction = json.loads(overrides.read_text(encoding='utf-8')).get(key,{})
        if correction.get('videoSha256') == audit['videoSha256']:
            for number, seconds in correction['starts'].items():
                starts[int(number)-1] = seconds
            audit['manualCorrections'] = correction['starts']
        elif correction:
            print(key, 'video changed: previous manual corrections ignored; review all frames again', flush=True)
    for i, start in enumerate(starts):
        end = starts[i+1] if i+1 < len(starts) else duration
        midpoint = min(start+max(1.5, slides[i]['transition']+1), start+(end-start)*.6)
        audit['slides'].append({'page': i+1, 'start': start, 'end': end,
            'sourceEstimate': round(float(estimate[i]),2), 'sample': round(midpoint,2)})
        if skip_samples:
            continue
        actual = frame(video, midpoint)
        actual.save(work/f'page-{i+1:02}.jpg', quality=90)
        if slides[i]['media'] or slides[i].get('animatedImages'):
            # Actual video frames across each media slide, for checking movement and cropping.
            sheet = Image.new('RGB',(1280,720),'white')
            for j, fraction in enumerate([.18,.4,.62,.84]):
                image = frame(video, start+(end-start)*fraction)
                sheet.paste(image, ((j%2)*640,(j//2)*360))
            sheet.save(work/f'motion-{i+1:02}.jpg',quality=90)
    for offset in ([] if skip_samples else range(0,len(slides),12)):
        sheet = Image.new('RGB',(1280,660),'#eeeeee')
        draw = ImageDraw.Draw(sheet)
        for j in range(min(12,len(slides)-offset)):
            i = offset+j
            image = Image.open(work/f'page-{i+1:02}.jpg').resize((320,180))
            x,y=(j%4)*320,(j//4)*220
            sheet.paste(image,(x,y+25))
            draw.text((x+8,y+5),f'{key} page {i+1:02} @ {starts[i]:.2f}s',fill='black')
        sheet.save(work/f'contact-{offset//12+1}.jpg',quality=92)
    (work/'calibrated.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
    print(key, 'calibrated', starts, flush=True)


def assemble():
    copy = json.loads((ROOT/'presentation-copy.json').read_text(encoding='utf-8'))
    existing = ROOT/'presentations.js'
    if existing.exists():
        text = existing.read_text(encoding='utf-8')
        saved = json.loads(text.split('export const presentations = ',1)[1].strip().rstrip(';'))
        for key, deck in saved.items():
            if len(deck['slides']) != len(copy[key]['slides']):
                raise ValueError(f'{key}: slide count changed; update presentation-copy.json before regenerating')
            copy[key]['slides'] = [{name:slide[name] for name in ('title','text')} for slide in deck['slides']]
    result = {}
    for key, deck in copy.items():
        audit = ROOT/'output/presentation-export'/key/'calibrated.json'
        if not audit.exists():
            continue
        timing = json.loads(audit.read_text(encoding='utf-8'))
        source_timing = json.loads((audit.parent/'timing.json').read_text(encoding='utf-8'))
        assert len(deck['slides']) == len(timing['slides'])
        points = [slide['start'] for slide in timing['slides']]
        if points[0] != 0 or any(a >= b for a,b in zip(points,points[1:])) or points[-1] >= timing['duration']:
            raise ValueError(f'{key}: invalid calibrated chapter times')
        with (ROOT/'assets/presentations'/f'{key}.mp4').open('rb') as stream:
            actual_hash = __import__('hashlib').file_digest(stream,'sha256').hexdigest()
        if actual_hash != timing['videoSha256']:
            raise ValueError(f'{key}: video changed; run calibration before assembling chapter data')
        result[key] = {'video':f'presentations/{key}.mp4','poster':f'presentations/{key}.webp',
            'slides':[{'start':point['start'],**slide} for point,slide in zip(timing['slides'],deck['slides'])]}
        # Retain start=0 for continuous playback; explicit page-one navigation shows its cover.
        result[key]['slides'][0]['seek'] = round(source_timing['slides'][0]['transition']+.25,2)
    (ROOT/'presentations.js').write_text('// 修改本文件中的 title、text 即可更新网页解说；start 的单位是秒。\n'
        'export const presentations = '+json.dumps(result,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--projects',nargs='*',default=[])
    parser.add_argument('--skip-samples',action='store_true',help='调试匹配；不重新生成核查截图')
    args = parser.parse_args()
    for key in args.projects:
        calibrate(key,args.skip_samples)
    assemble()
