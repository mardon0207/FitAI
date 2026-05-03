import fs from 'fs';

const mdPath = 'c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/unique_products.md';
const mdContent = fs.readFileSync(mdPath, 'utf8');
const existingNames = new Set();
mdContent.split('\n').forEach(line => {
    if (line.startsWith('|') && !line.includes('Name (UZ)') && !line.includes(':---')) {
        const name = line.split('|')[1].trim().toLowerCase();
        existingNames.add(name);
    }
});

function checkCsv(path) {
    console.log(`\nChecking ${path}...`);
    const content = fs.readFileSync(path, 'utf8');
    const lines = content.split('\n');
    let count = 0;
    lines.forEach((line, i) => {
        if (i === 0 || !line.trim()) return;
        const parts = line.split(',');
        if (parts.length < 2) return;
        let name = parts[0].trim();
        // Remove Russian translation in brackets for matching
        const cleanName = name.replace(/\(.*\)/, '').trim().toLowerCase();
        if (!existingNames.has(cleanName)) {
            console.log(`New product found: ${name}`);
            count++;
        }
    });
    console.log(`Total new products in ${path}: ${count}`);
}

checkCsv('c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/products1.csv');
checkCsv('c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/products2.csv');
