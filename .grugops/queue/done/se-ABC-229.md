---
subtask: se-ABC-229
role: software-engineer
ticket: ABC-229
ref: .grugops/context/se-ABC-229/
branch: new grugops/ABC-229 from main 01c37946 (worktree .claude/worktrees/se-ABC-229)
width: near-ALONE — only a records-only Security/NFR runs beside you; timed reads the ticket gives the SE are allowed (wait-clear first)
---
# SE ABC-229: quiescence searches quiet queen promotions (ADR-0053 d5–d9)
## Read
ABC-229 ticket (all FOLDED blocks; A1–A5; Test note 1 as corrected), ADR-0053 (ACCEPTED; d5–d10), the frozen Q-SET
(qe-ABC-229-qset notes `…fd9819a5`, `…92ef5670`; `.grugops/context/qe-ABC-229-qset/raw/qset/qset-229-frozen.json`), how se-ABC-228 built (door pair, A1 identity, forecast).
## Do
- Build to the ticket and ADR. Put QP-1..QP-9 into src/quiescence.test.ts at the frozen values (do not change a value; if one
  disagrees with your build, STOP and report). Re-point the ABC-228 rule row that expects 212 to quietPromotions:false (ADR-0053 d7).
- Any forecast the ticket gives the SE: run ALONE (wait-clear: no foreign vitest/cutechess). G6 both sides at 4 000 ms; a
  forecast miss → STOP and report (goes to the owner; no step past 4 s exists).
