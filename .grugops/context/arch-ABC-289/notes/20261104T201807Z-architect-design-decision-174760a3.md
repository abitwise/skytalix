---
id: 20261104T201807Z-architect-design-decision-174760a3
kind: decision
by: architect-design
at: 2026-11-04T20:18:07Z
verified_by: 
confidence: high (written and sealed before any measured run; the forms, gates, choice rule, bars and verdict rule are fixed here)
refs:
  - arch-ABC-289
  - ABC-289
  - ADR-0074
  - ADR-0024
  - ADR-0069
  - ADR-0056
  - ADR-0063
  - EPIC-011
  - Q-3K-10
  - orch-2026-10-30a
  - 7de79e90
  - ABC-279
  - ABC-283
  - R-283-LMR
  - PREREG
  - src/quiescence.ts
supersedes: 
seal: sha256:ef730ec053f6a0c1ab18304980b149c9c0a250a98702ea03bf2ff085b6374388
---

# arch-ABC-289 PREREG: Q2 (delta pruning in quiescence) on `main` `0cc9afd1` (Q1 `seePruning`, the `ABC-283` bundle, `ABC-271`): instrument, six forms, the premise reading, the pay gate, the safety gate, the choice rule, the bar rules and the verdict rule, sealed and committed before any measured run

