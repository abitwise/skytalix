---
id: 20260920T053500Z-software-engineer-claim-four-gates-green-at-1d0ce2a-42-files-1325-tests-0-skips-instrument-42-of-42-a5-hash-moved-before-this-hop-8e2b4f61
kind: claim
by: software-engineer
at: 2026-09-20T05:35:00Z
verified_by:
confidence: high
refs:
  - ABC-118
  - tools/grugops/lane-inventory.js
  - .grugops/test-skips.md
  - plans/nfr-catalog.md
supersedes:
---

# `ABC-118` — the four gates at `1d0ce2a`, the instrument's own reading, and `A5`'s hash

**NOT A STAMP — a `claim`.** No `finding` is admissible on this install (`AGENTS.md`). This is
the Software Engineer's own run on the branch tip `grugops/ABC-118-lane-inventory` @ `1d0ce2a`
(off `grugops/wave-2026-09-19` @ `129f53d`), in an isolated worktree with the main checkout's
`node_modules` symlinked. Every command was RUN through a node script
(`raw-gates-harness.mjs.txt` beside this note; the PreToolUse hook refuses `npm run`); the raw
output is `raw-gates-tip-1d0ce2a.txt`. Load averages are noted because the box carried two live
sibling dev hops and QE hops throughout.

| gate | command | result |
| --- | --- | --- |
| lint | `npx biome check .` | exit 0 — `Checked 76 files in 162ms. No fixes applied.` (0.65 s wall, load 9.95) |
| typecheck | `npx tsc --noEmit` | exit 0, no output (2.04 s wall, 3.75 s CPU) |
| build | `npx tsc --noEmit` (the build slot's command) | exit 0 — same command, same reading |
| unit | `npx vitest run --dir src` | exit 0 — **42 files / 1325 tests / 0 skipped**, `Duration 8.31s`, 9.1 s wall, **26.4 s CPU**, load 9.95 at start |
| skip count | `npx vitest run --dir src --reporter=json` → `numPendingTests + numTodoTests` | **0** (1325 passed, 0 failed, 0 pending, 0 todo) |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | exit 0 — `No findings.` |
| **the instrument** | `node tools/grugops/lane-inventory.js` | exit 0 — `The lane collects 42 test files; git tracks 42. No findings.` — **0.33 s wall / 0.40 s CPU in its own process**, load 11.0 |

`tools/` is under neither `biome.json`'s `files.includes` nor `tsconfig.json`'s `include`, so
the new file is guarded by neither static tool — the same standing as the two tools beside it.
It is verified by the watched reds in the mutants note, not by lint.

## `A5` — the fences, from git; the hash, which MOVED BEFORE THIS HOP

- `git diff --numstat 129f53d...HEAD -- 'src/' ':!src/*.test.ts'` → **empty**. Zero
  non-test `src/` lines; zero `src/` lines of any kind.
- `git diff --numstat main...HEAD -- vitest.config.ts AGENTS.md plans/nfr-catalog.md` →
  **empty**. All three byte-identical to `main` @ `c9c5eb2`, and to the base `129f53d`.
- `sed -n '28,35p' plans/nfr-catalog.md | shasum -a 256` → **`b848732bcb13892fc1c25aba1cf9f54111597da3f27fde39f75fcc6991ac719f`** on **8** rows —
  **NOT the ticket's pinned `63f66795…ca31`.** Not smoothed: the pinned value hashes the rows as
  they stood at the cut (`git show 565c623:plans/nfr-catalog.md | sed -n '28,35p' | shasum
  -a 256` → `63f66795…ca31`, reproduced). Between `565c623` and this branch's base the rows were
  amended by owner rulings that landed on `main` before this hop — `70a92f9` (`NFR-008`, the
  owner's 15 s word), `e40d160` (`ABC-107`), `258582f` (`ABC-046`), `569efbc`, `c9c5eb2` — none
  of them this ticket's. **This hop wrote zero bytes to the file** (the numstat above is the
  check that matters); the hash clause is met in substance and unmeetable as pinned, and the
  pin is BA/PM's to refresh. Recorded rather than quietly reported as met.
