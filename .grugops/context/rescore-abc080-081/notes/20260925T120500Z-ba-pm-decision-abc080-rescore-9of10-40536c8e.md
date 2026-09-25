---
id: 20260925T120500Z-ba-pm-decision-abc080-rescore-9of10-40536c8e
kind: decision
by: ba-pm
at: 2026-09-25T12:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-080
  - ABC-077
  - ABC-078
  - ABC-079
  - ADR-0024
  - NFR-005
  - NFR-008
  - ADR-0019
  - qe-ABC-079#G4
supersedes: 
---

# ABC-080 DoR re-score, 2026-09-25 — 9/10, 1 ⚠️, NOT MET, stays in Backlog

**No sanctioned writer on this install (`scripts/context-io.ts` / `claim.js` / `propose_note`
absent; `context.human_admission: off`).** This note is hand-authored per
`agent-factory/contracts/context-note.md` and carries no `seal` — degraded posture named in
`AGENTS.md`, not re-derived here.

## What changed since the 2026-08-16 score (8/10, ⚠️ items 3 and 10)

Both named blockers — `ABC-077` and `ABC-078` — are now `Done` on `grugops/wave-2026-09-24`
(confirmed at `plans/board.md` lines 28–62 and `plans/traceability.md:587`). **Item 3
(INVEST-shaped / independent) flips ✅**: the ticket is no longer sitting behind two open
tickets. `ABC-081` was never a blocker (`A5` makes the empty-TT case a criterion) and stays not
one.

**Item 10 stays ⚠️, unchanged in substance.** The ticket's own DoR entry already named the
`A3` ≤ 40% bar as a generic, not-measured-on-this-codebase figure, to be re-set from `A4`'s own
measurement at the ticket's build-time gate. Nothing in the current wave tree measures it —
that measurement can only happen once the ticket is built. **I am not re-leveling it** (fenced
out of this subtask) and record it as still open, owner: the ticket's own Engineer/QE hop.

## New since 2026-08-16, accounted for and NOT a fresh DoR defect

1. **`ABC-079` landed and already ships production MVV-LVA ordering inside `quiesce`**
   (`src/quiescence.ts`: `mvvLvaKey`, `ORDER_VALUE`, `captures.sort(...)` — always-on, not a
   test-only door). `ABC-080`'s scope is full-width search ordering, not the quiescence leaf,
   and `A1`–`A7` as written test the full-width comparator only. **No scope overlap that
   changes the ticket's shape**: `ABC-080` explicitly reuses `mvvLvaKey` (exported by
   `ABC-079`'s re-hop `700730b` "for `ABC-080`" per `plans/traceability.md:586`) rather than
   writing a second key, which is the efficient reading and matches the epic's own "one
   comparator" cut rationale.
2. **QE's `G4` on `ABC-079`'s delta gate SURVIVES and is pointed at `ABC-080`.** The mutant
   `Q6a` (dropping `+ 0` for `ORDER_VALUE[promotion]` inside `mvvLvaKey`) kills nothing across
   every lane (`A 0/89, B 0/80, C 0/1392, ENGINE_DEEP 0/33` —
   `.grugops/context/qe-ABC-079/notes/20260924T215100Z-...-5d8a0f37.md`): the promotion term's
   contribution to the ordering key is currently unguarded by any test, on either ticket.
   Since `ABC-080` reuses `mvvLvaKey` and its own `A4` already runs a four-configuration
   per-heuristic node-count measurement, **`A4`'s MVV-LVA configuration is the natural place to
   close `G4`** — a promotion-bearing capture fixture whose node count changes when the
   promotion term is dropped. **This is a test-notes addition, not a DoR defect**: it does not
   change `A1`–`A7` as written and does not block Ready. Recording it here so it is not
   re-derived, and so the build-time hop inherits it rather than starting cold.

## `NFR-005` — depth-6 floor kept (owner's word), what `A3`/`A7` can honestly claim toward it

