---
id: 20261017T112000Z-qe-e2e-decision-abc024-verdict-pass-with-gaps-e84b25c9
kind: decision
by: qe-e2e
task: qe-ABC-024
at: 2026-10-17T11:20:00Z
verified_by:
confidence: high
refs:
  - ABC-024
  - plans/tickets/ABC-024-castling-default-lane-blind-spots.md
  - QE-024-a
  - QE-024-b
  - QE-024-c
  - QE-024-d
  - 20261017T111000Z-qe-e2e-observation-abc024-mutants-and-criteria-6b1e4d27
  - 20261017T111500Z-qe-e2e-observation-abc024-break-attempts-9c3a7f12
  - 20261017T110000Z-software-engineer-observation-remeasure-31f8734a
  - 20261017T110100Z-software-engineer-decision-row-shape-5d19189d
supersedes:
---

# QE `ABC-024` on `grugops/ABC-024-castling-default-lane` (tip `290a9f86`, code `a18da7f5`, base `b84dc637`): **PASS_WITH_GAPS**

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). No timing was read. My mutant
readings were taken on my own instrument before I opened `probe/harness.mjs`. They equal the SE's on all 62 base/head counts.

| item | ruling | basis (`…6b1e4d27`) |
|---|---|---|
| `A1` | **MET** | 10 rows, one per square, enemy knights on b1 and b8. The setup is asserted first, then the survivor by name, then the exact count. Each drop fails its own A1 row and no other A1 row, `PERFT_DEEP` unset. Strict `parseFen` accepts all 10 FENs |
| `A2` | **MET** | 4 rows, both colours × {clocks `5 9`, ep `c6`/`c3` `0 12`}: 0 castles, 24. One control per class: 2 castles, 26. R-half fails 2 A2 rows, R-ep 2, R-full 4 |
| `A3` | **MET** | 14/14 test-file discriminators red. A production corridor widened (black, f7) turns the corridor quantifier red |
| `A4` | **MET** | md5 `6335b452…` at base and tip. `-U0`: 0 removed lines, 1 file under `src/`. 58/1792 → 58/1810 (+18), skip 0, `No findings.`, deep perft 32/32 |
| `A5` | **MET** | all 7 named mutants die on an A1/A2 row (5 survived base, 2 held base by one incidental row each). 15/15 controls survive at base, 15/15 with the rows: **0 kills added** |
| Control-list check | **faithful, 15/15** | below |
| Security threshold | **not fired** | +280 < +525, one file. Read anyway: no import, spawn, net, env or fs; loops bounded |
| Gates at `290a9f86` | **green** | lint 0, typecheck 0, build 0, `npm test` 58 / 1810, success `true`, skip 0 |
| UAT-waiver reading | **applies** | `b84dc637...290a9f86` production-`src/` grep empty. Waived, not signed |
| Merge | **clean** | `git merge-tree --write-tree main 290a9f86` exit 0 |

**Control-list check.** `ABC-023` A5 lists fifteen items in prose. `probe/harness.mjs` `EQ01`–`EQ15` map onto them 1:1
in order:
- 1–6: an enemy KING/QUEEN/ROOK admitted beside the own byte, on the king's square, then on the rook's square.
- 7–9: colour-blind (`pieceType`) on the king's square, the rook's, and both.
- 10–11: the king guard's `continue` → `break` / `return`.
- 12–14: both guards below the emptiness test, below the through-check test, and above the right test.
- 15: an extra rook-square non-`EMPTY` line.

My own encodings, written blind, are the same edits. Both runs give the same 15/15 survival on both trees.
`ABC-009`'s record (`ticket-to-pr-ABC-009/…-34f21e73`) holds items 7–15 as a measured prose table. Items 1–6 are
reasoned in `…-02259098`. So no committed source exists to diff against byte for byte (`QE-024-b`).

**Gap register.** No criterion is unmet, and none of these blocks.
- **`QE-024-a` MEDIUM, routed to BA/PM to cut; outside this scope.** The right-**mask** mutant
  (`(castling & option.right) === 0` → `castling === 0`) survives the whole default lane at base (1792/1792) and at
  head (1810/1810). It offers a castle without its own right; on `w kq` white is offered both. The deep lane catches
  it on one assertion only (`position-5 perft(4)`, 31/32). This ticket's own § The judgement rules that such a guard
  is owed a default-lane row. This ticket's A2 is the scalar axis only, so it is not folded in. The delivered code is
  correct. (`…9c3a7f12`)
- **`QE-024-b` LOW, accepted residual.** The fifteen controls exist only as prose upstream. The SE's and QE's
  encodings are now committed (`ticket-to-pr-ABC-024/probe/harness.mjs`, `qe-ABC-024/probe/qe-harness.mjs`) and agree.
  The next hop should diff against those, not re-encode.
- **`QE-024-c` INFO.** Both A2 non-inertness controls are white. The criterion asks one per class, and that is met.
  Black's "right held off `- 0 1` offers both castles" is not pinned.
- **`QE-024-d` INFO.** The mutant readings are on base `b84dc637`. `main` has since taken `ABC-030`'s three
  comment-only `.nfr.test.ts` lines; `src/moves.ts` is unchanged there. Not re-run on the merged tree.

**Next column.** `In Review` exit: QE recommends `Ready for UAT`, then `Done` under the zero-production-lines
waiver. The Orchestrator decides. `QE-024-a` goes to BA/PM as a cut candidate. The ticket's escalation triggers are
not fired: `src/moves.ts` and `src/perft.test.ts` are unchanged.
