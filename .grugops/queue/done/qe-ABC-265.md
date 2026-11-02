---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T15:30:14Z
subtask: qe-ABC-265
role: qe-e2e
ref: .grugops/context/qe-ABC-265/
branch: new grugops/qe-ABC-265 from grugops/ABC-265 (head cad6ae13; code e5694864; base 94be445f = main engine) — worktree .claude/worktrees/qe-ABC-265
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core.
---
# QE: grade ABC-265 (TH-1, shared table; identity ticket, no game read)
## Read
plans/tickets/ABC-265*.md (DoR 10/10 (b)), ADR-0025 shared-table amendment (PROPOSED; T8–T10, verified-copy rule), se-ABC-265 notes (…97c4e2e8, …df9a3b3a, …e94151a6, …d74ae4b4), Orchestrator ruling …d39f74ef (no S2 read; no game read).
## Do
- Re-read every acceptance row; A3 identity out of tree vs base on your own sample (incl. doors and tick-clock rows); plant at least 3 defects of your own (incl. one the engineer did not: e.g. clear not zeroing, wrong slot index, hit on zero data word).
- Gates: G1, G5, graded G6 interleaved vs base (fallback F2 fires if below base), G7, G8, G9, G11, lint/typecheck/build, npm test ×3 (expect 2 387), skip-integrity, lane inventory. Review the profile (reported, not graded).
- Verdict: PASS / PASS_WITH_GAPS / FAIL with gap ids. Merge waits the owner's acceptance of the ADR-0025 amendment either way.
## Fences
Tests and your records only; no src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-265, contextRoot = worktree's .grugops/context, never the plugin cache); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result

**2026-11-02, QE/E2E (claude-opus-5-5). Branch `grugops/qe-ABC-265` from `grugops/ABC-265` `cad6ae13` (code `e5694864`, base `94be445f`). Every test, build and engine run was under `flock host-test.lock`, one core. No `src/` or test edits, so the count stays 2 387. Nothing was pushed or merged, and nothing is left running.**

**Verdict: PASS_WITH_GAPS.** One LOW gap (`QE-265-a`) and four INFO gaps (`QE-265-b`–`e`). None blocks. A1–A5 are MET, every gate is green, and G6 reads head = base, so F2 does not fire. The QE verdict signs UAT: the ticket is value-identical and has no product surface. **The merge waits on the owner's acceptance of the ADR-0025 amendment.**

- **PREREG (`…1aca37a5`)** was sealed before any graded or timed run. One A3 smoke run before it is disclosed in the note.
- **A1 MET:**
  - the A1 rows are green;
  - the source was re-read by hand: one SAB of 4 194 304 B, no 64-bit column, no `Atomics`, store order 2,3,0,1, `bigint` signatures;
  - only the new test file was touched;
  - typecheck 0.
- **A2 MET:** the 7 rows were read against the page's 5 bullets, including T10 ×2. The code reads w2 and w3 once into the verified copy, and `entryMove` stays a live read.
- **A3 MET, QE's own sample** (`raw/scripts/a3q.mjs`, independent of the SE's), base tree against head tree. **0 differ** in move, score, nodes and depth across:
  - **1 382 fixed-depth rows, 107 390 335 head nodes:** corpus d5, 2-ply descendants, 58 puzzles, game-1 positions, mate and endgame roots up to `chooseMove` 12, four boards at `chooseMove` 9, and all 16 doors against themselves one depth deeper than the SE read;
  - **96 tick-clock rows:** 12 roots × 4 budgets × prior none or repetition;
  - **140 in-process game plies:** consecutive `chooseMove` with `priorKeys`, with `search()` and a door interleaved.
  - The door sets and export lists are equal in both builds.
  - The `ABC-081`/`ABC-122`/`ABC-208` rows ran unedited and green, including 6 deep lanes.
