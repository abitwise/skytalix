---
id: 20261012T075500Z-software-engineer-decision-abc145-check-shape-ee17560c
kind: decision
by: software-engineer
at: 2026-10-12T07:55:00Z
verified_by:
confidence: high
refs:
  - ABC-145
  - ADR-0037
  - QE-093-b
  - NFR-008
  - plans/tickets/ABC-145-the-book-compiler-stamps-its-source-commit-and-never-checks-the-source-bytes.md
supersedes:
---

# SE `ABC-145`: the shape of the check

This note is hand-authored and unsealed. No §14 gate verdict exists on this install, so it carries no `sha` / `gate_run` / `content_hash` triple.

- **`SOURCE_SHA256`** is a `Record` keyed by file name (`a.tsv`..`e.tsv`), not an array parallel to
  `SOURCE_FILES`. A keyed record cannot be misaligned by position, and `A3` reads it by file name.
- **`checkThenWriteBook(sourceDir, outPath, commit, expected)`** is the command-line path. It hashes each
  file's raw bytes with `node:crypto` and throws `<file>: sha256 is <actual>, expected <expected>` on the
  first mismatch. Only then does it call `writeBook`. The `main` block calls it with `SOURCE_SHA256`.
  `expected` is a required parameter, so a fixture passes its own hashes (ticket scope 2).
- A refusal is a thrown error, the same as the six `compileBook` refusals. The command line exits 1 on it.
- Each file is read twice (once for the hash, once inside `writeBook`). This keeps `writeBook` and
  `compileBook` byte-unchanged (`A6`). The check-then-read gap is a local, single-user directory, so it
  was not closed.
- The `A1` alteration changes one byte **in place inside a name** (`Italian Game` → `Italian Gamf`). The
  altered fixture is still well-formed, so only the hash can refuse it. An appended byte could be refused
  by `compileBook` for a column-count reason, which would hide a missing check.
