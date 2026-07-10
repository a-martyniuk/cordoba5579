import json
import re
from curl_cffi import requests

url = "https://www.airbnb.com.ar/rooms/1716762976739155303?locale=es"
print(f"Fetching {url}")
r = requests.get(
    url,
    impersonate="chrome120",
    headers={"Accept-Language": "es;q=0.9,en;q=0.8"}
)

content = r.text
deferred_states = re.findall(r'<script[^>]*id="data-deferred-state-0"[^>]*>([\s\S]*?)</script>', content)

if deferred_states:
    state_str = deferred_states[0].strip()
    if state_str.startswith("<!--"): state_str = state_str[4:]
    if state_str.endswith("-->"): state_str = state_str[:-3]
    state_json = json.loads(state_str.strip())
    
    with open("airbnb_state.json", "w", encoding="utf-8") as f:
        json.dump(state_json, f, indent=2, ensure_ascii=False)
    print("Dumped state to airbnb_state.json")
else:
    print("Could not find deferred state")
