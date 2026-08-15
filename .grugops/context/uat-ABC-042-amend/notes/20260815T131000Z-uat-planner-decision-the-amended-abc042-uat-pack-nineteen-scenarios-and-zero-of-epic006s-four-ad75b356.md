---
id: 20260815T131000Z-uat-planner-decision-the-amended-abc042-uat-pack-nineteen-scenarios-and-zero-of-epic006s-four-ad75b356
kind: decision
by: uat-planner
at: 2026-08-15T13:10:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - EPIC-006
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - agent-factory/checklists/uat-checklist.md
  - agent-factory/workflows/06-uat-pack.md
  - AGENTS.md
  - .grugops/context/uat-ABC-042-bapm/notes/
  - .grugops/context/uat-ABC-042-qe/notes/
  - .grugops/context/uat-ABC-042-amend/notes/20260815T130800Z-uat-planner-observation-the-amendment-run-two-new-scenarios-executed-and-four-facts-re-measured-a2c53294.md
supersedes: 20260815T110533Z-uat-planner-decision-the-abc042-uat-pack-seventeen-scenarios-a-non-engineer-can-run-and-judge-f43cd04c
---

# The `ABC-042` UAT pack, AMENDED — nineteen scenarios, and the sentence that was missing: `ABC-042` meets ZERO of `EPIC-006`'s four acceptance criteria

**This note SUPERSEDES the first version of the pack**
(`20260815T110533Z-…-f43cd04c`). That note stays on file as the audit trail; **this is the version to
execute and sign.** Nine gaps were named by BA/PM reading the first version independently, and ten
coverage findings by QE; the repairs are in this document and the gap-by-gap disposition is in the
sibling `observation` note in this folder. **Nothing here changes the product** — `src/` and
`package.json` are byte-identical to `main`, re-proved on this hop.

**Still unsigned.** No box below is ticked, no `finding` kind and no `verified_by` stamp is used —
`context.human_admission` is `off` on this install. The signature is Olger Oeselg's alone.

**This pack is the thing a named human executes and signs. It is written for a reader who does not
read code and will not be given a translator.** It is derived from the ticket's `A1`–`A12` but it is
not a restatement of them: `A1`–`A12` are engineering assertions about frames, exports, byte
identity and spawn counts; the scenarios below are questions about a product, each answerable by
looking at a screen.

**Read § 7, "What this product does NOT do", before § 6, "The scenarios".** That section is the
reason this pack exists in this shape, and it governs every line above and below it. **§ 7 now
carries the four-criteria table that the first version was missing.**

*Section numbers are deliberately unchanged from the first version, so that every reference to § 5,
§ 7, § 9 and § 10 in the BA/PM and QE validation notes still resolves. Two sections are added at the
end (§ 9b is inside § 9; § 13 is new).*

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
| 1 | The change is merged into the product's main line | Met — `ABC-042` is on `main`; re-checked at this amendment, `main` has moved on (the first pack merged into it) and **the product itself has not**: the `src/` tree object and the `package.json` blob are byte-identical to `main` |
| 2 | The quality gate was green on the branch and again after the merge | Met — recorded at the merge and **independently re-measured by QE on this same tree**: lint 0, typecheck 0, build 0, **856/856 tests on 30 files, 0 skipped, integrity clean** |
| 3 | The security review is closed | Met — reviewed against ASVS L1, one blocking item raised and discharged on measurement |
| 4 | Acceptance criteria exist, are unambiguous, and were repaired to the point of being testable | Met — `A1`–`A12`, three repair rounds |
| 5 | The limitations were written by the analyst BEFORE acceptance, not after a dispute | Met — the ticket carries § *"What this ticket does NOT make runnable"* and § *"Out of scope"*; § 7 below is those two sections in business language |
| 6 | A machine with the project checked out | Met — **and `npm install` turns out NOT to be required to run the command.** Measured on this hop: every scenario below ran in a working copy with **no `node_modules` at all**. The product needs no installed dependency to draw a board; `npm install` is needed only for the automated test suite. *(The first version of this pack required it. Corrected on measurement.)* |

## 4. Who runs this, and who signs

