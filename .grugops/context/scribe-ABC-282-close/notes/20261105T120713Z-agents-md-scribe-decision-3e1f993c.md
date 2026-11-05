---
id: 20261105T120713Z-agents-md-scribe-decision-3e1f993c
kind: decision
by: agents-md-scribe
at: 2026-11-05T12:07:13Z
verified_by: 
confidence: high: lines checked against the code and the pages; nothing run
refs:
  - scribe-ABC-282-close
  - grugops/scribe-ABC-282-close
  - ABC-282
  - ABC-221
  - ABC-304
  - ABC-271
  - ABC-301
  - ADR-0071
  - ADR-0052
  - QE-282-f
  - 3e648e72
  - a6ae8227
  - 9f481fa5
  - qe-ABC-282/20261105T113544Z-qe-e2e-decision-5191f871
  - orch-2026-10-30a/20261104T234244Z-orchestrator-decision-681c6363
  - orch-2026-10-30a/20261105T114920Z-orchestrator-decision-16e0ec2c
  - src/uci-session.ts
  - src/uci-session.test.ts
  - src/evaluate.passer.test.ts
  - AGENTS.md
supersedes: 
seal: sha256:fa49a75637990059e43bd7562776a23f018f48e03b8b4d5f1ef3095a96264dee
---

# scribe-ABC-282-close: AGENTS.md carries W1, the A10 lane's real shape, the passer lane and the merge re-read rule

Records and `AGENTS.md` only, on `grugops/scribe-ABC-282-close` from `main` `3e648e72`. Nothing was run: no test, build, engine, lint or typecheck. Each line below was checked against the code and the pages named.

1. **UCI time-mode line (W1).** Added to the existing line: W1 acts in `uci-clock-mode` only, on a `go` with the mover's clock and no `movetime`; no iteration starts past budget ÷ 2.3; the budget stays the hard abort; an aborted iteration's root move is kept when it beat the incumbent, with `info string partial depth <d + 1>`; every other mode and token is as before; a test that needs the full 59.5 s sends `go movetime`. Checked in `src/uci-session.ts` (`ITERATION_GROWTH` = 2.3, `softMs` set only in the clock branch, never with `movetime`; the `partial` line) and `src/engine.ts` (`softMs`, `partial`). `ADR-0071` D1, D3, D4, D5. Not restated: D2's derivation, the read, the limits' arithmetic.
2. **UCI session deep lane, ABC-221 A10.** "3 x 59.5 s" was stale. The row now runs three searches at `go movetime 90000` (W1 off) and a fourth on `go wtime 3600000 btime 3600000 movestogo 40`, asserted `time` ≥ 59 500 ÷ 2.3 and wall ≤ 60 000. Time stays about 3.5 min: 3 x 59.5 s, one 1 s warm search, ~27.5 s for the fourth (the figure is the SE's read as the `ABC-221` page records it, not a fresh run). `-t "ABC-221 A10"` still selects it: the `describe` and the one `it` keep that name. The test's own title still says "three searches" (QE-282-f, owed to the next src change to that file); the line does not rely on the title.
3. **Passer lane line, new.** None existed. `src/evaluate.passer.test.ts`'s deep lane, `SEARCH_DEEP=1`, is K0's seven node counts, exact, now read on `chooseMoveWithoutBundle` / `searchWithoutBundle` (`ABC-304`, merged `9f481fa5`). 28 tests, 7.51 s in `se-ABC-304`'s run (rounded to ~8 s). `ABC-301` closed NOT MET, so K0's scope 4 retirement was not taken and no line says it retires. `ABC-304`'s page left this line to the Orchestrator or Scribe.
4. **Merge re-read rule.** One line in § Test, after the `*_DEEP` spelling line: a merge re-read runs the deep lane of any test file that arrives from the other side, besides the default lane. Source: the Orchestrator's `…681c6363` item 3 (the K0 red reached `main` through his brief); `…16e0ec2c` read the lanes of files "from either side" at `ABC-282`'s merge. The line names no lane and no command: the lane lines above it are the spelling.

**Not changed:** `memory-bank/90-agents-md-command-log.md` and `memory-bank/45-standing-rulings.md` (the brief fences to `AGENTS.md`). The command log has no passer-lane receipt, which stays owed there.
