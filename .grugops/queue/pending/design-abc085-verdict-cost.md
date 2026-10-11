---
task: wave-2026-09-25
subtask: design-abc085-verdict-cost
role: architect-design
ticket: plans/tickets/ABC-085-self-play-ladder.md
ref: .grugops/context/design-abc085-verdict-cost/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
hold: dispatch AFTER ABC-144 quiet Window A
---

# Subtask: rule on the ABC-085 verdict run's cost. ADR-0038 estimated ~10 h; the Engineer projects ~44 h.

The Engineer's note `…70684a78` (`.grugops/context/ticket-to-pr-ABC-085/notes/`) measures the engine at about 4.3x slower per node inside vitest
than under plain node, with the same node count either way. A fixed search takes about 785 ms under node and about 3.4 s under vitest, with either pool.
Rule on the options:
- accept about 44 h;
- run the pairs as parallel processes (this collides with ABC-144 / ADR-0040);
- run the same harness outside vitest (this changes ADR-0038 d5);
- anything else.

Also say whether the 4.3x runner overhead matters to ABC-144, whose bar is lane CPU.
Use recorded readings only. Write any ADR change as PROPOSED. Never merge or push. Do not touch `src/` or `plans/board.md`.

## Added 2026-10-11 after Window A
Window A (`grugops/secnfr-ABC-144-window-a` `94cf1728`, decision note `…b66453e7`) applied ADR-0040 d2, and **the rule picks K3, not K4**:
- K4 cuts CPU by −10.66 % and is not eligible;
- K3 cuts by −16.48 % with wall 7.37 s and is eligible;
- K2 cuts by −22.71 % with wall 8.38 s and is eligible.

Write the ADR-0040 addendum, still PROPOSED: "Why 4" becomes 3, the pin becomes `toBe(3)` / `≤ 3`, and record the missing heat field (`CPU_Speed_Limit` is absent on the M3; thermalpressurelevel went to 1 for the last ~9 runs). Then say whether the 4.3x vitest overhead changes any of this.
