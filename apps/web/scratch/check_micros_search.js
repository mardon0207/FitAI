import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuxpysphjpqpnutpfbux.supabase.co';
const supabaseAnonKey = 'sb_publishable_2RGeXc3sR1GE-AOTd0MyWQ_ML8KfY1L';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMicrosSearch() {
    const { data, error } = await supabase
        .from('foods')
        .select('name_uz, per_100g')
        .not('per_100g->micros', 'is', null)
        .limit(10);

    if (error) {
        console.error(error);
        return;
    }

    console.log(`Found ${data.length} items with micros:`);
    data.forEach(row => {
        console.log(`- ${row.name_uz}:`, JSON.stringify(row.per_100g.micros));
    });
}

checkMicrosSearch();
