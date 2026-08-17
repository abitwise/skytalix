---
id: 20260817T190536Z-qe-e2e-artifact-ref-abc031-qe-tests-added-and-gate-rerun-at-8ec01a1-1f6bcaf3
kind: artifact-ref
by: qe-e2e
at: 2026-08-17T19:05:36Z
verified_by:
confidence: high
refs:
  - ABC-031
  - src/coordinate-move.test.ts
  - src/coordinate-move.ts
  - plans/tickets/ABC-031-coordinate-move-input.md
supersedes:
---

# `ABC-031` QE artifacts — 19 rows added, gate re-run, branch tip `8ec01a1`

Branch `grugops/ticket-to-pr-ABC-031-2026-08-17`. **NOT merged. No board column moved. No ticket page
edited. `agent-factory/` untouched.** The `In Review` exit is the QE role's to move; I am publishing
the verdict and leaving the column to the orchestrator, because gaps 1 and 5 are open and routed to
BA/PM and the `A2` repair is owed.

## Commit

`8ec01a1` — `test(ABC-031): grug add QE rows for three gaps mutants walked through`, on top of the
engineer's `42ecc27`.

## Diff — `git diff 42ecc27 --numstat`

| added | removed | file |
|---:|---:|---|
| 124 | 1 | `src/coordinate-move.test.ts` |

**One file. `src/coordinate-move.ts` is byte-identical to `42ecc27`** — every one of the nine
mutations was restored with `git checkout src/coordinate-move.ts` and verified with `git diff --quiet`
before the next one was applied, and once more at the end.

`git diff 42ecc27 --name-only | grep '^src/' | grep -v '\.test\.ts$'` → **0 files**. `A7`'s
production-line fence re-measured from git at the QE hop, not taken from the engineer's report.

The single removed line is the `import` from `./moves.ts`, widened to add `FLAG_EN_PASSANT`.

## Rows added — 19, in the EXISTING file

No new test **file**: the ticket's `## Lane cost` reserves ONE and prices a second at 160 ms CPU, so
a QE-owned second file would spend a budget the ticket deliberately declined. The `src/cli.test.ts`
module-inventory count (`ABC-042` `A3`) is untouched — no production module was added.

| describe block | rows | closes |
|---|---:|---|
| `ABC-031 QE — the out-of-scope grammar fence is closed` | 14 | gap 3 (mutant M8) |
| `ABC-031 QE — the \`legal\`-omitted call is a contract path and must work` | 3 | gap 2 (mutant M7) |
| `ABC-031 QE — en-passant provenance, the ADR-0004 (2b) site A5's corpus misses` | 2 | gap 4 |

Every added row follows the ticket's own `## Test notes`: **reference identity, never deep equality**
(note 1); **no fixture constructs a `Move`** — the en-passant expectation is taken out of `legal` by
`find` (note 2); and **the input string is printed in the assertion**, not just the verdict (note 4),
via the `expect(\`${text} -> ${outcome}\`)` shape the engineer already used in `A5`.

**No existing row was weakened, skipped, deleted or re-scoped.** Skip count stayed **0**.

## Gate re-run by QE at `8ec01a1`

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0**, 56 files checked, no fixes applied |
| typecheck | `npm run typecheck` | **exit 0** |
| test | `npm test` | **914 passed / 914, 31 files, exit 0** |
| build | `npm run build` | **exit 0** |
| skip count | grep for `.skip` / `.todo` / `xit` / `xdescribe` under `src/` and `tools/` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32 passed / 32, exit 0**, 37.97 s |

**Baseline at `42ecc27`, before any mutation:** 895/895 in 31 files, lint 0, typecheck 0, build 0,
skips 0, integrity `No findings.`, deep perft 32/32 in 37.43 s. **The engineer's published gate
numbers reproduce exactly.** 914 − 895 = **19**, the rows above.

## Row count delta on the one file

`src/coordinate-move.test.ts`: **26 rows → 45 rows.** Runtime of that file is unchanged at the
millisecond scale (8 ms baseline; the added rows are two `parseFen` + `legalMoves` pairs and 21 pure
string calls). No new test file, so **`N8-LANE`'s per-file 160 ms CPU term is unchanged by this hop**
and the ticket's `≈ 1.2% of NFR-008` arithmetic still stands as written.

## Queue

Claimed with a bare `mkdir .grugops/queue/claimed/quality-gate-ABC-031-qe-2026-08-17` (no `-p`), which
succeeded — the claim was uncontested.