| Role | Person | What they do |
|---|---|---|
| **Accepting authority** | **Olger Oeselg, project owner** | Executes or witnesses the scenarios, decides accept / reject, and **signs**. His is the only signature this pack recognises. |
| Preparer | UAT Planner (agent) | Wrote this pack and executed every scenario, reporting actuals |
| Coverage validator | QE/E2E (agent) | Confirmed which automated tests back these scenarios and named the gaps — quoted per scenario in § 6 |
| Value validator | BA/PM (agent) | Confirmed the scenarios cover the user value and the scope, and named the nine gaps this version repairs |

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
| A file to save the board into | any name, e.g. `board.txt` | UAT-19 |

**How to type an option.** The tool is started through the project's package runner, so options need a
bare `--` in front of them to get past the runner and reach the program:

```
npm run chess -- --colour black
```

Without the `--`, the runner eats the option and it never reaches the chess program. **Every command
in this pack is written out in full; type it exactly as printed.** This is not a formality — it was
measured, and forgetting the `--` fails in two different confusing ways:

- **`npm run chess --ascii` prints a board and reports success (`0`), having never passed your
  `--ascii` to the chess program at all.** The runner prints one line of its own first —
  `npm warn Unknown cli config "--ascii"` — which tells you *the runner* did not understand the
  option, not that the chess program never saw it. **On a real terminal the board you then get is
  drawn in the DEFAULT style — chess figures — which is the opposite of what you asked for.** *(If
  you had redirected the output to a file you would have got letters either way and seen nothing
  wrong at all. This is measured, not predicted.)*
- **`npm run chess --colour black`** complains `unrecognised argument: black` — blaming the word you
  meant as the *answer*, not the word you got wrong. Two `npm warn` lines come first.

Neither is the chess program's doing; both are the package runner. **If a scenario below behaves
oddly, check the `--` before recording a failure.**

**How to read the result code.** After any command, type `echo $?`. `0` means the command succeeded;
anything else means it failed. Several scenarios below are judged on this.

## 6. The scenarios

Nineteen. Each is one question, one command, one thing to look at, and one line that decides pass or
fail. **A scenario nobody can run is marked NOT RUN with the reason — never quietly passed.**

> ### STOP — read § 7 before running anything below
> Seventeen of these scenarios pass on the delivered product, and a reader who meets nineteen PASSes
> before meeting the limitations will walk away believing a chess game was delivered. **It prints a
> board. It does not play a game.** § 7 is four pages down; read it first, then come back.

**Every scenario carries a line marked *What else backs this*.** It says, in plain words, whether an
automated test would catch a break in that behaviour later or whether your own eyes are the only
check. **It is quoted from QE's independent coverage map, not from my own opinion of my own pack**,
and it is here so that no scenario in this document reads as if more evidence stands behind it than
actually does. Over the seventeen scenarios QE mapped: **4 fully backed, 10 partly backed, 3 backed
by nothing but a run.**

### Group A — does it start, and is the picture right?

**UAT-1 — I can start it with one command and a chess board appears.**
- Command: `npm run chess`
- Then: `echo $?`
- Expect: a board on the screen, eight rows numbered `8` down to `1`, a row of letters `a` to `b`…`h`
  underneath, a line saying it is White's move, and the shell prompt back. `echo $?` prints `0`.
- **PASS** if a board appears and the result code is `0`. **FAIL** if nothing appears, an error
  appears, or the result code is not `0`.
- *What else backs this:* **an automated test runs this exact command every time the code changes**
  and compares the whole frame, character for character. A break here goes red before a person sees it.

**UAT-2 — the board shows a brand-new game, set up correctly.**
- Command: `npm run chess`
- Expect: the top two rows full of black's sixteen men, the bottom two rows full of white's sixteen,
  the four rows between them empty, and a status line reading `White to move  1.` with `material: 0`.
- **PASS** if the position is a correct, complete opening set-up and it is White's turn at move 1.
  **FAIL** if any man is missing, misplaced, or it is not White's move.
- *What else backs this:* **fully backed** — the same character-for-character test covers the status
  line, and three further test files check the board's contents on their own.

**UAT-3 — the same command twice draws the same picture.**
- Commands: `npm run chess -- --colour white` twice in a row.
- Expect: the two boards are indistinguishable.
- **PASS** if the two runs look identical. **FAIL** if anything differs between them.
- *What else backs this:* **nothing.** No automated test runs any command twice and compares the two
  results. Your two screens are the only check this behaviour has.

### Group B — can I choose my side?

