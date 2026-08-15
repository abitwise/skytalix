---
id: 20260815T110533Z-uat-planner-decision-the-abc042-uat-pack-seventeen-scenarios-a-non-engineer-can-run-and-judge-f43cd04c
kind: decision
by: uat-planner
at: 2026-08-15T11:05:33Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - EPIC-006
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - agent-factory/checklists/uat-checklist.md
  - agent-factory/workflows/06-uat-pack.md
  - .grugops/context/uat-ABC-042-2026-08-15/notes/20260815T105600Z-orchestrator-decision-uat-abc042-ordered-routing-and-the-row-that-does-not-move-97f07fc1.md
  - AGENTS.md
supersedes: 
---

# The `ABC-042` UAT pack — seventeen scenarios a non-engineer can run and judge

**This pack is the thing a named human executes and signs. It is written for a reader who does not
read code and will not be given a translator.** It is derived from the ticket's `A1`–`A12` but it is
not a restatement of them: `A1`–`A12` are engineering assertions about frames, exports, byte
identity and spawn counts; the scenarios below are questions about a product, each answerable by
looking at a screen.

**Read § "What this product does NOT do" before § "The scenarios".** That section is the reason this
pack exists in this shape, and it governs every line above and below it.

---

## 1. The UAT goal

**Answer one question for the project owner: *can a person start this thing, and is what appears on
the screen the right thing?***

This is the first time in this repository's history that the question can be asked at all. Twenty-eight
tickets are `Done` and every one of them recorded *UAT deferred → `EPIC-006`, explicitly NOT passed*,
because nothing was exercisable from outside the test suite. `ABC-042` merged a command. **This pack
discharges that deferral for `ABC-042` and for nothing else.**

## 2. What is being accepted

**A command that draws one chess board and stops.** Nothing more. The scope of acceptance is exactly:

- the command starts,
- the board it draws is the correct opening position,
- the person can choose their side and how the pieces are drawn,
- a mistyped option is refused clearly instead of guessed at,
- and the whole thing is over in well under a second.

**What is NOT being accepted is in § 7, and § 7 is the load-bearing part of this document.**

## 3. Entry criteria — all met before a scenario is run

| # | Entry criterion | State |
|---|---|---|
| 1 | The change is merged into the product's main line | Met — `ABC-042` is on `main` |
| 2 | The quality gate was green on the branch and again after the merge | Met — recorded by QE at the merge: lint 0, typecheck 0, build 0, 856/856 tests on 30 files, 0 skipped, integrity clean |
| 3 | The security review is closed | Met — reviewed against ASVS L1, one blocking item raised and discharged on measurement |
| 4 | Acceptance criteria exist, are unambiguous, and were repaired to the point of being testable | Met — `A1`–`A12`, three repair rounds |
| 5 | The limitations were written by the analyst BEFORE acceptance, not after a dispute | Met — the ticket carries § *"What this ticket does NOT make runnable"* and § *"Out of scope"*; § 7 below is those two sections in business language |
| 6 | A machine with the project checked out and `npm install` run | Met — see the environment note in this folder |

## 4. Who runs this, and who signs

| Role | Person | What they do |
|---|---|---|
| **Accepting authority** | **Olger Oeselg, project owner** | Executes or witnesses the scenarios, decides accept / reject, and **signs**. His is the only signature this pack recognises. |
| Preparer | UAT Planner (agent) | Wrote this pack and executed every scenario once, reporting actuals |
| Coverage validator | QE/E2E (agent) | Confirms the automated tests back these scenarios and names the gaps |
| Value validator | BA/PM (agent) | Confirms the scenarios cover the user value and the scope |

**No agent signs.** The agent run reported alongside this pack is *evidence offered to the signer*,
not the signature. The distinction is the project owner's own, recorded in
`memory-bank/60-progress.md`: an agent-run UAT is *the execution of the scenarios and the reporting
of the result*; it is **not** a named human's acceptance.

## 5. Test data

There is no database, no account, no fixture file and no test user. **The test data is the command
line itself**, plus one starting chess position that the product supplies.

