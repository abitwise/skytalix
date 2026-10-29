---
subtask: bapm-owner-words-b
role: ba-pm
ref: .grugops/context/bapm-owner-words-b/
branch: new grugops/bapm-owner-words-b from main, worktree ../wt-bapm-owner-words-b
---

# Fold the owner's EPIC-010 answers and ADR-0052 into the pages (records only)

## Read
- The owner's words: `orch-2026-10-29g/…278e149b` (they govern), including the Orchestrator's caveat on 10-game smokes.
- Your EPIC-010 notes (`bapm-epic010-improvements/…12cb550d`, `…5ada23af`, `…3461cdd9`, `…d8064488`).
- ADR-0052 (PROPOSED) and Architect `arch-epic009-settings/…fa9e821e`, `…04fdc439`, `…3b11f12e`.
- SA `sa-ABC-226/…cc53fc79`.

## Do
- **EPIC-010:**
  - Q4 = (e) extended: per value-changing ticket, a 10-game D smoke plus a 10-game R smoke (Stockfish, E = 1 910,
    3 000 ms), then batched major validation later. Write the merge rule exactly. State the caveat: 10 games catch
    crashes, time losses and collapses, not a loss of tens of Elo. Define how a trend across tickets plus the batched
    validation answers "did things get worse". Re-cost per ticket on this host, then re-cost milestone 1.
  - Q2 and Q5 answered and dated. The product goal ≥ 2 700 Elo is aspirational, with no ticket bound to it; name its
    scale as UNKNOWN - verify. A Rust rewrite is out of scope.
  - Q1 and Q3 stay open, with their defaults.
  - Re-check ABC-225's purpose (an interleaved R-pair command) under (e). Retire or re-scope it with a dated line;
    don't renumber.
  - Move the tickets whose only wait was Q4 to their next real wait. Re-score the DoR.
- **EPIC-004:** a dated amendment line. The "strength above ~1700" non-goal is removed on the owner's word, and the
  new product goal is stated (best vibe-engineered / TypeScript chess engine, ≥ 2 700 Elo aspirational, scale
  UNKNOWN - verify). Don't edit other non-goals: tablebases stay until Q1.
- **EPIC-009 / ABC-220..223:** reconcile to ADR-0052 as PROPOSED.
  - The `TimeMode` combo and the cutechess option lines.
  - simple-tournament budget `min(T, C)`, T = 22 000.
  - The uci-clock-mode rule and the 59.5 s budget.
  - The latency rows the ADR owes.
  - Their wait becomes "owner accepts ADR-0052 (OQ-0052-1)".
  - ABC-222/223 smoke size: keep 5 games, or align with the owner's 10? Owner's EPIC-009 word: "5 or 10". Pick one
    and say why.
- List the board lines you want in your decision note.

## Fences
- Records only: `plans/epics/EPIC-004…`, `EPIC-009…`, `EPIC-010…`, `plans/tickets/ABC-218..239`, your context. No
  ADR, `src/`, `tools/` or board edits. Never push, force, amend or rebase. Never merge into main. No host paths.

