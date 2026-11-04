# se-ABC-271 artifacts: branch grugops/ABC-271, code 10f29a82 (src/ 08e56302); 7 files; the two re-pins; owed QE K3 / K4 / UAT; one risk flagged: the endgame G2 report set reads 1.11–1.13 ×

Software Engineer, task `se-ABC-271`. Recorded as an `observation`: an `artifact-ref` needs a `gate_run` bound to a §14-gate verdict, and none is admissible on this install (`context.human_admission` off), as for se-ABC-270.

## Branch and commits (not pushed, not merged)
- `grugops/ABC-271` from `main` `3a08d244`, worktree `.claude/worktrees/se-ABC-271`.
- `9f578362` chore: claim. **`10f29a82` feat(ABC-271): the code** (`src/` tree `08e56302`). Then one records commit (notes, raw, trace row, `## Result`, brief and claim to `done/`).

## Files (`git diff --stat main 10f29a82`)
- Production: `src/evaluate.ts`, `src/evaluate-params.ts`. **UAT is owed** (production lines; test note 3). The QE verdict signs it.
- Tests: `src/evaluate.passer.test.ts` (new), `src/evaluate.passer-fixtures.json` (new, QE's byte copy), `src/evaluate.taper.test.ts` (A9), `src/evaluate.pawns.test.ts` and `src/transposition.test.ts` (K2).

## The re-pins, for the PR (K2): exactly two, 458 752 → 589 824
1. `src/evaluate.pawns.test.ts`: "is a fixed 448 KiB …" → "is a fixed 576 KiB …", both `expect` lines: `2 ** 14 * (8 + 8 + 4 + 4 + 4 + 4 + 4)` and `576 * 1024`.
2. `src/transposition.test.ts` A7: `expect(pawnCacheByteLength()).toBe(576 * 1024)`.

## For the PR (test note 4)
K0 read on one set (`main`'s non-test `src/` did not move): 766 275 / 1 725 150; 87 475 / 253 724 / 533 916; 605 117 / 406 787. K3's endgame report set: 1.1135 / 1.1256 (control 1.0041 / 1.0029).

## Owed (not this role's)
- **QE:** K3 under a PREREG sealed before timing (`ADR-0067` d8's A5); K4; the `R-281-a` `-t` lines; the K1 (c) grading against its frozen rows; the UAT verdict.
- **Reviewer / Architect:** the extra test-only export `pawnStructureForTest` (decision note, reading 4), `UNKNOWN - verify` whether wanted.
- **The second pull:** `tools/tune`'s emitter does not write the four new exports (`…6ccd8243` item 3), unchanged here.

## Risk (observation, LOW–MEDIUM): the endgame cost
On the endgame report set, G2 reads **1.114 / 1.126 ×** against the probe's 1.084 / 1.086. It is not graded. The graded roots are at 1.034, with a 1.6-point margin. The ADR's risk line ("about 8.5 % where passers exist") reads low on this host and session, which was not ALONE. If QE's graded K3 misses, F2's named cut is ready (`ADR-0070` d3: the 128 × 128 `Int8Array` distance table, +16 KiB, and the bit-scan of the words). Not taken now, because no bar fired.
