---
kind: adr
id: ADR-0054
---
# ADR-0054: The game's earlier positions reach the search as a read-only list of prior keys, from the CLI and from UCI. A repetition on the search path needs one earlier occurrence, as today; a repetition of a position from before the root needs two

## Status

*2026-10-30:* a **PROPOSED** amendment for `ABC-242` (`QE-230-a`: on a blunder, a root move that makes the third
occurrence scores 0) is at the end of this file. Acceptance is the owner's. Until he answers, decisions 1–8 stand as
written. Pointer added by Architect/Design (task `arch-ABC-242-reading`).

**ACCEPTED** 2026-10-30 by the owner, Olger Oeselg, **as written**. His words, verbatim (Orchestrator note
`.grugops/context/orch-2026-10-29g/notes/20261030T041740Z-orchestrator-decision-3dd61448.md`, a transcription and not a
stamp): *"ADR-0054: accept"*. Recorded by Architect/Design (task `arch-adr-accept-0052-0053-0054`).

- **In force on `main` at `ABC-230`'s merge.** Until then the search sees the root key only, as today.
- **Pointer lines added by this hop:** `ADR-0002` (§ Status, and at clause 3) and `ADR-0044` (§ Status, D2 and D6's
  row). Their texts are otherwise unchanged.
- **Still open, and not this ADR's:** `EPIC-010` Q3, the ep key. The owner asked for more information, and
  `ADR-0020` stands as written. Q1 (Syzygy) is deferred and stays out of `EPIC-010`.
  *(2026-10-30: Q3 is answered (c), verbatim "Q3: c" (`orch-2026-10-29g/…c4ab73de`). It is recorded as `ADR-0020`
  § AMENDMENT 2026-10-30 and built by its own ticket after `ABC-230` merges. From that merge, every key in `priorKeys`
  is a repetition key. Decisions 1–8 here are unchanged. Pointer added by Architect/Design, task `arch-q3c-oq228ii`.)*

Previously **PROPOSED** 2026-10-29 by Architect/Design (task `arch-ABC-230-reading`, records plus probes, at `main`
`989093f3`, whose `src/` tree is `1bf0138a`). The bullets below are kept as written then.

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
  task's decision note. *(2026-10-30: answered (c). `ADR-0020` § AMENDMENT 2026-10-30 removes the uncapturable ep
  file from every key compared against the game's history, here and in `history.ts`'s count. `ABC-230` is not
  re-scoped.)*
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

## Proposed amendment 2026-10-30 (`ABC-242`, `QE-230-a`): on a blunder, a root move that makes the third occurrence scores exactly 0, and its child is not searched. PROPOSED

### Status

**PROPOSED** 2026-10-30 by Architect/Design (task `arch-ABC-242-reading`, records only, at `main` `ee7da249`).
Nothing was built, run or timed at this hop, because a QE timing read may hold the host alone. The facts below were
read from the source and from QE's recorded probe.

- **Acceptance is the owner's.** This amendment adds to accepted text. `ADR-0032` decision 1 (accepted by the owner,
  2026-10-10) gains one scoring bullet, and decision 2's blunder bullet here gains one sentence. The standing ruling of
  2026-10-22 (`…5aaf7cec` item 3) keeps "one that changes or reverses an accepted one" with him. `ADR-0054` itself
  set the precedent: it went to him although it only added to `ADR-0002` clause 3. No agent marks this accepted.
- **The question:** *On a blunder move at levels 1–4, should a root move that makes the third occurrence of a game
  position score exactly 0, without its child search? This applies decision 3's two-match rule to the blunder's root
  moves, in `src/levels.ts` only. The engine path does not change.* The answer that settles it:
  *"ADR-0054 ABC-242: accept"* or *"… decline"*.
- **The default without an answer:** nothing changes. `ABC-242` stays in Backlog, and decisions 1–8 above and
  `ADR-0032` stand as written.
- **On acceptance:** an Architect/Design hop marks this block ACCEPTED, adds a dated line under `ADR-0032` decision 1,
  and adds A5's sentence under decision 2's blunder bullet. The amendment is in force on `main` from `ABC-242`'s merge.
- **Size S, P3.** It changes values at levels 1–4 only, on blunder moves only, and only when the game hands in prior
  keys. There is no smoke pair (§ Consequences).

### Context

- **The gap.** `QE-230-a`, in `qe-ABC-230` `…ba5a249a`.
  - Decision 2 hands each blunder child search `priorKeys` plus the root's key. Decision 3 scans nodes at ply `p ≥ 1`
    only.
  - A child search's root is the position after the root move, at that search's own ply 0. So no search checks it, and
    a root move that makes the third occurrence is scored as if its position were new.
  - **QE's probe** (`qe-ABC-230/raw/spot/blunder-probe.txt`): KQ v K, `4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1` +
    `b1b2 e8d8 b2b1 d8e8 b1b2 e8d8 b2b1`, rate 1, 2 000 ms, `virtualClock(1)`, seed 1. `d8e8` is the third
    occurrence, and the list is `[d8e8 −1013, d8c8 −1030, d8d7 −1020, d8e7 −1010, d8c7 −1031]` with the keys and
    without them. The blunder plays `d8e8`, the strict second-best of that list.
