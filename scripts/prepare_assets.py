"""生成网页媒体副本；原始素材保持不变。"""
import argparse
import json
import subprocess
from pathlib import Path
from PIL import Image, ImageOps
import fitz

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
args = parser.parse_args()
source = args.source
target = Path(__file__).resolve().parents[1] / 'assets'
target.mkdir(exist_ok=True)

def convert(relative, name, size=1600, background='#e8e9e7'):
    with Image.open(source / relative) as original:
        im = ImageOps.exif_transpose(original).convert('RGBA')
        im.thumbnail((size, size), Image.Resampling.LANCZOS)
        base = Image.new('RGBA', im.size, background)
        base.alpha_composite(im)
        base.convert('RGB').save(target / name, 'WEBP', quality=88)

images = {
    'portrait.webp': '正式照片.png',
    'care.webp': '多形态可重构陪护机器人/老人陪护机器人.png',
    'care-chair.webp': '多形态可重构陪护机器人/机器人-椅子.png',
    'care-inside.webp': '多形态可重构陪护机器人/机器人-透明外壳.png',
    'care-hand.webp': '多形态可重构陪护机器人/02_动画&渲染/渲染素材/手细节.png',
    'care-wheel.webp': '多形态可重构陪护机器人/02_动画&渲染/渲染素材/轮构态1.png',
    'grooming.webp': '男士面部护理仪/产品图.png',
    'grooming-wrap.webp': '男士面部护理仪/裹面机构.png',
    'grooming-tool.webp': '男士面部护理仪/剃须刀内部.png',
    'grooming-sim.webp': '男士面部护理仪/sim.png',
    'printer.webp': '食品打印机/产品图.png',
    'printer-material.webp': '食品打印机/部分材料选取.png',
    'frog.webp': '牛蛙自动宰杀机/产品图.png',
}
for name, relative in images.items():
    convert(relative, name, 1600 if name != 'portrait.webp' else 800)

award_dir = source / '荣誉证书'
awards = sorted(p for p in award_dir.iterdir() if p.suffix.lower() in ('.png', '.jpg', '.jpeg'))
manifest = []
for i, path in enumerate(awards, 1):
    name = f'certificate-{i:02d}'
    convert(path.relative_to(source), name+'.webp', 1800, 'white')
    convert(path.relative_to(source), name+'-thumb.webp', 640, 'white')
    manifest.append({'id':i, 'source':path.name, 'image':name+'.webp', 'thumb':name+'-thumb.webp'})
(target / 'certificate-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
for stem in ('2025115145660', '2025115145707'):
    pdf = fitz.open(award_dir / (stem+'.pdf'))
    pix = pdf[0].get_pixmap(matrix=fitz.Matrix(1.8,1.8))
    im = Image.frombytes('RGB', (pix.width,pix.height), pix.samples)
    im.save(target / f'patent-{stem}.webp', quality=90)

videos = {
    'care': '多形态可重构陪护机器人/02_动画&渲染/动画/总视频2.0.mp4',
    'grooming': '男士面部护理仪/总动画.mp4',
    'printer': '食品打印机/作品展示.mp4',
    'frog': '牛蛙自动宰杀机/总视频.mp4',
}
for name, relative in videos.items():
    destination = target / f'{name}-demo.mp4'
    if not destination.exists():
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(source/relative),
                        '-vf','scale=1280:720:force_original_aspect_ratio=decrease:force_divisible_by=2',
                        '-c:v','libx264','-preset','fast','-crf','27','-pix_fmt','yuv420p',
                        '-an','-movflags','+faststart',str(destination)],check=True)
    print(name, round(destination.stat().st_size/1024/1024,2),'MB')
print('Asset preparation complete.')
