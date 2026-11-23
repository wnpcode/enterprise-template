#!/usr/bin/env bash
# Render ikon app dari SVG di folder ini ke apps/web/public dan apps/playground/public. Butuh inkscape.
set -euo pipefail
cd "$(dirname "$0")"
WEB=../apps/web/public
PLAY=../apps/playground/public
mkdir -p "$PLAY"
png() { inkscape "$1" --export-type=png --export-width="$2" --export-filename="$3" >/dev/null 2>&1; }
png icon.svg 192 "$WEB/pwa-192.png"
png icon.svg 512 "$WEB/pwa-512.png"
png icon.svg 180 "$WEB/apple-touch-icon.png"
png icon-maskable.svg 512 "$WEB/pwa-maskable-512.png"
cp icon.svg "$WEB/favicon.svg"
cp icon.svg "$PLAY/favicon.svg"
echo "ikon diperbarui di $WEB dan $PLAY"
