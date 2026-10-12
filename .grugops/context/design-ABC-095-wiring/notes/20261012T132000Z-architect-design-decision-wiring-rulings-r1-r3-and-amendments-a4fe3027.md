---
id: 20261012T132000Z-architect-design-decision-wiring-rulings-r1-r3-and-amendments-a4fe3027
kind: decision
by: architect-design
task: design-ABC-095-wiring
at: 2026-10-12T13:20:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-042
  - ABC-043
  - ABC-044
  - ABC-045
  - ABC-046
  - ABC-119
  - ABC-101
  - ADR-0012
  - ADR-0015
  - ADR-0036
  - ADR-0037
  - NFR-004
  - NFR-008
  - 20261012T131450Z-architect-design-observation-wiring-premises-and-book-odds-7f2adbae
  - 20261012T125300Z-software-engineer-observation-wiring-reds-merged-criteria-ef39c9a6
  - 20261012T125400Z-software-engineer-decision-deliver-decorator-stop-at-wiring-1e971b4d
  - 20261012T130400Z-software-engineer-observation-a2-and-miss-cost-not-read-31116475
supersedes:
---

# Wiring `ABC-095`: the read goes in a holder module, the doubles move to `./book-engine.ts`, `ABC-119` runs on a book-absent copy, the miss bar is warm, and the decorator merges only with the wiring

This note is hand-authored and unsealed.
- **The ruling text** is `ADR-0037` § Addendum — 2026-10-12. This note does not restate it.
- **What this note adds** is the exact work list for the two hops that follow.
- **The premises** are in `…7f2adbae`.

## The rulings, one line each

- **R1 — (b2).** A new holder, `src/book-file.ts`, holds the read:
  - one export, `readBookFile(): Uint8Array`;
  - no parameter;
  - it imports `node:fs` and nothing else;
  - it contains no `process`, and it does not read at import time.

  `src/cli.ts` binds `read: readBookFile`, the warn sink (`process.stderr`) and `Math.random` in one
  `const` above `runTurnLoop({`. `ADR-0036`: (b1) fires on `book-file.ts` and on `cli.ts`, (b2) fires
  on `cli.ts -> book-file.ts`, and the holder set goes from 3 to 4.
- **R2 — the double moves to the outermost supplier at `engine:`.** All 10 children that substitute
  `./engine.ts` move to `./book-engine.ts`, whose module exports `withBook(_probe, _inner)` and
  returns today's double seam. `ADR-0015` (S) and (C) are read unchanged, and (N3) holds.
  - **`ABC-119`'s deep children** run from a temporary copy of the tree in which `src/` is
    byte-verified and `data/opening-book/book.json` is absent.
  - **Two pins move** in `ABC-095`'s diff: `A9`'s census, and `ABC-043` `A1`'s `engine:` row.
- **R3 — the ≤ 5 ms miss bar is WARM.** It is the maximum of 200 `bookMove(P)` calls after one
  warm-up hit, out of the suite, on the reference machine. `P` is the position after
  `1. e4 e5 2. Ke2`. The cold load belongs to `A2`'s hit bar, and `A2`'s Given should be stated as
  cold.
- **Merge order.** `521a8513` merges **only with the wiring**, as one `ABC-095` delivery:
  - `AGENTS.md`: a merge happens "once … the ticket is done, never before";
  - one UAT word, not two;
  - nothing on `main` needs the decorator first.

## For Security/NFR, in the next hop (this role does not change `ABC-042` bar 4)

1. **S1 — `ADR-0036` § Decision 3's trigger has fired.** `src/book-file.ts` is the first production
   module outside `cli.ts`, `glyph-mode.ts` and `perft-bench.ts` that holds a limb. Rule whether (b2)
   now needs a call-graph reach.
2. **S2 — bar 4's scope.** Confirm that bar 4 reads as its test reads it: the own source of
   `src/cli.ts` and `src/cli-options.ts`.
   - **If yes,** bar 4's text does not change, and R1 needs nothing from Security/NFR beyond S1 and
     S3.
   - **If no** (closure-wide, or process-wide), bar 4 needs amending under any placement. The carve-out
     to write: *one read-only, synchronous read of the fixed path `data/opening-book/book.json`,
     resolved from `import.meta.url`, by a module that takes no input; no write, no other path, no
     network.*
   - **R1's placement stands in both cases.**
