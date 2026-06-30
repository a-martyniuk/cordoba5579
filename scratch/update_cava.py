import re
import json

with open('src/app/cava/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the old `const t = { ... };` declaration entirely
content = re.sub(r'  const t = \{[\s\S]*?  \};\n\n', '', content)
content = re.sub(r'  const currentT = t\[language\];\n\n', '', content)

# 2. Add the import for LanguageContext if it's not there
if 'LanguageContext' not in content:
    content = re.sub(r'(import .*? from "lucide-react";)', r'\1\nimport { useLanguage } from "../../context/LanguageContext";', content)

# 3. Add the new `const { t, language, setLanguage } = useLanguage();`
content = re.sub(r'  const \[language, setLanguage\] = useState<"es" \| "en">\("es"\);\n', '  const { t: currentT, language, setLanguage } = useLanguage();\n', content)

# 4. Remove localStorage language setup
content = re.sub(r'      const savedLang = localStorage.getItem\("language"\) as "es" \| "en";\n      if \(savedLang === "es" \|\| savedLang === "en"\) \{\n        setLanguage\(savedLang\);\n      \}\n', '', content)

# Now remove the old handleLanguageChange function block
content = re.sub(r'  const handleLanguageChange = \(newLang: "es" \| "en"\) => \{[\s\S]*?\};\n', '', content)
content = content.replace('handleLanguageChange("es")', 'setLanguage("es")')
content = content.replace('handleLanguageChange("en")', 'setLanguage("en")')

# Replace `currentT.([a-zA-Z0-9]+)` with `currentT.cava_\1`
with open('scratch/cava_es.json', 'r', encoding='utf-8') as f:
    es_dict = json.load(f)
keys = list(es_dict.keys())
keys.sort(key=len, reverse=True)

for k in keys:
    content = re.sub(r'\bcurrentT\.' + k + r'\b', f'currentT.cava_{k}', content)

with open('src/app/cava/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
