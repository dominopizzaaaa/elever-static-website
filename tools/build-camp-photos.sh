#!/usr/bin/env bash
# Exports every source camp photo into two web-ready sizes:
#   assets/img/camps/camp-<n>.jpg        full-size for the lightbox (max 1600px)
#   assets/img/camps/thumb/camp-<n>.jpg  grid thumbnail (max 640px)
#
# Sources live in assets/img/Photos/Camps/ and are never modified. Unlike the
# events, camps are one flat folder rather than one folder per occasion, so the
# numbering simply follows the sorted filenames. The order is what
# CAMPS.gallery in assets/js/data.js lists, so re-run this and re-check that
# list after adding photos:
#   bash tools/build-camp-photos.sh
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="assets/img/Photos/Camps"
OUT="assets/img/camps"
THUMB="$OUT/thumb"
mkdir -p "$OUT" "$THUMB"

# Deterministic order so numbering is stable across runs.
n=0
while IFS= read -r f; do
  n=$((n+1))
  sips -Z 1600 -s format jpeg -s formatOptions 58 \
       "$f" --out "$OUT/camp-$n.jpg" >/dev/null
  sips -Z 640 -s format jpeg -s formatOptions 55 \
       "$f" --out "$THUMB/camp-$n.jpg" >/dev/null
done < <(find "$SRC" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) | LC_ALL=C sort)

echo "camps: $n photos"
