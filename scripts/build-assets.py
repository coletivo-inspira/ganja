#!/usr/bin/env python3
"""
Deterministic Brand & Editorial Asset Pipeline for GANJA STUDIO (@ganjastudio.br).
1. Extracts the official G★NJ★ stencil wordmark from /home/antigravity/abd85765-12c0-40e8-af30-600407e94f25.svg
   (1024x682 8-bit RGBA PNG, tight alpha bbox 92,242 -> 938,428) into:
   - public/assets/brand/ganja-star-mark.svg (6 semantic <g> groups, viewBox="92 242 847 187")
   - public/assets/brand/ganja-star-star.svg (isolated star emblem, viewBox="258 257 163 157")
   - public/assets/brand/ganja-star-mark.png (cropped 847x187 RGBA PNG)
2. Generates high-craft brutalist editorial SVG plates for:
   - Looks 01..10 silhouette & macro texture plates (public/assets/looks/)
   - Stage Proof performance plates (public/assets/stage/)
   - Are.na Moodboard research cutouts (public/assets/moodboard/)
   - Curated @ganjastudio.br Instagram contact strip frames (public/assets/instagram/)
"""

from pathlib import Path
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape
from PIL import Image
import numpy as np


ROOT = Path(__file__).resolve().parent.parent
SRC_LOGO = Path('/home/antigravity/abd85765-12c0-40e8-af30-600407e94f25.svg')
ASSETS_DIR = ROOT / 'public' / 'assets'


def extract_brand_mark() -> str:
    brand_dir = ASSETS_DIR / 'brand'
    brand_dir.mkdir(parents=True, exist_ok=True)

    img = Image.open(SRC_LOGO)
    # 1. Save tightly cropped RGBA PNG (847x187)
    cropped = img.crop((92, 242, 939, 429))
    cropped.save(brand_dir / 'ganja-star-mark.png', format='PNG', optimize=True)

    # 2. Trace exact pixel-grid boundary contours into 6 semantic SVG <g> groups
    a = np.array(img)[:, :, 3] >= 128
    edges: dict[tuple[int, int], list[tuple[int, int]]] = {}
    H, W = a.shape
    for y in range(H):
        for x in range(W):
            if a[y, x]:
                if y == 0 or not a[y - 1, x]:
                    edges.setdefault((x, y), []).append((x + 1, y))
                if x == W - 1 or not a[y, x + 1]:
                    edges.setdefault((x + 1, y), []).append((x + 1, y + 1))
                if y == H - 1 or not a[y + 1, x]:
                    edges.setdefault((x + 1, y + 1), []).append((x, y + 1))
                if x == 0 or not a[y, x - 1]:
                    edges.setdefault((x, y + 1), []).append((x, y))

    loops = []
    while edges:
        start = next(iter(edges))
        loop = [start]
        curr = start
        while True:
            nxt_list = edges.get(curr, [])
            if not nxt_list:
                break
            nxt = nxt_list.pop()
            if not nxt_list:
                del edges[curr]
            if nxt == start:
                break
            if len(loop) >= 2:
                p1, p2 = loop[-2], loop[-1]
                if (p2[0] - p1[0]) * (nxt[1] - p2[1]) == (p2[1] - p1[1]) * (nxt[0] - p2[0]):
                    loop[-1] = nxt
                else:
                    loop.append(nxt)
            else:
                loop.append(nxt)
            curr = nxt
        loops.append(loop)

    regions = [
        ('glyph-G', 92, 247),
        ('glyph-STAR-1', 258, 420),
        ('spatter-mid', 432, 434),
        ('glyph-N', 437, 600),
        ('glyph-J', 615, 762),
        ('glyph-STAR-2', 764, 938),
    ]

    groups_svg = []
    star_d = ''
    for gid, x0, x1 in regions:
        rloops = [l for l in loops if x0 <= min(p[0] for p in l) and max(p[0] for p in l) <= x1 + 1]
        d = ' '.join('M' + 'L'.join(f'{x},{y}' for x, y in l) + 'Z' for l in rloops)
        groups_svg.append(f'  <g id="{gid}">\n    <path d="{d}" />\n  </g>')
        if gid == 'glyph-STAR-1':
            star_d = d

    svg_full = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="92 242 847 187" '
        'fill="currentColor" fill-rule="nonzero" aria-label="GANJA STAR">\n'
        + '\n'.join(groups_svg)
        + '\n</svg>\n'
    )
    ET.fromstring(svg_full)
    (brand_dir / 'ganja-star-mark.svg').write_text(svg_full, encoding='utf-8')

    svg_star = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="258 257 163 157" '
        'fill="currentColor" fill-rule="nonzero" aria-label="GANJA STAR EMBLEM">\n'
        f'  <path d="{star_d}" />\n'
        '</svg>\n'
    )
    ET.fromstring(svg_star)
    (brand_dir / 'ganja-star-star.svg').write_text(svg_star, encoding='utf-8')
    return star_d


