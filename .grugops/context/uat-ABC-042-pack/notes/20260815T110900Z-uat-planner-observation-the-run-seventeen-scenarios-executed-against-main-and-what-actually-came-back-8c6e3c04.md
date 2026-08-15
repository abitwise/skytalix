---
id: 20260815T110900Z-uat-planner-observation-the-run-seventeen-scenarios-executed-against-main-and-what-actually-came-back-8c6e3c04
kind: observation
by: uat-planner
at: 2026-08-15T11:09:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - src/cli.ts
  - src/cli-options.ts
  - AGENTS.md
supersedes: 
---

# The run — all seventeen scenarios executed against the delivered product, and what actually came back

**17 written · 17 run · 17 passed · 0 failed · 0 not run.**

**This is an agent's execution and report. It is NOT an acceptance signature, and no box in the
pack's § 9 signoff checklist has been ticked.** `context.human_admission` is `off` on this install;
no `finding` kind and no verification stamp is admissible here; this is an `observation` and carries
no `verified_by`. The signature is Olger Oeselg's alone.

Every command below was actually executed on the tree recorded in this folder's identity note — byte
identical to `main` — with stdout and stderr captured separately and the exit code read. **Nothing
below is inferred from source code.**

## The results, scenario by scenario

| # | Scenario | Result | What actually came back |
|---|---|---|---|
| UAT-1 | one command, a board appears | **PASS** | exit `0`; 27 lines on stdout (4 of them the package runner's banner, then the 23-row frame); stderr **0 bytes** |
| UAT-2 | a correct brand-new game | **PASS** | 8 rank rows; **16 black men and 16 white men** counted on the rank rows; file row `   a b c d e f g h   `; status `White to move  1.` and `material: 0` |
| UAT-3 | same command twice, same picture | **PASS** | two runs of `npm run chess -- --colour white`, compared byte for byte with `cmp`: **identical** |
| UAT-4 | I can play White, board faces me | **PASS** | white men on rows `2` and `1` at the bottom; letters `a b c d e f g h`; rank `8` top, `1` bottom |
| UAT-5 | I can play Black, board turns round | **PASS** | black men on rows `7` and `8` at the bottom; letters **`h g f e d c b a`**; rank `1` top, `8` bottom; still `White to move  1.` |
| UAT-6 | it can pick my side for me | **PASS** | ten runs: **8 white-bottom, 2 black-bottom — both appeared**; a second, independent twenty-run sweep gave 9 / 11. The word `random` appears **zero** times in the program's own output |
| UAT-7 | chess symbols on request | **PASS** | `--unicode`: **32 code points in `U+2654`–`U+265F`, 12 distinct** — the twelve piece types, thirty-two men |
| UAT-8 | plain letters on request | **PASS** | `--ascii`: `K Q R B N P` / `k q r b n p`, **zero** chess figures |
| UAT-9 | both at once is refused, not guessed | **PASS** | exit `1`; stderr line 1 names **both**: `--ascii and --unicode cannot be used together: --ascii --unicode`; line 2 the usage line; **zero** board rows on stdout or stderr |
| UAT-10 | a word it does not know stops it, by name | **PASS** — all nine | see the table below |
| UAT-11 | a refusal never half-draws a board | **PASS** | across all ten refusals (UAT-9 + UAT-10 a–i), **zero** rank rows and zero letter rows on stdout **or** stderr. Stdout carried only the runner's banner |
| UAT-12 | a nasty argument cannot scramble my screen | **PASS** | see § "UAT-12 in detail" below — **zero screen-clear sequences reached the terminal, and the screen was not cleared**, in both a piped run and a real pseudo-terminal |
| UAT-13 | fast enough to feel instant | **PASS** | ten runs of `npm run chess`: **median 167 ms** (range 164–199 ms) against a 1 000 ms bar. The program alone, without the package runner: **median 80 ms** (range 76–82 ms). Apple M3, Node v24.12.0 |
| UAT-14 | the documented command is the working command | **PASS** | `AGENTS.md:62` reads ``Dev / run: `npm run chess` `` and names `--colour white\|black\|random`, `--ascii`, `--unicode`. All four documented forms ran as documented |
| UAT-15 | it draws once and stops; it does not wait for a move | **PASS** | see § "UAT-15 in detail" — the program does not read anything you type, and does not wait |
| UAT-16 | no way to make a move, by any route | **PASS** | all six refused — see the table below |
| UAT-17 | runs only from the project folder | **PASS** | from `/tmp`: exit `254`, `npm error code ENOENT … Could not read package.json`, **no board** |

## UAT-10 in detail — nine wrong commands, nine refusals, each naming the offending word

| # | Command | Exit | The first line of stderr, verbatim | Board rows |
|---|---|---|---|---|
| a | `npm run chess -- --difficulty 3` | `1` | `unrecognised argument: --difficulty` | 0 |
| b | `npm run chess -- -x` | `1` | `unrecognised argument: -x` | 0 |
| c | `npm run chess -- foo` | `1` | `unrecognised argument: foo` | 0 |
| d | `npm run chess -- white` | `1` | `unrecognised argument: white` | 0 |
| e | `npm run chess -- --colour purple` | `1` | `--colour needs one of white\|black\|random: purple` | 0 |
| f | `npm run chess -- --colour` | `1` | `--colour needs one of white\|black\|random: --colour` | 0 |
| g | `npm run chess -- --help` | `1` | `unrecognised argument: --help` | 0 |
| h | `npm run chess -- --COLOUR white` | `1` | `unrecognised argument: --COLOUR` | 0 |
| i | `npm run chess -- --colour WHITE` | `1` | `--colour needs one of white\|black\|random: WHITE` | 0 |

Every one is followed by the same second line:

```
usage: npm run chess [--colour white|black|random] [--ascii | --unicode]
```

**Rows h and i are the ones worth reading twice.** A program that quietly forgives capitalisation
would accept them; this one refuses both and says which word it refused. **Row g means there is no
help screen** — asking for help gets the usage line by way of a refusal. That is the whole of the
help this version offers, and the pack records it as such rather than as a gap.

## UAT-16 in detail — six ways to try to play, six refusals

| Command | Exit | stderr line 1 | Board rows |
|---|---|---|---|
| `npm run chess -- --move e4` | `1` | `unrecognised argument: --move` | 0 |
| `npm run chess -- e4` | `1` | `unrecognised argument: e4` | 0 |
| `npm run chess -- --new` | `1` | `unrecognised argument: --new` | 0 |
| `npm run chess -- --undo` | `1` | `unrecognised argument: --undo` | 0 |
| `npm run chess -- --resign` | `1` | `unrecognised argument: --resign` | 0 |
| `npm run chess -- --quit` | `1` | `unrecognised argument: --quit` | 0 |

**This is the pack's most important passing scenario.** It is the ticket's headline —
*it prints a board, it does not play a game* — turned into six commands a person can type and watch
fail. The signer does not have to take the limitation on trust.

## UAT-15 in detail — how "it does not wait for a move" was actually established

**The pack's procedure for a human is: run it, then type `e2e4` at the prompt that comes back.** An
agent has no interactive prompt to type at, so the same property was established two other ways.
**Both are recorded, and the substitution is recorded with them, because a reader is entitled to know
that the human procedure and the executed procedure are not the same keystrokes.**

1. **Input offered, and ignored.** `printf 'e2e4\nquit\n' | npm run chess` → exit `0`, exactly one
   board (a single occurrence of the file-letter row), stderr 0 bytes, and **zero** occurrences of
   `e2e4` or `quit` anywhere in the output. What was typed reached nothing.
2. **Input held open, and not waited for.** The command was run with its input attached to a pipe
   that was deliberately **kept open and empty for 20 seconds**. A program that waits for a move
   would have blocked for the full 20 s. It **finished in 211 ms with exit `0`** and a complete
   board.

**Conclusion, in the pack's own terms:** the program has already ended before a person could type
anything, and it would not have listened if they had.

## UAT-12 in detail — the hostile argument, and exactly which bytes reached the terminal

Argument: `CLEARME` + an ESC `[2J` screen-clear sequence + `END`.

| channel | what arrived |
|---|---|
| the program's own message (stderr) | `unrecognised argument: CLEARME[2JEND` — **the ESC byte was removed**; the visible characters survived so the person can see what they typed |
| stdout, piped | **0** ESC bytes, **0** `ESC [` sequences. The runner's banner showed the argument in the visible caret form `CLEARME^[[2JEND` |
| stdout+stderr, under a real pseudo-terminal | **0** occurrences of the screen-clear sequence `ESC [ 2J`. **The screen was not cleared.** |
| exit code | `1`, and **zero** board rows |

**One honest detail, measured and not smoothed:** under a pseudo-terminal the captured stream
contains **two** ESC bytes — the trailing `ESC[1G ESC[0K` the package runner writes to tidy up its own
progress spinner. They are the runner's, they are not derived from the argument, and neither of them
clears, moves or repaints the screen. **The program itself emitted zero ESC bytes on every run
measured, piped or on a terminal.**

## The one wording defect this run found, and what was done about it

**Found in my own scenario, not in the product**, and recorded rather than quietly patched:

UAT-6 was first written to require that *"the word `random` never appears anywhere on the screen."*
The run showed the word **does** appear — on line 3 of every run, inside the package runner's echo of
the command line the tester just typed (`> node src/cli.ts --colour random`). Checked at the source:
the program's own output contains the word **zero** times; only the runner's echo carries it.

**The scenario was wrong, so the scenario was corrected before the pack was published** — it is now
scoped to the board and the status line, with the runner's echo called out in the scenario itself.
**The result was not adjusted to fit the wording.** Stated plainly because the reverse — quietly
relaxing a criterion until the product passes it — is the exact failure a UAT exists to catch.

## What was NOT run, and why nothing is hiding here

- **Zero scenarios are unrun.** All seventeen executed.
- **Zero scenarios failed.**
- The two departures from the pack's literal human procedure are both in UAT-15 and both are
  described above in full.
- **The automated test suite was not run by this hop** — coverage is QE/E2E's subtask.
- **Node 22 was not exercised.** `package.json` requires `>= 22`; the run used 24.12.0. The oldest
  supported runtime is untested by this pack.
- **No terminal other than macOS `Terminal`-class pseudo-terminals was exercised**, so how the chess
  figures render in another terminal or font is unmeasured.
