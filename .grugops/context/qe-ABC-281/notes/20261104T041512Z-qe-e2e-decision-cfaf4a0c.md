---
id: 20261104T041512Z-qe-e2e-decision-cfaf4a0c
kind: decision
by: qe-e2e
at: 2026-11-04T04:15:12Z
verified_by: 
confidence: high: the comparison is scripted on git objects; the ruling is a reading of the page's A2 against condition 2
refs:
  - qe-ABC-281
  - ABC-281
  - EPIC-011
  - ADR-0046
  - ADR-0050
  - ADR-0035
  - ADR-0032
  - NFR-008
  - R-N8H-1
  - R-281-a
  - Q-N8H-1
  - QE-208-a
  - QE-208-c
  - QE-087-d
  - ABC-230
  - ABC-087
  - src/search.null-move.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - AGENTS.md
  - se-ABC-281/20261104T034410Z-software-engineer-decision-82caa3b2
  - se-ABC-281/20261104T034410Z-software-engineer-observation-7fafddb2
  - se-ABC-281/20261104T034427Z-software-engineer-observation-4e6d364a
  - arch-ABC-281/20261104T032140Z-architect-design-decision-d7b2b02b
  - arch-ABC-281/20261104T032140Z-architect-design-observation-e969c2f0
  - grugops/ABC-281
  - 748d4fa3
  - ea08d7b6
  - 9a8d7493
  - qe-ABC-281/20261104T035245Z-qe-e2e-decision-b3d88219
  - fb2a0ee5
  - secnfr-nfr008-headroom/20261104T025651Z-security-nfr-observation-f925027f
  - UAT
supersedes: 
seal: sha256:36c85f98ff6c26b341b5240f8cdd53e2120b176feb9e830688c3ededa054bb66
---

# qe-ABC-281 A2 ruling: **met.** The moved bodies are byte-identical to base apart from a uniform nesting indent (+4 / +2 / +2 spaces on every line). The one `biome-ignore format` line sits outside the body. Neither is a production change. Logged as INFO gaps, not a FAIL

QE/E2E, task `qe-ABC-281`. Script `raw/a2.py` (QE's own, not the SE's `a2check.py`), run on `git show 748d4fa3` against `git show ea08d7b6`.

## What was read
| row | body lines (base / tip) | literal bytes equal | every tip line = base line with exactly +d spaces |
|---|---|---|---|
| R1 `QE-208-a` (`src/search.null-move.test.ts`) | 6 / 6 | no | **yes, d = 4** |
| R2 `ABC-230` A4 (`src/engine.test.ts`) | 14 / 14 | no | **yes, d = 2** |
| R3 levels A9 (`src/levels.test.ts`) | 15 / 15 | no | **yes, d = 2** |

- **Unchanged, literally:**
  - R1's `sweep` is one copy, 24 lines, the same sha256 at base and tip, and `READINGS` is one line (condition 2);
  - R2's sibling "the three test-only doors ignore prior keys…" (14 lines);
  - "A7 — seeded" (5 lines).
- `git diff` has four hunks, all inside the three rows' regions. The removed `expect(` lines all belong to the moved rows and reappear, indented, in the deep blocks.
- Each moved row is defined only under its file's existing `RUN_DEEP` (`SEARCH_DEEP` / `ENGINE_DEEP`). There is no `it.skip`, no `skipIf` and no new environment variable.
- Added comments cite only `ABC-281` and `secnfr-nfr008-headroom`. That includes the `biome-ignore` line.
- Each remnant's title states what it samples: readings 8 and 10 on `chooseMoveWithoutTaper`; kr-corner, startpos and position-6; seed 1 over the first 10 of the thirty.

## Ruling
1. **The indent-only difference meets "body byte-identical".**
   - The page's own rule says "only its enclosing block … change", and an enclosing block adds indent. Condition 2's mandated R1 shape nests the row two blocks deeper. Biome's 2-space indent then forces +4. No literal reading of A2 can be met by any placement the Architect allowed, so the rule must mean the uniform nesting indent aside.
   - Every line carries exactly +d spaces with nothing else changed, so no token, literal or blank line moved.
   - **INFO gap (records):** future cuts should write "byte-identical once the nesting indent is removed".
2. **The single `// biome-ignore format: …` line meets A2.**
   - It sits on the line before R1's deep `it(` header. A2 bounds the body as the line after the header through `});`, so the line is outside the body.
   - It is a comment citing only `ABC-281`, and it is test code, not a production change.
   - Without it, Biome would reflow the first body line (over 100 columns at +4) and add a trailing comma. The body would then not be identical.
   - **INFO gap:** the formatter no longer checks that one deep-only `it(…)` statement. A later edit to it is not auto-formatted. Lint is green (146 files).
3. **INFO (cosmetic):** R1's deep row's full name repeats the describe title, "…byte-identical QE-208-a — …byte-identical [deep, SEARCH_DEEP=1] position-6…". That follows from condition 2's inner-describe title. The page's `-t` line matches it ("1 passed"), and the remnant's name has no " [deep".
