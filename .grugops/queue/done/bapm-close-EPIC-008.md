---
subtask: bapm-close-EPIC-008
role: ba-pm
epic: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
ref: .grugops/context/bapm-close-EPIC-008/
branch: new grugops/bapm-close-EPIC-008 from main, worktree ../wt-bapm-close-EPIC-008
width: 1 of 1 — records only (no npm, vitest, build, games or timing)
---

# EPIC-008 close, step 4: grade M1–M4 and write the epic close

## Do
- Read Orchestrator `orch-2026-10-28a/…5dbd717b`, `orch-2026-10-28d/…0c5e9315` (all-games is graded), and `orch-2026-10-29a`. Then read QE `qe-epic008-close`: PREREG `…8fb860a9`, readings `…e8d5c13a` and `…f361ab33`, M3 `…ffb593fe`, decision `…bdbccbbf`. Also read the EPIC-008 page as merged (step 3′, step 4, Q1, Q3).
- **Grade M1 by the page's option-B rule** from QE's figures: R(3497aad2) 2 098.5 ± 54.8, R(close 38536a34) 2 015.6 ± 49.5, M1 = −82.9 ± 73.8. Both clauses: ≥ +100, and interval above 0. **State the interval plainly** (it lies wholly below 0) and what that means. Don't soften it, and don't explain it away.
- **Confounds, recorded as facts and not as excuses:** the order was fixed (baseline first, close second); the readings ran back to back; CPU temperature had a median of 82–83 °C (max 87 °C); throttling is UNKNOWN - verify. Reading 1 was at 74.75 % (0.25 inside the band). The close searched ~1 ply deeper (10.09 against 9.13). The D readings in the epic were GAIN for ABC-208 and S1-met for ABC-206. Say whether these leave the M1 grade as it stands (one run, final, `…4c3f7639`) — they do, unless the page says otherwise.
- **Grade M2, M3, M4** from the page and the merged records (M3 from QE's M3 note: G1 54/58, G5, G6 ≥ base on both boards, G8, G9 all MET).
- **Write the epic close:** a dated close block. Set the front-matter per the closed-epic convention. Give the outcome per measure, the tickets shipped and not shipped, and the open owner questions (Q3 did not come up; list any others still open).
- **Follow-up, as a question for the owner and not a decision:** if you judge M1's negative reading worth an investigation (for example an interleaved re-read, a thermal check, or a D of close vs 3497aad2 on this host), write it as one owner question with its cost in hours. A re-run is the owner's word.
- Put the board card lines and the traceability row(s) in your Result. Don't edit the board or `plans/traceability.md`.

## Fences
- Work only in your worktree. No `src/` or `tools/` edits, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-close-EPIC-008`) with `at` from `date -u`, including a `kind: decision`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-29T06:40Z): **EPIC-008 is closed. `M1` is NOT MET (−82.9 ± 73.8; the interval [−156.7, −9.1] lies wholly below 0). `M2`, `M3` and `M4` are MET. Owner question Q4 asks about a follow-up; nothing waits on it.**

Claimed at 06:33:12Z. This hop is records only, on `grugops/bapm-close-EPIC-008` in `../wt-bapm-close-EPIC-008`, cut from `main` `a1554ab4`. It has one commit, **`fa73d286`**, which is not merged and not pushed. The two notes were sealed with grugops 2.2.0 `context-io.js` `admitAndAppend` (context root: the worktree's) and read back 2/2:
- `20261029T063938Z-ba-pm-observation-e4913d97`: the evidence read;
- `20261029T063938Z-ba-pm-decision-e53131ba`: the grades and Q4.

| M | grade | one line |
|---|---|---|
| M1 | **NOT MET** | 2 015.6 − 2 098.5 = −82.9 ± 73.8. It misses ≥ +100 by 182.9, and the interval is wholly below 0. At face value, the close is weaker than `3497aad2` on this scale |
| M2 | **MET** (`ABC-206` by waiver) | `ABC-208` S1 GAIN +38.4 ± 23.3; `ABC-215` S3 NEUTRAL +15.6 ± 23.8 with X ≥ 0; `ABC-206` S2 D waived and never read (`…cb10c36c`), stated as such |
| M3 | **MET** | On `38536a34`, which equals `main` at close (`src`/`data`/`tools` diff empty): `G1` 54/58, `G5`, `G6` 8 ≥ 7 and 10 ≥ 8, `G8` 8.32 s, `G9` |
| M4 | **MET** | 0 NFR bounds moved by this epic (`NFR-004`'s per-level ceiling is `ABC-212`/`EPIC-004`). Every ADR reached the owner and was accepted on his word or not taken |

- **Confounds, recorded on the page as facts:**
  - the order was fixed and the readings ran back to back;
  - heat was 83/87 °C in the baseline and 82/84 °C in the close, and throttling is `UNKNOWN - verify`;
  - reading 1 scored 74.75 %;
  - the close searched 10.09 against 9.13;
  - D and R disagree in sign (`RISK-EPIC008-03`).

  None is an UNRESOLVED cause. Each reading ran once and is final (`…4c3f7639`), so **the grade stands**. Q3 did not arise.
- **A correction to this brief:** it says `ABC-206`'s D was "S1-met". The records say S2, with the D waived and no reading taken (`…cb10c36c`). The page follows the records.
- **The page:**
  - front-matter `status: done`, `column: Done`, and a `closed:` line;
  - a dated close block at the top: grades, plain reading, confounds, shipped and not shipped, open items;
  - dated lines on `M1` and close-path step 4;
  - Q3 marked "did not arise";
  - Q4 added.
- **Front-matter synced** to `done`/`Done` on `ABC-204`, `ABC-206`, `ABC-215` and `ABC-217`. This is close-path step 4, and the board's LOW item from `orch-2026-10-27m`. Nothing else on those pages changed.
- **Not touched:** `src/`, `tools/`, `plans/board.md` and `plans/traceability.md`. No npm, vitest, build, game or timing ran.

**Owner question Q4** (on the page): is `M1`'s negative reading investigated, and does a re-read count or is it information only?
- (a) None: 0 h. This is the default.
- (b) An interleaved R re-read of both shas with a throttle log: ~9 h ALONE + ~1 h QE.
- (c) A D reading of the close against `3497aad2` at 1 500 ms: ~6 h + ~1 h.
- (d) A thermal check only: ~0.5 h.

BA/PM leans to (b), as information only, with (d) folded in. A re-run is the owner's word.

**For the Orchestrator:**
- Merge `fa73d286`.
- Move the EPIC-008 card Backlog → Done, using the lines below.
- Append the trace row.
- Report `M1` and Q4 to the owner.
- Open, but holding nothing: the vetoes on the S1 closes (205/207/209/210) and on `ABC-206`'s waiver; and the INFO stale prose (§ Out of scope "owner's Mac"; `ABC-204` "chip, Darwin").

### Board lines (proposed; the Orchestrator places them)

- Header: `_Updated: 2026-10-29 by Orchestrator (…) — bapm-close-EPIC-008 merged (…e53131ba): EPIC-008 CLOSED → Done. M1 NOT MET (R 2 098.5 ± 54.8 → 2 015.6 ± 49.5; −82.9 ± 73.8, interval wholly below 0); M2 MET (ABC-206 by waiver), M3 MET, M4 MET. Q4 to the owner (investigate M1? 0 / ~10 / ~7 / ~0.5 h). LOW cleared: ABC-204/206/215/217 front-matter → Done. Width 0/3._`
- EPIC-008 card: move it from Backlog to Done and append: `**2026-10-29 (bapm-close-EPIC-008, …e53131ba): CLOSED. M1 NOT MET: R(3497aad2) 2 098.5 ± 54.8, R(close 38536a34) 2 015.6 ± 49.5, both on this host; −82.9 ± 73.8, interval [−156.7, −9.1] wholly below 0 (confounds recorded as facts; one run, final). M2 MET (208 GAIN, 215 S3, 206 by waiver, no D); M3 MET (G1 54/58, G5, G6 8≥7/10≥8, G8 8.32 s, G9); M4 MET (0 bounds; ADRs to the owner). Shipped 204, 206, 208, 215, 217; not shipped 205, 207, 209, 210, 211. Q3 did not arise; Q4 (follow-up, the owner's) open. → Done.**`

### Trace row (10 cells, header order)

| EPIC-008 close (bapm-close-EPIC-008) | EPIC-008 closed: M1 NOT MET (R(3497aad2) 2 098.5 ± 54.8, R(close 38536a34) 2 015.6 ± 49.5, both on this host; −82.9 ± 73.8, interval [−156.7, −9.1] wholly below 0; misses ≥ +100 and > 0); M2 MET (ABC-208 S1 GAIN, ABC-215 S3, ABC-206 S2 by waiver with no D); M3 MET; M4 MET. Confounds recorded as facts (fixed order, back to back, 82–87 °C, throttling UNKNOWN - verify, 74.75 %, close +1 ply, D vs R sign); grade stands (…4c3f7639). Q3 did not arise; Q4 to the owner | EPIC-008 | — | NFR-004 G5, NFR-005 G6, NFR-008 G8 MET at close; 0 bounds moved by this epic; RISK-EPIC008-03 named for D vs R; notes …8fb860a9, …e8d5c13a, …f361ab33, …ffb593fe, …bdbccbbf, …0bacc1dd, …e4913d97, …e53131ba | grugops/bapm-close-EPIC-008 @ fa73d286 (records only)<br>plans/epics/EPIC-008-…md (front-matter done/Done + closed:, close block, M1 and step-4 lines, Q3 closed, Q4); ABC-204/206/215/217 front-matter → done/Done | — (records only; QE's readings and M3 gates on 38536a34 = main src/data/tools at a1554ab4) | n/a (records); M3 gates QE-run (…ffb593fe) | not released; main runs locally | EPIC-008: Done (closed, M1 NOT MET); card move the Orchestrator's |
