---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T22:44:22Z
subtask: qe-ABC-291-where
role: qe-e2e
ref: .grugops/context/qe-ABC-291/
branch: continue grugops/qe-ABC-291 at 0c70fe84 — worktree .claude/worktrees/qe-ABC-291 (its last agent reported; it is yours)
width: read the existing NFR-008 run files. No lock needed, no test, build or engine run. It changes no state of the read.
---
# Where the +0.09 to +0.13 s lies
Read arch-ABC-291-n8's …64648b53 and …61a939d3 (on main). From <scratch>/qe291/out/a1/n8/runs alone, split B, H, H2's wall and CPU outside row bodies: collect, transform, import, setup, environment, per file. Answer: where does the wall the rows do not explain lie, is H's excess matched by H2, and is it a fixed cost of the new rows or test code, a per-term cost from the production change, or not resolvable from these files? State confidence; "not resolvable" is an answer. Say whether the Architect's +0.16 s real-cost figure and his 11 to 18 % stand. No verdict, no state change, no merge call.
Fences: your records only. No push, force, amend, rebase or merge into main.
Publish: sealed note (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.

## Result

_by qe-e2e (claude-opus-5-5, qe-ABC-291-where), branch `grugops/qe-ABC-291`. Reads only: no test, build or engine run, no lock, no verdict, no state change, no merge call. `NFR-008` stays as `…024bbd63` read it._

**The wall the rows do not explain lies in the gaps before each file's first row, +0.088 s of +0.133 s, and H2 matches H there. Fixed versus per-term is only partly resolvable.**

- **Split, ms of wall, H / H2 / both:** gaps +112 / +64 / +88, slots +60 / +26 / +43, outside vitest +1 / −5 / −2, lane end −6 / +6 / 0. Gaps by phase: import +45 / +14 / +29, no named phase +67 / +50 / +58. Transform, setup and environment 0. Per-file import is not in these files; the per-file gap is the nearest.
- **H2:** matches in gaps, median +150 and +143 worker ms. Not in slots, +137 and −33. `src/uci-session.test.ts` does have a twin: +71 and +72 by median, not separated from zero.
- **Fixed:** +0.02 to +0.03 s, high confidence it is not the bulk. **Tied to production:** +0.01 to +0.06 s, low confidence. **Not resolvable:** at least +0.05 s, se 0.024, in 42 files with no changed line.
- **+0.16 s:** stands as a median, high side. Carry about +0.13 to +0.165 s; the per-round mean is +0.133, se 0.056.
- **11 to 18 %:** the arithmetic stands, only with the centre taken as true. With its uncertainty, about 0.18 to 0.34. Still more likely a miss. No re-read proposed.
- **To resolve the last part a run is needed,** a second B arm and a per-file reporter. None was done. The Orchestrator's.
- **Note:** `…2f762abf`. Raw: `raw/out/where/`, scripts `raw/scripts/where/`.
