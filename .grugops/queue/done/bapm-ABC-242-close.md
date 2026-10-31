---
subtask: bapm-ABC-242-close
role: ba-pm
ticket: ABC-242, ABC-225, EPIC-010
ref: .grugops/context/bapm-ABC-242-close/
branch: new grugops/bapm-ABC-242-close from main (worktree .claude/worktrees/bapm-ABC-242-close)
width: records only; no vitest, no timing.
---
# BA/PM (records): close ABC-242; fold ABC-225 merge; restate the EPIC-010 milestone-1 total
## Read
qe-ABC-242's and se-ABC-242's notes and done/ briefs on main; qe-ABC-225-w1's decision note (…d0807789) and se-ABC-225-main's notes;
bapm-ABC-222-epic009-m1's observation …e84baed7 (the ~18.5 h width-1 pair restatement); the owner notes …65848126 and …f4673b9f
(under .grugops/context/orch-2026-10-30a/).
## Do
1. **ABC-242** page: mark it Done, merged af5b2b49, QE PASS_WITH_GAPS signs UAT. Fold SE-242-a (the probe moved at the ABC-228 merge, e42b637b, per QE), SE-242-b, QE-242-b (LOW: a cap lowered to 8 or 50 survives the lane; cut a small test ticket if you judge it worth it, else record the disposition) and QE-242-c (INFO).
   - QE-242-a is with the Architect (`arch-qe242a-ruling`). Note it as pending; do not rule it.
2. **ABC-225** page: it still says in-development; it is merged and Done. Record the dispositions of QE-225w1-a/c/d/e.
3. **EPIC-010:** restate milestone 1's total (≈ 15 h, stale) to the width-1 figure, ~18.5 h (17.5–19.4 h) plus ~1 h of QE, citing the owner's "one at a time".
## Fences
Records only: plans/tickets/, plans/epics/. No board edits (the Orchestrator's), no ADRs, no src/, tools/ or data/. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-ABC-242-close`, contextRoot = worktree), commit, `## Result` + trace row(s) here, brief + claim to done/.

## Result

*BA/PM, 2026-10-31, task `bapm-ABC-242-close`; records only, branched from `main` `d58f2d77`. Records and sealed notes at `f2245757`; this brief move is on top. Nothing was run, built, timed or played (an SE shares the host). Not pushed, not merged.*

- **`ABC-242`: Done.** Front matter `done`/`Done` with a `closed:` line; a CLOSED block: merged `af5b2b49`, QE PASS_WITH_GAPS (`qe-ABC-242` `…f24601b8`) **signs UAT**; A1–A7 MET, A8 confirmed; `G8` H 9.41 s (B 9.21 s), tranche 2 not fired; A1's `UNKNOWN - verify` entries recorded as read (not pinned).
  - **SE-242-a** answered: base `d8e8` −1013 at `24f3e322`, −1020 from the `ABC-228` merge `e42b637b` on. Dated pointers on the page's −1013 lines; `ADR-0054`'s −1013 is the Architect's text, not edited.
  - **SE-242-b** (LOW): recorded, no ticket; the value line notes the change bites the loser's repeat, and a winner's only where the loser's replies are not repeats.
  - **QE-242-b** (LOW): **cut as `ABC-245`**. Q18 INFO.
  - **QE-242-c** (INFO): recorded, no ticket (ladder pair scores `UNKNOWN - verify` from QE's hop; the SE's run printed them).
  - **QE-242-a** (MEDIUM): **pending with the Architect** (`arch-qe242a-ruling`); not ruled here.
  - SE-242-c/-d/-e INFO; SE-242-f folded into `ABC-245`.
- **`ABC-245` cut: XS, P3, test-only, `EPIC-010`, Backlog, DoR 9/10.** One `src/levels.test.ts` row where a third occurrence's two earlier occurrences both lie > 50 plies back: scores exactly 0 with legal − 1 child searches; red under Q6 (cap 8) and Q8 (cap 50), green at 100; ≠ 0 on base; plus the stale header count (SE-242-f). Row 10 waits on the QE-242-a ruling (the row's step). In no milestone.
- **`ABC-225`: Done** (merged `59dc3ab4`, 2026-10-30). Front matter, CLOSED block, a disposition table, and a Done line (old verdict kept as "Was").
  - **QE-225w1-a** (LOW): no ticket; a known misleading field (`rpair`'s `budget` not read on `r`; `pair-check` pins the literal). Fold rule: the next ticket that moves the R budget names one constant or drops the field.
  - **QE-225w1-c** (INFO): no ticket; QE-225-c stands.
  - **QE-225w1-d** (INFO): no ticket; the batch reports the per-block nps spread.
  - **QE-225w1-e** (INFO): no ticket; residual, exercised by the first real fault.
  - QE-225w1-b already done (`bapm-ABC-222-epic009-m1`); QE-225-d carried.
- **`EPIC-010`:** a FOLDED header block. **Milestone 1's total restated at width 1:** all nine tickets are Done, so what remains is the batch alone, **≈ 18.5 h ALONE (17.5–19.4 h) plus ≈ 1 h of QE (≈ 19.5 h)**; spent plus remaining ≈ 26 h, ≈ 23 h ALONE (estimate). The "≈ 15 h, ≈ 12 h ALONE" total is struck as stale. Width 1 cites the owner's "ABC-225 - approve to run one at a time" (`…65848126`) and the Orchestrator's 2026-10-30 ruling extending it to the batch. Also: § Cost on this host's batch line, `RISK-EPIC010-04`, the `ABC-242` footnote, tickets rows 3 and 10 (Done), row 21 (`ABC-245`), a fold line.
- **Notes (sealed, task `bapm-ABC-242-close`):** decision `20261031T052215Z-ba-pm-decision-c52ff0ff`, observation `20261031T052215Z-ba-pm-observation-29736827`; read back 2 through `readContext`.
- **For the Orchestrator:** `ABC-245` needs a board row (Backlog). `ADR-0054`'s −1013 is now −1020 since `e42b637b` (Architect's, if wanted).
- **Checks:** `git diff --check` clean; host-path / login / e-mail scan of added lines 0 hits.
- **Not touched:** `src/`, `tools/`, `data/`, the board, the ADRs, the trace files.

