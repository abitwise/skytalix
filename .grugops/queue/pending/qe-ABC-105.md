---
task: wave-2026-09-25
subtask: qe-ABC-105
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-105-qe-hop-detector.md
ref: .grugops/context/qe-ABC-105/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-105-qe-hop-integrity (tip 60415a8a; code ada10423; base aeeba067)
---

# Subtask: QE on `ABC-105`, the QE-hop integrity check (`tools/grugops/qe-hop-integrity.js`)

Verify A1–A9 and Test notes 1–5 independently, from your own readings; the build notes are under `.grugops/context/ticket-to-pr-ABC-105/notes/` on the branch. This is the post-build QE verdict for ABC-105: file it as a `kind: decision`, `by: qe-e2e` note whose `refs:` names `ABC-105`, in a folder naming it, so the tool itself would count it (and say whether `--ticket ABC-105` then names YOUR note or still the pre-build `qe-recheck` one).
- **A4 — hand-count it yourself** with code that shares nothing with the tool or the SE's script (expected 132 / 38 / 77 / 2 / 15 at base; list any id you disagree on). Confirm the snapshot equals the `## Done` line-leading ids of `git show 9998a544:plans/board.md` (38 ids) by your own parse.
- **A3 is the criterion that earns the ticket:** plant a refs-only rule and an exact-match refs rule yourself (in a scratch copy OUTSIDE the repo or reverted; `git status --porcelain` clean after) and show which tests go red.
- **Break it on purpose,** your own plants: folder normalisation as a substring test (`abc0066` vs `ABC-006`); accept `kind: observation`; accept the ticket's own `ticket-to-pr-*` folder; follow a symlink out of `.grugops/context/`; a naive `ABC-\d+` Done parse (expect 1217 hits / 137 distinct not 132); a silent 0 on missing snapshot/board; a `--snapshot`/`--force` flag accepted. Say which the tests catch.
- **Security:** confirm the tool executes nothing it reads (no `eval`, `Function`, `require`/`import` of read paths, `child_process`), follows no symlink out, writes nothing, no network.
- **Config change:** `tsconfig.json` gains `"allowJs": true` + one include, `biome.json` one include. Check the blast radius yourself: `tsc --listFiles` difference vs base (only the tool and its test added?), `checkJs` off, `build` is `tsc --noEmit` so nothing is emitted; lint/typecheck still cover what they covered. Rule whether `allowJs` project-wide is acceptable or a narrower option exists (name it; do not change it).
- **N8-LANE (you are the ONLY hop running, width 1):** read the test file's narrow-set cost under `ADR-0035` decision 2 (the file vs a one-assertion placeholder at the same path), vitest 4.1.11, `maxWorkers: 2`. Log before and after each run: load1, `notifyutil -g com.apple.system.thermalpressurelevel`, any other vitest process (`pgrep -fl vitest`; the foreign `oeselg-labs/platform/repos/shared` load voids a run), power source. Discard overlapping runs. Grade against 650 ms CPU and the provisional 16 % floor `F` as the page states. If no quiet window, record NOT READ, never estimate.
- **The SE's brief deviation:** the brief's `test-skip-integrity.js --skip-count 0` form lacks the registry path; confirm the AGENTS.md form is the right one.
- Measure the UAT-waiver reading yourself and say whether it honestly applies: runnable code was added under `tools/` (not `src/`), no player-visible behaviour.

## Fences
Do not touch `src/`, `tools/`, `AGENTS.md`, `tsconfig.json`, `biome.json` or `plans/board.md`; revert every plant. Work in your OWN worktree on a QE branch `grugops/qe-ABC-105` off the tip — NEVER `update-ref` the Engineer's branch. No `--force`, `-D`, `reset --hard`. Never merge or push. `diff` is a git wrapper here; use `/usr/bin/diff` or `cmp`. Publish notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict, a trace row at the END of `plans/traceability.md`, and a § QE section on the ticket. Queue: `mkdir .grugops/queue/claimed/qe-ABC-105`, then at the end write FLAT files `.grugops/queue/done/qe-ABC-105.md` and `.grugops/queue/done/qe-ABC-105.claim.md`; leave both uncommitted. End commits with a `Co-Authored-By:` trailer naming the model you are. Report the branch tip, verdict, each criterion with your reading, the timing table, and gaps.
