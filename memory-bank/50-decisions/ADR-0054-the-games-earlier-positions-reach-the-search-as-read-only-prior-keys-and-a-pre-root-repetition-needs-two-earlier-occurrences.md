---
kind: adr
id: ADR-0054
---
# ADR-0054: The game's earlier positions reach the search as a read-only list of prior keys, from the CLI and from UCI. A repetition on the search path needs one earlier occurrence, as today; a repetition of a position from before the root needs two

## Status

**PROPOSED** 2026-10-29 by Architect/Design (task `arch-ABC-230-reading`, records plus probes, at `main` `989093f3`,
whose `src/` tree is `1bf0138a`).

- **Acceptance is the owner's.** The standing ruling of 2026-10-22 (`…5aaf7cec` item 3) keeps "a new ADR, or one that
  changes or reverses an accepted one" with him. This ADR adds to `ADR-0002` clause 3 (ratified by the owner,
  2026-07-30) and amends `ADR-0044` D2 and D6 (accepted by the owner, 2026-10-18). The Orchestrator may not accept it
  under the delegation. No agent marks it accepted.
- **What it amends.**
  - `ADR-0002` clause 3, **by addition, not reversal.** The clause already says the per-ply array is "seeded once per
    search from the history module". `main` seeds the root key only (`src/engine.ts:549`). Decisions 1–4 below say
    how the earlier keys arrive and how they are scanned. Clauses 1, 2 and 4 are untouched.
  - `ADR-0044` D2: the UCI session's import list gains `zobrist.ts`, and the session holds the prior keys beside its
    position. `history.ts` stays out of the session.
  - `ADR-0044` D6: the row "game-history repetition seen by the search" leaves the "not in v1" table. D6 names
    exactly this ADR's route: "an `ADR-0002` clause 3 amendment".
  - The amended ADRs' texts are not edited here. On acceptance, an Architect/Design hop adds a dated line to each that
    points here.
- **What it does not touch.** `ADR-0020` (the ep key, `EPIC-010` Q3, a separate owner question). `ADR-0025` (the
  table is still cleared per search). `ADR-0026` (decision 7 below: no switch, no door pair). `src/history.ts`, its
  game-end threefold and `gameStatus`. The book. Quiescence.
- Built by `ABC-230`. No code changes because of this ADR. The probes ran on scratch copies of `main`'s `src/`,
  never on `src/`. Evidence: `.grugops/context/arch-ABC-230-reading/raw/`.

## Context

- **The gap** (SA `sa-ideas-verify/…306a4012` rows 3a–3c, 3e). `repeatsInPath` scans the search's own key array
  (`src/search.ts:129-138`), and that array holds the root key only. Both surfaces search `history.position` alone
  (`src/level-seam.ts:17`; `src/uci-session.ts:119-141` replays the moves and keeps the final `Position`). So the
  search cannot see that a move repeats a position from earlier in the game.
- **The cost** (SA `sa-ABC-226/…cc53fc79`). 1 718 of 4 199 R and D games ended by threefold, and in every one the
  first occurrence lay before the root of the search that completed it. 461 of them were drawn from a skytalix
  score of +100 or more (26 in R). In 23 more, skytalix stood at −100 or worse, could have repeated, did not, and then
  lost (5) or drew anyway (18). Together that is 484 games.
- **The fences.**
  - `ABC-081` `A6`: no delivered search module (`search.ts`, `engine.ts`, `transposition.ts`, `quiescence.ts`)
    imports `src/history.ts`. The keys are handed in.
  - `ADR-0011` clause 3 (the guard in `src/history-pane.nfr.test.ts`): only `turn-loop.ts` and `cli.ts` may hold a
    runtime import of `history.ts`. A module that can have something injected is not licensable.
  - `ADR-0044` D2: the UCI session imports no `history.ts` and builds no `GameHistory`.
