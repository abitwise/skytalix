<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-abc250-close

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-01T20:23:47Z | decision | architect-design | high on value identity (bit-identical rewrites); low on the speed effect, gated by the profile-first stop rule |  | # ABC-251 design input, narrowed form (O1-c alone, on today's Move objects): value-identical by construction, no ADR; profile first and stop if the helpers are already inlined; inline isBlack/pieceType only at the hot sites the profile names (evaluate.ts only if named, which owes G2/G3); write Budget's six heuristic fields out in place of `...heuristics`; nothing else |
| 2026-11-01T20:23:47Z | decision | architect-design | high on the rulings as recorded and their forward-only scope; the 'heat does not void a search read' basis rests on two reads (7 boards) |  | # arch-abc250-close rulings: ADR-0055 gets a dated status line (ABC-250 closed not merged by routing, A4 not graded; rest of O1-b dropped; O1-d delivered 1.11–1.12×; remaining O1 re-estimated) and a second addendum ruling QE-250-a "not needed now" (D3-V2 unchanged; ABC-251/253 are search reads); ADR-0056 gets one dated line (S′ keeps E 1 650, owner-confirmed; raise under the re-pin rule) |
| 2026-11-01T20:23:47Z | observation | architect-design | low-medium: an estimate from pre-ABC-235/240/254 shares (no search profile since, UNKNOWN - verify); medium-high on the ceilings; Elo figures informal |  | # The remaining ADR-0055 O1 speed path, re-estimated after ABC-250's close: O1-c ≈ 1.00–1.04× and O1-a ≈ 1.01–1.06×, together ≈ 1.01–1.10× (central ≈ 1.04×, ≈ 3–6 Elo informal); O1 in total ≈ 1.12–1.23× (central ≈ 1.16×) against ADR-0055 D1's 1.25–1.85× (central 1.5×) |
