import re

with open('scripts/generate_manual_pdf.py', 'r', encoding='utf-8') as f:
    code = f.read()

new_toc = '''    toc_data = [
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
    ]'''

code = re.sub(r'    toc_data = \[[^\]]+\]', new_toc, code, flags=re.MULTILINE|re.DOTALL)

sections = {}
tags = ['RULES', 'CLIMATE & SAFE', 'KITCHEN', 'AMENITIES', 'INVENTORY', 'CLEANING', 'SECURITY', 'GUIDE', 'LOCAL TIPS', 'FAQ', 'CHECKOUT', 'BACK COVER']

for tag in tags:
    pattern = rf'    # ---- PAGE \d+: {tag} ----\n.*?(?=    # ---- PAGE \d+:|\Z)'
    match = re.search(pattern, code, re.DOTALL)
    if match:
        sections[tag] = match.group(0)

pre_pattern = r'(.*?)    # ---- PAGE 5: RULES ----'
pre_match = re.search(pre_pattern, code, re.DOTALL)
pre = pre_match.group(1)

order = ['CLIMATE & SAFE', 'KITCHEN', 'AMENITIES', 'GUIDE', 'LOCAL TIPS', 'RULES', 'CLEANING', 'SECURITY', 'INVENTORY', 'FAQ', 'CHECKOUT', 'BACK COVER']

new_code = pre
for i, tag in enumerate(order):
    section_text = sections[tag]
    section_text = re.sub(r'# ---- PAGE \d+:', f'# ---- PAGE {i+5}:', section_text)
    new_code += section_text
    
with open('scripts/generate_manual_pdf.py', 'w', encoding='utf-8') as f:
    f.write(new_code)

print('Success')
