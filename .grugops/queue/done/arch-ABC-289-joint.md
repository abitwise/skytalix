---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T19:05:19Z
subtask: arch-ABC-289-joint
role: architect-design
ref: .grugops/context/arch-ABC-289-joint/
branch: new grugops/arch-ABC-289-joint from main — worktree .claude/worktrees/arch-ABC-289-joint
width: read F1 and F7 of ADR-0074 on the joint tree and say what follows. ADR and records only.
---
# ABC-289 on the joint tree
se-ABC-289 stopped on an exact build (branch grugops/ABC-289 at b42706b3, worktree .claude/worktrees/se-ABC-289; notes …0e380b06, …4ad7c049, …8b80f592). With P4 and the countermove in, DP2 is red twice: drift max 34 cp against 30 (one row, kiwipete/a2a4 290 to 324; 99.47 % within 25 cp, met); G1 53 of 58 against 54 ("mate in 3, seed 1632" newly missed). With moveCount and countermove off, every ADR-0074 figure reproduces, so this is the tree and not a defect. 21 W1 rows are also red with no ruling.
Answer:
1. How F1 and F7 read on this build, by the ADR's letter. Is it NOT MET with the premise failed, or did the ADR's bars presume the old tree, and where does it say so? Quote the lines. Read Pins vs bars (…42c82347): zugzwang, mate floor, G1, identity and relation rows are never re-pinned; a row retires only with an Architect line.
2. The routes that remain, and for each what it moves. No bar is loosened because a red was seen: a route that changes a bar, or the owner's accepted form, goes to him and you say so plainly. The SE's alpha ≥ 20 000 lead is a lead: if a mate-band guard is a route, it is a new form, it clears G1 only on one scratch read, and it leaves drift at 34.
3. Your recommendation, in plain words, with cost: what ABC-289 is estimated to be worth now, and whether it is worth another form.
4. Whether ABC-291 may build now on main without waiting on ABC-289's outcome, and what its page needs.
5. The 21 rows: only if a route goes on, their form; otherwise nothing.
You may run read-only scratch reads under the host lock named in your dispatch prompt, on copies, no games. Do not change the branch.
Dated insertions in ADR-0074 only, if any. Fences: ADRs and your records. No ticket, EPIC, board, src or test edits. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

_by architect-design (claude-opus-5-5, arch-ABC-289-joint), 2026-11-06T19:22:40Z, branch `grugops/arch-ABC-289-joint` from `main` `3ff03a9d`. Dated insertions in `ADR-0074` only, and records. Scratch reads on copies of `b42706b3` under the host lock, no game, no timing. No `src/`, test, ticket, EPIC or board edit. `grugops/ABC-289` not changed. Nothing pushed, nothing merged into main, nothing left running._

1. **F1 and F7:** NOT MET on an exact build. F1 by its own words. F7 by `ADR-0034` d1 and d2 and its table, class B, which no agent can clear while F1's drift row is red, then `ABC-289` F4. The bars did not presume the old tree: `ADR-0074` § Consequences and d12, and `ADR-0056` D5 ("If one trips, `ADR-0074` F1 governs and no bar moves"). The premise's pay stands: d8 0.6084 to 0.8215, reach +0.389.
2. **Routes:** close (moves nothing); override on this build (d11's drift bar and `G1`, the owner's, a safety override); D200b + mate-band guard (his form; clears `G1` on one scratch read, leaves drift at 34, so no route alone); another new form (his form, unread on purpose; the PREREG's bar rule would turn 30 into 51 at 34, so he must be told); P4 out, Q2 in (`ADR-0072`, the only route read to clear both, on scratch). Re-reading D200b on a later tree is not a route.
3. **Recommendation:** close. Worth stays the estimated +5–20 Elo, with less confidence. Not worth another form now: about six hops and an owner-held quiet window for a read that a real gain would fail a quarter to nearly half the time.
4. **`ABC-291`:** may build now on `main`, whatever the outcome. Its C2′ waits only for `ABC-289`'s outcome to be recorded. The page needs six dated lines, `…7c297147` § 4.
5. **The 21 rows:** nothing on close. On any route they come back here on that build.

- **New from these reads:** with `moveCount` off both reds clear; with `countermove` off both stay. Row 1632 is missed at +25 % at equal depth. Drift is wider than the one row at d5 suggests: d6 106 and 103 cp, d7 58 and 110 cp, reports only. On `main` the door misses row 1632 at 0.8× readings, so the row has lost `ADR-0034` d5's margin.
- **Owner:** one question, OQ-0074-2, drafted in `…7c297147` § 7. It blocks nothing.
- **Notes:** `…7c297147` (decision), `…d61479af` (observation).
