# Loop of a Lifetime — UI Style Guide

## Creative direction

**Chronologist first, recurring cycles second.** The interface should feel like a calm instrument for examining a life: precise and readable, with a quiet sense of time passing and opportunities to improve. A future journal is a distinct feature panel, not the visual theme of the entire game.

## Principles

1. **Hopeful, not saccharine.** Use encouraging language and warm accents without turning the UI into a bright productivity app.
2. **Time is the signature.** Circular marks, recurring arcs, and chronological records are motifs. Avoid using a generic timeline as a progress bar until the game defines what that progress means.
3. **Data remains legible.** Labels are muted, values are prominent, and the layout is balanced rather than densely packed.
4. **Meaningful color.** Teal signals active/actionable/growth; amber signals milestones and noteworthy moments; coral is reserved for danger or negative states.
5. **Animation serves feedback.** Small hover lifts and color transitions only. Respect `prefers-reduced-motion`.
6. **Features remain modular.** The current Life Log is a concise event panel. A full journal can later be added as a separate panel or screen without changing the overall visual identity.

## Color tokens

| Token | Hex | Usage |
|---|---|---|
| Background | `#101821` | Main page background |
| Panel | `#192633` | Main panel surfaces |
| Border | `#304250` | Control and card boundaries |
| Main text | `#E7ECE9` | Primary labels and values |
| Muted text | `#A2B1B9` | Supporting text |
| Subtle text | `#718692` | Low-priority metadata |
| Growth teal | `#68C2B7` | Primary actions, active and growth states |
| Milestone amber | `#EDC27D` | Highlights, milestones, paused status |
| Alert coral | `#DF8378` | Reserved for future warnings and danger states |

## Typography and spacing

- Use the system sans-serif stack for compatibility and readability.
- Use larger, slightly tightened headings; use tabular numerals for numeric values.
- Eyebrow labels are small, uppercase, and letter-spaced. Use sparingly to structure sections.
- Use a consistent spacing rhythm based on roughly 4/8/12/16px increments.
- Cards use 12px corners; primary panels use 18px corners, with slightly tighter corners on mobile.

## Components

- **Primary button:** teal fill, dark text, reserved for the main action.
- **Secondary button:** transparent/slate surface with a quiet border.
- **Activity buttons:** larger clickable rows with an icon, title, short explanation, and directional cue.
- **Stat cards:** clear label/value/supporting note; highlight only the most important stat.
- **Status pill:** compact text badge plus a state indicator; keep text readable without relying on color alone.
- **Life Log:** chronological event surface with a marker and latest entry. Do not present it as the full journal.
- **Cycle mark:** recurring arcs in the brand mark and small supporting details; decorative for now, not a gameplay mechanic.

## Responsive behavior and accessibility

- At tablet widths, stack the Life Log beneath the main column.
- On narrow mobile screens, stack activity buttons and simplify padding while retaining all information.
- Maintain visible keyboard focus with an amber outline.
- Keep button text labels alongside symbols; symbols alone do not communicate actions.
- Honor reduced-motion preferences.
- Maintain contrast between text and panel backgrounds; avoid conveying state through color alone.

## Scope of the current implementation

The styling pass updates `index.html` and `css/style.css` only. Existing JavaScript behavior and game-state logic remain unchanged. The full journal, life timeline/progression visualization, and animated loop transitions are future features; they should be designed when their underlying mechanics and data are defined.
