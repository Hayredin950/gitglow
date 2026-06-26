#!/usr/bin/env bash

# Set Bio & Identity for Dagmawi Birhanu
echo "Updating GitHub Bio & Profile details for Dagmawi-BG..."

gh api user -X PATCH \
  -F name="Dagmawi Birhanu" \
  -F bio="Systems & Backend Engineer | CS Student | Building high-performance cache stores and computational linguistic tools 🚀" \
  -F location="Addis Ababa, Ethiopia" \
  -F hireable=true

echo "Done!"
