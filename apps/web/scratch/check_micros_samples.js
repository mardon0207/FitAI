import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuxpysphjpqpnutpfbux.supabase.co';
const supabaseAnonKey = 'sb_publishable_2RGeXc3sR1GE-AOTd0MyWQ_ML8KfY1L';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMoreSamples() {
    const { data, error } = await supabase
        .from('foods')
        .select('name_uz, per_100g')
        .limit(20);

    if (error) {
        console.error(error);
        return;
    }

    data.forEach(row => {
        if (row.per_100g && row.per_100g.micros) {
            console.log(`- ${row.name_uz}:`, JSON.stringify(row.per_100g.micros));
        }
    });
}

checkMoreSamples();