- **The engine path has no such gap at the same move.** A `chooseMove` rooted at the game position sees that move's
  child at ply 1, and decision 3 scores it 0 there (`ABC-230` `A1`, 4 fixtures).
- **Why the check can be exact.** Take a root `R` with list `P`. The engine's scan of a ply-1 node reads the same
  positions as a ply-0 scan of the child against the child's own list `[...P, key(R)]`, and it counts the same
  matches.
  - The ply-0 walk starts at `−4`. In the child's list, `−4` is `P`'s `−3`, which is where the engine's ply-1 walk
    starts (`src/engine.ts:338`).
  - The two lower bounds agree except at the 100-key cap.
  - `key(R)` sits at the child's `−1` and can never match the child, whose side to move differs.
- **Read at this hop:**
  - `src/levels.ts`: `createLevel`'s child-key line (`:143-146`, a repetition key since `ABC-241`, `1f6abec4`) and
    `blunder` (`:155-215`).
  - `src/engine.ts`: `repeatsBeforeRoot` (`:330-342`).
  - The `ABC-078` `A4` export pin (`src/engine.test.ts:504`) and the level module's import pin (`src/levels.test.ts`
    § A8).
  - `src/ladder.test.ts:179` and `tools/rating/rating.ts:377-411`.

### Decision

**A1. Where the check lives: in `src/levels.ts` `blunder`, and nowhere else.**
- `src/engine.ts` and `src/search.ts` do not change. `ADR-0032` decision 1's fence holds.
- `createLevel`'s engine branch does not change.
- No helper is shared with the engine (§ Alternatives).

**A2. The rule.** It applies after a root move is made and before its child search, and only when the level was
handed prior keys. Let:
- `c` be the child's halfmove clock;
- `k` be the child's repetition key, `repetitionKey(child, zobristKey(child))` (`ADR-0020` § AMENDMENT C1);
- `K` be the list the children are handed: `priorKeys` plus the root's key, the one list `createLevel` already builds
  per call.

Count each `e` in `−4, −6, …` with `e ≥ −min(c, |K|, 100)` and `K[|K| + e] === k`. **On two or more matches, the move
scores exactly 0 and its child is not searched.** On one match (a second occurrence) or none, the child search runs as
it does today.
- This is `repeatsBeforeRoot` at ply 0, against the child's list. It is the count the child search would make at its
  own root, and it is decision 3's two-match rule, unchanged, applied at the one node no search scans.
- The walk reads nothing when `c < 4`, because it starts at `−4`.
  - So a capture or a pawn move (clock 0) never matches, and neither do the first three reversible plies.
  - A child with an ep square has clock 0, so it is never compared.
  - Where the walk reads anything, the child has no ep square and `k` is its raw key. The helper is still called, so
    that `C1`'s "every comparison" stays literally true. `k` need not be computed when `c < 4`.
- The 100 is the engine's `PRIOR_KEYS_WINDOW`. `src/levels.ts` restates it as its own named constant, pointing here.
  `engine.ts` does not export that name, and its export pin is not opened for it.
- With no prior keys there is no check, no key and no comparison. An empty list (a bare FEN over UCI) gives a child
  list that holds only the root key, which never matches.

**A3. Why no search, and why 0.**
- The engine returns 0 at a repetition before doing any work (decision 3's order: before the capacity guard and the
  table probe). A root move whose child is a third occurrence is that same node, one level up.
- The skipped child's slice of the shared deadline is not spent. The next child's `deadline − now()` takes it, as
  `ADR-0032` decision 1's one deadline already does after any early return.
- A checkmated or stalemated child can never be a third occurrence, because the game would have ended at its first.
  So the order against `ADR-0032` decision 1's no-legal-move bullet changes nothing. The repetition test goes first,
  as in the engine.

**A4. `ADR-0032` decision 1 gains one bullet, by addition, on acceptance:** *"A child that is the third occurrence of
a game position (`ADR-0054` § Proposed amendment 2026-10-30, A2) is scored 0 without a search."*
- `ADR-0032` decisions 2 and 3, and every other bullet of decision 1, are unchanged. Decision 2 is the strict
  second-best, ties to the first. Decision 3 is the worst class, read on the returned list.
- The returned `scored` list carries the 0. `depth` and `nodes` count the children that ran.

**A5. Decision 2's blunder bullet here gains one sentence, on acceptance:** "The blunder itself scores a root move
whose child is a third occurrence at 0 (§ Proposed amendment 2026-10-30)." The hand-off of `priorKeys` plus the root
key is unchanged.

**A6. The parent-root count stays as decision 2 writes it. It is not in `ABC-242`.**
- Inside a child search, the root `R` is a prior key. A line that returns to `R` therefore needs `R` to have stood
  once more before (two matches). The engine path counts `R` as path (one match).
