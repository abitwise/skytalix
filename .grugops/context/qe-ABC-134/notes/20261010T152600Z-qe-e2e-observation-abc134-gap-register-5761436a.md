---
id: 20261010T152600Z-qe-e2e-observation-abc134-gap-register-5761436a
kind: observation
by: qe-e2e
at: 2026-10-10T15:26:00Z
verified_by:
confidence: high
refs:
  - ABC-134
  - ADR-0029
  - QE-053-c
  - QE-053-d
  - QE-057-b
  - QE-134-a
  - QE-134-b
  - QE-134-c
  - QE-134-d
  - src/history-pane.nfr.test.ts
  - 20261010T152600Z-qe-e2e-decision-abc134-verdict-pass-with-gaps-5ec48998
supersedes:
---

# `ABC-134` QE gap register: one LOW gap, fixed in the branch; three INFO items

This note is hand-authored and unsealed. The readings are in `…048ac24a`. None of these gaps blocks `A1`–`A5` at `4cac6911`.

## `QE-134-a` — LOW — FIXED in `4cac6911` (comment-only, inside `A3`'s site)

- **What was wrong.** The settle comment at `4d6b019a` said "A deeper `setImmediate` chain, or a timer of any delay, is NOT seen".
- **Measured.**
  - `setTimeout` 0 ms and 1 ms are RED 10/10; 5 ms is RED 1/10; 50 ms is RED 0/10.
  - With the settle removed, a 0 ms timer is GREEN 5/5. So the settle is what reaches it: the settle spans several event-loop iterations, and an expired timer fires in their timers phase.
  - The source is `QE-053-d`'s "never a timer", which the ticket carried into `A3`'s criterion.
- **Fix.** The clause now reads: "A deeper `setImmediate` chain is NOT seen (`QE-053-d`). A timer is NOT reliably seen: it is seen only if it fires before the settle ends, a race with the clock", followed by the measurement.
- **Effect on the criterion.** `A3` still names both as unseen. The comment-free AST is identical.

## `QE-134-b` — INFO — owner: none

- `A2`'s sentence says a rebuild by replay "is seen by no instrument at all". That is true of the class: the pane-reuse and seam placements are GREEN on the full lane.
- Two placements are caught **incidentally**:
  - a pane replay that adds its own `parseFen`, by `A11`'s one-parse count;
  - a status-panel replay, by `ABC-016` `A13`'s replay and scan counts.
- The sentence under-states coverage, which is the safe direction. No reader is told a gap is covered. `A2`'s criterion requires this wording, so it is not changed.

## `QE-134-c` — INFO — owner: none

- `A4`'s "AT LEAST four … not exhaustive" is confirmed: five more spellings are uncounted too.
- Those five are single quotes, no semicolon, `import{`, a leading space and `with {}` attributes.
- Biome's formatter rejects the first four. So the four named spellings are the lint-clean evasions found here, and that matches `ADR-0029`'s pointer.

## `QE-134-d` — INFO — owner: Orchestrator (routing only)

- `QE-134-a`'s new sentence is QE's own wording in `src/`, so no second reader has seen it. The Orchestrator may want one.
- The race it names is also a flake mechanism. A timer-deferred lazy load of a few ms would red the probe only sometimes, and that is what "If this phase ever flakes, look at the settle first" now points at.
- The docblock's own bullet, "a derive DEFERRED past the settle, for example behind a timer", stays accurate.
