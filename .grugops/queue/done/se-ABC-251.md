---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T20:28:29Z
subtask: se-ABC-251
role: software-engineer
ticket: ABC-251
ref: .grugops/context/se-ABC-251/
branch: new grugops/ABC-251 from main (worktree .claude/worktrees/se-ABC-251)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-251
## Read
- plans/tickets/ABC-251-the-search-walks-packed-moves-and-builds-a-move-only-at-its-return-with-inlined-helpers.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
- Architect design input .grugops/context/arch-abc250-close/notes/…a07418ac (profile first; inline only at hot sites the profile names; Budget literal in deepen). ADR-0055 addendum D3-V2 (your speed figures are informal; QE grades A3 in an alone window). Review notes 6–8 on the page (QE-259-c, QE-260-a, generation order must not change).
## Do
- STOP rule (page 2a): if the profile shows no measurable cost for isBlack/pieceType and only the Budget half remains, STOP and report before building — the Orchestrator then drops the ticket as "nothing to cut" (not a miss).
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names (src/search.ts, src/quiescence.ts, src/engine.ts, src/evaluate.ts only if the profile names it; position.ts exports stay). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-251/`.
## Publish
Sealed notes (task `se-ABC-251`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-11-01, Software Engineer. STOPPED at item 2a (profile first): nothing to cut. No code was built and no ALONE read is owed.** Branch `grugops/ABC-251`, in worktree `.claude/worktrees/se-ABC-251`, from main `51b803c0`. The claim is `c6da2976` and the notes plus raw evidence are `fd60efc4`. Nothing is merged or pushed. No `src/` or test file was changed.

- **Profile** (informal, under the host lock): base main, `chooseMove` 4 s, kiwipete and position-6, 2 fresh runs each.
  - Self time: `isBlack` 2.16–2.46 %, `pieceType` 0.19–0.34 %, `deepen` 0.01–0.03 %, `countNode` 0.11–0.23 %.
  - nps 863–875 k. load1 1.42–1.50. cutechess 0.
  - The only pgrep "vitest" hit was a foreign fake-oidc process (its path contains the word), left alone.
- **Why STOP though `isBlack` shows a frame.**
  - `--trace-turbo-inlining` shows TurboFan inlined **68/68** considered call sites of both helpers (0 refused, 0 deopts). Every hot caller is among the targets.
  - V8's profiler gives an inlined function's instructions back to the inlinee's frame. A microbenchmark showed it: an inlined helper still drew 2 665 samples as its own frame.
  - So hand-inlining builds the same code. se-ABC-227's "not inlined" premise does not hold on today's main.
  - Budget: the `...heuristics` spread is fast-properties and one map across doors (`%HasFastProperties`/`%HaveSameMap`). That leaves only the Budget half, which is the stop rule's own case.
- **Informal speed probe** (labelled informal; not A3): a scratch copy with both helpers hand-inlined throughout moves.ts, evaluate.ts and quiescence.ts, interleaved with base, 4 s.
  - kiwipete 1.016× (1.009 without the cold first pair), position-6 0.996×, start 1.013×.
  - Spreads were 2.2–4.9 %: noise-level, below 1.03 on every board.
- **Acceptance:** A1, A2, A3 and A5 are not applicable (no head build). G2/G3 are not owed (evaluate.ts untouched). Review notes 6–8 have no diff to read.
- **Gates:** none run, because there is no code change; the tip differs from main only under `.grugops/`.
- **Notes (sealed, read back 3/3):** decision `…4342e5b5` (STOP), evidence `…687c4af7`, artifacts `…d1e5f719`. Raw scripts and outputs are in `.grugops/context/se-ABC-251/raw/`. The .cpuprofiles are not committed (host paths) and can be regenerated with `profile.sh`.
- **Routing owed (Orchestrator):** drop as "nothing to cut". Per the page that is not a miss and owes no failed-attempt note. The ABC-253 order may swap.

### Trace row (10 cells, header order)

| ABC-251 | O1-c alone: inline isBlack/pieceType at profiled hot sites; Budget constant shape | EPIC-010 | — | none moved (no code; NFR-005/G6, NFR-009/G7 untouched) | grugops/ABC-251 @ fd60efc4 (claim c6da2976): .grugops/context/se-ABC-251/ notes (3) + raw/ (profile, inlining trace, informal probe); no src/ change | informal profile: isBlack 2.2–2.5 % self but TurboFan inlined 68/68 sites; deepen 0.01–0.03 %; informal hand-inline probe 0.996–1.016×; no tests run (no code) | — | — | STOPPED at item 2a (nothing to cut); Orchestrator drop routing owed |
