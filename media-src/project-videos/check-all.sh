#!/usr/bin/env bash
# Runs the HyperFrames check on every project video (or the ones named) and prints errors per video.
cd "$(dirname "$0")"
list=("$@"); [ ${#list[@]} -eq 0 ] && list=($(ls -d */ | tr -d /))
for d in "${list[@]}"; do
  [ -f "$d/index.html" ] || continue
  (cd "$d" && npx --yes hyperframes@0.8.202 check --json 2>/dev/null > check.json)
  python - "$d" <<'PY'
import json, sys
d = sys.argv[1]
r = json.load(open(f'{d}/check.json'))
print(d, {k: v.get('errorCount') for k, v in r.items() if isinstance(v, dict) and 'ok' in v})
for k in ('lint', 'runtime', 'layout', 'contrast'):
    seen = set()
    for f in r[k].get('findings', []):
        if f.get('severity') != 'error':
            continue
        key = (f.get('code') or f.get('rule'), f.get('text') or f.get('selector'))
        if key in seen:
            continue
        seen.add(key)
        print('   ', k, key[0], '|', str(f.get('message'))[:120], '|', str(f.get('text') or f.get('selector'))[:60])
PY
done
