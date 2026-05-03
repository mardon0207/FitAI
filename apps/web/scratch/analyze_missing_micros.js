import fs from 'fs';

const mdPath = 'c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/unique_products.md';
const mdContent = fs.readFileSync(mdPath, 'utf8');
const lines = mdContent.split('\n');

const missing = [];
for (const line of lines) {
    if (line.startsWith('|') && !line.includes('Name (UZ)')) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 15) {
            const fe = parts[7];
            const mg = parts[8];
            const ca = parts[9];
            const p = parts[10];
            const k = parts[11];
            const na = parts[12];
            
            if (fe === '0' && mg === '0' && ca === '0' && p === '0' && k === '0' && na === '0') {
                missing.push({ name: parts[1], category: parts[2], slug: parts[14] });
            }
        }
    }
}

console.log(`Total missing items: ${missing.length}`);
const categories = {};
missing.forEach(m => {
    categories[m.category] = (categories[m.category] || 0) + 1;
});
console.log("Categories of missing items:", categories);
console.log("Samples of missing items:");
console.log(missing.slice(0, 20).map(m => m.name).join(', '));
