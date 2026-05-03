import fs from 'fs';

const stopWords = ["go'shti", "go'shtli", "go'shtidan", "gosht", "goshti", "goshtidan", "pishirilgan", "pishgan", "qaynatilgan", "qovurilgan", "xom", "yangi", "shirin", "achchiq", "dan", "li", "va", "bilan"];
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

async function mergeMeals() {
    const mdPath = 'c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/unique_products.md';
    const csvPath = 'c:/Users/admin/OneDrive/Рабочий стол/NewProg/FitAI/Uzb_meals.csv';

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

    console.log(`Existing unique keys: ${existingKeys.size}`);

    const newItems = [];
    let currentCategory = 'Milliy taomlar';

    // Parse CSV
    for (let i = 1; i < csvLines.length; i++) {
        const line = csvLines[i].trim();
        if (!line) continue;

        const parts = line.split(',');
        const nameFull = parts[0];
        const kcal = parts[1];
        const protein = parts[2];
        const carbs = parts[3];
        const fat = parts[4];

        // Check if it's a category header (empty nutrients)
        if (!kcal && !protein && !carbs && !fat) {
            // Clean category name (remove Russian part in parentheses)
            let catUz = nameFull.replace(/\([^)]+\)/g, '').trim();
            
            // Manual mapping for better translations
            const categoryMapping = {
                'Palov': 'Palov va uning turlari',
                'Manti va Barak': 'Manti va barak',
                'Shashlik va Kabob': 'Kaboblar va shashliklar',
                'Suyuq ovqatlar': 'Suyuq taomlar',
                'Xamir ovqatlar': 'Xamirli taomlar',
                'Asosiy va boshqa ovqatlar': 'Asosiy taomlar',
                'Non va pishiriqlar': 'Non va pishiriqlar',
                'Salatlar va Gazaklar': 'Salatlar va gazaklar',
                'Shirinliklar': 'Shirinliklar va desertlar',
                'Ichimliklar': 'Ichimliklar'
            };

            currentCategory = categoryMapping[catUz] || catUz;
            continue;
        }

        // Clean name (remove Russian part in parentheses)
        const nameUz = nameFull.replace(/\([^)]+\)/g, '').trim();
        const key = normalizeKey(nameUz);

        if (!existingKeys.has(key) && key) {
            newItems.push({
                name: nameUz,
                category: currentCategory,
                kcal: parseFloat(kcal) || 0,
                protein: parseFloat(protein) || 0,
                carbs: parseFloat(carbs) || 0,
                fat: parseFloat(fat) || 0,
                type: 'food',
                slug: generateSlug(nameUz)
            });
            existingKeys.add(key); // Avoid adding duplicates within the CSV itself
        }
    }

    console.log(`Found ${newItems.size ? 0 : newItems.length} new items to add.`);

    if (newItems.length > 0) {
        let appendMd = '';
        newItems.forEach(item => {
            appendMd += `| ${item.name} | ${item.category} | ${item.kcal} | ${item.protein} | ${item.carbs} | ${item.fat} | ${item.type} | ${item.slug} |\n`;
        });

        fs.appendFileSync(mdPath, appendMd);
        console.log(`Added ${newItems.length} items to ${mdPath}`);
    } else {
        console.log('No new items found.');
    }
}

mergeMeals();
