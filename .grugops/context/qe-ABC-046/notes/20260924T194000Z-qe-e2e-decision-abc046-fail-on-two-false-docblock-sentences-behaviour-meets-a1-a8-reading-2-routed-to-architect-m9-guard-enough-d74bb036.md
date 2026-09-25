---
id: 20260924T194000Z-qe-e2e-decision-abc046-fail-on-two-false-docblock-sentences-behaviour-meets-a1-a8-reading-2-routed-to-architect-m9-guard-enough-d74bb036
kind: decision
by: qe-e2e
at: 2026-09-24T19:40:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-035
  - ABC-037
  - ABC-045
  - ABC-102
  - ABC-112
  - ABC-114
  - ABC-115
  - ABC-120
  - ADR-0021
  - EPIC-006
  - src/command-input.ts
  - src/line-input.ts
  - src/command-input.test.ts
  - src/cli.test.ts
  - src/line-input.test.ts
  - plans/tickets/ABC-046-quit-and-new.md
  - .grugops/context/ticket-to-pr-ABC-046/notes/20260920T043000Z-software-engineer-decision-quit-is-a-per-session-flag-in-a-wrapper-around-the-pure-resolver-new-is-take-back-of-moves-length-three-readings-named-6b1e9d27.md
  - .grugops/context/ticket-to-pr-ABC-046/notes/20260920T044000Z-software-engineer-observation-nine-mutants-red-control-green-m9-the-reader-bypassing-the-wrapper-is-caught-by-the-entry-point-child-only-3f7c1e58.md
supersedes:
---

# `ABC-046` QE verdict: **FAIL**. The behaviour meets `A1`–`A8`. Two sentences in the delivered module docblock are false. Reading (2) does not match `ADR-0021` clause 6 and goes to Architect/Design. `M9` is guarded well enough.

**NOT A STAMP.** `context.human_admission` is `off` and no `finding` is admissible on this install.
This is QE's hand-authored `decision`. Everything below was RUN on branch `grugops/qe-ABC-046`,
created from `grugops/wave-2026-09-24` @ `162b2bd`. That base carries the build `6cdde15` + `c8f005f`
through merge `8b5114c`, and `git diff --stat 6cdde15 HEAD -- src` is empty. It ran in an isolated
worktree with the main checkout's `node_modules` symlinked (gitignored, not committed). Load average
was 3.9–10.2 (1-min). **QE added zero tests and changed zero lines under `src/`.** Every mutant was
reverted, and after each of 19 rounds the file's `sha256` and `git status --porcelain -- src` were
asserted. The final hashes are `command-input.ts` `4eb49f40…db73` and `line-input.ts`
`6b8ee298…aff5`, byte-identical to the start. The raw harnesses and outputs are next to this note
as `raw-*.txt`.

## Why FAIL, and how small the repair is

