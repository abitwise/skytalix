---
subtask: bapm-ABC-222-epic009-m1
role: ba-pm
ticket: ABC-222, EPIC-009
ref: .grugops/context/bapm-ABC-222-epic009-m1/
branch: new grugops/bapm-ABC-222-epic009-m1 from main ae7211c3
width: records only (an SE runs beside you)
---
# BA/PM: ABC-222 read PASS (merged ae7211c3) — close it; grade EPIC-009 milestone 1
Read qe-ABC-222 notes (`…cc542c76` verdict, `…00cc4db1` reading, `…4daf292f` findings), EPIC-009 (M1–M4, milestones), ABC-220 (Done),
ABC-221, ABC-223.
- Close ABC-222 (Done; QE verdict signs UAT; QE-222-a build-tip note; QE-222-f resolves the PGN-precision question).
- Grade EPIC-009 milestone 1 (simple-tournament) against M1–M4 from ABC-220 + ABC-222 readings; record RISK-EPIC009-02/03 not
  exercised (QE-222-d/e). Milestone 2 (ABC-221, ABC-223) state and pull order.
- Note for Security/NFR (no catalog edit here): AR-NFR004-A at 22 s through the real pipe max +2 ms (QE-222-b).
- While there (LOW, records): QE-225w1-b — restate ABC-225/EPIC-010's 400-game pair estimate (18.5 h projected at width 1, was 22–24 h).
Fences: records only (tickets, epics, notes). No src/, tools/, data/, ADRs, catalog. Never push, force, amend, rebase, merge into main. No board edits. Never bare npx/npm exec. No host paths. Wait on jobs via output file or `kill -0 <pid>`, never `while pgrep -f`. Seal with context-io admitAndAppend (host is shared with an SE, which is fine for records).
Publish: notes (task `bapm-ABC-222-epic009-m1`), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**Done (records only), `grugops/bapm-ABC-222-epic009-m1` @ `b4f3363c`, from `main` `4bd9ac6a`.** Notes sealed with
context-io `admitAndAppend`: decision `…149c0aee` and observation `…e84baed7`, both read back.

- **`ABC-222`: Done.** It is `status: done` with a `closed:` line, merged `ae7211c3` on QE's PASS (`…cc542c76`). **The
  QE verdict signs UAT.**
  - A CLOSED block lists A1–A5 and A7 MET and A6 reported.
  - QE-222-a: the tip `19d18df1` build is accepted under the RE-SCORED rule.
  - QE-222-f closes A5's PGN-precision `UNKNOWN - verify`, inline: ≥ 10 s prints to whole seconds, so `22s` reads
    < 22 500 ms.
  - Test note 3 did not fire.
- **`EPIC-009` milestone 1 MEETS M1–M4** (a MILESTONE 1 DONE block with a grade table):

  | # | read | grade |
  |---|---|---|
  | M1 | 0 losses on time; closest call 19 991 ms | MET (`simple-tournament`) |
  | M2 | least 88.00 % over 10 side-periods | MET (`simple-tournament`) |
  | M3 | `ABC-220` A8: 0 differences in 4 200 rows | MET at the build |
  | M4 | 0 bounds moved without the owner's word | MET |
  | ceiling | longest move 22 002 ms, below 22 500 | MET |

  - **`RISK-EPIC009-02` and `-03` are recorded as not exercised** (QE-222-d, -e), in the block and inline.
  - `-01` and `-04` carry their readings inline.
  - The pipe latency, the `tc=40/900` spelling and cutechess sending `movestogo` are closed inline.
  - Tickets table row 2 now reads Done.
- **Milestone 2:**
  - **`ABC-221`: Ready 10/10, pullable.** Its after-`ABC-222` and after-`ABC-244` lines are both met. It shares
    `src/uci-session.test.ts` with `ABC-243` and `ABC-242`, which is rebase order only. The board's order
    `ABC-243` → `ABC-242` → `ABC-221` stands.
  - **`ABC-223`: Backlog 9/10**, waiting on `ABC-221`.
    - Its all-10 trigger does not fire: the overhead max was +2 ms, against the 300 ms trigger.
    - A5 and A6 take ms from the `go` clock deltas.
    - The budget derivation is `UNKNOWN - verify` at PREREG.
  - Dated lines were added on both pages.
- **For Security/NFR (no catalog edit made):** `AR-NFR004-A` at 22 s through the real pipe reads max +2 ms, median 0,
  over 561 searches (QE-222-b). It stands with its number.
- **QE-225w1-b (LOW): the estimate is restated.**
  - A 400-game R pair at width 1 is **about 18.5 h ALONE (17.5–19.4 h), plus about 1 h of QE**. It was about 22–24 h,
    which stays as the slow case.
  - The source is `ABC-225` A6's 21.67 games/h over 40 games.
  - It is restated on `ABC-225` and on `EPIC-010` (a top block, the FOLDED A6 line and the cost table's batch row).
- **For the Orchestrator:**
  - `ABC-225`'s page still reads `status: in-development`, while the board has it Done (`59dc3ab4`). Its merge fold is
    owed, outside this brief.
  - `EPIC-010`'s milestone 1 total ("≈ 15 h") predates the width-1 ruling and was left as is.
  - `EPIC-009`'s column stays Backlog, because milestone 2 is open. Board moves are yours.
- **Checks:**
  - `git diff --check` is clean.
  - The host-path, login and host-name scan of the added lines found 0 hits.
  - `node tools/grugops/reference-check.js` exits 0 on all 14 changed files.
- **Not touched:** `src/`, `tools/`, `data/`, the ADRs, the catalog, the board and the trace files. Nothing was pushed,
  forced, amended, rebased or merged.

### Trace row (10 cells, header order)

| ABC-222 (closed) + EPIC-009 milestone 1 (graded) + ABC-221/223 (milestone 2 state) + ABC-225/EPIC-010 (400-game estimate restated) | QE PASS `qe-ABC-222` …cc542c76 signs UAT; M1 closest call 19 991 ms ≥ 500, M2 min 88.00 % ≥ 75 % over 10 side-periods, M3 0/4 200 diffs (ABC-220 A8), M4 0 bounds moved without the owner, ceiling 22 002 ms < 22 500; RISK-EPIC009-02/03 not exercised | EPIC-009, EPIC-010 | — | NFR-004 (22 s read < 22 500 ms, MET 22 002 ms); AR-NFR004-A at 22 s real pipe max +2 ms (Security/NFR to place); AR-UCI-BUSY stands; notes sealed …149c0aee, …e84baed7 | grugops/bapm-ABC-222-epic009-m1 @ b4f3363c (records only): ABC-222, EPIC-009, ABC-221, ABC-223, ABC-225, EPIC-010, .grugops/context/bapm-ABC-222-epic009-m1/ | none run (records only); figures from qe-ABC-222 …00cc4db1/…4daf292f, qe-ABC-220 …7a09c5e1, qe-ABC-225-w1 …7e9bd36f | ABC-222 UAT signed by the QE verdict (owner delegation) | — | ABC-222 Done; EPIC-009 milestone 1 MEETS M1–M4, epic open on milestone 2; ABC-221 Ready 10/10 pullable; ABC-223 Backlog 9/10; 400-game width-1 pair ≈ 18.5 h; board moves the Orchestrator's |
