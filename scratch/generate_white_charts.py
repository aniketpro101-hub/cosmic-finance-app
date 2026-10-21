import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

plt.rcParams['font.sans-serif'] = ['Nirmala UI', 'Segoe UI', 'DejaVu Sans', 'Arial']
plt.rcParams['font.family'] = 'sans-serif'

out_dir = r"d:\Clients Site\Cosmic Finance\public\images\clients"
os.makedirs(out_dir, exist_ok=True)

def generate_white_chart(client):
    # Generous canvas dimensions: 1500 x 1620 for crisp high-DPI
    fig = plt.figure(figsize=(15, 16.2), dpi=180, facecolor='#FFFFFF')
    
    # Chart area: leave 14% at top for the dedicated header banner
    ax = fig.add_axes([0.05, 0.03, 0.90, 0.83], facecolor='#FFFFFF')
    ax.set_xlim(-50, 1050)
    ax.set_ylim(-50, 1050)
    ax.axis('off')

    # Outer decorative card
    card = patches.FancyBboxPatch((-30, -30), 1060, 1060, boxstyle="round,pad=10,rounding_size=18",
                                  linewidth=4.5, edgecolor='#881337', facecolor='#FFFFFF')
    ax.add_patch(card)

    inner_card = patches.FancyBboxPatch((-18, -18), 1036, 1036, boxstyle="round,pad=5,rounding_size=12",
                                        linewidth=1.8, edgecolor='#D97706', facecolor='#FFFFFF')
    ax.add_patch(inner_card)

    # Shading Kendras (1, 4, 7, 10) in warm auspicious cream/gold
    kendra_color = '#FEF9C3'
    for pts in [
        [[500, 1000], [250, 750], [500, 500], [750, 750]],  # H1
        [[0, 500], [250, 750], [500, 500], [250, 250]],      # H4
        [[500, 0], [250, 250], [500, 500], [750, 250]],      # H7
        [[1000, 500], [750, 250], [500, 500], [750, 750]]    # H10
    ]:
        ax.add_patch(patches.Polygon(pts, facecolor=kendra_color, alpha=0.38))

    # Shading Trikonas (5, 9) in subtle divine pastel blue
    trikona_color = '#EFF6FF'
    ax.add_patch(patches.Polygon([[0, 0], [0, 500], [250, 250]], facecolor=trikona_color, alpha=0.45))
    ax.add_patch(patches.Polygon([[1000, 0], [1000, 500], [750, 250]], facecolor=trikona_color, alpha=0.45))

    # Classical Crimson Lines
    line_col = '#881337'
    ax.plot([0, 1000, 1000, 0, 0], [0, 0, 1000, 1000, 0], color=line_col, lw=3.8)
    ax.plot([0, 1000], [0, 1000], color=line_col, lw=2.6)
    ax.plot([0, 1000], [1000, 0], color=line_col, lw=2.6)
    ax.plot([500, 0, 500, 1000, 500], [1000, 500, 0, 500, 1000], color=line_col, lw=3.0)

    # Center Bindu / Golden Chakra
    center = patches.Circle((500, 500), 16, facecolor='#D97706', edgecolor='#881337', lw=2.2)
    ax.add_patch(center)

    # Mathematically calculated collision-free badge positions for Houses 1 to 12
    badge_pos = {
        1: (500, 580),   # H1 bottom vertex
        2: (100, 950),   # H2 top-left corner
        3: (210, 750),   # H3 apex
        4: (420, 500),   # H4 right vertex
        5: (210, 250),   # H5 apex
        6: (100, 50),    # H6 bottom-left corner
        7: (500, 420),   # H7 top vertex
        8: (900, 50),    # H8 bottom-right corner
        9: (790, 250),   # H9 apex
        10: (580, 500),  # H10 left vertex
        11: (790, 750),  # H11 apex
        12: (900, 950)   # H12 top-right corner
    }

    lagna_sign = client['lagna_sign_num']
    for h in range(1, 13):
        r_num = ((lagna_sign - 1 + (h - 1)) % 12) + 1
        bx, by = badge_pos[h]
        ax.text(bx, by, str(r_num), fontsize=16, fontweight='bold', color='#991B1B',
                ha='center', va='center',
                bbox=dict(boxstyle="circle,pad=0.35", fc="#FEF2F2", ec="#DC2626", lw=1.8))

    # Render House Contents with optimal font sizes and spacing
    h_contents = client['houses']
    for h, items in h_contents.items():
        if not items:
            continue
        num_items = len(items)
        if num_items == 1:
            cx, cy = client['single_coords'][h]
            it = items[0]
            ax.text(cx, cy + 24, it['title'], fontsize=19, fontweight='bold', color=it['title_col'], ha='center', va='center')
            ax.text(cx, cy - 3, it['sub'], fontsize=14, fontweight='bold', color='#1E293B', ha='center', va='center')
            if it.get('status'):
                ax.text(cx, cy - 29, it['status'], fontsize=12.5, fontweight='bold', color=it['status_col'], ha='center', va='center')
        elif num_items == 2:
            p1_coords, p2_coords = client['double_coords'][h]
            # Planet 1
            it1 = items[0]
            c1x, c1y = p1_coords
            ax.text(c1x, c1y + 19, it1['title'], fontsize=15.5, fontweight='bold', color=it1['title_col'], ha='center', va='center')
            ax.text(c1x, c1y - 3, it1['sub'], fontsize=12.5, fontweight='bold', color='#1E293B', ha='center', va='center')
            if it1.get('status'):
                ax.text(c1x, c1y - 24, it1['status'], fontsize=11, fontweight='bold', color=it1['status_col'], ha='center', va='center')
            # Planet 2
            it2 = items[1]
            c2x, c2y = p2_coords
            ax.text(c2x, c2y + 19, it2['title'], fontsize=15.5, fontweight='bold', color=it2['title_col'], ha='center', va='center')
            ax.text(c2x, c2y - 3, it2['sub'], fontsize=12.5, fontweight='bold', color='#1E293B', ha='center', va='center')
            if it2.get('status'):
                ax.text(c2x, c2y - 24, it2['status'], fontsize=11, fontweight='bold', color=it2['status_col'], ha='center', va='center')

    # Top Header Banner in Figure Coordinates (100% collision-free)
    fig.text(0.5, 0.965, "COSMIC FINANCE AUTHENTIC JANMA KUNDLI (D1)", 
             fontsize=25, fontweight='bold', color='#881337', ha='center')
    fig.text(0.5, 0.938, "Canonical Parashari Geometry  •  Lahiri Ayanamsha  •  Topocentric Sidereal Horizon", 
             fontsize=13.5, fontweight='bold', color='#B45309', ha='center')
    fig.text(0.5, 0.908, f"Name: {client['name']}   |   DOB: {client['dob']}   |   Time: {client['tob']}   |   Place: {client['pob']}", 
             fontsize=14.5, fontweight='bold', color='#1E293B', ha='center')

    out_file = os.path.join(out_dir, client['filename'])
    plt.savefig(out_file, dpi=180, bbox_inches='tight', facecolor='#FFFFFF', edgecolor='none')
    plt.close()
    print("Generated Crystal-Clear White Chart:", out_file)


