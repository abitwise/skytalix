# arch-ABC-302 decision: ABC-302's DoR row 10 is met. R1, R2, R4, R5, R8 and R9 take form S; R3, R6 and R7 take W. R8 goes to uci-session's ENGINE_DEEP, and R9 takes option (ii). Option (b) does not bind, and there is no owner question. The forecast is about −0.50 s of wall

Architect/Design, task `arch-ABC-302`.
- The readings are in this task's observation note. The rules are the PREREG `…23abb6c5`.
- The authoritative record is `ADR-0046` § Dated 2026-11-04 (`arch-ABC-302`), with its Status pointer.
- Every form here is one the page carries (S, W, or R9's option (ii)), so the page needs **no re-cut**, only the lines below.

## The forms (each row by title; the ADR table carries the remnants' ms)
| row | form | lane | the default-lane remnant | A6 mutant (QE freezes) |
|---|---|---|---|---|
| R1 | S | `SEARCH_DEEP` (own file) | the in-check root and position-5, both recursions to depth 4, the three asserts unchanged (made > 100; 210 at base) | M1 |
| R2 | S | `ENGINE_DEEP` (own file) | the same asserts on a 500 ms virtual step | M2 |
| R3 | W | `SEARCH_DEEP` (own file) | — | none on the list (R3 kills 0 of 27). Carry M3 and M3s as the holders' control |
| R4 | S | `ZOBRIST_DEEP` (own file) | the same walk at 1 ply | M4 (plus M4z) |
| R5 | S | `ENGINE_DEEP` (own file) | the same equality on a 10 000 ms counting clock, readings > 2 (8 at base) | M5 (plus M5c) |
| R6 | W | `ENGINE_DEEP` (own file) | — (holders: A10 and `QE-087-d (slice)`) | M6 |
| R7 | W | `ENGINE_DEEP` (own file) | — (holder: levels A6 "at rate 0 returns `chooseMove`'s …") | M7n (plus M7) |
| R8 | S | **`src/uci-session.test.ts`'s `ENGINE_DEEP`** | the same three reads on a 500 ms virtual step, with the direct call's depth ≥ 5 asserted (8 at base) | M8d |
| R9 | S, **option (ii)** | `ENGINE_DEEP` in its own file, by its `-t` line | the same body on a clock spent after `2 * ITERATIONS` root passes | M9 (plus M9r) |

- **A6's frozen list is the PREREG's 27 killed mutants:**
  - mine: M1, M2, M2s, M3, M3s, M4, M4z, M5, M5c, M6, M6t, M7, M7n, M8d, M9 and M9r;
  - `QE-244-a`'s five: F230, QSEAMRAW, QPRIOROFF (re-anchored), QMATCH3 and QTRIM1;
  - the rest of the ABC-241 rows' sets: REP0, S241M1, QMATCH1, UNTRIM, S241M6 and QUCINOKEYS.
  The control for each is the base default lane. M1p is out, because nothing kills it.
- **R6 and R7 against `ABC-281`'s `QE-087-d (slice)`, as the brief asked.**
  - It does hold R6's guard: it kills M6, the per-instance seed, along with A10.
  - It does not hold R7's: it is level 1's draw order, and R7 is the rate-0 path. Levels A6 holds R7's.
- **R3 is blind to futility** (observation note). Moving it loses no measured kill. A row that isolates futility on the shipped path would be a separate test-only ticket. It is not proposed here.

## `-t` lines (each "1 passed", 0 failed)
R1 and R3–R7 are as the page cuts them. R2's line names the page's describe. Add these two:

```
ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts -t "ABC-241 A4, A7 — the CLI: a third occurrence through an uncapturable ep square \[deep, ENGINE_DEEP=1\]"
ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.capacity.test.ts -t "ABC-122 A8: src/engine\.ts's KEY_ARRAY_CAPACITY guard, reached through chooseMove\(\) \[deep, ENGINE_DEEP=1\]"
```

R9's parentheses must be escaped. Unescaped, `()` is an empty group, the pattern no longer matches, and the run reports 0 tests. Each of the nine joins `ADR-0046`'s run-rule table (rule item 3).

## Owed lines for BA/PM (DoR row 10 and the page)
- **The DoR line:**
  > 10 ✅ 2026-11-04, Architect/Design (`arch-ABC-302`; `ADR-0046` § Dated 2026-11-04 (`arch-ABC-302`)): R1, R2, R4, R5, R8 **S**; R3, R6, R7 **W**; R8's full row to `src/uci-session.test.ts`'s `ENGINE_DEEP` block; R9 **S** under option (ii). Default-lane kill parity was measured on 27 mutants (PREREG `…23abb6c5`), so option (b) does not bind and there is no owner question. DoR 10 of 10: Ready.
- **Title and Problem.** "Each with a default-lane remnant" holds for six rows. R3, R6 and R7 take W, and their holders are named above.
- **A1.** The files are the eight test files plus `AGENTS.md` and the command log:
  - `src/search.null-move.test.ts`;
  - `src/uci-session.test.ts`;
  - `src/search.futility.test.ts`;
  - `src/zobrist.test.ts`;
  - `src/engine.test.ts`;
  - `src/levels.test.ts`;
  - `src/cli.test.ts`;
  - `src/engine.capacity.test.ts`.
  The Part 2 targets are `uci-session` and R9's own file.
- **A2.**
  - "Byte-identical" reads "once the nesting indent is removed" (`qe-ABC-281`'s ruling). One `biome-ignore format` line, outside the body, is allowed on R1's deep `it`.
  - R9 under (ii) is waived by name: its file gains `const RUN_DEEP = process.env.ENGINE_DEEP === "1"`.
  - Each deep describe repeats its row's small fixtures. They are not the row's body.
  - The default describe's now-unused `STEP_MS` in R2's describe moves with the row.
- **A3.**
  - The lane total is base − 3 (2 684 at `fed3f2b4`'s 2 687).
  - `search.futility` goes −1, and `levels` −2: names out, none in.
  - Each S file has one name out and one in. `cli` stays 109, and `uci-session`'s default stays 230.
- **A4.** A file's full deep lane reads base + its S remnants + the rows moved in from another file. W adds 0. At `fed3f2b4` that is:
  - null-move 45 → 46;
  - futility 53 → 53;
  - zobrist 33 → 34;
  - engine 83 → 84;
  - levels 58 → 58;
  - uci-session 241 → 243;
  - `engine.capacity` 1 → 2, which has no `AGENTS.md` line; its `-t` line is its lane.
  These are defined counts. The passed counts are QE's to read.
- **A5.** null-move "45 rows" becomes **46**, and futility "47 tests" becomes **53**. The 47 was already stale at base, and W leaves 53. Both changes are 0 B.
- **A8.** The expected head is about 9.3 s (base − 0.50 s). The 9.4 s target is a target, as the Orchestrator ruled.
- **`R-302-a`: closed** (owner Architect/Design).

## SE build lines (binding, with ADR-0046's conditions; `raw/tip.py` is a working sketch, `tsc` green)
1. **Placement.** Each full row is defined only under its file's existing constant, inside a describe titled the original describe's title plus the suffix. The `it` title is byte-identical. Unset, the row is not defined.
2. **Placement after the constant.**
   - `src/uci-session.test.ts` declares `RUN_ENGINE_DEEP` at about :2159, and `src/zobrist.test.ts` declares `RUN_DEEP` at about :339.
   - Their deep describes go after those lines, because a reference above a `const` throws at load.
   - R2's and R8's deep describes each repeat their fixtures (FEN, MOVES, `STEP_MS = 100`, `gameOf`, and `lastHanded` or `labelOf`, `seamOf` and `scoreWith`).
   - No runtime import is added. Type `scoreWith`'s game without a new runtime import (`ReturnType<typeof gameOf>`, or a type-only import).
3. **Nested placement.** R1, R3 and R5 nest an `if (RUN_DEEP) describe(…)` inside the original describe, so the helpers (`IN_CHECK_ROOT`, `deepenTo`, `countingClock`) stay one copy.
4. **The remnants.** Each takes its row's place, its title states what it samples, and it asserts non-vacuity:
   - **R1:** "the in-check root and position-5, search() to depth 4 and chooseMove deepened to 4: every null move is made out of check, with three or more pieces".
   - **R2:** "A5 (slice): on a 500 ms virtual step, …". The seam and the UCI `go` both use 500.
   - **R4:** "holds at every node 1 ply from every perft position". It is `checkEpComponent(…, 1)`, with the three non-vacuity asserts.
   - **R5:** "on an infinite budget and a 10 000 ms counting clock, maxDepth 1000 returns within the same consultation count". It adds `expect(without.consultations).toBeGreaterThan(2)`.
   - **R8, in `src/cli.test.ts`:** "A4 (slice): on a 500 ms virtual step, with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not". It covers the seam, the direct call and the hash-list call, all at 500, plus `expect(direct?.depth).toBeGreaterThanOrEqual(5)`. That assert is what keeps M8d, which bites from iteration 5. The describe's A7 row stays at 100 (`QE-244-a`).
   - **R9:** "on a clock spent after 2 x ITERATIONS (260) root passes, …". It is the row's body with `PASSES` replaced by `2 * ITERATIONS` in its clock.
5. **R6 and R7** move whole: each describe goes under `if (RUN_DEEP)`, titled plus " [deep]". **R3** goes into its nested deep describe, with no remnant.
6. **Comments** cite only `ABC-302`, `secnfr-nfr008-1104`, `arch-ABC-302` and `ADR-0046`.
7. **`AGENTS.md` and the command log**, per A5.
8. **The builder's checks:**
   - lint, typecheck, `npm test` (2 684, 0 skipped) and the nine `-t` lines at 1 passed;
   - each S remnant kills its A6 mutant on a scratch copy, if the SE varies the remnant (ADR-0046 condition 1).

## Owner question
None. No NFR level, bar, cap, pin, W, worker count, environment variable or `AGENTS.md` lane line moves, and option (b) does not bind.
