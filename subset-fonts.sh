#!/usr/bin/env bash
set -euo pipefail

# Ensure you have glyphhanger and FontTools (pyftsubset) installed:
# npm install -g glyphhanger
# pip install fonttools brotli

# Define the character set you want to keep in your fonts
CHARSET="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

# Use process substitution to feed the 'find' results into a while-read loop.
while IFS= read -r ttf_file; do
  # Derive base name (e.g., "Commissioner" from "Commissioner.ttf")
  base_name=$(basename "$ttf_file" .ttf)
  dir_name=$(dirname "$ttf_file")

  echo "Subsetting: $ttf_file"

  # Run glyphhanger to create a .woff2 subset
  glyphhanger \
    --jsdom \
    --character-string="$CHARSET" \
    --subset="$ttf_file" \
    --formats=woff2

  # The subset file ends up as "<basename>-subset.woff2" in the script’s current directory
  subset_file="./${base_name}-subset.woff2"

  # If the subset file was created successfully, move it to the original directory
  if [ -f "$subset_file" ]; then
    mv "$subset_file" "${dir_name}/${base_name}.woff2"
  else
    echo "ERROR: Subset file not found for $ttf_file"
  fi

  # Remove the original TTF (comment out if you want to keep TTF files)
  rm "$ttf_file"

  echo "Converted $base_name.ttf to $base_name.woff2"
done < <(find ./public/fonts -type f -name '*.ttf')

echo "All TTF files have been subset and renamed to WOFF2."
