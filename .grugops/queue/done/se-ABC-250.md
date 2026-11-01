---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T19:04:33Z
subtask: se-ABC-250
role: software-engineer
ticket: ABC-250
ref: .grugops/context/se-ABC-250/
branch: new grugops/ABC-250 from main (worktree .claude/worktrees/se-ABC-250)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-250
## Read
- plans/tickets/ABC-250-moves-packed-into-integers-in-reused-typed-arrays-for-generation-legality-and-make-unmake-read-on-perft-first.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks. ADR-0003 as amended ((1-A) lazy legality now on main via ABC-254; (1-R): clause 1 governs how legality is decided, not how moves are stored). ADR-0055 O1-b and the addendum D3-V2 (any speed reading you record is informal; QE grades it under D3-V2 in an alone window). ABC-254 merged: the lazy filter is the one you pack.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
## Do
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names. No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-250/`.
## Publish
Sealed notes (task `se-ABC-250`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-11-01, Software Engineer. Done. Branch `grugops/ABC-250` in worktree `.claude/worktrees/se-ABC-250`, from main `ceb28780`. Claim `fba89f77`, code `2e04eee5`, notes `0e8e7ab9`. Nothing is merged or pushed. The change has production lines, so UAT is owed and the QE verdict signs it.**

- **Design (the page's form; ADR-0003 (1-R) covers the clause check, so no STOP).**
  - A move is one int32: from, to, piece, captured, flags and promotion in 28 bits.
  - `generateMovesPacked` / `generateCapturesPacked` write into a caller's `Int32Array` window in the object order. A run past the end throws.
  - `legalMovesPacked` / `legalCapturesPacked` run ABC-254's lazy filter and compact in place.
  - `makeMovePacked` / `unmakeMovePacked` keep the undo state in a per-ply `UndoStack` (Int32 state and Float64 clock).
  - `zobristKeyAfterMovePacked` is the packed key delta.
  - `perft` / `perftDivide` run on one fixed 128-ply move stack and undo stack (G7 growth 0).
  - The object path, the search and the shell are untouched.
- **A1.** `PERFT_DEEP=1` perft passes **45/45** (the 32 prior rows plus 13 new). The packed leaf-key XOR equals the object XOR on all six positions at perft-bench's depths. In the lane, every packed key delta equals a fresh key.
- **A2.** `ENGINE_DEEP=1` walks 285 074 nodes with **0 mismatches and 0 mutations**. The legal and capture lists are equal in order, packed make equals object make, and unmake restores `toFen`, the key and the state. The lane row covers the six roots at depth 1.
- **Plants:** five, all red, restored byte-exact.
- **A3 (G4):** QE's, `UNKNOWN - verify`. Informal: `search(·,4)` on 184 positions is byte-equal base vs head.
- **A6 gates at `2e04eee5`:**
  - `npm test`: 63 files, 2 381 passed, 0 skipped, 8.37 s.
  - Lint, typecheck and build exit 0.
  - Skip-integrity: No findings. Lane inventory: 63 = 63.
  - G9: the `src/levels.ts` diff is empty.
  - N8-LANE: +71 ms.
  - G1, G5 and G6 are QE's.
- **Informal speed, not the grade.** The runs were not ALONE: a foreign vitest was present and load1 was 1.1–1.8.
  - perft-bench-shaped perft: kiwipete **1.114×**, position-6 **1.144×**, start **1.140×**. The runs were short and the spreads are above 5 %.
  - Steady-state bench: **≈ 1.07–1.09×**.
  - **Every informal figure is below A4's GO bar of 1.25×, so expect HOLD or NO-GO from QE's D3-V2 read.** A5 informal: 1.006 / 0.996 / 0.997, with depth and move identical.
- **Deviations:**
  - `src/zobrist.ts` was edited (the page's § Dependencies names it).
  - `src/perft-bench.ts` was not edited (it calls `perft`).
  - The tests went into existing files.
  - Only the packed filters that perft and A2 read were added.
- **Notes (sealed, read back 5/5):** design `…e36367dd`, fence `…de63198a`, correctness `…2107ec2a`, informal speed `…ff7ffb6e`, artifacts `…af077ad6` (filed as an observation, as se-ABC-254 did).
- **STOP:** none.

### Trace row (10 cells, header order)

| ABC-250 | Packed moves (int32, 28 bits) in reused typed arrays for generation, lazy legality and make/unmake (per-ply UndoStack); packed key delta; perft/perftDivide on the packed path; object path and search untouched | EPIC-010 | ADR-0055 O1-b part 1; ADR-0003 (1-A), (1-R); ADR-0056 (S2, no smoke) | NFR-001 INFO 11–31 M n/s informal; NFR-009 G7 fixed stacks (≈ 129 KiB, growth 0 by construction); NFR-008 lane +71 ms; NFR-005 G6 owed; A4 owed (SE informal 1.114 / 1.144 / 1.140 cold, ≈ 1.08 steady, below GO 1.25); A5 informal 1.006 / 0.996 / 0.997 | grugops/ABC-250 @ 2e04eee5 (notes 0e8e7ab9): src/moves.ts, src/apply.ts, src/legal.ts, src/zobrist.ts, src/perft.ts, src/perft.test.ts, src/legal.test.ts | npm test 63 files / 2 381 pass, skips 0; PERFT_DEEP 45/45 incl. leaf-key XOR at bench depths; A2 ENGINE_DEEP 285 074 nodes 0 mismatches 0 mutations; 5 plants red | owed (production lines; QE verdict signs) | — | In Review (branch, not merged; QE A3 G4, A4 D3-V2 ALONE, A5, G1, G5, G6) |