The owner's word (2026-09-25, `.grugops/context/wave-2026-09-24/notes/20260925T104000Z-...
-36b66fbd.md`): *"keep 6, we want to have high quality game."* No re-level, and I am not
proposing one. Current reading after `ABC-079`: **kiwipete d3, position-6 d3** (owner's word,
same note).

`A3`'s claim is **≤ 40% of the unordered node count** at depth 4 — a bounded, generic
per-heuristic ratio, not a depth claim. `A7`'s claim is **non-decreasing completed depth in a
fixed 3 s budget** — a floor, not a target. **Neither criterion, as written, claims or commits
to reaching depth 6.** That is by design (`ABC-080`'s own DoR row: "No depth verdict is taken
here").

**Whether the two tickets together can plausibly reach depth 6 from depth 3, named plainly:**
`ABC-080`'s own bar is ≤ 40% nodes (≥ 2.5x fewer); `ABC-081`'s bar (below) is ≤ 70% nodes (≥
1.43x fewer) with ≥ 15% hit rate. Combined, the two bars as WRITTEN commit to roughly a
**3.6x** node-count reduction at a fixed depth (0.40 × 0.70), not a multiplicative depth gain.
Going from depth 3 to depth 6 needs the effective branching factor's node cost to shrink by
three additional plies' worth — with `ABC-079`'s own measured multiplier context (kiwipete
d1–d3 read 6.3x–120x per ply pair under MVV-LVA-ordered quiescence, per `ADR-0024` decision 6)
as the closest measured proxy for this codebase's ordered branching factor, **a 3.6x combined
node reduction is well short of what three additional plies cost**, even optimistically. **I am
naming this plainly for the owner, not re-leveling it**: the two tickets' own written bars, if
met exactly as stated and nothing more, do **not** plausibly close the depth-3-to-depth-6 gap
on their own; they are necessary contributors, not sufficient ones. Whether a third lever
(iterative deepening tuning, further ordering heuristics, or a re-leveled floor) is owed is the
owner's and Architect/Design's question, not BA/PM's to answer by re-scoring a criterion.

## `NFR-008` — lane realism

The default lane is currently **22.29 s CPU against the 15 s `ADR-0019` level** (accepted,
trigger (a) fired — `.grugops/context/secnfr-ABC-079/notes/20260925T102000Z-...-a5b722a4.md`).
`ABC-080`'s `N8-LANE` line (≤ 650 ms CPU, depth-3 subset in the default lane, depth-4 sweeps and
every 3 s run opt-in) follows the same shape `ABC-077`/`ABC-078`/`ABC-079` already used. **The
shape is realistic and consistent with precedent; the arithmetic context is not**: the lane is
already over its level before this ticket's ≤ 650 ms is added, so even a bar-compliant ticket
compounds an already-breached budget. Flagging for the Orchestrator/Architect-Design, not
re-leveling `NFR-008` or `N8-LANE` — both are fenced out of this subtask.

## Score

**9 of 10 clean, 1 ⚠️ — NOT MET; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ unchanged; quiescence overlap checked, no scope change needed |
| 3 | INVEST-shaped | ✅ **flipped from ⚠️** — `ABC-077`/`ABC-078` both `Done`; `ABC-081` still deliberately not a blocker (`A5`) |
| 4 | acceptance testable and measurable | ✅ unchanged |
| 5 | dependencies known | ✅ unchanged |
| 6 | security/NFR triggers with a measurable target | ✅ unchanged; `NFR-005`/`N8-LANE` claims re-checked against the current wave tree above, no target moved |
| 7 | test notes present | ✅ unchanged; `G4` addition recorded above as a test-notes item, not a new criterion |
| 8 | size assigned | ✅ `M`, unchanged — not `XL`, no `SPLIT_REQUIRED` |
| 9 | priority assigned | ✅ `P0`, unchanged |
| 10 | no major unresolved blocker | ⚠️ **unchanged** — the `A3` ≤ 40% bar is still self-flagged generic/unmeasured-on-this-codebase; re-set from `A4`'s own measurement is the ticket's own build-time gate, not BA/PM's |

**Pullable today: NO** — 9/10, one ⚠️ open by the ticket's own design (resolves only at its
build-time gate). **Size M, priority P0.**
