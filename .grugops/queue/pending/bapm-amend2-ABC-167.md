---
subtask: bapm-amend2-ABC-167
role: ba-pm
ticket: ABC-167
page: plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
branch: grugops/bapm-amend2-ABC-167 (from main, current tip)
ref: .grugops/context/bapm-amend2-ABC-167/
---

# Rule the clock step on A5-b1 and A7-f3 (records only, small)

`ticket-to-pr-ABC-167-fix` stopped at tip `20a9fc5d` on `grugops/ABC-167`. Read its done file first:
`.grugops/queue/done/ticket-to-pr-ABC-167-fix.md`.

## The problem

Two amended rows run on clock step 1. The engine reads the clock once every 1024 nodes, so step 1 costs about G × 1024 nodes:
- **A5-b1** (G 600) costs about 600k nodes.
- **The bare-`go` half of A7-f3** (G 3000) costs about 3M nodes.

Both rows exceed vitest's 5 s per-test timeout. Other step-1 rows make the default lane heavier as well (NFR-008).

## What to do

1. For each amended A5, A6 and A7 row, choose the **coarsest step** that still rejects every wrong-build value the row targets.
   - The SE proposes step 10 for A5-b1. That gives a window of 600–620, which still rejects 100 and 1 100.
   - The SE proposes step 100 for A7-f3's bare `go`. That gives a window of 3 000–3 200.
   - Keep step 1 only where G is small, such as A5-c1.
   - For each row, state the step and the window, and list the wrong-build values it rejects.
2. Keep the bound **G ≤ time ≤ G + 2·step**. **Do not raise the timeout.**
3. Write the changes as dated lines on the page. DoR and size stay as they are.

## Fences

- Records only.
- Do **not** touch `src/`, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-167` or `../wt-ABC-146`.
- Never push, never merge.
- Work in `../wt-bapm-amend2-ABC-167`.

## When you are done

Write `.grugops/queue/done/bapm-amend2-ABC-167.md` and `.claim.md` in main's working tree, uncommitted. Include:
- the commit;
- a table with each row's step, window and the wrong-build values it rejects;
- a trace row.
