#!/bin/bash
# Inject OGP meta tags into built HTML files
# Usage: ./scripts/inject-ogp.sh <html-file> <base-url> <slide-name>

HTML_FILE="$1"
BASE_URL="$2"
SLIDE_NAME="$3"

if [ ! -f "$HTML_FILE" ]; then
  echo "File not found: $HTML_FILE"
  exit 1
fi

OG_URL="${BASE_URL}/${SLIDE_NAME}/"
OG_IMAGE="${BASE_URL}/${SLIDE_NAME}/og.png"

# Marp が出力する twitter:card=summary を summary_large_image に上書き
sed -i'' -e 's|<meta name="twitter:card" content="summary">|<meta name="twitter:card" content="summary_large_image">|' "$HTML_FILE"

# OG画像が存在する場合のみ画像タグを追加
OG_DIR=$(dirname "$HTML_FILE")
if [ -f "${OG_DIR}/og.png" ]; then
  IMAGE_TAGS="<meta property=\"og:image\" content=\"${OG_IMAGE}\"><meta name=\"twitter:image\" content=\"${OG_IMAGE}\">"
else
  IMAGE_TAGS=""
  echo "⚠ og.png not found, skipping image tags for ${SLIDE_NAME}"
fi

OGP_TAGS="<meta property=\"og:url\" content=\"${OG_URL}\"><meta property=\"og:description\" content=\"LT Slides — ${SLIDE_NAME}\">${IMAGE_TAGS}"

sed -i'' -e "s|</head>|${OGP_TAGS}</head>|" "$HTML_FILE"
echo "Injected OGP: $HTML_FILE"
