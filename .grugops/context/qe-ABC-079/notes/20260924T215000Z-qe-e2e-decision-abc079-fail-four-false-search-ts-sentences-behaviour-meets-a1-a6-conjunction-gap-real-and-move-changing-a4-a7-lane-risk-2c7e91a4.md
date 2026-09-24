---
id: 20260924T215000Z-qe-e2e-decision-abc079-fail-four-false-search-ts-sentences-behaviour-meets-a1-a6-conjunction-gap-real-and-move-changing-a4-a7-lane-risk-2c7e91a4
kind: decision
by: qe-e2e
at: 2026-09-24T21:50:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-077
  - ABC-078
  - ABC-084
  - ABC-114
  - ADR-0024
  - NFR-004
  - NFR-005
  - NFR-008
  - src/quiescence.ts
  - src/search.ts
  - src/engine.ts
  - src/quiescence.test.ts
  - src/search.test.ts
  - src/search.qe.test.ts
  - src/engine.test.ts
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - .grugops/context/ruling-abc079-oracle/notes/20260924T195500Z-architect-design-decision-oracle-depth3-bare-leaf-quiescence-leaf-at-depth2-7e3a1c58.md
  - .grugops/context/ruling-abc079-oracle/notes/20260924T195900Z-architect-design-claim-what-this-oracle-ruling-did-not-verify-3b9d4e02.md
  - .grugops/context/ticket-to-pr-ABC-079/notes/20260924T200000Z-software-engineer-decision-rehop2-bare-leaf-door-leaf-keyed-pairs-and-sibling-branch-6c1e8a04.md
  - .grugops/context/ticket-to-pr-ABC-079/notes/20260924T201400Z-software-engineer-claim-rehop2-limits-and-what-is-not-verified-d38f5b72.md
supersedes:
---

# `ABC-079` QE verdict: **FAIL**. The behaviour meets `A1`–`A6`, and no criterion is red. Four sentences in `src/search.ts` are false. The conjunction the oracle ruling gave up is a real gap that changes moves. `A4`'s deep case is a lane risk, and `A7`'s deep case is the bigger one.

**NOT A STAMP.** `context.human_admission` is `off`, so no `finding` is admissible on this install.
This is QE's hand-authored `decision`. Everything below was RUN on branch `grugops/qe-ABC-079`,
created from `grugops/int-ABC-079` @ `6b7b2c8`. That is the wave branch with
`grugops/ABC-079-quiescence-rehop2` merged in. The seven delivered files are byte-identical
to the build `33b9a02` (`git diff --numstat 33b9a02 6b7b2c8` over them is empty). The whole
ticket was tested against the fork point `4f0ef01`, all three hops together. It ran in an
isolated worktree with the main checkout's `node_modules` symlinked. Load average (1-min) was
2.7–9.8. **QE added zero tests and changed zero lines under `src/`.** Every mutant was reverted,
and `git status --porcelain -- src` was asserted EMPTY after each one (16 rounds plus 3
follow-ups). The raw harnesses and outputs are next to this note as `raw-*.txt`.

## Why FAIL, and how small the repair is

No acceptance criterion is red. The FAIL has one cause: four false sentences in
`src/search.ts`, a file this ticket's diff edits. Under the `ABC-114` standard a comment that
states a measured-false thing as fact is a defect, and this board has already FAILED a ticket
for exactly that. That was `ABC-046`, the same day, on two false docblock sentences.
`ABC-115`'s QE is the older precedent. The repair is prose only. Two of the four sentences
(D1, D2) were frozen by the oracle ruling's *"nothing else in the file changes"*, so the repair
hop needs the Orchestrator's licence to touch them. The other two (D3, D4) date from the first
hop (`ead14eb`) and nothing fenced them. The two Architect readings below (G1, G2) are routed.
They do not gate the prose repair.

## 1. The criteria on the integrated base