LOOK_SPECS = [
    {
        'num': 1,
        'code': 'LOOK 01',
        'title': 'MACACAO CARGO',
        'subtitle': 'ENGENHARIA INDUSTRIAL SENAI // SARJA PESADA 100% ALGODAO',
        'front': 'PEQUENA ESCALA',
        'status': '100% CONCLUIDO',
        'accent': '#F5C400',
        'secondary': '#0D0D0D',
        'garment_type': 'jumpsuit',
        'macro_focus': 'COSTURA DUPLA REBATIDA + BOLSOS CARGO FOLE 3D + ILHOS METALICO',
    },
    {
        'num': 2,
        'code': 'LOOK 02',
        'title': 'CALCA CARGO + CAMISETA OZEMPIC',
        'subtitle': 'MANIFESTO IRONICO "GOD SAVE BEARS FROM OZEMPIC"',
        'front': 'PEQUENA ESCALA',
        'status': '100% CONCLUIDO',
        'accent': '#D92B2B',
        'secondary': '#0D0D0D',
        'garment_type': 'tee_cargo',
        'macro_focus': 'SERIGRAFIA PLASTISOL ALTO RELEVO + SARJA CARGO ESTRUTURADA',
    },
    {
        'num': 3,
        'code': 'LOOK 03',
        'title': 'CONJUNTO ADESIVOS DE CAMINHAO',
        'subtitle': 'UPCYCLING 1/1 // "NAO ME SIGA ESTOU PERDIDA" // GSH-2168',
        'front': 'PECA UNICA 1/1 UPCYCLING',
        'status': '80% CONCLUIDO',
        'accent': '#F5C400',
        'secondary': '#D92B2B',
        'garment_type': 'truck_set',
        'macro_focus': 'VINIL ADESIVO AUTOMOTIVO + PATCHWORK REVERSO DE RETALHOS',
    },
    {
        'num': 4,
        'code': 'LOOK 04',
        'title': 'SHORT GUERRILHA + REGATINHA GANJA STAR',
        'subtitle': 'MALHA CANELADA G★NJ★ + SARJA MILITAR MULTIBOLSOS',
        'front': 'PEQUENA ESCALA',
        'status': '95% CONCLUIDO',
        'accent': '#008055',
        'secondary': '#F5C400',
        'garment_type': 'tank_shorts',
        'macro_focus': 'TRAMA RIBANA 2X1 + ESTAMPA ESTENCIL G★NJ★ + BOLSOS GUERRILHA',
    },
    {
        'num': 5,
        'code': 'LOOK 05',
        'title': 'MOLETOM LEGALIZE JA',
        'subtitle': 'MANIFESTO CONTRACULTURAL // SELO DE PESAGEM GANJA 25G',
        'front': 'PEQUENA ESCALA',
        'status': '100% CONCLUIDO',
        'accent': '#008055',
        'secondary': '#0D0D0D',
        'garment_type': 'hoodie',
        'macro_focus': 'FELPA 420GSM + ETIQUETA TECIDA GANJA 25G + TIPOGRAFIA LEGALIZE JA',
    },
    {
        'num': 6,
        'code': 'LOOK 06',
        'title': 'RETALHOS DE COURO E PELUCIA',
        'subtitle': 'ENGENHARIA REVERSA 1/1 // COURO RECICLADO + PELUCIA SINTETICA',
        'front': 'PECA UNICA 1/1 UPCYCLING',
        'status': '100% CONCLUIDO',
        'accent': '#D92B2B',
        'secondary': '#1A1A1A',
        'garment_type': 'leather_plush',
        'macro_focus': 'JUNCAO DE COURO GARIMPADO + PELUCIA ALTA DENSIDADE + OVERLOQUE APARENTE',
    },
    {
        'num': 7,
        'code': 'LOOK 07',
        'title': 'CONJUNTO RETALHOS DE COURO',
        'subtitle': 'RECONSTRUCAO ESTRUTURAL // GARIMPO CENTRO DE SAO PAULO',
        'front': 'PECA UNICA 1/1 UPCYCLING',
        'status': '100% CONCLUIDO',
        'accent': '#F5C400',
        'secondary': '#0D0D0D',
        'garment_type': 'leather_set',
        'macro_focus': 'MOSAICO DE COURO DESCARTADO + PESPONTO CONTRASTANTE + REBITES',
    },
    {
        'num': 8,
        'code': 'LOOK 08',
        'title': 'VESTIDO DE RETALHOS',
        'subtitle': 'DRAPEADO ESCULTURAL DITADO PELA GEOMETRIA DO DESCARTE',
        'front': 'PECA UNICA 1/1 UPCYCLING',
        'status': '100% CONCLUIDO',
        'accent': '#D92B2B',
        'secondary': '#008055',
        'garment_type': 'patchwork_dress',
        'macro_focus': 'INTERSECAO DE COSTURAS APARENTES + FITAS TECNICAS + TEXTURAS MISTAS',
    },
    {
        'num': 9,
        'code': 'LOOK 09',
        'title': 'CONJUNTO EXPERIMENTAL GANJA STAR',
        'subtitle': 'MATRIZ UFMG + SENAI // SILHUETA DE PALCO E ASFALTO',
        'front': 'AUTORAL / EXPERIMENTAL',
        'status': '100% CONCLUIDO',
        'accent': '#008055',
        'secondary': '#F5C400',
        'garment_type': 'experimental_set',
        'macro_focus': 'RECORTES ANATOMICOS + VIVO REFLETIVO + CONSTRUCAO MODULAR',
    },
    {
        'num': 10,
        'code': 'LOOK 10',
        'title': 'JAQUETA PUFFER + BERMUDA CARGO + BONE',
        'subtitle': 'HIPER-VOLUME TERMICO + UTILITARISMO URBANO PAULISTANO',
        'front': 'PEQUENA ESCALA',
        'status': '100% CONCLUIDO',
        'accent': '#F5C400',
        'secondary': '#D92B2B',
        'garment_type': 'puffer_cargo_cap',
        'macro_focus': 'GOMOS ACOLCHOADOS NYLON RIPSTOP + ABA BONE ESTRUTURADA + SARJA CARGO',
    },
]


