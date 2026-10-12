---
id: 20261012T125400Z-software-engineer-decision-deliver-decorator-stop-at-wiring-1e971b4d
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-095
at: 2026-10-12T12:54:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ADR-0012
  - ADR-0036
  - ADR-0037
  - 20261012T125300Z-software-engineer-observation-wiring-reds-merged-criteria-ef39c9a6
supersedes:
---

# Deliver the decorator and its criteria. Stop at the wiring line rather than edit four merged criteria.

This note is hand-authored and unsealed.

**Test note 1 is satisfied.** The search is spy-able without touching an engine module. `withBook(probe, inner)` takes the
inner `EngineSeam` as an argument (`ADR-0012` clause 6(c)), and the tests pass a counting stand-in. `A6` does not fire.

**Delivered** (commit `521a8513`):
- `src/book-engine.ts`: `withBook(probe: BookProbe, inner: EngineSeam): EngineSeam`, one expression,
  `probe.bookMove(history.position) ?? inner(history)`. `bookMove` is called once, never `inBook` then `bookMove`,
  so a miss pays for one lookup. The module has two type-only imports and holds no randomness (`ADR-0012` 3(b)). It
  sits flat in `src/` (clause 8). It has no try/catch, because the probe's contract is that it never throws (`src/book.ts`
  header), and a catch would handle a case that cannot occur.
- `src/book-engine.test.ts` holds `A1`, `A3`, `A4`, `A5`'s game half and `A6` (5 tests).

**`A4`'s reading of "ply n − 1 and ply n".** The game is 1. e4 e5 (the e5 is the book's, under `seededRandom(95)`), then
2. Ke2, which is out of book at ply 3 (asserted). I compare the last frame at ply 2, the last position the book answered
into, with the last frame at ply 4, the first position the search answered into. The row is also asserted over the
whole game: one row count, and no row or sink write that matches `/book/i`.

**`A6` as a test.** The test is the decorator's import list: exactly two type-only imports. The diff half is a git reading.
`git diff --numstat main..521a8513` over the engine, search, evaluation, quiescence, TT, levels, virtual-clock,
turn-loop, book and `data/` paths gives **0** lines. Spawning `git` in the default lane would break `NFR-008`'s 0-spawn pin.

**Not delivered: `A7`, `A5`'s stream half (both `CLI_DEEP` rows), and the `src/cli.ts` line.** Wiring needs rulings on
the four merged rows in `…ef39c9a6`. The census and regex pins would move mechanically. Bar 4 (security) and the three
substituted-engine Givens would not, and changing them is weakening another ticket's criterion. That is outside this
hop.

**`ADR-0036` limb.**
- On the **delivered** diff, clause (b) **does not fire**. The one production file has no limb token, and its imports are
  type-only, so (b2)'s "value or bare import" does not count them.
- On the **attempted** wiring, **(b1) fires**: `import { readFileSync } from "node:fs"` and a `process.stderr` line in
  `src/cli.ts`.
- If the read moves to a new holder module, the limb becomes (b2).

**Mutants** (the decorator, run against the file):
- "search always called, book move preferred" is killed by `A1` and `A4`;
- "an empty stderr write on a miss" is killed by `A3`;
- `?? inner ?? inner` survives, and it is **equivalent**: a resolved `Move` is never nullish.
