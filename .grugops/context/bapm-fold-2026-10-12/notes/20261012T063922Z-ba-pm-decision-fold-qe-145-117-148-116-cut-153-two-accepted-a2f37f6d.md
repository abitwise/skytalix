---
id: 20261012T063922Z-ba-pm-decision-fold-qe-145-117-148-116-cut-153-two-accepted-a2f37f6d
kind: decision
by: ba-pm
at: 2026-10-12T06:39:22Z
verified_by:
confidence: high
refs:
  - ABC-145
  - ABC-153
  - ABC-117
  - ABC-148
  - ABC-114
  - ABC-116
  - ADR-0017
  - NFR-008
  - QE-145-a
  - QE-145-b
  - QE-145-e
  - QE-145-f
  - QE-117-b
  - QE2-117-a
  - QE-148-c
  - QE2-148-a
  - QE-116-a
  - QE-116-b
  - AR-145-CLI-WIRING
  - AR-N8SPAWN-DRIFT
  - plans/tickets/ABC-153-the-book-sha256-test-alters-only-the-first-source-file.md
  - plans/tickets/ABC-145-the-book-compiler-stamps-its-source-commit-and-never-checks-the-source-bytes.md
  - plans/tickets/ABC-117-that-exit-one-is-an-unhandled-exception-not-the-usage-code.md
  - plans/tickets/ABC-148-the-binder-count-comment-lists-two-forms-as-open-that-tsc-already-closes.md
  - plans/tickets/ABC-114-four-false-sentences-in-epic-006s-own-instrument-comments.md
  - plans/tickets/ABC-116-record-the-t2-re-measure-trigger-where-a-hop-will-meet-it.md
  - plans/traceability.md
  - .grugops/context/qe-ABC-145/notes/20261012T050042Z-qe-e2e-observation-abc145-gap-register-8deadc79.md
  - .grugops/context/qe-ABC-145/notes/20261012T050042Z-qe-e2e-observation-abc145-plants-b9f6d36a.md
  - .grugops/context/qe-ABC-117/notes/20261012T050316Z-qe-e2e-observation-abc117-gap-register-7db4ad01.md
  - .grugops/context/qe2-ABC-117/notes/20261012T051835Z-qe-e2e-decision-abc117-recheck-verdict-da3adce8.md
  - .grugops/context/qe2-ABC-117/notes/20261012T051835Z-qe-e2e-observation-abc117-recheck-readings-da88891b.md
  - .grugops/context/ticket-to-pr-ABC-117/notes/20261012T045300Z-software-engineer-decision-abc117-the-non-epipe-residual-stays-accepted-and-its-one-is-node-not-usage-exit-code-0081a95a.md
  - .grugops/context/cut-residual-followups-2026-08-21/notes/20260821T173000Z-ba-pm-observation-what-i-re-measured-at-my-own-hand-and-the-carrier-that-cannot-exist-7f2a91c4.md
  - .grugops/context/qe-ABC-148/notes/20261012T050010Z-qe-e2e-observation-abc148-comparison-and-gaps-ceabe8d9.md
  - .grugops/context/qe2-ABC-148/notes/20261012T051338Z-qe-e2e-observation-abc148-recheck-paragraph-and-gaps-18ca4c99.md
  - .grugops/context/qe-ABC-116/notes/20261012T061500Z-qe-e2e-decision-abc116-verdict-17cab375.md
  - .grugops/context/qe2-ABC-116/notes/20261012T062637Z-qe-e2e-decision-abc116-recheck-verdict-6a1c2b14.md
supersedes:
---

# BA/PM fold of today's QE gaps on `ABC-145`, `ABC-117`, `ABC-148` and `ABC-116`: `ABC-153` cut, `AR-145-CLI-WIRING` and `QE2-117-a` accepted, dated corrections on five Done pages, `T2` hang-bound question routed

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Branch:** `grugops/bapm-fold-2026-10-12`, from `main` @ `d8794608`. The subtask frontmatter says
  `dde969b6`. `d8794608` is that commit plus the queue-enqueue commit, and the dispatch named it.
- **Nothing was measured.** No test run and no timing. The reads were the QE notes, the pages, and
  `src/cli.test.ts`, `src/cli.ts` and `tools/opening-book/*` at `d8794608`. Two counts were taken
  with `git show … | grep`:
  - `book.test.ts` at `3537fe48`: 9 `it` and 1 `it.each` over 8 rows;
  - `src/cli.test.ts` at `3537fe48` and at `6c2dd121`: `it(` 101 unanchored, `\bit(` 69 anchored,
    `\bexpect(` 324.
