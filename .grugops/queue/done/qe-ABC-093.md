---
task: wave-2026-09-25
subtask: qe-ABC-093
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-093-compile-the-opening-book-into-a-static-checked-in-artifact.md
ref: .grugops/context/qe-ABC-093/
source_refs: .grugops/context/ticket-to-pr-ABC-093/ (notes …02e9031a readings, …79cc28a5 shape, …a6cb510f; probe/harness.sh, runs.tsv) — on the ticket branch; memory-bank/50-decisions/ADR-0037*, ADR-0023*; .grugops/context/secnfr-catalog-2026-10-10/notes/*d1e00b44.md (§ Flagged: `--dir src`)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T18:42:00Z
branch: grugops/ABC-093-opening-book-artifact (tip 5332f501)
---

# Subtask: QE `ABC-093` — the static opening-book artifact and its compiler

Verify A1–A8 independently with your own harness (base `e34fbc6f`, code `5332f501`). Fetch the pinned CC0
source yourself (URL + commit in `data/opening-book/ATTRIBUTION.md`) into a PRIVATE scratchpad dir and rebuild:
is `book.json` byte-identical and do the five sha256 values match? Break the compiler (illegal SAN, unreachable
entry, zero/non-integer weight, oversize, write-before-validate, transposition collisions) — which mutants stay
green? Check the Zobrist keys against `src/` `zobristKey` for a sample of entries. Confirm `npm test` collects
`tools/opening-book/book.test.ts` and that lane-inventory/skip-integrity agree. Confirm zero non-test `src/`
lines (UAT waiver filter) and that the config diff is only ADR-0037 D1(g)'s two include lines.

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/`, no edits to `book.json`
except by re-running the compiler. Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own
worktree; link `node_modules` into YOUR worktree only (`diff -r -x node_modules`). Commit-message file in a
PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5
<noreply@anthropic.com>`. Quoted heredocs only (`<<'EOF'`). Committed probe scripts may be run with
node/bash/python3; if refused, say so and use your own harness.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
rebuild identity, mutants, gaps with severity, gates, branch + sha.
