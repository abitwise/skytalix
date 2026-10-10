---
id: ABC-079
title: Quiescence search on captures — the horizon fix
status: done
column: Done
size: S
priority: P0
epic: EPIC-004
feature: —
---

# ABC-079 — do not evaluate a position in the middle of a trade

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). Separated from
> `ABC-077` because it is independently valuable, independently measurable against a puzzle set, and
> because it is the term `ADR-0003`'s depth model prices separately (**quiescence 2.5x**).

## Problem

*User*: the player who watches the engine capture a defended pawn with its queen.

*Pain*: a fixed-depth search evaluates whatever position it lands on. If the last ply was a capture,
the recapture is one ply beyond the horizon and the evaluator scores a won pawn on a position where
a queen is about to be lost. **This is the single largest source of nonsense moves in a
material-evaluated search**, and it is exactly the failure the epic's fourth acceptance criterion
names: *"a piece hangs to a simple one-move tactic … it does not play the losing move."*

*Value*: it is the cheapest large strength gain in this epic — the epic's own scope calls move
ordering *"where most of the strength-per-line-of-code lives"*, and quiescence is second.

## Scope

- At a leaf, instead of evaluating, **search capture moves only** until the position is quiet.
- **Stand-pat**: the static evaluation is a lower bound — if it already beats beta, cut.
- Alpha-beta inside the quiescence search, same convention as `ABC-077`.
- A depth cap on the quiescence recursion **as a runaway guard only**, not as a budget.

## Out of scope

- **Checks in quiescence, delta pruning, SEE (static exchange evaluation).** Not requested; coding
  rule 5. If `ABC-084`'s puzzle count says one is needed, that is a new ticket with evidence.
- **Promotions as quiescence moves.** Deliberately excluded for now and named so it is a decision
  rather than an omission — revisit only with a puzzle-count measurement.
- **The per-move budget.** `ABC-078`'s. The runaway cap here is not a budget and must not become
  one.

## Acceptance (Given/When/Then)

- **`A1` (the hanging-piece criterion, from the epic).** **Given** a curated set of **≥ 20**
  positions where a naive material search plays a losing capture, **when** searched at default
  strength with quiescence, **then** the losing move is **not** chosen in **≥ 19 of 20** — and the
  same set is run **without** quiescence in the same test to show the *before* number, which must be
  strictly worse. *(A criterion with no baseline cannot show the feature did anything.)*
- **`A2` (stand-pat is a lower bound, not a replacement).** **Given** a quiet position, **then** the
  quiescence result equals the static evaluation **exactly**. **Given** a position where a winning
  capture exists, **then** the result is **strictly greater** than the static evaluation.
- **`A3` (it terminates).** **Given** **≥ 200** positions from the perft corpus including
  capture-dense ones, **then** quiescence returns on all 200 and the observed recursion depth never
  exceeds the stated cap.
- **`A4` (it does not change quiet-position results).** **Given** positions with **no** captures
  available at any depth in the leaf neighbourhood, **then** search scores are **identical** to the
  pre-quiescence build.
- **`A5` (cost is bounded and reported).** **Then** the measured node-count multiplier from
  quiescence is reported on `kiwipete` and `position-6`. **`ADR-0003`'s model assumes 2.5x.** If the
  measured multiplier exceeds **4x**, **stop and report** — the depth arithmetic this epic rests on
  was derived at 2.5x and a 4x reading invalidates it. **Do not tune the number to fit.**
- **`A6` (position integrity).** **Then** the input `Position` is byte-identical after every search,
  over the corpus.

## Dependencies

- **`ABC-077` — MERGED to `main` 2026-08-18, DISCHARGED.** It is the search this modifies. Measured
  2026-08-18 at HEAD `7ea9e1b`: `search()` at `src/search.ts:167`, `searchWithoutPruning()` at
  `:178`, `MATE_SCORE` at `:40`. **`A4`'s "pre-quiescence build" baseline is therefore a real thing
  in the tree**, not a hypothetical.
- **`ABC-076` — MERGED to `main` 2026-08-17, DISCHARGED** (transitively; stand-pat is the static
  evaluation, `src/evaluate.ts`).
