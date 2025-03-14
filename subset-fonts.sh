#!/usr/bin/env bash

# Ensure you have glyphhanger and FontTools (pyftsubset) installed:
# npm install -g glyphhanger
# pip install fonttools brotli

# Define the character set you want to keep in your fonts
CHARSET="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

for ttf_file in *.woff2; do
  # Skip if no TTF files are found
  [ -f "$ttf_file" ] || continue

  # Get the base name without extension
  base_name=$(basename "$ttf_file" .woff2)

  echo "Subsetting: $ttf_file"

  # Run glyphhanger to create WOFF and WOFF2 subsets
  glyphhanger \
    --character-string="$CHARSET" \
    --subset="$ttf_file" \
    --formats=woff2

  # Remove the original TTF file
  rm "$ttf_file"

  if [ -f "${base_name}-subset.woff2" ]; then
    mv "${base_name}-subset.woff2" "${base_name}.woff2"
  fi

  echo "Done with: $base_name"
done

echo "All TTFs have been subset and renamed."
