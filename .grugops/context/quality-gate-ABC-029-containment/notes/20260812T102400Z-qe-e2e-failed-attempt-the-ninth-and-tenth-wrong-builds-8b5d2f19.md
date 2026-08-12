---
id: 20260812T102400Z-qe-e2e-failed-attempt-the-ninth-and-tenth-wrong-builds-8b5d2f19
kind: failed-attempt
by: qe-e2e
at: 2026-08-12T10:24:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0011
  - A6.1
  - A6.2
  - A5.2
  - L2
  - src/history-pane.nfr.test.ts
supersedes:
---

# I went looking for the NINTH wrong build and found TWO — `Wtypebrace` and `Wenumerated` pass ALL FOURTEEN required verdicts and are both wrong. The landed build is correct on both; the CRITERIA are what did not catch them

> **`kind: failed-attempt`** — the record of builds constructed, run and rejected, so no later hop
> retries one. Soft kind, no stamp required, none claimed. **Six expression variants × the full row
> matrix, every cell a run.**

## The matrix — `✓` = the build produces the row's required verdict, `✗` = the row kills it

| build | BASE 16 | BASE 17 | `A6.1` bare | `A6.1` star | `A6.1` LAUNDER 16 | `A6.1` LAUNDER 17 | `A6.2` type/zobrist | `A6.2` type/panel | `A6.2` DYN 16 | `A6.2` DYN 17 | `A5.3` | `A5.4` ×2 | `A5.6` | **killed by** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **landed** (ruled) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| **`Whalfguard`** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **✗** | **✗** | ✓ | ✓ | ✓ | ✓ | ✓ | **`A6.2`'s two type-only rows, AND NOTHING ELSE** |
| **`Wmirror`** | **✗** | **✗** | — | — | ✓ | — | ✓ | — | — | — | — | — | — | **`A5.1`/`A5.2`** — BASE goes RED on both trees |
| **`Wnomultiline`** | ✓ | **✗** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **✗** | ✓ | ✓ | ✓ | **`A5.2`, and `A6.2`'s `WPERFT-DYN` on 17** |
| **`Wtypeanywhere`** | ✓ | **✗** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **✗** | ✓ | ✓ | ✓ | **`A5.2`, and `A6.2`'s `WPERFT-DYN` on 17** |
| **`Wtypebrace`** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **NOTHING ON THE PAGE — the ninth wrong build** |
| **`Wenumerated`** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **NOTHING ON THE PAGE — the tenth** |

## `Wtypebrace` — the ninth, and it is `Whalfguard`'s defect arriving through the door `A6.2` opened but did not close

```
landed      /^(?:import|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m
Wtypebrace  /^(?:import|export)\s+(?!type\s*\{)(?:[^;]*from\s+)?"\.\/history\.ts";/m
```

**One token. `(?!type\b)` → `(?!type\s*\{)`** — and it is not obviously wrong by reading. It is the
lookahead you write if you take the shape of `A6.2`'s two rows literally: **both of them, and both of
BASE's two `import type` lines, are the `type { … }` form.** Nothing on the page shows any other
type-only spelling, so an Engineer who checks against the rows rather than against TypeScript
produces exactly this.

**What it costs, measured on three CORRECT builds no row constructs — each is erased at runtime and
each must stay GREEN:**

| build | line prepended to `src/zobrist.ts` | **landed** | **`Wtypebrace`** |
|---|---|---|---|
| **`WTYPESTAR-IMPORT`** | `import type * as H from "./history.ts";` | **green** | **RED** — `expected [ 'zobrist.ts' ] to deeply equal []` |
| **`WTYPEDEFAULT-IMPORT`** | `import type H from "./history.ts";` | **green** | **RED** — same |
| **`WTYPESTAR-EXPORT`** | `export type * from "./history.ts";` | **green** | **RED** — same |

**This is the same false-positive class `A6.2` exists to forbid, in three spellings `A6.2` does not
sample.** `Whalfguard` turns one correct type-only build red; `Wtypebrace` turns three red — and
`Whalfguard` dies on the page while `Wtypebrace` does not.

