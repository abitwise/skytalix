# qe-ABC-303 PREREG, ABC-303 bundle 1. The premises are not met and were overridden by the owner's word (`ADR-0072` L2's drift and audit rows, `ADR-0073` CH3; `orch-2026-10-30a` `…3e73f9f9`). Sealed before any run. **Two lines hold every game: see § 0**

QE/E2E, task `qe-ABC-303`, brief `qe-ABC-303` (Orchestrator, 2026-11-06T13:48:53Z). Shape: `arch-owner-answers-1104b` `…d776c0f0`, which `ADR-0056` D5's dated block governs. No test, build, game or engine run has happened in this hop. A `--dry-run` of C2′'s command printed its argv and started nothing. QE adds no bar and drops none.

## 0. What is held, before any game
The count rows run now. **No game of C2′ or S′ and no Levels run starts under this note.** Two points hold them, and QE decides neither.
- **H1, foreign load during C2′ is left open.** Brief step 3 asks this PREREG to state how it is read "from the page and CF rules", and to stop and ask if the page leaves that open. It does. `ABC-303`'s page has no line on foreign load, on a host condition or on a void of a game read. CF1 to CF10 name faults and losses on time, not load, and CF10 sends a case they do not name to Architect/Design. `ADR-0056` C2′ does not name it either. So there is no line to copy here, and QE does not choose one.
- **H2, the order.** The page's "The read does not start until every row of tables 1 and 2 is met (B6)", § 4 of the shape and the block's "Graded, on the branch, before the read" all put P6 and P7 before C2′. Both are graded timing reads, and brief steps 3 and 4 play games first and read them after. The page says the block governs where it differs. No record rules this order for `ABC-303`. `qe-ABC-283` played first, under that ticket's own rulings, and they do not carry.
- **What releases them:** an answer on the record to each, then an addendum to this PREREG sealed before the first game. It fills H1's line and states the order. A new PREREG does as well.

## 1. The parts (fixed)
- `ABC-286`, P4, `ADR-0072`, form **M3**: T = 4 / 7 / 12, d ≤ 3, key-0 quiets only, three non-pawn pieces.
- `ABC-288`, O2c, `ADR-0073`, form **C1**: the countermove alone. Continuation history is not in the bundle.
- `ABC-289` is not a part.
- The relation (B1): (a) a shared file; (b) P4 reads the order O2c moves; (c) P4 is held and O2c is marginal.
- The premises are not met. They were overridden by the owner's word.

## 2. The builds
- Bundle ticket: `ABC-303`, on branch `grugops/ABC-303`.
- Candidate: `bb0cc134`, the last code and test commit; `src/` tree `bba42fb7`. The tip `63667fc8` adds records only and has the same `src/` tree.
- Base: the merge-base `38914841`; `src/` tree `5bd2f414`. `main` `ffdc0db0` has the same `src/` tree, so the candidate is not stale. Value-changing merges on `main` since `0cc9afd1`: `ABC-282` `a6ae8227` (`src/engine.ts`, `src/uci-session.ts`).
- Production diff, base to candidate: `src/engine.ts`, `src/search.ts`. UAT is not waived; QE's verdict signs it.
- Harness: `tools/rating/` tree `8f03fe47`; `cutechess-cli` and `stockfish` sha256 checked against the pins in `rating.ts`: yes (`dc776901…`, `c78c22a9…`).
- Arms, out of tree in `<scratch>/qe303`: B = `git archive 38914841`, H = `git archive bb0cc134`, A = H with the audit hooks. `diff -r` of H's `src/` against this worktree's is empty. H2, the `NFR-008` twin, and the full-tree timing arms are made at the timing stage.
- Scripts: `raw/scripts/`, sha256 prefixes `drv.ts` 33dd73f4, `audit.ts` 10525151, `rows.sh` 4d9ae6d0, `gates.sh` eadae049, `lines.tsv` 0b2d57c2. `drv.ts` and `audit.ts` are QE's own. The audit hooks are not: the build has none, so A carries `se-ABC-303`'s `raw/audit_patch.py` (04adecbc), which only counts and logs. R2 is thus independent in its reader and not in its hooks.

