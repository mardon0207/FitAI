import fs from 'fs';

const stopWords = ["go'shti", "go'shtli", "go'shtidan", "gosht", "goshti", "goshtidan", "pishirilgan", "pishgan", "qaynatilgan", "qovurilgan", "xom", "yangi", "shirin", "achchiq", "dan", "li", "va", "bilan", "yangi", "fresh", "svejiy", "svejaya"];
const sortedStopWords = [...stopWords].sort((a, b) => b.length - a.length);

function normalizeKey(name) {
    if (!name) return '';
    const numbers = name.match(/\d+([.,]\d+)?%?/g) || [];
    const cleanNumbers = numbers.map(n => n.replace(',', '.'));
    const base = name.toLowerCase()
        .replace(new RegExp(sortedStopWords.join('|'), 'g'), '')
        .replace(/\d+([.,]\d+)?%?/g, '')
        .replace(/[^a-z']/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 1)
        .sort()
        .join(' ')
        .trim();
    return base + (cleanNumbers.length > 0 ? '|' + cleanNumbers.sort().join(',') : '');
}

function generateSlug(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/__+/g, '_')
        .replace(/^_|_$/g, '');
}

async function mergeProducts(csvFilename) {
    const mdPath = 'c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/unique_products.md';
    const csvPath = `c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/${csvFilename}`;

    if (!fs.existsSync(csvPath)) {
        console.error(`File not found: ${csvPath}`);
        return;
    }

    const mdContent = fs.readFileSync(mdPath, 'utf8');
    const csvLines = fs.readFileSync(csvPath, 'utf8').split('\n');

    // Parse existing MD
    const existingKeys = new Set();
    const mdLines = mdContent.split('\n');
    mdLines.forEach(line => {
        if (line.startsWith('|') && !line.includes('Name (UZ)') && !line.includes(':---')) {
            const parts = line.split('|').map(p => p.trim());
            const name = parts[1];
            existingKeys.add(normalizeKey(name));
        }
    });

    console.log(`[${csvFilename}] Existing unique products: ${existingKeys.size}`);

    const newItems = [];
    const categoryMapping = {
        'Mevalar': 'Mevalar va rezavorlar',
        'Don mahsulotlari': 'Don va dukkakli mahsulotlar',
        'Un mahsulotlari': 'Un va non mahsulotlari',
        'Shirinliklar': 'Shirinliklar va desertlar',
        'Boshqalar': 'Boshqalar',
        'Dukkaklilar': 'Don va dukkakli mahsulotlar',
        'Ko\'katlar': 'Ko\'katlar va sabzavotlar'
    };

    // Parse CSV
    for (let i = 1; i < csvLines.length; i++) {
        const line = csvLines[i].trim();
        if (!line) continue;

        // Handle quoted CSV fields or simple comma split
        // Improved regex for CSV parsing
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, ''));
        
        if (!parts || parts.length < 6) continue;

        const nameFull = parts[0];
        const categoryRaw = parts[1];
        const kcal = parts[2];
        const protein = parts[3];
        const carbs = parts[4];
        const fat = parts[5];

        // Check if it's a category header (empty nutrients)
        if (!kcal || kcal === '' || isNaN(parseFloat(kcal))) {
            continue;
        }

        // Clean name (remove Russian part in parentheses)
        const nameUz = nameFull.replace(/\([^)]+\)/g, '').trim();
        const key = normalizeKey(nameUz);

        if (!existingKeys.has(key) && key) {
            const category = categoryMapping[categoryRaw] || categoryRaw;
            newItems.push({
                name: nameUz,
                category: category,
                kcal: parseFloat(kcal) || 0,
                protein: parseFloat(protein) || 0,
                carbs: parseFloat(carbs) || 0,
                fat: parseFloat(fat) || 0,
                type: 'food',
                slug: generateSlug(nameUz)
            });
            existingKeys.add(key);
        }
    }

    console.log(`[${csvFilename}] Found ${newItems.length} new items to add.`);

    if (newItems.length > 0) {
        let appendMd = '';
        newItems.forEach(item => {
            appendMd += `| ${item.name} | ${item.category} | ${item.kcal} | ${item.protein} | ${item.carbs} | ${item.fat} | ${item.type} | ${item.slug} |\n`;
        });

        fs.appendFileSync(mdPath, appendMd);
        console.log(`[${csvFilename}] Added ${newItems.length} items to ${mdPath}`);
    }
}

async function main() {
    await mergeProducts('products1.csv');
    await mergeProducts('products2.csv');
}

main();
