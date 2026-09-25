---
id: 20260925T061500Z-architect-design-decision-g1-pin-oracle-checked-depth3-answers-in-a5-g2-split-deep-corpus-by-root-licence-8c3e5a72
kind: decision
by: architect-design
at: 2026-09-25T06:15:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-077
  - ABC-114
  - ADR-0024
  - NFR-008
  - src/search.ts
  - src/search.test.ts
  - src/quiescence.test.ts
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - .grugops/context/qe-ABC-079/notes/20260924T215000Z-qe-e2e-decision-abc079-fail-four-false-search-ts-sentences-behaviour-meets-a1-a6-conjunction-gap-real-and-move-changing-a4-a7-lane-risk-2c7e91a4.md
  - .grugops/context/ruling-abc079-oracle/notes/20260924T195500Z-architect-design-decision-oracle-depth3-bare-leaf-quiescence-leaf-at-depth2-7e3a1c58.md
  - .grugops/context/ruling-abc079-g1g2/notes/20260925T061300Z-architect-design-observation-g1-oracle-agrees-on-all-six-depth3-g2-broad-d2-is-the-whole-cost-4f7b2d19.md
supersedes:
---

# Ruling on `ABC-079`'s QE readings G1 and G2, and the licence for the ONE repair hop. G1 is closed inside `ABC-079`: pin the depth-3 `{score, move}` in `A5`'s deep rows, as values the oracle has checked. G2 is closed inside `ABC-079`: split the `A4`/`A7` deep cases so that each pays at most one corpus slice, and slice the broad corpus by root.

**NOT A STAMP.** This is a hand-authored `decision`. The numbers are in the sibling `observation`,
and the harnesses are beside it. This ruling can be overturned on that evidence.

## The ruling, in three sentences

1. **G1 is closed in `ABC-079`, not routed.** `A5`'s two deep depth-3 rows in
   `src/quiescence.test.ts` already run `search(kiwipete, 3)` and `search(position-6, 3)`. They
   gain an exact `{score, move}` assertion: **kiwipete `50` / `e2a6`, position-6 `30` / `c3d5`**.
   These are **oracle answers, not only a fingerprint**. This ruling ran the retired unpruned
   quiescence oracle offline, and it agrees with them exactly (161.9 s and 28.0 s in plain node;
   all six roots agree). They go red on `R2b` and `R2c`, the two mutants that survived every lane,
   and they add zero searches.
2. **G2 is closed in `ABC-079`, and QE's example split is not enough on its own.** The whole cost
   is one slice, `corpusRun("broad", 2)`, at 62.5 s cold (52%). A one-case-per-corpus-run split
   leaves that one case at 52%. The remedy is to make every `A4` and `A7` deep case pay for at
   most ONE slice, so that none depends on another case having run first. The slices are
   `default` d2, `broad` d1, and the broad corpus at d2 **split by root**. That makes the worst
   case kiwipete's 49 positions, at 45.7 s (38%). Timeouts do not move.
3. **The licence is prose plus these two test changes, and nothing else.** `src/search.ts`
   changes only in comment lines (D1–D4), and not one code token changes. `src/search.test.ts`
   changes in its header, the `A1` banner, the corpus helpers, and the `A4`/`A7` deep blocks.
   `src/quiescence.test.ts` changes only inside the `A5` describe.

## Why close G1 here rather than route it

- **The gap is `ABC-079`'s own.** The oracle ruling created it, inside this ticket, and QE
  measured it as a real move-changing gap (kiwipete e2a6 → e5g6) that reds no row. A named
  follow-up ticket would ship a known silent hole in the leaf this ticket builds.
- **The closure costs nothing.** The searches already run. Pinning adds two `toBe`s to each of
  two rows.
- **Why this is an oracle and not only a fingerprint.** QE could not call the values more than a
  regression fingerprint, because nobody had run the retired oracle on them. This ruling ran it:
  `searchWithoutPruning(p, 3)` equals `search(p, 3)` on score AND move on all six roots,
  including the four whose lane cell was retired. So the pin is the retired `A1` depth-3 cell,
  stored as its answer. It carries the same caveat that cell always had: it checks the main tree
  and the window the main tree hands the leaf, not `quiesce`'s own inner alpha-beta.
