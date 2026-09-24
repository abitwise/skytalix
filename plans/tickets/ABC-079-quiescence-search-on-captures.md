---
id: ABC-079
title: Quiescence search on captures — the horizon fix
status: backlog
column: Backlog
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
  which names the curated position set as this ticket's main cost). **`ABC-084`'s page and board row
  still carry the symmetric wording and need the one-line follow-up; that is the Orchestrator's to
  route, and it does not gate this ticket.**

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
| 10 | no major unresolved blocker | **✅** *(was ⚠️)* the ≥ 20 position set still does not exist, and **that is scope, not a blocker: it is now ruled THIS ticket's to build** (2026-08-18, from the dependency graph — `ABC-084` needs `ABC-078`, which is unbuilt, so this ticket is the only one of the two that can land first). `ABC-084` extends and does not fork. The symmetric *"whichever lands first"* rule that decided nothing is replaced by a named owner. **Open follow-up, not gating: `ABC-084`'s page and row still carry the old symmetric wording** |

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