## 3. The control and the intent (fixed)
- Control: 100 ms a move on both sides (`st=0.1`), `timemargin` 50 ms, level 5, self-play, openings 1–50 with both colours, one game at a time.
- Intent: **GAIN**. Both parts fire at 100 ms (`ADR-0072` d10, `ADR-0073` d11). The NEUTRAL line (43.0) does not apply.
- R-TC: the rules read no budget, deadline or environment.

## 4. The rows, copied from `ADR-0056` D5's dated block, and how each is read
**Table 1.** Read all on, and per part only on a red (B3).

| # | row | bar | on `0cc9afd1` |

**Table 2.**

| # | row | bar | on `0cc9afd1` |

- Base production `src/` equal to `0cc9afd1`'s: **no**, `ABC-282` moved it. So the door's counts are read on `38914841`, both sets are listed, and no bar moves.
- The read does not start until every row of tables 1 and 2 is met (B6). A red there is a defect or a STOP, not a miss.

**Sorted.**
- **Count reads, this stage:** S1, S2, S3, S4, S5, S6, S7, P1, P2, P3, P4, P5, P8; R1, R2, R3, R4, R6, R7. Fixed depth, or `maxNodes` on a frozen clock, or `G1`'s virtual clock, so load cannot move a figure. P8's `npm test` is read for its counts, and its wall is no reading.
- **Game reads, held by § 0:** C2′, S′, the Levels lane.
- **Graded timing reads, not in this stage:** P6 (`G6`), P7 (`NFR-008`). **Reported timing read:** R5 (`G2`).

**How the count rows read** (`drv.ts`, each mode its own process, its own lock hold, `rows.sh`):
- S1: the all-off door on H against shipped `search()` / `chooseMove` on B; nodes, score, move and depth, 12 rows. S2: every door B exports against the same door on H, on kiwipete and position-6; `search` doors d5, `searchWithoutPruning` and `searchWithoutPruningOrQuiescence` d3, `chooseMove` doors d6, as `se-ABC-303` read them.
- S3: PREREG `…aa5c4dc1`'s B1, B2 and six B3 rows on the 287. S4: `ADR-0050` d9's table, copied from the ADR. S5: the 58 at the baseline's budget and virtual clock.
- S6, S7, R1: depth 5 on the 190, both recursions, head against P4's door, O2c's door and the all-off door.
- P3, R3, R6, R7: d8 nodes on all four arms. P4, R6, R7: `chooseMove` at 47 000 nodes on the 190. P5: `countermoveByteLength()`.
- P1: `src/search.bundle.test.ts`, default and `SEARCH_DEEP`, verbose. P2: the source of both recursions read against `ADR-0072` d1–d3 and `ADR-0073` d1–d6, and `moveCountNode` called directly.
- P8: typecheck, lint, build, skip count, `test-skip-integrity`, `lane-inventory`, and the run rule's **23** `-t` lines by count: `ABC-167` A5 4 passed, every other 1 passed (`ADR-0046`, `arch-ABC-307-records`).

**Foreign load on the count rows, recorded only.** The page names no method, so this is QE's record and no reading rides on it: load1 and a count of busy node-class processes before and after each hold, by class and never by argv. A count cannot move with load.

**A red.** S1, S2, P1, P2, P5: a defect, back to the Software Engineer. S3–S7: B3, read per part, name the cause, and no fix here. **P3, P4 on an exact build: a STOP.** A count differing from `…bd60978c` on this unchanged production tree is explained before anything else is read. Nothing is tuned.

## 5. The reported rows (table 3)

| # | row | read on | on `0cc9afd1` |

Read with the offline rows, each printed beside the figure on `0cc9afd1`, no verdict on them. R1, R2 and A0 stand on `se-ABC-303-main2`'s unchanged-source proof; QE still re-reads R1 and R2, as the block has it. R5 waits for the window.

