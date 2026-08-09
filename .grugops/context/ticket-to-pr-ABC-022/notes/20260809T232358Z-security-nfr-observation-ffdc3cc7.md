---
id: 20260809T232358Z-security-nfr-observation-ffdc3cc7
kind: observation
by: security-nfr
at: 2026-08-09T23:23:58Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - AGENTS.md
  - src/moves.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Every gate re-run on the branch tip, with exit codes — and one instrument failure that was this gate's own

Nothing below is carried from a hand-back. `src/moves.ts` was **not touched at this hop** and is
still md5 `6335b452fc21ffe2d0f902ecab930840`; `git status --short -- src/` is **empty**.

## Ran

```
lint       npm run lint        exit 0   35 files, 2 infos — the pre-existing biome.json pair
                                        (schema version, deprecated `recommended`)
typecheck  npm run typecheck   exit 0
build      npm run build       exit 0   tsc --noEmit in this project — the SAME command as
                                        typecheck, named honestly rather than reported as a
                                        second independent signal
unit       npm test            559 passed (559) on 18 files
skip count                     0        by the AGENTS.md command
                                        (npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests')
perft fast lane                24/24    inside npm test
A8 deep lane   PERFT_DEEP=1 npx vitest run src/perft.test.ts   32 passed (32) EXACT in 36.06 s
reference-check   node tools/grugops/reference-check.js   "No findings" on all four edited plans files
```

`0 of 2` `self_fix_attempts` were spent — no autofix pass was needed or run, because this gate wrote
no source.

The deep lane's **32/32 in 36.06 s** is the **fourth** independent run of that lane on this ticket
and it agrees with 36.55 s (Engineer), 36.50 s (Orchestrator) and 36.85 / 38.15 s (QE).

## Measurement trees, and the discipline applied to them

Five full tree copies **outside the repository**, `node_modules` symlinked, `tsconfig` narrowed to
`src/**`, **one OS process per tree**, every probe **printing its FEN and re-parsing it** (a FEN that
does not render back identically aborts the probe).

| tree | `src/moves.ts` md5 | what it is |
| --- | --- | --- |
| `t-fix` | `6335b452fc21ffe2d0f902ecab930840` | `git archive HEAD src`, `/usr/bin/diff -r` verified **identical to the working tree** |
| `t-pristine` | `0e247853ab2c05887c76105ff83d8621` | `git archive main src` |
| `t-twin` | `6335b452fc21ffe2d0f902ecab930840` | `cmp`-verified byte-identical twin of `t-fix`, **31 of 31 files in `src/` identical** — the NULL CONTROL BY IDENTITY |
| `t-count` | `9b0b488d4d58bd5798b2959684de1579` | `t-fix` + two **anchored** counter insertions |

`t-pristine` differs from `t-fix` in exactly the expected set: `moves.ts`, `legal.ts`,
`legal.test.ts`, plus the two added test files. Each mutation was an anchored single replacement
asserting the anchor occurs **exactly once** before writing and that the file changed after; it
refuses on any other count.

**`t-count` was proved to still behave like the tip before its counts were believed** —
`npx vitest run src/moves.enpassant.test.ts src/moves.enpassant.hardening.test.ts src/perft.test.ts`
reads **202 passed (202)** on it. An instrumented tree whose behaviour drifted would be counting a
different program.

## The instrument failure, recorded rather than glossed — and it was mine

The first `tsc --noEmit` on `t-count` exited **2**:

```
src/seccount-bench.ts(6,1): error TS1375: 'await' expressions are only allowed at the top level of
a file when that file is a module, but this file has no imports or exports.
```

That is **this gate's own probe file, not the module under test**. It was fixed and the tree
re-checked to exit **0** before any count was believed. The board's standing rule — typecheck every
tree before believing any result — fired here on the measuring role, which is the useful direction
for it to fire in. No verdict moved.

## Cannot run, and pre-existing

- **test-integrity checker** — `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` exits **2**, "cannot read the registry file". `.grugops/test-skips.md` is absent,
  **checked with `ls`**. That is *could not run*, **NOT a pass**, and it is not the exit-1 human-only
  short-circuit. **No registry file was created** — an agent may not author the justification that
  clears its own gate. `quality.test_integrity` is `warn`, and the gate's actual test-integrity step,
  the AGENTS.md skip-count command, reads **0** independently.
- **E2E** — `UNKNOWN - verify`. `quality.ui_e2e` is `ui-or-critical-path`, there is no UI surface
  until `EPIC-006`, and Playwright is not installed.
- **auto-UAT oracles** — `UNKNOWN - verify`; `scripts/check-uat-oracles.js` is absent, and there is
  no `scripts/` directory in this repository at all.

## Not changed

`npm install` not run; `package.json` and `package-lock.json` untouched and byte-identical to `main`
on this branch; **no dependency change**. No `src/` edit of any kind. No perft position added. No
wall-clock assertion added to the suite — this project's standing rule.
