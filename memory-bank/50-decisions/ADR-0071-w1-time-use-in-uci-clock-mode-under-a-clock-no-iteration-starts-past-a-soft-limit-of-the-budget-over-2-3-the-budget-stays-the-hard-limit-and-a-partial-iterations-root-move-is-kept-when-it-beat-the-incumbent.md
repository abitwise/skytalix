---
kind: adr
id: ADR-0071
---
# ADR-0071: W1 (`ABC-282`), time use under a clock. In `uci-clock-mode` with a clock for the side to move, no iteration starts once the search has spent the move's budget ÷ 2.3 (the soft limit). The budget stays the hard limit, unchanged. An aborted iteration's root move is played when its completed score beat the incumbent's at the same depth. Every other mode and token is node-identical to `main`. The read is 100 games at `tc=40/8`, after a harness ticket

## Status

**IN FORCE 2026-11-05, from `ABC-282`'s merge `a6ae8227`.** Recorded by Architect/Design (task `arch-ABC-282-close`,
records only, on `grugops/arch-ABC-282-close` from `main` `2e46933f`). Nothing was run.
- **The read:** QE's verdict `qe-ABC-282` `…5191f871` is PASS_WITH_GAPS, with no blocking gap, and it signs UAT. A6 is
  MET at 45 / 32 / 23 = 56.5 of 100 (D10). A4 is MET on both sides (D11). F1–F7 did not fire. The score meets the bar;
  the gain is not proven (Elo +45.4 ± 60.7, `ABC-282`'s page).
- **What is in force:** D1–D12, as accepted. No decision or value moved. b stays 2.3: D12 item 3's re-read gave a
  median of 2.3043 (`se-ABC-282` `…aadd2d48`). `ABC-078` A3 is amended in this mode only (D7), and its page says so
  (`bapm-ABC-282-close`).
- **D12:** `ABC-282` landed second, so its items fell to it. The build did items 1–4 and 6. This hop wrote item 5, the
  dated line under `ADR-0066` decision 5.
- **Two dated lines from QE-282-l** (`…4f8f7f5d`): one under D11 and one under § Consequences, `NFR-004`. They correct
  the text. No decision moves.

*Before the merge:* **ACCEPTED 2026-11-04 by the owner, in form (a), as written (OQ-0071-1). Not in force until
`ABC-282` merges on its read (A6, D10).** Recorded by Architect/Design (task `arch-owner-answers-1104`, records only, on
`grugops/arch-owner-answers-1104` from `main` `5d402485`). Nothing was run.
- **His words, verbatim** (`orch-2026-10-30a` `…7de79e90`): *"Accept the W1 time-use design (ADR-0071)"*. The
  Orchestrator records it as OQ-0071-1, form (a).
- **What it settles:** D1–D12 as written. W1 acts in `uci-clock-mode` under a clock only. No iteration starts past the
  soft limit, budget ÷ 2.3, and the budget stays the hard limit. A partial iteration's root move is played when it beat
  the incumbent (D4). `ABC-078` A3 is amended in that mode only (D7). **No decision here changes.**
- **Option (b) is not taken.** The partial-move rule does not go into every mode, and no follow-up ticket is owed for
  it. Every other mode stays node-identical to `main` (D1, A0).
- **The harness ticket is done.** D10's tools ticket was cut as `ABC-300` and merged at `4ea39135` (QE PASS_WITH_GAPS
  `qe-ABC-300` `…fbda2ad6`). A6 runs on its `d --tc 40/8`. QE carried `ABC-300` A6 (QE-300-a) to `ABC-282` A6.
- **The hold** (the Orchestrator, `…7de79e90`): `ABC-282` stays held until `ABC-283` merges or misses. Whichever of
  the two lands second does D12's items 1–6.
- **F7 under acceptance.** F7's "this ADR stays PROPOSED with its read recorded" now reads "this ADR reads accepted,
  not in force, with its read recorded", as `ADR-0069` F5 does. The disposition does not change: an A6 miss is not
  merged.
- **Lines written with the acceptance:** `ADR-0056` row W1 (D2's dated line of 2026-11-04,
  `arch-owner-answers-1104`), and the log below. **Still owed** (BA/PM): the `ABC-282` page's `adr:` line and
  `EPIC-011` § Owner questions. The lines are in this task's decision note.

*Before acceptance:* **PROPOSED 2026-11-04** (task `arch-ABC-282`, records only, on `grugops/arch-ABC-282` from `main` `5853d17f`, `src/`
tree `4fb3da04`). A new ADR is the owner's to accept (OQ-0071-1). `ABC-282`'s front matter records reading (b): the
build may start on PROPOSED. Nothing here is in force until `ABC-282` merges on its read.

- **Measured for this ADR** (PREREG `…5dbc040d`, sealed and committed at `6424c272` before any run). These are scratch
  probes on a `git archive` copy of `main`, under the host lock, counting nodes only:
  - **P1:** b = 2.3, the iteration-growth constant;
  - **P2:** A0's reference counts;
  - **P3:** the rule, prototyped on a second scratch copy. It forecasts A1 (c) and reports depth, clock use and
    partial moves;
  - **arithmetic A:** clock use per period.
  
  Readings: observation `…1938110b`; design and owed lines: decision `…0187186b`. Raw files:
  `.grugops/context/arch-ABC-282/raw/`.
- **What it amends:**
  - `ABC-078` A3, in this mode only (D7);
  - the `src/engine.ts` header paragraph "AN ABORTED ITERATION IS DISCARDED WHOLE" (D7).
  
  It also takes up `ADR-0052` § Alternatives A10 (a soft/hard split) as the search change that row deferred. No
  `ADR-0052` decision moves: `C`, T, the 59 500 cap, the reserve and the overhead all stay.
