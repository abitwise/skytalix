---
subtask: qe-ABC-206
role: qe-e2e
ticket: plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md
ref: .grugops/context/qe-ABC-206/
branch: grugops/ABC-206 (0d046948)
width: 1 — ALONE (A4 timing, G6 depth-in-budget, perft rate). Dispatch only on an idle board, AC.
---

# QE gate for ABC-206 (faster search, identical answers)

> **Owner rule 2026-10-24 (`…4c3f7639`): ONE run.** No prior valid reading exists, so run once under the preconditions and write the result; it is final. No repeat on UNRESOLVED/NOT MET (grade it as the page says); the procedure's own defined steps (e.g. a pooled extension) are part of the one run.

## Do
- Own worktree from `grugops/ABC-206`; merge current `main` first (report sha); own `npm ci`.
- Re-run A1 at the tip against the merge base (SE probes are a start) and A2; re-plant the count-guard breakages. Then the timing items exactly as the page states: **A4** median time to depth 8 ≤ 0.85 × base on kiwipete and position-6 (plain node, n ≥ 7, interleaved), **G6** depth-in-budget (≥ 6 and ≥ base), **G1** `PUZZLE_DEEP`, perft as named. Preconditions per timed run: AC, load1 ≤ 8, no foreign vitest.
- Gates at your merge; verdict; UAT (value-identical — say whether the waiver form applies).

## Fences
- Only your worktree and `<scratchpad>/qe206/`. Notes + dated `## QE` addendum on the page. No `src/` edits. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `qe-ABC-206`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**`PASS_WITH_GAPS`.** Branch `grugops/qe-ABC-206` in `../wt-qe-ABC-206` (own `npm ci`, Node v26.11.1, Apple M3).
**Merge `b8a30264`** = `0d046948` + `main` `872b03c1` (no conflict; from `main` it brought ABC-212's line, ADR-0048/0049
and the licence files). **Tip `918f308a`** holds the notes, the redacted `raw/` with `PREREG.txt`, and a dated `## QE
addendum` on the page. Not pushed and not merged. No `src/` edit.
**One run under `…4c3f7639`.** A foreign vitest held the preconditions 13:38:52–13:46:23Z, so `A4` paused, then ran
in a clean window (AC, load1 2.94–3.66, no vitest in 160 one-second samples). No pair was void and nothing was
repeated.

- **A4 (depth 8, plain `node`, n = 7 each, interleaved with alternating order):**
  - kiwipete: median **3 933.4 v 8 985.3 ms = 0.438**;
  - position-6: median **3 027.6 v 7 229.7 ms = 0.419**;
  - **MET** on both. Nodes, score and move are equal across trees in all 28 runs.
- **G6 (3 s, n = 3 each):** depth **7 = base 7** on both positions, at about 2.0–2.1× the nodes. **MET.** The new
  depth is 7 (QE-206-c).
- **G1 (`PUZZLE_DEEP=1`):** **54/58** on base and head, all 58 rows identical in move, depth and nodes.
- **perft:** counts equal base; head **5 049 330/s** (base 5 046 088/s), against ≥ 1 000 000. **MET.**
- **G8:** `npm test` 7.50 s at load1 3.27 (head only, reported).
- **A1:** 7 664 rows byte-identical against the merge base. That is the SE's 317-position corpus, widened to budgets
  3/5/12/50 and depth 4 on the roots. Depths reach 15, with 1 032 mate rows. Plants change 31 and 2 564 rows.
- **A2:** 285 074 positions at depth 3 (the SE's) plus 549 900 at depth 4 (QE's discovered-check, castle,
  promotion and clock FENs). **0 mismatches.**
- **Plants:**
  - the SE's P1–P3 each red their guard;
  - QE's Q3 and Q4 red;
  - Q1 and Q2 (a cost regression inside `legal.ts`) stay green (QE-206-b);
  - Q5 (`givesCheck` misses discovered checks) stays green in the lane, and only `ENGINE_DEEP`, A1 and A2 catch it
    (QE-206-a).
- **Gates:**
  - lint, typecheck and build 0;
  - `npm test` 62 files, 2073/2073, rc 0 (`last-run.json` success, pending 0, todo 0);
  - skips 0, and `test-skip-integrity.js` gives `No findings.`;
  - deep lanes all green: SEARCH_DEEP pvs-lmr 29, search 57, quiescence 37, transposition 40; ENGINE_DEEP
    transposition 26, legal 37, gameend 47, engine 60;
  - exports pinned; G9 holds.
- **A6:** **not read.** Its Given (`ABC-204` Done) is false (`qe-ABC-204` is still pending). Owed, with G11.
- **Findings:**
  - QE-206-a **LOW**: no lane fixture for an unflagged discovered check;
  - QE-206-b **LOW**: the count guards miss calls inside `legal.ts`;
  - QE-206-c **INFO**: position-6 is at 99 % of depth 8 at 3 s;
  - QE-206-d **INFO**: the host conditions. The deep-lane gate pass overlapped a foreign vitest 13:55–13:58Z;
  - QE-206-e **INFO**: stale `src/gameend.ts:17` header line.
- **UAT:** the waiver does **not** apply (5 production files). This verdict signs UAT under `…5aaf7cec` item 2.
- **Owed, not gaps:**
  - A6 and G11 after `ABC-204` Done (the Orchestrator rules whether the merge waits);
  - Security/NFR's dated `NFR-001` note (no hop).
- **Notes** (in `../wt-qe-ABC-206/.grugops/context/qe-ABC-206/notes/`, seals read back): `…737cbca8` (readings),
  `…d18ef919` (identity, plants, gates) and the verdict `…809cd42a`.

**Trace row** (for the Orchestrator):

| ABC-206 (qe-ABC-206) | QE: A1–A5 MET at merge b8a30264; A4 depth 8 plain node n=7 interleaved: kiwipete 3 933 v 8 985 ms (0.438), position-6 3 028 v 7 230 ms (0.419); G6 depth 7 = base 7 both (~2× nodes); G1 54/58 row-identical; A1 7 664 rows byte-identical; A2 0 mismatches (834 974 positions); A6 not read (ABC-204 not Done) | EPIC-008 | faster search, identical answers (leafEndReason/hasLegalMove, legalCaptures, givesCheck; ADR-0003 clause 1 reading OD-206-1) | NFR-001 (perft counts equal, 5 049 330/s; row text note owed to Security/NFR), NFR-004 (clock reads equal), NFR-005 (G6 depth 7, ≥ base), NFR-008 (npm test 7.50 s); QE-206-a/-b LOW, -c/-d/-e INFO | grugops/qe-ABC-206 @ 918f308a (merge b8a30264)<br>src/legal.ts, src/gameend.ts, src/search.ts, src/engine.ts, src/quiescence.ts + legal/gameend/gameend.nfr tests<br>.grugops/context/qe-ABC-206/notes/ (3) + raw/; ABC-206 page ## QE addendum | P1–P3, Q3, Q4 red their rows; Q1/Q2/Q5 lane-green (findings); lint/typecheck/build 0; npm test 62/2073 success; skips 0 No findings.; SEARCH_DEEP/ENGINE_DEEP 8 lanes 333/333 | waiver does NOT apply (5 production files); signs UAT under …5aaf7cec item 2 (PASS_WITH_GAPS, no blocking gap) | A6 + G11 owed after ABC-204 Done (Orchestrator rules if merge waits); NFR-001 dated note (Security/NFR) | In Review → Orchestrator's call |
