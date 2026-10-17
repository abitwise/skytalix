---
id: 20261017T183000Z-qe-e2e-observation-abc157-mutants-and-criteria-3d5b7e91
kind: observation
by: qe-e2e
task: qe-ABC-157
at: 2026-10-17T18:30:00Z
verified_by:
confidence: high
refs:
  - ABC-157
  - QE-024-a
  - ABC-024
  - ABC-023
  - 20261017T181352Z-software-engineer-observation-readings-da7f6206
  - .grugops/context/qe-ABC-157/probe/
supersedes:
---

# ABC-157 readings: `X-any-right` green at base, red on exactly the six rows at head; catalogue re-run equals the SE's

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). No timing was read
(`qe-ABC-158` ran beside this hop). Every reading is a count or a pass/fail.

**Instrument.** Two `git archive` trees in the session scratchpad, outside the repository: base `aa37f9cb` and
head `2202b8eb` (code `968a5843`; same `src/`). `node_modules` symlinked. Every `*_DEEP` variable deleted from
the env. One whole default `vitest run --reporter=json` per state. Each anchor matched exactly once; `src/moves.ts`
restored after every run and re-hashed `6335b452fc21ffe2d0f902ecab930840` on both trees at the end. I planted
`X-any-right` from the ticket's text (`(position.castling & option.right) === 0` → `position.castling === 0`)
on my own runner (`probe/qe-mask-mutants.mjs`) **before** opening the SE's `probe/harness.mjs`.

| state | base `aa37f9cb` | head `2202b8eb` |
|---|---|---|
| delivered | 58 / 1824 green | 58 / 1830 green |
| **`X-any-right`** | **survives 1824/1824** | **killed, 6 failed: exactly the six `ABC-157` rows** (A1 ×4, A2 ×2) |

**Catalogue re-run (`A3`, second bullet).** I then ran the committed encodings (`ticket-to-pr-ABC-157/probe/harness.mjs`
= `ticket-to-pr-ABC-024/probe/harness.mjs` + one `X-any-right` entry; `/usr/bin/diff`: +3 lines, 0 removed) on two
fresh archive trees, fresh `tsc` + `vitest` per state, 32 states per tree:
- 0 broken builds, 0 harness errors, md5 restored after every state.
- My base and head logs are **byte-identical** to the SE's `mutants.base.out` / `mutants.head.out` after the
  tree path is stripped (verdicts, counts and every failure line).
- The seven named `ABC-024` mutants (BK g8, BQ b8, BQ c8, BQ d8, R-half, R-full, R-ep): killed at base and
  head, with the same failure lists. Of the 32 states, base and head differ **only** on `X-any-right` once the
  `ABC-157` rows are removed. The six rows add kills to `X-any-right` and `CTL:right-removed` (+6) only.
- EQ01–EQ15 (`ABC-023` `A5` controls): 15/15 survive at base (1824/1824) and at head (1830/1830): **0 kills added**.

**Criteria.**
- **`A1` MET.** Four rows on `r3k2r/8/8/8/8/8/8/R3K2R` (`w K`, `w Q`, `b k`, `b q`). Each asserts
  `parseFen(fen).castling` equals the single `CASTLE_SHAPE[right].right` bit, then that king and rooks are home,
  both corridors clear and both king paths unattacked, then the castle by name at `generateMoves` and at
  `legalMoves`, then length 25, then `fullState` unchanged. My witness (`probe/qe-witness.out`) gives e1g1/e1c1/
  e8g8/e8c8 at 25; with `X-any-right`, both castles at 26.
- **`A2` MET.** Two rows (`w kq`, `b KQ`). Each asserts `castling & own === 0` and `castling & opponent ===
  opponent`, the same alive-but-for-the-right setup, then `castleNames(generateMoves)` is `[]`, then
  `expectNoCastleAndPure(fen, 24)` (no castle at either layer, length 24, `fullState` and `toFen` unchanged).
  Witness 24 delivered, 26 under `X-any-right`.
- **`A3` MET** (both bullets above). The delivery note records the readings (`…da7f6206`).
- **`A4` MET.**
  - `git diff --name-only aa37f9cb 968a5843` lists only `src/moves.castling.hardening.test.ts`. At the tip the
    other nine paths are `.grugops/context/ticket-to-pr-ABC-157/…` and the ticket page, none under `src/`.
  - `git diff -U0 aa37f9cb 2202b8eb`: 0 removed lines (+926/−0 overall, +90/−0 in the test file).
  - `md5 -q src/moves.ts`: `6335b452fc21ffe2d0f902ecab930840` at base, code and tip.
  - `npm test` at the tip: exit 0, 58 files, 1830/1830 (base 58/1824: +6), `.test-results/last-run.json`
    `success: true`, pending 0, todo 0.
  - `PERFT_DEEP=1 npx vitest run src/perft.test.ts` at the tip: exit 0, 32/32.
