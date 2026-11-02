---
id: ABC-267
title: "TH-3: multi-worker property rows across thread counts, a multi-writer torn-entry stress, NFR-009 summed over workers as a standing row, and the default lane's wall before and after its one 2-worker row (test-only)"
status: done
column: Done
closed: "2026-11-02, folded into ABC-266 (merged into it; not delivered on its own). The Orchestrator's ruling (board, 2026-11-02), on ADR-0062 D13 (PROPOSED, arch-ABC-266 …4f828986). A1 → ABC-266 A3; A2 → ABC-266 A8 with the probe-then-cutoff case added; A3 → ABC-266 A5 as a standing THREADS_DEEP row; A4 settled at zero default-lane rows (ABC-266 A6 G8); A5 → ABC-266 A6 determinism source row; F2/F3 → ABC-266 F5/F6; scope 5 (the 2^10-slot seam) dropped. Front matter by bapm-ABC-266-rows; the board move is the Orchestrator's. Was: backlog, DoR 9/10 (bapm-threads-cut)"
size: S
priority: P2
epic: EPIC-011
feature: —
adr: "None of its own. It follows ADR-0026 (test method) and ABC-266's ADR (M, the deep-lane flag). Source: ADR-0057 (ACCEPTED 2026-11-02) D4's G4, NFR-008 and NFR-009 rows, D2.3 (SP2) and § Inputs for the thread tickets"
---

# ABC-267: the thread tests and lanes (TH-3, test-only)