| | verdict | the reading QE ran |
|---|---|---|
| `A1` | **MET-AS-READ** | QE recounted the 24-row corpus by parsing it out of `src/quiescence.test.ts`: **quiescence 0/24, bare leaf 24/24 at depth 1**, in one test, so the baseline is strictly worse. At **depth 2 and depth 3 both arms read 0/24**. `chooseMove` at `DEFAULT_BUDGET_MS` also reads **0/24**, completing depths 5–8. So the baseline is worse ONLY at depth 1. "Default strength" is read as the millisecond-budget lane that the ticket's own `N8-LANE` line licenses. **G3.** |
| `A2` | **MET** | 4 quiet rows are exactly equal (`toBe`, `-0`-safe). A hanging pawn scores strictly greater, and a defended pawn equals the static value. `Q5a`/`Q5b` red all five `A2` rows. |
| `A3` | **MET** | The 200+ default corpus and the broad corpus (deep) both stay under cap 8. The sixteen-queen rig reaches exactly 8. `Q4a` (cap 9) reds 3 `A3` rows and `Q4b` (cap 7) reds the rig row. |
| `A4` | **MET** | Quiet rows match on score, move AND node count at depths 1–4. The door reproduces `ABC-078`'s 562 / g5f6 and 14 565 / c3d5. `Q5a` reds 9 `A4` rows. |
| `A5` (re-stated, `ADR-0024`) | **MET** | Kiwipete **119.96x / 32.74x / 45.02x** (levels ≤ 180 / 50 / 70). Position-6 **6.32x / 17.44x / 8.26x** (≤ 10 / 26 / 13). All six node pairs were reproduced to the node. The stop has teeth: `Q1`, `Q2` and `Q3` red here. `Q2` reds ONE row only (position-6 d1, 11.83x against 10). |
| `A6` | **MET** | Every corpus stays byte-identical: the default corpus, both hanging arms, the visitor-throws path and the broad corpus (deep). |

## 2. What the oracle ruling gave up: MUTATION-TESTED. The gap is real, and it changes the move

QE seeded three defects that live only where an inherited depth-3 window reaches a quiescence
leaf (the `observation` mutant ledger has the raw rows):

- **`R2a`**: at a leaf with `ply ≥ 3` and a finite window, `src/search.ts`'s leaf hands
  `quiesce` a null window `(alpha, alpha+1)`.
- **`R2b`**: the same, but only when the leaf has ≥ 5 captures (capture-dense).
- **`R2c`**: the same slip INSIDE `quiesce` (the shared leaf), keyed on black to move at
  `qply 0`, a finite window and ≥ 5 captures. All six perft roots are white to move, so depth-2
  leaves are white and depth-3 leaves are black.

All three are **real defects in the shipped `search()`**. At depth 3 kiwipete goes **e2a6 / 50
→ e5g6 / 205**, position-4 goes **c4c5 / −375 → g1h1 / −285**, and position-6 goes
**30 → 120** (`R2a`: 145).

- **`R2b` and `R2c` survive EVERYTHING.** The default lane is 1392 of 1392 green. `SEARCH_DEEP=1`
  on both files is 80 of 80 green, and `ENGINE_DEEP=1` is 33 of 33 green.
- **Even the ungated `R2a` survives every search and quiescence row.** Only `ENGINE_DEEP` catches
  it, in two rows: the identity sweep over the six roots and their children (21 divergences),
  and the `A3` depth-3 literal. They catch it only because the defect sat in `search.ts`'s copy
  of the leaf while `engine.ts`'s own copy stayed clean.
- **The two retained quiescence-on depth-3 cells (`startpos`, `position-3`) are blind to the
  whole class.** Even ungated, their scores do not move: 50 → 50 and 110 → 110. Only their node
  counts change.
- The engine completes **depth 3 on kiwipete, position-5 and position-6 at the default budget**
  (the `NFR-005` reading below). **So this is the depth the product plays.**

**Ruling: yes, a gap to name — G1, routed to Architect/Design,** who owns the oracle ruling and
accepted this residual on argument. The measured cost is concrete: a quiescence-window defect
that changes the engine's move on three of the six benchmark boards reds no row in any lane.

One cheap closing option, which is the Architect's call and not QE's: the `A5` deep rows
already run `search(kiwipete, 3)` and `search(position-6, 3)`. Pinning their `{score, move}`
next to the ratio would red `R2b` and `R2c` at zero extra search cost. The pinned values would
still need a one-time check against the retired unpruned quiescence oracle, run offline at
23–1 016 s a pair. QE did not run that check, so the values are `UNKNOWN - verify` as an oracle
and are a regression fingerprint only.

## 3. `A4`'s deep case: a real lane risk, and `A7`'s deep case is the larger one

- **`A4` deep read 66.9 s of 120 s (55.8%) in the full lane**, then **65.2 s (54.3%) and
  60.2 s (50.2%)** run alone, at load 4.4–9.8. History: 60.4 s, 73.6 s and 82.7 s (50–69%) at
  load 4–10.
- **To cross 120 s it needs about 1.8x today's reading.** Load alone has moved it 1.37x (load 4
  to load 10). The same day the Engineer read `NFR-008` at load 17–35, which is the regime where
  it would cross. A cost-only quiescence regression of about 2.3x also crosses it: under `Q1`
  (no stand-pat cutoff) it read **245.9 s, red by timeout**.