| Data item | Value | Used by |
|---|---|---|
| The opening position | The standard chess starting array — 8 black men on the top two rows, 8 white men on the bottom two, four empty rows between | UAT-2, UAT-16 |
| Valid side words | `white`, `black`, `random` | UAT-4, UAT-5, UAT-6 |
| Valid drawing words | `--ascii` (plain letters), `--unicode` (chess symbols) | UAT-7, UAT-8 |
| Wrong words to try | `--difficulty 3`, `-x`, `foo`, `white` on its own, `--colour purple`, `--colour` with nothing after it, `--help`, `--COLOUR white`, `--colour WHITE` | UAT-10, UAT-11 |
| Game words that do not exist yet | `--move e4`, `e4`, `--new`, `--undo`, `--resign`, `--quit` | UAT-16 |
| The hostile argument | the eight visible characters `CLEARME`, then an invisible screen-clearing control code, then `END` — produced by `$(printf 'CLEARME\033[2JEND')` | UAT-12 |

**How to type an option.** The tool is started through the project's package runner, so options need a
bare `--` in front of them to get past the runner and reach the program:

```
npm run chess -- --colour black
```

Without the `--`, the runner eats the option and it never reaches the chess program. **Every command
in this pack is written out in full; type it exactly as printed**, and this is not a formality —
it was measured, and forgetting the `--` fails in two different confusing ways:

- `npm run chess --ascii` **prints a board and reports success, having silently thrown your `--ascii`
  away.** You get a board; you do not get the one you asked for.
- `npm run chess --colour black` complains `unrecognised argument: black` — blaming the word you
  meant as the *answer*, not the word you got wrong.

Neither is the chess program's doing; both are the package runner. **If a scenario below behaves
oddly, check the `--` before recording a failure.**

**How to read the result code.** After any command, type `echo $?`. `0` means the command succeeded;
anything else means it failed. Several scenarios below are judged on this.

## 6. The scenarios

Seventeen. Each is one question, one command, one thing to look at, and one line that decides
pass or fail. **A scenario nobody can run is marked NOT RUN with the reason — never quietly passed.**

### Group A — does it start, and is the picture right?

**UAT-1 — I can start it with one command and a chess board appears.**
- Command: `npm run chess`
- Then: `echo $?`
- Expect: a board on the screen, eight rows numbered `8` down to `1`, a row of letters `a` to `b`…`h`
  underneath, a line saying it is White's move, and the shell prompt back. `echo $?` prints `0`.
- **PASS** if a board appears and the result code is `0`. **FAIL** if nothing appears, an error
  appears, or the result code is not `0`.

**UAT-2 — the board shows a brand-new game, set up correctly.**
- Command: `npm run chess`
- Expect: the top two rows full of black's sixteen men, the bottom two rows full of white's sixteen,
  the four rows between them empty, and a status line reading `White to move  1.` with `material: 0`.
- **PASS** if the position is a correct, complete opening set-up and it is White's turn at move 1.
  **FAIL** if any man is missing, misplaced, or it is not White's move.

**UAT-3 — the same command twice draws the same picture.**
- Commands: `npm run chess -- --colour white` twice in a row.
- Expect: the two boards are indistinguishable.
- **PASS** if the two runs look identical. **FAIL** if anything differs between them.

### Group B — can I choose my side?

**UAT-4 — I can play White, and the board faces me.**
- Command: `npm run chess -- --colour white`
- Expect: white's men on the bottom two rows, the letter row reads `a b c d e f g h`, rank `8` at the
  top and `1` at the bottom.
- **PASS** if white is at the bottom. **FAIL** otherwise.

**UAT-5 — I can play Black, and the board turns round to face me.**
- Command: `npm run chess -- --colour black`
- Expect: black's men on the bottom two rows, the letter row reads `h g f e d c b a`, rank `1` at the
  top and `8` at the bottom. It is still White's move (White always moves first).
- **PASS** if black is at the bottom and the letters are reversed. **FAIL** otherwise.

**UAT-6 — I can let it pick my side for me.**
- Command: `npm run chess -- --colour random`, run **ten times**.
- Expect: every run shows one of exactly the two boards from UAT-4 and UAT-5. Over ten runs, **both**
  appear at least once. **The word `random` never appears on the board or in the status line** — the
  program picks a real side before it draws anything.
