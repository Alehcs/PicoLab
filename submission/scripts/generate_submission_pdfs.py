#!/usr/bin/env python3
"""Generate the PicoLab hackathon submission PDFs.

Outputs (under <repo>/submission):
  1. PicoLab_Project_Description.pdf  -> one-page black-and-white project brief.
  2. PicoLab_Code_PDF.pdf             -> repo overview, file tree, code excerpts.

Usage:
  python3 submission/scripts/generate_submission_pdfs.py

Only the standard ReportLab toolkit is required:
  pip install reportlab
"""

from __future__ import annotations

import subprocess
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfgen import canvas as canvas_mod
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
)

# --- Paths -------------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = REPO_ROOT / "submission"
PROJECT_PDF = OUT_DIR / "PicoLab_Project_Description.pdf"
CODE_PDF = OUT_DIR / "PicoLab_Code_PDF.pdf"
REPO_URL = "https://github.com/Alehcs/PicoLab"

# --- Black-and-white palette (project brief) ---------------------------------
BLACK = HexColor("#1A1A1A")
DARK = HexColor("#333333")
BODY = HexColor("#4A4A4A")
GREY = HexColor("#6B6B6B")
LIGHT = HexColor("#8C8C8C")
RULE = HexColor("#CFCFCF")
HAIR = HexColor("#E2E2E2")
BOXBG = HexColor("#F3F3F3")
BOXBORDER = HexColor("#D4D4D4")

# Muted accents for the (separate) code overview PDF only.
C_INK = HexColor("#2C3338")
C_SECOND = HexColor("#5F6468")
C_MUTED = HexColor("#8A9188")
C_ACCENT = HexColor("#3A3F44")
C_BORDER = HexColor("#DDE1DA")
C_CODEBG = HexColor("#F4F6F1")
C_BG = HexColor("#FAFBF8")


# --- Glyph sanitizer: keep PDFs free of black-box / broken Unicode -----------
_SUBSCRIPT = {ord(c): str(i) for i, c in enumerate("₀₁₂₃₄₅₆₇₈₉")}
_SUPERSCRIPT = {0x2070: "0", 0x2074: "4", 0x2075: "5", 0x2076: "6",
                0x2077: "7", 0x2078: "8", 0x2079: "9"}
_ARROWS = {0x2192: "->", 0x2190: "<-", 0x2194: "<->", 0x21D2: "=>"}
# Codepoints > 255 that ARE present in the standard WinAnsi font encoding.
_WINANSI_OK = {
    0x2018, 0x2019, 0x201C, 0x201D, 0x2013, 0x2014, 0x2022, 0x2026,
    0x2020, 0x2021, 0x2030, 0x2039, 0x203A, 0x201A, 0x201E, 0x2122,
    0x20AC, 0x0152, 0x0153, 0x0160, 0x0161, 0x0178, 0x017D, 0x017E,
    0x0192, 0x02C6, 0x02DC,
}


def pdf_safe(text: str) -> str:
    """Map glyphs Courier/Helvetica cannot render to safe equivalents."""
    out = []
    for ch in text:
        cp = ord(ch)
        if cp <= 0xFF:
            out.append(ch)
        elif cp in _SUBSCRIPT:
            out.append(_SUBSCRIPT[cp])
        elif cp in _SUPERSCRIPT:
            out.append(_SUPERSCRIPT[cp])
        elif cp in _ARROWS:
            out.append(_ARROWS[cp])
        elif cp in _WINANSI_OK:
            out.append(ch)
        else:
            out.append("?")
    return "".join(out)


# --- Data --------------------------------------------------------------------
def run(cmd: list[str]) -> str:
    try:
        return subprocess.run(
            cmd, cwd=REPO_ROOT, capture_output=True, text=True, check=False
        ).stdout.rstrip("\n")
    except Exception as exc:  # pragma: no cover
        return f"(unavailable: {exc})"


COMMIT_LOG = pdf_safe(run(["git", "log", "--oneline", "--decorate", "-20"]) or "(no commits)")

