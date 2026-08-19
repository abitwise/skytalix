---
id: 20260820T190000Z-uat-planner-artifact-ref-the-uat-pack-three-input-path-tickets-7c41ae02
kind: artifact-ref
by: uat-planner
at: 2026-08-20T19:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-033
  - ABC-035
  - ABC-037
  - plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md
  - plans/tickets/ABC-035-in-game-commands.md
  - plans/tickets/ABC-037-the-real-prompt-input-seam.md
  - src/move-input.ts
  - src/coordinate-move.ts
  - src/command-input.ts
  - src/line-input.ts
  - src/cli.ts
  - agent-factory/workflows/06-uat-pack.md
  - agent-factory/checklists/uat-checklist.md
supersedes: 
---

# The UAT pack — `ABC-033`, `ABC-035`, `ABC-037`

## UAT goal, in one sentence a non-engineer can hold

**A person sits at the chess prompt, types the way they naturally type, and the product
understands them, tells them when it cannot, and never guesses a move on their behalf.**

## Build under test — the identity, so this pack can be re-run

- Command: `npm run chess` (`node src/cli.ts`). Run directly as `node src/cli.ts` so the
  transcripts carry no npm banner; the two are the same program and `AGENTS.md` § Commands
  records why the `--` separator matters when options are passed.
- Tree: worktree of `main` at `2605163`, branch `grugops/uat-input-path`. No file under `src/`,
  `AGENTS.md`, `plans/nfr-catalog.md`, `package.json` or `vitest.config.ts` was touched by this
  hop — a UAT that changes the product is not a UAT.
- Node v24.12.0, npm 11.7.0, darwin-arm64.
- The opponent is the merged engine at `DEFAULT_BUDGET_MS`, so **every human move costs up to
  3 real seconds** before the reply appears. That is the product working, not a hang.

## Entry criteria — met

All three tickets are `Ready for UAT` on the board, merged, and reachable from the one command
above. The zero-production-lines UAT waiver (`AGENTS.md` § Test and UAT authority, 2026-08-17)
was measured by the Orchestrator and does **NOT** apply to any of the three — each delivered
production lines. So a UAT is genuinely owed on each, and this pack is it.

## Test users and roles

**One role only: a player.** There is no login, no second actor, no privileged mode. Anyone who
can open a terminal can execute every scenario below without an engineer present.

## Test data — everything a non-engineer needs to type

The product always starts from the standard chess start position and accepts no position file,
so **the test data is the typed lines and, where a scenario needs a particular position, the
short opening that reaches it.** Each scenario below carries its own lines in full.

Two openings are re-used, and both are chosen only because they make a rule visible:

- **Reach an ambiguous knight move:** type `Nf3`, then `d4`, then `Nd2`. After those two moves
  BOTH white knights can legally reach `d2`, so `Nd2` is genuinely unclear.
- **Reach a legal castle:** type `Nf3`, then `e3`, then `Be2`, then `o-o` in lower case.

The opponent replies on its own; it is not test data and the scenarios do not depend on which
reply it chooses.

## Pass / fail criteria a non-engineer can judge, stated once

A scenario **PASSES** when the product does the thing written in its "expected" line and the
move-number line at the top of the board (`White to move 1.`) moves or stays exactly as that
line says. A scenario **FAILS** on any of:

- the board changes when the scenario says it must not,
- the product picks one of two possible moves instead of asking,
- a typed line is answered by silence,
- the program stops with anything other than the closing words `input ended`.

**No judgement of "looks right" is required anywhere in this pack.** Every check is a
countable thing on the screen.

## The scenarios

Grouped by ticket. The conducted results, with transcripts, are in the three sibling
`observation` notes; this note is the pack a person executes, not the report.

### `ABC-033` — one prompt, both ways of writing a move, and the refusal to guess