## Publish
- Seal notes (task `bapm-owner-words-b`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a
  10-cell trace row into this brief, then move it and its claim.md to done/.

## Result

**Done 2026-10-29 by BA/PM.** Branch `grugops/bapm-owner-words-b` @ **`7ca6f597`**, one commit on `main` `4dcb353e`
(merges clean with `ff416a56`), records only, not merged and not pushed. 22 pages plus the context: `EPIC-004`,
`EPIC-009`, `EPIC-010`, `ABC-220`..`223`, `ABC-225`, `ABC-228`..`239`. Five notes were sealed with grugops 2.2.0
`context-io.js` `admitAndAppend`, called directly, because this session has no `propose_note` tool (the QE `seal.mjs`
precedent). Read back 5/5.
- `20261029T204500Z-ba-pm-decision-2930f1bd`: EPIC-010 accepted, the merge rule, the caveat, the trend and batch,
  the re-cost, and ABC-225's fate;
- `20261029T204500Z-ba-pm-decision-09886d19`: EPIC-009 and ABC-220..223 reconciled to ADR-0052, and the smoke size;
- `20261029T204500Z-ba-pm-decision-e85add56`: ticket columns, DoR and the board lines;
- `20261029T204500Z-ba-pm-observation-266e4339`: LOW items;
- `20261029T204538Z-ba-pm-observation-bf6ddb5a`: ABC-227 Done and ABC-235 In Design, moved during this hop.

**EPIC-010** (accepted, Q5; `proposed` → `backlog`; no Elo target).
- **Q4 = (e), extended, as a merge rule.** Per value-changing ticket, on the candidate head rebased on main, ALONE,
  today's harness: D `d <cand> <base> --budget-ms 1500 --rounds 5` and R `r <cand> --elo 1910 --rounds 5`. It
  merges only if S-1 (0 candidate faults in 20), S-2 (0 losses on time), S-3 (D ≥ 3.0/10) and S-4 (R ≥ 3.0/10) all
  hold. Below 3.0: 10 more games, ≥ 7.0/20 passes.
- **Caveat stated:** 10 games catch a crash, a time loss or a collapse (≈ 250 Elo at R), never tens of Elo.
- **"Did things get worse":**
  - the trend: pooled R smokes since the last batch; ≥ 30 games at ≤ reference − 20 points pulls the batch forward;
  - the batch: an interleaved R pair (200 + 200) at each milestone close, not LOSS; it sees > ≈ 70–75 Elo.
- **Re-cost:** ≈ 1.2 h per ticket; milestone 1 ≈ 15 h (≈ 12 h ALONE) against ≈ 60–80 h under (b).
- **Q2:** EPIC-004's ~1700 non-goal removed (dated). The goal is ≥ 2 700 Elo, aspirational, scale UNKNOWN - verify.
  A Rust rewrite is out of scope.
- **Q1, Q3:** open, defaults kept.
- **ABC-225:** re-scoped as the batch's instrument, **Ready** 10/10.
- **Other tickets:** Q4 dropped from every wait. DoR +1 on the value-changing tickets, which still wait on their ADRs.

**EPIC-009 and ABC-220..223** reconciled to ADR-0052 (PROPOSED):
- the `TimeMode` combo and the cutechess lines;
- `min(T, C)` with T = 22 000;
- the clock mode at `min(59 500, C)`, with the clamp moving to 60 000 only at ABC-221;
- latency rows A13 and A14, and an accepted-risk entry.

Their waits now read "owner accepts ADR-0052 (OQ-0052-1)". **Smoke size: 5 games are kept**, extended up to 10 only
to reach 4 completed side-periods.

**Not touched:** `src/`, `data/`, `tools/`, the ADRs, `plans/board.md`, `plans/traceability.md`. No game, test or
probe ran.

**For the Orchestrator:**
- Merge `7ca6f597`.
- Place the board lines from `…e85add56`: Ready +1 for ABC-225 (1/8), and the waits rewritten.
- Append the trace row below.
- Put OQ-0052-1 to the owner.
- Explain Q1 and Q3 in session.

### Trace row (10 cells, header order)

| EPIC-010 Q2/Q4/Q5 + ADR-0052 fold (bapm-owner-words-b) | Owner …278e149b folded: EPIC-010 accepted (no Elo target); Q4 = (e) extended as a merge rule (10 D + 10 R smoke, S-1..S-4; trend flag; batched interleaved R pair per milestone); milestone 1 re-costed ≈ 15 h; ABC-225 re-scoped (batch instrument, Ready); Q4 dropped from all waits, DoR re-scored; EPIC-004 ~1700 non-goal removed, goal ≥ 2 700 aspirational (scale UNKNOWN - verify); EPIC-009/ABC-220..223 reconciled to ADR-0052 PROPOSED (TimeMode, min(T, C), 59.5 s, clamp at ABC-221, latency rows); smokes 5 games (≤ 10 for coverage) | EPIC-010, EPIC-009, EPIC-004 | — | NFR-004 (text proposed, ADR-0052), NFR-009, NFR-011 (accepted-risk entry owed), NFR-008; ADR-0052 (PROPOSED), ADR-0044 D3/D4/D5/D11 and ADR-0045 A3 folds owed at merge; RISK-EPIC010-01/04 restated, RISK-EPIC010-07 new; notes …2930f1bd, …09886d19, …e85add56, …266e4339, …bf6ddb5a | grugops/bapm-owner-words-b @ 7ca6f597 (records only)<br>plans/epics/EPIC-004, EPIC-009, EPIC-010; plans/tickets/ABC-220..223, 225, 228..239 | — (records only) | n/a (records) | not released | EPIC-010: Backlog (accepted); ABC-225 Backlog → Ready; ABC-228..234, 236..239 Backlog (ADR waits); EPIC-009 tickets Backlog (OQ-0052-1); card moves the Orchestrator's |
