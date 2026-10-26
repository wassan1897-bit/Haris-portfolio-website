#!/usr/bin/env bash
# Web encodes of the signal-engine render for the home page video slot (~558 css px wide, so square 1080 covers 2x screens).
# Usage: bash encode-web.sh [poster-second]
set -euo pipefail
cd "$(dirname "$0")"
SRC=renders/signal-engine-1080sq60.mp4
OUT=../../public/media/signal-engine
POSTER_AT=${1:-12.6}
mkdir -p "$OUT"
ffmpeg -y -v error -i "$SRC" -an -c:v libx264 -preset slow -crf 20 -tune animation -pix_fmt yuv420p -movflags +faststart "$OUT/clip.mp4"
ffmpeg -y -v error -i "$SRC" -an -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 -deadline good -cpu-used 2 "$OUT/clip.webm"
ffmpeg -y -v error -ss "$POSTER_AT" -i "$SRC" -frames:v 1 -c:v libwebp -quality 82 "$OUT/poster.webp"
ls -la "$OUT"
