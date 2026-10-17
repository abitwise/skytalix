---
id: 20261017T101403Z-software-engineer-decision-abc155-case-shape-15df97ee
kind: decision
by: software-engineer
at: 2026-10-17T10:14:03Z
verified_by:
confidence: high
refs:
  - ABC-155
  - ABC-153
  - ABC-145
  - QE-153-a
  - NFR-008
  - plans/tickets/ABC-155-the-book-sha256-test-never-offers-a-hash-that-differs-only-in-its-last-character.md
supersedes:
---

# SE `ABC-155`: the shape of the near-miss case

Hand-authored and unsealed.

- **Where:** appended at the end of the `ABC-145` describe's `A1/A2` `it`, after the per-file `forEach`
  (every file is restored by then, so the fixture is the unaltered five-file one).
- **File:** `SOURCE_FILES[4]` (`e.tsv`, the last). **Replacement char:** the last hex char moved to the next
  hex digit, modulo 16 (`(parseInt(c, 16) + 1) % 16`), so it always differs and stays lowercase hex.
- **Expected map:** `{ ...expected, [last]: nearMiss }`; every other file keeps its own hash.
- **Assertions:** the same 3-of-3 `filter`/`toEqual` shape as the loop (file name, altered expected hash, actual
  hash = the file's own), then `existsSync(nearOut)` false on a fresh scratch path `abc145-last-char.json`.
- **Why not a new `it`:** the ticket pins 0 new tests (`NFR-008` count pin).
