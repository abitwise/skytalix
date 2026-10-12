---
id: 20261012T050042Z-qe-e2e-observation-abc145-gap-register-8deadc79
kind: observation
by: qe-e2e
at: 2026-10-12T05:00:42Z
verified_by:
confidence: high
refs:
  - ABC-145
  - QE-145-a
  - QE-145-b
  - QE-145-c
  - QE-145-d
  - QE-145-e
  - QE-145-f
  - QE-145-g
  - 20261012T050042Z-qe-e2e-observation-abc145-plants-b9f6d36a
supersedes:
---

# QE `ABC-145`: gap register (none blocking)

This note is hand-authored and unsealed.

| id | severity | owner | gap |
|---|---|---|---|
| `QE-145-a` | LOW | SE (optional follow-up) | **The lane alters only `a.tsv`, and the fixture's `b`..`e` are header-only, so all four share one hash.** A check that covers only the first file (`M05`) passes the lane. Altering a non-first file, or giving the five files distinct bodies, would kill it. QE's own plant did both (`c.tsv` and `e.tsv`, 5 distinct hashes): 3 of 3. |
| `QE-145-b` | LOW | BA/PM / Architect (by design) | **No lane test pins the command-line wiring.** `M07` (the `main` block calls `writeBook` directly) passes all 19 tests. Only the `A4` delivery run catches it. The ticket's 0-spawn fence makes this a design residual, not a defect. An in-process reading of `compile.ts`'s source text could pin it if wanted. |
| `QE-145-c` | INFO | — | **A hash on decoded text (`M01`) passes the lane.** It differs from raw bytes only when a source holds a literal U+FFFD that an invalid byte replaces. The real sources hold none and round-trip byte-exact, so on the pinned data the two give the same answer. |
| `QE-145-d` | INFO | — (SE declared it) | **Check-then-read gap.** `checkThenWriteBook` hashes each file, and `writeBook` then reads it again. So the bytes that are compiled are not the bytes that were checked. This applies to a local single-user directory. The SE's decision note names it and keeps it, so that `writeBook` stays byte-unchanged (`A6`). |
| `QE-145-e` | LOW | BA/PM (ticket wording) | **`A4`'s negative run, as written ("append one byte … exits non-zero, names that file"), does not tell the check apart from the existing validator.** The **base** compiler, with no check, also exits 1 and names the file on QE's appended `x` (`Error: b.tsv:783: 1 columns, not 3`), and on an appended newline. The run that does tell them apart: the hash text in the message (both the SE's run and QE's carry it), or a byte flipped in place, where **base exits 0 and rewrites `book.json`** (`cmp` 1) and head exits 1. `A4` is MET on content. Only the criterion's wording is weak. |
| `QE-145-f` | INFO | BA/PM (ticket wording) | **The ticket says "the 9 existing `it` blocks"; the base file holds 10:** 9 `it` plus 1 `it.each` over 8 rows, which is 17 tests. QE counted it independently and agrees with the SE. All 10 are byte-unchanged. QE did not edit the ticket prose. |
| `QE-145-g` | INFO | — | **An extra `SOURCE_SHA256` key that no file has (`M08`) passes the lane.** Only typecheck (a mandatory gate) refuses it. `A3` iterates `SOURCE_FILES`, so an extra key is not its business. |
