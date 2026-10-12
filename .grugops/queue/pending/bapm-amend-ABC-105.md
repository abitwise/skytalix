---
task: wave-2026-09-25
subtask: bapm-amend-ABC-105
role: ba-pm
ref: .grugops/context/bapm-amend-ABC-105/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/bapm-amend-ABC-105
base: main @ 81fcae78
---

# Subtask: BA/PM amends `ABC-105` (QE-hop detector) on QE's pre-build re-check, and re-scores its DoR

Owner's word: "yes send ba/pm". QE ruled the ticket BUILDABLE WITH PAGE AMENDMENTS (`.grugops/context/qe-recheck-ABC-105/notes/…72ae8565` verdict + gap register, `…298a669e` sweep table; § QE re-check (2026-10-12) on the page). Fold every gap `QE-105-a`..`-o`: amend, accept with a reason, or strike. Cite QE's readings; re-measure only what you change a number on, with the command.

Must-resolve (HIGH):
- **QE-105-a, the cutover.** "Generated from the board as it stands when this lands" now means all 131 Done ids, 0 in scope. Fix the cutover set as a named commit (QE proposes `9998a544`, 38 ids, 304 B; note the 38-vs-40 ambiguity with `e23c8484`) and strike/rewrite the § Dependencies ordering note.
- **QE-105-b, "refs contains T".** ABC-076 fails A2 under exact refs (its verdicts cite only `plans/tickets/ABC-076-…md`). Define the match (e.g. by A5's normalisation over ids and ticket paths) and confirm A3/A9 outcomes are unchanged.

Then the MEDIUM ones, each needing a decision on the page: `-c` A4's expected counts and the missing "QE'd, off-convention" class (all findings by id); `-d` `--sweep` exit code with standing findings, given Test note 3 forbids override flags (rewrite Test note 4's example); `-e` define "malformed" front matter; `-f` A7's paragraph cannot fit AGENTS.md (31 B headroom) — move it to a memory-bank page, and say what the Scribe must do (tighten first, then a pointer, or no AGENTS.md edit); `-g` a pre-build investigation note satisfies all four conditions for its own ticket — exclude it, add a condition, or name it in A7's ceiling; `-h` the test seam for "remove an id from the snapshot" without a flag, and reconcile the spawn count with N8-LANE. LOW `-i`..`-o` as you judge (size label M(5) vs board convention; page over its line budget — trim history if you can without losing a reading).

Re-score DoR at the end. If 10/10, recommend Backlog → Ready; if not, name what blocks. If any gap needs the OWNER's word (not yours), state the exact question and do not guess.

## Fences
Edit only `plans/tickets/ABC-105-qe-hop-detector.md`, your notes under `ref:`, and one trace row at the END of `plans/traceability.md`. Do not touch `plans/board.md`, `AGENTS.md`, `src/`, `tools/`. Criteria edits are dated amendments (keep what was struck visible, briefly). Work in your OWN worktree (`git worktree add ../wt-bapm-amend-ABC-105 -b grugops/bapm-amend-ABC-105 main`). No `--force`, `-D`, `reset --hard`. Never merge or push. Run no test suite, take no timing readings. End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/bapm-amend-ABC-105`, then at the end write FLAT files `.grugops/queue/done/bapm-amend-ABC-105.md` and `.grugops/queue/done/bapm-amend-ABC-105.claim.md` (not a directory); leave both uncommitted. Report: branch tip, each gap's disposition, the new DoR table, any owner question, and the board move you recommend.
