---
id: 20260812T175500Z-ba-pm-artifact-ref-backlog-rows-and-trace-written-4e17c8b3
kind: artifact-ref
by: ba-pm
at: 2026-08-12T17:55:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-cut
  - abc017-cut-2026-08-12
  - ABC-028
  - ABC-029
  - ABC-017
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
  - 20260812T145500Z-ba-pm-artifact-ref-trace-row-written-5f08d3b2
  - 20260812T165500Z-qe-e2e-artifact-ref-trace-row-permitted-2a7e63d1
supersedes:
---

# The two `Backlog` rows VERBATIM for the Orchestrator to place, and the `plans/traceability.md` write — ATTEMPTED, **PERMITTED**, applied and git-proven

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp.

## `plans/board.md` — NOT written, and the rows are below

`plans/board.md` is the Orchestrator's. **This hop did not write it**, and did not touch the branch's
copy for the additional reason a prior hop recorded: a later role "fixing" the branch copy conflicts
at the rebase.

**Place both rows under `## Backlog (WIP unlimited)`.** `Backlog` is unlimited and `Ready` is 0/8, so
**no WIP limit binds** and **no existing ticket moves** — in particular **`ABC-017` stays in `Done`**.
Suggested position: after the existing `[ABC-026]` row, keeping the file's ascending-ID order.

### Row 1 — `ABC-028`, VERBATIM

```
- [ABC-028] The history pane's three unreached input classes — a length-preserving mutation, an odd slid window, and the during-render clause over the whole `GameHistory` graph  (owner: BA/PM, size: S, P1, epic: EPIC-002, since: 2026-08-12, **cut from `ABC-017`'s MERGE** by BA/PM at task `abc017-cut-2026-08-12`, HARDENING not a defect — **ZERO code defects, the delivered pane is correct on all four builds and `src/history-pane.ts` md5 `54fd4346…` is unchanged; expected production diff ZERO LINES**; **DoR NOT met — 8 of 10 clean, 1 ⚠️ and 1 ❌ — and deliberately not smoothed**, `ABC-024`/`ABC-026`'s standard; **blocked-until: NONE**, but it SHARES `src/history-pane.nfr.test.ts` with `ABC-029` and with `ABC-019`'s next hop, so the two must not run concurrently in two worktrees and the second to land rebases. **Homes THREE of the four accepted risks `ABC-017` merged carrying.** `RISK-ABC017-01` ⭐ — **`WCACHE-LEN`, a cache invalidated on `moves.length`, PASSES `A14` EXACTLY** and its ONLY catcher in the project is the incidental fixture sharing that both the merged ticket and a signed comment at `src/history-pane.nfr.test.ts:106-112` declare free to remove; **QE said in words it would not carry this one**; consumer path is `EPIC-006`'s undo and was re-measured a THIRD time here — `37. Nb1 Nc6` then `takeBack(1)` and a DIFFERENT move gives `37. Nb1 Nf6` at the **same `moves.length` of 21**. `RISK-ABC017-02` — **`WLEAD-ODD`**; `A6`'s new fourth anchor is **20 plies, EVEN**, so the odd slid window is reached by nothing — and **the row count and the move numbers CANNOT discriminate it**: measured here, 20 and 21 plies render the same eight numbers 30–37, so **row 1's white cell is the sole discriminator** and a naive criterion would have been vacuous, which is `D22` for the third time. `RISK-ABC017-03` — `A9`'s during-render clause closed for `moves` CONTENTS and open for `initialFen`, `position`, `position.board` and the `moves` BINDING; **restated ONCE over the whole object graph rather than patched per field, because `A9` has now been repaired once per NODE of that graph and a per-slot repair is what guarantees a fifth**. **The ❌ is item 4 and it is `A4`'s instrument, measured rather than assumed: `Object.freeze(new Uint8Array(8))` THROWS `TypeError: Cannot freeze array buffer views with elements`, so `position.board` is uncoverable the way `moves` was, and freezing `history.moves` leaves the SLOT writable — which is `WMOVESWAP` mechanically.** **`RISK-ABC017-01`'s TEXT half needs NO edit to merged text: `A2` MAKES the false sentence TRUE rather than correcting it** — and if this ticket is not scheduled before the next hop opens that file, the correction falls due at THREE sites and is **BA/PM's**, not the Engineer's. **`P1` from a DATED trigger** — `ABC-019` is unblocked and is the next hop into that file — with the counter-argument recorded; **`N8-LANE` shares ~75 ms of headroom with `ABC-029`, so whichever lands second re-measures the TOTAL**; route to `Ready` is ONE item, an instrument for `A4`. `ABC-017` NOT re-opened, NOT moved, NOT edited; `ADR-0009`/`ADR-0010` NOT re-opened; `HISTORY_COLS` HOLDS at 21)
```

