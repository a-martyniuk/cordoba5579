import json
import re

def merge_translations(ts_path, json_path, prefix="cava_"):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    with open(ts_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Format the new entries
    new_entries = []
    for k, v in data.items():
        v_str = json.dumps(v, ensure_ascii=False)
        new_entries.append(f'  {prefix}{k}: {v_str},')
    
    new_lines = "\n".join(new_entries)
    
    content = re.sub(r'(\n};\n?$)', f',\n{new_lines}\n}};\n', content)
    
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(content)

merge_translations('src/locales/es.ts', 'scratch/cava_es.json')
merge_translations('src/locales/en.ts', 'scratch/cava_en.json')
print("Cava Translations merged.")
