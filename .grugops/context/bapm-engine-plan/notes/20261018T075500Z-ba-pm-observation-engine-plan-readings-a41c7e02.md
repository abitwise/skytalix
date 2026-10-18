---
id: 20261018T075500Z-ba-pm-observation-engine-plan-readings-a41c7e02
kind: observation
by: ba-pm
task: bapm-engine-plan
at: 2026-10-18T07:55:00Z
verified_by:
confidence: high
refs:
  - EPIC-007
  - EPIC-004
  - ADR-0044
  - ADR-0036
  - ABC-167
  - ABC-168
  - ABC-169
  - plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
supersedes:
---

# Readings taken at this hop (main `76782eb1`), read only, no test, vitest, build or timing

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install).

- **Ids.** `EPIC-007` appears nowhere in `plans/`, `memory-bank/` or `.grugops/` (grep printed nothing).
  `ABC-167`, `ABC-168` and `ABC-169` appear only in the brief. The board says "Next free id: ABC-167".
  After this reservation, the next free id is `ABC-170`.
- **Host.** `sysctl -n machdep.cpu.brand_string` printed `Apple M3`. `node --version` printed `v26.11.1`.
  `which cutechess-cli` printed nothing, and `brew list | grep -i cute` printed nothing, so
  **`cutechess-cli` is not installed**. `/Applications` holds no Arena, En Croissant, cutechess or Banksia.
- **Licence.** `ls LICENSE*` found nothing, and `package.json` has no `"license"` key. Its `"name"` is
  `cli-chess` and its `"version"` is `0.0.0`. This is the source of `Q9`'s recommended `id name`.
- **`ADR-0036` (b2) for the session ticket.** I grepped `process.`, `node:`, `spawn`, `exec(`,
  `fetch(`, `eval(` and `new Function` in `src/{engine,fen,coordinate-move,apply,position,search,transposition}.ts`.
  The only hit is `src/coordinate-move.ts:91`, `COORDINATE.exec(...)`, which is `RegExp.prototype.exec`
  and not `child_process`. `engine.ts`'s only `turn-loop.ts` import is `import type`. `engine.ts:457`
  defaults `now` to `Date.now`, which is not a limb token. So (b2) should not fire on `ABC-167`. This is
  a grep, not a review: QE or Security/NFR confirms it when the ticket is reviewed.
- **M1's opening set exists.** `src/perft.test.ts:21-52` pins six FENs: startpos, kiwipete, and
  position-3 through position-6.
- **Feature level.** `plans/features/` holds only `.gitkeep`, so no feature page is cut, and the trace
  row's Feature cell is `—`.