- **What the pin still does not do.** It is two boards at one depth. It is not a window
  invariant, and a defect that happens to leave these two answers alone passes it. It is
  sufficient for the measured class: `R2a`, `R2b` and `R2c` all move kiwipete's score AND move.
  Position-4 and position-5 are not pinned. Their oracle answers are recorded in the observation
  (`−375 c4c5`, `560 d7c8=Q`) for whichever ticket next wants them. Adding them would cost 0.3 s
  and 0.9 s of new searches that no measured mutant needs.
- **What keeps it an oracle and not a rubber stamp.** Node counts are NOT pinned: `A5`'s ratio
  levels govern cost, and they tolerate evaluator drift on purpose. Score and move WILL legitimately
  go red on an evaluator or move-generation change. The docblock must say what to do then:
  re-run `searchWithoutPruning(parseFen(<fen>), 3)` in plain node (about 160 s for kiwipete and
  28 s for position-6), and re-pin **only when it equals `search()` on both score and move.** A
  re-pin to whatever `search()` says, with no oracle run, turns the pin back into a fingerprint.
  That is a defect.

## Why close G2 here, and why by root

- **`ABC-079` made these cases expensive.** At `ABC-077`'s tip the broad corpus at depth 2 cost
  about 2.7 s (the file header's own record). The quiescence leaf made it 62.5 s. On the
  principle the oracle ruling applied, the ticket that makes a merged lane fragile repairs it.
  The oracle ruling also named this remedy as belonging to "a new ruling", and this is that ruling.
- **The measured shape decides the cut.** `default` d2 and `broad` d1 cost about 1.2 s each.
  Broad d2 is 62.5 s, and 45.7 s of it is kiwipete's 49 positions (the other roots: 8.8, 3.5,
  0.3, 0.1 and 0.05 s). Splitting only by corpus run leaves 52%. Splitting by root leaves 38%, so
  crossing needs about 2.6x today's reading, against 1.9x for `A4` today and 1.2x for `A7` alone.
- **Rejected:**
  - Raise the 120 s timeouts. The oracle ruling rejected that as a first resort, and a raised
    bar hides the cost regressions that `Q1` showed this case catches.
  - Shrink the broad corpus, or drop kiwipete's children. That deletes coverage that `A4`/`A7`
    merged with.
  - Split kiwipete's slice further. At 38% nothing is over the 50% line the oracle ruling set, so
    that would be gold plate.
  - A `beforeAll` warm-up. It moves the cost into a hook that has its own timeout and hides which
    criterion paid.

## The licence: the Engineer's ONE repair hop (line numbers at `9b4dd68`)

Only these ranges may change. Everything else in these three files, and every other file under
`src/`, stays byte-identical. `src/quiescence.ts`, `src/engine.*`, `src/evaluate.ts` and
`src/search.qe.test.ts` do not change. **No timeout value changes anywhere.**

### `src/search.ts`: comment lines only, and zero code tokens change

| range | defect | what the sentence must say instead |
|---|---|---|
| `:24–27` | **D2** | Two TEST-ONLY doors reach the bare leaf: `searchWithoutQuiescence` (pruned) and `searchWithoutPruningOrQuiescence` (unpruned). Name both. Drop the singular "the". |
| `:61–69` | **D1** and **D4**'s `:66` | Each switch is turned off by TWO exports: `prune` by `searchWithoutPruning` and `searchWithoutPruningOrQuiescence`, and `quiescence` by `searchWithoutQuiescence` and `searchWithoutPruningOrQuiescence`. The `prune` field doc (`:66`) must stop saying "brute-force negamax". False declines the MAIN TREE's cutoffs only. The `quiescence` field doc (`:68`) names both of its doors. |
| `:112–114` | **D4** | `prune` false declines both halves of the MAIN-TREE cutoff. It is brute force above the horizon only, because a quiescence leaf still runs `quiesce`, which keeps its own stand-pat and capture cutoffs. The oracle claim stays: it is still `A1`/`A2`'s differential oracle for the main tree. |
| `:204–209` | **D3** | `searchWithoutPruning` disables the main tree's alpha-beta cutoffs. Its leaves still run `quiesce` with that function's own cutoffs, so it is NOT brute force below the horizon. That is QE's measurement: position-3 d1, 46 nodes shipped against 63 with `quiesce`'s cutoffs removed. |

The docblock of `searchWithoutPruningOrQuiescence` (`:227–236`) is TRUE (it has no quiescence
leaf, so it is brute force throughout). It stays as written.

