import os
import sys
import json
import csv
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, Color
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image as RLImage
from reportlab.platypus.flowables import Flowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
OUTPUT_DIR = "public"
OUTPUT_PDF = os.path.join(OUTPUT_DIR, "manual_cordoba5579.pdf")

# Load Texts
TEXTS_FILE = os.path.join(os.path.dirname(__file__), "textos_es.json")
with open(TEXTS_FILE, "r", encoding="utf-8") as f:
    t = json.load(f)

# Register system fonts with fallback
def register_fonts():
    font_paths = {
        "Georgia": ("public/fonts/playfair-display-v40-latin-regular.ttf", "Times-Roman"),
        "Georgia-Bold": ("public/fonts/playfair-display-v40-latin-700.ttf", "Times-Bold"),
        "Georgia-Italic": ("public/fonts/playfair-display-v40-latin-italic.ttf", "Times-Italic"),
        "SegoeUI": ("public/fonts/plus-jakarta-sans-v12-latin-regular.ttf", "Helvetica"),
        "SegoeUI-Bold": ("public/fonts/plus-jakarta-sans-v12-latin-700.ttf", "Helvetica-Bold"),
    }
    
    registered = {}
    for name, (full_path, fallback) in font_paths.items():
        if os.path.exists(full_path):
            try:
                pdfmetrics.registerFont(TTFont(name, full_path))
                registered[name] = name
            except Exception:
                registered[name] = fallback
        else:
            registered[name] = fallback
    return registered

FONTS = register_fonts()

# Color Palette
COLOR_PRIMARY = HexColor('#5F6F52')
COLOR_DARK = HexColor('#252824')
COLOR_LIGHT_BG = HexColor('#FAF9F7')
COLOR_BORDER = HexColor('#EFEBE4')
COLOR_GRAY = HexColor('#888888')
COLOR_LIGHT_GRAY = HexColor('#a3a3a3')
COLOR_ALERT_BG = HexColor('#FDFBF7')
COLOR_ACCENT = HexColor('#C8A261')

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []
        self.draw_page_background()

    def draw_page_background(self):
        self.saveState()
        W, H = A4
        if self._pageNumber == 1:
            try:
                self.drawImage("public/img/cover_background.jpg", 0, 0, width=W, height=H, preserveAspectRatio=False)
                self.setFillColor(Color(0.1, 0.1, 0.1, alpha=0.3))
                self.rect(0, 0, W, H, fill=True, stroke=False)
            except Exception:
                self.setFillColor(COLOR_PRIMARY)
                self.rect(0, 0, W, H, fill=True, stroke=False)
        else:
            self.setFillColor(COLOR_LIGHT_BG)
            self.rect(0, 0, W, H, fill=True, stroke=False)
        self.restoreState()

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()
        self.draw_page_background()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        W, H = A4
        if self._pageNumber == 1:
            self.saveState()
            self.setStrokeColor(HexColor('#FAF9F7'))
            self.setLineWidth(1)
            self.rect(30, 30, W - 60, H - 60, fill=False, stroke=True)
            self.restoreState()
            return
            
        if self._pageNumber == page_count:
            self.saveState()
            self.setStrokeColor(COLOR_PRIMARY)
            self.setLineWidth(2)
            self.rect(30, 30, W - 60, H - 60, fill=False, stroke=True)
            self.restoreState()
            return

        self.saveState()
        self.setStrokeColor(COLOR_BORDER)
        self.setLineWidth(0.75)
        self.rect(54, 54, W - 108, H - 108, fill=False, stroke=True)

        self.setFont(FONTS["Georgia-Bold"], 9)
        self.setFillColor(COLOR_PRIMARY)
        self.drawString(64, 805, t["cover"]["title"])
        
        self.setFont(FONTS["Georgia-Italic"], 9)
        self.setFillColor(COLOR_GRAY)
        self.drawRightString(W - 64, 805, "Manual del Huésped")
        
        self.setStrokeColor(COLOR_BORDER)
        self.setLineWidth(1)
        self.line(64, 795, W - 64, 795)
        
        self.line(64, 50, W - 64, 50)
        
        self.setFont(FONTS["SegoeUI"], 8)
        self.setFillColor(COLOR_GRAY)
        self.drawString(64, 34, "alexismartyniuk.com.ar/cordoba5579")
        self.drawRightString(W - 64, 34, f"Página {self._pageNumber} de {page_count}")
        
        self.restoreState()

