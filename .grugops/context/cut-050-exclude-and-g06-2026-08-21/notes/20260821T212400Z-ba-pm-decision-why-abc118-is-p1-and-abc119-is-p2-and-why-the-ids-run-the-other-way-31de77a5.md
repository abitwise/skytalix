---
id: 20260821T212400Z-ba-pm-decision-why-abc118-is-p1-and-abc119-is-p2-and-why-the-ids-run-the-other-way-31de77a5
kind: decision
by: ba-pm
role: ba-pm
task: cut-050-exclude-and-g06-2026-08-21
at: 2026-08-21T21:24:00Z
verified_by: ""
confidence: high
refs:
  - ABC-118
  - ABC-119
supersedes: ""
---

# The priorities are **argued, not inherited** — `ABC-118` `P1`, `ABC-119` `P2`, and the ordering between them runs one way

**Hand-authored `decision`; no stamp, no `finding`.**

## They are procedurally twins and substantively different

| | `ABC-118` | `ABC-119` |
|---|---|---|
| kind of gap | **containment** | **coverage** |
| fix | a lane-inventory assertion | a new opt-in lane |
| price | roughly nothing (~0.45 s CPU for the probe, in its own process) | 3.07 s per child, paid in the opt-in lane; **+0.09 s wall / +0.06 s CPU** to the default lane |
| is the harm live today | **YES, measured** | **no — nothing is failing** |
| size | `S` | `M` |
| priority | **`P1`** | **`P2`** |

**Closing either does not close the other.**

## Why `ABC-118` is `P1` and I differ from the proposing role

QE classified the residual without a priority and **called its worst mutant harmless**. I measured
that the reason has expired: a git-ignored checkout with **40 test files** is live in the repository,
so a one-character typo takes the lane to **80 files / 2426 tests, fully green**. That is a gate
**reporting on a tree that is not `main`** — worse than the deletion mutant QE rated higher, which at
least moves a count someone might notice.

- **NOT `P0`:** nothing is broken at `main`, the correct config is in the tree, no player sees
  anything. It is an absent control, not a live failure.
- **NOT `P2`, and the argument for `P2` is real and stated on the page:** no such edit has actually
  happened, `exclude` is rarely touched, and the file carries a long warning comment about this very
  area. **What defeats it is cost asymmetry** — one assertion against a green gate that reported on
  the wrong tree.

## Why `ABC-119` is `P2` and I decline to inherit "MEDIUM" as a priority

**A severity is not a priority.** For higher: it is the largest coverage hole in the flagship path
and it grows with every `EPIC-006` ticket. Against higher, and this decides it: **the composition is
not suspected of being broken** — asserted textually at `:2447`, seam-covered by `ENGINE_DEEP`, and
**three independent hand runs** (two QE's, one mine) show it working. It buys future protection, not
a present repair.

- **NOT `P1`:** no live defect, no wrong gate, nothing blocked. **Cutting both `P1` would assert the
  two are equally urgent when I measured them not to be.**
- **NOT `P3`:** two QE hops declined to absorb it into a PASS, and it travelled into `Ready for UAT`
  as a named unowned gap.

## The ordering, one way, and it runs OPPOSITE to the ids

**Whatever lane `ABC-119` builds is one more file a type-valid `exclude` glob could silently delete
with all four gates green** — measured: excluding a not-yet-existing test file moves the collected
count by nothing anyone compares. **So `ABC-118` should land first**; `ABC-119` landing first only
means `ABC-118`'s recorded expectation is one file larger, which its `A3` is exactly the mechanism to
force. **Neither blocks the other**, and the ordering is written on both pages.

## Ticket prose budget (`AGENTS.md` `## Process rules` 2)

`ABC-118` **266** lines, `ABC-119` **312** lines, **median 289 ≤ 300**. Measurements, rejected
alternatives and the method traps live in these notes, not on the pages.