### `src/search.test.ts`

| range | change |
|---|---|
| `:37–43` (header, "What no case proves any more is the combination…") | Now false after G1. Say instead that the combination is covered on kiwipete and position-6 at depth 3 by `A5`'s pinned, oracle-checked `{score, move}` in `src/quiescence.test.ts`, and cite this ruling. The sentence "neither leaf brute-forces quiescence's own alpha-beta" stays. |
| `:352` (the `A1` banner, "the SAME score as brute force") | The same false fact as D3/D4, in a file this ticket edits. The fix is one line: "the SAME score as the unpruned main tree". Added by this ruling so that a re-QE under `ABC-114` does not open a fifth D. |
| `:236–289` (`broadCorpus`, `CorpusRun`, `corpusRun`) | Add a per-root slice of the broad corpus (the root plus its one-ply children, `inProgress`-filtered), memoised under its own key. `default`/`broad` at a depth keep their current meaning and their current memo keys. |
| `:475–482` (the `A4` deep block) | Replace the one case with one `it` per slice: `default` d2, `broad` d1, and the broad corpus at d2 once per root (six). Each asserts `illegal` is `[]`. The `size ≥ 100` check moves to the `broad` d1 case, which also asserts that the six per-root slices together are exactly the broad corpus (sizes sum to its size, 184 today). That generates positions and does not search them. Each case keeps `120_000`. |
| `:550–568` (the `A7` deep block) | The same slices: one `it` per slice asserting `mutated` is `[]` (`default` d2, and the broad corpus at d2 per root). Plus ONE case for the roots, which keeps today's body: `.intact` on the six depth-2 quiescence pairs, then `search(p, 3)` and the bare door at depth 3 with the snapshot check. Cold, that case is about 31.6 s (26%). That is the sum of its two measured components (15.6 s + 16.1 s), not one timed run. Each case keeps `120_000`. |

`A4`'s and `A7`'s default-lane cases (`:468–473`, `:536–548`) do not change.

### `src/quiescence.test.ts`: only inside `A5` (`:436–475`)

- `multiplier()` also returns the `search()` result, or the depth-3 case calls it once and keeps
  the result. It must NOT call `search()` a second time.
- The depth-3 deep rows assert `score` and `move` (`label` / `squareName` form):
  - `kiwipete` must read `50` / `e2a6`.
  - `position-6` must read `30` / `c3d5`.
  - Depth 1 and depth 2 are not pinned.
- The docblock says four things:
  - the values are the retired unpruned quiescence oracle's answers at depth 3, checked by this
    ruling;
  - what they close (QE's G1);
  - node counts are deliberately not pinned;
  - the re-pin rule: re-run the oracle, and re-pin only on agreement.
- The case titles say that they also check the depth-3 answer.

### What the hop must re-run and report

1. `SEARCH_DEEP=1 npx vitest run src/search.test.ts` and `src/quiescence.test.ts`, to exit 0.
   Report the count, the wall, the load, and **every deep case's share of its timeout, naming any
   case above 50%.**
2. **Order independence:** each new `A7` slice case run ALONE (`-t`) must stay under 50%, cold.
3. **The pins bite:** re-apply `R2b` and `R2c` (QE's exact edits,
   `qe-ABC-079/notes/raw-harness-mutants.mjs.txt`, K = 5) to a scratch copy or in place. Show that
   the `A5` kiwipete and position-6 depth-3 rows go red. Then revert, and assert
   `git status --porcelain -- src` holds only the hop's own diff.
4. The default lane (0 skipped, integrity `No findings.`), lint, typecheck and build.
5. **`search.ts`'s D-lines:** a `git diff -U0 -- src/search.ts` in which every changed line is a
   comment line.

## Not in this ruling

- **`AGENTS.md`, for the Scribe after the hop:** the owed `Quiescence deep lane` entry (oracle
  ruling, line 2) should also say that it holds `A5`'s depth-3 oracle pins. Nothing is written
  here.
- G3 (`ABC-084`), G4 (`ABC-080`) and G5 stay where QE put them.
- `NFR-008` is not ruled (fence). The split adds cases but no searches, so the whole-lane work is
  unchanged. Only the per-case attribution changes.
- The board and the NFR bars are untouched. Nothing is merged or deployed.