def render_garment_silhouette(gtype: str, accent: str, secondary: str) -> str:
    """Returns bespoke SVG vector geometry for each Look's garment silhouette."""
    if gtype == 'jumpsuit':
        return f"""
        <g stroke="#111111" stroke-width="3" fill="none">
          <path d="M210,160 L390,160 L435,240 L395,260 L375,215 L375,380 L405,650 L325,650 L300,455 L275,650 L195,650 L225,380 L225,215 L205,260 L165,240 Z" fill="#1A1A1A"/>
          <line x1="300" y1="160" x2="300" y2="455" stroke="{accent}" stroke-width="3" stroke-dasharray="6,4"/>
          <rect x="235" y="220" width="50" height="58" fill="{accent}" stroke="#111111" stroke-width="2"/>
          <rect x="315" y="220" width="50" height="58" fill="#F4F3EF" stroke="#111111" stroke-width="2"/>
          <rect x="195" y="425" width="48" height="80" fill="{accent}" stroke="#111111" stroke-width="2"/>
          <rect x="357" y="425" width="48" height="80" fill="{accent}" stroke="#111111" stroke-width="2"/>
          <rect x="225" y="362" width="150" height="22" fill="#D92B2B" stroke="#111111" stroke-width="2"/>
        </g>
        """
    if gtype == 'tee_cargo':
        return f"""
        <g stroke="#111111" stroke-width="3">
          <path d="M180,165 L420,165 L465,255 L405,280 L385,230 L385,385 L215,385 L215,230 L195,280 L135,255 Z" fill="#FFFFFF"/>
          <rect x="232" y="210" width="136" height="92" fill="{accent}" stroke="#111111" stroke-width="2"/>
          <text x="300" y="245" text-anchor="middle" font-family=" monospace" font-weight="700" font-size="13" fill="#FFFFFF" stroke="none">GOD SAVE BEARS</text>
          <text x="300" y="268" text-anchor="middle" font-family=" monospace" font-weight="700" font-size="13" fill="#F5C400" stroke="none">FROM OZEMPIC</text>
          <path d="M215,385 L385,385 L418,650 L322,650 L300,470 L278,650 L182,650 Z" fill="#1A1A1A"/>
          <rect x="182" y="450" width="52" height="85" fill="#F5C400" stroke="#111111" stroke-width="2"/>
          <rect x="366" y="450" width="52" height="85" fill="#F5C400" stroke="#111111" stroke-width="2"/>
        </g>
        """
    if gtype == 'truck_set':
        return f"""
        <g stroke="#111111" stroke-width="3">
          <path d="M185,165 L415,165 L450,275 L395,290 L380,235 L380,385 L220,385 L220,235 L205,290 L150,275 Z" fill="#1A1A1A"/>
          <rect x="230" y="195" width="140" height="42" fill="#F5C400" stroke="#111111" stroke-width="2"/>
          <text x="300" y="221" text-anchor="middle" font-family="monospace" font-weight="700" font-size="11" fill="#111111" stroke="none">NAO ME SIGA ESTOU PERDIDA</text>
          <rect x="240" y="252" width="120" height="46" fill="#008055" stroke="#111111" stroke-width="2"/>
          <text x="300" y="281" text-anchor="middle" font-family="monospace" font-weight="700" font-size="15" fill="#F4F3EF" stroke="none">GSH-2168</text>
          <path d="M220,385 L380,385 L410,645 L320,645 L300,475 L280,645 L190,645 Z" fill="#D92B2B"/>
          <line x1="200" y1="520" x2="400" y2="520" stroke="#F5C400" stroke-width="4" stroke-dasharray="10,6"/>
        </g>
        """
    if gtype == 'tank_shorts':
        return f"""
        <g stroke="#111111" stroke-width="3">
          <path d="M235,165 L270,165 L278,215 L322,215 L330,165 L365,165 L375,375 L225,375 Z" fill="#FFFFFF"/>
          <text x="300" y="285" text-anchor="middle" font-family="monospace" font-weight="700" font-size="28" fill="#111111" stroke="none">G★NJ★</text>
          <path d="M215,375 L385,375 L408,555 L312,555 L300,455 L288,555 L192,555 Z" fill="{accent}"/>
          <rect x="188" y="410" width="48" height="75" fill="#F5C400" stroke="#111111" stroke-width="2"/>
          <rect x="364" y="410" width="48" height="75" fill="#F5C400" stroke="#111111" stroke-width="2"/>
        </g>
        """
    if gtype == 'hoodie':
        return f"""
        <g stroke="#111111" stroke-width="3">
          <path d="M250,125 L350,125 L375,170 L435,195 L465,365 L410,375 L390,260 L390,425 L210,425 L210,260 L190,375 L135,365 L165,195 L225,170 Z" fill="{accent}"/>
          <rect x="235" y="220" width="130" height="58" fill="#F5C400" stroke="#111111" stroke-width="2"/>
          <text x="300" y="246" text-anchor="middle" font-family="monospace" font-weight="700" font-size="15" fill="#111111" stroke="none">LEGALIZE JA</text>
          <text x="300" y="266" text-anchor="middle" font-family="monospace" font-weight="700" font-size="12" fill="#D92B2B" stroke="none">GANJA 25G</text>
          <path d="M220,425 L380,425 L395,645 L315,645 L300,490 L285,645 L205,645 Z" fill="#111111"/>
        </g>
        """
    if gtype == 'leather_plush':
        return f"""
        <g stroke="#111111" stroke-width="3">
          <path d="M185,165 L300,165 L300,390 L210,390 L165,280 Z" fill="#111111"/>
          <path d="M300,165 L415,165 L435,280 L390,390 L300,390 Z" fill="{accent}" stroke-dasharray="4,2"/>
          <path d="M210,390 L300,390 L300,645 L195,645 Z" fill="{accent}"/>
          <path d="M300,390 L390,390 L405,645 L300,645 Z" fill="#1A1A1A"/>
          <line x1="300" y1="165" x2="300" y2="645" stroke="#F5C400" stroke-width="4" stroke-dasharray="8,4"/>
          <rect x="230" y="250" width="140" height="36" fill="#F4F3EF" stroke="#111111" stroke-width="2"/>
          <text x="300" y="273" text-anchor="middle" font-family="monospace" font-weight="700" font-size="12" fill="#111111" stroke="none">COURO + PELUCIA 1/1</text>
        </g>
        """
    if gtype == 'leather_set':
        return f"""
        <g stroke="#111111" stroke-width="3">
          <polygon points="190,165 300,165 300,280 210,280" fill="#111111"/>
          <polygon points="300,165 410,165 390,280 300,280" fill="#262626"/>
          <polygon points="210,280 390,280 385,390 215,390" fill="#1A1A1A"/>
          <polygon points="215,390 300,390 290,520 200,520" fill="#262626"/>
          <polygon points="300,390 385,390 400,520 310,520" fill="#111111"/>
          <polygon points="200,520 290,520 280,645 190,645" fill="#111111"/>
          <polygon points="310,520 400,520 410,645 320,645" fill="#262626"/>
          <line x1="210" y1="280" x2="390" y2="280" stroke="{accent}" stroke-width="3" stroke-dasharray="5,5"/>
          <line x1="200" y1="520" x2="400" y2="520" stroke="{accent}" stroke-width="3" stroke-dasharray="5,5"/>
        </g>
        """
    if gtype == 'patchwork_dress':
        return f"""
        <g stroke="#111111" stroke-width="3">
          <polygon points="235,160 365,160 380,290 220,290" fill="{accent}"/>
          <polygon points="220,290 380,290 420,450 180,450" fill="#111111"/>
          <polygon points="180,450 420,450 455,635 155,610" fill="{secondary}"/>
          <line x1="220" y1="290" x2="380" y2="290" stroke="#F5C400" stroke-width="4"/>
          <line x1="180" y1="450" x2="420" y2="450" stroke="#F4F3EF" stroke-width="4" stroke-dasharray="8,4"/>
        </g>
        """
    if gtype == 'experimental_set':
        return f"""
        <g stroke="#111111" stroke-width="3">
          <path d="M175,165 L425,165 L455,295 L385,310 L385,385 L215,385 L215,310 L145,295 Z" fill="#111111"/>
          <path d="M215,385 L385,385 L415,645 L320,645 L300,465 L280,645 L185,645 Z" fill="{accent}"/>
          <circle cx="300" cy="265" r="44" fill="{secondary}" stroke="#111111" stroke-width="3"/>
          <text x="300" y="271" text-anchor="middle" font-family="monospace" font-weight="700" font-size="16" fill="#111111" stroke="none">G★NJ★</text>
        </g>
        """
    # puffer_cargo_cap
    return f"""
    <g stroke="#111111" stroke-width="3">
      <path d="M255,105 L345,105 L365,140 L240,140 Z" fill="#111111"/>
      <rect x="335" y="130" width="45" height="10" fill="{accent}"/>
      <rect x="160" y="165" width="280" height="55" fill="{accent}"/>
      <rect x="150" y="220" width="300" height="55" fill="#F5C400"/>
      <rect x="160" y="275" width="280" height="55" fill="{accent}"/>
      <rect x="175" y="330" width="250" height="50" fill="#111111"/>
      <path d="M205,380 L395,380 L415,565 L315,565 L300,455 L285,565 L185,565 Z" fill="#1A1A1A"/>
      <rect x="180" y="425" width="50" height="75" fill="{secondary}" stroke="#111111" stroke-width="2"/>
      <rect x="370" y="425" width="50" height="75" fill="{secondary}" stroke="#111111" stroke-width="2"/>
    </g>
    """


