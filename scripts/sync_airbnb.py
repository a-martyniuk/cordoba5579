import sys
import os
import json
import re
import html
import csv
from curl_cffi import requests

# Ensure stdout uses UTF-8 on all platforms (Windows console + GitHub Actions)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

def fetch_listing_for_locale(url_base, locale):
    url = f"{url_base}?locale={locale}"
    print(f"Fetching listing for locale: {locale} ({url})...")
    
    try:
        r = requests.get(
            url,
            impersonate="chrome120",
            headers={
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": f"{locale};q=0.9,en;q=0.8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        )
        
        if r.status_code != 200:
            print(f"❌ Failed to fetch page for locale {locale}. HTTP status: {r.status_code}")
            return None
            
        content = r.text
        
        # 1. Parse JSON-LD for Title, Description, Photos
        title = ""
        description = ""
        photos = []
        
        json_ld_blocks = re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>', content)
        if json_ld_blocks:
            try:
                data = json.loads(json_ld_blocks[0].strip())
                title = data.get("name", "")
                description = data.get("description", "")
                photos = data.get("image", [])
                if " | " in title:
                    title = title.split(" | ")[0]
            except Exception as e:
                print(f"⚠️ Error parsing JSON-LD data for {locale}:", e)

        # 2. Parse deferred state for ratings, reviews, amenities, capacity
        rating = 4.90
        reviews_count = 120
        amenities = []
        capacity_text = "4 huéspedes · 1 dormitorio · 1 cama · 1.5 baños"
        price = 45 # Default fallback price
        space = ""
        access = ""
        notes = ""
        guests = 4
        hosts = []
        
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
                                    # Safely extract subtitle
                                    sub_val = ""
                                    sub_obj = item.get("subtitle")
                                    if sub_obj:
                                        if isinstance(sub_obj, dict):
                                            if sub_obj.get("text"):
                                                sub_val = sub_obj.get("text")
                                            elif sub_obj.get("content", {}).get("localizedString"):
                                                sub_val = sub_obj.get("content", {}).get("localizedString")
                                    
                                    title_item = html.unescape(title_item).strip()
                                    sub_val = html.unescape(sub_val).strip()
                                    
                                    # Add to list as dictionary avoiding duplicates by title
                                    if not any(a.get("title") == title_item for a in amenities):
                                        amenities.append({
                                            "title": title_item,
                                            "subtitle": sub_val
                                        })
                                        
                    # Parse Capacity text
                    sharing_title = pdp_data.get("node", {}).get("pdpPresentation", {}).get("sharingConfig", {}).get("ugcTitle", {}).get("content", {}).get("localizedString")
                    if sharing_title:
                        capacity_text = sharing_title

                    # Parse guests count from overview
                    overview = pdp_data.get("node", {}).get("pdpPresentation", {}).get("overview", {})
                    overview_items = overview.get("items", [])
                    for item in overview_items:
                        lower_item = item.lower()
                        if "huésped" in lower_item or "guest" in lower_item:
                            match = re.search(r'\d+', item)
                            if match:
                                guests = int(match.group())

                    # Parse Hosts
                    for s in sections:
                        if not s: continue
                        if s.get("sectionId") == "MEET_YOUR_HOST":
                            sec_data = s.get("section", {})
                            card_data = sec_data.get("cardData", {})
                            if card_data:
                                hosts.append({
                                    "name": card_data.get("name", ""),
                                    "role": card_data.get("titleText") or ("Anfitrión" if locale == "es" else "Host"),
                                    "profilePictureUrl": card_data.get("profilePictureUrl", ""),
                                    "isSuperhost": card_data.get("isSuperhost", False)
                                })
                            cohosts = sec_data.get("cohosts", [])
                            for co in cohosts:
                                hosts.append({
                                    "name": co.get("name", ""),
                                    "role": "Coanfitrión" if locale == "es" else "Co-host",
                                    "profilePictureUrl": co.get("profilePictureUrl", ""),
                                    "isSuperhost": False
                                })

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
                                
                                # Match titles for both English and Spanish Airbnb layouts
                                if item_title in ["El alojamiento", "The space"]:
                                    space = clean_text
                                elif item_title in ["Acceso de los huéspedes", "Guest access"]:
                                    access = clean_text
                                elif item_title in ["Otros aspectos para tener en cuenta", "Other things to note"]:
                                    notes = clean_text
                        
            except Exception as e:
                print(f"⚠️ Error parsing deferred state details for {locale}:", e)

        return {
            "title": title,
            "rating": rating,
            "reviewsCount": reviews_count,
            "description": description,
            "space": space,
            "access": access,
            "notes": notes,
            "amenities": amenities,
            "photos": photos,
            "capacityText": capacity_text,
            "guests": guests,
            "hosts": hosts
        }
    except Exception as e:
        print(f"❌ Error fetching listing for locale {locale}: {e}")
        return None

def fetch_csv(url):
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            lines = r.text.strip().split("\n")
            reader = csv.reader(lines)
            return list(reader)
    except Exception as e:
        print(f"⚠️ Error fetching CSV from {url}:", e)
    return None

def main():
    url_base = "https://www.airbnb.com.ar/rooms/1716762976739155303"
    print("Starting Bilingual Airbnb Sync...")
    
    # Fetch Spanish
    es_data = fetch_listing_for_locale(url_base, "es")
    # Fetch English
    en_data = fetch_listing_for_locale(url_base, "en")
    
    # Fetch Google Sheet configs
    cava_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlUx7LNTseRM1DhoYGmw-9ZfuWpobnDFF5pLt4AuIdMiLLVEqVN_54OTZm0YbMUTp3-iHsk6Dbx4YP/pub?gid=286973474&output=csv"
    config_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlUx7LNTseRM1DhoYGmw-9ZfuWpobnDFF5pLt4AuIdMiLLVEqVN_54OTZm0YbMUTp3-iHsk6Dbx4YP/pub?gid=1945005556&output=csv"
    
    print("Fetching configs from Google Sheets...")
    cava_raw = fetch_csv(cava_url)
    config_raw = fetch_csv(config_url)
    
    # Parse Config Sheet
    price = 500
    weekend_price = 600
    lockbox_code = "1579"
    if config_raw:
        try:
            # Map key-values
            for row in config_raw[1:]: # Skip header
                if len(row) >= 2:
                    key = row[0].strip()
                    val = row[1].strip()
                    if key == "precio_referencia_noche":
                        price = int(val)
                    elif key == "precio_referencia_fin_de_semana":
                        weekend_price = int(val)
                    elif key == "codigo_lockbox" or key == "lockbox":
                        lockbox_code = val
            print(f"Parsed Configs: price={price}, weekend_price={weekend_price}, lockbox_code={lockbox_code}")
        except Exception as e:
            print("⚠️ Error parsing Config sheet:", e)
            
    # Parse Cava Sheet
    cava_list = []
    if cava_raw:
        try:
            headers = [h.strip().lower() for h in cava_raw[0]]
            for row in cava_raw[1:]:
                if not row or not any(row): continue
                # Match values safely
                item = {}
                for idx, val in enumerate(row):
                    if idx < len(headers):
                        h = headers[idx]
                        if h.startswith("categoria"):
                            item["categoria"] = val.strip()
                        elif h == "nombre":
                            item["nombre"] = val.strip()
                        elif h == "descripcion":
                            item["descripcion"] = val.strip()
                        elif h == "cantidad":
                            item["cantidad"] = int(val.strip()) if val.strip().isdigit() else val.strip()
                        elif h == "precio_usd":
                            item["precio_usd"] = float(val.strip()) if val.strip().replace(".", "", 1).isdigit() else val.strip()
                cava_list.append(item)
            print(f"Parsed {len(cava_list)} Cava items.")
        except Exception as e:
            print("⚠️ Error parsing Cava sheet:", e)

    # Read existing details to preserve photos and ratings in case of fallback
    base_dir = os.path.dirname(os.path.abspath(__file__))
    target_file = os.path.abspath(os.path.join(base_dir, "..", "src", "data", "airbnb-details.json"))
    
    existing_data = {}
    if os.path.exists(target_file):
        try:
            with open(target_file, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except Exception:
            pass

    # Build final payload
    final_payload = {
        "rating": (es_data or en_data or existing_data).get("rating", 5.0),
        "reviewsCount": (es_data or en_data or existing_data).get("reviewsCount", 42),
        "photos": (es_data or en_data or existing_data).get("photos", []),
        "price": price,
        "weekendPrice": weekend_price,
        "cava": cava_list,
        "guests": (es_data or en_data or existing_data).get("guests", 4),
        "lockboxCode": lockbox_code,
        "es": es_data or existing_data.get("es", {}),
        "en": en_data or existing_data.get("en", {})
    }
    
    # Ensure directories exist
    os.makedirs(os.path.dirname(target_file), exist_ok=True)
    
    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(final_payload, f, indent=2, ensure_ascii=False)
    print(f"✅ Successfully wrote bilingual details & sheets data to {target_file}")
    
    # Trigger Next.js API Webhook if server is running locally
    try:
        webhook_url = "http://localhost:3000/api/sync-airbnb-webhook"
        print(f"Triggering Next.js API Webhook at {webhook_url}...")
        r_webhook = requests.post(webhook_url, json=final_payload, timeout=5)
        if r_webhook.status_code == 200:
            print("✅ Next.js API sync webhook triggered successfully!")
        else:
            print(f"⚠️ Webhook returned status: {r_webhook.status_code}")
    except Exception:
        pass

if __name__ == "__main__":
    main()
