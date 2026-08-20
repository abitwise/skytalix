# Signoff checklist — `ABC-044`, for the owner, answerable with his word

**The named human who accepts: the project owner.** His word in session **is** this project's `In UAT`
exit signature (`AGENTS.md` § *Test and UAT authority*, ruling of 2026-08-16). **No agent may answer
these questions on his behalf, and the pack passing is not an answer to any of them.** He was told
when he gave that ruling that a green agent report would explicitly not be treated as his acceptance,
and this sheet is written so that it cannot be.

The conducted pack is `plans/uat/ABC-044-uat-pack.md`. **Q4–Q7 are the ones this hop could not grade
for him. They are not decorative and they are not "nice to know" — they are the whole reason a person
is being asked at all.**

| # | question | what was observed, for him to accept or reject |
|---|---|---|
| **Q1** | You are checkmated at your terminal. Does the program tell you the game ended, tell you who won and why, and show you the game? | **Yes.** On a real 24×80 terminal: `Black wins by checkmate.`, a blank row, then `1. f3 e5` / `2. g4 Qh4#`. Same ending byte for byte when output is redirected to a file, and the program exits `0`. |
| **Q2** | Is the wording of the ending good enough for you? | It names the winner and the reason in one plain sentence. The four repetition/move-count endings also cite the FIDE article and say whether a player **claimed** the draw or it arrived **automatically** — e.g. `claimed by the player to move under FIDE 9.2` against `automatic under FIDE 9.6.1`. |
| **Q3** | If you stop playing — Ctrl-D, or you ask for a draw you have not earned — does it ever invent a result? | **No.** Ctrl-D produced `input ended` and nothing else; `claim` with no claimable draw reported `repetition 1 of 3` / `50-move 1 of 100`, awarded nothing, and the game went on. Both checked on a real terminal. |
| **Q4** | **Do you accept the ticket knowing that only ONE of the eight endings — checkmate — was actually seen by a player in this UAT?** | Six more are reachable in principle only by playing to them, and this hop did not reach them. **Nothing was reported as "eight reasons seen".** |
| **Q5** | **Do you accept that `resignation` — one of the eight the screen can name — cannot be produced by ANY player input today?** | There is no `resign` command: `COMMAND_TABLE` is `help`, `board`, `quit`, `claim`, and `resign` belongs to `EPIC-006`'s later ticket. That ending renders correctly from a value no production code constructs. **It is not a hole in this ticket and no test can close it** — but accepting `ABC-044` does not make it reachable, and it must not later be read as though it did. |
| **Q6** | **Do you accept that on a long game at a standard 24-row terminal, the line saying WHO WON is liable to be pushed off the top of the screen by the move list underneath it — and that no acceptance criterion of this ticket covers that?** | Measured on a real terminal at three window sizes; the rule the readings fit puts the threshold at a **43-ply game**, and this hop played a **44-ply** game on that terminal. The mechanism and the game length were each measured, but never in the same run (`UNKNOWN - verify`). **The product does exactly what `A6` asked — one write, after the last frame, zero cursor control. The gap is in what was asked for.** Accepting is a legitimate answer; so is "cut a ticket for it before I sign". |
| **Q7** | **Do you accept that neither claimed draw (threefold, fifty-move) was ever driven to its end, so what a player would actually see is `UNKNOWN - verify`?** | The engine does not repeat, so a threefold cannot be forced by shuffling; a fifty-move claim is worse. **No UAT step was written that would fail to execute.** The adjudication behind it (`src/gameend.ts`) is `Done`, mutation-tested, and byte-identical in this diff. |
| **Q8** | Do you accept the ticket knowing every reading here is from one machine (Apple silicon, Darwin 26.5.2, Node v24.12.0)? | `UNKNOWN - verify` on any other hardware. |

## The one question that has to be answered for the ticket to move

**"Do you accept `ABC-044` — the result screen — as it stands, with Q4–Q7 as stated?"**

Anything less than his answer to that leaves the ticket in `In UAT`.

## How the answer gets recorded

- **If he accepts:** his words are transcribed verbatim, with the date, into a `decision` note under
  `.grugops/context/uat-ABC-044-2026-08-20/notes/`. **That transcription is an agent's record of what
  he said — it is not a stamp.** `context.human_admission` is `off` and no `finding` is admissible on
  this install. Only then may `ABC-044` leave `In UAT`.
- **If he declines, or answers no to any of Q4–Q7:** the ticket stays where it is and the reason is
  recorded as written. **A refused or partial UAT is a legitimate result**, and Q6 in particular has a
  reasonable "not until there is a ticket for it" answer.
- **If he says nothing:** the ticket stays in `In UAT`. **Silence is not acceptance, and no agent may
  supply the missing word.**
