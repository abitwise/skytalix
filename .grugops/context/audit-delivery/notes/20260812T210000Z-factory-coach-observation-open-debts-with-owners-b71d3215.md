---
id: 20260812T210000Z-factory-coach-observation-open-debts-with-owners-b71d3215
kind: observation
by: factory-coach
at: 2026-08-12T21:00:00Z
verified_by:
confidence: high
refs:
  - delivery-audit-2026-08-12
  - plans/metrics.md
  - plans/traceability.md
  - plans/board.md
  - plans/epics/EPIC-001-chess-rules-core.md
  - plans/epics/EPIC-002-terminal-board-and-game-loop.md
  - tools/grugops/test-skip-integrity.js
  - ABC-011
  - ABC-024
  - ABC-026
  - ABC-028
  - ABC-029
  - NFR-008
supersedes:
---

# The four debts: three CONFIRMED, one FIXED — plus two more the measuring found, and one debt that has no owner at all

A debt with no owner is what this role exists to surface, so each entry below ends with a name and
a next action, not with a description.

## `H2` — Workflow 05's test-integrity step cannot run. **CONFIRMED, and the remedy is now exact.**

**Confirmed by execution, not by reading the board.** `node tools/grugops/test-skip-integrity.js`
exits **2** with no argument, and exits **2** on a missing registry path. There is no registry file
anywhere in this repository. Workflow 05 forbids reading exit 2 as a pass, so three gates recorded
the runner's `skip 0` in its place — non-blocking at 0 skips, but the required step has **never run
once in this project's history.**

**What the board's statement of this debt does NOT say, and what I measured this hop:**

