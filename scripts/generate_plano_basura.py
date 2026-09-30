import os
import math
from PIL import Image, ImageDraw, ImageFont

def generate_plano(lang='es'):
    width = 1100
    height = 860
    img = Image.new('RGB', (width, height), '#F8F9FA')
    draw = ImageDraw.Draw(img)

    # Fonts
    def get_font(size, bold=False):
        font_names = ["segoeuib.ttf" if bold else "segoeui.ttf", "arialbd.ttf" if bold else "arial.ttf"]
        for fn in font_names:
            try:
                return ImageFont.truetype(fn, size)
            except:
                pass
        return ImageFont.load_default()

    font_title = get_font(22, bold=True)
    font_subtitle = get_font(15, bold=True)
    font_label_bold = get_font(14, bold=True)
    font_label = get_font(13, bold=False)
    font_small = get_font(11, bold=False)
    font_small_bold = get_font(11, bold=True)

    # Palette
    COLOR_WALL = '#2C3E50'
    COLOR_HALLWAY = '#EDF2F7'
    COLOR_STAIRS_BG = '#FFF8E1'
    COLOR_STAIRS_BORDER = '#F57C00'
    COLOR_ELEVATOR = '#E8EAF6'
    COLOR_ELEVATOR_BORDER = '#3F51B5'
    COLOR_PATH = '#D32F2F'

    # Language Strings
    if lang == 'en':
        txt_main_title = "TRASH BIN LOCATIONS - FLOOR 1"
        txt_elevator = "ELEVATOR / LIFT"
        txt_stairwell = "EMERGENCY STAIRWELL"
        txt_cesto_negro_title = "BLACK BIN"
        txt_cesto_negro_desc = "Wet & Organic Trash"
        txt_cesto_verde_title = "GREEN BIN"
        txt_cesto_verde_desc = "Clean & Dry Recyclables"
        txt_watermark = "MAIN HALLWAY (FLOOR 1)"
        txt_d101_title = "APARTMENT 101"
        txt_d101_sub = "(Your Apartment)"
        txt_d102 = "Apartment 102"
        txt_d103 = "Apartment 103"
        txt_route_title = "Route to dispose of trash:"
        txt_step1 = "1. Exit Apartment 101 to the main hallway."
        txt_step2 = "2. Go to the 1st door on your right along the same wall."
        txt_step3 = "3. Enter the Emergency Stairwell (bins are inside)."
        txt_legend_title = "Legend:"
        txt_legend_door = "Door (30% wall width)"
        txt_legend_path = "Path from Apt 101"
        txt_legend_black = "Black Bin (Wet Trash)"
        txt_legend_green = "Green Bin (Recyclables)"
        out_path = "public/img/plano_basura_en.png"
    else:
        txt_main_title = "UBICACIÓN DE CESTOS DE BASURA - PISO 1"
        txt_elevator = "ELEVADOR / ASCENSOR"
        txt_stairwell = "ESCALERA DE EMERGENCIA"
        txt_cesto_negro_title = "CESTO NEGRO"
        txt_cesto_negro_desc = "Basura Húmeda y Orgánica"
        txt_cesto_verde_title = "CESTO VERDE"
        txt_cesto_verde_desc = "Reciclables Limpios y Secos"
        txt_watermark = "PASILLO PRINCIPAL (PISO 1)"
        txt_d101_title = "DEPARTAMENTO 101"
        txt_d101_sub = "(Su Departamento)"
        txt_d102 = "Departamento 102"
        txt_d103 = "Departamento 103"
        txt_route_title = "Recorrido para tirar la basura:"
        txt_step1 = "1. Salir del Depto 101 al pasillo principal."
        txt_step2 = "2. Ir a la 1ª puerta a la derecha sobre la misma pared."
        txt_step3 = "3. Ingresar a la Escalera de Emergencia (cestos adentro)."
        txt_legend_title = "Simbología:"
        txt_legend_door = "Puerta (30% de pared)"
        txt_legend_path = "Camino desde Depto 101"
        txt_legend_black = "Cesto Negro (Húmedos)"
        txt_legend_green = "Cesto Verde (Reciclables)"
        out_path = "public/img/plano_basura_es.png"

    # 1. Header Title Banner
    draw.rectangle([0, 0, width, 50], fill='#1E293B')
    draw.text((width//2, 25), txt_main_title, fill='#FFFFFF', font=font_title, anchor='mm')

    # Hallway Wall Geometry (Wall length = 760 px)
    hall_x1 = 180
    hall_x2 = 940
    wall_length = hall_x2 - hall_x1 # 760 px
    door_w = int(wall_length * 0.30) # EXACTLY 30% OF WALL = 228 px wide doors!

    hall_y1 = 280
    hall_y2 = 560
    wall_thick = 6

    # 2. Main Hallway Fill
    draw.rectangle([hall_x1, hall_y1, hall_x2, hall_y2], fill=COLOR_HALLWAY)

    # 3. Elevador (Left Side Wall)
    ele_x1, ele_y1, ele_x2, ele_y2 = 40, hall_y1, hall_x1, hall_y2
    draw.rectangle([ele_x1, ele_y1, ele_x2, ele_y2], fill=COLOR_ELEVATOR, outline=COLOR_ELEVATOR_BORDER, width=3)
    draw.line([ele_x1, ele_y1, ele_x2, ele_y2], fill='#C5CAE9', width=1)
    draw.line([ele_x1, ele_y2, ele_x2, ele_y1], fill='#C5CAE9', width=1)
    
    # Elevator doors on hallway wall
    draw.line([hall_x1, hall_y1 + 80, hall_x1, hall_y2 - 80], fill='#3F51B5', width=6)
    
    # Vertical text for elevator
    txt_img = Image.new('RGBA', (220, 40), (255, 255, 255, 0))
    txt_draw = ImageDraw.Draw(txt_img)
    txt_draw.text((110, 20), txt_elevator, fill=COLOR_ELEVATOR_BORDER, font=font_label_bold, anchor='mm')
    rot_txt = txt_img.rotate(90, expand=True)
    img.paste(rot_txt, (60, (ele_y1 + ele_y2)//2 - 110), rot_txt)

    # 4. Trash & Emergency Stairwell Enclosure Background (Top Right: x=460 to 940, y=55 to hall_y1)
    stair_x1, stair_y1, stair_x2, stair_y2 = 460, 55, 940, hall_y1
    draw.rectangle([stair_x1, stair_y1, stair_x2, stair_y2], fill=COLOR_STAIRS_BG, outline=COLOR_STAIRS_BORDER, width=3)
    draw.text((stair_x1 + 15, stair_y1 + 20), txt_stairwell, fill=COLOR_STAIRS_BORDER, font=font_small_bold, anchor='ls')

    # 5. Hallway Walls
    draw.line([hall_x1, hall_y1, hall_x2, hall_y1], fill=COLOR_WALL, width=wall_thick)
    draw.line([hall_x1, hall_y2, hall_x2, hall_y2], fill=COLOR_WALL, width=wall_thick)
    draw.line([hall_x2, hall_y1, hall_x2, hall_y2], fill=COLOR_WALL, width=wall_thick)

    # Hallway Watermark
    draw.text((560, 520), txt_watermark, fill='#CBD5E1', font=font_subtitle, anchor='mm')

    # Architectural Door Function (90-deg swing for exact 30% width doors)
    def draw_architectural_door_30pct(x_hinge, y_wall, dw, is_bottom=False):
        draw.line([x_hinge, y_wall, x_hinge + dw, y_wall], fill=COLOR_HALLWAY, width=wall_thick+2)
        draw.rectangle([x_hinge-3, y_wall-5, x_hinge+3, y_wall+5], fill=COLOR_WALL)
        draw.rectangle([x_hinge+dw-3, y_wall-5, x_hinge+dw+3, y_wall+5], fill=COLOR_WALL)

        if not is_bottom: # Swings UP into room
            draw.line([x_hinge, y_wall, x_hinge, y_wall - dw], fill=COLOR_WALL, width=4)
            bbox = [x_hinge - dw, y_wall - dw, x_hinge + dw, y_wall + dw]
            draw.arc(bbox, start=270, end=360, fill='#546E7A', width=2)
        else: # Swings DOWN into hallway/room
            draw.line([x_hinge, y_wall, x_hinge, y_wall + dw], fill=COLOR_WALL, width=4)
            bbox = [x_hinge - dw, y_wall - dw, x_hinge + dw, y_wall + dw]
            draw.arc(bbox, start=0, end=90, fill='#546E7A', width=2)

    # DOOR POSITIONS (30% wide = 228 px):
    d_left_x = 220
    d_right_x = 672

    # 6. Draw 30% Wide Doors (Layered BEFORE bin boxes!)
    draw_architectural_door_30pct(d_left_x, hall_y1, door_w, is_bottom=False)
    draw_architectural_door_30pct(d_right_x, hall_y1, door_w, is_bottom=False)

    draw_architectural_door_30pct(d_left_x, hall_y2, door_w, is_bottom=True)
    draw_architectural_door_30pct(d_right_x, hall_y2, door_w, is_bottom=True)

    # 7. Draw Room Cards & Bins OVER the door arcs so they remain 100% crisp and uncrossed!
    # Depto 101 Label Box
    draw.rectangle([190, hall_y1 - 210, 420, hall_y1 - 150], fill='#E6F4EA', outline='#2E7D32', width=2)
    draw.text((305, hall_y1 - 190), txt_d101_title, fill='#2E7D32', font=font_small_bold, anchor='mm')
    draw.text((305, hall_y1 - 170), txt_d101_sub, fill='#388E3C', font=font_small, anchor='mm')

    # Cesto Negro inside Stairwell
    cn_x1, cn_y1, cn_x2, cn_y2 = 485, stair_y1 + 25, 680, stair_y1 + 115
    draw.rectangle([cn_x1, cn_y1, cn_x2, cn_y2], fill='#212121', outline='#000000', width=2)
    draw.text(((cn_x1+cn_x2)//2, cn_y1 + 20), txt_cesto_negro_title, fill='#FFFFFF', font=font_small_bold, anchor='mm')
    draw.text(((cn_x1+cn_x2)//2, cn_y1 + 45), txt_cesto_negro_desc, fill='#E0E0E0', font=font_small, anchor='mm')

    # Cesto Verde inside Stairwell
    cv_x1, cv_y1, cv_x2, cv_y2 = 705, stair_y1 + 25, 920, stair_y1 + 115
    draw.rectangle([cv_x1, cv_y1, cv_x2, cv_y2], fill='#2E7D32', outline='#1B5E20', width=2)
    draw.text(((cv_x1+cv_x2)//2, cv_y1 + 20), txt_cesto_verde_title, fill='#FFFFFF', font=font_small_bold, anchor='mm')
    draw.text(((cv_x1+cv_x2)//2, cv_y1 + 45), txt_cesto_verde_desc, fill='#E8F5E9', font=font_small, anchor='mm')

    # Bottom Door Labels
    draw.text((d_left_x + door_w//2, hall_y2 + 242), txt_d102, fill='#757575', font=font_label, anchor='mm')
    draw.text((d_right_x + door_w//2, hall_y2 + 242), txt_d103, fill='#757575', font=font_label, anchor='mm')

    # 8. Path and Arrow
    p_start_x = d_left_x + 60
    p_dest_x = d_right_x + 60
    p_start = (p_start_x, hall_y1 + 45)
    p_turn = (p_start_x, hall_y1 + 120)
    p_dest_hall = (p_dest_x, hall_y1 + 120)
    p_dest_door = (p_dest_x, hall_y1 - 20)

    # Start dot
    draw.ellipse([p_start[0]-8, p_start[1]-8, p_start[0]+8, p_start[1]+8], fill=COLOR_PATH)
    draw.line([p_start, p_turn], fill=COLOR_PATH, width=5)
    draw.line([p_turn, p_dest_hall], fill=COLOR_PATH, width=5)
    draw.line([p_dest_hall, p_dest_door], fill=COLOR_PATH, width=5)

    # Arrowhead pointing UP into Escalera door
    ax, ay = p_dest_door
    draw.polygon([(ax, ay - 14), (ax - 10, ay + 4), (ax + 10, ay + 4)], fill=COLOR_PATH)

    # 9. Route Instruction Box
    b_x1, b_y1, b_w, b_h = 250, hall_y1 + 160, 520, 115
    b_x2, b_y2 = b_x1 + b_w, b_y1 + b_h
    draw.rectangle([b_x1, b_y1, b_x2, b_y2], fill='#FFFFFF', outline=COLOR_PATH, width=2)
    
    # Title with small red arrow icon
    draw.line([b_x1 + 18, b_y1 + 22, b_x1 + 38, b_y1 + 22], fill=COLOR_PATH, width=3)
    draw.polygon([(b_x1 + 38, b_y1 + 22), (b_x1 + 32, b_y1 + 18), (b_x1 + 32, b_y1 + 26)], fill=COLOR_PATH)
    draw.text((b_x1 + 48, b_y1 + 22), txt_route_title, fill=COLOR_PATH, font=font_small_bold, anchor='lm')

    # Step list
    draw.text((b_x1 + 20, b_y1 + 48), txt_step1, fill='#333333', font=font_small, anchor='lm')
    draw.text((b_x1 + 20, b_y1 + 68), txt_step2, fill='#333333', font=font_small, anchor='lm')
    draw.text((b_x1 + 20, b_y1 + 88), txt_step3, fill='#333333', font=font_small, anchor='lm')

    # 10. Footer Legend
    draw.rectangle([0, height-50, width, height], fill='#F1F5F9')
    draw.line([0, height-50, width, height-50], fill='#CBD5E1', width=1)

    draw.text((30, height-25), txt_legend_title, fill='#475569', font=font_small_bold, anchor='lm')

    # Door symbol legend
    draw.line([110, height-35, 110, height-15], fill=COLOR_WALL, width=2)
    draw.arc([110-15, height-35, 110+15, height-5], start=270, end=360, fill='#546E7A', width=2)
    draw.text((135, height-25), txt_legend_door, fill='#475569', font=font_small, anchor='lm')

    # Red arrow legend
    draw.line([290, height-25, 325, height-25], fill=COLOR_PATH, width=3)
    draw.polygon([(325, height-25), (318, height-29), (318, height-21)], fill=COLOR_PATH)
    draw.text((335, height-25), txt_legend_path, fill='#475569', font=font_small, anchor='lm')

    # Cesto Negro legend
    draw.rectangle([510, height-35, 525, height-15], fill='#212121')
    draw.text((535, height-25), txt_legend_black, fill='#475569', font=font_small, anchor='lm')

    # Cesto Verde legend
    draw.rectangle([710, height-35, 725, height-15], fill='#2E7D32')
    draw.text((735, height-25), txt_legend_green, fill='#475569', font=font_small, anchor='lm')

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, quality=95)
    print(f"Generated {out_path} successfully.")

    if lang == 'es':
        # Default alias copy
        img.save("public/img/plano_basura.png", quality=95)

if __name__ == "__main__":
    generate_plano('es')
    generate_plano('en')
