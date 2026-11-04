# PREREG: arch-ABC-282 probes for the W1 ADR, sealed before any run

Everything below is fixed before the first probe runs. No rule, corpus, grid or threshold changes after a number is
seen. The probes count nodes. No wall time is graded; wall figures are information only.

## Base and host

- `main` `5853d17f`, `src/` tree `4fb3da04`. It is read from a `git archive` copy in scratch, outside the repository.
  Node is the host's (recorded at run). Every run goes under `flock <scratch>/host-test.lock`, one at a time, each
  inside `timeout 1500`.
- **Nothing under `src/` or `tools/` in the repository is written.** The prototype in P3 is a patch on a second scratch
  copy only.

## Corpus K25

`qe-tc-depth-probe` R1's 25 positions:
- `raw/named.json` (5 positions; sha256 `e41a4914…0479`);
- the `skytalix` list of `raw/positions.json` (20 positions; sha256 `63d88b2a…0570`).

They are self-play game positions plus the five named roots, and `ADR-0056`'s depth-per-control table was read on
them. A position with one legal move is excluded from every ratio.

## P1: iteration growth (unpatched `main`)

- Per K25 position and d = 1, 2, …: `chooseMove(parseFen(fen), { budgetMs: 60000, now: () => 0, maxDepth: d })`.
  Record move, score and nodes N(d). Stop after d = 10, or after the first d with N(d) > 4 000 000 (that row is kept).
- The table is cleared at the call's entry and a frozen clock never aborts. So N(d) is the cumulative node count of
  iterations 1..d of any longer search of that position.
- r(d) = N(d) / N(d − 1), for d ≥ 2.
- **b, the growth constant:** the median of the pooled r(d) over d ∈ [4, the last d read], across all positions,
  rounded to the nearest 0.1.
  - **Stop rule:** if b falls outside [1.5, 6.0], no b is set. The ADR then records the rule as unset and routes it.
- Reports, not rules: r(d) median, p25 and p75 per d; the medians at odd and even d; per position.

## P2: A0's reference counts (unpatched `main`)

- From P1's rows: kiwipete and position-6 at d = 6, 7 and 8 (move, score, nodes).
- `virtualClock(1)` at `budgetMs` 50 and 200 on kiwipete and position-6: depth, nodes, move and score.

## P3: a scratch prototype of the rule (patch on the second copy)

**The patch.**
- `EngineOptions.softMs` is optional.
- The loop's one clock read per boundary is compared with `min(deadline, start + softMs)`. Absent, that is the
  deadline.
- `runIteration` writes a partial register only from completed root-move returns.
- On an abort, with `softMs` present, the register's move is played only if all three hold:
  - the first root move searched was the incumbent;
  - the register's move is not the incumbent;
  - its score is strictly greater than the incumbent's depth-(d + 1) score.
- Diagnostics: the node count at the last completed iteration; a partial flag; whether the first root move of each
  iteration was the incumbent.

**I0, the identity check.** The patched `chooseMove` without `softMs` must equal the unpatched one in move, score, depth
and nodes on every P3 base row and on P2's virtual-clock rows. If it does not, the prototype is wrong and P3 is void.

**The grid.** K25 × H ∈ {25, 50, 100, 200, 400} virtual ms on `virtualClock(1)`, that is 125 rows:
- base: no `softMs`;
- head: `softMs` = H / b.

**Per row:**
- thrown share = (nodes − nodes at the last completed iteration) / nodes;
- the depth;
- used = elapsed / H;
- the partial flag;
- the move.

**The A1 (c) forecast.** The median thrown share over the 125 rows, head against base. The prediction: the head's
median is strictly lower. If it is not, the forecast of F3 fires. The ADR records it, and b is not re-chosen.

**Reports:**
- the distribution of head depth minus base depth;
- the share of head rows that kept a partial move;
- the share of rows whose move differs;
- the distribution of the head's used fraction;
- the count of iterations whose first root move was not the incumbent.

## Arithmetic A (no engine)

- `uci-clock-mode`'s `C` (`ADR-0052` D2, D4) over 40-move periods at `tc=40/900` and `tc=40/8`, with δ = 31 ms.
- Each move spends f × its budget, for f ∈ {1 / b, the median of P3's head used fraction, 1.0}.
- Run with 0 and with 6 book moves.
- Reports: the share of each period used, and the clock left after each move (the minimum).

## Time

P1 ≤ 15 min and P3 ≤ 15 min. Nothing else is run.