class Bookmark(Flowable):
    """Saves the current page number into a provided dictionary during the drawing phase."""
    def __init__(self, key, page_map):
        Flowable.__init__(self)
        self.key = key
        self.page_map = page_map
        self.width = 0
        self.height = 0

    def draw(self):
        self.page_map[self.key] = self.canv.getPageNumber()

def build_card_table(data, col_widths, background=COLOR_LIGHT_BG, border=COLOR_BORDER, box_width=0.5, padding=8):
    """Centralized table factory for styled content cards."""
    table = Table(data, colWidths=col_widths)
    table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), box_width, border),
        ('TOPPADDING', (0,0), (-1,-1), padding),
        ('BOTTOMPADDING', (0,0), (-1,-1), padding),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return table

def build_pdf(page_map=None):
    if page_map is None:
        page_map = {}
        
    doc = SimpleDocTemplate(OUTPUT_PDF, pagesize=A4, leftMargin=68, rightMargin=68, topMargin=75, bottomMargin=75)
    styles = getSampleStyleSheet()
    
    style_normal = ParagraphStyle('AppNormal', parent=styles['Normal'], fontName=FONTS['SegoeUI'], fontSize=10, leading=15, textColor=COLOR_DARK)
    style_normal_bold = ParagraphStyle('AppNormalBold', parent=style_normal, fontName=FONTS['SegoeUI-Bold'])
    style_header_cell = ParagraphStyle('HeaderCell', parent=style_normal_bold, textColor=HexColor('#FFFFFF'))
    style_body_italic = ParagraphStyle('AppNormalItalic', parent=style_normal, fontName=FONTS['Georgia-Italic'], textColor=COLOR_GRAY)
    
    style_title_main = ParagraphStyle('TitleMain', fontName=FONTS['Georgia-Bold'], fontSize=38, leading=46, textColor=HexColor('#FFFFFF'), alignment=TA_CENTER)
    style_title_sub = ParagraphStyle('TitleSub', fontName=FONTS['SegoeUI'], fontSize=14, leading=20, textColor=HexColor('#EFEBE4'), alignment=TA_CENTER)
    style_title_tag = ParagraphStyle('TitleTag', fontName=FONTS['Georgia-Italic'], fontSize=20, leading=26, textColor=HexColor('#FFFFFF'), alignment=TA_CENTER)
    
    style_h1 = ParagraphStyle('AppH1', fontName=FONTS['Georgia-Bold'], fontSize=22, leading=26, textColor=COLOR_PRIMARY, spaceBefore=15, spaceAfter=8)
    style_h2 = ParagraphStyle('AppH2', fontName=FONTS['Georgia-Italic'], fontSize=14, leading=18, textColor=COLOR_GRAY, spaceBefore=8, spaceAfter=8)
    style_h3 = ParagraphStyle('AppH3', fontName=FONTS['SegoeUI-Bold'], fontSize=11, leading=14, textColor=COLOR_DARK, spaceBefore=6, spaceAfter=4)
    
    style_card_title = ParagraphStyle('CardTitle', fontName=FONTS['Georgia-Bold'], fontSize=12, leading=15, textColor=COLOR_PRIMARY)
    style_card_body = ParagraphStyle('CardBody', fontName=FONTS['SegoeUI'], fontSize=9, leading=13, textColor=COLOR_DARK)
    style_card_warning = ParagraphStyle('CardWarning', fontName=FONTS['SegoeUI'], fontSize=9, leading=13, textColor=HexColor('#9E2A2B'))
    
    story = []
    
    # ---- PAGE 1: COVER ----
    story.append(Bookmark("cover", page_map))
    story.append(Spacer(1, 140))
    story.append(Paragraph(t["cover"]["title"], style_title_main))
    story.append(Spacer(1, 10))
    story.append(Paragraph(t["cover"]["subtitle"], style_title_sub))
    story.append(Spacer(1, 40))
    
    logo_line = Table([[""]], colWidths=[150], rowHeights=[2])
    logo_line.setStyle(TableStyle([('LINEBELOW', (0,0), (-1,-1), 2, HexColor('#FAF9F7')), ('ALIGN', (0,0), (-1,-1), 'CENTER')]))
    story.append(logo_line)
    story.append(Spacer(1, 40))
    
    story.append(Paragraph(t["cover"]["tag"], style_title_tag))
    story.append(Spacer(1, 240))
    story.append(Paragraph(t["cover"]["footer"], ParagraphStyle('CoverFooter', fontName=FONTS['SegoeUI-Bold'], fontSize=11, textColor=HexColor('#FAF9F7'), alignment=TA_CENTER)))
    story.append(PageBreak())
    
    # ---- PAGE 2: TOC ----
    story.append(Bookmark("toc", page_map))
    story.append(Paragraph(t["toc_page"]["title"], style_h1))
    story.append(Paragraph(t["toc_page"]["subtitle"], style_h2))
    story.append(Spacer(1, 10))
    
    # Quick Info
    qr_code = qr.QrCodeWidget("WIFI:T:WPA;S:Cordoba5579_Guest;P:Welcome101;;")
    qr_code.barWidth = 65
    qr_code.barHeight = 65
    qr_code.barFillColor = COLOR_PRIMARY
    qr_code.qrVersion = 1
    d = Drawing(65, 65)
    d.add(qr_code)
    
    q_info = t["toc_page"]["quick_info"]
    info_data = [
        [
            Table([
                [d, Paragraph(f"<b>{q_info[0]['title']}</b><br/>{q_info[0]['content']}<br/><i>(Escanee para conectar)</i>", style_card_body)]
            ], colWidths=[70, 160], style=[('VALIGN', (0,0), (-1,-1), 'MIDDLE')]),
            Paragraph(f"<b>{q_info[2]['title']}</b><br/>{q_info[2]['content']}", style_card_body)
        ],
        [
            Paragraph(f"<b>{q_info[1]['title']}</b><br/>{q_info[1]['content']}", style_card_body),
            Paragraph(f"<b>{q_info[3]['title']}</b><br/>{q_info[3]['content']}", style_card_body)
        ]
    ]
    info_table = Table(info_data, colWidths=[230, 230])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_ALERT_BG),
        ('BOX', (0,0), (-1,-1), 1, COLOR_PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 20))
    
    # TOC
    story.append(Paragraph(f"<b>{t['toc_page']['toc_header']}</b>", style_h3))
    
    def get_page(key):
        return str(page_map.get(key, "-"))

    toc_data = [
        [Paragraph("1. Bienvenida & Cómo llegar", style_normal), Paragraph(f"Pág. {get_page('welcome')}", style_normal_bold)],
        [Paragraph("2. Check-In Autónomo (Lockbox)", style_normal), Paragraph(f"Pág. {get_page('checkin')}", style_normal_bold)],
        [Paragraph("3. Climatización & Caja Fuerte", style_normal), Paragraph(f"Pág. {get_page('climate_safe')}", style_normal_bold)],
        [Paragraph("4. Cocina, Cafetera & Cava de Vinos", style_normal), Paragraph(f"Pág. {get_page('kitchen')}", style_normal_bold)],
        [Paragraph("5. Amenities del Edificio (Laundry & SUM)", style_normal), Paragraph(f"Pág. {get_page('amenities')}", style_normal_bold)],
        [Paragraph("6. Guía Comercial y Atracciones del Barrio", style_normal), Paragraph(f"Pág. {get_page('guide')}", style_normal_bold)],
        [Paragraph("7. Tips Locales para Turistas", style_normal), Paragraph(f"Pág. {get_page('local_tips')}", style_normal_bold)],
        [Paragraph("8. Normas de Convivencia", style_normal), Paragraph(f"Pág. {get_page('rules')}", style_normal_bold)],
        [Paragraph("9. Limpieza, Residuos & Cuidado Sanitario", style_normal), Paragraph(f"Pág. {get_page('cleaning')}", style_normal_bold)],
        [Paragraph("10. Seguridad, Cortes de Luz & Emergencias", style_normal), Paragraph(f"Pág. {get_page('security')}", style_normal_bold)],
        [Paragraph("11. Inventario del Departamento", style_normal), Paragraph(f"Pág. {get_page('inventory')}", style_normal_bold)],
        [Paragraph("12. Preguntas Frecuentes (FAQs)", style_normal), Paragraph(f"Pág. {get_page('faq')}", style_normal_bold)],
        [Paragraph("13. Check-Out Checklist", style_normal), Paragraph(f"Pág. {get_page('checkout')}", style_normal_bold)],
    ]
    toc_table = build_card_table(toc_data, [400, 60], padding=6)
    story.append(toc_table)
    story.append(Spacer(1, 20))
    
    try:
        qr_portal = RLImage("public/qr/qr_portal.png", width=65, height=65)
        qr_whatsapp = RLImage("public/qr/qr_whatsapp.png", width=65, height=65)
        qr_table = Table([
            [qr_portal, Paragraph(t["shared"]["qr_portal"], style_card_body),
             qr_whatsapp, Paragraph(t["shared"]["qr_whatsapp"], style_card_body)]
        ], colWidths=[70, 160, 70, 160])
        qr_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('RIGHTPADDING', (0,0), (-1,-1), 10)]))
        story.append(qr_table)
    except Exception:
        pass
    story.append(PageBreak())
    
    # ---- PAGE 3: WELCOME ----
    story.append(Bookmark("welcome", page_map))
    story.append(Paragraph(t["welcome"]["title"], style_h1))
    story.append(Paragraph(t["welcome"]["subtitle"], style_h2))
    story.append(Spacer(1, 15))
    story.append(Paragraph(t["welcome"]["intro"], style_normal))
    story.append(Spacer(1, 25))
    story.append(Paragraph(t["welcome"]["directions_title"], style_h3))
    story.append(Paragraph(t["welcome"]["directions_intro"], style_normal))
    story.append(Spacer(1, 10))
    arrive_data = [[Paragraph(f"<b>{i['title']}</b>", style_normal_bold), Paragraph(i['content'], style_normal)] for i in t["welcome"]["directions"]]
    story.append(build_card_table(arrive_data, [120, 340]))
    story.append(PageBreak())
    
    # ---- PAGE 4: CHECK-IN ----
    story.append(Bookmark("checkin", page_map))
    story.append(Paragraph(t["checkin"]["title"], style_h1))
    story.append(Paragraph(t["checkin"]["subtitle"], style_h2))
    story.append(Spacer(1, 15))
    story.append(Paragraph(t["checkin"]["intro"], style_normal))
    story.append(Spacer(1, 15))
    steps_data = [[Paragraph(f"<font color='#5F6F52'><b>{i['step']}</b></font>", style_normal_bold), Paragraph(i['content'], style_normal)] for i in t["checkin"]["steps"]]
    story.append(build_card_table(steps_data, [80, 380], padding=10))
    story.append(Spacer(1, 20))
    
    caution_data = [[Paragraph(f"<b>{t['checkin']['caution_title']}</b><br/>{t['checkin']['caution']}", style_card_warning)]]
    caution_table = Table(caution_data, colWidths=[460])
    caution_table.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), HexColor('#FFF0F0')), ('BOX', (0,0), (-1,-1), 1, HexColor('#FFC1C1')), ('PADDING', (0,0), (-1,-1), 12)]))
    story.append(caution_table)
    story.append(PageBreak())
    
    # ---- PAGE 5: CLIMATE & SAFE ----
    story.append(Bookmark("climate_safe", page_map))
    story.append(Paragraph(t["climate_safe"]["title"], style_h1))
    story.append(Paragraph(t["climate_safe"]["subtitle"], style_h2))
    story.append(Spacer(1, 15))
    story.append(Paragraph(t["climate_safe"]["door"], style_normal))
    story.append(Spacer(1, 15))
    story.append(Paragraph(t["climate_safe"]["ac_intro"], style_normal))
    story.append(Spacer(1, 10))
    ac_data = [[Paragraph(f"<b>{i['title']}</b>", style_normal_bold), Paragraph(i['content'], style_normal)] for i in t["climate_safe"]["ac_items"]]
    story.append(build_card_table(ac_data, [130, 330]))
    story.append(Spacer(1, 20))
    story.append(Paragraph(t["climate_safe"]["safe_title"], style_h3))
    story.append(Paragraph(t["climate_safe"]["safe_content"], style_normal))
    story.append(PageBreak())
    
    # ---- PAGE 6: KITCHEN ----
    story.append(Bookmark("kitchen", page_map))
    story.append(Paragraph(t["kitchen"]["title"], style_h1))
    story.append(Paragraph(t["kitchen"]["subtitle"], style_h2))
    story.append(Spacer(1, 15))
    story.append(Paragraph(t["kitchen"]["intro"], style_normal))
    story.append(Spacer(1, 10))
    kitchen_data = [[Paragraph(f"<b>{i['title']}</b>", style_normal_bold), Paragraph(i['content'], style_normal)] for i in t["kitchen"]["items"]]
    story.append(build_card_table(kitchen_data, [140, 320]))
    story.append(Spacer(1, 20))
    story.append(Paragraph(t["kitchen"]["cava_title"], style_h3))
    story.append(Paragraph(t["kitchen"]["cava_content"], style_normal))
    story.append(Spacer(1, 15))
    try:
        qr_cava = RLImage("public/qr/qr_cava.png", width=65, height=65)
        qr_whats = RLImage("public/qr/qr_whatsapp.png", width=65, height=65)
        cava_qr_table = Table([[qr_cava, Paragraph(t["shared"]["qr_cava_inv"], style_card_body), qr_whats, Paragraph(t["shared"]["qr_cava_chat"], style_card_body)]], colWidths=[70, 160, 70, 160])
        cava_qr_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('RIGHTPADDING', (0,0), (-1,-1), 10)]))
        story.append(cava_qr_table)
    except Exception:
        pass
    story.append(PageBreak())
    
    # ---- PAGE 7: AMENITIES ----
    story.append(Bookmark("amenities", page_map))
    story.append(Paragraph(t["amenities"]["title"], style_h1))
    story.append(Paragraph(t["amenities"]["subtitle"], style_h2))
    story.append(Spacer(1, 15))
    story.append(Paragraph(t["amenities"]["laundry_intro"], style_normal))
    story.append(Spacer(1, 10))
    laundry_data = [[Paragraph(f"<b>{i['title']}</b>", style_normal_bold), Paragraph(i['content'], style_normal)] for i in t["amenities"]["laundry_items"]]
    story.append(build_card_table(laundry_data, [120, 340]))
    story.append(Spacer(1, 25))
    story.append(Paragraph(t["amenities"]["sum_intro"], style_normal))
    story.append(Spacer(1, 10))
    sum_data = [[Paragraph(f"<b>{i['title']}</b>", style_normal_bold), Paragraph(i['content'], style_normal)] for i in t["amenities"]["sum_items"]]
    story.append(build_card_table(sum_data, [120, 340]))
    story.append(PageBreak())
    
    # ---- PAGE 8: GUIDE ----
    story.append(Bookmark("guide", page_map))
    story.append(Paragraph(t["guide"]["title"], style_h1))
    story.append(Paragraph(t["guide"]["subtitle"], style_h2))
    story.append(Spacer(1, 15))
    story.append(Paragraph(t["guide"]["intro"], style_normal))
    story.append(Spacer(1, 15))
    
    # Integrate Mini Map here
    try:
        map_img = RLImage("public/img/mapa_palermo.png", width=460, height=240, kind="proportional")
        story.append(map_img)
        story.append(Spacer(1, 15))
    except Exception as e:
        print(f"Map image not found or error: {e}")
        pass
    
    guide_data = [[Paragraph(f"<b>{i['title']}</b>", style_normal_bold), Paragraph(i['content'], style_normal)] for i in t["guide"]["items"]]
    story.append(build_card_table(guide_data, [160, 300], padding=10))
    story.append(Spacer(1, 20))
    story.append(Paragraph(t["guide"]["tip"], style_body_italic))
    story.append(PageBreak())
    
    # ---- PAGE 9: LOCAL TIPS ----
    story.append(Bookmark("local_tips", page_map))
    story.append(Paragraph(t["local_tips"]["title"], style_h1))
    story.append(Paragraph(t["local_tips"]["subtitle"], style_h2))
    story.append(Spacer(1, 15))
    story.append(Paragraph(t["local_tips"]["intro"], style_normal))
    story.append(Spacer(1, 15))
    tips_data = []
    for i in t["local_tips"]["items"]:
        if "qr_link" in i:
            qr_w = qr.QrCodeWidget(i["qr_link"])
            qr_w.barWidth = 60
            qr_w.barHeight = 60
            qr_w.barFillColor = COLOR_PRIMARY
            qr_w.qrVersion = 1
            d = Drawing(60, 60)
            d.add(qr_w)
            tips_data.append([d, Paragraph(f"<b>{i['title']}</b>", style_card_title), Paragraph(i['content'], style_card_body)])
        else:
            tips_data.append(["", Paragraph(f"<b>{i['title']}</b>", style_card_title), Paragraph(i['content'], style_card_body)])
    story.append(build_card_table(tips_data, [65, 125, 270], padding=12))
    story.append(PageBreak())
    
    # ---- PAGE 10: RULES ----
    story.append(Bookmark("rules", page_map))
    story.append(Paragraph(t["rules"]["title"], style_h1))
    story.append(Spacer(1, 15))
    story.append(Paragraph(t["rules"]["intro"], style_normal))
    story.append(Spacer(1, 15))
    icon_map = ["icon_smoke.png", "icon_pet.png", "icon_noise.png", "icon_visitor.png", "icon_clothes.png"]
    rules_data = []
    for idx, item in enumerate(t["rules"]["items"]):
        icon_path = f"public/img/{icon_map[idx]}" if idx < 5 else None
        if icon_path and os.path.exists(icon_path):
            img = RLImage(icon_path, width=32, height=32, kind='proportional')
            rules_data.append([img, Paragraph(f"<b>{item['title']}</b>", style_card_title), Paragraph(item['content'], style_card_body)])
        else:
            rules_data.append(["", Paragraph(f"<b>{item['title']}</b>", style_card_title), Paragraph(item['content'], style_card_body)])
    story.append(build_card_table(rules_data, [45, 115, 300], padding=10))
    story.append(Spacer(1, 20))
    rule_note = [[Paragraph(t["rules"]["penalty"], style_card_warning)]]
    rule_note_table = Table(rule_note, colWidths=[460])
    rule_note_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_ALERT_BG),
        ('TEXTCOLOR', (0,0), (-1,-1), HexColor('#D32F2F')),
        ('BOX', (0,0), (-1,-1), 1, HexColor('#FFCDD2')),
        ('PADDING', (0,0), (-1,-1), 10)
    ]))
    story.append(rule_note_table)
    story.append(PageBreak())
    
    # ---- PAGE 11: CLEANING ----
    story.append(Bookmark("cleaning", page_map))
    story.append(Paragraph(t["cleaning"]["title"], style_h1))
    story.append(Paragraph(t["cleaning"]["subtitle"], style_h2))
    story.append(Spacer(1, 15))
    story.append(Paragraph(t["cleaning"]["garbage"], style_normal))
    story.append(Spacer(1, 20))
    story.append(Paragraph(t["cleaning"]["plumbing_intro"], style_normal))
    story.append(Spacer(1, 10))
    plumb_data = [[Paragraph(t["cleaning"]["plumbing_warning"], style_card_warning)]]
    plumb_table = Table(plumb_data, colWidths=[460])
    plumb_table.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), HexColor('#FFF0F0')), ('BOX', (0,0), (-1,-1), 1.5, HexColor('#FFC1C1')), ('PADDING', (0,0), (-1,-1), 14)]))
    story.append(plumb_table)
    story.append(Spacer(1, 25))
    story.append(Paragraph(t["cleaning"]["linen"], style_normal))
    story.append(PageBreak())
    
    # ---- PAGE 12: SECURITY ----
    story.append(Bookmark("security", page_map))
    story.append(Paragraph(t["security"]["title"], style_h1))
    story.append(Paragraph(t["security"]["subtitle"], style_h2))
    story.append(Spacer(1, 15))
    story.append(Paragraph(t["security"]["intro"], style_normal))
    story.append(Spacer(1, 15))
    sec_data = [[Paragraph(f"<b>{i['title']}</b>", style_card_title), Paragraph(i['content'], style_card_body)] for i in t["security"]["items"]]
    story.append(build_card_table(sec_data, [140, 320], padding=12))
    story.append(PageBreak())
    
    # ---- PAGE 13: INVENTORY ----
    story.append(Bookmark("inventory", page_map))
    story.append(Paragraph(t["inventory"]["title"], style_h1))
    story.append(Spacer(1, 10))
    story.append(Paragraph(t["inventory"]["intro"], style_normal))
    story.append(Spacer(1, 15))
    
    inv_rows = []
    inv_rows.append([Paragraph(f"<b>{h}</b>", style_header_cell) for h in t["inventory"]["headers"]])
    table_styles = [('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY), ('TEXTCOLOR', (0,0), (-1,0), HexColor('#FFFFFF')), ('ALIGN', (0,0), (-1,-1), 'LEFT'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('PADDING', (0,0), (-1,-1), 5), ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER)]
    
    csv_path = "inventario.csv"
    current_category = None
    if os.path.exists(csv_path):
        with open(csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
            try: next(reader)
            except: pass
            for row in reader:
                if not row or len(row) < 4: continue
                cat, item, qty, detail = [x.strip() for x in row[:4]]
                if cat != current_category:
                    current_category = cat
                    idx = len(inv_rows)
                    inv_rows.append([Paragraph(f"<b>{current_category.upper()}</b>", ParagraphStyle(f'Cat_{idx}', parent=style_normal_bold, textColor=COLOR_PRIMARY)), "", ""])
                    table_styles.extend([('SPAN', (0, idx), (2, idx)), ('BACKGROUND', (0, idx), (-1, idx), HexColor('#FAF9F7')), ('PADDING', (0, idx), (-1, idx), 7)])
                inv_rows.append([Paragraph(item, style_card_body), Paragraph(qty, style_card_body), Paragraph(detail, style_card_body)])
                
    if len(inv_rows) <= 1:
        inv_rows.append([Paragraph("No se encontró el archivo de inventario.", style_normal), "", ""])
        table_styles.append(('SPAN', (0, 1), (2, 1)))
        
    inv_table = Table(inv_rows, colWidths=[200, 60, 199], repeatRows=1)
    inv_table.setStyle(TableStyle(table_styles))
    story.append(inv_table)
    story.append(Spacer(1, 20))
    
    try:
        qr_inv = RLImage("public/qr/qr_inventario.png", width=65, height=65)
        inv_qr_table = Table([[qr_inv, Paragraph(t["inventory"]["warning"], style_card_body)]], colWidths=[80, 380])
        inv_qr_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('BACKGROUND', (0,0), (-1,-1), COLOR_ALERT_BG), ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER), ('PADDING', (0,0), (-1,-1), 10)]))
        story.append(inv_qr_table)
    except Exception:
        story.append(Paragraph(t["inventory"]["warning"], style_normal))
    story.append(PageBreak())
    
    # ---- PAGE 14: FAQ ----
    story.append(Bookmark("faq", page_map))
    story.append(Paragraph(t["faq"]["title"], style_h1))
    story.append(Paragraph(t["faq"]["subtitle"], style_h2))
    story.append(Spacer(1, 15))
    for item in t["faq"]["items"]:
        story.append(Paragraph(f"<b>• {item['q']}</b>", style_normal_bold))
        story.append(Paragraph(item['a'], style_normal))
        story.append(Spacer(1, 14))
    story.append(PageBreak())
    
    # ---- PAGE 15: CHECKOUT ----
    story.append(Bookmark("checkout", page_map))
    story.append(Paragraph(t["checkout"]["title"], style_h1))
    story.append(Paragraph(t["checkout"]["subtitle"], style_h2))
    story.append(Spacer(1, 15))
    story.append(Paragraph(t["checkout"]["intro"], style_normal))
    story.append(Spacer(1, 15))
    for step in t["checkout"]["steps"]:
        story.append(Paragraph(f"• {step}", style_normal))
        story.append(Spacer(1, 14))
    story.append(Spacer(1, 15))
    
    # WhatsApp Check-Out QR
    checkout_url = "https://wa.me/5491145379500?text=Hola%20Jorge.%20Ya%20hicimos%20el%20check-out%20en%20C%C3%B3rdoba%205579.%20Las%20llaves%20est%C3%A1n%20en%20el%20buz%C3%B3n."
    qr_w_co = qr.QrCodeWidget(checkout_url)
    qr_w_co.barWidth = 70
    qr_w_co.barHeight = 70
    qr_w_co.barFillColor = COLOR_PRIMARY
    qr_w_co.qrVersion = 1
    d_co = Drawing(70, 70)
    d_co.add(qr_w_co)
    co_table = Table([[d_co, Paragraph("<b>AVISO AUTOMÁTICO DE CHECK-OUT</b><br/>Escanee este código QR con su celular para enviar automáticamente el aviso de salida por WhatsApp a Jorge.", style_card_body)]], colWidths=[80, 380])
    co_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), COLOR_ALERT_BG),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 10)
    ]))
    story.append(co_table)
    story.append(Spacer(1, 20))
    story.append(Paragraph(f"<b>{t['checkout']['thank_you_title']}</b>", style_h3))
    story.append(Paragraph(t["checkout"]["thank_you_text"], style_normal))
    story.append(Spacer(1, 25))
    try:
        qr_review = RLImage("public/qr/qr_airbnb.png", width=75, height=75)
        review_table = Table([[qr_review, Paragraph(t["checkout"]["review_qr"], style_card_body)]], colWidths=[90, 370])
        review_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('BACKGROUND', (0,0), (-1,-1), COLOR_ALERT_BG), ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER), ('PADDING', (0,0), (-1,-1), 10)]))
        story.append(review_table)
    except Exception:
        pass
    story.append(PageBreak())
    
    # ---- PAGE 16: BACK COVER ----
    story.append(Spacer(1, 100))
    story.append(Paragraph(t["cover"]["title"], ParagraphStyle('BackTitle', parent=style_title_main, textColor=COLOR_PRIMARY)))
    story.append(Paragraph(t["cover"]["subtitle"], ParagraphStyle('BackSub', parent=style_title_sub, textColor=COLOR_GRAY)))
    story.append(Spacer(1, 50))
    back_line = Table([[""]], colWidths=[100], rowHeights=[2])
    back_line.setStyle(TableStyle([('LINEBELOW', (0,0), (-1,-1), 2, COLOR_PRIMARY), ('ALIGN', (0,0), (-1,-1), 'CENTER')]))
    story.append(back_line)
    story.append(Spacer(1, 50))
    contact_table = Table([[Paragraph(t["back_cover"]["contact"], style_card_body)]], colWidths=[420])
    contact_table.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), COLOR_ALERT_BG), ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER), ('PADDING', (0,0), (-1,-1), 15)]))
    story.append(contact_table)
    story.append(Spacer(1, 60))
    try:
        qr_support = RLImage("public/qr/qr_portal.png", width=120, height=120)
        qr_support_table = Table([[qr_support]], colWidths=[420])
        qr_support_table.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
        story.append(qr_support_table)
        story.append(Spacer(1, 15))
        story.append(Paragraph(t["back_cover"]["qr_label"], ParagraphStyle('BackQRLabel', fontName=FONTS['Georgia-Italic'], fontSize=10, textColor=COLOR_GRAY, alignment=TA_CENTER)))
    except Exception:
        pass
    story.append(Spacer(1, 140))
    story.append(Paragraph(t["back_cover"]["thank_you"], ParagraphStyle('BackThankYou', fontName=FONTS['Georgia-Bold'], fontSize=12, textColor=COLOR_PRIMARY, alignment=TA_CENTER)))
    
    doc.build(story, canvasmaker=NumberedCanvas)
    return page_map

if __name__ == "__main__":
    print("Pass 1: Rendering layout to calculate dynamic TOC page numbers...")
    pages = build_pdf()
    print("Pass 2: Re-rendering with dynamic TOC...")
    build_pdf(page_map=pages)
    print(f"Successfully generated {OUTPUT_PDF}")
