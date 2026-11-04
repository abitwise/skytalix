---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T13:40:34Z
subtask: se-ABC-271
role: software-engineer
ref: .grugops/context/se-ABC-271/
branch: new grugops/ABC-271 from main — worktree .claude/worktrees/se-ABC-271
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. No games. Host paths only as placeholders.
---
# Build ABC-271: E4a structure only at 0 (ADR-0070 ACCEPTED, form (a))
Read plans/tickets/ABC-271*.md (K0–K4, F1–F5, test notes), ADR-0070, the rulings …730399e5 and …6ccd8243, and QE's freeze: .grugops/context/qe-ABC-271-freeze/ (PREREG …67b5eeac, gaps …a8173b00, raw/fixtures.json sha256 bf3c205b…887a).
Build the three terms (king distance own/enemy, free path, unstoppable passer) as ADR-0070 states them:
- at value 0, computed outside the pawn memo (memo 576 KiB);
- no new switch or door pair; every existing door reads its pre-ticket counts;
- passerTermsForTest stays, used from test files only.
Copy the frozen K1 (a)/(c) rows from fixtures.json unchanged; you may not change them. QE-271-a: expose the seam per side (U not netted between sides), so QE grades per side.
Bars: the ones below plus F1–F5 from the page.
- K0: the seven exact node counts.
- K1: the mirror, Object.is equality with main's evaluate on the corpus, the seam rows, and the memo words.
- K2: exactly the two memo-size re-pins (458 752 → 589 824), listed in the PR.
- K3: G2 ≤ 1.05×.
- K4: G6 ≥ base.
- Typecheck and lint clean; the default npm test all green and ≤ 10 s (NFR-008); heavy rows in deep lanes.
Note: ABC-283 is being built in parallel on grugops/ABC-283 (search and ordering files). Stay out of the deepening loop and move ordering.
Fences: src/, tests, your records. No ticket, EPIC, ADR or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-271, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
