---
id: 20261012T132829Z-security-nfr-observation-placement-plants-bar4-scope-symlinked-copy-f0bf8b4a
kind: observation
by: security-nfr
task: secnfr-ABC-095-placement
at: 2026-10-12T13:28:29Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-042
  - ABC-041
  - ABC-094
  - ABC-119
  - ADR-0036
  - ADR-0037
  - F-095-1
  - V12.3.1
  - 20261012T132000Z-architect-design-decision-wiring-rulings-r1-r3-and-amendments-a4fe3027
  - 20260815T095000Z-security-nfr-decision-gate-result-pass-with-risks-44517d3f
supersedes:
---

# What the placement rulings stand on: plants read with the canonical instrument, bar 4's scope traced to its origin, and a symlinked tree copy that leaks the book

This note is hand-authored and unsealed. It was read at `main` `d0cde2e2`. Every probe ran outside the
repository, in a scratch `git clone --no-hardlinks` of `d0cde2e2`, with `node_modules` symlinked into
the clone's root. No timing was read.

## 1. Plants, read with `.grugops/context/design-F-072-1/probe/clause-b.mjs` (the clone's copy)

**P1 is R1 as `ADR-0037` § Addendum contracts it:**
- `src/book-file.ts` is
  `import { readFileSync } from "node:fs"; export function readBookFile(): Uint8Array { return readFileSync(new URL("../data/opening-book/book.json", import.meta.url)); }`.
- `src/cli.ts` gains `import { readBookFile } from "./book-file.ts"` and a `const probe = { read: readBookFile, warn: (line) => process.stderr.write(…), random: Math.random }` above `runTurnLoop({`.
- P1m is the same, with the const formatted one property per line, as Biome would format it.

| pair | change | limb 1 | limb 2 | limb 3 |
|---|---|---|---|---|
| `d0cde2e2..P1` | R1 wiring | **FIRES**: (b1) 1, the import; (b2) `cli.ts -> book-file.ts` | **FIRES**: (b1) 1, `process.stderr` | does not fire |
| `P1..P2b` | the holder reads `/etc/passwd` instead of the book (only the URL literal changes) | does not fire | does not fire | does not fire |
| `P1m..P2c` | the holder takes `path: string` and calls `readFileSync(path)`; `cli.ts` `read: () => readBookFile(String(options))` | does not fire | does not fire | does not fire |
| `P1..P3` | the import line gains `writeFileSync`, and the body writes the book | **FIRES**: (b1) 1, the import line | does not fire | does not fire |
| `P1..P5` | a second importer: `render-seam.ts` imports `readBookFile` | **FIRES**: (b2) `render-seam.ts -> book-file.ts` | does not fire | does not fire |
| `P1..P6` | a new `readBookFile()` call in `cli.ts`, over the existing edge (§ Decision 3's residual) | does not fire | does not fire | does not fire |
| `P1m..P7` | a side-effect `import "node:fs";` in `cli.ts` | **FIRES**: (b1) `src/cli.ts:70` | n/a | n/a |

**What it shows.**
- **The Architect's prediction holds.** (b1) fires on both files, and (b2) fires on `cli.ts -> book-file.ts`.
- **P2b and P2c break R1's contract with no trigger at all.** For limb 1, the counted unit is the
  import statement, and a use of the imported binding carries no token. P2c is the path-from-input
  shape (`V12.3.1` [L1]). This is `F-095-1`.
- **P6 is harmless.** It re-reads the same fixed bytes.
- **Applying Ruling 2 by hand.** `node clause-b.mjs P1m P1m 1` prints `1 hold this limb in code
  (src/book-file.ts)`, and `git diff --name-only --no-renames P1m P2c -- src/book-file.ts` prints
  `src/book-file.ts`. So the hand application fires on P2c.
- **P7.** Bar 4's own test reads specifiers with `/from\s+"([^"]+)"|import\("([^"]+)"\)/`. That
  pattern cannot see a side-effect import, and the gate recorded this blind spot (`…44517d3f`). Its
  compensating control was "production has zero non-relative imports". After `ABC-095`, production
  has one. The compensating control is now `ADR-0036` limb 1 (b1), which fires on the side-effect
  form in `cli.ts`, as measured above. **So the blind spot stays covered.**

## 2. `ABC-042` bar 4's scope, read from its record

- **The origin** is `e8a3d209` (2026-08-13), bar 3 as first cut: *"No filesystem and no network.
  Zero `fs`, `net`, `http`, `dns` imports in the **delivered diff**."*
- **The page now.** `plans/tickets/ABC-042-…md`, § "SCOPE OF THE BARS, RULED": the bars are *"scoped
  to the delivered PRODUCTION modules — the entry point and the resolver (`ADR-0011` clause 1)"*.
  Bar 4 reads *"in the production modules"*, which is the same term. The test file is exempt.
- **The gate's reading** (`security-nfr-ABC-042-gate/notes/…44517d3f`), bar 4 MET: *"7 import
  specifiers, all relative, two type-only"*. That is the two modules' own specifiers, not a closure.
- **The test.** `src/cli.test.ts:1738`, the row "bar 1 — …", loops over `["cli.ts", "cli-options.ts"]`
  and reads their own source.
- **Nothing reads it process-wide.** `ADR-0037` D1 (accepted 2026-10-10) already rules that the
  program reads `data/opening-book/book.json` at runtime, and `ABC-094` built the hostile-input
  parser for it. A process-wide bar 4 would contradict an accepted ADR, and no record says it does.

## 3. A symlinked `src/` in a tree copy resolves the book back to the repository

The probe was a scratch directory, `real/src/book-file.mjs`, with R1's
`new URL("../data/opening-book/book.json", import.meta.url)`, plus `real/data/opening-book/book.json`.
Then `copy/` has no book:

| `copy/src` is | run | resolved URL | read |
|---|---|---|---|
| a symlink to `real/src` | `node copy/src/book-file.mjs` | `/real/data/opening-book/book.json` | **the real book** |
| a symlink to `real/src` | `node --preserve-symlinks --preserve-symlinks-main …` | `/copy/data/…` | ENOENT |
| a real `cp -R` copy | `node copy/src/book-file.mjs` | `/copy/data/…` | ENOENT |

- **What happens.** Node resolves an ES module's `import.meta.url` to its real path. A copy whose
  `src/` is a symlink reads the **repository's** book, even though `book.json` is absent from the
  copy.
- **A byte-identity check of `src/` cannot see it,** because the check reads through the link.
- **This bears on R2's `ABC-119` copy.** If the copy symlinks `src/` (or `src/book-file.ts`), the
  book leaks into the "book-absent" children.

## 4. The read and `ABC-094`'s caps

- **What `book.ts` checks, and when.** `src/book.ts:75` checks `bytes.length > BOOK_MAX_BYTES` (1 MB,
  `NFR-006`) on bytes that the root's `read` has **already** returned. So the cap bounds the parse,
  not the read.
- **What a hostile file at the fixed path costs.**
  - An oversized file, or a symlink to a large file, is read whole into memory before it is refused.
  - A FIFO at the path blocks the first engine ply.
  - These follow from `readFileSync` semantics and were not probed.
- **Who can do it.** Both need write access to the checkout's `data/`, which is the principal that
  can already edit `src/`. No privilege boundary is crossed.
- **Malformed content** is `ABC-094`'s merged path: one warning, then play without the book. It is
  unchanged.
- **The artifact today** is 356,526 bytes.
