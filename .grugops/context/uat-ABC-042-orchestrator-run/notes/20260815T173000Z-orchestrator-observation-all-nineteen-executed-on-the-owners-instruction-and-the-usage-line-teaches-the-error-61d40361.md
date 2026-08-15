---
id: 20260815T173000Z-orchestrator-observation-all-nineteen-executed-on-the-owners-instruction-and-the-usage-line-teaches-the-error-61d40361
kind: observation
by: orchestrator
at: 2026-08-15T17:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-065
  - src/cli.ts
  - .grugops/context/uat-ABC-042-amend/notes/20260815T131000Z-uat-planner-decision-the-amended-abc042-uat-pack-nineteen-scenarios-and-zero-of-epic006s-four-ad75b356
supersedes: 
---

# All nineteen scenarios executed on the owner's instruction — 19/19 pass, and the product's own usage line teaches the mistake it is complaining about

## Why the Orchestrator ran these

**The project owner, in session: *"do UAT yourself."*** He had executed UAT-1, UAT-2, UAT-15 and
UAT-18 himself at a real terminal and reported *"I can't test further as game exited, cannot make a
move"* — **which is the PASS condition of UAT-15 and UAT-16, not a blocker.** He was told so and
directed that the remaining scenarios be executed by the agent.

Authority: `memory-bank/60-progress.md` grant 3 — an agent-run UAT is the execution of the scenarios
and the reporting of the result. **It is still not a signature, and none is recorded here.** Machine:
Apple M3, Darwin 25.5.0, Node v24.12.0, npm 11.7.0, `main` @ `7087ee2`.

## Results — 19 of 19 PASS

| # | Result | Evidence actually captured |
|---|---|---|
| 1 | PASS | owner's own run: board drawn, prompt returned; exit `0` |
| 2 | PASS | owner's screen — back ranks `r n b q k b n r` / `R N B Q K B N R`, queens on d, kings on e; `White to move  1.`, `material: 0` |
| 3 | PASS | two runs byte-identical by `cmp`, exit 0 |
| 4 | PASS | white on rank 1 at the bottom, letter row `a b c d e f g h` |
| 5 | PASS | black at the bottom, letter row `h g f e d c b a`, rank 1 at top, still `White to move  1.` |
| 6 | PASS | 10 runs: **5 white-bottom, 5 black-bottom, 0 frames containing `random`**, no third board |
| 7 | PASS | **32** figures |
| 8 | **PASS — first real evidence this scenario has ever had** | under a **pty**: default **32 figures**, `--ascii` **0 figures** + piece letters, `--unicode` 32. Default vs `--ascii` **DIFFERENT** |
| 9 | PASS | exit `1`, names both `--ascii` and `--unicode`, usage line present, **0** board rows |
| 10 | PASS — all nine rows | every row exit `1`, names its own word, usage line present, **0** board rows. **Row f (`--colour` alone) refuses cleanly — no crash, no stack trace** |
| 11 | PASS | all ten refusals: **0** board rows on stdout or stderr |
| 12 | PASS | exit `1`; `CLEARME`, `[2J`, `END` echoed as visible text; **ZERO raw `0x1b` bytes on stdout or stderr**; no board |
| 13 | PASS (measured) | `0.16 ×8, 0.17 ×2` — **median 0.16 s against a 1.00 s bar** |
| 14 | PASS + known documentation defect | the documented `npm run chess` exits `0` |
| 15 | PASS | owner observed the prompt return; **program elapsed 191 ms with stdin held open 20 s**; piped `e2e4` ignored, still move 1 |
| 16 | PASS | all six verbs refused, exit `1`, **0** board rows, each named in the complaint |
| 17 | PASS | exit `254` from `~` |
| 18 | PASS | **12 rows below the status lines, 0 non-space characters** |
| 19 | PASS | exit `0`, **0** figures, **0** bytes above `U+007F`, all twelve piece letters |

## A measurement I got wrong and corrected before reporting it

My first UAT-15 run was `sleep 20 | npm run chess` and reported **20013 ms**, which reads as *the
program blocked for twenty seconds*. **It is invalid**: a shell pipeline waits for every member, so I
had measured `sleep`, not the program. Re-run timing only the program with stdin held open by process
substitution: **191 ms**. The false number never left this hop.

## THE NEW FINDING — the usage line is a closed loop

**`src/cli.ts:53`:**

```
const USAGE = "usage: npm run chess [--colour white|black|random] [--ascii | --unicode]";
```

**A user who follows the program's own instruction reproduces the error the instruction was printed
to correct.** Measured, end to end:

1. User types `npm run chess --colour black` — the natural spelling, missing the `--`.
2. Program answers `unrecognised argument: black` and prints the usage line above.
3. **The usage line tells him to type `npm run chess [--colour white|black|random]`** — which is what
   he just typed.
4. He types it again. Same failure. `npm warn "black" is being parsed as a normal command line
   argument.`, then `unrecognised argument: black`, exit `1`.

**The string `npm run chess -- ` appears ZERO times anywhere in the program's output.** The separator
that every command in the UAT pack depends on is absent from the one place the product itself teaches
syntax.

**This is NOT `ABC-065`.** That ticket covers `AGENTS.md`'s option list. This is a **second site, in
the product** (`src/`), and closing one does not close the other. Routing is BA/PM's — fold into
`ABC-065` as a second site, or cut its own ticket.

**No scenario FAILS on this.** UAT-9 and UAT-10 require *a* usage line and one is printed; UAT-14's
PASS is on the documented command, which works. **The pack asks whether a usage line exists. Nobody
asked whether following it works.**

**It was found by executing the scenarios by hand and then doing what the program said** — the exact
behaviour a real signer exhibits and a scripted pack does not. QE's coverage map already recorded that
*"that the usage line is printed at all is checked by no test in the repository"*; this hop shows the
uncheck ed line is also wrong.

## What remains owed, and it is not mine

**Item 13 of § 9 — Accept or Reject, with a name and a date — is the project owner's and is not
recorded.** Nineteen passes are evidence offered to him. `context.human_admission` is `off`; this note
is an `observation` and carries no `verified_by`. **No box in § 9 or § 9b was ticked by any agent,
including this one.**