- The tool names its own path in its header comment: **`.grugops/test-skips.md`**. It is
  **human-owned by design** (`D-02`, `D-08`: *"test-integrity is human-only and the registry is
  human-owned"*), which is precisely why the board is right that the owner is a **HUMAN** and why
  no agent — including me — may create it.
- **The registry does not need any content.** I built a header-only registry
  **outside the repository** (in the session scratchpad, so this hop wrote no file it was not
  authorised to write) and ran the real tool against it:
  `node tools/grugops/test-skip-integrity.js <registry> --skip-count 0` → **`No findings.` exit 0**.

**So `H2` is not a hard problem waiting on analysis. It is four lines of markdown waiting on a
human:**

```
# Test skip registry

| Test ID | Reason | Owner | Ticket/REQ | Expiry | Category |
|---------|--------|-------|------------|--------|----------|
```

**Owner: a named HUMAN** (unchanged; the design requires it). **Next action: create
`.grugops/test-skips.md` with the header row above, then wire the gate call
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>`.** Cost:
minutes. Value: a mandatory gate step stops being permanently skipped, and stays honest the first
time somebody adds a `.skip`.

## `H5` — `ABC-026`'s lane total, owed past two merges. **CONFIRMED OPEN, and the owner is a queue, not a person.**

Confirmed: the board records it as owed past two merges, `UNKNOWN - verify`, "re-homed to
`ABC-026`". **`ABC-026` is in `Backlog`.** Re-homing a debt to a `Backlog` ticket is not assigning
an owner — it is assigning a queue position. `ABC-026`'s stated owner is **BA/PM with
Architect/Design**, and that is the name this debt should carry.

I measured what I could without claiming the debt discharged. `NFR-008` requires `npm test` with
`PERFT_DEEP` unset to complete in **≤ 3 s wall / ≤ 13 s CPU**, medians of **≥ 7 interleaved runs**,
on Apple M3 / 8 logical cores / Node v24.12.0 / vitest 3.2.7. My environment matches that
specification exactly (verified: `node -v` = v24.12.0, `vitest --version` = 3.2.7,
`hw.logicalcpu` = 8). Seven runs:

- wall: 2.28 / 2.01 / 2.05 / 1.89 / 1.89 / 1.95 / 1.98 → **median 1.98 s** against a 3 s budget (**34% headroom**)
- CPU (user+sys): 9.85 / 9.61 / 9.51 / 9.48 / 9.33 / 9.47 / 9.66 → **median 9.51 s** against 13 s (**27% headroom**)

**This does NOT discharge `H5` and I am not recording it as though it did.** My runs were
**sequential, not interleaved** as `NFR-008` requires, and `node_modules` was symlinked from a
sibling worktree. `H5` stays `UNKNOWN - verify`. **What it does do is retire the risk narrative:**
the lane is not near its budget, so this debt is a record-keeping debt, not a live performance
threat. **Owner: BA/PM with Architect/Design, via `ABC-026`. Next action: pull `ABC-026` or
re-home `H5` to a named role with a date — not to a backlog position.**

## The duplicate `ABC-028`/`ABC-029` rows in `plans/traceability.md`. **CONFIRMED. THIS IS THE DEBT WITH NO OWNER.**

Verified mechanically: the table holds **32 `ABC-` rows for 30 tickets**. `ABC-028` appears at
**lines 201 and 203**; `ABC-029` at **lines 202 and 204**. The file's own comment block (line 157)
records them as *"KNOWN DUPLICATE ROWS — flagged 2026-08-12 by BA/PM at `refinement-ABC-028-shape`,
NOT repaired"*, with the **first of each pair live**. **I did not repair them** — my brief forbids
it and the board is right that a repair needs a hop that can reconcile two histories rather than
delete a row.

**The gap: every record of this debt names what it is and how it happened, and none of them names
who fixes it.** `H2` has a human. `H5` has `ABC-026`. `plans/metrics.md` had me. **These rows have
nobody**, and they have now survived at least two hops that saw them and moved on. **Recommended
owner: BA/PM**, who owns `plans/traceability.md` and who flagged them. **Next action: a
reconciliation hop, or an explicit written decision to leave them with a date — either is fine;
silence is not.**

## `plans/metrics.md`'s own staleness. **FIXED THIS HOP.** ✅

Confirmed stale by twelve days — header read `2026-07-31`, `Throughput` read *"0 reached Done since
2026-07-24"* while **17** more tickets had reached `Done`. All nine frozen rows now carry measured
values; the four never-filled rows (`Rework rate`, `Escaped defects`, `Velocity`, and `Lead time`'s
"no data") are filled. **The metric set is unchanged — no row added, renamed or removed.** Two
values honestly read `UNKNOWN - verify` with the missing input named. **Standing owner: the daily
sweep and the retro**, per the file's own FORMAT block. **The real lesson is not the staleness but
its duration: twelve days of hops each read this file and none updated it**, which is the Start
proposal in the retro note.

## TWO MORE, found while measuring — both mechanical, both cheap, both with owners

### 1. The backward-move ordinals are off by one from `ABC-009` onward. Owner: **Orchestrator**.

`ABC-009`'s archived header calls its 2026-08-09 move *"FIRST BACKWARD MOVE IN THIS PROJECT'S
HISTORY, and recorded as one rather than dressed up as a normal transition."* `ABC-025`'s calls its
own the **"SECOND"**. But `ABC-011`'s archived header, dated **2026-08-03 — six days earlier** —
reads: *"`ABC-011` moved `Ready for UAT` → `In Design` … **THIS IS A BACKWARD MOVE AND IT IS
RECORDED AS ONE.**"* **`ABC-011` was first.** Every ordinal after it ("second", "third") is off by
one. Trivial in consequence, but this factory's records lean hard on ordinals like *"the first FAIL
in this project's history"*, and an ordinal series with a known off-by-one is a series nobody can
cite. **Next action: one correcting line; do not rewrite the archived headers.**

### 2. Every epic file's front matter is stale — including one marked complete on the board. Owner: **BA/PM**.

- **All six** epic files read `status: backlog` / `column: Backlog`, including
  `plans/epics/EPIC-001-chess-rules-core.md`, which the board has in **`Done`** since 2026-07-24.
  `plans/board.md`'s own FORMAT block states the contract: *"A ticket's `column:` value MUST equal
  the board column it sits under."* This one is measurable by a validator in one line.
- **The `tickets:` lists are stale by 11 tickets.** `EPIC-001` lists `ABC-001`…`ABC-007`, but
  **13** tickets declare `epic: EPIC-001` (`ABC-009`, `ABC-011`, `ABC-020`, `ABC-022`, `ABC-023`,
  `ABC-024` are missing from it). `EPIC-002` lists nine, but **14** tickets declare `EPIC-002`
  (`ABC-025`, `ABC-027`, `ABC-028`, `ABC-029`, `ABC-030` are missing). `EPIC-003` and `EPIC-004`
  have no `tickets:` line at all while `ABC-010` and `ABC-008` declare them.
- **Consequence worth stating rather than filing:** `EPIC-001` is recorded complete on the board
  while `ABC-024` — which declares `epic: EPIC-001` — sits in `Backlog`. The epic was complete
  under its original decomposition; six later tickets widened its scope without anything re-opening
  it. **That is not a demand to re-open `EPIC-001`. It is a request that "complete" mean one thing.**

**Next action for both: one BA/PM pass over `plans/epics/`, derivable entirely from the tickets'
own `epic:` front matter — no judgment required.**
