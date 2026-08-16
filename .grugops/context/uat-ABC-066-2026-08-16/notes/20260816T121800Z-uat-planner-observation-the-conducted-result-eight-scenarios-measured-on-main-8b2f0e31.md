---
id: 20260816T121800Z-uat-planner-observation-the-conducted-result-eight-scenarios-measured-on-main-8b2f0e31
kind: observation
by: uat-planner
at: 2026-08-16T12:18:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - src/cli.ts
  - src/cli-options.ts
supersedes: 
---

# `ABC-066` — the UAT CONDUCTED: eight scenarios run against the real tree, measured not quoted

**This is an agent-conducted test result. It is NOT a named human's acceptance signature, and it must
never be read as one** (`AGENTS.md` § Test and UAT authority; `context.human_admission` is `off`, no
`finding` is admissible here). No one has signed anything.

## Where and on what

`main` @ `722bd9d`, working tree of this repository. Node **v24.12.0**, npm **11.7.0**, Darwin 25.5.0
— the same platform the ticket's cut transcript names. Every command below was **run in this hop**;
nothing is copied from the board row, the ticket or the gate notes. Where a figure here differs from
a figure recorded earlier, the difference is stated rather than smoothed.

## Entry criteria, re-measured

- Suite on the tree under test: **859 passed / 859 on 30 files**, exit 0, duration ~2.0 s.
  Skip count via the `AGENTS.md` § Test integrity command: **0**.
- **This is 859, not the 857 the `ABC-066` gate recorded.** The delta is not drift and not a
  surprise: `git log -- src/cli.test.ts` shows `c5a5493 test(ABC-065): …` landed on `main` AFTER
  `ab0864e` (`ABC-066`'s delivery). `ABC-065` merged in between and added exactly two rows.
  `npm run chess -- ` now also occurs **1** time in `AGENTS.md`. Recorded because a later reader
  comparing 857 to 859 deserves the reason, not a shrug.

## The scenario results

| # | scenario | result | measured evidence |
|---|---|---|---|
| `U1` | the owner's own wrong spelling `npm run chess --colour black` | **PASS** | exit **1**; stdout 4 lines and **no board row**; stderr carries `unrecognised argument: black` then `usage: npm run chess -- [--colour white|black|random] [--ascii | --unicode]` (plus two npm warnings, npm's not the program's) |
| `U2` | **the defect itself** — read that usage line, type it back verbatim | **PASS** | typed `npm run chess -- ` → exit **0**, stdout **27 lines** with a drawn board, **stderr 0 bytes**. The loop is broken: the line the program prints on refusal is a command that works |
| `U3` | type it back with the option he actually wanted | **PASS** | `npm run chess -- --colour black` → exit **0**, 27 stdout lines, stderr **0 bytes**, and the board is genuinely black-side-up: rank `1` sits at the top, the file legend reads `h g f e d c b a` |
| `U4` | every one of the six advertised forms | **PASS, 6 of 6** | bare, `--colour white`, `--colour black`, `--colour random`, `--ascii`, `--unicode` — each **exit 0, 27 stdout lines, 0 bytes of stderr**. No advertised form is refused |
| `U5` | six different ways to be refused | **PASS, 6 of 6** | `--colour black` without the separator, `--nonsense`, `--colour`, `--colour purple`, `--ascii --unicode`, `extra` — every one exits **1**, draws **0 board rows**, names the offending token, and its usage line contains the literal `npm run chess -- ` **exactly once**. The separator reaches the user on every refusal path a user can reach |
| `U6` | the two glyph options do something visible | **PASS** | `--unicode` renders `8 .♜:♞.♝:♛.♚:♝.♞:♜`; the default/`--ascii` route renders `8 .r:n.b:q.k:b.n:r`. Advertised, accepted, and visibly honoured |
| `U7` | the pedantic literal transcription, brackets and all | **PASS** | exit **1**, `unrecognised argument: [--colour`, usage line printed again. A clean refusal that names the offending token — no crash, no stack trace, no silent success |
| `U8` | the known limitation, measured rather than assumed | **PASS (matches the documented limitation exactly)** | `npm run chess --ascii` → exit **0**, npm warns `Unknown cli config "--ascii"`, the child is run as `node src/cli.ts` with **no arguments**, and the DEFAULT ascii board prints. Unchanged by `ABC-066`, and unfixable from here |

**8 of 8 conducted scenarios PASS. 0 fail. 0 `UNKNOWN - verify`.**

## Two supporting measurements taken because the pack leans on them

- **The advertised vocabulary equals the accepted vocabulary.** The usage line names exactly
  `--colour`, `white`, `black`, `random`, `--ascii`, `--unicode` — **6 tokens**; `ACCEPTED_ARGUMENTS`
  in `src/cli-options.ts:46` is those same **6**, no more and no fewer. A user is offered nothing the
  program will not take, and nothing the program takes is hidden from him.
- **The bare `--` is not advertised as an option.** It appears once, as the separator, before the
  bracketed groups — which is why `U7`'s literal transcription fails on `[--colour` and not on `--`.

## What I did NOT do, stated so it is not read as done

- **No signature.** Nothing in this task signs, accepts, or approves. `context.human_admission` is
  `off` and no `finding` is emitted; every note here is `artifact-ref` / `observation` / `decision`.
- **`plans/board.md` and `plans/traceability.md` not written** — a second UAT agent runs concurrently
  on `ABC-065`. The trace delta is in this task's own note, for the Orchestrator to append.
- **The ticket was not moved** to `Ready to Release` or to `Done`, and its page was not edited.
- **No production or test file touched.** `src/` is read-only to this hop. No mutant was built — the
  guard's falsifiability is QE's measured result and I did not re-derive it; my job was the user's
  terminal, and that is where every figure above comes from.
- **Rollback was not rehearsed.** The plan is stated in the pack; performing a revert on `main` to
  test it would be a production change made for a test, and I did not make one.
- **The gate was not re-run.** The suite and the skip count were, because they are this pack's entry
  criteria; lint, typecheck and build were not, and are not claimed here.
- **`memory-bank/` not written.**
