---
id: 20260920T032000Z-qe-e2e-decision-abc045-pass-a2-met-as-read-sentence-to-reword-a5-guarded-by-its-own-row-13-of-13-mutants-red-lane-1325-explained-3e7f1a9c
kind: decision
by: qe-e2e
at: 2026-09-20T03:20:00Z
verified_by:
confidence: high
refs:
  - ABC-045
  - ABC-035
  - ABC-019
  - ABC-021
  - ABC-075
  - ABC-114
  - ADR-0021
  - EPIC-006
  - src/command-input.ts
  - src/command-input.test.ts
  - src/cli.test.ts
  - src/turn-loop.ts
  - plans/tickets/ABC-045-resign.md
  - .grugops/context/ticket-to-pr-ABC-045/notes/20260920T012000Z-software-engineer-decision-resign-is-one-table-row-to-the-existing-game-over-arm-loser-read-off-blacktomove-a2-frame-count-read-against-the-loop-5e2a9c41.md
  - .grugops/context/ticket-to-pr-ABC-045/notes/20260920T013000Z-software-engineer-observation-eight-mutants-red-control-green-m5-caught-by-a4-and-the-first-resign-row-not-by-a5s-loop-row-9c4e1a63.md
supersedes:
---

# `ABC-045` QE verdict: **PASS** — `A2` MET-AS-READ (the sentence is the thing to re-word, not the build), `A5` guarded by its OWN row against every per-game confirmation and, in isolation, against the module-level one; 13 of 13 mutants red on named rows; five edge cases answered through the loop AND the real entry point; lane 42 / 1325 / 0 with the +8 over the subtask's 1317 explained from git

