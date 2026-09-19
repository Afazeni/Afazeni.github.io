"""从网页 PDF 副本导出 AIGC 阅读图片；不修改 PDF 或逐页解说。"""
from pathlib import Path
import hashlib
import fitz
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'assets/aigc/portfolio-2025.pdf'
before=hashlib.sha256(source.read_bytes()).digest()
with fitz.open(source) as doc:
    assert len(doc)==43, '请先核对新 PDF 的页数与解说'
    for i,page in enumerate(doc,1):
        assert abs(page.rect.width/page.rect.height-16/9)<.001
        pix=page.get_pixmap(matrix=fitz.Matrix(2400/page.rect.width,2400/page.rect.width),alpha=False)
        image=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
        image.save(ROOT/f'assets/aigc/page-{i:02d}.webp',quality=94,method=6)
        image.resize((1200,675),Image.Resampling.LANCZOS).save(ROOT/f'assets/aigc/page-{i:02d}-small.webp',quality=92,method=6)
assert hashlib.sha256(source.read_bytes()).digest()==before
print('Exported 43 pages, 2400px and 1200px WebP; PDF unchanged')