Architect/Design, task `arch-ABC-289`, on `grugops/arch-ABC-289` from `main` `0cc9afd1`. ADR id: **`ADR-0074`** (brief; `ADR-0072` and `ADR-0073` are `arch-bundle-1`'s). Inputs: the brief; `ABC-289`; `ADR-0024` § Status, the fourth block (the nine items); `ADR-0069` (the pattern); the owner's `Q-3K-10` yes (`orch-2026-10-30a` `…7de79e90`): d4 open for Q2's design only. **No measured run has been made in this hop.** The patch was applied to a scratch copy. No search has been run and no count read.

## Instrument
- Base: `git archive 0cc9afd1 src package.json` into a scratch directory outside the repository.
- `patch_q2.py` (this task's `raw/probe/`), knobs in a scratch `DP` record in `quiescence.ts`. With `DP.d` 0 the scratch search is `main`, node for node.
- **The rule (`d`):** in `quiesce`'s loop, at a node that stood pat, on a record with `seePruning` on, a move that captures and does not promote is skipped when `standPat + ORDER_VALUE[victim] + margin ≤ alpha`, with `alpha` the loop's current alpha (raised by the stand pat and by each searched capture). The test runs **before** `isLosingCapture`. A skipped capture is not made, not searched, not counted. In check nothing is skipped. A quiet queen promotion has no victim and is never tested. A capturing promotion is never tested. En passant reads its pawn (`move.captured`).
- Because the rule sits behind `skipLosing`, every door older than Q1 and any caller-built record are untouched.
- Driver: `probe.ts` (this task's `raw/probe/`), `arch-Q1-see-pruning`'s shape. Modes: `doors`, `premise`, `nodes`, `reach`, `drift`, `mate`, `zug`, `g1`, `fire`, `fire100`, `qaudit`.
- Every batch under `flock <host-test.lock> timeout 1800` (≤ 30 min a run), every job `timeout 600`, **one job at a time**. Deterministic counts only: fixed depth; `chooseMove` with `maxDepth` / `maxNodes` on a frozen clock; `G1` on its virtual clock. No timing is read. Hop total ≤ 1 h of runs. No game is played. If the budget runs short, reports are dropped, never a gate, and the drop is recorded.

## Instrument checks (not bars; a miss is fixed in the instrument and explained before any gate is read)
- **Knob off is `main`:** `search()` d8 **523 847 / 234 214** and `chooseMove` d8 **707 548 / 101 425** (kiwipete / position-6; `arch-ABC-283-mate` R3, K3 as merged; `ABC-271` is value-identical at 0).
- **The all-off door, knob off:** `searchWithoutBundle` / `chooseMoveWithoutBundle` d8 **605 117 / 406 787** and **766 275 / 87 475** (`src/search.bundle.test.ts` P0).
- **`ABC-279`'s door pair reads its pre-ticket counts, with the knob off AND on:** `searchWithoutSeePruning` / `chooseMoveWithoutSeePruning` d8 **839 514 / 1 533 901** and **1 296 788 / 404 930**.
- **Door zugzwang 7 / 7 and door `G1` 54 / 58**, none newly missed.
- In the probe `searchWithoutBundle` sits above the rule's guard, so it is read with the knob off only. The build turns the switch off in that door (the ladder); the probe does not model that.

## The premise reading (`ADR-0024` § Status, the fourth block, item 2)
On the door (the rule off, so the tree is `main`'s), `search()` at depth 6 over the 190, per margin 300 / 200 / 100:
- quiescence's share of all nodes;
- captures reached out of check, those `seePruning` skips, those searched;
- **candidates:** captures reached with `standPat + victim + margin ≤ alpha`; **overlap:** candidates `seePruning` already skips; **delta-only:** candidates it does not;
- **the premise figure:** delta-only as a share of captures searched out of check;
- **how many are refuted:** delta-only with score ≤ alpha before it. The rest raised alpha: the rule would have lost them. Their count, how many are mates, the largest non-mate raise, and the share giving check are read;
- the quiescence nodes under delta-only (nested subtrees count at each level, so this overstates).

This is a reading, not a gate. Whether the premise is met is decided by the pay gate below, which is `ADR-0024`'s "trim over `main`".

## Candidate forms (pre-registered; every margin is part of its form; read in this order)
All forms: stand-pat return unless named; capturing promotions never skipped; no other condition unless named.
- **D300:** margin 300.
- **D200:** margin 200.
- **D100:** margin 100.
- **D200c:** margin 200; a capture that gives check is never skipped (quiescence reaches mates through evasions, so a skipped checking capture can be a skipped mate).
- **D200e:** margin 200; the rule is off at a node of phase ≤ 6 (phase maximum 24; a rook and a minor a side or less), the late-endgame exclusion item 6 asks about.
- **D200b:** margin 200; a skip raises `best` to `standPat + victim + margin`, the skipped capture's bound, in place of leaving the stand pat. That bound is ≤ alpha, so the node's verdict is unchanged and only the fail-soft value differs.

## The pay gate, each form, against `main` (`ADR-0069`'s shape, item 4)
- **(P1) nodes:** fixed depth 8 on kiwipete and position-6, `search()` and `chooseMove`: **≤ 0.95×** `main`'s on each of the four readings.
- **(P2) reach:** mean completed depth at 47 000 nodes on the 190, `chooseMove` `maxNodes` on a frozen clock: **≥ `main` + 0.10 ply**.
- Both must hold. No expectation is stated: after Q1 the trim is `UNKNOWN - verify` on the ticket's own page.

## The safety gate, each form (`ADR-0069`'s shape, item 5)
- **Drift** at depth 5 on the 190, both recursions, head against the door: **≥ 90 % of non-mate scores within 25 cp, none beyond 150 cp, 0 mate sign changes.**
- **Mate floor** on the 287 at the **same depth**, door d5 → head d5, **both recursions** (`search()`, and `chooseMove` as `ADR-0063` d8 reads it since `ABC-283`): **0** violations. d4 → d5 (`search()`) and `chooseMove` d6 → d6 are reports (`R-283-LMR`: `main`'s own d6 rows are not a bar).
- **Zugzwang:** `ADR-0050` d9's seven rows at their recorded depths: **7 / 7** (hard).
- **`G1`:** **≥ 54 / 58 with no NEWLY-MISSED line.**
- The quiescence audit (`qaudit`, every 50th node with a delta skip, depth 6) is information only.

## Choice rule
Among forms passing both gates, the largest reach gain at 47 000. A form within **0.05 ply** of the best goes to the earliest in the order **D300, D200, D100, D200c, D200e, D200b**: a wider margin before a narrower one, and no added clause unless it earns its code.

## Bars `ADR-0074` writes for the chosen form (derived by these rules, fixed now; `ADR-0069`'s rules)
- **Pay (a):** d8 four readings ≤ min(0.95, ⌈100·(max of the four + 0.05)⌉ / 100).
- **Pay (b):** reach ≥ `main` + max(0.10, ⌊20·0.7·gain⌋ / 20).
- **Drift:** ≥ max(90, ⌊lower of the two measured within-25 shares⌋ − 2) % within 25 cp; none beyond min(150, max(25, ⌊1.5 × the larger measured max⌋)) cp; 0 sign changes.
- **Mate floor:** same depth, both recursions, 0. **Zugzwang** 7 / 7. **`G1`** ≥ 54 / 58, no NEWLY-MISSED.
- **`G2`:** `src/evaluate.ts` and `src/evaluate-params.ts` byte-identical to base; not re-read. If either is touched, `G2` is read by its rule.
- **`G6` / `NFR-005`:** by its rule at each build's `LEVELS[5]` (4 000 ms): "≥ base", graded by the median (a search ticket).
- **The read (`ADR-0056` C2′ as folded):** 100 games at 100 ms against the merge-base; S′ at E 1 810; the Levels deep lane exit 0.
- **The intent, by rule:** a form that passes P2 has its pay at the 100 ms node budget, so it fires at 100 ms and is **GAIN, ≥ 50.0 / 100**; NEUTRAL "invisible at 100 ms" is closed to it. The firing figure at 47 000 (`fire100`) is recorded with it.

## Reports (not bars), for each form that passes both gates; if none passes, for D200 alone
`fire100`: skips as a share of captures reached at 47 000 nodes, rows fired, and skips by quiescence ply. `fire`: depth-6 node, quiescence-node and SEE-call ratios. d7 nodes (kiwipete, position-6); d8 on position-4 / position-5 / startpos; reach at 20 000; mate d4 → d5; `chooseMove` mate d6 → d6; `qaudit`.

## Verdict rule
- **A form passes both gates:** the premise is met. `ADR-0074` is written PROPOSED for the chosen form with the bars above, the intent, a test-only off-door pair (`ADR-0026` d10), file list, test rows, falsifiers and effort, showing all nine items. It records that it amends `ADR-0024` d4 on the owner's acceptance.
- **No form passes:** the premise is **not met on `main`**. `ADR-0074` is written PROPOSED saying so plainly (the `ADR-0063` / `ADR-0065` / `ADR-0066` pattern), the failed gate(s) named, all nine items shown as far as they apply. No form is tuned after the read. The recommendation is to park it, `ABC-289` F2's disposition, and d4 keeps delta pruning on its list. Any override is the owner's.
- Anything run after the gates are read is labelled DIAGNOSTIC and cannot change the verdict. A miss is never re-played. No margin or form is added or moved after the read.
