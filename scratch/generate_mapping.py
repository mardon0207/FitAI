import os
import re

prompt_file = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\Product_prompt_to_gen.md"
src_dir = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\food_pictures"

with open(prompt_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

mapping = {}
for line in lines:
    if "|" in line and "`" in line:
        parts = line.split("|")
        if len(parts) >= 3:
            # Extract slugs
            slug_part = parts[1]
            slugs = re.findall(r"`([^`]+)`", slug_part)
            
            # Extract image description to get the filename base
            desc_part = parts[2].strip()
            if ":" in desc_part:
                # Get part after colon, remove bolding, replace spaces with underscores
                base = desc_part.split(":", 1)[1].strip()
                base = base.replace("**", "").replace(".", "").strip()
                base = base.replace(" ", "_").replace(",", "").replace("/", "_")
                # Filenames seem to be truncated or slightly different sometimes
                # We'll take the first 30 chars or so
                base_key = base[:30]
                if base_key not in mapping:
                    mapping[base_key] = []
                mapping[base_key].extend(slugs)

# Now we have the mapping, let's refine it by matching against actual files
actual_files = os.listdir(src_dir)
final_mapping = {}

for base_key, slugs in mapping.items():
    # Find a file that starts with this base_key
    found = False
    for filename in actual_files:
        if filename.startswith(base_key):
            if filename not in final_mapping:
                final_mapping[filename] = []
            final_mapping[filename].extend(slugs)
            found = True
            break
    if not found:
        # Try a more fuzzy match
        for filename in actual_files:
            if base_key.lower() in filename.lower():
                if filename not in final_mapping:
                    final_mapping[filename] = []
                final_mapping[filename].extend(slugs)
                found = True
                break
        if not found:
            print(f"Warning: No file found for {base_key}")

# Print the generated mapping to be used in process_images.py
print("Generated Mapping:")
for filename, slugs in final_mapping.items():
    # Clean filename for the key
    clean_key = re.sub(r"_\d{12}(_\d+)?\.jpeg$", "", filename)
    print(f'    "{clean_key}": {list(set(slugs))},')
