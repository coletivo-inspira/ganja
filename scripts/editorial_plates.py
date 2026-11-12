#!/usr/bin/env python3
"""Distinct brutalist vector plates for looks, stage, moodboard, and the IG strip.

No photographs. Geometry only: garment silhouettes, stitch textures, plates,
stickers, and stage grain. Palette is paper, ink, and the three Ganja accents.
"""

from pathlib import Path
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape


ASSETS = Path(__file__).resolve().parent.parent / 'public' / 'assets'

INK = '#111111'
PAPER = '#F4F3EF'
WHITE = '#FFFFFF'
STAGE = '#0D0D0D'
CHAR = '#1A1A1A'
RED = '#D92B2B'
YEL = '#F5C400'
GRN = '#008055'


def write_svg(path: Path, svg: str) -> None:
    ET.fromstring(svg)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(svg, encoding='utf-8')


def silhouette(gtype: str, accent: str) -> str:
    if gtype == 'jumpsuit':
        body = f'''
        <path d="M210,160 L390,160 L435,240 L395,260 L375,215 L375,380 L405,650 L325,650 L300,455 L275,650 L195,650 L225,380 L225,215 L205,260 L165,240 Z" fill="{CHAR}"/>
        <line x1="300" y1="160" x2="300" y2="455" stroke="{accent}" stroke-width="3" stroke-dasharray="6,4"/>
        <rect x="235" y="220" width="50" height="58" fill="{accent}"/>
        <rect x="315" y="220" width="50" height="58" fill="{WHITE}"/>
        <rect x="195" y="425" width="48" height="80" fill="{accent}"/>
        <rect x="357" y="425" width="48" height="80" fill="{accent}"/>
        <rect x="225" y="362" width="150" height="22" fill="{RED}"/>
        <path d="M210,430 L250,430 M350,430 L390,430 M230,500 L270,500 M330,500 L370,500" fill="none" stroke="{YEL}" stroke-width="2" stroke-dasharray="3,3"/>
        '''
    elif gtype == 'tee_cargo':
        body = f'''
        <path d="M180,165 L420,165 L465,255 L405,280 L385,230 L385,385 L215,385 L215,230 L195,280 L135,255 Z" fill="{WHITE}"/>
        <rect x="232" y="210" width="136" height="92" fill="{accent}"/>
        <text x="300" y="248" text-anchor="middle" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="{WHITE}" stroke="none">GOD SAVE</text>
        <text x="300" y="268" text-anchor="middle" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="{YEL}" stroke="none">BEARS</text>
        <path d="M215,385 L385,385 L418,650 L322,650 L300,470 L278,650 L182,650 Z" fill="{CHAR}"/>
        <rect x="182" y="450" width="52" height="85" fill="{YEL}"/>
        <rect x="366" y="450" width="52" height="85" fill="{YEL}"/>
        <path d="M200,470 H250 M350,470 H400" fill="none" stroke="{INK}" stroke-width="2" stroke-dasharray="4,3"/>
        '''
    elif gtype == 'truck_set':
        body = f'''
        <path d="M185,165 L415,165 L450,275 L395,290 L380,235 L380,385 L220,385 L220,235 L205,290 L150,275 Z" fill="{CHAR}"/>
        <rect x="228" y="198" width="144" height="36" fill="{YEL}"/>
        <text x="300" y="221" text-anchor="middle" font-family="Space Mono, monospace" font-size="10" font-weight="700" fill="{INK}" stroke="none">NAO ME SIGA</text>
        <rect x="248" y="248" width="104" height="40" fill="{GRN}"/>
        <text x="300" y="274" text-anchor="middle" font-family="Space Mono, monospace" font-size="14" font-weight="700" fill="{PAPER}" stroke="none">GSH-2168</text>
        <path d="M220,385 L380,385 L410,645 L320,645 L300,475 L280,645 L190,645 Z" fill="{RED}"/>
        <path d="M200,520 H400" fill="none" stroke="{YEL}" stroke-width="4" stroke-dasharray="10,6"/>
        '''
    elif gtype == 'tank_shorts':
        body = f'''
        <path d="M235,165 L270,165 L278,215 L322,215 L330,165 L365,165 L375,375 L225,375 Z" fill="{WHITE}"/>
        <text x="300" y="290" text-anchor="middle" font-family="Space Mono, monospace" font-size="26" font-weight="700" fill="{INK}" stroke="none">G*NJ*</text>
        <path d="M215,375 L385,375 L408,555 L312,555 L300,455 L288,555 L192,555 Z" fill="{accent}"/>
        <rect x="188" y="410" width="48" height="75" fill="{YEL}"/>
        <rect x="364" y="410" width="48" height="75" fill="{YEL}"/>
        <path d="M240,200 H360 M240,214 H360 M240,228 H360" fill="none" stroke="{GRN}" stroke-width="2"/>
        '''
    elif gtype == 'hoodie':
        body = f'''
        <path d="M250,125 L350,125 L375,170 L435,195 L465,365 L410,375 L390,260 L390,425 L210,425 L210,260 L190,375 L135,365 L165,195 L225,170 Z" fill="{accent}"/>
        <rect x="235" y="220" width="130" height="58" fill="{YEL}"/>
        <text x="300" y="244" text-anchor="middle" font-family="Space Mono, monospace" font-size="13" font-weight="700" fill="{INK}" stroke="none">LEGALIZE JA</text>
        <text x="300" y="264" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="{RED}" stroke="none">GANJA 25G</text>
        <path d="M220,425 L380,425 L395,645 L315,645 L300,490 L285,645 L205,645 Z" fill="{INK}"/>
        <path d="M160,300 H210 M390,300 H440" fill="none" stroke="{PAPER}" stroke-width="2" stroke-dasharray="2,3"/>
        '''
    elif gtype == 'leather_plush':
        body = f'''
        <path d="M185,165 L300,165 L300,390 L210,390 L165,280 Z" fill="{INK}"/>
        <path d="M300,165 L415,165 L435,280 L390,390 L300,390 Z" fill="{accent}"/>
        <path d="M210,390 L300,390 L300,645 L195,645 Z" fill="{accent}"/>
        <path d="M300,390 L390,390 L405,645 L300,645 Z" fill="{CHAR}"/>
        <path d="M300,165 V645" fill="none" stroke="{YEL}" stroke-width="4" stroke-dasharray="8,4"/>
        <circle cx="240" cy="250" r="10" fill="{PAPER}"/>
        <circle cx="250" cy="270" r="12" fill="{PAPER}"/>
        <circle cx="360" cy="240" r="8" fill="{YEL}"/>
        <rect x="230" y="300" width="140" height="28" fill="{PAPER}"/>
        <text x="300" y="319" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="{INK}" stroke="none">COURO + PELUCIA</text>
        '''
    elif gtype == 'leather_set':
        body = f'''
        <polygon points="190,165 300,165 300,280 210,280" fill="{INK}"/>
        <polygon points="300,165 410,165 390,280 300,280" fill="{CHAR}"/>
        <polygon points="210,280 390,280 385,390 215,390" fill="{STAGE}"/>
        <polygon points="215,390 300,390 290,520 200,520" fill="{CHAR}"/>
        <polygon points="300,390 385,390 400,520 310,520" fill="{INK}"/>
        <polygon points="200,520 290,520 280,645 190,645" fill="{INK}"/>
        <polygon points="310,520 400,520 410,645 320,645" fill="{CHAR}"/>
        <path d="M210,280 H390 M200,520 H400" fill="none" stroke="{accent}" stroke-width="3" stroke-dasharray="5,5"/>
        '''
    elif gtype == 'patchwork_dress':
        body = f'''
        <polygon points="235,160 365,160 380,290 220,290" fill="{accent}"/>
        <polygon points="220,290 380,290 420,450 180,450" fill="{INK}"/>
        <polygon points="180,450 300,450 280,640 155,610" fill="{GRN}"/>
        <polygon points="300,450 420,450 455,635 320,640" fill="{RED}"/>
        <path d="M220,290 H380 M180,450 H420" fill="none" stroke="{YEL}" stroke-width="4" stroke-dasharray="8,4"/>
        '''
    elif gtype == 'experimental_set':
        body = f'''
        <path d="M175,165 L425,165 L455,295 L385,310 L385,385 L215,385 L215,310 L145,295 Z" fill="{INK}"/>
        <path d="M215,385 L385,385 L415,645 L320,645 L300,465 L280,645 L185,645 Z" fill="{accent}"/>
        <rect x="248" y="220" width="104" height="70" fill="{YEL}"/>
        <text x="300" y="262" text-anchor="middle" font-family="Space Mono, monospace" font-size="16" font-weight="700" fill="{INK}" stroke="none">G*NJ*</text>
        <path d="M175,250 H230 M370,250 H425" fill="none" stroke="{PAPER}" stroke-width="6"/>
        '''
    else:
        body = f'''
        <path d="M250,108 H360 L372,142 H238 Z" fill="{INK}"/>
        <rect x="360" y="128" width="48" height="12" fill="{accent}"/>
        <rect x="155" y="165" width="290" height="48" fill="{accent}"/>
        <rect x="148" y="213" width="304" height="48" fill="{YEL}"/>
        <rect x="155" y="261" width="290" height="48" fill="{accent}"/>
        <rect x="175" y="309" width="250" height="46" fill="{INK}"/>
        <path d="M205,355 L395,355 L415,560 L315,560 L300,440 L285,560 L185,560 Z" fill="{CHAR}"/>
        <rect x="180" y="410" width="50" height="70" fill="{RED}"/>
        <rect x="370" y="410" width="50" height="70" fill="{RED}"/>
        <path d="M160,188 H440 M155,236 H448 M160,284 H440" fill="none" stroke="{INK}" stroke-width="2"/>
        '''
    return f'<g stroke="{INK}" stroke-width="3" fill="none">{body}</g>'


