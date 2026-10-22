#!/usr/bin/env bash
# usage: render-new.sh <project-media dir> <public media dir name> <poster second>
set -e
SRC="$1/cinematic"; OUT="/e/Haris portfolio website/public/landing/projects/media/$2"; T="$3"
mkdir -p "$OUT"
(cd "$SRC/composition" && npx -y hyperframes@0.8.149 render --quality delivery --fps 60 --output ../brag-render.mp4 2>&1 | tail -1)
cd "$SRC"
ffmpeg -v error -y -ss "$T" -i brag-render.mp4 -frames:v 1 -q:v 2 brag.jpg
ffmpeg -v error -y -i brag-render.mp4 -i brag.jpg -filter_complex "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v]" -map "[v]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart brag.mp4
ffmpeg -v error -y -i brag-render.mp4 -an -c:v libx264 -profile:v high -crf 19 -preset slow -tune animation -pix_fmt yuv420p -movflags +faststart "$OUT/clip-1080.mp4"
ffmpeg -v error -y -i brag-render.mp4 -an -c:v libvpx-vp9 -crf 27 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 "$OUT/clip-1080.webm"
ffmpeg -v error -y -i brag-render.mp4 -vf "scale=1280:720:flags=lanczos" -an -c:v libx264 -profile:v high -crf 20 -preset slow -tune animation -pix_fmt yuv420p -movflags +faststart "$OUT/clip-720.mp4"
ffmpeg -v error -y -ss "$T" -i brag-render.mp4 -frames:v 1 -q:v 2 "$OUT/poster.jpg"
(cd "$OUT" && python -c "from PIL import Image; Image.open('poster.jpg').save('poster.webp',quality=86,method=6)")
ls -la "$OUT"