- By decision 4's own argument, path is the truer count, since the blunder does examine every choice at `R`. But
  counting the last prior key as path is an engine change and a decision 3 amendment. It falls outside `ABC-242`'s
  fence, which keeps the engine path node-equal.
- At the latest, the child sees the return when the cycle repeats on its own path, 4 plies later.
- Its effect on any score is `UNKNOWN - verify`. No ticket is cut for it: P3, levels 1–4, unmeasured.

### Alternatives

- **A root check inside `chooseMove`, enabled only by the blunder path** (a new `EngineOptions` field). Rejected for
  three reasons:
  - it opens `src/engine.ts`, which `ADR-0032` decision 1 fences off;
  - it adds a field to the shipped entry point (`ADR-0024` decision 7);
  - `chooseMove` would still have to return a move for a root it has already judged a draw, which no caller needs.
- **A root check in `chooseMove` for every caller.** Rejected: it changes the engine path's own root (`ABC-242`
  § Out of scope), and it breaks `A6`'s node-equality at levels 5–7 and at UCI's default.
- **One shared helper: export `repeatsBeforeRoot` from `src/engine.ts`.** This would keep a single supplier of the
  walk. Rejected: it edits `engine.ts` against `ADR-0032` decision 1's fence, and it re-pins `ABC-078` `A4`'s export
  list for a level-layer rule. The price of rejecting it is a ply-0 walk of a few lines restated in `levels.ts`.
  `ABC-242` `A1`–`A3` pin that walk's count, clock bound and parity against base, so a drift between the two copies
  turns them red.
- **Search the child, then replace its score with 0.** Every other entry would then equal base's exactly, a stronger
  `A1` pin. Rejected: it spends a slice on a search whose result is thrown away, and it departs from the engine's
  order (the repetition test before any work). The strong pin comes back through a fixture whose third-occurrence
  move is last in `legalMoves` order (`ABC-242`, Architect reading).
- **A draw on one match (the path rule).** Rejected by decision 4 and probe H2: a second occurrence is not a draw.
  `ABC-242` `A2` is the row that catches it.
- **Counting `R` as path inside the child searches** (A6). Not in this ticket: it is an engine change.

### Consequences

- **The files `ABC-242` touches:**
  - `src/levels.ts`: the check, a private helper, the 100-key constant, the header's blunder lines and `blunder`'s
    doc;
  - `src/levels.test.ts`: the `A1`, `A2`, `A3`, `A5` and `A6` rows;
  - `src/cli.test.ts` and `src/uci-session.test.ts`: `A4`.
- **Not touched:** `src/engine.ts`, `src/search.ts`, `src/level-seam.ts`, `src/uci-session.ts`, `src/cli.ts`,
  `src/history.ts`, `src/gameend.ts`, `src/zobrist.ts`, `tools/`, `data/`.
  - `levels.ts` gains no import. `zobristKey` and `repetitionKey` are already imported, so the § A8 import pin holds.
  - It gains no export, so `G9` and the engine export pin hold.
- **What stays the same, node for node:**
  - every search at levels 5–7, every non-blunder move, and UCI `go` at the default;
  - every blunder call with no prior keys or with an empty list;
  - every blunder call in which no root move makes a third occurrence. The check reads no clock and runs no search, so
    the keyed list equals base's keyed list.
- **What changes:** a blunder call with a third-occurrence root move.
  - That move's entry is 0.
  - The entries scored before it in `legalMoves` order are exactly base's, because their clock readings are the same.
  - The entries after it may differ, because they inherit the skipped slice.
- **Cost (`NFR-004` / `G5`, `NFR-009`):**
  - each root move, when keys are handed in, costs at most one repetition-key computation and ≤ 49 comparisons
    (`e = −4 … −100`);
  - a check that fires saves a child search;
  - nothing is allocated per root move. The list is the one `createLevel` already builds, and the level layer's sum
    clamp is unchanged.
- **Rows that must stay green unedited:**
  - the `ABC-230` and `ABC-241` rows in `src/levels.test.ts`. Their prior keys are synthetic (`11n…`, `21n…`) and
    never match, so every child is still searched;
  - `QE-087-b`, the engine export pin, the `ABC-078` `A3` corpus and the ladder lane.
- **The smoke reading (`EPIC-010` § The merge rule): none.**
  - `tools/rating/rating.ts` gives skytalix no `Skill Level` (`:377-387`), so every D, R and batch move is level 5's
    engine path.
  - **Correction for `ABC-242` `A8`:** the ladder lane (`src/ladder.test.ts:179`, `choose(h.position)`) hands in no
    prior keys, so it plays base's code under this change too. It is an identity row, not a playing check on the
    change. `A1`–`A5` are the only reads of the changed behaviour.
- **UAT** is owed (production lines in `src/levels.ts`). The QE verdict signs it.

### Rollback

Delete the check. The blunder path is then `main`'s at `ee7da249`, node for node. Nothing is persisted, so nothing
migrates.