# Standard Single-Item Coordinates for 12 Houses
std_single_coords = {
    1: (500, 770),
    2: (250, 880),
    3: (100, 750),
    4: (250, 500),
    5: (105, 250),
    6: (260, 105),
    7: (500, 240),
    8: (740, 105),
    9: (895, 250),
    10: (750, 500),
    11: (905, 750),
    12: (740, 880)
}

# 1. VRISHABH JINENDRA
generate_white_chart({
    'name': 'Vrishabh Jinendra',
    'dob': '29 November 1999',
    'tob': '14:50 (2:50 PM)',
    'pob': 'Delhi, India',
    'lagna_sign_num': 12, # Pisces
    'filename': 'vrishabh_white_chart.png',
    'single_coords': std_single_coords,
    'double_coords': {
        2: ((250, 930), (250, 860)),   # Jupiter (top) & Saturn (bottom) in H2
        11: ((905, 805), (905, 695))   # Mars (top) & Ketu (bottom) in H11
    },
    'houses': {
        1: [{'title': 'लग्न LAGNA', 'sub': "27° 20' Revati (4)", 'status': "Pisces / Meena (Lord: Jupiter)", 'title_col': '#1E3A8A', 'status_col': '#475569'}],
        2: [
            {'title': 'गुरु JUPITER [R]', 'sub': "01° 56' Ashwini", 'status': "Lagna Lord in 2nd House", 'title_col': '#B45309', 'status_col': '#047857'},
            {'title': 'शनि SATURN [R]', 'sub': "18° 05' Bharani", 'status': "Neecha (Debilitated)", 'title_col': '#6B21A8', 'status_col': '#B91C1C'}
        ],
        3: [],
        4: [],
        5: [{'title': 'राहु RAHU [R]', 'sub': "12° 57' Pushya", 'status': "5th House Speculation", 'title_col': '#7C3AED', 'status_col': '#6D28D9'}],
        6: [{'title': 'चन्द्र MOON', 'sub': "05° 40' Magha", 'status': "Janma Rashi (Simha)", 'title_col': '#0F172A', 'status_col': '#475569'}],
        7: [{'title': 'शुक्र VENUS', 'sub': "28° 35' Chitra", 'status': "DEBILITATED (Neecha)", 'title_col': '#BE185D', 'status_col': '#B91C1C'}],
        8: [{'title': 'बुध MERCURY', 'sub': "23° 14' Vishakha", 'status': "Analytical Acumen", 'title_col': '#047857', 'status_col': '#065F46'}],
        9: [{'title': 'सूर्य SUN', 'sub': "12° 51' Anuradha", 'status': "9th House Fortune", 'title_col': '#C2410C', 'status_col': '#9A3412'}],
        10: [],
        11: [
            {'title': 'मङ्गल MARS [EXA]', 'sub': "08° 52' U-Ashadha", 'status': "EXALTED (Uchcha)", 'title_col': '#DC2626', 'status_col': '#047857'},
            {'title': 'केतु KETU [R]', 'sub': "12° 57' Shravana", 'status': "11th House Gains", 'title_col': '#475569', 'status_col': '#334155'}
        ],
        12: []
    }
})