> **CLOSED AS FOLDED INTO `ABC-266`, 2026-11-02, by BA/PM** (task `bapm-ABC-266-rows`, records only, at `main`
> `09306a14`; nothing run). Source: the Orchestrator's ruling *"ABC-267 folds into ABC-266"* (board, 2026-11-02), on
> `ADR-0062` D13 (PROPOSED, `arch-ABC-266` `…4f828986`). The reason is the Architect's: `ABC-266` is the merge that
> creates several writers, so the race guard lands with the race, and one QE hop reads both.
> - **Where each row went** (`ABC-266`'s page carries them; this page is history):
>   - A1 → `ABC-266` A3 (`Threads` ∈ {2, 4, M}, every corpus position, `go movetime 200`, in `THREADS_DEEP`);
>   - A2 → `ABC-266` A8, on the **production** table through `adoptTable` (4 096 keys into 1 024 slots of the 2^18-slot
>     table), with the **probe-then-cutoff case added**;
>   - A3 → `ABC-266` A5, a standing `THREADS_DEEP` row read as `ADR-0062` D10 says;
>   - A4 → settled at **zero** default-lane rows (`ADR-0062` D11: a worker inherits the lane's heap flag, and the suite
>     shape is already at 2 016 of 2 048 MiB). The before and after `N8-LANE` figures are still read (`ABC-266` A6 `G8`);
>   - A5 → `ABC-266` A6, as a determinism source row;
>   - F2 and F3 → `ABC-266` F5 and F6. F1 and F4 are covered by `ABC-266` F1 and `NFR-008`'s reading.
> - **Dropped:** scope 5, the 2^10-slot test seam. Keys chosen into 1 024 slots give the same contention at the
>   production size, so no test-only export is needed.
> - **Size and value move to `ABC-266`** (L, about 20–45 h, `estimate`). Front matter `status: done`, `column: Done`,
>   with a `closed:` line reading folded, not delivered on its own. The board card move is the Orchestrator's.

> **Cut 2026-11-02 by BA/PM** (task `bapm-threads-cut`, records only, at `main` `48f3fc01`; nothing run). Source:
> the owner's answers `…81ae2db4` (*"1 yes"*, *"4 a"*) and `ADR-0057` § Inputs for the thread tickets, column TH-3
> (`arch-owner-answers-1102` `…a0df22b8`). **Test-only; no value change; no read.** `EPIC-011` threads strand,
> **third**. **It may be folded into `ABC-266`** (`ADR-0057` § Inputs). That fold is the Orchestrator's call at
> `ABC-266`'s pull. If folded, these rows join `ABC-266`'s acceptance unchanged, and this page is closed as merged
> into it.

## Problem

- **User:** QE and every later change to the search, which must not break multi-worker play unseen.
- **Pain:** `ABC-266` proves `Threads N` plays on a handful of positions. Three things stay unguarded after it:
  - **the race:** nothing standing shows that two writers' torn entries never pass the check;
  - **memory:** nothing standing reads `NFR-009` summed over workers;
  - **the default lane:** nothing measures what a worker costs it (`NFR-008`).
  `ADR-0057` lists the last two as `UNKNOWN - verify` items this ticket settles (§ Consequences).
- **Value:** the strand stays safe to build on. Phases 3–5 edit the search while workers exist.

## Scope

1. Multi-worker property rows across thread counts, behind `ABC-266`'s deep-lane flag.
2. The torn-entry stress in SP2's form (`ADR-0057` D2.3), on the production layout at a test size.
3. A standing `NFR-009` row summed over workers (`G7`'s figures, OQ-4 (a)).
4. At most one small 2-worker property row in the default lane. The default lane's wall is read before and after.
5. One test-only seam that builds `ABC-265`'s layout at 2^10 slots for scope 2. Its name is the Engineer's, under
   `ADR-0026`'s test-only export rules. **No production line changes.**

## Out of scope

- Any `src/` production change. A red row here is a defect in `ABC-265` or `ABC-266`, routed back, and never fixed in
  this ticket.
- Games, reads and the `Threads N` read (`ABC-266` A7).

## Acceptance criteria

- **A1 (properties across thread counts).** Deep lane, for `Threads` ∈ {2, 4, M} (M is `ABC-266`'s maximum), on
  every position of the `ABC-078` `A3` corpus, `go movetime 200` each:
  - exactly one legal `bestmove`;
  - it arrives no later than the bound the `Threads 1` movetime row asserts;
  - no thrown error, and no worker `error` event or non-zero `exit`;
  - a clean exit after `quit`.
  Properties only. No node count and no specific move.
- **A2 (the torn-entry stress, SP2's form).** In the deep lane, W writer workers, W = 4 and W = 12, share one table of
  2^10 slots (scope 5) and store and probe 4 096 keys. Each key's payload is a function of the key, so a hit can be
  checked. **At least 10 M probes a run.**
  - **Bars:** **undetected corrupt hits = 0**, meaning a hit whose payload is not its key's. And **torn slots
    observed > 0**, which shows the stress exercises the race. SP2 read 0.69 % (4 writers) and 2.6 % (12).
  - Reported: probes, torn slots and their fraction, run time.
- **A3 (`NFR-009`, summed).** A standing row in the deep lane, at `Threads M`, read as `G7` reads it.
  - **Bar:** retained growth ≤ 16 MiB, and growth ≤ 1 MiB between a 1 s and a 4 s search. Growth is the
    `arrayBuffers` and heap fields summed over the main thread and every worker. The shared table counts once.
  - The figure is reported against `ADR-0057`'s ≈ 10 MiB estimate at 12 workers.
- **A4 (`NFR-008`, the default lane).**
  - **The row:** at most one small 2-worker property row in the default lane (one position, `Threads 2`, properties
    as A1). Every other multi-worker row sits behind the deep flag.
  - **Bar:** `npm test` wall ≤ 10 s at load1 ≤ 8 on the declared stack (`G8`). Read **before and after** the row,
    both figures reported, with `N8-LANE`.
  - **If the row breaks the bar:** it moves to the deep lane and the default lane holds none. "At most one" allows
    zero. The before and after figures are still reported. This settles `ADR-0057`'s worker start-up
    `UNKNOWN - verify`.
- **A5 (determinism, `ADR-0027`).** No default-lane row asserts a node count or a specific move at `Threads ≥ 2`. A
  source row checks the one 2-worker row's assertions.
- **A6 (gates).** `G8` (A4). `G1`, `G4` and `G9` unchanged (test-only). The PR lists every row it adds.
- **Falsifiers.**
  - **F1:** an A1 or A3 red is a defect in `ABC-266`'s code, back to the Software Engineer.
  - **F2:** an undetected corrupt hit in A2 is a defect in `ABC-265`'s check.
  - **F3:** torn slots = 0 in A2 is an instrument defect. The stress does not exercise the race, so it is reworked
    before it is read.
  - **F4:** A4 over 10 s with the row moved out (zero rows) is not this ticket's to fix. Security/NFR reads it under
    `ADR-0035`.

## NFR triggers

- **`NFR-008`:** ≤ 10 s, before and after, with at most one 2-worker row (A4).
- **`NFR-009`:** ≤ 16 MiB, growth ≤ 1 MiB, summed over workers (A3).
- **Security:** none. Test files only.

## Test notes

1. Deep-lane rows run in QE's scratch clone with the host ALONE, like `ABC-204` and `ABC-225`.
2. A2 uses the production probe and store over a 2^10-slot table through the scope 5 seam, never a re-implementation.
3. UAT: test-only, so no product surface. The QE verdict signs it.

## Size and priority

- **Size: S**, about 5–10 h (`estimate`, BA/PM's share of `ADR-0057`'s 32–65 h).
- **Priority: P2.** It goes with `ABC-266`, before Phase 3.

## Dependencies

- **`ABC-266` merged**, or this ticket folded into it. **`ABC-265`** for A2's layout.
- **`ABC-266`'s ADR:** M and the deep-lane flag.
- **Place:** after `ABC-266`, before Phase 3, W1 and any 40/15 reading.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0057` D4, § Consequences |
| 2 | scope and out-of-scope | ✅ test-only |
| 3 | INVEST | ✅ S; it may fold into `ABC-266` (the ADR allows it) |
| 4 | testable, measurable acceptance | ✅ 0 corrupt hits in ≥ 10 M probes; torn > 0; ≤ 16 MiB / ≤ 1 MiB; ≤ 10 s before and after; ≤ 1 default row |
| 5 | dependencies known | ✅ `ABC-266` (merged or folded); its ADR |
| 6 | NFR triggers with targets | ✅ `NFR-008` 10 s; `NFR-009` 16 MiB / 1 MiB |
| 7 | test notes | ✅ 1–3 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ `ABC-266`'s ADR (M, the deep flag) is not written, and `ABC-266` is not merged |

~~**DoR 9/10. Backlog.** It reaches Ready when `ABC-266`'s ADR is written and `ABC-266` has merged, or at once if the
Orchestrator folds it into `ABC-266`. The board move is the Orchestrator's.~~

**Closed, folded into `ABC-266`** *(2026-11-02, `bapm-ABC-266-rows`)*. No DoR is scored here any more: the rows are
scored on `ABC-266`'s page (DoR 9/10, waiting on `ABC-265`'s merge). The board move is the Orchestrator's.
