import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuxpysphjpqpnutpfbux.supabase.co';
const supabaseAnonKey = 'sb_publishable_2RGeXc3sR1GE-AOTd0MyWQ_ML8KfY1L';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchAllFoods() {
    let allData = [];
    let from = 0;
    const step = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('foods')
            .select('slug, per_100g')
            .range(from, from + step - 1);

        if (error) {
            console.error("Error fetching foods:", error);
            break;
        }

        allData = allData.concat(data);
        if (data.length < step) {
            hasMore = false;
        } else {
            from += step;
        }
    }
    return allData;
}

async function rebuildWithMicros() {
    const mdPath = 'c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/unique_products.md';
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    const mdLines = mdContent.split('\n');

    console.log("Fetching all foods from Supabase...");
    const dbFoods = await fetchAllFoods();

    const dbMap = new Map();
    dbFoods.forEach(f => {
        dbMap.set(f.slug, f.per_100g.micros || {});
    });

    console.log(`Loaded ${dbMap.size} products from DB.`);

    const newHeader = '| Name (UZ) | Category | Kcal | Protein | Carbs | Fat | Fe (mg) | Mg (mg) | Ca (mg) | P (mg) | K (mg) | Na (mg) | Type | Slug |';
    const newSeparator = '| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |';

    const outputLines = [];

    for (const line of mdLines) {
        if (!line.trim()) {
            outputLines.push(line);
            continue;
        }

        if (line.includes('Name (UZ)')) {
            outputLines.push(newHeader);
            continue;
        }

        if (line.includes(':---')) {
            outputLines.push(newSeparator);
            continue;
        }

        if (line.startsWith('|')) {
            const parts = line.split('|').map(p => p.trim());
            // In the OLD format (before this run): 1:Name, 2:Cat, 3:Kcal, 4:Prot, 5:Carbs, 6:Fat, 7:Type, 8:Slug
            // However, if I run this script TWICE, the format changes.
            // Let's make it robust by checking the number of parts.
            
            let name, category, kcal, protein, carbs, fat, type, slug;
            
            if (parts.length === 11) { // 10 columns + empty ends
                 name = parts[1];
                 category = parts[2];
                 kcal = parts[3];
                 protein = parts[4];
                 carbs = parts[5];
                 fat = parts[6];
                 type = parts[7];
                 slug = parts[8];
            } else if (parts.length === 16) { // 15 columns + empty ends
                 name = parts[1];
                 category = parts[2];
                 kcal = parts[3];
                 protein = parts[4];
                 carbs = parts[5];
                 fat = parts[6];
                 // Skip micros (parts 7-12)
                 type = parts[13];
                 slug = parts[14];
            } else {
                continue; // Skip invalid lines
            }

            const micros = dbMap.get(slug) || {};

            const cleanVal = (val) => {
                if (val === undefined || val === null || val === '') return '0';
                return val.toString().replace(/[^\d.]/g, '') || '0';
            };

            const fe = cleanVal(micros.fe || micros.Fe);
            const mg = cleanVal(micros.mg || micros.Mg);
            const ca = cleanVal(micros.ca || micros.Ca);
            const p = cleanVal(micros.p || micros.P);
            const k = cleanVal(micros.k || micros.K);
            const na = cleanVal(micros.na || micros.Na);

            const newLine = `| ${name} | ${category} | ${kcal} | ${protein} | ${carbs} | ${fat} | ${fe} | ${mg} | ${ca} | ${p} | ${k} | ${na} | ${type} | ${slug} |`;
            outputLines.push(newLine);
        } else {
            outputLines.push(line);
        }
    }

    fs.writeFileSync(mdPath, outputLines.join('\n'));
    console.log(`Updated ${mdPath} with micro-nutrients.`);
}

rebuildWithMicros();
