---
id: 20260809T225630Z-orchestrator-decision-2847125a
kind: decision
by: orchestrator
at: 2026-08-09T22:56:30Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-023
  - NFR-001
  - NFR-005
  - src/moves.ts
  - src/moves.enpassant.hardening.test.ts
supersedes: 
---

# QE PASS accepted; Security/NFR routed — the last gate before `Ready for UAT`

No board move by me — QE took the `In Review` exit it owns. `In Review` 0/3, `In Security/NFR` **1/2**,
frontmatter moved with the column.

## Verified rather than accepted

```
src/moves.ts        6335b452fc21ffe2d0f902ecab930840   UNCHANGED — the gate did not repair the module
## Acceptance       4bbf434c7ab3c58afb1fce1b505ea46d   IDENTICAL before and after QE
existing test files modified by QE : NONE   (one added: moves.enpassant.hardening.test.ts)
lint 0 · typecheck 0 · build 0 · 559 passed (559) on 18 files · skip count 0
```

The two properties that matter at a review gate both hold mechanically: **QE did not touch the module
it was judging, and it did not edit the criteria it was judging against.** Every ticket on this board
records the same check and it has never yet failed — worth keeping that way.

## The finding is real and it is NOT a code defect

QE built **three typecheck-clean builds that pass all eleven criteria, all 439 tests and deep perft
32/32** — one overwrites the mover's own queen with a pawn, one rewrites an enemy knight into a pawn
on `4k3/8/8/3nP3/8/8/8/4K3 w - d6 0 1`. The cause is the criteria's tables, not the module: `A1`
samples two piece types where `## Scope` quantifies over every byte, and `A3` never places anything
but `EMPTY` or an own pawn behind the target.

**The delivered code is correct on all 44 FEN-producible configurations of both axes.** QE closed the
gap with a new file (120 tests, suite 439 → 559) rather than by amending criteria that both say
"at minimum" — the right instrument, and no criterion moved.

This is the **third** independent derivation of `NFR-001`'s 331 / 216,269 / 0, and `A5`'s keep-claim
is now confirmed by a role other than the one that made it: the colour-shaped restructure passes 435
of 439 tests and deep perft 32/32, failing **only** `A5`'s four rows.

## Carried into the Security/NFR gate, not closed here

QE reports an **open gap it deliberately did not close**: the enemy-occupant-on-target axis is `A5`'s,
and covering it would falsify a present-tense comment in the sibling file — the exact class `A11`
exists to remove. It remains a sample of two piece types. **Routed to `ABC-023`'s promotion hop**,
alongside the castling present-tense sites already sent there. Not a blocker: the delivered code is
correct on that axis and the restructure mutant passes all 40 hardening rows, so this is net, not
behaviour.

Also carried: non-piece bytes are beyond every in-repo instrument; `ADR-0005` 133-138 is unowned;
`ABC-023`'s `A4` hash pin is stale by design; the test-integrity checker still exits 2 with no
registry file, which is **an error and not a pass** — pre-existing, `quality.test_integrity` is
`warn`, and the AGENTS.md skip-count command reads 0.

## What I have not established

I did not re-derive QE's 14-tree mutation campaign, the three surviving builds, or the 120 new rows.
No throughput figure at this hop is mine. `NFR-005` remains structurally excluded — `src/legal.ts`
gained comment text only and no executable line, which the `cmp` check on comment-stripped content
proves rather than asserts.
