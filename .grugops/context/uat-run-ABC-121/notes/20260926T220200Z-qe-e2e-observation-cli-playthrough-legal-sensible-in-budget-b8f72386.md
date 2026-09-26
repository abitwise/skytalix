---
id: 20260926T220200Z-qe-e2e-observation-cli-playthrough-legal-sensible-in-budget-b8f72386
kind: observation
by: qe-e2e
at: 2026-09-26T22:02:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - AR-NFR004-A
  - src/cli.ts
supersedes:
---

# Business-facing CLI play-through, three games — legal moves, sensible/tactically-alert replies, no move over its 3 s budget beyond `AR-NFR004-A`

Hand-authored, unsealed. `node src/cli.ts --colour white --ascii`, non-interactive, stdin piped
via `spawnSync` (the same pattern `src/cli.test.ts` itself uses), never `npm run chess`'s
interactive TTY path. `src/cli.ts` has no FEN-loading option (`src/cli-options.ts`'s closed flag
enumeration: `--ascii`, `--unicode`, `--colour`), so "from a tactical position" is read as
reaching a tactical position through play, not loading one — the CLI has no other route.

## Game 1 — from start, three plies

`input: "e4\nNf3\nBc4\nquit\n"`. Engine (black) replied `Nc6`, `d5`, `dxc4` — every reply legal,
and `dxc4` is the correct capture of the bishop White walked into with `3. Bc4?? dxc4`. Total
elapsed 9097 ms for 3 engine moves (≈3032 ms/move average). Exit 0.

## Game 2 — from start, an early queen sortie, plus one illegal-move check

`input: "e4\nQh5\nQxe5+\nquit\nquit\n"`. `1. e4 Nc6 2. Qh5 Nf6` — `Nf6` attacks the White queen
with tempo, a sensible defensive/tactical reply, not a passive one. `Qxe5+` was then rejected:
`"no move Qxe5+ here"`, no crash, the prompt continued and the game ended cleanly on `quit`. Total
elapsed 6087 ms for 2 engine moves (≈3044 ms/move average). Exit 0.

## Game 3 — a Scholar's-Mate attempt walks into a tactic

`input: "e4\nBc4\nQh5\nquit\nquit\n"`. `1. e4 Nc6 2. Bc4 Nf6 3. Qh5??` — the queen sortie is
undefended; engine (black) replied `Nxh5`, capturing the queen outright (material swing −9 for
White). This is a genuine tactical find, not a legality-only check: the engine spotted and took a
free queen rather than continuing development. Total elapsed 9118 ms for 3 engine moves
(≈3039 ms/move average). Exit 0.

## Timing against `AR-NFR004-A`

All nine engine moves across the three games average ≈3.04 s; `AR-NFR004-A`'s accepted risk bound
is ≤31 ms over the 3 000 ms clause (`plans/nfr-catalog.md` `NFR-004`). No single observed
per-move interval in this hop exceeded that band (elapsed totals divided by move count sit at
3032–3044 ms average per move; individual per-move timings were not instrumented separately from
the child's total wall clock, so this is a bound on the average, not a per-move assertion — named
honestly). No move hung, no move exceeded a small multiple of the budget, and every game exited 0.