**UAT-4 — I can play White, and the board faces me.**
- Command: `npm run chess -- --colour white`
- Expect: white's men on the bottom two rows, the letter row reads `a b c d e f g h`, rank `8` at the
  top and `1` at the bottom.
- **PASS** if white is at the bottom. **FAIL** otherwise.
- *What else backs this:* **backed** — an automated test compares the board area character for
  character. *(The tested run also carries `--unicode`; the command you type carries no drawing
  option. The difference does not touch which way the board faces.)*

**UAT-5 — I can play Black, and the board turns round to face me.**
- Command: `npm run chess -- --colour black`
- Expect: black's men on the bottom two rows, the letter row reads `h g f e d c b a`, rank `1` at the
  top and `8` at the bottom. It is still White's move (White always moves first).
- **PASS** if black is at the bottom and the letters are reversed. **FAIL** otherwise.
- *What else backs this:* **partly.** The reversed board is compared character for character. **"It is
  still White's move" is checked by no automated test** for this command — only your eyes.

**UAT-6 — I can let it pick my side for me.**
- Command: `npm run chess -- --colour random`, run **ten times**.
- *Read this before the expectation: the package runner prints the command you typed as its third
  line, so the word `random` **is** on the screen — in the echo of your own command, above the board.
  That is the runner repeating you, not the program. The clause below is about the frame the program
  draws, which is where it would matter.*
- Expect: every run shows one of exactly the two boards from UAT-4 and UAT-5. Over ten runs, **both**
  appear at least once. **The word `random` never appears anywhere in the 23-row frame the program
  writes** — not in the board, not in the two status lines, not in the twelve rows below them — the
  program picks a real side before it draws anything.
- **PASS** if all ten runs show one of the two known boards, both sides came up at least once, and the
  word `random` appears nowhere in the frame. **FAIL** if any run shows a third kind of board, or if
  the word `random` reaches any part of the frame.
- **If all ten runs come up the same side, that is NOT a failure yet — run ten more first.** A fair
  coin lands the same way ten times about once in every five hundred tries, so a correct program will
  do this occasionally. **Record FAIL only if twenty runs produce a single side.**
- *What else backs this:* **partly, and less than it looks.** The side-picking is checked a thousand
  times as a calculation, without ever running the program. Only **one** actual run is checked
  end-to-end, and **nothing automated checks that both sides ever come up**, or that the status line
  is clean. Your ten runs are the real evidence here.

### Group C — can I choose how the pieces are drawn?

*Before you start Group C, know what "no option at all" does, because it is not fixed and this
surprises people: **on a real terminal the product draws chess symbols by default; sent to a file or
through a pipe it draws plain letters.** That is deliberate — a file has no font. It means UAT-1 and
UAT-2 will show you symbols on screen and letters in a saved copy, and neither is wrong. UAT-19 makes
that behaviour a scenario in its own right. The two scenarios immediately below are about what happens
when you ask **explicitly**, which is fixed either way.*

**UAT-7 — I can ask for chess symbols.**
- Command: `npm run chess -- --unicode`
- Expect: pieces drawn as the chess figures ♔ ♕ ♖ ♗ ♘ ♙ and ♚ ♛ ♜ ♝ ♞ ♟, thirty-two of them.
- **PASS** if the pieces are figures. **FAIL** if they are letters.
- *What else backs this:* **backed** — an automated test pins all thirty-two figures character for
  character.

**UAT-8 — I can ask for plain letters instead.**
- Command: `npm run chess -- --ascii`   ← **run this one at your terminal, not into a file**
- Expect: pieces drawn as letters — `K Q R B N P` for white, `k q r b n p` for black — and no chess
  figures anywhere. Compare it with UAT-1's screen, which shows figures: **the two must look
  different.**
- **PASS** if the pieces are letters *and* the default run showed figures. **FAIL** if any figure
  appears with `--ascii`.
- *What else backs this:* **nothing, and this is the weakest-covered scenario of the nineteen.** QE
  changed one word of the code and `--ascii` stopped working while all 856 automated tests stayed
  green. The agent's own run of this scenario was piped into a file, where letters appear whether or
  not the option works — **so it did not prove anything either.** **Your run, at a real terminal,
  compared against UAT-1's screen, is the strongest evidence this scenario has ever had.** A follow-up
  to give it an automated check is recommended by QE.

