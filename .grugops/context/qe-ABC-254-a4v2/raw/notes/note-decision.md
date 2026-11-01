# ABC-254 QE verdict: PASS_WITH_GAPS. A4 is MET under ADR-0055 D3-V2 on a fresh ALONE read (kiwipete 1.112, position-6 1.120, start 1.106; position-4 guard 1.095; all boards valid with no re-run). A1, A2, A3 and A5 are MET, carried from qe-ABC-254. QE-254-a closed; QE-254-b/c LOW and QE-254-d INFO carry

QE/E2E, task `qe-ABC-254-a4v2`. The verdict comes from `grade.mjs` under the PREREG `…a1136cf6` (sealed in `acc092ca` before any timed run), not from a hand grade.

## Scope
The final QE verdict on ABC-254 (lazy legality, `src/legal.ts`, `grugops/ABC-254` code `600d8de3`, tip `fe53dbda`), joining this read's A4 with qe-ABC-254's MET rows.

## Criteria
| criterion | result | source |
|---|---|---|
| A1, A2, A3, A5 | MET (carried, not re-run) | qe-ABC-254 `…1c801504` (identity `…f777a50a`, gates `…aaf4675b`) |
| A4 bar (≥ 1.10 on two of kiwipete / position-6 / start, ≥ 1.00 on the third) | **MET**: 1.1198 / 1.1118 / 1.1059 | this task's timing note |
| A4 in-check guard (position-4 ≥ 0.97) | **MET**: 1.0947 | this task's timing note |
| A4 validity (D3-V2) | every board has 5 counted pairs within ≤ 6 attempts; spread ≤ 3.82 %; agreement guard holds; (v1) held; thermal max 78.6 °C | this task's timing and host notes |

## Verdict
- **PASS_WITH_GAPS.** The carried gaps are non-blocking: QE-254-b and QE-254-c (LOW, test-only, carrier BA/PM) and QE-254-d (INFO, QE's instrument). QE-254-a is closed.
- From QE's side, ABC-254 can leave In Review toward UAT. The board move is the Orchestrator's.
- UAT is owed on production lines (`src/legal.ts`). Under the owner-delegation rule this QE verdict is what signs UAT, which is the Orchestrator's call to record.
- The ticket's miss rule does **not** fire.

## What this does not say
- It does not re-grade qe-ABC-254 or qe-ABC-254-a4. Both stay UNRESOLVED as graded (D3-V2 item 5).
- It makes no claim about any other host or Node version.

## Risks
- start is 0.006 above 1.10. The bar does not need start at 1.10, but kiwipete at 1.1118 is the second 1.10 board, and its margin is 0.012.
- One protocol slip, disclosed in the host note: one `cat` ran during the job. The concurrent pair was admitted at ≤ 0.37 foreign cores, and the read stands.