def generate_look_plates(star_d: str) -> None:
    looks_dir = ASSETS_DIR / 'looks'
    looks_dir.mkdir(parents=True, exist_ok=True)

    for spec in LOOK_SPECS:
        num_str = f"{spec['num']:02d}"
        sil_geom = render_garment_silhouette(spec['garment_type'], spec['accent'], spec['secondary'])
        wip_banner = ''
        if spec['status'] != '100% CONCLUIDO':
            wip_banner = f"""
            <rect x="36" y="672" width="528" height="36" fill="#F5C400" stroke="#111111" stroke-width="2"/>
            <text x="300" y="696" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="16" fill="#111111">
              ATELIE VIVO // {spec['code']} - {spec['status']}
            </text>
            """

        silhouette_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" aria-label="{spec['code']} - {spec['title']} (Silhueta)">
  <defs>
    <pattern id="grid-{num_str}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#111111" stroke-width="0.6" stroke-opacity="0.22"/>
    </pattern>
  </defs>
  <rect width="600" height="800" fill="#FFFFFF"/>
  <rect x="16" y="16" width="568" height="768" fill="url(#grid-{num_str})" stroke="#111111" stroke-width="2"/>
  <rect x="16" y="16" width="568" height="58" fill="#111111"/>
  <text x="34" y="51" font-family="Space Mono, monospace" font-weight="700" font-size="20" fill="#F4F3EF">{spec['code']} // GANJA STAR</text>
  <rect x="392" y="28" width="176" height="34" fill="{spec['accent']}" stroke="#F4F3EF" stroke-width="1"/>
  <text x="480" y="50" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="13" fill="#111111">{spec['status']}</text>
  {sil_geom}
  {wip_banner}
  <rect x="16" y="718" width="568" height="66" fill="#F4F3EF" stroke="#111111" stroke-width="2"/>
  <text x="34" y="746" font-family="Syne, sans-serif" font-weight="800" font-size="18" fill="#111111">{spec['title']}</text>
  <text x="34" y="769" font-family="Space Mono, monospace" font-weight="400" font-size="11" fill="#111111">{spec['subtitle']}</text>
