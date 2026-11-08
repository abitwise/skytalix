---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T21:29:44Z
subtask: se-ABC-298
role: software-engineer
ref: .grugops/context/se-ABC-298/
branch: new grugops/ABC-298 from main (673e21bc) — worktree .claude/worktrees/ABC-298
width: ABC-298 build per ADR-0077, node-identical. No timing read, no games, no merge.
---
# ABC-298: build V3 (hash move first at remaining depth 1–2)
**Freeze:** QE's note …44a6717d (task qe-ABC-298-freeze), freeze commit b9b8eee9, an ancestor of main; src/ tree bba42fb7. Your first commit must descend from b9b8eee9.
Read ADR-0077 whole (d1 gate, d2 legality seam, d3's 15-item identity duty, d4 captures-first OUT, d6 SG0–SG2, d12 stop) and ABC-298's page.
1. Build exactly d1–d3: the per-square export in moves.ts (generateMoves not edited), the single-move legality check in legal.ts, the live read in transposition.ts, the gate in negamax. No switch, no door, no captures-first.
2. Prove identity against QE's frozen figures: SG0 perft (deep 32/32, perft.test.ts byte-equal), SG1 (a)'s seven rows exactly, SG1 (b) against the frozen g4 digest using qe-ABC-254's harness, SG2's 38 cases and the seeded illegal-move rows. Add SG2's rows as tests. No existing figure may change.
3. If any identity row reddens and you cannot restore it within d1–d3, STOP to Architect/Design. Never re-pin a figure and never widen or narrow the gate on your own.
4. Gates: typecheck, lint, the default lane whole with one worker, and the four pin deep lanes (engine, uci-session, search.bundle, puzzle-suite). Report the default lane's wall time as information only; NFR-008 is QE's read.
Every run under the host lock: `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`, one core, one at a time, vitest with one worker. Deep lanes: `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run <file>`; "no tests" is a failure. No timing read (SG3 is QE's, on a held host). Fences: src/ files ADR-0077 names, new test rows, your records. No ADR, ticket, EPIC or board. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.

## Result

**2026-11-08, Software Engineer. STOPPED to Architect/Design (brief item 3).** Built on `grugops/ABC-298` from `main` `6f943726`. Commits: claim `12447f09`; build `43fe357e`, the first code commit, which descends from the freeze `b9b8eee9`; rows `05b2ea2f`; then this records commit. Nothing was pushed or merged, nothing re-pinned, no row edited, and nothing is left running.

- **Built** (`…decision-db1b4b5c`): `ADR-0077` d1–d3 as written, in both recursions.
  - `generateMovesFrom` in `src/moves.ts`. `generateMoves` is not edited.
  - `legalMoveFrom` in `src/legal.ts`.
  - `entryMoveLegal`, the live read of word 2, and `HASH_FIRST_DEPTH_LIMIT = 2` in `src/transposition.ts`.
  - The gate in both `negamax`.
  - No switch, no door, no captures-first.
- **The STOP** (`…failed-attempt-999b2535`): three existing source-shape rows read red.
  - `src/search.bundle.test.ts` "ABC-283 (h) … source: each negamax updates once …" counts `recordHistoryCutoff(`: 2 / 1 expected, the head has 3 / 2.
  - `src/search.null-move.test.ts` "both recursions try the null move … return beta", for `search.ts` and for `engine.ts`: no `storeEntry(` between the null-move gate and `legalMoves(position);`.
  - d1 step 5 and d3 item 10 require that second history write and that store. No fix inside d1–d3 keeps the rows green, short of code shaped to hide text from them, which I did not write.
  - **For the Architect:** are these identity rows (F2, d12), or records of the pre-V3 shape, to be re-pointed by a dated ruling? My reading is the second: no figure moved.
- **Readings** (`…observation-0c57c9f0`):
  - SG0: blob `8fe75ef0` unchanged, `PERFT_DEEP` 32 / 32.
  - SG1 (a): 7 / 7 equal to the freeze. QE's `sg1a.mjs` output is `cmp`-equal, and the new `SEARCH_DEEP` rows are green.
  - SG1 (c): default lane 2 779 / 2 782, the 3 red are the STOP's rows. Pins: engine 105 / 105, uci-session 270 / 270, search.bundle 55 / 56 (the STOP's row 1; mate floor 0 of 191 / 0 of 189), puzzle-suite 18 / 18 with `G1` 54 / 58. The test diff adds lines only, and the 12 mocking files are unchanged.
  - SG2 (a): 38 / 38 plus the per-square row.
  - SG2 (b): 0 mismatches, 0 mutations on both walks (285 074 and 518 474 nodes).
  - SG2 (c): 8 / 8 under QE-298-g's precondition.
  - Typecheck, lint and build: green.
  - **Not run:** `G4` (SG1 (b)), owed after the ruling.
- **Default lane wall, INFO only:** 25.97 s, one worker, one core. The 48 new default rows take 48.7 ms in-thread. `NFR-008` is QE's read.
- **Lock:** 20 holds, 16 min 17 s before this commit (`raw/out/holds.txt`).
- **Artifacts:** `…observation-c160708c`.

### Trace row (10 cells, header order)

| se-ABC-298 | ABC-298 V3 build (ADR-0077 d1–d3): hash move first at remaining depth 1–2 in both recursions; generateMovesFrom / legalMoveFrom / entryMoveLegal; SG1 (a) 7 rows and SG2 (a)–(c) rows added. STOPPED: 3 existing source-shape rows red (search.bundle ABC-283 (h) recordHistoryCutoff count; search.null-move × 2, store before legalMoves), required by d1 step 5 / d3 item 10 | EPIC-011 | ADR-0077 (unchanged; ruling owed by the Architect) | NFR-008 not read (QE's); lane wall INFO 25.97 s | `grugops/ABC-298` (claim `12447f09`, build `43fe357e`, rows `05b2ea2f`; notes `…db1b4b5c`, `…0c57c9f0`, `…999b2535`, `…c160708c`) | SG0 32/32 + blob equal; SG1 (a) 7/7 equal; default 2779/2782 (3 source rows red); pins 105/105, 270/270, 55/56, 18/18 (G1 54/58); SG2 (a) 38/38, (b) 0/0 on both walks, (c) 8/8; G4 not run | UAT owed at the build; not signed | STOP to Architect/Design: 3 source-shape rows vs d1/d3 item 10 | Architect's ruling (re-point the 3 rows, or d12); then G4, NFR-008, QE |
