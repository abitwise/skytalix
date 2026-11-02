---
id: ABC-265
title: "TH-1: the transposition table becomes one lockless shared table, four Uint32 words a slot over a SharedArrayBuffer with an XOR check, still 2^18 slots and 4 MiB, node-for-node equal to main at Threads 1"
status: done
column: Done
closed: "2026-11-02, merged to local main at 605874b8 (merge(ABC-265), from grugops/ABC-265-fix 28ad3a8d; build cad6ae13, code e5694864, QE-265-a row 7d9c8695) on the owner's \"25 yes\" (orch-2026-10-30a …773be7de). QE PASS_WITH_GAPS (qe-ABC-265 …d9879b9c; QE-265-a LOW closed by se-ABC-265-fix; b–e INFO), which signs UAT; post-merge npm test 2 388 / 2 388 (board). Front matter by bapm-E1-cut (page drift since the merge; the board already read Done). Was: backlog, DoR 10/10 (bapm-ABC-265-rows)"
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0025 § amendment 2026-11-02 (ABC-265, TH-1): ACCEPTED by the owner (\"25 yes\", orch-2026-10-30a …773be7de) and IN FORCE on main since 605874b8 (arch-owner-answers-1102b). Was: decision 2's first bullet and decision 4's last bullet, PROPOSED (arch-ABC-265 …e396e5ab, merged c0f3cbad); falsifiers T8–T10; no S2 reading (its § The read ABC-265 owes; the Orchestrator's ruling). Acceptance is the owner's. Reading (b): the build may start; the merge waits on his acceptance. Source: ADR-0057 (ACCEPTED 2026-11-02) D2.3 and § Inputs for the thread tickets"
---

# ABC-265: one lockless shared transposition table (TH-1)

> **CLOSED 2026-11-02, DONE, by BA/PM** (task `bapm-E1-cut`, records only, at `main` `2bef4d31`; nothing run). A
> front-matter fold only: the page still read `backlog` after the merge (the Orchestrator's LOW, board 2026-11-02).
> - **Merged to local `main` at `605874b8`** from `grugops/ABC-265-fix` (`28ad3a8d`) on the owner's *"25 yes"*
>   (`orch-2026-10-30a` `…773be7de`): the `ADR-0025` shared-table amendment is **accepted and in force**
>   (`arch-owner-answers-1102b`, board 2026-11-02). Not pushed.
> - **QE PASS_WITH_GAPS** (`qe-ABC-265` `…d9879b9c`): A1–A5 MET, every gate green, `G6` head = base on both boards.
>   `QE-265-a` (LOW) was closed by `se-ABC-265-fix` (`7d9c8695`); `QE-265-b`–`e` are INFO. The verdict signs UAT.
> - **Post-merge:** `npm test` 2 388 / 2 388 (board).
> - **The thread strand it opened is parked** by the owner (*"park threads"*): `ABC-266` is parked and `Threads`
>   stays 1. This ticket stands on its own (`EPIC-011` § Tickets row 17).
> - Front matter: `status: done`, `column: Done`, with a `closed:` line; the `adr:` line now reads accepted. Nothing
>   below this block is edited.

> **REFINED 2026-11-02 by BA/PM: DoR 10/10, reading (b)** (task `bapm-ABC-265-rows`, records only, at `main`
> `f312e9d7`; nothing run). The design is written: the `ADR-0025` shared-table amendment, PROPOSED (`arch-ABC-265`
> `…e396e5ab`, probe `…6b1aba14`). It adds one rule `ADR-0057` D2.3 does not state: **the verified copy**. A cutoff
> uses the data and score words the probe verified, not a second read of the slot.
> - **A2 gains the T10 row** (another key's entry written between `probeTable` and `tableCutoff`).
> - **A7 and the `adr:` line cite the amendment.**
> - **The Orchestrator's ruling: no S2 nps reading for this ticket** (`orch-2026-10-30a`, brief `bapm-ABC-265-rows`;
>   the Architect's recommendation, the amendment's § The read `ABC-265` owes). A7 carries it. `EPIC-011` § The
>   per-change rule names it as an exception.
> - **Scope 7** gains the header comment lines `:11-15`, `:17-20` and `:36` that the amendment names.
> - **The build may start. The merge waits on the owner's acceptance of the amendment.** With no answer, decisions 2
>   and 4 stand as written, and this ticket is not merged. The board move is the Orchestrator's.

> **Cut 2026-11-02 by BA/PM** (task `bapm-threads-cut`, records only, at `main` `48f3fc01`; nothing run). Source:
> the owner's answers (`orch-2026-10-30a` `…81ae2db4`, verbatim: *"R yes, P yes, A accept, B park, C yes; 1 yes, 2 a,
> 3 c, 4 a, 5 no, 6 later"*). His "1 yes" puts threads in `EPIC-011`'s scope. Inputs from `ADR-0057` § Inputs for
> the thread tickets, column TH-1, and D2.3 (Architect `arch-owner-answers-1102` `…a0df22b8`). That section is cited
> here, not restated. **Intent: value-identical.** No game read: `ADR-0056` C2′ grades strength changes only.
> `EPIC-011` threads strand, **first** (TH-1 → TH-2 → TH-3). It may be pulled beside Phase 2 by width (`ADR-0056`
> D6's 2026-11-02 line, item 2).

## Problem

- **User:** the owner, through the threads strand he opened (`ADR-0057` OQ-1 yes). Later, every `Threads N` search.
- **Pain:** the table cannot be shared between workers as it is. Its key column is a `BigUint64Array`. ECMAScript
  does not make plain 64-bit element accesses tear-free, so a shared key could tear (`ADR-0057` D2.3, `documented`).
  Without a shared table, Lazy SMP workers share nothing, and the strand's measured lever does not exist. That lever is
  6.7–7.5× node rate at 12 workers (`ADR-0057` D2.4, `measured (informal)`).
- **Value:** the table the worker pool (`ABC-266`) shares. On its own this ticket changes no move, score or node count
  at `Threads 1`, so it can merge ahead of the pool without staling any Phase 2 read.

## Scope

1. **The layout (`ADR-0057` D2.3):** one `Uint32Array` of four words a slot over a `SharedArrayBuffer`. That is
   16 B a slot, 2^18 slots, 4 MiB, the same size as today. Word 0 = `keyLo ^ data`, word 1 = `keyHi ^ score`,
   word 2 = `data` (today's packing), word 3 = `score` as an unsigned 32-bit pattern.
2. **The key split, at the table boundary:** inside `probeTable(key)` and `storeEntry(key, …)`, `keyLo` and `keyHi`
   come from the `bigint` key. Both signatures stay `bigint`. Slot = `keyLo & mask`, the same slot as today.
3. **The XOR check:** a hit only if `((w0 ^ w2) >>> 0) === keyLo` and `((w1 ^ w3) >>> 0) === keyHi`, compared as
   unsigned (the trap D2.3 names). Hit rule otherwise as today: a non-zero data word.
4. **Store order:** words 2, 3, 0, 1. Plain accesses, no `Atomics`.
5. **Unchanged:** replacement (always-replace), the exact-depth hit rule, the per-search clear, the mate-score
   relativity (`ADR-0025` d3), quiescence never probing (d5), the hash move's legality check before use.
6. **A handle to the buffer** that `ABC-266` hands to each worker once. Its name and shape are the Engineer's. It is
   not an `EngineOptions` field and not module state any recursion reads (`ADR-0026` decision 2's rejections).
7. **~~Two~~ Four comments in `src/transposition.ts`**, owed with the next edit of that file:
   - the "under 10 000 (a full board of queens)" comment at lines 58–60 is false. It is corrected to the derived
     bound, |`evaluate`| ≤ 10 885 cp within legal promotion (`ADR-0059` d2's dated bullet, `QE-264-b`);
   - the "threading stays `UNKNOWN - verify`" line *(`:36`)* is replaced by a pointer to this layout (`ADR-0057` D5)
     *and to the `ADR-0025` amendment*;
   - *(2026-11-02, `bapm-ABC-265-rows`; the amendment's § Consequences.)* the header's storage paragraph (`:11-15`,
     "an 8-byte key, a 4-byte packed word, a 4-byte score") is rewritten to the four-word slot;
   - *(same.)* the lifetime paragraph's "Clearing zeroes the packed words only" (`:17-20`) is rewritten if the clear
     changes.
   - Line numbers are as at `main` `f312e9d7`. No test reads these comments.

## Out of scope

- The worker pool, the `Threads` option and any multi-worker search (`ABC-266`). Multi-writer stress and lanes
  ~~(`ABC-267`)~~ (`ABC-266` A8, the multi-writer stress, and its `THREADS_DEEP` rows). *(2026-11-02, `bapm-P3-page`:
  `ABC-267` is closed as folded into `ABC-266`, `ADR-0062` D13.)*
- Any policy change: depth-preferred replacement (T2, `ABC-237`, parked), a larger table (T4, `ABC-258`, parked), a
  table kept across moves (`ABC-257`, paused), deeper-entry cutoffs (`ADR-0058`, accepted, not in force). Each ports
  to this layout later without rewriting it (`ADR-0057` D6's dated line).
- `se-ABC-253`'s halves key update in `zobrist.ts`, its per-ply halves key array and its halves repetition scan. They
  return only as D2.3's fallback (falsifier F2).

## Acceptance criteria

- **A1 (the layout).** Source and unit rows, test-side only, with no production counter:
  - the table's storage is one `Uint32Array` over a `SharedArrayBuffer` whose `byteLength` is **4 194 304**
    (2^18 × 16);
  - `src/transposition.ts` holds no `BigUint64Array` or `BigInt64Array` table column and calls no `Atomics` method
    (a source row);
  - `storeEntry`'s body writes word 2, then 3, then 0, then 1 (a source row);
  - `probeTable` and `storeEntry` keep their `bigint` signatures. The typecheck passes, and `ABC-081`'s `vi.mock`
    rows run unedited (A3).
- **A2 (the XOR check).** Unit rows:
  - **Given** an entry stored for key K, **when** K is probed, **then** it hits and returns the stored move, bound,
    depth and score.
  - **Given** a key K′ with the same slot (`keyLo & mask` equal) and a different `keyHi`, **then** the probe misses.
    The same holds for a K″ whose `keyLo` differs above the mask bits.
  - **Given** a slot whose words 0 and 1 come from entry A and words 2 and 3 from entry B (a torn slot, written by
    the test through the A1 handle), **then** a probe for A misses and a probe for B misses.
  - **Given** a key whose `keyLo` and `keyHi` each have bit 31 set, **then** a stored entry hits. This row catches a
    signed compare.
  - *(2026-11-02, `bapm-ABC-265-rows`; the `ADR-0025` amendment's verified copy, falsifier T10.)* **Given** an entry
    stored for key K as exact at depth d with score s_K, and `probeTable(K)` returning its slot, **when** the test
    writes another key K′'s entry into that slot through the A1 handle (all four words, as `storeEntry` would) before
    `tableCutoff` runs, **then** `tableCutoff(slot, d, …)` returns **s_K**, not K′'s score.
    - Two cases, one row each: K′ exact at depth d with a score s_K′ ≠ s_K (a live score read returns s_K′); K′ at
      depth d + 1 (a live depth read returns `null`).
    - Like the torn-slot row, it needs no second thread. The multi-writer form is ~~`ABC-267`'s~~ `ABC-266` A8's
      probe-then-cutoff case *(2026-11-02, `bapm-P3-page`: `ABC-267` folded into `ABC-266`)*.
- **A3 (identity, `G4`).** `Threads 1` is the only mode in this ticket.
  - Node-equal, cross-build, on the `ABC-078` `A3` corpus: `search()` and `chooseMove` equal base's in move, score and
    nodes at every depth the sweep reads. Every test-only door that exists before this ticket equals its pre-ticket
    self. QE runs it out of tree, base tree against head tree (`ABC-208` `A1`'s form).
  - `ABC-081`'s, `ABC-122`'s and `ABC-208`'s rows run **unedited** and green. **If any row needs an edit, the work
    stops** for an Architect ruling under `ADR-0026` (D2.3) before the row changes.
- **A4 (cost, `NFR-005`).** `G6` by its rule at `Threads 1`: depth ≥ 6 (FAIL floor) and ≥ the base build's completed
  depth on `kiwipete` and `position-6`. Also reported, not graded: the `Threads 1` profile against `main` with
  `se-ABC-253`'s `raw/profile.sh` and `raw/analyse.mts`, giving `probeTable` and `storeEntry` self time per call, head
  against base. Settles D2.3's cost `UNKNOWN - verify`.
- **A5 (memory, `NFR-009`).** The table stays 4 MiB (A1's `byteLength`). `G7` reads as today: search-held memory
  ≤ 16 MiB and growth ≤ 1 MiB between a 1 s and a 4 s search.
- **A6 (gates).** `G1` (≥ 54/58; a red is classed per row under `ADR-0034`), `G4` (A3), `G5`, `G6` (A4), `G7` (A5),
  `G8` (`N8-LANE` reported), `G9`.
- **A7 (the read): none.** Value-identical at `Threads 1`, proved by A3, and no games are played. Its cost is read by
  A4, the cost bar `ADR-0057` names. `EPIC-011` § The per-change rule also keeps an S2 nps reading for value-identical
  tickets (≈ 1 h ALONE, `estimate`). ~~Whether that reading is owed on top of A4 is the Orchestrator's ruling.~~ This is
  not a speed ticket.
  - *(2026-11-02, `bapm-ABC-265-rows`.)* **Ruled: no S2 nps reading is owed.** The Orchestrator's ruling
    (`orch-2026-10-30a`), on the Architect's recommendation in the `ADR-0025` amendment's § The read `ABC-265` owes.
    Nothing goes to the owner.
    - S2 is "the ticket meets its own mechanical bar" (`EPIC-008`). This ticket claims identity, not speed. Its cost
      bar is A4: `G6` plus the profile.
    - `probeTable` plus `storeEntry` take 0.95–1.44 % of samples (`se-ABC-253`'s base profile). A doubled cost moves
      node rate by at most about 1.5 %, under the host's 1.8–5.9 % A/B spread. An nps reading would report noise.
    - **The fallback trigger stays `G6` below base** (F2, the amendment's T9). The profile is reported, not graded.
  - `EPIC-011` § The per-change rule names this ticket as an exception to its S2 line.
- **Falsifiers.**
  - **F1:** A1, A2, A3 or A5 red is a defect, back to the Software Engineer.
  - **F2:** `G6` below base fires D2.3's fallback: carry `se-ABC-253`'s full halves path (+10–20 h, `estimate`). The
    fallback re-points `ABC-081`'s, `ABC-122`'s and `ABC-208`'s rows, which needs an Architect ruling under
    `ADR-0026` first. BA/PM re-scores the size from M to L.
  - **F3:** an undetected corrupt hit in A2's torn-slot row is a defect in the check.
  - *(2026-11-02, `bapm-ABC-265-rows`.)* **The amendment's falsifiers map here:** T8 = A3 (F1); T9 = A4's `G6` (F2);
    T10 = A2's torn-slot row and its verified-copy row (F1, F3). T8 or T10 firing is a defect, back to the Software
    Engineer. The `ADR-0025` amendment's table is authoritative.

## NFR triggers

- **`NFR-009`:** 4 MiB, unchanged (A1, A5). Counted once when shared (`ADR-0057` OQ-4 (a)).
- **`NFR-005`:** `G6` at `Threads 1` (A4). The depth-6 floor never moves.
- **`NFR-004`:** untouched. The clock check is not in this file (`G5`).
- **`NFR-008`:** unit rows only, at fixed depth or no search. Report `N8-LANE`.
- **Security:** none. No new input path. The buffer is process-internal.

## Test notes

1. Reuse sourced fixtures: the `ABC-078` `A3` corpus, `kiwipete`, `position-6`. No hand-labelled rows.
2. Deterministic mode (`ADR-0027`) holds. A single writer never leaves a torn entry, so `Threads 1` is exact.
3. A2's torn slot is written directly into the buffer. No second thread is needed in this ticket. The multi-writer
   race is ~~`ABC-267`'s~~ `ABC-266` A8's *(2026-11-02, `bapm-P3-page`: `ABC-267` folded into `ABC-266`)*.
4. **The PR lists every row it touches.** The target is none of `ABC-081`, `ABC-122` or `ABC-208`'s (A3).
5. UAT: value-identical and no product surface, so the QE verdict signs it (owner delegation `…5aaf7cec` item 2).
6. *(2026-11-02, `bapm-ABC-265-rows`.)* A2's verified-copy row writes into the buffer like the torn-slot row. Build
   note from the amendment's § Consequences: under TypeScript 5.9, declare the view `Uint32Array<ArrayBufferLike>` or
   `Uint32Array<SharedArrayBuffer>`. The inferred `Uint32Array<ArrayBuffer>` fails the typecheck (TS2322 in the probe).

## Size and priority

- **Size: M**, about 10–20 h (`estimate`, BA/PM's share of `ADR-0057`'s L, 32–65 h for the whole strand). **L** if
  F2's fallback fires (+10–20 h).
- **Priority: P2.** It enables the strand's lever, it is cheap, and it can be pulled beside Phase 2.

## Dependencies

- **Architect/Design:** the `ADR-0025` amendment to decision 2 and decision 4's last bullet (`ADR-0057` § Inputs,
  "its ADR"). **Owner:** OQ-1 named only `ADR-0044` D5, so this amendment changes an accepted ADR and goes to him when
  written. Reading (b): the build may start once it is written. The merge waits on his acceptance. Whether OQ-1
  already covers it is the Orchestrator's call (`arch-owner-answers-1102` `…c0591ef8`, open question 1).
  *(2026-11-02, `bapm-ABC-265-rows`: **written, PROPOSED** (`arch-ABC-265`, merged `c0f3cbad`). The Orchestrator has
  asked the owner to accept or decline it (board, 2026-11-02). His answer gates the merge only.)*
- **Place:** after Phase 2 and R1, before Phase 3; or beside Phase 2 by width. No Phase 2 ticket edits
  `src/transposition.ts` (`ADR-0056` D6's 2026-11-02 line).
- **Shares `src/transposition.ts`** with `ABC-257` (paused) and `ABC-258` / `ABC-237` (parked). Only one at a time.
  Whichever comes after this ticket is written on the shared layout.
- **Instrument:** `se-ABC-253`'s `raw/profile.sh` and `raw/analyse.mts`, under `.grugops/context/se-ABC-253/raw/`.
  Whether they run unchanged on this layout is `UNKNOWN - verify`, settled when A4 is read.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0057` D2.3, D2.4 |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ M; value-identical, so it merges alone; it waits on no other thread ticket |
| 4 | testable, measurable acceptance | ✅ each row is a byte count, a hit or a miss, node equality, a depth or a source fact |
| 5 | dependencies known | ✅ the `ADR-0025` amendment; the owner's acceptance of it; the shared file *(2026-11-02: written, PROPOSED; acceptance gates the merge only)* |
| 6 | NFR triggers with targets | ✅ 4 MiB (4 194 304 B); `G6` ≥ base, floor 6; `G7` ≤ 16 MiB, growth ≤ 1 MiB |
| 7 | test notes | ✅ ~~1–5~~ 1–6 |
| 8 | size | ✅ M (L on F2) |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ~~❌ the `ADR-0025` amendment (decision 2, decision 4's last bullet) is not written~~ ✅ *2026-11-02: the amendment is written, PROPOSED (`arch-ABC-265` `…e396e5ab`); A2 carries T10; A7 carries the no-S2 ruling; reading (b): build may start, merge waits on the owner's acceptance* |

~~**DoR 9/10. Backlog.** It reaches Ready when the Architect writes the `ADR-0025` amendment (reading (b)). The board
move is the Orchestrator's.~~
**DoR 10/10 (re-scored 2026-11-02, `bapm-ABC-265-rows`, reading (b)).** It may leave Backlog for Ready. The build may
start. The merge waits on the owner's acceptance of the `ADR-0025` amendment. The board move is the Orchestrator's.
