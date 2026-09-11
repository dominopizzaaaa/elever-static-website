#!/usr/bin/env bash
# Exports coach training photos as web-ready JPEGs while keeping the supplied
# originals untouched in assets/img/Photos/Coaches/<Coach Name>/.
#
# Output: assets/img/coaches/<coach-slug>-training-<n>.jpg (max 1600px)
#
# Run after adding or replacing coach training photos:
#   bash tools/build-coach-training-photos.sh
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="assets/img/Photos/Coaches"
OUT="assets/img/coaches"
mkdir -p "$OUT"

n=0
while IFS= read -r dir; do
  name="$(basename "$dir")"
  slug="$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')"

  # Clear only this coach's generated training images so removed originals do
  # not leave stale numbered files in the published set.
  find "$OUT" -maxdepth 1 -type f -name "$slug-training-*.jpg" -delete

  i=0
  while IFS= read -r photo; do
    i=$((i+1))
    sips -Z 1600 -s format jpeg -s formatOptions 68 \
         "$photo" --out "$OUT/$slug-training-$i.jpg" >/dev/null
    n=$((n+1))
  done < <(find "$dir" -maxdepth 1 -type f \
    \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) | LC_ALL=C sort)

  echo "$slug: $i training photos"
done < <(find "$SRC" -mindepth 1 -maxdepth 1 -type d | LC_ALL=C sort)

echo "coach training photos: $n total"
