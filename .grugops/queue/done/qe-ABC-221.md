---
subtask: qe-ABC-221
role: qe-e2e
ticket: ABC-221
ref: .grugops/context/qe-ABC-221/
branch: new grugops/qe-ABC-221 from grugops/ABC-221 fb3696fa (worktree .claude/worktrees/qe-ABC-221); base d58f2d77, head c48a6f83
width: ALONE for timing, the deep lanes and the probe; only a records-only Security/NFR hop runs beside you (no vitest)
---
# QE ABC-221 (M, P3, milestone 2): uci-clock-mode over UCI TimeMode; HARD_CEILING_MS 60 000
## Read
The ticket page (A1–A12, NFR triggers, Test notes 1–5), ADR-0052 (ACCEPTED; D3–D8), ADR-0045 § AMENDMENT A3, ADR-0044 D5,
ADR-0046 § Addendum R1–R4 and § Ruling 2026-10-31; se-ABC-221's notes and raw/ on the branch; qe-ABC-220's notes (A14a/A14b split; QM4).
## Do
- PREREG first: commit your plants and harness before any head run.
- A1–A12: grade each with its reading.
  - Plants on scratch copies: at least QM4 in both modes, the cap swapped between modes, the clamp left at 32 000 (A7's real row must go red), and no-token → 59 500 instead of T. Report survivors.
- Check that `simple-tournament` and `level` are identical to base: ABC-220's rows unchanged; the `level` budgets under a 60 000 clamp.
- Check the one removed row and the re-pins, which sit outside the ticket's files (SE-221-c/d).
- A7, gates: lint, typecheck, build, `npm test` ×3 with 0 skips and skip-integrity.
- Deep lanes, ALONE, once each: ENGINE_DEEP A10 (≤ 60 000 ms wall; ≤ 16 MiB, growth ≤ 1 MiB) and UCI_DEEP. Never during G8.
- A11 row 3 (A14b): QE's probe, run once in your ALONE window, never through vitest.
- R1 census: check the SE's lines.
- G8, ALONE, order b h h b b h, wait-clear by `kill -0`: report the medians. G8 was 9.41 s at ABC-242. Head > 9.6 s fires ABC-244 tranche 2 (report only). Head > 10 s: STOP.
- SE-221-a: confirm the A6 arithmetic (17 205 vs 117 735 ms) for BA/PM's fold.
- Verdict PASS / PASS_WITH_GAPS / FAIL. UAT is owed; your verdict signs it.
## Fences
- No edits to src/, tools/, data/ or the board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait.
- Thermal stop: Tctl median > 85 °C.
- Scratch `qe-221/`. Keep it small; remove your scratch trees when done.
## Publish
Sealed notes (task `qe-ABC-221`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-31, QE/E2E. QE verdict: PASS_WITH_GAPS** at `c48a6f83` (base `d58f2d77`).
- ALONE, beside a records-only Security/NFR hop.
- PREREG `6d7f2c24` was committed before any head run. Notes were sealed at `16b695a0`. Not merged, nothing pushed.
- Notes (task `qe-ABC-221`):
  - decision `…861e737d`;
  - oracle, fence, census and SE-221-a `…f9b43b6d`;
  - plants `…c6f37a35`;
  - gates, deep lanes, probe and `G8` `…b348899a`;
  - findings `…8ad25906`;
  - artifacts `…2d4c9f76`.

**Acceptance: A1–A12 MET**
- **A1:** the three-value line is byte-exact and placed. The value is accepted silently, the refusals hold, it is off
  by default, and Skill Level is not read.
- **A2–A4:** 1 069 ms are left on every period. The periods use 99.9 % (A2, A3) and 99.88 % / 100 % / 100 % (A4).
- **A5:** 1 900 (1 069 left); `wtime 800` → 1; the real row plays depth 1, `time` 20.
- **A6:** the bound is met (17 205 after move 80).
- **A7:** 59 500 / 59 500 / 5 000 / 22 000 / 22 000. The real row reads 65 000, and CLAMP32 turns it red.
- **A8:** the fence is clean, and `level` and `simple-tournament` equal base on 14 742 `go` records.
- **A9:** `G8` H 9.84 s ≤ 10. The R1 census is confirmed: 3 class-P rows, 0 time-blind.
- **A10:** max wall 59 500.8 ms, heap +0.12 MiB, arrayBuffers 4.51 MiB with 0 growth, depth 13.
- **A11:** the lane row is green, `UCI_DEEP` is 13/13, and the A14b probe reads R1 0.41 ms with R2 and R3 met.
- **A12:** the four rows run in both modes, and QM4 is killed in both modes and per mode.

**Checks**
- **Gates:** lint, typecheck and build exit 0. `npm test` is 2 363 passed ×3 with skips 0. skip-integrity and lane
  inventory are clean. The names are +31 −1 with 4 retitled, and nothing else moved.
- **Oracle:** 78 717 checks, 0 FAIL. That covers P1 (base parity, 14 742 records), O1 (an independent D2/D4 oracle,
  4 914 records), S1 and L1.
- **Plants:** 21/21 as pre-registered. Every REQUIRED red held: QM4 ×3 forms, CAPSWAP, CLAMP32 (the A7 real row),
  NOTOK59 and BLUNDERCM. Survivors: HSCM and CLOCKWINSCM, both predicted.
- **SE-221-a CONFIRMED:** A6 as worded leaves 17 205 ms after move 80. alloc.txt's shape (+900 000 after move 40) gives
  117 735 ms after move 40. The fold is BA/PM's, and D4's sentence is the Architect's.
- **SE-221-c/d:** the re-pins and the removed row are sound.

**`G8`**
- B 9.82 s, H **9.84 s**, H − B +0.02 s. 6/6 rc 0, load1 ≤ 2.42.
- `NFR-008` MET.
- **`ABC-244` tranche 2 FIRES on the raw median** (9.84 > 9.6). The host ran about +0.41 s slow: the same base src
  `e0767414` read 9.41 s at `ABC-242`. That was a foreign orphan process (QE-221-c). A re-read on a clean host is the
  Orchestrator's call. No STOP.

**Findings**
- **QE-221-a LOW:** two behaviours in the mode that no row pins.
  - The hard stop, HSCM. The mutant hands 1 890 ms with 800 ms on the clock.
  - Movetime over a clock, CLOCKWINSCM.
  - The fix is two test-only rows, and the routing is BA/PM's.
- **QE-221-b INFO:** `src/levels.ts` lines 49–50, "`HARD_CEILING_MS` is the largest of them", is stale at 60 000. D8
  fences that file.
- **QE-221-c INFO:** an orphan `python3 -I -` (cwd `secnfr-ABC-221`, ppid 1, its task stopped) holds one core at 100 %.
  It was still running at hand-off. **The Orchestrator should reap it.**
- None blocks.

**UAT:** owed (production lines in `src/uci-session.ts` and `src/engine.ts`). **This QE verdict signs it.**

STOP: none.

### Trace row (10 cells, header order)

| ABC-221 | TimeMode uci-clock-mode over UCI: min(x, 59 500) for movetime, min(59 500, C) on a clock, T with no token; HARD_CEILING_MS 32 000 → 60 000; levels and simple-tournament value-identical | EPIC-009 | ADR-0052 D1, D2, D4, D6–D8 (accepted); ADR-0045 § AMENDMENT A3 (clamp 60 000, fold owed); ADR-0044 D5; ADR-0046 § Addendum R1–R4 | NFR-004 A10 max wall 59 500.8 ms ≤ 60 000; NFR-009 heap +0.12 MiB, arrayBuffers 4.51 MiB; AR-UCI-BUSY R1 0.41 ms; NFR-008 G8 MET H 9.84 s (B 9.82 s, +0.02 s; tranche 2 fires on the raw median, host slowed, QE-221-c); R1 census 3 class P, 0 time-blind | grugops/ABC-221 @ c48a6f83: src/uci-session.ts, src/engine.ts, src/uci-session.test.ts, src/uci.real-engine.test.ts, src/engine.test.ts, src/levels.test.ts | npm test 63 files / 2 363 pass ×3, skips 0; QE oracle 78 717 / 0 FAIL; plants 21/21 as pre-registered (2 survivors, QE-221-a); ENGINE_DEEP A10 1/1; UCI_DEEP 13/13; A14b probe MET | QE PASS_WITH_GAPS (UAT owed; the QE verdict signs) | — | In Review → QE PASS_WITH_GAPS (branch, not merged) |
