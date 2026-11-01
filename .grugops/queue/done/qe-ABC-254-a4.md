---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T17:29:30Z
subtask: qe-ABC-254-a4
role: qe-e2e
ref: .grugops/context/qe-ABC-254-a4/
branch: new grugops/qe-ABC-254-a4 from grugops/qe-ABC-254 (15eadd7a) — worktree .claude/worktrees/qe-ABC-254-a4
width: ALONE. Take `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock` for the WHOLE read (qe-ABC-255 holds it for its games first — wait). No other hop runs tests meanwhile.
---
# QE: A4 re-read for ABC-254 (QE-254-a, the only open criterion)
## Inputs
qe-ABC-254 on its branch: PREREG …6b25d0a8, verdict …1c801504, timing …09221f68, scripts in .grugops/context/qe-ABC-254/raw/. Ticket A4 as written: kiwipete, position-6, start at 4 000 ms, 5 interleaved fresh-process runs per board per build; ≥ 1.10× on two boards, ≥ 1.00× on the third; position-4 ≥ 0.97×; ADR-0055 D3 validity (5 % spread, one re-run).
## Do
- Seal a new PREREG before any run: same method and rule as qe-ABC-254's (do NOT change the spread rule; note QE-254-a's open question only). Use the fixed busy-host check (real processes only, not flock waiters).
- Wait for a clear host (no foreign vitest, no foreign process > 50 % CPU) up to 45 min; then run all four boards fresh. If the host turns busy mid-read, the spread rule decides; if boards void again, report UNRESOLVED with load evidence — do not grade by hand.
- Run time ≤ 30 min excluding waits. Thermal stop Tctl median > 85 °C. Never kill foreign processes.
- Final verdict for ABC-254 combining qe-ABC-254's MET rows with this A4: PASS / PASS_WITH_GAPS (carry QE-254-b/c) / FAIL (A4 missed → ticket's miss rule) / UNRESOLVED.
## Fences
Your records only. No src/, board, plans/, memory-bank/. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-254-a4, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.

## Result

**ABC-254 verdict: UNRESOLVED.** A4 is UNRESOLVED a second time, so ABC-254 is neither PASS nor FAIL. A1, A2, A3 and A5 stay MET from qe-ABC-254 (`…1c801504`). QE-254-a stays **BLOCKING**. UAT is NOT signed, and merge is not recommended.

- **PREREG** `…2e86c6f1` was sealed and committed in `9f6e64b1` before any timed run. It used qe-ABC-254's method and rule, and the spread rule was not changed.
- The two changes are marked `A4-RR`:
  - the brief's "no foreign process > 50 % CPU" start check, read from a 3 s `/proc` sample;
  - the fixed detector (a running node/vitest only; flock, sh and npm waiters ignored).
- Grading is mechanical (`grade.mjs` → `raw/a4/grade.json`).
- **Lock:** requested 17:33:18Z and queued behind qe-ABC-255. **Held 17:54:28–18:05:25Z** for the whole read, as one `flock … run.sh` job. It was never bypassed, suspended or signalled.
- **Start:** ALONE both times, at 17:54:49Z and 17:59:37Z: 0 vitest, 0 cutechess, 0 hot processes, load1 ≤ 1.47, Tctl ≤ 58.5. That was well before the 18:39:28Z cap, and there is no SHARED label.

**A4 table** (graded; ratio = head ÷ base median nps; spreads B / H):

| board | reading | head ÷ base | spread B / H | validity |
|---|---|---:|---|---|
| kiwipete | main | 1.137 | 9.0 % / 13.1 % | re-run owed |
| kiwipete | re-run | **1.120** | 3.8 % / 3.0 % | **valid** |
| position-6 | main | 1.113 | 4.9 % / 8.1 % | re-run owed |
| position-6 | re-run | 1.131 | 10.5 % / 15.4 % | **VOID** |
| start | main | **1.105** | 3.6 % / 3.6 % | **valid** |
| position-4 (guard) | main | 1.095 | 5.3 % / 1.8 % | re-run owed |
| position-4 (guard) | re-run | 1.110 | 5.9 % / 6.7 % | **VOID** |

- (v1) values held. (v3) thermal held: median after-run Tctl 77.8 / 79.7 °C.
- The bar's third board (position-6) and the guard (position-4) have no valid reading, so A4 = UNRESOLVED. No hand grade.
- **INFO, not a grade:** across 35 graded pairs, no paired ratio was below 1.00, and position-4 was never below 0.97 (lowest 1.060). position-6's lowest was 1.020. The clear-only spreads are ≤ 4.5 %.
- **Load evidence (why it voided):** the host turned busy within about 1 min of each ALONE start.
  - Not-clear pairs: main 7 of 20 first attempts plus 4 of 7 second attempts; re-run 6 of 15 plus 5 of 6.
  - The busier run of each not-clear pair read foreign cores 1.31–5.15. Clear runs read ≤ 0.70.
  - There were four foreign-vitest pauses (about 205 s; source UNKNOWN - verify, since they had exited before anyone could identify them) and one thermal pause (16 s). load1 peaked at 3.67.
  - The foreign CPU came mostly from short-lived processes, which the snapshot diff cannot name (QE-254-d, INFO).
- **Run time:** timed runs about 6.6 min; waits inside the job about 4.4 min. The 21 min lock wait is excluded.
- **Gaps:**
  - QE-254-a BLOCKING (carrier: the Orchestrator → BA/PM → the Architect; the 5 % rule cannot be met on this host while other sessions run);
  - QE-254-b and QE-254-c LOW, carried;
  - QE-254-d INFO (QE's instrument).
- **Notes** (task `qe-ABC-254-a4`, contextRoot = worktree; 6 of 6 read back sealed, no findings): PREREG `…2e86c6f1`; verdict `…ab3062eb`; timing `…d9649ce2`; host `…f704f071`; gaps `…42b83a6d`; artifacts `…ff2bf9ba`.
- **Commits** on `grugops/qe-ABC-254-a4`: `3d201ec7` (claim), `9f6e64b1` (PREREG), `da124c7c` (evidence and notes), then this done move. Not pushed, not merged.
- Nothing of this hop is left running, and no foreign process was killed.

### Trace row (10 cells, header order)

| ABC-254 | Lazy legality: make/test/unmake only for king moves, en passant, pinned pieces and checks (ADR-0003 (1-A), (c3) folded in) | EPIC-010 | ADR-0003 (amended 2026-11-01); ADR-0055 D3 validity | NFR-005: G6 ≥ base (8→9, 10=10, 11=11) INFO; NFR-004: G5 ≤ 4 001.6 ms INFO; NFR-009/008/001 carried from qe-ABC-254 | grugops/ABC-254 @ 600d8de3 (tip fe53dbda): src/legal.ts, src/legal.test.ts, src/gameend.nfr.test.ts | QE UNRESOLVED (A4 re-read, ALONE start, lock held): kiwipete 1.120 valid, start 1.105 valid, pos-6 1.131 VOID (10.5/15.4 %), pos-4 1.110 VOID (5.9/6.7 %); A1–A3, A5 MET carried (qe-ABC-254) | UAT owed (production lines); NOT signed (verdict UNRESOLVED) | — | QE UNRESOLVED (branch, not merged; QE-254-a BLOCKING: D3 spread rule unattainable under foreign load, to BA/PM/Architect; QE-254-b/c LOW; QE-254-d INFO) |
