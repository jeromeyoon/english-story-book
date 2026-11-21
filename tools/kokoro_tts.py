#!/usr/bin/env python3
# Kokoro-82M 로 문장 목록을 wav 로 만듭니다. (gen_audio.js 가 호출)
#   python kokoro_tts.py jobs.json outdir     jobs: [{"k":"파일이름","t":"문장","voice":"af_heart","speed":0.9}]
import sys, json, numpy as np, soundfile as sf
from kokoro import KPipeline
jobs = json.load(open(sys.argv[1])); out = sys.argv[2]
p = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
for j in jobs:
    a = np.concatenate([np.asarray(x[2]) for x in p(j["t"], voice=j["voice"], speed=j.get("speed", 0.9))])
    sf.write(f"{out}/{j['k']}.wav", a, 24000)
