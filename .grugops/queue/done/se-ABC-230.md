---
subtask: se-ABC-230
role: software-engineer
ticket: ABC-230
ref: .grugops/context/se-ABC-230/
workflow: agent-factory/workflows/ticket-to-pr (SE hop; QE follows with the smoke pair)
branch: new grugops/ABC-230 from main (d44bf6c1 or later), own worktree
---

# ABC-230: the game's earlier positions reach the search, from the CLI and from UCI

Build ABC-230 to its ticket page (folded, DoR 10/10) and ADR-0054 (ACCEPTED 2026-10-30). The design is in the ADR and in
`arch-ABC-230-reading/…90a3aa31` § 1. The fold is in `bapm-ABC-230-fold/…644cf2af`.

## Do
- `priorKeys` on `EngineOptions`, built by one trim helper. CLI injection keeps `level-seam.ts` free of a runtime
  `history.ts` import, and the licence set stays unchanged. UCI `parsePosition` keeps the keys, emptied on `ucinewgame`, a
  refused `position`, or a bare FEN. The scan rule: path needs one occurrence, pre-root needs two. No TT, quiescence,
  `search()` or door change.
- Acceptance rows A1–A6, A8 and A9 in the existing test files. A6's guard tests must stay green unchanged: a red is a
  build fault, not a re-pin.
- Identity: with no prior keys, and with the root clock at 0, node-equal to base (out of tree, plain node, the ABC-235
  harness pattern).
- Gates: lint, typecheck, `npm test` and build green at every commit; G1, G5, G6 (identity covers it), G7, G8, G9.
- **A7 (the smokes) is QE's, not yours.** Play no games.

## Fences
- `src/` as the ADR names, plus tests, the ticket's dated result line and your context. No tools/ or data/ edits.
- Own `npm ci --ignore-scripts`. Linters only via `npm run …`. **Never a bare `npx`.** No games, no cutechess.
- Never push, force, amend or rebase. Never merge into main. No board edits. **No host paths in any commit**, intermediate
  ones included: leak-scan the staged diff for /home/ and /tmp/claude before every commit.

## Publish
- Seal notes (task `se-ABC-230`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell trace
  row into this brief, then move it and its claim.md to done/.

## Result

**2026-10-30, Software Engineer. Done. Branch `grugops/ABC-230` (from main `c0698ddd`): code `2fbcb380`, notes/raw/ticket line `dad753dc`. Not merged; nothing pushed. No game was played; no `cutechess-cli` ran. Q3 (c) not built (a separate later ticket).**

- **Build** (decision `…5cf9cecd`, artifact observation `…4ee731d9`):
  - `priorKeys` on `EngineOptions`, read-only and never copied. `trimPriorKeys` in `src/engine.ts` is the one trim helper.
  - The pre-root scan is `repeatsBeforeRoot`, after `repeatsInPath`: 2 matches = draw, 1 = not; the path rule is unchanged. A `Heuristics.priorKeys` switch is off on the 3 doors. `search.ts` is untouched.
  - `createLevel(…)(position, priorKeys?)`: the blunder children get prior + root key, one list per call.
  - `createLevelSeam(level, options, keyHistory?)`, injected by `cli.ts`. The licence set is unchanged.
  - UCI `parsePosition` returns `{ position, priorKeys }`. A `ucinewgame`, a refusal or a bare FEN gives `[]`.
- **Re-pins** (outside A6's protected set): the engine export list (+`trimPriorKeys`), the `cli.ts` construction text (+`, keyHistory`) in `engine.test.ts` and `cli.test.ts`, and the `levels.ts` import list (+`zobrist.ts`). The `ABC-081` A6 rows, the `ADR-0011` licence equality, QE-208-c and every bare-FEN node pin are green unchanged.
- **Identity** (observation `…a836f535`): out of tree, plain `node`, base `c0698ddd` vs head `2fbcb380`, over 301 positions (`ABC-078` A3 + `ABC-121`'s 190).
  - `chooseMove` + doors with no list, with `[]`, and with root clock 0 plus adversarial keys: 2 408 rows each, sha `8a50e586b3600107` both sides.
  - Doors with adversarial keys at clock 99: `ba93283af174b6d9` both sides. Levels with no list and with `[]`: `7c44b4a223572997` both sides.
  - Non-vacuity: `chooseMove` at clock 99 with adversarial keys differs on 248/602 rows.
- **Acceptance rows:** A1 (4 fixtures, both colours, in engine + CLI), A2 (UCI ×4 incl. bestmove byte-equal to the CLI seam; startpos H3), A3 (bare FEN / startpos / ucinewgame / refused), A4, A5 (600 → 100; pawn-move cut; castling not a cut; older than clock; 100 cap), A6, A8 (H2 ×2), A9 (H4 + fixtures at clock 0).
  - Planted red, then restored: the count 2→1 (A8, A5), the cap removed (A5), the clock bound removed (A9, A5), UCI handing `[]` (A2, A5), the `ucinewgame` reset removed (A3).
- **Gates** (observation `…f3c542f4`):
  - lint, typecheck and build exit 0 at both commits. `npm test` 2 178/2 178 (base 2 148). Skips 0, `No findings.`
  - Deep lanes green: engine 77, transposition 26, puzzle 18, pvs-lmr 29, null-move 44, UCI 5, CLI 11, levels 44.
  - G1: suite green. G5: clock reads byte-equal (real clock is QE's). G6: covered by identity. G7: no copy, deep growth green. G8: 8.10 / 8.46 / 8.50 s. G9: the LEVELS/DEFAULT/HARD_CEILING lines are unchanged, but `src/levels.ts` itself changed (createLevel).
- **QE owes:** A7 (the smoke pair with the repetition-ending count), G5's real-clock read, G6's interleaved runs if wanted, and UAT (QE verdict signs).
- **Gaps:** the scan cost on this host is `UNKNOWN - verify` (S-2 reads it). The refused-`position` reset is unobservable from outside, so its row asserts that no search runs. A2 reaches the endgame fixtures with `position fen F moves …`; `startpos moves` is covered by H3 and A5.
- **Publishing:** `propose_note` was not available. Notes went through the plugin's `context-io` `admitAndAppend`, with the path resolved at run time. 4 admitted. One `artifact-ref` was refused, because it needs a §14 gate `sha`/`gate_run`/`content_hash`; it was re-recorded as an observation. No bare `npx`.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-230 | The game's earlier positions reach the search, from the CLI and from UCI; a pre-root repetition needs two earlier occurrences; a bare FEN has none | EPIC-010 | ADR-0054 (amends ADR-0002 cl.3, ADR-0044 D2/D6) | NFR-009 ≤ 100 keys read, no copy, growth green; NFR-005/NFR-004 identity (no keys = base, clock reads equal); NFR-008 G8 8.5 s; RISK-EPIC010-06 bounded by A5 | grugops/ABC-230 @ 2fbcb380 (+ notes/raw/ticket line dad753dc): src/engine.ts, src/levels.ts, src/level-seam.ts, src/cli.ts, src/uci-session.ts | src/engine.test.ts, src/levels.test.ts, src/cli.test.ts, src/uci-session.test.ts; npm test 63 files / 2 178 pass, skips 0; deep lanes green; identity 2 408 rows sha-equal to c0698ddd | — (UAT owed; QE verdict signs; A7 smokes QE's) | — | In Review (branch, not merged; A7 smokes pending) |
