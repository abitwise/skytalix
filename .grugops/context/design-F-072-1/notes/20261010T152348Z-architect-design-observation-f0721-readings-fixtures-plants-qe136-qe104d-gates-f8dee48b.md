---
id: 20261010T152348Z-architect-design-observation-f0721-readings-fixtures-plants-qe136-qe104d-gates-f8dee48b
kind: observation
by: architect-design
at: 2026-10-10T15:23:48Z
verified_by:
confidence: high
refs:
  - F-072-1
  - ABC-072
  - ABC-042
  - ABC-082
  - ABC-059
  - ABC-065
  - ABC-136
  - ABC-104
  - ADR-0036
  - ADR-0011
  - ADR-0004
  - QE-136-a
  - QE-136-b
  - QE-104-d
  - .grugops/context/design-F-072-1/probe/RUN.txt
  - .grugops/context/design-F-072-1/probe/fixtures.out.txt
  - .grugops/context/design-F-072-1/probe/mutants.out.txt
  - .grugops/context/design-F-072-1/probe/sec-mutants.out.txt
  - .grugops/context/design-F-072-1/probe/f-mutants.out.txt
  - .grugops/context/design-F-072-1/probe/qe104d-parsesan.out.txt
  - .grugops/context/design-F-072-1/probe/qe136-ledger.out.txt
  - .grugops/context/design-ABC-072/probe/mutants.out.txt
  - .grugops/context/secnfr-ABC-072/probe/sec-mutants.widened.out.txt
supersedes:
---

# `design-F-072-1` readings: the widened instrument moves no recorded answer and fires on every ruled form. Both `QE-136` survivors reproduce at the tip. `parseSan` never throws on `text` and does throw on a wrong-typed position or list

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Where:** worktree `.claude/worktrees/design-F-072-1`, from wave tip `7f7e6b84`. `src/` is
  untouched.
- **Versions:** Node v26.11.0, TypeScript 5.9.3.
- **Commands:** `probe/RUN.txt`. Each output file logs its load1 (about 6–14; other agents ran in
  parallel).

## O1. Fixtures and baselines, old vs new instrument (`fixtures.out.txt`)

**24 of 24 (pair, limb) rows agree** on b1, edge count, b2, holders and verdict. The rows are the
seven recorded pairs (`dbaf972f^..`, `34c9c026^..`, `4c33b72b^1..`, `460b9f58^1..`,
`088e48db~1..`, `6bfc7b29..5f48753f`, `f76e041..f76e041`) plus `7f7e6b84..7f7e6b84`, × 3 limbs.
- **`ABC-042`:** limb 2 (b1) is still 4 lines (`cli.ts:73,76,81,90`), and (b2) is still
  `cli.ts -> glyph-mode.ts` (holds it). It FIRES.
- **`ABC-082`:** 4 edges, none to a holder, does not fire.
- **`ABC-059`, `ABC-065`, `088e48db`:** 0 production files, does not fire.
- **Baseline at `7f7e6b84`:** 36 production files, **0 / 3 / 0**, holders `cli.ts`,
  `glyph-mode.ts`, `perft-bench.ts`. Raw word hits are 3 / 11 / 6.
- **Baseline at `f76e041`:** 35 files, 0 / 3 / 0.
- **The only difference:** limb 2's raw word count, 9 → 11 (7 → 7 at the 20-file revisions),
  because its regex is now `\bprocess\b`.
- **Cost:** about 1.0 s per limb (1.05 / 1.08 / 1.01 s at load1 ≈ 6).

## O2. Mutant ledgers (`mutants.out.txt`, `sec-mutants.out.txt`, `f-mutants.out.txt`)

**The Architect's nine.**
- **At `6bfc7b29`:** **byte-identical** to `design-ABC-072/probe/mutants.out.txt` (`cmp`; sha-256
  `9ca110f17b0bd103…` on both).
- **At `7f7e6b84`:** identical apart from the `tip` line.