</svg>
"""
        ET.fromstring(silhouette_svg)
        (looks_dir / f'look-{num_str}-silhouette.svg').write_text(silhouette_svg, encoding='utf-8')

        macro_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" aria-label="{spec['code']} - {spec['title']} (Zoom Macro)">
  <defs>
    <pattern id="weave-{num_str}" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="16" height="16" fill="#1A1A1A"/>
      <path d="M0,8 L16,8 M8,0 L8,16" stroke="{spec['accent']}" stroke-width="2" stroke-opacity="0.45"/>
      <circle cx="8" cy="8" r="2" fill="#F4F3EF"/>
    </pattern>
  </defs>
  <rect width="600" height="800" fill="#0D0D0D"/>
  <rect x="20" y="20" width="560" height="760" fill="url(#weave-{num_str})" stroke="#F4F3EF" stroke-width="2"/>
  <line x1="40" y1="120" x2="560" y2="640" stroke="#F5C400" stroke-width="6" stroke-dasharray="18,10"/>
  <line x1="40" y1="640" x2="560" y2="120" stroke="#D92B2B" stroke-width="4" stroke-dasharray="12,8"/>
  <circle cx="300" cy="380" r="155" fill="#0D0D0D" fill-opacity="0.88" stroke="{spec['accent']}" stroke-width="3"/>
  <line x1="120" y1="380" x2="480" y2="380" stroke="#F4F3EF" stroke-width="1.5"/>
  <line x1="300" y1="200" x2="300" y2="560" stroke="#F4F3EF" stroke-width="1.5"/>
  <g transform="translate(218, 300) scale(1.0)" fill="{spec['accent']}">
    <svg viewBox="258 257 163 157" width="163" height="157">
      <path d="{star_d}" />
    </svg>
  </g>
  <rect x="20" y="20" width="560" height="64" fill="#111111" stroke="#F4F3EF" stroke-width="2"/>
  <text x="40" y="58" font-family="Space Mono, monospace" font-weight="700" font-size="18" fill="#F5C400">MACRO ZOOM // {spec['code']} // ESCALA 4:1</text>
  <rect x="20" y="680" width="560" height="100" fill="#F4F3EF" stroke="#111111" stroke-width="2"/>
  <text x="40" y="715" font-family="Syne, sans-serif" font-weight="800" font-size="16" fill="#111111">INSPECAO DE COSTURA E MATERIA-PRIMA</text>
  <text x="40" y="742" font-family="Space Mono, monospace" font-weight="700" font-size="11" fill="#D92B2B">{spec['macro_focus']}</text>
  <text x="40" y="764" font-family="Space Mono, monospace" font-weight="400" font-size="11" fill="#111111">FRENTE: {spec['front']} // STATUS: {spec['status']}</text>
</svg>
"""
        ET.fromstring(macro_svg)
        (looks_dir / f'look-{num_str}-macro.svg').write_text(macro_svg, encoding='utf-8')


