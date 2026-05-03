#!/usr/bin/env python3
"""
Generate Android launcher icons from base icon.
Run: python3 scripts/generate-android-icons.py
"""
from PIL import Image, ImageDraw

def create_icon(size):
    img = Image.new('RGB', (size, size), '#2196F3')
    draw = ImageDraw.Draw(img)
    cx = size // 2

    house_left = int(size * 0.18)
    house_right = int(size * 0.82)
    house_top = int(size * 0.32)
    house_bottom = int(size * 0.88)

    draw.polygon([(cx, int(size*0.12)), (house_right, house_top), (house_left, house_top)], fill='white')
    draw.rectangle([house_left, house_top, house_right, house_bottom], fill='white')

    r = int(size * 0.16)
    cy = int(size * 0.52)
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill='#FFC107')

    text = '$'
    try:
        fs = max(8, int(size * 0.22))
        try:
            font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', fs)
        except:
            font = ImageFont.load_default()
        draw.text((cx - fs//4, cy - fs//3), text, fill='#1565C0', font=font)
    except:
        pass

    return img

# Android mipmap sizes
sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
}

base_dir = '/Volumes/luis_externo/proyectos/homepayfinal/homepay'

for folder, size in sizes.items():
    img = create_icon(size)
    path = f'{base_dir}/android_icons/{folder}'
    import os
    os.makedirs(path, exist_ok=True)
    img.save(f'{path}/ic_launcher.png', 'PNG')
    print(f'Created {path}/ic_launcher.png ({size}x{size})')

# Also create a 512px version for Play Store
img_512 = create_icon(512)
import os
os.makedirs(f'{base_dir}/android_icons', exist_ok=True)
img_512.save(f'{base_dir}/android_icons/ic_launcher-512.png', 'PNG')
print(f'Created {base_dir}/android_icons/ic_launcher-512.png (512x512)')

print('\nDone! Copy android_icons/ to android/app/src/main/res/')
print('Run: cp -r android_icons/* android/project/path/src/main/res/')