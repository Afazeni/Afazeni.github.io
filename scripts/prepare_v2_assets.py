"""Create website copies only. Pass the material folder and the four selected PNGs."""
import argparse
import subprocess
from pathlib import Path
from PIL import Image
from export_resume import copy_resume

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'

def picture(source, name, limit=2000):
    with Image.open(source) as image:
        image.thumbnail((limit, limit), Image.Resampling.LANCZOS)
        image.save(ASSETS / name, 'WEBP', quality=92, method=6)

def prepare():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    for name in ['background', 'printer', 'frog', 'structure']:
        parser.add_argument('--'+name, required=True, type=Path)
    parser.add_argument('--ffmpeg', default='ffmpeg')
    args = parser.parse_args()
    ASSETS.mkdir(exist_ok=True)
    for source, name in [(args.background,'hero-mesh.webp'), (args.printer,'printer-cover.webp'),
                         (args.frog,'frog-cover.webp'), (args.structure,'frog-structure.webp')]:
        picture(source, name, 2848 if name=='hero-mesh.webp' else 2000)
    care = args.source / '多形态可重构陪护机器人'
    for i, name in enumerate(['老人陪护机器人','机器人-透明外壳','机器人-椅子','机器人-椅子-人'], 1):
        picture(care / (name+'.png'), f'care-gallery-{i}.webp')
    groups = [('care', care, ['功能创新','结构创新','机构创新']),
              ('grooming', args.source/'男士面部护理仪', ['功能创新','机构创新','结构创新']),
              ('frog', args.source/'牛蛙自动宰杀机', ['摆正与夹头机构创新','多工位往复加工创新'])]
    for project, folder, titles in groups:
        for i, title in enumerate(titles, 1):
            name = f'{project}-detail-{i}'
            destination = ASSETS / (name+'.mp4')
            subprocess.run([args.ffmpeg,'-y','-v','error','-i',str(folder/(title+'.mp4')),
                '-vf','scale=1280:720:force_original_aspect_ratio=decrease:force_divisible_by=2',
                '-c:v','libx264','-preset','medium','-crf','25','-pix_fmt','yuv420p','-an',
                '-movflags','+faststart',str(destination)],check=True)
            subprocess.run([args.ffmpeg,'-y','-v','error','-i',str(destination),'-frames:v','1',
                str(ASSETS/(name+'.webp'))],check=True)
            print(name, destination.stat().st_size, flush=True)
    copy_resume(args.source/'简历 拷贝.pdf')

if __name__=='__main__':
    prepare()
