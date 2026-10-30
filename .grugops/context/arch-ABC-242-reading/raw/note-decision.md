# Architect/Design decision, arch-ABC-242-reading: the blunder path checks its root moves for a third occurrence in `src/levels.ts`; PROPOSED (owner)

Records only, at `main` `ee7da249`, on branch `grugops/arch-ABC-242-reading`. Nothing was built, run or timed. The
text is `ADR-0054` § Proposed amendment 2026-10-30. Pointers were added to the § Status of `ADR-0054` and `ADR-0032`,
and an Architect-reading block was added to `ABC-242`.

## Ruling
- **Where:** in `src/levels.ts` `blunder`, after the root move is made and before its child search. `src/engine.ts`,
  `src/search.ts` and `createLevel`'s engine branch are untouched, so the engine path is node-equal by construction.
- **The rule:**
  - `k` is `repetitionKey(child, zobristKey(child))`.
  - `K` is the children's list: prior keys plus the root key, the one list already built.
  - `c` is the child's clock.
  - Count `K[|K|+e] === k` for `e = −4, −6, …`, `e ≥ −min(c, |K|, 100)`. **Two or more matches: score exactly 0, with
    no child search.**
  - This is `repeatsBeforeRoot` at ply 0, against the child's list. It equals the engine's ply-1 count from the
    game root, except at the 100-key cap.
- **Why skip the search:** this is the engine's order (repetition before any work). The skipped slice flows to the
  next child through `ADR-0032` d1's single deadline.
- **Rejected:**
  - a `chooseMove` root check (blunder-only or for all callers): it opens `engine.ts` and adds an `EngineOptions`
    field;
  - exporting `repeatsBeforeRoot`: it edits `engine.ts` and re-pins `ABC-078` `A4`;
  - search-then-override: a wasted slice;
  - the one-match rule (probe H2).
- **The parent-root count:** ruled out of `ABC-242`. It stays as `ADR-0054` d2 is written. Changing it is an engine
  change, and its effect is `UNKNOWN - verify`.

## Status: PROPOSED, the owner's
- It adds a bullet to `ADR-0032` decision 1 (owner-accepted 2026-10-10) and a sentence to `ADR-0054` decision 2. The
  2026-10-22 standing ruling, item 3, keeps changes to accepted ADRs with him. The in-scope reading ("ADR-0054 d4
  already intends this") was considered and rejected, because d1's scoring text changes.
- **The question:** "On a blunder move at levels 1–4, should a root move that makes the third occurrence of a game
  position score exactly 0, without its child search? The engine path does not change." Answer: "ADR-0054 ABC-242:
  accept / decline". Default: nothing changes, and `ABC-242` stays in Backlog.

## For the SE and BA/PM
- **Files:**
  - `src/levels.ts`: the check, a private helper, a named 100 constant, and docs. No new import or export.
  - `src/levels.test.ts`: `A1`, `A2`, `A3`, `A5`, `A6`.
  - `src/cli.test.ts` and `src/uci-session.test.ts`: `A4`.
- **Expected values** (QE probe set-up; order `d8e8 d8c8 d8d7 d8e7 d8c7`):
  - **A1:** `d8e8` scores 0 (base −1013), and 4 child searches run for 5 moves. Entries 1–4 are `UNKNOWN - verify`
    (they inherit the slice). If they keep base's values, the move played is `d8e7`, kind `blunder`.
  - **A2:** one match, so the list equals base's keyed list exactly.
  - **A3:** child clock 1 reads nothing, so the list equals base's exactly.
  - **A6:** with no keys or empty keys, the result equals base's exactly.
  - Recommended: one extra A1 fixture whose third-occurrence move is last in `legalMoves` order. That gives a
    full-list exact pin.
- **Size S stands. S2, no smoke, fits:** `rating.ts` sets no `Skill Level`. **Correct `A8`:** the ladder lane hands in
  no prior keys (`src/ladder.test.ts:179`), so it is an identity row, not a playing check of the change.
