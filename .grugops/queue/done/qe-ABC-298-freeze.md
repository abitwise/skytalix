---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T20:27:59Z
subtask: qe-ABC-298-freeze
role: qe-e2e
ref: .grugops/context/qe-ABC-298-freeze/
branch: new grugops/qe-ABC-298-freeze from main — worktree .claude/worktrees/qe-ABC-298-freeze
width: ADR-0077 d9 step 4, the freeze. Records and frozen figures only. No src/ edit, no build, no timing, no games.
---
# ABC-298: QE's freeze, before the build
The count probe read GO (…d097e25f). main's src/ tree is bba42fb7. Read ADR-0077 whole, esp. d3 (identity duty), d6 (SG0–SG2), d9 step 4; ABC-298's page.
1. Freeze on main's tip exactly what d9 step 4 lists: SG1 (a)'s table (nodes, root move, score); base's SG1 (b) outputs as a digest; the blob hash of src/perft.test.ts with the deep perft read 32/32; every door and deep row on main by file and title with its figures; the files that mock legalMoves; and anything else step 4 names. Deep lanes: `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run <file>` with one worker; "no tests" is a failure.
2. Write SG2's hand cases from ADR-0077's words alone (no patch exists; read none, write none), including a seeded illegal hash move that must never be made.
3. Seal one decision note: main's tip and src/ tree, each frozen file with its sha256, what each row expects. Name the freeze commit so step 5's check can run.
Every run under the host lock: `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`, one core, one at a time. No timing figure. If anything in d9 step 4 reads two ways, STOP to Architect/Design. Fences: your task records. No src/, ADR, ticket, EPIC or board. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.

## Result

**Done: `ADR-0077` d9 step 4, the freeze, on `main` `69a8abf6` (`src/` tree `bba42fb7`), with no patch in the world and none read or written.**
- **The freeze note** is `20261108T212842Z-qe-e2e-decision-44a6717d` (sealed). Its gaps note is `20261108T212842Z-qe-e2e-observation-1ba0ac40`.
- **The freeze commit is `b9b8eee9`** (`b9b8eee9ffc8c988ad8b0117485dbfeb4d5a80d7`). After this branch merges, step 5 runs `git merge-base --is-ancestor b9b8eee9 main`; its `src/` tree is `bba42fb7`. A build brief cites `…decision-44a6717d`.
- Nothing under `src/` or `tools/` changed, and no ADR, ticket, EPIC or board line. No build, timing figure or game.

**What is frozen** (files and sha256 in the note):
- **SG1 (a)** (`raw/out/sg1a.jsonl`):

  | row | nodes | root move | score |
  |---|---|---|---|
  | `search()` kiwipete d8 | 311 546 | e2a6 | −81 |
  | `search()` position-6 d8 | 163 523 | c3d5 | 71 |
  | `chooseMove` kiwipete 8 | 573 518 | e2a6 | −114 |
  | `chooseMove` kiwipete 9 | 1 320 857 | e2a6 | −128 |
  | `chooseMove` position-6 8 | 94 911 | c3d5 | 45 |
  | `chooseMove` position-6 9 | 234 984 | c3d5 | 34 |
  | `chooseMove` position-6 10 | 523 610 | c3d5 | 64 |

  The depth-8 nodes are the `ABC-303` rows, unchanged. The depth-9 rows equal the probe's `main` copy.
- **SG1 (b), base's `G4` digest:** `g4.jsonl` 16 558 rows, sha256 `b65f747a…`; `g4-sample.jsonl` 264 rows, `2e1534f0…`. That covers 21 search and 16 `chooseMove` entries on the 301, with 0 `pure:false`. Re-read the head with `run-g4.sh` and `join.sh` as frozen.
- **SG0:** `src/perft.test.ts` blob `8fe75ef0`, sha256 `9d928a2a…`. Default 24 / 24; **`PERFT_DEEP=1` 32 / 32.**
- **Rows:**
  - the default lane, 2 734 rows in 71 files, run whole with one worker: 2 734 / 2 734;
  - 33 deep lanes listed, 278 deep rows, with 76 door-titled rows in each lane; every test file's blob;
  - the ADR's four pin lanes run on `main`: engine 105 / 105, uci-session 270 / 270, search.bundle 49 / 49 (mate floor 0 of 191 / 0 of 189), puzzle-suite 18 / 18 (`G1` 54 / 58).
- **Mocks:** 12 files. Two narrow `legalMoves`: `engine.capacity` and `search.capacity`.
- **SG2:** 38 hand cases for (a), all equal to `main`'s oracle, and the planted copy fails 38 / 38; plus the per-square row's specification. (c) is two seeds (illegal Ne7-c6, stale a2-a4) by four searches, reached at remaining 1 and 2 on `main`, made 0 times (8 / 8).

**Lock:** seven holds, 47 min 39 s in all, under the 1 h line (`raw/out/holds.txt`). One core, one process at a time.

**No stop.** Nothing in d9 step 4 read two ways. Readings and limits are QE-298-a to i, all INFO:
- `G4` is `qe-ABC-254`'s harness (QE-298-a to c);
- deep lanes are listed, and only the ADR's pin lanes plus perft were run (QE-298-d);
- the ladder is never run (QE-298-e);
- A06 goes through `parseFenGrammarOnly` (QE-298-f);
- SG2 (c)'s precondition at the head, and where it lives (QE-298-g, h);
- the per-square row is a specification (QE-298-i).

**Commits:** claim `743a4503`; freeze `b9b8eee9`; then this closing commit. Nothing was pushed or merged, and nothing is left running.

### Trace row (10 cells, header order)

| qe-ABC-298-freeze | QE freeze of ABC-298 (V3, ADR-0077 d9 step 4) after the probe's GO and before the build: SG1 (a) 7 rows; SG1 (b) G4 digest on 301 (21 search + 16 chooseMove entries); perft blob + PERFT_DEEP 32/32; every door and deep row listed (2 734 default, 278 deep); 12 mocking files; SG2 (a) 38 hand cases + per-square row, SG2 (c) 2 seeds × 4 searches | EPIC-011 | ADR-0077 (accepted; unchanged by QE) | none graded here | `grugops/qe-ABC-298-freeze` (freeze `b9b8eee9`: notes `…decision-44a6717d`, `…observation-1ba0ac40`) | `raw/out/g4.jsonl.gz` (content b65f747a…), `raw/out/sg1a.jsonl`, `raw/sg2-cases.json`; SG2 oracle 38/38 + planted 38 FAIL; SG2 (c) ref 8/8; default lane 2734/2734; pin lanes green on main 69a8abf6 | UAT owed at the build; not signed by the freeze | QE-298-a..i INFO; no stop | freeze done; step 5 check after this merges; build brief cites …44a6717d |
