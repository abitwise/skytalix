---
id: 20261012T064939Z-software-engineer-decision-abc153-fixture-shape-31329840
kind: decision
by: software-engineer
at: 2026-10-12T06:49:39Z
verified_by:
confidence: high
refs:
  - ABC-153
  - ABC-145
  - QE-145-a
  - NFR-008
  - plans/tickets/ABC-153-the-book-sha256-test-alters-only-the-first-source-file.md
supersedes:
---

# SE `ABC-153`: the shape of the per-file check

Hand-authored and unsealed. No §14 gate verdict exists on this install, so no `sha` / `gate_run` / `content_hash` triple.

- **Distinct hashes:** `fixture("abc145", …)` is still called (it makes the directory; the helper is not
  edited), then each of the five files is overwritten in place with `HEADER` plus ONE `GOOD_ROWS` row,
  file `i` taking row `i`. Five different rows give five different sha256 values; the test asserts
  `new Set(Object.values(expected)).size === 5`.
- **Per-file alteration:** inside the existing `A1/A2` `it`, a `forEach` over `SOURCE_FILES` lower-cases the
  first letter of that file's opening name (one ASCII byte, in place, the file stays well formed), runs
  `checkThenWriteBook` against a fresh `abc145-altered-<file>.json`, asserts the 3-of-3 refusal content and
  that the output does not exist, then RESTORES the file. Restoring (rather than a fresh directory per
  file) keeps one fixture and makes each iteration alter exactly one file, so the check's first-mismatch
  throw can only name the file under test.
- **Control (`A2`)** stays where it was, before the loop, unaltered.
- Rejected: a fresh directory per file (five more `fixture()` dirs, no extra power); a separate `it`
  or `it.each` (would change the test count; `A4` pins it equal to base).
