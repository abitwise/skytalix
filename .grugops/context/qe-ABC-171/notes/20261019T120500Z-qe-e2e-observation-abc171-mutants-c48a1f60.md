---
id: 20261019T120500Z-qe-e2e-observation-abc171-mutants-c48a1f60
kind: observation
by: qe-e2e
task: qe-ABC-171
at: 2026-10-19T12:05:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - ABC-167
  - ADR-0044
  - R-167-1
  - 20261018T211100Z-qe-e2e-observation-abc167-mutants-92d6d4e6
  - .grugops/context/qe-ABC-171/probe/mutants3.mjs
  - .grugops/context/qe-ABC-171/probe/mutants3-file-part1.log
  - .grugops/context/qe-ABC-171/probe/mutants3-file-part2.log
  - .grugops/context/qe-ABC-171/probe/mutants3-file-n11b.log
  - .grugops/context/qe-ABC-171/probe/mutants3-file-s.log
supersedes:
---

# ABC-171 mutants at `9ae31679`: 94 run, 73 killed, 21 survived

Hand-authored and unsealed. The harness `probe/mutants3.mjs` is `qe2-ABC-167`'s harness, with the same rules:
- each mutant is one exact-string replacement in `src/uci-session.ts`, asserted to match exactly once;
- the tests are `src/uci-session.test.ts` at `--testTimeout=120000`, so a kill is an assertion failure, never a
  timeout;
- the A11 mutants also run `tsc` and `biome`.

They ran on two scratchpad copies whose `src/` was `diff -r`-identical to the tip. Each copy was checked restored
afterwards.

## ABC-167 regressions: 44 run, 37 killed, 7 survived, all as ruled before
- **These are the `qe2-ABC-167` patterns.** One anchor moved, the options destructuring. N11's `isready` anchor now
  holds `warm()`, so it was re-anchored as N11b. The original N11 line is in the log as `BAD-PATTERN`, not
  counted.
- **The brief's 17 are still killed:** M02–M06, M11, M12, M15, M23, M29, M43, M44, M47–M51.
- **N01–N05, N10, N11b, N12, N16–N21 are killed.**
- **The six fix-hop survivors from `qe2-ABC-167` are now killed:** N06 and N14 by A7-i1, N07 by A7-i2, N13 by A7-i5
  and A7-i6, N15 by A7-i3, and N09 by A6-j1. So QE-167-i and QE-167-j stay closed on this tip.
- **The survivors are unchanged:**
  - M09 and M10 are ruled equivalent.
  - M38 and M41: `biome` exits 1, so lint catches them.
  - M40 and M42 are bracket access (R-167-1, accepted at Security/NFR).
  - N08 is equivalent.
- **So the ABC-167 rows still kill their mutants.** The helper change (choice 1) weakened none of them.

## ABC-171, S-series: 50 run, 36 killed, 14 survived
| area | killed | survived |
|---|---|---|
| setoption parsing and case | S01 name not lower-cased, S04 name runs to the end | S02 value lower-cased (choice 2), S03 value = first token only (choice 3) |
| Skill Level bounds | S05 `in`, S06 `!== undefined` (both by `constructor`), S08 accepts `0`, S09 accepts `6`, S10/S10b floor `2.5`, S11 invalid resets to 3, S14 two lines | S07 `Number.isInteger` + range instead of `Object.hasOwn`: it accepts `01`, `1.0`, `0x1`, which the tip refuses (P5). Same on every canonical input |
| keep the old value | S12b invalid → `true`, S13 silent, S15 unknown name speaks, S16 inverted | **S12 invalid `OwnBook` → `false`**: the only row keeps `false`, so forcing `false` is invisible |
| `min(G, level)` | S17 level only, S18 G only, S19 max, S20 `min(ceiling, level)`, S41 blunder path gets G | — |
| warm once at `isready` / `go` | S21 no warm at `isready`, S23 warm at `uci` | S45 `warmed` reset on `ucinewgame`, S29 an extra `openingName` per `go`, S47 warm on the held position: **equivalent** (the probe's own memo holds `read` at 1). S46 warm via `bookMove`: `read` is the same, but D10's "calls neither `legalMoves` nor `random`" is not observable from the session |
| book off → 0 `read`s | S22 warm ignores `OwnBook`, S24 probe while off | — |
| book hit | S26 ignores `infinite` (A10), S27 also searches, S48 probes the start, not the held position | **S25: the book only at rate-0 levels.** At level 1 or 2 a book position is then searched. D10 says the book wins "whatever the go limits or the level are", and no row has a book hit at a blunder level |
| failing book | S28 a miss with `OwnBook` on → `0000` (52 rows) | — (S29 above). The session cannot change the probe's warn count: A9 tests the real probe's contract, as test note 1 intends |
| per-`go` seeds | S30 draw at every level, S34 no draw, S35 two draws, S36 `ucinewgame` draws | **S32 seed constant (the draw kept), S33 `* 2 ** 16`**: A7 compares two sessions with each other, never with D11's derivation. **S31 a seed drawn on a book hit at level 1**: no row (A8's wording, see QE-171-b) |
| options lines and defaults | S42 option order, S43 default 5, S44 `OwnBook` default off | — |
| dropped-limit line | S37 always written, S40 score on the level line | **S38 only `depth` is named, S39 one line per limit**: only `go depth 3` is pinned. The tip names `nodes` and `mate` too and writes one line for all (P4) |

## Equivalent or not observable (4 of the 14)
S29, S45 and S47 are equivalent. S46 cannot be observed from the session.
