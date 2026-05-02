#!/bin/bash
# Inject progress bar CSS into built HTML files
# Usage: ./scripts/inject-progress.sh <html-file>

PROGRESS_CSS='<style>body[data-bespoke-view=""] .bespoke-progress-parent{position:fixed!important;left:0!important;right:0!important;bottom:0!important;top:auto!important;height:3px!important;width:100%!important;background:#f2f0ea!important;z-index:2147483647!important}body[data-bespoke-view=""] .bespoke-progress-parent+:where(.bespoke-marp-parent){top:0!important}body[data-bespoke-view=""] .bespoke-progress-parent .bespoke-progress-bar{background:#86c0c3!important;transition:flex-basis 600ms cubic-bezier(.2,.7,.2,1)!important}</style>'

for f in "$@"; do
  if [ -f "$f" ]; then
    sed -i'' -e "s|</head>|${PROGRESS_CSS}</head>|" "$f"
    echo "Injected progress bar: $f"
  fi
done
