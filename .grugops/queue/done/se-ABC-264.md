---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T00:36:43Z
subtask: se-ABC-264
role: software-engineer
ticket: ABC-264
ref: .grugops/context/se-ABC-264/
branch: new grugops/ABC-264 from main (worktree .claude/worktrees/se-ABC-264)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-264
## Read
- plans/tickets/ABC-264-p2-reverse-futility-static-null-move-at-shallow-depth-behind-an-off-door-with-mate-check-and-zugzwang-guards.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
- ADR-0059 (PROPOSED) is the design and OVERRIDES the page where they differ (BA/PM is updating the page in parallel): predicate reverseFutilityCut(position, depth, ply, beta) exported from src/search.ts; null-window only; after repetition/leaf/TT probe, before null move; depth 1–3; 120 cp/ply; guards root, beta in mate band, in check, < 3 non-pawn pieces; returns beta, stores nothing; doors searchWithoutReverseFutility / chooseMoveWithoutReverseFutility; export lists +3 names; A3 adds a 160 cp cap; A4 ≤ 0.75× in both recursions with the deterministic counts 658 971 / 1 021 190 / 972 596 / 299 183 (explain any other count); falsifiers F1–F7; the predicate unit table must cover the mate-band guard (blind spot). Architect notes .grugops/context/arch-ABC-264/. BUILD ONLY: QE owns the 100-game read, smoke and Levels lane, which wait for owner acceptance of ADR-0059.
## Do
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names (src/search.ts, src/engine.ts and their tests, as ADR-0059 names). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-264/`.
## Publish
Sealed notes (task `se-ABC-264`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-11-02, Software Engineer. Build complete. No STOP: ADR-0059 met as written, and the A4 counts equal the Architect's probe to the node. Branch `grugops/ABC-264`, worktree `.claude/worktrees/se-ABC-264`, from main `0b73f51d`. Claim `5efaa6c6`, code `358b5f4a`, then the records commit. Nothing pushed or merged. No game, smoke or Levels lane was run (QE's, after the owner's word).**

- **Design (decision `…1fad1ebe`):**
  - `reverseFutilityCut(position, depth, ply, beta)` in `src/search.ts`: false at ply 0, at depth > 3, at |beta| ≥ MATE_FLOOR, in check, or below three non-pawn pieces. Otherwise `evaluate − 120·depth ≥ beta`. The evaluation comes last.
  - In both `negamax` bodies: null-window only, after the table probe, before the null move. It returns beta and stores nothing.
  - Switch `reverseFutility`, on in `search()` / `chooseMove` only. Doors `searchWithoutReverseFutility` / `chooseMoveWithoutReverseFutility`. Export lists +2 / +1.
  - One allowed helper (`passesZugzwangGuard`), shared with `nullMoveReduction`; its count is unchanged.
- **Acceptance (observation `…470e5bf6`):**
  - **A1 / G4 / F6: MET.** Cross-build on 276 positions against `0b73f51d`, 0 differ on nodes, score and move:
    - new door against base `search()` d1–4: 1 104 rows, sha `98c55487…`;
    - new door against base `chooseMove` to 4: 276 rows, sha `16053ea2…`;
    - every older door against itself, with the same shas as se-ABC-238's base.
    - Non-vacuity: head differs on 449 / 1 104 and 156 / 276.
  - **A2: MET.**
    - The predicate table pins the margin (cuts at eval − 120·d, not 1 cp above, d = 1–3). Every guard returns false, paying 0 evaluations, on a board where the margin would cut.
    - **The mate-band guard is covered on both sides.** The upper side uses a call-through `evaluate` stub, because a real static score never reaches the band.
    - Divergence rows: the head enters the node and leaves it with 0 moves generated and 0 made; the door generates and makes a move, in both recursions.
    - Zugzwang-guard node equality on 10 thin endgames. A source row.
    - Planted variants, each red: no mate band, upper band only, no check guard, margin 100, depth 1–4, PV nodes too, fail-soft return, guard 2, no zugzwang guard.
  - **A3: MET.**
    - Drift d5 on the 190: `search()` **97.33 %** of 187 within 25 cp, max **107 cp**; `chooseMove` **97.33 %**, max **107 cp** (kiwipete/f3g4 1142 → 1035). Cap 160. 0 sign flips, 0 mate-status flips.
    - Mate floor on the 287 at d5: **0 of 189** violated, 0 longer, 0 shorter.
    - Zugzwang: ADR-0050 d9's seven rows play their recorded moves on the shipped `chooseMove` at 9/11/12/8/8/8/8.
  - **A4: MET.** Bar ≤ 0.75×:

    | reading | head nodes | ratio |
    |---|---|---|
    | `search()` d8 kiwipete | 658 971 | 0.5901× |
    | `search()` d8 position-6 | 1 021 190 | 0.6373× |
    | `chooseMove` to 8 kiwipete | 972 596 | 0.6173× |
    | `chooseMove` to 8 position-6 | 299 183 | 0.6282× |

    All four equal the probe's counts exactly. Graded G6: QE's.
  - **A5:** the gates below. **A6:** QE's, after the owner accepts ADR-0059.
- **Re-pointed:** `ABC-229` A3 and both `ABC-229` d5 drift rows, to the new doors. They read their pre-ticket figures.
- **Re-pinned:**
  - export lists;
  - the `quiescenceEvasions` / `quietPromotions` literal maps;
  - QE-208-c's `nullMove` map;
  - **`ABC-086` A6 fixture (ENGINE_DEEP), engine B budget 3 → 5 virtual ms.** With the rule on, the 3 ms engine agreed with the 1 ms engine on 10/10, so the non-vacuity line read 0. At 5 ms they disagree on 2. The assertion is unchanged.
- **No value row moved:** `ABC-249` reads Ke1 404 / Kg1 497.
- **Gates (observation `…d18a94a0`):**
  - lint, typecheck and build exit 0.
  - `npm test` 2 403 passed (base 2 376 + 27). Skips 0; skip-integrity and lane inventory "No findings."
  - 14 deep lanes green. G1 54/58.
  - G8: head median 8.93 s, base 8.73 s (interleaved ×3).
  - G9: levels.ts diff empty. G7: not owed.
  - G5, graded G6, G11 and Levels: QE's.
  - Foreign process: a `fake-oidc` node service, untouched. No foreign vitest. Tctl 69.5 °C.
- **Artifacts (observation `…3042bc54`):** raw evidence in `.grugops/context/se-ABC-264/raw/` (A1 output and script, the A3/A4 lines, the deep summary, G8, the A6 fixture probe).
- **Owed elsewhere:**
  - BA/PM page deltas (ADR-0059 d10);
  - a scribe line naming the new test file's SEARCH_DEEP spelling in `AGENTS.md`.
- **Notes (sealed, 4 of 4 read back):** design `…1fad1ebe`; acceptance `…470e5bf6`; gates `…d18a94a0`; artifacts `…3042bc54`.

### Trace row (10 cells, header order)

| ABC-264 | Reverse futility at null-window nodes, depth 1–3, 120 cp a ply, guarded, behind an off-door pair | EPIC-011 | ADR-0059 (PROPOSED; tightens A3/A4) | NFR-005 A4 MET: d8 0.5901× / 0.6373× (`search()`), 0.6173× / 0.6282× (`chooseMove`), bar ≤ 0.75×; NFR-008 G8 head 8.93 s / base 8.73 s; G1 54/58; G9 met; G7 not owed | grugops/ABC-264 @ 358b5f4a (+ records commit): src/search.ts, src/engine.ts | src/search.reverse-futility.test.ts (predicate table incl. both mate-band sides, divergence rows, zugzwang node-equality, source and literal rows; SEARCH_DEEP A3 drift ×2 with 160 cp cap, 287 mate floor, A4) + re-points/re-pins in quiescence, search.null-move, search, engine tests; npm test 64 files / 2 403 pass, skips 0; 14 deep lanes green; A1 cross-build node-equal to 0b73f51d | — (UAT owed; QE verdict signs; A6 read, smoke, Levels QE's after the owner's word) | — | In Review (branch, not merged; owner acceptance of ADR-0059 gates A6 and merge) |
