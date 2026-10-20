---
id: 20261020T192200Z-qe-e2e-observation-abc177-open-points-u8-u1-u7-gap-probes-02deb2e2
kind: observation
by: qe-e2e
task: qe-ABC-177
at: 2026-10-20T19:22:00Z
verified_by:
confidence: high (each probe run at base and tip, and on the whole default lane at the tip); the severities are QE's judgement
sealed: false
refs:
  - ABC-177
  - ADR-0046
  - ABC-167
  - ABC-171
  - QE-177-a
  - QE-177-b
  - QE-177-c
  - QE-177-d
  - 20261020T180000Z-ba-pm-decision-abc177-cut-step-1000-ruled-for-h-and-l-not-h-prime-e7b3c210
  - 20261020T185816Z-software-engineer-observation-abc177-coarse-step-search-shape-90221b3e
  - .grugops/context/qe-ABC-177/probe/gap/
---

# `ABC-177` open points, graded only (nothing fixed). U8 at 100 still pins ABC-171 A7. U1–U7 at 1 000 leave **one** time-limit behaviour unpinned (`QE-177-b`). The fold drops one cross-session kill (`QE-177-a`)

Hand-authored and unsealed. The ticket page's § Scope and § BA/PM ruling are authoritative.

**Method.** `probe/gap/gp.mjs` applies one wrong build at a time to scratch archives and restores and compares it
after each run. These are **gap probes (QP*)**: they are not in the frozen A6 list and are not used for parity. Each ran
three ways:
- the whole `src/uci-session.test.ts` at base;
- the same file at the tip;
- `npm test` (the whole default lane, bounded at 60 s) at the tip.

| probe | wrong build | file at base: red rows | file at tip: red rows | whole lane at tip |
|---|---|---|---|---|
| QP0 | none (control) | 0/126 | 0/126 | 0/1 987 |
| **QP1** | `held` hoisted to module scope (cross-session state) | **both U1 rows** | **0** | **0/1 987: survives** |
| QP2 | the mid-iteration time abort disarmed (`countNode` still reads the clock, never aborts on time) | 15 non-unit rows (A5, A6-d1, A7-f2/f3/i3, 171 A2/A6, 174 A5) | the same 15 | **19 red** (+engine A2/A3, transposition A5) |
| QP3 | the loop-top deadline test removed (clock still read) | 12 non-unit rows | the same 12 | exit **124** (hang, killed at the 60 s bound) |
| QP4 | `clearTable()` removed | suite crash (table never allocated) | the same | invalid probe; replaced by QP4b |
| QP4b | the transposition table is never cleared after its first allocation | **both U1 rows** | 1 (A7 `searchmoves`, class C, unchanged) | **24 red** |
| QP5 | level-5 budget 3 000 → 2 500 (G inside one step-1000 interval) | 14, **including all 6 U7 rows** | 8, **no U7 row** | **16 red** |
| **QP6** | a dropped `depth`/`nodes`/`mate` token on a `go` with no time token shortens G to 2 500 | **all 6 U7 rows** | **0** | **0/1 987: survives** |

## U1–U7 at step 1 000: is any time-limit behaviour left unpinned on the default lane? **Yes, one (`QE-177-b`)**
- **What step 1 000 does to the search.**
  - The reads come at 0 (start), then at the loop tops: 1 000, 2 000, 3 000. The 3 000 read is not below the deadline,
    so the search stops there.
  - That is 655 nodes, and `countNode`'s abort branch is never reached.
  - Class L's `time` prints the elapsed read, 4 000.
- **The mid-iteration abort (QP2) and the loop-top deadline (QP3) are not a loss.**
  - U1–U7 killed neither at **base** either: H and L rows read no `time`, or only `≥ 3 000`.
  - The default lane still kills both: QP2 by 19 rows in 3 files, QP3 by 12 rows plus a lane hang at the bound.
  - The hold path's own mid-iteration abort stays pinned by **A6-d1** (`go ponder`, class P, step 100, pinned 3 000–3 200,
    unchanged). It reds under QP2 and QP5.
