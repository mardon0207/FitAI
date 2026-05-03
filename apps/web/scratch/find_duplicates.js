import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuxpysphjpqpnutpfbux.supabase.co';
const supabaseAnonKey = 'sb_publishable_2RGeXc3sR1GE-AOTd0MyWQ_ML8KfY1L';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findDuplicates() {
  const { data: foods, error } = await supabase
    .from('foods')
    .select('*');

  if (error) {
    console.error('Error fetching foods:', error);
    return;
  }

  const normalize = function(name) {
    if (!name) return '';
    // Special handling for Uzbek shashlik variations
    let n = name.toLowerCase()
      .replace(/go'shti|go'shtidan|pishirilgan|bilan|va/g, '')
      .replace(/[^a-z0-9'\s]/g, '')
      .trim();
    
    // If it contains shashlik, keep it simple
    if (n.indexOf('shashlik') !== -1) {
      const parts = n.split(/\s+/);
      const main = parts.filter(function(p) { 
        return p !== 'shashlik' && p.length > 1; 
      }).sort().join(' ');
      return main + ' shashlik';
    }

    return n.split(/\s+/)
      .filter(function(w) { return w.length > 1; })
      .sort()
      .join(' ')
      .trim();
  };

  const groups = {};
  foods.forEach(function(food) {
    const normalizedUz = normalize(food.name_uz);
    if (normalizedUz) {
      if (!groups[normalizedUz]) groups[normalizedUz] = [];
      groups[normalizedUz].push(food);
    }
  });

  console.log('\n--- Duplicate Groups for "shashlik" ---');
  Object.keys(groups).forEach(function(key) {
    if (key.indexOf('shashlik') !== -1 && groups[key].length > 1) {
      console.log('\nGroup: "' + key + '"');
      groups[key].forEach(function(i) {
        console.log('  - ' + i.name_uz + ' (' + i.slug + ')');
      });
    }
  });

  console.log('\n--- All Exact Normalization Duplicates ---');
  Object.entries(groups)
    .filter(function(entry) { return entry[1].length > 1; })
    .forEach(function(entry) {
      console.log('\nGroup: "' + entry[0] + '"');
      entry[1].forEach(function(i) {
        console.log('  - ' + i.name_uz + ' (' + i.slug + ')');
      });
    });
}

findDuplicates();
