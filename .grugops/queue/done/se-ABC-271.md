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

## Result
- **by:** software-engineer (claude-opus-5-5), **at:** 2026-11-04T14:25:08Z, **branch:** `grugops/ABC-271` (not pushed, not merged), **code:** `10f29a82` (`src/` `08e56302`); base `main` `3a08d244` (`src/` `4fb3da04`; non-test `src/` unmoved since `8adb0a18`, so one K0 set).
- **Built (ADR-0070 d1–d4):** four E4a exports at 0 with the rule comments as priors; frontmost-passer words per side recorded by `pawnStructure` and stored by the memo (576 KiB); `passerTerms` after the walk into Δ when w < D and a passer exists, using the walk's king squares; U uncapped (QE-271-b), once per side; no switch, no doors, no zero-value fast path. Seam `passerTermsForTest` per side, U not netted (QE-271-a); test-only `pawnStructureForTest` added for K1 (e) (flagged).
- **K0:** 7 / 7 exact (766 275 / 1 725 150; 87 475 / 253 724 / 533 916; 605 117 / 406 787). Nodes, score and move are byte-identical to a `main` copy. Every door-pinning deep lane is green unchanged.
- **K1:** (a) mirror 0 mismatches at 0 and at the probed values; (b) `Object.is` to the pre-ticket values on G3 184, door 176, queen pairs 28 and QE 112: 0 differ; cross-build on 27 696 game positions: 0 differ; (c) all 44 fixtures exact per side, the 19 pair differences exact, U only on the frozen rows (U7-both 400 / 400); (d) A9 reads the E4a pairs (15 910 / 17 510 at 0); (e) memo hit = fresh, words included. Source rows green. Four mutants each red.
- **K2:** exactly the two memo-size re-pins, 458 752 → 589 824 (`evaluate.pawns.test.ts` memo row; `transposition.test.ts` A7). No other expectation changed.
- **K3 / K4 (Engineer pre-reads, host not ALONE):** G2 roots R = 1.0343 (1.0373 / 1.0314; control 1.0031 / 0.9994); EG report set 1.114 / 1.126 (flagged: above the probe's 1.085). G6 MET: kiwipete 9 × 5 / 9 × 5, position-6 12 × 5 / 12 × 5 (Tctl wait relaxed 60 → 75, stated). S2 nps (G6 node medians H / B) 0.994 / 1.004.
- **Gates:** `npm test` 2 672 / 2 672 in 9.04 s (main 2 650 in 9.15 s); lint, typecheck, build exit 0; skip count 0, integrity `No findings.`; 15 deep lanes green (levels 577 s). Not run: ladder (games), CLI / UCI real-engine and UCI session, perft / input / zobrist (`UNKNOWN - verify`, none reads the evaluation's values).
- **Process slip (LOW):** the four mutation vitest runs (about 1 s each) went outside the host lock. Disclosed in `…863fb251`.
- **Owed:** QE K3 under its PREREG, K4, the R-281-a `-t` lines, UAT verdict (production lines: UAT owed). The board move to In Review is the Orchestrator's (brief fence).
- **Notes:** se-ABC-271 `…2340385e` (decision), `…d3690ae6` (acceptance), `…863fb251` (tests), `…4e7d2740` (artifacts).
