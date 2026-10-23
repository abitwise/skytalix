---
subtask: bapm-cut-levels-6-7
role: ba-pm
ticket: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
ref: .grugops/context/bapm-cut-levels-6-7/
width: next free slot (records only)
---

# Record EPIC-008 Q1/Q2 and cut difficulty levels 6 (5 s) and 7 (up to 30 s)

## Do
- On EPIC-008 (dated): Q1 answered (+100, interval above 0); Q2 answered (whenever idle, one at a time, AC, alone). Re-read gate G9 as "levels 1–5 byte-identical".
- Cut the levels 6–7 ticket (next free ABC id; which epic it belongs to is yours to rule — EPIC-008 or EPIC-004's levels line). Settle testably: budgets (6 = 5 000 ms; 7 = up to 30 000 ms — "up to" means what: fixed 30 s, or stop early when the search is clearly done? rule it), blunder rate 0, every surface (CLI `--difficulty`, the startup question, UCI `Skill Level` max, help/usage text, AGENTS.md/runbook mentions), default stays 5.
- **Bounds the owner moved (name them exactly):** NFR-004's "hard ceiling 5 s at any difficulty" → per-level ceilings (propose the text, e.g. ceiling = budget + margin), `HARD_CEILING_MS`, the ABC-204 harness `timemargin` rule (5000 − budget), NFR-005 if touched. The NFR text and an ADR-0045 amendment go to the owner as PROPOSED — mark them for the Orchestrator.
- Interactions: test-lane cost (virtual clock?), NFR-008, UCI GUIs that time out on 30 s, ABC-204/EPIC-008 readings (level 5 only).
- DoR, size, priority.

## Fences
- Work on `grugops/bapm-cut-levels-6-7` (worktree from `main`). Only the EPIC-008 page, the new ticket page, an epic page if you place it elsewhere, and your notes. No `src/`, ADRs, `plans/nfr-catalog.md`, board, trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm-lvl/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes via the plugin writer (task `bapm-cut-levels-6-7`), `at` from `date -u`, with a `kind: decision`. Write `## Result` (board card line) plus 10-cell trace rows into this brief in main's queue, then move it and its `claim.md` to `done/`.
