---
subtask: arch-g8-headroom
role: architect-design
ref: .grugops/context/arch-g8-headroom/
branch: new grugops/arch-g8-headroom from main 14c8aafa
width: records + light reads (an SE runs npm test beside you; no timed reads)
---
# Architect: NFR-008 default-lane headroom is 0.10 s — how do we win it back? (QE-229-a MEDIUM; SEC-REBASE-b LOW)
## Read
plans/nfr-catalog.md NFR-008 (+ re-base to oeselg-devl), ADR-0035 (load1 ≤ 8 gate), ADR-0027 (virtual clock), qe-ABC-229
`…0b7fd4f6` (G8 9.90 s base and head; per-file cost; src/uci-session.test.ts ≈ 2.0 s/run since ABC-220), qe-ABC-220 A12/G8, and
the queued tickets that add default-lane rows: ABC-243, ABC-242, ABC-221.
## Do
- Rank the default lane's cost by file from the QE records (do not time anything yourself).
- Options: (a) make slow rows cheaper with no coverage loss (e.g. ABC-220's uci-session rows — why ≈ 2 s on a virtual clock?),
  (b) move named rows to an opt-in lane (say which, and what coverage the default lane then loses), (c) re-read the bar on the 24-CPU
  reference (SEC-REBASE-b: does load1 ≤ 8 still mean what it did on 8 cores?), (d) raise the 10 s level — owner's call only.
- Recommend one, with a target (e.g. ≤ 9.3 s) and the ticket(s) to cut. If (d) or an NFR bound moves, name the owner question.
## Fences
Records only (ADRs, your notes). No src/, tools/, data/. Run no timers or benchmarks. No board edits. Never push/force/amend/rebase/merge
into main. No host paths. Draft a seal script (context-io admitAndAppend only) if sealing needs node. Never `while pgrep -f` loops.
## Publish
Notes (task `arch-g8-headroom`), commit, `## Result` here, brief + claim to done/.

## Result
- **Per-file cost at `ABC-229`** (QE's `g8-perfile.txt` head medians, plus QE's `G8` run-6 JSON for shape):
  - 2 slots, so wall ≈ 0.35 s + Σ slot-seconds ÷ 2, with Σ ≈ 19.1.
  - Per-file worker start and imports ≈ 7.8 slot-seconds (`ADR-0040`).
  - `src/cli.test.ts` children ≈ 3.4 (`N8-SPAWN`, `C2`).
  - Test bodies 8.0: `uci-session` 2.0 s, `search.null-move` 1.44, `cli` 1.33 (+3.4 of collect, which makes it the
    costliest file), `engine` 0.53, `qe-hop-integrity` ≈ 0.28. Nothing else is over 0.14.
- **Why `uci-session` costs ≈ 2 s on a virtual clock:**
  - A search costs about 1 024 × (budget ÷ step) nodes (`ADR-0027`). At level 5 that is 40 reads at step 100,
    60–70 ms per search.
  - `ABC-228` (ii)'s 4 000 ms raised every such row by 33 %. `ABC-220` added ≈ +0.2 s.
  - The largest single row, `ABC-230` A2 (271 ms), reads no time.
- **Options:**
  - **(a) chosen:** extend `ADR-0046` D2(b) to every time-blind virtual-clock row, starting with the `ABC-230`
    and `ABC-241` blocks (1.43 s in-thread). Estimate −0.3..−0.65 s.
  - **(b) tranche 2 only:** UCI P/C rows to `UCI_DEEP`; the null-move guards to `SEARCH_DEEP`; a sparser
    `QE-208-a` sweep.
  - **(c) ruled:** "load1 ≤ 8" stands on 24 CPUs. It is a tighter band than on 8 cores, nothing is re-graded, and
    it buys no headroom.
  - **(d) not asked.**
- **Target:** `G8` head median ≤ 9.4 s at the remedy ticket's gate. Tranche 2 opens over 9.4 there, or over 9.6 at
  any later gate. Over 9.7 after tranche 2, it goes to the owner.
- **Records:**
  - `ADR-0046` § Addendum 2026-10-30 (PROPOSED; BA/PM's word at the cut), plus a § Status pointer;
  - `ADR-0035` § Addendum 2026-10-30 (SEC-REBASE-b), plus a § Status pointer;
  - two notes (an observation and a decision) drafted under `.grugops/context/arch-g8-headroom/raw/`;
  - probe outputs under `raw/probe/`.
- **Tickets (BA/PM):**
  - cut ONE new test-only ticket (S, P1), pulled before `ABC-242` and `ABC-221`;
  - amend `ABC-242`'s `NFR-008` line and Test notes (R1–R4; the probe's `virtualClock(1)` at 2 000 ms is not the
    lane form);
  - amend `ABC-221`'s A9 (R1 census line);
  - `ABC-243` is unchanged.
- **Owner question:** none.
- **Seal (pending, run from the worktree):**
  `node .grugops/context/arch-g8-headroom/raw/seal.mjs .grugops/context arch-g8-headroom .grugops/context/arch-g8-headroom/raw/seal-spec.json`.
  Then commit the notes.
- **Not touched:** `src/`, `tools/`, `data/`, tickets, the board and the `NFR-008` catalog row. The stale
  core-count sentence is routed to Security/NFR. Nothing was run, timed, pushed or merged.