LOOKS = [
    (1, 'LOOK 01', 'MACACAO CARGO', 'ENGENHARIA INDUSTRIAL SENAI // SARJA PESADA', 'PEQUENA ESCALA', '100% CONCLUIDO', YEL, 'jumpsuit', 'COSTURA DUPLA REBATIDA + BOLSOS CARGO FOLE 3D'),
    (2, 'LOOK 02', 'CALCA CARGO + CAMISETA OZEMPIC', 'SERIGRAFIA GOD SAVE BEARS FROM OZEMPIC', 'PEQUENA ESCALA', '100% CONCLUIDO', RED, 'tee_cargo', 'SERIGRAFIA PLASTISOL + SARJA CARGO'),
    (3, 'LOOK 03', 'CONJUNTO ADESIVOS DE CAMINHAO', 'VINIL 1/1 // GSH-2168', 'PECA UNICA 1/1', '80% CONCLUIDO', YEL, 'truck_set', 'VINIL ADESIVO + PLACA AUTOMOTIVA'),
    (4, 'LOOK 04', 'SHORT GUERRILHA + REGATINHA', 'RIBANA G*NJ* + SARJA MULTIBOLSO', 'PEQUENA ESCALA', '95% CONCLUIDO', GRN, 'tank_shorts', 'TRAMA RIBANA 2X1 + ESTENCIL'),
    (5, 'LOOK 05', 'MOLETOM LEGALIZE JA', 'FELPA + SELO GANJA 25G', 'PEQUENA ESCALA', '100% CONCLUIDO', GRN, 'hoodie', 'FELPA 420GSM + ETIQUETA TECIDA'),
    (6, 'LOOK 06', 'RETALHOS DE COURO E PELUCIA', 'ENGENHARIA REVERSA 1/1', 'PECA UNICA 1/1', '100% CONCLUIDO', RED, 'leather_plush', 'COURO GARIMPADO + PELUCIA + OVERLOQUE'),
    (7, 'LOOK 07', 'CONJUNTO RETALHOS DE COURO', 'MOSAICO CENTRO DE SAO PAULO', 'PECA UNICA 1/1', '100% CONCLUIDO', YEL, 'leather_set', 'MOSAICO DE COURO + PESPONTO'),
    (8, 'LOOK 08', 'VESTIDO DE RETALHOS', 'DRAPEADO DO DESCARTE', 'PECA UNICA 1/1', '100% CONCLUIDO', RED, 'patchwork_dress', 'COSTURAS APARENTES + FITA TECNICA'),
    (9, 'LOOK 09', 'CONJUNTO EXPERIMENTAL', 'MATRIZ UFMG + SENAI', 'AUTORAL / EXPERIMENTAL', '100% CONCLUIDO', GRN, 'experimental_set', 'RECORTES MODULARES + VIVO REFLETIVO'),
    (10, 'LOOK 10', 'JAQUETA PUFFER + BERMUDA + BONE', 'VOLUME TERMICO PAULISTANO', 'PEQUENA ESCALA', '100% CONCLUIDO', YEL, 'puffer', 'GOMOS NYLON RIPSTOP + ABA DE BONE'),
]