| # | What the player types | What must happen |
|---|---|---|
| 33-1 | `e4` | the pawn moves; the move list shows `1. e4` |
| 33-2 | `e2e4` (fresh game) | the same move; the same `1. e4` |
| 33-3 | `E2E4` (fresh game) | the same move; the same `1. e4` |
| 33-4 | `e2-e4` (fresh game) | the same move; the same `1. e4` |
| 33-5 | in ONE game: `e4`, then `g1f3`, then `F1C4` | all three accepted; nothing had to be declared or switched; move list shows `1. e4  2. Nf3  3. Bc4` |
| 33-6 | `Nf3`, `d4`, then `Nd2` | the product does **not** move a knight. It lists **both** possibilities, `Nbd2` and `Nfd2`, and asks again. The board and the move number are unchanged |
| 33-7 | continue 33-6 with `Nbd2` | now the knight moves, because the player said which one |
| 33-8 | `Nf3`, `e3`, `Be2`, then `o-o` in lower case | the castle is played and written into the move list as `O-O` |
| 33-9 | `zzz`, or an escape sequence pasted into the prompt | refused with a short message; board unchanged; the prompt returns |

### `ABC-035` — the four words a player can type instead of a move

| # | What the player types | What must happen |
|---|---|---|
| 35-1 | `help` | a list of the commands appears; the board and the move number do not change |
| 35-2 | `HELP` | exactly the same as 35-1 |
| 35-3 | `  BoArD  ` (spaces and mixed case) | the board is redrawn; **no** message; move number unchanged |
| 35-4 | `claim` with no draw available | the product explains why not, in numbers (`repetition 1 of 3`, `50-move 0 of 100`); no move, no ending |
| 35-5 | `quit` | recognised as a command; **the session does NOT end** — see Known limitations |
| 35-6 | `hel`, `boards`, `h`, `help me` | **none** of these is a command; each is refused as unreadable text; nothing happens to the board |
| 35-7 | `b4` at the start position | this is a **move**, not the `board` command; the pawn moves |

35-6 and 35-7 are the load-bearing rows. A product that helpfully accepted `h` for `help`
would sooner or later take a player's legal move away from them.

### `ABC-037` — the prompt itself

| # | What the player does | What must happen |
|---|---|---|
| 37-1 | types several moves, one per line, in one session | each is taken in the order typed, one per turn |
| 37-2 | ends the session (Ctrl-D) at the prompt | the product prints `input ended` and stops cleanly |
| 37-3 | ends the session **half way through typing a move** | the half-typed text is discarded, not guessed; `input ended`; clean stop |
| 37-4 | types `help` then ends the session half way through the next line | the `help` is honoured first, then the clean stop |
| 37-5 | pastes a line of 1025 characters or more | refused with `line too long / max 1024 chars`; board unchanged; session continues |
| 37-6 | pastes 1024 characters | judged as ordinary text (refused as unreadable), not by length |
| 37-7 | types `   e4   ` with spaces around it | accepted as `e4` |
| 37-8 | plays a game of eight half-moves through the prompt | the game keeps state, announces check, and keeps going |

## Known limitations — stated BEFORE signoff, not after a dispute

1. **`quit` does not quit.** `ABC-035` ships the *word*; `EPIC-006` ships the *effect* (the
   confirmation and the exit). Typing `quit` today is recognised and then nothing happens. This
   is the ticket's own documented boundary, and it is the single most likely thing for a player
   to report as a bug. **The owner should decide whether that is acceptable to accept.**
2. **`moves` is not a command** — it is `ABC-036`, deliberately split out.
3. **There is no way to start from a chosen position**, so any scenario needing a special
   position must be reached by playing to it. Two acceptance criteria are unreachable that way
   and are named as NOT EXERCISED in the decision note rather than assumed passing.
4. **`ABC-033` `A4` is falsified and re-scoped** (7+ candidate knights overflow the message
   region); the successor is `ABC-107`. It is not a defect of the delivered module and it was
   not re-cut here.
5. **Every human move costs up to 3 seconds** while the opponent thinks. A human executing this
   pack should expect a 4-move scenario to take roughly 12 seconds.

## Rollback

**Nothing to roll back, and the reason is structural rather than lucky.** This product deploys
nowhere (`AGENTS.md` § Deployment posture): it runs from source, in place, holds no data, writes
no file and has no released artifact. Rollback of any of these three tickets is `git revert` of
the merge on `main` by a human, and it affects nobody but the next person to run the command.

## Signoff person and exit criteria

Both are in the sibling `decision` note. **They are deliberately not in this pack**, because
this pack is what gets executed and the signature is what does not belong to whoever executes it.
