---
id: 20260803T160000Z-qe-e2e-decision-69ddf1ff
kind: decision
by: qe-e2e
at: 2026-08-03T16:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - ABC-012
  - EPIC-001
  - EPIC-004
  - NFR-005
  - ADR-0005
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - plans/board.md
  - plans/traceability.md
  - src/legal.ts
  - src/zobrist.ts
  - src/legal.test.ts
  - src/zobrist.test.ts
  - src/zobrist.nfr.test.ts
  - 20260803T150000Z-software-engineer-decision-3b7c1f42
  - 20260803T150500Z-software-engineer-observation-8c4d2a17
  - 20260803T151000Z-software-engineer-claim-5e91d0b6
  - 20260803T133000Z-architect-design-decision-7c41d0ab
  - 20260803T113000Z-orchestrator-decision-913e6028
  - 20260803T103000Z-qe-e2e-decision-01251e89
supersedes: 
---

# VERDICT: PASS. `In Review` → `In Security/NFR`. The defect is closed — and the suite had two holes hiding the same class, which this gate found and closed.

The second review pass on `ABC-011`, run because the project owner declined to merge this ticket
carrying the MEDIUM purity defect. **This pass decides whether it is actually closed, and it is.**

I ran the first pass and its trajectory is gone, so I re-read my own four notes of 2026-08-03 rather
than assuming what I had found. Everything below was measured by me at this pass against the branch
tip; nothing is transcribed from the notes it agrees with.

## The verdict against the lean Definition of Done

| check | result |
|---|---|
| ticket scope implemented | **yes** — the two guards are exactly the second design hop's ruled shape, loop-invariant and above the loop; ACs 1/2/3/5 re-derived outside the suite, AC4 by exhaustive sweep, AC6 at line level |
| tests added/updated | **yes** — 13 by the Engineer, **8 more by this gate**; 193 → 206 → **214**, skip count **0** |
| lint / typecheck / build | **exit 0 / exit 0 / exit 0** (the same 2 pre-existing biome config-schema infos) |
| e2e run when relevant | **not relevant** — `AGENTS.md` records E2E as `UNKNOWN - verify`, no runnable game until `EPIC-006`; `quality.ui_e2e` is `ui-or-critical-path` and there is no UI surface |
| docs updated | **yes** — both doc-comment corrections landed and the `Hashing` row three roles had named was finally taken |
| handoff written | **yes** — four Engineer notes, four of mine |
| risks documented | **yes**, and this gate closes two the first pass carried and adds one correction |
| traceability row updated | **yes**, in place; Tests and Status cells, prior text behind `Previously` |
| no fake command results | **verified** — every figure below was run by me on this machine |

## PR review checklist

- **small enough diff; no unrelated refactor** — PASS. Production delta since `584defa` is
  `src/legal.ts` +32/−6 (four executable lines) and `src/zobrist.ts` +5/−1, doc comment only. I
  confirmed `src/apply.ts`, `src/moves.ts`, `src/gameend.ts`, `src/position.ts`, `src/fen.ts`,
  `src/perft.ts`, `src/perft-bench.ts`, `package.json` and the lockfile are byte-untouched. No
  dependency added.
- **acceptance criteria met** — PASS, re-derived rather than accepted (see the `observation` note).
- **tests meaningful, not flaky** — PASS **after this gate's additions**, and this is the substance
  of the pass. Everything is deterministic: fixed FENs, fixed seed, exhaustive walks, no clocks and
  no randomness in any committed test. The qualifier is below: **two mutants survived all 206
  delivered tests and were real.**
- **error handling sane; logs safe** — n/a, no logging and no error paths in this diff.
- **no secrets committed** — PASS, none in the diff.
- **migration has a rollback if needed** — n/a. Reversal is two conditions and one hoisted const.
- **security/NFR reviewed when triggered** — **triggered and deliberately NOT adjudicated here.**
  `NFR-005` is the next column's. I re-measured **nothing** in that table on purpose, the same
  disposition every gate on this ticket has taken.
- **(enterprise) coverage + scans + a11y + perf** — n/a, `mode: lean`. Recorded anyway:
  `src/legal.ts` and `src/zobrist.ts` are **100%** stmt/branch/func/line against a
  `quality.coverage_threshold` of 0.8 that lean mode does not enforce.

## Why PASS, stated so it can be argued with

The thing this pass was sent to decide is whether the MEDIUM defect is *actually* closed. It is.
All six known reproductions answer `false`, are byte-pure, and hash exactly as they would with no ep
square. Purity survived an attack of **187,328 inputs the Engineer's sweep cannot reach**, including
the hand-corrupted off-board case the Engineer itself named as unverified — 0 impure, 0 throws,
against 1,383 impurities from the same hunter on a guard-stripped control.

What I found is not a defect in the fix. It is **two holes in the suite that hid the same defect
class**, and closing a suite hole is this role's job, not a reason to send a correct fix back to
`In Development`. Both are now closed by tests I added, no production line was touched, and the
Engineer's disjointness property survived the strengthening rather than being weakened by it.

A FAIL would send correct production code back to a column where the only available change is to
tests — which is where I already made it.

## The two survivors, because they are the reason this note is not a formality