def macro_texture(num: int, accent: str) -> str:
    pid = f'tex-{num:02d}'
    if num == 1:
        pattern = f'''
        <pattern id="{pid}" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="{CHAR}"/>
          <path d="M0,14 L14,0 M-2,2 L2,-2 M12,16 L16,12" stroke="{YEL}" stroke-width="1.4"/>
        </pattern>'''
        detail = f'''
        <circle cx="180" cy="260" r="18" fill="{STAGE}" stroke="{YEL}" stroke-width="4"/>
        <circle cx="180" cy="260" r="6" fill="{YEL}"/>
        <path d="M120,420 H480 M120,432 H480" stroke="{PAPER}" stroke-width="3"/>
        <path d="M120,520 H480" stroke="{RED}" stroke-width="8"/>
        <path d="M140,500 V540 M460,500 V540" stroke="{YEL}" stroke-width="3"/>'''
    elif num == 2:
        pattern = f'''
        <pattern id="{pid}" width="18" height="18" patternUnits="userSpaceOnUse">
          <rect width="18" height="18" fill="{STAGE}"/>
          <circle cx="4" cy="4" r="2.2" fill="{RED}"/>
          <circle cx="13" cy="13" r="1.4" fill="{PAPER}"/>
        </pattern>'''
        detail = f'''
        <rect x="90" y="240" width="420" height="150" fill="{RED}"/>
        <text x="300" y="310" text-anchor="middle" font-family="Syne, sans-serif" font-size="28" font-weight="800" fill="{WHITE}">GOD SAVE BEARS</text>
        <text x="300" y="348" text-anchor="middle" font-family="Space Mono, monospace" font-size="16" fill="{YEL}">FROM OZEMPIC</text>
        <rect x="90" y="430" width="420" height="18" fill="{YEL}"/>'''
    elif num == 3:
        pattern = f'''
        <pattern id="{pid}" width="28" height="10" patternUnits="userSpaceOnUse">
          <rect width="28" height="10" fill="{CHAR}"/>
          <rect x="0" y="0" width="18" height="10" fill="{GRN}"/>
          <rect x="18" y="0" width="4" height="10" fill="{YEL}"/>
        </pattern>'''
        detail = f'''
        <polygon points="430,180 540,210 520,340 400,300" fill="{YEL}" stroke="{INK}" stroke-width="3"/>
        <text x="470" y="260" text-anchor="middle" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="{INK}">NAO ME SIGA</text>
        <rect x="130" y="300" width="250" height="90" fill="{GRN}" stroke="{PAPER}" stroke-width="4"/>
        <text x="255" y="354" text-anchor="middle" font-family="Space Mono, monospace" font-size="22" font-weight="700" fill="{PAPER}">GSH-2168</text>'''
    elif num == 4:
        pattern = f'''
        <pattern id="{pid}" width="8" height="10" patternUnits="userSpaceOnUse">
          <rect width="8" height="10" fill="{WHITE}"/>
          <rect x="0" y="0" width="8" height="3" fill="{GRN}"/>
          <rect x="0" y="5" width="8" height="2" fill="{INK}"/>
        </pattern>'''
        detail = f'''
        <rect x="150" y="250" width="300" height="180" fill="{STAGE}"/>
        <text x="300" y="355" text-anchor="middle" font-family="Syne, sans-serif" font-size="42" font-weight="800" fill="{YEL}">G*NJ*</text>
        <path d="M160,460 H440 M160,474 H440 M160,488 H440" stroke="{GRN}" stroke-width="4"/>'''
    elif num == 5:
        pattern = f'''
        <pattern id="{pid}" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="{GRN}"/>
          <circle cx="5" cy="5" r="3" fill="none" stroke="{PAPER}" stroke-width="1.2"/>
          <circle cx="12" cy="12" r="3" fill="none" stroke="{YEL}" stroke-width="1.2"/>
        </pattern>'''
        detail = f'''
        <rect x="170" y="250" width="260" height="120" fill="{YEL}" stroke="{INK}" stroke-width="3"/>
        <text x="300" y="300" text-anchor="middle" font-family="Syne, sans-serif" font-size="22" font-weight="800" fill="{INK}">LEGALIZE JA</text>
        <text x="300" y="334" text-anchor="middle" font-family="Space Mono, monospace" font-size="16" font-weight="700" fill="{RED}">GANJA 25G</text>
        <circle cx="300" cy="500" r="46" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
        <text x="300" y="506" text-anchor="middle" font-family="Space Mono, monospace" font-size="14" font-weight="700" fill="{INK}">25G</text>'''
    elif num == 6:
        pattern = f'''
        <pattern id="{pid}" width="22" height="22" patternUnits="userSpaceOnUse">
          <rect width="11" height="22" fill="{INK}"/>
          <rect x="11" width="11" height="22" fill="{RED}"/>
          <path d="M2,6 H9 M13,16 H20" stroke="{YEL}" stroke-width="1.5"/>
          <circle cx="16" cy="6" r="2" fill="{PAPER}"/>
        </pattern>'''
        detail = f'''
        <path d="M80,200 H300 V620 H80 Z" fill="{INK}"/>
        <path d="M300,200 H520 V620 H300 Z" fill="{RED}"/>
        <path d="M300,200 V620" stroke="{YEL}" stroke-width="6" stroke-dasharray="10,6"/>
        <circle cx="180" cy="320" r="16" fill="{PAPER}"/>
        <circle cx="210" cy="350" r="20" fill="{PAPER}"/>
        <circle cx="160" cy="360" r="12" fill="{YEL}"/>
        <path d="M340,280 L480,300 L460,420 L330,390 Z" fill="{CHAR}" stroke="{YEL}" stroke-width="3"/>'''
    elif num == 7:
        pattern = f'''
        <pattern id="{pid}" width="36" height="24" patternUnits="userSpaceOnUse">
          <rect width="36" height="24" fill="{CHAR}"/>
          <polygon points="0,0 20,0 14,24 0,24" fill="{INK}"/>
          <polygon points="20,0 36,0 36,24 14,24" fill="{STAGE}"/>
          <path d="M14,0 V24" stroke="{YEL}" stroke-width="2" stroke-dasharray="3,3"/>
        </pattern>'''
        detail = f'''
        <polygon points="120,220 280,200 300,420 100,440" fill="{INK}" stroke="{YEL}" stroke-width="3"/>
        <polygon points="300,210 500,240 480,450 290,420" fill="{CHAR}" stroke="{YEL}" stroke-width="3"/>
        <polygon points="140,460 470,450 500,600 110,610" fill="{STAGE}" stroke="{RED}" stroke-width="4"/>
        <path d="M120,330 H500" stroke="{YEL}" stroke-width="3" stroke-dasharray="6,4"/>'''
    elif num == 8:
        pattern = f'''
        <pattern id="{pid}" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="{PAPER}"/>
          <polygon points="0,0 40,0 0,40" fill="{RED}"/>
          <polygon points="40,0 40,40 0,40" fill="{GRN}"/>
          <path d="M0,0 L40,40" stroke="{YEL}" stroke-width="3"/>
        </pattern>'''
        detail = f'''
        <rect x="100" y="230" width="160" height="200" fill="{RED}"/>
        <rect x="260" y="230" width="240" height="120" fill="{INK}"/>
        <rect x="260" y="350" width="240" height="180" fill="{GRN}"/>
        <rect x="100" y="430" width="160" height="100" fill="{YEL}"/>
        <path d="M100,330 H500 M260,230 V530" stroke="{PAPER}" stroke-width="4" stroke-dasharray="8,5"/>'''
    elif num == 9:
        pattern = f'''
        <pattern id="{pid}" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="{STAGE}"/>
          <rect x="2" y="2" width="12" height="26" fill="{GRN}"/>
          <rect x="16" y="2" width="12" height="26" fill="{CHAR}"/>
        </pattern>'''
        detail = f'''
        <rect x="140" y="240" width="320" height="70" fill="{GRN}"/>
        <rect x="140" y="320" width="150" height="160" fill="{YEL}"/>
        <rect x="300" y="320" width="160" height="160" fill="{INK}"/>
        <rect x="150" y="500" width="300" height="16" fill="{PAPER}"/>
        <text x="300" y="372" text-anchor="middle" font-family="Space Mono, monospace" font-size="18" font-weight="700" fill="{INK}">MODULO</text>'''
    else:
        pattern = f'''
        <pattern id="{pid}" width="20" height="12" patternUnits="userSpaceOnUse">
          <rect width="20" height="12" fill="{YEL}"/>
          <path d="M0,12 H20" stroke="{INK}" stroke-width="2"/>
          <path d="M10,0 V12" stroke="{INK}" stroke-width="1"/>
        </pattern>'''
        detail = f'''
        <path d="M160,200 H460 L480,250 H150 Z" fill="{INK}"/>
        <rect x="150" y="250" width="320" height="36" fill="{RED}"/>
        <rect x="150" y="286" width="320" height="36" fill="{STAGE}"/>
        <rect x="150" y="322" width="320" height="36" fill="{RED}"/>
        <path d="M200,400 H400 L420,560 H180 Z" fill="{CHAR}" stroke="{INK}" stroke-width="3"/>
        <path d="M150,268 H470 M150,304 H470 M150,340 H470" stroke="{INK}" stroke-width="2"/>'''
    return pattern, detail


