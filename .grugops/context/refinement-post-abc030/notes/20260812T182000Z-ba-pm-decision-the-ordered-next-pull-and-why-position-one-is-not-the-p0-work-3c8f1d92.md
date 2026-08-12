---
id: 20260812T182000Z-ba-pm-decision-the-ordered-next-pull-and-why-position-one-is-not-the-p0-work-3c8f1d92
kind: decision
by: ba-pm
at: 2026-08-12T18:20:00Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ABC-021
  - ABC-024
  - ABC-026
  - ABC-030
  - ABC-031
  - ABC-032
  - EPIC-003
  - EPIC-004
  - EPIC-005
  - EPIC-006
supersedes:
---

# The ordered next pull — and position 1 is a `P1`, not one of the `P0`s I cut, for a reason I want on the record rather than inferred

> **Hand-authored, no stamp.** No `scripts/context-io.ts`, no `mcp__grugops__propose_note`,
> `human_admission` `off`, no `§14-gate` verdict under this task — **no `finding` on this hop**.

## The distinction that makes this list honest

There are two different questions and blurring them is how a ranked list becomes useless:

- **What can be PULLED today?** Only a DoR-met ticket the Orchestrator can move to `Ready`. My brief
  is explicit that **new work lands in `Backlog`**, so none of `ABC-031`…`ABC-038` is pullable at this
  hop regardless of carrying `P0`.
- **What is highest PRIORITY?** `ABC-031`, `ABC-032`, `ABC-033`, `ABC-034` and `ABC-037` are `P0` and
  the two items I am promoting are `P1`.

**Both are stated below rather than averaged into one number.**

## The order

| # | item | tier | why here |
|---|---|---|---|
| **1** | **`ABC-021`** — draw-claim interaction | `P1` `S` · **PULLABLE NOW** | The only item on the board that is DoR-met (**10/10, re-verified item by item**), has **every dependency merged and in `Done`**, **closes a `P0` epic entirely**, and delivers a right the product **already advertises and cannot honour** — `ABC-016` renders a claim indicator today and nothing can claim. BA/PM's job is user, pain, value, and that is the value ordering. Its `blocked-until` is fully discharged (the sixth stale reference on this board) |
| **2** | **`ABC-026`** — the lane's cumulative budget | `P1` `S` · **PULLABLE NOW** | DoR **10/10** as of this hop — I wrote the one open item. Its `P2 → P1` trigger **FIRED three-for-two**, and it is the named owner of **`H5`, the lane total, now `UNKNOWN - verify` past two merges**. It is #2 and not #1 because nothing is broken and `N8-LANE` already fires ticket-by-ticket at each gate — but it must not slip past #2, because **the plan it governs just grew by eight tickets** |
| **3** | **`ABC-031`** — coordinate move input | `P0` `S` · Backlog, **DoR 10/10** | Highest-priority **new** work, fully independent (merged code only), and the cheapest path to a typable move. First `EPIC-003` ticket to promote at the next refinement |
| **4** | **`ABC-032`** — `parseSan` | `P0` `M` · Backlog, **DoR 10/10** | Independent of #3; either order. Carries the two owed paragraphs. Two tickets are blocked behind it |
| **5** | **`ABC-010`** — FEN semantic validation | `P1` `M` · Backlog, **DoR 9/10** | Its own promotion condition fired at this hop and it **failed the re-verification**: `src/fen.ts` has four production importers, two of them per-frame, so item 6's NFR trigger set omits `NFR-002` and its `< 1 ms` bar is the wrong size. **One short BA/PM + Architect/Design pass** and it is `Ready`. It should be repaired before `EPIC-003`'s parser work reaches a boundary that accepts a user FEN |
| **6** | **`EPIC-006`'s thin decomposition hop** | epic, now `P1` | **The next decomposition, and I recommend it strongly.** The render-seam closure, the entry point + argv, and the result screen are all cuttable against merged code. **The render-seam closure is the single highest-value uncut ticket on this board** — four production modules are wired to nothing without it. Named in prose on the epic page; **no IDs allocated** |
| **7** | `ABC-033` → `ABC-034` → `ABC-035` → `ABC-037` → `ABC-036` → `ABC-038` | `P0`/`P1`/`P2` · Backlog, 9/10 and 8/10 | `EPIC-003`'s dependent half, in dependency order. Each is 9/10 with the **same two ⚠️** (INVEST independence + no-major-blocker) because each waits on a sibling cut at the same hop; `ABC-036` is 8/10 with a third |
| **8** | **`EPIC-004`'s `RISK-002` spike** | `P0` `L` epic | Its decomposition is **one ticket long today** and that ticket is a **timeboxed spike**: `NFR-005`'s depth-7 level is `PROVISIONAL` pending measurement on non-M3 hardware, and the spike is the named verification that lifts it. Cutting the rest before it reports is what `ABC-008` exists to prevent |
| **9** | **`ABC-024`** — castling default-lane blind spots | `P2` `S` · Backlog, **DoR 9/10** | Both original warnings discharged; **one new one opens** — its figures were scored at 625 on 18 files and the lane is 807 on 28. Needs a dev/QE re-measurement hop, not a BA/PM hop |
| **10** | **`EPIC-005`** — opening book | `P1` `S` epic | Genuinely last of the epics: `## Dependencies` names `EPIC-004`, which is undecomposed, and `RISK-004` (source licensing) must be resolved **before any data is copied** |
| **11** | **`ABC-030`** — the `*.nfr.test.ts` comment counts | `P3` `XS` · Backlog, **DoR 10/10** | **Confirmed at the bottom, on its own instruction**, which I re-read and agree with: *"it must NOT be pulled ahead of anything … if it is still sitting here in six months, that is the correct outcome and not a process failure."* Its DoR being met is not a reason to promote it |

## Why position 1 is `ABC-021` and not `ABC-026`

Both are `P1`, both are `S`, both are DoR-met, and I moved between them twice. The tie-break:

- **`ABC-021` is the only one with a user on the other end.** The product currently tells a player a
  draw is claimable and offers no way to claim it — `ABC-021`'s own words for why it is not droppable,
  and they are still true.
- **`ABC-026`'s urgency is real but self-limiting.** Its own page records why: *"`N8-LANE` already
  does that job — every ticket is checked against its 5% share at its own gate, so the breach is
  visible ticket by ticket long before the total is reached."* The budget cannot be breached silently
  between now and #2.

If the Orchestrator pulls both into `Ready` and dev takes them in either order, nothing is lost. **The
ordering that would be wrong is either of them behind the newly-cut work**, because the new work is not
promotable yet and `Ready` is starved at 0/8.

## The exit I am taking, and the one I am not

**`Backlog → Ready` REQUESTED for `ABC-021` and `ABC-026`** — that is BA/PM's own exit and I am taking
it. `Ready` goes 0/8 → **2/8**; no WIP limit is approached. **The rows are the Orchestrator's to place
and `plans/board.md` was not opened for edit.**

**`ABC-010` is NOT promoted**, and that is the interesting half of this note: it was the item I
expected to put at position 1 when I started, its own page instructs that it be `Ready` before this
epic is decomposed, and it failed the re-verification on a measurement. **A ticket that fails the DoR
belongs in `Backlog`, not in "almost ready"** — and this board's standard is not suspended because a
promotion would have made the list look finished.
