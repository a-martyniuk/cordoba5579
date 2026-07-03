"""
QR Code Generator for Córdoba 5579
Generates print-ready QR codes for:
  - /cava  (minibar menu → place in minibar)
  - /checkin (check-in portal → place on coffee table)
  - WhatsApp (direct contact with Jorge → place anywhere)

Requirements:
  pip install qrcode[pil] pillow

Output: public/qr/ directory
Usage:  python scripts/generate_qrs.py
"""

import qrcode
import qrcode.image.svg
from PIL import Image, ImageDraw, ImageFont
import os
import io

BASE_URL = "https://www.alexismartyniuk.com.ar/cordoba5579"
WHATSAPP_URL = "https://wa.me/5491145379500?text=Hola%21%20Quería%20consultar%20disponibilidad%20para%20el%20departamento%20de%20Córdoba%205579."

CODES = [
    {
        "name": "cava",
        "url": f"{BASE_URL}/cava",
        "label_es": "Cava & Minibar",
        "label_en": "Wine Cellar & Minibar",
        "sublabel_es": "Menú Digital de Vinos",
        "sublabel_en": "Digital Wine Menu",
        "color": "#5F6F52",         # Olive green
        "bg": "#FAF9F7",
    },
    {
        "name": "checkin",
        "url": f"{BASE_URL}/checkin",
        "label_es": "Check-In Autónomo",
        "label_en": "Self Check-In",
        "sublabel_es": "Guía de Ingreso y WiFi",
        "sublabel_en": "Entry Guide & WiFi",
        "color": "#5F6F52",         # Olive green
        "bg": "#FAF9F7",
    },
    {
        "name": "whatsapp",
        "url": WHATSAPP_URL,
        "label_es": "Contacto Directo",
        "label_en": "Direct Contact",
        "sublabel_es": "WhatsApp Anfitrión",
        "sublabel_en": "Host WhatsApp",
        "color": "#5F6F52",         # Olive green
        "bg": "#FAF9F7",
    },
]

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "qr")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def make_qr(url: str, fg_color: str, bg_color: str) -> Image.Image:
    qr = qrcode.QRCode(
        version=3,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=14,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color=fg_color, back_color=bg_color).convert("RGBA")
    return img


