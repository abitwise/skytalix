---
id: 20260820T171000Z-qe-e2e-claim-the-gates-i-ran-on-main-and-the-numbers-i-measured-rather-than-quoted-6a17f4c2
kind: claim
by: qe-e2e
role: qe-e2e
task: qe-ABC-043-review-exit-2026-08-20
at: 2026-08-20T17:10:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - NFR-008
  - ADR-0014
  - ABC-108
  - .grugops/test-skips.md
supersedes:
---

# The gates I ran on `main` @ `d127ae3`, with the commands, and the two figures that MOVED since the prior hop

Every number below is from a command I ran at this hop. **The prior recorded figures were 1190/39 and
they are stale — the tree has taken `ABC-044` and `ABC-113` since.** I verified rather than quoted,
which is what the brief asked for, and the verification found the drift.

| gate | command | result |
|---|---|---|
| lint | `npm run lint` (`biome check .`) | **exit 0**, 72 files checked, 55 ms. The standing *"known-environmental exit 1"* caveat is dead — the owner's `2bef492` closed it and it stays closed on `main`. |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | **exit 0**, clean |
| test | `npm test` (`vitest run`) | **exit 0 — 40 files / 1207 tests / 0 failed.** Prior hop recorded **1189–1190 / 39**; the delta is `ABC-044` and `ABC-113`, not a regression. |
| build | `npm run build` (`tsc --noEmit`) | **exit 0**, clean |
| skip count | `npx vitest run --reporter=json 2>/dev/null \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |
| perft deep | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **exit 0 — 32 passed / 32**, 37.1 s |

**`.grugops/test-skips.md` EXISTS and I ran against it.** It is human-owned; I read it and I wrote no
row into it. (A prior hop on another ticket recorded it as absent and returned `UNKNOWN - verify`;
that reading does not hold at `main` — the file is there, 146 bytes, owner-created 2026-08-13, and the
integrity step runs and passes.)

## The lane cost, measured and NOT claimed against any bar

`npx vitest run`, three consecutive runs in an isolated copy of `main`:

| run | wall | user | sys | CPU (user+sys) |
|---|---|---|---|---|
| 1 | 3.31 s | 13.98 s | 1.33 s | **15.31 s** |
| 2 | 3.26 s | 14.20 s | 1.34 s | **15.54 s** |
| 3 | 3.53 s | 14.26 s | 1.36 s | **15.62 s** |

**Median 15.54 s CPU, 3.31 s wall.** `NFR-008`'s clauses are **13 s CPU** and **3 s wall**; `ADR-0014`
already records the breach and `ABC-108`'s `OQ-1` is Architect/Design's. **The lane has moved further
over — `ABC-108` measured 13.400 s CPU (n=8) and it now reads 15.5 s.** I am recording that as a
measurement and claiming **nothing**: `N8-LANE` is a rate limit, not a grant, no ticket may honestly
be measured against it while `OQ-1` is open, and `ABC-043` does not get to claim it met a bar or get
charged for a lane it shares. **I did not re-rule an NFR and I did not open `ABC-108`.**

`src/cli.test.ts`'s own mechanical pin — *"this file spawns SEVENTEEN children and no more"* — is
**green**, `Object.keys(CHILDREN)` is **17**, `spawnSync` is the only name taken from
`node:child_process` and has **exactly one call site**. `ABC-044` added its three rows with **zero**
new children, reading `ABC-043`'s `mate` child again. **Seventeen is a ceiling and the delivered file
sits on it, not over it.**

## Behaviour I confirmed at the shell, on the delivered build

| what | result |
|---|---|
| `node src/cli.ts --ascii </dev/null` | one board, `> input ended`, **exit 0**, 0.07 s |
| `printf 'e2e4\n' \| node src/cli.ts --colour white --ascii` | 3 frames (move played, engine replied), `input ended` **once**, **exit 0**, 3.08 s |
| `npm run chess -- --colour black --ascii </dev/null` | two boards, engine acts first, **exit 0**, 3.20 s — one real engine ply |
| `npm run chess -- --colour white` (unicode default) | real glyphs in the board region |
| `node src/cli.ts --colour purple` | **exit 1**, usage line advertising the `--` separator |
| a crashed session (`A3`'s child) | **exit 70**, one fixed line, no chess word |
| `node src/cli.ts --ascii </dev/null \| head -2` | **exit 1 with an unhandled `write EPIPE` stack** — see the EPIPE note |

**The `--` separator is load-bearing and I used it.** Every `npm run chess` line above carries it.