**UAT-9 — if I ask for both at once, it tells me instead of guessing.**
- Command: `npm run chess -- --ascii --unicode`
- Then: `echo $?`
- Expect: one line of complaint that **names both** `--ascii` and `--unicode`, followed by a usage
  line showing the accepted options. **No board at all.** `echo $?` prints something other than `0`.
- **PASS** if both option names appear in the complaint, no board is drawn, and the result code is
  non-zero. **FAIL** if it picks one silently, draws a board, or reports success.
- *What else backs this:* **partly.** The refusal, the non-zero code and the absence of any board are
  all checked automatically. **That the usage line is printed at all is checked by no test in the
  repository** — read it with your own eyes.

**UAT-19 — the board I save to a file is readable anywhere.** *(new in this version)*
- Commands: `npm run chess > board.txt`, then `echo $?`, then open `board.txt` in any editor.
- Expect: the file contains the same 23-row board, drawn in **plain letters** — `K Q R B N P` /
  `k q r b n p` — and **no chess figures at all**, even though the same command on screen shows
  figures. `echo $?` prints `0`.
- **PASS** if the saved file holds a complete board in letters with no figures. **FAIL** if it holds
  figures, is empty, or is missing rows.
- *Why this scenario exists:* it is the half of the drawing rule that a person actually depends on —
  a saved or piped board has no font to draw figures with, so the product falls back to letters. The
  first version of this pack described this in a paragraph and asked nobody to check it.
- *What else backs this:* **backed** — an automated test asserts that a piped run with no options
  emits nothing above plain ASCII.

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
- *What else backs this:* **partly, and rows d and f are the ones to run carefully.** Four of the nine
  (a, b, c, e) are run end-to-end by automated tests; h and i are checked as a calculation only, never
  actually run. **Rows d and f are checked by nothing at any level** — and QE showed that a one-word
  change to the code turns row f into a crash with a seven-line error dump instead of a usage message,
  with all 856 tests still green. **Row f is the single most valuable command in this table for you to
  type yourself.** The usage line is unchecked for all nine.

**UAT-11 — a refusal never half-draws a board.**
- Commands: every command in UAT-9 and UAT-10.
- Expect: not one rank row, not one letter row, not one piece — on the normal output **or** in the
  error text. The screen shows the complaint and the usage line and nothing else.
- **PASS** if no fragment of a board appears anywhere for any refusal. **FAIL** if any refusal prints
  any part of a board.
- *What else backs this:* **partly — five of the ten commands.** The other five are never actually
  run by a test. They all take the same path out of the program, which is why this is low risk rather
  than no risk.

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
- *What else backs this:* **partly, and the half that matters to you is the unbacked one.** An
  automated test checks the same danger thoroughly — but only for output sent to a file. **No
  automated test ever attaches a real terminal, so "the screen is not cleared" is checked by your eyes
  alone.**

### Group E — is it usable?

