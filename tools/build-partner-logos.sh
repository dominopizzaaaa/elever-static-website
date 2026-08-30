#!/usr/bin/env bash
# Exports each partner logo for the "Trusted by" row on the Events page:
#   assets/img/partners/<slug>.png   max 480px on the long edge
#
# PNG rather than JPEG because every mark is drawn on transparency and sits on
# a white chip. 480px is comfortably past the ~52px they are drawn at, retina
# included.
#
# Sources live in assets/img/Photos/Partners/ as "<Partner Name>.png" and are
# never modified; <slug> is that name lowercased and hyphenated, and must match
# the `logo` path in PARTNERS in assets/js/data.js.
#
# Run after adding a logo:   bash tools/build-partner-logos.sh
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="assets/img/Photos/Partners"
OUT="assets/img/partners"
mkdir -p "$OUT"

# A logo supplied on a lot of empty canvas would be drawn far smaller than the
# rest of the row, so it is centre-cropped to its mark first. "height width".
crop_for() {
  case "$1" in
    truly-nuts) echo "2900 5760" ;;
    *)          echo "" ;;
  esac
}

n=0
for f in "$SRC"/*.png; do
  [ -e "$f" ] || continue
  # "People_s Association.png" -> "peoples-association.png"
  slug="$(basename "${f%.*}" | tr '[:upper:]' '[:lower:]' | tr -d "_'" | tr ' ' '-')"
  out="$OUT/$slug.png"
  crop="$(crop_for "$slug")"
  if [ -n "$crop" ]; then
    sips -c $crop "$f" --out "$out" >/dev/null
    sips -Z 480 -s format png "$out" --out "$out" >/dev/null
  else
    sips -Z 480 -s format png "$f" --out "$out" >/dev/null
  fi
  n=$((n+1))
  echo "partners/$slug.png"
done

echo "partners: $n logos"
