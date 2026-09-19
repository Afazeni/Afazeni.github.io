"""原版简历同步：只复制指定 PDF，绝不从网页重排生成下载文件。"""
import argparse
import hashlib
import shutil
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]

def copy_resume(source):
    source = Path(source).resolve(strict=True)
    destination = ROOT / 'assets' / 'resume-original.pdf'
    with fitz.open(source) as document:
        if len(document) != 1:
            raise ValueError('当前简历预览对应一页原件；多页原件需先扩展页面预览。')
        pixmap = document[0].get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        pixmap.save(str(ROOT / 'assets' / 'resume-original.png'))
    if source != destination.resolve():
        shutil.copyfile(source, destination)
    original_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    assert hashlib.sha256(destination.read_bytes()).hexdigest() == original_hash
    print('Original resume SHA-256:', original_hash, flush=True)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('original_pdf', type=Path, help='原始 PDF 完整路径（必填）')
    copy_resume(parser.parse_args().original_pdf)
