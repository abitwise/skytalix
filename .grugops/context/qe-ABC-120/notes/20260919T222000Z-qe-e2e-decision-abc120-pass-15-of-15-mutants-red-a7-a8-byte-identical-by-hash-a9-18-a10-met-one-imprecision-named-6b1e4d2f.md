---
id: 20260919T222000Z-qe-e2e-decision-abc120-pass-15-of-15-mutants-red-a7-a8-byte-identical-by-hash-a9-18-a10-met-one-imprecision-named-6b1e4d2f
kind: decision
by: qe-e2e
at: 2026-09-19T22:20:00Z
verified_by:
confidence: high
refs:
  - ABC-120
  - ADR-0021
  - ABC-019
  - ABC-114
  - EPIC-006
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
  - plans/tickets/ABC-120-the-turn-loop-gains-quit-and-take-back-arms.md
  - .grugops/context/ticket-to-pr-ABC-120/notes/20260919T192500Z-software-engineer-claim-four-gates-green-at-d8e7ccc-42-files-1297-tests-0-skips-18-of-30-production-lines-a7d3c5e2.md
  - .grugops/context/ticket-to-pr-ABC-120/notes/20260919T192000Z-software-engineer-observation-a6-two-mutants-watched-red-on-a3-a4-a5-and-green-on-a1-a2-raw-output-8e5b2f61.md
supersedes:
---

# `ABC-120` QE verdict: **PASS** — gates reproduced at 42 / 1297 / 0, 15 of 15 mutants red on named rows, `A7`/`A8` byte-identical by hash, `A9` recounted at 18, `A10` met with one imprecision named and NOT corrected

**NOT A STAMP.** `context.human_admission` is `off` and no `finding` is admissible on this install
(`AGENTS.md`); this is QE's hand-authored `decision`. Everything below was RUN on branch
`grugops/qe-ABC-120`, created from `grugops/wave-2026-09-19` @ `babc1b2` (which carries the build
`d8e7ccc` via the merge `ec160b6`; base for every diff is `20ad7cb`), in an isolated worktree with the
main checkout's `node_modules` symlinked. Load average during the run: 4.3–7.5 (two sibling hops live:
Security/NFR on `ABC-034`, the Architect ruling on `ABC-079`). **QE added zero tests and changed zero
lines under `src/`; every mutant was reverted and `git status --porcelain -- src` asserted EMPTY after
each one.** Raw harnesses and JSON summaries sit beside this note as `raw-*.txt`.

## Gates at the tip — every Software Engineer figure reproduced, none moved

