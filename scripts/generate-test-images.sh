#!/bin/bash

# Create memories directory if it doesn't exist
mkdir -p public/game/memories

# Generate test images using ImageMagick
for name in pushkin esenin akhmatova vysotsky tsvetaeva brodsky tolstoy chekhov; do
  convert -size 400x300 xc:skyblue -gravity center -pointsize 30 \
    -draw "text 0,0 '$name'" \
    "public/game/memories/$name.jpg"
done

# Generate a test video
ffmpeg -f lavfi -i testsrc=duration=5:size=400x300:rate=30 \
  public/game/memories/celebration.mp4 