### Row 2 — `ABC-029`, VERBATIM

```
- [ABC-029] "Production module" is undefined — the two guards of `NFR-002`'s structural premise disagree about their own file set, and one shares a channel with the modules it measures  (owner: BA/PM with Architect/Design, size: S, P2, epic: EPIC-002, since: 2026-08-12, **cut from `ABC-017`'s MERGE** by BA/PM at task `abc017-cut-2026-08-12`, plus the three items of a **narrow Security/NFR re-gate that was SCHEDULED AND NEVER RAN** — the merge overtook it, and that was the Orchestrator's own omission, not a role's defect; **NOTHING IS BROKEN — production runtime importers of `src/history.ts` are ZERO, measured by module-graph closure with a positive control and an ARMED negative control**; **DoR NOT met — 7 of 10 clean, 1 ⚠️ and 2 ❌ — and it needs an ARCHITECT/DESIGN HOP before `Ready`, which is `ABC-026`'s exact shape**; **blocked-until: NONE**, but it shares `src/history-pane.nfr.test.ts` with `ABC-028`. **Homes `RISK-ABC017-04`** — **`WPERFT-DYN` survives 744/744**: `A11`'s regex guard treats `perft-bench.ts` as a production module (`src/history-pane.nfr.test.ts:237-239`) while the load probe's roots EXCLUDE it (`:281-282`), so **THE CRITERION AND ITS OWN INSTRUMENT DISAGREE** and a build breaches `A11` as written while the suite is green — `D27` defined *"runtime importer"* exhaustively and left the other half of the phrase open. **Homes the never-run re-gate's stdout-channel item** — the probe parses its child's stdout as JSON, so a production root printing at module scope makes it **THE SOLE RED IN 744** reporting `is not valid JSON` (`WSTDOUT` dies, `WSTDERR` correctly survives); dated trigger `EPIC-006`'s CLI entry point, reproducible TODAY by adding `perft-bench.ts` as a root — **and that is the same fact as the root item from the other side, since adding the root is what breaks the channel**. **Homes the last UNQUALIFIED *"keeps its zero runtime importers"* at `src/history-pane.ts:30`** — swept exhaustively at the cutting hop, **three** `runtime importer` sites in `src/` and **only that one** unqualified, applying `ABC-016` `R1`/`D27`'s lesson (a repair audited on the site it names rather than every site it points at) instead of citing it; **the md5-stability constraint that blocked this DIED AT THE MERGE** and this is the ticket's ONLY permitted production line. **The regex guard is NOT redundant and must NOT be deleted — `WPERFT-STATIC` is killed by it and by NOTHING else, so the two instruments' coverage is NOT NESTED**; the delivered note calling it redundant is itself corrected here. **NOT a spike, and one was offered: two of the three criteria are ruling-independent and writable now**, so the shape is a normal ticket carrying ONE open design question in `ABC-010`'s own form — **but UNLIKE `ABC-010` this question changes what a criterion SAYS rather than where a check lives, which is why items 4 and 10 are both ❌**. `S` (2) with the ONE condition that would move it named in advance — form (a) of `A3` may pull a production change into `src/perft-bench.ts`; **promote to `P1`** when `EPIC-006` is decomposed or when any production module gains a module-scope write to stdout; **`N8-LANE`: this ticket owns the ~102 ms `RF-1` child process inside a ~575 ms of 650 total, sharing ~75 ms of headroom with `ABC-028`**. `ABC-017` NOT re-opened; `ADR-0009`/`ADR-0010` NOT re-opened; `HISTORY_COLS` HOLDS at 21)
```

**One caution for whoever places them.** Each block above is **ONE line** in `plans/board.md`,
reproduced inside a fence here only so it survives as a note. Do **not** introduce the line breaks
your editor may show. The board's own rule is *"a board row is ONE LINE"*, and per-hop detail belongs
in these notes rather than in the row.

