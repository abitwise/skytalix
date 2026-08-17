# Claim: refinement-abc076-a1-corpus-2026-08-17

- role: ba-pm
- task: refinement-abc076-a1-corpus-2026-08-17
- claimed: 2026-08-17T18:35:00Z
- done: 2026-08-17T18:42:00Z

Repaired `ABC-076` `A1`'s unsatisfiable corpus. `src/perft.test.ts`'s `PERFT_SUITE` holds SIX
positions, so the old `≥ 40 positions drawn from` it could never be met. Fix chosen: WIDEN the
corpus (the six plus every position one legal ply from each = 6 + 178 = 184) rather than restate the
bar at ~12 pairs, which would have weakened the property exactly where the piece-square tables are
weakest. Three hunks touched: `A1`, test note 1, DoR row 4. No board column moved; `src/`,
`plans/board.md`, `ABC-031` and `factory.config.json` untouched. Notes published to
`.grugops/context/refinement-abc076-a1-corpus-2026-08-17/notes/`.
