#!/usr/bin/env python3
"""Codex가 만든 그림을 앱용으로 줄입니다. (프로젝트 루트에서 실행: python3 tools/optimize_images.py)
- assets/img/story/*.png  → .jpg(품질 84)로 변환, 원본 PNG는 art/originals/story/ 로 이동
- assets/img/*.png (단어·캐릭터) → 256색 PNG로 압축(투명 유지)
"""
import glob, os, shutil
from PIL import Image
os.makedirs("art/originals/story", exist_ok=True)
for f in sorted(glob.glob("assets/img/story/*.png")):
    Image.open(f).convert("RGB").save(f[:-4] + ".jpg", "JPEG", quality=84, optimize=True, progressive=True)
    shutil.move(f, "art/originals/story/" + os.path.basename(f))
    print("story", os.path.basename(f))
for f in glob.glob("assets/img/*.png"):
    if os.path.getsize(f) > 60_000:
        Image.open(f).convert("RGBA").quantize(colors=256, method=Image.Quantize.FASTOCTREE).save(f, optimize=True)
        print("png", os.path.basename(f))
