---
task: wave-2026-09-25
subtask: fix-ABC-105
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-105-qe-hop-detector.md
ref: .grugops/context/fix-ABC-105/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/fix-ABC-105 (off QE tip a0016dbb, which contains the SE tip 60415a8a)
---

# Subtask: close `QE-105-p` (MEDIUM) and `QE-105-q` (LOW) on the branch before merge. Test-only.

QE (`.grugops/context/qe-ABC-105/notes/…8094d5b1` verdict; plants in `…bf59d633`) found:
- **`QE-105-p`:** a refs-only rule planted ONLY in `coverage()` leaves A3's tests green, because `main --ticket` opens only folders naming the ticket and masks the missing folder check. That plant falsely clears 9 of 15 sweep findings (incl. `ABC-073`). A3 is the criterion that earns the ticket, so the lane must go red on it. Add assertions on the unfiltered path: `coverage("ABC-062", readNotes(<real ctx>), <snapshot minus ABC-062>)` reads `finding`, same for `ABC-073` (A9's negative) — and, if cheap, a `--sweep` assertion that `ABC-073` is listed as a finding.
- **`QE-105-q`:** symlink refusal at the `notes/` directory and note-file levels is untested (the tool refuses both, exit 2; only the task-folder level is tested). Add those two synthetic-tree cases.

**Show red → green yourself:** plant QE's coverage()-only refs-only rule in a scratch copy OUTSIDE the repo; show your new assertions red there and green on the unmutated tool. Record the plant text verbatim in your note (QE-105-t: the earlier plant text was not recorded). Same for removing each symlink check.

## Fences
Only `tools/grugops/qe-hop-integrity.test.ts` changes in code; `tools/grugops/qe-hop-integrity.js` `cmp` 0 to `60415a8a`. 0 spawns, still ONE test file. Do not touch `src/`, `AGENTS.md`, `tsconfig.json`, `biome.json`, `plans/board.md`. Work in your OWN worktree (`git worktree add ../wt-fix-ABC-105 -b grugops/fix-ABC-105 a0016dbb`), `node_modules` symlinked in only. No `update-ref` on another branch, no `--force`, `-D`, `reset --hard`, no `--amend`. End each commit with a `Co-Authored-By:` trailer naming the model you actually are. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success:true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`. Take NO timing readings. Notes per Workflow 16 under `ref:`, a trace row at the END of `plans/traceability.md`, and a short § Fix (2026-10-12) on the ticket page. Queue: `mkdir .grugops/queue/claimed/fix-ABC-105`, then at the end FLAT files `.grugops/queue/done/fix-ABC-105.md` and `.grugops/queue/done/fix-ABC-105.claim.md`; leave both uncommitted. Report: branch tip, gates, new test count, the red/green readings with plant text.
