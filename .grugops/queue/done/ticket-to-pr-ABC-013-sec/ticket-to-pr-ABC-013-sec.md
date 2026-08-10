---
task: ticket-to-pr-ABC-013
subtask: ticket-to-pr-ABC-013-sec
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md
ref: .grugops/context/ticket-to-pr-ABC-013/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T13:30:00Z
branch: grugops/ticket-to-pr-ABC-013
---

# Subtask: the `ABC-013` risk gate — a SPLIT gate, and the NFR half is the half with teeth

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Twenty-six notes carry the acceptance repair, the build, the engineer's own bar measurements, QE's
40-mutant sweep and its external-oracle result, and every hop's explicit list of what it did NOT check.

## Why this gate is split, and what each half is worth

**The security half is close to untriggered, and you should confirm that rather than assume it.** The
ticket's own analysis: input is a `Move` from the generator and a `Position` — **no user-supplied
string reaches this module**, and the epic's user-string risk sits in `ABC-018`'s message region.
There is no I/O, no network, no filesystem, no `eval`, no dependency added (`package.json` and
`package-lock.json` are byte-unchanged vs `main` — verified). But **628 new lines landed**, so read
them for that one question rather than skipping the half.

**The NFR half is the half that matters, and it has a specific defect available to it.** `N1`–`N4`
were measured by the **engineer who wrote the module** — the instrument of the role being measured.
That is the exact dependency this board has been bitten by repeatedly. Re-derive them independently:

```
N1  mean toSan(pos, move, legal) ≤ 1/5 of mean toSan(pos, move) over all 42 moves at P60   [PRIMARY, a ratio]
N2  mean toSan(pos, move, legal) over all 42 legal moves at P60  ≤ 0.75 µs
N3  mean toSan(pos, move) over all 42 legal moves at P60         ≤ 6.5 µs
N4  no single legal move at P60 exceeds 14 µs in either call form
P60 = 1rb4r/3k4/p1ppNn2/1p1np1Q1/1q1P1B1P/PRP2p2/3KP1BR/6N1 w - - 2 31
```

`P60` is independently verified by the Orchestrator at **42 legal moves, exactly 3 giving check** —
you may rely on that. `N1` is the primary bar and the only machine-independent one.

Two things already on the record that you should not re-derive but should not inherit blindly either:
the bars were set from a **reference build that allocates**, so they are ceilings rather than targets;
and the engineer's `N4` worst (10.24 µs) exceeds the reference build's (9.34 µs) — he attributes that
to an instrument difference, not a slower build. **Test that attribution.**

Also confirm `NFR-002`'s frame budget is still intact — this module is the most expensive item in a
frame and `ABC-016`/`ABC-017` will consume it.

## The known-open item you are NOT being asked to fix

QE found **5 criteria gaps, all one class: over-qualified (non-minimal) disambiguation**, and **0 code
defects**. The delivered build is correct — an external oracle agreed on 649,556 strings. The gaps
mean a *wrong* build could pass the table, not that this build is wrong. Closing them is a separate
decision the Orchestrator owns. Do not close them and do not let them block your verdict; weigh them
only if you think they bear on risk.

## Do not

- Do not modify `src/san.ts` or any test. If something is wrong, report it.
- Do not edit `plans/nfr-catalog.md` targets. If a target genuinely needs to move, say so and let a
  human decide — that file's targets have never been moved by a gate.
- Do not merge, do not deploy.

## Publish

Typed notes per Workflow 16 into `ref:` — hand-authored markdown, established layout (no
`scripts/context-io.ts` here; the gap is on the record). A `finding` needs a real verification stamp;
otherwise an honest `claim` with `confidence`. Give a clear terminal verdict — `PASS`,
`PASS_WITH_RISKS` (every risk with a named owner and a trigger) or `FAIL` with required fixes.
`security.block_on` is `high`; `asvs_level` is `L1`. The `In Security/NFR` exit is yours. Mark this
subtask done per Workflow 17.
