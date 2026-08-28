#!/usr/bin/env bash
# Exports every source event photo into two web-ready sizes:
#   assets/img/events/<slug>-<n>.jpg        full-size for the lightbox (max 1800px)
#   assets/img/events/thumb/<slug>-<n>.jpg  grid thumbnail (max 700px)
#
# Source folders live in assets/img/Photos/Events/ and are never modified.
# Run after adding photos:   bash tools/build-event-photos.sh
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="assets/img/Photos/Events"
OUT="assets/img/events"
THUMB="$OUT/thumb"
mkdir -p "$OUT" "$THUMB"

# Maps a source folder name to the slug used in assets/js/data.js.
slug_for() {
  case "$1" in
    *"KFF Singapore Badminton Open 2025"*)          echo "kff-singapore-open-2025" ;;
    *"Northbrooks Secondary School"*)               echo "northbrooks-school-2025" ;;
    *"Bukit Gombak Sports Clinic 2026"*)            echo "bukit-gombak-clinic-2026" ;;
    *"Serangoon-Paya Lebar Badminton Clinic 2026"*) echo "serangoon-paya-lebar-clinic-2026" ;;
    *"Joo Chiat Badminton Carnival 2026"*)          echo "joo-chiat-carnival-2026" ;;
    *"ASICS Badminton Summit 2026"*)                echo "asics-summit-2026" ;;
    *) echo "" ;;
  esac
}

for dir in "$SRC"/*/; do
  name="$(basename "$dir")"
  slug="$(slug_for "$name")"
  if [ -z "$slug" ]; then
    echo "SKIP (no slug mapping): $name" >&2
    continue
  fi

  # Deterministic order so numbering is stable across runs.
  n=0
  while IFS= read -r f; do
    n=$((n+1))
    sips -Z 1600 -s format jpeg -s formatOptions 58 \
         "$f" --out "$OUT/$slug-$n.jpg" >/dev/null
    sips -Z 640 -s format jpeg -s formatOptions 55 \
         "$f" --out "$THUMB/$slug-$n.jpg" >/dev/null
  done < <(find "$dir" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) | LC_ALL=C sort)

  echo "$slug: $n photos"
done
