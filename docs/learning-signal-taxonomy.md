# Learning Signal Taxonomy

PicoLab uses learning signals to describe evidence about what a learner may need next. A signal is not a judgment about the learner. It is a structured, supportive clue that helps Pico choose feedback, practice, visual support, Growth Map language, and Growth Path priorities.

## Language Model

- Mistake: an observed mismatch between the learner's work and the expected reasoning. This word is useful internally, but Pico should avoid leading with it in student-facing copy.
- Learning signal: a supportive interpretation of evidence, such as a final unit needing attention or a graph slope needing support.
- Growth area: a cluster of repeated or high-priority learning signals that belongs on the Growth Map or Growth Path.
- Practice recommendation: a next action selected from the signal definition, such as Unit reasoning or Formula chooser.

Student-facing copy should prefer words like learning signal, adjustment, needs attention, useful signal, growth area, evidence, next practice, visual support, and supportive feedback.

## Categories

The taxonomy has 7 categories and 28 starter subtypes.

| Category | Subtypes |
| --- | --- |
| Algebra | `algebra.sign_error`, `algebra.isolation_error`, `algebra.order_of_operations`, `algebra.substitution_structure` |
| Units | `units.missing_unit`, `units.final_unit_mismatch`, `units.unit_cancellation`, `units.conversion_error` |
| Formula | `formula.selection_error`, `formula.variable_mismatch`, `formula.rearrangement_issue`, `formula.incomplete_formula` |
| Concept | `concept.quantity_confusion`, `concept.direction_confusion`, `concept.rate_of_change`, `concept.force_mass_weight` |
| Graph | `graph.axis_interpretation`, `graph.slope_confusion`, `graph.area_under_curve`, `graph.endpoint_confusion` |
| Reading | `reading.target_confusion`, `reading.given_value_missed`, `reading.condition_missed`, `reading.ambiguous_information` |
| Calculation | `calculation.arithmetic_slip`, `calculation.rounding_issue`, `calculation.numeric_substitution`, `calculation.scale_issue` |

## Definition Shape

Each definition includes:

- Stable `id`, `category`, and `subtype`
- Student-friendly title and label
- Description, evidence examples, and common patterns
- Supportive feedback
- Suggested practice missions
- Optional Visual Lab template
- Growth Path focus areas

Runtime instances add severity, status, confidence, evidence, source, timestamp, and optional problem/step references.

## Product Mapping

Smart Notebook:
The notebook should attach one or more signal instances to a step check. For example, a final answer of `10 m` for final velocity can produce `units.final_unit_mismatch`. The notebook can still show the existing compact line: Learning signal plus suggested focus.

Visual Lab:
Definitions can include `suggestedVisualTemplate`. For example, unit signals map to `units`, rate and graph signals map to `graph`, and direction or quantity signals can map to `motion`.

Practice Missions:
Practice can use a signal ID to choose a mission family. `units.unit_cancellation` can recommend Unit cancellation ladder or Dimensional check. Later phases can generate mock missions from these fields.

Growth Map:
Growth Map should remain diagnostic. It can group repeated instances by category, show signal strength, and avoid roadmap language except for light next actions.

Growth Path:
Growth Path should translate repeated or prioritized signals into roadmap focus areas. For example, `formula.rearrangement_issue` can contribute to Formula rearrangement and Algebra fluency.

Profile:
Profile can show aggregate progress, such as improved learning signals and badges, without becoming the diagnostic view.

## Mixed-Signal Examples

Algebra + units:
A learner solves `v = v0 + at` correctly as a number but writes the answer as meters and also drops a negative sign. This can create `algebra.sign_error` plus `units.final_unit_mismatch`.

Formula + reading:
A learner chooses a distance formula because they missed that the prompt asks for final velocity. This can create `reading.target_confusion` plus `formula.selection_error`.

Graph + concept:
A learner reads the slope of a velocity-time graph as velocity instead of acceleration. This can create `graph.slope_confusion` plus `concept.rate_of_change`.

Calculation + unit:
A learner uses the correct unit reasoning but shifts a decimal place during conversion. This can create `calculation.scale_issue` plus `units.conversion_error`.

## Prioritization

The deterministic prioritization rule for now is:

1. High severity first
2. Higher confidence first
3. Concept, formula, and units before calculation when tied
4. Newest evidence first when dates exist

This is intentionally simple. It is not a diagnostic model.

## Future Diagnostic Engine Plan

Later mock diagnostic phases can:

1. Convert notebook and practice evidence into `LearningSignalInstance` records.
2. Allow mixed signals per step.
3. Aggregate instances into Growth Map category summaries.
4. Select Growth Path focus areas from repeated high-confidence signals.
5. Route to Practice Missions and Visual Lab using `suggestedPractice` and `suggestedVisualTemplate`.
6. Keep student-facing feedback supportive even when internal evidence comes from a mismatch.