The mutation campaign is what caught the real defect on the first pass, and the production surface
moved, so I rebuilt the mutant set rather than re-running the old one: **49 mutants, 44 killed, 5
survived, and all 5 then PROVED behaviour-equivalent** over 55,600 adversarial inputs each — same
answer, same key, same purity — rather than left unkilled with a shrug.

**Two of the 27 new mutants survived all 206 delivered tests and were NOT equivalent.** Both are
exactly the "one-line simplification that looks equivalent" the second design hop warned about:

- **guard (b) relaxed from "exactly the enemy PAWN" to "any enemy PIECE".** Green on 206 tests. On
  `4k3/8/8/3nP3/8/8/8/4K3 w - d6 0 1` a single `zobristKey` call **permanently rewrites the black
  knight on d5 into a black pawn**. That is the owner's MEDIUM defect, reopened in a shape no
  delivered row reaches.
- **guard (a) relaxed from "the target is EMPTY" to "the target holds no ENEMY piece".** Green on
  206 tests. On `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` — **the exact FEN guard (a) exists for** — it
  answers `true` where the ruling specifies `false`, and puts an ep component into the key. Pure,
  and still wrong.

**The shipped code is correct on both and on their mirrors.** The gap is that the delivered
`CONTRADICTORY_EP` table classifies boards by what is **missing** (no pawn, wrong-coloured pawn) and
never by what is **present instead** — which is the axis both relaxations move along. Four FENs at
two levels closes it; both survivors now die at 4 failures each.

## The four things I was asked to judge rather than accept

**1. "Each guard is load-bearing, two DISJOINT failure sets." — TRUE, and it survives my
strengthening.** Reproduced exactly: guard (a) deleted → **4**, guard (b) deleted → **7**, both →
**13**, pass count falling to the pre-fix 193. After my 8 tests: **8 / 11 / 21**, intersection still
**empty**. I hunted for a formulation that passes the suite while reopening a reproduction and
**found two** — reported above and now closed. I also found four genuinely equivalent formulations,
including the one-line `||` merge, which is **safe**; that is worth knowing precisely because two
*other* one-line merges are not.

**2. "Purity holds for EVERY input." — TRUE, and it survived an attack from outside the sweep.**
187,328 inputs the 665-input sweep cannot reach: 600 random boards, hand-corrupted off-board squares
(the Engineer's own named gap), kingless and multi-king boards, all-pawn boards, extreme and negative
counters, every castling value, and `epSquare` = `NaN` / `Infinity` / fractional / out-of-array
**including −256 and 256, which pass `isOnBoard` through two's complement**. 0 impure, 0 throws.

**3. "One of QE's own first-pass FENs is closed by EITHER guard alone, so it kills neither
single-guard mutant." — TRUE, and it changes what the evidence proves, correctly.**
`4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` appears in the both-deleted set and in **neither** single-guard
set; the arithmetic closes exactly (4 + 7 + 2 = 13, and 8 + 11 + 2 = 21). The Engineer corrected my
own first pass's inherited expectation and was right to.

**4. "Guard (a) is a defence against a `generateMoves` defect routed to BA/PM — a workaround with an
owner rather than a permanent design fact." — HALF fair, and "may become deletable" is OVER-STATED.**
Guard (a) is load-bearing for **two** classes and only one is that defect: the mover's-own-piece case
(where `generateMoves` **is** defective and the oracle says `true`) and the enemy-piece-on-target case
(where `generateMoves` is **not** defective — it correctly reads an occupied target as an ordinary
capture and never offers the ep move — and the oracle says `false`). Deleting guard (a) fails **both**
pairs, 4 failures from each. Fixing the generator would leave the second class needing guard (a)
exactly as much as today. Leaving the thread in the file is right; calling the guard deletable is not.

## The claim I was told to check hardest — "NO existing test was modified"

**TRUE, at line level, checked three ways, not by inspection.** Every line of every test file at
three revisions was searched for in the current tree — stricter than `git diff`, because it also
catches a line that was moved *and* edited:

- from `584defa` (before the fix commits) → **0 absent lines** across all 9 test files. The
  Engineer's "this pass widened zero pre-existing lines" is **true**.
- from `ddc013e` (the branch tip) → **0 absent lines**. My own 8 tests are pure appends and widened
  no import either; I chose assertions so every symbol I needed was already imported.
- from `4c6ed7d` (the branch point) → **6 absent lines, all six imports**, three per test file,
  exactly what the first pass recorded. **Zero non-import lines have vanished across the branch.**

`src/zobrist.test.ts:33-37` — the fixture the ticket names by line number — is **byte-identical**,
moved to 43-47 only because helpers were added above it. There is no `.skip`, `.todo`, `.only`,
`xit` or `xdescribe` anywhere in `src/`, and the runner reports **0 pending, 0 todo**.

## What I changed, said loudly

**I fixed no production code.** `src/legal.ts` and `src/zobrist.ts` are byte-identical to `ddc013e`.

I added **8 tests**, all green against the shipped production code, each closing a hole a real
mutant walked through — two appended `describe` blocks with their own local tables, zero pre-existing
lines touched, no import widened.

## Board move I own

`plans/board.md`: **ABC-011 `In Review` → `In Security/NFR`**. In Review 1/3 → 0/3, In Security/NFR
0/2 → 1/2. **No limit approached, no override taken, no written reason owed.** Nothing was merged
and nothing was deployed; a human holds both.
