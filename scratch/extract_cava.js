
    const obj = {
    es: {
      pageTitle: "Cava de Vinos & Minibar",
      pageSubtitle: "Selección premium para disfrutar durante tu estadía en Córdoba 5579.",
      backBtn: "Volver al Inicio",
      headerTag: "Cava & Minibar (Costo Adicional)",
      howItWorksTitle: "¿Cómo funciona?",
      howItWorksText: "Disfrutá libremente de los vinos y bebidas disponibles. Al momento de tu check-out, simplemente informale a Jorge qué consumiste para coordinar el cobro.",
      disclaimer: "Los precios están expresados en dólares estadounidenses (USD). Se abonan al finalizar la estadía.",
      quantityLabel: "Disponibles en unidad: ",
      priceLabel: "Precio",
      noItems: "No hay productos configurados en la cava actualmente.",
      rules: [
        "Cristalería fina disponible en el rincón bar del living.",
        "Por favor, mantén refrigerados los blancos y burbujas antes de consumir.",
        "Consumo exclusivo para mayores de 18 años."
      ],
      cavaRulesTitle: "Normas de la Cava",
    },
    en: {
      pageTitle: "Wine Cellar & Minibar",
      pageSubtitle: "Premium selection to enjoy during your stay at Córdoba 5579.",
      backBtn: "Back to Home",
      headerTag: "Wine Cellar & Minibar (Extra Cost)",
      howItWorksTitle: "How it works?",
      howItWorksText: "Enjoy the available wines and drinks freely. At checkout, simply let Jorge know what you consumed to coordinate payment.",
      disclaimer: "Prices are in US Dollars (USD). Paid upon checkout.",
      quantityLabel: "Available in unit: ",
      priceLabel: "Price",
      noItems: "There are currently no products configured in the cellar.",
      rules: [
        "Fine glassware is available at the bar corner in the living room.",
        "Please keep white wines and sparkling drinks chilled before consuming.",
        "Consumption exclusive for guests aged 18 and older."
      ],
      cavaRulesTitle: "Wine Cellar Rules",
    }
  };
    const fs = require('fs');
    fs.writeFileSync('scratch/cava_es.json', JSON.stringify(obj.es, null, 2));
    fs.writeFileSync('scratch/cava_en.json', JSON.stringify(obj.en, null, 2));
    