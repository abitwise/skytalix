---
subtask: se-lane-ABC-212
role: software-engineer
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/se-lane-ABC-212/
branch: new grugops/se-lane-ABC-212 from grugops/ABC-212-final (2079e0df), worktree ../wt-se-lane-ABC-212
width: 1 of 3 (only hop running; no real-clock timing)
---

# ABC-212 lane-cost fix (AR-212-LANE, required)

## Do
- Read `security-nfr-ABC-212/…550e067d` (why: `npm test` 10.34/10.81 s head vs 8.73/9.11 s base; bound 10 s) and Security's `…e2c5d6b9` §4 + `raw/n8-indicator.txt`.
- Under page `A12`'s budget-read arm (Amendment 2026-10-24 item 2), cut the cost of the 9 new `A9` rows in `src/uci-session.test.ts` (7 search at ~150 ms each) to a total ≤ 650 ms, keeping `A9`'s acceptance covered. Touch test rows this ticket added only; no production `src/` change. If `A9` cannot stay covered that way, or a pin outside `A13`'s list would move: STOP and name it (→ BA/PM).
- Show each changed row still reds under a plant of the bound it guards.
- Gates: lint, typecheck, build, `npm test` (report Duration, and per-file time for `src/uci-session.test.ts` at base `2079e0df` and head, paired, only when no foreign vitest runs — pause until clear). `UCI_DEEP` lane once.

## Fences
- Only your worktree and `<scratchpad>/se212lane/`. No production code edits. No ENGINE_DEEP or real-clock timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: no hostnames, IPs, or personal paths.

## Publish
- Commit on your branch. Seal notes (task se-lane-ABC-212). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
