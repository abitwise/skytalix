---
subtask: arch-design-ABC-206
role: architect-design
ticket: plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md
ref: .grugops/context/arch-design-ABC-206/
width: 3 of 3 (beside arch-design-ABC-205 and ticket-to-pr-ABC-212)
---

# Design ruling for ABC-206 (faster search, identical answers)

## Do
- Rule the leaf's shape (one move generation per leaf; captures-only generation in quiescence; check detection without playing the move in LMR) and any test-only door or export, so the identity sweep (same move, score, nodes, clock checks) holds. Name the merge-order/conflict plan with ABC-212 (`HARD_CEILING_MS` in `src/engine.ts`) and ABC-205.
- Light probes on a scratch copy only. A NEW ADR or a change to an accepted one is PROPOSED and STOPs to the owner; an NFR-001 leaf-clause change is the owner's too. Dated `## Design ruling` on the page; recommend the next move.

## Fences
- Worktree `../wt-arch-design-ABC-206` from `main`. Only the ABC-206 page, a proposed ADR if needed, your notes. No `src/`, tests, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/design206/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `arch-design-ABC-206`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE: records plus light probes. Branch `grugops/arch-design-ABC-206` @ `03b0bfb8`** (from `main` `f47b3429`;
`61b10d67` page ruling, `adc14e6f` notes, `03b0bfb8` correction). Not pushed and not merged. Worktree
`../wt-arch-design-ABC-206`. The probes ran on a scratch copy of `src/` at `c735577f` (scratchpad `design206/`).

- **Files:**
  - `plans/tickets/ABC-206-…md` § Design ruling (dated 2026-10-24);
  - `.grugops/context/arch-design-ABC-206/notes/` (3 notes) and the rendered index.
- **Not touched:** `src/`, tests, ADRs, the catalog, the board and the trace file.
- **The leaf (i).** `leafEndReason(position): EndReason | null` in `gameend.ts` (`=== gameStatus(p).reason`, with
  no counts map). It is built on `hasLegalMove` in `legal.ts`, which exits at the first legal move. Both `leafScore`s
  read it. There is no `legalMoves` and no `zobristKey` at a leaf.
- **Quiescence (ii).** `legalCaptures` in `legal.ts`: `generateMoves`, then skip quiets, then the same
  make/test/unmake check. It returns the same list, in the same order, as `legalMoves.filter(capture)`.
- **LMR (iii).** `givesCheck` in `legal.ts`: a `FLAG_NONE` move uses a two-byte poke plus `isSquareAttackedBy`; a
  flagged move falls back to make → `isInCheck` → unmake. `lateMoveReduction`'s contract is unchanged (`ADR-0026`
  d6).
- **No test-only door.** No new export in `search.ts` or `engine.ts`. `gameStatus`, `legalMoves`, `quiesce`'s
  signature, `moves.ts`, `perft.ts` and `evaluate.ts` are byte-identical. **No ADR.**
- **Identity.** It holds by construction: the same tree, the same nodes, the same clock reads. `A1` keeps nodes.
  - **Probe `A1` shape:** 2 920 rows byte-identical (shipped `chooseMove` with LMR on, the door, and `search`
    d1–3).
  - **Probe `A2` at depth 3:** 285 074 positions and 11.1M moves, 0 mismatches.
  - **Lane on the prototype:** 229/229.
  - **Timing:** indicative only (load1 about 8.7). The branch ran at about 0.4–0.55× base at an equal node count.
- **Tests.**
  - `A2` rows go in `legal.test.ts` and `gameend.test.ts`: depth 1 in the lane, depth 3 behind `ENGINE_DEEP=1`.
  - The spied count guards all go in `gameend.nfr.test.ts`.
  - `A1` is a review-time two-tree differential against the **merge base**, run at each of the 3 piece commits.
    No golden file.
- **Merge order: `ABC-212` → `ABC-206` → `ABC-205`.**
  - The only shared `src` file is `engine.ts` with 212, in disjoint hunks (`:129` against `:75` and `:238–249`).
  - This ticket's tests stay out of `engine.test.ts` and out of the five files ABC-205 re-pins.
  - If `main` moves: merge it in (no rebase), re-run `A1` against the new base, and take `G1`'s baseline from that
    base.
  - Timing readings run at width 1, never beside 212's `A4` or 205's `A5`.
- **Owner:** `OD-206-1`, a reading of `ADR-0003` clause 1 as the make/test/unmake strategy rather than a byte freeze
  of `legal.ts`.
  - Precedent: `ADR-0005` d2. Counter-reading: `ADR-0020`.
  - Report it as INFO with the veto open. It is not a gate.
  - **Veto fallback:** drop (ii) and (iii), and build (i) as a single `legalMoves` at the leaf.
- **NFR:**
  - `NFR-001`: no bound moves. The "every search leaf calls" text goes stale, and Security/NFR records a dated note.
  - `NFR-004`: clock reads are equal.
  - `NFR-005`: expected up.
  - `NFR-008`: no new file.
- **STOP:** none.
- **Next move (Orchestrator):**
  - merge this records branch;
  - report `OD-206-1` to the owner as INFO;
  - move ABC-206 `In Design` → `Ready for Dev`;
  - queue `ticket-to-pr-ABC-206` (SE, three commits).
  - QE at the gate: `A1`, `A4` at width 1 (n ≥ 7), `G6`, `G1`, perft, and `A6` after `ABC-204`.
- **Notes:** `20261023T220816Z-architect-design-observation-cf395b1e`,
  `20261023T220816Z-architect-design-decision-e3ff760b` and `20261023T220929Z-architect-design-decision-90b06dec`
  (the correction). Sealed by grugops 2.1.0 `appendNote` with the worktree's context root. Each validated, and the
  index was rendered.

### Trace row (10 cells, header order)

| ABC-206 (arch design) | Architect/Design: faster-search design ruled. Leaf via `leafEndReason` + `hasLegalMove` (no `legalMoves` at a leaf); `legalCaptures` in quiescence (same list, same order); `givesCheck` in LMR (poke + `isSquareAttackedBy`, make fallback for flagged moves); no door, no ADR; `OD-206-1` (`ADR-0003` cl. 1 reading) to the owner as INFO; merge order 212 → 206 → 205 | EPIC-008 | ADR-0003, ADR-0005, ADR-0020, ADR-0026, ADR-0002, ADR-0027, ABC-078, ABC-077, ABC-212, ABC-205, ABC-204 | NFR-001 (no bound move; stale-text note owed to Security/NFR), NFR-004 (clock reads equal), NFR-005 (expected up), NFR-008 (no new file) | `grugops/arch-design-ABC-206` @ `03b0bfb8` (records only)<br>`plans/tickets/ABC-206-…md` § Design ruling<br>`.grugops/context/arch-design-ABC-206/notes/` (…cf395b1e, …e3ff760b, …90b06dec) | records only; scratch-copy probes at c735577f (A1 shape 2 920 rows identical; A2 depth 3, 285 074 positions / 11.1M moves, 0 mismatches; 10 lane files 229/229; timing indicative only) | — | — | DONE; OD-206-1 INFO to the owner; merge is the Orchestrator's |