- **Facts read at this hop.**
  - `makeNullMove` sets the halfmove clock to 0 (`src/apply.ts:183`). So no scan bounded by the clock crosses a
    null move.
  - `makeMove` sets an ep square only on a double push, which also resets the clock (`src/apply.ts:136-140`).
  - `src/history.ts` `keyHistory` already returns the game's keys, root last. Its header names it as this clause's
    seam.

## Decision

1. **The data: `priorKeys`, a read-only list of `bigint` Zobrist keys.** They are the keys of the game's positions
   **before** the root, oldest first, with the root's own key excluded. The list holds at most
   `min(root halfmove clock, 100)` keys, the reversible window, capped at the fifty-move window (`ABC-230` `A5`). It
   enters the engine as an optional field of `EngineOptions`. Absent or empty, the search is today's, node for node.
   - One pure helper trims a full key list (oldest first, root last) to that window. Both surfaces call it. The
     engine also reads at most the last 100 entries, whatever it is handed. Where the helper lives and what it is
     called are the Software Engineer's choice; one helper is not.
   - **The engine does not copy the list.** It reads the caller's array for the length of one `chooseMove` call. The
     search stays single-threaded (`ADR-0044` D5), so nothing writes to the array during that call. `ABC-081` `A6`'s
     "one key array per search" rows stay at 1. `NFR-009` grows by at most 100 keys.
   - A castling-rights change does not cut the window. No key from before it can equal a key after it, because the
     castling component differs, so those keys are never matched. The halfmove clock is the only cut.
2. **Where it is built.**
   - **CLI:** `cli.ts` (licensed) injects `history.ts`'s `keyHistory` into the level seam. `level-seam.ts` calls it
     on the `GameHistory` it is handed, trims with the helper and passes `priorKeys` on. `level-seam.ts` gains no
     runtime import of `history.ts`, and the licence set stays `["turn-loop.ts", "cli.ts"]`.
     - `createLevel` passes `priorKeys` to its engine-path `chooseMove`.
     - On the blunder path (levels 1–4), each child search gets `priorKeys` plus the root's key. One list is built per
       blunder call.
     - `createEngine` in `src/engine.ts` has no production caller and stays history-free.
   - **UCI:** `parsePosition` keeps the key of every position it replays through (`zobristKey`, or the
     `zobristKeyAfterMove` chain), trims with the helper, and returns the list with the position. The session holds it
     beside `position`. `ucinewgame`, a refused `position` and `position fen <F>` with no moves set it to empty. It is
     passed to `chooseMove` and to `createLevel` exactly as on the CLI. This is the `ADR-0044` D2 amendment.
   - **A bare FEN has no history.** `position fen <F>`, and a CLI game started from a FEN, see only what was played
     after `F`. A FEN carries a clock, not earlier positions (SA row 3e). That stays explicit (`ABC-230` `A3`).
3. **The scan: one loop, two counts.** This is the binding semantics. At a full-width node at ply `p ≥ 1` with key
   `k` and halfmove clock `c`:
   - **On the path (unchanged):** `keys[e] === k` for any `e` in `p−4, p−6, …` with `e ≥ max(0, p − c)` scores a
     draw. The root, `keys[0]`, counts as path, as today.
   - **Before the root (new):** the same backward walk continues below 0, in steps of 2, while `e ≥ p − c` and
     `e ≥ −L`, where `L` is the number of prior keys read. `e = −1` is the position one ply before the root. It counts
     the matches. **Two or more matches score a draw. One does not.**
   - Equivalently, a node scores a draw if its position stood once on the path (root included) or twice before the
     root. The draw score is exactly 0, as for every repetition today. Contempt stays out of scope.
   - The order inside the node is unchanged: the repetition test comes before the capacity guard and before the table
     probe (`src/engine.ts:291-299`, `src/search.ts:402-411`). Quiescence keeps no keys and scans nothing, as today.
   - `src/search.ts`'s fixed-depth `search()` and every test-only door take no prior keys. They stay the reference
     recursion, unchanged.
