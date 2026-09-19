"""复制分析图片并转换项目短视频，不修改源素材。"""
import argparse
import json
import subprocess
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]

def prepare():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source',type=Path)
    parser.add_argument('--ffmpeg',default='ffmpeg')
    args=parser.parse_args()
    assets=ROOT/'assets'
    care=args.source/'多形态可重构陪护机器人'
    printer=args.source/'食品打印机'/'优化'
    for i,name in enumerate(['初始模型','第一次优化','应力仿真1','应力仿真2'],1):
        with Image.open(care/'拓扑优化'/(name+'.png')) as image:
            image.save(assets/f'care-topology-{i}.webp',lossless=True,method=6)
    manifest=[]
    for source,stem in [(care/'过障分析.mp4','care-obstacle'),
                        (printer/'精准与均匀送料.mp4','printer-feed'),
                        (printer/'自动换料设计.gif','printer-switch'),
                        (printer/'旋转收纳设计.gif','printer-fold'),
                        (printer/'模块化设计.mp4','printer-modular')]:
        output=assets/(stem+'.mp4')
        subprocess.run([args.ffmpeg,'-y','-v','error','-i',str(source),
                        '-vf',"scale=w='min(1920,iw)':h='min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
                        '-fps_mode','vfr','-c:v','libx264','-crf','23','-preset','medium',
                        '-pix_fmt','yuv420p','-an','-movflags','+faststart',str(output)],check=True)
        subprocess.run([args.ffmpeg,'-y','-v','error','-i',str(output),'-frames:v','1',str(assets/(stem+'.webp'))],check=True)
        manifest.append({'source':source.name,'video':output.name,'poster':stem+'.webp'})
        print(stem,output.stat().st_size,flush=True)
    (assets/'analysis-media-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':prepare()