- **PASS** if all ten runs show one of the two known boards, both sides came up at least once, and no
  board or status line says `random`. **FAIL** if any run shows a third kind of board, if the word
  `random` reaches the board or status line, or if ten runs produce only one of the two sides.
- *Scope note, and it was corrected against a real run rather than guessed: the package runner prints
  the command you typed as its first two lines, so the word `random` **is** on the screen — in the
  echo of your own command line, above the board. That is the runner repeating you, not the program.
  This clause is about the board, which is where it would matter.*

### Group C — can I choose how the pieces are drawn?

*Before you start Group C, know what "no option at all" does, because it is not fixed and this
surprises people: **on a real terminal the product draws chess symbols by default; sent to a file or
through a pipe it draws plain letters.** That is deliberate — a file has no font. It means UAT-1 and
UAT-2 will show you symbols on screen and letters in a saved copy, and neither is wrong. The two
scenarios below are about what happens when you ask **explicitly**, which is fixed either way.*

**UAT-7 — I can ask for chess symbols.**
- Command: `npm run chess -- --unicode`
- Expect: pieces drawn as the chess figures ♔ ♕ ♖ ♗ ♘ ♙ and ♚ ♛ ♜ ♝ ♞ ♟, thirty-two of them.
- **PASS** if the pieces are figures. **FAIL** if they are letters.

**UAT-8 — I can ask for plain letters instead.**
- Command: `npm run chess -- --ascii`
- Expect: pieces drawn as letters — `K Q R B N P` for white, `k q r b n p` for black — and no chess
  figures anywhere.
- **PASS** if the pieces are letters. **FAIL** if any figure appears.

**UAT-9 — if I ask for both at once, it tells me instead of guessing.**
- Command: `npm run chess -- --ascii --unicode`
- Then: `echo $?`
- Expect: one line of complaint that **names both** `--ascii` and `--unicode`, followed by a usage
  line showing the accepted options. **No board at all.** `echo $?` prints something other than `0`.
- **PASS** if both option names appear in the complaint, no board is drawn, and the result code is
  non-zero. **FAIL** if it picks one silently, draws a board, or reports success.

### Group D — what happens when I get it wrong?

**UAT-10 — a word it does not know stops it, and it tells me which word.**
- Commands, one at a time, checking `echo $?` after each:

| # | Command | The complaint must name |
|---|---|---|
| a | `npm run chess -- --difficulty 3` | `--difficulty` |
| b | `npm run chess -- -x` | `-x` |
| c | `npm run chess -- foo` | `foo` |
| d | `npm run chess -- white` | `white` |
| e | `npm run chess -- --colour purple` | `purple` |
| f | `npm run chess -- --colour` | `--colour` |
| g | `npm run chess -- --help` | `--help` |
| h | `npm run chess -- --COLOUR white` | `--COLOUR` |
| i | `npm run chess -- --colour WHITE` | `WHITE` |

- Expect for each: a complaint that **names the offending word**, then the usage line, no board, and a
  non-zero result code.
- **PASS** only if **all nine** name the offending word, draw no board, and fail. **FAIL** if any one
  of them starts a game, stays silent about which word was wrong, or reports success.
- *Rows h and i are the ones that catch a program that quietly forgives spelling. They must be
  refused; the product is deliberately strict about upper and lower case.*

**UAT-11 — a refusal never half-draws a board.**
- Commands: every command in UAT-9 and UAT-10.
- Expect: not one rank row, not one letter row, not one piece — on the normal output **or** in the
  error text. The screen shows the complaint and the usage line and nothing else.
- **PASS** if no fragment of a board appears anywhere for any refusal. **FAIL** if any refusal prints
  any part of a board.

**UAT-12 — a nasty argument cannot scramble my screen.**
- Command: `npm run chess -- "$(printf 'CLEARME\033[2JEND')"` — an option carrying a hidden
  screen-clearing instruction.
- Then: `echo $?`
- Expect: the complaint echoes the **visible** characters back (`CLEARME`, `[2J`, `END`) so you can
  see what you typed, the screen is **not** cleared, no board is drawn, and the result code is
  non-zero.
- **PASS** if the screen survives intact, the visible characters are echoed, no board is drawn and the
  command fails. **FAIL** if the screen clears, jumps, or changes colour, or if the visible characters
  are swallowed so that you cannot tell what you typed.

