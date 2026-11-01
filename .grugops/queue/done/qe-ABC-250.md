---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T19:31:13Z
subtask: qe-ABC-250
role: qe-e2e
ref: .grugops/context/qe-ABC-250/
branch: new grugops/qe-ABC-250 from grugops/ABC-250 (head 35139b31; code 2e04eee5; base ceb28780) — worktree .claude/worktrees/qe-ABC-250
width: ALONE WINDOW — dispatched only when no other hop of this session runs; nothing else dispatched until you report. Hold `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock` for every run and for the whole A4 read.
---
# QE: grade ABC-250 (packed moves, perft first) — S2, no smoke
## Ticket
plans/tickets/ABC-250*.md, A1–A7 and "What happens on a miss" (GO ≥ 1.25× merge; HOLD/NO-GO → not merged, ABC-251 narrows to O1-c, ABC-252 dropped). SE notes on the branch .grugops/context/se-ABC-250/ (…e36367dd, …de63198a, …2107ec2a, …ff7ffb6e informal speed: perft 1.07–1.14×, search 1.00×). ADR-0055 O1-b and addendum D3-V2 (on main).
## Do
- A1/A2 re-read (spot); A3/G4 out of tree byte-equal vs base; plants of your own on the packed path (at least: promotion piece, castling rights in undo, ep square in undo).
- A4 on a sealed PREREG implementing D3-V2 for the page's perft boards and depths (if perft runs are too short for the 5 % spread, follow the page's stated depth/repetition method; if the page does not state one, choose a pre-registered repetition count BEFORE any run and say so). A5 search-nps guard under the same rule. Grade by script.
- QE-261-c relay: confirm the packed path did not change what generateMoves returns first (ABC-261 precondition; ticket forbids it) — the full lane at head already covers it; say so explicitly.
- Gates: G1 (PUZZLE_DEEP=1), G5, G6, G7 growth 0, G8, G9, lint/typecheck/build, npm test ×3, skip-integrity, lane-inventory.
- Verdict per the page: GO (PASS / PASS_WITH_GAPS) / HOLD / NO-GO / UNRESOLVED (VOID-LOAD). Record the window start/end UTC.
- Run time ≤ 45 min excluding waits; if your estimate exceeds 60 min, STOP and report first. Thermal stop. Never kill foreign processes.
## Fences
Tests and your records only; no src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-250, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.

## Result

**Verdict: UNRESOLVED.** A4 is VOID on kiwipete and start after D3's one re-run. This is not VOID-LOAD: every board reached 5 admitted pairs. GO was not read, so the ticket is not merged on this read. HOLD and NO-GO were not read either, so there is no `failed-attempt` note and no drop. Per the page, a VOID "goes back to QE". Everything else is green.

**A4: perft at perft-bench depth 4.** Steady state over REPS calls per fresh process (REPS fixed in the PREREG before any run: kiwipete 12, position-6 12, start 150). D3-V2, ALONE, not SHARED.

| board | schedule | counted / attempts | H ÷ B | paired median | spread B / H | status |
|---|---|---|---:|---:|---|---|
| kiwipete | main | 5 / 5 | 1.144 | 1.146 | 6.3 % / 4.7 % | re-run owed |
| kiwipete | re-run | 5 / 5 | **1.094** | 1.107 | **12.9 %** / 1.6 % | **VOID** (spread; the guard splits at 1.10) |
| position-6 | main | 5 / 9 | **1.111** | 1.128 | 2.1 % / 3.5 % | valid |
| start | main | 5 / 5 | 1.265 | 1.261 | 8.1 % / 8.1 % | re-run owed |
| start | re-run | 5 / 5 | **1.237** | 1.255 | 4.2 % / 3.8 % | **VOID** (the guard splits at 1.25) |

- **INFO boards:** position-3 1.223 (not valid, spread), position-4 1.102 (valid), position-5 1.127 (not valid, spread).
- **(v1)** held on every attempt: every perft count was exact on both builds.
- **Post hoc INFO, not a grade:** no kiwipete pair reached 1.25 in either schedule (max 1.217).

**A5: search at 4 000 ms. MET.**

| board | counted / attempts | H ÷ B | paired median | spread B / H |
|---|---|---:|---:|---|
| kiwipete | 5 / 5 | **1.003** | 1.003 | 3.9 % / 2.6 % |
| position-6 | 5 / 7 | **0.994** | 0.996 | 0.4 % / 3.3 % |
| start | 5 / 10 | **1.005** | 1.010 | 1.4 % / 2.1 % |