- **Every page edit is insertion-only.** `git diff --numstat` shows 0 deleted lines on every page.
  Nothing is struck. No committed note is edited.

## Decisions

1. **`QE-145-a` → cut `ABC-153`** (XS, P3, DoR 10/10, test-only). Cutting beats folding or accepting:
   - No open ticket touches `tools/opening-book/`, so there is nothing to fold into.
   - A board row with a promotion trigger is a carrier this project has watched work: `ABC-149`
     went P3 → P2 by its own trigger when `ABC-152` was cut. A page note is a document someone must
     decide to read, which is the lesson `ABC-116` paid for.
   - `ABC-153` alters each of the five files in turn over five distinct hashes. It kills `M05` and
     a `b`/`c` key swap (`M-SWAP`), and both pass the base test.

   **`QE-145-b` → accepted as `AR-145-CLI-WIRING`, not folded:**
   - Only a spawn pins it, and the file keeps 0 spawns on purpose.
   - A test that reads the source text pins a spelling that a comment satisfies.
   - **Trigger:** any edit to `compile.ts`'s command-line block, a move of `SOURCE_COMMIT` or
     `SOURCE_SHA256`, or a regeneration repeats `ABC-145` `A4`, with an in-place byte flip in a file
     that is not `a.tsv`, read by the hash text.
   - It is carried on `ABC-145`'s page and in `ABC-153`'s § Out of scope.
2. **`QE-145-e` / `QE-145-f`:** dated corrections on `ABC-145` (under `A4`, under § Out of scope, and
   under `A6`). `A4` stays MET on content, because the hash text was in both runs.
3. **`QE-117-b`:** dated corrections on `ABC-117` (under `## Problem`, under `A1`, and under the
   2026-10-10 re-score). The instrument is `^usage: `. `…7f2a91c4` has the same flaw and is
   corrected by reference, not edited.
4. **`QE2-117-a` → accepted, with a record pointer.** The pointer is under `ABC-117` `## Ruling`'s
   named, uncut change, and it sends any cut that closes the residual to `…0081a95a` (ii) and
   `…da3adce8`.
   - No further append-only correction is made at the five sites. Their conclusions are true, and
     QE judged that correcting them would cost more than the imprecision does.
   - The only reader the paraphrase can mislead is that cut, and the pointer is where it starts.
5. **`QE-148-c` / `QE2-148-a`:**
   - A dated correction under `ABC-148` § Delivery `A4` (`\bit(` 69).
   - A dated pointer under `ABC-114` § Out of scope "`D4`'s CLOSE", which is where every page sends
     a `D4`-closing cut. It records at least 11 measured open binders and says to work from the
     mechanism.
   - **No ticket is owed.** Nobody has asked for `D4` to be closed, and the delivered paragraph
     covers the open set by mechanism.
6. **`ABC-116` `C2`:** dated corrections under the `C2` paragraph, under the "by construction"
   paragraph, and under the `## Risks` bullet.
   - "`timeout` (the settle)" is false: `:390` is the bound, and the settle is `sleep
     ${A9_SETTLE_SECONDS}` at `:498`.
   - "Must edit one of them / by construction" is weaker than written: the edit lands in a
     `CHILDREN` entry, a builder body or an argv constant.
   - **`P3` re-stated: NOT `P3` still holds.** Its three premises do not rest on `C2`'s claim. The
     `P3` demotion trigger has not fired, and it keeps both events: the Architect's catalog pointer
     edit alone does not demote, and no unprompted `T2` re-measure has been observed.
7. **Hang-bound `T2` question: routed, not ruled.** Owner: Architect/Design (`ADR-0017` decision 2),
   in flight as `design-2026-10-12-fold` item 1.
   - BA/PM's follow-on, recorded on `ABC-116`'s page: if the bound is added to `T2`, BA/PM appends
     it to the page's canonical `N8-SPAWN` row form, and an SE hop edits the comment line the
     Architect names. Otherwise nothing changes.

## Recommended board moves (the Orchestrator's)

- **`ABC-153` → new row in `Ready`** (XS, P3, EPIC-005, DoR 10/10; promotion trigger on the page).
  Ready WIP goes 1/8 → 2/8.
- **`ABC-145`, `ABC-117`, `ABC-148`, `ABC-116` stay `Done`.** An optional annotation on each row:
  "BA/PM fold merged". The "Follow-ups for the BA/PM fold" / "Owed: BA/PM" clauses are then
  discharged, except that `ABC-116`'s hang-bound question stays with the Architect.
- **Merge note:** the Architect and Scribe hops also append rows at the END of
  `plans/traceability.md`, so expect an append-order conflict at merge. Keep all rows.
