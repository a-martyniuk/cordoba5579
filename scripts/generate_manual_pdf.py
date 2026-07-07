import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image as RLImage, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

# Define Output Path
OUTPUT_DIR = "public"
OUTPUT_PDF = os.path.join(OUTPUT_DIR, "manual_cordoba5579.pdf")

# Register system fonts with fallback
def register_fonts():
    font_paths = {
        "Georgia": ("georgia.ttf", "Times-Roman"),
        "Georgia-Bold": ("georgiab.ttf", "Times-Bold"),
        "Georgia-Italic": ("georgiai.ttf", "Times-Italic"),
        "SegoeUI": ("segoeui.ttf", "Helvetica"),
        "SegoeUI-Bold": ("segoeuib.ttf", "Helvetica-Bold"),
    }
    
    registered = {}
    for name, (filename, fallback) in font_paths.items():
        found = False
        for path in ["C:\\Windows\\Fonts", "/Library/Fonts", "/usr/share/fonts", "/usr/share/fonts/truetype"]:
            full_path = os.path.join(path, filename)
            if os.path.exists(full_path):
                try:
                    pdfmetrics.registerFont(TTFont(name, full_path))
                    registered[name] = name
                    found = True
                    break
                except Exception:
                    pass
        if not found:
            registered[name] = fallback
    return registered

FONTS = register_fonts()

# Color Palette (based on alexismartyniuk.com.ar/cordoba5579)
COLOR_PRIMARY = HexColor('#5F6F52')    # Olive Green
COLOR_DARK = HexColor('#252824')       # Charcoal / Black Text
COLOR_LIGHT_BG = HexColor('#FAF9F7')   # Soft Cream Background
COLOR_BORDER = HexColor('#EFEBE4')     # Sand Divider Color
COLOR_GRAY = HexColor('#888888')       # Medium Gray
COLOR_LIGHT_GRAY = HexColor('#a3a3a3') # Light Gray
COLOR_ALERT_BG = HexColor('#FDFBF7')   # Light Warm Cream Callout
COLOR_ACCENT = HexColor('#C8A261')     # Soft gold accent

