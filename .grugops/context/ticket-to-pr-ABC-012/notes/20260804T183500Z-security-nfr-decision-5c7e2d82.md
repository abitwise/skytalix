---
id: 20260804T183500Z-security-nfr-decision-5c7e2d82
kind: decision
by: security-nfr
at: 2026-08-04T18:35:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-012
  - ABC-012
  - ABC-011
  - ABC-019
  - ABC-020
  - ADR-0002
  - EPIC-002
  - EPIC-004
  - EPIC-006
  - NFR-002
  - NFR-003
  - src/history.ts
  - plans/board.md
  - plans/nfr-catalog.md
  - plans/traceability.md
  - plans/tickets/ABC-012-game-history-module.md
  - 20260804T120000Z-orchestrator-decision-f066a9d0
  - 20260804T160000Z-qe-e2e-decision-a283903f
  - 20260804T182000Z-security-nfr-observation-efa0ecea
  - 20260804T182500Z-security-nfr-observation-029d5a04
  - 20260804T183000Z-security-nfr-claim-c0c70630
supersedes: 
---

# VERDICT PASS_WITH_RISKS — `ABC-012` moves `In Security/NFR` → `Ready for UAT`, no required fix, five accepted risks each with an owner

## The verdict

**PASS_WITH_RISKS** in this role's own vocabulary — **result PASS, NO required fix outstanding, FIVE
accepted risks each with a named owner and a place.** `ABC-012` moves `In Security/NFR` →
`Ready for UAT`. In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4; **no limit approached, no
override taken, no written reason owed.** The `In Security/NFR` exit is the one board move this role
owns.

Gated against `security.asvs_level: L1` and `security.block_on: high`. **Nothing sits at `high`, so
nothing blocks.** `compliance_regime` is `[]`, so no Compliance Officer hand-off is owed.

## What earned it, and what did not

**It was not earned by reading the Engineer's numbers or QE's verdict.** Those were re-run only as a
control on this gate's own instruments and they reproduce: **226 passed / 10 files / 0 failed**, skip
count **0** by the `AGENTS.md` command, `npm run lint` / `npm run typecheck` / `npm run build` all
**exit 0**, `src/history.ts` md5 `12f8c562d46286e68383f8e2cab407fa` — identical to the Engineer's
`feat` commit `47cad31`, confirming QE changed no production code.

**What earned it is two things this column owns and no earlier role did.**

