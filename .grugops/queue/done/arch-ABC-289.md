---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T19:57:33Z
subtask: arch-ABC-289
role: architect-design
ref: .grugops/context/arch-ABC-289/
branch: new grugops/arch-ABC-289 from main — worktree .claude/worktrees/arch-ABC-289
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Probes on scratch copies, each ≤ 30 min, ≤ 1 h in all; no games beyond what a PREREG names. Host paths only as placeholders.
---
# Design ABC-289 (Q2: delta pruning in quiescence): re-measure over Q1, then ADR-0074
Read plans/tickets/ABC-289*.md, ADR-0024's fourth Status block (the nine things Q2's ADR must show), ADR-0069 as the precedent, and src/quiescence.ts and src/see.ts on main (ABC-283 and Q1 are in force).
- PREREG sealed before any measured probe.
- Re-measure the premise on main with Q1 in it. If it is not met, say so plainly and recommend parking; the owner decides any override.
- Write ADR-0074 PROPOSED, amending ADR-0024 d4, showing all nine items.
- Respect the lane budget: rows ≥ 50 ms go deep; no new default-lane file.
- In your decision note, list the owed BA/PM lines and the owner question.
Fences: memory-bank/50-decisions, your records, scratch. No committed src or tools; no ticket, EPIC or board edits. Do not edit ADR-0056 (arch-bundle-1 holds it) and do not use ADR-0072 or ADR-0073. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-289, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result (architect-design, 2026-11-04T20:48:52Z): **`ADR-0074` PROPOSED, premise MET on `main`. Form D200b chosen, the only form to pass both gates. Owner: accept `ADR-0074` (it amends `ADR-0024` d4).**

Records only. Branch `grugops/arch-ABC-289` in `.claude/worktrees/arch-ABC-289`, cut from `main` `0cc9afd1`. Commits: `9e07dae4` (claim and PREREG, sealed before any measured run), `df81998f` (ADR and notes), and this one. Not merged, not pushed. No `src/` or `tools/` edit; `ADR-0056`, `ADR-0072` and `ADR-0073` untouched. Probe: 3 batches, 62 jobs, every exit 0, 7 min 14 s under `flock <scratch>/host-test.lock`. Nothing left running.

Notes are in `.grugops/context/arch-ABC-289/notes/`, sealed with `admitAndAppend`; `readContext` reads back 3 of 3:
- `…174760a3`: the PREREG (decision);
- `…62012bbe`: the verdict, the design, the flags, the owed lines and the owner question (decision);
- `…ee8a8621`: every reading (observation).

| item | result |
|---|---|
| instrument | exact: knob off = `main` 523 847 / 234 214 / 707 548 / 101 425; `ABC-279`'s pair 839 514 / 1 533 901 / 1 296 788 / 404 930 with the knob off and on |
| premise (door) | quiescence 86.59 % of nodes; at margin 200, 43.73 % of captures searched are delta-only, 99.52 % of them refuted |
| pay | all six forms pass |
| safety | only D200b: 100 % / 100 %, max 12 / 20 cp; mate 0 / 0; zugzwang 7 / 7; `G1` 54 / 58 |
| D200b | d8 0.6362 / 0.8263, 0.6484 / 0.8201; reach 6.868 → 7.147 (+0.279) |
| bars | d8 ≤ 0.88× ×4; reach ≥ door + 0.15; drift ≥ 98 %, ≤ 30 cp; mate 0 both recursions; zugzwang 7 / 7; `G1` ≥ 54 / 58; `G6` ≥ base; C2′ GAIN ≥ 50.0 / 100; S′ E 1 810; Levels lane |
| owner | OQ-0074-1: accept `ADR-0074` |

**One correction to `…ee8a8621`** (a sealed note is not edited): "no d8 tree on these two roots reaches phase ≤ 6" is an inference, stated too strongly. What was read is that D200e's d8 counts equal D200's. Nothing was counted by phase.
