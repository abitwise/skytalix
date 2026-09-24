---
id: 20260924T195500Z-architect-design-decision-oracle-depth3-bare-leaf-quiescence-leaf-at-depth2-7e3a1c58
kind: decision
by: architect-design
at: 2026-09-24T19:55:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-077
  - ADR-0024
  - NFR-008
  - src/search.ts
  - src/search.test.ts
  - src/search.qe.test.ts
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - plans/tickets/ABC-077-negamax-alpha-beta-core.md
supersedes:
---

# Ruling on `ABC-079`'s red `SEARCH_DEEP` lane: the depth-3 oracle runs on the BARE leaf (option a), and the quiescence leaf is checked at depth 2 on all six positions. `ABC-079` owns the fix.

This ruling can be overturned on the same evidence. Every number is in the sibling `observation` note, and the probe
(`probe-oracle.ts`, `oracle-lib.ts`, `oracle.test.ts`, `run-*.mjs`) was checked to reproduce `src/` to the
node before any figure was quoted from it.

## The ruling, in three sentences

1. **The oracle's depth-3 pair runs on the bare leaf on both sides.** `A1` depth 3 on all six
   perft positions, `A2` kiwipete depth 3 and `A7`'s unpruned depth-3 sweep compare
   `searchWithoutQuiescence` against a new test-only door that turns off both pruning and
   quiescence. That is `ABC-077`'s merged `A1`/`A2`, measured on the search they were written
   about: kiwipete reads **99 950 unpruned nodes and 9.02%**, the file header's own record. Under
   the runner the worst pair takes **3.4 s** against a 30 s timeout.
2. **The quiescence leaf stays under the oracle wherever that is affordable.** The
   quiescence-on pair runs at depth 2 on all six positions (the worst is kiwipete at 11.0 s of
   30 s) and at depth 3 on `startpos` and `position-3`. The quiescence-on depth-3 pairs on
   kiwipete, `position-4`, `position-5` and `position-6` are retired. They cost 23–1 016 s each
   because the unpruned tree opens a full-window quiescence at every leaf (11.3M nodes on
   `position-6`, against 120k pruned). `position-4`, at 22.9 s of its 30 s timeout, is
   retired with them rather than left to fail on a busier day.
3. **`src/search.test.ts` is inside `ABC-079`'s fence, and no new ticket is cut.** `ABC-079`'s
   leaf change made the lane red, and this ticket's own § Ruling requires the lane to read exit
   0. The ticket has already edited this file and `src/search.qe.test.ts` (the `A6` list and
   `QE-G1`), and it re-fixtured `ABC-078`'s `src/engine.test.ts` on the same principle: the
   ticket that breaks a merged lane repairs it before it merges.

## What each option stops proving, including the chosen one

- **(a), chosen:** pruned equals unpruned **with the quiescence leaf, at depth 3, on the four
  capture-dense positions**. A window bug is still caught when it shows up:
  - at depth 3 anywhere on the bare leaf (interior-node cutoffs under an inherited window, all
    six positions);
  - at the quiescence leaf at depth 2 on all six (the leaf already receives a two-sided finite
    window: `alpha` inherited from the root, `beta` from its parent);
  - at depth 3 with quiescence on the two positions that remain (`startpos`, `position-3`).

  The residual is the CONJUNCTION: a defect that shows only when an inherited depth-3 window
  reaches a quiescence leaf on a capture-dense board. Neither lane catches that one any more.
  One more thing was never proved under any option. The "unpruned" oracle never brute-forced
  quiescence: `quiesce` runs its own alpha-beta inside every leaf, full window or not. So the
  oracle has only ever proved main-tree pruning. Quiescence's internal window is covered by
  `src/quiescence.test.ts`, not by this file.
- **(b) depth −1 on the four cases:** `A1` at depth 3 would survive only on `startpos` and
  `position-3`, the two quietest boards. `A2`'s own case (kiwipete at depth 3) would disappear,
  and the depth-2 cells already exist, so the "drop" is really four deletions. **That weakens
  `ABC-077`'s merged `A1` and `A2` as written.** Rejected even though it fits (kiwipete d2 is
  11.0 s; `A7` at d2 is 23.2 s).
