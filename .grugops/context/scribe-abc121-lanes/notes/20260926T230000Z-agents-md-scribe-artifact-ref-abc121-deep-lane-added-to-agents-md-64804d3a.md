---
id: 20260926T230000Z-agents-md-scribe-artifact-ref-abc121-deep-lane-added-to-agents-md-64804d3a
kind: artifact-ref
by: agents-md-scribe
at: 2026-09-26T23:00:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - .grugops/context/uat-run-ABC-121/notes/20260926T220000Z-qe-e2e-observation-gate-and-a1-a5-deep-lane-reproduced-77854a65.md
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T204100Z-software-engineer-decision-abc121-two-of-four-rows-moved-two-refused-only-guards-9bdce84b.md
supersedes:
---

# `AGENTS.md`: ABC-121's `SEARCH_DEEP` deep lane added; byte budget held; `npm test` green

Hand-authored, no `seal`: `context-io.ts` / `scripts/context-io.js` are absent from this install
(same as noted by `…9bdce84b`, `…77854a65` on this ticket), so no `finding` is admissible here —
this is the `claim`-adjacent record the role otherwise makes as a `finding`. Owner's word,
2026-09-26, verbatim: "run items 1-3" (item 1 = this task). Worked entirely in worktree
`.claude/worktrees/scribe-abc121-lanes`, branch `grugops/scribe-abc121-lanes`, cut from the wave at
`652ed49` (= local `main`).

## What changed

- **`AGENTS.md` § Commands § Test** — one new line after the Quiescence deep lane, before "Test
  (single file)": `PVS/LMR deep lane (ABC-121, src/search.pvs-lmr.test.ts): SEARCH_DEEP=1 npx
  vitest run src/search.pvs-lmr.test.ts`, with an inline comment giving the default/deep counts and
  the wall-clock reasoning below.
- **`memory-bank/90-agents-md-command-log.md`** — a matching `## PVS/LMR deep lane (ABC-121, ...)`
  section, same shape as the existing Search/Engine/Transposition/Zobrist/Quiescence sections,
  giving the fuller receipt and the reason the deep run was cited rather than re-run.
- `plans/board.md` was NOT touched (no board move; this role does not own one).

## Counts measured

- **Default lane, this file, measured here** (worktree `scribe-abc121-lanes`, HEAD `652ed49`, RUN
  2026-09-26): `npx vitest run src/search.pvs-lmr.test.ts` (no `SEARCH_DEEP`) — exit 0, **20
  passed**, 0.6 s wall.
- **`SEARCH_DEEP=1` lane, cited not re-run**: QE's UAT run (`…77854a65`, 2026-09-26, worktree
  `.claude/worktrees/ABC-121-pvs-lmr`, HEAD `6570343`) — exit 0, **29/29 passed**, **926.18 s wall
  under load**. That run reproduced the build's and QE's own earlier deep-lane figures to the exact
  number. 926 s is well over the 10-minute bound this task set for a from-scratch re-run, so the
  UAT receipt is cited by note id instead, per instruction.
- Only `src/search.pvs-lmr.test.ts` moved rows under `ABC-121` (`…9bdce84b`'s two-of-four
  placement). `src/search.test.ts`, `src/quiescence.test.ts` and `src/transposition.test.ts` were
  confirmed untouched by this ticket's diff (`…77854a65`), so their existing `AGENTS.md` deep-lane
  lines are unchanged and were not re-measured.

## Byte budget

- Before: 22,090 B.
- After: **22,451 B** (+361 B).
- Budget: 24,576 B. Headroom remaining: 2,125 B.

## Gate

- `npm test` (foreground, this worktree, HEAD `652ed49` + this change): exit 0, **48 files / 1,467
  tests passed**, 0 skipped, 4.74 s. Byte guard included above (manual `wc -c`, no automated gate
  script found in this install for the cap).

## Not done, recorded only

Items 2 and 3 of "run items 1-3" are outside this role's scope (this role owns `AGENTS.md` /
command-log substrate only) — the orchestrator or owner should route them to the appropriate role.