## 6. The read: once, in this order, each in one `flock <scratch>/host-test.lock` hold with nothing else in it. Held by § 0
1. **C2′:** `node tools/rating/rating.ts d bb0cc134 38914841 <out> --budget-ms 100 --rounds 50 --concurrency 1`.
   - **MET:** 100 of 100 games complete, 0 candidate faults, 0 losses on time, and a score **≥ 50.0 of 100**. The harness's `state:` label is not the verdict.
   - **Below 50.0:** NOT MET, final. Nothing merges, QE records a `failed-attempt` naming the bundle, and both parts return by B6. No re-play, no margin, no change of form, no subset.
   - **A base fault:** UNRESOLVED, re-run once.
   - **A harness or launch error before the first game** is not a read. It is recorded and the same command runs once more. Once a game has started, the read is the read.
   - **Foreign load during C2′: OPEN (§ 0, H1).** The harness records `host.log` either way. No game starts until this line is filled.
2. **S′, a bar:** `node tools/rating/rating.ts r bb0cc134 <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`. E as pinned at the PREREG: 1 810, the E in force at this seal (`ADR-0056`'s block of `arch-ABC-303-open`, item 2; no step is on the records).
   - **MET:** 10 of 10 complete, 0 faults, 0 losses on time, score ≥ 3.0 of 10. Below 3.0: 10 more games, and ≥ 7.0 of 20.
   - A collapse miss is NOT MET. A fault or a loss on time is a defect, back to the Software Engineer.
3. **The Levels deep lane, a bar:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose` on H, alone. MET at exit 0 with every test passed. A failure is a defect.

**CF1–CF10, copied word for word from `ADR-0056`'s dated block of `arch-owner-answers-1105`.** § 6's "A fault or a loss on time is a defect" and "A failure is a defect" are read through them.

- **CF1. What ends a read.** A candidate fault or a candidate loss on time in C2′ or S′ ends that read with no pass, at any score.
  The match plays out as the harness runs it. Its score is used for CF2 and for nothing else.
- **CF2. The verdict test comes first.** Count each game the candidate lost by fault or on time, and each game not finished, as a
  win for it.
  - **C2′:** below 50.0, the fault could not have changed the verdict: NOT MET, final, B6, and the defect is routed as well. At 50.0
    or above, a read that already scored above the bar included, the fault could have decided it: CF3.
  - **S′, S-4 read whole:** at 3.0 of 10 or above: CF3. Below 3.0 of 10, S-4's 10 more games are played and the same count is
    taken on the 20: below 7.0, NOT MET, final, B6; at 7.0 or above, CF3.
- **CF3. A defect, no verdict.** The Software Engineer names and reproduces the cause, and fixes it. **Nothing is tuned between
  reads:** no form, T, tier, door, margin or table moves (row P2). Tables 1 and 2 are read again. A cause nobody can reproduce is a
  STOP to Architect/Design, with no new read.
- **CF4. One new read on the fixed tree.** One new C2′ under a new PREREG with the same bars, then S′ and the Levels lane in § 6's
  order. It is final. It is not a re-play: the first read returned no verdict, and this is another tree.
- **CF5. A clean low score stays final.** C2′ below 50.0, or S′ below S-4, with 0 candidate faults and 0 losses on time on that
  read: NOT MET, B6. No new read.
- **CF6. A clean C2′, then a faulted S′.** C2′ is clean and MET, and CF2 sends the S′ to CF3.
  - **The fix is value-identical:** test or fixture only; or it reads no clock and nodes, score and move stay equal on S1, S2 and R7.
    C2′ stands and is not played again. Only the faulted S′ is replayed, whole and once, at the sealed E, under an addendum sealed
    first that names the fixed tree.
  - **Any other fix:** C2′ read another engine, so it does not stand. CF4's one new read, final even if it lands lower.
- **CF7. A clean C2′, then a Levels red.** The red is read first by `ADR-0028`, as `ADR-0064` d7 has it: the fixture, then one
  headroom, then the owner. If a fix follows, CF6's two cases apply, with the Levels lane run again, whole and once, at exit 0, in
  place of S′.
- **CF8. A second candidate fault is NOT MET.** A candidate fault or loss on time on any read after a fix (CF4's new C2′ or its S′,
  or the replayed S′) is NOT MET, B6, at any score. No verdict test and no third read. Several faults in one read are one
  event.
- **CF9. Unchanged.** A base fault is UNRESOLVED, re-run once. A harness error before the first game is not a read. C2′'s stale
  rule stands.
- **CF10. Anything else.** A case these lines do not name is a STOP to Architect/Design. No brief decides it.

Reported with the read: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`, the largest overshoot. The credit is the bundle's (B5): no per-part Elo is stated or inferred.

## 6a. The graded timing reads: method sealed, not run
None runs in this stage. Each waits for the owner's word that the whole host is quiet (`…43e6d8fd` 4), checked with `ps` first. The slot gate alone does not protect a read. All three run in one window, each in one hold, alone.
- **P7, `NFR-008`:** arms B = `38914841`, H = `bb0cc134`, H2 = `cp -a` of H; `qe-ABC-307`'s `n8.sh`, `stage.inc.sh`, `fsample.sh`, `flags.py`, `n8-grade.py` unchanged but for the expected counts: B 71 files, 2 710 passed; H and H2 71 files, 2 734 passed; 0 skipped, 0 failed. Order rotates, round 0 discarded, 8 complete scored rounds or 12 in all. **MET:** twin admissible, H's graded median ≤ 10 s, wall R ≤ 10 s, **and H − B ≤ +0.10 s** in paired median wall. **VOID**, `…b9038a14`'s line: more than 2 of the 8 rounds flagged, an inadmissible twin, or under 8 rounds. A void is not a miss. **A red: a row move first**, and with no row left it goes to the owner (`…f30bd604` 2, `…ad217a34` 4).
- **P6, `G6`:** `qe-ABC-283`'s `g6.mjs`, `timed.mjs`, `host.mjs`, `g6` mode only, with `fsample.sh` beside it: 5 interleaved rounds per board per build at `LEVELS[5]` 4 000 ms, kiwipete and position-6. **MET:** on each board H's median completed depth ≥ B's, and every run ≥ depth 6. **VOID:** more than 1 of the 5 rounds holds a run with a busy foreign vitest in its window. Depth 7 is a WARN. **A red on an exact build is a STOP. It is not re-played.**
- **R5, `G2`, reported:** `drv.ts nps`, `search()` d8, arms alternating, best of 5, door / head.
- One re-read of a void read fits the same window. A void read is re-read under a new note, and a miss is never re-read.

## 7. Before the merge (B4)
`main` is merged into the branch, with no rewrite. Tables 1 and 2 are read again on the merged tree, with no games. Games run again only under C2′'s stale rule: a value-changing merge has moved the base. **The stale rule:** a read whose base another value-changing merge has since moved is read again (≈ 25 min).

## 8. The forecast
The page's estimates, read first: C2′ about 0.4 h, S′ about 10 min, the Levels lane about 10 min, 44 min in all. QE's: the count rows about 17 min (`se-ABC-303-main`'s `exits.txt`, the same modes), the gates and 23 lines about 4 min, so about 21 min for this stage; the timing window about 12 min. **All in one stage would read about 77 min, over 1 h, so they do not share one:** count rows now, 21 min; timing, 12 min; games, 44 min. Each is under 1 h.

## 9. The verdict
- **MET:** every row of tables 1 and 2, C2′, S′ and the Levels lane. QE's verdict signs UAT. The reported rows go in the report with the gaps.
- **On MET and the merge:** `ADR-0072` and `ADR-0073` are in force, and a dated line names the ticket and the read (B5).
- **NOT MET:** B6. `ADR-0072` and `ADR-0073` return to PROPOSED, premise not met, and the pages to held.
- No verdict comes from this stage.
