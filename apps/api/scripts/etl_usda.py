"""USDA FoodData Central ETL — download + ingest into local PostgreSQL.

Usage:
    # 1. Get an API key at https://fdc.nal.usda.gov/api-key-signup/
    # 2. Download "Foundation Foods" and "SR Legacy" CSV/JSON from
    #    https://fdc.nal.usda.gov/download-datasets/ into apps/api/data/raw/
    # 3. Run:
    python -m scripts.etl_usda --source foundation --file data/raw/foundation_food.csv

NOTE — this is a STUB. The real implementation should:
  * Parse `food.csv` + `food_nutrient.csv` + `nutrient.csv` from USDA dump.
  * Map USDA `nutrient_id` -> our internal nutrient keys (kcal=1008, protein=1003, fat=1004,
    carbs=1005, iron=1089, vit_c=1162, b12=1178, calcium=1087, ...).
  * Bulk insert using `copy_from` for speed (380k rows is fine on local Postgres).
  * Create aliases for English names (alias lang='en').

Reference IDs:
  1008 — Energy (KCAL)
  1003 — Protein
  1004 — Total lipid (fat)
  1005 — Carbohydrate, by difference
  1087 — Calcium, Ca
  1089 — Iron, Fe
  1090 — Magnesium, Mg
  1092 — Potassium, K
  1095 — Zinc, Zn
  1162 — Vitamin C
  1165 — Thiamin (B1)
  1166 — Riboflavin (B2)
  1167 — Niacin (B3)
  1175 — Vitamin B6
  1178 — Vitamin B12
  1106 — Vitamin A, RAE
  1114 — Vitamin D (D2 + D3)
  1109 — Vitamin E (alpha-tocopherol)
  1185 — Vitamin K
"""
from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

logger = logging.getLogger(__name__)


USDA_NUTRIENT_MAP: dict[int, tuple[str, str]] = {
    1008: ("kcal", "kcal"),
    1003: ("protein", "g"),
    1004: ("fat", "g"),
    1005: ("carbs", "g"),
    1079: ("fiber", "g"),
    1087: ("calcium", "mg"),
    1089: ("iron", "mg"),
    1090: ("magnesium", "mg"),
    1092: ("potassium", "mg"),
    1095: ("zinc", "mg"),
    1093: ("sodium", "mg"),
    1106: ("vit_a", "mcg"),
    1109: ("vit_e", "mg"),
    1114: ("vit_d", "mcg"),
    1162: ("vit_c", "mg"),
    1165: ("vit_b1", "mg"),
    1166: ("vit_b2", "mg"),
    1167: ("vit_b3", "mg"),
    1175: ("vit_b6", "mg"),
    1178: ("vit_b12", "mcg"),
    1185: ("vit_k", "mcg"),
    1190: ("folate", "mcg"),
}


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", choices=["foundation", "sr_legacy", "branded"], required=True)
    parser.add_argument("--file", type=Path, required=True, help="Path to USDA CSV/JSON")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    if not args.file.exists():
        logger.error("File not found: %s", args.file)
        logger.error("Download datasets from https://fdc.nal.usda.gov/download-datasets/")
        return 1

    logger.info("TODO: parse %s and ingest into foods + food_nutrients", args.file)
    logger.info("Nutrient map contains %d ids (kcal, macros, 15 vitamins, 11 minerals)", len(USDA_NUTRIENT_MAP))
    logger.info("Next step: implement CSV parser + bulk insert (see module docstring).")
    return 0


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(message)s")
    sys.exit(main(sys.argv[1:]))