def generate_stage_plates(star_d: str) -> None:
    stage_dir = ASSETS_DIR / 'stage'
    stage_dir.mkdir(parents=True, exist_ok=True)

    stage_items = [
        ('anitta', 'ANITTA (SHOWS)', 'TURNE & PALCOS GLOBAIS', 'CUSTOM CARGO & PATCHWORK DE PALCO', '#D92B2B', '2023-2025'),
        ('marina-sena', 'MARINA SENA (VIDEOCLIPE & PALCO)', 'FENOMENO NATURAL // ROCK IN RIO', 'STYLING & FIGURINO AUTORAL ISAQUE GANDRA', '#F5C400', '2023-2024'),
        ('pedro-sampaio', 'PEDRO SAMPAIO (FIGURINO BALLET)', 'BALLET DE PALCO // ARENAS & FESTIVAIS', 'CONJUNTOS UTILITARIOS STREETWEAR', '#008055', '2024'),
        ('kendrick-lamar', 'KENDRICK LAMAR (FIGURINO BALLET)', 'BALLET DE PALCO // GRANDE ESPETACULO', 'DIRECAO TEXTIL & RECONSTRUCAO URBANA', '#D92B2B', '2023-2024'),
    ]

    for slug, label, event_ctx, garment, accent, year in stage_items:
        elabel = escape(label)
        eevent = escape(event_ctx)
        egarment = escape(garment)
        svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" aria-label="Stage Proof - {elabel}">
  <defs>
    <pattern id="scan-{slug}" width="8" height="8" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="8" y2="0" stroke="#F4F3EF" stroke-width="1" stroke-opacity="0.12"/>
    </pattern>
  </defs>
  <rect width="640" height="420" fill="#0D0D0D"/>
  <rect x="12" y="12" width="616" height="396" fill="url(#scan-{slug})" stroke="#F4F3EF" stroke-width="2"/>
  <polygon points="80,12 290,12 420,408 20,408" fill="{accent}" fill-opacity="0.24"/>
  <polygon points="360,12 580,12 620,408 260,408" fill="#F5C400" fill-opacity="0.14"/>
  <g transform="translate(460, 48) scale(0.75)" fill="{accent}">
    <svg viewBox="258 257 163 157" width="163" height="157">
      <path d="{star_d}" />
    </svg>
  </g>
  <rect x="28" y="28" width="290" height="34" fill="{accent}" stroke="#F4F3EF" stroke-width="1.5"/>
  <text x="40" y="50" font-family="Space Mono, monospace" font-weight="700" font-size="13" fill="#0D0D0D">PROVA DE PALCO // REC [{year}]</text>
  <text x="32" y="220" font-family="Syne, sans-serif" font-weight="800" font-size="32" fill="#F4F3EF">{elabel}</text>
  <rect x="28" y="250" width="584" height="2" fill="{accent}"/>
  <text x="32" y="288" font-family="Space Mono, monospace" font-weight="700" font-size="14" fill="#F5C400">CONTEXTO: {eevent}</text>
  <text x="32" y="318" font-family="Space Mono, monospace" font-weight="400" font-size="13" fill="#F4F3EF">PECA: {egarment}</text>
  <text x="32" y="382" font-family="Space Mono, monospace" font-weight="400" font-size="11" fill="#F4F3EF">ARQUIVO AUDIOVISUAL GANJA STUDIO // @GANJASTUDIO.BR</text>
