import re
import json
import os

def generate_exact_map():
    md_path = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\Product_prompt_to_gen.md"
    output_path = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\scratch\id_to_slugs.json"
    
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all table rows like: | `slug1`, `slug2` | description | prompt |
    # We extract the first column (slugs)
    rows = re.findall(r"\| (.*?) \| (.*?) \| (.*?) \|", content)
    
    # Clean rows (remove header and separator rows)
    valid_rows = []
    for r in rows:
        if "`" in r[0]: # Only rows with code blocks (slugs)
            valid_rows.append(r[0])

    # Now we map FITAI_001 to valid_rows[0], FITAI_002 to valid_rows[1], etc.
    id_to_slugs = {}
    for i, raw_slugs in enumerate(valid_rows):
        fid = f"FITAI_{str(i+1).zfill(3)}"
        # Extract slugs from backticks: `slug1`, `slug2` -> ["slug1", "slug2"]
        slug_list = re.findall(r"`([^`]+)`", raw_slugs)
        id_to_slugs[fid] = slug_list

    # Save to JSON
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(id_to_slugs, f, indent=2, ensure_ascii=False)

    print(f"EXACT MAPPING COMPLETED.")
    print(f"Total Categories Mapped: {len(id_to_slugs)}")
    print(f"Total Slugs Mapped: {sum(len(v) for v in id_to_slugs.values())}")

if __name__ == "__main__":
    generate_exact_map()
