#!/bin/bash
# ローカルビルド: 各スライドをHTMLに変換し、assetsをdistにコピー
set -e

rm -rf dist

# 共有 assets をコピー
if [ -d "slides/assets" ]; then
  mkdir -p dist
  cp -r slides/assets dist/assets
fi

# 各スライドをビルド
for dir in slides/*/; do
  [ -f "${dir}slides.md" ] || continue
  name=$(basename "$dir")
  mkdir -p "dist/${name}"
  npx marp "${dir}slides.md" -c marp.config.mjs -o "dist/${name}/index.html"

  # スライド固有の assets をコピー
  if [ -d "${dir}assets" ]; then
    cp -r "${dir}assets" "dist/${name}/assets"
  fi
done

echo "Build complete: dist/"
