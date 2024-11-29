#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Initialize username and password variables
USERNAME=""
PASSWORD=""

# Parse command line arguments
while getopts "u:p:" opt; do
  case $opt in
    u) USERNAME="$OPTARG";;
    p) PASSWORD="$OPTARG";;
    ?)
      echo "Usage: $0 -u <username> -p <password>"
      exit 1
      ;;
  esac
done

# Check if username and password are provided
if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ]; then
    echo "Usage: $0 -u <username> -p <password>"
    exit 1
fi

# Use parallel arrays instead of associative arrays
COMMANDS=(wget unzip rsync ffmpeg magick optipng depotdownloader)
PACKAGES=(wget unzip rsync ffmpeg imagemagick optipng depotdownloader)
TAPS=("" "" "" "" "" "" "steamre/tools")

# Detect package manager
BREW_EXISTS=$(command_exists "brew")

# If brew is not installed, then exit the script
if ! $BREW_EXISTS; then
    echo "Brew is not installed. Please install it manually."
    exit 1
fi

# Check and install missing commands
for i in "${!COMMANDS[@]}"; do
    cmd="${COMMANDS[$i]}"
    if ! command_exists "$cmd"; then
        echo "$cmd is not installed. Installing..."

        if [ -n "${TAPS[$i]}" ]; then
            brew tap "${TAPS[$i]}"
        fi
        brew install "${PACKAGES[$i]}"
    else
        echo "$cmd is already installed"
    fi
done

echo "All required commands are installed!"

mkdir -p import/run
cd import/run

if [ ! -f Decompiler ]; then
    wget https://github.com/ValveResourceFormat/ValveResourceFormat/releases/download/10.2/Decompiler-linux-x64.zip -O Decompiler-linux-x64.zip
    unzip -o Decompiler-linux-x64.zip && rm Decompiler-linux-x64.zip
fi

depotdownloader -app 1422450 -username "$USERNAME" -password "$PASSWORD" || exit 1

mkdir -p depots/game
rsync -av depots/*/*/game/* depots/game/
find depots/ -type d -empty -delete

# Extract Map-VPKs
citadel_folder="depots/game/citadel"

./Decompiler -i "$citadel_folder"/pak01_dir.vpk -d --threads 8 -o "$citadel_folder" -f scripts
./Decompiler -i "$citadel_folder"/pak01_dir.vpk -d --threads 8 -o "$citadel_folder" -f resource
./Decompiler -i "$citadel_folder"/pak01_dir.vpk -d --threads 8 -o "$citadel_folder" -f panorama

# # Extract Steam Info
# mkdir -p res
# cp "$citadel_folder"/steam.inf res/

# Extract vData files and zip
mkdir -p vdata
cp "$citadel_folder"/scripts/abilities.vdata vdata/
cp "$citadel_folder"/scripts/heroes.vdata vdata/
cp "$citadel_folder"/scripts/generic_data.vdata vdata/
zip vdata.zip vdata/*

# Extract localization files
mkdir -p localization
cp -r "$citadel_folder"/resource/localization/citadel_gc/* localization/
cp -r "$citadel_folder"/resource/localization/citadel_heroes/* localization/
cp -r "$citadel_folder"/resource/localization/citadel_main/* localization/
zip localization.zip localization/*

# # Extract icon files
# mkdir -p svgs
# find depots/game/ -type f -name '*.svg' -print0 | xargs -0 -n 1 cp -t svgs/

# # Extract video files
# mkdir -p videos
# cp -r "$citadel_folder"/panorama/videos/hero_abilities videos/
# find videos -type f -name "*.webm" -print0 | \
#     xargs -P 8 -0 -I {} sh -c '
#         video_file="{}"
#         video_mp4_file=$(echo "$video_file" | sed "s/.webm/_h264.mp4/")
#         echo "Converting $video_file to $video_mp4_file"
#         ffmpeg -i "$video_file" -c:v libx264 -crf 23 -y "$video_mp4_file"
#     '

# # Extract css files
# cp "$citadel_folder"/panorama/styles/objectives_map.css res/
# cp "$citadel_folder"/panorama/styles/citadel_shared_colors.css res/

# # Extract image files
# mkdir -p images
# mkdir -p images/hud
# cp -r "$citadel_folder"/panorama/images/heroes images/
# cp -r "$citadel_folder"/panorama/images/hud/*.png images/hud/
# cp "$citadel_folder"/panorama/images/hud/hero_portraits/* images/heroes/
# cp "$citadel_folder"/panorama/images/*.* images/
# cp -r "$citadel_folder"/panorama/images/hud/hero_portraits images/hud/

# mkdir -p images/abilities
# cp -r "$citadel_folder"/panorama/images/hud/abilities images/
# cp -r "$citadel_folder"/panorama/images/upgrades images/

# mkdir -p images/maps
# cp -r "$citadel_folder"/panorama/images/minimap/base/* images/maps/

# mkdir -p images/ranks
# cp -r "$citadel_folder"/panorama/images/ranked/badges/* images/ranks/

# # Generate webp images
# for file in $(find images -type f -name "*.png"); do
#     base_name=$(basename "$file")
#     dir_name=$(dirname "$file")
#     file_name="${base_name%.png}"
#     new_file_name="${file_name}.webp"
#     new_file_path="$dir_name/$new_file_name"
#     magick -quality 50 -define webp:lossless=true "$file" "$new_file_path"
#     echo "Converted to webp: $new_file_path"
# done

# # Optimize images
# optipng -o2 images/**/*.png