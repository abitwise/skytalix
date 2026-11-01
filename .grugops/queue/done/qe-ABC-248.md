---
subtask: qe-ABC-248
role: qe-e2e
ticket: ABC-248
ref: .grugops/context/qe-ABC-248/
branch: grugops/ABC-248 @ 18bad5fb (code 71700836, PREREG 7e9ab524); your worktree .claude/worktrees/qe-ABC-248 on new branch grugops/qe-ABC-248 from it
width: ALONE (no other hop). Record load1 and foreign processes with every timing. Leave no process running.
---
# QE ABC-248 (S, P1, test-only): ADR-0046 tranche 2 gate
## Read
- The ticket page (acceptance, BA/PM ruling conditions 1–5, ruling 6). ADR-0046 § Addendum 2026-10-31 and § BA/PM ruling 2026-10-31 (W1).
- The SE hand-back .grugops/queue/done/se-ABC-248.md on the branch, PREREG.txt and frozen lists in .grugops/context/se-ABC-248/raw/, notes …237b57fb, …b9dc61b6, …64b1718e, …aedad93f.
## Do
- Re-read each lever's condition independently (you may reuse the SE's frozen lists; say whether you re-froze): T2c-a/b non-vacuity and plant parity (ADR-0050 plants first); T2a default-lane kill parity (120 = 120; WS-WHITE/WS-BLACK sole killers stay); T2d kill-set parity for A4-a2 at step 1 000; census 0 join.
- SE-248-a (MEDIUM): ruling 6's `-t` form. Run the moved describe with the regex-escaped title under ENGINE_DEEP=1 and confirm "4 passed"; record the unescaped form's 0-tests exit 0 as a finding against the ruling text (who fixes the text: name the carrier).
- SE-248-b (INFO): record A4-a2's depth 3 / 1 044 nodes at step 1 000 vs depth 6 at 100; judge whether ruling 2's interval count (budget ÷ step) is met as written; if you think the ruling's wording needs an Architect reading, say so — do not block on it if the ruling is met as written.
- P-2 (from bapm-page-closes): run S241M5, QPARITY, QCLOCK, QPLY4, QPATHOFF each alone against the whole default lane at the tip; record killed / survived. No timing needed. A survivor is a finding, not a FAIL of this ticket.
- Carried: QE-244-a (confirm no step, LEVELS[5].budgetMs or NODES_PER_CLOCK_CHECK moved; cli.test.ts untouched), QE-245-b (remedy).
- Gates via `npm run …`; npm test 0 skips (2 362); skip-integrity, lane inventory; G8 head vs base main 46365ed0 with W1 (> 9.7 s → second window of 3 head runs, median of all 6 decides; > 10 s → STOP). Thermal stop: Tctl median > 85 °C.
- Verdict PASS / PASS_WITH_GAPS / FAIL (UAT waived; verdict closes).
## Fences
- No edits under src/, tools/, data/; no board edits. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec. Waiting: `kill -0 <pid>` or poll a file; never `while pgrep -f`; never vitest on the same command line as a wait. Scratch `qe-248/`.
## Publish
Sealed notes (task `qe-ABC-248`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-11-01, QE/E2E. PASS_WITH_GAPS, with no gap blocking. Branch `grugops/qe-ABC-248` (worktree `.claude/worktrees/qe-ABC-248`, from `18bad5fb`). PREREG `af00650c` (before any run), notes `14bd1a24`. Ran ALONE; nothing pushed or merged; no edit under `src/`, `tools/`, `data/` or the board. UAT is waived (0 production lines), so this verdict closes the gate.**

- **Lists:** the SE's frozen lists, reused and **not re-frozen**. The hashes match PREREG `7e9ab524`. QE wrote its own runner (`mut.mjs`) and ran fresh base and tip runs, all of base first.
- **T2c-a: MET.** `insideNull` 5 → **4** (≥ 3), `mutated` []. `engine-no-finally` reds `QE-208-a` at B and H. Same kill set at B and H.
- **T2c-b: MET.** Startpos has 7 non-pawn pieces per side. `underNull` 44/44 → **19/19**, `stale` []. `search-stale-null-key` reds the `search()` row and `engine-stale-null-key` reds the `chooseMove` row, at B and H. Plants 26 → 26, and every per-row set is equal.
- **T2a narrow: MET.** 137 mutants, `uci-session` default lane: **120 → 120**, none lost. The 17 survivors are identical at B and H. Each moved row's base kills stay killed in the default lane.
  - "white reads wtime" is the sole killer of WS-WHITE, and "black reads btime" of WS-BLACK.
  - Together they are the only killers of `WRONGSIDE`, so both stay.
- **T2d: MET.** A4-a2 kills the same 8 ids at step 100 and at 1 000. ⌈4 000 / 1 000⌉ = 4 ≥ 2. Census: 0 rows join.
- **A7:** every changed row reads strictly fewer nodes. The two-file default lane goes **−435 052 nodes** (1 689 340 → 1 254 288).
- **SE-248-a → QE-248-a (MEDIUM, carrier BA/PM).**
  - The escaped form `-t "ABC-167 A5 — the D4 time rule, read from the info line's time \[deep, ENGINE_DEEP=1\]"` prints **"4 passed"** (237 skipped), rc 0.
  - Ruling 6's unescaped form prints "241 skipped", rc 0: 0 tests run.
  - BA/PM amends ruling 6 / A10 at the close fold (escape the brackets, and require "4 passed").
- **SE-248-b → QE-248-b (INFO).** Depth 6 / 34 836 nodes at step 100, depth 3 / 1 044 at step 1 000, about one in-search node check. Ruling 2 is **met as written**. An Architect reading of the interval unit is advisable before a depth-sensitive R4 step move. It does not block.
- **P-2 (whole default lane at H):**
  - **Killed:** S241M5 (`turn-loop.test.ts`), QCLOCK (`engine.test.ts`), and QPATHOFF (`transposition.test.ts` perpetual row, plus a stall to `run-bounded`'s exit 124).
  - **Survived:** **QPLY4** (QE-248-c, LOW, pre-existing gap) and **QPARITY** (QE-248-d, very likely equivalent, since the key carries the side to move).
- **Carried.** QE-244-a: not triggered (`cli.test.ts` untouched, no production line, no CLI ABC-241 step moved); the carry stays open as written. QE-245-b: **closed** by this `G8`.
- **Gates.** `npm run lint` / `typecheck` / `build` rc 0. `npm test` ×3 head: 2 362 / 2 362, **0 skipped**. Skip-integrity and lane inventory (63 = 63): "No findings.". A3 names: only the 3 retitles and the 4 moved rows differ. A4 diff shape holds, and the helpers are byte-identical.
- **A8 `N8-LANE` (null-move + uci-session): MET.** H−B CPU **−0.635 s** [−0.720, −0.420], wall −0.215 s. Twin R 0.080 s. load1 0.81–1.64, Tctl median 80.8 °C (< 85).
- **A9 `G8` (b h h b b h, wait-clear, ALONE, 08:23–08:25Z): H 9.09 s** (9.11 / 9.09 / 9.01), **B 9.37 s**, H − B −0.28 s.
  - load1 0.55–1.72, Tctl median 55.9 °C, admissible.
  - Foreign processes: `abtop` about 6 % and three idle `claude` sessions. No foreign vitest.
  - `NFR-008` MET. Design target ≤ 9.4 s MET. **W1 not triggered.**
- **Notes** (task `qe-ABC-248`, contextRoot = worktree; 5/5 read back): decision `…cf9bdabf`, parity `…2e787c89`, timing `…0a3442fe`, findings `…b519324e`, artifacts `…b96e5e0f`.
- **No process left running.**

### Trace row (10 cells, header order)

| ABC-248 | Tranche 2: QE-208-a even readings 4–24, QE-208-b on startpos, ABC-167 A5's 4 duplicated rows to ENGINE_DEEP (wtime/btime stay), A4-a2 step 1 000; census 0 (test-only) | EPIC-010 | ADR-0046 § Addendum 2026-10-31 T2-R (BA/PM ruling 2026-10-31, W1); ADR-0050 plants | NFR-008: G8 H 9.09 s / B 9.37 s ≤ 10 s, load1 0.55–1.72 (design target 9.4 MET; W1 not triggered); N8-LANE MET (H−B CPU −0.635 s) | grugops/ABC-248 @ 71700836 (tip 18bad5fb): src/search.null-move.test.ts, src/uci-session.test.ts | QE PASS_WITH_GAPS: npm test 2 362 pass ×3, skips 0; parity 120 → 120 (WRONGSIDE kept by wtime/btime rows), A4-a2 8 = 8, plants 26 → 26; nodes −435 052; deep describe 4 passed (escaped -t); P-2 QPLY4/QPARITY survive | UAT waived (0 production lines); QE verdict signs | — | QE PASS_WITH_GAPS (branch, not merged; to the Orchestrator for merge routing; QE-248-a to BA/PM) |
