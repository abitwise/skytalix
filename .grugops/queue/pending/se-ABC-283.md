---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T13:00:54Z
subtask: se-ABC-283
role: software-engineer
ref: .grugops/context/se-ABC-283/
branch: new grugops/ABC-283 from main — worktree .claude/worktrees/se-ABC-283
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. No games (QE reads them after you). Host paths only as placeholders.
---
# Build ABC-283: the O1h + O3s + S1 bundle on one branch
Owner's word 2026-11-04 (orch-2026-10-30a …4c4cb03d; read it for the bars). BA/PM is writing the ABC-283 page in parallel; the bars in that note govern.
Build all three, each exactly as its ADR states:
- ADR-0063 (ABC-233): the history table, side × from × to, raised by d² with a d² malus, gravity bound, cleared per search, in both recursions.
- ADR-0065 (ABC-234): SEE orders the losing captures (below −50 cp) after the killers in the full-width search, ordering only, reusing src/see.ts from ABC-279. Quiescence unchanged.
- ADR-0066 (ABC-236): root aspiration windows in chooseMove from iteration 5, ±100 cp, widening only the failed side, doubling to full past 400 cp; mate scores keep the full window.
Each has its own test-only off-door per its ADR, plus one door that turns all three off. Every older door turns them off (ADR-0026 d10 pattern).
The probe scripts from the original designs are in .grugops/context/arch-ABC-233/raw, arch-ABC-234/raw and arch-ABC-236/raw.
Bars before handoff:
- P0: with all three off, chooseMove and search() node counts equal main's exactly on kiwipete and position-6.
- The ADR-0064 d7 safety rows: mate floor, zugzwang 7/7, G1 none newly missed.
- Typecheck and lint clean. The default npm test is all green and stays ≤ 10 s (NFR-008 is at 9.42 s): put new heavy rows in deep lanes.
- Snapshot changes, if any, listed in the PR.
- Report the bundle's node ratio on the original ADRs' probe positions (information, not a bar).
Fences: src/, tests, your records. No ticket, EPIC, ADR or board edits. No games. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-283, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