- **THE ≥ 20-POSITION CORPUS IS THIS TICKET'S TO BUILD — ruled 2026-08-18 by BA/PM** (task
  `refinement-p0-chain-2026-08-18`), and the ruling is **asymmetric on purpose**. Both this page and
  `ABC-084` carried *"whichever lands first builds it"*, which is a rule that decides nothing while
  both are open. **The dependency graph decides it, not preference:** at HEAD `7ea9e1b` this
  ticket's only two dependencies are merged, while `ABC-084` still needs `ABC-078`, which is not
  built — so this ticket is the only one of the two that CAN land first. `ABC-084`'s own page already
  says *"`ABC-079` should land first"*. **So: `ABC-079` builds the corpus; `ABC-084` extends it and
  does not fork it.** The cost was already priced into `S` (see `## Size and priority rationale`,
  which names the curated position set as this ticket's main cost). ~~**`ABC-084`'s page and board row
  still carry the symmetric wording and need the one-line follow-up; that is the Orchestrator's to
  route, and it does not gate this ticket.**~~ **CLOSED 2026-10-09** (`cut-followups-2026-10-09`):
  `ABC-084`'s fold (`0ebe63f`, `fold-abc084-gate-b`) retired the symmetric wording. Its page now
  says that `ABC-079` built the corpus, that `ABC-084` moves its 24 rows byte-identical into a data
  module and extends them there, and that `A1` keeps reading exactly those 24. The `ABC-084` board
  row no longer carries the old wording.

## Security / NFR triggers

- **`NFR-005`** — `A5`'s **2.5x expected / 4x stop** multiplier is this ticket's contribution to the
  depth model. It is a named input to `ADR-0003`'s arithmetic, and exceeding it is a **reportable
  event with a named owner (Architect/Design)**, not a tuning exercise.
- **`N8-LANE` — ≤ 650 ms CPU.** `A1`'s 20-position set runs with a **millisecond budget**, not the
  3 s default — the puzzle work at real budgets is `ABC-084`'s and is opt-in.
- **Security — not triggered.** No input surface.

## Test notes

1. **`A1` must run both arms in the same test.** A puzzle number with no baseline proves nothing
   about the change that claims it.
2. **`A2`'s quiet-position exact equality is the cheapest correctness check** — write it first.
3. **`A5` is a stop condition, not a metric to admire.** If it reads > 4x, the ticket reports and
   halts; it does not adjust the cap until the number looks acceptable.
4. **Reuse `ABC-076`'s mirror helper corpus** where positions overlap. Do not fork a second corpus.

## Size and priority rationale

**Size `S` (2).** One recursive function of maybe 25 lines, sharing `ABC-077`'s conventions, with a
curated position set as the main cost. **Not `M`:** no new module, no new dependency edge, no
design decision open.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P0`.** It is the direct implementation of one of the epic's five acceptance criteria.

## Definition of Ready

Cut-hop assessment by BA/PM **2026-08-16**: **8 of 10, ⚠️x2** — items 3 and 10.

**RE-SCORED against the tree at `main` HEAD `7ea9e1b` by BA/PM, 2026-08-18** (task
`refinement-p0-chain-2026-08-18`). **Result: 10 of 10, 0 ⚠️ — the Definition of Ready is MET.**

- **⚠️(3) is DISCHARGED BY MEASUREMENT.** `ABC-076` merged 2026-08-17 and `ABC-077` merged
  2026-08-18; both in `Done`, both exports present at HEAD.
- **⚠️(10) is DISCHARGED BY RULING, not by a merge.** The corpus still does not exist — what has
  changed is that **it is no longer nobody's**. It is **this ticket's to build**, ruled from the
  dependency graph rather than from preference (see `## Dependencies`). The corpus was never a
  blocker on BUILDING or on VERIFYING; it was an **ownership vacuum**, which is this board's recorded
  failure mode, and it is now filled asymmetrically. Building a fixture set is in-scope work, and the
  `S` sizing already priced it.

Column moves are the Orchestrator's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the horizon effect stated as a behaviour, tied to the epic's own fourth criterion |
| 2 | scope and out-of-scope clear | **✅** three fences, two of them recorded as *decisions not to build*, with the evidence that would reopen them |
| 3 | INVEST-shaped | **✅** *(was ⚠️)* **independent** — both tickets in front of it (`ABC-076`, `ABC-077`) are merged to `main` and in `Done`. Discharged by measurement 2026-08-18 |
| 4 | acceptance testable and measurable | **✅** six: ≥ 19/20 with a mandatory worse baseline, exact equality on quiet positions, 200/200 termination under a stated cap, unchanged quiet scores, a 2.5x/4x multiplier with a stop rule, byte-identical position |
| 5 | dependencies known | **✅** the two ordering dependencies are **merged**, both named with the reason they ran in that direction; and the shared corpus now has **one named owner** rather than a symmetric race |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-005` 2.5x expected / **4x stop** with a named owner; lane bar with a stated remedy |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **✅** *(was ⚠️)* the ≥ 20 position set still does not exist, and **that is scope, not a blocker: it is now ruled THIS ticket's to build** (2026-08-18, from the dependency graph — `ABC-084` needs `ABC-078`, which is unbuilt, so this ticket is the only one of the two that can land first). `ABC-084` extends and does not fork. The symmetric *"whichever lands first"* rule that decided nothing is replaced by a named owner. ~~**Open follow-up, not gating: `ABC-084`'s page and row still carry the old symmetric wording**~~ **Follow-up closed 2026-10-09 by `ABC-084`'s fold (`0ebe63f`); see § Dependencies** |

## Delivery

**Built 2026-09-19 by the Software Engineer** (task `wave-2026-09-19`, subtask `ticket-to-pr-ABC-079`,
Workflow 04) on branch `grugops/ABC-079-quiescence` at `ead14eb`, from `grugops/wave-2026-09-19`
(`4f0ef01`). **NOT merged. HANDED UP — this ticket's own `A5` stop condition tripped.**

- **Delivered:** `src/quiescence.ts` (new — stand-pat lower bound, captures only, fail-soft
  alpha-beta, `QUIESCENCE_MAX_PLY = 8` runaway guard, `visit(qply)` hook, unmake in `finally`);
  `src/search.ts` (leaf calls `quiesce`; TEST-ONLY `searchWithoutQuiescence` door); `src/engine.ts`
  (same leaf, `countNode` shared with the visitor so the abort lands inside a capture sequence);
  `src/quiescence.test.ts` (`A1`–`A6`, 24-position hanging-piece corpus — `ABC-084` extends it —
  two lanes, `SEARCH_DEEP=1`). `ABC-077`'s `A6` export list widened by the one door;
  `QE-G1` gained its depthless-call case. `src/zobrist.ts` untouched (`ADR-0020` is `ABC-075`'s).
- **`A1` MET** (0/24 losing with quiescence vs 24/24 without, depth 1, one test), **`A2` MET**,
  **`A3` MET** (≥ 200 positions, cap 8 binds on a queens rig and is never exceeded), **`A4` MET**
  (same score, move AND node count on quiet positions; the door reproduces `ABC-078`'s recorded
  562 / 14 565 nodes on position-6), **`A6` MET** (0 mutated, throw path included).
- **`A5` NOT MET — STOP.** Node-count multiplier, same depth, with vs without quiescence:
  **kiwipete 702x, position-6 62x at depth 1**; 878x / 377x at depth 2; 1 483x / 120x at depth 3.
  Stop level 4x, model 2.5x. Asserted and RED in the default lane, on purpose. A scratch
  diagnostic (not shipped) shows MVV-LVA ordering (`ABC-080`'s) brings depth 2 to 33x / 17x —
  still 4–8x over the level — and only a 2-ply cap (a budget, which the ticket forbids) reaches
  ~5x. **Owner: Architect/Design (`NFR-005` trigger, named on this page).**
- **NFR-004 holds; NFR-005 worsens; NFR-008 crossed.** All six perft roots return in
  3 000–3 002 ms at the 3 s budget (load 7.98); completed depth 2 on kiwipete and position-6
  (was 4 and 3). Default-lane CPU 16.95 s → 36.08 s median (loaded machine, both readings) —
  `ADR-0019` trigger (a); the cost is the existing search/engine tests, not the new file.
- **Collateral RED, left on purpose:** three `src/engine.test.ts` fixtures (`A2` node bound,
  `A3` depth-2 premise) whose node assumptions the multiplier broke. Re-fixturing them around
  1 500x is tuning the ticket to the number it says to stop on.
- **Gates at `ead14eb`:** lint 0, typecheck 0, build 0, unit **RED** (41 files, 1 238 pass /
  5 fail, 0 skipped; integrity `No findings.`). Numbers, commands and the deep lanes are in
  `.grugops/context/ticket-to-pr-ABC-079/notes/`.

## Ruling

**Ruled 2026-09-19 by Architect/Design** (task `wave-2026-09-19`, subtask `ruling-abc079-multiplier`,
Workflow 07) on the tripped `A5` — the owner this page names. **`ADR-0024` (proposed) carries the
reasoning and the full table; `.grugops/context/ruling-abc079-multiplier/notes/` the probe rows and
the limits.** Overturnable on the same evidence: the probe script is kept beside the notes.

- **The build is not defective.** An independent textbook stand-pat quiescence reproduces
  `src/quiescence.ts` to the node (totals and per-ply histograms, depths 1–3, both positions).
  Stand-pat fires, `alpha` is raised, the window is right, `evaluate` is side-to-move-relative.
- **The multiplier is UNORDERED captures, held only by the cap.** The capture tree grows with
  capture ply (kiwipete depth 1: 75 q-nodes at ply 1, 14 851 at ply 8, 43% at the cap); uncapped the
  same code reads 13 730x / 20 871x at depths 1–2. The `A3` cap was doing a budget's job.
- **The fix is this ticket's, not `ABC-080`'s: MVV-LVA ordering of the capture list INSIDE
  `quiesce`.** Lossless (same score, same move, every cell). Measured: kiwipete **120x / 33x / 45x /
  26x**, position-6 **6.3x / 17x / 8.3x / 7.5x** at depths 1–4. Ordered, lifting the cap is a 1.2–1.7x
  change — the cap is then honestly a guard. `ABC-080` reuses the exported key; it does NOT land
  first.
- **`ADR-0003`'s 2.5x is superseded on that one input.** It was a literature share-of-nodes figure
  for an ordered engine with a table and SEE; no fix inside this ticket's fence reads 4x on kiwipete.

**`A5` AS RE-STATED (replaces the 2.5x / 4x wording above; still a stop condition):** *Then* the
same-depth node-count multiplier of `search()` over `searchWithoutQuiescence()`, with MVV-LVA-ordered
captures, is reported on `kiwipete` and `position-6` and does not exceed **1.5x the figure recorded
in `ADR-0024`** — kiwipete **≤ 180x** at depth 1 (default lane), **≤ 50x** at depth 2 and **≤ 70x**
at depth 3 (deep lane); position-6 **≤ 10x / ≤ 26x / ≤ 13x**. Over the level: stop and report to
Architect/Design. Do not tune the number to fit.

**Re-hop (Software Engineer), and nothing beyond it:** (1) the MVV-LVA sort in `src/quiescence.ts`,
key exported, header line corrected, cap 8 kept; (2) `A5` levels as above; (3) the three
`src/engine.test.ts` fixtures re-fixtured against the ORDERED counts (kiwipete depth 1 = 5 888
nodes, position-6 depth 2 = 9 804), not the 1 500x ones; (4) default lane green, all three deep
lanes to completion with counts and wall, `NFR-008` / `N8-LANE` re-measured, `NFR-005` reached depth
reported; (5) `A1`–`A4`, `A6` re-run, not re-argued.

**Collateral rulings:** `searchWithoutQuiescence` test-only door **IN** (the `searchWithoutPruning`
mechanism; rejected: an options parameter on `search()`). The unabortable first iteration carrying
depth-1 quiescence is **an accepted bound once ordered** (5 888 nodes on kiwipete), not an `ABC-078`
regression to re-structure — the `ENGINE_DEEP` 50 ms case must pass as written or be reported with
its number. `SEARCH_DEEP=1` on `src/search.test.ts` must read **exit 0 at its existing per-case
timeouts**; if the unpruned-oracle pair cannot, that case's depth drops by one on kiwipete only,
recorded — the timeout is not raised first.

**Out of scope stays out:** delta pruning (1.5x more, measured) and SEE-lite (largest cut, LOSSY —
changes scores) are recorded as the next levers for `ABC-084`'s puzzle count to justify, not built.
**`NFR-005`'s ratified levels do not move here**; the arithmetic consequence (depth 6 in 3 s needs
~850k nodes/s with a factor of ~45, against a measured 200k–550k) is stated for the owner in
`ADR-0024` decision 6.

## Delivery (re-hop)

**Re-hopped 2026-09-19 by the Software Engineer** (task `wave-2026-09-19`, subtask
`ticket-to-pr-ABC-079-rehop`, Workflow 04) on the SAME branch `grugops/ABC-079-quiescence`, fast-forwarded
over the ruling (`f6772c5`), code commit `700730b`. **NOT merged.** Three files, 103/−37:
`src/quiescence.ts` 42/−5, `src/quiescence.test.ts` 24/−12, `src/engine.test.ts` 37/−20. Nothing else
under `src/`; `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, `ADR-0024`'s status untouched.

- **Delivered per the ruling:** MVV-LVA sort of the capture list inside `quiesce` (victim value
  descending, attacker ascending as the tiebreak, a capturing promotion ranked by victim plus
  promotion piece), the pure key **`mvvLvaKey(move)` exported** for `ABC-080`, the header's
  "generation order" line corrected, **cap stays 8**. Lossless: same score and move at every cell.
- **`A5` MET as re-stated, still asserted, still a stop:** kiwipete **119.96x / 32.74x / 45.02x**
  (levels ≤ 180x / 50x / 70x), position-6 **6.32x / 17.44x / 8.26x** (≤ 10x / 26x / 13x) at depths
  1–3. Kiwipete's counts (5 878 / 10 249 / 405 945) are 10–133 nodes off the probe's because the
  probe's sort had no promotion term and the ruling's spec does (verified with a probe variant);
  position-6 reproduces the probe to the node.
- **`A1`–`A4`, `A6` re-run: MET, verdicts unchanged.**
- **`src/engine.test.ts`:** `A2`'s 10 240 bound held at 9 973 nodes and stays as written. `A3` is
  **RE-FIXTURED on a new position (after 1. g4 d5)** — position-6's premise (best move changes
  between depth 2 and 3) is gone under a quiescence leaf (c3d5 at 1, 2 and 3), not just its count;
  the new fixture completes depth 2 and aborts inside depth 3 at every budget 3–12 on a 1 ms tick,
  and an emulated keep-best-so-far mutant is caught at all ten abort points.
