import os
import json
import shutil
import re

# Paths
INPUT_DIR = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\food_generated"
OUTPUT_DIR = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\public\foods"
MAP_FILE = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\scratch\id_to_slugs.json"

def process_images():
    if not os.path.exists(INPUT_DIR):
        print(f"Error: Input directory {INPUT_DIR} does not exist. Please create it and put your generated images there.")
        return

    if not os.path.exists(MAP_FILE):
        print(f"Error: Mapping file {MAP_FILE} not found.")
        return

    with open(MAP_FILE, "r", encoding="utf-8") as f:
        id_map = json.load(f)

    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    files = os.listdir(INPUT_DIR)
    processed_ids = set()
    copy_count = 0

    for filename in files:
        # Search for FITAI_XXX pattern in filename
        match = re.search(r"FITAI_(\d{3})", filename)
        if match:
            uid = f"FITAI_{match.group(1)}"
            if uid in id_map:
                src_path = os.path.join(INPUT_DIR, filename)
                slugs = id_map[uid]
                
                for slug in slugs:
                    dest_path = os.path.join(OUTPUT_DIR, f"{slug}.png")
                    shutil.copy2(src_path, dest_path)
                    copy_count += 1
                
                processed_ids.add(uid)
                print(f"Matched {uid}: Copied to {len(slugs)} slugs.")
            else:
                print(f"Warning: Found ID {uid} in filename {filename}, but it's not in the mapping.")
        else:
            # Optional: handle files without IDs if needed
            pass

    print(f"\nSummary:")
    print(f"Unique IDs processed: {len(processed_ids)} / {len(id_map)}")
    print(f"Total files created in public/foods: {copy_count}")
    
    missing_ids = [uid for uid in id_map if uid not in processed_ids]
    if missing_ids:
        print(f"Missing IDs (not found in input folder): {len(missing_ids)}")
        # print(f"First 10 missing: {missing_ids[:10]}")

if __name__ == "__main__":
    process_images()
