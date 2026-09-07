#!/usr/bin/env bash
# Exports supplied partner artwork for the Events page:
#   assets/img/partners/<slug>.png   max 480px on the long edge
#   SingHealth Community Hospitals  max 960px for the event detail
#
# PNG rather than JPEG because every mark is drawn on transparency and sits on
# a white chip. 480px is comfortably past the ~52px used in the logo rail,
# retina included; the event-detail mark gets the roomier exception above.
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

# SingHealth appears in the roomier event-detail Partner section, so retain a
# 960px export. Logos in the compact scrolling rail remain capped at 480px.
max_edge_for() {
  case "$1" in
    singhealth-community-hospitals) echo "960" ;;
    *)                              echo "480" ;;
  esac
}

n=0
for f in "$SRC"/*.png; do
  [ -e "$f" ] || continue
  # "People_s Association.png" -> "peoples-association.png"
  slug="$(basename "${f%.*}" | tr '[:upper:]' '[:lower:]' | tr -d "_'" | tr ' ' '-')"
  out="$OUT/$slug.png"
  crop="$(crop_for "$slug")"
  max_edge="$(max_edge_for "$slug")"
  if [ -n "$crop" ]; then
    sips -c $crop "$f" --out "$out" >/dev/null
    sips -Z "$max_edge" -s format png "$out" --out "$out" >/dev/null
  else
    sips -Z "$max_edge" -s format png "$f" --out "$out" >/dev/null
  fi
  n=$((n+1))
  echo "partners/$slug.png"
done

echo "partners: $n logos"
