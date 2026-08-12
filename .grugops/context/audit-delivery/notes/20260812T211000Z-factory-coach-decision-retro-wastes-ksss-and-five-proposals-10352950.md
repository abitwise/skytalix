---
id: 20260812T211000Z-factory-coach-decision-retro-wastes-ksss-and-five-proposals-10352950
kind: decision
by: factory-coach
at: 2026-08-12T21:10:00Z
verified_by:
confidence: medium
refs:
  - delivery-audit-2026-08-12
  - agent-factory/workflows/11-retro.md
  - plans/metrics.md
  - plans/board.md
  - plans/traceability.md
  - AGENTS.md
  - EPIC-006
  - ABC-016
  - ABC-017
  - ABC-019
  - ABC-028
  - tools/grugops/test-skip-integrity.js
supersedes:
---

# The retro: three wastes, Keep / Stop / Start, and five proposals in priority order

**On-demand trigger, `mode: lean`, not a sprint boundary** — so this is the light retro Workflow 11
prescribes for lean. **Proposals are PROSE ONLY.** No ticket file was written, no ID was allocated,
no ADR was touched; BA/PM holds `ABC-031`+ concurrently this hop. Every waste below cites a value
now live in `plans/metrics.md`.

## THE TOP THREE WASTES

### 1. Record inflation — the largest cost centre in this factory, and it is not the testing

`plans/metrics.md` `## Method`, and measured this hop: **`ABC-001`…`ABC-008` = 708 ticket-lines for
1530 production lines (0.46 : 1). `ABC-022`…`ABC-030` = 8922 ticket-lines for 63 production lines
(142 : 1).** A **300× rise in documentation intensity in three weeks.** Repository-wide: **10.08 MB
of prose** (`plans/` + `memory-bank/` + 839 context notes) against **131 KB of production
TypeScript — 77 : 1.** `plans/board.md` is **20,510 words in 232 lines**; `ABC-028` is **2962 lines
of ticket for zero production lines.**

**Chase the cause, not the symptom:** nobody is being verbose for fun. The cause is that this
factory's records are **append-only by convention and nothing ever compacts them.** Every hop
appends; the board's own anti-regrowth rule ("a board row is ONE LINE") applies to the board and to
nothing else, and `plans/traceability.md` now carries roughly 26 stacked `_Updated:` headers above
its table.

### 2. Time is spent QUEUEING, not working

`Lead time` **9 days median** for epic-decomposed tickets against a `Cycle time` proxy of **1 day**
from first `src/` commit to merge. **Roughly 90% of a planned ticket's life is spent sitting in
`Ready`.** The whole `EPIC-002` batch was cut on 2026-07-31 and merged 2026-08-06…12.

