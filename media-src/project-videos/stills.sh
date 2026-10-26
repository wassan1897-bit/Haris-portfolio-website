#!/usr/bin/env bash
# Project images: one frame per project video, taken when its picture and caption are complete,
# saved as public/projects/img/p-<slug>.webp (1600x900). Usage: bash stills.sh [slug ...]
set -e
cd "$(dirname "$0")"
declare -A AT=(
  [signal-engine]=3.6 [listening-at-scale]=7.6 [research-cascade]=8.4 [growth-engine]=8.0 [sell-side-buyers]=11.2
  [who-actually-buys]=11.0 [social-selling]=11.2 [instant-quotes]=7.0 [speed-to-quote]=6.8 [voice-agents]=7.6
  [uk-broadband]=11.2 [household-investing]=6.8 [marketplace-app]=7.0 [compliance-ai-platform]=7.0 [compliance-tooling]=7.0
)
OUT=../../public/projects/img
mkdir -p "$OUT" stills
list=("$@"); [ ${#list[@]} -eq 0 ] && list=("${!AT[@]}")
for d in "${list[@]}"; do
  (cd "$d" && npx --yes hyperframes@0.8.202 snapshot --at "${AT[$d]}" >/dev/null 2>&1)
  png=$(ls -t "$d"/.hyperframes/artifacts/snapshots/*/frame-00-at-*.png | head -1)
  cp "$png" "stills/$d.png"
  ffmpeg -y -v error -i "$png" -vf "scale=1600:900:flags=lanczos" -c:v libwebp -quality 84 "$OUT/p-$d.webp"
  echo "$d ${AT[$d]}s"
done