def make_card(code: dict) -> Image.Image:
    """Wrap the QR in a premium print card (800×1000px)."""
    W, H = 800, 1000
    card = Image.new("RGBA", (W, H), code["bg"])
    draw = ImageDraw.Draw(card)

    # Use premium system fonts if available
    try:
        font_logo = ImageFont.truetype("georgiab.ttf", 26) # Georgia Bold for serif logo
        font_title_es = ImageFont.truetype("georgiab.ttf", 36)
        font_title_en = ImageFont.truetype("georgiai.ttf", 26) # Georgia Italic
        font_label = ImageFont.truetype("segoeuib.ttf", 26) # Segoe UI Bold
        font_sublabel = ImageFont.truetype("segoeui.ttf", 20)
        font_url = ImageFont.truetype("segoeui.ttf", 16)
    except IOError:
        # Fallback to standard times / arial
        try:
            font_logo = ImageFont.truetype("timesbd.ttf", 26)
            font_title_es = ImageFont.truetype("timesbd.ttf", 36)
            font_title_en = ImageFont.truetype("timesi.ttf", 26)
            font_label = ImageFont.truetype("arialbd.ttf", 26)
            font_sublabel = ImageFont.truetype("arial.ttf", 20)
            font_url = ImageFont.truetype("arial.ttf", 16)
        except IOError:
            font_logo = ImageFont.load_default()
            font_title_es = font_logo
            font_title_en = font_logo
            font_label = font_logo
            font_sublabel = font_logo
            font_url = font_logo

    # Draw a premium border
    margin = 40
    # Outer thin border
    draw.rounded_rectangle(
        [margin, margin, W - margin, H - margin],
        radius=24,
        outline="#EFEBE4", # Site light border
        width=2
    )
    # Inner elegant border
    draw.rounded_rectangle(
        [margin + 8, margin + 8, W - margin - 8, H - margin - 8],
        radius=16,
        outline=code["color"],
        width=1
    )

    # Top Brand Label (mimicking the site logo)
    logo_text = "CÓRDOBA 5579"
    draw.text((W // 2, 90), logo_text, fill="#252824", font=font_logo, anchor="mm")
    
    # Subtitle for logo
    draw.text((W // 2, 125), "PALERMO HOLLYWOOD", fill="#888888", font=font_url, anchor="mm")

    # Dynamic Title of the card (Bilingual Stacked)
    draw.text((W // 2, 195), code["label_es"], fill=code["color"], font=font_title_es, anchor="mm")
    draw.text((W // 2, 238), code["label_en"], fill="#889B73", font=font_title_en, anchor="mm")

    # QR code
    # Ensure QR background matches card background
    qr_img = make_qr(code["url"], code["color"], code["bg"])
    qr_size = 400
    qr_img = qr_img.resize((qr_size, qr_size), Image.LANCZOS)
    qr_x = (W - qr_size) // 2
    qr_y = 275
    
    # Draw a subtle background card container for the QR
    draw.rounded_rectangle(
        [qr_x - 15, qr_y - 15, qr_x + qr_size + 15, qr_y + qr_size + 15],
        radius=16,
        fill="white",
        outline="#EFEBE4",
        width=1
    )
    card.paste(qr_img, (qr_x, qr_y), mask=qr_img)

    # Sublabel (Combined on one line with separator)
    sublabel_text = f"{code['sublabel_es']}  •  {code['sublabel_en']}"
    draw.text((W // 2, 750), sublabel_text, fill="#252824", font=font_label, anchor="mm")
    
    # Action instructions (Bilingual Stacked)
    draw.text((W // 2, 795), "Escaneá el código QR con tu celular", fill="#888888", font=font_sublabel, anchor="mm")
    draw.text((W // 2, 825), "Scan the QR code with your phone", fill="#a3a3a3", font=font_sublabel, anchor="mm")

    # Divider line
    y_div = 880
    draw.line([(120, y_div), (W - 120, y_div)], fill="#EFEBE4", width=1)

    # URL at bottom
    draw.text((W // 2, 920), code["url"], fill="#A0A0A0", font=font_url, anchor="mm")

    return card.convert("RGB")


def make_unified_sheet() -> Image.Image:
    """Generate a single unified A4 portrait guide (2400×3400px) with all 3 QRs."""
    W, H = 2400, 3400
    card = Image.new("RGBA", (W, H), "#FAF9F7")
    draw = ImageDraw.Draw(card)

    # Use premium system fonts if available
    try:
        font_logo = ImageFont.truetype("georgiab.ttf", 60) # Large Serif Logo
        font_logo_sub = ImageFont.truetype("segoeui.ttf", 26)
        font_logo_tag = ImageFont.truetype("georgiai.ttf", 32)
        font_title_es = ImageFont.truetype("georgiab.ttf", 34)
        font_title_en = ImageFont.truetype("georgiai.ttf", 24)
        font_label = ImageFont.truetype("segoeuib.ttf", 22)
        font_sublabel = ImageFont.truetype("segoeui.ttf", 18)
        font_url = ImageFont.truetype("segoeui.ttf", 16)
        font_footer = ImageFont.truetype("georgiai.ttf", 32)
    except IOError:
        # Fallback to standard times / arial
        try:
            font_logo = ImageFont.truetype("timesbd.ttf", 60)
            font_logo_sub = ImageFont.truetype("arial.ttf", 26)
            font_logo_tag = ImageFont.truetype("timesi.ttf", 32)
            font_title_es = ImageFont.truetype("timesbd.ttf", 34)
            font_title_en = ImageFont.truetype("timesi.ttf", 26)
            font_label = ImageFont.truetype("arialbd.ttf", 22)
            font_sublabel = ImageFont.truetype("arial.ttf", 18)
            font_url = ImageFont.truetype("arial.ttf", 16)
            font_footer = ImageFont.truetype("timesi.ttf", 32)
        except IOError:
            font_logo = ImageFont.load_default()
            font_logo_sub = font_logo
            font_logo_tag = font_logo
            font_title_es = font_logo
            font_title_en = font_logo
            font_label = font_logo
            font_sublabel = font_logo
            font_url = font_logo
            font_footer = font_logo

    # Draw double border for A4 Sheet
    margin = 80
    draw.rounded_rectangle(
        [margin, margin, W - margin, H - margin],
        radius=40,
        outline="#EFEBE4", # Site light border
        width=4
    )
    draw.rounded_rectangle(
        [margin + 16, margin + 16, W - margin - 16, H - margin - 16],
        radius=28,
        outline="#5F6F52", # Brand olive
        width=2
    )

    # Header section
    draw.text((W // 2, 240), "CÓRDOBA 5579", fill="#252824", font=font_logo, anchor="mm")
    draw.text((W // 2, 310), "PALERMO HOLLYWOOD", fill="#888888", font=font_logo_sub, anchor="mm")
    draw.text((W // 2, 380), "Portal Digital de Huéspedes  •  Guest Services Directory", fill="#5F6F52", font=font_logo_tag, anchor="mm")

    # Header divider
    draw.line([(180, 460), (W - 180, 460)], fill="#EFEBE4", width=2)

    # 3 Column Centers
    col_centers = [480, 1200, 1920]
    
    # Render each QR card side-by-side
    for idx, code in enumerate(CODES):
        cx = col_centers[idx]
        
        # Draw a beautiful column card backing
        col_w = 600
        col_h = 2200
        cy = 1680 # Y Center of column bounds
        
        draw.rounded_rectangle(
            [cx - col_w//2, cy - col_h//2, cx + col_w//2, cy + col_h//2],
            radius=24,
            fill="#FAF9F7",
            outline="#EFEBE4",
            width=1
        )

        # Title Stacked
        draw.text((cx, 680), code["label_es"], fill=code["color"], font=font_title_es, anchor="mm")
        draw.text((cx, 725), code["label_en"], fill="#889B73", font=font_title_en, anchor="mm")

        # QR code
        qr_img = make_qr(code["url"], code["color"], "#FAF9F7")
        qr_size = 400
        qr_img = qr_img.resize((qr_size, qr_size), Image.LANCZOS)
        qr_x = cx - qr_size // 2
        qr_y = 780
        
        # QR backing
        draw.rounded_rectangle(
            [qr_x - 15, qr_y - 15, qr_x + qr_size + 15, qr_y + qr_size + 15],
            radius=16,
            fill="white",
            outline="#EFEBE4",
            width=1
        )
        card.paste(qr_img, (qr_x, qr_y), mask=qr_img)

        # Subtitle details (stacked)
        draw.text((cx, 1270), code["sublabel_es"], fill="#252824", font=font_label, anchor="mm")
        draw.text((cx, 1310), code["sublabel_en"], fill="#888888", font=font_sublabel, anchor="mm")

        # Action (stacked)
        draw.text((cx, 1380), "Escaneá con tu celular", fill="#a3a3a3", font=font_sublabel, anchor="mm")
        draw.text((cx, 1410), "Scan with your phone", fill="#c2c2c2", font=font_url, anchor="mm")

        # Column Divider
        draw.line([(cx - 150, 1470), (cx + 150, 1470)], fill="#EFEBE4", width=1)

        # Dynamic URL
        draw.text((cx, 1515), code["url"].replace("https://www.", ""), fill="#A0A0A0", font=font_url, anchor="mm")

    # Translate column positions to fit in A4 Grid (Y offsets)
    # The above loop Y coordinates were relative, but let's shift the elements down appropriately:
    # Top of columns = 550, Bottom = 3000
    
    # We will clear column content drawing area and redraw with absolute positions to prevent overlap.
    # Redraw everything on top of the card
    # To keep it extremely precise, let's draw:
    for idx, code in enumerate(CODES):
        cx = col_centers[idx]
        
        # 1. Column card backing
        draw.rounded_rectangle(
            [cx - 280, 520, cx + 280, 2920],
            radius=20,
            fill="white",
            outline="#EFEBE4",
            width=1
        )
        
        # 2. Icon placeholder / top bar
        draw.rounded_rectangle(
            [cx - 280, 520, cx + 280, 545],
            radius=20,
            fill=code["color"]
        )
        # Cover bottom corners of top bar
        draw.rectangle([cx - 280, 535, cx + 280, 545], fill=code["color"])

        # 3. Titles
        draw.text((cx, 620), code["label_es"], fill="#252824", font=font_title_es, anchor="mm")
        draw.text((cx, 665), code["label_en"], fill="#5F6F52", font=font_title_en, anchor="mm")

        # 4. QR Code
        qr_img = make_qr(code["url"], code["color"], "white")
        qr_size = 420
        qr_img = qr_img.resize((qr_size, qr_size), Image.LANCZOS)
        qr_x = cx - qr_size // 2
        qr_y = 730
        
        # QR Backing outline
        draw.rounded_rectangle(
            [qr_x - 10, qr_y - 10, qr_x + qr_size + 10, qr_y + qr_size + 10],
            radius=16,
            fill="white",
            outline="#FAF9F7",
            width=3
        )
        card.paste(qr_img, (qr_x, qr_y), mask=qr_img)

        # 5. Divider
        draw.line([(cx - 180, 1220), (cx + 180, 1220)], fill="#EFEBE4", width=1)

        # 6. Description / Sublabels
        draw.text((cx, 1280), code["sublabel_es"], fill="#252824", font=font_label, anchor="mm")
        draw.text((cx, 1320), code["sublabel_en"], fill="#888888", font=font_sublabel, anchor="mm")

        # 7. Action instruction
        draw.text((cx, 1390), "Escaneá el código con tu celular", fill="#888888", font=font_sublabel, anchor="mm")
        draw.text((cx, 1425), "Scan the QR code with your phone", fill="#a3a3a3", font=font_sublabel, anchor="mm")

        # 8. Web URL
        draw.text((cx, 1485), code["url"].replace("https://", ""), fill="#B0B0B0", font=font_url, anchor="mm")

    # Bottom Footer section
    draw.line([(300, 3050), (W - 300, 3050)], fill="#EFEBE4", width=2)
    draw.text((W // 2, 3140), "¡Que disfrutes tu estadía!  •  Enjoy your stay!", fill="#5F6F52", font=font_footer, anchor="mm")

    return card.convert("RGB")


def main():
    print("Generating QR Cards for Cordoba 5579...")
    for code in CODES:
        card = make_card(code)
        out_path = os.path.join(OUTPUT_DIR, f"qr_{code['name']}.png")
        card.save(out_path, "PNG", dpi=(300, 300))
        print(f"  [OK] Saved: {out_path}")
        
    print("\nGenerating Unified Guide Sheet...")
    sheet = make_unified_sheet()
    sheet_path = os.path.join(OUTPUT_DIR, "qr_unified_sheet.png")
    sheet.save(sheet_path, "PNG", dpi=(300, 300))
    print(f"  [OK] Saved: {sheet_path}")
    
    print(f"\n[DONE] Find your print-ready QR cards in: {OUTPUT_DIR}")
    print("   Recommended print size: 10x12.5 cm at 300 DPI")


if __name__ == "__main__":
    main()
