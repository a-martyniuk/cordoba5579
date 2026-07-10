import os
import urllib.request
import zipfile
import io

FONT_DIR = os.path.join("public", "fonts")
os.makedirs(FONT_DIR, exist_ok=True)

FONTS_ZIP_URLS = {
    "Playfair_Display.zip": "https://gwfh.mranftl.com/api/fonts/playfair-display?download=zip&subsets=latin&variants=regular,700,italic&formats=ttf",
    "Plus_Jakarta_Sans.zip": "https://gwfh.mranftl.com/api/fonts/plus-jakarta-sans?download=zip&subsets=latin&variants=regular,700&formats=ttf"
}

def download_and_extract_fonts():
    print("Downloading and extracting fonts from gwfh.mranftl.com to", FONT_DIR)
    
    req_headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    for name, url in FONTS_ZIP_URLS.items():
        print(f"Downloading {name}...")
        try:
            req = urllib.request.Request(url, headers=req_headers)
            with urllib.request.urlopen(req) as response:
                zip_data = response.read()
                
            with zipfile.ZipFile(io.BytesIO(zip_data)) as z:
                # Extract all TTF files
                for zip_info in z.infolist():
                    if zip_info.filename.endswith(".ttf"):
                        # Get basename of the file to place it in public/fonts
                        basename = os.path.basename(zip_info.filename)
                        if not basename:
                            continue
                        dest_path = os.path.join(FONT_DIR, basename)
                        # Read contents and write to destination
                        with z.open(zip_info) as source, open(dest_path, "wb") as target:
                            target.write(source.read())
                        print(f"  [OK] Extracted: {basename} -> {dest_path}")
        except Exception as e:
            print(f"  [Error] Failed to process {name}: {e}")

if __name__ == "__main__":
    download_and_extract_fonts()
