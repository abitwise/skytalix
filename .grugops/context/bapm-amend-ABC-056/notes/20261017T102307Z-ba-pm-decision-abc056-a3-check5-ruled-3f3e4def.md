---
id: 20261017T102307Z-ba-pm-decision-abc056-a3-check5-ruled-3f3e4def
kind: decision
by: ba-pm
at: 2026-10-17T10:23:07Z
verified_by:
confidence: high
refs:
  - ABC-056
  - AR-1
  - ABC-095
  - ADR-0036
  - plans/tickets/ABC-056-ar-1-accepted-risk-has-drifted.md
  - src/book-file.ts
  - 20261017T101842Z-release-manager-observation-abc056-a3-blocked-0d45639e
supersedes:
---

# BA/PM `ABC-056`: `A3` check 5 ruled. `node:` excluded; the built-in set is recorded and is part of the trigger

This note is hand-authored and unsealed: the sanctioned writer is absent on this install (`AGENTS.md`). It is **not**
the `AR-1` re-statement, which stays the Release Manager's `decision` note with `refs: [AR-1, ABC-056]` and an
empty `supersedes`. The authoritative text is on the ticket page, § "Amendment — 2026-10-17".

## Ruling

1. **Check 5 excludes `node:` built-ins.** It measures "no npm package loaded at runtime", and a `node:` specifier
   resolves only to a built-in. A prefix-less `"fs"` still prints, so the check fails closed.
2. **`AR-1`'s reason is unchanged. Its record names the built-in set it read, and `A4`'s trigger fires when that
   set changes.** Some built-ins load code (`node:module`'s `createRequire`, `node:child_process`). Diffs that
   add a built-in already route to Security/NFR under `ADR-0036` clause (b) limb 1.

## Measured at `10e7aab6` (2026-10-17), all over `$(ls src/*.ts | grep -v '\.test\.ts$')`

| check | output |
|---|---|
| old command, as written | `from "node:fs"` |
| old command, with `node:` also excluded (`(\./\|node:)`) | empty |
| file / specifier count | 40 / 148; the widened regex gives the same 148 (identical when sorted) |
| 5a | empty (exit 1) |
| 5b | empty (exit 1). A first draft, `import *\(`, matched a comment at `src/book-file.ts:8`, the prose "import (N-LOAD)". Tightened to `import\(` |
| 5c | `node:fs` (one specifier, `src/book-file.ts:13`) |
| non-`.ts` entries under `src/` | `__snapshots__/`, `puzzle-suite.baseline.json`; no `.ts` in subdirectories |
| runtime entry | `package.json` `chess` = `node src/cli.ts`, no loader flag |

## Plants (scratch files outside the repo, removed by exact path)

| planted line | old command | 5a | 5b | 5c |
|---|---|---|---|---|
| `import "lodash";` | silent | **prints** | — | — |
| `const m = await import(x);` | silent | — | **prints** | — |
| `createRequire(import.meta.url)` | silent | — | **prints** | — |
| `const a = require("lodash");` | silent | — | **prints** | — |
| `import { a } from "node:module";` | prints | silent | — | **lists `node:module`** |
| `export * from "pkg";` / `import type … from "pkg2"` | prints | **prints** (fails closed on type-only) | — | — |

`grep` on this host is ugrep 7.8.4. The commands use only `-E`, `-o`, `-h` and `-n`.

## DoR

10/10. `XS` and `P2` are kept. No owner question: the owner's 2026-10-12 word "Re-state the accepted risk" stands.
