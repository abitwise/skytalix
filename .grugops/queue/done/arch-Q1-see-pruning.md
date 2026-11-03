---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T20:07:55Z
subtask: arch-Q1-see-pruning
role: architect-design
ref: .grugops/context/arch-Q1-see-pruning/
branch: new grugops/arch-Q1-see-pruning from main — worktree .claude/worktrees/arch-Q1-see-pruning
width: wrap EVERY test/build/engine run (every vitest too) in `flock <scratch>/host-test.lock <cmd>`. One core; the lock is shared. Probes small: each run ≤ 30 min, hop total ≤ 2 h; larger → stop and return the question. Host paths only as placeholders in anything committed.
---
# Design Q1 (SEE pruning of losing captures, quiescence and main search) — owner Q-3K-9 YES 2026-11-03 opens ADR-0024 d4 for design
Read ADR-0056 row Q1 (+20–50 forecast; arch-ABC-234 diagnostic +0.88 ply reach, d8 0.22–0.68×, not pre-registered), ADR-0065 (SEE ordering, premise not met — decision 2 'carrying see'), ADR-0024 (quiescence; d4 now open for design by owner word), the current search on main (E1 + ABC-274 packed eval merged).
Decide and write an ADR PROPOSED (next free id; coordinate: arch-ABC-270 is also writing one — take the id after it if both are free, and say so in your note): SEE implementation (cost, where computed), pruning rule in quiescence and in main search (threshold, depth limits, check / promotion exemptions), interaction with existing ordering and TT. Pre-register premise (node / reach) and bars: correctness rows (tactics/mate floors, G1), G2, G6, NFR-005 depth floor, then per-change 100 games at 100 ms GAIN 50.0. Seal a PREREG before any measured probe; a miss is never re-played. If the premise fails, say premise-not-met as ADR-0065/0066 did.
Recommend the slot vs ABC-239 / ABC-270 (Orchestrator's standing slot: before ABC-239's merge-read; the tuner is evaluation-side, Q1 search-side).
Fences: memory-bank/50-decisions + your records + scratch (no committed src/tools). Don't edit ADR-0056, ADR-0024, EPIC-011 or ticket pages — list owed lines (and a BA/PM ticket cut) in a note. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-Q1-see-pruning, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.

## Result (architect-design, 2026-11-03T20:30Z): **`ADR-0069` PROPOSED, premise MET on `main`. Form QS (quiescence skips a SEE-losing capture out of check; main search unchanged) chosen by the pre-registered rule. Owner: accept `ADR-0069` (it amends `ADR-0024` d4).**

Records only. Branch `grugops/arch-Q1-see-pruning` in `.claude/worktrees/arch-Q1-see-pruning`, cut from `main` `dc7dc15d`. Two commits: the PREREG `a9af0ec8` (sealed `…1f71e417` before any measured run) and the records commit after it. Not merged, not pushed. No `src/` or `tools/` edit. Probe: a scratch copy of `main`'s `src/` (tree `4cb84035`), 3 batches, 42 jobs, every exit 0, about 7 min of host time under `flock <scratch>/host-test.lock`. Nothing left running. ADR id: `ADR-0069`; `arch-ABC-270` holds `ADR-0068`.

Notes are in `.grugops/context/arch-Q1-see-pruning/notes/`, sealed with grugops 2.2.0 `admitAndAppend` (context root: the worktree's `.grugops/context`). `readContext` reads back 3 of 3, and the index is rendered:
- `…1f71e417`: the PREREG (decision);
- `…5e73b0d4`: the verdict, the design, the slot, the owed lines and the owner question (decision);
- `…5173885a`: every reading (observation).

| item | result |
|---|---|
| instrument | door = `ABC-269` B0 exactly (839 514 / 1 533 901 / 1 296 788 / 404 930), reach 5.879; SEE 24 / 24 + 6 / 6 hand rows |
| premise (door) | 31.1 % of quiescence moves are SEE-losing captures, 97.3 % of them refuted |
| QS (chosen) | d8 `search()` 0.7208 / 0.2652, `chooseMove` 0.5909 / 0.2160; reach **+0.837 ply** (5.879 → 6.716); drift 96.26 % / 95.72 %, max 66 / 96 cp; mate 0 / 190; zugzwang 7 / 7; `G1` 54 / 58 |
| QSc | passes; +0.495 ply (the check exemption costs 0.34 ply, no safety gain) |
| QSM | passes; +0.879 ply, within 0.05 of QS, so not chosen; main-rule audit 1.72 % flips with a 325 cp error |
| bars written | drift ≥ 93 % / ≤ 144 cp; mate d5 → d5 0; zugzwang 7 / 7; `G1` ≥ 54 / 58; d8 ≤ 0.78× ×4; reach ≥ door + 0.55; `G6` graded; `G2` by byte-identity; C2′ GAIN ≥ 50.0 / 100 at 100 ms; S′ E 1 810; Levels lane |
| slot | merge before `ABC-239`'s candidate freezes for B-T8 / C2′ (recommended), or after `ABC-239` merges, never in between; the tuner's filter is protected by the rules-record seam (decision 6) |
| owed | `ADR-0056` row Q1 + dated line; `ADR-0024` § Status pointer (at acceptance); `ADR-0065` re-open 1; `EPIC-011`; **new ticket cut (BA/PM)** with `A1`–`A6`; an `ABC-239` page line; optional `ABC-270` line (decision note § 5) |
| owner | accept `ADR-0069` (amends `ADR-0024` d4: SEE pruning enters quiescence; delta pruning and quiet checks stay fenced) |

### Trace row (10 cells)

| arch-Q1-see-pruning | Q1 design: ADR-0069 PROPOSED, premise MET on main dc7dc15d (PREREG …1f71e417 at a9af0ec8). Form QS: quiescence skips a SEE-losing capture (see < 0, not promotion / king / victim ≥ attacker) out of check; main search unchanged; QSc (check exemption) and QSM (main rule) measured and not taken. QS d8 0.7208 / 0.2652 search, 0.5909 / 0.2160 chooseMove; reach +0.837 ply; safety all green. Amends ADR-0024 d4 (owner's acceptance) | EPIC-011 | ADR-0069 (PROPOSED); ADR-0024 d4 amended on acceptance; ADR-0065 d2's see with threshold 0; rules-record seam protects ABC-239's filter | NFR-005 (G6 graded, F9); NFR-009 288 B; no catalog change | `grugops/arch-Q1-see-pruning` (PREREG a9af0ec8 + records commit; notes …1f71e417, …5e73b0d4, …5173885a) | scratch probe 42 jobs, every exit 0 (no lane run, no games) | — (UAT at the build; QE signs) | Owner: accept ADR-0069; BA/PM: cut the Q1 ticket + EPIC-011 / ABC-239 lines; Architect: ADR-0056 / ADR-0024 / ADR-0065 lines; slot before ABC-239's B-T8 freeze | Design done, awaiting the owner, 2026-11-03 |
