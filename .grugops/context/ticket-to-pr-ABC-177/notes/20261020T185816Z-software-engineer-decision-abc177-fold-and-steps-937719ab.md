---
id: 20261020T185816Z-software-engineer-decision-abc177-fold-and-steps-937719ab
kind: decision
by: software-engineer
at: 2026-10-20T18:58:16Z
verified_by:
confidence: high (parity, census, diff shape: run and recorded); UNKNOWN - verify (any timing; none taken)
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-177
refs: [ABC-177, ADR-0046, NFR-008, R-174-1, ABC-167, ABC-171, 20261020T180000Z-ba-pm-decision-abc177-cut-step-1000-ruled-for-h-and-l-not-h-prime-e7b3c210]
supersedes:
---

# `ABC-177`: U1 folded; U1–U7 take step 1 000, U8 takes 100. Every changed row keeps its base kill set. Tip `f81bf03c`

Hand-authored and unsealed. `scripts/context-io.js` is absent from this repo and from the kit, and no `propose_note`
tool was available to this hop. No stamp.

## The steps (A2): one line per unit
Each unit was tried first at the coarsest step in its admitted set. Every unit held parity there, so no finer step was
needed.

| unit | rows | step, old → new | coarser admitted steps tried | parity (every row's killed ids, base = tip) |
|---|---|---|---|---|
| U1 | A6 until stop / until ponderhit (+ the fold) | 100 → **1 000** | 1 000 | SAME, both rows |
| U2 | A6-e1 | 100 → **1 000** | 1 000 | SAME |
| U3 | A6-j1 | 100 → **1 000** | 1 000 | SAME |
| U4 | A6-e4 | 100 → **1 000** | 1 000 | SAME |
| U5 | A6-e5 | 100 → **1 000** | 1 000 | SAME |
| U6 | A7-i5, A7-i6 (one loop) | 100 → **1 000** | 1 000 | SAME, both rows |
| U7 | the six dropped-token rows (one loop) | 100 → **1 000** | 1 000 | SAME, all six rows |
| U8 | ABC-171 A7 "two sessions" (`levelOneMoves`) | 10 → **100** | 100 (1 000 not admitted: ruling condition 2) | SAME |

**Ruling condition 2, by arithmetic as the ruling defines it** (⌈budget ÷ step⌉):
- U1–U7: the governing search is the level-5 capped ceiling, 3 000 ms. That is 30 intervals at 100 and 3 at 1 000.
- A6-e1's `go movetime 100` is 1 interval at 100 and stays 1.
- U8 never took 1 000.

## The fold (A1)
- Each U1 row calls `talk` once, on `["position startpos", "go infinite", R, R]`, and asserts:
  - (a) `perLine[0]` and `perLine[1]` hold no `bestmove`;
  - (b) `perLine[2]` holds exactly one `bestmove`, and it is that line's last;
  - (c) `perLine[3]` is `[]`.
- The `it` title template is byte-identical.
- One comment line cites `ABC-177` and `ADR-0046 D2a`.
- Armed reds at the tip, each watched once and then reverted:
  - H1 (a `bestmove` written on `go infinite`) reds both rows on (a), line 269;
  - H2 (a second release writes) reds both rows on (c), line 275.

## The mutant list (A6), frozen before any head run
- **Frozen** at 2026-10-20T18:43:15Z by `probe/freeze.mjs`, against the base tree's source only. The file is
  `probe/frozen-mutants.json`.
- **Contents:** 150 listed, 145 of which apply at base.
- **"M01–M11" is ambiguous**: both ABC-167 (`uci-session.ts`) and ABC-174 (`levels.ts`) have one. So the list takes
  the superset:
  - ABC-167 M01–M51, at the anchors `qe-ABC-171/probe/mutants3.mjs` updated;
  - ABC-171 N01–N21 and N11b, and S01–S48 with S10b, S12b and S31 (with its companion);
  - ABC-174 M01–M22;
  - H1 and H2. Their text is the same as 167-M16 and 167-M13.
  - Successors were written before any run: 167-M45a and 167-M45b, for M45's two-match pattern. 167-M07's successor
    is 171-S18, which is already listed.
- **Not applicable at base** (pattern absent): 167-M07, 167-M45, 171-N11, 171-S42, 171-S42b.
