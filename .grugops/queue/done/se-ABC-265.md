---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T14:42:30Z
subtask: se-ABC-265
role: software-engineer
ref: .grugops/context/se-ABC-265/
branch: new grugops/ABC-265 from main (at dispatch) — worktree .claude/worktrees/se-ABC-265
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core.
---
# Build ABC-265 (TH-1): one lockless shared transposition table
## Read
plans/tickets/ABC-265*.md (DoR 10/10, reading (b)), ADR-0025 "Proposed amendment 2026-11-02 (ABC-265, TH-1)" incl. the verified-copy rule and T8–T10, ADR-0057 D2.3, arch-ABC-265 notes (…6b1aba14, …e396e5ab), Orchestrator ruling …d39f74ef (no S2 read).
## Do
- Implement exactly the amendment in src/transposition.ts (and only the call sites it names): 4×Uint32 words a slot over one SharedArrayBuffer, XOR check, key split inside probeTable/storeEntry (bigint signatures kept), verified copy used by tableCutoff, plain writes in order 2,3,0,1, Threads 1 node-for-node equal to main.
- Rows: every acceptance row on the page incl. A2 T10 (both cases); ABC-081/122/208 rows must run UNEDITED (needing an edit = stop and report for an Architect ruling). Plant defects for T10 (live score read, live depth read) and the XOR check and show them red.
- A3 identity across the page's fixed-depth sets; A4 G6 vs base + a profile (reported). Fix the four named comments (Scope 7).
- npm test, lint, typecheck, build. Do NOT merge; the merge waits the owner's acceptance of the amendment.
## Fences
Scope per page only. No push, force-push, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-265, contextRoot = worktree's .grugops/context, never the plugin cache); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result

**2026-11-02, Software Engineer. Build complete. No STOP: the ADR-0025 shared-table amendment was built as written, and ABC-081/122/208 rows ran unedited and green. Branch `grugops/ABC-265`, worktree `.claude/worktrees/se-ABC-265`, from main `94be445f`. Claim `3164788d`, code `e5694864`, then the records commit. Nothing pushed or merged; the merge waits on the owner's acceptance of the amendment.**

- **Design (decision `…97c4e2e8`):** in `src/transposition.ts` only. One `Uint32Array<ArrayBufferLike>` over a 4 MiB `SharedArrayBuffer`. Words: `keyLo^data`, `keyHi^score`, `data`, `score`. The key is split inside `probeTable`/`storeEntry`, which keep their `bigint` signatures. A hit needs `w2≠0` and both unsigned XOR equations. Stores write words 2, 3, 0, 1 as plain writes. The verified copy is module-private `hitSlot`/`hitData`/`hitScore`, set by a hit. `tableCutoff` reads only that copy and keeps its signature. `entryMove` still reads word 2 live. The clear zeroes the whole buffer. `tableBuffer()` is the handle ABC-266 will use. The four Scope 7 comments are rewritten. No call site changed.
- **Acceptance (observation `…df9a3b3a`):**
  - **A1 MET:** byteLength 4 194 304. Source rows pass: no 64-bit column, no `Atomics`, store order `[2,3,0,1]`, `bigint` signatures.
  - **A2 MET:**
    - the hit returns move, bound, depth and score;
    - K′ and K″ miss;
    - a torn slot misses in both mixes;
    - a bit-31 key hits;
    - **T10 ×2:** the cutoff returns s_K = 123 after K′ overwrites the slot, both for K′ exact at d with −456 and for K′ at d+1.
  - **Planted defects, each red:** P1 live score read (T10 score row), P2 live depth read (T10 depth row), P3 no XOR (layout, torn and T10 rows), P4 keyHi check dropped (K′/K″ row), P5 signed compare (bit-31 row), P6 store order 0,1,2,3 (source row).
  - **A3 MET:** cross-build, out of tree, base `94be445f`, on the 276-position ABC-078 A3 corpus. **12 186 fixed-depth rows / 149 872 031 head nodes, 0 differ:**
    - `search()` d1–4 (1 104 rows) and `chooseMove` to 1–4 (1 104);
    - on the perft roots, `search()` d5–7 and `chooseMove` to 5–8;
    - 11 search doors and 5 engine doors, each against itself;
    - plus 48 tick-clock `chooseMove` rows, 0 differ.
  - **ABC-081/122/208 rows ran unedited:**
    - default lane: 469/469 across the 10 files that hold them;
    - deep lanes: transposition SEARCH_DEEP 40/40 and ENGINE_DEEP 26/26, null-move 44/44, pvs-lmr 29/29, search 57/57, engine ENGINE_DEEP 78/78.
  - **A4:**
    - **G6 (my reading; the graded G6 is QE's):** 5 interleaved rounds at 4 s. kiwipete median base 9 / head 9; position-6 10 / 10; min 8. F2 does not fire.
    - **Profile (reported, not graded):** se-ABC-253's instruments ran unchanged on the new layout.

      | function | board | base ns/call | head ns/call |
      |---|---|---|---|
      | `probeTable` | kiwipete | ~161 | ~164 |
      | `probeTable` | position-6 | ~145 | ~154 |
      | `storeEntry` | kiwipete | ~32 | ~63 |
      | `storeEntry` | position-6 | ~25 | ~68 |

      Per-call figures are estimates. The pair's share of samples moves from 0.98–1.29 % to 1.04–1.54 %.
  - **A5 MET as read:** 4 MiB; the ABC-081 A7 memory row is green.
- **Gates (observation `…e94151a6`):**
  - lint, typecheck and build exit 0;
  - `npm test` 64 files, **2 387 passed** (2 376 + 11 new), skips 0, lane inventory "No findings.", wall 10 s;
  - G1 54/58, no NEWLY line; G5 max 4 000.8 ms; G9 empty.
- **Artifacts (observation `…d74ae4b4`):** `.grugops/context/se-ABC-265/raw/` holds a3, plants, deep summary, g6, profile and the scripts.
- **Owed elsewhere:** QE (A3 out of tree, graded G6/G7, verdict signs UAT); the owner's accept/decline of the ADR-0025 amendment (gates the merge); the board move (Orchestrator).
- **Notes (sealed, 4 of 4 read back):** design `…97c4e2e8`; acceptance `…df9a3b3a`; gates `…e94151a6`; artifacts `…d74ae4b4`.

### Trace row (10 cells, header order)

| ABC-265 | TH-1: one lockless shared transposition table, four Uint32 words a slot over a SharedArrayBuffer with an XOR check and the verified copy; node-for-node equal at Threads 1 | EPIC-011 | ADR-0025 amendment 2026-11-02 (PROPOSED); ADR-0057 D2.3 | NFR-009 4 194 304 B unchanged (A1/A5); NFR-005 G6 kiwipete 9 = 9, position-6 10 = 10 (SE reading, 5 interleaved); profile probeTable ~flat, storeEntry ~2x (≈ +0.1–0.25 pp of samples); NFR-008 npm test 10 s; G1 54/58; G9 met | grugops/ABC-265 @ e5694864 (+ records commit): src/transposition.ts | src/transposition.shared.test.ts (A1 ×5 incl. source rows, A2 ×6 incl. torn slot, bit-31, T10 ×2; planted P1–P6 red); ABC-081/122/208 rows unedited green incl. 6 deep lanes; npm test 64 files / 2 387 pass, skips 0; A3 cross-build 12 186 rows + 48 tick rows node-equal to 94be445f | — (UAT owed; QE verdict signs) | — | In Review (branch, not merged; owner acceptance of the ADR-0025 amendment gates the merge) |
