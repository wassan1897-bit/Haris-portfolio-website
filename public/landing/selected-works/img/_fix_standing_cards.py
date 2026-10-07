from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import shutil
import statistics

ROOT = Path(r"E:\portfolio-itom-main\public\landing\selected-works\img")
ASSETS = Path(r"C:\Users\prash\.cursor\projects\e-portfolio-itom-main\assets")
BACKUP = ROOT / "_backup-broken"
BACKUP.mkdir(exist_ok=True)

SIZE = (864, 1152)
FONT_R = r"C:\Windows\Fonts\segoeui.ttf"
FONT_B = r"C:\Windows\Fonts\segoeuib.ttf"


def backup(name: str) -> None:
    src = ROOT / name
    if src.exists():
        dst = BACKUP / name
        if not dst.exists():
            shutil.copy2(src, dst)
            print("backed up", name)


def fit(img: Image.Image) -> Image.Image:
    img = img.convert("RGB")
    if img.size != SIZE:
        img = img.resize(SIZE, Image.Resampling.LANCZOS)
    return img


def sample_color(img: Image.Image, box: tuple[int, int, int, int]) -> tuple[int, int, int]:
    x0, y0, x1, y1 = box
    crop = img.crop((x0, y0, x1, y1))
    px = list(crop.getdata())
    n = max(1, len(px))
    r = sum(p[0] for p in px) // n
    g = sum(p[1] for p in px) // n
    b = sum(p[2] for p in px) // n
    return (r, g, b)


def fill_rect(
    img: Image.Image,
    box: tuple[int, int, int, int],
    color: tuple[int, int, int] | None = None,
    pad: int = 0,
) -> tuple[int, int, int]:
    x0, y0, x1, y1 = box
    if color is None:
        color = sample_color(img, (x0, max(0, y0 - 8), x1, y0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([x0 - pad, y0 - pad, x1 + pad, y1 + pad], fill=color)
    return color


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_paragraph(
    img: Image.Image,
    box: tuple[int, int, int, int],
    text: str,
    font_size: int = 15,
    color: tuple[int, int, int] = (30, 40, 70),
    line_gap: int = 4,
) -> None:
    x0, y0, x1, _y1 = box
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(FONT_R, font_size)
    max_w = x1 - x0
    lines = wrap_text(draw, text, font, max_w)
    y = y0
    for line in lines:
        draw.text((x0, y), line, font=font, fill=color)
        bbox = draw.textbbox((x0, y), line, font=font)
        y = bbox[3] + line_gap


def clear_bottom_right_icons(img: Image.Image, label: str) -> None:
    br = (640, 980, 840, 1120)
    crop = img.crop(br)
    lums = [0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2] for p in crop.getdata()]
    if min(lums) < 80 and statistics.pstdev(lums) > 35:
        fill_rect(img, br, color=sample_color(img, (500, 1000, 600, 1050)))
        print(f"{label}: cleared bottom-right baked icons")
    else:
        print(f"{label}: bottom-right clean")


# ---- RAG ----
backup("rag-chatbots.png")
rag = fit(Image.open(ASSETS / "rag-chatbots-standing-v2.png"))
body_box = (95, 178, 760, 248)
cream = sample_color(rag, (120, 100, 200, 140))
fill_rect(rag, body_box, color=cream)
draw_paragraph(
    rag,
    (100, 182, 755, 245),
    (
        "Architected secure multimodal RAG chatbots for two cybersecurity platforms. "
        "Supports speech-to-text and text-to-speech with bilingual Arabic and English "
        "conversations and encrypted knowledge-based answers."
    ),
    font_size=14,
    color=(45, 55, 85),
    line_gap=3,
)
clear_bottom_right_icons(rag, "RAG")
# Cover any residual mid-card cream blob leftovers near screenshot center
# (bright irregular patches over screenshots)
mid = (360, 430, 520, 560)
mid_crop = rag.crop(mid)
bright = sum(1 for p in mid_crop.getdata() if p[0] > 235 and p[1] > 230 and p[2] > 220)
print("RAG mid bright px", bright)
rag.save(ROOT / "rag-chatbots.png", "PNG", optimize=True)
print("wrote rag-chatbots.png")

# ---- AI AGENT ----
backup("ai-agent-overview.png")
agent = fit(Image.open(ASSETS / "ai-agent-standing-clean.png"))
body_box = (95, 165, 770, 235)
cream = sample_color(agent, (120, 90, 220, 130))
fill_rect(agent, body_box, color=cream)
draw_paragraph(
    agent,
    (100, 168, 765, 232),
    (
        "Fully autonomous Level 1 support for a broadband provider — CRM triage, "
        "live network checks, out-of-hours coverage, and smart ticket handoffs "
        "with zero human involvement until escalation."
    ),
    font_size=14,
    color=(30, 40, 70),
    line_gap=3,
)
clear_bottom_right_icons(agent, "AI Agent")
agent.save(ROOT / "ai-agent-overview.png", "PNG", optimize=True)
print("wrote ai-agent-overview.png")

# ---- INSURANCE ----
backup("insurance-voice-agent.png")
ins = fit(Image.open(ASSETS / "insurance-standing-v2.png"))
cream = sample_color(ins, (120, 250, 200, 280))
fill_rect(ins, (90, 315, 780, 400), color=cream)
draw = ImageDraw.Draw(ins)
font_num = ImageFont.truetype(FONT_B, 36)
font_lab = ImageFont.truetype(FONT_R, 12)
cols = [
    (130, "300%", "lead processing", "increase"),
    (360, "70%", "operating cost", "reduction"),
    (580, "24/7", "automated calling", "timezone-aware"),
]
for x, num, l1, l2 in cols:
    draw.text((x, 320), num, font=font_num, fill=(20, 30, 55))
    draw.text((x, 362), l1, font=font_lab, fill=(70, 80, 100))
    draw.text((x, 378), l2, font=font_lab, fill=(70, 80, 100))

rec_box = (620, 620, 820, 720)
src_ins = fit(Image.open(ASSETS / "insurance-standing-v2.png"))
bright = sum(
    1
    for p in src_ins.crop(rec_box).getdata()
    if p[0] > 220 and p[1] > 220 and p[2] > 220
)
print("insurance bright px in recorder zone", bright)
if bright > 80:
    demo_c = sample_color(ins, (200, 500, 280, 560))
    fill_rect(ins, rec_box, color=demo_c)
    print("cleared recorder zone")

arr_box = (80, 900, 800, 1040)
band = ins.crop(arr_box)
lums = [0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2] for p in band.getdata()]
avg_lum = sum(lums) / len(lums)
print("lower band avg lum", round(avg_lum, 1))
if avg_lum > 220:
    footer = ins.crop((70, 1040, 800, 1125))
    fill_rect(ins, (70, 900, 800, 1125), color=cream)
    ins.paste(footer, (70, 980))
    print("collapsed empty gap")

clear_bottom_right_icons(ins, "Insurance")
ins.save(ROOT / "insurance-voice-agent.png", "PNG", optimize=True)
print("wrote insurance-voice-agent.png")

poster = ROOT / "insurance-voice-agent-poster.jpg"
if poster.exists():
    fit(ins).save(poster, "JPEG", quality=90)
    print("updated poster")

print("DONE")
