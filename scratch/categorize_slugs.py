import re

# Read unique_products.md
with open(r'c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\unique_products.md', 'r', encoding='utf-8') as f:
    unique_content = f.read()

# Extract all data rows
lines = unique_content.split('\n')
data_rows = []
for line in lines:
    if '|' in line:
        parts = [p.strip() for p in line.split('|')]
        if len(parts) >= 15:
            # | Name | Category | ... | slug |
            name = parts[1]
            category = parts[2]
            slug = parts[-2] # slug is second to last because of trailing |
            if slug != 'slug' and slug != ':---' and slug != '':
                data_rows.append({'name': name, 'category': category, 'slug': slug})

# Read Product_prompt_to_gen.md to find which slugs already have prompts
with open(r'c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\Product_prompt_to_gen.md', 'r', encoding='utf-8') as f:
    prompt_content = f.read()

existing_slugs = set(re.findall(r'`([^`]+)`', prompt_content))

# Filter data_rows to only include missing slugs
missing_data_rows = [row for row in data_rows if row['slug'] not in existing_slugs]

# Define categorization rules (mapping category or keywords in name/slug to sections)
sections = {
    "1. National Dishes (Uzbek Cuisine)": [],
    "2. Dairy & Eggs": [],
    "3. Fruits & Berries": [],
    "4. Vegetables & Greens": [],
    "5. Meat & Poultry": [],
    "6. Fish & Seafood": [],
    "7. Grains, Legumes & Bakery": [],
    "8. Sweets & Snacks": [],
    "9. Beverages": [],
    "10. Supplements & Sport": [],
    "11. Oils & Fats": [],
    "12. Sauces, Spices & Seasonings": [],
    "13. Fast Food & Prepared Meals": [],
    "14. Baby Food": []
}

# ... existing categorization logic but using missing_data_rows ...
for row in missing_data_rows:
    slug = row['slug']
    name = row['name'].lower()
    cat = row['category'].lower()
    
    # Simple rule-based categorization
    if 'bolalar' in slug or 'bolalar' in name:
        sections["14. Baby Food"].append(slug)
    elif any(x in cat for x in ['ichimlik', 'sharbati', 'kofe', 'choy', 'suv', 'pivo', 'vino', 'aroq']):
        sections["9. Beverages"].append(slug)
    elif any(x in cat for x in ['sut', 'tuxum', 'pishloq', 'tvorog', 'kefir', 'smetana', 'yogurt', 'qatiq', 'dairy']):
        sections["2. Dairy & Eggs"].append(slug)
    elif any(x in cat for x in ['meva', 'rezavor', 'fruits']):
        sections["3. Fruits & Berries"].append(slug)
    elif any(x in cat for x in ['sabzavot', 'ko\'kat', 'vegetables']):
        sections["4. Vegetables & Greens"].append(slug)
    elif any(x in cat for x in ['go\'sht', 'parranda', 'meat', 'subprodukt']):
        sections["5. Meat & Poultry"].append(slug)
    elif any(x in cat for x in ['baliq', 'dengiz', 'fish']):
        sections["6. Fish & Seafood"].append(slug)
    elif any(x in cat for x in ['don', 'dukkakli', 'un ', 'non', 'pishiriq', 'bakery', 'grains', 'bo\'tqa']):
        sections["7. Grains, Legumes & Bakery"].append(slug)
    elif any(x in cat for x in ['shirinlik', 'desert', 'konfet', 'shokolad', 'holva', 'sweets']):
        sections["8. Sweets & Snacks"].append(slug)
    elif any(x in cat for x in ['yog\'', 'fats']):
        sections["11. Oils & Fats"].append(slug)
    elif any(x in cat for x in ['ziravor', 'sous', 'spices', 'seasoning']):
        sections["12. Sauces, Spices & Seasonings"].append(slug)
    elif any(x in cat for x in ['fastfood', 'burger', 'pitsa', 'shashlik', 'kabob', 'taomlar', 'national', 'recipe', 'main']):
        # Split between National Dishes and Fast Food
        if any(y in name for y in ['osh', 'palov', 'manti', 'somsa', 'shurva', 'mastava', 'lag\'mon', 'kabob', 'shashlik', 'barak']):
            sections["1. National Dishes (Uzbek Cuisine)"].append(slug)
        else:
            sections["13. Fast Food & Prepared Meals"].append(slug)
    elif any(x in cat for x in ['sport', 'supplements']):
        sections["10. Supplements & Sport"].append(slug)
    else:
        # Default to Fast Food/Prepared Meals if it looks like a dish, else try to guess
        if any(y in name for y in ['shorva', 'manti', 'palov', 'kabob', 'qovurdoq']):
            sections["1. National Dishes (Uzbek Cuisine)"].append(slug)
        else:
            sections["13. Fast Food & Prepared Meals"].append(slug)

with open(r'c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\scratch\categorized_missing_slugs.md', 'w', encoding='utf-8') as f:
    for section, slugs in sections.items():
        if slugs:
            f.write(f"## {section} ({len(slugs)} slugs)\n")
            for s in sorted(slugs):
                f.write(f"- `{s}`\n")
            f.write("\n")

print("Missing slugs categorized and saved to scratch/categorized_missing_slugs.md")

