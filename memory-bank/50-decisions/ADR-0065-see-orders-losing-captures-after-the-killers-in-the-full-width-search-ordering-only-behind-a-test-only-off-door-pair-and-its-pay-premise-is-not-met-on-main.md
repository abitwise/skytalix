---
kind: adr
id: ADR-0065
---
# ADR-0065: SEE orders the losing captures after the killers in the full-width search, ordering only. A capture is losing when its static exchange is below −50 cp; quiescence is unchanged; it sits behind a test-only off-door pair. Its pay premise is not met on `main`

## Status

**PROPOSED, premise not met; ticket parked by the Orchestrator 2026-11-03** (`orch-2026-10-30a`
`…24990015` ruling 1; `ABC-234` stays in Backlog). *Dated line by Architect/Design, task `arch-adr0056-fold-1103`,
records only.*

**PROPOSED 2026-11-03. PREMISE NOT MET ON `main`; THE BUILD DOES NOT START.** Recorded by Architect/Design (task
`arch-ABC-234`, records only, on `grugops/arch-ABC-234` from `main` `17725732`). The probe ran on a scratch copy of
`main`'s `src/` (tree `58fa3eb4`, `e72487e1`'s, futility in force; the tree `ADR-0063` measured), outside the
repository, under the host lock, one job at a time. Nothing was committed to `src/`. The patches, the driver and every
output are under `.grugops/context/arch-ABC-234/raw/probe/`.

- **The method.** The instrument, the premise counters, three forms, two gates, the choice rule, the bar rules and
  the verdict rule were sealed and committed before any measured run (decision `…9ac61a7a`, commit `9ca30923`).
- **The verdict, by that rule.** Every form passes the safety gate: zugzwang 7 / 7, `G1` 54 / 58, mate floor 0,
  drift within its bars. **Every form misses the pay gate** of ≤ 0.95× nodes at depth 8 on all four readings. The
  closest form, S1m, reads 0.9011 / 0.9428 in `search()` and **0.9864** / **0.9548** in `chooseMove` (kiwipete /
  position-6). No form is tuned after the read.
- **The premise mechanism is real; the pay is not.** On `main`, 69 % of full-width nodes at depth 6 put a losing
  capture ahead of a quiet move, and 83 % of the losing captures searched are refuted. Moving them back raises the
  first-move cutoff rate from 81.9 % to 92.6 %. But the work saved shows mainly in a cold `search()`. In the shipped
  path, `chooseMove`, iterative deepening already gives most cut nodes a hash move, and kiwipete moves 1.4 %.
