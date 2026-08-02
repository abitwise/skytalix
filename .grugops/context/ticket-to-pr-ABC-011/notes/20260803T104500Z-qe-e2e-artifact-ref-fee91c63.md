---
id: 20260803T104500Z-qe-e2e-artifact-ref-fee91c63
kind: artifact-ref
by: qe-e2e
at: 2026-08-03T10:45:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - EPIC-001
  - NFR-005
  - src/legal.test.ts
  - src/zobrist.test.ts
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
supersedes: 
---

# What this QE hop produced and where each piece lives

Everything is on branch `grugops/ticket-to-pr-ABC-011`, on top of the dev hop's `98b07e7`. **No PR
exists — this repo has NO git remote** (`git remote` is empty), so there is nowhere to push and no
pull request to open. No link was invented. **A human holds merge and deploy; nothing was merged and
nothing was deployed.**

## Tests added — five, plus one assertion. No production code touched.

`src/legal.ts` and `src/zobrist.ts` are **byte-identical to `98b07e7`.**

- `src/legal.test.ts` — `describe("ABC-011 QE edge probes")`, two cases:
  - `2r4k/8/8/2PpP3/8/8/8/2K5 w - d6 0 1` — the lower-file capturer `c5xd6` is pinned on the c-file,
    `e5xd6` is legal. Asserts two pseudo-legal candidates exist, exactly one is legal, it is the
    **second** one, and the predicate returns `true`.
  - `2k5/8/8/8/2pPp3/8/8/2R4K b - d3 0 1` — the black mirror, so the predicate's
    `black ? target + 16 : target - 16` branch is covered by the same shape.
- `src/zobrist.test.ts` — `describe("ABC-011 QE — the ep component still distinguishes what FIDE
  distinguishes")`, two cases:
  - the ep **file** pair `4k3/8/8/1pPpP3/8/8/8/4K3 w - b6 0 1` vs `… w - d6 0 1` — same placement,
    same side, same rights, a legal ep capture answers each, keys must differ.
  - the key-level half of the two-candidate shape.
- `src/zobrist.test.ts` — `describe("ABC-011 QE — zobristKey returns the position exactly as it
  found it")`: a 2-ply walk from all six perft roots comparing the **full position state** (128 board
  bytes plus all five scalars) across every `zobristKey` call, asserting `impure` is empty, the walk
  is non-empty, and that the mutating path was genuinely entered (`withEpComponent > 0`).
- `src/zobrist.test.ts` — **one line added inside the dev hop's property test**:
  `expect(checked - answered).toBeGreaterThan(0)`. Declared, not slipped in; the reasoning is in the
  `decision` note. It is not an edit to a pre-existing test — that block was written on this branch.

Suite **184 → 189**, skip count **0**. Each added test kills at least one mutant that survived the
delivered suite. Deterministic by construction: fixed FENs, fixed seed, exhaustive walks, no clocks
and no randomness — **no flaky risk introduced**.

## The board, the ticket and the trace

- `plans/board.md` — `ABC-011` moved **`In Review` → `In Security/NFR`**. In Review 1/3 → 0/3,
  In Security/NFR 0/2 → 1/2; no limit approached, no override taken. Header updated, exit comment
  under `## In Review`, entry comment under `## In Security/NFR`, live ticket row moved.
- `plans/tickets/ABC-011-…md` — front matter `status: in-security-nfr` / `column: In Security/NFR`;
  the move recorded in `## Definition of Ready` beside the dev hop's.
- `plans/traceability.md` — `ABC-011`'s row updated **in place** (Tests / Status), prior text kept
  behind a `Previously:` marker. No row appended: one row per ticket is this file's own format rule.
- `AGENTS.md` — **deliberately unchanged.** No command changed, no command was added, and no
  `UNKNOWN - verify` slot became knowable. The skip-count capture command was run exactly as written
  and returned `0`.

## The verdict and the measurements

- `…/20260803T103000Z-qe-e2e-decision-01251e89.md` — the **PASS** verdict against the lean
  Definition of Done and the PR review checklist, the two judgments the Engineer handed over
  (rule 1's ownership: **agreed**, with the mutation evidence for why; the module table:
  **agreed**, do not reorder), and the board move.
- `…/20260803T103500Z-qe-e2e-observation-f8cb6854.md` — the raw record: the **22-mutant** table
  before and after, the two survivors that were real, the acceptance criteria re-derived, the
  line-level "no existing test modified" check, the divergence table reproduced to the number, the
  purity walk, the property-test halves, and the module graph rebuilt a third time.
- `…/20260803T104000Z-qe-e2e-claim-faefac9a.md` — the new defect (`zobristKey` permanently corrupts
  a position with a semantically inconsistent ep square, with three reproductions and the
  oracle-divergence analysis) and the four residuals, at `confidence: UNKNOWN - verify`.

## Substrate

Recorded rather than glossed, as every prior task here has: this install has no `scripts/claim.js`
and no `scripts/context-io.ts` / `mcp__grugops__propose_note`. The queue file was moved
`pending/` → `claimed/ticket-to-pr-ABC-011-qe/` → `done/ticket-to-pr-ABC-011-qe/` **by hand**, with
a `claim.md` registry record written by hand alongside it, and these four notes were **hand-written**
into `notes/` in the schema's exact shape. **No `finding` was written — none is admissible without a
§14 gate — and nothing was self-stamped.** There is no `index.md` / `index.jsonl` render because the
renderer does not exist here.
