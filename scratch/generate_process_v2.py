import os
import re

# Paths
unique_products_file = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\unique_products.md"
src_dir = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\food_pictures"
output_script = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\scratch\process_images_v2.py"

# 1. Get all slugs
slugs = []
with open(unique_products_file, "r", encoding="utf-8") as f:
    for line in f:
        if "|" in line:
            parts = [p.strip() for p in line.split("|")]
            if len(parts) > 14:
                slug = parts[14]
                if slug and slug != "slug" and not slug.startswith("-"):
                    slugs.append(slug)

# 2. Get all available images (clean names)
images = []
for f in os.listdir(src_dir):
    if f.endswith(".jpeg"):
        clean = re.sub(r"_\d{12}(_\d+)?\.jpeg$", "", f)
        images.append((clean, f))

# 3. Define keywords for each image
image_keywords = {
    "Apples_and_quince_on_wood": ["olma", "behi", "apple", "quince"],
    "Asparagus_and_artichokes_arrange": ["artishok", "sparja", "artichoke", "asparagus"],
    "Assorted_onions_dark_background": ["piyoz", "onion", "sarimsoq", "garlic", "shallot"],
    "Assortment_of_gourmet_nuts": ["yong_oq", "yong_og", "nut", "bodom", "pista", "funduk", "keshyu", "arahis", "peanut", "walnut", "almond", "pistachio"],
    "Assortment_of_sausages_and_salamis": ["kolbasa", "sausage", "salam", "vetchina", "ham", "servelat", "sardelka", "sosiska"],
    "A_steaming_plate_of_traditional": ["palov", "plov", "osh"],
    "Baby_cereal_in_bowl": ["bolalar", "baby", "bo_tqa", "nan", "aralashma", "mix"],
    "Blocks_of_cheese_on_board": ["pishloq", "cheese", "brinza", "suluguni", "parmezan"],
    "Bowl_of_fresh_berries": ["qulupnay", "malina", "berry", "strawberry", "raspberry", "smorodina", "golubika"],
    "Bowl_of_sun-dried_apricots": ["turshak", "apricot", "mayiz", "raisin", "dried", "meva_qoqi"],
    "Bowl_of_thick_cream": ["smetana", "qaymoq", "cream", "tvorog", "cottage", "qurt"],
    "Bread_crumbs_in_bowl": ["suvarki", "crumb", "talqon"],
    "Chocolate_pieces_with_gold_foil": ["shokolad", "chocolate", "konfet", "candy"],
    "Citrus_fruits_whole_and_sliced": ["apelsin", "limon", "mandarin", "citrus", "orange", "lemon", "greypfrut", "laym", "pomelo"],
    "Coconut_and_chestnut_flour_jars": ["un", "flour", "kraxmal", "starch"],
    "Coconut_oil_in_jar": ["yog_i", "oil", "kokos", "coconut", "zaytun", "olive", "paxta", "cotton"],
    "Cold_glass_mineral_water_ice": ["suv", "water", "mineral"],
    "Cold_soda_with_ice": ["kola", "soda", "gazli", "drink", "mohito"],
    "Compressed_seasoning_cubes": ["bulyon", "kubik", "cube", "bouillon"],
    "Fine_white_sea_salt_bowl": ["tuz", "salt"],
    "Fresh_farm_eggs_on_straw": ["tuxum", "egg", "omlet"],
    "Fresh_green_and_purple_grapes": ["uzum", "grape", "kishmish"],
    "Fresh_green_cucumbers_on_slate": ["bodring", "cucumber"],
    "Fresh_honey_in_glass_jar": ["asal", "honey", "novvot"],
    "Freshly_baked_Uzbek_fried_savory": ["somsa", "belyash", "cheburek", "gumma", "pirojki", "bovursoq"],
    "Fresh_raw_lamb_cuts_on_wood": ["qo_y", "lamb", "mutton", "qoy"],
    "Fresh_red_tuna_steaks_on_plate": ["tunets", "tuna"],
    "Fresh_salmon_trout_fillets": ["losos", "salmon", "forel", "trout"],
    "Green_beans_and_peas_on_slate": ["no_xat", "pea", "loviya", "bean"],
    "Herbs_on_wooden_table": ["ko_kat", "herb", "shivit", "petrushka", "kashnich", "yalpiz", "basil", "dill", "parsley"],
    "Juicy_oranges": ["apelsin", "orange"],
    "Kefir_in_ceramic_cup": ["kefir", "qatiq", "ayron"],
    "Kvas_and_grain_drinks": ["kvas", "boza"],
    "Large_gourmet_burger_sandwich": ["burger", "sendvich", "sandwich"],
    "Layered_chocolate_cake_on_plate": ["tort", "cake", "shirinlik", "dessert", "pastry", "shtrudel"],
    "Lean_rabbit_meat_rustic_table": ["quyon", "rabbit"],
    "Mayonnaise_bechamel_in_bowl": ["mayonez", "mayonnaise", "sous", "sauce", "bechamel"],
    "Meat_jelly_in_glass_dish": ["xolodes", "jelly"],
    "Milk_pouring_from_spoon": ["sut", "milk"],
    "Orange_puree_in_glass_jar": ["pyure", "puree", "mango"],
    "Pesto_and_guacamole_bowl": ["pesto", "guakamole"],
    "Pile_of_flour_and_biscuits": ["pechenye", "biskvit", "biscuit", "cookie"],
    "Pizza_slice_with_stretching_cheese": ["pitsa", "pizza"],
    "Pomegranate_with_seeds": ["anor", "pomegranate"],
    "Pork_cuts_bacon_sausages": ["cho_chqa", "pork", "bacon"],
    "Professional_food_photography_of_an": ["ziravor", "spice", "murch", "pepper", "qalampir", "dolchin", "zira", "kurkuma", "berbere", "kolombo"],
    "Professional_food_photography_of_a": ["kofe", "coffee", "choy", "tea"],
    "Professional_food_photography_of_fresh": ["sabzavot", "vegetable", "salat", "salad", "brokoli", "uzum"],
    "Protein_bar_showing_texture": ["batonchik", "bar", "protein_bar"],
    "Protein_shake_in_shaker": ["protein", "shake", "kokteyl"],
    "Qazi_horse_meat_sausage_Hasip": ["qazi", "hasip", "ot_go_shti", "horse"],
    "Raw_beef_steak_on_board": ["mol_go_shti", "beef", "steak", "fars"],
    "Raw_buckwheat_oats_bulgur_couscous": ["grechka", "buckwheat", "suli", "oats", "bulgur", "kuskus", "yorma", "cereal"],
    "Raw_chicken_breasts": ["tovuq", "chicken", "tovuq_go_shti"],
    "Raw_liver_tongue_kidneys": ["jigar", "liver", "til", "tongue", "buyrak", "kidney"],
    "Raw_potatoes_in_burlap_sack": ["kartoshka", "potato"],
    "Raw_squid_rings_dark_background": ["kalmar", "squid"],
    "Raw_turkey_breast_fillet": ["kurka", "turkey"],
    "Red_tuna_steaks_on_plate": ["tunets", "tuna"],
    "Refreshing_white_savory_yogurt": ["yogurt", "sutli"],
    "Rendered_fats_and_traditional_Dumba": ["dumba", "yog_i", "fat"],
    "Ripe_figs": ["anjir", "fig", "xurmo", "persimmon"],
    "Ripe_pears_green_yellow": ["nok", "pear"],
    "Ripe_pomegranate_with_seeds": ["anor", "pomegranate"],
    "Ripe_red_tomatoes_on_vine": ["pomidor", "tomato"],
    "Ripe_yellow_bananas_isolated": ["banan", "banana"],
    "Root_vegetables_with_greens": ["sabzi", "carrot", "lavlagi", "beet", "turp", "radish"],
    "Salads_with_vegetables_and_protein": ["salat", "salad"],
    "Seafood_products_on_ice": ["baliq", "fish", "dengiz", "seafood"],
    "Seeds_in_glass_jars": ["urug", "seed"],
    "Shrimp_raw_or_grilled": ["krevetka", "shrimp"],
    "Sliced_ham_and_roasted_meat": ["go_sht", "meat"],
    "Small_silver_fish_on_plate": ["shprot", "seld"],
    "Smoked_fish_fillet_wooden_board": ["baliq", "fish"],
    "Smoothie_in_glass_jar_ingredients": ["sharbat", "juice", "smuzi", "smoothie"],
    "Soup_with_meat_and_vegetables": ["shorva", "sho_rva", "soup"],
    "Spaghetti_Bolognese_with_basil": ["makaron", "pasta", "spagetti", "vermishel"],
    "Steamed_dumplings_served_on_plate": ["manti", "xonim", "chuchvara", "dumpling"],
    "Sugar_crystals_spilling_dark_sur": ["shakar", "sugar"],
    "Tomato_sauce_or_adjika_bowl": ["ketchup", "adjika", "tomat"],
    "Uzbek_bread_varieties_Patir_Obi": ["non", "patir", "bread"],
    "Uzbek_cooked_dishes_steaming": ["dimlama", "qovurdoq"],
    "Uzbek_Kazan-Kabob_meat_potatoes": ["kabob", "shashlik"],
    "Uzbek_Lagman_noodles_meat_sauce": ["lagmon", "lag_mon"],
    "Uzbek_Norin_with_horse_meat": ["norin"],
    "Uzbek_pastries_fried_baked_savory": ["somsa"],
    "Various_baked_and_mashed_potato": ["pishirilgan_kartoshka", "mash"],
    "Watermelon_and_melon_slice": ["tarvuz", "qovun", "watermelon", "melon"],
    "White_and_Devzira_rice_grains": ["guruch", "rice", "sholi"],
    "White_fish_fillets_with_peppercorns": ["oq_baliq"],
    "White_powder_in_tubs": ["protein"],
    "Wines_beers_spirits_photography": ["alkogol", "alcohol", "vino", "pivo", "wine", "beer", "samogon"],
    "Yellow_and_green_condiments_dish": ["gorchitsa", "mustard"],
    "Yellow_butter_on_ceramic_dish": ["sariyog", "butter"],
}