- **Lanes:** default **41 files / 1 243 pass / 0 skip, exit 0**; `SEARCH_DEEP=1` on
  `src/quiescence.test.ts` **37/37, exit 0, 13.7 s**; `ENGINE_DEEP=1` **33/33, exit 0, 123.7 s**, the
  50 ms case at **89 ms** (passes as written, 11 ms of headroom, loaded). **`SEARCH_DEEP=1` on
  `src/search.test.ts` ran to completion and is RED: 4 timeouts** (kiwipete d3 unpruned pair
  1 016 s, position-5 d3 55 s, position-6 d3 195 s, `A7` roots-at-depth-3 1 281 s; 37 pass,
  2 678 s wall) — the licensed kiwipete-only drop cannot make it green and the file is outside this
  hop's fence, so it is **REPORTED, not tuned**. Owner of the next decision: Architect/Design.
- **`NFR-004` holds** (3 001–3 004 ms on all six roots at 3 s). **`NFR-005` reported:** kiwipete
  **2–3** (load-dependent; 405 945 nodes for depth 3), position-6 **3** — back to the `ABC-078`
  record on position-6, one ply under on kiwipete's worse reading. **`NFR-008` non-conforming
  under load** (CPU 27–29 s vs 15 s; the before arms already 21–25 s at load 10–19); attributable
  delta vs base `4f0ef01` **+6.0 s CPU** (was +19.1 s unordered). **`N8-LANE`** paired median
  **0.61 s gross / ≈ 0.45 s net** (0.30–1.37 s across pairs; low confidence, not claimed MET).
