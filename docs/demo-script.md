# PicoLab Demo Script

## Opening Hook

Most learning apps tell students whether they are right or wrong. PicoLab asks a better question: what can this mistake tell us about what the student needs next?

PicoLab is a visual AI learning coach that turns STEM mistakes into learning signals.

## Problem

Start on the Home page and frame the demo around a simple physics problem:

```txt
An object starts at 2 m/s and accelerates at 4 m/s^2 for 2 seconds. Find the final velocity.
```

Open Add Problem and enter the sample problem. The goal is not just to get an answer. The goal is to understand the reasoning path.

## Solution Walkthrough

Move to Scan & Confirm. Show that PicoLab extracts the important values, units, formula clues, and the target variable. Point out the ambiguity review: students can confirm what the app thinks it saw before moving into the notebook.

Open Smart Notebook. Walk through the step review. Use a unit-related answer such as `10 m` when the quantity should be velocity. PicoLab gives supportive feedback and identifies the adjustment without shaming the learner.

## Learning Signal Moment

Pause on the diagnostic signal. Explain that PicoLab does not only mark the step wrong. It turns the evidence into a structured learning signal, such as a final unit mismatch or quantity confusion.

That signal can now travel through the rest of the product: practice, visuals, growth tracking, and profile progress.

## Visual Lab Moment

Open Visual Lab from the recommended action. Show the active template that matches the problem or signal. For this demo, the Motion or Units template makes the abstract reasoning visible.

Explain that visual practice helps students see why a unit, sign, graph, or formula relationship matters.

## Practice and Growth Moment

Go to Practice Missions and answer a mission. Show PicoPoints, mission completion, and local progress.

Then open Growth Map. The same learning signal now appears as part of a supportive diagnostic view. Open Growth Path to show the recommended next focus, then Profile to show streaks, badges, and progress.

## Why This Matters

PicoLab connects the full loop:

- a student makes a mistake
- PicoLab detects a learning signal
- the student gets contextual coaching
- the student sees the concept visually
- practice and growth recommendations adapt around that signal

The product is built around learning from mistakes, not hiding them.

## Technical Architecture

The frontend is React, Vite, TypeScript, and Tailwind CSS. The backend is an Express TypeScript mock API with contract-shaped REST endpoints.

Connected flows call the backend first and fall back to local mock data if the server is unavailable. Local storage keeps demo progress, Ask Pico history, practice state, diagnostic signals, and Visual Lab suggestions.

There are no real API keys, no production AI calls, no auth, and no database in this demo. The AI layer is provider-ready, but currently deterministic and mock-safe.

## Future Roadmap

Next steps are real AI provider integration, real OCR, persistent user accounts, a richer diagnostic engine, teacher dashboard views, and more STEM visual templates.

## Closing Line

PicoLab turns each wrong step into the next right learning moment.
