---
subtask: bapm-epic008-hostB
role: ba-pm
epic: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
ref: .grugops/context/bapm-epic008-hostB/
branch: new grugops/bapm-epic008-hostB from main, worktree ../wt-bapm-epic008-hostB
width: 2 of 2 — records only (no npm, vitest, build or timing)
---

# EPIC-008: dated M1 line for the host move and option B; close-path step 3 re-worded

## Do
- Read Orchestrator `orch-2026-10-28a/…5dbd717b` (the owner's word) and `orch-2026-10-27o/…e018297c`, plus BA/PM `bapm-s1-ABC-210/…ff16a93d` (the close path).
- **EPIC-008 M1:** add a dated 2026-10-28 line. The agents moved hosts. M1 now uses option B: both R readings are taken on this host, the baseline at `3497aad2` and the close at the sha whose `src/` and `data/` equal `b5c67ab7`. Both use ABC-204 A4's protocol with E = 1 910 frozen and 200 games each, ALONE. **M1 = R(close) − R(baseline), half-width √(Y1² + Y2²).** The previous-host 2 061.3 ± 50.3 stands as a record but is **no longer the comparison**. The +100 target and "interval above 0" (Q1) are unchanged. Keep the old lines; supersede them by date.
- **E band:** E is frozen and has no E step. A reading outside 25–75 % is reported and graded as the page and ABC-204 say. Say plainly what that does to M1's grade. Don't invent a rule the owner hasn't given; if the page is silent, write it as UNKNOWN and route it to the owner via your Result.
- **Close path step 3:** re-word it to match: two R readings (3497aad2 first, then the close sha), PREREG first, one run each, final. M3 gates and G6 "≥ base" use 3497aad2 on this host. About 9 h ALONE. Step 4 grades M1 by the new rule.
- **EPIC-008 § Dependencies:** add a dated line saying the tool pins were re-pinned on this host per ABC-204 § Dependencies 2026-10-28 (`se-tools-rating-host`). Point to it; don't copy hashes.
- Put the board card lines in your Result. Don't edit the board.

## Fences
- Work only in your worktree. No `src/` or `tools/` edits, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-epic008-hostB`) with `at` from `date -u`, including a `kind: decision`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-28T21:15Z): **EPIC-008 M1 is now option B on the new host; close-path step 3 is superseded by 3′; step 4 grades M1 by the new rule; § Dependencies points at the ABC-204 re-pin; Q3 (the E band) is routed to the owner.**

Records only. Branch `grugops/bapm-epic008-hostB` in `../wt-bapm-epic008-hostB`, cut from `main` `54bcf923`. One commit,
**`485ef22b`**, not merged and not pushed. No npm, vitest, build or timing. No `src/`, `tools/`, ABC-204 or board edits.
Scratch: `<scratchpad>/notes.mjs` (the note bodies and the seal script).

Notes are in `.grugops/context/bapm-epic008-hostB/notes/`. They were sealed with grugops 2.2.0 `context-io.js`
`admitAndAppend` (context root: the worktree's `.grugops/context`; `at` 2026-10-28T21:14:52Z from `date -u`), and
`readContext` read back 2 of 2:
- `20261028T211452Z-ba-pm-decision-f0c8fedb`: what was placed, the E-band reading, and Q3;
- `20261028T211452Z-ba-pm-observation-aa85c1a2`: the re-reads at `54bcf923`. `git diff b5c67ab7 54bcf923 -- src data`
  is empty. `3497aad2` is a commit and differs from `b5c67ab7` in 17 `src`/`data` files. The A4 and § Reading quotes,
  and the arithmetic.

| item | placed (EPIC-008, dated 2026-10-28; old lines kept and superseded by date) |
|---|---|
| M1 row | A dated pointer: both R readings are on the new host, and the start is `3497aad2` |
| M1 block (§ Success measures) | **Option B.** R(baseline) is read at `3497aad2`, and R(close) at one `main` sha whose `src/`/`data/` equal `b5c67ab7`'s. Both use ABC-204 A4's protocol, E = 1 910 frozen, 200 games, ALONE, one run each, and every "Frozen for EPIC-008" pin; the host tools are re-pinned. **M1 = R(close) − R(baseline), half-width √(Y₁² + Y₂²).** +100 and "above 0" (Q1) unchanged. 2 061.3 ± 50.3 stands as the previous host's record and is **no longer the comparison**. The earlier "baseline stands" lines now read "stood, on the previous host". The 2026-10-27 "+71" forecast is superseded |
| E band | No E step. Each score is reported against 25–75 %. **What it does to the grade:** the page does not make an off-band reading UNRESOLVED (no state names the band), and the reading meets M1's "E, openings, pins unchanged". So BA/PM reads it as an M1 input, graded by the two clauses, unchanged. Its cost is a wider Y (ABC-204: 70.5 % read ± 50.3, 82.0 % read ± 61.8). At Y₁ = Y₂ = 61.8 the half-width is about 87.4, against 71.1 at 50.3 (arithmetic), so "above 0" gets harder. +100 does not move |
| Q3 (owner, new) | **UNKNOWN - verify, routed:** (a) is an off-band reading still an M1 input? A4's band was the baseline's validity bar, tied to the E step he has now frozen out. (b) How is a degenerate reading recorded (a score near 0 %/100 %, with X or Y not finite, so M1 cannot be computed)? The page is silent on both, and no rule or default is written. Nothing waits on Q3. It is asked at step 4 only if a reading lands off the band |
| close path | Old step 3 is marked superseded, and **3′** is added. PREREG first, then reading 1 `3497aad2`, then reading 2 the close sha (src/data = `b5c67ab7`, confirmed before any game). A4 protocol, E frozen with no E step, one run each and final (`…4c3f7639`), UNRESOLVED reported. ALONE with § Host, **about 9 h** at the previous host's A6 rate; this host's rate is UNKNOWN - verify. M3 runs after both readings. **G6 "≥ base" reads against `3497aad2` on this host.** QE reports the M1 inputs and does not grade. **Step 4's M1 bullet** grades by the new rule, and the old bullet is kept, marked superseded |
| § Dependencies | A dated line. The host moved, and the tools come from the environment (`ADR-0049` d4). **Re-pinned on this host per ABC-204 § Dependencies 2026-10-28 (`se-tools-rating-host`)**, the pins A1 and both M1 readings check. No hashes are copied. The old paths and hashes are the previous host's history |

Files on the branch: `plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md`
(+84/−5) and 2 notes. In main's checkout, only this queue record and its claim moved. They are uncommitted, for the
Orchestrator.

Flags (LOW, not edited, outside the brief):
- EPIC-008 § Out of scope ("runs only on the owner's Mac") and Q2 ("your Mac") are stale after the move.
- EPIC-008 § Host says "Every reading runs on AC power", while `qe-epic008-close` says "log the power source; never
  stop a reading because of it". The page rule was not changed here. The Orchestrator should reconcile the two before
  the QE spawn.
- The merge order with `se-tools-rating-host` does not matter: this page points at ABC-204 § Dependencies 2026-10-28
  and copies nothing from it.

### Board card lines (for the Orchestrator; no column moves)

- **EPIC-008**, appended to its card: `2026-10-28 (bapm-epic008-hostB, …f0c8fedb): M1 → option B on the new host (owner …5dbd717b): R(baseline) @ 3497aad2 and R(close) @ main sha with src/data = b5c67ab7, both ABC-204 A4 protocol, E 1 910 frozen (no E step), 200 games each, ALONE, one run each, PREREG first (~9 h). M1 = R(close) − R(baseline), ± √(Y1² + Y2²); +100 AND interval > 0 unchanged; 2 061.3 ± 50.3 = previous host's record, no longer the comparison. Off-band score reported, graded by the same two clauses (wider Y); Q3 to the owner (off-band as M1 input; degenerate reading) — UNKNOWN - verify, nothing waits on it. Close path step 3 → 3′ (G6 "≥ base" vs 3497aad2 on this host); step 4 grades by the new rule. § Dependencies → ABC-204 § Dependencies 2026-10-28 (se-tools-rating-host).`
- **Close step 3 (`qe-epic008-close`)**, its held line: `bapm-epic008-hostB records on grugops/bapm-epic008-hostB @ 485ef22b; spawn still waits on both merges (se-tools-rating-host + this).`

### Trace row (10 cells, header order)

| EPIC-008 close step 3 prep (bapm-epic008-hostB) | EPIC-008 M1 → option B after the host move: both R readings on this host (3497aad2, then the close sha = b5c67ab7's src/data), A4 protocol, E 1 910 frozen, no E step, 200 games each, ALONE, one run each; M1 = R(close) − R(baseline) ± √(Y1² + Y2²); +100 AND > 0 unchanged; 2 061.3 ± 50.3 kept as previous-host record; close path 3 → 3′, step 4 M1 re-worded; Q3 (E band) to the owner | EPIC-008 | M1 (Q1 unchanged); M3 G6 "≥ base" vs 3497aad2 on this host | none moves; NFR-005 G6 rule unchanged; notes …5dbd717b, …e018297c, …ff16a93d, …f0c8fedb, …aa85c1a2 | `grugops/bapm-epic008-hostB` @ `485ef22b` (records only)<br>plans/epics/EPIC-008-…md | records only: `git diff --stat b5c67ab7 54bcf923 -- src data` empty; no npm/vitest/build/timing | n/a (records) | not released | records written; Q3 open (owner, UNKNOWN - verify); close step 3 (qe-epic008-close) after both merges |
