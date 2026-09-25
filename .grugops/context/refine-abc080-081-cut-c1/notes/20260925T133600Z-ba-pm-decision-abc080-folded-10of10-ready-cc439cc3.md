---
id: 20260925T133600Z-ba-pm-decision-abc080-folded-10of10-ready-cc439cc3
kind: decision
by: ba-pm
at: 2026-09-25T13:36:00Z
verified_by:
confidence: high
refs:
  - ABC-080
  - ADR-0024
  - NFR-005
  - N8-LANE
  - 20260925T080616Z-architect-design-decision-r1-abc080-a3-bar-releveled-to-4pct-a4-at-depth5-f7e66060
supersedes:
---

# ABC-080 — R1 folded into criteria, re-scored 10/10, Ready

**No sanctioned writer on this install** (`scripts/context-io.ts` / `claim.js` /
`propose_note` absent; `context.human_admission: off`). Hand-authored per
`agent-factory/contracts/context-note.md`, no `seal` — the degraded posture `AGENTS.md` names,
not re-derived here.

## What changed on the ticket page

- **`A3`** re-leveled ≤ 40% → **≤ 4%** on each of `kiwipete` and `position-6` at depth 4 — R1's
  measured bar (2.64% / 2.10%, ×1.5 headroom, `ADR-0024` decision 3's rule).
- **`A4`** now reads at depth 4 **and depth 5** on both positions; the delete rule is judged on
  the depth-5 reading, not depth-4 (depth 4 would falsely condemn killers: −0.2% vs. −5.7% /
  −20.5% at depth 5).
- **Scope** now names both consuming recursions explicitly — `src/search.ts` and
  `src/engine.ts` — per R1 point 3, so `ABC-078`'s identity sweep stays a one-algorithm
  comparison.
- **Test notes** gain `ABC-079` QE's surviving `G4` (the unguarded `ORDER_VALUE[promotion]`
  term in `mvvLvaKey`), pointed at `A4`'s own measurement — carried from the 2026-09-25
  re-score, still a test-notes item, not a new criterion.

## Re-score

**10 of 10 clean, 0 ⚠️ — MET.** Item 10, the ticket's last open item since 2026-08-16, is
discharged by R1's measurement: the bar is no longer generic, it is set from this codebase's
own reading. Every other item was already ✅ at the 2026-09-25 re-score
(`.grugops/context/rescore-abc080-081/notes/20260925T120500Z-...-40536c8e.md`) and is unchanged
here. Size `M`, priority `P0`, unchanged.

**Pullable today: YES.** The `Backlog → Ready` board move is the Orchestrator's.

Full DoR table on the ticket page, `§ DoR re-score — 2026-09-25 (BA/PM, task
`refine-abc080-081-cut-c1`, Workflow 07)`.
