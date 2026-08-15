---
id: 20260815T225500Z-security-nfr-decision-g1-regraded-met-at-023x-1e95c50d
kind: decision
by: security-nfr
at: 2026-08-15T22:55:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G1
  - N8-LANE
  - N8-SPAWN
  - NFR-008
  - ADR-0008
  - plans/nfr-catalog.md
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
supersedes: 20260815T094500Z-security-nfr-decision-g1-ruling-and-owner-escalation-8833f3be
---

# `G1` RE-GRADED against `N8-LANE` as amended by `N8-SPAWN` — **MET at 0.23x**, and the account's DISCLOSURE wire **FIRED**

**Stated first, because it is what I was told not to assume: the outcome was open when I started, and
I did not aim at a number.** My gate hop predicted this ticket would land at 0.35x under an account
that did not exist yet. **That prediction was a guess about wording I had not read, and I treated it
as inadmissible.** I read `N8-SPAWN` as written, applied its three-part test child by child, applied
its four exclusions, re-measured everything, and arrived at **0.23x** — a different number, from a
different instrument, on a bigger charge than I predicted. That the direction agrees is a
corroboration, not the goal.

**This note supersedes my gate ruling's VERDICT only.** That ruling's four parts were correct on the
bar as it then stood and are not withdrawn: the bar did bind, it was breached at 2.00x, no conforming
build could meet it, and the escalation was right. **What changed is the bar, by the only authority
that could change it.**

## The verdict

> **`ABC-042` MEETS `N8-LANE` as amended by `N8-SPAWN`: 152.5 ms CPU against the 650 ms bar = 0.23x.
> MET.** Measured at my own hand on `grugops/abc042-merge-key` @ `b891880`, the tree that merges.

```
gross delta A-B                                     1548.5 ms CPU   sign 8/8
                                                    (ADMISSIBLE: identity null -0.53%, sign 3/8)
- FLOOR account   1 test file added x 160 ms         160.0 ms
= N8-LANE net WITHOUT the spawn account             1388.5 ms  =  2.14x   <- what the bar said before
- SPAWN account   ten children, own measured CPU    1236.0 ms
                                                    ---------
= ABC-042's N8-LANE charge                           152.5 ms  =  0.23x   ->  MET
```

**Cross-checked against a direct measurement rather than left as a subtraction.** A third condition
holding the ten children and nothing else puts this file's whole in-process content at **22 ms, sign
5/8** — the same quantity, measured instead of inferred, and **smaller** than the subtraction gives.
The two readings differ by 130 ms, which is the same effect as the 194 ms by which in-lane children
outcost standalone ones. **Both readings are MET by more than a factor of four. The verdict does not
depend on which one you take.**

## Part 1 — does each child actually pass the account's charging test? **All ten. Yes.**

The subtask named this as the finding that would matter most, so it is answered child by child, not in
aggregate. The test is three parts and a charge must pass all three.

| # | child | criterion | (1) child process, own CPU | (2) named by criterion text, countable before the build | (3) deleting it needs the criterion deleted or weakened |
|---|---|---|---|---|---|
| 1 | `npm run chess` | `A1` | 236 ms | `A1` names `npm run <name>` executed, in its own Given | **`A1` IS the ticket** — *"a human types one command"*; an imported-function assertion proves composition, not startability |
| 2 | `--colour white --unicode` | `A4` white + `A7` unicode | 113 ms | `A4`'s second Given names `--colour white`; `A7` names `--unicode` on the same pipe | the entry point has **zero exports** (`A2`, asserted) — there is no in-process route to "the running entry point" |
| 3 | `--colour black` | `A4` | 112 ms | `A4` names `--colour black` | one process gets one argv; not mergeable with 2 |
| 4 | `--colour random` | `A4` | 112 ms | `A4` names `--colour random` byte-identical to exactly one of the two | distinct clause; deleting it deletes the `random`-reaches-no-renderer proof |
| 5 | `--ascii --unicode` | `A5` | 111 ms | `A5`'s Given is both flags | needs a real exit code and BOTH channels unioned; the spy half is separately zero-spawn |
| 6 | `--difficulty 3` | `A6`(iii) | 110 ms | `A6`(iii) says **"End-to-end, spawned"** and names the four argv verbatim | four named arguments, four children |
| 7 | `-x` | `A6`(iii) | 110 ms | as above | as above |
| 8 | `--colour purple` | `A6`(iii) | 111 ms | as above | as above |
| 9 | `foo` | `A6`(iii) | 111 ms | as above | as above |
| 10 | `--colour <ESC>[2Jpurple` | **security bar 3** | 110 ms | bar 3 says **"Spawn once"** with a token containing a literal `\x1b[2J` | the only place an argv-derived byte is observed reaching a terminal |

**Part 2 is the load-bearing one and it is satisfied in the strongest available way: the count was
taken off the criterion text BEFORE the build existed, by BA/PM, at the cut.** The ticket's own
`## Security / NFR triggers` says *"expect TEN spawns — not 'single digits': ten is forced by `A1`(1),
`A4`(3), `A5`(1), `A6`(iii)(4) and bar 3(1), no two mergeable without changing what a criterion
says"*. **I re-derived the count independently off the criteria and got ten, and I verified that the
criterion text is byte-identical to the text both gates ran against** (`## Acceptance` +
`## Security / NFR triggers`, sha256 `97989bad…517a`, unchanged since `d011df4`).