# 4. Map slugs to images
mapping = {}
for slug in slugs:
    found = False
    for img_clean, keywords in image_keywords.items():
        for kw in keywords:
            if kw in slug.lower():
                if img_clean not in mapping:
                    mapping[img_clean] = []
                mapping[img_clean].append(slug)
                found = True
                break
        if found: break
    
    if not found:
        # Generic fallback
        if "go_sht" in slug or "gosht" in slug:
            mapping.setdefault("Sliced_ham_and_roasted_meat", []).append(slug)
        elif "baliq" in slug:
            mapping.setdefault("Seafood_products_on_ice", []).append(slug)
        elif "meva" in slug:
            mapping.setdefault("Professional_food_photography_of_fresh", []).append(slug)
        elif "sabzavot" in slug:
            mapping.setdefault("Professional_food_photography_of_fresh", []).append(slug)
        else:
            # Last resort
            mapping.setdefault("Uzbek_cooked_dishes_steaming", []).append(slug)

# 5. Write the script
script_content = f"""
import os
import shutil

src_dir = r"{src_dir}"
dest_dir = r"c:\\Users\\admin\\OneDrive\\Рабочий стол\\NewProg\\FitAI\\public\\foods"

# Ensure destination exists
if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

mapping = {mapping}

# Reverse mapping to find files
files = os.listdir(src_dir)
file_map = {{}}
for f in files:
    if f.endswith(".jpeg"):
        clean = f.split("_202605")[0]
        file_map[clean] = f

count = 0
for img_name, slugs in mapping.items():
    if img_name in file_map:
        src_path = os.path.join(src_dir, file_map[img_name])
        for slug in slugs:
            dest_path = os.path.join(dest_dir, f"{{slug}}.png")
            shutil.copy2(src_path, dest_path)
            count += 1
    else:
        print(f"Warning: {{img_name}} not found in file_map")

print(f"Processed {{count}} images.")
"""

with open(output_script, "w", encoding="utf-8") as f:
    f.write(script_content)

print(f"Generated {output_script}")