- **What it does not decide:** pondering, threads (`ABC-266`, parked), any budget formula or `NFR-004` ceiling, and an
  "emergency" rule that extends the soft limit on a falling score or an unstable root move (`ABC-282` § Out of scope).

## Decision log

| date (UTC) | by | what | record |
|---|---|---|---|
| 2026-11-04 | Architect/Design | PREREG sealed before any probe | `arch-ABC-282` `…5dbc040d`, `6424c272` |
| 2026-11-04 | Architect/Design | P1–P3 and arithmetic A read; b = 2.3. PROPOSED, form (a) recommended | `…1938110b` (readings), `…0187186b` (decision); merged `9471eb32` |
| 2026-11-04 | BA/PM, tools | Folded into `ABC-282` (Ready, L). D10's harness ticket cut as `ABC-300`, merged on QE PASS_WITH_GAPS | `bapm-ABC-282-adr`; `4ea39135`, `qe-ABC-300` `…fbda2ad6` |
| 2026-11-04 | Owner | **ACCEPTED, form (a)** ("Accept the W1 time-use design (ADR-0071)") | `orch-2026-10-30a` `…7de79e90` |
| 2026-11-04 | Architect/Design | Status restated as ACCEPTED, not in force until `ABC-282` merges on A6. `ADR-0056` row W1 written. No decision changed | `arch-owner-answers-1104` |
| 2026-11-05 | Orchestrator | **IN FORCE.** `ABC-282` merged at `a6ae8227` on QE's verdict `…5191f871` | `orch-2026-10-30a` `…16e0ec2c` |
| 2026-11-05 | Architect/Design | Status restated as in force. QE-282-l ruled: no decision moves, dated lines under D11 and § Consequences. D12 item 5 written in `ADR-0066` | `arch-ABC-282-close` |

## Context

- **What `main` does** (`src/engine.ts`, `deepen`). The loop starts iteration d + 1 whenever one clock reading is under
  the deadline, `start + min(budgetMs, HARD_CEILING_MS)`. An abort throws past the register, so the aborted iteration
  is discarded whole (`ABC-078` A3). One figure, the mode's budget (`ADR-0052` D2–D4), is both the target and the stop.
- **What that costs, measured** (P3: 25 positions, budgets of 25–400 virtual ms on `virtualClock(1)`; the step is 1 ms
  per clock read, and a read comes every 1 024 nodes):
  - 124 of 125 searches end in an aborted iteration;
  - the median share of nodes thrown away is **0.3766** (mean 0.3875, p25 0.2212, p75 0.5254).
  
  `ADR-0056` C1 estimated the waste as "often half or more" (`[J]`). The measured median is about three eighths.
- **Who it is for.** The 40/15 claim (`ADR-0056` C1) plays `uci-clock-mode`, because `ABC-223` read that mode MET.
  Under a clock, time a move does not spend stays on the clock for later moves.
- **The modes on `main`** (`src/uci-session.ts` `parseGo`, `ADR-0052`):

  | mode | tokens | budget (the hard limit today) |
  |---|---|---|
  | `level` | `movetime x` | min(x, level budget) |
  | `level` | clock | min(t / m + inc / 2 capped by t − 50, level budget) |
  | `level` | none | the level budget |
  | `simple-tournament` | `movetime x` | min(x, 22 000) |
  | `simple-tournament` | clock | min(22 000, C) |
  | `simple-tournament` | none | 22 000 |
  | `uci-clock-mode` | `movetime x` | min(x, 59 500) |
  | `uci-clock-mode` | clock | min(59 500, C) |
  | `uci-clock-mode` | none | 22 000 |