- **The intent, by the rule:** NEUTRAL (S1m's reach gain is +0.068 ply, below +0.10). But C2′ does not admit
  NEUTRAL for O3s: it fires at 100 ms (at depth 6, S1m changes the order at 310 945 null-window nodes, against 545 452 full-width nodes in all), and `ADR-0056` lists
  O3s among the rows that fire there. So a re-open is GAIN. No C2′ read is owed.
- **A0 (the fence), read and ruled** (decision 1). `ADR-0024` d4's re-open condition is not met on its own words,
  and it does not govern this ticket: it fences SEE **pruning** in quiescence (Q1), not ordering in the full-width
  search. The measured premise decides `ABC-234`, and it is not met.
- **"Accept ADR-0065" is not put to the owner.** It fails its own premise, as `ADR-0060` and `ADR-0063` did.
- **`ABC-234` stays in Backlog.** DoR item 10 now reads "`ADR-0065`: premise not met on `main`" in place of "the
  fence's evidence is unread; ADR", and A0 is answered by decision 1. Those edits are BA/PM's.
- **What re-opens it** is a new named premise with a new pre-registered probe:
  1. **Q1 built first** (SEE pruning of losing captures in quiescence, out of check). It carries the `see` module
     and its `A1` fixture, which is the shared cost. O3s is then re-measured with Q1 as its door. The counters say
     Q1 is where the SEE lever is: 31 % of quiescence moves on `main` are losing captures, and 97 % of those are
     refuted. A diagnostic Q1 reads +0.88 ply of reach (§ Diagnostics). The one diagnostic reading of S1m over Q1
     still misses in `chooseMove` (0.961 / 1.095), so this condition is named, not expected.
     - *Dated 2026-11-03 (`arch-owner-answers-1103b`; owner `…401c3d09`):* **Q1 designed (`ADR-0069`, accepted).**
       Form QS: quiescence only, threshold `see < 0`, out of check. It is not built yet. An O3s re-open is a new
       PREREG over the merged Q1, with Q1 as its door, and it re-reads the instrument counts on that `main`.
  2. **Staged move generation (V3)**, where a losing capture is not generated or scored until the quiet moves are
     exhausted, so ordering also saves generation work that a node count cannot see.
  3. **An instrument that reads time per move**, if the owner rules that node counts under-read an ordering change.
     None exists today.
- **What it amends:** no ADR. It follows `ADR-0026` decision 10's pattern for the day it is built. The lines owed to
  `ADR-0056` (rows O3s and Q1), `EPIC-011` and the `ABC-234` page are listed in the decisions note of
  `arch-ABC-234`, not edited here.

## Context

`ADR-0056` D2 row O3s: "SEE for capture ordering, +10–30, M, low risk", Phase 3. The 2026-11-02 dated line (`arch-next-pull`)
ranks it after E1 and E2, "estimated 0–15 Elo here". The owner asked for design one ticket at a time: `ABC-234`,
then `ABC-236`, then `ABC-239` (brief, 2026-11-03). `ABC-234` asks for a pure `see(move) → cp`, with losing captures
ordered after the killers (or as the ADR rules), quiescence unchanged, behind an `ADR-0026` d10 off-door pair, paid
by ≤ 0.95× nodes (`A3`).

**The order today** (`src/search.ts` `orderKey`, shared by both recursions through `orderMoves`):
- the hash move, 3 000 000;
- then every capture and promotion, 1 000 000 + MVV-LVA (`mvvLvaKey`, `ADR-0024` decision 2);
- then this ply's two killers, keys 2 and 1;
- then every other quiet move in generation order, key 0.

So Q×P into a defended pawn is tried before every killer. Flat LMR reduces quiet moves at index ≥ 3 by one ply, and
futility skips quiet moves at index ≥ 1 at null-window nodes of depth 1–3. Neither ever touches a capture. So moving
a capture back lowers the index of every quiet move behind it, which changes what LMR reduces and futility skips.

**Quiescence today:** `quiesce` orders captures by MVV-LVA only. It neither orders by SEE nor prunes on it
(`src/quiescence.ts` header: "Not here … static exchange evaluation"). This ADR leaves it unchanged (the ticket's
scope 2).

### The instrument

- **The base:** `main`'s `src/`. First `arch-post-268`'s `patch_post268.py`, unchanged (it supplies `probeNode` for
  the audit). Then `patch_234.py`:
  - `see()` in scratch `quiescence.ts`: a swap list on the target square, the least valuable attacker each step, and
    x-rays through captured squares. Pins are ignored. Values are `ORDER_VALUE`'s, with the king at 20 000.
  - `orderKey` takes the node's position, at all four `orderMoves` call sites.
  - Premise counters and the SEE audit mark.
  - With `see: 0` the result is `main`, node for node.
- **The instrument check is exact.** The door reads `search()` d8 888 786 / 1 262 046 and `chooseMove` d8
  1 306 981 / 391 451, with reach 5.837 at 47 000. Its zugzwang counts are 905 900 (`.004`) and 1 310 019 (`.005`),
  and its `G1` is 54 / 58. All equal `ADR-0061` d9's and `ADR-0063`'s.
- **SEE check:** `see < 0` on all 24 `HANGING_CORPUS` losing moves (24 / 24). The hand rows came out at 5 of 6 as
  sealed. The sixth was **my own arithmetic error in the PREREG, not an instrument defect**: R×R, R×R (x-ray queen
  behind) was sealed as +500. It is an even trade, so 0 is correct, and the instrument returned 0. The code was not
  changed. CPW's x-ray row (both sides, −220) passes. A build's `A1` fixture must carry ≥ 20 such rows.
- **The runs:** three batches, each `flock <host-test.lock> timeout 3000`, with every job under `timeout 600`,
  **one job at a time**, 42 jobs, every exit 0. Then one DIAGNOSTIC batch, written after the verdict. Each run used a
  fixed depth, or `chooseMove` with `maxDepth` or `maxNodes` on a frozen clock. `G1` used its virtual clock. No timing
  was read.
- **The forms.** All are ordering only, in both recursions. Losing captures are ordered among themselves by MVV-LVA.
  The hash move stays first even if it is a losing capture. A capture is never losing if it promotes, is made by the
  king, or takes a piece worth at least its attacker. So en passant (P×P) never is.
  - **S1:** a capture is losing when `see < 0`; losing captures go after the killers, before the other quiet moves.
    This is the ticket's scope 2, listed first.
  - **S2:** a capture is losing when `see < 0`; losing captures go after every quiet move. This is the ticket's
    title.
  - **S1m:** as S1, but a capture is losing when `see < −50`, so a bishop-for-knight trade (−10 at 330 / 320) stays
    with the captures.

### The premise on `main` (the door), read first

`search()` at depth 6 over the 190 (+ 6 endgames), with losing meaning `see < 0`:

| reading | `main` |
|---|---|
| full-width nodes holding a losing capture | 387 489 of 561 784 (69.0 %) |
| … with it ordered ahead of a quiet move | 387 465 (69.0 %) |
| losing captures searched | 267 506 |
| … refuted (score ≤ alpha before it) / raised alpha / cut | 221 545 (82.8 %) / 1 732 / **44 229** |
| cutoffs made by a losing capture | 44 229 of 485 151 (**9.1 %**) |
| nodes under losing captures / under refuted ones (nested subtrees counted at each level) | 39.1 % / 22.4 % |
| first-move cutoff rate | 81.9 % |
| quiescence moves that are losing captures (report, Q1) | 3 764 141 of 12 019 326 (31.3 %), **96.9 % refuted** |

- The sealed expectation was that at least ~5 % of nodes must be recoverable for 0.95× to be reachable. 22.4 % sit
  under refuted losing captures, so the expectation did not rule the gate out. The nested count overstates that
  share, and the gate decides.
- **9.1 % of all cutoffs are made by a capture SEE calls losing.** A static exchange misses pins, overloaded
  defenders, discovered attacks and mate threats. Each of those cutoffs is delayed by any form that moves losing
  captures back.

### What the probe measured

Ratios are head / door at depth 8. Reach is the gain in mean completed depth at 47 000 nodes on the 190. Drift is at
depth 5 on the 190 (share within 25 cp; max). Mate is door d4 → head d5 / same depth d5, violations. The audit gives
flips and the count of errors of 100 cp or more.

| form | `search()` kiwi / pos-6 | `chooseMove` kiwi / pos-6 | reach | drift `search()` / `chooseMove` | mate | zugzwang | `G1` | audit (d6, every 10th marked node) |
|---|---|---|---|---|---|---|---|---|
| S1 | 0.9143 / **1.3232** | **0.9936** / **1.4028** | +0.026 (11 deeper, 6 shallower) | 100 %, 0 / 100 %, 21 | 0 / 163; 0 / 189 | 7 / 7 | 54 / 58 | 0 of 32 600; 0 |
| S2 | **1.5840** / **2.1451** | **1.4333** / **2.5143** | −0.058 (12, 22) | 98.4 %, 56 / 98.4 %, 56 | 0 / 163; 0 / 189 | 7 / 7 | 54 / 58 | 6 of 63 480 (0.01 %); 0 (max 71 cp) |
| **S1m (design of record)** | 0.9011 / 0.9428 | **0.9864** / **0.9548** | +0.068 (14, 1; 2 moves differ) | 100 %, 0 / 100 %, 21 | 0 / 163; 0 / 189 | 7 / 7 | 54 / 58 | 0 of 30 999; 0 |

Bold marks a reading above the 0.95× pay gate. The root move and score at depth 8 are unchanged on all four readings
for every form.

- **Reports (S1m).**
  - Depth 7 (the ticket's `A3` depth): `search()` 0.8463 / 0.7671, `chooseMove` 0.9899 / 0.9142. The ticket's `A3`
    as written (two readings, from a cold table) would pass. The pre-registered gate (four readings, d8) does not,
    and the gate stands.
  - Depth 8 on other roots (`search()` / `chooseMove`): position-4 1.019 / 0.986, position-5 0.998 / 1.014, startpos
    0.930 / 0.923.
  - Reach at 20 000 nodes: 4.842 → 4.905 (+0.063).
  - Premise counters at depth 6, head: nodes 0.9074× the door's; first-move cutoff rate 92.6 %; cutoffs by a losing
    capture 1 937 (0.4 %).
- **S1 vs S1m.** S1's position-6 blow-up (1.32 / 1.40) comes from its threshold. At `see < 0`, B×N onto a defended
  square (−10) counts as losing, and position-6 is full of minor-piece trades. The −50 margin removes it.
- **S2 vs S1.** Putting losing captures after every quiet move makes every SEE-losing capture that would have cut
  (9.1 % of cutoffs) wait for the whole quiet list. That costs 1.43–2.51×, and drift reaches 56 cp.

### Why the pay is small: in the shipped path the hash move already ordered the cut nodes

- Ordering only saves work at cut nodes, where a later move cuts. At all-nodes every move is searched anyway, and a
  losing capture moved to the back is still searched in full.
- In a cold `search()`, many cut nodes have no hash move. There SEE ordering wins: 0.90 / 0.94 at d8, 0.85 / 0.77 at
  d7.
- In `chooseMove`, each iteration hands the next one its best moves through the table. Most cut nodes already try
  the refutation first, and kiwipete moves 1.4 %. The engine plays through `chooseMove`, so the pre-registered rule
  reads both recursions, and `chooseMove` is the honest reading of play.
- It is the same lesson as `ADR-0063`: on this search the hash move, MVV-LVA and the killers leave little for a
  third-tier ordering to win.

### Diagnostics (added after the pay-gate miss; not pre-registered; they cannot change the verdict)

One batch on a second scratch copy (`patch_diag_q1.py`, `batch4.sh`; 8 jobs, every exit 0).
- **Depth 10, S1m:** `search()` 0.8678 / 0.7871, `chooseMove` 0.9216 / **1.0603**.
  - The `chooseMove` readings do not trend toward the gate: kiwipete improves a little, and position-6 gets worse.
  - So a NEUTRAL re-cut with a deeper node bar is not supported, as in `ADR-0063`.
- **Q1 for information** (EPIC-011's stub, out of this ticket's scope). Out of check, quiescence skips every
  capture with `see < 0`, over `main`:

  | reading | Q1 over `main` |
  |---|---|
  | d8 `search()` kiwi / pos-6 | 0.6782 / 0.3227 |
  | d8 `chooseMove` kiwi / pos-6 | 0.5876 / 0.2239 |
  | reach at 47 000 | **5.837 → 6.721 (+0.884 ply**; 128 deeper, 1 shallower; 22 moves differ) |
  | drift d5 `search()` | 96.26 % within 25 cp, max 69 cp (kiwipete/a1d1 301 → 232), 0 sign changes |
  | mate floor d4 → d5 | 0 / 163 |
  | zugzwang | 7 / 7 |
  | `G1` | 54 / 58, none newly missed |

  - Kiwipete's d8 root move changes, e2a6 (−60) → d5e6 (−89). It is a value change, so it needs its own bars.
  - **Read: this is the SEE lever on this engine**, close to a ply of reach at the 100 ms node budget. O3s is not.
    It is a diagnostic with no PREREG. Q1 needs its own pre-registered probe, an ADR, and `ADR-0024` d4 opened by
    evidence or by the owner's word (decision 1).
- **S1m over Q1** (re-open 1's shape, measured once): d8 `search()` 0.8646 / 0.8679, `chooseMove` 0.9611 /
  **1.0953** against Q1 as door. Even over Q1, the shipped path does not pay. Re-open 1 stays a named condition, and
  this one reading does not support it.

## Decision

The design of record is the one a re-open builds. It is not cleared to build on today's `main` (§ Status). S1m is
named as the design of record because, of the three pre-registered forms, it is the nearest to the gate. A re-open
re-measures it under its own PREREG.

1. **A0 (the fence), ruled.**
   - **Read:** `G1` (`ABC-084`'s suite) is 54 / 58, and the four unsolved rows are mate-in-3 headroom rows. All 24
     `do-not-hang` rows, each a capture onto a defended square, are solved on `main` and under every form. So
     `ADR-0024` d4's re-open condition ("losing material to a defended-square capture it should have pruned") is
     **not met**.
   - **Ruling:** d4 fences SEE as a quiescence **pruning** tool: the SEE-lite column is a lossy prune, and "should
     have pruned" is its test. Ordering in the full-width search prunes nothing. Here it changes values only through
     the index LMR and futility read, and this probe measured that as 0 cp drift in `search()` and at most 21 cp in
     `chooseMove` for S1m. So d4 governs Q1, not O3s, and A0 alone does not close `ABC-234`. The measured premise
     decides, and § Status records it as not met.
   - Q1 still needs d4's evidence, or an owner's word, to open. The quiescence counters above are new evidence of
     **cost**, not of material lost. Whether they re-open d4 is the Orchestrator's to weigh. They do not show a lost
     puzzle.
2. **The evaluator.** A new pure module, `src/see.ts`, exporting `see(position, move): number` (cp for the mover)
   and `isLosingCapture(position, move): boolean`.
   - The algorithm is the swap list on the target square: the least valuable attacker each step (P, N, B, R, Q, K),
     x-rays through captured squares, pins ignored. It uses `mvvLvaKey`'s `ORDER_VALUE` (100 / 320 / 330 / 500 /
     900), with the king at 20 000 so it captures last.
   - A capture is **losing** when it does not promote, is not made by the king, takes a piece worth less than its
     attacker, and has `see < −50`.
   - No per-call allocation (the `ABC-240` rule): one fixed `Uint8Array(128)` removal mask and one `Int32Array(32)`
     gain list, about 256 bytes, summed by `seeScratchByteLength()` for `NFR-009` (a).
   - Pure: it reads the board and changes nothing.
3. **The order, losing captures after the killers.** `orderKey` gains the node's position. Its tiers become:
   - the hash move, 3 000 000;
   - captures and promotions that are not losing, 1 000 000 + MVV-LVA;
   - killers, 2 and 1;
   - **losing captures, 0.5 + MVV-LVA / 10 000** (always strictly between 0 and 1);
   - every other quiet move, 0.
   - The insertion sort is stable. With the switch off the key is today's, exactly.
4. **The API change.** `orderMoves(moves, killers, hashMove, position: Position | null)`. Every caller passes
   either the node's position or `null`: `search.ts` `ordered()` at negamax and the root, and `engine.ts` at negamax
   and the root. With `null`, or with the switch off, nothing is computed. The ordering scratch is unchanged.
5. **Quiescence is unchanged.** `orderCaptures` and `quiesce` keep MVV-LVA (`ADR-0024` decision 2). SEE in
   quiescence is Q1's, a separate EPIC-011 stub.
6. **One switch, `seeOrdering`, in BOTH recursions** (`Switches`, `Heuristics`), on in `search()` and `chooseMove`
   only.
7. **Two TEST-ONLY doors: `searchWithoutSeeOrdering(position, depth)` and `chooseMoveWithoutSeeOrdering(position,
   options)`.**
   - Every older door turns `seeOrdering` off (`ADR-0026` decision 3's ladder).
   - Rows re-point by `ADR-0050` decision 4, `ADR-0058` decision 5, `ADR-0059` decision 6 and `ADR-0061`
     decision 6. Value and behaviour rows stay on the shipped path. No zugzwang row's depth is re-pinned.
   - **Export lists:** `ABC-077` `A6` grows by **three** (the door, `see`, `seeScratchByteLength`; `isLosingCapture`
     stays module-internal unless `A1` needs it). `ABC-078` `A4` grows by **one**.
8. **The rows it adds.**
   - `A1`: ≥ 20 hand-checked exchange positions committed as a fixture, x-rays included, with `see` equal to the
     hand value on every one. This probe's six rows (with row 4 at 0) and the 24 `HANGING_CORPUS` losing moves are a
     start.
   - An order row: a losing capture sorts below both killers and above every other quiet move. A B×N onto a
     pawn-defended square (−10) is NOT losing.
   - A source row: `orderMoves` reads the position only when the switch is on.
9. **The bounded oracle, derived by the PREREG's rules for S1m.**
   - Drift at depth 5 on the 190 in both recursions, against the doors: ≥ 95 % within 25 cp, none beyond **31 cp**
     (⌊1.5 × 21⌋), and 0 mate sign changes.
   - Mate floor at the **same depth**, d5 → d5 on the 287: 0 of 189.
   - Zugzwang 7 / 7. `G1` ≥ 54 / 58, with no NEWLY-MISSED line.
   - The cut audit is information.
10. **`A3` / `A4`, the premise.**
    - (a) d8 nodes, kiwipete and position-6, both recursions: **≤ 0.95×** on each of the four readings, which is
      min(0.95, ⌈max + 0.05⌉). The ticket's `A3` (d7, two readings) is re-pinned to this.
    - (b) `G6` "≥ base" (`NFR-005`). `Q-3K-4` (b) covers evaluation tickets only.
    - **Measured: (a) is missed on two of four readings** (`chooseMove` 0.9864 / 0.9548). That is F4, and it is why
      the build does not start.
    - The instrument-check counts for a re-open on this `main`: head 800 871 / 1 189 843 / 1 289 196 / 373 765, and
      reach 5.837 → 5.905.
11. **The read, by reference:** C2′, S′ at **E 1 810** (`--elo 1810`), and the Levels deep lane. The intent is
    **GAIN** (≥ 50.0 of 100): O3s fires at 100 ms, so "NEUTRAL (invisible at 100 ms)" is closed to it (§ Status).
    R-TC: the rule reads no budget, deadline or environment.
12. **LMR and futility change through the index, not by rule.** A losing capture moved back lowers the index of each
    quiet move behind it, so fewer quiet moves are reduced and the same number are skipped. That is measured above
    as drift and audit. No reduction or pruning predicate changes.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | 3 — drift | a non-mate score beyond 31 cp, < 95 % within 25 cp, or a mate sign change, in either recursion | decision 9 | a defect first (the key tiers or the threshold). On an exact build: NOT MET |
| **F2** | 3 — mates | a door mate at d5 on the 287 not a same-sign mate for the head at d5 | decision 9 | a defect |
| **F3** | 3 — zugzwang | any of `ADR-0050` d9's seven rows not played at its recorded depth | decision 9 | a defect. Never a re-pin |
| **F4** | the premise, it pays | `A3` / `A4` (a) above 0.95× on any of the four readings | decision 10 | **fired on 2026-11-03, on `main` `17725732`** (src `58fa3eb4`) (S1m: `chooseMove` 0.9864, 0.9548). The build does not start |
| **F5** | the premise, strength | C2′ < 50.0 of 100, or an S′ collapse | decision 11 | not merged; this ADR reads "accepted, not in force" |
| **F6** | 2 — the evaluator | `see` differs from a hand value on an `A1` row | `A1` | a defect in `see` |
| **F7** | 6, 7 — the doors | a new door not node-equal to the pre-ticket search, or an older door not node-equal to itself, on the `ABC-078` `A3` corpus | `A2` (`G4`) | a defect in the switch wiring |
| **F8** | regression | `G1` below 54 / 58, or a NEWLY-MISSED line | `A4` | classed per row under `ADR-0034` |

## Alternatives

- **S1, losing at `see < 0`.** Measured: it costs 1.32 / 1.40× on position-6, because B×N (−10 at 330 / 320) counts
  as losing. Rejected. Equal minor values (B = N) would act much like the −50 margin. That variant is not measured
  and is not taken: the margin also keeps marginal exchanges that SEE misjudges.
- **S2, losing captures after every quiet move (the ticket's title).** Measured at 1.43–2.51× with a 56 cp drift.
  Rejected. The 9.1 % of cutoffs that SEE-losing captures make on `main` must wait for the whole quiet list.
- **Order the winning captures by SEE as well, in place of MVV-LVA.** Not measured, and out of the ticket's scope.
  It would cost a SEE call per capture at every node, against a gain the losing-capture tier does not show.
- **SEE ordering in quiescence.** Rejected for this ticket. MVV-LVA already bounds the capture tree (`ADR-0024`), and
  the lever there is pruning, which is Q1.
- **Ship it anyway as Q1's enabler, read by C2′ alone.** Rejected. It would ship an order change that misses its
  own pay bar. The honest form is to build `see` with Q1 and re-measure O3s over it (§ Status, re-open 1).
- **Close the ticket unbuilt on A0's words.** Not taken (decision 1): d4 fences quiescence pruning. The premise
  measurement is the stronger reason to park, and it leaves named re-open conditions.

## Consequences

- **NFRs.**
  - `NFR-009`: about 256 bytes fixed (decision 2), summed by `seeScratchByteLength()`.
  - `NFR-005`: `G6` reads it. Per-node cost: one SEE per capture whose victim is worth less than its attacker. Not
    timed here; `G2` / `G6` read it at build (`UNKNOWN - verify`).
  - `NFR-008`: the `A1` fixture and the order rows are default-lane units. Drift, mate, zugzwang and reach go behind
    the deep lanes.
  - No new NFR file. `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`):** `see` is a pure function of the board. The same input and virtual clock give the same
  move.
- **E1 (`ABC-269`, in flight)** changes `evaluate.ts` and `evaluate-params.ts` only. This ADR touches neither and does
  not depend on it. A re-open re-reads the instrument counts on whatever `main` is then.
- **`ABC-233` (history, parked)** shares `orderKey`. If both are ever built, they go one at a time, and the second
  re-measures over the first.
- *Dated 2026-11-03 (`arch-owner-answers-1103b`; `ADR-0069` accepted, `…401c3d09`):* **`src/see.ts` will exist once
  Q1 merges,** built to `ADR-0069` decision 4 with this ADR's decision 2 algorithm and Q1's threshold, 0, fixed. A
  re-open adds its own −50 test (its own losing test) beside Q1's. It does not change Q1's threshold or its rows. If the
  re-open reuses `see`, its scratch is Q1's 288 bytes, counted once in `NFR-009`, in place of the "about 256 bytes"
  above.
- **Migration:** none.

## Rollback

- **Now:** nothing was built. To withdraw, mark this ADR `withdrawn`.
- **After it ships (if re-opened):** set `seeOrdering` to false in `search()` and `chooseMove`, two booleans.
  Removing the module, the switch, the doors and the re-points is then a mechanical revert of one ticket.
