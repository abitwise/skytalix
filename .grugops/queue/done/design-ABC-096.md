---
task: wave-2026-09-25
subtask: design-ABC-096
role: architect
ticket: plans/tickets/ABC-096-show-the-named-opening-when-the-book-knows-it.md
ref: .grugops/context/design-ABC-096/
enqueued_by: orchestrator
enqueued_at: 2026-10-17T00:00:00Z
branch: grugops/design-ABC-096 (cut from main 31e8d38e)
---

# Subtask: rule on ABC-096's open DoR item 10. Width 3: an SE hop on ABC-156 runs beside you (it touches only plans/metrics.md).

Answer the page's exact question (§ re-score 2026-10-12, "Exact question to Architect/Design"):
1. Does the opening name reach the frame through the render seam (an injected name lookup on the frame path, under ADR-0029), or as an item
   the turn loop or the composition root passes in?
2. When a rejection line and the name both want the message region, which wins? (BA/PM's product answer: the rejection line.)
Read ADR-0009 (row identity), ADR-0029, ADR-0037 D1(d), `src/render-seam.ts`, `src/frame.ts`, `src/turn-loop.ts`, the book probe from ABC-095
(`src/book-engine.ts`, `src/book-file.ts`), and the NFR-002 section of `plans/nfr-catalog.md`. State the seam, the types that change, the
files a build would touch, whether `RenderSeam`'s type or `src/turn-loop.ts` changes (the page's re-size trigger), and the per-frame cost.
Write an ADR or ADR addendum if the ruling needs one, plus a decision note. Do not edit `src/`, `plans/board.md`, `AGENTS.md`, or the ticket
page (BA/PM re-scores it). Do NOT touch `plans/traceability.md` beyond appending one row. Commit on the branch, in your own worktree
(`git worktree add /Users/olgeroeselg/Projects/hacks/grugops-examples/wt-design-ABC-096 -b grugops/design-ABC-096 31e8d38e`). Never merge, push,
--force, --amend or rebase. If a question is the owner's, STOP with the exact question.
Finish with `.grugops/queue/done/design-ABC-096.md` and its `.claim.md`, uncommitted on main.

## Done — 2026-10-17, Architect/Design

- Branch `grugops/design-ABC-096`, tip `fe7e7ab1` (from `31e8d38e`). Not merged, not pushed.
- `ADR-0043` accepted under the owner's delegation (`3e0fd998`). Decision note `…27c10876`, observation `…7d7f6de3`.
- **Q1:** through the render seam, `makeRenderSeam(mode, orientation, book)`, where `book` is `Pick<BookProbe, "openingName">`, required.
- **Q2:** the rejection line wins. The name shows only when `messages` is empty.
- **Re-size trigger does NOT fire.** `S` holds.
- One trace row and one NFR-002 note were added. 0 `src/` lines.
