#!/usr/bin/env bash
# Render each hero mockup to PNG (desktop 1600x900, mobile 390x844) with the cached headless Chrome.
cd "$(dirname "$0")"
CHROME=$(ls -d /c/Users/prash/.cache/puppeteer/chrome-headless-shell/win64-*/chrome-headless-shell-win64/chrome-headless-shell.exe | tail -1)
mkdir -p renders
for f in ${@:-*.html}; do
  name="${f%.html}"; mkdir -p "renders/$(dirname "$f")"
  url="file:///$(cygpath -m "$PWD/$f")"
  "$CHROME" --headless --disable-gpu --hide-scrollbars --allow-file-access-from-files --window-size=1920,987 --virtual-time-budget=6000 --screenshot="renders/$name-desktop.png" "$url" >/dev/null 2>&1
  "$CHROME" --headless --disable-gpu --hide-scrollbars --allow-file-access-from-files --window-size=390,844 --force-device-scale-factor=2 --virtual-time-budget=6000 --screenshot="renders/$name-mobile.png" "$url" >/dev/null 2>&1
  echo "rendered $name"
done
