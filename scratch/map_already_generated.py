import os
import re
import json

# Paths
SRC_DIR = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\gen_pic_foods"
PROMPTS_FILE = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\scratch\prompts_to_copy.txt"

def clean_text(text):
    # Remove common filler words
    fillers = {'professional', 'food', 'photography', 'of', 'fresh', 'vibrant', '8k', 'reference', 'fitai', 'with', 'and', 'on', 'a', 'in', 'the'}
    words = re.findall(r'\w+', text.lower())
    return [w for w in words if w not in fillers and not w.isdigit()]

def run_mapping():
    if not os.path.exists(PROMPTS_FILE):
        print("Prompts file not found!")
        return

    # Load prompts and their core subjects
    prompt_data = []
    with open(PROMPTS_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            match = re.search(r'FITAI_(\d+)', line)
            if match:
                fid = match.group(0)
                # The core subject is usually at the beginning
                subject_part = line.split(' (Reference:')[0]
                subject_words = clean_text(subject_part)
                prompt_data.append({'id': fid, 'words': subject_words, 'full': line.strip()})

    if not os.path.exists(SRC_DIR):
        print(f"Directory {SRC_DIR} not found!")
        return

    files = [f for f in os.listdir(SRC_DIR) if f.lower().endswith(('.jpeg', '.jpg', '.png'))]
    results = []

    for f in files:
        f_words = clean_text(f.replace('_', ' '))
        best_fid = None
        max_score = 0
        
        for p in prompt_data:
            # Score based on how many core words from the filename match the prompt
            overlap = set(f_words).intersection(set(p['words']))
            score = len(overlap)
            
            # Bonus for exact matches of specific keywords like 'osh', 'manti', 'samsa'
            specifics = {'osh', 'plov', 'manti', 'samsa', 'lagman', 'shashlik', 'qazi', 'shurva', 'norin'}
            for word in f_words:
                if word in specifics and word in p['words']:
                    score += 5
            
            if score > max_score:
                max_score = score
                best_fid = p['id']
        
        results.append((f, best_fid, max_score))

    print(f"{'FILENAME':<50} | {'BEST MATCH':<10} | {'SCORE'}")
    print("-" * 75)
    for f, fid, score in sorted(results, key=lambda x: x[1] if x[1] else ''):
        print(f"{f[:48]:<50} | {str(fid):<10} | {score}")

if __name__ == "__main__":
    run_mapping()
