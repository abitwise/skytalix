---
id: 20261017T181352Z-software-engineer-observation-readings-da7f6206
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-157
at: 2026-10-17T18:13:52Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-157
  - ABC-157
  - QE-024-a
  - ABC-024
  - ABC-023
  - .grugops/context/ticket-to-pr-ABC-157/probe/
supersedes:
---

# ABC-157 readings: `X-any-right` survives base `aa37f9cb` and dies on exactly the six new rows at code `968a5843`

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). **No timing was
read**, because `rm-ABC-158` ran beside this hop. Every reading here is a count or a pass/fail.

**Instrument.** `probe/harness.mjs` is `ticket-to-pr-ABC-024/probe/harness.mjs` with one entry added:
`X-any-right`, which turns `if ((position.castling & option.right) === 0) continue;` into
`if (position.castling === 0) continue;`. The other 30 entries are byte-identical (`/usr/bin/diff`: +3 lines, 0 removed).
Two trees were made with `git archive` (base `aa37f9cb`, head `968a5843`). Both sit in the session scratchpad,
outside the repository, with `node_modules` symlinked. Each tree state gets a fresh `tsc --noEmit` and a fresh
`vitest run --reporter=json` (the whole default lane), with `PERFT_DEEP` deleted from the env. `src/moves.ts` is
restored and re-hashed to `6335b452fc21ffe2d0f902ecab930840` after every state. Result: 32 states per tree,
0 broken builds, 0 harness errors, 0 restore failures. Raw output: `probe/gap-first.base.out`,
`probe/mutants.base.out`, `probe/mutants.head.out`.

| state | base `aa37f9cb` (58 / 1824) | head `968a5843` (58 / 1830) |
|---|---|---|
| BASELINE | green 1824/1824 | green 1830/1830 |
| **`X-any-right`** | **SURVIVED 1824/1824** (shown first, before any row was written) | **KILLED, 6 failed: exactly the six ABC-157 rows** |
| 10 `A1:` corridor mutants (ABC-024) | all killed | all killed, same failures + 0 ABC-157 rows |
| `A2:R-half`, `A2:R-full`, `A2:R-ep` | all killed | all killed, 0 ABC-157 rows |
| `CTL:empty-removed` | killed | killed, 0 ABC-157 rows |
| `CTL:right-removed` | killed (7 failed) | killed (13 failed; the +6 are the ABC-157 rows) |
| EQ01–EQ15 (ABC-023 `A5` controls) | 15 survived | 15 survived; **0 kills added** |

**The seven named ABC-024 mutants** (BK g8, BQ b8, BQ c8, BQ d8, R-half, R-full, R-ep) read the same at base and
head: killed. The base default lane at `aa37f9cb` already carries ABC-024's rows.

**Witness** (`probe/witness.mjs`, `legalMoves` length on `r3k2r/8/8/8/8/8/8/R3K2R`, head tree): delivered
`w K` 25, `w Q` 25, `b k` 25, `b q` 25, `w kq` 24, `b KQ` 24. With `X-any-right` planted: 26 on all six.
These match the ticket's table.

**Deep lane.** `PERFT_DEEP=1 npx vitest run src/perft.test.ts` on the worktree at `968a5843` gave 32/32, exit 0.
