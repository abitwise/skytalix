---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T17:33:28Z
subtask: se-ABC-268
role: software-engineer
ref: .grugops/context/se-ABC-268/
branch: new grugops/ABC-268 from main (at dispatch) — worktree .claude/worktrees/se-ABC-268
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core. An Architect timing probe may share the lock — never bypass it.
---
# Build ABC-268 (P3 futility pruning) — build only
## Read
plans/tickets/ABC-268*.md (DoR 10/10 (b)), ADR-0061 (PROPOSED), arch-phase2-p3 notes (…55f7725e, …004b35ed, …e8bec702) and raw/probe (patch, driver incl. audit mode).
## Do
- Implement exactly ADR-0061 in src/search.ts and src/engine.ts: futilityNode/futileMove, switch `futility`, doors searchWithoutFutility / chooseMoveWithoutFutility, every older door turns it off.
- Rows A1–A5 per the page; reproduce the head and door counts and the cut-audit counts exactly (30 272 / 2 943 / 0 flips); plant defects incl. each guard clause and a margin off-by-one, show red.
- G6 vs base (your reading; QE grades), npm test, lint, typecheck, build.
- DO NOT run A6 (100 games, smoke, Levels) — waits owner acceptance of ADR-0061. No merge.
## Fences
Scope per page only. No push, force-push, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-268, contextRoot = worktree's .grugops/context, never the plugin cache); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result

**2026-11-02, Software Engineer. Build complete. No STOP: ADR-0061 met as written, and every head, door and cut-audit count equals the Architect's probe exactly (base `src/` is still tree `f2388e40`, so no re-derived count). Branch `grugops/ABC-268`, worktree `.claude/worktrees/se-ABC-268`, from main `ca6e8506`. Claim `aa652215`, code `df984484`, then the records commit. Nothing pushed or merged. A6 (games, smoke, Levels) NOT run: it waits on the owner's acceptance of ADR-0061.**

- **Design (decision `…a787198c`):** `FUTILITY_MARGIN = [0, 150, 350, 550]` (module-private, never written); `futilityNode(position, depth, ply, alphaIn, beta)` false at ply 0, non-null window, depth ∉ 1–3, alpha or beta in the mate band, in check, else `evaluate + M[d] ≤ alphaIn` (evaluation last); `futileMove(position, move, index)` true for index ≥ 1, no capture, no promotion, no check. Both `negamax` bodies test the node once with `alphaIn` after the table probe, the null move and `legalMoves`, and skip with `index++; continue;`; store unchanged. Switch `futility` on in `search()` / `chooseMove` only, off in every older door. Doors `searchWithoutFutility` / `chooseMoveWithoutFutility`. Export lists +3 / +1. Headers name the switch.
- **Acceptance (observation `…68b320a6`):**
  - **A1 / G4 / F7: MET.** Cross-build on 276 positions against `ca6e8506`: new door = base `search()` d1–4 (1 104 rows, sha `98c55487…`), new door = base `chooseMove` to 4 (276 rows, sha `16053ea2…`); every older door = its base self. Non-vacuity 389 / 1 104 and 181 / 276.
  - **A2: MET.** Boundary rows at d = 1, 2, 3 (true at eval + M[d], false at − 1); seven guard rows each false with 0 evaluations on a node the margin would prune; `futileMove` rows; purity; constant row; source rows; door literal rows. **21 of 21 planted defects red** (margin `<`, 350→351, M[d−1]; each guard dropped; depth widened to 4 with 750; band edge `>`; each `futileMove` clause dropped; skip without `index++`; engine `alpha` for `alphaIn`; engine switch unwired; engine `remaining − 1`; new door on; older door on).
  - **A3: MET.** (a) drift d5 on the 190: `search()` 100.00 % of 187 within 25 cp, max 10 cp (position-3/b4b2 41 → 51); `chooseMove` 100.00 %, max 0; 0 sign flips, 0 mate-status flips. (b) mate floor 0 of 189. (c) zugzwang 7/7 at 9/11/12/8/8/8/8 on the shipped `chooseMove`; zugzwang.004 905 900 / 587 282 (1.54×, h3h4). (d) cut audit (scratch copy, hook never in `src/`): **30 272 firing, 2 943 sampled (1 918 / 966 / 59), 0 flips, 0 ≥ 100 cp, door noise 0** — the exact reproduction counts; QE grades A3 (d).
  - **A4: MET.** d8 head / door: 888 786 / 1 116 785 (0.7958×), 1 262 046 / 1 602 457 (0.7876×), 1 306 981 / 1 575 537 (0.8295×), 391 451 / 476 244 (0.8220×), bar ≤ 0.88×; reach 5.558 → 5.837 (+0.279), 54 deeper, 1 shallower, 6 moves differ. All equal the probe. Firing at d6: 0.8028×, 901 655 skipped.
