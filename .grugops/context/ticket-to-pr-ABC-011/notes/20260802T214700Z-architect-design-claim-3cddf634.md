---
id: 20260802T214700Z-architect-design-claim-3cddf634
kind: claim
by: architect-design
at: 2026-08-02T21:47:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - EPIC-004
  - NFR-005
  - memory-bank/50-decisions/ADR-0005-en-passant-availability-and-the-hash-layer.md
  - plans/nfr-catalog.md
supersedes: 
---

# What this design hop could NOT settle — five items, none of them blocking

Recorded as a `claim` at `confidence: UNKNOWN - verify` because none of them is gate-adjudicable here
and none is load-bearing for the ruling. There is no §14 gate on this install, so no `finding` is
admissible on this task and none was written; nothing below is self-stamped.

**1. Every figure is one machine.** Apple M3, Node v24.12.0, darwin/arm64. The 1.014–1.022x amortized
cost, the 1.45–1.48x worst-case per-call shape and the +2.3 B/call allocation are all
`UNKNOWN - verify` on any other hardware, exactly as `NFR-005`'s depth-7 level and `NFR-001`'s µs
figures already are. **The machine-independent quantity is the ratio to the merged tree measured in
the same process**, which is what the tables report; the absolute nanoseconds are not the claim.
Owner: `EPIC-004`'s non-M3 spike, which already carries the same obligation for `NFR-005`.

**2. The ep-square frequency in a real search is not the frequency I measured.** The 120,000-node
pool is a full legal-move enumeration of the perft table, where 6.42% of nodes carry an ep square and
2.07% have a pseudo-legal ep capture. An alpha-beta search with move ordering, quiescence and
transposition cutoffs visits a different distribution — plausibly more captures and therefore more
pawn tension, plausibly fewer quiet double pushes. The amortized 1.4–2.2% is honest for the
population it was measured on and is **not** a prediction about `EPIC-004`'s search. It is the best
available number today because no search exists.

**3. The divergence population is dominated by one pathological position.** 861 of the 862 board-only
misses come from `position-3`, which exists in the perft suite precisely to exercise en-passant
discovered check. The FIDE-correctness argument for the strict reading does **not** rest on that
frequency — it rests on the Laws text and on the ticket's own `## Scope` — but anyone quoting "862"
as a game frequency would be misusing it. How often the divergent shape occurs in real play is
`UNKNOWN - verify` and no number for it was invented.

**4. Whether the strict predicate's geometry can drift from `generateMoves`.** It re-derives the two
candidate pawn from-squares rather than calling the generator, and it agreed with `generateMoves` and
with `legalMoves` on 0 of 81,397 ep-set nodes. That is strong evidence, not proof: a future change to
`src/moves.ts`'s pawn geometry could desynchronise the two, and only the property test named in the
ruling would catch it. The test is the guard; without it this duplication is unowned. Flagged for QE
and for the Security/NFR gate rather than left implicit.

**5. Whether `ADR-0005` should have been written at all.** It is `proposed` and no agent may accept
it. A defensible alternative reading is that the ticket's `### ANSWERED` block plus the decision note
already record the "why" and that a fifth ADR is gold-plating against this role's own "keep design
just enough" limit. The judgment made was that a recorded module-graph invariant becoming false is
ADR-shaped and a ticket is not where a maintainer looks for the module graph. A human may reject it
without touching the ruling — the ruling's authority is the ticket's own delegation, not the ADR.