- Gates via `npm run …`; npm test count; report the npm test wall informally (NFR-008 headroom ~0.3 s; keep new rows fixed-depth and few).
## Fences
Only files the ticket/ADR name. Never push, force, amend, rebase, merge into main. No board edits. Never bare `npx`/`npm exec`.
No host paths in commits. Scratch `se-229/`.
Waiting on a background job: poll its output file or a pid with `kill -0 <pid>`; never `while pgrep -f <pattern>` (the loop matches its own command line and never exits). Stop every wait loop you start before you report.
## Publish
Sealed notes (task `se-ABC-229`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-30, Software Engineer. Done. Branch `grugops/ABC-229` (from main `01c37946`): code `f6ff1c4a`, then the records commit (notes, raw, this brief). Not merged; nothing pushed. No game was played; no `cutechess-cli` ran.**

- **Forecast (A3's frozen-clock pre-check), ALONE, at 4 000 ms on both sides.** The SE waited on a foreign `vitest` pid (another repository) with `kill -0` until it exited.
  - Base `01c37946`, real clock: kiwipete d8 in 3 131 880 nodes; position-6 d10 in 3 200 795 nodes.
  - Head, frozen clock to the same depth: 1 575 537 (1.0208× the door) and 2 340 567 (1.0001×). The door equals base frozen.
  - **× 1.09: 54.8 % and 79.7 %, both ≤ 100 %. No STOP.** Measured CPU per node is about 1.0, which gives 50.3 % / 74.0 %.
  - Informative: head's real-clock run also reaches d8 / d10. (observation `…dbc87a5b`)
- **Build** (decision `…666b62b1`):
  - `legalCapturesAndQueenPromotions` in `src/legal.ts` is one pass: the single `generateCaptures` call (`ABC-235`), plus an eight-square scan for quiet queen promotions, appended and legality-tested.
  - `QuiescenceRules.quietPromotions` selects that list out of check, then the one stable `mvvLvaKey` sort runs.
  - The switch `quietPromotions` picks one of four constant records per recursion.
  - The doors `searchWithoutQuietPromotions` / `chooseMoveWithoutQuietPromotions` have evasions on. Every older door is off.
- **Acceptance** (observation `…292fc055`):
  - **A1:** 276 positions. The new doors equal base `search()`/`chooseMove` (1 104 + 276 rows, 0 differ, sha-equal). Every older door equals itself (`ABC-228`'s pair has the same shas as `se-ABC-228` recorded). Non-vacuity: 236 of 1 104 rows differ.
  - **A2:** QE's frozen QP-1..QP-9 are placed unchanged and all hold, with the brute-force twin under both rules. **No disagreement.** The INFO row `kpk-b6c6` d8 reads 186 → 902 in both recursions.
  - **A3:** 1.019× / 1.000× (≤ 1.2×; equal to the ADR's reference).
  - **Drift d5:** 100 % within 25 cp, max 8 cp, in both recursions; 0 flips.
  - **`ABC-228`'s re-pointed oracle rows** read exactly their recorded values (1.368× / 1.405×; 89.30 % / 88.77 %, 118 cp; mate floor 0 of 189).
  - **One-pass spy row:** `generateCaptures` ×1, `generateMoves` ×0.
  - **Planted faults P1–P8** all red, then restored.
- **Re-pointed:**
  - the `ABC-228` rule row that expected 212 now reads `{ evasions: true, quietPromotions: false }`;
  - `ABC-228`'s deep A4, drift ×2 and mate floor now read the shipped side off `ABC-229`'s doors;
  - `ABC-228`'s source and literal rows follow the two-switch shape;
  - export lists ×2 and `QE-208-c` maps grow by the doors.
- **Gates** (observation `…3a1286b6`):
  - lint, typecheck and build exit 0. `npm test` 2 270 / 2 270 (base 2 245, +25). Skips 0, `No findings.`
  - G1 54/58 (= baseline). G9 met.
  - G8 informal: head 9.32–9.38 s against base 9.06–9.13 s (ALONE, same session). About +0.25 s; about 80 ms of it is attributable to the new rows, and the rest is `UNKNOWN - verify`.
  - Deep lanes green: SEARCH_DEEP ×6, ENGINE_DEEP ×6 (levels 45/45), CLI 11, UCI 5, PUZZLE 18.
- **Files:** `src/legal.ts`, `src/quiescence.ts`, `src/search.ts`, `src/engine.ts`; tests: `quiescence`, `gameend.nfr`, `search`, `engine`, `search.null-move`, `engine.capacity`, `search.capacity`. (observation `…bf120dc3`)
- **QE owes:** the graded `G6` (5 interleaved runs, both at 4 000 ms), G5's real clock, `A5` (S-1..S-4, on a `main` carrying `ABC-241`), `G11`, and UAT.
- **Publishing:** `propose_note` was not available, so the notes went through the plugin's `context-io` `appendNote` (5 admitted, sealed). An `artifact-ref` was refused for lack of a §14 `gate_run`/`content_hash`, so the pointers went in as an observation.
- **Queue:** the done/ move is on the branch's tracked copy (`se-ABC-228`'s precedent). The main checkout's `claimed/` copy is untouched.

| ABC-229 | Quiescence searches quiet promotions to a queen, bounded, behind an off-door pair | EPIC-010 | ADR-0053 d5–d8 (amends ADR-0024 d4; ADR-0026 d10 door pair) | NFR-005 forecast 54.8 % / 79.7 % at 4 000 ms (≤ 100 %; G6 QE's); A3 1.019× / 1.000× ≤ 1.2×; NFR-008 G8 9.32–9.38 s (base 9.06–9.13); G9 met; G1 54/58 | grugops/ABC-229 @ f6ff1c4a (+ records commit): src/legal.ts, src/quiescence.ts, src/search.ts, src/engine.ts | src/quiescence.test.ts (Q-SET QP-1..9 QE-frozen) + gameend.nfr spy row + re-pins in search, engine, search.null-move, capacity ×2 tests; npm test 63 files / 2 270 pass, skips 0; deep lanes green; A1 cross-build sha-equal to 01c37946 | — (UAT owed; QE verdict signs; graded G6 and A5 smokes QE's) | — | In Review (branch, not merged; G6 + smokes pending) |
