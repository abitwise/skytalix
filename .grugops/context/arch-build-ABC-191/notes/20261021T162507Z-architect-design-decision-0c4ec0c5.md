---
id: 20261021T162507Z-architect-design-decision-0c4ec0c5
kind: decision
by: architect-design
at: 2026-10-21T16:25:07Z
verified_by: 
confidence: high (measured in scratch; no timing)
refs:
  - ABC-191
  - AR-188-BINARY
  - QE-188-a
  - R-188-b
  - R-191-a
  - ADR-0036
  - ADR-0036 S1
  - V1.2.5
  - NFR-008
  - 01836fff
  - 56d7215f
  - 11245e3d
  - 6b79aa51
  - 341da4c1
  - d722a6b6
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/r2-mutants.out.txt
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
  - 20261021T162500Z-architect-design-observation-7eb389c5
  - 20261021T154400Z-ba-pm-decision-2edce8cb
  - 20261021T153032Z-security-nfr-decision-f5843a71
  - 20261021T153240Z-orchestrator-decision-9f5ca4b4
supersedes: 
seal: sha256:1221b2dee4f5d234c922758c853ac82beb1f9d03347ec8f8eb65768b4b19caa2
---

# ABC-191 design: the instrument's one diff call gains `--text --no-textconv`, nothing else; the harness compares the two binary rows' limbs 2/3 with `341da4c1` on X1, masked; `ADR-0036` § S1 gains an append-only block. Built at `grugops/ABC-191`, 0 `src/` lines

Cites the page `plans/tickets/ABC-191-…md` § Scope / § Out of scope / § Acceptance, BA/PM `…decision-2edce8cb`, Security/NFR `…decision-f5843a71` § 3 (`## Scope` / `## Risks`: the fix shape and the close term) and the owner record `…orchestrator-decision-9f5ca4b4` as authoritative. Readings: `…architect-design-observation-7eb389c5` (this task).

## Context and constraint
`AR-188-BINARY`: when git treats a production file as binary (a NUL byte; a `-diff` attribute from a committed `.gitattributes`, `.git/info/attributes` or `core.attributesFile`), `git diff -U0` prints `Binary files … differ` and no hunk, so every limb is blind to that file. A `diff=<driver>` with a `textconv` replaces the file's lines with the driver's. The instrument has exactly one diff call (`changedLines`), and it is the only reader of changed lines.

## Chosen design
- **Instrument (`11245e3d`):** `git("diff", "-U0", "--no-renames", "--text", "--no-textconv", b, h, "--", "src")`. One argv, 1 line changed, no comment changed. `--text` makes git emit hunks whatever any attributes source says; `--no-textconv` keeps the hunks on the file's bytes, not a driver's output. Both are needed (A3): `--text` alone still reads the driver's map; `--no-textconv` alone is still blind.
- **Harness (`56d7215f`):** `BIN-NUL` and `BIN-ATTR` after `REN`, each X1's edit plus its mark, expecting FIRES and `src/book-file.ts@<base>`. X1's row stores `341da4c1`'s limbs 2/3 on X1, masked (`XR`), taken while X1 is checked out. A seventh `row` argument `X1` makes a row compare its own masked limbs 2/3 with that instead of running `341da4c1` on the same plant. `mask` rewrites `..<hex>` to `..<plant>` on the `  diff ` line only. The other 10 rows' code path and output are unchanged (verified line for line, ids masked). `mk`'s file check names `.gitattributes` for `BIN-ATTR`.
- **ADR (`6b79aa51`):** the heading `#### Binary-flagged files read as text — 2026-10-21` with `(ABC-191)` in a code span after the `ABC-188` block, 22 `+` / 0 `−`, stating (i)–(iii) and the rollback.

## Alternatives rejected
- **`-a` short form:** same flag; the long form is greppable and matches the page.
- **Overriding attributes per call (`-c core.attributesFile=/dev/null`, `GIT_ATTR_NOSYSTEM`):** covers only some sources (not a committed `.gitattributes` in the tree), and adds env/config surface for no gain over `--text`.
- **Keeping the same-plant `341da4c1` comparison for the new rows:** holds the instrument to `341da4c1`'s blindness (`production files changed: 0`); rejected by the page.
- **Taking the X1 reference at the binary row:** a checked-out `-diff` line blinds the reference too (BA/PM measured); so it is taken at X1's row.
- **A textconv or `.git/info/attributes` row:** fenced out by the page; read by hand (A6) / measured at cut.

## NFR and security impact
- `V1.2.5` held: one `execFileSync` with an argv, no shell; 87 git calls, equal to base (A7).
- `NFR-008`: 0 / 0 / 0. The instrument and harness run by hand, outside `npm test`. No timing taken.
- No `plans/nfr-catalog.md` change: no NFR owner or target moves.
- `AR-188-BINARY` closes on QE's read of `A2`–`A7`; the Orchestrator records it, and the `--numstat` stand-in retires at merge.

## Migration and rollback
Readings before `11245e3d` reproduce from `clause-b.mjs` at `d722a6b6`. Revert `11245e3d`, and the stand-in returns at every routing and merge.

## Residuals (INFO; none against a criterion)
- `R-191-a`: `printf '%-7s'` in `row` pads plant names to 7; `BIN-ATTR` is 8, so its header line has no padding space before the range. Cosmetic; the existing rows' bytes are unchanged.
- `R-188-b` carries over: `mk` checks the file list, not each edit inside a file. The NUL byte was read in the clone by `od -c` (`…observation-7eb389c5`).
- `UNKNOWN - verify`: `core.attributesFile` carrying `-diff` was not planted; `--text` does not consult the attribute's source, per git's documentation.

## Open questions
None for the owner.
