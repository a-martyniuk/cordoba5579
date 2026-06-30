import re

with open('src/app/checkin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the old `const t = { ... }[lang];` declaration entirely
content = re.sub(r'  const t = \{[\s\S]*?\}[lang];\n', '', content)

# 2. Add the import for LanguageContext if it's not there
if 'LanguageContext' not in content:
    content = re.sub(r'(import .*? from "lucide-react";)', r'\1\nimport { useLanguage } from "../../context/LanguageContext";', content)

# 3. Add the new `const { t, language: lang, setLanguage: handleLanguageChange } = useLanguage();`
# The file has: `const [lang, setLang] = useState<"es" | "en">("es");`
# Let's replace the useState for lang and handleLanguageChange entirely
content = re.sub(r'  const \[lang, setLang\] = useState<"es" | "en">\("es"\);\n', '  const { t, language: lang, setLanguage } = useLanguage();\n', content)

# Now remove the old handleLanguageChange function block
content = re.sub(r'  const handleLanguageChange = \(newLang: "es" \| "en"\) => \{[\s\S]*?\};\n', '', content)
# And in the UI where it says `onClick={() => handleLanguageChange("es")}`, replace with `setLanguage("es")`
content = content.replace('handleLanguageChange("es")', 'setLanguage("es")')
content = content.replace('handleLanguageChange("en")', 'setLanguage("en")')

# Replace `t.([a-zA-Z0-9]+)` with `t.chk_\1` but only for the keys that actually have `chk_` prefix.
# In JS, `t.back` -> `t.chk_back`. We know the keys from scratch/checkin_es.json
import json
with open('scratch/checkin_es.json', 'r', encoding='utf-8') as f:
    es_dict = json.load(f)
keys = list(es_dict.keys())
keys.sort(key=len, reverse=True) # longest first so we don't accidentally match sub-words

for k in keys:
    content = re.sub(r'\bt\.' + k + r'\b', f't.chk_{k}', content)

with open('src/app/checkin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
