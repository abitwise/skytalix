# Play-test guide: do games get abandoned?

**For:** you, the owner. **Question it answers:** should we build *save and resume* or *export the game as PGN*?
Or should we drop both? They are only worth building if real games get stopped half-way. You decide, and this
guide gives you the evidence.

## 1. Setup (once)

You need Node 22 or newer. It was checked here on Node 26.

```sh
git clone <this repo> && cd <this repo>
npm install
npm run chess
```

`npm run chess` asks two questions. Press Enter to keep the default shown in brackets:

```
colour (white|black|random) [white]:
difficulty (1|2|3|4|5) [5]:
```

If you would rather skip the questions, put the choices on the command line:

```sh
npm run chess -- --colour black --difficulty 3
npm run chess -- --colour random --difficulty 2
```

- `--difficulty`: 1 is the weakest and 5 the strongest (the default). On 5 the engine may think for about 3 seconds a move.
- `--ascii` / `--unicode`: use these if the pieces look wrong. Do not use both.
- There is no `--help`. A wrong flag prints the usage line and stops.

## 2. In-game cheat sheet

| Type | What it does |
|---|---|
| `e4`, `Nf3`, `O-O`, `exd5` | Make a move (normal chess notation) |
| `e2e4`, `g1f3`, `e7e8q` | Also a move (from-square to-square, letter for promotion) |
| `undo` | Take back your last move and the engine's reply |
| `new` | Start over from the first move |
| `moves` | List your legal moves |
| `board` | Draw the board again |
| `claim` | Claim a draw (repetition or 50-move rule) |
| `resign` | Give up. The game ends and shows the full move list |
| `quit`, then `quit` again | Leave straight away. No result and no move list |
| `help` | Show these words |
| Ctrl-D | Also leaves (`input ended`) |

One run is one game. After it ends, type `npm run chess` again for the next one.

## 3. The protocol

- **Play 5 games over at least 2 sittings** (for example, different evenings). Abandoning shows up when real life
  gets in the way, so one long sitting would hide it. Five games is enough to see a pattern and still fits in a week.
- **Vary the games.** Play at least 2 as white and 2 as black. Use at least one easy level (1–2) and at least one
  hard one (4–5).
- **Play the way you normally would.** If you want to stop, stop. Don't push on for the test. A stopped game is the
  data we need.
- **Optional:** get one other person to play 2–3 games and fill in the same table.

## 4. What to record

Fill in one row per game, straight after it. It takes under a minute.

- **Ended:** `finished` means checkmate, a draw, or a resignation because the position was lost. `abandoned` means
  anything else: quit, Ctrl-D, closing the window, walking away, or resigning just to leave.
- **Move:** the move number when you stopped. It is shown under the board, as in `White to move  12.`

```
| # | Date | Colour | Level | Ended (finished/abandoned) | Move # if abandoned | Why (time / bored / losing / bug / other) | Would I have saved and come back? (y/n) | Want this game as a PGN file? (y/n) | Bugs or annoyances |
|---|------|--------|-------|----------------------------|---------------------|-------------------------------------------|------------------------------------------|-------------------------------------|--------------------|
| 1 |      |        |       |                            |                     |                                           |                                          |                                     |                    |
| 2 |      |        |       |                            |                     |                                           |                                          |                                     |                    |
| 3 |      |        |       |                            |                     |                                           |                                          |                                     |                    |
| 4 |      |        |       |                            |                     |                                           |                                          |                                     |                    |
| 5 |      |        |       |                            |                     |                                           |                                          |                                     |                    |
```

## 5. Deciding (our recommendation; the call is yours)

Count across all the games, including the other person's if they played.

- **Build save/resume** if **2 or more** games were abandoned with "saved and come back?" = **y**. An abandon
  because you were bored or losing does not count, because save would not have helped.
- **Build PGN export** if **2 or more** games have "want as PGN?" = **y**. Remember that a finished game already
  prints its whole move list on screen. So a "y" should mean you wanted a *file* to keep or open in another chess
  program.
- **Build both** if both rules hit.
- **Build neither** if neither rule hits. Drop the slice, and BA/PM checks whether EPIC-006 can then close.
- **Bugs and annoyances** are reported on their own and do not count towards this decision.

## 6. Hand back

Paste the filled table, and your decision if you have made one, into the Orchestrator session. Or save it as
`plans/uat/EPIC-006-play-test-log.md`. The Orchestrator records it as your word and passes it to BA/PM, who cut
tickets for what you chose, or close the epic.

---
<sub>Sources, checked on `main` @ `8f619b80`: `package.json` (`chess` script, Node ≥ 22), `src/cli-options.ts`
(the flags; no `--help`), `src/startup-questions.ts` (the two questions and their defaults), `src/command-input.ts`
(the in-game commands), `src/coordinate-move.ts` and `src/san.ts` (move formats), `src/levels.ts` (3 s budget at
level 5), `src/result-screen.ts` (move list at the end). Run in this worktree on Node 26.11.1. The epic's ask is
`plans/epics/EPIC-006-game-session-and-packaging.md` § Negotiable slice.</sub>
