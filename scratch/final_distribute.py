import os
import json
import shutil

src = r'c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\gen_pic_foods'
dst = r'c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\public\foods'
map_path = r'c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\scratch\id_to_slugs.json'

if not os.path.exists(dst):
    os.makedirs(dst)

try:
    with open(map_path, 'r', encoding='utf-8') as f:
        id_map = json.load(f)

    available_files = {f.split('.')[0]: f for f in os.listdir(src) if f.startswith('FITAI_')}

    count = 0
    errors = 0
    for fid, slugs in id_map.items():
        if fid in available_files:
            src_file = os.path.join(src, available_files[fid])
            for slug in slugs:
                # Sanitize slug just in case
                safe_slug = "".join([c for c in slug if c not in '<>:"/\\|?*']).strip()
                if not safe_slug: continue
                
                target_name = f"{safe_slug}{os.path.splitext(src_file)[1]}"
                target_path = os.path.join(dst, target_name)
                
                try:
                    shutil.copy2(src_file, target_path)
                    count += 1
                except Exception as e:
                    print(f"Error copying to {target_name}: {e}")
                    errors += 1

    print(f"DONE! Distributed {count} images. Errors: {errors}")
except Exception as e:
    print(f"Global error: {e}")
