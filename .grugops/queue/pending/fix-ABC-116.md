---
task: wave-2026-09-25
subtask: fix-ABC-116
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-116-record-the-t2-re-measure-trigger-where-a-hop-will-meet-it.md
ref: .grugops/context/fix-ABC-116/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-116-t2-carrier (tip d39618d1) + grugops/qe-ABC-116 (tip 2aaccaf4, fast-forwards onto it)
---

# Subtask: repair QE-116-a, -b, -c, -d on `ABC-116` before merge (Orchestrator routing: repair, not a follow-up). No timing readings owed.

QE's verdict is PASS_WITH_GAPS (`.grugops/context/qe-ABC-116/notes/` on `grugops/qe-ABC-116`). A comment whose job is to tell a future hop
what fires `T2` must not misname what the settle is.
1. In your worktree on `grugops/ABC-116-t2-carrier`, first `git merge --ff-only grugops/qe-ABC-116`.
2. **QE-116-a (MEDIUM):** in the `ChildOptions` JSDoc, "its settle (`timeout`)" is false: `timeout` is the hang bound; the settle is a `sleep` in a
   child's shell argv (e.g. `A9_SETTLE_SECONDS`). Verify both facts in the code yourself, then correct the parenthetical (comment lines only).
   State whether a change to the hang bound (`timeout`) should ALSO fire `T2`; if the ticket's ruling is silent, keep the comment to what the
   ruling says and name the question in a note for BA/PM — do not invent a ruling.
3. **QE-116-b (LOW):** "on the surface such a hop has to edit" overclaims — the measured mutant edits `CHILDREN.<name>`, never the interface.
   Reword so it is true (e.g. the block sits on the type every child entry is built from, and a child edit is in `CHILDREN`), comment lines only.
4. **QE-116-c (LOW):** rename the two force-added `a2-window.log` files to `a2-window.log.txt` (`git mv`), and update every reference to them in
   the branch's notes/page — notes are never edited, so if a committed note cites the old path, add a short `observation` note recording the rename
   rather than editing it. **QE-116-d (INFO):** record the correct commit (`d39618d1`) for the logs in that same note.
5. Append a dated bullet to § Delivery naming QE-116-a/b and the fix, and to the ticket's `C2` paragraph ONLY if the ticket says the Engineer
   may; otherwise leave `C2` and name it for BA/PM.
All A1–A6 fences still hold (only `src/cli.test.ts` under `src/`, comment lines only, catalog/AGENTS.md untouched, N8_SPAWN byte-identical).
A short QE re-check of the parenthetical follows you (a different agent).

## Fences
Never merge to main or push. Do not touch `plans/board.md`, `plans/nfr-catalog.md`, `AGENTS.md`. Own worktree (sibling of the repo),
`node_modules` symlinked. No `update-ref` on another branch, no `--force`, `-D`, `reset --hard` (`git add -f` only if a renamed file is still
ignored — say so). Another hop (Scribe) runs in parallel on a different branch; no timing readings. Gates before your last commit: lint,
typecheck, build, `npm test` with `.test-results/last-run.json` success:true. Notes per Workflow 16, a trace row at the END of
`plans/traceability.md`. Queue: move THIS FILE to `.grugops/queue/done/fix-ABC-116.md` and write `.grugops/queue/done/fix-ABC-116.claim.md`
(flat files); leave them uncommitted. `Co-Authored-By:` trailer with your real model. Remove your worktree when done. Report the tip, gates, the
new comment lines verbatim, and anything named for BA/PM.
