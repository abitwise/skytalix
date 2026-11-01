---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T23:12:17Z
subtask: se-ABC-238
role: software-engineer
ticket: ABC-238
ref: .grugops/context/se-ABC-238/
branch: new grugops/ABC-238 from main (worktree .claude/worktrees/se-ABC-238)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-238
## Read
- plans/tickets/ABC-238-a-deeper-stored-entry-may-cut-off-a-shallower-search.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
- ADR-0058 (PROPOSED) is the design: deeperCutoffs switch, test-only doors searchWithoutDeeperCutoffs / chooseMoveWithoutDeeperCutoffs, older doors switch it off, bounded drift check (depth 5, ABC-121 190 positions, ≥ 95 % within 25 cp, 0 mate sign changes), mate corpus, falsifiers F1–F6. Architect notes .grugops/context/arch-epic011-phase1/ (…2c2c1df6, …1dcdd8c7). ABC-253 was dropped — ignore page lines saying it changes the TT keys first. Count how often a deeper entry cuts (report it). BUILD ONLY: QE owns the 100-game read, smoke and Levels lane, which wait for the owner to accept ADR-0058.
## Do
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names (per ADR-0058 and the page: src/transposition.ts, src/search.ts, src/engine.ts as named, and their tests). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-238/`.
## Publish
Sealed notes (task `se-ABC-238`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-11-01, Software Engineer. Build complete, with one STOP: A4, which is `ADR-0058` falsifier F4. Branch `grugops/ABC-238`, worktree `.claude/worktrees/se-ABC-238`, from main `b19af469`. Claim `4a3184dc`, code `3abaefdd`, then the records commit (notes, raw evidence, this brief). Nothing pushed or merged. No game was played; no `cutechess-cli`, smoke or Levels lane ran (QE's, after the owner's word).**

- **Design (`ADR-0058` d1–d5, as written; decision `…50682dc7`):**
  - `tableCutoff(…, deeper)`: with the switch on, the stored depth must be ≥ the requested depth; off, it must equal it. The bound rules, fail-soft and the mate ply restore are unchanged. A shallower entry never cuts.
  - A `deeperCutoffs` switch in `Switches` and `Heuristics`, passed as an argument, true in `search()` and `chooseMove` only. Every older door passes false.
  - The doors `searchWithoutDeeperCutoffs` and `chooseMoveWithoutDeeperCutoffs` keep everything else on, prior keys included.
  - The order of authority and the root are unchanged. The diff reads no budget, deadline or environment.
- **Acceptance (observation `…3beb1ada`):**
  - **A1 / G4 / F6: MET.** 276 positions, cross-build against `b19af469`, sha-equal:
    - new door against base `search()` at d1–4: 1 104 rows, 0 differ;
    - new door against base `chooseMove` to 4: 276 rows, 0 differ;
    - every older door against itself: 0 differ, with the same shas se-ABC-229 recorded.
    - Non-vacuity is thin: 10 of 1 104 search rows, 0 of 276 engine rows.
  - **A2: MET.** Exact at depth 8, probed at 5, cuts with 40; the door rule does not. Each bound against each side of the window passes with the switch on and off, and a deeper mate is restored to the probing ply.
  - **A3 / F1 / F2: MET.** d5 on the 190:
    - `search()` 100.00 % of 187 within 25 cp, max 3 cp;
    - `chooseMove` 100.00 %, max 10 cp;
    - 1 score moved in each; 0 mate sign flips.
    - The 287 sign floor: 0 of 189 violated, 0 distances changed.
  - **A4 / F4: NOT MET, so STOP.**
    - `search(…, 8)` against the door: kiwipete 1 109 987 / 1 116 785 = **0.9939×**, position-6 1 595 656 / 1 602 457 = **0.9958×**, against a bar of ≤ 0.95×.
    - Report: `chooseMove` to 8 reads 0.9587× / 0.9986×.
  - **A5:** the gates below.
  - **A6:** QE's; it waits on the owner.
- **Firing rate at d6 on the 190 (the test-side wrap):**
  - `search()` 2 367 / 1 114 332 probes = **0.212 %**;
  - `chooseMove` 1 541 / 876 757 = **0.176 %**.
  - Both are under the Architect's 1-in-100 line.
  - kiwipete's `search()` makes 0 deeper cuts even at d6. In the middlegame a deeper entry for the same key is rarely in the table when it is probed.
- **Re-pointed rows:** `ABC-229` A3 and its d5 drift pair now read the new doors. They read se-ABC-229's figures exactly: 1.019× / 1.000×; 100 %, 8 cp.
- **Re-pinned source rows:**
  - the `quiescenceEvasions` and `quietPromotions` literal sets;
  - the QE-208-c `nullMove` map (+ the new doors);
  - export lists +1 each.
- **No value row moved.** `ABC-249` reads Ke1 404 / Kg1 497, unchanged, so test note 2 is not triggered.
- **Gates (observation `…7faf5aa7`):**
  - lint, typecheck and build exit 0.
  - `npm test` 2 386 = base 2 376 + 10. Skips 0; skip-integrity and lane inventory both "No findings."
  - G1 54/58 (= baseline).
  - G7: arrayBuffers 4.51 MiB, growth 0.
  - G8: head median 8.50 s, base 8.60 s (interleaved ×3, load1 ≤ 2.5).
  - G9: levels.ts diff empty.
  - 14 deep lanes green.
  - G5 real clock, graded G6, G11 and Levels: QE's.
  - A foreign `vitest` (another repo) ran throughout; it was logged and not touched.
- **Fence slip:** a few early transposition-file runs and one `biome --write` used bare `npx`. Every reported figure was re-run with the local binary or an npm script.
- **STOP (failed-attempt `…db17e44b`):**
  - F4 fired: "`ABC-238` not merged; this ADR accepted, not in force".
  - The F1 fallback (null-window nodes only) does not answer F4.
  - The cause is `UNKNOWN - verify`. The engineer's reading is that the ADR's three sources mostly yield shallower, not deeper, entries for the same key, and always-replace may evict the rest. This is for the Architect and the owner. Nothing was loosened or re-scoped.
- **Notes (sealed, 5 of 5 read back):**
  - design `…50682dc7`;
  - acceptance `…3beb1ada`;
  - gates `…7faf5aa7`;
  - artifacts `…7ebea1d7`;
  - failed-attempt `…db17e44b`.

### Trace row (10 cells, header order)

| ABC-238 | A deeper stored entry may cut off a shallower search, behind an off-door pair | EPIC-011 | ADR-0058 (PROPOSED; revises ABC-081 A1) | NFR-005 A4 NOT MET: d8 0.9939× / 0.9958× (bar ≤ 0.95×; F4); firing 0.21 % / 0.18 % of probes at d6; NFR-008 G8 head 8.50 s / base 8.60 s; NFR-009 G7 4.51 MiB, +0; G1 54/58; G9 met | grugops/ABC-238 @ 3abaefdd (+ records commit): src/transposition.ts, src/search.ts, src/engine.ts | src/transposition.test.ts (A2 predicate, literal, liveness; SEARCH_DEEP A3 drift ×2, 287 sign floor, A4 report, firing rate) + re-points/re-pins in quiescence, search.null-move, search, engine tests; npm test 63 files / 2 386 pass, skips 0; 14 deep lanes green; A1 cross-build sha-equal to b19af469 | — (UAT owed; QE verdict signs; A6 read, smoke, Levels QE's after the owner's word) | — | In Review with STOP on A4/F4 (branch, not merged; owner/Architect decision on ADR-0058 and F4) |
