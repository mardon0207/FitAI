import re

# Read unique_products.md
with open(r'c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\unique_products.md', 'r', encoding='utf-8') as f:
    unique_content = f.read()

# Read Product_prompt_to_gen.md
with open(r'c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\Product_prompt_to_gen.md', 'r', encoding='utf-8') as f:
    prompt_content = f.read()

# Extract slugs from unique_products.md
# Format is: | Name | Category | ... | slug |
# The slug is in the last column before the trailing |
unique_slugs = set(re.findall(r'\|\s*([^|]+?)\s*\|\s*$', unique_content, re.MULTILINE))
unique_slugs = {s.strip() for s in unique_slugs if s.strip() and s.strip() != 'slug'}

# Extract slugs from Product_prompt_to_gen.md
# Slugs are inside backticks: `slug`
prompt_slugs = set(re.findall(r'`([^`]+)`', prompt_content))

missing_slugs = unique_slugs - prompt_slugs

print(f"Total unique slugs: {len(unique_slugs)}")
print(f"Slugs in prompt file: {len(prompt_slugs)}")
print(f"Missing slugs count: {len(missing_slugs)}")
print("\nMissing slugs (first 100):")
print(sorted(list(missing_slugs))[:100])

# Group missing slugs by their row data to help categorize them
missing_data = []
lines = unique_content.split('\n')
for slug in sorted(list(missing_slugs)):
    for line in lines:
        if f"| {slug} |" in line or f"| {slug}|" in line or f"|{slug} |" in line or f"|{slug}|" in line:
            # This is tricky because slug is at the end. 
            # Let's check the end of the line
            if line.strip().endswith(f"| {slug} |") or line.strip().endswith(f"| {slug}|") or line.strip().endswith(f"|{slug} |") or line.strip().endswith(f"|{slug}|"):
                parts = [p.strip() for p in line.split('|')]
                if len(parts) > 3:
                    name = parts[1]
                    cat = parts[2]
                    missing_data.append((slug, name, cat))
                break

print("\nMissing slugs with details (first 50):")
for s, n, c in missing_data[:50]:
    print(f"{s} | {n} | {c}")