</svg>
"""
        ET.fromstring(svg)
        (stage_dir / f'{slug}.svg').write_text(svg, encoding='utf-8')


def generate_moodboard_plates() -> None:
    mb_dir = ASSETS_DIR / 'moodboard'
    mb_dir.mkdir(parents=True, exist_ok=True)

    cards = [
        ('moodboard-01', 'PLACA AUTOMOTIVA GFM / GSH-2168', 'SINALIZACAO VIARIA // CENTRO SP', '#008055', '#F4F3EF', 'LOOK 03'),
        ('moodboard-02', 'ADESIVO: NAO ME SIGA ESTOU PERDIDA', 'PARA-CHOQUE DE CAMINHAO // BR-116', '#D92B2B', '#F5C400', 'LOOK 03'),
        ('moodboard-03', 'MOLDE INDUSTRIAL SENAI // PAPEL KRAFT', 'ENGENHARIA REVERSA DE MODELAGEM', '#F4F3EF', '#111111', 'LOOK 01'),
        ('moodboard-04', 'GARIMPO RETALHOS COURO & PELUCIA', 'DESCARTES TEXTEIS // CENTRO DE SP', '#1A1A1A', '#D92B2B', 'LOOK 06'),
        ('moodboard-05', 'SELO DE PESAGEM GANJA 25G // TCC UFMG', 'MANIFESTO POLITICO & CONTRACULTURA', '#F5C400', '#111111', 'LOOK 05'),
        ('moodboard-06', 'MATRIZ SERIGRAFICA OZEMPIC', 'GOD SAVE BEARS FROM OZEMPIC', '#FFFFFF', '#D92B2B', 'LOOK 02'),
    ]

    for cid, title, sub, bg, fg, look in cards:
        etitle = escape(title)
        esub = escape(sub)
        svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 300" aria-label="{etitle}">
  <rect width="420" height="300" fill="{bg}" stroke="#111111" stroke-width="4"/>
  <rect x="14" y="14" width="392" height="40" fill="#111111"/>
  <text x="26" y="40" font-family="Space Mono, monospace" font-weight="700" font-size="13" fill="#F4F3EF">ARQUIVO ARE.NA // {look}</text>
  <rect x="24" y="84" width="372" height="120" fill="{fg}" stroke="#111111" stroke-width="2"/>
  <text x="210" y="140" text-anchor="middle" font-family="Syne, sans-serif" font-weight="800" font-size="18" fill="{bg}">{etitle}</text>
  <text x="210" y="172" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="12" fill="{bg}">{esub}</text>
  <text x="24" y="268" font-family="Space Mono, monospace" font-weight="700" font-size="12" fill="{fg if bg != '#F4F3EF' else '#111111'}">MESA DE LUZ DIGITAL // GANJA STUDIO SP</text>
</svg>
"""
        ET.fromstring(svg)
        (mb_dir / f'{cid}.svg').write_text(svg, encoding='utf-8')


