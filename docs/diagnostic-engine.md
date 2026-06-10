# Mock Diagnostic Engine

The mock diagnostic engine turns structured evidence into one or more `LearningSignalInstance` records. It is deterministic and uses the Phase 11G taxonomy. It makes Smart Notebook, Practice Missions, Growth Map, Roadmap, Profile, and Visual Lab suggestions speak the same learning-science language before any real AI integration.

## What It Does

- Reads evidence such as student answer, expected unit, expected quantity, formula, known values, target, topic, graph context, and problem text.
- Applies simple heuristic rules.
- Emits one or more taxonomy-backed signal instances.
- Prioritizes signals using the shared `prioritizeSignals` rule.
- Generates supportive feedback from the primary signal.
- Keeps existing API/UI compatibility fields such as `supportiveFeedback`, `learningSignal`, `whatWentWell`, `whatToAdjust`, and `whyItMatters`.
- Provides suggested Visual Lab template context when a signal definition includes one.

## What It Does Not Do Yet

- It does not call a real AI model.
- It does not store server-side history.
- It does not require the backend to be online because connected frontend flows keep local fallback behavior.
- It does not infer from arbitrary natural language deeply.
- It does not replace teacher judgment or learner review.
- It does not personalize with auth, accounts, or a database.

## Evidence To Signals

Units:
`v = 10 m` with expected unit `m/s` emits `units.final_unit_mismatch`. Acceleration/time evidence can also emit `units.unit_cancellation`.

Algebra:
Numeric sign differences emit `algebra.sign_error`. Formula or target not isolated can emit `algebra.isolation_error` or `formula.rearrangement_issue` depending on evidence.

Formula:
An incompatible formula emits `formula.selection_error`. A related formula with missing terms can emit `formula.incomplete_formula`.

Concept:
Velocity with a distance unit can emit `concept.quantity_confusion`. Direction language without sign evidence can emit `concept.direction_confusion`.

Graph:
Graph context with slope expected and endpoint/area language in the answer emits `graph.slope_confusion`. Area and endpoint cases use their matching graph signals.

Reading:
Target mismatch emits `reading.target_confusion`. Missing condition phrases like “starts from rest” can emit `reading.condition_missed`.

Calculation:
Close numeric differences emit `calculation.arithmetic_slip` or `calculation.rounding_issue`. Power-of-ten differences emit `calculation.scale_issue`.

## Mixed-Signal Examples

Units + concept:
Student writes `v = 10 m` for final velocity. The engine can emit `units.final_unit_mismatch` and `concept.quantity_confusion`.

Algebra + formula:
Student selects the right family but rearranges signs inconsistently. The engine can emit `algebra.sign_error` and `formula.rearrangement_issue`.

Graph + concept:
Student reads a slope question as a point value. The engine can emit `graph.slope_confusion` and `concept.rate_of_change`.

Reading + formula:
Student solves for distance when the prompt asks final velocity. The engine can emit `reading.target_confusion` and `formula.selection_error`.

Calculation + unit:
Student has the right relationship but shifts a decimal during conversion. The engine can emit `calculation.scale_issue` and `units.conversion_error`.

## Future AI Integration

Future AI can replace or augment the heuristic rules by:

1. Extracting richer evidence from full student work.
2. Suggesting candidate signal IDs with confidence.
3. Returning mixed-signal explanations.
4. Letting deterministic validation keep IDs, tone, and schema safe.
5. Persisting signal instances once auth/database phases exist.

The current engine is deliberately small so later AI can plug into the same evidence/result contract. In the demo, it powers backend mock responses and local fallback behavior.

## Safety And Tone

Feedback must stay supportive, educational, and non-punitive. Pico should describe evidence and adjustments, not judge the learner. Preferred language includes learning signal, useful signal, adjustment, needs attention, growth area, next practice, and visual support.
