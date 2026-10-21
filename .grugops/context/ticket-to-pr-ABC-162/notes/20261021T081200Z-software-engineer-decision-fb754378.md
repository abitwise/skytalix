---
id: 20261021T081200Z-software-engineer-decision-fb754378
kind: decision
by: software-engineer
at: 2026-10-21T08:12:00Z
verified_by: 
confidence: high
refs:
  - ABC-162
  - ABC-095
  - AR-095-CWD
  - QE-095-a
  - grugops/ABC-162
  - 3d05e230
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md
  - ADR-0036
  - 20261012T153000Z-security-nfr-decision-s3-result-pass-with-risks-qe095a-qe095e-ruled-b65b11b7
supersedes: 
seal: sha256:a7b4120962b6a97ec81f0316a3451d9b83acedccb700b301072d8ed491a49ca4
---

# `ABC-162`: `A7`'s booked child runs from a fresh `mkdtemp` directory, and `spawnReal` takes an optional `cwd`

The page let the Engineer pick between a fresh `mkdtemp` directory and `os.tmpdir()` itself. **I chose `mkdtemp`** (`abc162-neutral-cwd-` under `os.tmpdir()`).
- **Why not `os.tmpdir()` itself:** that directory is shared. Any process can create a `data/opening-book/book.json` in it, and then a cwd-relative build (P6b) would read that file and pass. A fresh directory is empty by construction. `A7` also asserts that it holds no `data/` entry.
- **Removal:** by its exact returned path, in the `ABC-095` describe's `afterAll`. It goes through the file's existing single removal helper `removeCopy`, so "the only removal in this file is a path `mkdtemp` returned" stays true. Its doc comment now names this second use.
- **Seam:** `spawnReal(root, script, args = CHILD_ARGS, cwd = root)`. The entry point is still `root`'s `src/cli.ts`, and only the working directory moves. `spawnNode`'s first parameter is renamed `root` → `cwd` because that is all it ever meant. The `[CLI_DEEP] (cwd …)` log line now prints the real cwd.
- **Scope held:** every other child keeps `cwd` = its tree root. There is no new test, no new spawn and no production line. `src/book-file.ts` is untouched (a `ADR-0036` capability holder).
