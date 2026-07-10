import csv
import urllib.request

first_tab_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlUx7LNTseRM1DhoYGmw-9ZfuWpobnDFF5pLt4AuIdMiLLVEqVN_54OTZm0YbMUTp3-iHsk6Dbx4YP/pub?output=csv"

def fetch_and_print(url, name):
    print(f"--- FETCHING {name} ---")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            content = response.read().decode('utf-8')
            lines = content.strip().split('\n')
            reader = csv.reader(lines)
            rows = list(reader)
            print(f"Total rows: {len(rows)}")
            if rows:
                print("Headers:", rows[0])
                for i, r in enumerate(rows[1:10]):
                    print(f"Row {i+1}: {r}")
    except Exception as e:
        print("Error:", e)

fetch_and_print(first_tab_url, "DEFAULT FIRST TAB")
