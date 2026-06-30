import re
import json

with open("src/app/inventario/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# match everything from `const t = {` to `  };` right before `const currentT = t[language];`
match = re.search(r"const t = (\{[\s\S]*?\})\s*;\s*const currentT = t\[language\];", content)
if match:
    obj_str = match.group(1)
    
    js_code = f"""
    const obj = {obj_str};
    const fs = require('fs');
    fs.writeFileSync('scratch/inv_es.json', JSON.stringify(obj.es, null, 2));
    fs.writeFileSync('scratch/inv_en.json', JSON.stringify(obj.en, null, 2));
    """
    with open("scratch/extract_inv.js", "w", encoding="utf-8") as out:
        out.write(js_code)
else:
    print("Match failed")
