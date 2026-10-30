---
subtask: se-ABC-228
role: software-engineer
ticket: ABC-228
ref: .grugops/context/se-ABC-228/
workflow: agent-factory/workflows/ticket-to-pr (SE hop; QE follows with the smoke pair)
branch: new grugops/ABC-228 from main (24f3e322 or later), own worktree
width: ALONE (A8 forecast is a timing read)
---

# ABC-228: in check, quiescence searches every evasion; none means mate (ADR-0053, ACCEPTED)

Build ABC-228 to its ticket page (FOLDED blocks, DoR 10/10) and ADR-0053 (ACCEPTED 2026-10-30; decision 10 records the
owner's OQ-228-1 answer (ii)). Main now has ABC-235, ABC-240 and ABC-230.

## Do
- **A8 first:** decision 9's G6 forecast on today's main, as the ADR describes, ALONE. Record load1 and Tctl, with no
  cutechess and no foreign vitest (`pgrep -f "[/]vitest"`; wait-clear).
  - ≤ 100 % on both boards: build as designed; G6 is read by its rule.
  - Above 100 %: A9, the re-forecast at 4 000 ms (head at 4/3 of base's time), with a ≤ 133 % bar.
    - ≤ 133 %: build with (ii) as the ticket's Scope 5 says (LEVELS[5] and DEFAULT_BUDGET_MS → 4 000; test pins; the
      `tools/rating/rating.ts` R literal 3000 → 4000 in the same branch; G9 waived on LEVELS[5] only).
    - Above 133 %: STOP and report. That goes back to the owner.
- Decisions 2–4 and 6–9 with their off-door pairs; the acceptance rows in the existing test files; deep rows behind the
  existing flags. Plant faults and see them red.
- Gates: lint, typecheck, `npm test` and build green at every commit; G1, G5, G7, G8 and G9 as the ticket states. Leave G6's
  graded read and the smokes (A7) to QE.

## Fences
- `src/` (and `tools/rating/rating.ts` line 405 ONLY under (ii)) plus tests, the ticket's dated result line, and your context.
  No data/ edits. Own `npm ci --ignore-scripts`. Linters only via `npm run …`. **Never a bare `npx`.** No games.
- Never push, force, amend or rebase. Never merge into main. No board edits. **No host paths in any commit**, intermediate
  ones included.
- Keep scratch files in your own scratchpad subdirectory (`se-228/`). The scratchpad is shared.

## Publish
- Seal notes (task `se-ABC-228`) with `at` from `date -u`: the A8 (and A9) reading, the build, the gates. Commit on your
  branch. Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/. If the worktree
  guard refuses the main checkout's queue, put the done/ move on your branch's tracked copy and say so.

## Result

**2026-10-30, Software Engineer. Done. Branch `grugops/ABC-228` (from main `61d5d629`): code `9bd3c519`, then the records commit (notes, raw, ticket line, this brief). Not merged; nothing pushed. No game was played; no `cutechess-cli` ran. Scope 5 (ii) NOT built.**

- **A8, read first and ALONE.**
  - Host: load1 0.20 → 0.39, Tctl 35.2 → 68.5 °C, 0 vitest, 0 cutechess.
  - Base `61d5d629` at a real 3 s: kiwipete reached d8 in 2 600 813 nodes, position-6 reached d10 in 2 594 402 nodes.
  - Head on a frozen clock to the same depth: 1 543 477 and 2 340 431 nodes (×1.226 and ×1.325 of the door, which equals base).
  - **64.7 % and 98.3 %: ≤ 100 % on both boards.** So `G6` is read by its rule, `A9` does not run, and `LEVELS`, `DEFAULT_BUDGET_MS` and `tools/rating/rating.ts` are untouched (observation `…1f8c9d92`). The position-6 margin is thin, and the graded `G6` decides.
- **Build** (decision `…daf5ded5`):
  - In check below the cap, `quiesce` takes `legalMoves`. It has no stand pat, searches in the same stable `mvvLvaKey` order, and returns `-(MATE_SCORE - (ply + qply))` when there is no evasion. At the cap it stands pat.
  - `quiesce(position, alpha, beta, qply, ply, rules, visit)`. `MATE_SCORE` lives in `quiescence.ts`, and `search.ts` re-exports it.
  - The switch `quiescenceEvasions` is mapped onto module-constant records. It is on in `search()` and `chooseMove` only.
  - The doors are `searchWithoutQuiescenceEvasions` and `chooseMoveWithoutQuiescenceEvasions` (null move on; the engine door has prior keys on). Every older door is off.
- **Re-pins:**
  - export lists ×2; `QE-208-c` maps; the `ABC-208` d5 drift ×2, mate floor and "changes the work" ×2 re-pointed to the new doors;
  - `ABC-081` `A5` −485 → −392;
  - the `ABC-080` tie row's ordered side re-pointed to the door (search() still plays a4b3);
  - the `ABC-079` `A2` "queen vs rook" board was IN CHECK (Rh1+). Its rook moved h1 → h2, and the old board is now an `ABC-228` `A2` row.
- **Acceptance** (observation `…06ece474`):
  - A1: cross-build on 276 positions, the new doors equal base's shipped path (1 104 + 276 rows) and every older door equals itself, with sha-equal output; non-vacuity: 832 of 1 104 rows differ.
  - A2: 6 in-check rows (Q2: −536 against static −548), each equal to a brute force.
  - A3: 6 capture-mate rows (Q1 29 999, exchange 29 997, capture-promotion, e.p., one-evasion 708 not a mate, `search()` d1 MATE − 3).
  - A4: 1.368× and 1.405× (equal to the ADR's reference).
  - Drift d5: `search()` 89.30 %, max 118 cp; `chooseMove` 88.77 %, max 118 cp; 0 flips. Mate floor: 189 of 189.
  - Planted faults: F1–F9 red, then restored. F10, evasions unordered, survives the default lane; the deep `A4` ratio is its detector.
- **Gates** (observation `…e87dea4a`):
  - lint, typecheck and build exit 0. `npm test` 2 211/2 211 (base 2 178). Skips 0, `No findings.`
  - G1 54/58 (= baseline). G8 8.78 / 8.91 / 8.97 s (base not timed in this session: `UNKNOWN - verify`). G9 met (no level value changed). G5 by construction (evasion nodes go through `visit`); the real clock is QE's.
  - Deep lanes green: SEARCH_DEEP ×6, ENGINE_DEEP ×6 (levels 44/44), CLI 11, UCI 5, PUZZLE 18.
- **Gaps:**
  - **`Q-SET` was not frozen by QE before the build.** The SE wrote the 12 rows, so QE's freeze or review is owed.
  - The puzzle lane OOMs at heap 128 via `npm run test:watch`. It was run at heap 400 with the local vitest binary (no npx).
  - One early `npm exec -- vitest` run (npx-equivalent, offline) is reported.
- **QE owes:** the graded `G6` (5 interleaved runs, at 3 000 ms on both sides), `A6` (the smoke pair S-1..S-4), G5's real clock, `G11`, and UAT (the QE verdict signs).
- **Publishing:** `propose_note` was not available. The notes went through the plugin's `context-io` `admitAndAppend`, with its path resolved at run time; 4 were admitted.
- **Queue:** the worktree guard refused a write into the main checkout's `claimed/` (the brief moved there, but its claim.md had to be copied in). This done/ move is on the branch's tracked copy.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-228 | In check, quiescence searches every evasion instead of standing pat; a side in check with no evasion is mated | EPIC-010 | ADR-0053 (amends ADR-0024 d4; ADR-0026 d10 door pair) | NFR-005 A8 forecast 64.7 % / 98.3 % (≤ 100 %, G6 by rule, QE's); A4 1.368× / 1.405× ≤ 1.5×; NFR-008 G8 8.78–8.97 s; G9 met (no level value moved); G1 54/58 | grugops/ABC-228 @ 9bd3c519 (+ records commit): src/quiescence.ts, src/search.ts, src/engine.ts, src/transposition.ts | src/quiescence.test.ts (+ re-pins in engine, search, search.null-move, search.ordering, transposition, capacity ×2, gameend.nfr tests); npm test 63 files / 2 211 pass, skips 0; deep lanes green; A1 cross-build identity sha-equal to 61d5d629 | — (UAT owed; QE verdict signs; graded G6 and A6 smokes QE's) | — | In Review (branch, not merged; G6 + smokes pending) |