## `plans/traceability.md` — ATTEMPTED, **PERMITTED**, and applied

The brief said to report a denial, preserve the text verbatim and stop. **There was no denial.** The
`Edit` tool — the same tool denied twice at `quality-gate-ABC-017-qe` and permitted at the three hops
since — was **allowed**. **Nothing was re-derived, paraphrased or softened to obtain the permission,
and no alternative route was tried, because there was nothing to route around.** That is now four
consecutive permitted hops after two consecutive denials.

**What was written: TWO NEW ROWS APPENDED (`ABC-028`, `ABC-029`), plus one `_Updated:` header at the
top per that file's newest-first convention. NO EXISTING ROW WAS TOUCHED.**

`Code (PR/files)`, `Tests`, `UAT` and `Release` are **left EMPTY on both rows.** This hop wrote **zero
lines under `src/`** and added no test; filling a `Tests` cell at a cutting hop would be fabricating a
trace. The substance is in `NFRs` (cell 5) and `Status` (cell 10) — `ABC-026`'s form.

**Integrity — verified after the write, and git-proven rather than eyeballed:**

| check | result |
|---|---|
| table lines (`^\|`) | **37 → 39** — exactly the two rows added |
| rows starting `\| ABC-028 ` / `\| ABC-029 ` | **1 and 1** |
| each new row's unescaped pipes | **11 and 11** — identical to every other row, so no cell boundary is anomalous |
| each new row's cells | **10 and 10** |
| both rows newline-free | asserted — 4,247 and 4,507 characters, each a single line |
| `git diff --numstat` after the rows alone | **2 insertions, 0 deletions** |
| `git diff --numstat` after the header too | **4 insertions, 0 deletions** |
| removed content lines (`^-[^-]`) | **0** — which **proves** every pre-existing line byte-identical, rather than hashing them |
| prior `_Updated:` headers | **49 → 50, NONE replaced or deleted** (removed-header count **0**) |

> **`git diff --numstat` with ZERO deletions is a stronger statement than an md5 of the other rows.**
> An md5 comparison shows the other lines hash the same; a diff with no deletions shows the version
> control system itself found **nothing removed or rewritten** anywhere in the file. Both were
> available and the stronger one is reported — the check BA/PM introduced on this file and QE
> adopted.

**On the counting convention, so a later hop does not report a phantom discrepancy:** a naive
`line.trimStart().startsWith("|")` counts one extra — there is an **indented** pipe line in the file
(an `ABC-012` example inside a fenced block, not a table row). The figures above use
`startsWith("|")`, which is the convention every prior hop on this file used.

## Where the content is

- **The two tickets:** `plans/tickets/ABC-028-history-pane-unreached-input-classes.md` and
  `plans/tickets/ABC-029-production-module-scope-and-load-probe.md`.
- **The rulings behind them**, in the four notes beside this one:
  - `…-observation-baseline-claim-and-brief-check-7c2e94a1` — the claim, the baseline, and **three**
    wrong figures in the brief, one of which stops three gates running in this worktree.
  - `…-decision-the-cut-and-its-shape-3f81b6d2` — two tickets, the seam, and why **not** a spike.
  - `…-decision-eight-items-homed-or-refused-9a4d17e5` — the eight items, including the `G5` refusal
    and the `R1`/`D27` precedent read at source.
  - `…-observation-ar1-abc010-measured-2b93f0c7` — `AR-1` against `ABC-010`'s **actual text**,
    executed rather than paraphrased.
  - `…-decision-size-priority-and-dor-6d05a3f9` — sizes, priorities, the `N8-LANE` contention and the
    per-item DoR.

## One note for the Orchestrator

**No traceability work is owed to you from this hop** — both rows are current as of this ruling.
**The board is yours**: place the two rows above; **no existing ticket moves and no WIP limit binds.**
Two items are handed back rather than homed and each has a named owner: **`ABC-010`'s missing range
rule** (BA/PM, at `ABC-010`'s promotion hop) and **`G5`/`AR-4`'s now-dated trigger** (belongs in
`ABC-019`'s brief, which is yours to write — I did not touch `ABC-019`, which is in flight).
