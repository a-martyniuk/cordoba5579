import json
with open('airbnb_state.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

niobe = data.get('niobeClientData', [])
pdp = niobe[0][1].get('data', {}) if niobe else {}
sections = pdp.get('presentation', {}).get('stayProductDetailPage', {}).get('sections', {}).get('sections', [])

for s in sections:
    if s.get('sectionId') == 'PHOTO_TOUR_SCROLLABLE_MODAL':
        media = s.get('section', {}).get('mediaItems', [])
        print(f'Found {len(media)} mediaItems')
        for i, m in enumerate(media[:5]):
            print(f'Item {i}: {m.get("id")}, title: {m.get("accessibilityLabel")}, url: {m.get("baseUrl") or m.get("picture")}')
