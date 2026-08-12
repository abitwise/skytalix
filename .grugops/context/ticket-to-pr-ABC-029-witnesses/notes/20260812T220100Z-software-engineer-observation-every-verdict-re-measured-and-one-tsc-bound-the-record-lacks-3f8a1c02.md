---
id: 20260812T220100Z-software-engineer-observation-every-verdict-re-measured-and-one-tsc-bound-the-record-lacks-3f8a1c02
kind: observation
by: software-engineer
at: 2026-08-12T22:01:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0011
  - A6.1
  - A6.2
  - A6.3
  - A6.4
  - L3
  - L4
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
supersedes:
---

# Every verdict `A6.3` and `A6.4` stand on was RE-MEASURED at the expression before a line was written — all reproduce — and ONE bound the record does not carry: `A6.3`'s bare-identifier build is rejected by `tsc`

> **`kind: observation`, not `finding`, and that is forced.** There is no `§14-gate` verdict record
> under this task and `context.human_admission` is **`off`**, so no `finding` may be written and
> nothing is self-stamped. **`scripts/context-io.ts` and `scripts/claim.js` do not exist** —
> re-verified AT SOURCE at this hop, not inherited: there is no `scripts/` directory in this
> worktree, and a `find` for `context-io*` / `claim.js` across it (outside `node_modules`/`.git`)
> **and** across the kit root `/Users/olgeroeselg/.grugops/agent-factory` returns nothing. These
> notes are hand-authored and there is **no derived `index.md` / `index.jsonl`** — `notes/` is the
> source of truth.
>
> **`confidence: high` because every cell below was RUN at this hop**, out of tree, against the real
> `src/zobrist.ts` with one line prepended and a blank line after it — the record's own construction.

## 0. The subject, identified before anything was measured

| | |
|---|---|
| worktree | `../cli-chess-abc029-wit` |
| branch | `grugops/ABC-029-witnesses` |
| HEAD at start | `a323f00` |
| the instrument | `src/history-pane.nfr.test.ts`, md5 **`1d33bea667cc792e1fa1fd4030caa718`**, 460 lines, 8 tests |
| `src/history-pane.ts` | md5 **`c4653c4c263c4c417ea34969164ccd86`** — the Orchestrator's baseline, reproduced |
| production modules / test files | **16** / **26** |
| baseline gates | lint **0 errors** (2 pre-existing `biome migrate` infos), typecheck **0**, build **0**, **752/752 on 26 files**, skip **0** |

## 1. The sites, found by `grep` rather than by line number — and `## Test notes` 13's OWN grep does not work

`## Test notes` 13 replaced stale line numbers with greps. Five of its six reproduce exactly. **The
sixth — the one for the regex expression — returns nothing:**

| site | note 13's grep | result |
|---|---|---|
| the regex **expression** | `grep -n 'history\\.ts");/m'` | **exit 1, NO MATCH** |
| the same site | `grep -n 'history\\.ts";/m'` | **`:317`** (executable) and **`:350`** (the docblock quoting it) |

The published pattern carries one `)` too many: the source reads `…history\.ts";/m`, not
`…history\.ts");/m`. **Flagged, NOT fixed** — `## Test notes` is BA/PM's and this hop does not edit a
criterion or a note in the ticket. It is the sixth instance of the defect note 13 exists to end, this
time inside note 13 itself.

Confirmed live and unchanged: guard `it(` **`:302`**, probe `it(` **`:384`**, one docblock
**`:334`**, `productionModulesIn` **`:163`**, `FRAME_PRODUCERS` **`:187`**, `LICENSED_DRIVERS`
**`:212`**, `const directory` **`:314`** — which is neither guard's start, exactly as the ticket
warns. **`/m.test(` occurs EXACTLY ONCE in the file**, which is what makes the drift tripwire in the
sibling `decision` note precise.

## 2. The full matrix, re-run at the expression — every published verdict reproduces

`green` = not matched (the guard stays green); `RED` = matched.