def write_looks() -> None:
    looks = ASSETS / 'looks'
    for num, code, title, subtitle, front, status, accent, gtype, focus in LOOKS:
        num_str = f'{num:02d}'
        wip = ''
        if status != '100% CONCLUIDO':
            wip = f'''
            <rect x="36" y="672" width="528" height="36" fill="{YEL}" stroke="{INK}" stroke-width="2"/>
            <text x="300" y="696" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="16" fill="{INK}">ATELIE VIVO // {code} - {status}</text>'''
        sil = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" aria-label="{escape(code)} silhouette">
  <rect width="600" height="800" fill="{WHITE}"/>
  <rect x="16" y="16" width="568" height="768" fill="none" stroke="{INK}" stroke-width="2"/>
  <path d="M16,56 H584 M56,16 V784 M544,16 V784" fill="none" stroke="{INK}" stroke-width="0.6" stroke-opacity="0.35"/>
  <rect x="16" y="16" width="568" height="58" fill="{INK}"/>
  <text x="34" y="52" font-family="Space Mono, monospace" font-weight="700" font-size="18" fill="{PAPER}">{code} // GANJA STAR</text>
  <rect x="392" y="28" width="176" height="34" fill="{accent}"/>
  <text x="480" y="50" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="12" fill="{INK}">{status}</text>
  {silhouette(gtype, accent)}
  {wip}
  <rect x="16" y="718" width="568" height="66" fill="{PAPER}" stroke="{INK}" stroke-width="2"/>
  <text x="34" y="746" font-family="Syne, sans-serif" font-weight="800" font-size="16" fill="{INK}">{escape(title)}</text>
  <text x="34" y="768" font-family="Space Mono, monospace" font-size="11" fill="{INK}">{escape(subtitle)}</text>