- **Gates at `700730b`:** lint 0, typecheck 0, build 0, unit 0 (0 skipped; integrity `No findings.`).
  Numbers, transcripts and limits are in `.grugops/context/ticket-to-pr-ABC-079/notes/` (six re-hop notes).

## Ruling (oracle)

**Ruled 2026-09-24 by Architect/Design** (task `wave-2026-09-24`, subtask `ruling-abc079-oracle`,
Workflow 07) on the red `SEARCH_DEEP=1 npx vitest run src/search.test.ts`. The notes are in
`.grugops/context/ruling-abc079-oracle/notes/`. The probe sits beside them and was checked to
reproduce `src/` to the node, and to within 1% on wall time under vitest, before any number was
quoted. This ruling can be overturned on that evidence.

- **The depth-3 oracle runs on the BARE leaf, on both sides (option a).** `A1` depth 3 on all six
  perft positions, `A2` kiwipete depth 3 and `A7`'s unpruned depth-3 sweep compare
  `searchWithoutQuiescence` against a new test-only door, **`searchWithoutPruningOrQuiescence`**.
  That is `ABC-077`'s merged `A1`/`A2` on the search they were written for. Kiwipete reads
  **99 950 unpruned nodes and 9.02%**. Under the runner every pair takes ≤ 3.4 s against its
  30 s timeout, and `A7` takes 16.1 s against 120 s.
- **The quiescence leaf stays under the oracle where that is affordable.** It runs at depth 2 on
  all six positions (worst: kiwipete, 11.0 s) and at depth 3 on `startpos` and `position-3`. The
  quiescence-on depth-3 cells for kiwipete, `position-4`, `position-5` and `position-6` are
  retired. They cost 23 s to 1 016 s each, because the unpruned tree opens a full-window
  quiescence at every leaf. `position-4` is included because it reads 22.9 s against its 30 s
  timeout.
- **What this stops proving:** the conjunction of an inherited depth-3 window reaching a
  quiescence leaf on a capture-dense board. Each half is still proved separately. The oracle
  never brute-forced quiescence's own inner alpha-beta under any option; that is covered in
  `src/quiescence.test.ts`.
- **Rejected:**
  - (b) depth −1: it deletes `ABC-077`'s merged depth-3 `A1` cells on four boards and `A2`'s
    own case.
  - (c) capped quiescence: cap 2 already takes 31.6 s against 30 s, it compares a sibling
    search rather than the shipped one, and it needs a production signature change.
  - (d) timeout: ≥ 1 016 s for one pair and a ~45-minute lane.