| build | line prepended to `src/zobrist.ts` | required | **landed** | `Wtypebrace` | `Wenumerated` | `Wenumplus` | `Whalfguard` | `Wtypespace` | `Wtypeset` |
|---|---|---|---|---|---|---|---|---|---|
| CONTROL-UNMUTATED | *(none)* | green | **green** | green | green | green | green | green | green |
| `WTYPEBRACE-IMPORT` (`A6.2`) | `import type { GameHistory } from "./history.ts";` | green | **green** | green | green | green | green | green | green |
| `WTYPEREEXPORT` (`A6.2`) | `export type { GameHistory } from "./history.ts";` | green | **green** | green | green | green | **RED** | green | green |
| `WTYPESTAR-IMPORT` (`A6.3`) | `import type * as H from "./history.ts";` | green | **green** | **RED** | green | green | green | green | green |
| `WTYPEDEFAULT-IMPORT` (`A6.3`) | `import type H from "./history.ts";` | green | **green** | **RED** | green | green | green | green | green |
| `WTYPESTAR-EXPORT` (`A6.3`) | `export type * from "./history.ts";` | green | **green** | **RED** | green | green | **RED** | green | green |
| `WTYPESTARAS-EXPORT` (`A6.3`) | `export type * as history from "./history.ts";` | green | **green** | **RED** | green | green | **RED** | green | green |
| **`WEXPORTSTAR-AS`** (`A6.4`) | `export * as history from "./history.ts";` | **RED** | **RED** | RED | **green — MISSED** | RED | RED | RED | RED |
| `WREEXPORT-STAR` (`A6.1` control) | `export * from "./history.ts";` | RED | **RED** | RED | RED | RED | RED | RED | RED |
| `WLAUNDER`'s shape (`A6.1`) | `export { repetitionCounts } from "./history.ts";` | RED | **RED** | RED | RED | RED | RED | RED | RED |
| `WOFFFRAME-BARE` (`A6.1`) | `import "./history.ts";` | RED | **RED** | RED | RED | RED | RED | RED | RED |
| bindings import (arming) | `import { newGame } from "./history.ts";` | RED | **RED** | RED | RED | RED | RED | RED | RED |
| `WTYPETIGHT` (`L3`) | `import type{ GameHistory } from "./history.ts";` | green | **green** | green | green | green | green | **RED** | **RED** |
| `WTYPEBIND` (`L4`) | `import type from "./history.ts";` | — | **green** | RED | green | green | green | green | green |

**The Orchestrator's statement is confirmed by measurement, not accepted: the landed expression is
ALREADY CORRECT for both rows** — green on all four `A6.3` builds (and on `A6.2`'s two), RED on
`A6.4`'s. **Zero characters of the guard were changed, and the regex was never edited.**

## 3. `biome check` — the control caught MY rig before it produced a false verdict, exactly as briefed

My first biome rig reported the **unmutated control** as FAILING. It was my rig, not the constructs:
`biome` resolves its config from the working directory, and I invoked it with the rig path as an
argument from elsewhere, so **it processed zero files and exited 1**. **Every verdict below was
re-taken with the control first, a blank line after the prepended statement, and `biome` run from the
rig root.** This is a different artefact from BA/PM's `organizeImports` one and it fails the same way
— quietly, in the direction of a stronger claim.

| build | `biome check` | note |
|---|---|---|
| CONTROL-UNMUTATED | **PASSES** | the control that made the rest trustworthy |
| the six type-only witnesses | **ALL PASS** | three carry a `noUnusedImports` **warning** (exit 0, not an error) — an artefact of prepending an import nothing uses, not of the construct |
| the three re-export witnesses | **ALL PASS** | no diagnostic |
| **`WTYPETIGHT`** (`L3`) | **FAILS** | **a FORMATTER error** — `Formatter would have printed … import·type·{·GameHistory·}`. **`L3` reproduces independently: no lint-clean build separates `Wtypespace` from the landed expression** |
| `WTYPEBIND` (`L4`) | PASSES | lint-clean, and still not constructible — see below |

## 4. THE ONE THING THE RECORD DOES NOT CARRY: `A6.3`'s bare-identifier build does not TYPECHECK

Measured with `tsc --noEmit` on a throwaway tree, control first:

| build | `tsc` |
|---|---|
| CONTROL-UNMUTATED | **typechecks** |
| `WTYPEBRACE-IMPORT`, `WTYPEREEXPORT`, `WTYPESTAR-IMPORT`, `WTYPESTAR-EXPORT`, `WTYPESTARAS-EXPORT` | **typecheck** |
| the three re-export witnesses and the bindings import | **typecheck** |
| **`WTYPEDEFAULT-IMPORT`** — `import type H from "./history.ts";` | **REJECTED — `error TS1192: Module … has no default export`** |

**`src/history.ts` has ZERO `export default` (`grep -c` = 0), so the bare-identifier cell cannot be
given a compiling build on this tree.** That is the **same root cause as `L4`** and it carries `L4`'s
trigger — the first `export default` added to `src/history.ts` — but `L4` is written about a *value*
default import dying in the probe's child at runtime, and this is a *type-only* default import dying
at the `typecheck` gate. **The record notes the runtime half and not this one.**

**It is a bound on the MUTANT's fidelity, not on the row**, and it is the same class QE already
recorded for `WSWAP` (*"the guard reads SOURCE TEXT, so the verdict is unaffected"*). The witnesses
this hop landed read source text and never compile a build, so their verdict is unaffected too — and
the bound is now written at the site rather than left to be rediscovered. **`A6.3`'s grammar closure
is untouched by it: `import type Default from` is a form TypeScript admits; what this tree cannot
supply is a module with a default export to point it at.** **Flagged for BA/PM; no criterion was
edited and no limit was renumbered.**
