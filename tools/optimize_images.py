#!/usr/bin/env python3
"""Codex가 만든 그림을 앱용으로 줄입니다. (프로젝트 루트에서: python3 tools/optimize_images.py <교재id>)
- courses/<id>/img/story/*.png  → .jpg(품질 84)로 변환, 원본 PNG는 art/originals/<id>/story/ 로 이동
- courses/<id>/img/*.png (단어·캐릭터) → 256색 PNG로 압축(투명 유지)
"""
import glob, os, shutil, sys
ID = sys.argv[1] if len(sys.argv) > 1 else "opposites-g1"
IMG = f"courses/{ID}/img"
from PIL import Image
OUT = f"art/originals/{ID}/story"
os.makedirs(OUT, exist_ok=True)
for f in sorted(glob.glob(f"{IMG}/story/*.png")):
    Image.open(f).convert("RGB").save(f[:-4] + ".jpg", "JPEG", quality=84, optimize=True, progressive=True)
    shutil.move(f, OUT + "/" + os.path.basename(f))
    print("story", os.path.basename(f))
for f in glob.glob(f"{IMG}/*.png"):
    if os.path.getsize(f) > 60_000:
        Image.open(f).convert("RGBA").quantize(colors=256, method=Image.Quantize.FASTOCTREE).save(f, optimize=True)
        print("png", os.path.basename(f))
