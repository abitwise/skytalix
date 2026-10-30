---
id: 20261029T205200Z-architect-design-decision-eebca902
kind: decision
by: architect-design
at: 2026-10-29T20:52:00Z
verified_by: 
confidence: high on the gate set and order; the split is a recommendation for BA/PM
refs:
  - arch-ABC-235
  - ABC-235
  - ABC-227
  - EPIC-010
  - EPIC-008
  - ABC-206
  - se-ABC-227/20261029T203901Z-software-engineer-observation-7175ebdf
  - se-ABC-227/20261029T203901Z-software-engineer-decision-e56997fd
  - ADR-0002
  - ADR-0003
  - ADR-0020
  - ADR-0024
  - ADR-0025
  - ADR-0026
  - NFR-001
  - NFR-005
  - NFR-009
  - ABC-231
  - ABC-232
  - ABC-233
  - ABC-234
  - .grugops/context/arch-ABC-235/raw/
supersedes: 
seal: sha256:edb55846480ec3f3d13d5981b5216daf54c82965583db780f5381499a22f6438
---

# Architect/Design decision, arch-ABC-235: order, split, ADRs and the gate set for the Software Engineer

Companion to this task's per-cut ruling (the `decision` note filed with it). That note holds the conditions and proofs, and they are not restated here.

## The split (BA/PM acts on it)

ABC-235 is M for "up to three hot spots", and its page says BA/PM splits if more are named. Four cuts are confirmed value-identical: 1, 3, 5 and 6.

- **ABC-235 keeps cuts 1, 3 and 5.** These are the three largest bounds (7.1-8.2, 10.8-13.5 and 9.0-11.8 % of self time; bounds, not speed-ups), one per hot spot: the king scan, capture generation and pawn structure. Together they give A3's ≥ 1.10x on two boards the most room.
- **Cut 6 goes to a new small ticket** (S, P3, value-identical, S2, the same A1 oracle). Its bound is the smallest, and it may miss the 3 % drop bar on its own. Land it after ABC-235 and before `ABC-233` and `ABC-234`, which edit the same `orderKey` and `orderMoves`. BA/PM may instead drop it. Its other argument, bytes (8.6-12.8 % of allocation), buys little while GC is 1.6-1.9 % of time.
- **Cuts 2 and 4 are not in any ticket from this hop.** Cut 2 needs an owner-ratified amendment of `ADR-0003` first. Cut 4 waits for `ABC-231` and `ABC-232` and a fresh profile.
- **The scope line changes.** The page's candidate "a cheaper evaluator walk (a piece list)" is not one of ABC-227's six, so it is out by scope item 1. The page's "cheaper legality for non-captures" is cut 2, so it is out.

## The order inside ABC-235 (one commit per cut; any cut may drop alone)

1. **Cut 1, the hoisted king square** (`src/legal.ts` only). It is the smallest edit, and cut 3 builds on the same function.
2. **Cut 3, `generateCaptures`** (`src/moves.ts` adds a function; `src/legal.ts`'s `legalCaptures` calls it).
3. **Cut 5, the pawn-structure cache** (`src/evaluate.ts` only). It shares no file with 1 or 3.

Each commit is measured against the commit before it for the 3 % drop rule. The Engineer's figures are indicative, and QE's interleaved reading at the tip decides A3. A dropped cut is reverted by a new commit, never by amend or rebase.

## ADRs

- **None for ABC-235.** Cuts 1, 3 and 5 change no value, so `ADR-0026` does not apply. Cut 1 and cut 3 keep make/test/unmake as the only legality test, through `OD-206-1`'s accepted reading of `ADR-0003` clause 1.
- **INFO for the owner, not a gate (`OD-235-1`).** Cut 1 re-opens the hoist that `ADR-0003` § Context recorded as closed, under a different bar (≥ 3 % per board). The Orchestrator reports it, with the veto open. On a veto, cut 1 drops and 3 and 5 stand.
- **Named for later, not written:** an amendment of `ADR-0003` clauses 1 and 3, if the owner wants cut 2. A new ADR would also be needed if cut 4 ever puts evaluation state on `Position`, against `ADR-0020`'s rule.

## Gate set for the Software Engineer

**Mandatory (config `quality.mandatory_gates`):** `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, green at every cut commit.

**The value-identity proof:**
- **ABC-235 A1, cross-build, out of tree, plain `node`, against the merge base.** The corpora are `ABC-078` `A3` and `ABC-121`'s 190, at fixed depth 5. Search with `search`, every existing test-only door, and `chooseMove` at budgets 3 and 5 on `tickingClock(1)`. Compare move, score, completed depth, nodes and clock reads byte for byte, at each cut commit (SE) and at the tip (QE). Commit no golden file, as ABC-206 did.
- **Per cut:** the (P1)-(P3) rows of the ruling note, in the existing test files.
  - Cut 1: `src/legal.test.ts`.
  - Cut 3: `src/moves.test.ts`. The spied guard goes in `src/gameend.nfr.test.ts` beside ABC-206's.
  - Cut 5: `src/evaluate*.test.ts`.
  - Depth-1 rows go in the lane. The depth-3 walk runs under `ENGINE_DEEP=1`, so `NFR-008` holds. No new test file is needed.
- **Perft:** `npm run perft` counts equal base, and `PERFT_DEEP=1` stays 32/32.

**EPIC-008 gates (A4 and A2 of the page):**
- `G1`: 54/58, with every row's move, depth and nodes equal to base (`PUZZLE_DEEP=1`).
- `G2`: the instrument as it stands, base read in the same session. For cut 5, QE also reports the cache-cold mean (the miss path) as INFO. QE pre-registers which read binds before the first run. My recommendation is the instrument as it stands, because that is what a search sees.
- `G3`: green, including A1 mirror exactness and A6 purity.
- `G4`: green.
- `G5`, `G6`: 5 interleaved, the median ≥ base, any run below depth 6 FAILs.
- `G7`: the pawn cache's 384 KiB is counted in (a), and growth is 0.
- `G8`: ≤ 10 s.
- `G9`: `git diff` of `src/levels.ts` is empty.

**A3 speed:** QE, 5 interleaved runs per board per build at 3 000 ms, no cutechess running, load1 recorded. The bar is ≥ 1.10x nps on two boards and ≥ 1.00x on the third. Each cut moves its board's median by ≥ 3 % or is dropped.

**A5:** S2. There is no playing reading, and UAT is signed by QE's verdict.

## NFR impact

- `NFR-001`. The perft half: `generateMoves` is untouched, so counts are equal by construction. `legalMoves`'s body changes with cut 1, so the perft rate may rise. The leaf clause: `legalMoves` is still called exactly once per `gameStatus`, so it is unchanged.
- `NFR-004`: clock reads are equal, which A1 asserts.
- `NFR-005`: expected to improve. `G6` reads it.
- `NFR-009`: +384 KiB fixed, so the total stays far under 16 MiB.
- `NFR-008`: lane rows at depth 1 only.
- Security: no limb.

## Merge coupling

Cut 5's two-field entry is the seam `ABC-232` extends. If `ABC-231` or `ABC-232` lands first, cut 5 is re-ruled against their `evaluate`, because the cached parts must stay phase-free. The order is ABC-235 → the ordering ticket → `ABC-233` and `ABC-234`. If `main` moves under the branch, the Orchestrator merges `main` in, and A1 re-runs against the new base.