No acceptance criterion is red. The FAIL comes from two false sentences. `ADR-0021` § Consequences
requires this change to leave no false sentence in the files it edits (`ABC-114`'s lesson). The
Engineer's own `decision` § 3 says the docblocks were re-worded for that reason. `ABC-115`'s QE hop
set the precedent: it FAILED on named defects that were not criteria. Both sentences are in
`src/command-input.ts`. Both were written by this diff (`git diff d1d431f 6cdde15`). Both are
falsified by measurement (`raw-docblock-probe*.txt`):

- **D1 — `src/command-input.ts:4-5`:** *"This module decides whether a submitted line IS one of
  **seven** commands and, for **six** of them, nothing about what any of them DOES"*.
  `COMMAND_TABLE.length` is **6**: `help, board, quit, claim, resign, new`. `helpMessages()` has 7
  items, which is the heading + 6. The same file contradicts itself at `:69` (*"The **six** tokens,
  and the type that makes a seventh a compile error"*) and at `:75` (*"the six tokens do NOT share
  one arm"*). The sentence before this build said *"five"* with 5 rows. The build added 1 row and
  raised the count by 2. **Repair:** "six … for five of them". This is prose only.
- **D2 — `src/command-input.ts:222-223`** (the `createPromptLineResolver` docblock): *"Armed and
  asked again, it answers `{ kind: "quit" }` and **never consults the table**"*. On that exact path
  the wrapper calls `classifyCommand(line)`, which is `COMMAND_TABLE.find(...)`. **Measured:** with
  the `quit` ROW removed from `COMMAND_TABLE`, the delivered wrapper answers `quit` / `quit` with
  `rejected` / `rejected`. The control answers confirmation / `{ kind: "quit" }`. So the exit depends
  on the table. What is true is narrower: the wrapper never reads the row's `outcome` and never
  calls `resolvePromptLine` on that path. **Repair:** say that. This is prose only.

Neither repair changes an assertion or a code line. The re-QE is a delta: the two sentences, plus
the four gates.

## Ruling 1 — the Engineer's three readings against the ticket and `ADR-0021`

1. **`A8`'s "one call-site line" is three code lines: MATCHES.** `ADR-0021` clause 6 asks for two
   things that cannot both be met in one line: a **per-session** flag, and **one** call-site line in
   `src/line-input.ts`. I measured both one-line and two-line alternatives as mutants:
   - `Q1`: the only literal one-line build, `return createPromptLineResolver(deps)(history, line.text)`,
     which creates a fresh wrapper per line. It is `tsc`-clean. It fails `A1`/`A2`/`A3` in the
     product. `CHILDREN.quits` goes RED: `d4` is read, and the session never ends on `quit`.
   - `Q2`: one wrapper at the reader's MODULE scope. That is `M3`'s shared-flag shape, and it cannot
     bind the seam's `deps`. `ABC-037`'s rows in `src/line-input.test.ts` go 8 RED.

   So "one line" was a miscount in the ADR. The amendment's own sentence, *"the reader must call
   the stateful wrapper instead of bare `resolvePromptLine`"*, describes what was built. `A8`'s file
   LIST is met exactly: 4 files, `src/turn-loop.ts` byte-identical, 0 new test files. The other 9 of
   the +12/−9 are the two docblock sentences in `line-input.ts`, and they read true.
2. **An over-cap line between two `quit`s does not clear the flag: DOES NOT MATCH `ADR-0021`
   clause 6. No row fails, because none exists. Ticket `A1` is MET as written.** Clause 6 says the
   flag *"is cleared by **any other line**"*. Through the real entry point, `quit` / 1025×`x` /
   `quit` ENDS the session on `> quit` after 3 frames (edge probe (7)). The last frame the player
   saw before the ending `quit` carried `line too long` / `max 1024 chars`, not
   `quit again to end`. The control, `quit` / 1024×`x` / `quit`, asks again and ends on
   end-of-input. `A1`'s third clause names *"an intervening command"* and *"a legal move"*. An
   over-cap line is neither, so the ticket's criterion is met. **The row that would fail is the
   clause-6 row nobody wrote**: *"quit / over-cap line / quit does not end the session"*.
   **This is not the Engineer's to fix inside the licence.** `Q9` is the cheapest fix shape: the
   reader calls the wrapper with `""` on the over-cap branch. It clears the flag, and it turns 3 of
   `ABC-037`'s security-bar-2 rows RED (*"rejects a line of 1025 … never passes it to a resolver"*).
   A compliant fix therefore needs a `disarm` on the wrapper's surface plus a second line in
   `src/line-input.ts`, and that is beyond `A8`'s amended licence. **Routed to Architect/Design:**
   either narrow clause 6 to *"any other line the resolver sees"*, or license the disarm (a clause
   plus one `A8` line). Harm is small. The player has typed `quit` twice with nothing between them
   except a line the product refused to read. **Not a FAIL cause.**
3. **`new` carries `messages: []`, and `ABC-035`'s two `Done` rows are superseded: MATCHES.**
   `ADR-0021` clause 7 writes `messages: []` literally, and `Q7` (a message on `new`) goes RED on
   `A4`, `A5` and the `A6` child. The ticket's § Design ruling authorises superseding the fence row
   by name. The foreign-list row (`new` leaving `["moves","undo","new"]`) follows from `ADR-0021`
   § Consequences, which says `ABC-046` "flips back" `ABC-035` `A4`'s four-token half. The
   rewritten fence row still pins what is true of the pure function: `board` payload-free, `quit`
   is the confirmation, and there is no memory. `M8` turns it RED.

## Ruling 2 — `M9` (the reader bypasses the wrapper) is caught only by the entry-point child. **ENOUGH. No in-file row is required for this ticket.** One gap is recorded as `G2-INFO`.

- The guard fires on this exact defect. It is deterministic (scripted engine, `spawnSync`, full
  capture) and runs in the default lane. It catches **both** wiring mistakes: `M9`, and `Q1`, the
  literal one-line build. `M9` red row: `A2/A3 — quit / quit ends the session on QUIT_NOTICE`.
- The defect is in the *wiring*, and the child tests exactly that wiring through the product
  (`cli.ts` → `createLineInputSeam` → wrapper). A unit row in `src/line-input.test.ts` would find it
  faster, but it would not be stronger.
- `src/line-input.test.ts` is outside `A8`'s file list. Adding a row there is a licence change, so
  it is BA/PM's call and not a condition of this ticket.
- **`G2-INFO` (single point):** `CHILDREN.quits` is the ONLY guard on the wiring, and it is also
  the `A2`/`A3` child. A future edit that re-scripts that child, for example dropping the trailing
  `d4`, could leave `M9` green without anyone noticing. Recommended for the next ticket licensed to
  touch `src/line-input.test.ts`: one row that sends `quit` twice through `createLineInputSeam` and
  expects `{ kind: "quit" }`. That is the Engineer's own suggestion.

## Gates at the tip — reproduced, no difference

`npx biome check .` 76 files, no fixes. `npx tsc --noEmit` exit 0 (typecheck and build).
`npx vitest run --dir src` **42 files / 1361 tests / 0 skipped**, exit 0, 4.49 s. JSON reporter:
`numPendingTests` 0, `numTodoTests` 0 → skip count **0**. `test-skip-integrity` printed
**`No findings.`** These match the Delivery's 42 / 1361 / 0 exactly.

**Spawn pin confirmed:** `src/cli.test.ts:1832` `const N8_SPAWN = 17 + 7 + 1 + 2;`, asserted
against both `spawned` and `Object.keys(CHILDREN).length`. The two added children are `quits` and
`renews`. `spawnSync` is still the only name imported from `node:child_process`, with one call site
(`:1844-1845`).

## Mutants — 9 of 9 reproduced to the row; QE's 9 more

The Engineer's M1–M9 went red on **exactly** the rows and counts in the `3f7c1e58` observation.
Control: 131 / 29 / 65. QE's own mutants:

- `Q1`, the one-line reader: red, `cli.test` 1 row only.
- `Q2`, the module-scope reader: red, `line-input.test` 8 rows.
- `Q3`, a prefix arm where `quit now` arms: **NONE red**. This is `G1`.
- `Q4`, a case-sensitive arm: red, 1 row.
- `Q5`, commands do not clear the flag: red, 3 rows.
- `Q6`, `new` at ply 0 guarded into a command: red, 4 rows.
- `Q7`, `new` carries a message: red, 2 rows + the `A6` child.
- `Q8`, the wrapper drops `deps`: red, 1 + 8 rows.
- `Q9`, the ADR-literal over-cap clear: 3 `ABC-037` rows red. This is not a defect mutant; it
  proves a fix needs a surface change.

The table is in the sibling `observation`.

## Gaps named (none is a FAIL cause)

- **`G1` — no row pins that trailing text leaves the flag alone.** `Q3` is a wrapper that arms on
  `startsWith("quit")`, so `quit` / `quit now` ends the session. It goes **0 red across 225 rows in
  three files**. The delivered product is right: `quit now` is `rejected` (`type e2e4 or Nf3`) and
  CLEARS the flag, so the next `quit` asks again (edge (4a), loop and real frame). The no-argument
  fence only covers `classifyCommand` and the pure function, not the wrapper. This is a one-row
  close in `src/command-input.test.ts` and needs no licence change. Recommended when D1/D2 are
  repaired, if the Engineer chooses to add it. It does not block.
- **`G2-INFO`** — see Ruling 2.
- **`G3-INFO` — `A6` is asserted for White only.** Through the real entry point with
  `--colour black`, a `new` typed before the engine has moved is read only AFTER `e4`. It takes
  back that ONE ply, which is the engine's. The engine then moves AGAIN (`d4` in the script), and
  the redrawn frame is byte-equal to the opening frame, black-bottom. The behaviour is correct:
  colour and orientation are kept, and a new game with Black means the engine opens. No row covers
  it.
- **`G4-INFO` — test-comment imprecision.** `src/command-input.test.ts` says *"A1-A7 here …
  A2/A3/A6 **also** as entry-point children"*, but there is no `A6` row in that file. `A6` lives
  only in `src/cli.test.ts`. The file also still titles its sweep *"ABC-035 A1 — **four** tokens"*,
  which was already stale at `ABC-045`. Named here, not corrected (`ABC-114`).

## Board / fences

The column move is the Orchestrator's. On this verdict the ticket goes back to `In Development` for
the D1/D2 prose repair. Reading (2) goes to Architect/Design as a ruling, in parallel. `NFR-008` is
not ruled. `src/search.*`, `src/quiescence.*`, `src/engine.*`, `plans/board.md`, `AGENTS.md` and
`plans/nfr-catalog.md` were not opened. Nothing merged, nothing deployed. Production lines > 0, so
the UAT waiver does not apply.
