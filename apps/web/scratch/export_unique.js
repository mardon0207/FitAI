import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://vuxpysphjpqpnutpfbux.supabase.co';
const supabaseAnonKey = 'sb_publishable_2RGeXc3sR1GE-AOTd0MyWQ_ML8KfY1L';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function exportUnique() {
  console.log('Fetching foods and recipes...');
  const { data: foods, error: fError } = await supabase.from('foods').select('*');
  const { data: recipes, error: rError } = await supabase.from('recipes').select('*');

  if (fError || rError) {
    console.error('Error fetching data:', fError || rError);
    return;
  }

  const all = (foods || []).map(f => ({ ...f, type: 'food' }))
    .concat((recipes || []).map(r => ({ ...r, type: 'recipe' })));

  const normalizeKey = function(name) {
    if (!name) return '';
    
    // Extract numbers/percentages
    const numbers = name.match(/\d+([.,]\d+)?%?/g) || [];
    const cleanNumbers = numbers.map(n => n.replace(',', '.'));
    
    // Base name normalization
    const stopWords = ["go'shti", "go'shtli", "go'shtidan", "gosht", "goshti", "goshtidan", "pishirilgan", "pishgan", "qaynatilgan", "qovurilgan", "xom", "yangi", "shirin", "achchiq", "dan", "li", "va", "bilan"];
    const sortedStopWords = [...stopWords].sort((a, b) => b.length - a.length);
    const base = name.toLowerCase()
      .replace(new RegExp(sortedStopWords.join('|'), 'g'), '')
      .replace(/\d+([.,]\d+)?%?/g, '') // Remove numbers for base
      .replace(/[^a-z']/g, ' ') // Keep only letters and '
      .split(/\s+/)
      .filter(function(w) { return w.length > 1; })
      .sort()
      .join(' ')
      .trim();
    
    // Key is base name + sorted unique numbers
    return base + (cleanNumbers.length > 0 ? '|' + cleanNumbers.sort().join(',') : '');
  };

  const uniqueMap = {};
  
  all.forEach(function(item) {
    const key = normalizeKey(item.name_uz);
    if (!key) return;

    if (!uniqueMap[key]) {
      uniqueMap[key] = item;
    } else {
      // Preference logic:
      // 1. Prefer items with more nutritional info
      // 2. Prefer slugs without 'uz_'
      // 3. Prefer 'food' over 'recipe' if it's the same base
      const current = uniqueMap[key];
      let replace = false;

      if (item.slug.indexOf('uz_') === -1 && current.slug.indexOf('uz_') !== -1) replace = true;
      else if (item.type === 'food' && current.type === 'recipe') replace = true;
      
      if (replace) uniqueMap[key] = item;
    }
  });

  const uniqueList = Object.values(uniqueMap).sort(function(a, b) {
    return a.name_uz.localeCompare(b.name_uz);
  });

  let md = '# Unique Products List (Cleaned)\n\n';
  md += '| Name (UZ) | Category | Kcal | Protein | Carbs | Fat | Type | Slug |\n';
  md += '| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';

  uniqueList.forEach(function(f) {
    const per100 = f.per_100g || { kcal: f.kcal_per_100g, protein: f.protein_per_100g, carbs: f.carbs_per_100g, fat: f.fat_per_100g };
    md += '| ' + f.name_uz + ' | ' + (f.category || '-') + ' | ' + (per100.kcal || 0) + ' | ' + (per100.protein || 0) + ' | ' + (per100.carbs || 0) + ' | ' + (per100.fat || 0) + ' | ' + f.type + ' | ' + f.slug + ' |\n';
  });

  const rootPath = 'c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/unique_products.md';
  fs.writeFileSync(rootPath, md);

  console.log('Successfully exported ' + uniqueList.length + ' unique products to ' + rootPath);
}

exportUnique();
