---
id: 20260801T204000Z-security-nfr-decision-003eaee8
kind: decision
by: security-nfr
at: 2026-08-01T20:40:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-020
  - ABC-020
  - ABC-007
  - EPIC-001
  - EPIC-004
  - EPIC-006
  - NFR-001
  - src/gameend.ts
  - src/gameend.nfr.test.ts
  - plans/nfr-catalog.md
  - plans/board.md
  - plans/traceability.md
  - 20260801T193500Z-qe-e2e-observation-c22d10e3
  - 20260801T195000Z-qe-e2e-claim-4ddc3f96
  - 20260731T204500Z-software-engineer-decision-0efc6251
  - 20260801T203000Z-security-nfr-observation-183c7951
supersedes: 
---

# ABC-020 Security/NFR gate: PASS. QE's ordering suspicion is correct, it is worse than QE thought, and the guard it asked for is now in the suite

**Verdict: PASS.** All three of `NFR-001`'s leaf-cheapness bars were re-measured independently and
all three hold (`…-security-nfr-observation-183c7951`). The security half is genuinely empty and was
not inflated. **Nothing at or near `security.block_on: high`; no required fix blocks the exit.** No
production code was changed by this gate — the only file added is a test.

## QE's suspicion — chased, confirmed, and it generalises

QE reported (`…-qe-e2e-observation-c22d10e3`) that moving the 150-ply clock check **below** the
fivefold check kills no test, and would break the measured bar-2 property "`zobristKey` = 0 when the
clock decides". **Both halves are true.** Measured, not reasoned:

- The reorder applied to a throwaway `git worktree` at `HEAD` (the branch working tree was never
  mutated): **`src/gameend.test.ts` 45/45 green.** Nothing notices.
- Spied on the same reorder: a counts-map caller at clock ≥ 150 goes from **0 to 1** `zobristKey`
  calls.

Two precisions that matter, because the difference decides the severity:

1. **The bar as WRITTEN — `zobristKey` at most 1 — is not broken by the reorder.** The mutant still
   measures max 1. What breaks is the *stronger* property the Engineer measured and reported. So
   this is a durability gap, not a bar failure.
2. **The cost is one Zobrist key read (281–293 ns on this machine) on a position at clock ≥ 150
   with a counts map** — a terminal position, reachable at most once per game. In wall clock the
   delta measured 129 ns/call, which is *inside* this harness's ±340 ns noise floor (controls that
   should have been zero moved by −338 and +144 ns), so the cost is bounded by the key read and is
   not separately resolvable. **It is not, on its own, a performance risk worth a ticket.**

**But the gap is much bigger than the one mutation QE found, and that is what decided this.** Two
further mutations, run the same way:

