---
subtask: se-ABC-235
role: software-engineer
ticket: ABC-235
ref: .grugops/context/se-ABC-235/
workflow: agent-factory/workflows/ticket-to-pr (SE hop; QE follows)
branch: new grugops/ABC-235 from main, worktree ../wt-ABC-235
---

# ABC-235: value-identical cost-per-node cuts 1 → 3 → 5 (one commit per cut)

Build ABC-235 to the Architect's design, which governs scope: `arch-ABC-235/…7fc1b90c` (per-cut ruling, form, oracle)
and `…eebca902` (order, gate set). **In scope: cut 1 (king square read once per call, `move.to` when the king moves; not
on `Position`), cut 3 (`generateCaptures` sibling in `src/moves.ts`, generation order kept, ep guards copied), cut 5
(pawn-structure cache, exact two-mask key, 2^14 typed-array slots, two stored parts).** Out: cuts 2, 4 and 6 (6 is
being split by BA/PM). The ticket page's "piece list" and "cheaper legality for non-captures" candidates are struck by
the Architect's ruling: don't build them.

## Do
- One commit per cut, in the order 1, 3, 5, each with its own oracle rows (existing test files; deep rows behind
  `ENGINE_DEEP`). At every cut commit: lint, typecheck, `npm test` and build green.
- A1 identity against the merge base, out of tree in plain `node`, per the gate set: move, score, depth, nodes and clock
  reads byte-equal. No golden file committed. Perft equal; `PERFT_DEEP` 32/32.
- A3: measure nps per cut on the three boards (single processes, load1 recorded, only when `pgrep -x cutechess-cli` is
  empty). A cut that misses its ≥ 3 % bar is dropped by a revert commit and reported.
- G1–G9 as far as an SE runs them; leave the QE-owned reads (G2's binding read, G6's 5 interleaved runs) to QE, named.
- A5: S2, value-identical, no smoke.

## Fences
- Edits in `src/` (as the design names) plus tests, the ticket's dated result line, and your context. No `data/` or
  `tools/` edits. Another SE (`se-ABC-225`) is in `tools/rating/` in parallel: don't touch it.
- Own `npm ci --ignore-scripts`. Linters only via `npm run …`; never a bare `npx <name>`. No games.
- Never push, force, amend or rebase. Never merge into main. No board edits. No host paths.

## Publish
- Seal notes (task `se-ABC-235`) with `at` from `date -u`: per cut, the oracle evidence, nps and the gates. Commit on your
  branch. Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/.
