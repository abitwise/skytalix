---
id: 20260812T200100Z-ba-pm-observation-every-row-re-measured-at-source-and-a-fourth-build-2c9f1a04
kind: observation
by: ba-pm
at: 2026-08-12T20:01:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0011
  - A6.1
  - A6.2
  - A6.3
  - A6.4
  - L2
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
supersedes:
---

# `src/` WAS OPENED — read, never written — and every value these two rows stand on was RE-MEASURED. `## Test notes` 12's debt is paid, QE's three type-only kills are FOUR, and the landed expression is already correct for both rows

> **`kind: observation`, not `finding`, and that is forced.** There is no `§14-gate` verdict record
> under this task and `context.human_admission` is **`off`**, so no `finding` may be written and
> nothing is self-stamped. **`scripts/context-io.ts` and `scripts/claim.js` do not exist** —
> re-verified AT SOURCE at this hop, not inherited: there is no `scripts/` directory in this worktree,
> and a `find` for `context-io*` / `claim.js` across it (outside `node_modules`/`.git`) **and** across
> the kit root `/Users/olgeroeselg/.grugops/agent-factory` returns nothing. These notes are
> hand-authored and there is **no derived `index.md` / `index.jsonl`** — `notes/` is the source of
> truth.
>
> **`confidence: high` because every cell below was RUN at this hop**, on a throwaway out-of-tree copy
> under real vitest against the real instrument. **No guard was re-implemented and no verdict is
> attributed.**

## 0. The subject, identified before anything was measured

| | |
|---|---|
| worktree | `../cli-chess-abc029-g1g2` |
| branch | `grugops/refinement-ABC-029-g1g2` |
| HEAD | `fd7717d` |
| **the instrument I read** | `src/history-pane.nfr.test.ts`, **md5 `1d33bea667cc792e1fa1fd4030caa718`**, 460 lines, 8 tests |
| production modules | **16** |
| baseline gates | lint **0 errors** (2 pre-existing `biome migrate` infos; `quality.lint.strict` is `false`), typecheck **0**, **752/752 on 26 files**, skip **0** |

**The md5 is QE's *"after the concurrent comment lands"* digest (`1d33bea6…`), not the one it gated
(`d51b02be…`).** QE re-ran all fourteen verdicts against both and recorded them identical; **I did not
quote that forward — I measured against the digest in front of me.**

## 1. THE CORRECTION THAT MADE THIS HOP DIFFERENT FROM THE LAST ONE

`## Test notes` 12 records that the previous refinement hop took **no measurement** and did **not open
`src/`**, because its brief fenced the directory wholesale. **This hop's brief deliberately reversed
that: read anything under `src/`, write nothing there.** The reversal is what produced everything
below — including a build QE did not name.

**`git status --porcelain` outside `.grugops/` shows exactly one modified file, the ticket. Nothing
under `src/`, `plans/board.md`, `memory-bank/` or any ADR was written.**

## 2. The rig, and what was never opened

One throwaway tree in the session scratchpad: this branch's `src/` copied out of tree with
`node_modules` **symlinked**, `package.json` / `biome.json` / `tsconfig.json` alongside. Each mutant
is a fresh copy; the guard expression is swapped by string replacement against the landed literal, and
the swap **fails loudly** if the literal is not found verbatim.

**Controls run FIRST, before any verdict was believed:** BASE **green 8/8**; `WOFFFRAME-BARE` **RED**
(`expected [ 'zobrist.ts' ] to deeply equal []`); `Wtypebrace` on `WTYPEREEXPORT` **green 8/8**. All
three reproduce QE's recorded messages. **NO other worktree was entered.**

## 3. `A6.3` — QE named THREE builds `Wtypebrace` reds. There are FOUR