**Cause:** not a WIP limit — `WIP` records that **no limit has ever been reached and no override has
ever been taken in 30 tickets.** The constraint is agent-hop serialization, and the ten-ticket batch
cut of 2026-07-31 created a queue that took twelve days to drain. The 2026-07-31 `WIP` note called
this correctly ("a buffer that fills while the column it feeds is empty is a queue, not a
pipeline"); the queue drained, but the queueing time was real and is still the dominant term.

### 3. Rework is climbing, and the sick gate is UPSTREAM — the criteria, not the code

`Rework rate`: **first ten tickets to `Done` = 1 bounced ticket / 1 backward move; last ten = 7
bounced tickets / 11 backward moves.** `Gate pass rate` on judgment gates: **100% for the first
eight, 30% for the last ten.**

**Chase the cause.** The bounces are **not** code defects. Read what the gates actually found:
`ABC-016` — *"ZERO CODE DEFECTS, SEVEN CRITERION GAPS"*; `ABC-019` — *"8 criterion gaps + 1 test
gap"*; `ABC-028` — *"ZERO CODE DEFECTS, SIX CRITERION GAPS"*, then four more at the next gate, then
three more at the narrow re-gate; `ABC-017` — *"18 acceptance/DoR defects fixed at a gate."* **The
defect surface is the acceptance criteria, and it is being inspected a week after it is written, by
a gate, at the price of a backward board move each time.** That is BA/PM's work being done by QE,
late, expensively. A spiking rework rate is a sick gate upstream — and here the upstream gate is the
`Ready for Dev` exit, which is not inspecting criteria at all.

## KEEP

- **The gate-cut chain.** Branching factor **0.48**, generations **18 → 7 → 4 → 1 → 0**, no cycle,
  decaying size and priority. It caught **three real behavioural defects in the rules core**
  (`ABC-009`, `ABC-011`, `ABC-022`) that had already been merged as `Done`. It is a net, not a loop.
- **Backward moves recorded as backward moves.** Nine tickets, thirteen moves, every one on the
  record and several with the Orchestrator's own error named in the same line. A factory that
  records its reversals honestly is the only kind that can be audited at all — this audit was
  possible *because* of that habit.
- **"Expected production diff: ZERO LINES" declared up front on hardening tickets.** I verified
  every such claim independently with `git log --numstat`. **Every one held.** That is a discipline
  that is working and that made this classification measurable instead of arguable.
- **Blocked discipline.** Two events, ~1 day total, zero escalations against a 2-day threshold.
  This row needs nothing.

## STOP

- **Stop appending a narrative `_Updated:` header per hop.** The board already forbids it for
  itself and archives instead; `plans/traceability.md` does not, and now carries ~26 of them.
- **Stop re-deriving the same delivery measurements inside hop prose while `plans/metrics.md` sits
  stale.** Twelve days of hops each read that file — several re-measured throughput, cycle time and
  suite size in their own headers — and none of them wrote the number down where it belonged.
- **Stop treating a gate as the first place acceptance criteria get read.**

## START

- **Start closing out warnings, not just raising them.** The 2026-07-31 `WIP` warning did **not**
  come true (open tickets 13 → 5) and nothing said so for twelve days. An alarm nobody clears is an
  alarm nobody believes.
- **Start writing a ticket's overflow into context notes instead of into the ticket.**
- **Start measuring one thing from outside the factory** — see proposal 1.

## FIVE PROPOSALS, IN PRIORITY ORDER — prose only, no IDs, no ticket files

> Five, not twelve, because a retro that proposes twelve improvements has proposed none.

### 1. Carve a thin "it runs" entry-point slice out of `EPIC-006` and pull it next — an `S`, `P0`

Not the packaging epic: a single entry point that boots the existing `src/turn-loop.ts` against the
existing renderer with the input seam wired to stdin, opponent stubbed to any legal move.
`package.json` has neither `bin` nor `main` today; every other part already exists and is merged.

- **Waste removed:** the factory has **no feedback channel from outside itself.** `Escaped defects`
  is structurally unmeasurable (UAT deferred → `EPIC-006` on all 25 `Done` tickets, nothing
  deployed), `AGENTS.md:48` reads `Dev / run: UNKNOWN - verify`, and every quality signal in this
  repository is self-generated. **This is the highest-leverage ticket available and it is small.**
- **How I would know it worked:** `AGENTS.md`'s `Dev / run` slot carries a real command; at least
  one `Done` ticket records UAT **PASSED** instead of deferred; and `plans/metrics.md`'s
  `Escaped defects` row carries a number derived from *running the program* rather than from
  reading a merge.

### 2. Put a size budget on ticket prose, with the overflow going to context notes

Apply the board's own anti-regrowth rule shape to `plans/tickets/`: acceptance criteria, scope and
risks stay in the ticket; measurements, rejected alternatives and gate narration go to
`.grugops/context/<task>/notes/` where Workflow 16 already puts them.

- **Waste removed:** waste 1 — **142 ticket-lines per production line** in the last cohort, a
  2962-line ticket that shipped zero production lines, and 10 MB of prose for 131 KB of code.
- **How I would know it worked:** median ticket length for the next ten cut tickets **≤ 300 lines**
  (current median for `ABC-022`…`ABC-030` is **720**), no ticket over 1000 lines — **and the
  control that stops this being a false win: criterion gaps found at QE must not rise.** If tickets
  get shorter and gaps get worse, the budget cut rigour instead of prose and must be reverted.

### 3. Move criteria review from the gate to the `Ready for Dev` exit

The Orchestrator already owns that exit. Add one step: re-read the acceptance criteria against the
built tree *before* the ticket enters `In Development`, and record the gaps found there.

- **Waste removed:** waste 3 — `Rework rate` **7 of the last 10** tickets bounced, `Gate pass rate`
  **30%** for the last ten, driven by criterion gaps (`ABC-016` 7, `ABC-019` 8, `ABC-028` 6+4+3,
  `ABC-017` 18) on tickets with **zero code defects**. Each of those cost a backward board move and
  a full re-gate.
- **How I would know it worked:** criterion gaps found at QE drop below **3 per ticket** for five
  consecutive tickets, and backward moves per ticket drop below **0.5**. **The anti-gaming control:
  gaps recorded at the `Ready for Dev` exit must RISE.** If gaps fall at both ends, the review is
  not happening — the finding simply stopped being written down.

### 4. Make `plans/metrics.md` a daily-sweep obligation with a visible staleness bound

The file's own FORMAT block already says the sweep and the retro own it. Enforce it: the sweep
updates the affected rows or writes one line saying nothing moved.

- **Waste removed:** this file stood **12 days stale** with `Throughput` wrong by **17 tickets** and
  four rows never filled — and the retro was the first role to notice. Every hop in between made
  its decisions against a number from 2026-07-31.
- **How I would know it worked:** the `_Updated:` date is never more than **2 days** behind `main`'s
  tip commit date; no row is empty; and `UNKNOWN - verify` appears only where the repository
  genuinely cannot answer (today: two places, both named).

### 5. Give every open debt an owner and a date — starting with the one that has neither

- **`H2`** is discharged by **four lines of markdown**. I verified out-of-tree that
  `node tools/grugops/test-skip-integrity.js <header-only-registry> --skip-count 0` prints
  `No findings.` and exits **0**. It needs a named human to create `.grugops/test-skips.md`
  (human-owned by design) and one gate call to be wired.
- **`H5`** is "owned" by `ABC-026`, which is a `Backlog` position, not a person. Its real owner is
  BA/PM with Architect/Design. I measured the lane at **1.98 s wall / 9.51 s CPU** against
  `NFR-008`'s 3 s / 13 s, so this is a record-keeping debt and not a live risk — but it should say
  so, with a name on it.
- **The duplicate `ABC-028`/`ABC-029` rows in `plans/traceability.md` have no owner at all.**
  Verified: 32 `ABC-` rows for 30 tickets, duplicates at lines 201/203 and 202/204. Recommended
  owner: **BA/PM**, who owns the file and flagged them.
- **Waste removed:** a mandatory gate step that has **never run once**, a debt parked in a queue
  instead of assigned, and a trace table that miscounts its own rows.
- **How I would know it worked:** the next quality gate's log shows the test-integrity step running
  and exiting **0** (rather than a `skip 0` recorded in its place); `plans/traceability.md` has
  **30** `ABC-` rows; and every remaining debt line carries a role name and a date.