**UAT-13 — the board appears fast enough to feel instant.** *(rewritten: the signer judges by feel;
the stopwatch is the preparer's)*
- **Your test.** Command: `npm run chess`. Watch the screen.
- Expect: the board and your shell prompt are back **before you could finish saying "one thousand"**.
  It should feel instant — no visible pause, no partial board filling in.
- **PASS** if it feels instant. **FAIL** if you wait for it, or watch it draw.
- **The measured version, run by the preparer and witnessed by you if you want it.** The ticket's own
  criterion is a median of ten runs at one second or less. This is the exact command that produces it,
  and it was run to produce the row below:

  ```
  for i in $(seq 10); do /usr/bin/time -p npm run chess > /dev/null; done 2>&1 \
    | awk '/^real/{print $2}' | sort -n
  ```

  **Result, on an Apple M3 with Node v24.12.0: `0.16 0.16 0.16 0.16 0.16 0.16 0.17 0.17 0.17 0.21` —
  median 0.16 s against a 1.00 s bar.**
- *Why it is split:* the first version of this pack told a reader who does not read code to "take the
  median of ten timings" and named no instrument. **The bar you can judge is the one you should
  judge**; the arithmetic is the preparer's and is shown above so you can check it or re-run it.
- *What else backs this:* **nothing, by deliberate design** — the ticket says a wall-clock reading
  belongs in a note with its machine, never in the automated suite, because a clock in a shared test
  lane produces false alarms. This is a recorded measurement, not a permanent guard.

**UAT-14 — the command written in the project's own instructions is the command that works.**
- Read `AGENTS.md` § Commands, line `Dev / run`, and run exactly what it says.
- Expect: the documented command starts the product and draws a board.
- **PASS** if the documented command works. **FAIL** if the instructions name a command that does not
  work.
- **KNOWN DOCUMENTATION DEFECT, and it is not a product fault — do not record a FAIL for it.**
  `AGENTS.md`'s `Dev / run` line prints `npm run chess` and lists the options `--colour
  white|black|random`, `--ascii` and `--unicode` — **but it never shows the `--` separator anywhere.**
  A reader who combines the two types `npm run chess --ascii`, and gets **a board, a success code, and
  the default drawing style instead of the one he asked for** (see § 5). **The documentation is what
  is wrong, and the fix belongs to a documentation ticket, not to this ticket.** It is recorded here so
  that you see it before signing rather than discover it afterwards.
- *What else backs this:* **partly.** An automated test pins the exact text of the `Dev / run` command
  line. **Nothing compares the option list in that file with the options the program actually
  accepts** — a documented option that did not exist would ship with every test green.

### Group F — the limits, made checkable, so nobody signs the wrong thing

**These FOUR scenarios exist to make the boundary VISIBLE to the signer. They pass when the product
correctly refuses to do things it does not yet do, or shows you plainly that it does not do them. A
tester who reads only Groups A–E will walk away believing a chess game was delivered; these four
prevent that.**

**UAT-15 — it draws once and stops. It does not wait for a move.**
- Command: `npm run chess`, then, at the prompt that comes back, type `e2e4` and press Enter.
- Expect: the program has **already finished** before you type. Whatever you type goes to the shell,
  not to the game — the shell will complain that `e2e4` is not a command. The board does not change
  and no second board appears.
- **PASS** if the program has already ended and nothing you type reaches it. **FAIL** if it waits for
  input (that would mean a game loop exists that this ticket does not claim), or if it hangs.
- **Disclosed: the agent could not perform your procedure.** An agent has no prompt to type at, so the
  same property was established two other ways — input piped in and provably ignored, and input held
  open and empty for twenty seconds, where a program waiting for a move would have blocked and this
  one finished in 211 ms with a complete board. **You should still do the typing version, because that
  is the version your signature covers.**
- *What else backs this:* **partly, and structurally only.** An automated test proves the program
  never reaches for anything you type, by reading the source. **No automated test proves the behaviour
  by actually holding input open.** Your typing is the behavioural evidence.

**UAT-16 — there is no way to make a move, by any route.**
- Commands: `npm run chess -- --move e4`, `npm run chess -- e4`, `npm run chess -- --new`,
  `npm run chess -- --undo`, `npm run chess -- --resign`, `npm run chess -- --quit`
- Expect: **every one is refused** as an unknown word, with a non-zero result code and no board.
- **PASS** if all six are refused. **FAIL** if any of them is accepted — accepting one would mean the
  product does something this pack has not tested and this ticket does not claim.
- *This is the scenario that turns § 7's headline into something a signer can verify with their own
  hands rather than take on trust.*
- *What else backs this:* **by class only, and this is the pack's most important scenario with the
  least by-name backing.** A thousand randomly generated words are rejected by an automated test, and
  the shapes of these six are among them — but **none of the six words is named in any test and none
  of them is ever actually run.** Your six commands are the only by-name evidence.

**UAT-17 — it runs only from the project folder; it is not installed on this machine.**
- Commands: change to any other folder (for example `cd ~`), then `npm run chess`.
- Expect: it fails, complaining that it cannot find the project file, and no board appears.
- **PASS** if it fails outside the project folder. **FAIL** if a board appears — that would mean
  something was installed system-wide, which this ticket explicitly did not do.
- *The failure code you will see is `254`, and it comes from the package runner, not from the chess
  program — the program never starts. The product's own codes are only `0` and `1`.*
- *What else backs this:* **partly.** An automated test checks the cause — that `package.json` gained
  exactly one entry and nothing that could install or publish anything. **The behaviour itself — run
  it somewhere else and it fails — is checked by no test**, because every test runs inside the project
  folder.

**UAT-18 — a third of the screen is empty, and that is correct.** *(new in this version)*
- Command: `npm run chess`
- Look at: the area **below** the `White to move` and `material: 0` lines.
- Expect: **twelve blank rows**, every time. This is where the list of moves played will go one day.
  **In this version it stays empty forever** — nothing you can type will ever put anything there.
- **PASS** if there are twelve blank rows below the status lines and nothing ever appears in them.
  **FAIL** if the area is missing entirely, is a different size, or contains anything at all.
- *Why this scenario exists:* it is the single most visible sign, on your own screen, that this product
  is incomplete — **a third of the frame is empty** — and the first version of this pack asked nobody
  to look at it. **A signer who sees it without being told will suspect a bug; a signer who is told is
  looking at the product's honest shape.** It is § 7 point 4, made checkable.
- *What else backs this:* **backed** for this command — an automated test compares the whole 23-row
  frame, blank rows included, character for character.

## 7. What this product does NOT do — read before signing

**IT PRINTS A BOARD. IT DOES NOT PLAY A GAME.** This is the ticket's own sentence, and it is the
single most important line in this pack. **A signature on this pack is a signature on a picture of a
chess board, not on a chess program.**

**Nine limitations. FIVE of them you can check yourself with a command; the rest are statements you
are being asked to take as told, and they are marked as such.** *(The first version of this pack said
all nine were checkable by UAT-15 / UAT-16. That was true of three. The table below is what is
actually true, scenario by scenario.)*

| # | The limitation | Can you check it? | With what |
|---|---|---|---|
| 1 | **You cannot make a move.** There is no way to type one, no option that carries one, and nothing that would receive one. | **YES** | UAT-15 and UAT-16 |
| 2 | **There is no opponent.** No engine exists. Nothing will ever move a piece back at you. | **NO** — take it as told | Nothing in this pack demonstrates the absence of an engine; six refused words is a different claim |
| 3 | **The position never changes.** Every run shows the same opening position. There is no second board, no move list that fills up, no clock. | **PARTLY** | UAT-3 (two runs, same picture) and UAT-15 (it ends before you can act) |
| 4 | **The move-list and status areas below the board are empty placeholders.** They are the right shape and they will stay blank forever in this version. | **YES — new in this version** | **UAT-18** |
| 5 | **There is no `undo`, no `resign`, no `new game`, no `quit`** — there is nothing to undo, resign, restart or quit from. | **YES** | UAT-16 tests exactly those four words |
| 6 | **There is no difficulty setting.** `--difficulty` is refused. It needs an engine, and there is no engine. | **YES** | UAT-10 row **a** — *not* UAT-15/16 |
| 7 | **Nothing was installed on the machine and nothing was published.** There is no `chess` command; the project cannot be run with `npx`; it runs only from inside the checked-out project folder. | **YES** | UAT-17 — *not* UAT-15/16 |
| 8 | **Nothing is deployed anywhere.** This product runs on one developer machine, from source. There is no server, no service, no release. | **NO**, and not checkable in principle — correctly an assertion | — |
| 9 | **This pack accepts `ABC-042` alone.** The other twenty-seven `Done` tickets remain *UAT deferred → `EPIC-006`, explicitly NOT passed*. **Signing this does not accept them.** | **NO** — it is a statement about scope, not about behaviour | — |

### `ABC-042` meets ZERO of `EPIC-006`'s FOUR acceptance criteria

**This is the sentence the first version of this pack was missing, and it is the most important
sentence in this section.** That version named criteria #1 and #4 as unmet and said nothing about the
other two — from which a reader could reasonably conclude the other two were met. **They are not.
`ABC-042` meets none of the four.** `EPIC-006` is the epic this ticket belongs to; its four
acceptance criteria are on `plans/epics/EPIC-006-game-session-and-packaging.md`:

| # | `EPIC-006` acceptance criterion, in the epic's own words | Met by `ABC-042`? | Why not |
|---|---|---|---|
| 1 | `npx <package>` on a machine with Node and nothing else starts **a playable game with no install step** | **NO** | Nothing is packaged or published, and the distribution decision is deliberately unmade and reserved for a human. **UAT-17 shows you this one.** |
| 2 | After an engine reply, `undo` returns the position **two plies back, in one command** | **NO** | There is no `undo` command, no engine, and no engine reply to take back. **UAT-16 shows you `--undo` being refused.** |
| 3 | Any of the **eight** terminal conditions ends the game with the reason named explicitly and exit code `0` | **NO** | No game can end because no game can start — no move can be made, so no terminal condition can be reached. There is no result screen. |
| 4 | `--colour black --difficulty 3` starts with **no prompts and the engine opening as white** | **NO** | `--difficulty` is an unrecognised argument and there is no engine. **UAT-10 row a shows you this one.** |

**Two of the four (#2 and #3) are not even mentioned on `ABC-042`'s own ticket page**, because that
page fences only the two it was cut against. **Nothing in `plans/` says "zero of four" today; this
pack is currently the only place it is written down**, and that is recorded as an open item for the
Orchestrator in the sibling note in this folder.

**None of this is a defect in `ABC-042`.** The ticket never claimed any of the four; it was cut as
the thin slice underneath them. **It is here because the difference between "two of four criteria are
unmet" and "all four are unmet" is exactly the difference between a product that is nearly finished
and one that has just started, and you are being asked to sign in that gap.**

**The failure this section exists to prevent:** a reader who sees nineteen scenarios all pass and
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
| 1 | I ran, or watched someone run, **UAT-1 to UAT-19** | ☐ |
| 2 | A chess board appeared, and it was a correct new game | ☐ |
| 3 | I could choose White, Black, and let it choose for me | ☐ |
| 4 | I could choose chess symbols and plain letters, and the two looked different on my screen | ☐ |
| 5 | Every wrong option I tried was refused, and told me which word was wrong | ☐ |
| 6 | No refusal ever drew part of a board | ☐ |
| 7 | The board appeared in well under a second | ☐ |
| 8 | **I have read § 7 and I understand I am accepting a board that is drawn, NOT a game that can be played** | ☐ |
| 9 | **I understand no move can be made, there is no opponent, and the position never changes** | ☐ |
| 10 | **I understand nothing is installed and nothing is published — this runs only from the project folder** | ☐ |
| 11 | **I understand this accepts `ABC-042` only, and the other twenty-seven `Done` tickets stay un-accepted** | ☐ |
| 12 | **I have seen that `ABC-042` meets ZERO of `EPIC-006`'s four acceptance criteria** (§ 7's second table) | ☐ |
| 13 | Accept / Reject, and my name and the date | ☐ |

**Item 8 is the one that matters.** A signature with 1–7 ticked and 8 unread is the failure this whole
pack was shaped to prevent. **Item 12 is new in this version** and exists because the first version
could be read as saying two of four criteria were unmet.

### § 9b — the outcome of every scenario, recorded here

**This table is what makes § 10's first exit criterion dischargeable.** The first version demanded
"all seventeen scenarios have a recorded outcome" and gave the signer nowhere to record one. **Write
`pass`, `fail`, or `not run` with a reason on every row. A blank row is not a pass.**

| # | Scenario, in one line | Outcome (pass / fail / not run + reason) | Initial |
|---|---|---|---|
| UAT-1 | one command, a board appears, exit `0` | | |
| UAT-2 | a correct brand-new game | | |
| UAT-3 | the same command twice draws the same picture | | |
| UAT-4 | I can play White, board faces me | | |
| UAT-5 | I can play Black, board turns round | | |
| UAT-6 | it can pick my side for me | | |
| UAT-7 | chess symbols on request | | |
| UAT-8 | plain letters on request | | |
| UAT-9 | both drawing options at once is refused | | |
| UAT-10 | nine wrong words, each refusal names the word | | |
| UAT-11 | a refusal never half-draws a board | | |
| UAT-12 | a nasty argument cannot scramble my screen | | |
| UAT-13 | the board appears fast enough to feel instant | | |
| UAT-14 | the documented command is the working command | | |
| UAT-15 | it draws once and stops; it does not wait | | |
| UAT-16 | there is no way to make a move, by any route | | |
| UAT-17 | it runs only from the project folder | | |
| UAT-18 | twelve blank rows below the board, and that is correct | | |
| UAT-19 | the board saved to a file is plain letters | | |

**UAT-12 and UAT-14 had no row of their own anywhere in the first version's checklist.** They have one
now, and so do the two new scenarios.

## 10. Exit criteria

Acceptance is complete when **all** of these hold:

1. **All nineteen scenarios have a recorded outcome — pass, fail, or not run with a reason — written
   into the § 9b table.** No scenario is left blank and none is passed by default. *(This is now
   dischargeable by completing § 9: § 9b is the form it is recorded on. In the first version it was
   not.)*
2. Zero scenarios in Groups A–E failed.
3. **All four** scenarios in Group F passed, which is what makes § 7 verified rather than merely
   stated.
4. The named human has ticked every box in § 9, **including 8 to 12**, and recorded Accept or Reject
   with a name and a date.
5. If any scenario failed, the ticket does **not** exit UAT: the failure is reported as-is and the
   Orchestrator routes it. **The tester does not fix it and does not raise the defect themselves.**

**The known documentation defect in UAT-14 is not a scenario failure** and does not hold the ticket
under criterion 5; it is routed as its own documentation ticket.

## 11. The kit checklist, worked through

`agent-factory/checklists/uat-checklist.md`, item by item:

| Checklist item | Where it is discharged |
|---|---|
| UAT goal clear | § 1 |
| entry criteria met | § 3 — six criteria, all met, each with its evidence; criterion 6 corrected on measurement |
| business scenarios listed | § 6 — **nineteen**, in six groups, each carrying what backs it beyond your own run |
| test data ready | § 5 — the command line is the data; every value written out; the `--` trap corrected against a fresh measurement |
| expected results clear | § 6 — every scenario carries an "Expect" and a PASS/FAIL line |
| known limitations listed | § 7 — nine, written before signoff, **five now checkable by a command**, plus the `EPIC-006` four-criteria table |
| rollback known | § 8 — nothing to roll back; the mechanism named anyway |
| signoff person/role known | § 4 and § 9 — **Olger Oeselg, project owner**, named, un-delegated |
| exit criteria clear | § 10 — five, and **criterion 1 is now dischargeable by completing § 9b** |

**Nine of nine, and the ninth is no longer discharged in name only.**

## 12. What this pack deliberately does not contain

- **No signature, and no space that an agent could later be read as having filled.** The signature is
  the owner's; `context.human_admission` is `off` on this install and no `finding` kind and no
  verification stamp is admissible here, so this note is a `decision` and carries no `verified_by`.
  **Every box in § 9 and every cell in § 9b is empty.**
- **No board move, no traceability row, no metrics row.** Those belong to the Orchestrator at close.
- **No defect ticket.** The documentation defect in UAT-14 is recorded and returned, not self-cut.
- **No product change.** `src/` and `package.json` are byte-identical to `main`, re-proved on this hop.

## 13. What changed in this amendment, and why

| gap | raised by | what changed here |
|---|---|---|
| `B1` | BA/PM | **UAT-19 added** — the piped/saved half of the drawing rule had no scenario. Written and RUN. |
| `B2` | BA/PM | **UAT-13 split** — the signer judges by feel; the timed median is marked preparer-run and its exact command is printed and was executed. |
| `B3` | BA/PM | **UAT-6 gains the ten-more-runs clause** — the old wording failed correct software about once in five hundred runs. |
| `B4` | BA/PM | **UAT-14 rewritten** — the documented command passes; the documented **options** carry a named documentation defect against `AGENTS.md`, explicitly not a product FAIL. |
| `B5` | BA/PM | **§ 7's lead-in replaced by a table** — "all nine checkable by UAT-15/16" was true of three; it is now five, each with the scenario that checks it. |
| `B6` | BA/PM | **§ 7 gains the `EPIC-006` four-criteria table and the sentence "`ABC-042` meets ZERO of four"**, plus checklist item 12. |
| `B7` | BA/PM | **UAT-18 added** — the twelve blank move-list rows. Written and RUN. |
| `B8` | BA/PM | **§ 9b added** — a nineteen-row outcome table, so § 10's first exit criterion can be discharged by completing § 9. |
| the UAT-6 frame-region loss | BA/PM | **the clause now covers all three regions of the 23-row frame**, not two; the runner's-echo note moved **above** the PASS/FAIL line so a tester cannot read the FAIL line, see the echo and stop. Re-run over the wider clause. |
| the coverage map | QE | **every scenario now states what backs it beyond your own run** — 4 backed, 10 partial, 3 backed by nothing, in the signer's language. UAT-8's own evidence was corrected: the agent's piped run could not distinguish the flag working from the pipe working. |
| my own § 5 | this hop | *"silently discarded"* was wrong — the runner **warns**, in runner language, and on a terminal draws the default style instead of the requested one. Re-measured. |
| layout | BA/PM (named, not scored) | a **STOP — read § 7 first** box now sits immediately above the first scenario. Section numbers are unchanged on purpose. |
