import fs from 'fs';

const mdPath = 'c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/unique_products.md';
const content = fs.readFileSync(mdPath, 'utf8');
const lines = content.split('\n');

const slugs = new Set();
const names = new Set();
const duplicates = [];

for (const line of lines) {
    if (line.startsWith('|') && !line.includes('Name (UZ)') && !line.includes(':---')) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 15) {
            const name = parts[1];
            const slug = parts[14];
            
            if (slugs.has(slug)) {
                duplicates.push(`Duplicate slug: ${slug} (${name})`);
            }
            slugs.add(slug);
            
            if (names.has(name)) {
                duplicates.push(`Duplicate name: ${name} (${slug})`);
            }
            names.add(name);
        }
    }
}

console.log(`Total products: ${slugs.size}`);
if (duplicates.length > 0) {
    console.log('Duplicates found:');
    duplicates.forEach(d => console.log(d));
} else {
    console.log('No duplicates found in the markdown file.');
}