- **What is lost: the bound on G for a dropped limit token (`QE-177-b`, LOW).**
  - U7's six rows are the only default-lane rows that read `time` after a dropped `depth`/`nodes`/`mate` token on a `go`
    with no time token.
  - At step 100 their `time ≥ 3 000` caught any G cut below about 2 900 ms. At step 1 000 it catches only cuts to
    ≤ 2 000 ms.
  - So the blind band on that path grew from about 100 ms to about 1 000 ms. QP6 (G 2 500 on that path only) is red on
    all 6 U7 rows at base, and survives the whole default lane at the tip.
  - The same widening on the global G (QP5) stays covered by 16 other lane rows, so it is INFO (in `QE-177-d`).
  - This is the ADR's own caveat ("the kill set may depend on it").
  - Parity cannot see it, because no frozen mutant cuts G on that path. Ruling condition 2 cannot see it either: it
    counts clock checks, and 3 ≥ 2.
  - It is in-ticket as written. Remedies are BA/PM's (a new ticket; ABC-177 is not widened): accept; or a test-only
    row/bound on the dropped-token G; or U7 back to step 100 (about 0.9 s in-thread per `probe/uci-rows.out`).

## U8 at step 100: does it still pin what ABC-171 needs? **Yes, as A7 is written. One INFO (`QE-177-c`)**
- **In-ticket.** The ticket admits {10, 100} for U8. Condition 2 governs step 1 000 only.
- **Still pinned.** ABC-171 A7 asks that two sessions on the same `seededRandom(k)` write the same `bestmove` sequence
  over 3 `go`s, and that the blunder path's info line has no `score`.
  - At step 100, `k = 2` still takes both paths (blunder, engine, engine) and writes the same moves as at step 10: b1c3 (blunder, startpos),
    b1c3 (engine, after e2e4 e7e5), e2a6 (engine, kiwipete) (`probe/gap/u8-shape.txt`).
  - The kill set is unchanged: 167-M46, M45a; 171-S01, S04, S37, S40.
  - The cross-search state probe QP4b is killed by U8 at **neither** step. So U8 lost nothing there, and that state is
    pinned by 24 other lane rows.
- **What changed shape (`QE-177-c`, INFO).** Both level-1 **engine** searches are now depth 1 (29 and 602 nodes). At
  step 10 they reached depth 4 and depth 2 (6 173 and 8 794 nodes).
  - That is because the first loop-top read equals the 100 ms deadline: the multi-check → one-check loss the ruling's
    "why" names.
  - So no UCI row exercises a multi-iteration level-1 search under the session any more. Determinism of multi-iteration
    search is pinned at the engine layer: `engine.test` ABC-170 A3, `levels.test` A7/A10.
  - Whether the brief's "never cutting a search with two or more clock checks down to one" was meant to reach U8 is
    BA/PM's reading. The remedy is one literal (`stepMs: 100` → `10`, +40 960 nodes), as the SE says in `…90221b3e`.

## The fold (A1): lossless within a session; it drops a cross-session check (`QE-177-a`, LOW)
- `handleLine` is synchronous and each dialogue gets a fresh session. So the folded dialogue observes every fact the
  two prefix dialogues did, and A1 is MET as written.
- **But the old row also ran three separate sessions.** Its first session was left holding, and its last assertion
  compared two sessions' output (`twice` toEqual `out`).
  - **QP1** (`held` shared across sessions) was killed by both U1 rows at base. At the tip it survives the **whole
    default lane**: after the fold, no row in the file leaves a hold unreleased before another session starts.
  - **QP4b** was also killed only by U1 within its unit at base, but 24 other lane rows still kill it (INFO).
- Production impact today is low: one UCI session per process. Remedies are BA/PM's: accept; or a test-only row that
  leaves one session holding and asserts a fresh session writes nothing. At step 1 000 it would cost about 655 nodes.

## `QE-177-d` (INFO): losses that stay covered
- QP4b leaves U1 but 24 lane rows still kill it.
- QP5 leaves U7 but 16 lane rows still kill it.
- No action needed.