# 2. AKKRITI GUPTA
generate_white_chart({
    'name': 'Akkriti Gupta',
    'dob': '24 October 2009',
    'tob': '09:20 AM',
    'pob': 'Chhindwara, MP',
    'lagna_sign_num': 8, # Scorpio
    'filename': 'akkriti_white_chart.png',
    'single_coords': std_single_coords,
    'double_coords': {
        3: ((95, 805), (95, 695)),     # Jupiter (top) & Rahu (bottom) in H3
        9: ((905, 305), (905, 195)),   # Mars (top) & Ketu (bottom) in H9
        11: ((905, 805), (905, 695))   # Mercury (top) & Venus (bottom) in H11
    },
    'houses': {
        1: [{'title': 'लग्न LAGNA', 'sub': "13° 04' Anuradha (3)", 'status': "Scorpio / Vrishchika (Lord: Mars)", 'title_col': '#1E3A8A', 'status_col': '#475569'}],
        2: [{'title': 'चन्द्र MOON', 'sub': "16° 07' Purvashadha", 'status': "2nd House Wealth", 'title_col': '#0F172A', 'status_col': '#047857'}],
        3: [
            {'title': 'गुरु JUPITER [R]', 'sub': "27° 47' Dhanishta", 'status': "Neecha (Debilitated)", 'title_col': '#B45309', 'status_col': '#B91C1C'},
            {'title': 'राहु RAHU [R]', 'sub': "01° 17' U-Ashadha", 'status': "3rd House Courage", 'title_col': '#7C3AED', 'status_col': '#6D28D9'}
        ],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [
            {'title': 'मङ्गल MARS [R]', 'sub': "00° 03' Punarvasu", 'status': "Neecha (Debilitated)", 'title_col': '#DC2626', 'status_col': '#B91C1C'},
            {'title': 'केतु KETU [R]', 'sub': "01° 17' Punarvasu", 'status': "9th House Dharma", 'title_col': '#475569', 'status_col': '#334155'}
        ],
        10: [{'title': 'शनि SATURN', 'sub': "29° 37' U-Phalguni", 'status': "10th House Career", 'title_col': '#6B21A8', 'status_col': '#475569'}],
        11: [
            {'title': 'बुध MERCURY [EXA]', 'sub': "22° 48' Hasta", 'status': "EXALTED (Uchcha)", 'title_col': '#047857', 'status_col': '#047857'},
            {'title': 'शुक्र VENUS [NB]', 'sub': "17° 13' Hasta", 'status': "Neecha-Bhanga Yoga", 'title_col': '#BE185D', 'status_col': '#047857'}
        ],
        12: [{'title': 'सूर्य SUN', 'sub': "06° 53' Chitra", 'status': "DEBILITATED (Neecha)", 'title_col': '#C2410C', 'status_col': '#B91C1C'}]
    }
})

