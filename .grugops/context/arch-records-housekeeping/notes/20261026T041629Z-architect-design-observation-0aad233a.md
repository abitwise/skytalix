---
id: 20261026T041629Z-architect-design-observation-0aad233a
kind: observation
by: architect-design
at: 2026-10-26T04:16:29Z
verified_by: 
confidence: high: each stale line checked against a file on main 08b44f94; not edited
refs:
  - ABC-026
  - ABC-144
  - ABC-168
  - ADR-0040
  - ADR-0044
  - ADR-0049
  - QE-216-h
  - memory-bank/30-architecture.md
  - package.json
  - vitest.config.ts
  - acbddf43
  - 08b44f94
supersedes: 
seal: sha256:9f81afb0f7ef647657fd0fb01080df76d847b38a36d37720cc0f85836f027fbb
---

# Architect/Design: `30-architecture.md` carries more stale as-built lines than `QE-216-h` named. Not edited (outside the brief); for the Orchestrator to route

Task `arch-records-housekeeping`, read-only at `main` `08b44f94`. Each line below is disproved by a file on `main`.
None was edited: the brief fences this hop to the Node floor line and the `ADR-0034` pointer.

## § Tech context (the same paragraph as the Node floor line)
- "**There is no `vitest.config.ts`** — the runner runs on defaults". `vitest.config.ts` exists on `main`
  since `ABC-026` (`acbddf43`, 2026-08-13), and it now pins `test.maxWorkers: 2` (`ABC-144`, `ADR-0040` addendum 2).
- "`npm run build` is `tsc --noEmit` — a typecheck, not an emit". `package.json` `build` is
  `tsc -p tsconfig.build.json` (`ABC-168`, `ADR-0044` D8). `tsc --noEmit` is now the `typecheck` script.

## § Deployment posture, "Nothing publishable and nothing to run" bullet
- "no `main`, `exports` or `bin` and no `start` script; the build emits nothing (`tsc --noEmit`, no `dist/`);
  `src/` has no entry module. `AGENTS.md` records `Dev / run: UNKNOWN - verify`". `package.json` has a `bin`
  (`dist/uci.js`) and a `chess` script (`node src/cli.ts`). `AGENTS.md` § Development lists `npm run chess` and
  `npm run uci`. The bullet sits under a heading "RE-VERIFIED at this hop, 2026-08-12", so it is dated history, but
  unlike the "Nowhere to push" bullet it has no later dated line.
- Line 32, "There is still no barrel and no entry module": `src/cli.ts` and `src/uci.ts` are run as entries. Whether
  "entry module" there means a library barrel only is `UNKNOWN - verify`.

## Suggested shape (not a ruling)
- One more records-only hop, like this one: dated italic lines, original text kept, no bound moves. Class: records,
  LOW. Count: 4 lines.
