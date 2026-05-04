import os

unique_products_path = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\unique_products.md"
foods_dir = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\public\foods"

with open(unique_products_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

slugs = []
for line in lines:
    if "|" in line and "slug" not in line.lower() and "---" not in line:
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 15: # | at start and end makes it 16 parts if there are 14 columns
            slug = parts[14].strip()
            if slug and slug != "Slug":
                slugs.append(slug)

missing = []
for slug in slugs:
    if not os.path.exists(os.path.join(foods_dir, f"{slug}.png")):
        missing.append(slug)

print(f"Total slugs: {len(slugs)}")
print(f"Missing images: {len(missing)}")
if missing:
    print("Top 10 missing:")
    for m in missing[:10]:
        print(f" - {m}")
else:
    print("All slugs have images!")