| build | line prepended to `src/zobrist.ts` | **landed** | **`Wtypebrace`** |
|---|---|---|---|
| `WTYPESTAR-IMPORT` | `import type * as H from "./history.ts";` | **green 8/8** | **RED** — `expected [ 'zobrist.ts' ] to deeply equal []` |
| `WTYPEDEFAULT-IMPORT` | `import type H from "./history.ts";` | **green 8/8** | **RED** — same |
| `WTYPESTAR-EXPORT` | `export type * from "./history.ts";` | **green 8/8** | **RED** — same |
| **`WTYPESTARAS-EXPORT`** | `export type * as history from "./history.ts";` | **green 8/8** | **RED** — same |
| `WTYPEREEXPORT` (control) | `export type { … } from "./history.ts";` | green 8/8 | green 8/8 — **`Wtypebrace` survives its own sampled spelling** |

**`WTYPESTARAS-EXPORT` is named HERE.** It is the `*` shape's second spelling, and it is in the row
precisely to show that the row pins the **clause shape** rather than the spelling.

## 4. `A6.4` — `Wenumerated`'s miss reproduces, and the control separates it from `A6.1`

| build | line | required | **landed** | **`Wenumerated`** | **`Wenumplus`** |
|---|---|---|---|---|---|
| **`WEXPORTSTAR-AS`** | `export * as history from "./history.ts";` | **RED** | **RED** | **green — MISSED** | RED |
| `WREEXPORT-STAR` (control) | `export * from "./history.ts";` | RED | RED | **RED** | RED |
| `WLAUNDER-1` (control) | `export { repetitionCounts } from "./history.ts";` | RED | RED | RED | RED |
| `WEXPORT-DEFAULT` | `export { newGame as default } from "./history.ts";` | — | RED | RED | RED |
| `WEXPORT-EMPTY` | `export {} from "./history.ts";` | — | RED | RED | RED |
| `WOFFFRAME-BARE` (control) | `import "./history.ts";` | RED | RED | RED | RED |

**The `WREEXPORT-STAR` control is why `A6.4` is not `A6.1`'s star row under a new name:**
`Wenumerated` is RED on it and green on `WEXPORTSTAR-AS`, so the two rows separate.

## 5. THE ANSWER TO THE ROUTING QUESTION, MEASURED

**The landed expression is ALREADY CORRECT for both rows.** Green on all four `A6.3` builds, RED on
`A6.4`'s. **So the Engineer's hop adds WITNESSES and changes ZERO characters of the guard.** QE's read
— *"two BA/PM rows on a rig that already exists"* — is confirmed by measurement rather than accepted.

**This matters beyond the row-writing:** the board records `ABC-029` held at `In Review` because *"that
gate would measure a file two owed rows are about to change."* **The two owed rows do not change that
file.** The premise of the hold is discharged by measurement. **The scheduling call is the
Orchestrator's and this role does not make it.**

## 6. Two builds constructed and DISCARDED as invalid — recorded so nobody re-runs them as evidence

- **`WTYPEBIND`** — `import type from "./history.ts";`, a default import whose binding is literally
  named `type`. **The regex guard is GREEN on it** (verified at the expression: `type\b` matches, so
  the lookahead suppresses the line) — a **real false negative** of the landed expression. But the
  build is **not constructible here**: `src/history.ts` has **zero** `export default`, so the probe's
  child dies with `SyntaxError: The requested module './history.ts' does not provide an export named
  'default'`. **A wrong-reason red, same class as `## Test notes` 10.** Marked as `L4` in the ticket
  with a trigger, not written as a row.
- **`WEXPORT-STRING`'s first biome verdict was MINE and it was WRONG.** My initial mutation prepended a
  line with a single `\n`, which put it against the file's docblock and made `biome check` fail on
  `assist/source/organizeImports` — **an artefact of my mutation method, not of the construct.** Caught
  by running the unmutated control through biome; every biome verdict in these notes was re-taken with
  a blank line after the prepended statement, and the **unmutated `zobrist.ts` passes** as the control.
  **Recorded rather than quietly fixed, because a containment claim was about to be built on it.**
