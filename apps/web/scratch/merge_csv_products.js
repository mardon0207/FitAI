import fs from 'fs';

const mdPath = 'c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/unique_products.md';
let mdContent = fs.readFileSync(mdPath, 'utf8');
const existingNames = new Set();
mdContent.split('\n').forEach(line => {
    if (line.startsWith('|') && !line.includes('Name (UZ)') && !line.includes(':---')) {
        const parts = line.split('|');
        if (parts.length > 1) {
            const name = parts[1].trim().toLowerCase();
            existingNames.add(name);
        }
    }
});

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '_')           // Replace spaces with _
        .replace(/[^\w-]+/g, '')       // Remove all non-word chars
        .replace(/--+/g, '_')          // Replace multiple - with single _
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function processCsv(path) {
    console.log(`\nProcessing ${path}...`);
    const content = fs.readFileSync(path, 'utf8');
    const lines = content.split('\n');
    let addedCount = 0;
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Handle CSV with possible quotes
        const parts = [];
        let current = '';
        let inQuotes = false;
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
                parts.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        parts.push(current.trim());

        if (parts.length < 6) continue;
        
        let rawName = parts[0];
        // Clean name: remove Russian translation in brackets
        let cleanName = rawName.split('(')[0].trim();
        if (cleanName.toLowerCase() === 'name (uz)' || parts[2] === '' || isNaN(parseFloat(parts[2]))) {
            continue; // Header or empty row
        }

        if (!existingNames.has(cleanName.toLowerCase())) {
            const category = parts[1];
            const kcal = parts[2];
            const protein = parts[3];
            const carbs = parts[4];
            const fat = parts[5];
            const slug = slugify(cleanName);
            
            // Format: | Name (UZ) | Category | Kcal | Protein | Carbs | Fat | Fe (mg) | Mg (mg) | Ca (mg) | P (mg) | K (mg) | Na (mg) | Type | Slug |
            const newLine = `| ${cleanName} | ${category} | ${kcal} | ${protein} | ${carbs} | ${fat} | 0 | 0 | 0 | 0 | 0 | 0 | food | ${slug} |`;
            mdContent += '\n' + newLine;
            existingNames.add(cleanName.toLowerCase());
            addedCount++;
            console.log(`Added: ${cleanName}`);
        }
    }
    console.log(`Added ${addedCount} products from ${path}`);
}

processCsv('c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/products1.csv');
processCsv('c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/products2.csv');

fs.writeFileSync(mdPath, mdContent);
console.log("\nUpdated unique_products.md successfully!");
