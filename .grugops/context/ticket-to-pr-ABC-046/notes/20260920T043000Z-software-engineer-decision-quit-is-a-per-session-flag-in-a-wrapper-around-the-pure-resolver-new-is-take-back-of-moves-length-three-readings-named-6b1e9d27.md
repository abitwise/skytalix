---
id: 20260920T043000Z-software-engineer-decision-quit-is-a-per-session-flag-in-a-wrapper-around-the-pure-resolver-new-is-take-back-of-moves-length-three-readings-named-6b1e9d27
kind: decision
by: software-engineer
at: 2026-09-20T04:30:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-120
  - ABC-045
  - ABC-035
  - ABC-037
  - ABC-112
  - ABC-102
  - ADR-0021
  - src/command-input.ts
  - src/line-input.ts
  - src/command-input.test.ts
  - src/cli.test.ts
  - plans/tickets/ABC-046-quit-and-new.md
supersedes:
---

# `ABC-046` — the shape built, and the three places the ticket had to be READ rather than copied

Branch `grugops/ABC-046-quit-and-new`, off `grugops/wave-2026-09-19` @ `d1d431f` (which carries
`ABC-120`'s arms and `ABC-045`'s `resign`). The commit sha is in the sibling `artifact-ref`.

## 1. The confirmation is ONE flag in a wrapper; the pure function never learns of it

`ADR-0021` clause 6, built literally. `src/command-input.ts` gains `createPromptLineResolver(deps?)`
returning `(history, line) => PromptLineOutcome` with one closed-over `quitArmed`:

- `quitArmed = classifyCommand(line)?.token === "quit"` on EVERY line — so any tolerated spelling
  of `quit` arms it and ANY other line (a command, a move, a rejected line) clears it;
- `if (wasArmed && quitArmed) return { kind: "quit" }` — transition 17, and the table is not
  consulted on that path;
- otherwise `resolvePromptLine(history, line, deps)`, unchanged.

`resolvePromptLine` stays a pure function over a string and ALWAYS answers the first-`quit` shape,
`{ kind: "command", messages: QUIT_CONFIRMATION_MESSAGES }` — so `ABC-037` `A4`/`A5`/`A7`'s
delegation spy kept its subject and `src/line-input.test.ts` is green untouched (29 / 29). The
table row `{ token: "quit", outcome: "command" }` is UNCHANGED: classifying `quit` produces the
confirmation, and the docblock on `CommandSpec` now says so, so the row is not a false sentence.

**Why not a module-level flag** — it is `ABC-045`'s `M5` shape, and it is now a mutant watched
red (`M3` in the sibling `observation`): two seams in one process would share it. The flag is
per `createPromptLineResolver` call, i.e. per `createLineInputSeam` call, i.e. per session.

**The confirmation item** is `"quit again to end"` — 17 columns exactly, the bound `ADR-0021`
clause 6 sets (`W` is 18 at the narrowest frame). Asserted `≤ 17` in a row, and a row composes
the real frame at the start position and asserts hidden count 0. It names the token the player
must repeat because the confirmation IS the repeat: there is no `y`, no `yes`, no second reader.

## 2. `new` is `{ kind: "take-back", plies: history.moves.length, messages: [] }`

`ADR-0021` clause 7, built literally — `messages: []`, which the ADR states and the subtask
elided as `[...]`; the ADR is the authority. `new` is a table row `{ token: "new", outcome:
"take-back" }`; `CommandToken` and `CommandSpec.outcome` widen by one member each;
`PromptLineOutcome`'s `Extract` gains `"quit" | "take-back"`. `resolvePromptLine` reads
`moves.length` — a field, never a derive — and mutates nothing; the LOOP splices and re-evaluates
(`ABC-120`'s transition 18), which is how `A5` is met. At ply 0 it is a take-back of 0, which
`takeBack` clamps; the seam does not guard (`ADR-0021` clause 4, coding rule 8).

## 3. Three readings, named rather than hidden

- **`A8`'s "one call-site line" in `src/line-input.ts` is THREE code lines**, not one: the
  import (`createPromptLineResolver` replaces `resolvePromptLine`), the per-seam declaration
  `const resolve = createPromptLineResolver(deps);` inside `createLineInputSeam`, and the call
  site `return resolve(history, line.text);`. A per-session flag needs a per-session binding, and
  the only per-session scope in that file is the seam factory's body. The numstat is +12 / −9;
  the rest is the two docblock sentences that would otherwise have read false (`ABC-114`'s
  lesson). Read as "the reader must call the stateful wrapper instead of bare
  `resolvePromptLine`", which is the amendment's own wording; QE may read it more strictly.
- **An OVER-CAP line between two `quit`s does not clear the flag.** `src/line-input.ts` answers
  `{ kind: "rejected", messages: LINE_TOO_LONG_MESSAGES }` for a > 1024-character line BEFORE the
  resolver is asked (`ABC-037`'s memory bound), so the wrapper never sees it. `quit` / `<1025
  chars>` / `quit` therefore ENDS the session. Every line the resolver DOES see clears it — a
  move, a rejected line (`zzz`), a command, `new` — and each is a row. Closing the gap needs a
  second line in the reader and a `disarm` on the wrapper's surface (coding rule 7); it is named
  here for QE / BA/PM rather than built.
- **`ABC-035 A4`'s "four-token half" is the `ABC-112` supersession, applied here:** `new` LEAVES
  the foreign list `["moves", "undo", "new"]` → `["moves", "undo"]` (the same move `resign` made
  at `ABC-045`), and the fence row *"no token carries an effect: `quit` and `board` are
  outcome-identical and payload-free"* — the row the ticket page authorises in writing — is
  SUPERSEDED and re-written to what is still true of the pure function (`board` payload-free;
  `quit` the confirmation and never an exit; no memory). `ABC-035`'s page is not opened.
  `ABC-112` is moot from this commit: `help` lists `quit` and `new` by construction and both are
  honoured. Its cancellation is the Orchestrator's board move.

## What was NOT done, deliberately

- `src/turn-loop.ts` byte-identical (`A8`) — the arms are `ABC-120`'s and were used as delivered.
- `src/cli.ts` untouched: `createLineInputSeam({ source, output })` already creates one seam per
  process, so one resolver per session falls out of the existing wiring.
- No `undo` (`ABC-102`, next on the table). No `play again?`. No `y`/`yes` alias.
- `src/cli-options.ts` / `ACCEPTED_ARGUMENTS` untouched: `--quit` / `--new` stay REFUSED command
  lines (`ABC-063`'s UAT-16 row is green and unmoved — that row is about argv verbs, not prompt
  tokens).
- `runLines` in `src/command-input.test.ts` now binds the wrapper (one per run) instead of bare
  `resolvePromptLine`, because the wrapper is what the product binds; every earlier row's outcome
  is unchanged (the two differ on the second consecutive `quit` only — measured: 98 → 131 rows,
  0 red).
