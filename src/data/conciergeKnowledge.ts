export interface KnowledgeRule {
  keys: string[];
  es: string;
  en: string;
}

export interface PropertyKnowledge {
  [category: string]: KnowledgeRule;
}

export const cordoba5579Knowledge: PropertyKnowledge = {
  gastronomy: {
    keys: ["desayun", "almuerz", "cafe", "café", "comer", "gastronom", "breakfast", "eat", "food", "restaurant", "cena", "brunch"],
    es: "Para café de especialidad y brunch, te recomendamos 'Cuervo Café', 'Vive Café' y 'Café Registrado'. Si buscás parrilla tradicional, tenés 'Don Julio', 'La Cabrera' o 'Las Cabras' (a solo 2 cuadras). ¡Todas están en el mapa interactivo!",
    en: "For specialty coffee and brunch, we love 'Cuervo Café', 'Vive Café', and 'Café Registrado'. For traditional steakhouses, check out 'Don Julio', 'La Cabrera', or 'Las Cabras' (just 2 blocks away). All these recommendations are visible on our map!"
  },
  wifi: {
    keys: ["wifi", "wi-fi", "internet", "clave", "contraseña", "password", "network", "ssid"],
    es: "El departamento cuenta con internet de alta velocidad. Las credenciales de la red y el código QR de conexión rápida se encuentran impresos en carteles enmarcados dentro del departamento. Contraseña: 'Welcome101'.",
    en: "The apartment features high-speed internet. The network credentials and auto-connect QR code are printed on framed signs inside the property. Wifi password is 'Welcome101'."
  },
  checkin: {
    keys: ["check-in", "checkin", "ingres", "llave", "entrar", "lockbox", "code", "codigo", "código", "candado"],
    es: "El check-in es autónomo desde las 15:00 hs. Ubicá la caja de seguridad (lockbox) 'Depto 101' a la derecha del ingreso exterior (Av. Córdoba 5579). Ingresá la combinación que te enviamos por mensaje de confirmación, deslizá la traba y retirá las llaves. Aproximá el llavero magnético azul/negro al lector del hall exterior. Más detalles en /checkin.",
    en: "Self-check-in starts at 3:00 PM. Locate the lockbox labeled 'Depto 101' at the right of the outer entrance (Av. Córdoba 5579). Enter the combination code sent to you via confirmation message, slide the latch, and retrieve the keys. Use the blue/black magnetic tag on the outer lobby reader. Learn more at /checkin."
  },
  checkout: {
    keys: ["check-out", "checkout", "salida", "leave", "irnos", "retirar"],
    es: "El check-out es hasta las 11:00 hs. Recordá apagar todos los aires acondicionados y luces, cerrar la puerta, dejar las llaves en la caja de seguridad (lockbox) exterior desordenando los números, y avisar a Jorge por WhatsApp.",
    en: "Check-out time is strictly by 11:00 AM. Please turn off all air conditioners and lights, lock the door, return the keys to the outer lockbox (scrambling the code wheels), and notify Jorge via WhatsApp."
  },
  grill: {
    keys: ["parrilla", "asado", "grill", "bbq", "sum", "salon", "salón"],
    es: "La parrilla/SUM se encuentra en la terraza (piso 11). Por reglamento interno del consorcio, su uso requiere el pago de un arancel de $10.000 ARS destinados a la limpieza. Coordiná la reserva previa con Jorge por WhatsApp.",
    en: "The grill/SUM is located on the rooftop terrace (11th floor). Per building regulations, its use carries a $10,000 ARS fee for cleaning. Please coordinate your reservation in advance with Jorge via WhatsApp."
  },
  safe: {
    keys: ["caja fuerte", "safe", "fuerte", "caja de seguridad de la habitacion", "caja de seguridad del depto", "caja de seguridad del departamento"],
    es: "La caja fuerte del departamento funciona con una llave física. Si deseas utilizarla, por favor solicítale la llave a Jorge Orlando por WhatsApp.",
    en: "The safe in the apartment operates with a physical key. If you wish to use it, please request the key from Jorge Orlando via WhatsApp."
  },
  luggage: {
    keys: ["equipaje", "valija", "bolso", "maleta", "luggage", "baggage", "bag", "dropoff", "drop-off", "guardar"],
    es: "Por reglamento del consorcio, no está permitido el guardado de equipaje en las áreas comunes. Sin embargo, podés consultar a Jorge eventualmente según tu necesidad para ver si es posible coordinar alguna alternativa.",
    en: "Per building regulations, luggage storage is not generally allowed. However, you can consult Jorge eventually depending on your needs to see if any alternative can be coordinated."
  },
  pool: {
    keys: ["piscina", "pileta", "pool", "solarium", "terraza", "rooftop", "solárium"],
    es: "La piscina al aire libre, duchas y solárium están en la terraza (piso 9). Está disponible para huéspedes (cierra a las 20:00 hs). Es obligatorio ducharse antes de ingresar a la pileta. No se permite el acceso con invitados.",
    en: "The outdoor pool, showers, and solarium are on the rooftop terrace (9th floor). The pool is open to guests (closes at 8:00 PM). Taking a shower before swimming is mandatory. No unregistered visitors allowed."
  },
  laundry: {
    keys: ["laundry", "lavadero", "lavar", "washing", "ropa"],
    es: "El edificio cuenta con un sector de laundry (lavadero) con lavarropas de uso común para huéspedes sin costo adicional.",
    en: "There is a shared laundry room in the building with washing machines available for guests at no additional cost."
  },
  wine: {
    keys: ["vino", "cava", "botella", "alcohol", "wine", "bar", "champagne", "fernet", "bebida", "minibar", "precios", "precio", "costo", "costos", "price", "prices", "torrontes", "malbec", "syrah", "cabernet"],
    es: "La cava de vinos y minibar del departamento tiene costo adicional. Carta completa y precios actualizados en https://www.alexismartyniuk.com.ar/cordoba5579/cava. La selección incluye vinos tintos (Malbec, Cabernet Sauvignon, Syrah), blancos (Torrontés, Chenin Dulce), espumantes y Fernet con Coca-Cola. Para abrir la cava (pedir combinaciones) o pedir reposición de bebidas, contactá a Jorge Orlando por WhatsApp. Pagos Nacionales: Transferencias al Banco Santander: Titular: Martyniuk Jorge Orlando, DNI: 13671433, CBU: 0720533088000000521172, Alias: ARENA.DIESEL.CUENCA. Pagos Internacionales: Payoneer USD (Bank: First Century Bank, Routing: 061120084, SWIFT: FCNSUS32, Account: 4030000417878, Name: Alexis Martyniuk).",
    en: "The wine cellar and minibar are available for an extra charge. For the full menu and updated prices, please visit https://www.alexismartyniuk.com.ar/cordoba5579/cava. The selection includes red wines (Malbec, Cabernet Sauvignon, Syrah), white wines (Torrontés, Chenin Dulce), sparkling, and Fernet with Coke. To open the cellar (ask for combinations) or request refills, contact Jorge Orlando via WhatsApp. National Payments: Transfers to Banco Santander: Holder: Martyniuk Jorge Orlando, DNI: 13671433, CBU: 0720533088000000521172, Alias: ARENA.DIESEL.CUENCA. International Payments: Payoneer USD (Bank: First Century Bank, Routing: 061120084, SWIFT: FCNSUS32, Account: 4030000417878, Name: Alexis Martyniuk)."
  },
  parking: {
    keys: ["estacionamiento", "cochera", "auto", "garage", "parking", "vehiculo", "vehículo", "estacionar", "calle", "boti", "multa", "acarreo", "gruta", "grúa"],
    es: "El edificio no tiene cochera propia, pero podés estacionar GRATIS en la calle según datos oficiales BOTI CABA: 1) Fitz Roy 1300 y 1200 (a 50m): PERMITIDO 24 HS de ambos lados (Recomendado). 2) Humboldt 1300 y 1200: PERMITIDO 24 HS mano derecha únicamente. 3) Av. Niceto Vega 5500: PERMITIDO 24 HS mano derecha. 4) Castillo 1300: PERMITIDO 24 HS ambos lados. ⚠️ Av. Córdoba 5500 (frente al depto): Prohibido días hábiles de 7 a 21 hs (permitido de noche 21 a 7 hs y fines de semana 24 hs). 💡 Cocheras pagas techadas 24 hs: Av. Córdoba 5520 (a solo 50m). Consulta la guía interactiva en nuestro portal.",
    en: "The building has no private parking, but FREE on-street parking is available per official BOTI CABA rules: 1) Fitz Roy St 1300 & 1200 (50m away): FREE 24/7 on BOTH sides (Recommended). 2) Humboldt St 1300 & 1200: FREE 24/7 RIGHT side only. 3) Av. Niceto Vega 5500: FREE 24/7 RIGHT side only. 4) Castillo St 1300: FREE 24/7 on both sides. ⚠️ Av. Córdoba 5500: Prohibited weekdays 7 AM - 9 PM (permitted overnight 9 PM - 7 AM & weekends 24h). 💡 Covered 24/7 Paid Garage: Av. Córdoba 5520 (50m away). View our interactive portal guide for details."
  },
  beds: {
    keys: ["cama", "sabana", "sábana", "toalla", "acolchado", "frazada", "blanket", "bed", "sheet", "pillow", "almohada"],
    es: "El departamento cuenta con 1 cama Queen con sábanas de hilo egipcio de 600h y un sofá cama en el living. En estadías superiores a 7 noches se ofrece un nuevo juego de toallas. En estadías de 14 noches o más se reemplazan sábanas, toallas y se realiza un repaso de limpieza.",
    en: "The apartment has 1 Queen-size bed with premium 600-thread-count Egyptian cotton sheets, plus a sofa bed in the living room. For stays over 7 nights, we provide a fresh set of towels. For 14+ nights, sheets and towels are replaced, and a light cleaning is included."
  },
  sofabed: {
    keys: ["sillon", "sillón", "sofa", "sofá", "sillon cama", "sillón cama", "cama living", "desplegar cama", "abrir cama"],
    es: "El living cuenta con un sillón cama cómodo de 2 plazas. Para armarlo: 1) Retirá los almohadones del respaldo. 2) Tirá de la manija inferior hacia arriba y afuera. 3) Desplegá la estructura metálica en el piso. Las sábanas y almohadas adicionales están en el placar del dormitorio. Ver video-guía en el portal digital (/checkin).",
    en: "The living room features a comfortable 2-person sofa bed. To open it: 1) Remove backrest cushions. 2) Pull front handle up and out. 3) Unfold the metal frame onto the floor. Extra sheets/pillows are in the bedroom closet. Video tutorial available at /checkin."
  },
  kitchen: {
    keys: ["cocina", "licuadora", "tostadora", "cafetera", "horno", "heladera", "microondas", "freidora", "arrocera", "olla", "sarten", "sartén", "vajilla", "cubiertos"],
    es: "La cocina está equipada con heladera y microondas Samsung, freidora sin aceite, horno por convección, arrocera, licuadora, tostadora, cafetera con espumadera, ollas/sartenes Tramontina y vajilla Carol. Podés ver el listado completo en la pestaña de Inventario (/inventario).",
    en: "The kitchen is fully equipped with a Samsung refrigerator & microwave, air fryer, convection oven, rice cooker, blender, toaster, coffee maker with frother, Tramontina pots/pans, and Carol dinnerware. You can view the full list in the Inventory tab (/inventario)."
  },
  rules: {
    keys: ["mascota", "perro", "gato", "fumar", "cigarrillo", "fiesta", "ruido", "remera", "torso", "pet", "smoke", "party", "rules", "normas", "reglas"],
    es: "Reglas estrictas: Prohibido fumar en el departamento o pasillos. No se admiten mascotas. Prohibido realizar fiestas. No se permite el ingreso de visitas a los amenities. Prohibido circular con el torso desnudo en áreas comunes (excepto zona de piscina).",
    en: "Strict rules: No smoking inside or in building hallways. No pets allowed. No parties. Unregistered guests are not allowed in amenity areas. Walking shirtless in common building areas is prohibited (except pool area)."
  },
  location: {
    keys: ["ubicacion", "ubicación", "donde", "dónde", "palermo", "arena", "movistar", "cerca", "location", "address", "direccion", "dirección"],
    es: "El departamento está ubicado en Av. Córdoba 5579, en pleno Palermo Hollywood. Se encuentra a corta distancia caminando del estadio Movistar Arena (5 minutos) y rodeado de restaurantes, bares y cafés de especialidad.",
    en: "The apartment is located at Av. Córdoba 5579 (Palermo Hollywood). It is within short walking distance to the Movistar Arena (5-minute walk) and surrounded by top restaurants, bars, and cafes."
  },
  emergencies: {
    keys: ["emergencia", "emergency", "policia", "policía", "same", "bombero", "fire", "ambulance", "ambulancia", "911", "hospital", "medico", "médico"],
    es: "En caso de emergencia, podés llamar al 911 (Policía), 107 (SAME Médica) o 100 (Bomberos). El anfitrión Jorge está disponible ante urgencias al +54 9 11 4537-9500.",
    en: "In case of emergency, dial 911 (General Police), 107 (SAME Medical Urgent), or 100 (Fire). You can also contact host Jorge immediately at +54 9 11 4537-9500."
  },
  features: {
    keys: ["prestacion", "prestación", "servicio", "incluid", "ofrece", "amenities", "feature", "benefit", "amenity"],
    es: "La estadía incluye excelentes prestaciones: piscina y solárium en terraza, laundry gratis en el edificio, Wi-Fi de alta velocidad, sábanas de algodón egipcio de 600 hilos y toallas de puro algodón de 400g. Recambio de blancos cada 7 noches (y repaso de limpieza cada 14 noches).",
    en: "The stay includes premium amenities: rooftop pool and solarium, free shared laundry room, high-speed Wi-Fi, 600h Egyptian cotton bed sheets, and pure cotton towels (400g). Fresh sets are provided every 7 days (and a light cleaning at 14 days)."
  },
  accessibility: {
    keys: ["accesib", "silla de rued", "rampa", "escalera", "discapacidad", "movilidad", "wheelchair", "accessib", "elevator", "ascensor"],
    es: "El edificio cuenta con accesibilidad plena: el ingreso desde la vereda de la calle hasta el hall principal es sin escalones (a nivel de suelo), y disponés de un ascensor amplio y moderno para subir directo al piso 1, donde está el Depto 101.",
    en: "The building is fully accessible. There is step-free access from the street level (sidewalk) to the main lobby, and a modern, spacious elevator that goes directly up to the 1st floor where Depto 101 is located."
  },
  arrival: {
    keys: ["llegada", "como llegar", "cómo llegar", "dirección", "direccion", "arriving", "arrival", "map", "donde queda", "dónde queda"],
    es: "El departamento queda en Av. Córdoba 5579, Palermo Hollywood. Si venís de Aeroparque (AEP), son 15 min en taxi. Si venís de Ezeiza (EZE), son entre 45 y 60 min. El Subte D (estación Palermo o Carranza) te deja a unas 8-10 cuadras. ¡Tenés todos los detalles y el mapa de accesos en el portal!",
    en: "The apartment is at Av. Córdoba 5579, Palermo Hollywood. Arriving from Aeroparque (AEP) is a 15-min taxi drive. From Ezeiza (EZE), it is about 45-60 min. The Palermo Subway Station (Line D) is a 10-min walk, and Carranza Station is nearby. You can view all transportation hubs directly on our map!"
  }
};
