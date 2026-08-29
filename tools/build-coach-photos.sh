#!/usr/bin/env bash
# Exports every coach headshot as a square, web-ready portrait:
#   assets/img/coaches/<slug>.jpg   800 x 800
#
# The studio headshots are all framed the same 2:3 portrait, so a CENTRED
# square crop lands on head-and-shoulders with the folded arms still in
# frame — the crop lives in the file rather than in `object-fit: cover`, so
# the About grid, the coach profile pages and any share card all show the
# same picture.
#
# Sources live in assets/img/Photos/Coaches/ as "Headshot - <Name>.<ext>"
# and are never modified; <slug> is that name lowercased and hyphenated, and
# must match the `slug` in assets/js/data.js.
#
# Run after adding or replacing a headshot:
#   bash tools/build-coach-photos.sh
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="assets/img/Photos/Coaches"
OUT="assets/img/coaches"
mkdir -p "$OUT"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

n=0
while IFS= read -r f; do
  name="$(basename "$f")"
  name="${name%.*}"                      # drop the extension
  name="${name#Headshot - }"             # drop the prefix
  slug="$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')"

  # Square first, then resample — sips crops from the centre of the frame.
  size="$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')"
  sips -c "$size" "$size" "$f" --out "$tmp/$slug.png" >/dev/null
  sips -Z 800 -s format jpeg -s formatOptions 72 \
       "$tmp/$slug.png" --out "$OUT/$slug.jpg" >/dev/null

  n=$((n+1))
done < <(find "$SRC" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) | LC_ALL=C sort)

echo "coaches: $n square headshots"
