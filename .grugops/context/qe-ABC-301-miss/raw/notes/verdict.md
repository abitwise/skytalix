# qe-ABC-301-miss verdict: F4 reads NOT MET. zugzwang.001 plays e1e5 at depth 9 on dd88560f, the red is real, and no defect is found

QE, task qe-ABC-301-miss, on grugops/qe-ABC-301-miss from grugops/ABC-301 d5041c54. Every test, build and engine run below went under the host lock, on QE's own clean clones. Raw under this task's raw/.

**Verdict: NOT MET,** by ADR-0067 F4 and ABC-301 § What happens on a miss. The defect check came first and is clean on both named parts, the identity gate on the emitted file and B-T3. B-T5's safety row is red and the miss is real. Never a re-pin, a deeper depth or a refit on play. So the emission does not reach main, and nothing here argues for a deeper row. This confirms the engineer's reading (…04dc7cd4) and the Orchestrator's expectation (…aa971f0b) on runs of QE's own.

**The red, four ways, against the base on the same harness:**

| read | dd88560f | b297ab89 |
|---|---|---|
| the row, src/search.null-move.test.ts | red: expected 'e1e5' to be 'e1f1' | green |
| QE's driver, own process per read, three reads | e1e5, -434, 70 212 nodes, depth 9, each time | e1f1, -392, 62 290 nodes, each time |
| UCI `go depth 9` from src/ | bestmove e1e5, -434, 70 212 | bestmove e1f1, -392, 62 290 |
| UCI from a fresh dist/ | bestmove e1e5, -434, 70 212 | bestmove e1f1, -392, 62 290 |

The figures equal the engineer's table at depth 9. Depth 9 was the only depth QE read.

**Could the red come from something else? Each cause, read:**

- **The tool.** fit.json's table equals the emitted file by QE's own comparator, not tableOf: 0 mismatches over both halves and the mobility pair. All 60 held leaves are unmoved (material, phase, cap, queen-on eg, E4a mg, E4a R 0 and 7, U). All 45 free non-PST leaves are ≥ 0. All values are integers, and all 384 PST pairs are tied. The same 20 exports, the same 877 leaves. TUNE_DEEP 25 of 25 at b297ab89, where tools/ equals e763119c.
- **The tracer.** The identity gate on the emitted file: 1 532 990 gated, 0 misses, worst 0.9583 cp, baseTableSha256 8ca6744f, so it read the emitted table. The counts equal the engineer's. That gate is not vacuous on this table: a scratch plant in passerTerms (enemy distance capped at 4) stopped the tool's gate at once. At the base's zero weights such a fault cannot show, by reading; QE did not run that. On the row's own tree, every position to ply 4 from the root (43 152, every one with a live E4a part): 0 gate misses, 0 carried-phase misses, 0 memo misses, 0 mirror misses. The plant reads 425 gate misses there.
- **The emitter.** B-T3, re-run by QE from a clean clone at b297ab89: extract, fit, emit. src/evaluate-params.ts is byte-identical to dd88560f's (sha256 8ca6744f…), and fit.json is identical to the engineer's. This re-ran the pipeline for F4's check. It is not a refit, and no value came of it.
- **A stale build.** The clones held no dist/. The row and the driver read src/ directly, and evaluate-params.ts is read once at load. A fresh tsc build plays the same move in the same nodes.
- **A wrong tree.** The clone is dd88560f, clean, sha 8ca6744f. src/ differs from b297ab89 in src/evaluate-params.ts alone, and tools/ equals e763119c. Non-test src/ at b297ab89 equals main's, so the base is the PREREG's. The row's text is the same on main and dd88560f. The same harness on b297ab89 plays e1f1, so the harness tells the two apart.

**One point could have turned this into F3's defect path, so QE ruled on it.** F3 says a relation red on the emitted set is a defect and the procedure re-runs, which would make dd88560f not final. QE read all 115 default-lane reds by message, re-ran the 26 relation rows (0 red, the same reads as the engineer's), and finds no relation red:
- Row 10's test row is red on `evaluateWithoutMobility(MOBILE_WHITE)` = -4. The PREREG asked QE to check that this is a premise. **Confirmed.** The test's own comment calls it "The premise, measured", the relation reads +89 > 0, and an equality with a margin on both sides has no feasible bound, so no tool fix could reach it. It is a lost fixture property under B-T4.
- Rows 21-26 stop on the door literal mainCentreMinusCorner, which ADR-0064's dated line names a pin.
- B1 (a)'s -0 row, which the engineer left open: **a lost fixture property.** M-negzero-a's door reads -38 and b's -7 on the emission, where the fixture was built to read 0. Both mirrors hold exactly.
- The rest are pins, a retired row, or a fixture property. The one red safety row is zugzwang.001. A9's red row is a test-fixture assumption, not a range miss; see the results note.

**Not settled, and not looked for:** why E4a's values leave e1e5 ahead at depth 9 stays **UNKNOWN - verify**. No attribution was run, by the brief. B-T6 to B-T8 were not read. No depth, form or value that passes was sought.
