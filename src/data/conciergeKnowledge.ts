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
    keys: ["check-in", "checkin", "ingres", "llave", "entrar", "lockbox", "code", "codigo", "código", "caja fuerte", "candado"],
    es: "El check-in es autónomo desde las 15:00 hs. Ubicá la caja de seguridad (lockbox) 'Depto 101' a la derecha del ingreso exterior (Av. Córdoba 5579). Ingresá la combinación que te enviamos por mensaje de confirmación, deslizá la traba y retirá las llaves. Aproximá el llavero magnético azul/negro al lector del hall exterior. Más detalles en /checkin.",
    en: "Self-check-in starts at 3:00 PM. Locate the lockbox labeled 'Depto 101' at the right of the outer entrance (Av. Córdoba 5579). Enter the combination code sent to you via confirmation message, slide the latch, and retrieve the keys. Use the blue/black magnetic tag on the outer lobby reader. Learn more at /checkin."
  },
  checkout: {
    keys: ["check-out", "checkout", "salida", "leave", "irnos", "retirar"],
    es: "El check-out es hasta las 11:00 hs. Recordá apagar todos los aires acondicionados y luces, cerrar la puerta, dejar las llaves en la caja de seguridad (lockbox) exterior desordenando los números, y avisar a Jorge por WhatsApp.",
    en: "Check-out time is strictly by 11:00 AM. Please turn off all air conditioners and lights, lock the door, return the keys to the outer lockbox (scrambling the code wheels), and notify Jorge via WhatsApp."
  },
  grill: {
    keys: ["parrilla", "asado", "grill", "bbq"],
    es: "La parrilla se encuentra en la terraza. Podés utilizarla reservándola previamente con Jorge por WhatsApp (tiene un costo de limpieza adicional).",
    en: "The grill is located on the rooftop terrace. It is available to guests but requires prior booking and carries an extra cleaning fee. Please coordinate with Jorge via WhatsApp to reserve."
  },
  pool: {
    keys: ["piscina", "pileta", "pool", "solarium", "terraza", "rooftop", "solárium"],
    es: "La piscina al aire libre, duchas y solárium están en la terraza (piso 9). Está disponible para huéspedes (cierra a las 20:00 hs). Es obligatorio ducharse antes de ingresar a la pileta. No se permite el acceso con invitados.",
    en: "The outdoor pool, showers, and solarium are on the rooftop terrace (9th floor). The pool is open to guests (closes at 8:00 PM). Taking a shower before swimming is mandatory. No unregistered visitors allowed."
  },
  laundry: {
    keys: ["laundry", "lavadero", "lavar", "secar", "washing", "dryer", "ropa"],
    es: "El edificio cuenta con un sector de laundry (lavadero) con lavadoras y secadoras de uso común para huéspedes sin costo adicional.",
    en: "There is a shared laundry room in the building with washing machines and dryers available for guests at no additional cost."
  },
  wine: {
    keys: ["vino", "cava", "botella", "alcohol", "wine", "bar", "champagne", "fernet", "bebida"],
    es: "El depto cuenta con un rincón bar y una dotación de vinos de coste extra (Malbec, Syrah, Cabernet Sauvignon, Torrontés, Blanco Dulce, Champagne y Fernet Branca). Por favor, avisar el consumo a Jorge para su reposición.",
    en: "The apartment features a minibar and wine selection for an extra cost (Malbec, Syrah, Cabernet Sauvignon, Torrontés, Dulce, Champagne, and Fernet Branca). Please report any consumption to Jorge for replenishment."
  },
  parking: {
    keys: ["estacionamiento", "cochera", "auto", "garage", "parking", "vehiculo", "vehículo"],
    es: "El departamento no cuenta con cochera propia. Hay estacionamiento gratis en la calle, o bien estacionamiento de pago a solo 50 metros sobre la misma avenida.",
    en: "The apartment does not have its own parking space. Free parking is available on the street, or you can use a paid parking garage located 50 meters away on the same avenue."
  },
  beds: {
    keys: ["cama", "sabana", "sábana", "toalla", "acolchado", "frazada", "blanket", "bed", "sheet", "pillow", "almohada"],
    es: "El departamento cuenta con 1 cama Queen con sábanas de hilo egipcio de 600h y un sofá cama en el living. En estadías superiores a 7 noches se ofrece un nuevo juego de toallas. En estadías de 14 noches o más se reemplazan sábanas, toallas y se realiza un repaso de limpieza.",
    en: "The apartment has 1 Queen-size bed with premium 600-thread-count Egyptian cotton sheets, plus a sofa bed in the living room. For stays over 7 nights, we provide a fresh set of towels. For 14+ nights, sheets and towels are replaced, and a light cleaning is included."
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
