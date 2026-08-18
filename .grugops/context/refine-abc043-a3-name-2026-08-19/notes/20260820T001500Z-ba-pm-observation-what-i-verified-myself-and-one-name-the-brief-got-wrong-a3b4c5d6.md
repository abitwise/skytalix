---
id: 20260820T001500Z-ba-pm-observation-what-i-verified-myself-and-one-name-the-brief-got-wrong-a3b4c5d6
kind: observation
by: ba-pm
at: 2026-08-20T00:15:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ADR-0015
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# What I verified first-hand, and **one name the brief got wrong** — the substance is unaffected, the record should not carry it forward

## Measured at this hop, on `grugops/refine-abc043-a3-name` off `main` @ `8bb7669`, in an isolated worktree

| measurement | command | result |
|---|---|---|
| `createLineInputSeam` imported by the entry point | `grep -n` on `src/cli.ts` | **line 73**, from `./line-input.ts` |
| it is passed at an injection point | `grep -n` on `src/cli.ts` | **line 155**, `input: createLineInputSeam({ source: process.stdin, output: sink })`, inside the `runTurnLoop({ … })` bag |
| `engine:` | same | **line 156** — the line immediately below |
| `src/cli.ts` exports | `grep -c '^export'` | **0** — `ADR-0011` clause 4 intact; my answer depends on it staying 0 |
| the shipped rig's substituted specifier | `grep -n 'command-input'` on `src/cli.test.ts` | **line 372**, `"command-input.ts"` — with a comment at line 260 recording it as `A3`'s alone |
| `A3`'s Given, read on the ticket | `plans/tickets/ABC-043-the-live-session.md:129` | *"**Given** an `InputSeam` that throws"* — the seam, by name |
| `A2`'s Given | same, line 120 | *"**Given** a piped stdin carrying a scripted mating line and a deterministic opponent"* — the stdin stipulated **real** |
| `A5`'s Given | same, line 140 | *"**Given** an `EngineSeam` that throws, and again one that returns a move `legalMoves` did not produce"* — one constructed component, and it is the engine |

**`input:` and `engine:` are adjacent lines in one options bag.** Architect/Design reported it and the
Orchestrator verified it; I did not take it on report, because my answer turns on it.

## The correction: my third refused name was **`./turn-loop.ts`**, not `./command-input.ts`

My licence sentence, at `refine-ABC-043-2026-08-19` and on the ticket page, reads:

> *"Substituting `./line-input.ts`, `./frame.ts` or **`./turn-loop.ts`** would test the harness
> instead of the product."*

**The subtask brief and the routing summary say the three names were `./line-input.ts`, `./frame.ts`
and `./command-input.ts`.** `./command-input.ts` was **never one of my names** — that it appears on
neither side of my sentence is precisely what made the engineer flag its own instrument as an
extension, and `ADR-0015` quotes me correctly and says so.

**The substance is untouched.** *"Two of the three fall out of clause (S) mechanically"* still holds
with the right names: `./frame.ts` (below `render-seam.ts` / `turn-loop.ts`) and `./turn-loop.ts`
(the callee — it **is** the subject) both fail (S), and `./line-input.ts` is the one that rested on
judgement. **My answer would be identical either way.** Recorded so a later reader does not conclude
I once refused `./command-input.ts` by name and then went quiet about it: **I refuse it here for the
first time, by (N1), and it is also refused by `ADR-0015` (S).**

## Adjacent, NAMED and NOT ACTED ON — for the Orchestrator to route

Per the brief: I cut no ticket, re-scored nothing, and touched no ADR or `plans/nfr-catalog.md`.

1. **`ABC-019` `[D31]`'s *"a parser bug"* narrative now has no criterion at all.** `A3` asserts the
   handler's response to a **seam** fault; `src/line-input.ts`'s own body and `./command-input.ts`
   below it are exercised by no criterion on this page. `ADR-0015` recorded this as the honest price
   of clause (S) and I agree it is worth paying — but the layer is real and uncovered. **If it is
   wanted, it is an in-process unit row against `src/line-input.ts` (no hook, no child) or an opt-in
   lane row, and it is a new ticket, not this one.**
2. **`src/cli.test.ts:260`'s comment states `./command-input.ts` is substituted by `A3` alone.** It
   becomes false the moment the rig comes out. **Engineer's, in the same repair** — named so it is
   not left behind as a true-looking comment.
3. **`G-02`–`G-06` are untouched by this hop** and remain open exactly as recorded, including `G-06`
   (no criterion runs the real engine end to end — my original licence's named gap).
4. **`ABC-043`'s code is on `main` while the ticket is `In Review`.** The Orchestrator recorded that
   as its own error with its own reasoning for not reverting. **I neither endorse nor dispute it:
   it is a delivery-state matter, not a criteria matter, and it did not enter my answer** — see the
   explicit check in the decision note.
