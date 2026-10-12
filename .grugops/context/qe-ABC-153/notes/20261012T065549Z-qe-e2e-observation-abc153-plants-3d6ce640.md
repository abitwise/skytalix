---
id: 20261012T065549Z-qe-e2e-observation-abc153-plants-3d6ce640
kind: observation
by: qe-e2e
at: 2026-10-12T06:55:49Z
verified_by:
confidence: high
refs:
  - ABC-153
  - ABC-145
  - QE-153-a
  - QE-153-b
  - QE-153-c
  - tools/opening-book/compile.ts
  - tools/opening-book/book.test.ts
  - 20261012T065549Z-qe-e2e-observation-abc153-readings-cfba105e
supersedes:
---

# QE `ABC-153`: break-the-test plants the ticket does not name (RUN 2026-10-12)

Hand-authored and unsealed. Every plant is in the `git archive 917df052` scratch copy OUTSIDE the repo; the
worktree was never planted (`git status --porcelain` empty). Lane `npx vitest run tools/opening-book/book.test.ts`.
**No timing reading.**

## Compiler mutants (in `checkThenWriteBook`), against the base test and the head test

| id | mutation | base test | head test | head catches? |
|---|---|---|---|---|
| `Q-LAST` | check covers only the LAST file: `SOURCE_FILES.slice(-1)` | exit 1, 18/1 (`a.tsv` not refused) | exit 1, 18/1 (`[ 'a.tsv', …(2) ]`) | **yes** (base caught it too) |
| `Q-SKIPC` | skips a middle file: `.filter((f) => f !== "c.tsv")` | **exit 0, 19 passed** | **exit 1, 18/1** — `expected [] to deeply equal [ 'c.tsv', …(2) ]` | **yes** (new: base missed it) |
| `Q-CASE` | `actual.toLowerCase() !== expected[file].toLowerCase()` | exit 0, 19 passed | **exit 0, 19 passed** | **no** — equivalent on every reachable input (`QE-153-b`, INFO) |
| `Q-PREFIX` | `actual.slice(0, 8) !== expected[file].slice(0, 8)` | exit 0, 19 passed | **exit 0, 19 passed** | **no** (`QE-153-a`, LOW) |
| `Q-PARTIAL` | `writeFileSync(outPath, "")` before the check loop (partial output, then throw) | exit 1, 18/1 | exit 1, 18/1 — `expected true to be false` (the `existsSync(out)` row) | **yes** |
| `Q-NOACTUAL` | refusal `${file}: sha256 mismatch, expected ${expected[file]}` (no actual hash) | exit 1, 18/1 | exit 1, 18/1 — `[ 'a.tsv', …(1) ]` vs `[ 'a.tsv', …(2) ]` | **yes** |
| `Q-EMPTYFILES` | `SOURCE_FILES = []` (the loop's vacuity) | exit 1, 9/10 (base `it` dies on `ENOENT a.tsv`) | exit 1, 9/10 — the `A1/A2` `it` fails `expected +0 to be 5` (the size assertion) | **yes** — the loop cannot pass vacuously |

**Why `Q-PREFIX` survives:** a one-byte alteration changes the whole digest, so the actual and expected hashes
already differ in the first 8 hex chars; nothing in the test hands the check an expected value that shares a
prefix with the actual one. **Why `Q-CASE` survives and does not matter:** `createHash(...).digest("hex")` is
lowercase, and all five pinned `SOURCE_SHA256` values are lowercase, so the two comparisons agree on every input
the tool can see.

## Test-quality plants (head test edited in scratch, compiler unmutated)

| id | edit | reading | what it shows |
|---|---|---|---|
| `T-NORESTORE` | delete the restore line at the loop's end | exit 1, 18/1 — `expected [] to deeply equal [ 'b.tsv', …(2) ]` | a failed restore makes the NEXT file's iteration fail loud (the check throws on the still-altered earlier file, so the 3-of-3 names the wrong file). It **cannot mask** a later file. The restore after `e.tsv` is read by nothing (`QE-153-c`, INFO, harmless) |
| `T-COLLIDE` | `e.tsv` gets `GOOD_ROWS[3]` (= `d.tsv`'s row) | exit 1, 18/1 — `expected 4 to be 5` | the size-5 assertion fails when two rows collide |
| `T-NOOPALTER` | `renamed = name` (the alteration changes nothing) | exit 1, 18/1 — `expected '4ff4c0b1…' not to be '4ff4c0b1…'` | the per-iteration `not.toBe(expected[file])` guard catches a no-op alteration |
| `T-NOSIZE` | `c.tsv` gets `b.tsv`'s row AND the size assertion deleted; run with unmutated and with `M-SWAP` | exit 1, 18/1 both — `expected '28bc0b72…' not to be '28bc0b72…'` | a second, independent tripwire: with a collided row the rename lookup misses, the alteration is a no-op, and `not.toBe` fires |

## `M-SWAP` detail

On the head test `M-SWAP` dies in the **control** call (before the loop): with five distinct hashes the swapped
lookup refuses an unaltered `b.tsv`. Red either way; recorded so no one reads the loop's 3-of-3 as the killer.
