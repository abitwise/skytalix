---
id: 20261024T154310Z-ba-pm-observation-514ce8a5
kind: observation
by: ba-pm
at: 2026-10-24T15:43:10Z
verified_by: 
confidence: high: read from the code and records at 2a1a7c93; nothing run
refs:
  - ABC-216
  - ABC-217
  - ADR-0049
  - ADR-0048
  - EPIC-006
  - EPIC-007
  - EPIC-008
  - owner-word-2026-10-24/…619938c5
  - 2a1a7c93
  - QE-206-a
  - QE-206-b
  - QE-206-e
  - SEC-206-a
  - QE-212L-a
supersedes: 
seal: sha256:3bb14ea9b8383b6c2e1d7d2ee965b2d1858dccde9eb814deadd949732ed3cfce
---

# bapm-cut-readme readings: what a README needs, what pins it, and what the hardening items point at

BA/PM, task `bapm-cut-readme`, worktree `../wt-bapm-cut-readme` on `grugops/bapm-cut-readme` from `main` `2a1a7c93`. Read-only on code: no npm, vitest, build or CLI ran (a QE reading runs ALONE on the host).

## README facts read at `2a1a7c93`
- `git ls-files 'README*'` at the root: none. The `README` hits under `tools/` name the kit's `install/README.md`. **No test or tool reads a root README.**
- `package.json`: `name` `skytalix`, `description` "Command-line chess against a club-strength engine.", `engines.node` `>=22`, `license` `Apache-2.0` (ABC-214 merged), `private` true, scripts `chess`, `uci`, `build`, `test`, `lint`, `typecheck`.
- Flags (`src/cli-options.ts`): `--colour white|black|random`, `--difficulty 1..7`, `--ascii`, `--unicode`. No `--help`. Levels (`src/levels.ts`): EASIEST 1, DEFAULT 5, HARDEST 7; budgets 100/180/330/1 000/3 000/5 000/30 000 ms.
- In-game tokens (`COMMAND_TABLE`): `help`, `quit`, `resign`, `undo`, `moves`. Moves in SAN or coordinates (`src/move-input.ts`).
- PGN (`src/pgn-file.ts`, ADR-0047): `games/<stem>[-n].pgn` relative to the process directory, created if absent, never overwritten; `games/` is git-ignored.
- UCI (`src/uci-session.ts`): `id name skytalix`; options `OwnBook` (check, default true) and `Skill Level` (spin 1..7, default 5). `src/uci.ts` has a `node` shebang; ABC-202 launched `dist/uci.js` as command `node` plus the file as argument.
- The local remote is the SSH form; the README needs the public HTTPS form (no account key). Not recorded here by value (ADR-0049 d4).
- `LICENSE` and `NOTICE` are tracked. `NOTICE` lists the CC BY-SA 3.0 evaluation values and four MIT kit files.

## Hardening anchors read at `2a1a7c93`
- `src/legal.test.ts` ABC-206 A2 block: `FLAGGED_CHECKS` (castle, promotion, en passant) and `givesCheckRow`; no plain-move discovered-check fixture (QE-206-a).
- `src/gameend.nfr.test.ts`: module-level spies on `legalMoves`, `hasLegalMove`, `legalCaptures` (legal.ts), `makeMove` (apply.ts), `zobristKey`. `legal.ts` imports `makeMove` from `apply.ts`, so the apply spy sees in-module rebuilds (QE-206-b).
- Stale texts: `src/gameend.ts:17` "built to be cheap at a search leaf"; `src/gameend.nfr.test.ts:68` describe "gameStatus stays cheap at a search leaf" (QE-206-e, SEC-206-a).
- `src/uci-session.test.ts` `budgetAt` (near `:1041`): the stub records `budgetMs`, `maxDepth`, `maxNodes`, not `now`; `rig` builds `now: virtualClock(stepMs)` (QE-212L-a).
- Open branches `grugops/ABC-205`, `grugops/ABC-204`, `grugops/qe-ABC-204`: none touches those four files.

## ADR-0049 rows 20-24 at `2a1a7c93`
- EPIC-007 already carries the ADR-0048 acceptance-box paragraph (`bapm-epic007-licence-line`, merged), the M10 post-close line, and the RISK-EPIC007-07 "fired; disposed" line. Each of rows 20-24 has disposition "ADR-0048" and is answered in substance by those lines.