The agreement guard held on every board, with no re-run.

**Correctness:**
- **A1:** `PERFT_DEEP` 45/45.
- **A2:** `ENGINE_DEEP` `-t ABC-250` 3/3, including the 285 074-node walk.
- **A3/G4:** 7 827 + 264 rows `cmp` B = H, out of tree; the `ENGINE_DEEP` engine lane 78/78.
- **QE plants:** QP1 promotion piece, QP2 castling in undo, QP3 ep in undo, QP4 captured colour bit, QP5 packed key ep file and QP6 packed order all went red in the default lane.
- **QE-261-c:** `generateMoves` is byte-unchanged (0 removed lines in `src/moves.ts`).
  - ABC-261's row is on `main` only (`dd8b17ea`), so the branch lane does not carry it.
  - `main`'s `gameend.nfr.test.ts` ran 11/11 against head's code instead.

**Gates:**
- **Mandatory:** lint, typecheck and build all exit 0.
- **`npm test`:** 2 381/2 381 ×3. Skips 0, skip-integrity no findings, lanes 63 = 63.
- **G1:** 54/58, with the 58 rows equal to base.
- **G5:** max 4 001.4 ms, ≤ 5 000; the engine lane is green.
- **G6:** kiwipete 9 = 9, position-6 10 = 10, min 8.
- **G7:** growth 0; every array is allocated at module load, about 132.7 KiB.
- **G8:** H median 8.76 s; new rows 51.0 ms.
- **G9:** empty.

**Gaps:**
- QE-250-a, MEDIUM: the perft instrument voids at low foreign load on a hot host (Tctl 78–82 °C). Candidates are a cool-down gate or pinning.
- QE-250-b, LOW: 12 foreign vitest processes and a foreign `abtop` were seen in the "ALONE" window.
- QE-250-c, INFO: the ABC-261 relay was verified another way.
- QE-250-d, INFO: the A1 key rows and A2 order rows are both load-bearing.
- QE-250-e, INFO: the steady-state reading choice.

**Window:**
- The hop ran from 19:36:31Z to its report (after 20:15Z).
- The timed job held the lock 19:45:24–19:53:24Z: A4 19:45:24–19:49:46Z, A5 19:49:46–19:53:23Z.
- Untimed work ran under the lock 19:55:01–20:02:37Z and 20:03:17–20:12:22Z.
- Load: counted runs read foreign cores ≤ 0.64 and load1 0.72–2.66. A4 admitted 40 of 49 attempts, A5 15 of 22.

**Notes** (task `qe-ABC-250`, contextRoot = worktree; 8 of 8 sealed, no findings):
- PREREG `…7ff2b573`;
- verdict `…4fe9c469`;
- A4 `…677d4d41`;
- A5/G5/G6 `…94b58687`;
- gates and identity `…81a2c477`;
- host `…c320bc15`;
- gaps `…f2befa65`;
- artifacts `…9d26dc7f`.

**Commits** on `grugops/qe-ABC-250`: `746d2889` (claim), `eaa3d4ce` (PREREG), `85f6bd7b` (evidence and notes), then this done move. Not pushed, not merged. Nothing of this hop is left running, and no foreign process was killed.

### Trace row (10 cells, header order)

| ABC-250 | Moves packed into integers in reused typed arrays for generation, legality and make/unmake, read on perft first (ADR-0055 O1-b part 1) | EPIC-010 | ADR-0055 O1-b; A4 read under D3-V2 (addendum 2026-11-01) | NFR-001 INFO (head perft 16.8–35.7 M/s); NFR-005 G6 9=9, 10=10; NFR-004 G5 ≤ 4 001.4 ms; NFR-009 G7 growth 0; NFR-008 G8 8.76 s, new rows 51.0 ms | grugops/ABC-250 @ 2e04eee5 (tip 35139b31): src/moves.ts, src/apply.ts, src/legal.ts, src/zobrist.ts, src/perft.ts, src/perft.test.ts, src/legal.test.ts | QE UNRESOLVED (A4 D3-V2, ALONE, not SHARED): kiwipete VOID (re-run 1.094, spread 12.9 %), start VOID (re-run 1.237, guard split at 1.25), pos-6 valid 1.111; A5 MET 1.003/0.994/1.005; A1–A3/G4, G1, G5–G9, plants 6/6, gates green | UAT owed (production lines); not signed (verdict is not PASS) | — | QE UNRESOLVED (branch, not merged; VOID goes back to QE; QE-250-a MEDIUM, QE-250-b LOW, QE-250-c/d/e INFO) |
