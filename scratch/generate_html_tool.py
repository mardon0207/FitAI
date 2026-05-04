import json
import os

def generate_tool():
    prompts_path = os.path.join('scratch', 'prompts_to_copy.txt')
    output_path = os.path.join('scratch', 'prompts_tool.html')
    
    if not os.path.exists(prompts_path):
        print(f"Error: {prompts_path} not found")
        return

    with open(prompts_path, 'r', encoding='utf-8') as f:
        prompts = [line.strip() for line in f if line.strip()]

    prompts_json = json.dumps(prompts, ensure_ascii=False)

    html_content = """
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitAI Prompt Copier</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            background: #f0f2f5; 
            color: #1c1e21; 
            padding: 40px 20px;
            margin: 0;
        }
        .container { 
            max-width: 1000px; 
            margin: 0 auto; 
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h1 { 
            text-align: center; 
            color: #1877f2; 
            margin-bottom: 10px;
            font-size: 32px;
        }
        p.subtitle {
            text-align: center;
            color: #65676b;
            margin-bottom: 30px;
        }
        .search-box { 
            width: 100%; 
            padding: 15px; 
            margin-bottom: 25px; 
            border: 2px solid #e4e6eb; 
            border-radius: 10px; 
            font-size: 18px; 
            box-sizing: border-box; 
            outline: none;
            transition: border-color 0.2s;
        }
        .search-box:focus {
            border-color: #1877f2;
        }
        .list-header {
            display: flex;
            padding: 10px 15px;
            background: #f0f2f5;
            border-radius: 8px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #65676b;
            font-size: 13px;
            text-transform: uppercase;
        }
        .prompt-card { 
            background: #fff; 
            padding: 15px; 
            margin-bottom: 12px; 
            border-radius: 10px; 
            border: 1px solid #e4e6eb;
            display: flex; 
            align-items: center; 
            gap: 20px; 
            transition: all 0.2s;
        }
        .prompt-card:hover { 
            border-color: #1877f2;
            box-shadow: 0 2px 8px rgba(24, 119, 242, 0.1);
        }
        .prompt-text { 
            flex-grow: 1; 
            font-size: 15px; 
            color: #050505; 
            line-height: 1.5; 
        }
        .id-badge { 
            background: #e7f3ff; 
            color: #1877f2; 
            padding: 6px 12px; 
            border-radius: 6px; 
            font-family: monospace;
            font-weight: bold; 
            font-size: 14px; 
            min-width: 90px; 
            text-align: center; 
        }
        .copy-btn { 
            background: #1877f2; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 8px; 
            cursor: pointer; 
            font-weight: 600; 
            font-size: 14px;
            white-space: nowrap; 
            transition: background 0.2s; 
        }
        .copy-btn:hover { 
            background: #166fe5; 
        }
        .copy-btn.copied { 
            background: #42b72a; 
        }
        .counter {
            text-align: right;
            font-size: 14px;
            color: #65676b;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>✨ FitAI Image Helper</h1>
        <p class="subtitle">Нажмите кнопку, чтобы мгновенно скопировать промпт для Google Flow</p>
        
        <input type="text" id="search" class="search-box" placeholder="Поиск по названию или ID (например: FITAI_050)...">
        
        <div class="list-header">
            <div style="width: 110px">ID</div>
            <div style="flex-grow: 1">Промпт (Prompt)</div>
            <div style="width: 120px; text-align: right">Действие</div>
        </div>
        
        <div id="list"></div>
        <div class="counter" id="counter"></div>
    </div>

    <script>
        const prompts = """ + prompts_json + """;
        const listDiv = document.getElementById('list');
        const searchInput = document.getElementById('search');
        const counterDiv = document.getElementById('counter');

        function render(filter = "") {
            listDiv.innerHTML = '';
            let count = 0;
            prompts.forEach((p) => {
                if (p.toLowerCase().includes(filter.toLowerCase())) {
                    count++;
                    const card = document.createElement('div');
                    card.className = 'prompt-card';
                    
                    const idMatch = p.match(/FITAI_\\d+/);
                    const id = idMatch ? idMatch[0] : 'ID';
                    
                    card.innerHTML = `
                        <span class="id-badge">${id}</span>
                        <div class="prompt-text">${p}</div>
                        <button class="copy-btn" onclick="copyText(this, \\`${p.replace(/`/g, '\\\\`').replace(/\\$/g, '\\\\$')}\\`)">Копировать</button>
                    `;
                    listDiv.appendChild(card);
                }
            });
            counterDiv.innerText = `Показано: ${count} из ${prompts.length}`;
        }

        function copyText(btn, text) {
            navigator.clipboard.writeText(text).then(() => {
                const oldText = btn.innerText;
                btn.innerText = 'Скопировано!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerText = oldText;
                    btn.classList.remove('copied');
                }, 1000);
            }).catch(err => {
                console.error('Ошибка копирования: ', err);
                alert('Не удалось скопировать. Попробуйте вручную.');
            });
        }

        searchInput.addEventListener('input', (e) => render(e.target.value));
        render();
    </script>
</body>
</html>
"""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"Successfully generated: {output_path}")

if __name__ == "__main__":
    generate_tool()
