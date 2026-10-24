---
id: 20261024T123712Z-ba-pm-observation-961e38eb
kind: observation
by: ba-pm
at: 2026-10-24T12:37:12Z
verified_by: 
confidence: high (read at 052ae3ad with grep and git diff; nothing run or timed)
refs:
  - bapm-fold-ABC-212
  - ABC-212
  - ABC-204
  - EPIC-004
  - EPIC-008
  - ADR-0044
  - ADR-0045
  - NFR-004
  - arch-design-ABC-212/…d2c68ace
  - qe-ABC-212/…e58d4635
  - owner-word-2026-10-23/…2c6fa3b1
  - grugops/qe-ABC-212
  - 052ae3ad
supersedes: 
seal: sha256:335f424fe1cf15da372564004b8efa365457c67b71a47812a10282f98f3fcb30
---

# ABC-212 merge folds: what was read, and where the folded facts are restated

BA/PM, task `bapm-fold-ABC-212`, on `grugops/bapm-fold-ABC-212`, cut from `grugops/qe-ABC-212` `052ae3ad`. Records only. Nothing was run or timed.

## Sources
- Architect `arch-design-ABC-212/…d2c68ace`, the "BA/PM at the merge" item. QE `qe-ABC-212/…e58d4635` repeats it under § Owed by others.
- The fold wording comes from `ADR-0045` § AMENDMENT 2026-10-24: A4 ("The `ADR-0044` folds this brings": D4.1, D4.4, D11, D5), A3 (the clamp), and § Consequences (`ABC-204`).
- The `ABC-212` page § Design ruling, interaction 4, and § Dependencies ("read as ceiling(level) − budget").

## Code read at 052ae3ad (to check the wording, not to change it)
- `src/levels.ts`: `LEVELS` has 6 = 5 000/0 and 7 = 30 000/0, and `HARDEST_LEVEL = 7`.
- `src/engine.ts`: `HARD_CEILING_MS = 32_000`.
- `src/uci-session.ts`: the option line reads `max ${HARDEST_LEVEL}`, and `setoption` checks `Object.hasOwn(LEVELS, value)`, so 1–7 are accepted. The D4.1 line `budget = HARD_CEILING_MS` is unchanged.

## Lines in `ADR-0044` that restate the folded facts (outside the four named decisions)
- D3 table, `uci` row: `max 5`.
- D3 table, `setoption` row: "an integer from 1 to 5".
- § Consequences: "Analysis is capped at 5 s per `go` (Q3)".
- § Consequences: "out of book at levels 3–5, the engine plays deterministically". The 2026-10-19 fold missed this line; it already read level 5 only after `ABC-174`.

The history sections (§ Revision R1/R3, § Context, the D2 repo-fit table row, § Alternatives row 5, and § Owner questions Q3) still say 5 s or 1–5. They are left as history, and the Status block says so.

## Overlap
- `git diff 052ae3ad main` touches neither `ADR-0044` nor the `ABC-204` page.
- Neither do the sibling branches `grugops/security-nfr-ABC-212` and `grugops/scribe-runbook-ABC-212`.
- The `grugops/ABC-204` branch does not edit the `ABC-204` page.
- So the merge has no textual conflict on these two files.

## Line drift (no action)
- The `ABC-204` page cites `src/engine.ts:129`. The constant is at `:134` on this tree; the erratum replaces that citation with `NFR-004` clause B.
- The Architect cites `src/uci-session.ts:211`. The fold names "the code line" and gives no line number.