## Part 2 — the four exclusions, checked rather than waved through

1. **In-process cost stays on the ticket.** It does, and it is the 152.5 ms / 22 ms residual. Nothing
   of transform, collect, the two 1000-case sweeps, the 138-case family, the spy or the source reads
   is in the 1236 ms — every millisecond of that figure came from timing a child process on its own.
2. **A child that proves what an in-process assertion could prove.** None does. The decisive structural
   fact is `A2`: **the entry point contains zero `export` statements**, asserted textually. There is no
   binding to import, so "the running entry point" is not reachable in process. The three criteria that
   *can* be proved in process — `A4`'s 1000 resolutions, all of `A6`(i)/(ii), `A5`'s spy — **already
   are, at zero spawns**, because the resolver was split into its own module for exactly this reason.
3. **No child beyond the count the criterion text forces.** Delivered spawn call sites in
   `src/cli.test.ts`: **exactly 1**, comment-stripped, pinned by `expect(spawned).toBe(10)`. **Ten
   children delivered, ten forced. Zero repeats, retries, replicates or loops.** Repository-wide there
   is one other spawn call site — `src/history-pane.nfr.test.ts` — and it is **merged, not this
   ticket's**, and is charged to nobody here.
4. **The per-file floor belongs to the FLOOR account.** 160 ms is subtracted once, under `N8-LANE`'s
   floor clause, for the one test file this branch adds. **Nothing is charged twice.**

**And the account's own rule against the opposite abuse: *"a delivered spawn that no criterion names is
a finding against the ticket, never a charge here."* I looked for one. There is none.**

## Part 3 — does the account's own stop fire here? **One of the two wires FIRES. Reported, not softened.**

**Stop 1 — the total, absolutely. NOT breached.** CPU **11.036–11.347 s of 13.000 s (84.9–87.3%)**;
WALL **2.381–2.655 s of 3.000 s (79.3–88.5%)**. Both MET. Nothing charged to the account was used to
buy a lane the total does not admit.

**Stop 2 — the criterion text is the ceiling on a single charge.** It was fixed at the cut at ten
children, before any measurement existed. The delivered build charges exactly that ceiling and not one
child more.

**Stop 3, wire 1 — THE DISCLOSURE WIRE FIRES.**

> **`ABC-042` charges 1236 ms to the spawn account. That is 1.90 full `N8-LANE` slices — 9.5% of the
> 13 s CPU clause — against a wire set at one slice (650 ms). The wire requires this figure to be
> REPORTED by the gate and carried into the merge decision, never silently netted out. It is reported
> here, it is in the traceability cell, and it is in my report to the Orchestrator.**

**It does not fail the ticket, and I am not treating it as though it did.** The wire's own text says
so: *"It does not fail the ticket. It forbids the charge being invisible."* The merge decision now
carries a number it would not otherwise have had.

**Stop 3, wire 2 — the cumulative wire does NOT fire, and the margin is 64 ms.**

```
opening balance                    0 ms      (the account's own text: "Nothing is charged by the hop that writes it")
+ ABC-042                       1236 ms
= balance after this charge     1236 ms
closing threshold               1300 ms      (10% of the 13 s clause, two slices)
                                -------
margin                            64 ms      =  4.9% of the wire
```

**The account stays OPEN. The next ticket whose criteria force child processes closes it** — which is
precisely the calibration Architect/Design designed for (*"one such ticket does not close the account
and a second one does"*). **But it lands far closer to the wire than that calibration expected**, and
that is a fact for the record, not a reason to shade the charge down. It is developed in my
unasked-for-findings note, with a named owner.

## What I refused to do, listed because each was available

- **I did not move a bar, and I did not edit `plans/nfr-catalog.md` or `ADR-0008`.** `N8-LANE`'s 5%,
  instrument, statistic, null control and floor clause are untouched; `N8-SPAWN` is Architect/Design's
  text and I applied it, I did not improve it. Where I think the account has a defect, it is written in
  a note as a recommendation with an owner — the same route that produced this account in the first
  place.
- **I did not use my own 0.35x prediction as a target**, and the number I got is not it.
- **I did not use my gate's 1070 ms child figure**, which was the more flattering one for the account's
  cumulative wire. I re-measured on a finer instrument and reported the larger number, 1236 ms, which
  is the one that brings the account within 64 ms of closing.
- **I did not charge the in-lane figure (1430 ms) either**, which is the number I believe is truest.
  **The account says "direct timings" and a gate applies the account as written.** Both readings are
  recorded so the owner and Architect/Design can see the difference and rule on it.
- **I did not open `plans/tickets/ABC-042-…md`.** BA/PM's refusal holds. The bar-text defects I found
  earlier are cut as `ABC-057`–`ABC-060` and stay there.
- **Zero bytes under `src/`.** The third measurement condition was built OUT OF TREE and the repository
  was never written; `git status --short -- src/` is empty.
