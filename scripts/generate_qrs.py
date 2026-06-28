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
        "sublabel": "Escaneá para ver el menú",
        "color": "#5F6F52",         # Olive green
        "bg": "#FAF9F7",
    },
    {
        "name": "checkin",
        "url": f"{BASE_URL}/checkin",
        "label": "Check-In Digital",
        "sublabel": "Portal del Huésped",
        "color": "#3B5998",         # Deep blue
        "bg": "#F0F4FF",
    },
    {
        "name": "whatsapp",
        "url": WHATSAPP_URL,
        "label": "Contacto Directo",
        "sublabel": "WhatsApp con Jorge",
        "color": "#25D366",         # WhatsApp green
        "bg": "#F0FFF4",
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

    # Header bar
    draw.rectangle([(0, 0), (W, 80)], fill=code["color"])

    # Rounded card border (simulate with rectangle)
    border_margin = 30
    draw.rounded_rectangle(
        [border_margin, border_margin, W - border_margin, H - border_margin],
        radius=32,
        outline=code["color"],
        width=4
    )

    # Property name in header
    try:
        font_title = ImageFont.truetype("arial.ttf", 28)
        font_label = ImageFont.truetype("arial.ttf", 40)
        font_sublabel = ImageFont.truetype("arial.ttf", 26)
        font_url = ImageFont.truetype("arial.ttf", 20)
    except IOError:
        font_title = ImageFont.load_default()
        font_label = font_title
        font_sublabel = font_title
        font_url = font_title

    draw.text((W // 2, 40), "Córdoba 5579 · Palermo Hollywood", fill="white",
              font=font_title, anchor="mm")

    # QR code
    qr_img = make_qr(code["url"], code["color"], code["bg"])
    qr_size = 480
    qr_img = qr_img.resize((qr_size, qr_size), Image.LANCZOS)
    qr_x = (W - qr_size) // 2
    qr_y = 120
    card.paste(qr_img, (qr_x, qr_y), mask=qr_img)

    # Label
    draw.text((W // 2, qr_y + qr_size + 50), code["label"], fill=code["color"],
              font=font_label, anchor="mm")
    draw.text((W // 2, qr_y + qr_size + 100), code["sublabel"], fill="#666666",
              font=font_sublabel, anchor="mm")

    # Divider line
    y_div = qr_y + qr_size + 140
    draw.line([(80, y_div), (W - 80, y_div)], fill=code["color"], width=2)

    # URL hint at bottom
    draw.text((W // 2, y_div + 40), code["url"][:60], fill="#999999",
              font=font_url, anchor="mm")

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
