---
id: 20260803T161500Z-qe-e2e-artifact-ref-bff16a2d
kind: artifact-ref
by: qe-e2e
at: 2026-08-03T16:15:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - EPIC-001
  - NFR-005
  - ADR-0005
  - src/legal.ts
  - src/zobrist.ts
  - src/legal.test.ts
  - src/zobrist.test.ts
  - src/zobrist.nfr.test.ts
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
supersedes: 
---

# What this second review pass produced, where each piece lives, and how each thing owed was proved

Everything is on branch `grugops/ticket-to-pr-ABC-011`, on top of the second design hop and the
second dev pass. **No branch was created.** **No PR exists — this repo has NO git remote**
(`git remote` is empty), so there is nowhere to push and no link to record; **no link was invented**.
**Nothing was merged and nothing was deployed; a human holds both.**

## The production code

**UNCHANGED. This gate fixed no production code.** `src/legal.ts` and `src/zobrist.ts` are
byte-identical to `ddc013e`. Every other file under `src/` is byte-untouched, no dependency was
added, and this project still has zero runtime dependencies.

## The tests

- `src/legal.test.ts` (**+51/−0**) — `describe("hasLegalEnPassant — ABC-011 QE the guards name a
  piece, not a side")`: four FENs, each asserting `false` **and** the full position state unchanged.
- `src/zobrist.test.ts` (**+27/−0**) — `describe("ABC-011 QE — zobristKey where the wrong piece
  contradicts the ep square")`: the same four at the key level — the ep component is omitted **and**
  the position comes back intact. Both halves are needed: on two of the four the shipped code is
  already pure and only the key would move.

The four boards, all verified to round-trip byte-identically through `toFen` with neither side in
check, so each isolates the ep contradiction and nothing else:

```
4k3/8/8/3nP3/8/8/8/4K3 w - d6 0 1      an enemy KNIGHT, not a pawn, on the ep capture square
k7/8/8/8/3pR3/8/8/4K3 b - e3 0 1       an enemy ROOK, not a pawn, on the ep capture square
4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1    the mover's OWN knight standing on the ep target
7k/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1     the same, mirrored
```

**NO EXISTING TEST WAS MODIFIED, and this pass holds the standard the last one set:** `git diff`
reports **zero** removed-or-changed pre-existing lines in either file. Both blocks are pure appends
and **no import was widened** — the assertions were chosen so every symbol needed was already
imported, and the file-scope helpers `fullState`, `positionSnapshot` and `keyWithoutEpSquare` were
reused rather than duplicated. `src/zobrist.test.ts:33-37` is byte-identical and green.

## The delivery state

- `plans/board.md` — `ABC-011` moved **`In Review` → `In Security/NFR`**. In Review 1/3 → 0/3, In
  Security/NFR 0/2 → 1/2; no limit approached, no override taken, no written reason owed. Header
  updated, exit comment under `## In Review` carrying the mutant result, entry comment under
  `## In Security/NFR` telling that gate what is a delta, what is line-level verified, and which two
  cost-shaped equivalent mutants are its own.
- `plans/tickets/ABC-011-…md` — front matter `status: in-security-nfr` / `column: In Security/NFR`;
  the gate record appended after the `## Definition of Ready` history, with the verdict, the mutation
  table, the two real survivors, the three Engineer claims judged, the purity attack and the one
  correction owed. **No acceptance criterion, reproduction FEN, `NFR-005` bar or `## Out of scope`
  line was edited, and neither `### ANSWERED` block was touched.**
- `plans/traceability.md` — `ABC-011`'s row updated **in place**, Tests and Status cells only, prior
  text behind `Previously` markers. **No row appended** — one row per ticket is this file's own
  format rule. The **NFRs** and **Code** cells are untouched (this gate re-measured no NFR and
  changed no production code) and the **UAT** cell still reads `deferred — EPIC-006`.

## How each thing this pass owed was proved

