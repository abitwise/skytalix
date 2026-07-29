# NFR Catalog
_Updated: 2026-07-29 by Architect/Design (corrected NFR-005 against measurement; fenced NFR-001's denominator; NFR-003 partly verifiable. Seeded 2026-07-24.)_

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
| NFR-002 | Performance | Full board redraw completes in **< 16 ms** (never a perceptible stall) | Terminal renderer (EPIC-002) | `UNKNOWN - verify` — not built yet; verify by render benchmark over known FENs |
| NFR-003 | Performance | Keystroke echo **< 50 ms**; `moves` command and tab-completion **< 100 ms** | Input prompt and controls (EPIC-003) | **Partly verifiable — NOT passed.** Compute half measured 2026-07-29: the `moves` command's `legalMoves()` costs 2.1–5.3 µs, ~19,000–47,000x under the 100 ms budget, so compute is not the risk. Keystroke echo and terminal I/O are the other half and stay `UNKNOWN - verify` — no prompt exists; verify by input-latency measurement once EPIC-003 is built |
| NFR-004 | Performance | Engine returns a move in **≤ 3 s** at default difficulty; **hard ceiling 5 s** at any difficulty | Engine move search (EPIC-004) | `UNKNOWN - verify` — not built yet; verify by wall-clock over a fixed position suite. Depends on NFR-005 |
| NFR-005 | Performance | Search throughput **≥ 500,000 nodes/sec** with evaluation running | Engine search loop (EPIC-004) | **MISSED as measured 2026-07-29 — 163k–351k nodes/sec, with no evaluation running at all** (ABC-008 metric B re-run against the merged generator, M3). Historical proxy: the ABC-008 spike's **2,639,455 nodes/sec**, a throwaway benchmark **without legality filtering**, 7.5x–16x above the real generator. **GO WITH CONSTRAINT stands; the "~5x headroom" is WITHDRAWN** (see below) |
| NFR-006 | Cost | Compiled opening book stays **≤ 1 MB** (no published-package bloat) | Opening book artifact (EPIC-005) | `UNKNOWN - verify` — not built yet; verify by compiled artifact size check at build |
| NFR-007 | Performance | `npx` invocation to first rendered board in **< 2 s** with a warm npm cache | CLI cold start / packaging (EPIC-006) | `UNKNOWN - verify` — not built yet; verify by timed `npx` end-to-end run |

## Notes on the measured rows (NFR-001, NFR-003, NFR-005)

Seeded 2026-07-24. Every target above is transcribed from its epic's stated `NFR triggers`
block — no number here was invented by the Architect. Five of the seven rows were seeded
`UNKNOWN - verify` honestly: their epics were not built yet, so there was nothing to measure.
The 2026-07-29 architecture audit changed three of them: NFR-001 re-measured and still met,
NFR-003 became half-measurable, and NFR-005 became measurable and is missed.

**Do not read the raw perft figure as engine throughput — NFR-001 and NFR-005 count different
denominators.** Classic perft counts leaf nodes that return without generating or evaluating
anything; ABC-008 estimated that at ~96% and it measured 2026-07-29 at **97.3%** of the nodes
`npm run perft` counts. Strip those free leaves out and the same CPU-seconds yield ~167k
generating nodes/sec. So NFR-001's ~6.1M is a valid *generation-with-free-leaves* measurement
and **NFR-001 is genuinely MET, ~6x over target** — it is simply not a promise about search,
and it must never be quoted as evidence for NFR-005.

**CORRECTED 2026-07-29 — NFR-005's "~5x headroom" is withdrawn. The constraint is not.**
The seeded row read ABC-008 metric B = **2,639,455 nodes/sec** as "above target with ~5x
headroom". That figure stands above as history and is real, but it measured a **throwaway
spike benchmark with no legality filtering** — a proxy for the engine, not a measurement of
it. Re-running the spike's own metric-B definition against the **merged** generator gives
**163k–351k nodes/sec**: 7.5x–16x below the proxy, below the 500k target, and measured with
**no evaluation, move ordering, transposition table or quiescence running at all**. NFR-005
asks for 500k *with* evaluation; the code is below 500k *before* evaluation exists — a
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
  That decision is **open and unmade** — `src/legal.ts` defers it to "the EPIC-004 spike", and
  it is now due.

**Definitions behind the two numbers, so they are not confused again.**

- NFR-001 `6.04M–6.21M/sec` — `npm run perft`: classic perft, a depth-0 leaf returns 1 without
  generating. Five runs, Apple M3, Node v24.12.0, darwin/arm64.
- NFR-005 `163k–351k/sec` — ABC-008 **metric B**: a recursive make/unmake walk in which
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
