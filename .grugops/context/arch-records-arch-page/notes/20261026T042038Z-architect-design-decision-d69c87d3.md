---
id: 20261026T042038Z-architect-design-decision-d69c87d3
kind: decision
by: architect-design
at: 2026-10-26T04:20:38Z
verified_by: 
confidence: high: records only; each line checked read-only against main 4356b184 (git show/log/grep); no run
refs:
  - ABC-026
  - ABC-042
  - ABC-144
  - ABC-168
  - ADR-0040
  - ADR-0044
  - memory-bank/30-architecture.md
  - arch-records-housekeeping/20261026T041629Z-architect-design-observation-0aad233a
  - orch-2026-10-26k
  - grugops/arch-records-arch-page
  - acbddf43
  - e1403550
  - 825b21d1
  - f9fdde20
  - 4356b184
supersedes: 
seal: sha256:3634585a4c65eeebcd3f0bae7ff5b14cac514b5dba24172a39d85aa586919a05
---

# Architect/Design: four stale `30-architecture` lines dated (records only). The `vitest.config.ts`, `npm run build` and two "no entry module" lines each get a dated italic correction. Original text kept; no bound moves

Task `arch-records-arch-page` (Orchestrator `orch-2026-10-26k`). Branch `grugops/arch-records-arch-page` is cut from
`main` `4356b184`, and the records commit is `f9fdde20`. Input: this role's `arch-records-housekeeping/…0aad233a`.
Each line was checked read-only against `main` (`git show`, `git log`, `git grep`) before it was written. Form: the
page's own dated italic line, as in the `ADR-0049` row 33 line and the `QE-216-h` line.

## Written (`memory-bank/30-architecture.md`)
1. **§ Tech context, "There is no `vitest.config.ts`".** `vitest.config.ts` was added in `acbddf43` (2026-08-13);
   its header names `ABC-026`. It sets `test.maxWorkers: 2` (`ABC-144`, `ADR-0040` addendum 2).
2. **§ Tech context, "`npm run build` is `tsc --noEmit`".** `package.json` `build` is `tsc -p tsconfig.build.json`
   (`outDir: dist`, `files: [src/uci.ts]`), added in `825b21d1` (`ABC-168`, `ADR-0044` D8). `typecheck` is
   `tsc --noEmit`.
3. **§ Deployment posture, "Nothing publishable and nothing to run".** Dated "no longer true in part":
   - Now false: `bin` `skytalix: dist/uci.js` (`825b21d1`); `chess: node src/cli.ts` (`e1403550`, `ABC-042`);
     `uci: node src/uci.ts`; the build emits `dist/`; `AGENTS.md` § Development lists `npm run chess` and `npm run uci`.
   - Still true: `private`, no `main`, no `exports`, no `start` script.
4. **§ System context, l.32, "no barrel and no entry module".** The observation's `UNKNOWN - verify` is resolved by
   the sentence itself: it ties "entry module" to "nothing starts a game", so a run entry is meant, not only a
   library barrel. The entry half is dated false (`src/cli.ts`, `ABC-042`; `src/uci.ts`, `ABC-168`). The barrel half
   still holds: `git grep` finds no `export … from` in non-test `src/*.ts`, and there is no index module.

## Not moved
- No status, bound, value, pin or criterion moves, and no `_Updated` header line. No `src/`, `tools/`,
  `package.json` or `AGENTS.md` edit. No board edit. No npm, vitest or timing run.
- `git diff --stat main..f9fdde20 -- src tools package.json AGENTS.md` printed nothing. Class scan of the added lines: 0.
