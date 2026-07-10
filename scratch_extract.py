import json
import re

def find_photos():
    with open("airbnb_state.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    images = []
    
    def extract_photos(obj):
        if isinstance(obj, dict):
            # We are looking for something that has a picture url and an accessibilityLabel
            # usually `baseUrl` or `picture`
            label = obj.get("accessibilityLabel", "")
            if label and ("Imagen de" in label or "Image of" in label):
                # The actual URL might be close by or inside a picture object
                url = obj.get("baseUrl") or obj.get("large") or obj.get("xlarge") or obj.get("xxlarge")
                if not url and "picture" in obj and isinstance(obj["picture"], str):
                    url = obj["picture"]
                if url and url not in [i["url"] for i in images]:
                    # Extract the category name from "Imagen de Cocina completa 1" -> "Cocina completa"
                    cat = label.replace("Imagen de ", "").replace("Image of ", "")
                    cat = re.sub(r'\s*\d+$', '', cat) # remove trailing numbers
                    images.append({"title": cat, "url": url})
            for k, v in obj.items():
                extract_photos(v)
        elif isinstance(obj, list):
            for item in obj:
                extract_photos(item)
                
    extract_photos(data)
    
    with open("scratch_photos.json", "w", encoding="utf-8") as out:
        json.dump(images, out, indent=2, ensure_ascii=False)
    print(f"Extracted {len(images)} photos")

find_photos()
