---
id: 20260815T211122Z-software-engineer-observation-the-linter-never-had-errors-it-had-two-infos-about-its-own-config-5b70e5ec
kind: observation
by: software-engineer
at: 2026-08-15T21:11:22Z
verified_by: 
confidence: high
refs:
  - biome.json
  - hygiene-2026-08-16
  - lint-config-drift
  - .grugops/context/hygiene-2026-08-16/notes/20260815T210514Z-orchestrator-observation-the-three-things-the-owner-asked-about-measured-not-assumed-23d229a4.md
supersedes: 
---

# What was fixed is not what the owner reported, and the difference is worth saying out loud

The owner's words were *"linter has few errors. These need to be fixed."* **There were no errors.**
This hop did not fix errors, because there were none to fix. What it fixed is two `info`
diagnostics, **both pointing at `biome.json` itself, neither at a line of source.**

The parent `observation` note measured this at `c732fe2` and it is not re-derived here. What IS
recorded here is that the baseline reproduced **byte-for-byte in a fresh worktree** off `main`
(`c732fe2`) with a clean `npm ci`, before any edit:

| Command | Exit | Output |
| --- | --- | --- |
| `npm run lint` | **0** | `Checked 54 files in 91ms. No fixes applied.` / `Found 2 infos.` |
| `npm run typecheck` | **0** | — |
| `npm test` | **0** | `Test Files 30 passed (30)` / `Tests 856 passed (856)` |

So the gate was green before this hop and is green after it. **Nothing that was failing started
passing.** Biome does not fail on `info`, so `quality.mandatory_gates`' `lint` step has been exiting
`0` the whole time while printing two red-looking blocks above it — which is, almost certainly, what
the owner read as "errors". The change here is that a human reading the gate's output now sees a
clean run instead of having to know that `info` is not fatal.

The second diagnostic was **not** cosmetic, and that is the part worth keeping: `linter.rules.recommended`
is deprecated and "will be removed in the next major version of Biome". It is a dated fuse. Left
alone it does nothing at all until a major bump, at which point the config breaks. That is the real
value taken here; the clean output is the visible part.

## The toolchain, measured

- Installed CLI: **2.5.5** (`biome --version`), in this worktree after `npm ci`.
- `package-lock.json` pins `@biomejs/biome` at **exactly 2.5.5** (`lockfileVersion: 3`), while
  `package.json` pins `^2.3.0`. The caret admits 2.5.5 and the lock records that it resolved there.
  **The drift arrived by an ordinary locked resolve; nobody edited anything.** This also means the
  installed CLI is reproducible, not incidental — the `$schema` pin at `2.3.0` was the stale half of
  the pair, not the CLI.
- Node: `v24.12.0`.
