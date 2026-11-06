Cause: engineer

# se-ABC-289 STOP: on an exact build two DP2 bars are red on the joint tree. Drift reads 34 cp against none beyond 30, and `G1` reads 53 / 58 with one newly missed. Five default-lane and 16 deep W1 rows need a ruling. Nothing was moved

Code `41525692`, re-point `dfd63769`, on `grugops/ABC-289` from `main` `063ca870`. No bar, pin, margin or form moved. No game, no C2′, no graded timing.

**Red 1, `ADR-0074` F1, DP2 drift.** Depth 5 on the 190, head against the new door. `search()` and `chooseMove` each read 99.47 % within 25 cp (bar ≥ 98 %, met) and **max 34 cp (bar: none beyond 30)**, 0 mate sign changes. One row is over: `kiwipete/a2a4`, 290 → 324, in both recursions.

**Red 2, F7, DP2 `G1`.** **53 / 58 (bar ≥ 54), NEWLY MISSED: "mate in 3, seed 1632".** Door 54 / 58, none new. The head completes depth 5 at the row's 25 ms and plays `e7e3`, 29 993, a mate two plies longer. The door plays `e7e2`, 29 995. The head finds `e7e2` from depth 6. It is the row D300 missed.

**It is not a defect: the build is exact.** F1 says a defect first. On a scratch copy of the tip with `moveCount` and `countermove` off in `search()`, `chooseMove` and the two new doors, every `ADR-0074` figure reproduces: d8 333 296 / 193 534, 458 740 / 83 175; ratios 0.6362 / 0.8263, 0.6484 / 0.8201; door 523 847 / 234 214, 707 548 / 101 425; reach 6.868 → 7.147, 54 deeper, 2 shallower, 8 moves; drift 100 %, 12 / 100 %, 20; floor 0 / 191, 0 / 189; `G1` 54 / 58, none new. The rule is D200b. Both reds come from the rule with bundle 1's tree under it, which § Consequences calls unread (`UNKNOWN - verify`, "F1 or F2 governs"). Eight planted faults each red a DP1 row, F9 among them.

**So by F1's letter this reads NOT MET on an exact build, and F4 of the page says "if real, NOT MET".** I do not rule that: it is yours or the Architect's. I did not change the rule. Not to be retried without a ruling: any margin, exemption or guard.

**A lead, not a form on offer.** On scratch only, the rule held off at alpha ≥ 20 000 reads `G1` 54 / 58, none new, and drift unchanged at 34 cp. So the `G1` red looks like decision 5's "no mate-band guard"; the drift red does not. A guard was not pre-registered, and F1 is not touched by it.

**W1's rows: the page does not cover them, so none is moved.** `ADR-0074` and the page owe b only. `…0f8a4f82` is ruled for bundle 1 and says not to pick another budget. On the door each reads its pinned figure, so these are the tree, not wiring (`raw/out/w1.jsonl`).

| row | pinned | shipped reads |
|---|---|---|
| `src/engine.test.ts` A1 (a) | base depth 3 at H = 5 | base completes depth 4. H = 3: 2 / 2. H = 4: 2 / 3, 727 / 1 155. H = 5, 6: 3 / 4. **No budget gives d = 3 with an aborted base**, so it needs a form, as `…0f8a4f82` § 2 found |
| A2 (a) | kept `a1f6`, 475 | `f2e3`, 463, partial, 3 125 nodes; incumbent `a1e5`, 484 unchanged |
| A2 (b) | depth 2 | depth 3 on both, nodes 2 115 / 2 136, so head no longer equals base: needs a re-scan (`ADR-0071` D9) |
| D12 fail high | incumbent `f2c2`, −141; kept `f2f3`, 50 | −167; kept `f2f3`, −66 |
| `src/uci-session.test.ts` D5 | cp 475, `a1f6` | cp 463, `f2e3` |

Deep: A0-1 six, A0-2 four, A0-3 six. Door halves not separately read in the lane, since each row stopped at its first red; S1 12 / 12 covers the door on a frozen clock. New figures in `raw/out/p1p2-head.jsonl` and `a0-3-head.jsonl`. **A0-2's "stops at the same node" no longer holds in form:** kiwipete 200 reads depth 7, 198 604 against depth 6, 199 960; position-6 200 reads depth 9, 195 650 against 8, 196 681. `…0f8a4f82` § 3's weak point on "identity" applies to A0-3 too.

**Needed:** (1) a ruling on the two DP2 reds, F1 and F7; (2) only if the ticket goes on, the form of these 21 rows.
