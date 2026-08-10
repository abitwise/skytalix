---
id: 20260810T174800Z-orchestrator-decision-a91f3c56
kind: decision
by: orchestrator
at: 2026-08-10T17:48:00Z
verified_by: 
confidence: medium
refs:
  - ABC-025
  - N5
  - src/san.qualifier.hardening.test.ts
  - plans/board.md
supersedes: 
---

# Owner says fix `N5`. There is a candidate nobody has evaluated against the bar that now exists — `Ready for UAT` → `In Development`

The owner asked for the issue to be fixed before moving on. My reading, stated so it can be corrected:
**make `N5` met without weakening the net.** If the only way to meet it is to cut coverage, that is
not a fix, and the honest outcome is to stop and say so rather than to trade the thing this ticket
exists to build.

## The candidate, and why it is not the one BA/PM refused

Security/NFR built an **assisted-only** variant of `A1` and measured it at **+5.3% wall / +7.4% CPU**,
concluding *"still over"*. That conclusion was correct **against the bar as it stood at that moment** —
`≤5%` **gross**.

**Then BA/PM proved that bar unmeetable by construction:** the fixed floor for a ticket adding two
test files is **+5.4% to +6.1%** of lane CPU, so `≤5%` gross could not be met by two *empty* files. The
re-derived bar is `≤5%` **net of that floor**.

Nobody has re-evaluated the assisted-only variant against the re-derived bar. The arithmetic that
makes this worth a hop:

```
delivered            gross +13.6% CPU  −  floor +5.8%  =  net +7.8%   (1.6x over, the current breach)
assisted-only        gross  +7.4% CPU  −  floor +5.8%  =  net ~1.6%   (inside <= 5%, UNVERIFIED)
```

**That is an inference from two roles' numbers taken on two occasions, not a measurement.** It is the
lead, not the answer. It must be measured under the re-derived bar's own protocol — interleaved
rounds, fresh process per run, null control by identity ≤1%, floor measured for the same file count and
subtracted — or it is worth nothing.

## Why this is a different species from the change BA/PM refused

BA/PM refused `A1` over **23 positions instead of 207** — a **corpus narrowing** — on the ground that
its justification (*"all five mutants still die on the 23"*) is the same species of argument QE refuted
and Security/NFR upheld against the Engineer. That refusal stands and is not being reopened.

The assisted-only variant **does not touch the corpus.** All 207 positions and all 5,524 qualifiable
moves keep running under the ladder-search property. What it drops is the **second call form** inside
`A1` — verified structurally at `src/san.qualifier.hardening.test.ts:294`, where `toSan(position, move)`
is called without the legal list for every qualifiable move, regenerating the move list each time.

**And that call form is already owned by another criterion.** `A5` asserts both call forms identical
over the 23 positions (line 620), `ABC-013`'s `A18`/`A19` assert it over its 18, and **QE measured that
`A5` is red for all four call-form mutants** — correcting the ticket's own claim that `A5` is
"corroboration, not a mutant-killer".

## The coverage question that decides it, stated as the thing that could kill the idea

**What would be lost is the unassisted call form over the 184 derived positions.** A build whose two
call forms diverge *only* on derived positions — never on the 23, never on `ABC-013`'s 18 — would
become invisible.

Is that build constructible? I do not know, and **an argument is not the answer here.** The lesson of
this entire ticket is that "no current mutant sees the difference" is weak evidence, because the mutant
set cannot see what nobody thought to mutate. **Somebody has to try to build that mutant.** If it
exists, the assisted-only variant is a coverage cut wearing a performance fix's clothes and must be
refused exactly as the corpus narrowing was.

## Board move — backward, and that is the honest direction

`Ready for UAT` → `In Development`. A ticket receiving a code change is in development, not awaiting
business acceptance. This is the second backward move in this project's history; the first was
`ABC-009` on 2026-08-09, when a criterion was found unmet in `Ready for UAT`.

```
Ready for UAT      1/4 → 0/4
In Development     0/3 → 1/3
```

Width 1, sequential. Nothing else is in flight.

## Standing limits for the hops that follow

- **No file-count, row-count or line-count bar**, as on every hop of this ticket.
- **`A1`–`A6` and the delivered corpus are not to be narrowed to make a number fit.** If the measured
  outcome is "the only compliant change costs coverage", that is a legitimate result — report it and
  stop. I will take it back to the owner rather than have a role trade it away.
- `src/san.ts` stays at `cbcc3be37c21414d16e8e6b4d0c68959`. Zero production lines. `A6` is unchanged.
- The bar is **not** to be moved again. It was re-derived once, by its owner, with its statistic and
  floor named. A gate does not move a target and neither do I.
