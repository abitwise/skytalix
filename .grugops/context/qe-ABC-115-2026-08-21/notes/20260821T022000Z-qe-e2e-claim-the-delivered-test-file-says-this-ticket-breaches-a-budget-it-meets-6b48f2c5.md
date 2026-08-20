---
id: 20260821T022000Z-qe-e2e-claim-the-delivered-test-file-says-this-ticket-breaches-a-budget-it-meets-6b48f2c5
kind: claim
by: qe-e2e
at: 2026-08-21T02:20:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-115
  - ABC-114
  - N8-SPAWN
  - G-QE115-2
supersedes:
---

# DEFECT `G-QE115-2` — THE DELIVERED DIFF SHIPS A SENTENCE SAYING THIS TICKET BREACHES A BUDGET THAT IT MEETS

`confidence: UNKNOWN - verify` — no `finding` is admissible here. Reported, not fixed.

## The false sentences, in the delivered tree

`src/cli.test.ts`, in the `N8-LANE` pin's comment block (the `TWENTY-THREE children` row), delivered
at `aac410c` and unchanged since:

> `ABC-115` re-expressed the cap in three clauses — **<= 6 added children AND <= 2.0 s added wall AND
> <= 0.5 s added CPU**.
>
> MEASURED AT THE REPAIR HOP, 5 INTERLEAVED PAIRED RUNS: +6 children, +1.14 s wall, +1.02 s CPU
> (user+sys; +0.78 s on `user` alone). **THE CPU CLAUSE IS BREACHED AND IT IS SAID HERE RATHER THAN
> SHIPPED QUIETLY.**

Both statements were true when they were written. **They stopped being true nine hours later.** The
2026-08-21 budget ruling (BA/PM, `budget-ABC-115-2026-08-21`) superseded the `<= 0.5 s added CPU`
clause as arithmetically impossible and re-derived it as **`<= 0.30 s added CPU (user+sys) PER ADDED
CHILD`**, under which the delivery is **MET on all three clauses**. That ruling touched the ticket,
the board and the trace — `git show --stat 6acc3fb` lists **no file under `src/`** — so the code
still carries the superseded cap and still announces a breach that no longer exists.

## Why this is a defect and not pedantry

This is exactly `ABC-114`'s defect class — *a true-sounding sentence that is not true* — and this
very comment block invokes that principle twice about other sentences, in this file, in this diff.
The consequence is concrete: the pin is the one place a later hop looks to learn what the spawn
budget IS. Today it teaches the wrong ceiling **and** tells the reader this ticket blew it.

**Strictly, `A8` is satisfied.** `A8` names `AGENTS.md` and `src/cli.ts`'s exit-code docblock, and
both are true verbatim (measured — see the gates note). `AGENTS.md` was correctly left unopened
(`ABC-109`'s byte cap). **So this defect fails no criterion as written**, and I am not claiming it
does. It is a false statement inside the diff under review, which is the thing QE is here to find.

## The narrowest correction, and it is not mine to make

The comment block, not the assertion. `const N8_SPAWN = 17 + 6` and the `expect`s are correct and
should not move; the count clause is met at 23. The three clauses quoted need to become the clause
in force, and the "BREACHED" paragraph needs to become the delivered figures against it. **No
production line and no test assertion changes.**

## Independently re-measured, so the correction has numbers to use

Five interleaved paired runs of `npx vitest run --dir src`, base = `main` @ `414ef75`, delivered =
this branch. Deltas in CPU (`user + sys`): **1.37, 1.07, 1.21, 1.15, 1.35 s** — **median 1.21 s over
6 children = 0.202 s per child**, sign agreeing **5/5**. Wall deltas: 1.14, 1.09, 1.25, 0.98,
1.17 s — **median 1.14 s**. Against the clause in force: **children +6 (at the ceiling, pinned),
wall +1.14 s (<= 2.0 s), CPU 0.202 s per child (<= 0.30 s). MET on all three**, and my figure
reproduces the ruling's 0.198 s per child to within 2%.

One honesty note on my instrument: the base was run in the repository checkout and the delivered in
a git worktree whose `node_modules` is a symlink to it. The two trees differ under `src/` by exactly
this ticket's diff, and the pairing sign held 5/5, but the paths differ in length and the reading is
mine rather than a repeat of theirs.