# Clean ASCII repository tree (no box-drawing glyphs).
FILE_TREE = """PicoLab/
|-- package.json                   scripts + dependencies
|-- vite.config.ts                 Vite build config
|-- tailwind.config.js             design tokens / safelist
|-- tsconfig.json                  TypeScript project refs
|-- index.html                     app entry
|-- README.md
|-- docs/                          architecture + demo notes
|   |-- api-contracts.md
|   |-- demo-script.md
|   |-- diagnostic-engine.md
|   |-- learning-signal-taxonomy.md
|   `-- integration-roadmap.md
|-- src/
|   |-- main.tsx                   React entry
|   |-- app/                       App shell + route table
|   |   |-- App.tsx
|   |   `-- routes.tsx
|   |-- pages/                     page-based student workflow
|   |   |-- AddProblemPage.tsx     ScanConfirmPage.tsx
|   |   |-- SmartNotebookPage.tsx  VisualLabPage.tsx
|   |   |-- PracticeMissionsPage.tsx
|   |   |-- GrowthMapPage.tsx      GrowthPathPage.tsx
|   |   `-- ProfilePage.tsx        SettingsPage.tsx
|   |-- components/                shared component system
|   |   |-- ui/                    Button, Card, Badge, Tabs, ProgressBar
|   |   |-- layout/                AppShell, Sidebar, PageHeader
|   |   |-- notebook/              Smart Notebook step cards
|   |   |-- practice/              Daily / Focus / Random mission cards
|   |   |-- visual-lab/            motion + graph simulations
|   |   |-- growth/                Growth Map + Roadmap cards
|   |   `-- pico/                  mascot + Ask Pico drawer
|   |-- services/                  app logic + API client
|   |   |-- apiClient.ts           fetch wrapper w/ timeout
|   |   |-- picolabApi.ts          backend-first + local fallback
|   |   |-- mockPicolabApi.ts      deterministic local mock
|   |   |-- diagnosticEngine.ts    learning-signal classifier
|   |   |-- practiceProgress.ts    localStorage progress
|   |   `-- visualLabSuggestion.ts notebook -> Visual Lab context
|   |-- data/                      mock content + taxonomy
|   |-- types/                     shared TypeScript types
|   `-- styles/                    design tokens + globals.css
`-- server/                        Express + TypeScript mock API
    |-- src/index.ts               server bootstrap
    |-- src/routes/                REST endpoints
    |   |-- problems.ts  notebooks.ts  practice.ts
    |   |-- growth.ts    profile.ts    askPico.ts
    |   `-- visualLab.ts settings.ts   health.ts
    |-- src/services/diagnosticEngine.ts
    `-- src/data/learningSignals.ts"""

CODE_FILES: list[tuple[str, int]] = [
    ("src/app/routes.tsx", 64),
    ("src/pages/AddProblemPage.tsx", 70),
    ("src/pages/ScanConfirmPage.tsx", 70),
    ("src/pages/SmartNotebookPage.tsx", 80),
    ("src/pages/VisualLabPage.tsx", 60),
    ("src/pages/PracticeMissionsPage.tsx", 80),
    ("src/pages/GrowthMapPage.tsx", 55),
    ("src/pages/GrowthPathPage.tsx", 55),
    ("src/components/practice/DailyChallengeCard.tsx", 70),
    ("src/components/practice/RandomMissionPanel.tsx", 70),
    ("src/components/practice/MissionCompleteCard.tsx", 60),
    ("src/services/apiClient.ts", 90),
    ("src/services/picolabApi.ts", 60),
    ("src/services/diagnosticEngine.ts", 80),
    ("src/data/learningSignals.ts", 55),
    ("server/src/index.ts", 70),
    ("server/src/routes/notebooks.ts", 80),
    ("server/src/services/diagnosticEngine.ts", 60),
]


def wrap_code_line(line: str, max_chars: int = 108) -> list[str]:
    line = line.replace("\t", "    ")
    if len(line) <= max_chars:
        return [line]
    out: list[str] = []
    indent = len(line) - len(line.lstrip(" "))
    cont = " " * min(indent + 4, max_chars - 8)
    while len(line) > max_chars:
        out.append(line[:max_chars])
        line = cont + line[max_chars:]
    out.append(line)
    return out


