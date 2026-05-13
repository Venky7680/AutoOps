import os
from PIL import Image

output_dir = '/Users/juvaryamoct/Rundeck-UI/frontend/src/assets/logos'
os.makedirs(output_dir, exist_ok=True)

media_dir = '/Users/juvaryamoct/.gemini/antigravity/brain/5fbfec41-5edf-4517-ba61-4513e5b9fba7'

files = [
    ('media__1778649759569.jpg', 'runbooks'),
    ('media__1778649768209.jpg', 'access'),
    ('media__1778649774308.jpg', 'audit'),
    ('media__1778649780161.png', 'discovery')
]

for filename, base_name in files:
    path = os.path.join(media_dir, filename)
    if os.path.exists(path):
        img = Image.open(path)
        # Images are 1024x1024
        # Dark is left half (0-512), Light is right half (512-1024)
        # Center of Dark is (256, 512). Center of Light is (768, 512).
        # We crop a 400x400 square around the centers to avoid the middle boundary completely.
        
        dark_crop = img.crop((56, 312, 456, 712))
        light_crop = img.crop((568, 312, 968, 712))
        
        dark_crop.save(os.path.join(output_dir, f'{base_name}_dark.png'))
        light_crop.save(os.path.join(output_dir, f'{base_name}_light.png'))
        print(f"Processed {base_name}")
    else:
        print(f"File not found: {path}")
