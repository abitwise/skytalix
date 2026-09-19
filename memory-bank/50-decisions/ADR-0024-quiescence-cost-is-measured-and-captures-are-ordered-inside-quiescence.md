---
kind: adr
---
# ADR-0024: The quiescence cost model is MEASURED, not 2.5x — and capture ordering belongs INSIDE quiescence

## Status

**proposed** — 2026-09-19 by Architect/Design (task `wave-2026-09-19`, subtask
`ruling-abc079-multiplier`, Workflow 07), ruling on `ABC-079`'s tripped `A5` stop condition as the
owner named on that ticket's page (`NFR-005` trigger, owner Architect/Design). No agent may move an
ADR to `accepted`. **Overturnable on the same evidence: every number below comes from one probe
script that any reader can re-run** (`.grugops/context/ruling-abc079-multiplier/notes/`, the
`observation` note carries the script's shape and every row).

**Supersedes `ADR-0003` on ONE INPUT ONLY:** the *"quiescence factor 2.5"* that clause 2's
required-rate arithmetic uses (depth 6 needs ~47k nodes/s, depth 7 ~280k). `ADR-0003` itself marked
that figure *"a literature assumption, not a measurement"* and put its confidence on clause 2 at
*medium* for exactly that reason. **Clause 2's depth levels (depth 6 FAIL / depth 7 WARN) were
ratified by a named human on 2026-07-30 and DO NOT MOVE here** — this ADR corrects the arithmetic's
input and states the consequence honestly; re-levelling `NFR-005` is the owner's, not this role's.
Clauses 1 and 3 of `ADR-0003` are untouched.

## Context

`ABC-079` built quiescence on captures (`src/quiescence.ts`) and its `A5` criterion tripped: the
same-depth node ratio `search()` / `searchWithoutQuiescence()` read **kiwipete 702x / 878x /
1 483x / 1 540x at depths 1–4, position-6 62x / 377x / 120x / 167x**, against a 4x stop and a 2.5x
model. The Engineer halted and reported rather than tuning (correct). The Orchestrator asked for a
ruling that PROBES before it rules, specifically: is this a property of quiescence, or of THIS
quiescence — does the build apply stand-pat, raise alpha, generate captures sanely, and is the cap
of 8 hiding or causing the explosion?

### What the probe found (Apple M3, Node v24.12.0, load 3.0–6.5 with two sibling hops live; node counts are deterministic, milliseconds are not)

**1. The build is a textbook stand-pat quiescence and is NOT defective.** An independent
reimplementation written from scratch for the probe (stand-pat as a lower bound, `alpha` raised to
it, fail-soft alpha-beta, captures filtered from `legalMoves`, cap 8) reproduces the shipped
`quiesce` **to the node** — identical totals AND identical per-capture-ply histograms — at every
depth 1–3 on both positions (kiwipete 34 401 / 274 704 / 13 368 024; position-6 2 899 / 211 986 /
1 740 783). The stand-pat cutoff fires, `alpha` is raised, `evaluate` is side-to-move-relative, the
window handed down from `negamax` is right. There is nothing to fix in the stand-pat logic.

**2. The multiplier is a property of UNORDERED quiescence on capture-dense positions, and the cap
of 8 is the only thing holding it.** The capture tree GROWS with capture ply instead of shrinking:
at kiwipete depth 1 the shipped q-nodes per ply read `75 / 466 / 491 / 1 924 / 2 007 / 6 485 /
8 053 / 14 851` for plies 1–8 — 43% of all quiescence work sits at the cap. Lift the cap (64) and
the same code reads **13 730x at depth 1 and 20 871x at depth 2** on kiwipete. Mechanism: with
captures searched in generation order, a losing capture (queen takes a defended pawn) is refuted
only when the child eventually reaches the recapture, and every capture generated BEFORE that
recapture is searched to its own full subtree first. Cost ≈ (captures ahead of the refutation) ^
(capture plies). The `A3` cap is doing a budget's job while being documented as a runaway guard.

**3. Ordering the captures — MVV-LVA, most valuable victim first, least valuable attacker as the
tiebreak — is the single lever, and it is LOSSLESS.** Same score and same move in every cell.

| position | depth | shipped (unordered) | MVV-LVA | MVV-LVA, no cap | + delta pruning | + delta + SEE-lite (LOSSY) |
|---|---:|---:|---:|---:|---:|---:|
| kiwipete | 1 | 702.1x | **120.2x** | 193.6x | 86.3x | 24.1x (score 175 ≠ 145) |
| kiwipete | 2 | 877.7x | **33.2x** | 39.7x | 22.1x | 6.9x (score 175 ≠ 70) |
| kiwipete | 3 | 1 482.7x | **45.0x** | 75.7x | 30.7x | 12.0x (score 55 ≠ 50) |
| kiwipete | 4 | 1 540.3x (Engineer's measurement) | **26.4x** | not run | 19.3x | 8.3x (score 55 ≠ 50) |
| position-6 | 1 | 61.7x | **6.3x** | 6.6x | 4.3x | 1.2x |
| position-6 | 2 | 377.2x | **17.4x** | 24.9x | 13.2x | 1.4x (score 25 ≠ 30) |
| position-6 | 3 | 119.5x | **8.3x** | 10.2x | 6.0x | 1.2x |
| position-6 | 4 | 166.7x (Engineer's measurement) | **7.5x** | not run | 5.8x | 1.0x |

Once ordered, lifting the cap no longer explodes the tree (45x → 76x, 8.3x → 10.2x at depth 3):
**with ordering the cap of 8 IS a runaway guard; without it the cap is a budget in disguise.**
Delta pruning alone, without ordering, barely moves the number (498x / 741x / 1 083x on kiwipete)
— ordering is the lever, delta is a 1.5x trim on top. The SEE-lite column prunes captures by a
piece worth more than its victim onto a defended square: it is the biggest single reduction AND
it changes the returned score, so it is a strength question for `ABC-084`'s puzzle count, not a
cost fix.

**4. The ORDERED multiplier is still 8x–120x, and no honest quiescence on kiwipete reads 4x.**
The 2.5x in `ADR-0003` is a literature figure for quiescence's share of total nodes in a fully
ordered engine with a transposition table and SEE; it was never a same-depth ratio on unordered
captures at a bare leaf, and no fix inside `ABC-079`'s fence reaches it on kiwipete. So **the
model is wrong as an input, AND the build is incomplete as a bound** — both, and they are fixed
in different places.

## Decision

1. **`ABC-079`'s build is not defective and is not re-designed.** The stand-pat logic, the fail-soft
   convention, the shared leaf between `src/search.ts` and `src/engine.ts`, the `visit` hook and
   the unmake-in-`finally` all stand. `src/quiescence.ts`'s header line *"Move ordering is
   `ABC-080`'s; captures are searched in generation order"* is the line this ADR overturns.

2. **Capture ordering inside `quiesce` is `ABC-079`'s, not `ABC-080`'s.** The Engineer's re-hop
   sorts the capture list MVV-LVA before the loop (victim value descending, attacker value
   ascending as the tiebreak; a capturing promotion ranks by its victim plus the promotion piece).
   The reason it is drawn here: ordering inside quiescence decides whether the capture tree is
   BOUNDED (point 2 above), which is a correctness property of the horizon fix; ordering in the
   full-width search decides how STRONG the engine is per node, which is `ABC-080`'s
   strength-per-line-of-code. Same heuristic, two different seams. **The key function is exported
   from `src/quiescence.ts`** (one pure function, `move → number`, no state) so `ABC-080` reuses
   it for its MVV-LVA arm rather than writing a second one. `ABC-080` does NOT need to land first
   — its page and board row carry the one-line follow-up (*"the MVV-LVA arm reuses
   `src/quiescence.ts`'s key; measure, do not re-derive"*), which is BA/PM's to write.

3. **`ADR-0003`'s 2.5x is superseded by the measured, ORDERED figures in the table above.** `A5`
   is re-stated (the ticket page § Ruling carries the wording): the criterion measures the
   same-depth ratio WITH MVV-LVA-ordered captures, on kiwipete and position-6, and STOPS at
   **1.5x the recorded figure** — kiwipete ≤ 180x (d1, default lane), ≤ 50x (d2) and ≤ 70x (d3)
   in the deep lane; position-6 ≤ 10x (d1), ≤ 26x (d2), ≤ 13x (d3). Node counts are deterministic,
   so the headroom absorbs legitimate evaluator changes, not noise; losing the ordering reads
   6x–30x over the level, which is what the stop must catch. `A5` remains a stop condition:
   over the level, halt and report to Architect/Design; do not tune.

4. **Still out of scope, unchanged from the ticket's fence:** delta pruning, SEE, checks in
   quiescence, quiet promotions. Measured here so the next ticket has a number, not built here.
   The SEE-lite column is the evidence that reopens the fence IF `ABC-084`'s puzzle count says the
   engine is losing material to a defended-square capture it should have pruned.

5. **The cap of 8 stays, as a guard, with its binding recorded.** Ordered, kiwipete still puts
   ~25% of its quiescence nodes at ply 8 (depth 3) and the capped depth-1 score differs from the
   uncapped one (145 vs 70) — the guard is not free on kiwipete. It is a guard because lifting it
   no longer explodes the tree; it is recorded because a future reader will otherwise assume it
   never binds.

6. **`NFR-005`'s arithmetic consequence, stated and NOT hidden.** With an ordered factor of ~45
   (kiwipete depth 3) in place of 2.5, `ADR-0003` clause 2's required rate for depth 6 in 3 s
   scales from ~47k to ~850k nodes/s against a measured 200k–550k, and depth 7 further still.
   Depth 6 on kiwipete at the 3 s budget is not reachable by node rate alone with this
   evaluator and this move generator. That was already true before quiescence (the `ABC-078`
   record reached depth 4); quiescence makes the gap wider and TRUER — the depth reached is now
   depth to a quiet position, which is what the level meant. The levers are the ones `ADR-0003`
   clause 3 already lists — (c1) pseudo-legal search, measured 2.6x — plus `ABC-081`'s table and
   `ABC-080`'s full-width ordering. **The level does not move here; the owner re-levels or holds
   it with this arithmetic in front of him.**

7. **Three collateral rulings the subtask asked for**, each also on the ticket page:
   - `searchWithoutQuiescence` (the TEST-ONLY door widening `ABC-077` `A6` by one name): **IN.** It
     is the same mechanism `ABC-077` built for `searchWithoutPruning` — a named door, no production
     caller, the `Switches` record already threaded through the recursion — and `A4`/`A5` cannot be
     measured without it. Rejected: an options parameter on `search()` (unrequested flexibility
     and an engine option in production, coding rule 7).
   - The unabortable first iteration carrying depth-1 quiescence (444 ms on a 50 ms budget, loaded):
     **an accepted bound once ordered, not an `ABC-078` regression this ticket must re-structure.**
     Ordered depth-1 on kiwipete is 5 888 nodes (16 ms here, loaded) against 34 401 unordered;
     `ABC-078`'s "depth 1 always completes so a move always exists" holds at that cost. The re-hop
     re-runs `ENGINE_DEEP=1` and the 50 ms case must pass as written; if it does not at ~6k nodes,
     that is a new report with the number, not a re-fixture.
   - `SEARCH_DEEP=1 npx vitest run src/search.test.ts` (killed at 300 s): **the lane must read
     exit 0 with its case count and wall time recorded, at its EXISTING per-case timeouts.** The
     unpruned oracle pair is the likely cost: `searchWithoutPruning` never raises `alpha`, so every
     leaf's quiescence opens with a full window. If a case cannot meet 30 s with ordered captures,
     the Engineer reports the number and drops THAT case's depth by one on kiwipete only, recorded
     in the test and the notes — the per-case timeout is not raised as a first resort.

## Alternatives

- **`ABC-080` lands first, `ABC-079` waits.** Rejected: it couples the horizon fix to killers and
  the hash move (dormant until `ABC-081`), and it would put the bound-deciding sort in a module
  that does not own the capture loop. The one thing quiescence needs from ordering is a six-line
  sort of its own capture list.
- **Keep unordered captures and re-state `A5` at the shipped figures (700x–1 500x).** Rejected: the
  numbers are the cap doing a budget's job (13 730x uncapped); shipping them and calling the cap a
  guard would be false. It also costs two plies of reached depth on both benchmark positions and
  +19 s of default-lane CPU on a lane already at `NFR-008`'s level.
- **Lower the cap to 2 (reads ~5x).** Rejected by the ticket itself: a 2-ply cap is a budget, and
  it returns the horizon at the second capture, which is the bug the ticket exists to fix.
- **Fold delta pruning in as well (another 1.5x).** Rejected here: the ticket fences it, coding
  rule 5, and its margin is a tuning with no puzzle-count evidence yet. Measured so the next
  ticket starts from a number.
- **Change `A5`'s measure to quiescence's share of total nodes.** Rejected: the same-depth ratio
  is what `ADR-0003`'s arithmetic actually consumes, and a share-of-nodes figure hides an
  explosion behind a large full-width denominator.

## Consequences

- `ABC-079` re-hops (Software Engineer): MVV-LVA sort inside `quiesce`, the key exported, `A5`'s
  test levels re-stated per decision 3, the three `src/engine.test.ts` fixtures re-fixtured against
  the ORDERED counts (not the 1 500x ones), `NFR-008` and `N8-LANE` re-measured, all three deep
  lanes run to completion with counts and wall recorded, the header comment in `src/quiescence.ts`
  corrected. The `A1`–`A4`, `A6` verdicts are unchanged by ordering (lossless) and are re-run, not
  re-argued.
- `ABC-080`'s MVV-LVA arm becomes a reuse; its `A`-criteria that measure ordering's effect keep
  their meaning for the full-width tree. BA/PM adds the one-line follow-up to its page.
- `plans/nfr-catalog.md` `NFR-005`: level unchanged; the arithmetic input it rests on is corrected
  here and pointed to from the catalog's header line. Verification stays `UNKNOWN - verify` on
  non-M3 hardware exactly as before.
- Confidence: **high** on points 1–3 (deterministic node counts, reproduced from an independent
  implementation); **medium** on the 1.5x headroom (a judgement, not a measurement — the first
  legitimate evaluator change tells us whether it was too tight); **UNKNOWN - verify** on the
  reached-depth consequence in decision 6 until the re-hop's `ENGINE_DEEP=1` run records it.

## Rollback

Revert the re-hop's sort and this ADR's `A5` levels, and `ABC-079` returns to its `ead14eb` shape
with `A5` RED — which is the honest state, not a working one. The cheaper rollback is of decision 2
alone: if `ABC-080` wants the key in its own module, it moves ONE exported function and updates
one import; nothing else in `src/quiescence.ts` depends on where the key lives. Detection that this
ADR was misapplied: the `A5` cells reading within 1.5x of the UNORDERED column (700x–1 500x)
after a merge means the sort was lost — the levels in decision 3 are set so that reads RED.