**Security/NFR's thirteen** (their harness, unchanged).
- **At `5f48753f`:** S1–S12 **FIRE**. S11 reads "FIRES (disputed: unresolved, the fail-safe)". S13
  does not fire and is listed (limb 3 words=1). This is **byte-identical** (`cmp`) to the S1–S13
  section of `secnfr-ABC-072/probe/sec-mutants.widened.out.txt`.
- **At `7f7e6b84`:** the same verdicts.

**This hop's F1–F9 at `7f7e6b84`** (NEW against the demonstration, which is the `ABC-072` instrument
plus `limb-ruling.patch`):

| plant | NEW | demonstration |
|---|---|---|
| F1 `require("fs")` in a new `.cjs` | FIRES L1 | silent |
| F2 `require("./glyph-mode.ts")` from a `.cjs` | FIRES L2 (b2) | silent |
| F3 `require(name)`, non-literal | FIRES (disputed) L1 L2 L3 | silent |
| F4 `new globalThis.WebSocket(…)` | FIRES L3 | word hit only |
| F5 `const cp = require("child_process")`, then a new `cp.execSync(…)` | FIRES L3 | word hit only |
| F6 `const { execSync: run } = await import("node:child_process")`, then a new `run(…)` | FIRES L3 | silent |
| F7a a non-literal `import()` added at base; the diff touches only `fen.ts` | does not fire | does not fire |
| F7b the same base; the diff adds a comment to the disputed file | FIRES (disputed) | FIRES (disputed) |
| F8 a new `.d.mts` | does not fire (not production) | does not fire (scanned as production, 2 word hits) |
| F9 `import type { SourceFile } from "typescript"` | does not fire, 1 word hit | the same |

**0 rows** in any output file of this hop read unresolved > 0 together with "does not fire".

## O3. QE-136 re-measured at `7f7e6b84` (`qe136-ledger.out.txt`)

QE's `ledger.sh`, `plantqe136.py` and `plantqe057.py` were used unchanged. Each build is one fresh
`git archive`.
- **`CONTROL`:** 12 passed.
- **`WPERFT-STATIC`:** RED on the licence guard.
- **`XSPLICE+FMT+WPERFT-STATIC`:** 12 passed, lint 0. **It survives.**
- **`XHELPER-NARROW+FMT+WPERFT-STATIC`:** 12 passed, lint 0. **It survives.** On the whole suite it
  reads **52 files / 1608 passed**, rc 0.
- Without FMT, both survivors are lint errors (1 each), so FMT is what makes them gate-clean.
- **`QSCAN-NARROW+FMT+WPERFT-STATIC` and `QLHS-INTERSECT+FMT+WPERFT-STATIC`:** RED on the drift
  tripwire (`R5b` holds).
- **Who uses the helper.** The helper is at `:163`–`:164`. It feeds `:361` (licence), `:573`
  (composer) and `:635` (probe).
- **Who reads this file raw.** `src/cli.test.ts:1694` and `src/render-seam.test.ts:397` match
  `LICENSED_DRIVERS` / `COMPOSITION_ROOT` only.

## O4. `QE-104-d`: `parseSan` (`qe104d-parsesan.out.txt`)

- **Hostile `text`:** 39 values × 4 calls = **156, 0 throws**. The 4 calls cover the start position
  and a castling position, each with and without `legal`.
- **Wrong-typed calls: 7 of 11 throw `TypeError`.**
  - Threw: `(null,"e4")`, `(undefined,"hello")`, `({},"e4")`, `(p,"e4",42)`, `(p,"e4","abc")`,
    `(p,"e4",[null])`, `(null,"O-O",LC)`.
  - Returned: `(p,"e4",[42])` → `no-such-move`; `(null,"e4",L)` → `move`, because the position is
    unread; `(null,42)` → `unreadable`, because the text guard runs first; `(p,"e4",LC)` →
    `no-such-move`, silently wrong.

## O5. Gates (this worktree, after the edits; 15:22:48Z–15:22:56Z, load1 6.26 → 8.40)

- `npm run lint`: exit 0, 100 files.
- `npm test`: exit 0, **52 files, 1608 passed**, 7.34 s.
- Skip capture: **0**. `test-skip-integrity.js … --skip-count 0`: `No findings.`
