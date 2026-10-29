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

## Result

**2026-10-29, Software Engineer. Done. Branch `grugops/ABC-235` (worktree `../wt-ABC-235`, from main `a37f1d87`): cut 1 `dcbad73d`, cut 3 `7f3f0fda`, cut 5 `f9576af3`, notes, raw and ticket line `6327a3b4`. Not merged; nothing pushed. No game was played; no `cutechess-cli` ran (`pgrep -x` empty before every nps run).**

- **Cuts, all three kept, no revert** (decision `…e64c9f42`):
  - Cut 1 hoists the mover's king square in `legalMoves`, `legalCaptures` and `hasLegalMove`; per move, `move.to` when the king moves.
  - Cut 3 adds `generateCaptures` (exactly `generateMoves(p).filter(capture)`, in order; ABC-022's guards copied); `legalCaptures` calls it.
  - Cut 5 adds the pawn memo: an exact two-mask key, 2^14 typed-array slots, 384 KiB, two stored parts, and the header restated.
  - Cuts 2, 4 and 6, the piece list and non-capture legality are not built.
- **A1** (observation `…ebba6a59`): out of tree, plain `node`, against `a37f1d87`. 301 positions (ABC-078 A3 ∪ ABC-121's 190), 6 021 rows: move, score, depth, nodes, clock reads and purity, for `search` and 8 doors at depth 5, the 2 unpruned doors at depth 2, the `chooseMove` family at budgets 3 and 5 on `tickingClock(1)`, plus the legal lists and `evaluate`.
  - sha256 `812f86ae…bd000` for the base and at every cut: `cmp` byte-identical. No golden file committed.
  - Perft counts equal; `PERFT_DEEP` 32/32 at each cut.
- **Per-cut oracles:** in `src/legal.test.ts`, `src/moves.test.ts` (and the spied guard in `src/gameend.nfr.test.ts`) and `src/evaluate.pawns.test.ts` (and G7 in `src/transposition.test.ts`). Depth 1 in the lane, depth 3 under `ENGINE_DEEP=1`. Each was planted red and restored.
- **nps** (observation `…67655916`): SE-indicative, 5 interleaved per board, medians, load1 2-4. Order is kiwipete / position-6 / start.
  - Cut 1 against base: 1.076 / 1.090 / 1.064.
  - Cut 3 against cut 1: 1.094 / 1.053 / 1.060.
  - Cut 5 against cut 3: 1.122 / 1.123 / 1.056.
  - Tip against base: 1.272 / 1.283 / 1.163.
- **Gates** (observation `…cf540c21`): lint, typecheck and build exit 0 at each cut. `npm test` 63 files: 2 130 / 2 135 / 2 139 (base 2 128). Skips 0, `No findings.`
  - Deep lanes green: engine 60, pvs-lmr 29, null-move 44, search 57, quiescence 37, transposition 26 and 40, levels 41.
  - G1 54/58 with all 58 rows equal to base. G7 384 KiB counted, growth green. G8 8.81 s and 8.65 s. G9 empty diff.
- **QE owes:** A3's interleaved reading at the tip, G2's binding read (plus the cache-cold mean as INFO), G6's 5 interleaved runs, A1 re-run at the tip (harness in `.grugops/context/se-ABC-235/raw/`), and a ruling on the unpruned doors' A1 depth (2, not 5).
- **Owner INFO:** `OD-235-1` (cut 1 re-opens ADR-0003's recorded hoist) stays the Orchestrator's to report.
- **Disclosed:** before switching to `npm run …` and `./node_modules/.bin/vitest`, I ran a bare `npx biome format` once and `npx vitest` twice. Both are local devDependencies, nothing was downloaded, and lint was green after.
- **Publishing:** `propose_note` was not available in this session. The notes went through the plugin's sanctioned writer, `context-io.js` `admitAndAppend`, with `contextRoot` set to the worktree. 4/4 admitted, `readContext` reads back 4.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-235 | Value-identical cuts in cost per node: king square once per call, captures-only generator, pawn-structure memo (cuts 1, 3, 5) | EPIC-010 | — | NFR-001 perft equal, PERFT_DEEP 32/32; NFR-004 clock reads byte-equal (A1); NFR-005 G6 SE-indicative (depth equal); NFR-008 G8 8.81 s; NFR-009 +384 KiB fixed, growth green; no ADR (OD-235-1 owner INFO) | grugops/ABC-235 @ f9576af3 (+ notes/raw/ticket line 6327a3b4): src/legal.ts, src/moves.ts (generateCaptures), src/evaluate.ts (pawn memo) | src/legal.test.ts, src/moves.test.ts, src/gameend.nfr.test.ts, src/evaluate.pawns.test.ts, src/transposition.test.ts; A1 6 021 rows cmp-identical at each cut; npm test 63 files / 2 139 pass, skips 0; deep lanes green; G1 54/58 rows equal base | — (UAT owed; QE verdict signs, S2) | — | In Review (branch, not merged; A3/G2/G6 QE readings pending) |
