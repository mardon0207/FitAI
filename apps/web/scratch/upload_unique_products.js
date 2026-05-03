import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuxpysphjpqpnutpfbux.supabase.co';
const supabaseAnonKey = 'sb_publishable_2RGeXc3sR1GE-AOTd0MyWQ_ML8KfY1L';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadUniqueProducts() {
    const mdPath = 'c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/unique_products.md';
    if (!fs.existsSync(mdPath)) {
        console.error("File not found:", mdPath);
        return;
    }

    const mdContent = fs.readFileSync(mdPath, 'utf8');
    const lines = mdContent.split('\n');

    const products = [];
    for (const line of lines) {
        if (line.startsWith('|') && !line.includes('Name (UZ)') && !line.includes(':---')) {
            const parts = line.split('|').map(p => p.trim());
            // Parts length should be 16 based on our recent rebuild:
            // 0:"", 1:Name, 2:Cat, 3:Kcal, 4:Prot, 5:Carbs, 6:Fat, 7:Fe, 8:Mg, 9:Ca, 10:P, 11:K, 12:Na, 13:Type, 14:Slug, 15:""
            if (parts.length >= 15) {
                const name_uz = parts[1];
                const category = parts[2];
                const kcal = parseFloat(parts[3]) || 0;
                const protein = parseFloat(parts[4]) || 0;
                const carbs = parseFloat(parts[5]) || 0;
                const fat = parseFloat(parts[6]) || 0;
                
                const fe = parts[7] !== '0' ? parts[7] : null;
                const mg = parts[8] !== '0' ? parts[8] : null;
                const ca = parts[9] !== '0' ? parts[9] : null;
                const p = parts[10] !== '0' ? parts[10] : null;
                const k = parts[11] !== '0' ? parts[11] : null;
                const na = parts[12] !== '0' ? parts[12] : null;

                const micros = {};
                if (fe) micros.Fe = fe;
                if (mg) micros.Mg = mg;
                if (ca) micros.Ca = ca;
                if (p) micros.P = p;
                if (k) micros.K = k;
                if (na) micros.Na = na;

                const type = (parts[13] || 'Ingredient').toLowerCase();
                const slug = parts[14];

                products.push({
                    slug,
                    name_uz,
                    category,
                    default_unit: 'g',
                    per_100g: {
                        kcal,
                        protein,
                        carbs,
                        fat,
                        type,
                        micros
                    }
                });
            }
        }
    }

    console.log(`Parsed ${products.length} products. Starting upload to 'uq_products'...`);

    // Upload in batches of 100 to be safe
    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        const { error } = await supabase
            .from('uq_products')
            .upsert(batch);

        if (error) {
            console.error(`Error uploading batch ${Math.floor(i / batchSize)}:`, error);
            return;
        }
        console.log(`Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);
    }

    console.log("Upload completed successfully!");
}

uploadUniqueProducts();