</svg>
'''
        write_svg(looks / f'look-{num_str}-silhouette.svg', sil)
        pattern, detail = macro_texture(num, accent)
        macro = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" aria-label="{escape(code)} macro">
  <defs>{pattern}</defs>
  <rect width="600" height="800" fill="{STAGE}"/>
  <rect x="20" y="20" width="560" height="760" fill="url(#tex-{num_str})" stroke="{PAPER}" stroke-width="2"/>
  {detail}
  <rect x="20" y="20" width="560" height="64" fill="{INK}" stroke="{PAPER}" stroke-width="2"/>
  <text x="40" y="58" font-family="Space Mono, monospace" font-weight="700" font-size="16" fill="{YEL}">MACRO ZOOM // {code} // ESCALA 4:1</text>
  <rect x="20" y="680" width="560" height="100" fill="{PAPER}" stroke="{INK}" stroke-width="2"/>
  <text x="40" y="714" font-family="Syne, sans-serif" font-weight="800" font-size="15" fill="{INK}">INSPECAO DE COSTURA E MATERIA-PRIMA</text>
  <text x="40" y="740" font-family="Space Mono, monospace" font-weight="700" font-size="11" fill="{RED}">{escape(focus)}</text>
  <text x="40" y="762" font-family="Space Mono, monospace" font-size="11" fill="{INK}">FRENTE: {escape(front)} // STATUS: {status}</text>
</svg>
'''
        write_svg(looks / f'look-{num_str}-macro.svg', macro)