**First, the five numeric bars were RE-MEASURED on this gate's own harness** — the same standard this
column applied to `NFR-005` on `ABC-011`, where inheriting a design hop's figures was explicitly
refused. Own harness, own process, out of tree, 11 rounds with a discarded warm-up and the cell order
rotated every round, medians of per-round means, two fully independent samples, on **Apple M3
(Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` anywhere else. **All six
MET, every one with room:**

| Bar (120 plies unless noted) | This gate (2 samples) | Bar | Ratio |
|---|---:|---:|---:|
| `takeBack(h, 2)` — upper bound | 2.46 / 2.45 µs | ≤ 5 µs | 0.49x |
| `keyHistory(h)` | 40.16 / 40.20 µs | ≤ 60 µs | 0.67x |
| `repetitionCounts(h)` | 44.35 / 44.45 µs | ≤ 75 µs | 0.59x |
| `gameStatusOf(h)` | 47.75 / 47.59 µs | ≤ 75 µs | 0.64x |
| `playMove(h, move)` | 8.6 / 8.2 ns | ≤ 100 ns | 0.09x |
| `repetitionCounts` @ **300 plies** | 91.93 / 92.15 µs | ≤ 150 µs | 0.61x |

**Second, the ticket's "no security trigger" assertion was TESTED rather than inherited** — structural
scan of the full 8-module transitive closure, 12 hostile payloads actually fed to the module, and a
judged ASVS L1 tier (12 of 70 requirements reachable, 58 structurally N/A with the reason stated per
block). **The assertion holds.** The full evidence is in the two observation notes.

## The two fences QE handed forward — both TESTED, and one produced a result nobody predicted

**Fence 1 — `gameStatusOf`'s margin is position-dependent.** Discharged with the fence's own
measurement instead of being passed on a third time. The margin over `repetitionCounts` is
**3.40 / 3.14 µs** on the startpos-anchored line and **4.55 / 4.49 µs** on a kiwipete-anchored line,
against bare `legalMoves` of 2.74 µs and 3.89–3.96 µs at those positions — so **the margin IS the one
`legalMoves` call plus ~0.6 µs, and it swings 1.4x on position alone.** The fence is real.

**And the result nobody predicted: the expensive-`legalMoves` anchor is CHEAPER overall** — 41.89 /
42.25 µs against 47.75 / 47.59 µs — because on this module the O(plies) derive dominates and that
line's replay is cheaper by more than its generator call is dearer. **The bar survives the worst
`legalMoves` position this repository benchmarks**, and the arithmetic worst case over the observed
extremes is ~49.0 µs = 0.65x of the bar.

**Fence 2 — the `takeBack` figure is an upper bound.** Tested by moving the restore outside the timed
region. It reads **higher** (2.92–2.93 µs), not lower, because the clean variant pays cold-object
cost per iteration. The restore's arithmetic contribution is ~0.017 µs, **below this instrument's
resolution**. So the bound is confirmed as a bound, is tight to within less than the instrument can
see, and **the bar is MET on either framing.** No claim is made that either framing resolves the
other.

## One instrument was built, measured, and DISCARDED before it produced a false MISS

The first `takeBack` cell called `legalMoves` twice inside the timed region and read **10.38 µs
against the 5 µs bar — a 2.08x MISS.** Two generator calls at 2.7 µs each account for ~5.4 µs of it.
The restoring moves are fixed across iterations, so they are now computed once outside the clock and
the cell reads 2.46 µs.

**No number is claimed from the discarded instrument, and it is recorded rather than buried.** A gate
that reports a MISS it manufactured itself is worse than one that reports nothing. This is the
**seventh** instrument-limit correction this project has recorded, and it was caught by the caution
`plans/nfr-catalog.md` already carries.

## The `takeBack(NaN)` ruling — the judgement this gate was asked for, reasoned rather than asserted

`takeBack(history, NaN)` silently discards the entire game. This gate reproduced it and **extended
QE's table**: `undefined`, **the raw string `"abc"`** and `{}` all destroy the game too; `null`, `[]`,
`-1`, `-Infinity` are safe; `"2"` and `[3]` are correct by coercion; `1.5` and `0.5` take back more
than asked. **The string case is new here and it is the one that matters** — `ABC-019` will parse a
ply count from user input, and both plausible implementations reach the defect
(`Number.parseInt("abc")` is `NaN`; handing the raw token through is worse still).

**Severity MEDIUM. It does NOT block against `security.block_on: high`, and the reasoning is written
out rather than asserted, because a convenient answer here would have been the easy one.**

It is a **correctness and data-integrity defect, not a security finding.** Under ASVS **V2.2.1** an
unvalidated input used for a business decision is an L1 requirement, and this role's own rule makes an
L1 fail **HIGH** by default — which would block. **It is not an L1 failure today, and the reason is a
fact this gate measured rather than an opinion: the input surface does not exist.** `src/history.ts`
has **zero production importers**, and there is **no call to `takeBack` or `playMove` anywhere outside
`src/history.test.ts`**. Nothing untrusted reaches it; there is no trust boundary for a validation
control to sit on. **The requirement is not FAILED — it is NOT YET ENGAGED.**

**This gate states the counterfactual plainly instead of banking the convenient half: the moment
`ABC-019` wires a parsed ply count to this function, V2.2.1 IS engaged, the default severity is HIGH,
and it BLOCKS.** That is not a deferred security control — it is a named trigger with a named owner,
recorded so `ABC-019`'s gate cannot claim it was not told.

**Owner: BA/PM to rule the guard (they already own criterion 2's rewording); place: `ABC-019`, the
first consumer.** Not fixed here and deliberately not pinned by a test, agreeing with QE's reason: a
test asserting today's output would enshrine the behaviour and make the eventual fix look like a
regression.

## PASS rather than a fail, and the reason is not that the findings are small

Every acceptance criterion is met (criterion 2 as QE ruled, with the compiler); the module has **zero
importers** so nothing downstream inherits anything; the suite kills **20 of 20** non-equivalent
mutants after QE's five added tests; coverage is **100 / 100 / 100 / 100** against a 0.8 threshold;
and **no bar is within 1.5x of failing.** The two real defects (`takeBack(NaN)`, `playMove`'s
unguarded precondition) are both **unreachable today by construction, and both are booked against the
ticket that makes them reachable.** A defect found and owned before its consumer exists is the gate
working.

## What this gate deliberately did NOT do

- **No production code was changed, and no test was added.** `src/history.ts` and
  `src/history.test.ts` are byte-identical to what QE handed over. This gate names required fixes
  rather than making them, and the two defects it found need **guards**, which are production logic
  this column does not write.
- **NO NFR TARGET MOVED — not one.** `plans/nfr-catalog.md` gains `ABC-012`'s real-code measurements
  where two rows already name this module's derives as a boundary condition (`NFR-002`) and a turn
  component (`NFR-003`). `NFR-001`, `NFR-004`, `NFR-005`, `NFR-006` and `NFR-007` are byte-identical.
- **No acceptance criterion, `## Out of scope` line, NFR bar or test note on the ticket was edited** —
  including criterion 2, whose wording remains BA/PM's, upheld as unsatisfiable by two gates now.
- **The double-push repetition test stays DECLINED** on QE's routing reason; this gate has no evidence
  that changes it and does not re-open it.
- **`ABC-009`, `ABC-010` and `ABC-022` are carried, not fixed.**
- **UAT is recorded as DEFERRED to `EPIC-006`, not as passed.** There is no runnable game, so there is
  no surface a human can exercise, and recording a UAT pass that did not happen would be a
  fabrication. Same posture as `ABC-004..007`, `ABC-020` and `ABC-011`.
- **Nothing was merged and nothing was deployed.** `autonomy=pr` holds, and **no PR exists because
  this repository has no git remote** — there is nowhere to push and none was invented. A human holds
  merge and deploy.

## Substrate

No `scripts/` directory at all — no `scripts/claim.js` and no `scripts/context-io.ts`. The queue file
moved `pending/ticket-to-pr-ABC-012-sec.md` → `claimed/ticket-to-pr-ABC-012-sec/` → `done/` **by
hand**, with a `claim.md` registry record; Workflow 17 step 2's atomic claim could not be executed and
the manual move is a **degraded substitute, not an equivalent**. Width is 1 and no contention is
possible. Notes are hand-written into `.grugops/context/ticket-to-pr-ABC-012/notes/` in the schema's
exact shape, and **no derived `index.md` / `index.jsonl` was hand-faked** — the renderer that produces
them does not exist here. **`finding` is inadmissible: no §14 gate exists to issue a `§14-gate#<id>`
stamp, `context.human_admission` is `off` so no `human:<name>` stamp is available, and no role may
self-stamp.** The kinds used are `decision`, `observation`, `claim` and `artifact-ref`.

## Next action

The Orchestrator owns the `Ready for UAT → …` routing. Three items are owed to named roles before or
alongside `ABC-019`: **BA/PM** owns criterion 2's wording, the `takeBack` ply-count guard ruling, and
a ticket for the untracked `coverage/` hygiene item that three roles have now flagged and none owns.
**Architect/Design** owns whether SEAM 1's declined `playMove` guard survives contact with a real
parser. **`ABC-019`** is the consumer of both defects and of the contradictory borrow guidance at
`src/history.ts:42`.
