import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuxpysphjpqpnutpfbux.supabase.co';
const supabaseAnonKey = 'sb_publishable_2RGeXc3sR1GE-AOTd0MyWQ_ML8KfY1L';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUqProducts() {
    const { data, error } = await supabase
        .from('uq_products')
        .select('*')
        .ilike('name_uz', '%shashlik%');
    
    if (error) {
        console.error("Error:", error);
        return;
    }
    
    console.log(`Found ${data.length} products matching 'shashlik' in uq_products:`);
    data.forEach(p => {
        console.log(`- ${p.name_uz} (Slug: ${p.slug}, Kcal: ${p.per_100g.kcal})`);
    });
}

checkUqProducts();
