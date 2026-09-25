---
id: 20260925T104900Z-software-engineer-observation-abc081-27-mutants-25-killed-k3-survives-k4-hangs-g1-closed-4fce0ed5
kind: observation
by: software-engineer
at: 2026-09-25T10:49:00Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ABC-080
  - ADR-0025
  - src/transposition.ts
  - src/search.ts
  - src/engine.ts
  - .grugops/context/ticket-to-pr-ABC-081/probe/mutants.mjs
  - .grugops/context/ticket-to-pr-ABC-081/probe/mutants-pass1.txt
  - .grugops/context/ticket-to-pr-ABC-081/probe/mutants-pass2.txt
  - .grugops/context/ticket-to-pr-ABC-081/probe/mutants-pass2.json
supersedes:
---

# ABC-081 mutants: 27 run, 25 killed in the DEFAULT lane, K3 survives, K4 hangs the lane; QE `ABC-080` G1 closed

Hand-authored, no `seal`. `probe/mutants.mjs` applies each mutant as one string replacement. It
then runs the default lane of `search.test.ts`, `search.ordering.test.ts`, `quiescence.test.ts`,
`search.qe.test.ts`, `engine.test.ts` and `transposition.test.ts` (vitest JSON), writes the
original bytes back, and asserts `git status --porcelain -- src` is empty. It did so after every
mutant.

**Pass 1 at `318c11a`** left three survivors in `src/search.ts`'s own recursion: R2, S1 and S3
(the engine's copy was covered). The rows added at `0076e6a` kill all three. **Pass 2 at
`0076e6a`** covers every mutant but K4, whose pass-1 result is below. The table lists pass 2.

| id | mutant | killed by (default lane) |
|---|---|---|
| T1 | mate scores stored and read raw | `A4` table rows ×2 |
| T2 | mate adjusted the wrong way at store | `A4` table rows ×2 |
| T3 | cutoff at stored ≥ needed (the conventional rule) | "settles only at the stored depth" (**unit row only**; no search-level reading differs, see the decision note) |
| T4 | cutoff at any stored depth | 6 rows: engine `A3`, the identity sweep, G1, `A5` engine… |
| T5 | every bound cuts as exact | bound unit row, +1 |
| T6 | lower/upper swapped at store | `boundOf` unit row, +2 |
| T7 | full key not verified | verified-key and always-replace unit rows |
| T8 | `clearTable` does not clear | 13 rows (quiescence `A4` node rows and others) |
| T9 | hash move never returned | 5 rows: `A3` guard, `A5`, G1… |
| T10 | promotion dropped from the packed move | underpromotion unit row |
| R1 | `repeatsInPath` always false | `A5` search and engine rows |
| R2 | `search.ts` scores a repetition as a loss | `A5` `search()` row (**closed at `0076e6a`**) |
| R3 | `engine.ts` repetition line removed | `A5` engine row |
| R4 | scan starts at ply−6 | `A5` rows |
| K1 | a key array allocated per node | `A6` `search()` allocation row |
| K2 | a key array allocated per iteration | `A6` `chooseMove` allocation row |
| **K3** | **capacity guard removed** | **SURVIVES every lane.** No test goes near ply 128 |
| **K4** | `!(depth >= 1)` back to `depth < 1` | **The lane HANGS** (pass 1: killed at the runner's 400 s cap, status 143). A gate reads that as a failure, and it is the hang the change fixed |
| E1 | engine table not cleared per call | G1 pin |
| E2 | engine interior never stores | G1, `A3` guard |
| E3 | engine root not re-ordered by its hash move | `A5` engine row (depth 3 at 6 ticks instead of 4) |
| E4 | engine interior hash move ignored | G1, `A3` guard |
| S1 | `search.ts` interior hash move ignored | `A5` `search()` node pin, 7 241 vs 7 239 (**closed at `0076e6a`**, a 2-node margin) |
| S2 | `search()` does not clear the table | 37 rows |
| S3 | the table-off door uses the table | `A1` position-3 node row, 1 299 vs 1 123 (**closed at `0076e6a`**) |
| **G1** | QE `ABC-080` N3: the engine records a killer on every move tried | **the new G1 pin: 358 vs 355 nodes. QE's gap is closed** |
| M13 | `ABC-080` M13: promotion term dropped | 8 rows, the re-pinned 261 among them |

**Thin, and named so a QE hop can thicken them:**
- T3 dies on one unit row.
- S1 dies on a 2-node difference in one pin.
- E1 and E3 die on one row each.
- K3 is unguarded.