def write_stage() -> None:
    stage = ASSETS / 'stage'
    grains = {
        'anitta': f'<pattern id="grain-anitta" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="{STAGE}"/><path d="M0,3 H6" stroke="{PAPER}" stroke-width="1" stroke-opacity="0.25"/></pattern>',
        'marina-sena': f'<pattern id="grain-marina-sena" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="{STAGE}"/><path d="M0,10 L10,0" stroke="{YEL}" stroke-width="1" stroke-opacity="0.4"/></pattern>',
        'pedro-sampaio': f'<pattern id="grain-pedro-sampaio" width="8" height="14" patternUnits="userSpaceOnUse"><rect width="8" height="14" fill="{STAGE}"/><rect x="3" width="2" height="14" fill="{GRN}" fill-opacity="0.75"/></pattern>',
        'kendrick-lamar': f'<pattern id="grain-kendrick-lamar" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="{STAGE}"/><rect x="1" y="1" width="1.4" height="1.4" fill="{PAPER}" fill-opacity="0.3"/></pattern>',
    }
    plates = {
        'anitta': f'''
          <polygon points="40,40 280,20 220,400 20,360" fill="{RED}" fill-opacity="0.85"/>
          <polygon points="300,80 620,40 600,380 260,340" fill="{CHAR}"/>
          <path d="M360,120 L420,120 L450,200 L400,210 L390,160 L390,250 L410,340 L350,340 L330,260 L310,340 L250,340 L270,250 L270,160 L250,210 L220,200 Z" fill="{YEL}" stroke="{INK}" stroke-width="3"/>
          <text x="48" y="250" font-family="Syne, sans-serif" font-size="36" font-weight="800" fill="{PAPER}">ANITTA</text>
          <text x="48" y="286" font-family="Space Mono, monospace" font-size="14" fill="{YEL}">SHOWS // CARGO DE PALCO</text>''',
        'marina-sena': f'''
          <path d="M40,300 Q320,40 600,300 L600,400 L40,400 Z" fill="{YEL}"/>
          <rect x="80" y="150" width="16" height="180" fill="{INK}"/>
          <circle cx="88" cy="140" r="22" fill="{RED}"/>
          <path d="M200,180 H520" stroke="{INK}" stroke-width="8"/>
          <text x="200" y="240" font-family="Syne, sans-serif" font-size="28" font-weight="800" fill="{INK}">MARINA SENA</text>
          <text x="200" y="270" font-family="Space Mono, monospace" font-size="13" fill="{RED}">FENOMENO NATURAL // ROCK IN RIO</text>''',
        'pedro-sampaio': f'''
          <rect x="40" y="180" width="560" height="10" fill="{GRN}"/>
          <path d="M120,190 L150,90 L180,190" fill="none" stroke="{YEL}" stroke-width="6"/>
          <path d="M300,190 L340,70 L380,190" fill="none" stroke="{PAPER}" stroke-width="6"/>
          <path d="M470,190 L500,110 L540,190" fill="none" stroke="{RED}" stroke-width="6"/>
          <text x="48" y="280" font-family="Syne, sans-serif" font-size="28" font-weight="800" fill="{PAPER}">PEDRO SAMPAIO</text>
          <text x="48" y="312" font-family="Space Mono, monospace" font-size="13" fill="{GRN}">FIGURINO BALLET // BARRA DE PALCO</text>''',
        'kendrick-lamar': f'''
          <rect x="40" y="40" width="180" height="300" fill="{RED}"/>
          <rect x="240" y="40" width="160" height="300" fill="{INK}" stroke="{PAPER}" stroke-width="3"/>
          <rect x="420" y="40" width="180" height="300" fill="{YEL}"/>
          <path d="M300,80 V300 M250,190 H390" stroke="{RED}" stroke-width="8"/>
          <text x="48" y="380" font-family="Syne, sans-serif" font-size="26" font-weight="800" fill="{PAPER}">KENDRICK LAMAR</text>''',
    }
    labels = {
        'anitta': 'ANITTA (SHOWS)',
        'marina-sena': 'MARINA SENA',
        'pedro-sampaio': 'PEDRO SAMPAIO',
        'kendrick-lamar': 'KENDRICK LAMAR',
    }
    for slug, inner in plates.items():
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" aria-label="Stage Proof {escape(labels[slug])}">
  <defs>{grains[slug]}</defs>
  <rect width="640" height="420" fill="{STAGE}"/>
  <rect x="8" y="8" width="624" height="404" fill="url(#grain-{slug})" stroke="{PAPER}" stroke-width="2"/>
  {inner}
  <text x="24" y="36" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="{YEL}">PROVA DE PALCO // GRAO</text>