- **Owner: `ABC-079`. No new ticket.** This ticket's leaf change made the lane red. Its own
  § Ruling requires the lane to read exit 0, and it has already edited `src/search.test.ts`,
  `src/search.qe.test.ts` and `ABC-078`'s `src/engine.test.ts` on the same principle.

**Next hop (Software Engineer), three files and nothing beyond them:**

1. `src/search.ts` gains the door, with the same doc shape as its siblings.
2. `src/search.test.ts` changes as follows:
   - `A1` gets bare-leaf depth-3 pairs on all six (deep lane).
   - The quiescence-on depth-3 pair is kept on `startpos` (deep) and `position-3` (default,
     unchanged); the other four depth-3 cells are deleted.
   - `A2`'s deep case reads the bare-leaf kiwipete pair.
   - `A7`'s deep case keeps `search(position, 3)`, takes its unpruned half from the door, and
     reads `.intact` off the memoised depth-2 pairs.
   - The `A6` list gains the door; the header is corrected.
   - Timeouts do not move.
3. `src/search.qe.test.ts`: `QE-G1` gains one case.
4. Re-run the deep lane to completion (exit 0, count, wall, load, and every case's share of its
   timeout; name any case above 50%, with `A4`'s deep case as the one to watch), plus the
   default lane and the gates.

**`AGENTS.md` (the Scribe's, after that hop):**

- Amend the `SEARCH_DEEP` `search.test.ts` entry: its 23.0 s record is false at this tip. Record
  the new run, and say that depth 3 runs on the bare leaf.
- Add a `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` entry (37 passed, 13.7 s at
  `700730b`). Note that the two files share the variable.

## Delivery (re-hop 2)

**Re-hopped 2026-09-24 by the Software Engineer** (task `wave-2026-09-24`, subtask
`ticket-to-pr-ABC-079-rehop2`, Workflow 04) on the oracle ruling. Code commit **`33b9a02`**, on
**`grugops/ABC-079-quiescence-rehop2`**. That branch is a strict fast-forward of
`grugops/ABC-079-quiescence` over `b324cb6`; the named branch is held by two other worktrees and
was not moved. **NOT merged.** Three files, 106/−30: `src/search.ts` 14/−0, `src/search.test.ts`
87/−30, `src/search.qe.test.ts` 5/−0. Nothing else under `src/`; `plans/board.md`, `AGENTS.md`,
the NFR bars and `ADR-0024` untouched.

- **Delivered per the ruling:**
  - The TEST-ONLY door `searchWithoutPruningOrQuiescence(position, depth)`.
  - `A1` gains a bare-leaf depth-3 pair on all six (deep). The quiescence-on depth-3 pair is
    kept on `startpos` (deep) and `position-3` (default); the other four cells are deleted.
  - `A2` deep reads the bare-leaf kiwipete pair: **9 016 / 99 950 = 9.02%**.
  - `A7` deep takes its unpruned half from the door and checks `.intact` on the depth-2 pairs.
  - `A6` and `QE-G1` gain the door; the header is corrected.
  - Timeouts unchanged. The bare-leaf counts reproduce the ruling's probe to the node.
- **`SEARCH_DEEP=1` on `src/search.test.ts`: exit 0, 43 passed, 125.5 s** (load 3.9–7.9). It was
  exit 1 at 2 678 s. **One case is over 50% of its timeout: `A4`'s deep case, 73.6 s of 120 s
  (61%)**, which this hop does not touch. Next closest: kiwipete's quiescence-on depth-2 pair at
  11.9 s of 30 s (40%).
- **Other lanes:** `SEARCH_DEEP=1` quiescence 37/37, exit 0, 13.2 s. `ENGINE_DEEP=1` 33/33, exit
  0, 133.3 s (50 ms case at 85 ms). Default lane 41 files / **1 244** pass / 0 skip, exit 0.
  Integrity `No findings.` Lint, typecheck and build all exit 0.
- **`NFR-008`:** non-conforming on both arms (median CPU 24.6 s before `fa80923`, 26.5 s after,
  against 15 s), at load 17–35. The two touched files alone: +0.20 s CPU median paired.
  `N8-LANE` is not claimed. Notes: `.grugops/context/ticket-to-pr-ABC-079/notes/` (eight re-hop 2
  notes).

## QE

**QE by QE/E2E, 2026-09-24** (task `wave-2026-09-24`, subtask `qe-ABC-079`, Workflow 05 step).
The branch is `grugops/qe-ABC-079`, created from `grugops/int-ABC-079` @ `6b7b2c8`. The whole
ticket was tested against `4f0ef01`, all three hops together. The seven delivered files are
byte-identical to `33b9a02`. QE wrote zero `src/` lines. **NOT A STAMP.** Notes:
`.grugops/context/qe-ABC-079/notes/`.

**Verdict: FAIL, and the repair is prose only.** No criterion is red. The FAIL comes from four
false sentences in `src/search.ts`, judged by the `ABC-114` standard, on the precedent of
`ABC-046`'s QE the same day.

- **Criteria:**
  - **`A1` MET-AS-READ.** 0/24 vs 24/24 at depth 1. At depths 2–3, and at the 3 s budget, both
    arms read 0/24, so the baseline is worse at depth 1 only.
  - **`A2`, `A3`, `A4`, `A6` MET.**
  - **`A5` MET.** Kiwipete 119.96x / 32.74x / 45.02x, position-6 6.32x / 17.44x / 8.26x, all
    under the `ADR-0024` levels.
- **Gates:** lint 0, `tsc` 0 (twice), **43 files / 1392 passed / 0 skipped**, JSON skip count
  0, integrity `No findings.`
- **Deep lanes, all exit 0:**
  - `SEARCH_DEEP` `search.test.ts`: 43 passed, 110.7 s. **`A4` deep is at 55.8%** of its 120 s
    timeout; the next case is kiwipete d2 at 36.9%.
  - `SEARCH_DEEP` `quiescence.test.ts`: 37 passed, 10.6 s.
  - `ENGINE_DEEP`: 33 passed, 120.5 s. The 50 ms case read 79 ms against its 100 ms bar.
- **D1–D4, false, NOT corrected by QE:**
  - **D1:** `Switches`, *"each has one export that turns it off"*. Since `33b9a02` each switch
    has two exports that turn it off.
  - **D2:** the module header calls `searchWithoutQuiescence` *"the"* door to the bare leaf,
    but there are two.
  - **D3:** `searchWithoutPruning` is described as *"brute-force negamax over the whole tree"*.
  - **D4:** `negamax` says `prune` false is *"plain brute-force"*.
  - D3 and D4 are false since `ead14eb`. Measured: position-3 d1 visits 46 nodes shipped
    against 63 with `quiesce`'s cutoffs removed, so the "unpruned" search still prunes inside
    its leaves.
  - D1 and D2 were frozen by the oracle ruling's fence, so the repair hop needs a licence to
    touch them.
- **G1, to Architect/Design (oracle ruling, rule 2): the conjunction is a REAL gap.**
  - Seeded window slips that fire only at an inherited depth-3 window on a capture-dense
    quiescence leaf change the shipped depth-3 result: kiwipete **e2a6 → e5g6**, position-4
    **c4c5 → g1h1**, position-6 30 → 120.
  - Two of them (`R2b` in the leaf, `R2c` inside `quiesce`) **survive every lane**: 1392/1392,
    80/80, 33/33.
  - The ungated `R2a` is caught only by `ENGINE_DEEP`'s cross-implementation identity sweep.
  - The engine completes depth 3 on these boards at the default budget.
- **G2, to Architect/Design (rule 3):**
  - `A4` deep read 50–56% across three runs at load 4–10. Crossing needs about 1.8x: a
    load-17-plus day, or a quiescence cost regression (`Q1` crossed at 245.9 s).
  - **`A7` deep reads 77.4% when run without `A4` warming its memo.**
  - A sync overrun reds after the case completes; it does not hang the lane.
- **Mutants in `quiesce`:**
  - Q1 no stand-pat cutoff: RED (`A5` levels, engine `A2`, and the `A4` deep timeout).
  - Q2 stand-pat not raising alpha: RED on one row (`A5` pos-6 d1).
  - Q3 capture order reversed: RED.
  - Q4 cap off by one: RED at +1 and at −1.
  - Q5 non-captures: RED (17 and 25 rows).
  - Q6 promotion key: **negated RED, dropped NONE (G4)**.
  - Q7 door with quiescence on: **NONE in the default lane**. RED in the deep lane only after
    the ~1 016 s kiwipete pair (G5).
  - Every revert left `src` porcelain empty.
- **G3:** the `A1` corpus is one-ply tactics, so extending it is `ABC-084`'s work.
- **NFR:** `NFR-004` holds (3 s budget: 2 999.5–3 003.6 ms on all six roots; eleven CLI replies
  at 3 000.3–3 005.1 ms). `NFR-005` reaches depth 3 on both kiwipete and position-6 in node, and
  2 on kiwipete under vitest.
- **`NFR-008` NOT RULED (fence):** default lane median 6.32 s wall and 23.5 s CPU at load
  4.2–9.8.
- **End to end:** `node src/cli.ts` played two games (6 moves as white, 5 as black), exit 0 both
  times, nothing on stderr.
- **Production lines > 0, so the UAT waiver does not apply.** Not merged, not deployed.
  `plans/board.md` is untouched; the board move is the Orchestrator's.

## Ruling (G1/G2)

**Ruled 2026-09-25 by Architect/Design** (task `wave-2026-09-24`, subtask `ruling-abc079-g1g2`,
Workflow 07) on QE's routed readings G1 and G2. Branch `grugops/ruling-abc079-g1g2` off
`grugops/int-ABC-079` @ `9b4dd68`. Notes and probes are in
`.grugops/context/ruling-abc079-g1g2/notes/`. This ruling can be overturned on that evidence.
**NOT A STAMP.**

- **G1 is closed in this ticket and not routed.**
  - `A5`'s deep depth-3 rows in `src/quiescence.test.ts` pin `{score, move}`: kiwipete
    **`50` / `e2a6`**, position-6 **`30` / `c3d5`**. They add zero searches.
  - The values are **oracle answers, not only a fingerprint.** This ruling ran the retired
    unpruned quiescence oracle offline (`searchWithoutPruning(p, 3)`, 161.9 s and 28.0 s in
    plain node). It equals `search(p, 3)` on score and move on all six roots.
  - `R2b` and `R2c` move those answers to 205 / e5g6 and 120, so both surviving mutants go red.
  - Node counts are not pinned; the `A5` levels keep governing cost.
  - Re-pin only after the oracle is re-run and agrees.
- **G2 is closed in this ticket.**
  - The deep cost is one slice: the broad corpus at depth 2, 62.5 s cold (52%). QE's
    per-corpus-run split would leave that slice at 52%.
  - The remedy: every `A4` and `A7` deep case pays at most ONE slice, and the broad corpus at
    depth 2 is split by root. The worst case is then kiwipete's 49 positions at 45.7 s (38%).
  - `A7` run alone read 99.8 s (83%) today. It stops depending on `A4` running first.
  - Timeouts do not move.
- **The licence for the ONE repair hop** (lines at `9b4dd68`; everything else stays
  byte-identical):
  - `src/search.ts`, **comment lines only**: `:24–27` (D2), `:61–69` (D1, plus D4 at `:66`),
    `:112–114` (D4), `:204–209` (D3). The door's docblock `:227–236` is true and stays.
  - `src/search.test.ts`:
    - `:37–43`: the header's "no case proves the combination", now false.
    - `:352`: the `A1` banner, "brute force", the same fact as D3/D4.
    - `:236–289`: a per-root broad slice and its memo key.
    - `:475–482`: `A4` deep, one case per slice, plus the check that the slices cover the
      corpus.
    - `:550–568`: `A7` deep, one case per slice plus one roots case.
  - `src/quiescence.test.ts` `:436–475`: `A5`, the depth-3 pins and their docblock.
  - `src/quiescence.ts`, `src/engine.*`, `src/evaluate.ts` and `src/search.qe.test.ts` do not
    change.
- **The hop re-runs and reports:**
  - both `SEARCH_DEEP` files to exit 0, with every deep case's share of its timeout (any case
    over 50% named);
  - each `A7` slice run alone, under 50%;
  - `R2b`/`R2c` re-applied, showing the pins go red, then reverted;
  - the default lane and the gates;
  - a `search.ts` diff whose every changed line is a comment.
- **For the Scribe, after the hop:** the owed `Quiescence deep lane` `AGENTS.md` entry also
  names `A5`'s depth-3 oracle pins.

## Delivery (re-hop 3)

**Re-hopped 2026-09-25 by the Software Engineer** (task `wave-2026-09-24`, subtask
`ticket-to-pr-ABC-079-rehop3`, Workflow 04) under the G1/G2 licence. Code commit **`9d2306c`**
on **`grugops/ABC-079-quiescence-rehop3`**, parent `9a7e549`. **NOT merged, NOT pushed.** Three
files, 119/−30: `src/search.ts` 21/−8 (comments only), `src/search.test.ts` 60/−14,
`src/quiescence.test.ts` 38/−8. Every hunk falls inside the licensed ranges. `src/quiescence.ts`,
`src/engine.*`, `src/evaluate.ts`, `src/search.qe.test.ts`, `plans/board.md`, `AGENTS.md` and
the NFR bars are untouched. No timeout changed.

- **D1–D4:** `src/search.ts` now names both bare-leaf doors. It names both exports per switch.
  It says `prune: false` is brute force above the horizon only, because `quiesce` keeps its own
  cutoffs, and `searchWithoutPruning` is described the same way. **The `git diff -U0` has 29
  changed lines, all comments. The TypeScript token stream is identical (808 = 808).**
- **G1:** `A5`'s depth-3 deep rows pin kiwipete **`50` / `e2a6`** and position-6 **`30` /
  `c3d5`**. The pin reads the same `search()` call as the ratio. The docblock gives the re-pin
  rule.
- **G2:** `A4` and `A7` deep have one case per slice: `default` d2, `broad` d1, and the broad
  corpus at d2 per root, plus `A7`'s one roots case. The `broad` d1 case asserts that the six
  slices are exactly the broad corpus, by names in order and by size.
- **`SEARCH_DEEP=1` on both files: exit 0, 94/94 (search 57, quiescence 37), 109.2 s, load
  3.0–4.0. No case is over 50%.** The worst is `A4`'s kiwipete slice at 48.1 s (40.1%). `A4` deep
  was 52–56% before this hop.
- **Each `A7` case alone, cold:** the worst is kiwipete's slice at 45.3 s (37.8%). The roots case
  is 31.2 s (26.0%), and the rest are ≤ 7.7%. Before this hop, `A7` alone was 77–83%.
- **The pins bite:** under both `R2b` and `R2c` (K = 5), the kiwipete and position-6 depth-3
  rows go red, *expected 205 to be 50* and *expected 120 to be 30*. Both were reverted, and
  `git status --porcelain -- src` was empty after each.
- **Gates:** default lane 43 files / **1392** pass / 0 skip, exit 0. Integrity `No findings.`
  Lint, typecheck and build all exit 0.
- Notes: `.grugops/context/ticket-to-pr-ABC-079/notes/` (three re-hop 3 notes plus
  `raw-rehop3-*`). Next: a delta re-QE, and the Scribe's `AGENTS.md` entry. Both are the
  Orchestrator's to schedule.

## QE (delta)

**Delta re-QE by QE/E2E, 2026-09-25** (task `wave-2026-09-24`, subtask `qe-ABC-079-delta`,
Workflow 05 step). Branch `grugops/qe-ABC-079-delta` off `grugops/int-ABC-079` @ `c6b528d`,
worktree `.claude/worktrees/qe-ABC-079-delta`. Verifies commit `9d2306c` (re-hop 3) against
the prior FAIL (`qe-ABC-079`, 2026-09-24) and the G1/G2 ruling — the DELTA, not the whole
ticket. **QE wrote zero `src/` lines** (four mutant rounds, each applied then reverted,
`git status --porcelain -- src` asserted empty each time). **NOT A STAMP.** Notes:
`.grugops/context/qe-ABC-079/notes/` (two 2026-09-25T09:00–09:05Z notes).

**Verdict: PASS.**

- **D1–D4, now TRUE:** re-confirmed the `search.ts` diff is 29 lines, all comments
  (independently re-run token-stream check: 808 tokens before and after, identical). No new
  false sentence found. D3's cited measurement (position-3 depth 1, 46 nodes via
  `searchWithoutPruning`) was independently reproduced to the node.
