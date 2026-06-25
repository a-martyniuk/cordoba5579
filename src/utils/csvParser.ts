import fallbackInventory from "../data/inventory-fallback.json";

export interface InventoryItem {
  category: string;
  item: string;
  quantity: number;
  detail: string;
}

/**
 * Parse a standard CSV string into an array of string arrays.
 * Handles commas, double-quoted values, escaped double-quotes, and newlines.
 */
export function parseCSV(csvText: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          i++; // Skip the next quote
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(cell.trim());
        cell = '';
      } else if (char === '\n' || char === '\r') {
        row.push(cell.trim());
        if (row.length > 1 || row[0] !== '') {
          lines.push(row);
        }
        row = [];
        cell = '';
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip \n
        }
      } else {
        cell += char;
      }
    }
  }
  if (cell || row.length > 0) {
    row.push(cell.trim());
    lines.push(row);
  }
  return lines;
}

/**
 * Fetches inventory from a public Google Sheets CSV URL.
 * Falls back to local JSON if it fails or if the URL is not provided.
 */
export async function fetchInventory(csvUrl?: string): Promise<InventoryItem[]> {
  if (!csvUrl) {
    return fallbackInventory as InventoryItem[];
  }

  try {
    const response = await fetch(csvUrl, { next: { revalidate: 300 } }); // Cache for 5 minutes
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvText = await response.text();
    const parsedData = parseCSV(csvText);

    // Skip header row and map to InventoryItem format
    // Expected columns: Categoría, Item, Cantidad, Detalle
    if (parsedData.length <= 1) {
      return fallbackInventory as InventoryItem[];
    }

    const items: InventoryItem[] = parsedData.slice(1).map((row) => {
      return {
        category: row[0] || "Otros",
        item: row[1] || "Sin nombre",
        quantity: parseInt(row[2], 10) || 0,
        detail: row[3] || ""
      };
    });

    return items;
  } catch (error) {
    console.error("Error fetching remote inventory, using fallback:", error);
    return fallbackInventory as InventoryItem[];
  }
}
