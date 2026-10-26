#!/usr/bin/env bash
# Contact sheet per video at 2, 6 and 10 s; copies each into review/<slug>.jpg
cd "$(dirname "$0")"; mkdir -p review
list=("$@"); [ ${#list[@]} -eq 0 ] && list=($(ls -d */ | tr -d / | grep -v review))
for d in "${list[@]}"; do
  [ -f "$d/index.html" ] || continue
  (cd "$d" && npx --yes hyperframes@0.8.202 snapshot --at ${AT:-1.8,3.6,6,7.8,10,11.2} >/dev/null 2>&1)
  cp "$(ls -t "$d"/.hyperframes/artifacts/snapshots/*/contact-sheet*.jpg | head -1)" "review/$d.jpg" && echo "$d ok"
done
