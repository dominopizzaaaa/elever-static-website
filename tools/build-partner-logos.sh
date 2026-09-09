#!/usr/bin/env bash
# Exports supplied partner and sponsor artwork for the Events page:
#   assets/img/partners/<slug>.png   max 480px on the long edge
#   SingHealth Community Hospitals  max 960px for the event detail
#
# PNG rather than JPEG because every mark is drawn on transparency and sits on
# a white chip. 480px is comfortably past the ~52px used in the logo rail,
# retina included; the event-detail mark gets the roomier exception above.
#
# Sources live in assets/img/Photos/Partners/ as "<Partner Name>.png" (or .jpg
# where that is all the sponsor supplied — the export is PNG either way) and
# are never modified; <slug> is that name lowercased and hyphenated, and must
# match the `logo` path in PARTNERS, or in an event's `partners` / `sponsors`
# list, in assets/js/data.js. One file per mark: a sponsor that is also a
# standing partner reuses the same export rather than a second copy.
#
# Run after adding a logo:   bash tools/build-partner-logos.sh
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="assets/img/Photos/Partners"
OUT="assets/img/partners"
mkdir -p "$OUT"

# A logo supplied on a lot of empty canvas would be drawn far smaller than the
# rest of the row, so it is centre-cropped to its mark first. "height width".
# Values are measured off the supplied file, with a little margin left around
# the mark; only well-centred artwork belongs here, since sips crops from the
# centre and would clip anything sitting off to one side.
crop_for() {
  case "$1" in
    truly-nuts)       echo "2900 5760" ;;
    joo-chiat-csn)    echo "1300 3050" ;;
    the-prime-circle) echo "1060 1000" ;;
    cuckoo)           echo "1200 7500" ;;
    1tcm)             echo "4250 3550" ;;
    # Its mark sits low in the supplied canvas, so the crop stays symmetric
    # about the centre and only takes back what it can without clipping.
    east-side-best-side) echo "1690 1150" ;;
    *)                echo "" ;;
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

slug_for() {
  case "$1" in
    SBA|sba)                          echo "sba" ;;
    "SCH Transparent")              echo "singhealth-community-hospitals" ;;
    *) printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | tr -d "_'" | tr ' ' '-' ;;
  esac
}

n=0
while IFS= read -r f; do
  # "People_s Association.png" -> "peoples-association.png"
  slug="$(slug_for "$(basename "${f%.*}")")"
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
done < <(find "$SRC" -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) | LC_ALL=C sort)

echo "partners: $n logos"