</svg>
'''
        write_svg(stage / f'{slug}.svg', svg)


def write_moodboard() -> None:
    mb = ASSETS / 'moodboard'
    plates = [
        ('moodboard-01', f'''
          <rect width="420" height="300" fill="{GRN}" stroke="{INK}" stroke-width="4"/>
          <rect x="36" y="70" width="348" height="150" fill="{PAPER}" stroke="{INK}" stroke-width="6"/>
          <circle cx="58" cy="92" r="6" fill="{INK}"/>
          <circle cx="362" cy="92" r="6" fill="{INK}"/>
          <circle cx="58" cy="198" r="6" fill="{INK}"/>
          <circle cx="362" cy="198" r="6" fill="{INK}"/>
          <text x="210" y="140" text-anchor="middle" font-family="Space Mono, monospace" font-size="28" font-weight="700" fill="{INK}">GSH-2168</text>
          <text x="210" y="172" text-anchor="middle" font-family="Space Mono, monospace" font-size="12" fill="{GRN}">GFM // CENTRO SP</text>
          <text x="24" y="270" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="{PAPER}">PLACA // LOOK 03</text>'''),
        ('moodboard-02', f'''
          <rect width="420" height="300" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
          <g transform="rotate(-6 210 150)">
            <rect x="40" y="90" width="340" height="120" fill="{YEL}" stroke="{INK}" stroke-width="4"/>
            <text x="210" y="145" text-anchor="middle" font-family="Syne, sans-serif" font-size="18" font-weight="800" fill="{INK}">NAO ME SIGA</text>
            <text x="210" y="175" text-anchor="middle" font-family="Space Mono, monospace" font-size="14" font-weight="700" fill="{RED}">ESTOU PERDIDA</text>
          </g>
          <text x="24" y="270" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="{INK}">ADESIVO DE CAMINHAO // LOOK 03</text>'''),
        ('moodboard-03', f'''
          <rect width="420" height="300" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
          <rect x="30" y="48" width="360" height="190" fill="{WHITE}" stroke="{INK}" stroke-width="2"/>
          <path d="M50,70 H370 M50,100 H370 M50,130 H370 M50,160 H370 M50,190 H370" stroke="{INK}" stroke-width="1" stroke-opacity="0.45"/>
          <path d="M210,60 L250,200 L170,200 Z" fill="none" stroke="{RED}" stroke-width="3"/>
          <path d="M90,210 H150 M270,210 H330" stroke="{GRN}" stroke-width="3" stroke-dasharray="4,3"/>
          <text x="24" y="270" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="{INK}">MOLDE SENAI // LOOK 01</text>'''),
        ('moodboard-04', f'''
          <rect width="420" height="300" fill="{CHAR}" stroke="{INK}" stroke-width="4"/>
          <polygon points="40,70 190,60 210,200 50,210" fill="{INK}" stroke="{YEL}" stroke-width="3"/>
          <polygon points="200,80 360,90 340,210 180,190" fill="{RED}" stroke="{INK}" stroke-width="3"/>
          <circle cx="120" cy="140" r="22" fill="{PAPER}"/>
          <circle cx="150" cy="160" r="16" fill="{YEL}"/>
          <circle cx="280" cy="150" r="14" fill="{PAPER}"/>
          <text x="24" y="270" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="{PAPER}">RETALHOS COURO + PELUCIA // LOOK 06</text>'''),
        ('moodboard-05', f'''
          <rect width="420" height="300" fill="{YEL}" stroke="{INK}" stroke-width="4"/>
          <circle cx="210" cy="140" r="78" fill="{PAPER}" stroke="{INK}" stroke-width="6"/>
          <circle cx="210" cy="140" r="58" fill="none" stroke="{GRN}" stroke-width="4"/>
          <text x="210" y="134" text-anchor="middle" font-family="Syne, sans-serif" font-size="22" font-weight="800" fill="{INK}">25G</text>
          <text x="210" y="158" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="{RED}">GANJA</text>
          <text x="24" y="270" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="{INK}">SELO DE PESAGEM // LOOK 05</text>'''),
        ('moodboard-06', f'''
          <rect width="420" height="300" fill="{WHITE}" stroke="{INK}" stroke-width="4"/>
          <rect x="40" y="50" width="340" height="170" fill="none" stroke="{INK}" stroke-width="8"/>
          <rect x="70" y="78" width="280" height="90" fill="{RED}"/>
          <text x="210" y="132" text-anchor="middle" font-family="Syne, sans-serif" font-size="20" font-weight="800" fill="{WHITE}">OZEMPIC</text>
          <rect x="70" y="176" width="180" height="16" fill="{YEL}"/>
          <path d="M300,200 L390,230 L360,250 L280,214 Z" fill="{INK}"/>
          <text x="24" y="270" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="{INK}">MATRIZ SERIGRAFICA // LOOK 02</text>'''),
    ]
    for name, inner in plates:
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 300" aria-label="{name}">
  {inner}
