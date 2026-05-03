import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuxpysphjpqpnutpfbux.supabase.co';
const supabaseAnonKey = 'sb_publishable_2RGeXc3sR1GE-AOTd0MyWQ_ML8KfY1L';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkShashlik() {
  const { data: foods, error: fError } = await supabase.from('foods').select('name_uz, slug');
  const { data: recipes, error: rError } = await supabase.from('recipes').select('name_uz, slug');

  if (fError || rError) {
    console.error('Error fetching data:', fError || rError);
    return;
  }

  const all = (foods || []).concat(recipes || []);

  const shashliks = all.filter(function(f) {
    return f.name_uz && f.name_uz.toLowerCase().indexOf('shashlik') !== -1;
  });

  console.log('Found ' + shashliks.length + ' shashlik items in total:');
  shashliks.forEach(function(s) {
    console.log('  - ' + s.name_uz + ' (' + s.slug + ')');
  });
}

checkShashlik();
