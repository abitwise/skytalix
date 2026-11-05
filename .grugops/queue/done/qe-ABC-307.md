---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T14:13:18Z
subtask: qe-ABC-307
role: qe-e2e
ref: .grugops/context/qe-ABC-307/
branch: new grugops/qe-ABC-307 from grugops/ABC-307 at 797bb1a5 — worktree .claude/worktrees/qe-ABC-307
width: QE's rows on ABC-307's page, A7 to A9. Reads only: no src or test change lands.
---
# Verify ABC-307
Read ABC-307's page, se-ABC-307's notes …49e3755f, …dba5335f, …045800a8, Architect decision …727e0d0c, and the Orchestrator's decisions …db111535 and …ad217a34.
1. Seal a PREREG before any run. It fixes A7's list, the order-independent MC1 read at base and tip with its form, F3's three random-half plants, and A9's method. Its void rule: rounds flagged for foreign load void the read; one re-read is allowed on a void, in a new output directory; a second void stops the hop. A void is not a miss.
2. A7 and the rest first, then A9 graded last, ALONE in one lock hold. A5's sentinel repeated. A miss on MC1's new read is a STOP.
3. Report H − B and the lane figure, against the −0.215 s target and 9.6 s. Do not judge past the page's rule.
4. Verdict. UAT is waived or signed as the page says.
Check every output file is non-empty before reading it. Record foreign load; never touch it. A grade script's MET line on flagged rounds is void.
Every test, build or engine run goes under the host lock named in your dispatch prompt.
Fences: your records only. No src, test, ticket, ADR, EPIC or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-307, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result
by: qe-e2e (claude-opus-5-5), at: 2026-11-05T15:28:04Z. Branch `grugops/qe-ABC-307` from `grugops/ABC-307` `797bb1a5`. **STOPPED at A9: two voids. No verdict.** Not a FAIL: nothing missed. Nothing of mine left running.
- **PREREG:** `…e4ce81fb`, sealed and committed (`63b3c728`) before any run.
- **A7, no STOP.** New MC1 (a parity salt, read as `MC1p0` and `MC1p1`, its two orders): base lane killed 10 and 8, tip lane killed 10 and 8 with C1's remnant among them, C1's deep line 1 failed, each row alone 1 failed. The twenty: all killed, every count equal to the Architect's, every remnant and holder there. C1 (d) reads on M6: 1 failed. `ABC-241` A7's eight hold. Plants: every base kill held at the tip; memos 0 default, red at head by base's names; re-anchored `q4b` as the page says. A5R base 3, tip 0. `F2` 0, 0, 1 each, the red is `F1`. `F3` 0 missing; random-half 15 draws a side, `F1` red 15 of 15. `F4` 2 deep, 0 unset.
- **A1–A5, A8 hold.** Four test files, waiver `grep` empty. 2 709 / 2 709 in 71 files at base and tip, 9 out, 9 in. Deep 265 → 270, 32 → 36, 35 → 36 passed. 22 lines 4 and 1 × 21. Typecheck, lint, build green; skip 0; `test-skip-integrity` and `lane-inventory` No findings.
- **A9: VOID twice.** Read 1 (15:17Z): rounds 2, 3 and 4 flagged, foreign vitest seen. Read 2 (15:21Z): round 3 flagged, B's run on CPU alone, 9.70 s against 8.90 s, 0 foreign vitest in 84 samples. `n8-grade.py` was not run on either. **H − B and the lane figure are unread.** Read 2 is void only under the PREREG's "any flagged round"; `…b9038a14` allows 2 of 8. That ruling is the Orchestrator's.
- **UAT:** the waiver's condition holds; no verdict signs it. ABC-307 stays In Review.
- **Gaps and process facts:** `…43927eb6`. `qe-hop-integrity.js --ticket ABC-307` will read covered off the PREREG: that is not a verdict.
- **Notes:** `…e4ce81fb` (PREREG), `…19f6c80a` (A7), `…d356030c` (A1–A5, A8), `…46d3b23c` (read 1), `…43927eb6` (stop).
- **Next:** the Orchestrator rules read 2's line or finds a held window. Security/NFR's A10 waits on a graded read.
