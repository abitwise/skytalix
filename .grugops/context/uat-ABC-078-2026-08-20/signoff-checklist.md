# Signoff checklist — `ABC-078`, for the owner, answerable with his word

**The named human who accepts: the project owner.** His word in session IS this project's `In UAT`
exit signature (`AGENTS.md` § *Test and UAT authority*, 2026-08-16). **No agent may answer these
questions on his behalf, and the pack passing is not an answer to any of them.**

Nine questions. Each is a yes/no a non-engineer can answer. **Q7–Q9 are the ones this hop cannot
grade for him** — they are not decorative.

| # | question | what was observed, for him to accept or reject |
|---|---|---|
| **Q1** | When you type a move, does the machine answer with a move of its own, every time? | 21 replies over two full sessions, every one legal, no misses. |
| **Q2** | Is the wait acceptable to you as a player? | Every wait was **about 3 seconds** (3001–3005 ms measured). Nothing longer. |
| **Q3** | Did it ever freeze, hang, or crash? | No. Zero waits at or above 5 s; every session exited cleanly (code 0). |
| **Q4** | If you choose Black, does it open the game for you? | Yes — the first board arrives with its move already played, after ~3 s. |
| **Q5** | If you hand it a free piece, does it take it? | Yes — a hung queen was taken on the very next move. |
| **Q6** | If you offer it a poisoned pawn, does it avoid the trap? | Yes — it declined a pawn that would have cost it a knight. |
| **Q7** | **Do you accept that the ≤ 3 second requirement is still missed, by about 1–5 milliseconds, and stays an accepted risk (`AR-NFR004-A`) owned by Security/NFR at `EPIC-006`'s difficulty hop?** | This UAT measured 3001–3005 ms and **did not** discharge it. Accepting the ticket does not fix it and must not be recorded as if it had. |
| **Q8** | **Do you accept that the thing this ticket is named after — iterative deepening against a clock, `RISK-002` — cannot be shown to you at all?** | The product exposes no budget and no depth, so a fixed-depth build would look identical to you. It is guarded by the repaired `A4` test that runs a search, **not** by anything in this pack. |
| **Q9** | **Do you accept the ticket knowing every timing here is from one machine (Apple silicon, Node v24.12.0), and the off-machine reading is still owed by `ABC-074`?** | `UNKNOWN - verify` on any other hardware. |

## How the answer gets recorded

- **If he accepts:** his words are transcribed verbatim, with the date, into a `decision` note in
  this task's `notes/`. **That transcription is an agent's record of what he said — it is not a
  stamp**; `context.human_admission` is `off` and no `finding` is admissible on this install.
  Only then may `ABC-078` leave `In UAT`.
- **If he declines, or answers no to any of Q7–Q9:** the ticket stays where it is and the reason is
  recorded as written. A failing or refused UAT is a legitimate result.
- **If he says nothing:** the ticket stays in `In UAT`. Silence is not acceptance, and no agent may
  supply the missing word.
