---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T17:02:06Z
subtask: secnfr-nfr008-1104
role: security-nfr
ref: .grugops/context/secnfr-nfr008-1104/
branch: new grugops/secnfr-nfr008-1104 from main — worktree .claude/worktrees/secnfr-nfr008-1104
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Timing reads ALONE with twin arms (ADR-0035 D1); record load1 and name the host gate in a PREREG first. ≤ 1 h of runs. Host paths only as placeholders.
---
# NFR-008 after ABC-271 + ABC-283: graded read, R-N8H-1 / Q-N8H-1, and a headroom recommendation
Main now carries ABC-271 and ABC-283 (merge 58e90d07). Readings so far:
- QE graded the bundle alone at 9.60 s (qe-ABC-283 …d15c2a10);
- SE read the merged tree at 9.77 s, quiet host, ungraded (se-ABC-283-merge …f7f63e1d).
Both R-N8H-1's (≥ 9.5 s → MEDIUM) and Q-N8H-1's (≥ 9.6 s) triggers fire (rulings …c7609f51 item 3, …2409cec9 item 3).
1. Seal a PREREG, then grade the default lane on main with twin arms. Report the median against 10 s, 9.5 s and 9.6 s.
2. Rule R-N8H-1's level and Q-N8H-1's action. Recommend the headroom work in ABC-281's form (named rows to existing deep lanes; ADR-0046 § Dated 2026-11-04, form S): which rows, about how many seconds, and what must stay in the default lane. W1 (ABC-282) and the second pull will add rows next, so size the target for that too.
3. Update plans/nfr-catalog.md's NFR-008 latest verdict line and the risk register entries.
Fences: plans/nfr-catalog.md, the risk lines, your records. No src, test, ticket, EPIC, ADR or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task secnfr-nfr008-1104, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result
by: security-nfr (claude-opus-5-5), 2026-11-04T17:23:42Z. **PASS_WITH_RISKS.** PREREG `…c7289371` sealed and committed (`2c5493d1`) before any timing.
- **`NFR-008` MET, graded:** `main` `fd6b595f` H median **9.84 s** [9.78, 10.00], max 10.05 s. Twin admissible (CPU +0.170 s = 0.51 %, sign 6/8, wall R 0.19 s), n 8, k 2, ALONE in one host-lock hold, load1 1.81–3.37, 0 foreign vitest.
  - **Against the lines:** 10 s MET, headroom 0.16 s (0.00 at the interval top; 2 of 16 H / H2 runs over 10 s); 9.5 s above (+0.34); 9.6 s above (+0.24).
  - B `ebd1263f` read 9.59 s (its tree graded 9.42 s before), so this window ran about 0.15 s slow. H−B +0.28 s, 8/8: ABC-271 and ABC-283 together.
- **`R-N8H-1`: LOW → MEDIUM** (owner Orchestrator; remedy Architect/Design). It goes to LOW at a graded median < 9.5 s, closes at ≤ 9.0 s, and goes to HIGH (the owner's) on a graded NOT MET.
- **`Q-N8H-1`: RIPE.** The Orchestrator puts it to the owner. Recommendation: (a), keep 10 s, with the ticket below. (b) is preferred over (c) if the median is back at ≥ 9.6 s after it lands, because (c) also moves `NFR-010`.
- **Headroom (ABC-281's form, form S):** one test-only ticket, about **−0.5 s**.
  - Part 1, seven rows to their own files' existing deep lanes (probe −0.26 s, 8/8): null-move A2 in-check (134 ms, SEARCH_DEEP), uci-session ABC-241 A5 (107, ENGINE_DEEP), futility "the rule changes the work" (90, SEARCH_DEEP), zobrist ABC-075 ep property (86, ZOBRIST_DEEP), engine ABC-170 A5 maxDepth 1000 (77, ENGINE_DEEP), levels A7 (71) and ABC-174 A3 (67, ENGINE_DEEP).
  - Part 2, two critical-path rows whose files have no deep gate, moved to existing lanes elsewhere (probe −0.30 s more; P2 −0.555 s, 8/8): `cli.test.ts` ABC-241 A4 (188 ms) and `engine.capacity.test.ts` ABC-122 A8 (115 ms).
  - The remnants are proposed in `…1184fec4`; the Architect confirms them with mutant reads.
  - **Expected: about 9.3 s after the ticket.** Cut W1 and the second pull with a ≤ +0.1 s default-lane budget each (no new file; any row ≥ 50 ms goes deep). Then about 9.4–9.55 s after both. Closing at ≤ 9.0 s is out of this form's reach.
  - What stays in the default lane: the zugzwang rows, the bundle rows, the door rows, the time-reading uci-session rows, the depth-1 slices, `cli.test.ts`'s children, and every remnant.
- **Other risks:** `R-N8H-2` LOW unchanged (5 210 note files, 290 to 5 500). `R-N8H-3` INFO unchanged. **`R-281-a` CLOSED** (`qe-ABC-283` 4/1/1/1 under the rule).
- **Records:** `plans/nfr-catalog.md`: one dated insertion in the `NFR-008` row and one `_Updated` line; the other 11 rows hash identical. Two lock holds, 8 min 46 s.
- **Notes:** `…c7289371` (PREREG), `…39f73707` (probe plan), `…4e87dae2` (graded readings), `…e2c442d3` (probe), `…1184fec4` (decision). Commits `272d1fcd` (claim), `2c5493d1` (PREREG), `688ce111` (notes), `c3b462a6` (catalog). No src, test, config, ticket, ADR or board edit.