3. **S3 — `ABC-095`'s own `In Security/NFR` hop**, after the wiring is built. It covers:
   - (b1) and (b2), read with `.grugops/context/design-F-072-1/probe/clause-b.mjs` on the delivered
     pair;
   - `ABC-042` `A9`'s census moving from 9 to 10 `process` identifiers, with a third `process.stderr`
     (the book's one warning). That is still the entry point and still a writable-handle acquisition,
     so `A9`'s rule holds;
   - the hostile-input surface, which is `ABC-094`'s and is unchanged.

## For BA/PM, in a later hop: the exact amendments, dated, with the original words kept

**`ABC-095`** (`plans/tickets/ABC-095-…md`):
1. **§ Scope, "The one wiring line", and `A7`.** Add: the probe's `read` is `readBookFile` from
   `src/book-file.ts`, and its `warn` writes the line plus `\n` to `process.stderr` in `src/cli.ts`
   (R1). `A7`'s "`engine:` is the only changed property inside the call" is unchanged.
2. **§ Security / NFR triggers, the Security bullet.** Replace "(b2) through the new edge to the
   probe, or (b1) if `src/cli.ts` holds the read" with R1's prediction:
   - (b1) on `src/book-file.ts` (limb 1) and on `src/cli.ts` (limb 2);
   - (b2) on `cli.ts -> book-file.ts`;
   - the fourth holder, which fires `ADR-0036` § Decision 3's trigger (S1).

   The edge to `book.ts` does not fire.
3. **§ Re-score — 2026-10-12, "Overlaps".** Strike "`src/cli.test.ts`, which this ticket does not need
   to edit". The wiring hop edits it: 10 hook sites and 2 pins. It also edits
   `src/cli.real-engine.test.ts`, moving `ABC-119`'s children to the book-absent copy.
4. **§ Scope.** Add three things:
   - the new production module `src/book-file.ts`, a capability holder;
   - the re-target of the 10 `src/cli.test.ts` children;
   - the move of `ABC-119`'s lane to the book-absent copy.

   Re-check size `S`.
5. **§ Security / NFR triggers, the `NFR-004` bullet.** The ≤ 5 ms miss bar is WARM, with R3's
   definition: subject, position `P`, procedure, statistic (max of 200) and host. Cite the addendum
   rather than copying it.
6. **`A2`.** Recommended: state the Given as "the first call in a fresh process, so the one read and
   parse are inside the 30 ms" (cold). The bar does not change.
7. **§ Security / NFR triggers, the `NFR-008` bullet.** 0 new spawns and ≤ 1 new file still hold.
   Add: each of the 10 re-targeted children now loads the real `engine.ts` closure, plus `book.ts` and
   `book-file.ts`. That CPU is `UNKNOWN - verify`, is charged to this ticket's `N8-LANE` line, and is
   read by QE.
8. **§ Lane cost.** Still **one** new test file (`src/book-engine.test.ts`). Two existing test files
   are edited.

**`ABC-043`** (`plans/tickets/ABC-043-the-live-session.md`):
1. **`A1`.** Add a dated pointer. Since `ABC-095`, the `engine:` value is
   `withBook(book, createEngine({ budgetMs: DEFAULT_BUDGET_MS }))` (`ADR-0012` clause 2(3); `ABC-095`
   `A7`), and a same-type decorator is not an "adapter" in `A1`'s sense. The criterion text is
   unchanged.
2. **§ "The ruling on `A5` and `A2`'s testability"** (the prose at about :243, which reads "a different
   `./engine.ts`", and the `A5` and `A2` bullets at about :262–:272, which read "substituted
   `createEngine`"). Add a dated note: since `ABC-095`, the double stands at `./book-engine.ts`
   (`withBook`), which is the supplier at `engine:` under `ADR-0015` (S). Read "a different
   `./engine.ts`" as "a different `./book-engine.ts`", and "substituted `createEngine`" as
   "substituted `withBook`".
3. **§ "The (N) limit" table, the row "`A5` + `./engine.ts` …"** (about :343). Add a dated row,
   "`A5` + `./book-engine.ts` throwing / illegal-move seam", with (N1)–(N3) re-confirmed. Confirm (N)
   in one line for `A2` (`mate`) and `A7` (`colourBlack`, `colourWhite`) too.
4. **The Givens of `A2`, `A5` and `A7` do not change.**

**`ABC-044`.** `A3`'s Given ("`engine-failure` and `engine-threw` with `result: null`") does not
change. Confirm (N) only; the row reads `ABC-043` `A5`'s children.

**`ABC-045` / `ABC-046`.** The Givens do not change. `ABC-045:252`'s "with the engine substituted"
stays true, because the engine seam is still the one substituted. A dated pointer is optional. Confirm
(N) for `resigns`, `quits` and `renews`.

**`ABC-042`.**
- **Its criteria do not change.** The `A9` census pin moves in the test file with a reason line, as it
  did at `ABC-043` and at `ABC-115`.
- **Bar 4 is Security/NFR's (S2),** not BA/PM's.
- **The colour children `black` and `random`** keep their subject, the first frame. No amendment.

**`ABC-119`** (`plans/tickets/ABC-119-no-test-anywhere-runs-the-delivered-clis-real-engine.md`):
**this is the one page whose Given changes.**
1. **`A1`'s Given.** After "runs the delivered entry point", add: "from a temporary copy of the tree
   whose `src/` is byte-identical to the repository's, asserted before the spawn, and in which
   `data/opening-book/book.json` is absent". "With no `--import`, no substitution hook and no double"
   is unchanged.
2. **`A1`'s parenthetical.** "(an instant reply proves a double leaked in)" becomes "(an instant reply
   proves a double, or the book, leaked in)". The ≥ 1.0 s floor is unchanged.
3. **`A3` and `A4`.** The same Given as `A1`, because they read the same children. `A3`(iv): the one
   book-absent warning line is expected on stderr. It is not a stack trace, and the exit code is still
   0.
4. **The default-lane row** "the deep child runs the delivered entry point with no `--import`, loader
   or hook, and an empty environment". Its entry path moves to the copy, and the byte-identity check
   joins it.
5. **`A2`, `A5` and `A6` do not change.** `A6`'s mutant is still planted in a copy outside the
   repository, and it must still red `A1`.
6. **Why this is a re-scope in form and not in substance.** `A1`–`A4` still read the real search,
   through the delivered composition, with no hook. Without this change they would read the book.

## What QE should know (no ruling)

- `1. c3` is the one first move that leaves book. A real child as White that plays `1. c3` would
  exercise book-present → miss → search end to end. Nothing requires it, and it is not a criterion.
- Every child that `src/cli.test.ts` hooks today stops reading `book.json` once it is re-targeted. No
  unhooked default-lane child reaches an engine ply. **So the default lane reads the artifact 0
  times.** This is checkable by a load or read recorder, if QE wants a reading.