- **Re-pointed (figures unchanged):** `ABC-229` A3 node ratio and both `ABC-229` d5 drift rows (`src/quiescence.test.ts`) → the new doors. **Grown literal maps:** QE-208-c `nullMove`, `ABC-228` `quiescenceEvasions`, `ABC-229` `quietPromotions`; export lists. **No value row moved, no fixture re-pinned, no zugzwang depth re-pinned.**
- **Gates (observation `…6f57c250`):** lint / typecheck / build 0; `npm test` **2 407 passed** (base 2 376), skips 0, skip-integrity and lane inventory clean; 14 deep lanes green (Levels not run); **G1 54/58**, none newly missed; **G8** head median 8.68 s, base 8.47 s; **G6 (my reading, QE grades): kiwipete median 9 vs base 9, position-6 10 vs 10 — ≥ base on both, floor 6 held, no WARN**; G9 levels.ts diff empty; G7 not owed; G5 real clock, graded G6, G11: QE's.
- **Artifacts (observation `…2e7e2a0f`):** `.grugops/context/se-ABC-268/raw/` (A1, A3/A4 lines, audit output, plants, G1, G6, G8, deep summary, static, scripts).
- **Owed elsewhere:** owner "accept ADR-0061" / "decline it" (gates A6 and merge); QE (A1 own run, A3 (d) graded, A6, G5/G6/G11, UAT); a scribe line in `AGENTS.md` naming `src/search.futility.test.ts` under `SEARCH_DEEP=1`.
- **Notes (sealed, 4 of 4 read back):** design `…a787198c`; acceptance `…68b320a6`; gates `…6f57c250`; artifacts `…2e7e2a0f`.

### Trace row (10 cells, header order)

| ABC-268 | P3 futility pruning: late quiet non-checking moves skipped at null-window nodes of depth 1–3 (150 / 350 / 550 cp), both recursions, behind an off-door pair | EPIC-011 | ADR-0061 (PROPOSED) | NFR-005 A4 MET: d8 0.7958× / 0.7876× (`search()`), 0.8295× / 0.8220× (`chooseMove`), bar ≤ 0.88×; reach +0.279 ply (bar +0.20); G6 SE reading ≥ base (9/9, 10/10); NFR-008 G8 head 8.68 s / base 8.47 s; G1 54/58; G9 met; G7 not owed | grugops/ABC-268 @ df984484 (+ records commit): src/search.ts, src/engine.ts | src/search.futility.test.ts (boundary and seven guard rows, futileMove rows, purity, constant and source rows, door literals; SEARCH_DEEP A3 drift ×2 at 25 cp, 287 mate floor, zugzwang report, A4 d8 ×4, reach) + re-points/literal maps in quiescence, search.null-move, search, engine tests; npm test 64 files / 2 407 pass, skips 0; 14 deep lanes green; A1 cross-build node-equal to ca6e8506; cut audit 0 of 2 943 (30 272 firing); 21/21 plants red | — (UAT owed; QE verdict signs; A6 read, smoke, Levels QE's after the owner's word) | — | In Review (branch, not merged; owner acceptance of ADR-0061 gates A6 and merge) |
