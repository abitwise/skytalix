---
id: ABC-120
title: The turn loop gains a `quit` arm and a `take-back` arm — transitions 17 and 18, the arm ticket `ADR-0021` clause 8 says lands FIRST
status: ready
column: Ready
size: S
priority: P1
epic: EPIC-006
feature: —
---

# ABC-120 — two new `PromptOutcome` arms in `src/turn-loop.ts`, and the rows that guard them, because nothing existing does

> **Cut 2026-09-19 by BA/PM** (task `wave-2026-09-19`, subtask `cut-arm-ticket`, Workflow 03 — one
> ticket from one ruling). **The authority is `ADR-0021`** (accepted 2026-09-19 on the owner's verbatim
> word *"5. b, resign should be separate"*), **clauses 8 and 9**; this page does not re-open it. The
> arms were measured out-of-tree by Architect/Design (`.grugops/context/ruling-abc046-quit-arm/notes/`,
> an unstamped `observation`): **+16 lines, 40 files / 1213 tests / 0 red — the arms redden NO existing
> guard.** That is the whole reason this ticket has acceptance criteria at all.
>
> **THE ID IS `ABC-120`, NOT `ABC-118`.** The subtask said *"last known ABC-117"*; the record says
> otherwise — `ABC-118` and `ABC-119` are minted on the unmerged branch `grugops/cut-050-exclude-and-g06`
> (`81add97`, 2026-08-21, not an ancestor of this branch). Reusing either would collide at merge. The
> gap is deliberate and this line is its record.
>
> **Zero files under `src/` are touched by this cut.** Every line number below is read at
> `4f0ef01` (`src/turn-loop.ts`, 392 lines — byte-identical to the `2c96dbd` the ADR cites).

## Problem

**The user:** the player at the real prompt who types `quit`, `new` or `undo`. **The pain, measured
and on the board:** `quit` is advertised by `help` and does nothing (`ABC-112`, `P1`); `new` and `undo`
do not exist (`ABC-046`, `ABC-102`). **All three turn on one missing mechanism:** `PromptOutcome`
(`src/turn-loop.ts:125-132`) has no arm for a command that ends the session **without a chess result**
and no arm for a command that **mutates the game without advancing a ply**. `eof`'s notice is the
literal `input ended` (`:176`), which is a false sentence for a player who typed `quit`; transitions 7,
8, 9 skip `evaluating-terminal` by design (`:342-346`), so a reset or a take-back routed through
`command` renders the discarded game's draw-claim cell (`src/status-panel.ts:187-216` reads it from the
passed `status`).

**Why it is its own ticket:** `ABC-046` `## Out of scope` and `ABC-102` `## Out of scope` both fence
*"changing `src/turn-loop.ts` … is its own ticket, not a quiet edit"*, and `ADR-0021` clause 8 keeps
that fence. `src/turn-loop.ts` is a `Done`, gated, mutation-tested module with its machine enumerated
at 8 states / 16 transitions (`ABC-019` `## Scope`, `ABC-021`); re-opening it is priced and guarded
here, once, so the two command tickets never touch it.

**The value:** it unblocks `ABC-046` and `ABC-102` (both `8/10 ⚠️×2` on exactly this fact) and fires
`ABC-112`'s cancel trigger — three board rows move on one ~16-line change.

## Scope

Exactly `ADR-0021` clauses 2–5, in two files:

