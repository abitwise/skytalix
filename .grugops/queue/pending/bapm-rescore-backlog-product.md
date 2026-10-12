---
task: wave-2026-09-25
subtask: bapm-rescore-backlog-product
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/bapm-rescore-backlog-product/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/bapm-rescore-backlog-product
base: main @ 11c4bfe3
---

# Subtask: BA/PM re-scores the product/engine half of the Backlog

Owner word: "analyze backlog and ready some tickets". Re-score each ticket below against `main` @ 11c4bfe3 as it stands TODAY, not as it stood at its last score. Most were last scored in August or 2026-10-10/11; since then ABC-144 (vitest 4.1, CPU cap), ABC-152, ABC-145/153/155 (book compiler sha256), ABC-105/154 (QE-hop check), ADR-0035 addenda A1/B1, and the board convention changes landed. For each: re-read every premise, count and file/line/md5 the page cites, and say which still hold (measured, with the command); clear any ⚠️ that is discharged, name any that is still open or new; amend acceptance so it is testable at today's tip; and score DoR. A ticket reaches Ready only at 10/10. Prefer making tickets ready by fixing the page over leaving them; say plainly if a ticket is obsolete (its problem no longer exists) and recommend dropping it.

Your tickets (pages under `plans/tickets/`; board rows under `## Backlog`):
- **ABC-146** (XS, P1, DoR 9/10 — item 10 waits on the owner's acceptance of an ADR). Name that ADR and the exact owner question. It needs a long quiet window (~10 h per the board): say what that means for pulling it and whether the harness/step still match today's code (vitest 4.1, ABC-085's ladder).
- **ABC-095** (S, P1, DoR 8/10 ⚠️x2): the book in front of the engine's move choice. Re-read against today's book (`data/opening-book/book.json`, ABC-145's sha256 check, ADR-0012, ADR-0037), EPIC-004's engine state, and the stderr criterion the board says was owed.
- **ABC-096** (S, P3, DoR 8/10 ⚠️): show the named opening; depends on ABC-093's format carrying the name — check whether it now does.
- **ABC-101** (M, P2, DoR 7/10 ⚠️x3): difficulty selection, user-facing only. Re-check the EPIC-004 dependency and whether the owner's 2026-10-10 word ("levels 4 and 5 run as specified") changes it.
- **ABC-024** (S, P2, DoR 9/10): castling guards protected only by the opt-in deep lane; a NEW ⚠️ cites `src/moves.ts` md5 — re-measure; check today's default lane vs `PERFT_DEEP`.

## Fences (two BA/PM hops run in parallel, width 2)
Edit only the ticket pages of YOUR tickets (append-only dated `## Re-score — 2026-10-12` sections; criteria amendments dated, struck text kept visible briefly), your notes under `ref:`, and one trace row at the END of `plans/traceability.md`. Do not touch `plans/board.md`, `src/`, `tools/`, `AGENTS.md`, ADRs, the catalog, or the other hop's tickets. A ticket you would merge/split/drop: recommend it, do not delete files. Work in your OWN worktree (`git worktree add ../wt-bapm-rescore-backlog-product -b grugops/bapm-rescore-backlog-product main`); symlink `node_modules` into the WORKTREE root only if needed — never `ln -s` in the main checkout. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`. Never merge or push. Take NO timing readings (cite existing ones). `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/bapm-rescore-backlog-product`, then at the end FLAT files `.grugops/queue/done/bapm-rescore-backlog-product.md` and `.claim.md`, uncommitted; `rmdir` the claim dir.
Report, per ticket: old DoR → new DoR with the 10-item table, what changed and the readings behind it, the recommended column (Ready / stays Backlog / drop / merge), size and priority, and any EXACT owner question. Then a ranked list of what you recommend pulling first and why.
