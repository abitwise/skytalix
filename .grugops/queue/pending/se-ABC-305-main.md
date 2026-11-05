---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T21:55:22Z
subtask: se-ABC-305-main
role: software-engineer
ref: .grugops/context/se-ABC-305/
branch: continue grugops/ABC-305 at 148c42e9 — worktree .claude/worktrees/se-ABC-305 (its last agent reported; it is yours)
width: main into ABC-305, gates, deep lanes, and a sealed PREREG for the N8-LANE re-read. Stop before the read.
---
# Take main into ABC-305 and get it ready to read
ABC-307 merged at bce24018. Read ABC-305's page (A5, § Open), your stop note, …9e878ba6, and …f5dc2987.
1. Merge main into the branch: a merge, never a rebase. dd88560f stays out of ancestry; prove it again. Zero production lines; prove it again.
2. Gates and deep lanes at the merged tip, every deep lane of a test file that arrives from main included (src/book.test.ts, src/cli.test.ts, tools/grugops/qe-hop-integrity.test.ts, src/uci-session.test.ts; spell them as AGENTS.md does, and read each count: "no tests" is a failure), then the page's tune and passer lanes. Use <scratch>/se305/gates.sh as far as it fits.
3. Rebuild the arms for the N8-LANE read on the new base, and seal a new PREREG committed before any poll: same harness, read 1's void stated, void line …b9038a14's (more than 2 of 8 flagged rounds), one re-read on a void, 15-minute slot clock. Run nothing timed.
4. STOP there and report. The read needs a window the owner holds; the Orchestrator asks for it, and a hop is dispatched on his word.
STOP and report anything the page does not cover. Check every output file is non-empty before reading it. Record foreign load; never touch it. Every test, build or engine run goes under the host lock named in your dispatch prompt. Leave nothing running; check with ps, not pgrep -f.
Fences: ABC-305's scope and your records. No ticket, ADR, EPIC or board edits. No push, force, amend or rebase, and no merge into main.
Publish: sealed notes (task se-ABC-305, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