| owed | how | result |
|---|---|---|
| the fix is genuinely closed, not just green | 49 mutants against the CHANGED surface, each applied alone, full suite per mutant | 44 killed; **2 real survivors found and closed** |
| every survivor is equivalent, not merely unkilled | each run side by side with shipped over 400 boards × 139 ep values | **5/5 equivalent: 0 answer, 0 key, 0 purity differences** |
| each guard is load-bearing, DISJOINT sets | each deleted in turn from `src/`, full suite, failure sets intersected programmatically | 4 / 7 / 13 as reported; **8 / 11 / 21 after my tests, intersection still EMPTY** |
| the QE-3 FEN kills neither single-guard mutant | set difference `G0 \ (G1 ∪ G2)` | **exactly the 2 QE-3 tests** — the Engineer's correction is right |
| purity for inputs OUTSIDE the Engineer's sweep | 187,328 inputs incl. hand-corrupted off-board squares, kingless boards, NaN/∞/out-of-array ep | **0 impure, 0 throws** |
| that the purity hunter is not vacuous | same hunter against a guard-stripped control tree | **1,383 impurities** — the instrument works |
| nothing reachable changes | exhaustive walk of the perft table at `fast` depths, both trees in one process | **518,474 / 81,397 / 0 / 0 / 0 / 0**, a sixth agreement |
| no existing test modified | every line at THREE revisions searched for in the current tree | **0 / 0 / 6-all-imports**; `zobrist.test.ts:33-37` byte-identical |
| acceptance criteria | ACs 1/2/3/5 hashed outside the suite, AC4 by sweep, AC6 line-level, AC7 deferred | **all green, AC7 to Security/NFR** |
| the mandatory gates | `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` | **214 passed / skip 0**, all **exit 0** |

## The reasoning and the measurements

- `…/20260803T160000Z-qe-e2e-decision-69ddf1ff.md` — the PASS verdict against the lean Definition of
  Done and the PR review checklist, the two real survivors, the four judgments I was asked to make
  rather than accept, and the board move.
- `…/20260803T160500Z-qe-e2e-observation-346a1b30.md` — the raw record: all 49 mutants with results
  before and after my tests, what G19 and G22 actually do printed rather than described, the
  equivalence proof for all five survivors, the 187,328-input purity attack with its control, the
  exhaustive sweep, the acceptance re-derivation, and the three-revision line-level check.
- `…/20260803T161000Z-qe-e2e-claim-e471a730.md` — what could not be settled at
  `confidence: UNKNOWN - verify`, including the one correction owed to the Engineer (guard (a) is
  load-bearing for two classes, so "may become deletable" is over-stated), the two cost-shaped
  equivalent mutants handed to Security/NFR, the two first-pass residuals that are now closed, and
  the honest limits of measured-not-proved equivalence.

## The harness — NOT in the repository, deliberately

Seven throwaway scripts in the session scratchpad plus three mutated copies of `src/`:
`qe2-mutate.mjs` / `qe2-mutate2.mjs`, `hunt-purity.mjs` and its guard-stripped control twin,
`qe2-survivors.mjs`, `qe2-g22.mjs`, `qe2-equiv.mjs`, `qe2-sweep.mjs`, `qe2-ac.mjs`,
`qe2-validate.mjs`. They import the repo by absolute path; the mutation runner writes only to its
own sandbox copy and restores it. **Not committed** — the same posture every measurement here has
taken; every number is transcribed into the observation note with its machine, so nothing depends on
them surviving.

**One caution for whoever rebuilds them**, added to the two already on record: run the purity hunter
against a **guard-stripped control** before believing a clean result. Mine reads 0 on the shipped
tree and 1,383 on the control. A hunter that reads 0 on both is measuring nothing — the same class
of error as a benchmark whose null control reads 1.26x, reached from the other direction.

## Substrate

Recorded rather than glossed, as every prior task here has: this install has **no `scripts/`
directory at all** — no `scripts/claim.js` and no `scripts/context-io.ts` /
`mcp__grugops__propose_note`. The queue file was moved `pending/` →
`claimed/ticket-to-pr-ABC-011-qe2/` → `done/ticket-to-pr-ABC-011-qe2/` **by hand**, with a `claim.md`
registry record written by hand alongside it, and these four notes were **hand-written** into
`notes/` in the schema's exact shape. **No `finding` was written — none is admissible without a §14
gate to issue a `§14-gate#<id>` stamp, and `context.human_admission` is `off` so no `human:<name>`
stamp is available either. Nothing was self-stamped.** There is no `index.md` / `index.jsonl` render
because the renderer does not exist here.