class NumberedCanvas(canvas.Canvas):
    """Custom canvas that draws running headers and footers, and calculates total page count."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        # Page dimensions
        W, H = A4
        
        # Cover (Page 1) and Back Cover (Last page) get special full-bleed backgrounds
        if self._pageNumber == 1:
            # Full-bleed primary olive background for cover
            self.saveState()
            self.setFillColor(COLOR_PRIMARY)
            self.rect(0, 0, W, H, fill=True, stroke=False)
            # Decorative subtle borders
            self.setStrokeColor(HexColor('#FAF9F7'))
            self.setLineWidth(1)
            self.rect(30, 30, W - 60, H - 60, fill=False, stroke=True)
            self.restoreState()
            return
            
        if self._pageNumber == page_count:
            # Full-bleed light background for back cover
            self.saveState()
            self.setFillColor(COLOR_LIGHT_BG)
            self.rect(0, 0, W, H, fill=True, stroke=False)
            self.setStrokeColor(COLOR_PRIMARY)
            self.setLineWidth(2)
            self.rect(30, 30, W - 60, H - 60, fill=False, stroke=True)
            self.restoreState()
            return

        # Running pages decorations
        self.saveState()
        
        # Soft cream page background
        self.setFillColor(COLOR_LIGHT_BG)
        self.rect(0, 0, W, H, fill=True, stroke=False)
        
        # Thin layout grid border (Hospitality Editorial feel)
        self.setStrokeColor(COLOR_BORDER)
        self.setLineWidth(0.75)
        self.rect(54, 54, W - 108, H - 108, fill=False, stroke=True)

        # 1. Header (y = 795)
        self.setFont(FONTS["Georgia-Bold"], 9)
        self.setFillColor(COLOR_PRIMARY)
        self.drawString(64, 805, "CÓRDOBA 5579")
        
        self.setFont(FONTS["Georgia-Italic"], 9)
        self.setFillColor(COLOR_GRAY)
        self.drawRightString(W - 64, 805, "Manual del Huésped  •  House Manual")
        
        # Header line
        self.setStrokeColor(COLOR_BORDER)
        self.setLineWidth(1)
        self.line(64, 795, W - 64, 795)
        
        # 2. Footer (y = 45)
        self.line(64, 50, W - 64, 50)
        
        self.setFont(FONTS["SegoeUI"], 8)
        self.setFillColor(COLOR_GRAY)
        self.drawString(64, 34, "alexismartyniuk.com.ar/cordoba5579")
        self.drawRightString(W - 64, 34, f"Página {self._pageNumber} de {page_count}")
        
        self.restoreState()

def build_pdf():
    # Page setup
    # Margins are set to fit within the decorative boxes: Left/Right 64, Top/Bottom 70
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=A4,
        leftMargin=68,
        rightMargin=68,
        topMargin=75,
        bottomMargin=75
    )

    # Styles
    styles = getSampleStyleSheet()
    
    # Custom Paragraph Styles
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
    
    # Stories array
    story = []
    
    # ---------------- PAGE 1: COVER PAGE ----------------
    story.append(Spacer(1, 140))
    story.append(Paragraph("CÓRDOBA 5579", style_title_main))
    story.append(Spacer(1, 10))
    story.append(Paragraph("PALERMO HOLLYWOOD", style_title_sub))
    story.append(Spacer(1, 40))
    
    # Decorative line
    logo_line = Table([[""]], colWidths=[150], rowHeights=[2])
    logo_line.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 2, HexColor('#FAF9F7')),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    story.append(logo_line)
    story.append(Spacer(1, 40))
    
    story.append(Paragraph("GUÍA DE BIENVENIDA & MANUAL DE LA CASA", style_title_tag))
    story.append(Paragraph("Welcome Guide & House Manual", ParagraphStyle('CoverEn', parent=style_title_tag, fontSize=16, textColor=HexColor('#FAF9F7'))))
    
    story.append(Spacer(1, 220))
    story.append(Paragraph("Unidad 101  •  Buenos Aires, Argentina", ParagraphStyle('CoverFooter', fontName=FONTS['SegoeUI-Bold'], fontSize=11, textColor=HexColor('#FAF9F7'), alignment=TA_CENTER)))
    story.append(PageBreak())
    
    # ---------------- PAGE 2: ÍNDICE Y INFORMACIÓN RÁPIDA ----------------
    story.append(Paragraph("Índice & Información Rápida", style_h1))
    story.append(Paragraph("TOC & Quick Start Guide", style_h2))
    story.append(Spacer(1, 10))
    
    # Quick Info Box
    info_data = [
        [
            Paragraph("<b>RED WI-FI / NETWORK:</b><br/>SSID: Cordoba5579_Guest<br/>Clave: Welcome101", style_card_body),
            Paragraph("<b>CONTACTO / HOST CONTACT:</b><br/>Jorge Orlando: +54 9 11 4537-9500<br/>Emergencias: 911 (SAME: 107)", style_card_body)
        ],
        [
            Paragraph("<b>HORARIOS / TIMINGS:</b><br/>Check-In: 15:00 hs (3:00 PM)<br/>Check-Out: 11:00 hs (11:00 AM)", style_card_body),
            Paragraph("<b>PORTAL DIGITAL / DIGITAL PORTAL:</b><br/>alexismartyniuk.com.ar/cordoba5579<br/>Mapas, chat y manuales en tiempo real.", style_card_body)
        ]
    ]
    info_table = Table(info_data, colWidths=[230, 230])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_ALERT_BG),
        ('BOX', (0,0), (-1,-1), 1, COLOR_PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 20))
    
    # Table of Contents
    story.append(Paragraph("<b>CONTENIDO DE ESTA GUÍA:</b>", style_h3))
    
    toc_data = [
        [Paragraph("1. Bienvenida & Cómo llegar", style_normal), Paragraph("Pág. 3", style_normal_bold)],
        [Paragraph("2. Check-In Autónomo (Lockbox)", style_normal), Paragraph("Pág. 4", style_normal_bold)],
        [Paragraph("3. Normas de Convivencia", style_normal), Paragraph("Pág. 5", style_normal_bold)],
        [Paragraph("4. Climatización & Caja Fuerte", style_normal), Paragraph("Pág. 6", style_normal_bold)],
        [Paragraph("5. Cocina, Cafetera & Cava de Vinos", style_normal), Paragraph("Pág. 7", style_normal_bold)],
        [Paragraph("6. Amenities del Edificio (Laundry & SUM)", style_normal), Paragraph("Pág. 8", style_normal_bold)],
        [Paragraph("7. Inventario del Departamento", style_normal), Paragraph("Pág. 9", style_normal_bold)],
        [Paragraph("8. Limpieza, Residuos & Cuidado Sanitario", style_normal), Paragraph("Pág. 10", style_normal_bold)],
        [Paragraph("9. Seguridad, Cortes de Luz & Emergencias", style_normal), Paragraph("Pág. 11", style_normal_bold)],
        [Paragraph("10. Guía Comercial y Atracciones del Barrio", style_normal), Paragraph("Pág. 12", style_normal_bold)],
        [Paragraph("11. Preguntas Frecuentes (FAQs)", style_normal), Paragraph("Pág. 13", style_normal_bold)],
        [Paragraph("12. Check-Out Checklist", style_normal), Paragraph("Pág. 14", style_normal_bold)],
    ]
    toc_table = Table(toc_data, colWidths=[400, 60])
    toc_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(toc_table)
    
    story.append(Spacer(1, 20))
    # Add QR code pointers side by side
    try:
        qr_portal = RLImage("public/qr/qr_portal.png", width=65, height=65)
        qr_whatsapp = RLImage("public/qr/qr_whatsapp.png", width=65, height=65)
        qr_table = Table([
            [qr_portal, Paragraph("<b>ESCANEE PARA EL PORTAL DIGITAL</b><br/>Acceda a la versión web móvil del manual con enlaces interactivos.", style_card_body),
             qr_whatsapp, Paragraph("<b>ESCANEE PARA WHATSAPP</b><br/>Chat directo y rápido con su anfitrión Jorge ante dudas o recargas.", style_card_body)]
        ], colWidths=[70, 160, 70, 160])
        qr_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(qr_table)
    except Exception:
        pass
        
    story.append(PageBreak())
    
    # ---------------- PAGE 3: BIENVENIDA Y LLEGADA ----------------
    story.append(Paragraph("Bienvenido a Córdoba 5579", style_h1))
    story.append(Paragraph("Welcome letter & How to Arrive", style_h2))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("¡Hola y bienvenido a Buenos Aires!<br/><br/>Estamos encantados de tenerte como nuestro huésped en Córdoba 5579. Este departamento fue diseñado y equipado con mucho esmero para ofrecerte una estadía premium, confortable e inolvidable en una de las mejores zonas de la ciudad: Palermo Hollywood.<br/><br/>Hemos preparado este manual detallado para ayudarte a familiarizarte rápidamente con el departamento, el funcionamiento de sus electrodomésticos y las normas de convivencia del edificio. Te pedimos que lo leas con atención para garantizar una experiencia placentera y sin contratiempos.<br/><br/>Jorge Orlando (quien dirige el proyecto) y todo nuestro equipo están a tu entera disposición para asistirte. ¡Que disfrutes tu estadía!", style_normal))
    story.append(Spacer(1, 25))
    
    story.append(Paragraph("Cómo Llegar / How to Arrive", style_h3))
    story.append(Paragraph("El edificio está ubicado sobre <b>Avenida Córdoba 5579</b>, entre las calles Fitz Roy y Humboldt, en el barrio de Palermo Hollywood, CABA.", style_normal))
    story.append(Spacer(1, 10))
    
    arrive_data = [
        [Paragraph("<b>En Auto o Taxi:</b>", style_normal_bold), Paragraph("El acceso es directo por la Avenida Córdoba. Tenga en cuenta que el edificio no cuenta con cochera propia. Estacionar en la calle en esta zona suele ser difícil. Sin embargo, hay cocheras comerciales (estacionamientos privados de pago las 24 hs) a menos de 50 metros sobre Av. Córdoba casi esquina Fitz Roy.", style_normal)],
        [Paragraph("<b>En Subte (Línea D):</b>", style_normal_bold), Paragraph("La estación más cercana es <b>Ministro Carranza</b> (a 5 cuadras, caminando por Av. Cabildo/Santa Fe y luego Fitz Roy) o la estación <b>Palermo</b> (a 8 cuadras, cerca del shopping Distrito Arcos). Es la línea directa para ir al centro, Plaza de Mayo y Recoleta.", style_normal)],
        [Paragraph("<b>En Tren:</b>", style_normal_bold), Paragraph("La estación <b>Ministro Carranza</b> de la Línea Mitre (ramal a Retiro/Tigre) se encuentra a solo 5 cuadras del departamento.", style_normal)],
        [Paragraph("<b>En Colectivo (Metrobus):</b>", style_normal_bold), Paragraph("Múltiples líneas pasan por la puerta del edificio sobre Av. Córdoba (140, 151, 168) o a pocas cuadras sobre Av. Santa Fe y Av. Juan B. Justo.", style_normal)]
    ]
    arrive_table = Table(arrive_data, colWidths=[120, 340])
    arrive_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(arrive_table)
    story.append(PageBreak())
    
    # ---------------- PAGE 4: CHECK-IN AUTÓNOMO ----------------
    story.append(Paragraph("Check-In Autónomo", style_h1))
    story.append(Paragraph("Self Check-In Step-by-Step", style_h2))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Para su comodidad y flexibilidad de horario, el ingreso al departamento es 100% autónomo a partir de las <b>15:00 horas</b>. Por favor, siga las siguientes instrucciones detalladas para acceder:", style_normal))
    story.append(Spacer(1, 15))
    
    steps_data = [
        [Paragraph("<font color='#5F6F52'><b>PASO 1</b></font>", style_normal_bold), Paragraph("Ubique la caja de llaves de seguridad metálica (lockbox) rotulada como <b>'Depto 101'</b> que se encuentra instalada en la pared exterior, a la derecha de la puerta de ingreso principal del edificio (Av. Córdoba 5579).", style_normal)],
        [Paragraph("<font color='#5F6F52'><b>PASO 2</b></font>", style_normal_bold), Paragraph("Introduzca el código de combinación de 4 dígitos que le enviaremos de forma privada por la mensajería de Airbnb unas horas antes de su arribo.", style_normal)],
        [Paragraph("<font color='#5F6F52'><b>PASO 3</b></font>", style_normal_bold), Paragraph("Deslice la traba metálica lateral hacia abajo y abra la compuerta de la caja para retirar el juego de llaves.", style_normal)],
        [Paragraph("<font color='#5F6F52'><b>PASO 4</b></font>", style_normal_bold), Paragraph("Aproxime el llavero plástico azul o negro (tag magnético) al lector circular ubicado sobre la pared de la entrada del edificio. La puerta de vidrio del hall se destrabará automáticamente.", style_normal)],
        [Paragraph("<font color='#5F6F52'><b>PASO 5</b></font>", style_normal_bold), Paragraph("Ingrese al edificio y diríjase al primer piso por el ascensor o las escaleras. El departamento es la **Unidad 101**. Utilice la llave física para abrir la cerradura de la puerta principal.", style_normal)],
    ]
    steps_table = Table(steps_data, colWidths=[80, 380])
    steps_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(steps_table)
    story.append(Spacer(1, 20))
    
    # Caution Box
    caution_data = [[
        Paragraph("<b>ADVERTENCIA DE SEGURIDAD / SAFETY NOTE:</b><br/>• Nunca comparta el código de la caja de llaves con personas ajenas a la reserva.<br/>• Al retirar las llaves, asegúrese de cerrar la caja de seguridad y desordenar los números del código para que no quede expuesto.", style_card_warning)
    ]]
    caution_table = Table(caution_data, colWidths=[460])
    caution_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#FFF0F0')),
        ('BOX', (0,0), (-1,-1), 1, HexColor('#FFC1C1')),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(caution_table)
    story.append(PageBreak())
    
    # ---------------- PAGE 5: NORMAS DE LA CASA ----------------
    story.append(Paragraph("Normas de la Casa", style_h1))
    story.append(Paragraph("House Rules & Coexistence", style_h2))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Para garantizar una estadía placentera y mantener una buena relación con los vecinos del consorcio, le solicitamos respetar estrictamente el reglamento interno del edificio:", style_normal))
    story.append(Spacer(1, 15))
    
    rules_data = [
        [
            Paragraph("<b>FUMAR / SMOKING</b>", style_card_title),
            Paragraph("Está terminantemente prohibido fumar cigarrillos tradicionales o electrónicos dentro del departamento, en el balcón o en pasillos del edificio. Solo se permite fumar al aire libre en la terraza del piso 11.", style_card_body)
        ],
        [
            Paragraph("<b>MASCOTAS / PETS</b>", style_card_title),
            Paragraph("No se permite el ingreso de ningún tipo de mascota al departamento bajo ninguna circunstancia.", style_card_body)
        ],
        [
            Paragraph("<b>RUIDOS Y FIESTAS</b>", style_card_title),
            Paragraph("Están prohibidas las fiestas, eventos y ruidos molestos. Las horas de silencio del consorcio rigen de 22:00 a 08:00 hs. Respete el descanso de los vecinos.", style_card_body)
        ],
        [
            Paragraph("<b>INVITADOS / AMENITIES</b>", style_card_title),
            Paragraph("Por seguridad, el ingreso a las áreas comunes (piscina, SUM, laundry) es exclusivo para los huéspedes registrados en la reserva. No se permite el ingreso de visitas externas a estas áreas.", style_card_body)
        ],
        [
            Paragraph("<b>CÓDIGO DE VESTIMENTA</b>", style_card_title),
            Paragraph("Por reglamento de copropiedad, está estrictamente prohibido circular sin remera (torso desnudo) en pasillos, ascensor o hall de entrada. Solo se permite en el sector de la piscina en el piso 11.", style_card_body)
        ]
    ]
    rules_table = Table(rules_data, colWidths=[140, 320])
    rules_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(rules_table)
    
    story.append(Spacer(1, 20))
    # General warning note
    rule_note = [[
        Paragraph("<b>MULTAS Y PENALIZACIONES:</b> El incumplimiento de estas normas del consorcio generará multas aplicadas por la administración del edificio, las cuales serán trasladadas directamente al huésped.", style_card_warning)
    ]]
    rule_note_table = Table(rule_note, colWidths=[460])
    rule_note_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#FFF0F0')),
        ('BOX', (0,0), (-1,-1), 1, HexColor('#FFC1C1')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(rule_note_table)
    story.append(PageBreak())
    
    # ---------------- PAGE 6: USO - CERRADURAS Y CLIMA ----------------
    story.append(Paragraph("Uso del Departamento - Accesos y Clima", style_h1))
    story.append(Paragraph("Locks, AC and Heating systems", style_h2))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("<b>1. Cerradura de la Puerta Principal:</b><br/>La cerradura de ingreso al departamento cuenta con un mecanismo que traba automáticamente al cerrar la puerta. Asegúrese de tirar o empujar firmemente la hoja al salir para que calce bien.<br/><b>¡Importante!</b> Siempre lleve consigo las llaves físicas antes de salir para evitar quedarse afuera.", style_normal))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("<b>2. Aire Acondicionado y Climatización:</b><br/>El departamento dispone de dos equipos de aire acondicionado frío/calor (uno en el living y otro en el dormitorio).", style_normal))
    story.append(Spacer(1, 10))
    
    ac_data = [
        [Paragraph("<b>Encendido:</b>", style_normal_bold), Paragraph("Use el control remoto correspondiente a cada equipo. Presione el botón de encendido y seleccione el modo deseado (COOL / Frío o HEAT / Calor).", style_normal)],
        [Paragraph("<b>Temperatura Recomendada:</b>", style_normal_bold), Paragraph("Para un uso eficiente, mantenga los aires en 24 °C (75 °F) durante el verano y en 22 °C (71 °F) en invierno.", style_normal)],
        [Paragraph("<b>Errores frecuentes:</b>", style_normal_bold), Paragraph("No encienda los aires acondicionados con las ventanas o la puerta del balcón abiertas. Esto sobrecarga el motor y disminuye drásticamente el rendimiento.", style_normal)],
        [Paragraph("<b>Cuidado Ambiental:</b>", style_normal_bold), Paragraph("Apague los equipos obligatoriamente al salir del departamento. Ayúdenos a conservar energía.", style_normal)]
    ]
    ac_table = Table(ac_data, colWidths=[130, 330])
    ac_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(ac_table)
    story.append(Spacer(1, 20))
    
    story.append(Paragraph("<b>3. Caja Fuerte de la Habitación:</b>", style_h3))
    story.append(Paragraph("Para resguardar sus objetos de valor, la habitación cuenta con una caja de seguridad dentro del placar.<br/><b>Nota importante:</b> El funcionamiento de la caja fuerte es 100% mecánico y requiere una <b>llave física</b> para su apertura y cierre. En caso de requerir su uso, solicite la llave física directamente a Jorge Orlando.", style_normal))
    story.append(PageBreak())
    
    # ---------------- PAGE 7: USO - COCINA Y MINIBAR ----------------
    story.append(Paragraph("Uso del Departamento - Cocina y Minibar", style_h1))
    story.append(Paragraph("Kitchen appliances, Coffee maker and Wine Cellar", style_h2))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("La cocina está completamente equipada con electrodomésticos Samsung y vajillaCarol de alta calidad para su estadía. Por favor, use los equipos con cuidado:", style_normal))
    story.append(Spacer(1, 10))
    
    kitchen_data = [
        [Paragraph("<b>Anafe y Horno:</b>", style_normal_bold), Paragraph("El anafe eléctrico es vitrocerámico. No apoye recipientes húmedos sobre la superficie caliente. Al terminar de cocinar, espere a que la luz indicadora de calor residual se apague antes de limpiar.", style_normal)],
        [Paragraph("<b>Cafetera y Espumadora:</b>", style_normal_bold), Paragraph("Cuenta con una cafetera de filtro y espumadora de leche eléctrica. Utilice agua filtrada de la jarra para el depósito y limpie el filtro de café tras cada uso.", style_normal)],
        [Paragraph("<b>Microondas y Heladera:</b>", style_normal_bold), Paragraph("La heladera Samsung cuenta con regulador digital de frío. Evite dejar la puerta abierta por mucho tiempo. No coloque metales en el microondas.", style_normal)],
        [Paragraph("<b>Freidora sin Aceite (Air Fryer):</b>", style_normal_bold), Paragraph("Dispone de una freidora de aire digital. Recuerde utilizar utensilios plásticos o de madera para no rayar el recubrimiento antiadherente de la canasta.", style_normal)]
    ]
    kitchen_table = Table(kitchen_data, colWidths=[130, 330])
    kitchen_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(kitchen_table)
    story.append(Spacer(1, 20))
    
    story.append(Paragraph("Cava de Vinos & Minibar (Costo Extra)", style_h3))
    story.append(Paragraph("Disfrute de etiquetas seleccionadas directamente en la comodidad del departamento. El minibar y la cava cuentan con bebidas y vinos disponibles a la carta.<br/><br/><b>Cómo reportar el consumo:</b><br/>• Revise los precios correspondientes detallados en el portal web o en la tarjeta de precios física del minibar (todos los valores están indicados en dólares estadounidenses y pesos).<br/>• Reporte los ítems consumidos a Jorge por WhatsApp o al finalizar su estadía.<br/>• El cobro del consumo se coordinará al finalizar la estadía junto con el check-out (pagos disponibles en pesos o dólares, efectivo o transferencia bancaria).", style_normal))
    story.append(PageBreak())
    
    # ---------------- PAGE 8: USO - LAUNDRY Y SUM ----------------
    story.append(Paragraph("Uso del Departamento - Laundry & SUM", style_h1))
    story.append(Paragraph("Building amenities, Laundry and Rooftop SUM", style_h2))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("<b>1. Laundry (Sector Lavadero Común):</b><br/>El edificio cuenta con un área de laundry de uso común para los huéspedes, ubicada en el <b>piso 10</b>.", style_normal))
    story.append(Spacer(1, 10))
    
    laundry_data = [
        [Paragraph("<b>Equipamiento:</b>", style_normal_bold), Paragraph("El lavadero está equipado con lavarropas de libre acceso sin costo adicional. Tenga en cuenta que <b>no hay secadora de ropa</b> instalada en el laundry del edificio.", style_normal)],
        [Paragraph("<b>Tendido de ropa:</b>", style_normal_bold), Paragraph("El departamento cuenta con un tender portátil físico plegable para colgar y secar su ropa dentro de la unidad o en el sector del balcón.", style_normal)],
        [Paragraph("<b>Insumos:</b>", style_normal_bold), Paragraph("El jabón y suavizante para la ropa corren por cuenta del huésped.", style_normal)]
    ]
    laundry_table = Table(laundry_data, colWidths=[120, 340])
    laundry_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(laundry_table)
    story.append(Spacer(1, 25))
    
    story.append(Paragraph("<b>2. SUM y Sector de Parrilla (Terraza Piso 11):</b><br/>El edificio cuenta con un hermoso Salón de Usos Múltiples (SUM) cerrado y sector de parrilla al aire libre con excelentes vistas en el <b>piso 11</b>.", style_normal))
    story.append(Spacer(1, 10))
    
    sum_data = [
        [Paragraph("<b>Reserva Previa:</b>", style_normal_bold), Paragraph("Para utilizar la parrilla o el salón cerrado, es obligatorio solicitar reserva previa con anticipación a Jorge Orlando para verificar disponibilidad en el consorcio.", style_normal)],
        [Paragraph("<b>Costo de Limpieza:</b>", style_normal_bold), Paragraph("Por reglamento interno del consorcio del edificio, el uso de este espacio tiene un arancel obligatorio de <b>10.000 pesos argentinos</b> destinado a cubrir las tareas de limpieza post-uso.", style_normal)],
        [Paragraph("<b>Piscina y Solárium:</b>", style_normal_bold), Paragraph("Están en el mismo piso y son de acceso libre de 09:00 a 20:00 hs. Es obligatorio ducharse antes de ingresar al agua.", style_normal)]
    ]
    sum_table = Table(sum_data, colWidths=[120, 340])
    sum_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(sum_table)
    story.append(PageBreak())
    
    # ---------------- PAGE 9: INVENTARIO DEL DEPARTAMENTO ----------------
    story.append(Paragraph("Inventario del Departamento", style_h1))
    story.append(Paragraph("Detailed equipment and linens list", style_h2))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Para su control, detallamos los elementos principales provistos en el departamento. Ante cualquier faltante o rotura al ingresar, por favor repórtelo inmediatamente:", style_normal))
    story.append(Spacer(1, 15))
    
    # Inventory Table
    inv_headers = [
        Paragraph("<b>Categoría</b>", style_header_cell),
        Paragraph("<b>Elemento</b>", style_header_cell),
        Paragraph("<b>Cant.</b>", style_header_cell),
        Paragraph("<b>Detalles / Marca</b>", style_header_cell)
    ]
    
    inv_rows = [
        inv_headers,
        [Paragraph("Vajilla y Cocina", style_card_body), Paragraph("Platos playos grandes", style_card_body), Paragraph("4", style_card_body), Paragraph("Carol, alta resistencia", style_card_body)],
        [Paragraph("Vajilla y Cocina", style_card_body), Paragraph("Copas de vino y vasos", style_card_body), Paragraph("4 c/u", style_card_body), Paragraph("Cristal templado", style_card_body)],
        [Paragraph("Vajilla y Cocina", style_card_body), Paragraph("Set de ollas y sartenes", style_card_body), Paragraph("1 set", style_card_body), Paragraph("Tramontina antiadherente", style_card_body)],
        [Paragraph("Electrodomésticos", style_card_body), Paragraph("Heladera y Microondas", style_card_body), Paragraph("1 c/u", style_card_body), Paragraph("Samsung digital", style_card_body)],
        [Paragraph("Electrodomésticos", style_card_body), Paragraph("Freidora sin aceite", style_card_body), Paragraph("1", style_card_body), Paragraph("Digital sin aceite", style_card_body)],
        [Paragraph("Electrodomésticos", style_card_body), Paragraph("Cafetera eléctrica", style_card_body), Paragraph("1", style_card_body), Paragraph("Con filtro y espumadora", style_card_body)],
        [Paragraph("Blancos", style_card_body), Paragraph("Sábanas de cama", style_card_body), Paragraph("1 juego", style_card_body), Paragraph("Algodón Egipcio 600 hilos", style_card_body)],
        [Paragraph("Blancos", style_card_body), Paragraph("Juegos de toallas", style_card_body), Paragraph("2", style_card_body), Paragraph("Puro algodón 400g", style_card_body)],
        [Paragraph("Dormitorio", style_card_body), Paragraph("Caja fuerte mecánica", style_card_body), Paragraph("1", style_card_body), Paragraph("Con llave física", style_card_body)],
        [Paragraph("Dormitorio", style_card_body), Paragraph("Cochera / Equipaje", style_card_body), Paragraph("N/A", style_card_body), Paragraph("No disponible en el consorcio", style_card_body)],
    ]
    
    inv_table = Table(inv_rows, colWidths=[110, 150, 40, 160])
    inv_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), HexColor('#FFFFFF')),
        ('ALIGN', (0,0), (-1,0), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('TOPPADDING', (0,0), (-1,0), 8),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor('#FFFFFF'), HexColor('#FAF9F7')]),
        ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,1), (-1,-1), 6),
        ('BOTTOMPADDING', (0,1), (-1,-1), 6),
    ]))
        
    story.append(inv_table)
    story.append(Spacer(1, 20))
    
    # Note on QR
    story.append(Paragraph("<b>Nota:</b> El inventario detallado interactivo del departamento, incluyendo reposiciones de la cava de vinos y el sistema de reportes directo por WhatsApp para roturas o faltantes, se encuentra disponible escaneando el código QR del manual digital en la página 2 o en la contraportada.", style_normal))
    story.append(PageBreak())
    
    # ---------------- PAGE 10: LIMPIEZA Y RESIDUOS ----------------
    story.append(Paragraph("Limpieza, Residuos & Cuidado Sanitario", style_h1))
    story.append(Paragraph("Cleaning guidelines, Trash and Plumbing safety", style_h2))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("<b>1. Gestión de Residuos (Basura):</b><br/>• Por favor, deposite los residuos en bolsas bien atadas dentro de los tachos de basura provistos en la cocina y baño.<br/>• No acumule basura dentro del departamento para evitar malos olores e insectos.<br/>• Consulte con Jorge la ubicación exacta del contenedor de basura común del edificio para descartar las bolsas llenas.", style_normal))
    story.append(Spacer(1, 20))
    
    story.append(Paragraph("<b>2. Cuidado del Sistema Sanitario (Inodoro):</b><br/>El sistema de cañerías del edificio es sensible a obstrucciones. Rogamos encarecidamente prestar atención a la siguiente norma:", style_normal))
    story.append(Spacer(1, 10))
    
    plumbing_data = [[
        Paragraph("<b>¡ATENCIÓN! QUÉ NO ARROJAR AL INODORO / DO NOT FLUSH:</b><br/>• Está estrictamente prohibido arrojar toallitas húmedas, apósitos femeninos, pañales, algodón o papel de cocina en el inodoro.<br/>• Utilice únicamente papel higiénico normal y en cantidades moderadas. Descarte todo el resto de los desechos en el tacho de basura del baño.", style_card_warning)
    ]]
    plumbing_table = Table(plumbing_data, colWidths=[460])
    plumbing_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#FFF0F0')),
        ('BOX', (0,0), (-1,-1), 1.5, HexColor('#FFC1C1')),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(plumbing_table)
    story.append(Spacer(1, 25))
    
    story.append(Paragraph("<b>3. Recambio de Ropa Blanca y Limpieza:</b><br/>• Para estadías de más de <b>7 noches</b>, se proveerá un juego de toallas limpio de recambio.<br/>• Para estadías de <b>14 noches o más</b>, se incluye un recambio completo de sábanas y toallas junto con una limpieza ligera de cortesía.", style_normal))
    story.append(PageBreak())
    
    # ---------------- PAGE 11: SEGURIDAD Y EMERGENCIAS ----------------
    story.append(Paragraph("Seguridad & Emergencias", style_h1))
    story.append(Paragraph("Safety protocols, Breakers location and Emergency contacts", style_h2))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Su seguridad es nuestra máxima prioridad. Ante cualquier imprevisto, siga los protocolos detallados:", style_normal))
    story.append(Spacer(1, 15))
    
    safety_data = [
        [
            Paragraph("<b>TABLERO ELÉCTRICO</b>", style_card_title),
            Paragraph("En caso de un corte parcial de energía dentro de la unidad (ej. por sobrecarga al conectar muchos equipos), revise el tablero de llaves térmicas ubicado detrás de la puerta de entrada. Si alguna llave saltó (hacia abajo), desconecte el último electrodoméstico enchufado y vuelva a subir la llave térmica.", style_card_body)
        ],
        [
            Paragraph("<b>PÉRDIDA DE LLAVES</b>", style_card_title),
            Paragraph("Si pierde las llaves físicas o el llavero magnético de ingreso, repórtelo inmediatamente a Jorge Orlando. La reposición de llaves y tag de ingreso magnético tiene un costo adicional debido a las normas de seguridad del edificio.", style_card_body)
        ],
        [
            Paragraph("<b>URGENCIAS MÉDICAS</b>", style_card_title),
            Paragraph("Para emergencias de salud que requieran ambulancia pública, llame al <b>107 (SAME)</b>.<br/>• <b>Hospital Fernández:</b> Av. Cerviño 3356, Palermo (Hospital general para adultos).<br/>• <b>Hospital de Niños Ricardo Gutiérrez:</b> Gallo 1330, Recoleta.", style_card_body)
        ],
        [
            Paragraph("<b>CONTACTOS CLAVE</b>", style_card_title),
            Paragraph("• Policía (General): <b>911</b><br/>• Bomberos: <b>100</b><br/>• Emergencias Médicas: <b>107</b><br/>• Anfitrión Jorge: <b>+54 9 11 4537-9500</b>", style_card_body)
        ]
    ]
    safety_table = Table(safety_data, colWidths=[140, 320])
    safety_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(safety_table)
    story.append(PageBreak())
    
    # ---------------- PAGE 12: GUÍA DEL BARRIO ----------------
    story.append(Paragraph("Guía del Barrio", style_h1))
    story.append(Paragraph("Palermo Hollywood Neighborhood Guide", style_h2))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Palermo Hollywood es uno de los barrios más seguros, gastronómicos y artísticos de Buenos Aires. Aquí tiene una selección de comercios esenciales y recomendados a corta distancia del departamento:", style_normal))
    story.append(Spacer(1, 15))
    
    guide_data = [
        [Paragraph("<b>Supermercado Disco:</b>", style_normal_bold), Paragraph("Ubicado en Av. Santa Fe 3149. Excelente selección de productos, frescos y carnicería.", style_normal)],
        [Paragraph("<b>Supermercado Coto:</b>", style_normal_bold), Paragraph("Ubicado frente al Abasto Shopping (Av. Corrientes 3247) o sucursales exprés en la zona de Av. Santa Fe.", style_normal)],
        [Paragraph("<b>Farmacias (24hs):</b>", style_normal_bold), Paragraph("Farmacity en Av. Santa Fe 4226 (abierta las 24 hs ante emergencias o compras de farmacia).", style_normal)],
        [Paragraph("<b>Cafeterías de Especialidad:</b>", style_normal_bold), Paragraph("• <b>Cuervo Café:</b> a pocas cuadras, excelentes cafés y pastelería.<br/>• <b>All Saints Cafe:</b> ambiente acogedor y gran variedad de granos seleccionados.", style_normal)],
        [Paragraph("<b>Restaurantes recomendados:</b>", style_normal_bold), Paragraph("• <b>Don Julio:</b> la parrilla más famosa de la ciudad (se recomienda reservar con meses de anticipación).<br/>• <b>Las Pizarras Bistro:</b> cocina de autor muy cerca.", style_normal)],
        [Paragraph("<b>Movistar Arena:</b>", style_normal_bold), Paragraph("El estadio para recitales y shows principales se encuentra a tan solo 15-20 minutos caminando del departamento.", style_normal)]
    ]
    guide_table = Table(guide_data, colWidths=[160, 300])
    guide_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(guide_table)
    
    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>Consejo de Seguridad:</b> Palermo Hollywood es una zona muy transitada y segura, pero siempre mantenga sus pertenencias a la vista y evite exhibir teléfonos o cámaras en zonas muy aglomeradas al aire libre.", style_body_italic))
    story.append(PageBreak())
    
    # ---------------- PAGE 13: PREGUNTAS FRECUENTES (FAQ) ----------------
    story.append(Paragraph("Preguntas Frecuentes (FAQs)", style_h1))
    story.append(Paragraph("Frequently Asked Questions", style_h2))
    story.append(Spacer(1, 15))
    
    faqs = [
        ("¿Puedo dejar mi equipaje en el edificio antes del check-in o después del check-out?", 
         "Por reglamento interno del consorcio del edificio, no se permite el guardado de equipaje en las áreas comunes ni en el hall. No obstante, le sugerimos consultar directamente a Jorge para evaluar excepciones o alternativas según la necesidad específica."),
        
        ("¿Hay servicio de lavadero o secadora disponible?", 
         "Sí, todos los huéspedes tienen acceso libre y gratuito a los lavarropas de uso común en el sector de laundry (piso 10). Tenga en cuenta que el edificio no cuenta con secadoras de ropa; el departamento dispone de un tender portátil plegable."),
        
        ("¿Cómo funciona y cuánto cuesta el SUM / Parrilla?", 
         "El SUM y la parrilla (piso 11) se reservan previamente con Jorge. Por normas de copropiedad, se cobra un arancel de limpieza obligatorio de 10.000 pesos argentinos destinados a la limpieza por uso."),
        
        ("¿Cómo se abona el consumo del minibar y la cava de vinos?", 
         "Los valores están detallados en dólares estadounidenses y pesos en la carta. Al finalizar la estadía, reporte sus consumos a Jorge por mensaje y coordine el pago en efectivo o por transferencia al momento del check-out."),
        
        ("¿La caja fuerte tiene código digital?", 
         "No, la caja fuerte de la habitación funciona de manera 100% analógica mediante una llave física para mayor seguridad. Solicite la llave física a Jorge Orlando si desea utilizarla.")
    ]
    
    for q, a in faqs:
        story.append(Paragraph(f"<b>• {q}</b>", style_normal_bold))
        story.append(Paragraph(a, style_normal))
        story.append(Spacer(1, 14))
        
    story.append(PageBreak())
    
    # ---------------- PAGE 14: CHECK-OUT CHECKLIST ----------------
    story.append(Paragraph("Instrucciones para el Check-Out", style_h1))
    story.append(Paragraph("Departure instructions and final checklist", style_h2))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("La salida del departamento debe realizarse estrictamente antes de las <b>11:00 horas</b> del día de finalización de su reserva. Le pedimos completar el siguiente checklist antes de retirarse:", style_normal))
    story.append(Spacer(1, 15))
    
    checkout_steps = [
        (Paragraph("[  ] <b>Apagar Climatización:</b> Apague todos los aires acondicionados (living y dormitorio) y las luces del departamento.", style_normal)),
        (Paragraph("[  ] <b>Puertas Cerradas:</b> Asegúrese de cerrar bien la puerta del departamento tirando firmemente de ella al salir (traba automáticamente).", style_normal)),
        (Paragraph("[  ] <b>Devolución de Llaves:</b> Diríjase a la entrada exterior del edificio y coloque las llaves dentro del mismo lockbox metálico rotulado como 'Depto 101' de donde las retiró al ingresar. Recuerde desordenar las ruedas de combinación.", style_normal)),
        (Paragraph("[  ] <b>Avisar Salida:</b> Envíe un mensaje de WhatsApp rápido a Jorge Orlando confirmando que ha completado su check-out.", style_normal)),
        (Paragraph("[  ] <b>Bebidas y Consumos:</b> En el mismo mensaje de salida, recuerde declarar si ha consumido bebidas del minibar o botellas de la cava de vinos para coordinar el cobro correspondiente.", style_normal))
    ]
    
    for step in checkout_steps:
        story.append(step)
        story.append(Spacer(1, 14))
        
    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>¡Muchas gracias por elegirnos!</b>", style_h3))
    story.append(Paragraph("Esperamos que hayas tenido una hermosa estadía en Córdoba 5579. Si tu experiencia fue grata, te invitamos enormemente a dejarnos una reseña de 5 estrellas en la plataforma de Airbnb. Tu opinión nos ayuda muchísimo a seguir mejorando y a recibir a futuros viajeros.", style_normal))
    
    story.append(Spacer(1, 25))
    try:
        qr_review = RLImage("public/qr/qr_portal.png", width=75, height=75) # Pointers to main portal
        review_table = Table([[
            qr_review, Paragraph("<b>DEJAR RESEÑA EN AIRBNB</b><br/>Escanee este código con su celular para ir directo al anuncio de Airbnb y compartir su experiencia con nosotros.", style_card_body)
        ]], colWidths=[90, 370])
        review_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BACKGROUND', (0,0), (-1,-1), COLOR_ALERT_BG),
            ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 10),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(review_table)
    except Exception:
        pass
        
    story.append(PageBreak())
    
    # ---------------- PAGE 15: BACK COVER (CONTRAPORTADA) ----------------
    story.append(Spacer(1, 100))
    story.append(Paragraph("CÓRDOBA 5579", ParagraphStyle('BackTitle', parent=style_title_main, textColor=COLOR_PRIMARY)))
    story.append(Paragraph("PALERMO HOLLYWOOD", ParagraphStyle('BackSub', parent=style_title_sub, textColor=COLOR_GRAY)))
    story.append(Spacer(1, 50))
    
    # Decorative line
    back_line = Table([[""]], colWidths=[100], rowHeights=[2])
    back_line.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 2, COLOR_PRIMARY),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    story.append(back_line)
    story.append(Spacer(1, 50))
    
    # Contact and Support Info
    contact_box = [[
        Paragraph("<font color='#5F6F52'><b>CONTACTO Y ASISTENCIA / HELP & SUPPORT:</b></font><br/>"
                  "• <b>Anfitrión / Host Jorge Orlando:</b> +54 9 11 4537-9500 (WhatsApp / Llamadas)<br/>"
                  "• <b>Soporte Técnico / Web:</b> info@alexismartyniuk.com.ar<br/>"
                  "• <b>Dirección del Edificio:</b> Av. Córdoba 5579, C1414 CABA, Argentina", style_card_body)
    ]]
    contact_table = Table(contact_box, colWidths=[420])
    contact_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_ALERT_BG),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 15),
        ('BOTTOMPADDING', (0,0), (-1,-1), 15),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('RIGHTPADDING', (0,0), (-1,-1), 15),
    ]))
    story.append(contact_table)
    story.append(Spacer(1, 60))
    
    # Large Support QR Code Centered
    try:
        qr_support = RLImage("public/qr/qr_portal.png", width=120, height=120)
        qr_support_table = Table([[qr_support]], colWidths=[420])
        qr_support_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(qr_support_table)
        story.append(Spacer(1, 15))
        story.append(Paragraph("Escanee para acceder al Portal Digital las 24 hs", ParagraphStyle('BackQRLabel', fontName=FONTS['Georgia-Italic'], fontSize=10, textColor=COLOR_GRAY, alignment=TA_CENTER)))
    except Exception:
        pass
        
    story.append(Spacer(1, 140))
    story.append(Paragraph("¡Gracias por visitarnos!  •  Thank you for staying with us!", ParagraphStyle('BackThankYou', fontName=FONTS['Georgia-Bold'], fontSize=12, textColor=COLOR_PRIMARY, alignment=TA_CENTER)))
    
    # Build Document using Custom NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {OUTPUT_PDF}")

if __name__ == "__main__":
    build_pdf()
