import os
import json
import re
import sys
import html
from curl_cffi import requests

# Force stdout/stderr to use UTF-8 encoding on Windows to avoid console crashes
if sys.platform.startswith('win'):
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())

def main():
    url = "https://www.airbnb.com.ar/rooms/1716762976739155303"
    print(f"Starting Airbnb Sync for listing: {url}...")
    
    try:
        r = requests.get(
            url,
            impersonate="chrome120",
            headers={
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        )
        
        if r.status_code != 200:
            print(f"❌ Failed to fetch page. HTTP status: {r.status_code}")
            return
            
        content = r.text
        
        # 1. Parse JSON-LD for Title, Description, Photos
        title = "Palermo Hollywood - Cómodo y luminoso departamento"
        description = ""
        photos = []
        
        json_ld_blocks = re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>', content)
        if json_ld_blocks:
            try:
                data = json.loads(json_ld_blocks[0].strip())
                title = data.get("name", title)
                description = data.get("description", "")
                photos = data.get("image", [])
                # Clean title
                if " | " in title:
                    title = title.split(" | ")[0]
            except Exception as e:
                print("⚠️ Error parsing JSON-LD data:", e)

        # 2. Parse deferred state for ratings, reviews, amenities, capacity
        rating = 4.90
        reviews_count = 120
        amenities = []
        capacity_text = "4 huéspedes · 1 dormitorio · 1 cama · 1.5 baños"
        price = 45 # Default fallback price
        space = ""
        access = ""
        notes = ""
        
        deferred_states = re.findall(r'<script[^>]*id="data-deferred-state-0"[^>]*>([\s\S]*?)</script>', content)
        if deferred_states:
            try:
                state_str = deferred_states[0].strip()
                if state_str.startswith("<!--"): state_str = state_str[4:]
                if state_str.endswith("-->"): state_str = state_str[:-3]
                state_json = json.loads(state_str.strip())
                
                niobe = state_json.get("niobeClientData", [])
                if niobe:
                    pdp_data = niobe[0][1].get("data", {})
                    
                    # Parse rating & reviews
                    sections = pdp_data.get("presentation", {}).get("stayProductDetailPage", {}).get("sections", {}).get("sections", [])
                    for s in sections:
                        if not s: continue
                        section_id = s.get("sectionId")
                        if section_id == "MEET_YOUR_HOST" or "REVIEWS" in section_id:
                            card_data = s.get("section", {}).get("cardData", {})
                            if card_data:
                                if "ratingAverage" in card_data and card_data["ratingAverage"]:
                                    rating = float(card_data["ratingAverage"])
                                if "ratingCount" in card_data and card_data["ratingCount"]:
                                    reviews_count = int(card_data["ratingCount"])
                                    
                    # Parse Amenities
                    amenities_data = pdp_data.get("node", {}).get("pdpPresentation", {}).get("amenities", {})
                    if amenities_data:
                        groups = amenities_data.get("seeAllAmenitiesGroups", [])
                        for g in groups:
                            for item in g.get("amenities", []):
                                if item.get("available") and item.get("title"):
                                    title_item = item.get("title")
                                    if title_item not in amenities:
                                        amenities.append(title_item)
                                        
                    # Parse Capacity text
                    sharing_title = pdp_data.get("node", {}).get("pdpPresentation", {}).get("sharingConfig", {}).get("ugcTitle", {}).get("content", {}).get("localizedString")
                    if sharing_title:
                        capacity_text = sharing_title

                    # Parse detailed descriptions from DESCRIPTION_MODAL
                    for s in sections:
                        if not s: continue
                        if s.get("sectionId") == "DESCRIPTION_MODAL":
                            items = s.get("section", {}).get("items", [])
                            for item in items:
                                item_title = item.get("title")
                                html_text = item.get("html", {}).get("htmlText", "") if "html" in item else ""
                                if not html_text: continue
                                # Clean HTML formatting
                                clean_text = re.sub(r'<br\s*/?>', '\n', html_text).strip()
                                clean_text = re.sub(r'<[^>]+>', '', clean_text).strip()
                                clean_text = html.unescape(clean_text)
                                
                                if item_title in ["El alojamiento", "The space"]:
                                    space = clean_text
                                elif item_title in ["Acceso de los huéspedes", "Guest access"]:
                                    access = clean_text
                                elif item_title in ["Otros aspectos para tener en cuenta", "Other things to note"]:
                                    notes = clean_text
                        
            except Exception as e:
                print("⚠️ Error parsing deferred state details:", e)

        # Build output payload
        payload = {
            "title": title,
            "rating": rating,
            "reviewsCount": reviews_count,
            "description": description,
            "space": space,
            "access": access,
            "notes": notes,
            "amenities": amenities,
            "photos": photos,
            "price": price,
            "capacityText": capacity_text
        }
        
        # Save to local data folder for Next.js build / development
        base_dir = os.path.dirname(os.path.abspath(__file__))
        target_file = os.path.abspath(os.path.join(base_dir, "..", "src", "data", "airbnb-details.json"))
        
        # Ensure directories exist
        os.makedirs(os.path.dirname(target_file), exist_ok=True)
        
        with open(target_file, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)
        print(f"✅ Successfully wrote to {target_file}")
        
        # Trigger Next.js webhook if server is running locally
        try:
            webhook_url = "http://localhost:3000/api/sync-airbnb-webhook"
            print(f"Triggering Next.js API Webhook at {webhook_url}...")
            r_webhook = requests.post(webhook_url, json=payload, timeout=5)
            if r_webhook.status_code == 200:
                print("✅ Next.js API sync webhook triggered successfully!")
            else:
                print(f"⚠️ Webhook returned status: {r_webhook.status_code}")
        except Exception:
            # Silence webhook connection errors when local Next.js server is not running
            pass
            
    except Exception as e:
        print("❌ General error during sync:", e)

if __name__ == "__main__":
    main()