- **G1 CLOSED, and independently re-derived beyond the repair hop's own check:** QE
  re-applied all three seeded window-slip mutants from the original FAIL decision —
  `R2a` (ungated), `R2b` (capture-dense, K=5) and `R2c` (inside `quiesce`, K=5) — one at a
  time against the delivered tree. **All three red both `A5` depth-3 pins**
  (kiwipete `205`≠`50`, position-6 `120`/`145`≠`30`). This includes `R2a`, which re-hop 3's
  own limits note flagged as NOT re-tested at the repair tip; QE's re-test closes that gap.
  No survivor in the class was found.
- **G2 CLOSED:** mutated `broadSlice("startpos")` to drop one position — the "six slices are
  exactly the broad corpus" check reds (`expected 183 to be 184`), confirming the coverage
  check is a real guard. Re-ran `SEARCH_DEEP=1` on both files: exit 0, 94/94, worst case
  (`A4` broad d2, kiwipete's slice) at 42.8% of its 120 s timeout on this machine (the
  engineer's reading was 40.1%, machine-load variance). The same slice run alone via `-t`
  reads 37.8%, matching the engineer's reading. Both stay under the ruling's 50% line.
- **Gates, all re-run and green:** lint (`biome check .`, 78 files, no fixes), `tsc --noEmit`
  ×2 (typecheck, build), default lane **43 files / 1392 passed / 0 skipped**, skip-integrity
  `No findings.` at count 0, and `ENGINE_DEEP=1` **33/33** (licence item 5's one-time check).
- **Licence conformance:** `src/quiescence.ts`, `src/engine.*`, `src/evaluate.ts` and
  `src/search.qe.test.ts` are byte-identical to the frozen base (`git diff --stat` empty).
  Every `src/search.ts` hunk falls inside the licensed comment ranges.
- **Not covered / fences held:** the offline oracle (`searchWithoutPruning(p,3)`, ~160 s /
  ~28 s) was not re-run by QE — the ruling already ran it and this delta trusts that record,
  per its scope (verify the delta). `NFR-008` not remeasured (fenced). `AGENTS.md`,
  `plans/board.md` and the NFR bars were not opened. Production lines > 0, so the UAT waiver
  does not apply. Nothing merged, nothing deployed — the board move is the Orchestrator's.

## Security/NFR

**Gate by Security/NFR, 2026-09-25** (task `wave-2026-09-24`, subtask `secnfr-ABC-079`, Workflow 15,
`In Security/NFR`). Branch `grugops/secnfr-ABC-079` off `grugops/int-ABC-079` @ `cb5540d`. The
review covers this ticket's four commits and seven `src` files. The subtask's `4f0ef01..cb5540d`
range also carries seven other tickets' merges, which were not reviewed here. **Zero `src/` lines
written. NOT A STAMP.** Notes, probes and raw rows: `.grugops/context/secnfr-ABC-079/notes/`.

**Result: PASS_WITH_RISKS. No required fix. No security finding. One risk needs the owner's word
before merge.**

- **`NFR-004` HOLDS.**
  - Measured n = 40 across the six roots, a capture-dense middlegame and the worst first-iteration
    board.
  - **p95 3 003.5 ms**, max 3 004.0 ms. The ≤ 4 ms overshoot sits inside `AR-NFR004-A`.
  - The 5 s ceiling binds through `quiesce` (4 999.8–5 002.1 ms at unbounded budgets).
  - `perf_p95_ms` (300) does not apply to this search.
- **`NFR-005`: kiwipete depth 3, position-6 depth 3** at 3 s, against a FAIL floor of 6.
  - **For the owner:** keep the floor as `ABC-080` / `ABC-081` / c1's target, or re-level it on
    `ADR-0024` decision 6 (Architect/Design drafts, the owner ratifies).
  - Not re-levelled here (`AR-NFR005-079`).
- **`NFR-008` NON-CONFORMING.** Paired n = 8, null control admissible, load median 4.43 (max 13.3).
  - The lane reads **22.29 s CPU with this ticket and 18.61 s without it**, against 15 s. The
    headroom was spent before this ticket arrived, so **`ADR-0019` trigger (a) has fired**.
  - This ticket charges **+3.625 s CPU** (8 of 8 rounds), which is **3.465 s net = 5.3x
    `N8-LANE`**. Most of it is the existing search tests paying a quiescence leaf.
  - **`AR-N8LANE-079` is NOT accepted by the gate.** Owner: **Olger Oeselg**. He is asked to
    accept it, to take a lane lever first (`OPT-1` needs re-sizing), or to hold the ticket.
    **Recommend no merge before his word.**
- **Security (ASVS L1): no finding.**
  - The `quiesce` recursion is capped at 8, and the stack peaks at about 21 frames.
  - The abort is reachable after iteration 1. The unabortable iteration 1 costs at most 32 980
    nodes / 129.5 ms on 20 096 reachable positions, and 277 ms on the queens rig
    (`AR-QS-ITER1-079`, low, owner Architect/Design).
  - No CLI path supplies a FEN or a budget.
  - No I/O, no dynamic code, no new dependency.
- The board move is the Orchestrator's. `plans/board.md`, `AGENTS.md` and the NFR bars were not
  touched. Nothing was merged or pushed.

**`AR-NFR005-079` CLOSED, 2026-09-25** (Security/NFR, task `wave-2026-09-24`, subtask
`place-nfr005-runner`, on the owner's word *"3. use recommendation"*, Orchestrator note `…aa98a05d`
item 3b). The entry above is left as written; this line closes it.

- **Reason:** its condition, *"`NFR-005` below its floor"*, no longer holds on the owner-ruled
  runner. Plain `node` binds (now placed in `plans/nfr-catalog.md`'s `NFR-005` row), and on it
  `ABC-081`'s Security/NFR gate read kiwipete **6** and position-6 **6**, 5 of 5 rounds, against
  the floor of 6 (decision `…48e9e17c`).
- **Not closed with it:** the depth-7 WARN (still PROVISIONAL) was never part of this risk. Its
  home is `ABC-121` and the `EPIC-004` spike.
- No level moved and no re-measurement was made at this hop.
