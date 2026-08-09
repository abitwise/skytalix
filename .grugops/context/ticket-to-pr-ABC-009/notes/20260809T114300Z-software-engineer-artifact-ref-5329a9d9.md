---
id: 20260809T114300Z-software-engineer-artifact-ref-5329a9d9
kind: artifact-ref
by: software-engineer
at: 2026-08-09T11:43:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - EPIC-001
  - NFR-001
  - src/moves.ts
  - src/moves.castling.test.ts
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - .grugops/queue/done/ticket-to-pr-ABC-009-dev
supersedes: 
---

# What this subtask produced, and where it is

Trace ids: **`ABC-009`** → **`EPIC-001`** → feature `—` → **`NFR-001`**. Branch
`grugops/ticket-to-pr-ABC-009` (worked on, not created — it already carried BA/PM's correction at
`ee026af` and the Orchestrator's pull at `e01b32f`). Task `ticket-to-pr-ABC-009`, subtask
`engineer-abc009-implement`, Workflow 04.

## Code — one file changed, one file added

- **`src/moves.ts`** — `+30 −8`. Two guard conditions in `addCastlingMoves`, one `rookFrom` field on
  the `CastleOption` interface and its four table rows, one `rook` local, and the doc comments for
  both. md5 `0e247853ab2c05887c76105ff83d8621` (was `fb4fa40934e768dffeaeed0b43548842`).
- **`src/moves.castling.test.ts`** — NEW, 33 tests. `A1`, `A2`, `A3`, the four `A4` rows twice, the
  four `A5` rows twice, the four `A6` rows, the four legal-castle controls, the six `A7` rows.

**No other file under `src/` was touched.** `git status --short -- src/` reports exactly ` M src/moves.ts`
and `?? src/moves.castling.test.ts`. **`git diff --name-only -- 'src/*.test.ts'` is EMPTY**, which is
`A8`'s *"no existing test is modified, verified at line level, not by inspection"* made mechanical —
and the reason the new tests went into a new file instead of into `src/moves.test.ts`.

## STATE files edited — three

- **`plans/board.md`** — the `In Development → In Review` move, the one board move this role owns.
  `In Development` **1/3 → 0/3** (header updated, the `ABC-009` line item removed, an EXITED comment
  added), `In Review` **0/3 → 1/3** (header updated, the line item added, an ENTERED comment added
  carrying the four things handed over), plus one prepended `_Updated:` line. No other column was
  touched and no other ticket's line item moved.
- **`plans/traceability.md`** — **one row (`ABC-009`), four cells**: `NFRs`, `Code (PR/files)`, `Tests`,
  `Status`, plus one prepended `_Updated:` line. No other row touched, none appended, none removed.
  The cell count of the header and of every table row was **machine-verified at ten** before and after
  (23 rows checked, 0 wrong), so no unescaped pipe was introduced.
- **`plans/tickets/ABC-009-legalmoves-position-mutation.md`** — frontmatter `status`/`column` to
  `in-review`, and a new **`## Implementation`** section appended. **Nothing above that section was
  edited**: the `## Acceptance` criteria, BA/PM's correction block, `## Scope`, `## Out of scope`,
  `## Reproduction`, the escalation block, the `NFR-001` bar and `## Test notes` all stand as they were
  at the pull.

## NOT edited, deliberately

`plans/nfr-catalog.md` (Security/NFR's, and no target moved), `plans/tickets/ABC-022-*.md`, `ABC-010`,
`ABC-011`, `ABC-013`, `plans/epics/EPIC-001*`, `plans/metrics.md`, every `memory-bank/` file, and every
other file under `src/`. `src/legal.ts`, `src/apply.ts` and `src/fen.ts` in particular are byte-identical
to merged `main` — `gameStatus` inherits the fix through its first executable line rather than through
any edit. No dependency changed: `package.json` and `package-lock.json` are untouched.

## Board and queue

- **Board move: `In Development → In Review`**, the one this role owns. `In Development` 1/3 → 0/3,
  `In Review` 0/3 → 1/3; no limit approached, no override taken, no written reason owed. QE/E2E owns the
  `In Review` exit. **QE/E2E and Security/NFR were NOT enqueued** — the Orchestrator owns
  decompose→enqueue.
- Queue: `pending/ticket-to-pr-ABC-009-dev.md` → `claimed/ticket-to-pr-ABC-009-dev/` →
  `done/ticket-to-pr-ABC-009-dev/`, claimed **by hand** because `scripts/claim.js` is absent from both
  the repo and the kit — re-checked at the source (`ls scripts`, `ls $KIT/scripts`; `tools/grugops/`
  holds only `reference-check.js` and `test-skip-integrity.js`). The registry record is `claim.md` inside
  the claim directory, carrying `by` / `at` / `task` / `done_at` / `outcome` and an honest note that the
  claim was manual.

## Notes published under this task

- `20260809T113915Z-software-engineer-decision-41c37906` — the fix site and the shape of the guard, with
  the three alternatives it rejected (the `apply.ts` module cycle, per-call arithmetic, the
  `legalMoves`-layer filter).
- `20260809T114000Z-software-engineer-observation-60352bd0` — the gates as they ran, the red-before-green
  record (23 failed / 10 passed), and all fifteen `A1`–`A6` counts matching the delivered diff.
- `20260809T114045Z-software-engineer-observation-cb05b333` — five mutants against the delivered diff:
  four die in disjoint named sets, one survives and is proved behaviour-equivalent over 9,604 boards.
- `20260809T114130Z-software-engineer-observation-9879d731` — `NFR-001` / `A10`, the first throughput
  figure measured on this ticket, with the null-control twin and the structurally-zero cells.
- `20260809T114215Z-software-engineer-claim-b43f03cd` — the soft results, `confidence: UNKNOWN - verify`.
- `20260809T114300Z-software-engineer-artifact-ref-5329a9d9` — this note. **Six in total.**

**No `finding` was written.** None is admissible on this task: there is no §14 gate in this install to
issue a `§14-gate#<id>` stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists
either. **Nothing is self-stamped** — every note above carries an empty `verified_by`. **No `index.md` or
`index.jsonl` was hand-faked**; the renderer that derives them does not exist here.

## Throwaway artifacts, held outside the repository and named so nobody hunts for them

The mutation harness, the three-tree `NFR-001` harness, the two differential-equivalence probes and the
pristine copy of `src/moves.ts` all lived in this session's scratchpad, outside the repository. **Nothing
under `src/` retains any mutation** — `src/moves.ts` was re-hashed to `0e247853ab2c05887c76105ff83d8621`
after every mutant and the full suite is green at 337/337.

## Next hop

The Orchestrator enqueues QE/E2E and, since `NFR-001` is triggered, Security/NFR. **This role does not
certify its own output** — the four mandatory gates passed and `A9` is 32/32, but the terminal gate
verdict is the gate's and the `In Review` exit is QE's. **Nothing was merged and nothing was deployed.**
