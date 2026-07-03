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
        "label": "Cava & Minibar",
        "sublabel": "Menú Digital de Vinos",
        "color": "#5F6F52",         # Olive green
        "bg": "#FAF9F7",
    },
    {
        "name": "checkin",
        "url": f"{BASE_URL}/checkin",
        "label": "Check-In Autónomo",
        "sublabel": "Guía de Ingreso y WiFi",
        "color": "#5F6F52",         # Olive green
        "bg": "#FAF9F7",
    },
    {
        "name": "whatsapp",
        "url": WHATSAPP_URL,
        "label": "Contacto Directo",
        "sublabel": "WhatsApp Anfitrión",
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
        font_title = ImageFont.truetype("georgiab.ttf", 38)
        font_label = ImageFont.truetype("segoeuib.ttf", 34) # Segoe UI Bold
        font_sublabel = ImageFont.truetype("segoeui.ttf", 22)
        font_url = ImageFont.truetype("segoeui.ttf", 16)
    except IOError:
        # Fallback to standard times / arial
        try:
            font_logo = ImageFont.truetype("timesbd.ttf", 26)
            font_title = ImageFont.truetype("timesbd.ttf", 38)
            font_label = ImageFont.truetype("arialbd.ttf", 34)
            font_sublabel = ImageFont.truetype("arial.ttf", 22)
            font_url = ImageFont.truetype("arial.ttf", 16)
        except IOError:
            font_logo = ImageFont.load_default()
            font_title = font_logo
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

    # Dynamic Title of the card
    draw.text((W // 2, 210), code["label"], fill=code["color"], font=font_title, anchor="mm")

    # QR code
    # Ensure QR background matches card background
    qr_img = make_qr(code["url"], code["color"], code["bg"])
    qr_size = 420
    qr_img = qr_img.resize((qr_size, qr_size), Image.LANCZOS)
    qr_x = (W - qr_size) // 2
    qr_y = 280
    
    # Draw a subtle background card container for the QR
    draw.rounded_rectangle(
        [qr_x - 15, qr_y - 15, qr_x + qr_size + 15, qr_y + qr_size + 15],
        radius=16,
        fill="white",
        outline="#EFEBE4",
        width=1
    )
    card.paste(qr_img, (qr_x, qr_y), mask=qr_img)

    # Sublabel
    draw.text((W // 2, 770), code["sublabel"], fill="#252824", font=font_label, anchor="mm")
    
    # Action instruction
    draw.text((W // 2, 820), "Escaneá el código QR con tu celular", fill="#888888", font=font_sublabel, anchor="mm")

    # Divider line
    y_div = 880
    draw.line([(120, y_div), (W - 120, y_div)], fill="#EFEBE4", width=1)

    # URL at bottom
    draw.text((W // 2, 920), code["url"], fill="#A0A0A0", font=font_url, anchor="mm")

    return card.convert("RGB")


def main():
    print("Generating QR Cards for Cordoba 5579...")
    for code in CODES:
        card = make_card(code)
        out_path = os.path.join(OUTPUT_DIR, f"qr_{code['name']}.png")
        card.save(out_path, "PNG", dpi=(300, 300))
        print(f"  [OK] Saved: {out_path}")
    print(f"\n[DONE] Find your print-ready QR cards in: {OUTPUT_DIR}")
    print("   Recommended print size: 10x12.5 cm at 300 DPI")


if __name__ == "__main__":
    main()
