---
id: 20261104T202906Z-qe-e2e-decision-2ad0fdc6
kind: decision
by: qe-e2e
at: 2026-11-04T20:29:06Z
verified_by: 
confidence: high: the comparison is scripted on git objects and reproduced this hop; the ruling is a reading of the page's A2
refs:
  - qe-ABC-302
  - ABC-302
  - EPIC-011
  - ADR-0046
  - ADR-0035
  - NFR-008
  - R-N8H-1
  - Q-N8H-1
  - QE-244-a
  - qe-ABC-302/20261104T183610Z-qe-e2e-decision-82650a68
  - orch-2026-10-30a/20261104T194656Z-orchestrator-observation-1ea007c5
  - grugops/ABC-302
  - bff22046
  - a5651cbf
  - 44817c44
  - 7f4c513a
supersedes: 
seal: sha256:baf47612cdcd9e41809e15f6d81c7bac00537da44d8f016666a3ecfffd6258cd
---

# qe-ABC-302 A2 ruling: **met, with one named exception on a comment.** All nine moved bodies are byte-identical to base once the nesting indent is removed, and no other row changed. One new comment line cites `ABC-241`, outside A2's list of four ids. LOW is not warranted; logged INFO

QE/E2E, task `qe-ABC-302`. Script `raw/a2.py` (QE's own, not the SE's `a2check.py`) on `git show bff22046` against `git show a5651cbf`. This hop re-ran it and it reproduced `raw/a2.out` exactly. It also read the whole `git diff -w`, because `a2.py`'s header pattern sees only single-line `it(` headers.

## What was read
- **Moved bodies:** R1 +4, R2 +2, R3 +4, R4 +2, R5 +4, R6 +2, R7 +2 (and its whole describe +2), R8 +2 from `cli` into `uci-session`, R9 +2. All IDENTICAL.
- **Other rows:** in the eight files, 0 other bodies changed. The `git diff -w` hunks are all inside the nine rows' regions, the remnants, the deep blocks and R9's constant.
- **Each moved row** is defined only under an existing constant, with no `it.skip` or `skipIf`. R9's new `const RUN_DEEP` in its own file is the option (ii) waiver by name.
- **Allowed by the page:** the one `biome-ignore format` line on R1's deep `it`; the repeated fixtures in R2's and R8's deep describes; `STEP_MS` moving with R2. No import line changed in any touched file.
- **Remnants** match `…bcadd41d`, and each title states what it samples.

## Comment ids (`raw/a2-comments.out`)
- `ABC-230`, `ABC-244` and `ADR-0005` appear on added lines only because those lines moved with a body or a fixture. They are base's text.
- **`ABC-241` is on a new comment:** `src/uci-session.test.ts`, "src/cli.test.ts's ABC-241 A4 row". Read literally, A2 says added comments cite only `ABC-302`, `secnfr-nfr008-1104`, `arch-ABC-302` and `ADR-0046`.

## Ruling
1. The body and sibling clauses are met.
2. The `ABC-241` words name where a row came from, and they match the row's describe title. They point the reader at the right place and change no behaviour, so this is not a FAIL. It stays an INFO gap, and the wording is the SE's to change if anyone wants it.
3. **INFO, separately:** R9's remnant keeps the comment "until the deepening has STARTED `PASSES` root passes", while its clock uses `2 * ITERATIONS`. The comment was copied with the body and is now wrong for the remnant.