- **(c) cap the oracle's quiescence:** the pruned side needs the same cap, so the comparison
  no longer involves the shipped search. It compares a third sibling at cap 1. Cap 2 already
  misses: kiwipete takes **31.6 s against 30 s**. And it would thread a cap parameter through
  `quiesce`, a production signature, for a test's sake. Rejected.
- **(d) raise the timeout:** this is the only option that keeps proving everything. But it
  needs **≥ 1 016 s** for the kiwipete pair and **≥ 1 281 s** for `A7` (loaded figures),
  which is a ~45-minute lane. A lane that nobody runs proves nothing. It was ruled last-resort
  on 2026-09-19 and is rejected here.

## What the Engineer's next hop must change, and nothing else

The hop is `ABC-079`'s, on `grugops/ABC-079-quiescence`. It touches three files.

1. **`src/search.ts`:** add one TEST-ONLY door,
   **`searchWithoutPruningOrQuiescence(position, depth)`** =
   `searchRoot(position, depth, { prune: false, quiescence: false })`. Give it the same doc
   shape as its two siblings: required depth, no default, "not an engine option". Nothing else
   in the file changes.
2. **`src/search.test.ts`:**
   - `A1`: depth 2 keeps the quiescence-on pair on all six, exactly as today. At depth 3, add a
     bare-leaf pair (`searchWithoutQuiescence` vs the new door) for all six positions in the
     deep lane. Keep the quiescence-on depth-3 pair only on `startpos` (deep) and `position-3`
     (default, unchanged). Delete the quiescence-on depth-3 cells for kiwipete, `position-4`,
     `position-5` and `position-6`.
   - `A2`'s deep case reads the bare-leaf kiwipete depth-3 pair (expected 9.02% < 40%). Its
     default-lane startpos depth-2 guard stays as it is.
   - `A7`'s deep case keeps `search(position, 3)` on every root. Its unpruned half becomes the
     bare-leaf door at depth 3, and it also asserts `.intact` on the memoised quiescence-on
     depth-2 pairs, which adds no searches.
   - `A6`'s export list gains the door.
   - Update the header paragraph so it says which leaf each depth runs on, and why.
   - The per-case timeouts DO NOT MOVE.
3. **`src/search.qe.test.ts`:** `QE-G1` gains one case for the new door, the same shape as
   `searchWithoutQuiescence`'s.
4. **Re-run and record:** `SEARCH_DEEP=1 npx vitest run src/search.test.ts` to completion (exit
   0, count, wall, load); the default lane (41 files, counts, 0 skipped, integrity); lint,
   typecheck and build. Report each deep case's duration against its timeout. **Any case over
   50% of its timeout is reported by name.** `A4`'s deep case (a quiescence-on shipped search
   over the corpora, which this ruling does not touch) is the one to watch.

`src/quiescence.ts`, `src/quiescence.test.ts`, `src/engine.*` and `src/evaluate.ts` do not change.

## `AGENTS.md` lines the Scribe owes (written AFTER the Engineer's hop, with its measured numbers)

1. **Amend** the `Search deep lane` entry's comment (`SEARCH_DEEP=1 npx vitest run
   src/search.test.ts`). Its *"RUN 2026-08-17 … exit 0, 41 passed, 23.0 s"* is false at
   `ABC-079`'s tip. Replace it with the Engineer's measured run (commit, exit, count, wall,
   load). Say that the deep depth-3 differential runs on the BARE leaf (`ABC-077`'s `A1`/`A2`
   as merged), and that the quiescence leaf is checked at depth 2 on all six plus depth 3 on
   `startpos`/`position-3`. Cite this ruling.
2. **Add** a `Quiescence deep lane (opt-in slow suite, ABC-079)` entry:
   `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts`. Last run: exit 0, 37 passed, 13.7 s at
   `700730b`, load 11–12. It holds `A1` depth 3, the `A3` broad corpus, the `A4` door, the
   `A5` depth-2/3 levels (a stop condition) and the `A6` broad corpus. Run it after any change
   to `src/quiescence.ts` or to `src/search.ts`'s leaf. **State the trap:** the two files share
   `SEARCH_DEEP`, so setting it for one registers the other's deep cases as well.

## Fences honoured

Zero files under `src/` in this ruling's diff. The probe stayed out of tree; it lives in the
session scratchpad and is not committed. `AGENTS.md`, `plans/board.md`, the NFR bars and
`ADR-0024` are untouched. Nothing was merged or deployed.
