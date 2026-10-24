---
subtask: ticket-to-pr-ABC-213
role: software-engineer
ticket: plans/tickets/ABC-213-a-failed-pgn-save-reports-its-first-error-code-even-when-the-cleanup-also-fails-and-leaves-no-partial-file.md
ref: .grugops/context/ticket-to-pr-ABC-213/
width: 2 of 3 (beside arch-rule-ABC-205-stop)
---

# Build ABC-213: guard the PGN cleanup unlink; pin no-partial-file and the double fault

## Do
- Worktree `../wt-ABC-213` on `grugops/ABC-213` from `main`, own `npm ci --ignore-scripts`.
- Build exactly to the page's `## Design ruling`: guard in `src/pgn-file.ts` (first code reported, non-errno rethrown), rig (b′) — one hoisted pass-through `vi.mock("node:fs")` in the existing `src/pgn.test.ts` with the canary row, the armed/unarmed rules, rows A1–A3; red-first on base; plants X1/X3/X4/X5. `cli.ts`/`pgn.ts` byte-identical; writer child byte-identical; 0 spawns.
- Gates: lint, typecheck, build; `npm test` + `last-run.json`; skips; `CLI_DEEP`. No timing. Any other red → STOP to Architect.

## Fences
- Only `src/pgn-file.ts` and `src/pgn.test.ts`. No ADRs, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se213/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `ticket-to-pr-ABC-213`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE: built to the `## Design ruling`, rig (b′). Branch `grugops/ABC-213` @ `e71c8901`** (from `main` `dfaa4cdc`;
`5a10b4b6` fix + rows, `e71c8901` notes). Not pushed and not merged. Worktree `../wt-ABC-213`.

- **Files:** `src/pgn-file.ts` +5/−1 (cleanup branch only: the guarded unlink; the first code is reported; a codeless
  throw is rethrown). `src/pgn.test.ts` +126/−2 (a header paragraph, the hoisted call-through `node:fs` double, and
  the canary, `A1` ×2, `A2` ×2 and `A3` rows). Notes and the rendered index are under
  `.grugops/context/ticket-to-pr-ABC-213/`.
- **One mechanical deviation:** the canary's marker sits on each of the five doubled functions, not on the namespace.
  Measured: vitest 4.1.12's native mock keeps the real export names, so an extra key never appears. The intent is
  unchanged. The plant XC (`vi.mock` removed) reds the canary, and `arm()` refuses every armed row before a write.
- **Red-first (base):** `A1` ×2 red with `EACCES` escaping (= X3). The other 19 rows were green.
- **Head:** `pgn.test.ts` 21/21.
- **Plants:**
  - X1: red `A2` ×2, plus `A1` ×2 (cleanup-attempted count) and `A3`.
  - X3: red `A1` ×2.
  - X4: red `A1` ×2.
  - X5: red `A3`.
  - XC: red canary and 5 armed rows (refused).
  - The 15 `ABC-203` rows stayed green in every variant. No `games/` landed in the worktree.
- **Gates:**
  - lint green, after one `biome format` of the test file.
  - typecheck 0. build 0.
  - `npm test`: 62 files, 2044/2044, exit 0. `last-run.json`: success, pending 0, todo 0.
  - skips 0. Integrity: `No findings.`
  - `CLI_DEEP` 11/11.
  - No timing.
- **A6/A7:**
  - `cli.ts` and `pgn.ts` byte-identical.
  - The holder keeps 1 `node:fs` import (the same 5 bindings), 1 export and no `process.` in code.
  - One `spawnSync` site. The writer `SCRIPT` and the spawn call are byte-identical, so writer-child CPU growth is 0
    by construction.
- **Owed elsewhere:**
  - QE: `A5` by hand, and the plants re-read.
  - Then `In Security/NFR` (`ADR-0036` Ruling 2; closes `AR-203-UNLINK`). The in-process cost is not measured here.
  - The `ADR-0047` D4 dated line (Architect/Design).
- **STOP:** none. No other red.
- **Notes:** `20261023T224721Z-software-engineer-observation-3ff2f272` and
  `20261023T224721Z-software-engineer-decision-464bea64`. Sealed by grugops 2.1.0 `appendNote` with the worktree's
  context root. Each validated with 0 faults and seal ok, and the index was rendered.

### Trace row (10 cells, header order)

| ABC-213 (SE build) | A failed PGN save reports its first errno code on a double fault and leaves no partial file on a single fault: guarded cleanup `unlinkSync` (codeless throw rethrown, D5); `A1`–`A3` pinned in-process on rig (b′), a call-through `node:fs` double in `src/pgn.test.ts` with a canary | EPIC-006 | PGN export (ABC-203, ADR-0047) | NFR-008 (N8-SPAWN 0; N8-LANE 0 files, 0 spawns, writer child byte-identical; in-process cost to Security/NFR); ADR-0036 Ruling 2 owed | `grugops/ABC-213` @ `e71c8901` (`5a10b4b6`)<br>`src/pgn-file.ts` +5/−1<br>`src/pgn.test.ts` +126/−2<br>`.grugops/context/ticket-to-pr-ABC-213/notes/` (…3ff2f272, …464bea64) | red-first at base: A1 ×2; head 21/21; X1→A2 ×2 (+A1 ×2, A3), X3→A1 ×2, X4→A1 ×2, X5→A3, XC→canary; lane 2044/2044, skips 0, CLI_DEEP 11/11; lint, typecheck and build green | owed (QE verdict signs, owner delegation); A5 by hand QE's | — | In Development → In Review (SE done; QE next) |