# 3. ANURAG RATHI
generate_white_chart({
    'name': 'Anurag Rathi',
    'dob': '10 October 1986',
    'tob': '02:02 AM',
    'pob': 'Raipur, CG',
    'lagna_sign_num': 4, # Cancer
    'filename': 'anurag_white_chart.png',
    'single_coords': std_single_coords,
    'double_coords': {
        3: ((95, 805), (95, 695)),     # Sun (top) & Ketu (bottom) in H3
        4: ((250, 560), (250, 440))    # Venus (top) & Mercury (bottom) in H4
    },
    'houses': {
        1: [{'title': 'लग्न LAGNA', 'sub': "18° 59' Ashlesha (1)", 'status': "Cancer / Karka (Lord: Moon)", 'title_col': '#1E3A8A', 'status_col': '#475569'}],
        2: [],
        3: [
            {'title': 'सूर्य SUN', 'sub': "22° 35' Hasta", 'status': "2nd Lord in 3rd House", 'title_col': '#C2410C', 'status_col': '#475569'},
            {'title': 'केतु KETU [R]', 'sub': "27° 14' Chitra", 'status': "3rd House Enterprise", 'title_col': '#475569', 'status_col': '#334155'}
        ],
        4: [
            {'title': 'शुक्र VENUS [OWN]', 'sub': "24° 40' Vishakha", 'status': "MALAVYA YOGA (Own Sign)", 'title_col': '#BE185D', 'status_col': '#047857'},
            {'title': 'बुध MERCURY', 'sub': "12° 46' Swati", 'status': "Commercial Intellect", 'title_col': '#047857', 'status_col': '#065F46'}
        ],
        5: [{'title': 'शनि SATURN', 'sub': "10° 19' Anuradha", 'status': "Disciplined Speculation", 'title_col': '#6B21A8', 'status_col': '#475569'}],
        6: [{'title': 'चन्द्र MOON', 'sub': "12° 47' Mula (4)", 'status': "Janma Rashi (Dhanu)", 'title_col': '#0F172A', 'status_col': '#475569'}],
        7: [{'title': 'मङ्गल MARS [EXA]', 'sub': "11° 26' Shravana", 'status': "RUCHAKA YOGA (Exalted)", 'title_col': '#DC2626', 'status_col': '#047857'}],
        8: [{'title': 'गुरु JUPITER [R]', 'sub': "23° 55' P-Bhadra", 'status': "Deep Financial Research", 'title_col': '#B45309', 'status_col': '#475569'}],
        9: [{'title': 'राहु RAHU [R]', 'sub': "27° 14' Revati", 'status': "9th House Fortune", 'title_col': '#7C3AED', 'status_col': '#6D28D9'}],
        10: [],
        11: [],
        12: []
    }
})