| Mutation | `gameend.test.ts` (45 tests) | What it breaks |
|---|---|---|
| a **second `legalMoves()`** call added | **all 45 green** | Bar 1 — *exactly 1*, the invariant `ABC-007` was built to hold |
| **two `zobristKey` reads** instead of the one shared local | **all 45 green** | Bar 2 — *at most 1*, the shared-key design |
| the 150-ply check below the fivefold check (QE's) | **all 45 green** | bar 2's "0 when the clock decides" |

So **all three A10 bars were held by nothing in the repository.** They were measured twice — by the
Engineer and again by me — and each measurement rots the next time anyone edits this function. The
doubled `legalMoves` mutant is the serious one: it doubles the cost of the single hottest call in
`EPIC-004`'s search and every value assertion in the suite stays green. `plans/nfr-catalog.md`
already warned about exactly this ("the call-count bars must be spied, not inferred: two Zobrist
reads instead of one shared read is invisible to every value assertion"), and the warning had no
teeth.

## The ruling: yes, it warrants a permanent guard — and this column owns the call

Both prior roles handed the decision here and said so in writing. The Engineer's `decision` §4
recorded keeping the spy out of the suite as "reversible in one small commit if Security/NFR wants
the guard permanent"; QE declined to add it because "a call-count spy is this column's instrument,
not QE's"; `plans/board.md`'s `In Security/NFR` block says "that is the call to make here". **The
call is made: the guard is permanent.**

**Added: `src/gameend.nfr.test.ts`** — three assertions, one per bar. No production code touched, no
existing test touched (so `A9` is untouched: it constrains *modified* tests, and QE's own six
additions already established that adding is in bounds).

The Engineer's objection to the guard was specific and correct — a `vi.mock` factory is hoisted to
file scope, so putting it in `gameend.test.ts` would re-route the module graph for all 45 tests
there to buy three assertions. **A separate file dissolves the objection**: the mock is scoped to
its own module registry and re-routes nothing else. That option was not considered when the
judgment was made, which is why this reverses it rather than overruling it.

Verified in a throwaway worktree, one mutant per assertion:

```
  unmutated                      48/48 green   (45 existing + 3 new)
  second legalMoves() call       FAIL "bare, in progress: expected legalMoves 1 times, got 2"
  two zobristKey reads           FAIL "expected zobristKey 1 times, got 2"
  150-ply check below fivefold   FAIL "expected zobristKey +0 times, got 1"
```

Gates re-run on the branch with the guard in place, all by me: `npm test` **174 passed / 8 files**
(was 171), skip count **0**, `npm run lint` exit 0 (the same 2 pre-existing biome config infos),
`npm run typecheck` exit 0, `npm run build` exit 0, `src/gameend.ts` coverage still **100%**
stmt/branch/func/line.

**The one thing the guard deliberately does NOT pin.** QE left the five-occurrences-**and**-clock-150
tie unpinned on the ground that locking an arbitrary choice between two rules that both apply is how
a later correction becomes a "regression" — that reasoning is right and it survives. The zero-key
assertion therefore uses a counts map holding **one** occurrence, where no repetition rule is in
play at all: it kills the reorder purely on **cost** and says nothing about which automatic rule
wins the tie. `EPIC-006`'s result screen still decides that, exactly as QE intended.

## Accepted risks, each with a named owner

- **The three bars are single-machine numbers.** Apple M3 / Node v24.12.0 / darwin-arm64, and
  `UNKNOWN - verify` on any other hardware. The new guard is the machine-independent half (call
  counts do not vary by machine); the µs figure is not, and no wall-clock assertion was added to the
  suite for that reason. **Owner: EPIC-004's non-M3 spike**, which already carries the same
  obligation for `NFR-005`.
- **The un-optimized (cold, pre-TurboFan) allocation cost of `const draws = []` on the state-(c)
  path is `UNKNOWN - verify`.** The measurement was attempted and was inconclusive; closing it needs
  V8 allocation-site tracing. It does not matter at a search leaf, where the function is hot by
  construction. **Owner: EPIC-004**, if a profile ever shows it.
- **`ABC-009` and `ABC-011` remain carried, not owned**, exactly as the ticket directs, and this gate
  did not re-scope either. **Owner: their own tickets.**

## What this gate did NOT do

- **It did not re-litigate QE's four LOW defects or its three unsettled items.** A5/A8's `Given`
  wording, FIDE 9.6.1's "consecutive", and the dead `GameResult` alias are BA/PM's and
  Architect/Design's respectively, and this column adding an opinion to them would be noise.
- **It did not touch `src/gameend.ts`.** Nothing in the delivered production code needed a fix.
- **It did not merge and did not deploy.** There is still no git remote, so there is still no PR to
  open; the work sits on the local branch `grugops/ticket-to-pr-ABC-020`. **A human holds merge and
  deploy.**

## Board and UAT

`In Security/NFR` → `Ready for UAT`, this column 1/2 → 0/2, `Ready for UAT` 0/4 → 1/4. No limit
approached, no override taken.

**UAT is recorded as DEFERRED to `EPIC-006`, not passed.** This is rules-core-only work: it renders
nothing and prompts for nothing, so there is no surface a human can exercise. That is the exact
posture `ABC-004..007` were given on 2026-07-24 ("UAT deferred → EPIC-006") and the same reason
applies unchanged. Recording it as deferred on the trace keeps the gap visible instead of marking a
UAT nobody could have run.

## Provenance

Written directly into `notes/`; this install has **no `scripts/context-io.ts` and no
`mcp__grugops__propose_note` tool**, so Workflow 16's sanctioned writer does not exist here — the
degradation every role on this task has recorded since 2026-07-31. This is a `decision` — a soft
kind with an empty `verified_by` — so no admission stamp was required and none was bypassed. **No
`finding` was recorded or attempted: there is no §14 gate in this repo to stamp one, and nothing
here is self-stamped.**
