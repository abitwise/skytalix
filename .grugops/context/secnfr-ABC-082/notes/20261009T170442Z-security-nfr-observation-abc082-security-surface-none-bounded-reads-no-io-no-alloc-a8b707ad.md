---
id: 20261009T170442Z-security-nfr-observation-abc082-security-surface-none-bounded-reads-no-io-no-alloc-a8b707ad
kind: observation
by: security-nfr
at: 2026-10-09T17:04:42Z
verified_by:
confidence: high
refs:
  - ABC-082
  - NFR-009
  - src/evaluate.ts
  - src/evaluate.mirror-corpus.ts
  - src/position.ts
  - plans/tickets/ABC-082-evaluation-pawn-structure.md
supersedes:
---

# `ABC-082` security surface: none. Every board read is in bounds, both loops are bounded, and the term does no I/O and allocates nothing. ASVS L1: no finding

Hand-authored and unsealed. This note is an observation, not a stamp. Scope: `5ebe1d8..873911d -- src`.
`src/evaluate.ts` is the only production file in that diff (+96/−3). Every other changed file is a
`*.test.ts` file or the test-only `src/evaluate.mirror-corpus.ts`.

## What was checked, by reading the code at `873911d`

| check | result |
|---|---|
| Board index range | The board is 0x88, `new Uint8Array(128)` (`src/position.ts:76`). `pawnStructure` and `isPassedPawn` read only `rank * 16 + f`, with `rank` in 1..6 and `f` in 0..7, so the highest index is 103. No read can leave the array. |
| Loop bounds | `pawnStructure` makes two passes of 6 × 8 squares. `isPassedPawn` reads at most 6 ranks × 3 files, and its loop condition `rank >= 1 && rank <= 6` ends it whatever the input. Nothing can make the work unbounded. |
| Table index | `PASSED_PAWN_BONUS` has 8 entries. It is read at `[rank]` for white and `[7 - rank]` for black, with `rank` in 1..6, so every index is in range. |
| Malformed input | A position with a pawn on rank 1 or rank 8 (if `parseFen` admits one) is not scanned, so it is ignored. `isPassedPawn` on a non-pawn square still stays in bounds and still ends. Its only production caller is `pawnStructure`, which calls it only on a pawn. |
| Allocation (`NFR-009`) | None per call: no array, object or closure is created. `adjacentFiles` is a module-level arrow function. `NFR-009` is not triggered, as the page says. |
| I/O, eval, process, network | None in `src/evaluate.ts` or `src/evaluate.mirror-corpus.ts` (a grep for `readFile`, `process.`, `fetch(`, `child_process` and `eval(` exits 1). |
| New export | `isPassedPawn` is exported for the `A5` test. Under `src/`, `src/evaluate.pawns.test.ts` is the only file outside `evaluate.ts` that imports it. It is a pure predicate, and the package is `private` with no `bin`/`main`/`exports` (`ADR-0007`), so the export gives no new attack surface. |
| Test-only module | `src/evaluate.mirror-corpus.ts` has no production importer. That is asserted by an `A7` row (`src/evaluate.pawns.test.ts:337`) and confirmed by grep. |
| Dependencies | `package.json` is unchanged. |

**ASVS L1** (`security.asvs_level`), filtered by surface: the diff touches no input parsing, auth,
session, crypto, file, network, secret, logging or dependency surface. **No finding.** The page's
"Security — not triggered. No input surface." is **confirmed**.

**Reliability note (info, not a finding):** the term is a pure function of the board. It cannot throw on
any board that the 0x88 layout admits, so it adds no failure mode to the turn loop.