4. **Why two before the root and one on the path.** A cycle on the path is a draw by the usual argument: the side
   that gains by leaving the cycle can already leave it at the cycle's first occurrence, and the search examines that
   choice. A position from before the root is different. Its first occurrence is history, and the choice made there is
   not searched again. A second occurrence of it is not a draw, and the opponent need not repeat a third time. So the
   search scores the game's own rule: the third occurrence. Probe H (`raw/`):
   - **H1** (KQ v K, Black to move; Ke8 would be the third occurrence): base plays Kc8 at −1006. With prior keys, the
     search plays Ke8 at 0 under either count.
   - **H2** (the same position, Ke8 would be the second occurrence): the rule above keeps Kc8 at −1006. A one-match rule
     plays Ke8 and scores 0, a draw that does not exist, because White simply plays on.
   - Both measured classes are covered by the rule above. In SA `A3`, skytalix completed the threefold from a won
     score (or let the opponent complete it): the third occurrence now reads 0, so a better move is kept. In SA `A4`,
     skytalix declined an available third occurrence from a lost score: that move now reads 0, so it is taken.
5. **The table.** No rule changes. A node that repeats returns before it probes or stores, as today. A parent whose
   value used a repetition draw stores that value under its own key. That is the path-dependence every
   repetition-aware search with a table already has, and `main` already has it for path cycles. The prior keys are
   fixed for one search, and the table is cleared at each search's entry (`ADR-0025` d4). So no entry outlives the
   history that shaped it.
   - **Constraint recorded for later:** if `ADR-0025` d4's "keep the table across a game" amendment (accepted, not in
     force; `ABC-209` closed unmerged) ever ships, it must handle entries shaped by one move's prior keys being read
     at the next move. It is not this ADR's to solve.
6. **What changes values, for the merge rule's smokes.**
   - **Unchanged, node for node:** every search with no prior keys, so a bare FEN, the benchmark positions, the
     `ABC-078` `A3` corpus, `G6`'s `kiwipete` and `position-6`, and every fixed-depth `search()` and door. Also
     unchanged: every search whose root clock is 0, whatever it is handed (probe H4, H5).
   - **Changed:** the root score and move of a game search whose tree reaches a position that already stood twice in
     the reversible window, and the work of any search whose tree reaches a position that stood there at all (probe
     H3: 1 853 → 1 850 nodes, same move and score).
   - So `ABC-230` is **value-changing**, and `EPIC-010` § The merge rule applies: the smoke pair, S-1 to S-4, with the
     count of smoke games that end by repetition, candidate against base.
7. **`ADR-0026` decision 10 does not apply.** That pattern (a switch, a pair of test-only doors, a bounded drift
   oracle) is for a value-changing **heuristic**, whose correct value nobody can state. This is an input with an
   exact meaning. Its absence is base, so the "door" is the absent field, and no new export is needed. Its value is
   pinned exactly, by acceptance rows instead of a drift bound:
   - the fixture rows score the third-occurrence move at exactly 0 and base scores it otherwise (`ABC-230` `A1`/`A2`);
   - a second-occurrence row keeps base's score (probe H2: the one-match rule is the bug this catches);
   - identity rows: no prior keys, node-equal to base (`A3`, `A4`); prior keys handed in with the root clock at 0,
     node-equal to base (H4);
   - the bound rows: at most 100 keys handed in from a 600-ply list (`A5`); a prior key older than the clock is never
     matched.
8. **Cost.** A node scans before the root only when `c > p`. The scan then makes at most `min(L, c − p)/2` ≤ 50
   comparisons more than today. `ADR-0002` measured the backward scan at 29–62 ns at 20–40 entries (M3). On this host
   the cost is `UNKNOWN - verify`. It is zero on every benchmark position, so `G6` cannot move because of this change.
   The time a game search spends on it is read by smoke S-2 and is not otherwise bounded here.

