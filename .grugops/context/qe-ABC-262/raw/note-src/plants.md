# qe-ABC-262 plants: QX1, PL3a, QX2 red on the early-exit row; QB green on the row and red on the ENGINE_DEEP walk; QE's QBe and QKb red on the black row

These are re-reads of A3, A4 and A5. Out-of-tree `git archive` copies of the QE worktree HEAD (`src` == `39a6237e`, with `.grugops/context` and `plans/` included) had `node_modules` symlinked in. The planters were:
- `qe-ABC-254/raw/qe-scripts/plant.py` (PL3a);
- `qe-ABC-261/raw/qe-scripts/qeplant.py` (QX1, QX2, QB);
- QE's own `raw/qe-scripts/qeplant262.py` (QBe, QKb).

The B2 count came from a scratch-only `console.log("B2COUNT", …)` placed before the bar in each copy. It was never in tree.

The runs were single-file vitest at heap 400 on both touched files, full `npm test` on QB and QKb, and `ENGINE_DEEP=1 vitest run src/legal.test.ts -t "ABC-254 A1"` on C0 and QB. Every run went under `flock host-test.lock` (20:26:23–20:28:31Z, load1 1.25 at start). Script: `raw/qe-scripts/plants.sh`. Diffs and logs: `raw/plants/`.

| plant | what it breaks | B2 count | ABC-262 early-exit row | ABC-262 black row | other |
|---|---|---|---|---|---|
| C0 (control) | nothing | **1** | pass | pass | ENGINE_DEEP A1: 3 passed |
| QX1 | an untested move no longer returns at once | 2 | **red**: `expected 2 to be ≤ 1` | pass | — |
| PL3a | `hasLegalMove` = `legalMoves().length > 0` | 9 | **red**: `expected 9 to be ≤ 1` | pass | ABC-261 row also red (6 vs ≤ 2) |
| QX2 | early exit lost when the first move is not a king move | 10 | **red**: `expected 10 to be ≤ 1` | pass | — |
| QB | `((inCheck && !moverIsBlack) ‖ pinStamp[from] === epoch)` | 1 | pass | **pass**: survives | `npm test` **green 2 376/2 376**; ENGINE_DEEP A1 **red**: `kiwipete 20-65 39-22 65-99` gets an extra black g2–g1=Q (`from 22, to 6`) |
| **QBe** (QE's own) | QB without the alias: `((inCheck && !moverIsBlack) ‖ (!inCheck && pinStamp[from] === epoch))` | 1 | pass | **red on P1′**: `expected [ Array(1) ] to deeply equal []` | — |
| **QKb** (QE's own) | black in check drops every quiet queen promotion (`if (inCheck && moverIsBlack) continue;`) | 1 | pass | **red on P2′** (b1=Q missing) | `npm test`: **1 failed / 2 376**, and only this row; the ABC-261 white row passes |

These match the SE (1 / 2 / 9 / 10) and QE's ABC-261 probe.

- **A3: MET.** QX1, PL3a and QX2 each turn the early-exit row red.
- **A4: NOT MET as written, and WAIVED by the Orchestrator.** QB survives the row and the whole default lane, and the ENGINE_DEEP ABC-254 A1 518 474-node walk catches it (confirmed above).
- **The black row has teeth.** QE's own plants show it:
  - QBe (the same semantic regression as QB, with the alias gone) turns it red on P1′, the "absent" half.
  - QKb turns it red on P2′, the "present" half, and is caught in the default lane by this row alone.
  - Only QB's leftover `pinStamp[from] === epoch` operand, which reads `0 === 0` on a square never stamped, masks QB.
- **A5: MET.** `git log -p 767a2e3e..HEAD -- src | grep -cE 'PLANT|SCRATCH PROBE|B2COUNT'` = 0.
