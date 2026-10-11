---
id: 20261010T184805Z-software-engineer-observation-abc141-readings-and-exit-8d96eef4
kind: observation
by: software-engineer
at: 2026-10-10T18:48:05Z
verified_by:
confidence: high
refs:
  - ABC-141
  - QE-010-b
  - QE-010-c
  - QE-129-b
  - QE-139-c
  - src/move-input.ts
  - src/move-input.test.ts
  - src/history-pane.ts
supersedes:
---

# `ABC-141`: premise, gates, `A1`–`A4`, and the owner's two Q4 measures

This note is hand-authored and unsealed. Base `957a85c3` (wave tip), code `f92868f6`. Probe scripts
are in `../probe/` (`count.mjs`, `fm.mjs`). They run on a `git archive` copy, never on the worktree's `src/`.

## Premise (re-verified at the base, before editing)

`node probe/count.mjs <archive of 957a85c3>` reads `legalMoves` spliced (anchor x1). `SIX_QUEENS_FEN`
`Qxd4` gives **derives=7**, ambiguous, 6 candidates all `#`. The controls `TWO_KNIGHTS_FEN` `Nd2` and
`BOTH_CAPTURES_FEN` `BXC4` give derives=1, no checks. `parseFen("4k3/8/8/8/8/8/8/4K3 w - - 0 10000")`
gives `fullmoveNumber` 10000. The premise held, so no stop condition fired.

## Acceptance

- `A1` MET. The same counter on an archive of `f92868f6` gives derives=7, and both comments say "seven:
  1 + 6". `grep -c 'cost six of those' src/move-input.ts` and `grep -c 'measured six'
  src/move-input.test.ts` go from 1 at the base to **0** at the tip.
- `A2` MET. `` grep -cF '`ABC-010` is the ticket that would' src/history-pane.ts `` goes from 1 to **0**.
  The paragraph still states that a FEN above 9,999 loads ("it accepts fullmove 10000"). `fm.mjs` at
  the tip gives 10000. No ticket is named as delivering a bound.
- `A3` MET. `git diff --name-only 957a85c3..f92868f6 -- src` lists exactly the three files. Numstat:
  `history-pane.ts` +3/-2, `move-input.test.ts` +2/-1, `move-input.ts` +2/-1.
- `A4` MET, with one flake noted. lint (biome, 100 files), typecheck and build all exit 0. `npm test`
  gave 52 files / 1663 passed, the same as the base. The base was measured on the same worktree with
  the edits stashed: 1663 / 0 failed / 0 skips. Skips 0 (JSON reporter). Integrity
  (`test-skip-integrity.js --skip-count 0`) and lane-inventory (52/52) both print `No findings.`
  **Flake:** one `vitest --reporter=json` run at the tip read 1662 passed / 1 failed. The failing
  test's name was not captured. Two reruns read 1663 / 0 failed. The diff has no executable line (Q4
  measure (ii)). The cause is `UNKNOWN - verify`; machine load from the parallel `ABC-083` build is a
  guess only.

## Owner Q4 exit (`…5c8e2a17`): both measures, per file

QE's `.grugops/context/qe-ABC-132/probe/exit132.mjs <worktree> 957a85c3 f92868f6 <3 files>`. Full output:
`../probe/exit132-957a85c3..f92868f6.txt`.

| file | (i) changed / regex / scanner-comment | (ii) removeComments emit, repo + ESNext | (iii) tokens | Q4 |
|---|---|---|---|---|
| `src/move-input.ts` | 3 / 3 / 3 HOLDS | IDENTICAL `1206a1e6…` (2270 B) | IDENTICAL | HOLDS |
| `src/move-input.test.ts` | 3 / 3 / 3 HOLDS | IDENTICAL `c43a444a…` (16362 B) | IDENTICAL | HOLDS |
| `src/history-pane.ts` | 5 / 5 / 5 HOLDS | IDENTICAL `6e1a3715…` (1685 B) | IDENTICAL | HOLDS |

**Negative controls:** NEG-exec, NEG-type-only, NEG-template-slashslash and NEG-code-behind-comment
all FAIL the conjunction in all three files. NEG-type-only passes (ii) alone, which is why one measure
is never enough. **POS control:** HOLDS for `move-input.ts` and `history-pane.ts`. For
`move-input.test.ts` it FAILS, because the harness inserts its line at index 2, and in that file index
2 is an `import` line, not a docblock. That is an artefact of where the harness puts the control, not
a reading of this diff.

Both production files (`move-input.ts`, `history-pane.ts`) meet the Q4 conjunction. UAT WAIVED on
the owner's ruling (waived is not accepted), applied at `Done` by the Orchestrator, not self-applied.