## Alternatives

- **One match before the root scores a draw** (the path rule, extended unchanged; `ABC-230` § Scope item 3 as worded).
  It is the simplest loop. Rejected on probe H2: it reads 0 at a second occurrence, which is not a draw. That leads a
  losing side to a repetition the opponent will not complete, and it leads a winning side away from a harmless
  second occurrence. Both measured classes are covered without it.
- **Seed the prior keys into the per-ply array itself** (a prefix, with the root at a fixed offset). This is
  `ADR-0002` clause 3 read literally, and it keeps one array. Rejected: every `keys[ply]` access in both recursions
  moves to an offset, `search()` changes with them, and the two counts still need two loops. A separate read-only list
  changes one function and one field.
- **Copy the prior keys into a per-search `BigUint64Array`.** Rejected: a second allocation per search (the `ABC-081`
  `A6` rows count 1), for no gain. The list is at most 100 keys and is read-only during the call.
- **The engine derives the keys from a `GameHistory` itself.** Rejected: `engine.ts` may not import `history.ts`
  (`ABC-081` `A6`), and a second replay outside `history.ts` would be a second supplier of the key list, which is the
  thing `ADR-0002` names as the place a bug will live.
- **Change `EngineSeam` to `(history, priorKeys)`.** Rejected: it changes `ADR-0012`'s seam, `book-engine.ts` and
  every seam test, to pass data the level seam can get by injection.
- **Ask `gameStatus` per node.** Rejected by `ADR-0002`'s own rollback text: if the search wants `gameStatus` per
  node, clause 3 is violated.

## Consequences

- **Files `ABC-230` touches:**
  - `src/engine.ts`: the field, the scan, and probably the helper;
  - `src/search.ts`, only if `repeatsInPath` is the function extended. `search()` itself passes nothing;
  - `src/levels.ts`, `src/level-seam.ts`, `src/cli.ts` (one injection), `src/uci-session.ts`.
  - Not touched: `src/history.ts`, `src/turn-loop.ts`, `src/zobrist.ts`, `src/transposition.ts`,
    `src/quiescence.ts`, `src/book*.ts`.
  - **Overlaps:** `ABC-235` edits `src/engine.ts` and `src/search.ts`. `EPIC-009`'s `ABC-220`/`ABC-221` edit
    `src/uci-session.ts`. Whichever merges second rebases.
- **Tests that must still pass unchanged:** the `ABC-081` `A6` import and allocation rows, the `ADR-0011` licence
  equality, `ABC-078` `A3`, and every node pin on a bare FEN. A red in any of these is a build fault, not a re-pin.
- **The ep interaction (Q3).** The search compares keys under `ADR-0020` d1. A position whose first occurrence carries
  an uncapturable ep square is counted one occurrence late (`ADR-0020` d2). cutechess counts with an ep-normalised
  key, so in those games the arbiter declares the threefold one occurrence before the search sees it. SA `A6` counted
  22 such games of 1 718 (all D, 0 R). `ABC-230` ships on today's key either way; Q3's options are recorded in this
  task's decision note.
- **Quiescence stays blind.** After `ABC-228` (`ADR-0053`), a leaf in check searches quiet evasions, and one of them
  can re-enter a prior position without being scanned. That is rare and existed before this ADR. `UNKNOWN - verify`;
  it is not in scope.
- **Security (`RISK-EPIC010-06`).** The UCI move list now feeds the search. What the search reads is bounded at 100
  keys (`A5`). The parsing is unchanged. The transient key list while replaying is one `bigint` per move of a line the
  session already accepts.

## Rollback

Delete the field and the scan's second loop, and stop passing the list. The search is then `main`'s, node for node:
the identity rows above prove it. Nothing is persisted, no data file or book key changes, and the table is cleared
per search, so a rollback is one revert with nothing to migrate. Reverting only the count (two matches to one) is a
one-character change, and probe H2 is the row that would red.
