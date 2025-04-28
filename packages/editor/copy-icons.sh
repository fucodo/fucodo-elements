#!/usr/bin/env bash

grep -o 'src="[^"]\+\.svg"' "index.js" | sed 's/src="//; s/"$//' | while read -r filename; do
  cp "node_modules/bootstrap-icons/icons/$filename" "static"
done