- **The harness on `main` cannot play a clock read.** `tools/rating/rating.ts` builds every skytalix engine with
  `st=<budget/1000>` and `timemargin=`. Its `d` mode takes only `--budget-ms` 3 000 / 2 500 / 2 000 / 1 500 / 1 000 /
  100, and nothing under `tools/` emits `tc=` or `option.TimeMode`.
  - `ABC-222` and `ABC-223` played their 40/15 games from QE's own scratch `cutechess-cli` command, not from the
    harness.
  - So the C2′-shaped read (head against merge-base, built artifacts, sealed records, `EPIC-008`'s states) needs a
    tools ticket first (D10). `ABC-282` § Dependencies anticipated this route ("as `ABC-275` was for R1").

## Decision

### D1. Which modes: reading (a), narrowed to `uci-clock-mode` under a clock

**W1 acts only when the session's `TimeMode` is `uci-clock-mode` and the `go` line carries the side to move's clock
(`wtime` for White, `btime` for Black) and no `movetime`.** That is the one row of the table above whose budget is
`min(59 500, C)`. The search is then "clock-managed". Every other row is node-identical to `main`: `level` with any
tokens, `simple-tournament` with any tokens, and `uci-clock-mode` with `movetime` or with no time token. W1 is off on
all of them, D4's partial-iteration rule included.

- **Why not (b), every mode.** Scope 1 stops a search early, and only a clock can spend that saving later.
  - Under `movetime` the saving is lost. UCI defines `movetime x` as "search exactly x mseconds".
  - At a level the budget is the product's stated thinking time, and `NFR-005` grades the depth reached in it.
  - P3 shows the cost at a fixed budget with nowhere to spend the saving: the head completes **one ply less on 22 of
    125 rows** (mean depth 7.352 → 7.176).
- **Why `simple-tournament` is out, though `ABC-282` scope 4 (a) named it "under a clock".** At 40/15, `C` starts at
  22 375 and T = 22 000 binds on every move (`ADR-0052` D3). The time W1 saves is never spent, because T caps every
  later move too.
  - At P3's median clock use (0.64), 40 × (0.64 × 22 000 + 31) ms is **62.7 %** of the period. In the worst case
    (every move stops at its soft limit) it is **42.6 %**.
  - Both are under `EPIC-009` M2's 75 %, which `ABC-222` read MET for that mode at 97.9 %.
  - The mode is "22 s a move" by the owner's word (`ADR-0052` § Status). It stays that.
- **Scope 2 in every mode** (it "can pay in any mode") is not taken here. It would make `level`'s moves differ from
  `main` and owe the C2′ read at 100 ms, the Levels deep lane and an `NFR-005` re-read. It is offered as option (b) of
  OQ-0071-1, a follow-up of its own if the owner wants it.

### D2. The rule: no iteration is started that the clock says cannot finish

- **The prediction.** Measured on the K25 corpus, a completed iteration d + 1 ends at about b × the time spent through
  iteration d. b is the growth of the cumulative node count (P1).
- **The rule.** At the boundary after iteration d, the loop reads the clock once, giving t, as it does today. Iteration
  d + 1 starts only if:

  ```
  t < deadline            (today's test; deadline = start + min(budgetMs, HARD_CEILING_MS))
  and  t − start < softMs  (W1; softMs = hard ÷ b)
  ```

  The second test is "b × (t − start) < hard": iteration d + 1 is predicted to end before the hard limit. If the
  prediction says it cannot, the search returns iteration d's move. **0 nodes** of iteration d + 1 are visited, because
  the test sits before `runIteration`.
- **b = `ITERATION_GROWTH` = 2.3.** It is P1's pooled median of N(d) / N(d − 1) over d = 4–10 on K25: 175 ratios,
  median **2.3319**, p25 2.003, p75 2.880, rounded to 0.1 by the PREREG.
  - The per-depth medians are 2.763, 2.129, 2.621, 2.332, 2.212, 2.242 and 2.252 for d = 4–10. Odd d reads 2.251 and
    even d 2.350.
  - Inside [1.5, 6.0], so the PREREG's stop rule did not fire.
  - Depth ≥ 11 (the 40/15 claim's ~22 s moves) was not measured. The d = 8–10 medians are flat at 2.21–2.25, so b is
    expected to hold. That is `UNKNOWN - verify`, and A4 reads it at 40/15.
- **R-TC part 1 item 2.** The rule is a continuous function of the time left (`C` is continuous in the clock) and
  acts the same at every clock. No branch is keyed on a budget's value, a test flag or the environment. b is a property
  of the search, measured across depths 4–10, and is not tuned to a control.
- **One clock read per boundary, as today.** The two tests compare the same reading t, with the earlier limit as
  `min(deadline, start + softMs)`. With `softMs` absent, that limit is the deadline itself, so the clock is read
  exactly as often as on `main`, and a virtual clock gives `main`'s readings (A0; P3's I0, 125 of 125 equal).
- **F3 binds.** If A1 (c) is not lower, b is not re-chosen to make it pass.

### D3. The soft and hard limits per mode

| mode / tokens | hard limit (the abort) | soft limit (no iteration starts after it) |
|---|---|---|
| `uci-clock-mode`, side to move's clock, no `movetime` | **min(59 500, C)**, unchanged | **hard ÷ 2.3** |
| every other row of § Context's table | unchanged | none (W1 off) |

- **The hard limit does not move.** It stays `ADR-0052` D4's budget, clamped at `HARD_CEILING_MS` = 60 000. So
  `NFR-004` holds by construction:
  - it is ≤ 59 500 ≤ the 60 s ceiling;
  - it is ≤ C ≤ t − 1 000 − 100, the clock less D2's reserve and overhead;
  - **except at D2's floor**: below 1 101 ms on the clock, C = 1 and depth 1 answers at once (`ADR-0052` D2). That is
    `main`'s behaviour, unchanged.
  
  The abort granularity is `ABC-078` A2's node bound, unchanged.
- **`go depth` / `nodes` / `mate`** in a clock-managed search keep their meaning. The search stops at whichever comes
  first: the soft limit, the depth limit, the node limit or the hard limit.
- **Where it is computed.** `src/uci-session.ts` computes `softMs = budgetMs / ITERATION_GROWTH` in `parseGo`'s
  `uci-clock-mode` clock branch only, beside `safeClockShare`. `ITERATION_GROWTH` = 2.3 is a private named constant
  there, carrying its derivation. The engine takes `softMs` as an option (D6).

### D4. The partial iteration: its root move is played only if it beat the incumbent

The **incumbent** is iteration d's best move. On `main` it is the first root move iteration d + 1 searches:
- the root's table entry is iteration d's `BOUND_EXACT` store, read back at once;
- `orderMoves` puts the hash move first;
- no killer is recorded at ply 0.

P3 counted 0 iterations whose first root move was not the incumbent.

**The test (on `main`'s full-window root).** In a clock-managed search, when iteration d + 1 is aborted, the move
played is the partial register's move, if all of these hold:
1. the incumbent's own depth-(d + 1) search completed in this iteration. That is its score s_I, which is exact
   because the root window is (−∞, +∞);
2. a later root move M's depth-(d + 1) search completed, after its PVS and LMR re-searches, with a score strictly above
   s_I. That is runIteration's own `score > best` displacement;
3. M is the latest such move: the register's move when the abort landed.

Otherwise the incumbent is played with iteration d's score, which is `main`'s move and score.

- **Why it is not `ABC-078` A3's biased sample.** A3 forbids the best-so-far over whichever moves the generator emitted
  first. Here M is compared with the incumbent at the same depth, on two completed exact scores (under `ABC-283`'s
  aspiration, a lower bound above an exact score; D12). That M is better than the move that would otherwise be played
  is proven, not sampled.
- **The register** is written only from a completed root-move return. That is the same assignment-from-return
  discipline A3's header states: an abort throws past it, so no root move's partial state is ever read. Nothing is
  stored in the table for a partial iteration, as today.
- **Mate scores (A2 (c)): no special case.** The same strict `>` decides:
  - **A mate for the side to move.** A root move whose completed d + 1 search scores a mate for the side to move beats
    any lower incumbent score. It is played, with its own d + 1 score (exact, so `scoreOf` prints the right
    `mate N`).
  - **The incumbent scored as mated.** If the incumbent's d + 1 score is a mated score and no later move completed
    above it, the incumbent is played with iteration d's score, as on `main`. A score-drop rule that would search on is
    out of scope.
- **Measured** (P3, prototype): 16 of 125 head searches were aborted, and **3 kept a partial move**. 4 moves differ
  from base, 3 of them partial.

### D5. What is reported

- **`EngineChoice.depth`** keeps its meaning: the deepest COMPLETED iteration, d. `NFR-005`, `G6` and every depth
  reading are untouched.
- **`EngineChoice.move` and `.score`** are the played move and its score: M with its d + 1 score when D4 keeps it,
  otherwise iteration d's.
- **One new optional field, `EngineChoice.partial?: true`.** It is present only when D4 kept a move, and absent on every
  other search, never written `false`. So `toEqual` and `toStrictEqual` rows on `main`'s paths do not move.
- **UCI.** When `choice.partial` is set, the session writes `info string partial depth <d + 1>` immediately before its
  `info depth d score … pv <move>` line. The `info` line's shape is unchanged. QE counts the `info string partial`
  lines in the debug log for A6's report "the share of moves taken from a partial iteration".

### D6. The seam: the engine owns the mechanism, the session owns the choosing

This is the split `ABC-078` and `ADR-0052` D8 already draw.

- **`src/engine.ts`.**
  - **`EngineOptions.softMs?: number`.** With it, D2's second test and D4's keep apply. Absent, the search is `main`'s,
    node for node and move for move.
  - It applies in `deepen`, so every test-only door that passes it gets it too. No door passes it, and no shipped path
    but the session does.
  - **No new export, no new door, no `Heuristics` switch.** W1 off is `softMs` absent, which A0 pins, so `ABC-078` A4's
    export list does not grow.
- **`src/uci-session.ts`.**
  - `GoRequest.softMs`, set only in D3's row.
  - `go()` passes it to `chooseMove` in the rate-0 branch. The modes never take the level path.
  - The `info string partial` line.
- **No other `src/` file changes.** `src/levels.ts`, `src/search.ts`, `src/cli.ts` and the book are untouched.
- **NFR-009:** no table. The register is one small object per iteration.

### D7. The `ABC-078` A3 amendment

- **A3 as amended** (BA/PM writes it on the `ABC-078` page with this ADR's id):
  - *"(i) **Without a soft limit** (every search except `uci-clock-mode` under a clock, `ADR-0071` D1): given an
    instrumented run aborted mid-iteration at depth n, then the returned move equals the best move of the completed
    depth n−1 iteration. Unchanged."*
  - *"(ii) **With a soft limit** (`ADR-0071` D4): the returned move is the depth n−1 best move unless another root move
    completed its depth-n search with a score strictly above the depth n−1 best move's own completed depth-n score. In
    that case it is the latest such move."*
- **Rows re-pointed, not deleted** (`ABC-282` test note 3):
  - **(i) is the old row, unchanged.** `src/engine.test.ts` "A3 — an aborted iteration's move is discarded, not
    returned" stays: the `A3_FEN` fixture at budget 3 on a 1 ms tick, with no `softMs`. Its deep twin "A3 — the
    depth-3 move the default lane carries as a literal [deep]" stays too.
  - **(ii) is new:** `ABC-282` A2 (a)–(c).
- **The header text of `src/engine.ts` it replaces.** The paragraph at lines 26–31 on `main` (*"AN ABORTED ITERATION IS
  DISCARDED WHOLE (`A3`). Its best-so-far is a systematically biased sample … and there is no partial state to forget
  to discard."*) becomes, in substance:
  - *"AN ABORTED ITERATION IS DISCARDED WHOLE (`A3`), EXCEPT UNDER A SOFT LIMIT (`ADR-0071`, `ABC-282`).*
  - *Its best-so-far over the moves searched is a biased sample, the moves the generator emitted first, so without a
    soft limit it is discarded, and the register is written only on a COMPLETED iteration.*
  - *With a soft limit, one result of the aborted iteration may be played: a root move whose depth-n search COMPLETED
    with a score strictly above the incumbent's own completed depth-n score, the incumbent being searched first. That
    is two exact scores at one depth, not a sample.*
  - *The partial register is written only from completed root-move returns. An abort throws past it."*
  
  The Engineer writes the final wording.
- **Two more `src/engine.test.ts` lines move with it, by this ADR:**
  - `ABC-078` A4's textual pin of the loop header ("for ( let iteration = 2; now() < budget.deadline && …"), which
    becomes the new one-read header. The rule it guards is unchanged: the clock first, one read, no constant upper
    bound.
  - The `EngineChoice` doc lines on `move` and `score` (D5).

### D8. A0: the counts, where W1 does not act

The values are `main` `5853d17f` (`src/` tree `4fb3da04`; P1, P2). **If `ABC-283` merges first, every value is re-read
on the new merge-base by the same rows, before the change** (§ D12). The rows bind; the numbers are the base's.

- **A0-1. A frozen clock, `maxDepth` reached first** (`now: () => 0`, `budgetMs: 60000`). Each row reads the same with
  `softMs` absent and with `softMs: 1`, because a frozen clock never reaches a soft limit:

  | position | d | move | score | nodes |
  |---|---|---|---|---|
  | kiwipete | 6 | e2a6 | −59 | 144 120 |
  | kiwipete | 7 | d5e6 | −82 | 346 458 |
  | kiwipete | 8 | d5e6 | −89 | 766 275 |
  | position-6 | 6 | c3d5 | 87 | 15 209 |
  | position-6 | 7 | c3d5 | 79 | 35 436 |
  | position-6 | 8 | c3d5 | 71 | 87 475 |

- **A0-2. A stepping virtual clock, W1 off** (`virtualClock(1)`, `softMs` absent). This is the row a frozen clock
  cannot replace: a frozen clock never fires D2, so it would pass a W1 that leaked into every mode.

  | position | budgetMs | depth | move | score | nodes |
  |---|---|---|---|---|---|
  | kiwipete | 50 | 4 | e2a6 | 8 | 48 408 |
  | kiwipete | 200 | 6 | e2a6 | −59 | 199 960 |
  | position-6 | 50 | 7 | c3d5 | 79 | 44 105 |
  | position-6 | 200 | 8 | c3d5 | 71 | 196 681 |

- **A0-3. The session hands no `softMs` outside D3's row.** On position-6 with an injected `virtualClock(1)`,
  `OwnBook false`, each of these is `main`'s line exactly (`info depth … nodes …` and `bestmove`), read on the base
  before the change:
  - `level` (`go movetime 200`; `go wtime 4000 btime 4000`);
  - `simple-tournament` (`go movetime 200`; `go wtime 8000 btime 8000 movestogo 40`);
  - `uci-clock-mode` (`go movetime 200`; `go depth 6`, no time token).
  
  Plus one row in D3's mode (`go wtime 8000 btime 8000 movestogo 40`) that shows `softMs` IS handed in.

### D9. A1 and A2: fixtures, corpus and clock

- **A1 (a) and (b) (default lane, virtual clock):** `chooseMove(p, { budgetMs: H, now: virtualClock(1), softMs: H / 2.3
  })`.
  - (a) "0 nodes of iteration d + 1" reads exactly as `choice.nodes === chooseMove(p, { budgetMs: 60000, now: () => 0,
    maxDepth: choice.depth }).nodes`, on a row where the base aborts inside d + 1.
  - (b) is a row where elapsed after d is under H / 2.3, and `choice.depth` > d.
  - The Engineer picks the rows on the base by a scan, as `ABC-078` A3's fixture was picked. P2's position-6 at H = 50
    is a candidate.
- **A1 (c) (deep lane, `ENGINE_DEEP`; QE freezes it before the build, `ABC-282` test note 2):**
  - **Corpus K25:** `qe-tc-depth-probe` R1's 25 positions:
    - `raw/named.json` (5; sha256 `e41a4914…0479`);
    - `raw/positions.json`'s `skytalix` list (20; sha256 `63d88b2a…0570`).
  - **Clock:** `virtualClock(1)`, H ∈ {25, 50, 100, 200, 400} virtual ms: 125 rows.
  - **Head and base.** The head is `softMs = H / 2.3`. The base is the same call with `softMs` absent, which is `main`
    node for node by A0-2. QE may play the merge-base build instead; the counts are equal.
  - **The share per row:** (nodes − N(depth)) / nodes, where N(d) is the frozen-clock count at `maxDepth` d.
  - **The bar:** the head's median over 125 rows is strictly below the base's. Both are reported.
  - **Forecast** (P3, prototype): base median **0.3766**, head median **0.0000** (head mean 0.0902, p90 0.6257).
  - **Cost:** about 2–3 min (P3 ran three engine calls a row in 145 s), so it goes in the deep lane, not the default
    lane (`NFR-008`).
- **A2 (a)–(c) (default lane, virtual clock):**
  - P3's kept rows are candidates on the base: `candidate/b06#3` at H = 50 (base b1c3 at depth 5, +95; head d1a4 from
    depth 6, +56) and at H = 200, and `base/b08#7` at H = 200.
  - A2 (b) is any aborted head row without a kept move (13 of 16 in P3).
  - A2 (c) needs a mate fixture picked by the same scan. The mate corpus (`src/search.mate-corpus.ts`) is the place to
    look.
  - The Engineer re-scans on the base the build lands on.

### D10. The read (A6): the control, the intent, and the harness ticket first

- **The control: `tc=40/8` on both sides, `timemargin=0`, `option.TimeMode=uci-clock-mode` on both.**
  - It is the claim's shape (`tc=40/900`, repeating 40-move periods with `movestogo`) scaled down, the shape W1's soft
    limit and `C`'s re-spreading interact in.
  - **Not sudden death plus increment.** With no `movestogo`, `C` divides by 20 and keeps a 1.1 s reserve, so at a 10 s
    base most of the game is played on the increment. That is not the claim's shape.
  - **`timemargin=0`** is `ABC-222` and `ABC-223`'s setting for the clock bars. Any flag fall is a loss on time.
  - **Per move:** `C` runs from 75 ms at a period's first move to about 370 ms at its last (about 0.9 s under W1,
    which banks time towards the period's end); the period mean is about 170 ms. That is depth 6–7, near C2′'s 100 ms.
- **The shape: C2′'s.**
  - 100 games, head against its merge-base, self-play, one game at a time, width 1;
  - QE with the host ALONE;
  - openings 1–50 of `tools/rating/openings.epd`, both colours;
  - `OwnBook` on, `restart=on`, `-maxmoves 200`.
  - The engine has no threads option on `main` (`ABC-266` parked), so "`Threads 1` against `Threads 1`" holds by
    construction.
- **The bar:**
  - **MET** on 100 of 100 complete, **0 losses on time** (C-2), 0 faults (C-1), and **≥ 50.0 of 100**;
  - **intent GAIN.** W1 acts at this control on every move, so "NEUTRAL (invisible at 100 ms)" does not apply;
  - a miss is NOT MET and is not re-played (F7).
- **Wall: about 40 min (estimate).** At C2′'s mean game length (137.6 plies, 69 moves a side), arithmetic A's model
  spends 10.7–11.8 s a side, so about 22–24 s a game plus engine starts. Game length at this control is `UNKNOWN - verify`, and
  the bound is 200 moves a side.
  - Under 1 h, so it is not asked of the owner (`ADR-0056` C2′'s depth-gated paragraph).
  - If QE's PREREG estimate passes 1 h, the read is asked of the owner first, under the same rule.
- **Forecast (derived, low confidence).** At a fixed budget the head spends a median of 0.64 of the budget (mean 0.69),
  and P3 throws away 0.09 of its nodes against the base's 0.39. With the clock re-spread, the head's completed-search
  time per move is about 0.87 / 0.61 ≈ 1.4× the base's, about +0.4 ply at b = 2.3. That is in `ADR-0056` D2's
  +10–40 Elo band; it is not a reading.
- **S′ and the Levels deep lane.** S′ plays `st=0.5`, which is `movetime`, where W1 is off (A0). It is a fault smoke
  only, and it cannot see W1. The Levels lane is not owed under D1 (`ABC-282` A6). `NFR-005` is untouched.
- **The harness ticket comes first. It is a tools ticket, and BA/PM cuts it, not this ADR.** Proposed scope:
  - **`d` accepts `--tc 40/8`, the only value.** With it, each skytalix side gets `tc=40/8`, `timemargin=0` and
    `option.TimeMode=uci-clock-mode` in place of `st=` and `timemargin=`.
  - Everything else is as `d --budget-ms 100`: openings, `-games 2`, `-rounds`, `-maxmoves 200`, `-concurrency`,
    `restart=on`, `-debug all`.
  - `machine.txt` gets a `control:` line naming both sides' `tc`, `timemargin` and `TimeMode`.
  - `--tc` with `--budget-ms` is refused, and any other `--tc` value is refused.
  - **Rows:** a `--dry-run` row for `d <c> <b> <out> --tc 40/8 --rounds 50 --concurrency 1`. Every existing `r`, `d` and
    `rpair` dry run stays byte-equal, and the `pair-check` rows stay unedited.
  - **0 lines under `src/`** (R-TC item 4).
  - Size XS–S, like `ABC-275`. Its id is BA/PM's. ABC-300 is the next free id on `main`, `UNKNOWN - verify` at the cut.
    - *Dated 2026-11-04 (`arch-owner-answers-1104`): cut as `ABC-300` and merged at `4ea39135` (`qe-ABC-300`
      `…fbda2ad6`). A6 plays its `d --tc 40/8`.*
  - `summarise` already counts "loses on time" as a fault (`FAULT_TEXT`), so C-2 needs no new parsing.
  - The reports (period-end clock left, `info string partial` share, mean completed depth) are QE's, read from
    `-debug all` as `ABC-223`'s PREREG did.

### D11. A4: `EPIC-009`'s clock bars, kept

- **The run stays `ABC-223`'s: 5 games at `tc=40/900`** in `uci-clock-mode`, from QE's scratch protocol. No shortening
  is argued.
- **M1 (0 losses on time, closest call ≥ 500 ms) holds by construction.** The hard limit is still ≤ C ≤ t − 1 100, so
  `ADR-0052` D2's guarantee (≥ 1 100 − δ ms left after any move) holds whatever the soft limit saves. Arithmetic A:
  1 069 ms is the minimum at f = 1, and with f drawn from P3 it is ≥ 1 069 ms in 10 000 seeded games.
- **M2 (≥ 75 % of each completed period) is the bar W1 puts at risk.** It is read, not argued. Arithmetic, `C` over
  three 40/15 periods (P3's head clock-use fractions, 125 measured, drawn per move; 10 000 games; seeded):
  - **period 1 used: min 87.8 %, 1st percentile 90.5 %, median 95.4 %** (with 6 book moves, 85.2 / 88.0 / 93.9 %);
  - constant f = 0.64: 92.8 % / 90.7 %;
  - constant f = 0.49 (P3's p10): 79.2 % / 75.9 %;
  - **the worst case, every move at its soft limit (f = 1 / 2.3): 72.5 % / 69.0 %, under 75 %.**
  
  A move can stop before its soft limit only by reaching a `depth` or `nodes` limit first. On the last moves of a period, `C` hands
  out the whole remainder, and W1 spends ≥ 1 / 2.3 of it. Later periods carry the rest (≥ 85.7 %).
  - *Dated 2026-11-05 (`arch-ABC-282-close`, records only; QE-282-l).* The sentence above is true only up to the cap.
    The budget is min(59 500, C). When C is above 59 500 the move gets 59 500, W1 spends ≥ 25 870 ms of it, and the
    clock above the budget carries to the next period. At g01 White's move 40 the clock read 88 532 ms, the budget
    was 59 500 ms and the move took 26 947 ms, which left 61 585 ms. The figures in this section stand, because both
    scripts apply the cap (`arch-ABC-282` `raw/alloc-w1.mjs`, `raw/alloc-w1-mc.mjs`).
  - **F5 routes a miss here.** Then b, the soft limit's form, or a last-move rule is the Architect's to re-open, with a
    new read. Nothing is tuned to pass.

### D12. The merge interaction with `ABC-283`

`ABC-283` is being built on `grugops/ABC-283`. Its S1 (`ADR-0066` d1–d8) changes the same loop this ADR does. This ADR
is designed against `main`. **Whichever of the two lands second rebases, and does the following:**

1. **The text.** Both edit `deepen` and `runIteration` in `src/engine.ts`.
   - `ADR-0066` d8: `runIteration` takes a window and reports a fail, plus `aspirate`, the `aspiration` switch and its
     door.
   - This ADR: the one-read loop header, the partial register in `runIteration`, and the keep on abort.
   - `ABC-078` A4's export list moves only by `ABC-283`'s door. Its loop-header pin moves only by this ADR.
2. **D4's test under aspiration windows.** From iteration 5 the root window is prev ± 100 and may re-search in passes
   (`ADR-0066` d3, d4). The test generalises to: **M beat the incumbent I in iteration d + 1 when, within one pass of
   that iteration, I's completed score was exact (strictly inside the pass's window) and M's completed search returned
   a score strictly above it** (exact, or a fail-high lower bound: a lower bound above an exact score is proof).
   - The latest such M is kept, and evidence from an earlier pass stands until a later pass gives newer evidence.
   - A pass in which I failed low gives no evidence.
   - On `main`'s single full-window pass this is D4 exactly.
   - `ADR-0066` d4's fail-high move, stored `BOUND_LOWER` and tried first in the re-search, is that M when I was exact
     in the failed pass.
3. **b is re-read on the new base** by P1's method (frozen-clock cumulative node ratios on K25, pooled median over
   d = 4–10, rounded to 0.1). History, SEE ordering and aspiration all change the tree's growth. The value is frozen
   before A1 (c) runs. Re-reading it by the pre-registered method is not tuning (F3).
4. **A0's counts are re-read** on the new merge-base (D8), as `ABC-282` § Dependencies says.
5. **`ADR-0066` d5** ("`ABC-078` A3 unchanged") reads "A3 as amended by `ADR-0071` D7 (with a soft limit only)" if
   this ADR has merged. A dated line in `ADR-0066` is owed by whichever lands second, not now.
6. **The doors.** This ADR adds none. `ABC-283`'s doors share `deepen`, so a door handed `softMs` would get D2 and D4.
   No test hands them one, and no row needs to.

## Alternatives

| # | option | why not |
|---|---|---|
| A1 | Reading (b), every mode | Scope 1 can only lose depth where saved time is never spent: 22 of 125 rows one ply shallower at a fixed budget (P3). It owes C2′ at 100 ms, the Levels lane and `NFR-005`, for no gain in `level` or `movetime` (D1) |
| A2 | Reading (a) as the page wrote it, `simple-tournament` under a clock included | T binds on every 40/15 move, so the saving is never spent. M2 reads 62.7 % at P3's median use and 42.6 % worst case, against 75 % (D1) |
| A3 | soft = C (the target) and hard = k × C, capped by the clock | It moves `ADR-0052` D4's budget formula (the stop rises above `C`), which `ABC-282` § Out of scope fences and which is the owner's. It is the likely later form if the owner opens the formula |
| A4 | A per-move measured growth, t_d / t_{d−1}, in place of the constant b | P1's per-position ratios swing from 1.30 to 10.19 at d ≥ 4 (odd/even and table effects), so a per-move estimate needs a clamp, which is two constants for one. One measured constant is the boring rule. It can be revisited if A4 or A6 show b mis-sized |
| A5 | Keep the partial iteration's best-so-far whatever it is | That is the biased sample `ABC-078` A3 exists to forbid. A move searched before the incumbent finished, or never compared with it, is not evidence |
| A6 | A test-only off-door for W1 (`ADR-0026` d10's pattern) | W1 off is `softMs` absent, which is `main` node for node (A0; P3 I0, 125 of 125). A door would duplicate it and grow `ABC-078` A4's export list for nothing |
| A7 | The constant b in `src/engine.ts`, exported | It would grow `ABC-078` A4's export list, and the engine would read `budgetMs` twice. G-1, if built, allows one read in the deadline expression. The session owns the choosing (D6) |
| A8 | Play the read from a QE scratch `cutechess-cli` command, as `ABC-223` did, with no tools ticket | C2′'s read is the harness's `d`: built artifacts from the SHAs, sealed records and `EPIC-008`'s states. `ABC-282` § Dependencies names the tools-ticket route |
| A9 | Sudden death plus increment (for example `10+0.1`) for the read | Not the claim's shape. With no `movestogo`, `C`'s fixed 1.1 s reserve and 20-move spread put most of a short game on the increment (D10) |
| A10 | `info depth d+1` for a partial move | `depth` would stop meaning "completed", and `NFR-005`, `G6` and every depth report read it. One `info string` line carries the fact (D5) |

## What would falsify this

| # | fires when | disposition |
|---|---|---|
| F1 | A0-1, A0-2 or A0-3 not reproduced | a defect: W1 acts where D1 says it does not |
| F2 | A1 (a) / (b) or A2 (a)–(c) red | a defect in the wiring of D2 or D4 |
| F3 | A1 (c)'s head median not below the base's | the rule does not save work. STOP to Architect/Design. b is not re-chosen |
| F4 | A3 red, or any loss on time | a defect. The hard limit is unchanged, so this should not happen |
| F5 | A4 M1 or M2 NOT MET | STOP to Architect/Design (D11): b, the soft limit's form or a last-move rule is re-opened, with a new read |
| F6 | A5 red | a defect check first. Under D1, A5's rows run W1-off paths, so a real change there is F1 |
| F7 | A6 NOT MET | not merged. `ABC-078` A3 stays as written, and this ADR stays PROPOSED with its read recorded. *(2026-11-04, accepted: it reads "accepted, not in force", § Status)* |

## Consequences

- **`NFR-004`:** no ceiling moves. The hard limit is the mode's budget, unchanged. A3 (b) holds by construction, with
  D2's floor of 1 ms stated as an exception (D3).
  - *Dated 2026-11-05 (`arch-ABC-282-close`, records only; QE-282-l, `qe-ABC-282` `…4f8f7f5d`).* **W1 brings the cap
    into play at 40/15, which this ADR did not state.** W1 saves time early, and `C` hands it out late. A4 read 13 of
    606 budgets at 59 500 and seven moves of 50 900–59 501 ms, each at a period's moves 36–40. `ABC-223` read 0 of 629
    and 25 285 ms. The longest move is 1 ms over its budget and 499 ms under 60 000, on a host under foreign load.
    - **No ceiling, limit or value moves.** The 500 ms is `ADR-0052` D4's designed margin. Overshoot near the budget
      read +3.9 ms at most, inside `AR-NFR004-A`'s ≤ ~31 ms.
    - **`AR-UCI-BUSY`** (owner: Architect/Design) keeps its bound, ≤ 60 s. A busy `isready` or `stop` can now wait
      about 59.5 s in play, not about 25 s. A4 read 0 `isready` during a search, and no `ADR-0044` D5 trigger fires.
    - **Owed:** one Security/NFR read, records only and blocking nothing (`arch-ABC-282-close`'s decision note).
    - **Not decided:** whether these late moves are the best use of the time. Five games show how long they are, not
      how they spread or what they are worth. Spreading them differently moves a budget formula, which this ADR does
      not decide (§ Status) and which is the owner's.
- **`NFR-005`:** untouched under D1. `level` is node-identical.
- **`NFR-008`** (9.42 s on `main`, 0.58 s of headroom):
  - A0-1 (six frozen searches, about 1.4 M nodes) and A0-2 (about 0.5 M nodes) cost about 2.8 s and 1 s at P1's rate
    (about 0.5 M nodes/s), so both go in `ENGINE_DEEP`.
    - The default lane may keep one identity slice if `N8-LANE` allows it: position-6 at `virtualClock(1)`, 50 ms,
      44 105 nodes, about 0.09 s.
  - A1 (a)/(b) and A2 are small virtual-clock rows.
  - A1 (c) is `ENGINE_DEEP` (D9).
  - The default lane is read before and after (`N8-LANE`).
- **`NFR-009`:** no new table (D6).
- **Security:** none. No new input is parsed. `softMs` is computed from the already-parsed `go` numbers.
- **Docs owed at the build:**
  - `src/engine.ts`'s header (D7);
  - `src/uci-session.ts`'s header: a W1 line under the `ABC-221` paragraph;
  - the `AGENTS.md` UCI time-mode line, by the Scribe: "`uci-clock-mode` stops before an iteration it predicts cannot
    finish (`ADR-0071`)", within the byte budget.
- **Risks:**
  - **R-0071-1 (MEDIUM): M2 at 40/15 under the worst case** (D11). Measured use makes it ≥ 85 %. A4 reads it, and F5
    routes a miss.
  - **R-0071-2 (LOW): b at depth ≥ 11 is unmeasured** (D2). A4 at 40/15 plays those depths.
  - **R-0071-3 (MEDIUM): the merge with `ABC-283`** (D12): a text conflict, and D4's test under aspiration. The second
    to land carries the generalised test and re-reads b and A0.
  - **R-0071-4 (LOW): the read waits on a tools ticket** (D10). Size grows to L, as `ABC-282` § Size foresaw.

## Rollback

- Remove `EngineOptions.softMs`, the one-read header's soft term, the partial register and `EngineChoice.partial` from
  `src/engine.ts`. Remove `GoRequest.softMs`, `ITERATION_GROWTH` and the `info string partial` line from
  `src/uci-session.ts`. Put the A3 header paragraph and A4's loop-header pin back.
- A0 makes every other mode `main` already, so no other verdict goes STALE. `ABC-078` A3 (i) never moved.
- The harness ticket's `--tc` stays harmless. Removing it is that ticket's own rollback.

## Owner questions

- **OQ-0071-1. Accept ADR-0071?** The points, for one answer:
  1. **The modes (D1):** W1 acts only in `uci-clock-mode` with a clock. `level`, `movetime` and `simple-tournament` are
     node-identical to `main`. `simple-tournament` is left out because its 22 s binds every 40/15 move, so the saving
     could never be spent and M2 would fail.
  2. **The rule (D2, D3):** no iteration starts once the search has spent the budget ÷ 2.3. 2.3 is measured, not
     tuned. The budget stays the hard limit, and no ceiling or budget formula moves.
  3. **The partial move (D4, D7):** played only when it beat the incumbent on exact scores at the same depth. This
     amends `ABC-078` A3 in that mode only.
  4. **The read (D10):** 100 games at `tc=40/8` in `uci-clock-mode`, GAIN ≥ 50.0, about 40 min. It runs after a small
     tools ticket that lets the harness play a clock.
  - **Options:**
    - (a) accept as written;
    - (b) accept, and also take the partial-move rule (D4) into every mode as a follow-up ticket of its own (it owes
      C2′ at 100 ms, the Levels lane and an `NFR-005` re-read);
    - (c) decline.
  - **Recommendation: (a).** The build may start on PROPOSED (`ABC-282` front matter, reading (b)). It merges only on
    its read.
  - *Answered 2026-11-04: (a), accepted as written (`orch-2026-10-30a` `…7de79e90`; § Status).*
