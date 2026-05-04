import os
import json
import shutil

# Paths
GEN_SRC = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\gen_pic_foods"
DEST_DIR = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\public\foods"
SLUGS_FILE = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\scratch\valid_slugs.txt"

def run_strict_mapping():
    # 1. Load all slugs from master list
    with open(SLUGS_FILE, "r", encoding="utf-8") as f:
        all_slugs = [line.strip() for line in f if line.strip()]

    # 2. Strict Keyword Groups
    # Key = FITAI_ID, Value = list of triggers
    # If ANY trigger is in the slug, it gets this ID.
    mapping_rules = {
        "FITAI_001": ["palov", "osh", "plov"],
        "FITAI_002": ["manti"],
        "FITAI_003": ["somsa", "samsa"],
        "FITAI_004": ["shurva", "shoʻrva", "shorva"],
        "FITAI_005": ["dimlama"],
        "FITAI_006": ["norin"],
        "FITAI_007": ["lagmon", "lagman"],
        "FITAI_008": ["qozon", "kazan"],
        "FITAI_009": ["shashlik", "kabob"],
        "FITAI_011": ["sut", "milk"],
        "FITAI_012": ["qatiq", "kefir", "ayron", "ayran", "biolakt"],
        "FITAI_014": ["tvorog", "curd"],
        "FITAI_015": ["pishlo", "cheese"],
        "FITAI_018": ["tuxum", "egg"],
        "FITAI_021": ["olma", "apple"],
        "FITAI_022": ["banan", "banana"],
        "FITAI_023": ["limon", "apelsin", "mandarin", "citrus", "orange", "lemon"],
        "FITAI_024": ["anor", "pomegranate"],
        "FITAI_025": ["nok", "pear"],
        "FITAI_026": ["shaftoli", "peach"],
        "FITAI_027": ["uzum", "grape"],
        "FITAI_028": ["tarvuz", "qovun", "melon", "watermelon"],
        "FITAI_029": ["qulupnay", "malina", "smorodina", "gilos", "olcha", "berry", "yagoda", "meva"],
        "FITAI_033": ["pomidor", "tomato"],
        "FITAI_034": ["bodring", "cucumber"],
        "FITAI_036": ["kartoshka", "potato"],
        "FITAI_037": ["sabzi", "carrot"],
        "FITAI_038": ["piyoz", "onion", "sarimsoq", "garlic"],
        "FITAI_039": ["karam", "broccoli", "cabbage"],
        "FITAI_040": ["baqlajon", "kabachok", "eggplant", "zucchini"],
        "FITAI_041": ["koʻkat", "shivit", "kashnich", "herb", "salat"],
        "FITAI_042": ["qoʻziqorin", "mushroom"],
        "FITAI_050": ["mol go", "beef", "steak", "buzoq"],
        "FITAI_051": ["qoʻy", "qoy", "lamb", "mutton"],
        "FITAI_052": ["tovuq", "chicken", "gril", "kurka", "bedana"],
        "FITAI_056": ["qazi", "horse", "hasip"],
        "FITAI_071": ["baliq", "fish", "salmon", "tuna", "forel", "osetr", "anchous"],
        "FITAI_075": ["guruch", "rice"],
        "FITAI_076": ["grechka", "bulgur"],
        "FITAI_077": ["non", "bread", "patir"],
        "FITAI_078": ["bogirsoq", "bo'g'irsoq", "cheburek", "bovursoq"],
        "FITAI_081": ["makaron", "pasta", "spagetti"],
        "FITAI_082": ["talqon", "crumbs"],
        "FITAI_083": ["shokolad", "chocolate"],
        "FITAI_084": ["asal", "honey"],
        "FITAI_085": ["muzqaymoq", "ice cream"],
        "FITAI_086": ["tort", "cake", "pechenye", "biscuit", "biskvit"],
        "FITAI_087": ["choy", "tea"],
        "FITAI_088": ["kofe", "coffee", "qahva", "amerikano", "kapuchino", "latte"],
        "FITAI_089": ["suv", "water"],
        "FITAI_090": ["sharbat", "juice"],
        "FITAI_091": ["kola", "soda", "fanta", "sprite", "adrenaline"],
        "FITAI_100": ["bolalar", "pyure", "nan"],
        "FITAI_111": ["ziravor", "qalampir", "adjika", "anis", "murch", "spice"],
        "FITAI_112": ["yog'", "yogi", "oil", "margarin"],
        "FITAI_115": ["burger", "gamburger", "chizburger"],
        "FITAI_116": ["pitsa", "pizza"],
        "FITAI_120": ["sushi", "roll"],
        # Add more logic below as needed...
    }

    # Final Map: FITAI_XXX -> [slugs]
    id_to_slugs = {f"FITAI_{str(i).zfill(3)}": [] for i in range(1, 128)}
    unmapped = []

    for slug in all_slugs:
        slug_lower = slug.lower().replace("_", " ").replace("-", " ")
        found = False
        
        # Check rules
        for fid, keywords in mapping_rules.items():
            if any(kw in slug_lower for kw in keywords):
                id_to_slugs[fid].append(slug)
                found = True
                break
        
        if not found:
            unmapped.append(slug)

    # Save mapping for inspection
    with open(r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\scratch\id_to_slugs.json", "w", encoding="utf-8") as f:
        json.dump(id_to_slugs, f, indent=2, ensure_ascii=False)

    # Save unmapped for analysis
    with open(r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\scratch\unmapped_slugs.txt", "w", encoding="utf-8") as f:
        for s in unmapped:
            f.write(s + "\n")

    print(f"STRICT AUDIT DONE.")
    print(f"Total Products: {len(all_slugs)}")
    print(f"Strictly Mapped: {sum(len(v) for v in id_to_slugs.values())}")
    print(f"Unmapped (No fake images): {len(unmapped)}")
    
    return id_to_slugs

if __name__ == "__main__":
    run_strict_mapping()
