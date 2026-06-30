import re
import json

with open("src/app/checkin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# match everything from `const t = {` to `  }[lang];`
match = re.search(r"const t = (\{[\s\S]*?\})\s*\[lang\];", content)

if match:
    obj_str = match.group(1)
    # This is a JS object, let's just write it to a JS file and evaluate it
    js_code = f"""
    const correctCode = '1579';
    const obj = {obj_str};
    const fs = require('fs');
    fs.writeFileSync('scratch/checkin_es.json', JSON.stringify(obj.es, null, 2));
    fs.writeFileSync('scratch/checkin_en.json', JSON.stringify(obj.en, null, 2));
    """
    with open("scratch/extract_checkin.js", "w", encoding="utf-8") as out:
        out.write(js_code)
    print("Run `node scratch/extract_checkin.js`")
else:
    print("Match failed")
