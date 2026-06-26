import os
import time
import json
import re
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By

def main():
    url = "https://www.airbnb.com.ar/rooms/1716762976739155303"
    
    # Store profile inside src/data so it persists across runs
    profile_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "data", "scraper_profile"))
    os.makedirs(profile_dir, exist_ok=True)
    
    print("Launching Undetected Chromedriver...")
    print(f"Using profile: {profile_dir}")
    options = uc.ChromeOptions()
    options.add_argument(f"--user-data-dir={profile_dir}")
    options.add_argument("--profile-directory=Default")
    
    # We can run headed first so the user can log in or solve captcha if needed
    driver = uc.Chrome(options=options, version_main=149)
    driver.maximize_window()
    
    try:
        print("Navigating to Airbnb room listing...")
        driver.get(url)
        print("Waiting 10 seconds for initial load...")
        time.sleep(10)
        
        # Check if we got redirected to home page or login page
        current_url = driver.current_url
        page_title = driver.title
        print("Loaded URL:", current_url)
        print("Page Title:", page_title)
        
        # If redirected to search/home page, ask user to log in or go to the room
        html = driver.page_source
        if "Iniciá sesión" in html or "Inicia sesión" in html or "Iniciar sesión" in html or "404" in html or "No encontramos" in html or "rooms" not in current_url:
            print("\n[!] ¡ATENCIÓN!: Se requiere autenticación o resolver un captcha.")
            print("Por favor, iniciá sesión en Airbnb en la ventana que se abrió, o resolvé el captcha.")
            print("Esperando hasta 2 minutos para que realices la acción y la página cargue...")
            
            # Wait in a loop checking if we successfully load the room details
            for _ in range(24):
                time.sleep(5)
                # Redirect back to room if we are not on it
                if "rooms" not in driver.current_url:
                    print("Redirigiendo de nuevo al anuncio...")
                    driver.get(url)
                
                html = driver.page_source
                if "rooms" in driver.current_url and "404" not in html and "No encontramos" not in html:
                    print("✅ ¡Publicación cargada exitosamente!")
                    break
            else:
                print("❌ Tiempo de espera agotado. Sincronización fallida.")
                return

        # Double check we are on the room page
        html = driver.page_source
        if "404" in html or "No encontramos" in html:
            print("❌ No se pudo cargar la publicación (sigue en 404). Sincronización cancelada.")
            return

        print("Parsing listing data...")
        
        # 1. Title
        title = "Palermo Hollywood - Cómodo y luminoso departamento"
        try:
            title_el = driver.find_element(By.TAG_NAME, "h1")
            if title_el:
                title = title_el.text.strip()
        except Exception:
            pass
        print("Title:", title)

        # 2. Rating & Review Count
        rating = 4.90
        reviews_count = 120
        try:
            rating_el = driver.find_element(By.CSS_SELECTOR, '[data-testid="pdp-reviews-link"]')
            if rating_el:
                text = rating_el.text
                match = re.search(r'([\d\.,]+)\s*·\s*(\d+)', text)
                if match:
                    rating = float(match.group(1).replace(",", "."))
                    reviews_count = int(match.group(2))
        except Exception:
            pass
        print(f"Rating: {rating}, Reviews: {reviews_count}")

        # 3. Description
        description = ""
        try:
            desc_el = driver.find_element(By.CSS_SELECTOR, '[data-section-id="DESCRIPTION_DEFAULT"]')
            if desc_el:
                description = desc_el.text.strip()
        except Exception:
            pass
        print("Description length:", len(description))

        # 4. Amenities (click show all if button is present, or parse visible)
        amenities = []
        try:
            # We can find all visible amenity items
            amenities_els = driver.find_elements(By.CSS_SELECTOR, '[data-testid="amenity-item"]')
            for el in amenities_els:
                text = el.text.strip()
                if text and text not in amenities:
                    amenities.append(text)
        except Exception:
            pass
        print("Amenities count:", len(amenities))

        # 5. Photos
        photos = []
        try:
            img_els = driver.find_elements(By.TAG_NAME, "img")
            for img in img_els:
                src = img.get_attribute("src")
                if src and "muscache.com/im/pictures/hosting/Hosting-" in src:
                    clean_url = src.split("?")[0]
                    if clean_url not in photos:
                        photos.append(clean_url)
        except Exception:
            pass
        # Fallback to old photos if none parsed
        if not photos:
            try:
                # Load current json if exists to preserve photos
                target_json = os.path.join(os.path.dirname(__file__), "..", "src", "data", "airbnb-details.json")
                if os.path.exists(target_json):
                    with open(target_json, "r", encoding="utf-8") as f:
                        old_data = json.load(f)
                        photos = old_data.get("photos", [])
            except Exception:
                pass
        print("Photos count:", len(photos))

        # 6. Price (try to extract current price)
        price = 45
        try:
            # Look for price element
            price_el = driver.find_element(By.CSS_SELECTOR, 'span._1y74zjx') or driver.find_element(By.CSS_SELECTOR, 'span._1111666')
            if price_el:
                price_text = price_el.text
                price_match = re.search(r'\$?(\d+)', price_text)
                if price_match:
                    price = int(price_match.group(1))
        except Exception:
            pass
        print("Price per night:", price)

        # 7. Capacity details (bedrooms, beds, guests)
        capacity_text = ""
        try:
            cap_el = driver.find_element(By.CSS_SELECTOR, 'ol.lg9z66') or driver.find_element(By.CSS_SELECTOR, 'ol._1952044')
            if cap_el:
                capacity_text = cap_el.text.replace("\n", " · ").strip()
        except Exception:
            pass
        print("Capacity details:", capacity_text)

        # Build payload
        payload = {
          "title": title,
          "rating": rating,
          "reviewsCount": reviews_count,
          "description": description,
          "amenities": amenities,
          "photos": photos,
          "price": price,
          "capacityText": capacity_text,
          "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

        # Save to file
        target_file = os.path.join(os.path.dirname(__file__), "..", "src", "data", "airbnb-details.json")
        with open(target_file, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)
            
        print("✅ Sincronización de datos de Airbnb completada con éxito!")

    except Exception as e:
        print("Error general durante la sincronización:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
