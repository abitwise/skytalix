# NFR Catalog
_Updated: 2026-07-30 by Architect/Design (NFR-002 made verifiable during EPIC-002's decomposition — **target unchanged at < 16 ms**; what changed is that the row now names what is in a frame, names the ply-count denominator the SAN history panel makes load-bearing, splits compute from terminal write, and records the measured compute half with its machine. See the NFR-002 section below. Earlier the same day: NFR-005 rewritten to the depth-in-budget target ratified in ADR-0003 clause 2 **as amended** by Olger Oeselg on 2026-07-30 — named positions, floor 6 FAIL / target 7 WARN, depth 7 provisional pending EPIC-004's non-M3 spike; node rate demoted to a diagnostic. NFR-001 and NFR-003 untouched. Previously 2026-07-29: corrected NFR-005 against measurement; fenced NFR-001's denominator; NFR-003 partly verifiable. Seeded 2026-07-24.)_

<!--
  FORMAT — read before you append. (clear voice; this is a technical file, not a role prompt.)

  This is the single list of non-functional targets (SLOs and quality bars) for grugops.
  It ships EMPTY: header + separator only, zero data rows.

  Ownership: Architect/Design seeds it; Security/NFR checks against it; Release Manager
  attaches evidence. Tickets reference NFR IDs in their traceability row; Security/NFR fails
  a gate if a touched flow violates a referenced target. Keep targets few and real.

  NFR IDs follow the stable scheme: NFR-xxx (see plans/traceability.md for the full ID scheme).

  Example row shape (this is a comment, NOT a live table row — illustrates the format only):

    | NFR-001 | Performance | p95 API < 300ms | all read endpoints | load test / QE |

  Categories to consider: performance, scalability, availability, reliability/DR, security,
  privacy/compliance, accessibility, observability, maintainability, portability, i18n/l10n, cost.
-->

| ID | Category | Target | Applies to | Verified by |
|----|----------|--------|------------|-------------|
| NFR-001 | Performance | Move generation throughput **≥ 1,000,000 nodes/sec** on perft, current-gen laptop | Legal move generator — the search hot path (EPIC-001) | `npm run perft` nodes/sec (ABC-006). **MET** — re-measured 2026-07-29 at 6.04M–6.21M over five runs (M3, Node v24.12.0); the earlier `~6.2M` was the top of that range. **Denominator fence: 97.3% of the nodes this counts are free leaves**, so it measures generation-with-free-leaves and is **never** evidence for NFR-005 — see below |
| NFR-002 | Performance | Full board redraw completes in **< 16 ms** (never a perceptible stall). **Target unchanged** — transcribed from EPIC-002, 2026-07-24 | **One full frame** of the terminal renderer (EPIC-002): board + rank/file labels + status panel + the SAN move-history panel. **The frame is a function of GAME LENGTH, not only of position** — the history panel is O(plies) — so a frame measurement that does not state its ply count is not comparable to another one | **Still not built, but now testable — the denominator is named.** Measure the two halves separately, each carrying its ply count and its machine: **(a) frame COMPUTE** — replay + `toSan` per rendered ply + `gameStatus` + the board scan, at ply counts **40 / 120 / 300** on a game from `startpos`, board half over the standing FENs in `src/perft.test.ts`; **(b) frame WRITE** — the same frame serialized and written to a non-TTY sink, which is `UNKNOWN - verify` and is the half nobody has measured. Compute half measured 2026-07-30 on M3 / Node v24.12.0 / darwin-arm64 (SAN history derive only — no renderer exists): **171–176 µs @ 40 plies, 517–533 µs @ 120, 1,272–1,318 µs @ 300** = **1.1% / 3.3% / 8.2%** of the 16 ms budget, two runs. Board, status panel and terminal I/O are **unmeasured**. Design behind the shape: ADR-0002 clause 2 (derive, don't maintain) and ADR-0004 (**proposed** — SAN derived per frame, not cached) |
| NFR-003 | Performance | Keystroke echo **< 50 ms**; `moves` command and tab-completion **< 100 ms** | Input prompt and controls (EPIC-003) | **Partly verifiable — NOT passed.** Compute half measured 2026-07-29: the `moves` command's `legalMoves()` costs 2.1–5.3 µs, ~19,000–47,000x under the 100 ms budget, so compute is not the risk. Keystroke echo and terminal I/O are the other half and stay `UNKNOWN - verify` — no prompt exists; verify by input-latency measurement once EPIC-003 is built |
| NFR-004 | Performance | Engine returns a move in **≤ 3 s** at default difficulty; **hard ceiling 5 s** at any difficulty | Engine move search (EPIC-004) | `UNKNOWN - verify` — not built yet; verify by wall-clock over a fixed position suite. Depends on NFR-005 |
| NFR-005 | Performance | **Depth-in-budget on the standing benchmark positions `kiwipete` and `position-6`** — at default difficulty the search completes **≥ depth 6** within the 3 s budget and never exceeds the 5 s ceiling (**below depth 6 = FAIL**), and reaches **depth 7** within that same 3 s budget (**below depth 7 = WARN**; the depth-7 level is **PROVISIONAL** pending non-M3 measurement). Node rate is a **diagnostic, not the target** | Engine search loop (EPIC-004) | **Target ratified in ADR-0003 clause 2 AS AMENDED by Olger Oeselg on 2026-07-30** — amendments: named positions / two levels / provisional depth 7. Depth-in-budget on target hardware is `UNKNOWN - verify`, and **the provisional obligation has a home: EPIC-004's own timeboxed spike (RISK-002's mitigation) measures depth-in-budget on non-M3 target hardware, and that spike is the verification that LIFTS the PROVISIONAL marker from the depth-7 level.** Until it reports, a depth-7 miss on slower hardware may be the machine rather than a regression. Measured 2026-07-30 on M3 / Node v24.12.0 / darwin-arm64 (ADR-0003; alpha-beta-shaped model at EBF 6, leaves evaluated not generated): `kiwipete` reaches **depth 7 in 0.39–0.68 s** and depth 8 inside the 5 s ceiling at leaf-eval costs 134 ns–1,097 ns; `position-6` reaches **depth 7 in 0.644 s** at 1,097 ns — both levels clear on this machine. **Node rate DEMOTED to a diagnostic (not deleted), each figure carrying its node definition, position and machine:** **163k–351k/sec** — ABC-008 metric B (every node, leaves included, calls `legalMoves()`), kiwipete d3/d4 + startpos d4, M3, 2026-07-29; **207k/sec kiwipete, 546k/sec startpos** — same metric B by the reciprocal of one `legalMoves` call, M3, 2026-07-30; historical proxy **2,639,455/sec** — the ABC-008 spike, **no legality filtering at all**, M3: a proxy for the engine, never a measurement of it. **The old ≥ 500,000 nodes/sec target is RETIRED** as underived and untestable — the same merged code measures 207k–6.1M/sec on the node definition alone |
| NFR-006 | Cost | Compiled opening book stays **≤ 1 MB** (no published-package bloat) | Opening book artifact (EPIC-005) | `UNKNOWN - verify` — not built yet; verify by compiled artifact size check at build |
| NFR-007 | Performance | `npx` invocation to first rendered board in **< 2 s** with a warm npm cache | CLI cold start / packaging (EPIC-006) | `UNKNOWN - verify` — not built yet; verify by timed `npx` end-to-end run |

## NFR-002 — what a "full board redraw" is, and why the ply count is its denominator

_Added 2026-07-30 by Architect/Design during EPIC-002's decomposition. **The < 16 ms target did not
change** — it is still the number EPIC-002 states. What changed is that the row now says what is
being measured, so it can be failed._

The row was seeded honestly as `UNKNOWN - verify` on 2026-07-24 with "verify by render benchmark
over known FENs". That instruction is not sufficient, for the same reason NFR-005's
"in a middlegame position" was not: **a frame's cost is not a function of the position alone.**
EPIC-002's frame includes a two-column SAN move-history panel, and the design that serves it
(ADR-0002 clause 2, ratified: the move list is the authority and everything else is derived by
replay) makes that panel **O(plies)** while the budget stays fixed at 16 ms. A benchmark over known
FENs at ply 0 would measure the cheapest frame the game ever draws and would still read green after
the panel had eaten the budget at move 60.

So the row names three things it did not name before:

- **What is in the frame.** Board + labels + status panel + move-history panel. If the renderer
  ships something else in a frame, this row is what it must be re-measured against.
- **The ply counts.** **40 / 120 / 300** — an opening, a typical complete game, and a long one. The
  same three on every re-measurement, or the numbers are not comparable.
- **The two halves.** Compute and terminal write. Only compute can be measured before a renderer
  exists; the write half is `UNKNOWN - verify` and is named so it cannot be quietly forgotten — the
  same split NFR-003 already carries for keystroke echo.

**What is measured today, and what it is not.** 171–176 µs / 517–533 µs / 1,272–1,318 µs at
40 / 120 / 300 plies is the **SAN move-history derive alone**: replay the move list from the initial
FEN and format every ply, which costs one `legalMoves` call per ply (~97% of it) plus ~100 ns of
string work. Two runs, Apple M3, Node v24.12.0, darwin/arm64, read-only harness outside the repo
against merged `src/`. **It is not a frame measurement** — no renderer exists, and the board scan,
the status panel and every byte written to the terminal are not in it. It is a lower bound on the
frame, and it is the largest item known to be in it. `UNKNOWN - verify` on any other hardware.

## Notes on the measured rows (NFR-001, NFR-003, NFR-005)

Seeded 2026-07-24. Every target above is transcribed from its epic's stated `NFR triggers`
block — no number here was invented by the Architect. Five of the seven rows were seeded
`UNKNOWN - verify` honestly: their epics were not built yet, so there was nothing to measure.
The 2026-07-29 architecture audit changed three of them: NFR-001 re-measured and still met,
NFR-003 became half-measurable, and NFR-005 became measurable and was missed against the
≥ 500,000 nodes/sec target that a human retired on 2026-07-30 (see the ratification block below).

**Do not read the raw perft figure as engine throughput — NFR-001 and NFR-005 count different
denominators.** Classic perft counts leaf nodes that return without generating or evaluating
anything; ABC-008 estimated that at ~96% and it measured 2026-07-29 at **97.3%** of the nodes
`npm run perft` counts. Strip those free leaves out and the same CPU-seconds yield ~167k
generating nodes/sec. So NFR-001's ~6.1M is a valid *generation-with-free-leaves* measurement
and **NFR-001 is genuinely MET, ~6x over target** — it is simply not a promise about search,
and it must never be quoted as evidence for NFR-005.

**CORRECTED 2026-07-29 — NFR-005's "~5x headroom" is withdrawn. The constraint is not.**
*(Kept as history. Its measurements and its withdrawal stand; only the ≥ 500k **target** they were
measured against was retired on 2026-07-30 — see the ratification block below.)*
The seeded row read ABC-008 metric B = **2,639,455 nodes/sec** as "above target with ~5x
headroom". That figure stands above as history and is real, but it measured a **throwaway
spike benchmark with no legality filtering** — a proxy for the engine, not a measurement of
it. Re-running the spike's own metric-B definition against the **merged** generator gives
**163k–351k nodes/sec**: 7.5x–16x below the proxy, below the 500k target, and measured with
**no evaluation, move ordering, transposition table or quiescence running at all**. NFR-005 *then*
asked for 500k *with* evaluation; the code was below 500k *before* evaluation exists — a
**1.4x–3.1x shortfall**, not a margin.

- **Survives:** **RISK-002 = GO WITH CONSTRAINT**, and EPIC-004's per-move budget **must be
  time-based (iterative deepening against a wall clock), not depth-based** — a fixed depth
  would blow NFR-004's 3-second ceiling on exactly the machines least able to absorb it.
  Inherited by EPIC-004 as non-negotiable. The measurement **strengthens** this: the
  worst-case-slow-machine scenario the constraint hedged against has arrived on the fast
  machine.
- **Withdrawn:** the "~5x headroom" clause and the arithmetic under it (~3x for real legality
  filtering, ~3x for slower hardware, landing near ~300k). The first factor is measured at
  7.5x–16x, not 3x; the second is still unvalidated.
- **Why pruning does not close the gap.** ABC-008 netted "no alpha-beta, no TT, no move
  ordering" against its other biases as if it bought back a large multiple. For a **rate**
  metric it does not: pruning, a transposition table and move ordering reduce the **number of
  nodes needed** to reach a depth, they do not make a node cheaper — every node still pays
  generation. That is real relief for **NFR-004** (wall clock to a move) and close to none for
  **NFR-005** (nodes/sec). About 71% of per-node cost is the make/test/unmake legality filter
  in `src/legal.ts`, so closing this gap means changing how legality is decided, not tuning.
  That decision was **open and unmade** on 2026-07-29 — `src/legal.ts` deferred it to "the EPIC-004
  spike". It is now **taken**: `ADR-0003`, ratified 2026-07-30, keeps make/test/unmake and changes
  the target instead, with an ordered menu of speedups and a named trigger if the depth floor is
  ever missed.

**RATIFIED 2026-07-30 — the target is depth-in-budget on named positions; the node rate is a
diagnostic.** `memory-bank/50-decisions/ADR-0003-legality-strategy.md` was ratified by **Olger
Oeselg** on 2026-07-30. Clause 1 (keep make/test/unmake — no code change) and clause 3 (named
trigger plus an ordered menu of speedups, authorizing none) were accepted as proposed; **clause 2 was
accepted only as amended**. The row above is written to the amended clause 2, not to the draft.

- **Why the ≥ 500k target went.** It came from the ABC-008 spike, which ran **no legality filtering
  at all**, so it never measured this code. And "nodes/sec" is undefined until you say what a node
  does: the same merged code measures **207k/sec** (metric B, kiwipete) to **~6.1M/sec** (classic
  perft) — a **30x spread with no code change** — and under metric B startpos passes 500k while
  kiwipete does not. A target a *position* can pass or fail with no code changing is not testable.
- **Why depth instead of rate.** NFR-004 is the real requirement, and RISK-002 already binds
  EPIC-004 to time-based iterative deepening, which returns the best move found so far when the
  clock runs out — so the 3 s budget **cannot** be blown by a slow node rate. The rate buys
  **depth** (strength), not latency. Derived the other way (EBF 6, ID overhead 1.2x, quiescence
  2.5x, 3 s budget): depth 6 needs **~47k/sec**, depth 7 **~280k/sec**, depth 8 **~1.68M/sec**.
- **Amendment (2a) — the positions are named.** The draft target said "in a middlegame position",
  which is the same vagueness this whole correction exists to remove. `kiwipete` and `position-6` are
  the standing benchmark set — the positions ADR-0003 measured, both already carrying published perft
  counts in `src/perft.test.ts`. Re-measure on those two, or the numbers are not comparable.
- **Amendment (2b) — two levels, floor 6 FAIL / target 7 WARN.** Depth 6 needs only ~47k/sec against
  a measured 207k–546k, so a depth-6-only gate would still read green after a **4x regression**.
  Depth 7 (~280k/sec) is where the code actually sits, so that is the level which detects one. The
  floor is the FAIL because NFR-004's promise and the 1400–1700 strength target rest on it; depth 7
  is a WARN because missing it means materially slower without a broken promise yet.
- **Amendment (2c) — the depth-7 level is PROVISIONAL; the depth-6 floor is not.** Every number is
  one machine, one Node version, and the spike's 2–3x slower-hardware factor has never been
  validated on a non-M3 machine — the largest single unknown. A 3x slower machine still clears depth
  6 by ~1.5x and loses **precisely depth 7**. EPIC-004's own spike on target hardware is the named
  verification that lifts the marker; it is recorded in the row's `Verified by` so it cannot be lost.
- **Unchanged by the ratification.** **RISK-002 = GO WITH CONSTRAINT** and time-based iterative
  deepening stay non-negotiable for EPIC-004. The NFR-001 denominator fence stands. Pruning still
  does not make a node cheaper. And EPIC-004's puzzle suite and self-play ladder remain the only real
  verdict on strength — depth-in-budget is a leading indicator, not proof of strength.

**Definitions behind the two numbers, so they are not confused again.**

- NFR-001 `6.04M–6.21M/sec` — `npm run perft`: classic perft, a depth-0 leaf returns 1 without
  generating. Five runs, Apple M3, Node v24.12.0, darwin/arm64.
- NFR-005 **diagnostic** `163k–351k/sec` — ABC-008 **metric B**: a recursive make/unmake walk in which
  **every** node, leaves included, calls `legalMoves()`. Measured 2026-07-29 at 163,042/sec
  (kiwipete d3), 186,843/sec (kiwipete d4), 346,449/sec (startpos d4); reached independently
  by two agents on the same day, once by this walk and once by microbenchmarking `legalMoves`
  (≈189k/sec at kiwipete). The probes ran read-only outside the repo against merged `src/` and
  are not repo artifacts.
- Both are **one machine, one Node version**. `UNKNOWN - verify` on any other hardware — the
  spike's 2–3x slower-hardware factor has never been validated against a non-M3 machine.

**Not covered here.** Throughput is necessary for the ~1400-1700 Elo strength target, not
sufficient — Elo comes from evaluation quality and move ordering too. RISK-003 (strength is
hard to verify without a reference opponent) is untouched and remains open.
