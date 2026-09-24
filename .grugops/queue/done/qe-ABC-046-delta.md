---
task: wave-2026-09-24
subtask: qe-ABC-046-delta
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md (delta re-QE after a FAIL)
ticket: plans/tickets/ABC-046-quit-and-new.md
ref: .grugops/context/qe-ABC-046/  (append to the SAME context; the first QE's notes are there)
build_ref: .grugops/context/ticket-to-pr-ABC-046/
ruling_ref: .grugops/context/ruling-abc046-clause6/
enqueued_by: orchestrator
enqueued_at: 2026-09-24T22:30:00Z
branch: grugops/qe-ABC-046-delta
base: grugops/wave-2026-09-24 (re-hop 85b66c6 / 6e8397f merged)
---

# Subtask: delta re-QE of `ABC-046` — did the re-hop close D1, D2 and G1, and is the disarm sound?

Your first pass FAILED the build on two false docblock sentences (D1, D2) and routed reading 2 to
Architect/Design. The ruling licensed a `disarm`. The re-hop (`85b66c6`) changed four files: +12 /
−3 non-comment production lines and +3 rows. Read the ruling's `decision` note, the ticket's
`## Ruling (clause 6) 2026-09-24` and `## Delivery (re-hop) 2026-09-24`, and the Engineer's
re-hop notes in `build_ref:` (`20260924T2005`–`2008`). This is a DELTA pass. `A1`–`A7` were
MET in your first pass; re-confirm them through the gates and do not re-argue them.

## Rule
1. Are D1 and D2 now TRUE? Re-run your docblock probe (drop the `quit` row) against the new
   D2 wording. Read every new docblock sentence the re-hop added (wrapper and cap) under the
   `ABC-114` standard.
2. Is the disarm exactly what the ruling licensed: it only clears the flag, is only called on
   the over-cap branch, and has no other callers? Does `A8`'s twice-amended file list hold,
   with `src/turn-loop.ts` and `src/cli.test.ts` byte-identical?
3. **Verdict on the whole ticket:** PASS or FAIL.

## Then break it
- The four gates; expect 42 / 1364 / 0. `test-skip-integrity` prints `No findings.`
- Reproduce `Q3`, `X1`, `X2`, `X3` and `M9` on the ruled rows. Add at least: disarm called on the
  over-cap branch BEFORE the length check (does anything notice?); `quit` / over-cap / `new`;
  over-cap / `quit` / `quit` (disarm on an unarmed resolver, then a normal exit). Each: RED or
  NONE, and what the product does. Revert and confirm the tree is clean.
- `ABC-037` bar 2 in both lanes (`INPUT_DEEP=1 NODE_OPTIONS=--expose-gc`).
- The real entry point: `quit` / 1025×`x` / `quit` / EOF, and `quit` / 1025×`x` / `quit` / `quit`.
- Your first pass left G3-INFO (`new` as Black) and G4-INFO (the stale "A6 also" comment). Say
  whether they are still open.

## Do not
- Do not fix the build. Do not touch `src/search.*`, `src/quiescence.*` or `src/engine.*` (QE on
  `ABC-079` is live). Do not open `plans/board.md`, `AGENTS.md` or `plans/nfr-catalog.md`. Do not
  rule NFR-008.
- Do not merge or deploy. Work in your own worktree. Write commit messages to a uniquely named
  scratchpad file and use `git commit -F`. Run gates through node scripts.

## Publish
PASS or FAIL as a `decision` note that supersedes your first `decision` note (set `supersedes`),
mutants as an `observation` note, a trace row, and a ticket § QE (delta) section. Claim by hand per
Workflow 17 BEFORE you start. Report: the verdict, the three rulings, the mutant table, the gate
numbers, the bar 2 results, the entry-point transcripts, the sha and the numstat.