def read_excerpt(rel_path: str, max_lines: int) -> tuple[str, int, int]:
    path = REPO_ROOT / rel_path
    if not path.exists():
        return (f"(file not found: {rel_path})", 0, 0)
    raw = path.read_text(encoding="utf-8", errors="replace").splitlines()
    total = len(raw)
    shown = raw[:max_lines]
    wrapped: list[str] = []
    for ln in shown:
        wrapped.extend(wrap_code_line(pdf_safe(ln)))
    return ("\n".join(wrapped), len(shown), total)


# =============================================================================
# PDF 1 — One-page black-and-white project brief
# =============================================================================
def wrap_para(c, text, font, size, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if c.stringWidth(trial, font, size) <= width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines or [""]


def draw_para(c, text, x, y, width, font="Helvetica", size=8.5,
              leading=10.8, color=BODY):
    c.setFillColor(color)
    c.setFont(font, size)
    for line in wrap_para(c, text, font, size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def section_heading(c, label, x, y, width):
    c.setFillColor(BLACK)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(x, y, label.upper())
    c.setStrokeColor(RULE)
    c.setLineWidth(0.6)
    c.line(x, y - 4.5, x + width, y - 4.5)
    return y - 16


def bullet(c, x, y, term, desc, width, size=8.5, leading=10.8):
    # small square marker
    c.setFillColor(GREY)
    c.rect(x, y + 1.4, 2.4, 2.4, fill=1, stroke=0)
    tx = x + 9
    tw = width - 9
    if term:
        label = term + " "
        c.setFillColor(BLACK)
        c.setFont("Helvetica-Bold", size)
        c.drawString(tx, y, label)
        off = c.stringWidth(label, "Helvetica-Bold", size)
        em = "— "  # em dash (WinAnsi-safe)
        c.setFont("Helvetica", size)
        c.setFillColor(BODY)
        c.drawString(tx + off, y, em)
        off += c.stringWidth(em, "Helvetica", size)
        first = wrap_para(c, desc, "Helvetica", size, tw - off)
        c.drawString(tx + off, y, first[0])
        y -= leading
        for line in wrap_para(c, " ".join(first[1:]), "Helvetica", size, tw) if len(first) > 1 else []:
            c.drawString(tx, y, line)
            y -= leading
    else:
        c.setFillColor(BODY)
        c.setFont("Helvetica", size)
        for line in wrap_para(c, desc, "Helvetica", size, tw):
            c.drawString(tx, y, line)
            y -= leading
    return y - 1.5


def draw_arrow(c, ax, ay, ln=8):
    c.setStrokeColor(GREY)
    c.setLineWidth(0.9)
    c.line(ax, ay, ax + ln, ay)
    c.line(ax + ln - 2.6, ay + 2.2, ax + ln, ay)
    c.line(ax + ln - 2.6, ay - 2.2, ax + ln, ay)


def draw_flow_box(c, steps, x, y_top, width):
    font, size, pad, line_h, arrow_w = "Helvetica-Bold", 7.6, 9, 12.5, 17
    lines, cur, curw = [], [], 0.0
    for i, t in enumerate(steps):
        tw = c.stringWidth(t, font, size)
        adv = tw + (arrow_w if i < len(steps) - 1 else 0)
        if cur and curw + adv > width - 2 * pad:
            lines.append(cur)
            cur, curw = [], 0.0
        cur.append((t, tw, i))
        curw += adv
    if cur:
        lines.append(cur)
    box_h = pad * 2 + len(lines) * line_h - (line_h - 9)
    c.setFillColor(BOXBG)
    c.setStrokeColor(BOXBORDER)
    c.setLineWidth(0.8)
    c.roundRect(x, y_top - box_h, width, box_h, 5, fill=1, stroke=1)
    ty = y_top - pad - 7.5
    for line in lines:
        tx = x + pad
        for (t, tw, idx) in line:
            c.setFillColor(BLACK)
            c.setFont(font, size)
            c.drawString(tx, ty, t)
            tx += tw
            if idx < len(steps) - 1:
                draw_arrow(c, tx + 4.5, ty + 2.4, 8)
                tx += arrow_w
        ty -= line_h
    return y_top - box_h


def build_project_pdf():
    c = canvas_mod.Canvas(str(PROJECT_PDF), pagesize=letter)
    W, H = letter
    c.setTitle("PicoLab - Project Description")
    c.setAuthor("PicoLab")

    mx = 48
    gutter = 26
    col_w = (W - 2 * mx - gutter) / 2
    lx = mx
    rx = mx + col_w + gutter

    # --- header ---
    c.setFillColor(BLACK)
    c.setLineWidth(2)
    c.setStrokeColor(BLACK)
    c.line(mx, H - 34, W - mx, H - 34)

    c.setFillColor(BLACK)
    c.setFont("Helvetica-Bold", 27)
    c.drawString(mx, H - 64, "PicoLab")
    c.setFillColor(DARK)
    c.setFont("Helvetica", 10.5)
    c.drawString(
        mx, H - 81,
        "A visual STEM learning coach that turns mistakes into learning signals.")
    c.setFillColor(LIGHT)
    c.setFont("Helvetica", 8)
    c.drawString(
        mx, H - 96,
        "Hackathon Submission  ·  AI x STEM Education  ·  GitHub: " + REPO_URL)
    c.setStrokeColor(RULE)
    c.setLineWidth(0.8)
    c.line(mx, H - 106, W - mx, H - 106)

    body_top = H - 124

    # ----- LEFT COLUMN -----
    y = body_top
    y = section_heading(c, "Purpose", lx, y, col_w)
    y = draw_para(
        c,
        "PicoLab helps students solve STEM problems through a guided learning "
        "loop: problem intake, confirmation, step-by-step solving, visual "
        "explanation, personalized practice, and progress tracking.",
        lx, y, col_w)
    y -= 3
    y = draw_para(
        c,
        "Its core idea is simple: mistakes should become learning signals, not "
        "failures.",
        lx, y, col_w, color=DARK)

    y -= 10
    y = section_heading(c, "Problem", lx, y, col_w)
    y = draw_para(
        c,
        "Students often get a numeric answer partially correct while still "
        "misunderstanding the concept, formula, graph, or unit behind it. Many "
        "tutoring tools provide answers, but do not clearly diagnose the type of "
        "mistake or convert it into a practice path.",
        lx, y, col_w)

    y -= 10
    y = section_heading(c, "Solution", lx, y, col_w)
    for s in [
        "adding or scanning a STEM problem",
        "confirming values, units, target variable, and formula",
        "solving step-by-step in Smart Notebook",
        "detecting learning signals",
        "opening a contextual Visual Lab explanation",
        "practicing through missions",
        "tracking progress in Growth Map and Roadmap",
    ]:
        y = bullet(c, lx, y, "", s, col_w)

    # ----- RIGHT COLUMN -----
    y = body_top
    y = section_heading(c, "Key Features", rx, y, col_w)
    for term, desc in [
        ("Add Problem", "type, scan, or formula-based input"),
        ("Scan & Confirm", "structured review before solving"),
        ("Smart Notebook", "step-by-step feedback"),
        ("Learning Signals", "unit, formula, graph, algebra, concept, and reading signals"),
        ("Visual Lab", "interactive explanations linked to the detected signal"),
        ("Practice Missions", "daily challenge, recommended practice, and random mission"),
        ("Growth Map", "tracks recurring learning signals"),
        ("Roadmap", "turns signals into a learning path"),
        ("Ask Pico", "contextual coaching drawer with mock/fallback behavior"),
    ]:
        y = bullet(c, rx, y, term, desc, col_w)

    y -= 8
    y = section_heading(c, "Technical Implementation", rx, y, col_w)
    for t in [
        "React + Vite + TypeScript",
        "Tailwind-based design system",
        "Express + TypeScript mock backend",
        "Backend-first API client with local fallback",
        "Deterministic diagnostic engine",
        "localStorage / sessionStorage persistence",
        "Provider-ready architecture for future real AI integration",
    ]:
        y = bullet(c, rx, y, "", t, col_w)

    y -= 8
    y = section_heading(c, "Demo Flow", rx, y, col_w)
    steps = ["Problem", "Confirm", "Smart Notebook", "Learning Signal",
             "Visual Lab", "Practice Mission", "Growth Map", "Roadmap"]
    y = draw_flow_box(c, steps, rx, y + 2, col_w)

    y -= 12
    y = section_heading(c, "Project Status", rx, y, col_w)
    y = draw_para(
        c,
        "PicoLab is a functional hackathon prototype. The current demo uses "
        "deterministic mock/backend logic and a canonical physics problem to "
        "demonstrate the full learning loop. The architecture is ready for "
        "future expansion with real AI providers, broader STEM domains, and "
        "richer visual simulations.",
        rx, y, col_w)

    # --- footer ---
    c.setStrokeColor(RULE)
    c.setLineWidth(0.8)
    c.line(mx, 52, W - mx, 52)
    c.setFillColor(GREY)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(mx, 41, "PicoLab  ·  Hackathon Submission")
    c.setFillColor(LIGHT)
    c.setFont("Helvetica", 8)
    c.drawRightString(W - mx, 41, "github.com/Alehcs/PicoLab")

    c.showPage()
    c.save()


# =============================================================================
# PDF 2 — Code overview (Platypus, paginated, page numbers)
# =============================================================================
def on_page(c, doc):
    W, H = letter
    c.saveState()
    c.setFillColor(C_BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setStrokeColor(C_BORDER)
    c.setLineWidth(0.8)
    c.line(50, 44, W - 50, 44)
    c.setFillColor(C_MUTED)
    c.setFont("Helvetica", 7.5)
    c.drawString(50, 33, "PicoLab - Code Overview")
    c.drawRightString(W - 50, 33, f"Page {doc.page}")
    c.restoreState()


def code_styles():
    ss = getSampleStyleSheet()
    s = {}
    s["h1"] = ParagraphStyle("h1", parent=ss["Title"], fontName="Helvetica-Bold",
                             fontSize=30, textColor=C_INK, spaceAfter=4, alignment=TA_LEFT)
    s["sub"] = ParagraphStyle("sub", fontName="Helvetica", fontSize=12,
                              textColor=C_SECOND, spaceAfter=14)
    s["h2"] = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=14,
                             textColor=C_INK, spaceBefore=14, spaceAfter=6)
    s["body"] = ParagraphStyle("body", fontName="Helvetica", fontSize=9.5,
                               textColor=C_SECOND, leading=13.5, spaceAfter=4)
    s["bullet"] = ParagraphStyle("bullet", parent=s["body"], leftIndent=12,
                                 bulletIndent=2, spaceAfter=2)
    s["meta"] = ParagraphStyle("meta", fontName="Helvetica", fontSize=9.5,
                               textColor=C_INK, leading=14)
    s["filehdr"] = ParagraphStyle("filehdr", fontName="Helvetica-Bold", fontSize=9,
                                  textColor=C_ACCENT, spaceBefore=10, spaceAfter=3)
    s["code"] = ParagraphStyle("code", fontName="Courier", fontSize=7,
                               textColor=C_INK, leading=8.6,
                               backColor=C_CODEBG, borderColor=C_BORDER, borderWidth=0.6,
                               borderPadding=5, spaceAfter=8)
    s["tree"] = ParagraphStyle("tree", fontName="Courier", fontSize=7.2, leading=9.0,
                               textColor=C_INK, backColor=C_CODEBG, borderColor=C_BORDER,
                               borderWidth=0.6, borderPadding=6)
    return s


def build_code_pdf():
    s = code_styles()
    doc = BaseDocTemplate(
        str(CODE_PDF), pagesize=letter,
        leftMargin=50, rightMargin=50, topMargin=54, bottomMargin=54,
        title="PicoLab - Code Overview", author="PicoLab",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates([PageTemplate(id="all", frames=[frame], onPage=on_page)])

    flow = []
    flow.append(Spacer(1, 40))
    flow.append(Paragraph("PicoLab", s["h1"]))
    flow.append(Paragraph("Visual STEM learning coach - Code Overview", s["sub"]))
    flow.append(Paragraph(f"<b>GitHub Repository:</b> {REPO_URL}", s["meta"]))
    flow.append(Spacer(1, 8))
    flow.append(Paragraph("<b>Tech stack</b>", s["meta"]))
    for item in ["React", "Vite", "TypeScript", "Tailwind CSS", "Express",
                 "Mock backend REST API", "Deterministic diagnostic engine"]:
        flow.append(Paragraph(f"- {item}", s["bullet"]))
    flow.append(Spacer(1, 10))
    flow.append(Paragraph(
        "This document showcases the source developed for PicoLab. Generated "
        "files, dependencies, and build artifacts (node_modules, dist, .git, "
        "caches, lockfiles, binary media, backup bundles) are intentionally "
        "excluded.", s["body"]))

    flow.append(Paragraph("Key Architecture Summary", s["h2"]))
    for line in [
        "<b>Page-based workflow</b> - each step of the student loop is a route under <font face='Courier'>src/pages/</font> wired in <font face='Courier'>routes.tsx</font>.",
        "<b>Shared component system</b> - primitives (Button, Card, Badge) plus feature components under <font face='Courier'>src/components/</font>.",
        "<b>Backend-first API client</b> - <font face='Courier'>picolabApi</font> calls the Express mock first and falls back to a deterministic local mock on failure/timeout.",
        "<b>Mock backend</b> - Express + TypeScript exposes contract-shaped REST endpoints under <font face='Courier'>server/src/routes/</font>.",
        "<b>Diagnostic engine</b> - classifies a step/answer into learning signals (units, formula, graph, algebra, concept, reading).",
        "<b>Local persistence</b> - practice progress, signals, Ask Pico history, and Visual Lab context persist via localStorage/sessionStorage.",
        "<b>Context hand-off</b> - Smart Notebook stores a signal-based suggestion the Visual Lab reads to open the matching template.",
    ]:
        flow.append(Paragraph(f"- {line}", s["bullet"]))

    flow.append(Paragraph("Repository Structure", s["h2"]))
    flow.append(Preformatted(pdf_safe(FILE_TREE), s["tree"]))

    flow.append(PageBreak())
    flow.append(Paragraph("Important Code Sections", s["h2"]))
    flow.append(Paragraph(
        "Readable excerpts from the most important source files. Long lines are "
        "soft-wrapped; each header notes how many lines are shown.", s["body"]))
    for rel, max_lines in CODE_FILES:
        excerpt, shown, total = read_excerpt(rel, max_lines)
        hdr = (f"{rel}   (lines 1-{shown} of {total})"
               if total and shown < total else f"{rel}   ({total} lines)")
        flow.append(Paragraph(hdr, s["filehdr"]))
        flow.append(Preformatted(excerpt, s["code"]))

    flow.append(PageBreak())
    flow.append(Paragraph("Commit Summary", s["h2"]))
    flow.append(Paragraph("Recent history (git log --oneline --decorate -20):", s["body"]))
    flow.append(Preformatted(COMMIT_LOG, s["code"]))

    flow.append(Paragraph("Verification", s["h2"]))
    flow.append(Paragraph("Build / QA commands:", s["body"]))
    flow.append(Preformatted(
        "npm run build        # frontend (tsc -b && vite build)\n"
        "npm run build:server # backend  (tsc -p server/tsconfig.json)\n"
        "git diff --check     # whitespace / conflict markers", s["code"]))
    flow.append(Paragraph(
        "The project builds successfully when these commands pass with no errors.",
        s["body"]))

    doc.build(flow)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    build_project_pdf()
    build_code_pdf()
    for p in (PROJECT_PDF, CODE_PDF):
        size = p.stat().st_size if p.exists() else 0
        print(f"wrote {p.relative_to(REPO_ROOT)}  ({size/1024:.1f} KB)")


if __name__ == "__main__":
    main()
