#!/bin/bash
# ローカルビルド: 各スライドをHTMLに変換し、assetsをdistにコピー
set -e

rm -rf dist

for dir in slides/*/; do
  [ -f "${dir}slides.md" ] || continue
  name=$(basename "$dir")
  mkdir -p "dist/${name}"
  npx marp "${dir}slides.md" -c marp.config.mjs -o "dist/${name}/index.html"

  # assets をコピー（共有 → スライド固有の順でマージ）
  mkdir -p "dist/${name}/assets"
  [ -d "slides/assets" ] && cp -r slides/assets/* "dist/${name}/assets/"
  [ -d "${dir}assets" ] && cp -r "${dir}assets/"* "dist/${name}/assets/"
done

echo "Build complete: dist/"