- **A4 / G6 graded: MET.** 5 interleaved rounds at 4 000 ms:
  - kiwipete base 9 8 9 9 9, head 9 ×5, **median 9 = 9**;
  - position-6 base 10 ×5, head 10 ×5, **median 10 = 10**;
  - minimum 8, 0 runs below 7.
  - **Profile (reported):** the SE's figures reproduce. `storeEntry` is about 2× per call (~30 → ~65 ns), `probeTable` is flat, and the pair is ≈ 1–1.5 % of samples.
- **A5 / G7: MET.** Growth from 1 s to 4 s is ≤ 14.7 KB `heapUsed` and 0 `arrayBuffers`. The SAB is counted to the byte, the fixed sum is 4 592 648 B, and the A7 deep row is green.
- **Gates:**
  - lint, typecheck and build 0;
  - `npm test` **2 387/2 387 ×3** (base 2 376 ×3);
  - G8 head median 9.15 s; `N8-LANE` is 6.5 ms for the new file;
  - skips 0; integrity and inventory "No findings.";
  - G1 54/58; G5 max 4 001.3 ms, 0 over 5 000, engine lane 78/78; G9 empty;
  - G11: the same move at all 5 positions.
- **Plants (10, on a scratch copy, restored):**
  - **all 5 expected-red plants are red:** QP1 clear not zeroing, QP2 slot from keyHi, QP3 overlapping stride, QP5 stale copy score, QP9 unsigned score;
  - QP8 (word-2-only clear) reds the pinned layout row (INFO d);
  - QP4 (hit on a zero data word) survives everything: **QE-265-a**;
  - QP6 (hash move from the copy) survives the full A3 too (INFO e);
  - QP7 and QP10 survive as declared (equivalent).
- **Gaps:**
  - **QE-265-a LOW:** the empty-slot term of the hit rule is unpinned. Suggested row: `clearTable(); expect(probeTable(0n)).toBe(-1)`.
  - **b INFO:** before the first clear, head fails silently (store dropped, `probeTable(0n)` → 0) where base threw. This is for `ABC-266`'s design.
  - **c INFO:** only the new file catches a wrong slot index on the default lane. A3 reds QP2/QP3 (47/32 mismatches).
  - **d INFO:** the layout row pins the whole-buffer clear.
  - **e INFO:** no test tells the live hash-move read from a copy read.
- **Notes (sealed, 8 read back):** PREREG `…1aca37a5`; verdict `…d9879b9c`; rows `…2bf04e55`; gates `…b0f94369`; plants `…9d77019b`; gaps `…ace42c34`; profile `…35888132`; artifacts `…65170437`. Raw evidence is in `.grugops/context/qe-ABC-265/raw/`.

### Trace row (10 cells, header order)

| ABC-265 | TH-1: one lockless shared transposition table, four Uint32 words a slot over a SharedArrayBuffer with an XOR check and the verified copy; node-for-node equal at Threads 1 | EPIC-011 | ADR-0025 amendment 2026-11-02 (PROPOSED); ADR-0057 D2.3 | NFR-009 4 194 304 B, G7 growth ≤ 14.7 KB heap / 0 arrayBuffers (QE); NFR-005 G6 graded kiwipete 9 = 9, position-6 10 = 10, min 8 (QE, 5 interleaved; F2 not fired); profile reviewed, storeEntry ~2x, pair ≈ 1–1.5 % of samples; NFR-008 G8 head median 9.15 s; G1 54/58; G5 max 4 001.3 ms; G9 met | grugops/ABC-265 @ e5694864 (+ records commit): src/transposition.ts | src/transposition.shared.test.ts (11 rows); ABC-081/122/208 rows unedited green incl. 6 deep lanes; npm test 2 387 ×3, skips 0; QE A3 own sample 1 382 rows + 96 tick + 140 game plies node-equal to 94be445f; QE plants 10 (5/5 expected red; QP4 survives = QE-265-a) | QE verdict PASS_WITH_GAPS signs UAT (qe-ABC-265 …d9879b9c) | — | In Review → toward merge (owner acceptance of the ADR-0025 amendment gates the merge) |
