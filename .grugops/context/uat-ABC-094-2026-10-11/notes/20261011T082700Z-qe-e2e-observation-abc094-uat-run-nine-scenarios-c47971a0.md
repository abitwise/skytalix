---
id: 20261011T082700Z-qe-e2e-observation-abc094-uat-run-nine-scenarios-c47971a0
kind: observation
by: qe-e2e
at: 2026-10-11T08:27:00Z
verified_by:
confidence: high
refs:
  - ABC-094
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - N-LOAD
  - src/book.ts
  - data/opening-book/book.json
  - 20261011T082600Z-qe-e2e-artifact-ref-abc094-uat-pack-4b00155a
supersedes:
---

# UAT run `ABC-094`: 9 of 9 scenarios PASS on the real book, twice, byte-identical

This note is hand-authored and unsealed. It is an agent's observation of a run, not a stamp, and not the
owner's acceptance.

**The run.** Worktree on `grugops/uat-abc094`, branched from `grugops/ABC-094-book-probe` @ `7362f1f9`.
Node v26.11.0 on Apple M3, Darwin 25.5.0, load 2.66 / 2.36 / 2.02. Run 1 started at 2026-10-11T08:24:19Z and
is recorded in `probe/harness-RUN-1.txt`. Run 2 matched it byte for byte, so the result is deterministic. The
book's sha256 was `3802f52f…4bb41d` before and after both runs.

## Results

| # | scenario | result | evidence (from `harness-RUN-1.txt`) |
|---|---|---|---|
| S1 | A known opening gets a real book move | **PASS** | 11 of 11 named positions agree with the file. Each answer is a move from that position's entry and legal on the board. Start → `e2e4` (20 in the entry); 1.e4 → `a7a6` (19, "King's Pawn Game"); 1.d4 → `g8f6`; 1.c4 → `g8f6`; Sicilian → `g1f3`; French → `d2d4`; Caro-Kann → `d2d4`; Ruy Lopez → `d8e7` (18); Italian → `f8c5`; Queen's Gambit → `g8f6`; King's Indian → `b1c3`. The transposition gets the same answer from both move orders (`g1f3`). `zobristKey(position)` equals `keyHistory(history)`'s last key at all 11. 0 warnings |
| S2 | Out of book, the book stays quiet | **PASS** | 8 of 8 positions give nothing with `inBook` false: Kiwipete (absent), 1.a4 a5 2.h4 h5 3.Ra3 Ra6 (absent), and five named entries with no moves ("Saragossa Opening", "Ware Opening: Symmetric Variation", "Van Geet Opening: Laroche Gambit", "Nimzo-Larsen Attack: Polish Variation", "Nimzo-Larsen Attack: Symmetrical Variation"). The seed-1 walk runs out after 4 plies (`e2e4 a7a6 d2d4 e7e5`), and the next question gets nothing. 0 throws, 0 warnings |
| S3 | The same seed plays the same opening | **PASS** | 2 separate processes, both exit 0. All 10 whole-book walks (seeds 1–10) are identical, and so are the 100 seed-7 picks at the start. The 10 seeds give 10 different walks |
| S4 | Different seeds give different openings | **PASS** | Replies to 1.e4 on seeds 1–10: `e7e5 e7e5 e7e5 e7e6 e7e5 e7e5 b8c6 c7c5 c7c5 e7e5`, **4 distinct** (bar ≥ 3). This matches QE's 4 |
| S5 | Popular moves come up as often as the book weights them | **PASS** | After 1.e4, 1,000 draws: `e7e5` 50.7 % against a weight of 50.9 %, `c7c5` 20.3 % against 20.2 %, `e7e6` 9.4 % against 10.5 %. The worst deviation is **1.1 pp**. At the start: `e2e4` 49.8 % / 52.6 %, `d2d4` 35.1 % / 34.5 %; the worst is **2.8 pp**. Bar ±5 pp. 0 moves from outside the entry |
| S6 | A missing book does not crash, and says so once | **PASS** (module half) | C1: exit 0, 0 throws, nothing 50 of 50, **1** stderr line `opening book could not be read; playing on without it`, stdout **0 B**. The stderr binding is the harness's (pack limitation 2) |
| S7 | A damaged book does not crash, never plays an illegal move, and says so once | **PASS** | C0 control: legal 50 of 50, 0 stderr lines. C2, C3 and C7 → `…is not valid UTF-8 JSON…`; C4 and C8 → `…has an entry that does not match the format…`; C4b → `…is not a format-1 book…`; C5 and C5b → `…holds a move that is illegal in its position…`; C6 → `…is larger than 1048576 bytes…`; C9 → `…could not be read…`. Every case: 0 throws, **exactly 1** stderr line, stdout 0 B, 0 illegal moves returned, no ESC byte in stderr. C5b played 3 legal book moves before it reached the bad entry, then nothing for the other 47 |
| S8 | The book never goes online and never runs what it reads | **PASS** | 0 network calls in the parent and in all 12 children. `src/book.ts` imports only `./legal.ts`, `./moves.ts`, `./position.ts` and `./zobrist.ts`. 0 `eval` / `new Function` / `import()` / `require()` |
| S9 | Setting the book up costs the game's start nothing | **PASS** (module half) | Reads: 0 at construction, 1 after the first question, still 1 after 100 more |

## Book walks (a record of what the book does on its own, not a pin; weights may change)

The book plays both sides from the start. Plies before it runs out, seeds 1–10: 4, 10, 12, 12, 9, 8, **2**, 10,
12, 12. Seed 7 opens `b2b3 b7b5`, the "Nimzo-Larsen Attack: Polish Variation" entry, which holds no move.
`maxPly` is 12, so no walk can go further.

## Gate at the tree under test (entry criterion, not the UAT evidence)

`npm test` at `7362f1f9`: 1,715 tests passed, 0 skipped, 6.4 s wall, 23.9 s user CPU (load about 2.5).
`npm run lint`: 104 files, no fixes applied. `npm run typecheck`: exit 0.

## Lane cost (reported, not graded)

- **Default lane: +0 test files, +0 spawns.** Nothing was added to `src/` or to the suite.
- **The harness, outside the lane:** 1.73 s wall, 2.46 s user and 0.29 s sys CPU for one full run. It spawns 14
  `node` children (2 for S3, 12 for S6/S7).
