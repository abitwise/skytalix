---
id: 20260814T172802Z-architect-design-observation-linkage-abc053-abc054-c1db3459
kind: observation
by: architect-design
at: 2026-08-14T17:28:02Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-053
  - ABC-054
  - ADR-0011
  - src/history-pane.nfr.test.ts
supersedes: 
---

# Linkage to `ABC-053` and `ABC-054` — recorded and LEFT. Neither is this subtask and neither is touched.

Both are open `P1` tickets carrying other rulings of mine. This hop's census landed on the same
instrument (`src/history-pane.nfr.test.ts`), so the linkage is recorded rather than left for the
next reader to trip over. **Nothing on either ticket was edited, moved or re-prioritised.**

## `ABC-054` — my licence ruling is STABLE under either outcome, and my RED is a TRUE red

`ABC-054`'s symptom on this guard is *"a **FALSE** RED"* from the inline-type-specifier blind spot:
the shared regex excludes `import type { X } from "…"` but matches `import { type X, type Y } from
"…"`, so it over-counts and fails **safe**.

**That blind spot does not produce the red I measured.** `ABC-042`'s entry point holds
`import { newGame } from "./history.ts";` — a **value** specifier, called at runtime. So under
`ABC-054`'s open question — *"is the property 'imports the module' or 'consumes the module at
runtime'?"* — the entry point is a runtime importer **under both readings**. The licence entry the
census ruling requires is owed whichever way `ABC-054` lands, and `ABC-054`'s repair cannot make it
unnecessary. **Left open, unchanged.**

One thing worth `ABC-054`'s hop knowing rather than re-deriving: **the licence gains its first second
entry at `ABC-042`**, so a repair landing after `ABC-042` is repairing a two-entry equality, not a
one-entry one. That changes nothing structural — the assertion is an equality over a filtered
`production` list on both sides, so entry order is derived and cannot drift — but it is one more
name the repair must keep green.

## `ABC-053` — untouched by `ABC-042`, and the reason is the census

`ABC-053` rules that the probe measures **load-time** closure while `NFR-002`'s premise is the
**per-frame** path. `ABC-042` adds **no frame producer**: `FRAME_PRODUCERS` stays at six, the probe's
root set and 11-module closure are unchanged, and the entry point can never be a probe root
(`ADR-0011` clause 4 — it exports nothing). **So `ABC-042` neither worsens nor discharges
`ABC-053`.** Left open, unchanged.

The one thing `ABC-042` does change in `ABC-053`'s neighbourhood is recorded in the measured-builds
observation and is **not** a change to that ticket: `ADR-0011`'s `R1` expiry — *"at `EPIC-006` the
frame path becomes a real closure"* — **does not arrive with `ABC-042`**, because clause 4 forbids
rooting the entry point. `ABC-041`'s `render-seam.ts` is the importable assembly module and is
already declared. Owner unchanged: Architect/Design.