1. **`src/turn-loop.ts`** (+~16 production lines; the ADR's falsifier is **~30**, see `A9`):
   - `PromptOutcome` gains `| { readonly kind: "quit" }` and
     `| { readonly kind: "take-back"; readonly plies: number; readonly messages: readonly string[] }`.
   - `export const QUIT_NOTICE` — **the literal is RULED HERE: `"quit"`.** It names quitting, is one
     line, is not `INPUT_ENDED_NOTICE`, and carries none of the ten `TerminalReason` words nor `win` /
     `draw` / `resign` / `checkmate` / `stalemate` (`src/cli.ts`'s `INTERNAL_ERROR` rule). `ABC-046`
     `A3` asserts inequality **against the exported constants**, so a later product re-wording is one
     literal on this constant and re-cuts nothing.
   - **Transition 17** — after the `eof` branch (`:311-315`): `quit` → `sink.write(`${QUIT_NOTICE}\n`)`,
     return `{ result: null, reason: null, exitCode: 0 }`. **No frame.**
   - **Transition 18** — before the `!== "move"` branch (`:342`): `take-back` →
     `takeBack(history, outcome.plies)`, `messages = outcome.messages`, fall through to the ONE derive
     line transition 14 already uses (`:390`); the move path's four lines move inside an `else`. **No
     guard on `plies`** — `takeBack` clamps at zero by its own floor (`src/history.ts:95-105`); the
     boundary refusal is `ABC-102`'s product rule and lives in the seam (`ADR-0021` clause 4, coding
     rule 8).
   - **Three docblocks re-worded in the same change so the file carries no false sentence**
     (`ABC-114`'s lesson): `:104-124` (the arm census — *"FOUR of these do not advance a ply"* → seven,
     five of which emit a frame), `:155-173` (`reason` is `null` *"only on end-of-input"* → on
     end-of-input and on quit), `:246-262` (*"Eight states and sixteen transitions"* → eighteen; the
     cadence becomes `1 + plies + take-backs + re-emitting non-mutating outcomes`; *"FIVE outcomes are
     non-advancing and only four emit"* → seven / five; *"non-advancing outcome is not re-evaluated"*
     → **non-MUTATING**).
2. **`src/turn-loop.test.ts`** — rows for `A1`–`A8` below, plus the test-seam tokens they need
   (`scriptedSeams`, `:258-287`, already maps `board` → `command` and `claim` → `claim`; it gains
   `quit` → `{ kind: "quit" }`, `new` → `{ kind: "take-back", plies: history.moves.length,
   messages: [] }`, `undo` → `{ kind: "take-back", plies: 2, messages: ["took back 2"] }` — **test
   seam tokens, not grammar**; the real tokens are `ABC-046`'s and `ABC-102`'s). `A3b`'s title narrows
   one word (`non-advancing` → `non-mutating`); its numbers do not move.

## Out of scope

- **`COMMAND_TABLE`, `src/command-input.*`, `src/line-input.*`, `src/cli.ts`, `src/result-screen.ts`,
  `src/history.ts`, `src/gameend.ts` — byte-identical** (`A8`). The `quit` confirmation flag, the
  `undo` boundary refusal and its wording, and the real tokens are `ABC-046`'s and `ABC-102`'s.
- **`src/turn-loop.nfr.test.ts` — byte-identical.** Its *"derives ZERO times on a non-advancing prompt
  outcome"* row drives `rejected` only (7/8/9, unchanged), so its numbers (41 / 0) and its sentence
  stand for what it exercises (`ADR-0021` clause 10).
- **An eleventh `TerminalReason`, a `LoopOutcome` discriminant, a ninth state, a `plies` guard,
  routing `take-back` through `applying`** — all REJECTED in `ADR-0021` § Alternatives; not re-argued.
- **`ABC-045` (`resign`)** — separate on the owner's word; uses the existing `game-over` arm.
- **Handling a take-back that lands on a terminal status.** Transition 18 routes through
  `evaluating-terminal`, so transition 3 would fire on the true status; the scenario is argued
  unreachable (a game that ended has no prompt) and is `ADR-0021`'s third pre-registered falsifier,
  not this ticket's branch (coding rule 8).

## Acceptance criteria

All in `src/turn-loop.test.ts` through the existing `run()` harness (`:447-490`) with `gameStatus`
spied (`derivesMade()`, `:530`). "Derives" = `gameStatus` calls; "frames" = render-seam calls.

- **`A1` (transition 17 — `quit` ends the session with no result, no frame, no further read).**
  **Given** the start position, human white, script `["board", "quit", "e2e4"]`, **when** the loop
  runs, **then** outcome is exactly `{ result: null, reason: null, exitCode: 0 }`; frames = **2**
  (`quit` re-emits nothing); the sink's LAST write is exactly `` `${QUIT_NOTICE}\n` `` and contains
  exactly one non-empty line; **no write anywhere in the run contains `INPUT_ENDED_NOTICE`**; the last
  event is `"input"` (no engine call, no frame after it); `e2e4` is never read (the scripted cursor
  stops at index 2 — assert by a seam that throws if called a third time); derives = **1**;
  `history.moves.length` = 0.
- **`A2` (`QUIT_NOTICE` is exported and obeys the four constraints).** `QUIT_NOTICE` is importable
  from `./turn-loop.ts`; `QUIT_NOTICE !== INPUT_ENDED_NOTICE` (asserted on the two constants, never
  a substring); it contains no `"\n"`; and, lower-cased, it contains **none** of the ten
  `EVERY_TERMINAL_REASON` values (`:218`) and none of `win`, `draw`, `resign`, `checkmate`,
  `stalemate` — asserted by a loop over that array plus the five words, so a deleted value cannot
  pass silently.
- **`A3` (transition 18 on a CLAIMABLE fixture — the stale claim cell is cleared by ONE derive).**
  **Given** the start position, script `[...cycles(2), "new", "quit"]` (the third occurrence is
  claimable by white at frame 9 — `A4`'s own fixture, `statuses[8].claimable` defined), **when** the
  loop runs, **then** `statuses[9].claimable` is **`undefined`**; `statuses[9].result` is
  `"in-progress"`; frames = **10** (1 + 8 + 1); derives = **10** (1 + 8 + 1, none for `quit`);
  `history.moves.length` = **0**; `toFen(history.position)` = `START_FEN`;
  `keyHistory(history).length` = **1**; `repetitionCounts(history)` has exactly **one** entry with
  count **1**. *(Three rewound together — `ADR-0002` clause 2 — asserted as three numbers because a
  build that rewinds the list and not the key list passes any one of them.)*
- **`A4` (transition 18 with a message — two plies back, the message reaches the next frame and
  leaves with it).** **Given** script `["e2e4", "e7e5", "undo", "g1f3", "g8f6"]`, **then** after the
  run `history.moves.length` = **2** (two on, two off, two on); frames = **6** (1 + 2 + 1 + 2);
  derives = **6**; frame 4's message region contains `"took back 2"` and frames 5–6's message regions
  are empty (`A5b`'s shape); `toFen` after the `undo` frame equals `START_FEN` — captured from the
  render seam's `history` at frame 4, not after the run.
- **`A5` (take-back of 0 plies at ply 0 — one derive, one frame, nothing else).** **Given** the start
  position and script `["new"]`, **then** frames = **2**, derives = **2**, `history.moves.length` = 0,
  `toFen` = `START_FEN`, `keyHistory(history).length` = 1, events =
  `["frame", "input", "frame", "input"]`, outcome `{ null, null, 0 }` (the `eof` after the script).
- **`A6` (the no-re-evaluation mutant is WATCHED RED before the rows are trusted).** A build whose
  `take-back` branch calls `takeBack` and `continue`s **without** `status = gameStatusOf(history)`
  (shape (a)'s defect) must fail `A3` on `statuses[9].claimable` (reads the stale `{ by: "white" }`)
  and `A4`/`A5` on the derive count, and must **stay green on `A1`**. The delivery note records the RED
  output verbatim, then the restored green — the guard discriminates the take-back edge from the quit
  edge. A mutant that routes `take-back` into the transitions-7/8/9 branch must red the same rows.
- **`A7` (`A14`'s ten and every unchanged type).** `EVERY_TERMINAL_REASON` still has size **10** and
  `TerminalReason` (`:78-83`) is byte-identical; `LoopOutcome` (`:155-173` body, comments aside) is
  byte-identical — `exitCode: 0` stays a literal type; `INPUT_ENDED_NOTICE` is still `"input ended"`;
  `PromptOutcome` has exactly **nine** members (a `satisfies`/exhaustive-switch assertion, so a tenth
  arm is a type error rather than a surprise).
- **`A8` (the eighteen scripted rows, every frame count, and every other file are unchanged).**
  The `TABLE` block (`:753-883`) and rows 14/17/18 are **byte-identical** (`git diff` on that range
  empty); `A2`, `A3`, `A3b`'s numbers, `A5`, `A5b`, `A6`, `A8`, `A8b`, `A9`, `A9b`, `A10`, `A10b`,
  `ABC-021` `A1`–`A9` — all assertions byte-identical, titles may narrow one word;
  `git diff --name-only <base>...HEAD -- src/` lists **exactly** `src/turn-loop.ts` and
  `src/turn-loop.test.ts`; `src/turn-loop.nfr.test.ts` byte-identical; lane green, skip **0**,
  file count **40**, test count **1213 + the rows added here** (recorded, not rounded).
- **`A9` (the size falsifier `ADR-0021` pre-registered).** `git diff --numstat <base>...HEAD --
  src/turn-loop.ts` shows **≤ 30 added non-comment lines** (expected ~16 + the `else` re-indent).
  Above 30, **stop and re-open `ADR-0021` before merge**, not after — the shape is larger than ruled.
- **`A10` (no false sentence survives in the file).** In `src/turn-loop.ts`: `grep -c "sixteen transitions"` =
  **0** (*"the sixteenth"* at `:248` may stay — it names `ABC-021`'s edge truthfully);
  `grep -c "only on end-of-input"` = **0**; `grep -ci "non-mutating"` ≥ **1** in the
  `runTurnLoop` docblock; the arm-census docblock names both new arms and the number of non-advancing
  outcomes it states equals the number the union has (**7**), with the number that emit a frame
  (**5**). Read the three docblocks against the union at the QE hop; a count that disagrees is a
  criterion failure, not a nit.

## Dependencies

- **None blocking. Pullable today.** `ADR-0021` is `accepted` and on this branch's history
  (`memory-bank/50-decisions/ADR-0021-…md`). `ABC-012` (`takeBack`, `keyHistory`,
  `repetitionCounts`), `ABC-019`, `ABC-021`, `ADR-0002` are all merged and supply the whole mechanism.
- **Downstream, by name:** `ABC-046` and `ABC-102` **must land after this** (their `A8` says
  `src/turn-loop.ts` byte-identical on their own diffs); `ABC-112` is cancelled when `ABC-046` is
  pulled (its own trigger; the board move is the Orchestrator's). **`ABC-045` is independent** — it
  edits `src/command-input.*`, which this ticket does not open; either order.
- **No file overlap with `In Development`:** `ABC-034` (parser rejections, `EPIC-003`) and `ABC-079`
  (quiescence, `src/search.ts`) touch neither file here.

## Risks

- **The two new edges are unguarded until this ticket's rows exist — measured, not feared.** The arms
  alone are 1213/1213 green. `A6`'s watched-RED round is the only evidence the rows guard anything;
  a delivery that skips it has delivered `A1`–`A5` as prose.
- **`NFR-008`'s headroom is 60 ms, not 650.** See `## NFR / security` — the per-ticket bar and the
  lane's total are different questions and the smaller one binds.
- **The docblock re-wordings are where a false sentence ships.** `A10` greps for the three specific
  phrases; a hop that re-words to something equally false but differently spelled passes the grep and
  fails the read-against-the-union clause — that clause is why `A10` is a criterion, not a note.
- **`A7`'s nine-member assertion is new surface.** A later ticket adding an arm must edit it; that is
  the point — the union is enumerated at `ABC-019` and this makes the enumeration executable.

## Test notes

- Lane: `npx vitest run --dir src` (never the repo root). Single file while iterating:
  `npx vitest run src/turn-loop.test.ts`. Gates: `npm run lint`, `npm run typecheck`, `npm run build`,
  unit. Skip-count capture per `AGENTS.md` `## Test integrity`; `.grugops/test-skips.md` is
  human-owned — read and run, never write.
- **Mirror the existing seam idiom.** `scriptedSeams` already turns `board`/`claim` into outcomes
  without a grammar; the three new tokens do the same. Do not import `src/command-input.ts` into
  this file — that is `ABC-046`'s wiring and it would make these rows red on that ticket.
- **`A3`'s fixture exists:** `cycles(2)` from `START_FEN` is `A4`'s own claimable-at-frame-9 line;
  `SHUFFLE_FEN` + `shuffle(2)` (`ABC-021` `A1`) is the alternative. Use the one the row reads clearest.
- **`A6`'s mutant is planted in a copy outside the repository** (`node_modules` symlinked), run to
  RED, and the RED transcript pasted into the delivery note; `src/` on the branch never carries it.
- **`A4`'s FEN-at-frame-4 is read inside the render seam**, not after the run — after the run two
  more plies are on. The harness's `statuses[]` / `frames[]` are copies; a `history` snapshot is not,
  so `toFen` it at render time.
- **`takeBack` is imported into the test via the partial `history.ts` mock** (`:118`); spy it only if
  a row needs the call count — none above does.

## NFR / security

- **`N8-LANE`, in `ADR-0014` decision 4's form — measured ms, then clause state.** **0 new test
  files**; the rows above are ≤ 6 in-process runs of ≤ 16 plies each on a spied `gameStatus` — the
  same shape as `A4`/`ABC-021` `A1`, each ≤ ~10 ms of CPU. **At delivery: `<measured> ms` CPU** as the
  median of paired per-round deltas (n ≥ 7, order rotated, identity null control ≤ 1.5%), against the
  **≤ 650 ms** ticket bar. **Clause state at the cut: `NFR-008` CPU is `≤ 15 s` (`ADR-0019`, the
  owner's word) and reads MET BY 60 ms at `2c96dbd` (14.940 s, n = 8, null −0.37%)**; wall 4.385 s
  REPORTED, NOT RULED (`ABC-111`). **So the effective bar for this ticket is `min(650 ms, the CPU
  headroom re-measured at the delivery base)`, and a delivery that reads over the headroom reports a
  lane breach rather than a ticket pass.** Re-measure the base at pull time; do not quote 60.
- **`NFR-002` not triggered** — no frame is composed and the per-PLY derive count is unchanged; a
  `take-back` is ONE `gameStatusOf` plus ONE `O(plies)` `takeBack` replay **per command** — the same
  replay the loop already runs at `:307` and `:374`. `NFR-003`'s *"two to four per turn"* is
  unaffected (a take-back is not a turn). Recorded on `plans/nfr-catalog.md`'s 2026-09-19 header line
  by Architect/Design; **`plans/nfr-catalog.md` is NOT opened here.**
- **`N8-SPAWN` 0 ms, 0 children** — nothing is spawned; `src/cli.test.ts` untouched.
- **Security: not engaged.** No new input path, no process boundary, nothing spawned, no dependency.
  ASVS L1: nothing.
- **Falsifiable zeroes:** 0 new test files, 0 new modules, 0 new dependencies, 0 files under `src/`
  other than the two named, 0 bytes to `AGENTS.md`, `plans/nfr-catalog.md`, `plans/board.md`.

## Definition of Ready — 10/10

| # | check | verdict |
|---|---|---|
| 1 | problem clear (user, pain, value) | ✅ the player typing `quit`/`new`/`undo`; `quit` inert on `main` (`ABC-112`, measured 2026-08-20); the missing arm read at `:125-132`; value = three board rows move |
| 2 | scope / out-of-scope clear | ✅ two files named with line ranges; two arms, one constant, three docblocks; eight fences including five rejected alternatives by pointer |
| 3 | INVEST | ✅ **independent** (no open ruling, no ordering — `ABC-045` measured disjoint), negotiable (the literal), valuable (unblocks two), estimable (+16 measured), small, testable |
| 4 | acceptance testable and measurable | ✅ every row is a count, a literal, a FEN, an `undefined`, a byte-identical range or a grep count; `A6` is a watched RED; `A9` a numstat bound |
| 5 | dependencies known | ✅ none blocking; downstream order named; in-development overlap checked and absent |
| 6 | security/NFR triggers with measurable targets | ✅ `N8-LANE` ≤ 650 ms in the measured-then-clause-state form **with the 60 ms headroom named as the binding number**; `NFR-002`/`NFR-003` not triggered with the reason; `N8-SPAWN` 0; security not engaged |
| 7 | test notes present | ✅ lane, gates, seam idiom, fixture, mutant procedure, the frame-4 FEN trap |
| 8 | size assigned | ✅ `S` — below |
| 9 | priority assigned | ✅ `P1` — below |
| 10 | no major unresolved blocker | ✅ the ruling this work waited on since 2026-08-13 landed 2026-09-19; the id gap is recorded, not open |

## Size and priority — the argument

**`S`, not `XS`.** `ABC-045` is the `XS` neighbour: one table row, one existing arm, no mutant round.
This ticket re-opens a mutation-tested module, adds a union member `tsc` will chase through one
exhaustive switch, re-words three docblocks against a count, extends a test seam, writes ~8 rows and
runs a watched-RED round. **Not `M`:** no ruling owed, no new file, no new harness shape, no owner
question; the production diff is measured at +16 and bounded at 30. Calibrated against `ABC-115` (`S`:
≤ 15 production lines plus a harness shape) — same effort, no harness shape, more rows.
**`SPLIT_REQUIRED` not raised.** The split line if it ever moves: (a) transition 17 + `A1`/`A2`,
(b) transition 18 + `A3`–`A6` — both `XS`, and (b) is the half with the mutant.

**`P1`, not `P2`.** It is the first link in a chain that ends a `P1` product defect: `help` advertises
`quit` and the build ignores it (`ABC-112`, `P1`, whose own page says cancel-when-`ABC-046`-is-pulled
— and `ABC-046` cannot be pulled until this lands). It also gates `ABC-102` (`P1`). **Not `P0`:**
nothing on `main` is broken by its absence — Ctrl-D exits cleanly today (`ABC-019` `A8`,
`ABC-037` `A3`) — and no gate or budget is wrong. **`P0` promotion trigger:** the owner scheduling
`ABC-046` or `ABC-102` by name. **`P2` demotion trigger:** `ABC-046` and `ABC-102` both dropped from
`EPIC-006`'s slice on the owner's word — then this arm has no consumer and should be dropped with them,
not delivered into a loop nothing calls.

## Delivery

**Built 2026-09-19 by the Software Engineer** (task `wave-2026-09-19`, subtask
`ticket-to-pr-ABC-120`, Workflow 04) on branch `grugops/ABC-120-turn-loop-arms` @ **`d8e7ccc`**,
off `grugops/wave-2026-09-19` @ `20ad7cb`. **Unmerged; not deployed.**

- **Exactly two files, measured from git:** `git diff --name-only 20ad7cb...d8e7ccc -- src/` →
  `src/turn-loop.test.ts` (+168 / −2), `src/turn-loop.ts` (+86 / −40). **`A9`: 18 added
  non-comment production lines** of the 30 (every `+` line of `git diff -U0` minus comment and
  blank lines; the 86 is mostly the three docblocks and the re-indented `A10b` comment).
  `src/turn-loop.nfr.test.ts` byte-identical; the `TABLE` block and rows 14/17/18 untouched (the
  test file's six hunks are the import, the dynamic import, the seam, `A3b`'s title, the appended
  block).
- **The shape, as `ADR-0021` clauses 2–5 rule it:** two union members (nine arms), `export const
  QUIT_NOTICE = "quit"`, transition 17 after the `eof` branch (notice, no frame, `{ null, null,
  0 }`), transition 18 before the `!== "move"` branch (`takeBack(history, plies)`, `messages`, fall
  through to the ONE derive; the move path inside an `else`). No `plies` guard. Three docblocks
  re-worded (`A10`: `grep -c "sixteen transitions"` 0, `grep -c "only on end-of-input"` 0,
  `grep -ci "non-mutating"` 3; census SEVEN non-advancing / FIVE emit, both arms named).
- **`A1`–`A5`, `A7`:** six rows in `src/turn-loop.test.ts`, three test-seam tokens (`quit`/`new`/
  `undo` — not grammar; `src/command-input.ts` not imported). `A1` frames 2, derives 1, reads 2
  (a third throws); `A3` `statuses[9].claimable` undefined, frames 10, derives 10, moves 0 /
  `keyHistory` 1 / `repetitionCounts` {1}; `A4` frames 6, derives 6, `"took back 2"` on frame 4
  only, `START_FEN` read INSIDE the seam at frame 4; `A5` frames 2, derives 2; `A7` ten reasons,
  `"input ended"`, literal `0`, `Record<PromptOutcome["kind"], true>` with 9 keys.
- **`A6`, watched RED in a copy outside the repo:** M1 (`takeBack` then `continue`, no derive) →
  `A3` `expected { by: 'white', …(1) } to be undefined`, `A4` `expected 5 to be 6`, `A5`
  `expected 1 to be 2`, **3 failed | 60 passed** — `A1`/`A2` green; M2 (`take-back` routed into
  the 7/8/9 branch) → the same three rows, **3 failed | 60 passed**; control 63/63. Raw output:
  `.grugops/context/ticket-to-pr-ABC-120/notes/`.
- **Gates at the tip:** `npx biome check .` 76 files clean, `npx tsc --noEmit` 0 (typecheck and
  build), `npx vitest run --dir src` **42 / 1297 / 0 skipped** (base 42 / 1291 / 0; +6 tests,
  +0 files), JSON skip count 0, test-skip-integrity `No findings.` `self_fix_attempts` spent 0.
- **`N8-LANE` / `NFR-008`:** in-file `+4 ms` (paired median of `tests` ms, n = 7, 57 → 63 rows),
  **0 new files**. Whole-lane CPU (`/usr/bin/time -p`, n = 3, two sibling hops live): **before
  17.88 s at load 3.1–7.4, after 18.25 s at load 13.5–20.8** — over 15 s in every run INCLUDING the
  three before the change; the headroom re-measured at the delivery base is NEGATIVE, so this
  reads as a lane breach that is the base's, REPORTED AS NON-CONFORMING, not ruled, nothing
  trimmed; not a conforming `ADR-0019` reading. Handed up.
- Production lines > 0: the zero-production-lines UAT waiver does NOT apply; the owner's word is
  needed at `In UAT`. Board move (`In Development` → `In Review`) and the QE hop are the
  Orchestrator's / QE's. Notes: `.grugops/context/ticket-to-pr-ABC-120/notes/`.
