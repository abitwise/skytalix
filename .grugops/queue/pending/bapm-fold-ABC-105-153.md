---
task: wave-2026-09-25
subtask: bapm-fold-ABC-105-153
role: ba-pm
ref: .grugops/context/bapm-fold-ABC-105-153/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/bapm-fold-ABC-105-153
base: main @ c1841b36
---

# Subtask: BA/PM folds the remaining QE gaps from ABC-105 and ABC-153 (both Done and merged)

For each gap: cut a ticket (next free id `ABC-154`; check `plans/tickets/` for the highest id first), accept it as a named risk with a trigger, or close it as no-action — with the reason, citing the QE note. Re-measure only what you change a number on.
- **ABC-105** (`.grugops/context/{qe,qe2,qe4}-ABC-105/notes/`, verdicts `…8094d5b1`, `…3bc30c08`, `…6a647762`; page § QE / § QE2 / § QE4):
  - `QE-105-r` (LOW) a symlinked `.grugops/context` root is followed; `-s` (LOW, by design) the CLI wrapper is untested (0 spawns); `-u` (LOW) project-wide `allowJs` drops the TS7016 guard (narrower: a sibling `.d.ts`); `-w` (INFO) `fix-ABC-…`/`repair-ABC-…` folders are accepted; `-y` (LOW) stale JSDoc "the command line can supply neither" now covers three options; `-z` (LOW) no positive check on the whole-tree reads (an unfiltered-only `readNotes` drop goes 0 red; one positive assertion over `allNotes()` closes it); `-aa` (INFO) seam-only behaviour not reachable from the CLI.
  - `-x` (MEDIUM) the formal N8-LANE reading is owed: the owner merged "on the +0.370 s reading" (ungraded). The Architect (`design-ABC-105-lane`, in parallel) records the risk and trigger; you only cross-reference it — do not duplicate the ruling.
  - Note: any ticket that edits `qe-hop-integrity.test.ts` changes the N8-LANE set and owes a lane re-read — say so on what you cut.
- **ABC-153** (`.grugops/context/qe-ABC-153/notes/…e88108db`): `QE-153-a` (LOW) a hash-prefix compare passes the lane (one more refusal with an `expected` differing only in its last hex char closes it); `-b`, `-c` (INFO).
- Record on the ABC-105 page that the owner's 2026-10-12 answers were: UAT waived (`QE-105-v`), merge on the +0.370 s reading (N8-LANE), and `QE-105-d` (findings stand permanently) not overruled. Append-only page corrections; criteria are not rewritten on Done tickets.
Edit only `plans/tickets/` (new tickets and append-only sections on ABC-105/153), your notes and the trace row. Recommend column moves for anything you cut; do not edit the board.

## Fences (all three hops run in parallel, width 3)
Never merge or push. Do not touch `plans/board.md`, `src/` or `tools/`. Work in your OWN worktree (`git worktree add ../wt-bapm-fold-ABC-105-153 -b grugops/bapm-fold-ABC-105-153 main`). No `update-ref` on another branch, no `--force`, `-D`, `--amend`, `reset --hard`. Take NO timing readings (others run in parallel). `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. If you change any committed file other than notes, run the gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success:true. Notes per Workflow 16 under `ref:`, one trace row at the END of `plans/traceability.md`. End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/bapm-fold-ABC-105-153`, then at the end FLAT files `.grugops/queue/done/bapm-fold-ABC-105-153.md` and `.grugops/queue/done/bapm-fold-ABC-105-153.claim.md` (not a directory), uncommitted; `rmdir` the claim dir. Report: branch tip, what you changed (with readings), and anything owed by another role or the owner.