**NOT A STAMP.** `context.human_admission` is `off` and no `finding` is admissible on this install
(`AGENTS.md`); this is QE's hand-authored `decision`. Everything below was RUN on branch
`grugops/qe-ABC-045`, created from `grugops/wave-2026-09-19` @ `2a1d70a` (which carries the build
`b8afa30` via the merge `d13fb1f`; the build's base is `bd40d85`), in an isolated worktree with the
main checkout's `node_modules` symlinked. Load average during the run: 4.7–10.6 (1-min), two sibling
hops live (`ABC-079` re-hop on `src/search.*`/`src/quiescence.*`; QE on `ABC-075` on `src/zobrist.*`
— none of those files opened here). **QE added zero tests and changed zero lines under `src/`;
every mutant was reverted and both `sha256` of the file and `git status --porcelain -- src` were
asserted after each round (14 rounds, 14 restores).** Raw harnesses and summaries sit beside this
note as `raw-*.txt`.

## Gates at the tip — reproduced; ONE number differs from the subtask and it is the wave's, not this ticket's

| gate | command | result |
| --- | --- | --- |
| lint | `npx biome check .` | exit 0 — `Checked 76 files in 138ms. No fixes applied.` (0.67 s) |
| typecheck | `npx tsc --noEmit` | exit 0, no output (1.60 s) |
| build | `npx tsc --noEmit` (the build slot's command) | exit 0 (1.61 s) |
| unit | `npx vitest run --dir src` | exit 0 — **42 files / 1325 tests / 0 failed**, duration 6.83 s (wall 7.43 s, load 4.7) |
| skip count | `--reporter=json` → `numPendingTests + numTodoTests` | **0** (pending 0, todo 0, failed 0, 266 suites) |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| the file alone | `npx vitest run src/command-input.test.ts` | **98 / 98**, tests 24 ms, duration 362 ms |
| the entry-point file | `npx vitest run src/cli.test.ts` | **62 / 62**, tests 35 ms, duration 3.59 s (collect 3.34 s — the 25 children) |

**1325, not 1317.** The subtask's expectation was written against `b8afa30` alone (base 1297 + 20).
The wave tip `2a1d70a` ALSO carries `ABC-075` (merge `e8b1fe6`, `src/zobrist.*` only, +8 tests:
its build row reads 42 / 1305 off the same 1297 base). 1297 + 20 + 8 = **1325**, +0 files. Measured
from `git log bd40d85..2a1d70a -- src/` (exactly `b8afa30` and `40b77ac`) and `git diff --stat`
(six files: this ticket's three and `src/zobrist.ts` / `.test.ts` / `.nfr.test.ts`). The two files
this ticket owns read exactly the Engineer's 98 and 62. Not a defect, not a drift — recorded so the
next reader does not chase it.

## Ruling 1 — `A2` "exactly one further frame is written — the final one": **MET-AS-READ; the SENTENCE needs re-wording, the build does not**

The Engineer asserts `renders === 1` (zero frames after the outcome) and reads "the one further
write" as the result screen. QE's ruling, on three measurements rather than on the Engineer's note:

1. **The literal reading is not reachable without contradicting THREE merged tickets' rows, and
   `A6` on this ticket.** QE wrote the literal sentence into `src/turn-loop.ts` as mutant `M12`
   (the `game-over` branch renders one frame before returning). It is red on **five rows across
   three files**: this ticket's `A2` (`renders` 2 ≠ 1) and `A5` (`messagesPerFrame` `[[], []]`), the
   `A4` child (**4 frames ≠ 3**), AND two `ABC-019` rows in `src/turn-loop.test.ts` — the eighteen
   scripted rows (frame count) and `A8b` "the prompt-driven `game-over` returns the seam's OWN
   result and reason". `ABC-021`'s allowed claim takes the same edge with zero frames and killed an
   "extra final frame" mutant (`M4`) on its own `A1`. **Zero further frames from the loop on a
   prompt-driven `game-over` is the merged, ratified behaviour of this loop, three tickets deep,
   and `A6` on this page fences `src/turn-loop.ts` byte-identical.** A criterion that can only be
   met literally by breaking a sibling criterion on the same page is a wording defect on the page.
2. **What the sentence protects IS held, and held tighter than it asks.** Its purpose (read with
   `A2`'s other two clauses: "returns on that iteration", "0 `legalMoves` after the outcome") is
   that `resign` ends the game with no further work and no stray frame. Measured: `renders` 1 on
   the unit row; on the real entry point `1 + plies` frames and **0 frames after the screen**
   (`A4`); the screen is the one further WRITE, and `M12` shows any further FRAME reds four rows.
3. **Ruling: `A2` MET-AS-READ.** The Engineer's interpretation is the record's, and QE would have
   built it the same way. **For BA/PM (the pen is not QE's):** re-word the last clause of `A2` to
   the shape `ABC-021` `A1` already uses — *"no further frame is written by the loop; the frame
   shown before the prompt is the final one, and the result screen (`ABC-044`) is the one further
   write"*. One clause, no number. Not a FAIL, no row named for `src/turn-loop.ts`.

## Ruling 2 — `A5`'s loop row on the confirmation mutant: **`A5` IS guarded, by its own row, and the masking is test-order coupling that the product's own shape (`A4`) closes**

The Engineer's `M5` (a MODULE-LEVEL `armed` flag) reproduced exactly: in the full file, red on
`ABC-035` `A1` "classifies `resign` as resign" (the first `resign` through `resolvePromptLine`
in the module instance, which arms the flag) and on `A4`'s child; `A5`'s own loop row GREEN.
Two more measurements settle whether that is a gap:

- **`M5-isolated`** — the same mutant with `A5`'s row run ALONE (`vitest -t "A5 — no
  confirmation"`): **RED, `expected 2 to be 1`** (`reads`). The row's assertion is correct; in the
  full file it is masked because an earlier row in the same module instance has already spent the
  one-shot flag. That is test-order coupling, not a missing assertion.
- **`M9`** (QE's) — a PER-GAME confirmation (`WeakSet` keyed on the `GameHistory`; the first
  `resign` on a game returns `{ kind: "command", messages: ["confirm"] }`, the second resigns).
  This is the realistic shape — `ADR-0021` clause 6's, and what `ABC-046`'s mechanism would be —
  and it is what a build that "helpfully" confirms would look like. **RED on 11 rows**, `A5`'s loop
  row among them directly (`reads` 2 ≠ 1) and `A5`'s second row (`[[], ['confirm']]`), plus `A1`
  ×3, `A2`, `A3`, `ABC-035` `A1` ×3 and the `A4` child.

**Ruling:** `A5` is guarded by its own assertion against every confirmation that is scoped to a
game or a session (`M9`), and in isolation against the module-global one (`M5-isolated`). The one
shape that slips past `A5`'s row in the full-file run — a flag global to the module that survives
across games — is exactly the shape `A4`'s child cannot miss, because a child process IS one
module instance playing one game, which is the product's shape; and `ABC-035` `A1` reds on it
too. **Is that enough? Yes.** It is not a gap in the criterion's coverage; it is an `INFO` on the
row's robustness: `G1-INFO` below. QE did not add a row for it (a `vi.resetModules` + dynamic
import in `runLines` would decouple it, at the cost of the file's hoisted spies — not worth it for
a shape the child already kills).

## Mutation result — 13 mutants, every one red on a named row, no survivor

Full ledger with raw first-failure messages in the sibling `observation`. Summary (rows red in
`src/command-input.test.ts` / `src/cli.test.ts` / `src/turn-loop.test.ts`):

| mutant | red |
| --- | --- |
| `M1` result hardcoded `black-wins` | 2 — `A1` pure, `A1` loop-as-black |
| `M2` ternary swapped | 6 — `A1` ×3, `A2`, `A3`, `A5` |
| `M3` row → `outcome: "command"` (resign inert) | 7 + 1 — `A1` ×3, `A2`, `A3`, `A5` ×2; `A4` (screen "did not finish" — the child played `d4`) |
| `M4` `reason: "checkmate"` | 6 + 1 — `A1` ×3, `A2`, `A3`, `A5`; `A4` |
| `M5` module-level confirmation flag (Engineer's) | 1 + 1 — `ABC-035` `A1` "resign"; `A4`. `A5` loop row green (masked) |
| `M5-isolated` — the same, `A5`'s row alone | **1 — `A5` `expected 2 to be 1`** |
| `M6` `legalMoves` derive inside the resign path | 1 — `A3` (module-boundary delta 1 ≠ 0) |
| `M7` `gameStatusOf` derive inside the resign path | 4 — `ABC-035` `A6` ×3, `A3` |
| `M8` row deleted | 13 + 1 — `ABC-035` `A1` ×3, `A2` ×3, `A1` ×3, `A2`, `A3`, `A5` ×2; `A4` |
| `M9` per-game confirmation (QE) | 10 + 1 — as above, `A5` DIRECTLY |
| `M10` case-sensitive lookup — edge (e) | 18 — `ABC-035` `A1` ×9 and `A2` ×9 (every upper/mixed-case spelling of all five tokens) |
| `M11` first word only (`resign now` resigns) — edge (d) | 2 — `ABC-035` `A1` "help now", the no-argument fence |
| `M12` the LOOP renders one further frame on `game-over` (`src/turn-loop.ts`) — `A2`'s literal sentence | 2 + 1 + 2 — `A2`, `A5`; `A4` (4 frames ≠ 3); `ABC-019` eighteen-rows, `A8b` |
| CONTROL | 0 — 98 / 62 / 63 |

Every one of the Engineer's eight reproduced to the row and the count (`M1` 2, `M2` 6, `M3` 7+1,
`M4` 6+1, `M5` 1+1, `M6` 1, `M7` 4, `M8` 13+1). Restore asserted 14 of 14; final
`git status --porcelain -- src` empty.

## The five edge cases — each through the merged loop AND the real entry point (`node src/cli.ts`, engine substituted with the file's own `--import` hook shape); rows RED / NONE; product behaviour

| edge | rows that guard it | product behaviour (measured) |
| --- | --- | --- |
| (a) `resign` while it is the ENGINE's turn | **NONE by name; safe by structure, and `A1` loop-as-black covers the state it lands in** | The human CANNOT reach the prompt off-turn: `runTurnLoop` calls `input` only when `sideToMove === humanColour` (`humanToMove`), and `createLineInputSeam` `pause()`s the source between reads, so a line typed while the engine thinks sits in the stream. Loop: events `render(thinking=true) → engine:e2e4 → render → read#1 "resign" sideToMove=black` → `white-wins` / `resignation`, reads 1. Real frame, `--colour black`, stdin `resign\nd7d5\n`, engine scripted `e2e4`: exit 0, 2 frames, 1 prompt, stream ends `White wins by resignation.\n\n1. e4\n`. **Why the `blackToMove` read is safe:** on the only path that reaches `resolvePromptLine` from the loop, the side to move IS the human; the pure function called off-turn names the side to move (measured: start position → `black-wins`), which is the right answer to the question it is asked and the loop never asks it off-turn. |
| (b) `resign` at ply 0 | `A1` pure (start position), `A1` loop-as-white | Loop: `black-wins` / `resignation`, reads 1, renders 1, 0 moves, FEN unchanged. Real frame, `--colour white`, `resign\n`: exit 0, 1 frame, 1 prompt, screen `\nBlack wins by resignation.\n\n` — an EMPTY move list, `ABC-044`'s renderer's own shape for a game with no plies. |
| (c) `resign` after the game is already over | **NONE by name for `resign`; `ABC-019`'s exit-test-between-render-and-act rows own it** | The line is NEVER read. Loop on a checkmated fixture (Fool's mate) with `["resign", "resign"]` scripted: reads **0**, result `black-wins` / `checkmate`, renders 1 (the mated frame). Real frame, `f3\ng4\nresign\n` vs `e7e5, d8h4`: exactly **2 prompts** in the stream, 5 frames, screen names checkmate, `resignation` absent from the whole stream, exit 0. And `resign` after `resign` (`e4\nresign\nresign\nd4\n`): 2 prompts, resignation screen — the loop returned on the first. |
| (d) `resign now` (trailing text) | `ABC-035` fence "takes no argument" (now sweeps `resign now`); `M11` reds it | Not a command: falls to the resolvers → `rejected` with the teaching line `type e2e4 or Nf3`, FEN unchanged, the game goes on; a following `resign` ends it. Real frame: 2 prompts, 2 frames, the second frame's message region shows the rejection, then the resignation screen, exit 0. Also measured: `resign!`, `resign.`, `resignation`, ` resign now ` → rejected; `resign\t` → resigns (trailing whitespace is trimmed — `ABC-035` `A1`'s rule). |
| (e) `RESIGN` / `Resign` | `ABC-035` `A1` spelling sweep (3 shapes) and `A2`; `M10` reds 18 rows | Consistent with the other four tokens: `RESIGN`, `Resign`, `  resign  `, `\tRESIGN\r`, `rEsIgN` all resign as black → `white-wins`, reads 1. Real frame: `RESIGN`, `Resign`, `  resign  ` after `e4` → resignation screen, 2 prompts, exit 0. |

## `help` through the real frame — hidden 0

`node src/cli.ts --colour white` with `help\n` (start) and `e4\nhelp\n` (after `e4 e5`): exit 0, the
frame's message region reads `commands: help board` / `quit claim resign` on two rows, **no `(+N
more)` marker in the stream**, session ends on `input ended`. The unit rows (`ABC-035` `A7`, both
fixtures, five tokens) are green in the lane; `helpMessages()` is `["commands:", "help", "board",
"quit", "claim", "resign"]`.

## Docblock audit (`ABC-114` standard) — the AMENDED sentences are all true; two stale line cites, one of them in an amended paragraph, named and NOT corrected

Every sentence this ticket added or re-worded in `src/command-input.ts` was read against a
measurement: "one of five commands" (5 rows); "IS THE ONE TOKEN THAT CARRIES A VERDICT … resolves
to the EXISTING `game-over` arm … no new arm, no new reason, no confirmation, and no derive" (`M5`
/ `M6` / `M7` / `M9` all red; `src/turn-loop.ts` byte-identical); "The loser is the side to move,
read off ONE field … the loop prompts only when that side is the human's" (edge (a)); "the five
tokens do NOT share one arm. Three are `command` … `claim` … `resign` is the `game-over` arm" (the
table); "`undo` and `new` are NOT here … `resign` IS here"; "`ABC-033`'s three, `ABC-035`'s two,
`ABC-045`'s one" (six members); "`history` is consulted on ONE command path and derived from on
NONE" (`M6`/`M7`). **No false sentence.**

- **`G2-INFO` — stale line cites into `src/turn-loop.ts`, inherited from `ABC-120`'s +10-line
  shift, one of them re-typed inside a paragraph this ticket amended.** `src/command-input.ts:63`
  "(`src/turn-loop.ts:129`)" and `:64` "(`:130`)" → the arms are at `:139` / `:140`; `:41`
  "`src/turn-loop.ts:319-341`" → `:354-376`; `:42` "`src/turn-loop.ts:234`" → `:255`. Cites, not
  claims — no behaviour is mis-stated — and the pen and the verdict stay separate (`ABC-114`), so
  QE did not touch them. The Engineer re-wrote the `:63` paragraph and carried the cite along; a
  hop with the pen on this file takes all four in one pass.
- **`G3-INFO` — `src/cli.test.ts:278` "THE CHILDREN. Ten, spawned once each"** — 25 now, pre-existing
  (it was stale before this ticket's +1) and not this ticket's sentence. Named for whoever next
  raises the pin.

## Gaps (none blocking)

- **`G1-INFO`** — `A5`'s loop row is masked on a MODULE-GLOBAL confirmation flag by test order (see
  ruling 2); it reds on that shape in isolation and on every per-game shape in place; `A4`'s child
  and `ABC-035` `A1` kill the global shape. No row added.
- **`G2-INFO`, `G3-INFO`** — above.
- **`A2`'s wording** — for BA/PM, above. Not a gap in the build.
- **`NFR-008` NOT RULED** (subtask fence). Data only: lane `Duration 6.83s` at load 4.7–10.6 with
  two siblings live; the Engineer's over-15 s CPU readings stay handed up.
- **Not covered, by fence and by scope:** `src/search.*`, `src/quiescence.*`, `src/engine.*`,
  `src/zobrist.*` not opened; `--colour random` not driven for (a) (its coin is `ABC-042`'s, and
  both branches are the two measured above). No E2E file was written: the one criterion that needs
  the real frame (`A4`) has its child, and this hop's real-frame edge runs are a scratch harness
  beside this note, deliberately NOT added to the 25-child pin.

**Recommendation: `ABC-045` MAY LEAVE `In Review`.** Production lines > 0 (`src/command-input.ts`
in the non-test list, measured from git), so the 2026-08-17 UAT waiver does NOT apply — the owner's
word is needed at `In UAT`. Not merged, not deployed; `plans/board.md`, `AGENTS.md`,
`plans/nfr-catalog.md` untouched (fenced).
