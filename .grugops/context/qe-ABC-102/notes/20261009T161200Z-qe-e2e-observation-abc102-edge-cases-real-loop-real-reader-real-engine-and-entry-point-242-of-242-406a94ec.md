---
id: 20261009T161200Z-qe-e2e-observation-abc102-edge-cases-real-loop-real-reader-real-engine-and-entry-point-242-of-242-406a94ec
kind: observation
by: qe-e2e
at: 2026-10-09T16:12:00Z
verified_by:
confidence: high
refs:
  - ABC-102
  - ADR-0021
  - ABC-035
  - ABC-046
  - src/turn-loop.ts
  - src/line-input.ts
  - src/cli.ts
  - .grugops/context/qe-ABC-102/probes/loop-probe.ts
  - .grugops/context/qe-ABC-102/notes/raw-loop-probe.txt
supersedes:
---

# `ABC-102` edge cases: through the real loop, reader and engine (242/242), and the real entry point

This note is hand-authored and has no `seal`.

## Instrument 1: `probes/loop-probe.ts` (plain node, outside the lane)

The build's `runLines` uses a stub render and an array input. This probe instead wires what
`src/cli.ts` wires: `runTurnLoop`, the **delivered reader** `createLineInputSeam` over a
`PassThrough` (so the real per-session `createPromptLineResolver` and real line terminators are
used), the **delivered render seam** `makeRenderSeam`, and the **delivered engine** `createEngine`
at `budgetMs: 120` wherever a fixed reply is not needed. At every prompt it snapshots the FEN, the
move list, the key list, the repetition counts, and the status, messages and rows of the frame the
player sees. It asserts every snapshot against a **fresh replay** of its move list: FEN, key list,
`keys = plies + 1`, counts entry for entry, and status deep-equal. Result: `242/242`
(`raw-loop-probe.txt`), 1.6 s wall.

| scenario | plies at each prompt | result |
| --- | --- | --- |
| S1 White, real engine: undo@0, help@start, move, undo **after an engine reply**, undo@0, 3 moves, help@ply6, undo×3 to the floor, undo@floor | `0 0 0 2 0 0 2 4 6 6 4 2 0` | refusals at 0; each undo is exactly the last two plies; lands on `START_FEN`; engine asked 4× (never after an undo) |
| S2 Black, real engine, black-bottom: undo@**1**, help@1, move, undo 3→1, undo@1, 2 moves, undo×2, undo@floor | `1 1 1 3 1 1 3 5 3 1 1` | ply-1 refusal; after 3 → 1 the engine's opening move is the **same object**, the FEN is byte-identical, and the engine does **not** move again; floor = ply 1 |
| S3 claimable (threefold), scripted engine: help, undo, claim, replay `h1g1`/`b6a5`, claim | `8 8 6 6 8` | claim on offer before; `claimable` undefined after undo; `claim` refused with `repetition 2 of 3` / `50-move 6 of 100`; replay restores the claim; `claim` → `draw` / `threefold-repetition` |
| S4 after `new` (real engine) | `0 2 4 0 0 2 0 0` | undo right after `new` refused; after one more exchange, undo → `START_FEN`, then refused |
| S5 `quit` → cancel (real engine) | `0 2 2 0 0 0 0 0 0` | quit/undo (take-back, messages `[]`)/quit asks again; quit/**refused** undo/quit asks again; quit quit exits `{null,null,0}` with the `quit` notice |
| S6 replay-sensitive state (scripted) | — | undo of `O-O` restores `… w KQkq - 4 4`; undo of `e5xd6` e.p. restores `… w KQkq d6 0 3`, byte-identical |
| S7 classification through the reader at ply 2 | — | `UNDO\n`, ` undo \n`, `undo\t\n`, `undo\r\n`, `\tUnDo\r\n` → undone; `undo2`, `un do`, `undo 2`, `und`, `undoo`, `u`, `undo!` → `type e2e4 or Nf3`, nothing changed |
| S8 collisions | — | 144 SANs over 6 positions (incl. promotions both colours): none folds to a table token; `resolveMoveInput` never reads `undo`/`UNDO`/`undo2`/`un do`/`u`/`und` as a move; `new` still takes back all 6 plies |
| S9 `help` on the real frame | — | 16 renders (unicode/ascii × white/black-bottom × start/ply1/ply6/claimable): hidden count **0** everywhere. Start/ply1: width 21, rows `help board quit claim` / `resign new undo`. Ply 6: width 22. Claimable: width 50, one row |

## Instrument 2: the real entry point, `node src/cli.ts`, stdin piped, real 3 s engine

- **White**, `undo help e2e4 undo undo quit undo quit quit`: exit 0, stderr empty, 4895 B
  (`raw-entry-white.stdout.txt`). `nothing to undo` appears 3× (ply 0, after the undo back to 0,
  and after `quit`, where it also disarms). `quit again to end` appears 2×. `(+` appears 0×. The
  frame after the undo is the start position again (`White to move  1.`, empty history pane).
- **Black** (`--colour black`), `undo help UNDO quit quit`: exit 0, stderr empty
  (`raw-entry-black.stdout.txt`). `nothing to undo` 2× (ply 1), help rows shown in full, `(+` 0×.

## Not covered (named)

- Live TTY typing was not exercised. The pipe drives the same reader, but terminal echo and
  raw-mode effects are not observed here. UAT's lane.
- The real engine at its full 3 s budget was exercised only at the entry point (2 replies). The
  in-process probe used 120 ms. The engine is stateless across calls (`ABC-081`'s table is cleared
  at every `chooseMove` entry, per the ticket) and `undo` touches nothing engine-side, so budget is
  not a variable of this ticket.