**The landed build is CORRECT on all three**, so this is a **criteria gap and not a code defect.**
`(?!type\b)` with a word boundary is the right token and the Engineer landed it verbatim.

*(Control, so the naming is honest: `Whalfguard` is also green on the two `import type` spellings —
it only fails on `export type * from` — so the three builds above are not a re-run of `A6.2` under a
new name; they separate `Wtypebrace` from both the landed build and `Whalfguard`.)*

## `Wenumerated` — the tenth, and it fails in the OTHER direction

```
Wenumerated /^(?:import\s+(?!type\b)(?:[^;]*from\s+)?|export\s+\*\s+from\s+|export\s+\{[^;]*\}\s+from\s+)"\.\/history\.ts";/m
```

**The three forms `A6` names, written as an ENUMERATION instead of as a generalisation.** It reads
like a more careful expression than the ruled one — it names exactly what the criterion names. It
passes every row.

**It misses a real runtime importer:**

| build | line prepended to `src/zobrist.ts` | required | **landed** | **`Wenumerated`** |
|---|---|---|---|---|
| **`WEXPORTSTAR-AS`** | `export * as history from "./history.ts";` | **RED** | **RED** — `expected [ 'zobrist.ts' ] to deeply equal []` | **green — MISSED** |

`export * as ns from` is ordinary ESM, it evaluates the module body, and it is the exact laundering
shape `WLAUNDER` exists for — republishing the history module's API from an unlicensed module. **The
landed build catches it because it generalises; `A6.1` does not require generalisation, only the two
literal spellings it names.**

## The two candidates that WERE caught — and the row that caught them is not the one anyone would guess

`Wnomultiline` (the ruled expression with `/m` dropped — an expression that can only see an import on
**line 1** of a file) and `Wtypeanywhere` (`(?!type\b)` → `(?![^;]*\btype\b)` — exclude any statement
mentioning `type`) both pass **every row on the 16-file tree**, because **every mutant in the record
is constructed by PREPENDING to line 1.** On the record's own construction convention they are
invisible.

**`A5.2` kills both**, and the reason is worth writing down because it is not what `A5.2` looks like:
`src/turn-loop.ts:52` is

```
import { type GameHistory, gameStatusOf, playMove, takeBack } from "./history.ts";
```

— an **inline** type modifier, on **line 52**. So `A5.2` is not merely "BASE is green on the tip": it
is **the only POSITIVE-detection witness in the entire criteria set** — the only row that requires the
guard to actually FIND a real runtime importer, at a real line number, written the way this codebase
really writes one. It is doing far more work than its wording suggests, and it is the row that closes
the over-anchored half of `L2`.

## What this says about `L2`, measured

`L2` records that `A6` pins the FORM SET and not the ANCHOR, names the **unanchored** variant, and
says *"`ADR-0011`'s ruled expression IS anchored, so an Engineer landing it verbatim satisfies this
by construction."* Two corrections, both measured:

1. **The other anchoring direction is not open.** `Wnomultiline` is the over-anchored variant and it
   **dies on `A5.2`** — so that half is closed by a ROW, not by construction, and `L2` does not
   mention it.
2. **The false-positive risk `L2` attributes to the unanchored variant is carried by the ANCHORED
   ruled expression too.** See the sibling `observation`; `L2`'s *"satisfies this by construction"* is
   measurably too strong.

## Not retried, and why — recorded so nobody re-runs them as evidence

- **`Wmirror`** (`(?!type\b)` on the `export` branch only) is *not* a live risk: BASE holds two
  `import type … from "./history.ts"` lines, so `A5.1`/`A5.2` red it immediately
  (`expected [ Array(2) ] to deeply equal []`). **The asymmetry is the whole reason `A6.2` must exist**
  — the `import` side of the type-blindness is witnessed by BASE, the `export` side is structurally
  incapable of being witnessed by it. That is now measured rather than argued.
- **`Wexportsonly`** (`ADR-0011` alternative 11's discriminator applied to the static forms) was
  reasoned through and **not built**: `perft-bench.ts` exports nothing, so `A5.4`'s `WPERFT-STATIC`
  row reds it. Recorded as considered-and-dropped, not measured, and **not claimed**.
