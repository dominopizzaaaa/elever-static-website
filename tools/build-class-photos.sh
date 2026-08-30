#!/usr/bin/env bash
# Exports the pathway card image for each stage of the development pathway:
#   assets/img/classes/<stage>.jpg   max 900px on the long edge
#
# Élever supplies these already brand-tinted and framed 4:5 portrait, one per
# stage, so there is no crop here — only a resize and a JPEG pass, which takes
# a 5 MB PNG down to about 65 KB.
#
# Sources live in "assets/img/Photos/Regular Classes/" as "<Stage>.png" and are
# never modified; <stage> is that name lowercased and must match the `key` in
# PATHWAYS in assets/js/data.js.
#
# Run after adding or replacing an image:   bash tools/build-class-photos.sh
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="assets/img/Photos/Regular Classes"
OUT="assets/img/classes"
mkdir -p "$OUT"

n=0
for f in "$SRC"/*.png "$SRC"/*.jpg "$SRC"/*.jpeg; do
  [ -e "$f" ] || continue
  stage="$(basename "${f%.*}" | tr '[:upper:]' '[:lower:]')"
  sips -Z 900 -s format jpeg -s formatOptions 62 "$f" --out "$OUT/$stage.jpg" >/dev/null
  n=$((n+1))
  echo "classes/$stage.jpg"
done

echo "classes: $n images"
