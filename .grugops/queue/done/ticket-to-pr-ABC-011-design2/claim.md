---
task: ticket-to-pr-ABC-011
subtask: architect-abc011-defect-definition-and-ratify
role: architect-design
claimed_at: 2026-08-03T13:10:00Z
claimed_by: architect-design
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has no `scripts/` directory at all — no `scripts/claim.js`, so
Workflow 17 step 2's atomic `mkdirSync` claim primitive could not be executed and nothing here
provides exclusivity. Queue width is 1 and no contention is possible, so the claim is degenerate.
Recorded rather than glossed, exactly as the queued subtask instructed and as all five prior
subtasks on this project recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is
likewise absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-011/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off` so no `human:<name>` stamp is available either. Nothing is
self-stamped.** The kinds used are `decision`, `observation`, `claim` and `artifact-ref`.

The `ref:` context folder was read BEFORE any work was done: all fifteen prior notes under
`.grugops/context/ticket-to-pr-ABC-011/notes/` — including this role's OWN four notes from the
first design hop, which were re-read rather than remembered, because that hop's trajectory is gone.
The retained FIDE source under `.grugops/context/refinement-fide-9-6-1/sources/` was read for the
castling question, its sha256 re-verified against the fetch manifest, and the 9.2.3.2 sentence
re-extracted from the retained HTML rather than quoted from the derived text file alone.

This is the SECOND design hop on `ABC-011`, the first in this project's history. It rules; it does
not implement. **No production file under `src/` is changed by this hop.**

---
completed_at: 2026-08-03T13:50:00Z
outcome: RULED — all three things owed are settled, and the third carried new authority rather than
  a new question.
  (1) THE DEFINITION QUESTION: purity is UNCONDITIONAL and is bought with a PRECONDITION on the probe
  move, not with a change to what the predicate means; the answer stays domain-restricted and is
  SPECIFIED (`false`, touching nothing) where the board contradicts the ep square, because the ruled
  oracle is demonstrably unsound there. TWO GUARDS, NOT ONE — the captured-pawn guard buys purity and
  closes a FOURTH reproduction no prior role had (`4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1`, which the guard
  Security/NFR sketched does NOT catch); the empty-target guard buys oracle agreement and is needed
  only for two PURE divergences constructed at this hop (`4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1` and
  its mirror), where the shipped predicate is byte-pure and still answers `true` against the oracle's
  `false`. Re-derived on a fourth independently written script: 518,474 nodes / 81,397 ep-set —
  reproducing three prior hops TO THE NUMBER — with 0 answers changed, 0 keys changed and 0 guard
  firings on the reachable population; 193/193 green in a sandbox with `tsc` exit 0 and NO EXISTING
  TEST EDITED. Six probe FENs specified and EACH PROVEN TO FAIL (10 of 14 assertions fail against
  shipped, exactly 2 against guard-(a)-removed, exactly 6 against guard-(b)-removed); a seventh
  boundary FEN is named as killing NOTHING rather than counted as coverage.
  (2) THE CASTLING FOLLOW-ON: castling is NOT the same case — `zobristKey` keeps hashing castling
  RIGHTS. Answered from the retained FIDE text with its sha256 AND ITS CURRENCY both re-verified that
  day (fresh fetch byte-identical to the retained copy; the handbook index still publishes only
  E012014/2017/2018/2023; E012024/25/26 return the same soft-404 shell as a nonsense chapter id).
  Ruled in ADR-0006 on three grounds — the capability/entitlement mood difference and 9.2.3.2's
  exclusive "lost only after the king or rook is moved" sentence (present in all four editions); the
  DETERMINACY argument verified against this codebase (`addCastlingMoves` reads only `castling`,
  `board` and the side to move, so given the placement, availability carries no information the
  rights bit does not — which was never true of the ep square); and the residual over-discrimination,
  reproduced on four pairs and in the SAFE error direction. Also checked exhaustively: 368,344 nodes
  carry a castling right and ZERO are stale.
  (3) RATIFICATION: ADR-0005 ACCEPTED **with an amendment** — one of its statements was FALSE as
  written, so it gained Decision clause 6 (the precondition, decided but not yet built), a scope bound
  to en passant, a corrected Consequences paragraph and a six-row falsifier table. ADR-0006 NEW and
  ACCEPTED, deliberately SEPARATE rather than a sixth clause, with the honest counter-argument against
  its existence recorded in its own Status section. Both carry per-clause falsifier tables, as the
  delegation requires.
  COST: zero on the no-ep path and at both NFR-005 anchors (structural); +0.9 to +3.0 ns per call on
  the 15.70% of nodes carrying an ep square = <= +0.5 ns amortized per node, under 0.15% of a ~317 ns
  key; 20-27x CHEAPER on the invalid class. Two whole-key runs bracket 1.0 from both sides, so that
  instrument cannot resolve the delta and no number is claimed from it. NO NFR-005 bar and NO catalog
  target moved; Security/NFR re-gates after the fix and owns the verdict.
  SCOPE: no production code changed; no acceptance criterion, reproduction FEN, NFR-005 bar or
  `## Out of scope` line re-opened or edited; the first `### ANSWERED` block untouched and a second,
  DATED one added beside it. Size stays M and no re-size is owed. ONE ITEM ROUTED TO BA/PM rather than
  cut: `generateMoves` offers an en-passant capture onto a square occupied by the MOVER'S OWN piece
  (verified on two FENs) — a generator defect on the invalid-FEN class, sibling of ABC-009.
  Board: In Design 1/2 -> 0/2, Ready for Dev 0/6 -> 1/6; no limit approached, no override taken.
  IN DEVELOPMENT DELIBERATELY NOT ENTERED — that pull is the Orchestrator's. NO PR — this repo has no
  git remote. NOTHING MERGED, NOTHING DEPLOYED — a human holds both.
moved: pending/ -> claimed/ticket-to-pr-ABC-011-design2/ -> done/ticket-to-pr-ABC-011-design2/ — ALL
  BY HAND (no scripts/claim.js in this install).
