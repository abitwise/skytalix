---
task: wave-2026-09-25
subtask: bapm-rescore-ABC-096
role: ba-pm
ticket: plans/tickets/ABC-096-show-the-named-opening-when-the-book-knows-it.md
ref: .grugops/context/bapm-rescore-ABC-096/
enqueued_by: orchestrator
enqueued_at: 2026-10-17T00:00:00Z
branch: grugops/bapm-rescore-ABC-096 (cut from main 8ed9ba2b)
---

# Subtask: re-score ABC-096 against ADR-0043. You are the only hop running.

The Architect ruled DoR item 10 (`memory-bank/50-decisions/ADR-0043-…`, note `.grugops/context/design-ABC-096/notes/…27c10876.md`), and the
Orchestrator decided the two product calls under the owner's delegation (`.grugops/context/wave-2026-09-25/notes/…abc096-product-calls-…`).
Amend the page so an engineer can build it with no interpretation:
- item 10 discharged; size S holds (ADR-0043: `RenderSeam`'s type and `src/turn-loop.ts` unchanged);
- the seam (`makeRenderSeam(mode, orientation, book)` with `Pick<BookProbe,"openingName">`), the rejection-line-wins rule, the family cut
  and digit-free ellipsis width, names on empty-move entries, A5 = the current position's own name or nothing;
- NFR-007 is now touched (book parse before frame 0, ~6.4–6.9 ms measured by the Architect; Security/NFR measures it on the build);
- the frame-path guard in `src/history-pane.nfr.test.ts` runs a real `createBookProbe`;
- UAT observations for the owner: the name flicker (accepted) and the missing-book warning overdrawn by frame 0 (accepted, stderr still once);
- the files a build may touch (ADR-0043's list) as the code fence.
Re-score DoR. Amend only the ABC-096 page and append one trace row. Commit in your own worktree
(`git worktree add /Users/olgeroeselg/Projects/hacks/grugops-examples/wt-bapm-ABC-096 -b grugops/bapm-rescore-ABC-096 8ed9ba2b`). Never merge, push,
--force, --amend or rebase. Owner specifics are delegated to the Orchestrator: give a recommendation, do not stop on them.
Finish with `.grugops/queue/done/bapm-rescore-ABC-096.md` and its `.claim.md`, uncommitted on main.

## Done — 2026-10-17, BA/PM

- Branch `grugops/bapm-rescore-ABC-096`, tip `ec857b81` (from `8ed9ba2b`), worktree
  `/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-bapm-ABC-096`. Not merged, not pushed. 0 `src/` lines.
  It merges cleanly with `main` `2354ed43` (`git merge-tree`).
- **DoR 10/10. `S` and `P3` hold.** Item 10 is discharged by `ADR-0043`.
- Criteria: `A1`, `A2`, `A4`, `A5`, `A6` and `A8` amended; `A9` and `A10` added.
- Page sections: § Build contract (code fence) and § UAT observations (3).
- `NFR-007` touched: first call ≤ 30 ms cold.
- One trace row.
- Notes: `.grugops/context/bapm-rescore-ABC-096/notes/` (observation `…5c2e91b4`, decision `…e83a07d6`).
- **NEW:** `ADR-0043` D3 counts the cut in code points, but `packRegion` measures code units.
  - In unicode mode, 21 astral code points print a false `(+1 more)`.
  - The page counts the cut in code units.
  - An Architect acknowledgement is recommended, not blocking.
- Recommended: `In Design` → `Ready for Dev`, after the `Ready for Dev`-exit re-read.
