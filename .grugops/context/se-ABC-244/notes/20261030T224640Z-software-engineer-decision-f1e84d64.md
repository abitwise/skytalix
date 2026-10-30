---
id: 20261030T224640Z-software-engineer-decision-f1e84d64
kind: decision
by: software-engineer
at: 2026-10-30T22:46:40Z
verified_by: 
confidence: high: the step per unit follows SE parity runs that were run and recorded (9 mutants, frozen before any head run); QE re-confirms on its own frozen list (A6)
refs:
  - se-ABC-244
  - ABC-244
  - ADR-0046
  - NFR-008
  - EPIC-010
  - ABC-230
  - ABC-241
  - ABC-177
  - R1
  - R2
  - R3
  - QE-229-a
  - arch-g8-headroom/20261030T223415Z-architect-design-decision-e15a97a2
  - arch-g8-headroom/20261030T223415Z-architect-design-observation-77b392a3
  - grugops/ABC-244
  - 25282ad4
  - d59e3194
  - src/cli.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:dc8594f6055a4e40348e93c1675371c4060bf3a2a082eb8e18252c6b77d7c845
---

# `ABC-244`: U1 takes step 1 000 on both surfaces; U2 keeps 100 on both; no census unit joins. Tip `25282ad4`

Branch `grugops/ABC-244`, from `main` `d59e3194`. `src/` is byte-identical to `161e940d` (`git diff --stat 161e940d
d59e3194 -- src/` is empty), so the ticket's line numbers hold. Test-only. Not merged, nothing pushed.

## The step per unit (A2)
Ruling conditions 1 and 2 (ticket § BA/PM ruling), with R3: one value per unit, written in both files.

| unit | literals (base line) | step, base → tip | step tried | condition 2 (⌈budget ÷ step⌉) | condition 1 (SE parity, 9 mutants) | chosen |
|---|---|---|---|---|---|---|
| U1 | `src/cli.test.ts:4555`, `src/uci-session.test.ts:1286` | 100 → **1 000** | 1 000 | every search is 4 000 ms: 40 → 4 (≥ 2) | all 4 rows SAME, both surfaces, at the final tip and at the both-1 000 try | **1 000** |
| U2 | `src/cli.test.ts:4626`, `src/uci-session.test.ts:1413` | 100 → **100** | 1 000 | every search is 4 000 ms: 40 → 4 (≥ 2) | **DIFF on the CLI half**: A4 "plays d8e8 at exactly 0; base does not" and A7 "the move the search scores 0 …" kill `F230` at 100 and not at 1 000. The UCI A5 row and CLI A4 ep-twin row are SAME | **100** (condition 1; R3 holds the UCI half with it) |

- 1 000 is the only admitted step coarser than 100. A unit that fails at 1 000 keeps 100, so nothing finer was tried.
- **Why U2 loses `F230` at 1 000.** `F230` makes the seam ignore the injected list, so the seam plays base's move.
  At step 100 (40 reads), base's search on the hash list plays something other than d8e8, and the seam assertion
  goes red. At step 1 000 (4 reads, shallower), base's search also plays d8e8, so the seam assertion passes. The
  `scoreWith` assertions do not go through the seam. A kill that changes with the step is a failed step (ticket
  test note 3), not a bound to edit.

## What changed in the two files
- Two step literals: U1's two `STEP_MS`, `100` → `1_000` (the files' own spelling, as `stepMs: 1_000`).
- Four added comment lines, one above each unit's `STEP_MS`, citing only `ABC-244` and `ADR-0046` § Addendum
  2026-10-30. U1's say 1 000 on both surfaces. U2's say 100 is kept, and why.
- The UCI line "The CLI's step in `src/cli.test.ts`'s `ABC-230` rows: one clock pattern on both surfaces" stays true:
  both halves are 1 000.
- No `expect(`, `it(`, `describe(`, budget, depth or bound literal changed. No helper changed.

## Census units (U3…)
None joins. Of the ten candidates, the only ones finer than 1 000 are `:392`, `:452`, `:1804`, `:1910` and `:1989`.
- `:392`, `:452` and `:1989` read time or depth (class P/C).
- `:1804` and `:1910` read the same node count at 1 000 as today (the probe: 30 = 30 and 370 = 370). A 1 ms budget,
  or `go depth 3`, ends the search before the clock does. Moving them would fail A7 ("strictly fewer nodes") and save
  nothing.

The census lines are in the census observation.

## The mutant list
The SE's parity list was frozen before any head run: 9 mutants, `probe/frozen-mutants.json`, frozen at
2026-10-30T22:38:25Z, sha256 `a624b9f5…1c45`. The first head run started after 22:40:38Z, when the base run ended.
QE's A6 list is QE's to freeze, and it should hold at least these nine (the handoff is in the findings observation).