</svg>
'''
        write_svg(mb / f'{name}.svg', svg)


def write_instagram() -> None:
    ig = ASSETS / 'instagram'
    frames = [
        ('ig-01', f'''
          <rect width="400" height="500" fill="{RED}" stroke="{INK}" stroke-width="4"/>
          <polygon points="40,90 200,80 220,280 50,300" fill="{INK}"/>
          <polygon points="180,100 360,120 340,300 160,270" fill="{YEL}" stroke="{INK}" stroke-width="3"/>
          <circle cx="120" cy="180" r="24" fill="{PAPER}"/>
          <circle cx="150" cy="210" r="18" fill="{PAPER}"/>
          <text x="36" y="430" font-family="Syne, sans-serif" font-size="22" font-weight="800" fill="{PAPER}">ATELIE SP</text>
          <text x="36" y="460" font-family="Space Mono, monospace" font-size="13" fill="{YEL}">COURO + PELUCIA 1/1</text>'''),
        ('ig-02', f'''
          <rect width="400" height="500" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
          <rect x="30" y="90" width="340" height="240" fill="{WHITE}" stroke="{INK}" stroke-width="3"/>
          <path d="M80,140 H320 M70,180 H330 M90,220 H310 M100,260 H300" stroke="{INK}" stroke-width="8"/>
          <rect x="30" y="90" width="40" height="240" fill="{YEL}"/>
          <text x="36" y="430" font-family="Syne, sans-serif" font-size="20" font-weight="800" fill="{INK}">CASA DE CRIADORES</text>
          <text x="36" y="460" font-family="Space Mono, monospace" font-size="13" fill="{RED}">COLECAO GANJA STAR</text>'''),
        ('ig-03', f'''
          <rect width="400" height="500" fill="{STAGE}" stroke="{INK}" stroke-width="4"/>
          <polygon points="40,80 200,40 180,300 20,260" fill="{RED}"/>
          <polygon points="200,60 370,90 350,310 190,280" fill="{GRN}"/>
          <path d="M40,330 H360" stroke="{YEL}" stroke-width="8"/>
          <text x="36" y="430" font-family="Syne, sans-serif" font-size="22" font-weight="800" fill="{PAPER}">PROVA DE PALCO</text>
          <text x="36" y="460" font-family="Space Mono, monospace" font-size="13" fill="{YEL}">ANITTA // BALLET</text>'''),
        ('ig-04', f'''
          <rect width="400" height="500" fill="{WHITE}" stroke="{INK}" stroke-width="4"/>
          <circle cx="70" cy="120" r="8" fill="{RED}"/>
          <circle cx="110" cy="150" r="14" fill="{RED}"/>
          <circle cx="90" cy="200" r="6" fill="{INK}"/>
          <rect x="40" y="230" width="320" height="90" fill="{RED}"/>
          <text x="200" y="284" text-anchor="middle" font-family="Syne, sans-serif" font-size="22" font-weight="800" fill="{WHITE}">OZEMPIC</text>
          <text x="36" y="430" font-family="Syne, sans-serif" font-size="20" font-weight="800" fill="{INK}">SERIGRAFIA</text>
          <text x="36" y="460" font-family="Space Mono, monospace" font-size="13" fill="{RED}">GOD SAVE BEARS</text>'''),
        ('ig-05', f'''
          <rect width="400" height="500" fill="{GRN}" stroke="{INK}" stroke-width="4"/>
          <rect x="40" y="120" width="320" height="140" fill="{PAPER}" stroke="{INK}" stroke-width="6"/>
          <text x="200" y="202" text-anchor="middle" font-family="Space Mono, monospace" font-size="28" font-weight="700" fill="{INK}">GSH-2168</text>
          <rect x="50" y="290" width="300" height="50" fill="{YEL}" stroke="{INK}" stroke-width="3"/>
          <text x="200" y="322" text-anchor="middle" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="{INK}">NAO ME SIGA</text>
          <text x="36" y="430" font-family="Syne, sans-serif" font-size="20" font-weight="800" fill="{PAPER}">CAMINHAO</text>
          <text x="36" y="460" font-family="Space Mono, monospace" font-size="13" fill="{YEL}">LOOK 03 // 80%</text>'''),
        ('ig-06', f'''
          <rect width="400" height="500" fill="{YEL}" stroke="{INK}" stroke-width="4"/>
          <circle cx="200" cy="210" r="100" fill="{PAPER}" stroke="{INK}" stroke-width="6"/>
          <circle cx="200" cy="210" r="74" fill="none" stroke="{GRN}" stroke-width="6"/>
          <text x="200" y="200" text-anchor="middle" font-family="Syne, sans-serif" font-size="28" font-weight="800" fill="{INK}">25G</text>
          <text x="200" y="230" text-anchor="middle" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="{RED}">LEGALIZE JA</text>
          <text x="36" y="430" font-family="Syne, sans-serif" font-size="20" font-weight="800" fill="{INK}">MANIFESTO</text>
          <text x="36" y="460" font-family="Space Mono, monospace" font-size="13" fill="{RED}">UFMG + SENAI</text>'''),
    ]
    for fid, inner in frames:
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" aria-label="@ganjastudio.br {fid}">
  {inner}
  <rect x="16" y="16" width="368" height="44" fill="{INK}"/>
  <text x="28" y="44" font-family="Space Mono, monospace" font-size="13" font-weight="700" fill="{PAPER}">@GANJASTUDIO.BR // {fid.upper()}</text>
</svg>
'''
        write_svg(ig / f'{fid}.svg', svg)


def write_editorial_plates(assets_dir: Path | None = None) -> None:
    global ASSETS
    if assets_dir is not None:
        ASSETS = assets_dir
    write_looks()
    write_stage()
    write_moodboard()
    write_instagram()
    print('editorial plates: 20 looks, 4 stage, 6 moodboard, 6 instagram')


if __name__ == '__main__':
    write_editorial_plates()