| gate | command | result |
| --- | --- | --- |
| lint | `npx biome check .` | exit 0 — `Checked 76 files in 124ms. No fixes applied.` (0.69 s) |
| typecheck | `npx tsc --noEmit` | exit 0, no output (1.60 s) |
| build | `npx tsc --noEmit` (the build slot's command) | exit 0 (1.24 s) |
| unit | `npx vitest run --dir src` | exit 0 — **42 files / 1297 tests / 0 failed**, duration 5.04 s (wall 5.51 s, load 4.5) |
| skip count | `--reporter=json` → `numPendingTests + numTodoTests` | **0** (pending 0, todo 0, failed 0, 263 suites) |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| the file alone | `npx vitest run src/turn-loop.test.ts` | 63 / 63, tests 55 ms, duration 292 ms |
| the NFR file | `npx vitest run src/turn-loop.nfr.test.ts` | 4 / 4 (byte-identical to base — `A8`) |

## Mutation result — 15 mutants, every one red on a named `ABC-120` row, no survivor

The Engineer's two (`M1`, `M2`) reproduced to the row and the message; the subtask's seven (a)–(g)
added; six more beyond the minimum. Raw rows and first failure messages are in the sibling
`observation`. Summary (rows red in `src/turn-loop.test.ts` + `src/turn-loop.nfr.test.ts`, 67 rows):

| mutant | rows red |
| --- | --- |
| `M1` take-back then `continue`, no derive (Engineer's) | `A3` (stale `{ by: 'white' }`), `A4` (5 ≠ 6 derives), `A5` (1 ≠ 2) — **3** |
| `M2` take-back routed into 7/8/9 (Engineer's) | `A3`, `A4` (4 moves ≠ 2), `A5` — **3** |
| (a) `quit` renders a frame before exiting | `A1` (3 frames ≠ 2), `A3` (11 ≠ 10) — **2** |
| (b) `quit` writes `INPUT_ENDED_NOTICE` | `A1` (`'input ended\n'` ≠ `'quit\n'`) — **1** |
| (c) `quit` returns `exitCode: 1` | `A1`, `A3` (outcome) — **2** |
| (d) take-back of N takes back N−1 | `A3` (outcome: engine-threw — the fixture's next token is not an engine move), `A4` (1 move ≠ 2) — **2**; `A5` green (−1 clamps to a no-op at ply 0) |
| (e) take-back leaves `moves`/`keyHistory`/`repetitionCounts` stale (position rewound, list re-pushed) | `A3` (stale claim), `A4` (4 ≠ 2) — **2**; `A5` green (nothing to remove at ply 0) |
| (f) `messages` dropped on the post-take-back render | `A4` (`['', '']` lacks `took back 2`) — **1** |
| (g) the derive runs TWICE on take-back (a second supplier) | `A3` (11 ≠ 10), `A4` (7 ≠ 6), `A5` (3 ≠ 2) — **3** |
| `Mh` `quit` arm removed (falls into 7/8/9) | `A1`, `A3` — **2** (by `TypeError` in the render seam: `messages` undefined) |
| `Mi` `QUIT_NOTICE = "resigned"` | `A2` (`not to contain 'resign'`) — **1** |
| `Mj` `quit` returns `result: "draw"` | `A1`, `A3` — **2** |
| `Mk` take-back `plies` ignored (`takeBack(history, 0)`) | `A3`, `A4` — **2** |
| `Ml` `QUIT_NOTICE = INPUT_ENDED_NOTICE` | `A1` (`not to contain 'input ended'`), `A2` (`not to be`) — **2** |
| `Mn` `quit` swallowed (`messages = []; continue`) | `A1` (**`Error: input seam read past \`quit\``** — the throw-on-third-read guard fires), `A3` (11 ≠ 10) — **2** |

Control (`M0`): 67 / 67. `A1`/`A2` stayed green under every take-back mutant and the take-back rows
stayed green under every quit mutant except where the fixture's own trailing `quit` shares the edge
(`A3`) — the guard discriminates the two edges, exactly as `A6` asks. Final `grep -rn MUTANT src` finds
only pre-existing prose in five test files (none in `src/turn-loop.ts`); `git status -- src` empty.

## Criteria — each answered by measurement, not by re-reading the Engineer's note

- **`A1`–`A5`, `A7`** — six rows in `describe("ABC-120 acceptance …")`, 63 / 63 green in the file;
  each mutant above reds the row the criterion names. **MET.**
- **`A6`** — `M1`/`M2` reproduced RED on `A3`/`A4`/`A5` and green on `A1`/`A2`, message for message
  with the Engineer's transcript. **MET.**
- **`A7` by hash** (`raw-a7a8a9-summary.json.txt`): `TerminalReason` block sha256 `8a2d0604…` at both
  base `:78-83` and tip `:78-83` — identical; `LoopOutcome` body, comments stripped, `a2179867…` at
  base `:155-173` and tip `:167-186` — identical (raw block differs only in the re-worded doc
  comments); `readonly exitCode: 0;` unchanged; `INPUT_ENDED_NOTICE = "input ended"` unchanged;
  `PromptOutcome` members 7 → 9; `EVERY_TERMINAL_REASON` size 10 asserted by the `A7` row. **MET.**
- **`A8` by hash**: `TABLE` block `d65ce53b…` at base `:753-883` and tip `:762-892` — identical; rows
  14/17/18 `b25bce1a…` at base `:895-941` and tip `:904-950` — identical; `A3b` body `955f3c2a…`
  identical (title narrowed one word, `non-advancing` → `non-mutating`); `src/turn-loop.nfr.test.ts`
  git blob `ab9bbdd1…` at both — byte-identical; `git diff --name-only 20ad7cb..HEAD -- src/` →
  exactly `src/turn-loop.test.ts`, `src/turn-loop.ts`; lane 42 / 1297 / 0 (base 42 / 1291 / 0, +6
  rows, +0 files). **MET.**
- **`A9` recounted by QE's own method** — every `+` line of `git diff -U0 20ad7cb..HEAD --
  src/turn-loop.ts` (86) minus blank lines and lines whose trimmed text begins `*`, `/**`, `*/` or
  `//`: **18** added non-comment lines, of which **8** are re-indented copies of a `-` line (the move
  path moved inside the `else`) and **10** are genuinely new (two union members, the constant, the
  three-line `quit` branch, the `take-back` `if`, `takeBack(...)`, `} else {`, and the 7/8/9
  `messages =` at its new depth — its old-depth twin is now the `take-back` branch's own line and git
  shows it as context, not `+`). 18 ≤ 30; 10 ≤ the ADR's "~16". **MET; `ADR-0021` is NOT re-opened.**
- **`A10`** — `grep -c "sixteen transitions"` **0**; `grep -c "only on end-of-input"` **0**; `grep -ci
  "non-mutating"` **3** (two in the `runTurnLoop` docblock, one at transition 14's comment); "the
  sixteenth" **1** (allowed). Census read against the union: see the ruling below. **MET.**

## `A10` ruling — the "7 non-advancing / 5 emit" census that excludes `game-over`: RIGHT under the criterion, one imprecision of convention, NOT a false sentence

The union has nine arms. Read as a plain predicate, **eight** of them do not advance a ply — `move`
is the only one that does, and `game-over` returns before any ply. The docblock says "SEVEN of these
do not advance a ply — `rejected`, `ambiguous`, `command`, `claim`, `eof`, `quit` and `take-back` —
and FIVE of the seven emit a frame". Ruling:

1. **The sentence enumerates the seven by name and asserts nothing about `game-over`;** it is true of
   every arm it names. It does not say "only seven" and does not say `game-over` advances a ply.
2. **The number is the ticket's own and the ADR's own.** `A10` pins "the number the union has (7)"
   and `ADR-0021` clause 5 says "Seven outcomes are now non-advancing and five of them emit a frame".
   The convention is older than both: `ABC-019`'s docblock counted "FOUR" (before `claim`) and
   `ABC-021`'s "FIVE … only four emit" — `game-over` was never in that census, because the term
   "non-advancing outcome" in this file has always meant the arms that go back to `rendering` or on
   to `exiting` without a ply, not the terminating arm. The Engineer's reading is the record's.
3. **So: RIGHT under `A10`, and the `ABC-114` standard is not met against it** — a false sentence is
   narration a build falsifies, and no build falsifies an enumeration that is true of each member.
   What it carries is an **imprecision of convention** (a reader outside this file could count eight),
   recorded as `G1-INFO` below. A hop that "corrected" it to eight would fail `A10`'s literal 7 and
   contradict `ADR-0021` clause 5; if anyone wants it airtight, the pen is BA/PM's or a later ADR's,
   and the fix is one clause naming where `game-over` sits, not a new number.

The other two docblocks and the transition-14 comment, read against the code: `LoopOutcome.result`
"null when … stdin ended, the player quit, or the engine seam failed" — true (`engine-threw` and
`engine-failure` both return `result: null`); `reason` "null on end-of-input and on quit. An engine
failure has a reason but no result" — true; `runTurnLoop` "eight states and eighteen transitions" —
true; the cadence `1 + plies + take-backs + re-emitting non-mutating outcomes` — checked on `A1` (1 +
0 + 0 + 1 = 2), `A3` (1 + 8 + 1 + 0 = 10), `A4` (1 + 4 + 1 + 0 = 6) — true; "a non-mutating outcome
is not re-evaluated — 7, 8, 9 and the refused claim" — true (`Mg` shows the derive count is exact);
transition 14's "one derive per ply, ONE per take-back, and none at all on a non-mutating outcome" —
true (`M1`, `Mg`, `A3b`).

## Gaps (none blocking)

- **`G1-INFO`** — the census convention above: "SEVEN of these do not advance a ply" is true by
  enumeration and pinned by the criterion; a plain-predicate count is eight. Named, not corrected.
- **`G2-INFO` — one sentence with a second counter-example, inherited verbatim from `ADR-0021` clause
  4.** `src/turn-loop.ts:285`: "it is the only edge into `evaluating-terminal` that does not come from
  `applying`". `ABC-019`'s own enumeration has **transition 1, `initialising` → `evaluating-terminal`**
  (the `let status = gameStatusOf(history)` before the loop, commented "Transition 1 → 2" at `:297`).
  So there are two such edges, and the sentence is true only if "edge" is read as an edge out of
  `awaiting-human` / inside the loop body. Not one of `A10`'s named greps or counts, no assertion
  rests on it, and the ADR carries the same words — **recorded per `ABC-114` (find, name, do not
  author the correction: the pen and the verdict stay separate).** The one-word fix, when a hop with
  the pen takes it, is "the only edge FROM A PROMPT into `evaluating-terminal`" or "the only in-loop
  edge"; it belongs to whoever amends `ADR-0021` clause 4 and the docblock together.
- **`G3-INFO`** — mutants (d) and (e) are invisible to `A5` by construction (at ply 0 there is nothing
  to take back: `plies − 1 = −1` clamps to a no-op, and the re-pushed list is empty). `A3`/`A4` catch
  both; no row at ply 0 can, and none should be added for it.
- **`G4-INFO`** — `Mh` (the `quit` arm removed) dies by a `TypeError` in the render seam, not by
  `A1`'s throw-on-third-read guard; `Mn` was added so that guard was watched firing (`Error: input
  seam read past \`quit\``). Both red; recorded so nobody reads `Mh` as evidence for the guard.
- **`NFR-008` NOT RULED here** (subtask fence: three hops read > 15 s at load ≥ 7; a quiet re-measure
  is owed elsewhere). Data only: the lane's own `Duration 5.04s` at load 4.5–5.4 with two siblings live.
- **Not covered, by fence:** `src/command-input.*`, `src/line-input.*`, `src/cli.ts` untouched and not
  exercised — the real `quit`/`new`/`undo` tokens, the confirmation and the boundary refusal are
  `ABC-046`'s and `ABC-102`'s; nothing end-to-end reaches transitions 17/18 until they land, and no E2E
  was written for a path that does not exist yet.

**Recommendation: `ABC-120` MAY LEAVE `In Review`.** Production lines > 0 (`src/turn-loop.ts` in the
non-test list, measured from git), so the 2026-08-17 UAT waiver does NOT apply — the owner's word is
needed at `In UAT`. Not merged, not deployed; `plans/board.md` and `AGENTS.md` untouched (fenced).