def generate_instagram_plates(star_d: str) -> None:
    ig_dir = ASSETS_DIR / 'instagram'
    ig_dir.mkdir(parents=True, exist_ok=True)

    frames = [
        ('ig-01', 'ATELIE CENTRO SP', 'COURO + PELUCIA 1/1', '#D92B2B', '#F5C400'),
        ('ig-02', 'CASA DE CRIADORES', 'COLECAO GANJA STAR', '#F5C400', '#0D0D0D'),
        ('ig-03', 'PROVA DE PALCO', 'ANITTA & KENDRICK BALLET', '#008055', '#F4F3EF'),
        ('ig-04', 'SERIGRAFIA OZEMPIC', 'GOD SAVE BEARS', '#D92B2B', '#FFFFFF'),
        ('ig-05', 'CAMINHAO BR-116', 'GSH-2168 // UP-03', '#008055', '#F5C400'),
        ('ig-06', 'LEGALIZE JA 25G', 'MANIFESTO UFMG + SENAI', '#F5C400', '#D92B2B'),
    ]

    for fid, top_txt, bot_txt, bg, accent in frames:
        etop = escape(top_txt)
        ebot = escape(bot_txt)
        svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" aria-label="@ganjastudio.br - {etop}">
  <rect width="400" height="500" fill="{bg}" stroke="#111111" stroke-width="4"/>
  <rect x="20" y="20" width="360" height="52" fill="#111111"/>
  <text x="36" y="52" font-family="Space Mono, monospace" font-weight="700" font-size="14" fill="#F4F3EF">@GANJASTUDIO.BR // {fid.upper()}</text>
  <circle cx="200" cy="240" r="110" fill="{accent}" stroke="#111111" stroke-width="4"/>
  <g transform="translate(118, 162) scale(1.0)" fill="#111111">
    <svg viewBox="258 257 163 157" width="163" height="157">
      <path d="{star_d}" />
    </svg>
  </g>
  <rect x="20" y="390" width="360" height="90" fill="#F4F3EF" stroke="#111111" stroke-width="3"/>
  <text x="38" y="428" font-family="Syne, sans-serif" font-weight="800" font-size="20" fill="#111111">{etop}</text>
  <text x="38" y="458" font-family="Space Mono, monospace" font-weight="700" font-size="13" fill="#D92B2B">{ebot}</text>
</svg>
"""
        ET.fromstring(svg)
        (ig_dir / f'{fid}.svg').write_text(svg, encoding='utf-8')


def main() -> None:
    import sys
    from editorial_plates import write_editorial_plates

    if '--plates-only' not in sys.argv:
        extract_brand_mark()
    write_editorial_plates(ASSETS_DIR)
    print('SUCCESS: editorial plates written (looks, stage, moodboard, instagram).')


if __name__ == '__main__':
    main()
