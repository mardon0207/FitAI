import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuxpysphjpqpnutpfbux.supabase.co';
const supabaseAnonKey = 'sb_publishable_2RGeXc3sR1GE-AOTd0MyWQ_ML8KfY1L';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    console.log("Fetching sample data from 'foods' table...");
    const { data, error } = await supabase
        .from('foods')
        .select('*')
        .limit(3);

    if (error) {
        console.error("Error fetching foods:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log("Sample row (JSON format):");
        console.log(JSON.stringify(data[0], null, 2));
        
        console.log("\nAll columns found in first 3 rows:");
        const columns = new Set();
        data.forEach(row => {
            Object.keys(row).forEach(col => columns.add(col));
        });
        console.log(Array.from(columns).sort().join(', '));
        
        if (data[0].per_100g) {
            console.log("\nStructure of 'per_100g' JSONB column:");
            console.log(JSON.stringify(data[0].per_100g, null, 2));
        }
    } else {
        console.log("No data found in 'foods' table.");
    }
}

checkSchema();