- A synchronous overrun does NOT hang the lane. Vitest 3.2.7 reds a sync test only after it
  returns (measured with a scratch 300 ms-against-100 ms probe, `raw-out-sync-timeout.txt.txt`),
  so a busy day gives a red lane, not a stuck one.
- **NEW, and larger: `A7`'s deep case reads 16.5 s (13.7%) only because `A4` warms the memo.**
  Run without `A4` in front of it (`-t A7`, a reorder, a deleted `A4`), it pays the corpus work
  itself and reads **92.9 s of 120 s (77.4%)** at load 3.8–4.6. That is closer to its timeout
  than `A4` has ever been.
- **Ruling:** a lane-reliability risk, not a correctness defect, and not a FAIL cause. **G2**
  goes to Architect/Design; the oracle ruling already gave `A4`'s remedy to a new ruling. One
  example remedy that proves the same things: split the three corpus runs into separate cases,
  each with its own timeout.

## 4. The `Switches` docblock and the module header: FALSE by the `ABC-114` standard. Two more were found

| | where | sentence | why false (measured) |
|---|---|---|---|
| **D1** | `src/search.ts:62–63`, `Switches` | *"each has one export that turns it off"* | Since `33b9a02`, each switch has TWO exports that turn it off. `prune: false` is in `searchWithoutPruning` (`:212`) and in the door (`:238`). `quiescence: false` is in `searchWithoutQuiescence` (`:224`) and in the door (`:238`). The field docs at `:66–68` each name only the single-switch door. |
| **D2** | `src/search.ts:26–27`, module header | *"`searchWithoutQuiescence` is **the** TEST-ONLY door to the pre-quiescence leaf"* | Two exports reach the bare leaf, and the header never names the second one. Stale by omission, and the singular "the door" is false. It is the weaker of the four. |
| **D3** | `src/search.ts:205`, `searchWithoutPruning` | *"pruning DISABLED — brute-force negamax over the whole tree"* | Since `ead14eb` its leaves run `quiesce`, which prunes internally. Measured: `searchWithoutPruning(position-3, 1)` visits **46** nodes shipped and **63** once both of `quiesce`'s cutoffs are removed. On kiwipete the genuinely brute-force version had not finished after more than 5 minutes; the shipped one returns at once. The oracle ruling says the same thing in words: *"the 'unpruned' oracle never brute-forced quiescence"*. |
| **D4** | `src/search.ts:112`, `negamax` docblock (and `:66`) | *"`prune` false makes it a plain brute-force negamax"* | The same fact as D3. It holds for the main tree only. |

D3 and D4 matter most. They describe the oracle as brute force, and that belief is what
under-weights G1. This is the reverse of `ABC-120`'s imprecision (an enumeration true of each
arm it names): these are measured-false statements of fact. **QE does not correct them.**
Under `ABC-114` the pen and the verdict stay separate.

## Other gaps named, none of them fixed by QE

- **G3 (`A1`):** the 24-row corpus holds one-ply tactics. From depth 2 up, and at the real
  budget, the bare leaf avoids every losing capture too, so the corpus cannot show quiescence
  doing anything at the depth the engine plays. That is `ABC-084`'s to extend, and the ticket
  already names it as the corpus's extender.
- **G4:** `mvvLvaKey`'s promotion term is not guarded by any row. With `Q6a` (term dropped),
  every lane stays green and 6 node counts move. The sort is lossless, so only cost can see it.
  Low severity. `ABC-080` reuses the key and could pin key values.
- **G5:** `Q7` (the door calling with quiescence ON) is NONE in the default lane. In the deep
  lane it reds by assertion on the `position-3` and `position-4` bare-leaf rows (`expected 130
  to be 110`, `expected -205 to be -375`). Those rows run only after the kiwipete bare pair,
  which then costs about 1 016 s, so the full lane had not reached them when it was killed at
  600 s. They were confirmed with a `-t` run.

## Not covered, and the fences

- `NFR-008` is reported, not ruled (fence). The readings are in the lanes `observation`.
- QE did not open `src/command-input.*`, `src/line-input.*`, `plans/board.md`, `AGENTS.md` or
  `plans/nfr-catalog.md`.
- Production lines > 0, so the UAT waiver does not apply.
- Nothing was merged or deployed. The board move belongs to the Orchestrator: with this FAIL
  the ticket goes back to `In Development` for the prose-only repair, and G1/G2 go to
  Architect/Design as readings.
