---
task: wave-2026-09-25
subtask: bapm-rescore-backlog-process
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/bapm-rescore-backlog-process/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/bapm-rescore-backlog-process
base: main @ 11c4bfe3
---

# Subtask: BA/PM re-scores the process/record half of the Backlog

Owner word: "analyze backlog and ready some tickets". Re-score each ticket below against `main` @ 11c4bfe3 as it stands TODAY, not as it stood at its last score. Most were last scored in August or 2026-10-10/11; since then ABC-144 (vitest 4.1, CPU cap), ABC-152, ABC-145/153/155 (book compiler sha256), ABC-105/154 (QE-hop check), ADR-0035 addenda A1/B1, and the board convention changes landed. For each: re-read every premise, count and file/line/md5 the page cites, and say which still hold (measured, with the command); clear any ⚠️ that is discharged, name any that is still open or new; amend acceptance so it is testable at today's tip; and score DoR. A ticket reaches Ready only at 10/10. Prefer making tickets ready by fixing the page over leaving them; say plainly if a ticket is obsolete (its problem no longer exists) and recommend dropping it.

Your tickets (pages under `plans/tickets/`; board rows under `## Backlog`):
- **ABC-052** (S, P2, DoR 8/10 ⚠️x2): the traceability Status column goes stale on every merge. Re-measure the stale-row count at today's tip; the ordering on ABC-040.
- **ABC-040** (S, P2, DoR 10/10): duplicate ABC-028/029 trace rows. Re-verify the 40-rows-for-38 premise and that the delete/merge plan still applies byte-for-byte; if still 10/10, say why it sat in Backlog and recommend Ready.
- **ABC-056** (XS, P2, owner: Release Manager, DoR 9/10): AR-1's accepted-risk override drift (brace-expansion vs nanoid/postcss). Re-run `npm audit` (read-only; no install/fix) and re-read the override; does the drift still exist?
- **ABC-039** (S, P2, DoR 9/10): backward-move ordinals ("FIRST"/"SECOND") on the board are uncitable. Re-measure at today's board.
- **ABC-030** (XS, P3, DoR 10/10): NFR-justification comments cite a live sibling test count. Re-verify the cited comments still exist at today's `src/` and what counts they quote vs today's 57/1775; if still 10/10, recommend Ready.
Where two of these overlap (052/040 ordering; any that `ABC-105`'s tool or today's conventions made obsolete), say so and recommend the order or a merge.

## Fences (two BA/PM hops run in parallel, width 2)
Edit only the ticket pages of YOUR tickets (append-only dated `## Re-score — 2026-10-12` sections; criteria amendments dated, struck text kept visible briefly), your notes under `ref:`, and one trace row at the END of `plans/traceability.md`. Do not touch `plans/board.md`, `src/`, `tools/`, `AGENTS.md`, ADRs, the catalog, or the other hop's tickets. A ticket you would merge/split/drop: recommend it, do not delete files. Work in your OWN worktree (`git worktree add ../wt-bapm-rescore-backlog-process -b grugops/bapm-rescore-backlog-process main`); symlink `node_modules` into the WORKTREE root only if needed — never `ln -s` in the main checkout. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`. Never merge or push. Take NO timing readings (cite existing ones). `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/bapm-rescore-backlog-process`, then at the end FLAT files `.grugops/queue/done/bapm-rescore-backlog-process.md` and `.claim.md`, uncommitted; `rmdir` the claim dir.
Report, per ticket: old DoR → new DoR with the 10-item table, what changed and the readings behind it, the recommended column (Ready / stays Backlog / drop / merge), size and priority, and any EXACT owner question. Then a ranked list of what you recommend pulling first and why.
