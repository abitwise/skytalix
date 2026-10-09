---
id: 20261009T164755Z-architect-design-decision-what-the-engineer-changes-what-ba-pm-folds-owner-word-owed-33e5e0a3
kind: decision
by: architect-design
at: 2026-10-09T16:47:55Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-081
  - ABC-079
  - ABC-083
  - ABC-121
  - ADR-0028
  - plans/tickets/ABC-082-evaluation-pawn-structure.md
  - plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
  - 20261009T164755Z-architect-design-decision-ruling1-row21-mislabelled-replace-the-pair-level-unchanged-f0115510
  - 20261009T164755Z-architect-design-decision-ruling2-row17-legitimate-tree-move-a2-relevelled-to-10pct-owner-word-8c0fee21
  - 20261009T164755Z-architect-design-decision-ruling3-row8-keep-the-refound-search-fixture-4fdb96bc
supersedes:
---

# What the Engineer changes on `grugops/ABC-082-pawn-structure`, what BA/PM folds, and the one owner word owed

Hand-authored, no `seal`. This role edits no `src/`, no ticket criteria and no board. The wording
of every fold below is BA/PM's.

## The Engineer (re-hop on the build branch, Workflow 04)

1. **Ruling 1: now, no owner word needed.** In `src/quiescence.test.ts`, change two FENs. Names,
   `losing` moves and the level are unchanged.
   - `:206` `4k3/8/8/8/8/b7/1p6/1R2K3 w - - 0 1` → `4k3/6p1/8/8/8/b7/1p6/1R2K3 w - - 0 1`
   - `:218` `1r2k3/1P6/B7/8/8/8/8/4K3 b - - 0 1` → `1r2k3/1P6/B7/8/8/8/6P1/4K3 b - - 0 1`
   - One short comment may point at `…f0115510` (why g7/g2: the recapture must not be a dead
     draw).
2. **Ruling 2: stage now; it merges only after the owner accepts `ADR-0028`.** In
   `src/transposition.test.ts`:
   - `:384` and `:402`: `toBeGreaterThanOrEqual(0.15)` → `toBeGreaterThanOrEqual(0.1)`;
   - `:375`: the describe text, "at least 15%" → "at least 10%";
   - The two A2 comments (`:376`–`:379`, `:388`–`:393`) gain the `ABC-082` readings and a pointer
     to `ADR-0028`: position-3 16.22%, kiwipete 15.63%, position-6 14.46%.
   - Keep this as one hunk, so a refusal is one revert.
3. **Ruling 3: nothing.** The `A4_SEARCH_FEN` hunk stands.
4. **No production line changes, and no weight changes.**
5. **Re-run:**
   - `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` (expect 37 / 37, A1 depth 3 at 0/24);
   - `SEARCH_DEEP=1 npx vitest run src/transposition.test.ts` (expect 40 / 40);
   - `npm test`, `npm run lint`, `npm run typecheck`, then skip-count and integrity.
   - The other five deep lanes are unaffected: no file they read changes.
6. **`A8` ledger (page § Delivery, the Engineer's section):**
   - Row 21 becomes "fixture re-found, level unchanged", with base and branch margins 370 / 280,
     citing `…d25a0383` and `…f0115510`.
   - Row 17 becomes "re-levelled ≥ 15% → ≥ 10% under `ADR-0028`, on the owner's word", citing
     `…8c0fee21`.
   - Row 8 becomes "(b) upheld", citing `…4fdb96bc`.

## BA/PM (Workflow 07)

1. **`ABC-082` page.**
   - `A8`'s clause "no class R row's level or bar changed" gains one carve-out: `ABC-081` `A2`,
     re-levelled under `ADR-0028` once the owner accepts it.
   - § Merged bars:
     - row 17 becomes "re-levelled, `ADR-0028`, owner's word";
     - row 21 becomes "fixture re-found, level unchanged (`ADR-0028` decision 2)";
     - row 8's reading (b) is ruled upheld.
   - The Out-of-scope bullet "Re-levelling any ratio bar…" points at `ADR-0028` for how a red R
     row is ruled.
   - Size and DoR are unchanged: this is a ruling on the build, not new scope.
2. **`ABC-081` page (Done).**
   - `A2`'s "≥ 15%" gains a dated re-level line: ≥ 10%, `ADR-0028`, the owner's acceptance date,
     and readings 15.63% / 14.46%.
   - It is an amendment line on a closed ticket, not a re-open.
   - Fold only after the owner's word.
3. **`ABC-079` page (Done).** `A1`'s corpus gains a one-line pointer: the "R takes a pawn a bishop
   defends" pair was re-found at `ABC-082` (`…f0115510`).
4. **`ABC-083` page.** Its class-R rows (or its equivalent of § Merged bars) are ruled by
   `ADR-0028` once accepted. It inherits these thin rows by name:
   - `ABC-081` `A2` at 10%, with no second headroom (decision 4);
   - `ABC-078` `A4` 10-tick at the ≥ 6 bound (Engineer `…b92fa204`);
   - the four dead-draw pairs in `HANGING_CORPUS` (`…d25a0383`).
5. **Pre-existing side finding, to route, not part of `ABC-082`.** `HANGING_CORPUS`'s "R takes a
   bishop a pawn defends" pair has the side to move in check (Ba5+ / Ba4+), on base too.
   - The corpus header says it must not be. The row titled "none of them in check" only asserts
     legality.
   - The row still tests something, because the losing capture also answers the check.
   - Remedy is BA/PM's to cut, size XS: move the bishop off the king's diagonal, re-measure, and
     make the title's claim an assertion (`isInCheck` false). `ABC-084` "extends" this corpus,
     so it is a natural home.

## The owner's word owed: exactly one

**Accept `ADR-0028`.** That acceptance is the word that moves `ABC-081` `A2` from ≥ 15% to ≥ 10%. He
accepted that criterion at 15% on 2026-09-25.
- Rulings 1 and 3 need no owner word: no level moves.
- The `NFR-005` kiwipete depth-7 WARN is a separate word, Security/NFR then the owner. No ruling
  here changes it.

## Sequencing (the Orchestrator's)

`ABC-082` can come out of `Blocked` for the Engineer's re-hop now (items 1–6). It cannot leave
`In Review` toward merge until the owner has accepted `ADR-0028`, or has refused it and the A2
hunk is reverted. A refusal keeps `ABC-082` Blocked on row 17.
