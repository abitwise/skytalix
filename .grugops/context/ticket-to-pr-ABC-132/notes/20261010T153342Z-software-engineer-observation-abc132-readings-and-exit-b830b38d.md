---
id: 20261010T153342Z-software-engineer-observation-abc132-readings-and-exit-b830b38d
kind: observation
by: software-engineer
at: 2026-10-10T15:33:42Z
verified_by:
confidence: high
refs:
  - ABC-132
  - QE-129-b
  - QE-051-d
  - src/render-seam.ts
  - src/result-screen.ts
  - src/cli.ts
supersedes:
---

# `ABC-132`: premise, gates, `A1`–`A4`, and the owner's two exit measurements

This note is hand-authored and unsealed. Base `3159ab68` (wave tip), code `1416a069`.

## Premise at `3159ab68` (after `ABC-129` merged)

Held. `git grep -n FRAME_PRODUCERS -- src` = 2 (`render-seam.ts:35`, `result-screen.ts:14`);
`git grep -niE 'frame producers?' -- src` = 3 (`cli.ts:8`, `render-seam.ts:34`,
`result-screen.ts:13`); `declared, not derived` = `render-seam.ts:36` + `history-pane.nfr.test.ts:168`.
Same sites and lines as the ticket's `9ddd6e80` table. No stop condition fired.

## Acceptance at `1416a069`

| # | verdict | reading |
|---|---|---|
| `A1` | MET | `git grep -n FRAME_PRODUCERS -- src`: 2 → **0** |
| `A2` | MET | `frame producers?` (-i): 3 → **0**. `declared, not derived`: only `src/history-pane.nfr.test.ts:168` |
| `A3` | MET | Docblocks with ` * ` stripped and whitespace collapsed (script `a3.cjs`, scratchpad): `render-seam.ts` contains `COMPOSITION_ROOT` and `ADR-0029`; `result-screen.ts` contains `ADR-0029` and "NOT on the frame path". Both kept sentences ("The one runtime edge … must STAY `import type`."; "`INPUT_ENDED_NOTICE` … non-frame write to the sink.") are string-identical at base and tip |
| `A4` | MET | `git diff --name-only 3159ab68..1416a069 -- src` = exactly the three files. The ticket's non-comment pipeline prints nothing |

## Gates (in the worktree, at `1416a069`'s tree)

- `npm run lint` exit 0 (100 files, no fixes); `npm run typecheck` exit 0; `npm run build` exit 0.
- `npm test` exit 0: **52 files / 1608 passed**, 0 skipped. Includes `src/cli.test.ts` bar 1 and
  `src/render-seam.test.ts` `A6`/`A7`, the raw-text bars over these files.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`
- `node tools/grugops/lane-inventory.js`: 52 collected / 52 tracked, `No findings.`
- Opt-in, triggered by `src/cli.ts` (AGENTS.md): `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`
  exit 0, 7 passed, 6.5 s. No other opt-in lane names these files.

## Exit (owner ruling, `…5c8e2a17`): both measurements, per production file

`node .grugops/context/qe-ABC-129/probe/exit-probe.mjs <worktree> 3159ab68 1416a069 <files>`:

| file | (i) changed / regex-comment / AST-comment | (ii) `transpileModule` `removeComments` emit | (iii) printer |
|---|---|---|---|
| `src/cli.ts` | 7 / 7 / 7 | `eb8a971137c3a81c` (2286 B) IDENTICAL | IDENTICAL |
| `src/render-seam.ts` | 12 / 12 / 12 | `564e88c7c137120d` (515 B) IDENTICAL | IDENTICAL |
| `src/result-screen.ts` | 8 / 8 / 8 | `3dce8d0657339010` (2211 B) IDENTICAL | IDENTICAL |

**Both hold on all three.**

**Negative controls** (probe's `measure`, in memory, mutated from `1416a069`):
- QE-129 `controls.mjs <worktree> 1416a069`: N1 (`command-input.ts`) and **N2 (`src/cli.ts`
  budget expression)** read AST 0 and emit DIFFERENT; P1/P2 comment-only read IDENTICAL; N3
  type-only is caught by (i) and (iii) but not (ii); N4 template `//` is caught by AST and (ii) but
  not regex. These are the `QE-129-b` blind spots, and they are why both measures are required.
- Own, per touched file: `render-seam.ts` (`orientation` → `"white-bottom"` in `renderBoard(...)`)
  reads 2 changed / regex 0 / AST 0, emit DIFFERENT; `result-screen.ts` (append
  `export const __neg = 1;`) reads 1 / 0 / 0, emit DIFFERENT.

## `src/` numstat (`3159ab68..1416a069`)

`src/cli.ts` +4/−3, `src/render-seam.ts` +6/−6, `src/result-screen.ts` +4/−4. No test file, no new
file, no manifest byte. `N8-LANE` 0 ms. `NFR-002` and security not triggered (`A4`).

## UAT

With both measurements holding, the owner's ruling reads comment-only as zero production lines, so
the 2026-08-17 waiver applies (WAIVED, not accepted). It is applied at `Done` by the Orchestrator,
not self-applied here.
