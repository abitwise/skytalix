# NFR Catalog
_Updated: 2026-07-24 by Architect/Design (seeded NFR-001..NFR-007 from the epics' stated targets)_

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
| NFR-001 | Performance | Move generation throughput **≥ 1,000,000 nodes/sec** on perft, current-gen laptop | Legal move generator — the search hot path (EPIC-001) | `npm run perft` nodes/sec (ABC-006). **MET** 2026-07-24: ~6.2M raw perft; ABC-008 metric B ~2.64M search-shaped (M3) — see machine caveat below |
| NFR-002 | Performance | Full board redraw completes in **< 16 ms** (never a perceptible stall) | Terminal renderer (EPIC-002) | `UNKNOWN - verify` — not built yet; verify by render benchmark over known FENs |
| NFR-003 | Performance | Keystroke echo **< 50 ms**; `moves` command and tab-completion **< 100 ms** | Input prompt and controls (EPIC-003) | `UNKNOWN - verify` — not built yet; verify by input-latency measurement at the prompt |
| NFR-004 | Performance | Engine returns a move in **≤ 3 s** at default difficulty; **hard ceiling 5 s** at any difficulty | Engine move search (EPIC-004) | `UNKNOWN - verify` — not built yet; verify by wall-clock over a fixed position suite. Depends on NFR-005 |
| NFR-005 | Performance | Search throughput **≥ 500,000 nodes/sec** with evaluation running | Engine search loop (EPIC-004) | ABC-008 spike metric B = **2,639,455 nodes/sec** on Apple M3 — above target with ~5x headroom, but **GO WITH CONSTRAINT** (see below) |
| NFR-006 | Cost | Compiled opening book stays **≤ 1 MB** (no published-package bloat) | Opening book artifact (EPIC-005) | `UNKNOWN - verify` — not built yet; verify by compiled artifact size check at build |
| NFR-007 | Performance | `npx` invocation to first rendered board in **< 2 s** with a warm npm cache | CLI cold start / packaging (EPIC-006) | `UNKNOWN - verify` — not built yet; verify by timed `npx` end-to-end run |

## Notes on the measured rows (NFR-001, NFR-005)

Seeded 2026-07-24. Every target above is transcribed from its epic's stated `NFR triggers`
block — no number here was invented by the Architect. Five of the seven rows read
`UNKNOWN - verify` honestly: their epics are not built yet, so there is nothing to measure.

**Do not read the raw perft figure as engine throughput.** ABC-008 recorded the trap
explicitly: classic perft counts leaf nodes that return without generating or evaluating
anything (~96% of nodes), so a naive rate reads ~43M nodes/sec — roughly 16x inflated.
The honest engine-facing figure is the search-shaped metric B (~2.64M nodes/sec). NFR-001's
~6.2M is a valid *generation* measurement; it is not a promise about search.

**NFR-005 carries a constraint, not a clean pass (RISK-002 = GO WITH CONSTRAINT).** The 5x
headroom was measured on an Apple M3. Compounding the plausible penalties — roughly 3x for
real legality filtering and special moves, roughly 3x for slower hardware — puts a worst-case
machine near ~300k nodes/sec, which is **below** the 500k target. Therefore EPIC-004's
per-move budget **must be time-based (iterative deepening against a wall clock), not
depth-based**: a fixed depth would blow NFR-004's 3-second ceiling on exactly the machines
least able to absorb it. This is inherited by EPIC-004 as non-negotiable, not a nice-to-have.

**Not covered here.** Throughput is necessary for the ~1400-1700 Elo strength target, not
sufficient — Elo comes from evaluation quality and move ordering too. RISK-003 (strength is
hard to verify without a reference opponent) is untouched and remains open.