### Trace rows (10 cells, header order)

| ABC-242 | On a blunder (levels 1–4) a root move that makes the third occurrence scores exactly 0, its child unsearched; engine path unchanged | EPIC-010 | ADR-0054 § amendment 2026-10-30 (accepted); ADR-0032 d1 bullet; ADR-0046 § Addendum R1–R4 | NFR-008 G8 H 9.41 s (B 9.21 s), tranche 2 not fired; NFR-004 ≤ 49 comparisons; condition-2 ruling pending (QE-242-a, arch-qe242a-ruling) | merged af5b2b49 (code 6884d61a): src/levels.ts, src/levels.test.ts, src/cli.test.ts, src/uci-session.test.ts | npm test 2 333 ×3, skips 0; plants 20/20; ENGINE_DEEP 53/53; LADDER_DEEP short 18/18 | QE PASS_WITH_GAPS f24601b8 signs UAT | — (local only) | Done (bapm-ABC-242-close) |
| ABC-225 | One command reads an interleaved R pair (rpair) with the opening-paired error and a host log | EPIC-010 | — (tools/ only) | NFR-008 0 lane files; heat at --concurrency 1: Tctl median 74.1 °C, max 78.8 °C; A6 400-game pair ≈ 18.5 h at width 1 | merged 59dc3ab4: tools/rating/rating.ts, pair.ts, pair-check.ts | pair-check 22/22; real 40-game rpair A5/A6 MET | no UAT (tools/ only) | — (local only) | Done (folded bapm-ABC-242-close; QE-225w1-a/c/d/e dispositioned) |
| ABC-245 | A blunder row reads a third occurrence > 50 plies back, so a lowered 100-key cap turns red; levels.test.ts header count | EPIC-010 | ADR-0054 § amendment (PRIOR_KEYS_WINDOW); ADR-0046 § Addendum R1–R4 | NFR-008 ≤ 10 s, 0 real-clock rows, step per the QE-242-a ruling | — (src/levels.test.ts planned) | — | none owed (test-only) | — | Backlog 9/10 (cut bapm-ABC-242-close, from QE-242-b, SE-242-f) |