### Group E — is it usable?

**UAT-13 — the board appears fast enough to feel instant.**
- Command: `npm run chess`, ten times, timed.
- Expect: the middle time of the ten is **one second or less**.
- **PASS** if the median is ≤ 1 second. **FAIL** if it is more.

**UAT-14 — the command written in the project's own instructions is the command that works.**
- Read `AGENTS.md` § Commands, line `Dev / run`, and run exactly what it says, with each option it
  lists.
- Expect: the documented command and all three documented options behave as this pack describes.
- **PASS** if the documentation and the product agree. **FAIL** if the instructions name a command or
  an option that does not work.

### Group F — the limits, made checkable, so nobody signs the wrong thing

**These three scenarios exist to make the boundary VISIBLE to the signer. They pass when the product
correctly refuses to do things it does not yet do. A tester who reads only Groups A–E will walk away
believing a chess game was delivered; these three prevent that.**

**UAT-15 — it draws once and stops. It does not wait for a move.**
- Command: `npm run chess`, then, at the prompt that comes back, type `e2e4` and press Enter.
- Expect: the program has **already finished** before you type. Whatever you type goes to the shell,
  not to the game — the shell will complain that `e2e4` is not a command. The board does not change
  and no second board appears.
- **PASS** if the program has already ended and nothing you type reaches it. **FAIL** if it waits for
  input (that would mean a game loop exists that this ticket does not claim), or if it hangs.

**UAT-16 — there is no way to make a move, by any route.**
- Commands: `npm run chess -- --move e4`, `npm run chess -- e4`, `npm run chess -- --new`,
  `npm run chess -- --undo`, `npm run chess -- --resign`, `npm run chess -- --quit`
- Expect: **every one is refused** as an unknown word, with a non-zero result code and no board.
- **PASS** if all six are refused. **FAIL** if any of them is accepted — accepting one would mean the
  product does something this pack has not tested and this ticket does not claim.
- *This is the scenario that turns § 7's headline into something a signer can verify with their own
  hands rather than take on trust.*

**UAT-17 — it runs only from the project folder; it is not installed on this machine.**
- Commands: change to any other folder (for example `cd ~`), then `npm run chess`.
- Expect: it fails, complaining that it cannot find the project file, and no board appears.
- **PASS** if it fails outside the project folder. **FAIL** if a board appears — that would mean
  something was installed system-wide, which this ticket explicitly did not do.

## 7. What this product does NOT do — read before signing

**IT PRINTS A BOARD. IT DOES NOT PLAY A GAME.** This is the ticket's own sentence, and it is the
single most important line in this pack. **A signature on this pack is a signature on a picture of a
chess board, not on a chess program.**

Concretely, and each one is checkable by UAT-15 / UAT-16:

1. **You cannot make a move.** There is no way to type one, no option that carries one, and nothing
   that would receive one. The program has no way to read anything you type.
2. **There is no opponent.** No engine exists. Nothing will ever move a piece back at you.
3. **The position never changes.** Every run shows the same opening position. There is no second
   board, no move list that fills up, no clock.
4. **The move-list and status areas below the board are empty placeholders.** They are the right
   shape and they will stay blank forever in this version.
5. **There is no `undo`, no `resign`, no `new game`, no `quit`** — there is nothing to undo, resign,
   restart or quit from.
6. **There is no difficulty setting.** `--difficulty` is refused. It needs an engine, and there is no
   engine. **The packaging epic's acceptance criterion #4 is therefore NOT met by this ticket** and is
   named here rather than smoothed over.
7. **Nothing was installed on the machine and nothing was published.** There is no `chess` command;
   the project cannot be run with `npx`; it only runs from inside the checked-out project folder
   (UAT-17). **The packaging epic's acceptance criterion #1 (`npx <package>`) is NOT met, and cannot
   be met by any ticket until a human decides how this product will be distributed.**
8. **Nothing is deployed anywhere.** This product runs on one developer machine, from source. There
   is no server, no service, no release.
9. **This pack accepts `ABC-042` alone.** The other twenty-seven `Done` tickets remain
   *UAT deferred → `EPIC-006`, explicitly NOT passed*. **Signing this does not accept them.**

