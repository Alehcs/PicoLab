#!/usr/bin/env python3
"""Generate the PicoLab hackathon submission PDFs.

Outputs (under <repo>/submission):
  1. PicoLab_Project_Description.pdf  -> exactly one page, design overview.
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
from reportlab.lib.units import inch
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

# --- PicoLab palette ---------------------------------------------------------
BG = HexColor("#FAFBF8")        # off-white background
INK = HexColor("#2C3338")       # primary text
SECONDARY = HexColor("#5F6468") # secondary text
MUTED = HexColor("#8A9188")     # muted
BORDER = HexColor("#E2E6DC")    # soft border
BLUE = HexColor("#4A90E2")
GREEN = HexColor("#5FBF8F")
YELLOW = HexColor("#F6C85F")
SOFT_BLUE = HexColor("#EAF2FC")
SOFT_GREEN = HexColor("#E8F6EE")
SOFT_YELLOW = HexColor("#FDF3D7")
CODE_BG = HexColor("#F4F6F1")


# --- Data --------------------------------------------------------------------
def run(cmd: list[str]) -> str:
    try:
        return subprocess.run(
            cmd, cwd=REPO_ROOT, capture_output=True, text=True, check=False
        ).stdout.rstrip("\n")
    except Exception as exc:  # pragma: no cover - defensive
        return f"(unavailable: {exc})"


COMMIT_LOG = run(["git", "log", "--oneline", "--decorate", "-20"]) or "(no commits)"

# Curated, noise-free repository tree (folders that matter for review).
FILE_TREE = """PicoLab/
├── package.json                     scripts + dependencies
├── vite.config.ts                   Vite build config
├── tailwind.config.js               design tokens / safelist
├── tsconfig.json                    TypeScript project refs
├── index.html                       app entry
├── README.md
├── docs/                            architecture + demo notes
│   ├── api-contracts.md
│   ├── demo-script.md
│   ├── diagnostic-engine.md
│   ├── learning-signal-taxonomy.md
│   └── integration-roadmap.md
├── src/
│   ├── main.tsx                     React entry
│   ├── app/                         App shell + route table
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── pages/                       page-based student workflow
│   │   ├── AddProblemPage.tsx
│   │   ├── ScanConfirmPage.tsx
│   │   ├── SmartNotebookPage.tsx
│   │   ├── VisualLabPage.tsx
│   │   ├── PracticeMissionsPage.tsx
│   │   ├── GrowthMapPage.tsx
│   │   ├── GrowthPathPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── SettingsPage.tsx
│   ├── components/                  shared component system
│   │   ├── ui/                      Button, Card, Badge, Tabs, ProgressBar
│   │   ├── layout/                  AppShell, Sidebar, PageHeader
│   │   ├── notebook/                Smart Notebook step cards
│   │   ├── practice/                Daily / Focus / Random mission cards
│   │   ├── visual-lab/              motion + graph simulations
│   │   ├── growth/                  Growth Map + Roadmap cards
│   │   └── pico/                    mascot + Ask Pico drawer
│   ├── services/                    app logic + API client
│   │   ├── apiClient.ts             fetch wrapper w/ timeout
│   │   ├── picolabApi.ts            backend-first + local fallback
│   │   ├── mockPicolabApi.ts        deterministic local mock
│   │   ├── diagnosticEngine.ts      learning-signal classifier
│   │   ├── practiceProgress.ts      localStorage progress
│   │   └── visualLabSuggestion.ts   notebook -> Visual Lab context
│   ├── data/                        mock content + taxonomy
│   │   ├── learningSignals.ts
│   │   ├── mockMissions.ts
│   │   └── mockNotebook.ts
│   ├── types/                       shared TypeScript types
│   └── styles/                      design tokens + globals.css
└── server/                         Express + TypeScript mock API
    ├── src/index.ts                 server bootstrap
    ├── src/routes/                  REST endpoints
    │   ├── problems.ts  notebooks.ts  practice.ts
    │   ├── growth.ts    profile.ts    askPico.ts
    │   └── visualLab.ts settings.ts   health.ts
    ├── src/services/diagnosticEngine.ts
    └── src/data/learningSignals.ts"""

# Files excerpted in the Code PDF (path, max lines shown).
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


# --- Shared helpers ----------------------------------------------------------
def wrap_code_line(line: str, max_chars: int = 108) -> list[str]:
    """Hard-wrap a single code line so monospace text never clips."""
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
        wrapped.extend(wrap_code_line(ln))
    return ("\n".join(wrapped), len(shown), total)


# =============================================================================
# PDF 1 — One-page project description (manual canvas for exact 1-page control)
# =============================================================================
def text_height(c, text, font, size, width, leading):
    return len(wrap_para(c, text, font, size, width)) * leading


def wrap_para(c, text, font, size, width):
    words = text.split()
    lines, cur = [], ""
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


def draw_para(c, text, x, y, font, size, width, leading, color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    for line in wrap_para(c, text, font, size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_heading(c, label, x, y, accent):
    c.setFillColor(accent)
    c.rect(x, y - 1, 9, 9, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(x + 14, y, label.upper())
    return y - 15


def build_project_pdf():
    c = canvas_mod.Canvas(str(PROJECT_PDF), pagesize=letter)
    W, H = letter
    c.setTitle("PicoLab — Project Description")
    c.setAuthor("PicoLab")

    # background
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    mx = 42
    col_gap = 22
    col_w = (W - 2 * mx - col_gap) / 2
    left_x = mx
    right_x = mx + col_w + col_gap

    # --- header band ---
    top = H - 40
    c.setFillColor(SOFT_BLUE)
    c.roundRect(mx, top - 60, W - 2 * mx, 60, 10, fill=1, stroke=0)
    c.setFillColor(BLUE)
    c.roundRect(mx, top - 60, 5, 60, 2, fill=1, stroke=0)
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 27)
    c.drawString(mx + 18, top - 28, "PicoLab")
    c.setFillColor(SECONDARY)
    c.setFont("Helvetica", 10)
    c.drawString(
        mx + 18, top - 46,
        "A visual AI learning coach that turns STEM mistakes into learning signals.",
    )
    # tag top-right
    tag = "Hackathon Submission"
    c.setFont("Helvetica-Bold", 7.5)
    tw = c.stringWidth(tag, "Helvetica-Bold", 7.5)
    c.setFillColor(GREEN)
    c.roundRect(W - mx - tw - 16, top - 22, tw + 12, 14, 7, fill=1, stroke=0)
    c.setFillColor(HexColor("#FFFFFF"))
    c.drawString(W - mx - tw - 10, top - 18, tag)

    body_top = top - 76
    BF, BS, LEAD = "Helvetica", 8, 10.2

    # ----- LEFT COLUMN -----
    y = body_top
    y = draw_heading(c, "Purpose", left_x, y, BLUE)
    y = draw_para(
        c,
        "PicoLab helps students learn STEM problems through an interactive loop: "
        "problem intake, structured confirmation, step-by-step solving, visual "
        "explanation, personalized practice, and growth tracking.",
        left_x, y, BF, BS, col_w, LEAD, SECONDARY)
    y -= 3
    y = draw_para(
        c,
        "It is built around a simple idea: mistakes should not be treated as "
        "failures. They should become learning signals that show students what "
        "to practice next.",
        left_x, y, BF, BS, col_w, LEAD, SECONDARY)

    y -= 9
    y = draw_heading(c, "Problem", left_x, y, YELLOW)
    y = draw_para(
        c,
        "Many students get a numeric answer partially correct but still "
        "misunderstand the concept, formula, graph, or unit behind it. "
        "Traditional tools often give answers, but rarely diagnose the type of "
        "mistake or convert it into a clear practice path.",
        left_x, y, BF, BS, col_w, LEAD, SECONDARY)

    y -= 9
    y = draw_heading(c, "Solution — a guided workflow", left_x, y, GREEN)
    steps = [
        "Add or scan a STEM problem.",
        "Confirm extracted values, units, target variable, and formulas.",
        "Solve step-by-step in Smart Notebook.",
        "Detect learning signals (unit mismatch, formula choice, graph reading, algebra).",
        "Open a contextual Visual Lab explanation.",
        "Practice via daily challenges and Pico's recommended missions.",
        "Track signals in Growth Map and follow a personalized Roadmap.",
    ]
    c.setFont(BF, BS)
    for i, s in enumerate(steps, 1):
        c.setFillColor(BLUE)
        c.setFont("Helvetica-Bold", BS)
        c.drawString(left_x, y, f"{i}.")
        lines = wrap_para(c, s, BF, BS, col_w - 14)
        c.setFillColor(SECONDARY)
        c.setFont(BF, BS)
        for j, line in enumerate(lines):
            c.drawString(left_x + 14, y, line)
            y -= LEAD
        y -= 1

    # ----- RIGHT COLUMN -----
    y = body_top
    y = draw_heading(c, "Key Features", right_x, y, BLUE)
    features = [
        ("Add Problem", "type, scan, or enter formula-based STEM problems."),
        ("Scan & Confirm", "Pico structures known values, units, target, formula."),
        ("Smart Notebook", "step-by-step solving with contextual feedback."),
        ("Learning Signals", "mistakes classified by units, formulas, graphs, algebra, concepts, reading."),
        ("Visual Lab", "interactive visuals linked to the detected signal."),
        ("Practice Missions", "daily challenge, recommended practice, optional random missions."),
        ("Growth Map", "tracks recurring learning signals over time."),
        ("Roadmap", "converts signals into a personalized learning path."),
        ("Ask Pico", "contextual coaching drawer with mock/fallback behavior."),
    ]
    for name, desc in features:
        c.setFillColor(GREEN)
        c.circle(right_x + 2.5, y + 3, 2, fill=1, stroke=0)
        bold = name + " — "
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", BS)
        c.drawString(right_x + 9, y, bold)
        offset = c.stringWidth(bold, "Helvetica-Bold", BS)
        # first line continues after the bold label
        first_w = col_w - 9 - offset
        rest = wrap_para(c, desc, BF, BS, first_w)
        c.setFillColor(SECONDARY)
        c.setFont(BF, BS)
        c.drawString(right_x + 9 + offset, y, rest[0])
        y -= LEAD
        for line in wrap_para(c, " ".join(rest[1:]), BF, BS, col_w - 9) if len(rest) > 1 else []:
            c.drawString(right_x + 9, y, line)
            y -= LEAD
        y -= 1

    y -= 6
    y = draw_heading(c, "Technical Implementation", right_x, y, BLUE)
    tech = [
        "React + Vite + TypeScript frontend.",
        "Tailwind-based design system.",
        "Express + TypeScript mock backend (REST).",
        "Backend-first API client with local fallback.",
        "Deterministic diagnostic engine for signals.",
        "Persistent progress via localStorage / sessionStorage.",
        "Provider-ready for future real AI integration.",
    ]
    c.setFont(BF, BS)
    for t in tech:
        c.setFillColor(BLUE)
        c.circle(right_x + 2.5, y + 3, 2, fill=1, stroke=0)
        c.setFillColor(SECONDARY)
        for k, line in enumerate(wrap_para(c, t, BF, BS, col_w - 9)):
            c.drawString(right_x + 9, y, line)
            y -= LEAD

    y -= 6
    y = draw_heading(c, "Demo Flow", right_x, y, YELLOW)
    flow = ("Problem -> Confirm -> Smart Notebook -> Learning Signal -> "
            "Visual Lab -> Practice Mission -> Growth Map -> Roadmap")
    y = draw_para(c, flow, right_x, y, "Helvetica-Bold", BS, col_w, LEAD, BLUE)

    y -= 7
    y = draw_heading(c, "Project Status", right_x, y, GREEN)
    y = draw_para(
        c,
        "PicoLab is a functional hackathon prototype. The demo uses deterministic "
        "mock/backend logic and a canonical physics problem to show the complete "
        "student learning loop. The architecture is ready for real AI providers, "
        "broader STEM domains, and richer visual simulations.",
        right_x, y, BF, BS, col_w, LEAD, SECONDARY)

    # --- footer ---
    fy = 40
    c.setStrokeColor(BORDER)
    c.setLineWidth(1)
    c.line(mx, fy + 12, W - mx, fy + 12)
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(mx, fy, "Hackathon Submission  ·  PicoLab")
    c.setFont("Helvetica", 8)
    repo_text = f"GitHub Repository: {REPO_URL}"
    c.drawRightString(W - mx, fy, repo_text)

    c.showPage()
    c.save()


# =============================================================================
# PDF 2 — Code overview (Platypus, paginated, page numbers)
# =============================================================================
def on_page(c, doc):
    W, H = letter
    c.saveState()
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # footer
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.8)
    c.line(50, 44, W - 50, 44)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.5)
    c.drawString(50, 33, "PicoLab — Code Overview")
    c.drawRightString(W - 50, 33, f"Page {doc.page}")
    c.restoreState()


def styles():
    ss = getSampleStyleSheet()
    s = {}
    s["h1"] = ParagraphStyle("h1", parent=ss["Title"], fontName="Helvetica-Bold",
                             fontSize=30, textColor=BLUE, spaceAfter=4, alignment=TA_LEFT)
    s["sub"] = ParagraphStyle("sub", fontName="Helvetica", fontSize=12,
                              textColor=SECONDARY, spaceAfter=14)
    s["h2"] = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=14,
                             textColor=INK, spaceBefore=14, spaceAfter=6)
    s["body"] = ParagraphStyle("body", fontName="Helvetica", fontSize=9.5,
                               textColor=SECONDARY, leading=13.5, spaceAfter=4)
    s["bullet"] = ParagraphStyle("bullet", parent=s["body"], leftIndent=12,
                                 bulletIndent=2, spaceAfter=2)
    s["meta"] = ParagraphStyle("meta", fontName="Helvetica", fontSize=9.5,
                               textColor=INK, leading=14)
    s["filehdr"] = ParagraphStyle("filehdr", fontName="Helvetica-Bold", fontSize=9,
                                  textColor=BLUE, spaceBefore=10, spaceAfter=3)
    s["code"] = ParagraphStyle("code", fontName="Courier", fontSize=7,
                               textColor=INK, leading=8.6,
                               backColor=CODE_BG, borderColor=BORDER, borderWidth=0.6,
                               borderPadding=5, leftIndent=0, spaceAfter=8)
    return s


def build_code_pdf():
    s = styles()
    doc = BaseDocTemplate(
        str(CODE_PDF), pagesize=letter,
        leftMargin=50, rightMargin=50, topMargin=54, bottomMargin=54,
        title="PicoLab — Code Overview", author="PicoLab",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin,
                  doc.width, doc.height, id="main")
    doc.addPageTemplates([PageTemplate(id="all", frames=[frame], onPage=on_page)])

    flow = []

    # ---- Cover ----
    flow.append(Spacer(1, 40))
    flow.append(Paragraph("PicoLab", s["h1"]))
    flow.append(Paragraph("Visual AI learning coach for STEM — Code Overview", s["sub"]))
    flow.append(Paragraph(f"<b>GitHub Repository:</b> {REPO_URL}", s["meta"]))
    flow.append(Spacer(1, 8))
    flow.append(Paragraph("<b>Tech stack</b>", s["meta"]))
    for item in [
        "React", "Vite", "TypeScript", "Tailwind CSS",
        "Express", "Mock backend REST API", "Deterministic diagnostic engine",
    ]:
        flow.append(Paragraph(f"• {item}", s["bullet"]))
    flow.append(Spacer(1, 10))
    flow.append(Paragraph(
        "This document showcases the source developed for PicoLab. Generated "
        "files, dependencies, and build artifacts (node_modules, dist, .git, "
        "caches, lockfiles, binary media, backup bundles) are intentionally "
        "excluded.", s["body"]))

    # ---- Key architecture summary ----
    flow.append(Paragraph("Key Architecture Summary", s["h2"]))
    for line in [
        "<b>Page-based workflow</b> — each step of the student loop is a route under <font face='Courier'>src/pages/</font> wired in <font face='Courier'>routes.tsx</font>.",
        "<b>Shared component system</b> — primitives (Button, Card, Badge) plus feature components under <font face='Courier'>src/components/</font>.",
        "<b>Backend-first API client</b> — <font face='Courier'>picolabApi</font> calls the Express mock first and falls back to a deterministic local mock on failure/timeout.",
        "<b>Mock backend</b> — Express + TypeScript exposes contract-shaped REST endpoints under <font face='Courier'>server/src/routes/</font>.",
        "<b>Diagnostic engine</b> — classifies a step/answer into learning signals (units, formula, graph, algebra, concept, reading).",
        "<b>Local persistence</b> — practice progress, signals, Ask Pico history, and Visual Lab context persist via localStorage/sessionStorage.",
        "<b>Context hand-off</b> — Smart Notebook stores a signal-based suggestion the Visual Lab reads to open the matching template.",
    ]:
        flow.append(Paragraph(f"• {line}", s["bullet"]))

    # ---- Repository structure ----
    flow.append(Paragraph("Repository Structure", s["h2"]))
    flow.append(Preformatted(FILE_TREE, ParagraphStyle(
        "tree", fontName="Courier", fontSize=7.2, leading=9.0, textColor=INK,
        backColor=CODE_BG, borderColor=BORDER, borderWidth=0.6, borderPadding=6)))

    # ---- Important code sections ----
    flow.append(PageBreak())
    flow.append(Paragraph("Important Code Sections", s["h2"]))
    flow.append(Paragraph(
        "Readable excerpts from the most important source files. Long lines are "
        "soft-wrapped; each header notes how many lines are shown.", s["body"]))
    for rel, max_lines in CODE_FILES:
        excerpt, shown, total = read_excerpt(rel, max_lines)
        if total and shown < total:
            hdr = f"{rel}   (lines 1-{shown} of {total})"
        else:
            hdr = f"{rel}   ({total} lines)"
        flow.append(Paragraph(hdr, s["filehdr"]))
        flow.append(Preformatted(excerpt, s["code"]))

    # ---- Commit summary ----
    flow.append(PageBreak())
    flow.append(Paragraph("Commit Summary", s["h2"]))
    flow.append(Paragraph("Recent history (git log --oneline --decorate -20):", s["body"]))
    flow.append(Preformatted(COMMIT_LOG, s["code"]))

    # ---- Verification ----
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
