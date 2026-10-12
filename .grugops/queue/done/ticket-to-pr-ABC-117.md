---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-117
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-117-that-exit-one-is-an-unhandled-exception-not-the-usage-code.md
ref: .grugops/context/ticket-to-pr-ABC-117/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-117-exit-one-correction
base: main @ 61aef6e6
---

# Subtask: deliver `ABC-117`. Correct the seven CLAIM-B sites that say a failed non-`EPIPE` stdout write exits `1` = `USAGE_EXIT_CODE`.

XS, P2, DoR 10/10. Documentation-only: 0 production lines. The ticket page is the contract, and its CLAIM-A / CLAIM-B split is the trap (`A5`): editing any CLAIM-A site is a FAIL. **`ABC-115` is now `Done`** (owner-signed). The page says nothing changes if it closed first: S7 is still an APPEND-ONLY correction to its `## RESIDUAL` block, never a re-opening, and your wording must not describe `ABC-115` as re-scored, moved or re-opened. Sites were located at `fcf12c1`; re-locate every one BY CONTENT at today's main, and record any that moved. `A1`: run the delivered build with a read-only fd as stdout AND the eleven-line out-of-product reproduction yourself; every corrected sentence is written from your readings. Notes are NEVER edited: S1/S2 get a `decision` note that supersedes `…-8a4b2e69` and carries all four parts of `A2` (iii verbatim); S3–S5 get one `observation` note with empty `supersedes`. S8 is comment lines only in `src/cli.test.ts`; another hop (`ABC-148`) edits a DIFFERENT paragraph of that file in parallel. `A6`: the NFR-row hash on the page was taken at `fcf12c1` and may have moved since; record the hash at base AND head and grade on base == head, writing any drift from the page value down. `A7`: re-measure the `--dir src` counts at pull time; `T2` does not fire, say why.

## Fences
Never merge or push. Do not touch `plans/board.md` except the ONE append-only S6 correction the ticket names (added lines only, zero deletions, next to the clause it corrects). Work in your OWN worktree (`git worktree add ../wt-ticket-to-pr-ABC-117 -b grugops/ABC-117-exit-one-correction main`), with `node_modules` symlinked in only. Never use `git update-ref` on another hop's branch, never `--force`, `-D` or `reset --hard`. End each commit with a `Co-Authored-By:` trailer naming the model you actually are. In this shell `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, with `.test-results/last-run.json` success:true. Two other SE hops run in parallel (width 3): take NO timing readings, and grade nothing on wall/CPU. Publish typed notes per Workflow 16 under `ref:`, add a trace row at the END of `plans/traceability.md`, fill § Delivery on the ticket page. Move the queue file pending → claimed (`mkdir .grugops/queue/claimed/ticket-to-pr-ABC-117`) → done by hand; leave the done file uncommitted. Report: branch tip, gate results, each criterion PASS/FAIL with its reading, the UAT-waiver reading (`git diff --name-only main...HEAD | grep -v "\.test\.ts$" | grep "^src/"`), and the board move you recommend.
