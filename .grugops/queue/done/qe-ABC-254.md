---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:25:05Z
subtask: qe-ABC-254
role: qe-e2e
ref: .grugops/context/qe-ABC-254/
branch: new grugops/qe-ABC-254 from grugops/ABC-254 (head fe53dbda; code 600d8de3; base = main's merge-base 09d1f675) — worktree .claude/worktrees/qe-ABC-254
width: TESTS ARE SERIALIZED. Wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; hold the lock for your whole A4 timing window. se-ABC-249 may queue on the same lock; records hops run beside you (no CPU).
---
# QE: grade ABC-254 (lazy legality) — S2, no smoke
## Ticket
plans/tickets/ABC-254*.md, Acceptance A1–A6. SE hand-back: se-ABC-254 notes in its branch (.grugops/context/se-ABC-254/, decisions …cb525705, …7f5312e8; observations …4a50887c, …1b77dfbe (SE's SHARED nps: 1.10–1.13×, decides nothing), …d672f92e).
## Do
- Re-read A1/A2/perft (spot-run; SE claims green) and own A3/G4 out of tree (byte-equal vs base 09d1f675), A5 gates (G1 54/58 PUZZLE_DEEP=1, G5, G6 ≥ base, G7 growth 0, G8 ≤ 10 s / new rows ≤ 0.1 s, G9), and A4 on a sealed PREREG: 5 interleaved fresh-process runs per board per build at 4 000 ms on kiwipete, position-6, start, plus position-4 in-check guard ≥ 0.97×; bar ≥ 1.10× on two boards, ≥ 1.00× on the third; ADR-0055 D3 validity rule; Tctl thermal stop > 85 °C median.
- ALONE: before A4, wait for the host to be clear of foreign CPU load (a foreign vitest from another repo recurs); wait cap 45 min, then proceed and mark SHARED, or if margins are thin vs the bar under SHARED, say so and recommend a re-read. Never kill foreign processes.
- Review the SE's out-of-ticket edit: src/gameend.nfr.test.ts two call-count bars tightened 1→0 and 8→0 (Orchestrator reviewed: tightening, guard kept; confirm the planted full-filter rebuild turns them red).
- Total run time (excluding waiting for clear) must stay ≤ 60 min; if your PREREG estimate exceeds it, STOP and report before running (owner rule: > 1 h asks first).
- Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
## Fences
Tests and your records only (.grugops/context/qe-ABC-254/, this brief). You may add test rows only if a gap needs proof; no src/ production edits. No board, plans/, memory-bank/. No push, force, amend, rebase, or merge into main. Leave no process running.
## Publish
Verdict PASS / PASS_WITH_GAPS / FAIL with gap ids; sealed notes (task qe-ABC-254, contextRoot = worktree); commit; ## Result + trace row here; brief + claim to done/.

## Result
*qe-e2e (claude-opus-5-5), 2026-11-01T17:28:07Z. Branch `grugops/qe-ABC-254`: claim `2c0bcbc3`, PREREG `12288266` (sealed before any run), raw evidence `6d393592`, notes `c4a7cb50`. Nothing pushed or merged.*

- **Verdict: UNRESOLVED.** That is neither PASS / PASS_WITH_GAPS nor FAIL, as the PREREG pre-registered: "A4 UNRESOLVED → no PASS; reported for a re-read".
  - **A1, A2, A3 and A5 are MET.** A4 is ungraded.
  - Nothing failed, so no `failed-attempt` note is written, and the "A4 missed → dropped" rule does not apply.
  - **UAT is NOT signed. Merge is not recommended until an ALONE A4 re-read.**
- **A4, at 4 000 ms, 5 interleaved fresh-process rounds, D3 validity:**

| board | head ÷ base | spread B / H | validity |
|---|---|---|---|
| kiwipete | **1.115** | 2.7 / 3.2 % | valid, ≥ 1.10 |
| position-6 | 1.168 (re-run; main 1.121) | 6.9 / 4.0 % | **VOID** |
| start | 1.118 (re-run; main 1.126) | 3.0 / 6.9 % | **VOID** |
| position-4, in-check guard | **1.102** (re-run) | 3.3 / 1.7 % | valid, ≥ 0.97 |

  - The host was shared all session: a recurring foreign `grugops` vitest of 20+ min per run, and foreign `node`/`git` at 100–264 % CPU.
  - The one re-run allowed for the three boards that went over 5 % left two of them still over 5 %.
  - Every paired round reads 1.067–1.192 (INFO, post hoc).
  - Tctl median 78.5 °C, under 85. v1 values held: same move and score at equal depth; kiwipete head reached depth 9 where base reached 8.
- **G4 out of tree: `cmp` byte-equal.**
  - 7 827 rows: lists including quiescence's list, `chooseMove` + 5 doors at budgets 3 and 5 on `tickingClock(1)` with clock reads, `search` + 9 doors at depth 5, and the unpruned doors at depth 2.
  - Plus 264 rows of the unpruned doors at depth 5. 0 impure rows.
- **Correctness:**
  - `ENGINE_DEEP` legal 48/48 (the 285 074 and 518 474 walks).
  - QE's own fuzz: **777 439 nodes, 0 mismatches, 0 mutations**.
  - `PERFT_DEEP` 32/32, and the 54 perft count lines are equal.
- **Gates:**
  - lint, typecheck and build exit 0; `npm test` 2 368/2 368 ×3, skips 0.
  - **G1** 54/58, rows equal. **G5** lanes green, max 4 002.7 ms. **G6** 8 → 9 and 10 = 10. **G7**: a 512 B fixed scratch, growth 0. **G8** H 9.01 s (B 9.59 s), new rows 21.7 ms. **G9** empty diff.
  - 16 deep lanes, 711/711.
- **The SE's `gameend.nfr.test.ts` edit: confirmed.** The full-filter rebuild (PL1) turns both tightened rows red, and the full-list rebuild (PL2) turns 3 rows red. Accepted.
- **Gaps:**
  - **QE-254-a (BLOCKING):** A4 UNRESOLVED; an ALONE re-read of about 15 min host time is owed. The D3 clear-pairs question goes to BA/PM or the Architect.
  - **QE-254-b (LOW):** a `hasLegalMove` rebuilt on the lazy list survives the whole default lane.
  - **QE-254-c (LOW):** no default-lane row reads quiet promotions in check. PQ2 survives the lane and dies in the deep lane and the fuzz.
- **Disclosures:**
  - The foreign-vitest detector was fixed after the PREREG (it had counted `flock` waiters on our own lock).
  - The first re-run was aborted at the 45-min cap and is not graded. The graded re-run was SHARED in rounds 1–2, and it ran under the lock held by my own suspended job.
  - G6 was read from the A4 schedule.
- **Run time** was about 46 min under the lock, of the 60 allowed. Waiting took about 70 min and is excluded.
- **Notes** (task `qe-ABC-254`, contextRoot = worktree, 7 of 7 read back sealed):
  - PREREG `…6b25d0a8`; decision `…1c801504`;
  - timing `…09221f68`; identity `…f777a50a`; gates `…aaf4675b`; findings `…dede949b`; artifacts `…dabcb90e`.
- No process was left running, and no foreign process was killed.

### Trace row (10 cells, header order)

| ABC-254 | Lazy legality: make/test/unmake only for king moves, en passant, pinned pieces and checks (ADR-0003 (1-A), (c3) folded in) | EPIC-010 | ADR-0003 (amended 2026-11-01); ADR-0055 D3 validity | NFR-005: G6 8→9 / 10=10; NFR-004: G5 ≤ 4 002.7 ms; NFR-009: G7 growth 0; NFR-008: G8 H 9.01 s; NFR-001 perft counts equal | grugops/ABC-254 @ 600d8de3 (tip fe53dbda): src/legal.ts, src/legal.test.ts, src/gameend.nfr.test.ts | QE UNRESOLVED: A1 deep 48/48 + fuzz 0/777 439; G4 cmp-equal 8 091 rows; perft 32/32; npm test 2 368 ×3, skips 0; 711 deep tests; A4 kiwipete 1.115, pos-4 1.102, pos-6/start VOID (D3 spread, shared host) | UAT owed (production lines); NOT signed (verdict UNRESOLVED) | — | QE UNRESOLVED (branch, not merged; QE-254-a blocking: ALONE A4 re-read owed; QE-254-b/c LOW to BA/PM) |
