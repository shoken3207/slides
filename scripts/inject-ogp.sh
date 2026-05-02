#!/bin/bash
# Inject OGP meta tags into built HTML files
# Usage: ./scripts/inject-ogp.sh <html-file> <base-url> <slide-name>
#
# Expects og.png to exist alongside the HTML file.

HTML_FILE="$1"
BASE_URL="$2"
SLIDE_NAME="$3"

if [ ! -f "$HTML_FILE" ]; then
  echo "File not found: $HTML_FILE"
  exit 1
fi

OG_URL="${BASE_URL}/${SLIDE_NAME}/"
OG_IMAGE="${BASE_URL}/${SLIDE_NAME}/og.png"

OGP_TAGS="<meta property=\"og:image\" content=\"${OG_IMAGE}\"><meta property=\"og:url\" content=\"${OG_URL}\"><meta property=\"og:description\" content=\"LT Slides — ${SLIDE_NAME}\"><meta name=\"twitter:card\" content=\"summary_large_image\"><meta name=\"twitter:image\" content=\"${OG_IMAGE}\">"

sed -i'' -e "s|</head>|${OGP_TAGS}</head>|" "$HTML_FILE"
echo "Injected OGP: $HTML_FILE"
