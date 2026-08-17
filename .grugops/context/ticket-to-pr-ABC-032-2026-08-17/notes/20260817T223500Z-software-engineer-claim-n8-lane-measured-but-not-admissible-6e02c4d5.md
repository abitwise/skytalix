---
id: 20260817T223500Z-software-engineer-claim-n8-lane-measured-but-not-admissible-6e02c4d5
kind: claim
by: software-engineer
at: 2026-08-17T22:35:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-032
  - N8-LANE
  - NFR-008
  - src/san.parse.test.ts
supersedes:
---

# `N8-LANE`: measured, and the measurement is NOT admissible under its own clauses

`ABC-032` § Security/NFR inherits `N8-LANE`: **≤ 650 ms CPU** (5% of `NFR-008`'s 13 s), CPU
instrument (user + sys), median of paired per-round deltas, **n ≥ 7** interleaved, identity null
control **≤ 1.5%**, net of 160 ms per test file added. This ticket adds **one** test file.

## What was run

7 interleaved rounds, one fresh process per run, on the branch tip. Condition A: `npx vitest run`
(the full lane, with `src/san.parse.test.ts`). Condition B: `npx vitest run --exclude
'**/san.parse.test.ts'` — the identical tree with that one file excluded. A third run of condition A
per round serves as the identity null control (the same command against itself).

| round | A (ms CPU) | B (ms CPU) | delta | null control |
|---|---|---|---|---|
| 1 | 11480 | 11470 | +10 | +140 |
| 2 | 11710 | 12000 | −290 | +410 |
| 3 | 11980 | 12070 | −90 | +340 |
| 4 | 12280 | 12150 | +130 | −90 |
| 5 | 12130 | 12150 | −20 | +370 |
| 6 | 11960 | 11790 | +170 | +500 |
| 7 | 12480 | 12050 | +430 | −200 |

**Median paired delta: +10 ms. Sign test: 4 positive, 3 negative** — indistinguishable from noise.

## Why this is a `claim` and not a result

**The identity null control fails `N8-LANE`'s own admissibility clause.** Its median is **+340 ms
on a ~12 s lane — 2.8%**, against a bar of ≤ 1.5%. By the rule `ABC-025` paid four gates to
establish, an instrument that ranks nothing above everything cannot rank anything: this run's noise
floor (340 ms) is 34x the signal it is trying to measure (10 ms), so the +10 ms figure is not
admissible evidence of anything.

**What can honestly be said:** the added file's cost is below this instrument's resolution on this
machine, and nothing in the run suggests it is anywhere near 650 ms — `src/san.parse.test.ts` alone
reports `Duration 192ms` wall for 22 tests, against a 160 ms per-file floor the bar already nets
out. **What CANNOT be said is that `N8-LANE` was measured and passed.** The out-of-tree measurement
at `P60` is Security/NFR's, not this hop's, and this note exists so that role starts from a real
table rather than from a green assertion.

Confidence is `UNKNOWN - verify` deliberately: no `finding` is admissible on this install
(`AGENTS.md`), and this one would not have earned it anyway.
