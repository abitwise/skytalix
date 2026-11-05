---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T11:49:20Z
subtask: arch-ABC-303-w1-rows
role: architect-design
ref: .grugops/context/arch-ABC-303-w1-rows/
branch: new grugops/arch-ABC-303-w1-rows from main — worktree .claude/worktrees/arch-ABC-303-w1-rows
width: records only; nothing run. No test, build or engine.
---
# Which form do ABC-282's 19 rows take with the bundle on?
Read grugops/ABC-303 at 2fd5243b: se-ABC-303-main's notes …1893d3c5, …bd60978c, …c31e9a54, …42aa51f1 and raw/out/failed-rows.txt. Read ADR-0071 (D7, D12), ADR-0072 d7 and d11, ABC-303's test note 4, and the Orchestrator's pins-versus-bars ruling …42c82347.
The STOP: A1 (a), A2 (a) and D5 in the default lane; A0-1, A0-2, A0-3 (16 rows) in deep lanes. They pin W1 on the shipped path and read differently with the bundle on. A scratch diagnosis on the off door reads the pinned figures. The doors take no softMs.
1. Rule each row, or each group: a pin re-pinned old → new and listed, or a row that needs a new position or form because the bundle's new figures no longer exercise what the row tests. For each, name what the row proves and show it still proves that with the new figure. A2 (a) and D5 need this most: a kept partial-iteration move must still be that case.
2. Say whether any row is a bar, or an identity or relation row, which is never re-pinned.
3. Say whether a production change or a door is needed. If one is, say so plainly and stop there: that changes the read's form.
4. Give the engineer one exact list. Reason from code and records; mark what needs a run as `UNKNOWN - verify`. Say if any of this is an owner call.
Fences: memory-bank/50-decisions and your records only. No ticket, EPIC, board, src or tool edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-303-w1-rows, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

**2026-11-05, Architect/Design. Items 1–4 done. Records only, on `grugops/arch-ABC-303-w1-rows` from `main` `a21136b0`. No test, build, engine, vitest, tsc or lint run. Nothing pushed or merged, no ticket, EPIC, board, `src/` or tool edit, nothing left running. `main` moved from `885c09c5` to `a21136b0` after the brief; `src/`, `tools/` and the ADRs did not.**

- **1, the rows (`…0f8a4f82` § 2):** A1 (a) takes a new form, budget 6 → 5, because at 6 the shipped base completes depth 4 and aborts nothing, so a re-pin of `base.depth` would go green and false. A2 (a) and D5 are pins, `a1b1`, 450 → `a1f6`, 475, and still that case: aborted at 3 125 of N(3) = 3 506, and the frozen depth-3 line reads `a1f6`, 475 over the incumbent. A0-1 and A0-2 split: the base's figures unmoved on the all-off door, the shipped side pinned beside them. A0-3 pins `cp` on five rows and the `go depth 6` line.
- **2, bars (`…0f8a4f82` § 3):** no row of the 19 is a bar. A0 is an identity row by title; no figure carrying its identity moves. No relation moves and no row retires. F1 and F2 do not fire. The reading of "identity" for A0-3's `cp` is a stated judgement, the Orchestrator's to overrule.
- **3, production and doors (`…0f8a4f82` § 4):** none. No door is handed `softMs`. The read's form does not change.
- **4, the list (`…0f8a4f82` § 5):** E1–E4, U1, U2, with figures, titles, what stays, the lanes and the STOP rule. Not an owner call. `UNKNOWN - verify` items are § 7.
- **Dated lines:** `ADR-0071` D8, D9 (two), D12 item 4 and the log; `ADR-0072` d7, d11 and the log. No decision moved. Readings: `…c66a3f5c`.
- **One correction to `…0f8a4f82`, found after sealing:** § 5's "about 1.9 M nodes" for the door halves is 1.81 M (1 326 677 + 488 130), about 3.6 s at `ADR-0071`'s rate. It changes nothing.
- **Confirmed after sealing:** A0-1's six door figures are read equal in `se-ABC-303-main` `raw/out/s1.jsonl`, so § 7's door item stands for A0-2 alone.
- **Owed:** BA/PM, one dated line on `ABC-303` test note 4. Orchestrator, the follow-on engineer brief carrying § 5.
- **Path check:** `node tools/grugops/records-path-check.js --base main` exited 0 before the last commit.