**The failure this section exists to prevent:** a reader who sees seventeen scenarios all pass and
concludes *"the chess game works."* It does not. **If this pack is ever summarised in a sentence, the
sentence is: "the board draws correctly; the game does not exist yet."**

## 8. Rollback

**Rollback is not needed and there is nothing to roll back from.**

- **Nothing is deployed.** There is no environment to revert, no release to pull, no user to notify.
  The product runs from source on one machine.
- **Rejecting this pack changes nothing on any running system.** It routes the ticket back for repair.
- **If the change itself had to be withdrawn**, the mechanism is a source-control revert of the
  merge commit on the project's main line, performed by a human. It would restore the state of two
  days ago: eighteen production modules, a full test suite, and **no way for any person to start
  anything** — which is the pain `ABC-042` was cut to remove.
- **The blast radius of a wrong acceptance is a documentation error, not an outage.** The visible
  consequence would be `AGENTS.md` naming a command that does not work.

## 9. Signoff checklist — for Olger Oeselg, project owner

**To be completed by the named human. No agent may tick these boxes, and none has.**

| # | Statement | Initial / date |
|---|---|---|
| 1 | I ran, or watched someone run, UAT-1 to UAT-17 | ☐ |
| 2 | A chess board appeared, and it was a correct new game | ☐ |
| 3 | I could choose White, Black, and let it choose for me | ☐ |
| 4 | I could choose chess symbols and plain letters | ☐ |
| 5 | Every wrong option I tried was refused, and told me which word was wrong | ☐ |
| 6 | No refusal ever drew part of a board | ☐ |
| 7 | The board appeared in well under a second | ☐ |
| 8 | **I have read § 7 and I understand I am accepting a board that is drawn, NOT a game that can be played** | ☐ |
| 9 | **I understand no move can be made, there is no opponent, and the position never changes** | ☐ |
| 10 | **I understand nothing is installed and nothing is published — this runs only from the project folder** | ☐ |
| 11 | **I understand this accepts `ABC-042` only, and the other twenty-seven `Done` tickets stay un-accepted** | ☐ |
| 12 | Accept / Reject, and my name and the date | ☐ |

**Item 8 is the one that matters.** A signature with 1–7 ticked and 8 unread is the failure this whole
pack was shaped to prevent.

## 10. Exit criteria

Acceptance is complete when **all** of these hold:

1. All seventeen scenarios have a recorded outcome — **pass, fail, or not run with a reason.** No
   scenario is left blank and none is passed by default.
2. Zero scenarios in Group A–E failed.
3. All three scenarios in Group F passed, which is what makes § 7 verified rather than merely stated.
4. The named human has ticked every box in § 9, **including 8 to 11**, and recorded Accept or Reject
   with a name and a date.
5. If any scenario failed, the ticket does **not** exit UAT: the failure is reported as-is and the
   Orchestrator routes it. **The tester does not fix it and does not raise the defect themselves.**

## 11. The kit checklist, worked through

`agent-factory/checklists/uat-checklist.md`, item by item:

| Checklist item | Where it is discharged |
|---|---|
| UAT goal clear | § 1 |
| entry criteria met | § 3 — six criteria, all met, each with its evidence |
| business scenarios listed | § 6 — seventeen, in six groups |
| test data ready | § 5 — the command line is the data; every value written out |
| expected results clear | § 6 — every scenario carries an "Expect" and a PASS/FAIL line |
| known limitations listed | § 7 — nine, written before signoff, three of them made checkable by Group F |
| rollback known | § 8 — nothing to roll back; the mechanism named anyway |
| signoff person/role known | § 4 and § 9 — **Olger Oeselg, project owner**, named, un-delegated |
| exit criteria clear | § 10 — five, including the "no blank outcomes" rule |

**Nine of nine.**

## 12. What this pack deliberately does not contain

- **No signature, and no space that an agent could later be read as having filled.** The signature is
  the owner's; `context.human_admission` is `off` on this install and no `finding` kind and no
  verification stamp is admissible here, so this note is a `decision` and carries no `verified_by`.
- **No board move, no traceability row, no metrics row.** Those belong to the Orchestrator at close.
- **No defect ticket.** If a scenario had failed, it would be reported here and routed — not
  self-triaged.
