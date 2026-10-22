import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

plt.rcParams['font.sans-serif'] = ['Nirmala UI', 'Segoe UI', 'Arial']
plt.rcParams['font.family'] = 'sans-serif'

out_dir = r"d:\Clients Site\Cosmic Finance\public\images\clients"
os.makedirs(out_dir, exist_ok=True)

def generate_chart(client):
    fig = plt.figure(figsize=(12, 12), dpi=160, facecolor='#080C15')
    ax = fig.add_axes([0.05, 0.05, 0.90, 0.90], facecolor='#080C15')
    ax.set_xlim(-50, 1050)
    ax.set_ylim(-50, 1050)
    ax.axis('off')

    # Card background
    card = patches.FancyBboxPatch((-30, -30), 1060, 1060, boxstyle="round,pad=10,rounding_size=20",
                                  linewidth=2.5, edgecolor='#D4AF37', facecolor='#0D1322')
    ax.add_patch(card)

    # Shading Kendras (1, 4, 7, 10)
    kendra_color = '#172554'
    for pts in [
        [[500, 1000], [250, 750], [500, 500], [750, 750]],
        [[0, 500], [250, 750], [500, 500], [250, 250]],
        [[500, 0], [250, 250], [500, 500], [750, 250]],
        [[1000, 500], [750, 250], [500, 500], [750, 750]]
    ]:
        ax.add_patch(patches.Polygon(pts, facecolor=kendra_color, alpha=0.45))

    # Shading Trikonas (5, 9)
    trikona_color = '#1E1B4B'
    ax.add_patch(patches.Polygon([[0, 0], [0, 500], [250, 250]], facecolor=trikona_color, alpha=0.35))
    ax.add_patch(patches.Polygon([[1000, 0], [1000, 500], [750, 250]], facecolor=trikona_color, alpha=0.35))

    # Gold lines
    gold = '#D4AF37'
    ax.plot([0, 1000, 1000, 0, 0], [0, 0, 1000, 1000, 0], color='#F59E0B', lw=2.8)
    ax.plot([0, 1000], [0, 1000], color=gold, lw=1.8)
    ax.plot([0, 1000], [1000, 0], color=gold, lw=1.8)
    ax.plot([500, 0, 500, 1000, 500], [1000, 500, 0, 500, 1000], color=gold, lw=2.2)

    center = patches.Circle((500, 500), 12, facecolor=gold, edgecolor='#FFF', lw=1.5)
    ax.add_patch(center)

    # Rashi Badges & House Numbers
    # Standard North Indian house positions:
    # 1: top diamond, 2: top-left, 3: left-upper, 4: left diamond, 5: left-lower, 6: bottom-left,
    # 7: bottom diamond, 8: bottom-right, 9: right-lower, 10: right diamond, 11: right-upper, 12: top-right
    badge_pos = {
        1: (500, 630), 2: (150, 870), 3: (170, 750), 4: (380, 500),
        5: (170, 250), 6: (330, 140), 7: (500, 385), 8: (670, 140),
        9: (830, 250), 10: (620, 500), 11: (790, 750), 12: (850, 870)
    }

    lagna_sign = client['lagna_sign_num'] # 1 to 12
    for h in range(1, 13):
        r_num = ((lagna_sign - 1 + (h - 1)) % 12) + 1
        bx, by = badge_pos[h]
        ax.text(bx, by, str(r_num), fontsize=13, fontweight='bold', color='#FDE68A',
                ha='center', va='center',
                bbox=dict(boxstyle="circle,pad=0.28", fc="#0F172A", ec="#D4AF37", lw=1.2))

    # Render House Contents
    h_contents = client['houses']
    for h, items in h_contents.items():
        if not items:
            continue
        cx, cy = client['house_coords'][h]
        for idx, item in enumerate(items):
            offset_y = (len(items) - 1 - idx) * 26 - ((len(items) - 1) * 13)
            ax.text(cx, cy + offset_y + 10, item['title'], fontsize=11.5, fontweight='bold',
                    color=item['color'], ha='center', va='center')
            ax.text(cx, cy + offset_y - 10, item['sub'], fontsize=9.5,
                    color='#E2E8F0', ha='center', va='center')

    # Header in chart
    fig.text(0.5, 0.965, f"COSMIC FINANCE AUTHENTIC JANMA KUNDLI (D1)", 
             fontsize=16, fontweight='bold', color='#F59E0B', ha='center')
    fig.text(0.5, 0.940, f"{client['name']}  •  {client['dob']}  •  {client['tob']}  •  {client['pob']}", 
             fontsize=10.5, color='#CBD5E1', ha='center')

    out_file = os.path.join(out_dir, client['filename'])
    plt.savefig(out_file, dpi=160, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Generated:", out_file)

# 1. AKKRITI GUPTA (Lagna: Scorpio / 8)
generate_chart({
    'name': 'Akkriti Gupta',
    'dob': '24 Oct 2009',
    'tob': '09:20 AM',
    'pob': 'Chhindwara, MP',
    'lagna_sign_num': 8,
    'filename': 'akkriti_gupta_true_kundli.png',
    'house_coords': {
        1: (500, 800), 2: (250, 930), 3: (80, 750), 4: (235, 500),
        5: (80, 250), 6: (240, 75), 7: (500, 250), 8: (760, 75),
        9: (920, 250), 10: (760, 500), 11: (915, 780), 12: (760, 930)
    },
    'houses': {
        1: [{'title': 'LAGNA / लग्न', 'sub': "13° 04' (Anuradha)", 'color': '#38BDF8'}],
        2: [{'title': 'चन्द्र Moon', 'sub': "16° 07' (Purvashadha)", 'color': '#F8FAFC'}],
        3: [
            {'title': 'गुरु Jupiter [R][Deb]', 'sub': "27° 47' (Dhanishta)", 'color': '#FBBF24'},
            {'title': 'राहु Rahu [R]', 'sub': "01° 17' (U-Ashadha)", 'color': '#C084FC'}
        ],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [
            {'title': 'मङ्गल Mars [Deb]', 'sub': "00° 03' (Punarvasu)", 'color': '#EF4444'},
            {'title': 'केतु Ketu [R]', 'sub': "01° 17' (Punarvasu)", 'color': '#CBD5E1'}
        ],
        10: [{'title': 'शनि Saturn', 'sub': "29° 37' (U-Phalguni)", 'color': '#818CF8'}],
        11: [
            {'title': 'बुध Mercury [Exa]', 'sub': "22° 48' (Hasta)", 'color': '#4ADE80'},
            {'title': 'शुक्र Venus [Deb]', 'sub': "17° 13' (Hasta)", 'color': '#F472B6'}
        ],
        12: [{'title': 'सूर्य Sun [Deb]', 'sub': "06° 53' (Chitra)", 'color': '#F59E0B'}]
    }
})

# 2. ANURAG RATHI (Lagna: Cancer / 4)
generate_chart({
    'name': 'Anurag Rathi',
    'dob': '10 Oct 1986',
    'tob': '02:02 AM',
    'pob': 'Raipur, CG',
    'lagna_sign_num': 4,
    'filename': 'anurag_rathi_true_kundli.png',
    'house_coords': {
        1: (500, 800), 2: (250, 930), 3: (80, 750), 4: (235, 500),
        5: (80, 250), 6: (240, 75), 7: (500, 250), 8: (760, 75),
        9: (920, 250), 10: (760, 500), 11: (915, 780), 12: (760, 930)
    },
    'houses': {
        1: [{'title': 'LAGNA / लग्न', 'sub': "18° 59' (Ashlesha)", 'color': '#38BDF8'}],
        2: [],
        3: [
            {'title': 'सूर्य Sun', 'sub': "22° 35' (Hasta)", 'color': '#F59E0B'},
            {'title': 'केतु Ketu [R]', 'sub': "27° 14' (Chitra)", 'color': '#CBD5E1'}
        ],
        4: [
            {'title': 'शुक्र Venus [Own]', 'sub': "24° 40' (Vishakha)", 'color': '#F472B6'},
            {'title': 'बुध Mercury', 'sub': "12° 46' (Swati)", 'color': '#4ADE80'}
        ],
        5: [{'title': 'शनि Saturn', 'sub': "10° 19' (Anuradha)", 'color': '#818CF8'}],
        6: [{'title': 'चन्द्र Moon', 'sub': "12° 47' (Mula)", 'color': '#F8FAFC'}],
        7: [{'title': 'मङ्गल Mars [Exa]', 'sub': "11° 26' (Shravana)", 'color': '#EF4444'}],
        8: [{'title': 'गुरु Jupiter [R]', 'sub': "23° 55' (P-Bhadra)", 'color': '#FBBF24'}],
        9: [{'title': 'राहु Rahu [R]', 'sub': "27° 14' (Revati)", 'color': '#C084FC'}],
        10: [],
        11: [],
        12: []
    }
})

# 3. VRISHABH JINENDRA (Lagna: Pisces / 12)
generate_chart({
    'name': 'Vrishabh Jinendra',
    'dob': '29 Nov 1999',
    'tob': '14:50 (2:50 PM)',
    'pob': 'Delhi',
    'lagna_sign_num': 12,
    'filename': 'vrishabh_jinendra_true_kundli.png',
    'house_coords': {
        1: (500, 800), 2: (250, 930), 3: (80, 750), 4: (235, 500),
        5: (80, 250), 6: (240, 75), 7: (500, 250), 8: (760, 75),
        9: (920, 250), 10: (760, 500), 11: (915, 780), 12: (760, 930)
    },
    'houses': {
        1: [{'title': 'LAGNA / लग्न', 'sub': "27° 20' (Revati)", 'color': '#38BDF8'}],
        2: [
            {'title': 'गुरु Jupiter [R]', 'sub': "01° 56' (Ashwini)", 'color': '#FBBF24'},
            {'title': 'शनि Saturn [R][Deb]', 'sub': "18° 05' (Bharani)", 'color': '#818CF8'}
        ],
        3: [],
        4: [],
        5: [{'title': 'राहु Rahu [R]', 'sub': "12° 57' (Pushya)", 'color': '#C084FC'}],
        6: [{'title': 'चन्द्र Moon', 'sub': "05° 40' (Magha)", 'color': '#F8FAFC'}],
        7: [{'title': 'शुक्र Venus [Deb]', 'sub': "28° 35' (Chitra)", 'color': '#F472B6'}],
        8: [{'title': 'बुध Mercury', 'sub': "23° 14' (Vishakha)", 'color': '#4ADE80'}],
        9: [{'title': 'सूर्य Sun', 'sub': "12° 51' (Anuradha)", 'color': '#F59E0B'}],
        10: [],
        11: [
            {'title': 'मङ्गल Mars [Exa]', 'sub': "08° 52' (U-Ashadha)", 'color': '#EF4444'},
            {'title': 'केतु Ketu [R]', 'sub': "12° 57' (Shravana)", 'color': '#CBD5E1'}
        ],
        12: []
    }
})
