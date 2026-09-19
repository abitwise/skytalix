---
id: 20260920T012000Z-software-engineer-decision-resign-is-one-table-row-to-the-existing-game-over-arm-loser-read-off-blacktomove-a2-frame-count-read-against-the-loop-5e2a9c41
kind: decision
by: software-engineer
at: 2026-09-20T01:20:00Z
verified_by:
confidence: high
refs:
  - ABC-045
  - ABC-035
  - ABC-019
  - ABC-021
  - ADR-0021
  - src/command-input.ts
  - src/command-input.test.ts
  - src/cli.test.ts
  - plans/tickets/ABC-045-resign.md
supersedes:
---

# `ABC-045` — the shape built, and the three places the ticket had to be READ rather than copied

Branch `grugops/ABC-045-resign` @ `b8afa30`, off `grugops/wave-2026-09-19` @ `bd40d85`.

## 1. `resign` is one `COMMAND_TABLE` row that resolves to the EXISTING `game-over` arm

`CommandToken` gains `"resign"`; `CommandSpec.outcome` gains `"game-over"`; the table gains
`{ token: "resign", outcome: "game-over" }`; `PromptLineOutcome`'s `Extract` gains `"game-over"`;
`resolvePromptLine` gains one branch returning
`{ kind: "game-over", result: history.position.blackToMove ? "white-wins" : "black-wins", reason: "resignation" }`.

**Which `TerminalReason` `resign` maps to: `"resignation"`** — already the eighth of the ten
(`src/turn-loop.ts`, `ABC-019`'s `A14`), already phrased by `src/result-screen.ts`'s
`REASON_PHRASE` (`"by resignation"`). No eleventh value, no new `PromptOutcome` member (nine
stays nine), `src/turn-loop.ts` and `src/gameend.ts` byte-identical (`A6`, measured with
`git diff --quiet`). The subtask's STOP condition ("if none fits") did not fire.

## 2. The loser is read off `position.blackToMove`, not off `humanColour`

`resolvePromptLine` never learns the `--colour` option and the module must stay a pure function
over a string (`ABC-035`, `ADR-0021` clause 6 keeps it pure and exported for `ABC-037`'s
delegation spy). The loop prompts ONLY when the side to move is the human's
(`src/turn-loop.ts`, `humanToMove`), so on this path the side to move IS the human and one field
read names the loser with no derive. `A1`'s both-directions rows pin this: white-to-move →
`black-wins`, black-to-move (after `e4`, `humanColour: "black"`) → `white-wins`. Mutants `M1`
(hardcode) and `M2` (swap) are both red on those rows (sibling `observation`).

Alternative considered and rejected: threading `humanColour` into the seam. It would widen
`InputSeam`'s shape (`ADR-0021` fence), touch `src/line-input.ts` (not licensed by `A6`), and
answer a question the position already answers.

## 3. `A2`'s "exactly one further frame is written — the final one" is read against the merged loop

The merged loop's `game-over` branch returns from `awaiting-human` WITHOUT passing through
`rendering` — the same edge `ABC-021`'s allowed claim takes (`src/turn-loop.ts`, `if
(outcome.kind === "game-over") return …`). So after `resign` is typed, ZERO frames are written by
the loop; the frame rendered BEFORE the prompt is the final one, and the one further write is the
result screen, which is the entry point's (`ABC-044`). Satisfying the sentence literally would
mean editing `src/turn-loop.ts`, which `A6` and the subtask both fence. **Built and asserted as
the loop behaves:** `renders === 1` for a single-`resign` session (`A2`), `1 + plies` frames and
nothing after the screen on the entry-point child (`A4`). This is an INTERPRETATION and is
recorded as such on the ticket's § Delivery; QE and BA/PM may re-word `A2` or reject the reading.

## 4. `legalMoves` is spied at the module boundary, in the SAME shape the file already uses

`A2` says "`legalMoves` is called 0 times after the outcome is produced (spied)". The loop's
`wasGenerated` and the rules core under `gameStatusOf` both import `legalMoves` directly, so a spy
on the test seam's `deps.legalMoves` sees neither (`ABC-033` `G3`'s lesson, already written on
this file's `vi.mock("./history.ts")`). One more hoisted, call-through `vi.mock("./legal.ts")` in
`src/command-input.test.ts` — no behaviour changes, no new file, so the ticket's "no `vi.mock`, so
no `*.nfr.test.ts`" (about NEW files) is kept. `A3` also counts the spy across the pure call, which
is what kills `M6` (a direct `legalMoves` derive hidden inside the resign path) — a mutant the
ticket's own rows would have let live.

## 5. `A4` is ONE child on the existing rig, `A5`'s witness rides it

`CHILDREN.resigns`: `--colour white`, script `e4 / resign / d4`, the scripted opponent answers
`e5` only. `d4` is a LEGAL white move: a build that read a confirmation would play it, the
opponent would run out of script, and the screen would say "did not finish" — `M5` is red on
exactly this. The spawn pin moves `17 + 7` → `17 + 7 + 1` with the reason written beside it. The
ticket names `N8-LANE` by name and no `N8-SPAWN` figure, so the child's CPU is REPORTED to the
lane measurement (sibling `observation`), not netted out.

## 6. What `help` now says, and what it does not

`helpMessages()` folds the table, so `resign` appears in `help` by construction (`ABC-035` `A4`,
"a token added to the table appears in `help`"). `A7`'s hidden count stays 0 at both fixtures
(re-run, green). `quit` / `new` / `undo` wording untouched (`ABC-046` / `ABC-102`); the table is
left in the state those tickets extend (one row each, same shape).
