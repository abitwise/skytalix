---
id: 20260815T223010Z-software-engineer-observation-terminal-gate-two-mutants-and-the-six-advertised-invocations-634ac004
kind: observation
by: software-engineer
at: 2026-08-15T22:30:10Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - src/cli.ts
  - src/cli.test.ts
supersedes: 
---

# `ABC-066` — the gate, with every number; two mutants; and the six forms, run before they were printed

Machine for every figure below: **Apple M3, Darwin 25.5.0, Node v24.12.0, npm 11.7.0** — the same
machine the ticket's cut figures carry. Branch `grugops/ticket-to-pr-ABC-066`, base `main` @
`4e9ed1d`.

## Terminal gate result: GREEN. `self_fix_attempts` used: 0 of 2

| step | command | result |
|---|---|---|
| lint | `npm run lint` (`biome check .`) | exit **0** — checked **54** files in 81 ms, **no fixes applied** |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | exit **0**, no diagnostics |
| unit | `npm test` (`vitest run`) | exit **0** — **857 passed (857)** on **30 files (30 passed)**; 2.38 s reported duration, 2.75 s wall, 9.59 s user + 1.18 s sys = **10.77 s CPU** |
| build | `npm run build` (`tsc --noEmit`) | exit **0** — honestly a typecheck wearing the build slot's name, per `AGENTS.md` |
| test integrity | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`**, exit **0** |

**Baseline on the same tree before any edit: 856 passed (856) on 30 files, 2.76 s wall / 10.68 s
CPU.** So the suite went **856 → 857**: exactly one test added, none removed, none skipped.

`NFR-008`'s total (≤ 3 s wall AND ≤ 13 s CPU) holds after the change: **2.75 s wall, 10.77 s CPU.**

## `A4` — the mutant, written FIRST and watched RED. Two mutants, red on two different rows

**The guard was written and run BEFORE the production line moved**, so the first run below *is*
`A4`'s mutant: the mutant is `main`'s own delivered string and it was never hypothetical.

| # | `src/cli.ts` `USAGE` | suite | which row reds |
|---|---|---|---|
| 1 | `main`'s delivered line, byte-for-byte (no `--`) | **RED — 1 failed \| 29 passed** | `A1`: `expected 'usage: npm run chess [--colour white\|…' to contain 'npm run chess -- '` |
| 2 | the delivered line (`--` present) | **GREEN — 30 passed (30)** | — |
| 3 | separator kept, `[--depth 3]` appended | **RED — 1 failed \| 29 passed** | `A2`: `advertised argv ["--depth","3"]: expected false to be true` |
| 4 | restored to the delivered line | **GREEN — 30 passed (30)** | — |

**Mutant 1 is `A4` as the criterion words it and it redded.** Mutant 3 was added because `A4` alone
proves only that the guard notices a *missing* separator; a guard that checked nothing but the
literal would ship green while advertising an invocation the resolver rejects. The guard reds in
**both** directions and on **two different assertions**, so neither row is carrying the other.

Mutant 1 also armed the extractor: it failed by reporting the **usage line**, not the
offending-token line, which is the evidence that `usageLineOf` locates what it claims to locate.

## The six advertised invocations — RUN before they were printed (`## Test notes` 4)

Run by hand at a terminal in this hop's tree, `npm` in the loop, before the new string was written
into `src/cli.ts`:

| invocation | exit | stdout lines | stderr |
|---|---|---|---|
| `npm run chess -- ` | **0** | **27** | empty (0 bytes) |
| `npm run chess -- --colour white` | **0** | **27** | empty (0 bytes) |
| `npm run chess -- --colour black` | **0** | **27** | empty (0 bytes) |
| `npm run chess -- --colour random` | **0** | **27** | empty (0 bytes) |
| `npm run chess -- --ascii` | **0** | **27** | empty (0 bytes) |
| `npm run chess -- --unicode` | **0** | **27** | empty (0 bytes) |

**6 of 6 exit `0`, 27 stdout lines, empty stderr** — reproducing the ticket's cut measurement
exactly. The 27 lines are npm's two-line banner, one blank line, then the 23-row frame and its
trailing newline; nothing about the banner is asserted anywhere.

`AGENTS.md` § Commands forbids recording a command nobody ran, and this ticket exists *because* a
command nobody ran was printed to users. Nothing above was inferred.

## What the guard proves, and the limit it does not cross

The block proves that **what the line advertises resolves** through `resolveOptions`. It does
**not** prove that `npm` forwards the arguments — that is npm's behaviour, not this program's, and
the ticket puts it in the UAT pack rather than this lane. **That limit is stated here, not hidden.**
It is separately covered by the six hand runs above, which did go through `npm` end to end, but a
hand run is not a guard and is not claimed as one.

## `A6` and the fences, measured

- **`spawned` is `10`.** The `N8-LANE — this file spawns TEN children and no more` row passes
  unchanged, and `Object.keys(CHILDREN)` is still 10. **No eleventh child was added**; the new block
  reuses the refusal children already captured at module scope.
- **`ACCEPTED_ARGUMENTS` is untouched.** `src/cli-options.ts` was read and never edited; **no token
  entered or left the enumeration**. The guard reads it at run time and asserts, both ways, that the
  advertised tokens are exactly those **6 of 6**.
- **`ABC-042` is intact.** Every one of its rows in `src/cli.test.ts` passes unchanged; **no merged
  criterion was re-opened, re-worded or moved**, and `plans/tickets/ABC-042-*.md` was not opened.
  This was measured by the suite, not assumed from the ticket's § Out of scope.
- **`AGENTS.md`: zero bytes from this hop.** It is `ABC-065`'s half and the Scribe was editing it in
  parallel; this hop worked in a separate checkout and never opened it for write.
- **`src/cli.ts` exports nothing** — `A2`'s row and `ADR-0011` clause 4 both still pass.
- **`ABC-041` security clauses:** (a) `package.json` / `package-lock.json` not opened; (b) no Node
  builtin import added, no new `process.` read, no `spawn`/`exec`/`fetch`/`eval`/`new Function` —
  the `bar 1` row passes unchanged; (c) no test capability added; (d) blast radius **2 paths**. The
  changed bytes are this module's own prose and contain no user input, so security bar 3 (the echoed
  token and `printableOf`) is untouched and its row passes unchanged.
