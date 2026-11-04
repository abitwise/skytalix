---
id: 20261104T170008Z-software-engineer-decision-c5f8de21
kind: decision
by: software-engineer
at: 2026-11-04T17:00:08Z
verified_by: 
confidence: high: git auto-merged every src/ file; the one conflict (plans/traceability.md) kept both sides whole; the merged src/ diff against each parent read back
refs:
  - se-ABC-283-merge
  - grugops/ABC-283-merge
  - grugops/qe-ABC-283
  - ABC-283
  - ABC-271
  - QE-283-i
  - QE-283-a
  - QE-283-b
  - QE-283-d
  - ADR-0063
  - ADR-0065
  - ADR-0066
  - ADR-0070
  - K0
  - K2
  - P0
  - G1
  - NFR-008
  - R-N8H-1
  - Q-N8H-1
  - R-281-a
  - R-283-LMR
  - 62151993
  - 6a93d3e9
  - 715beb1c
  - 872e5ffc
  - bc287789
  - af2b77dc
  - orch-2026-10-30a/20261104T164704Z-orchestrator-decision-2409cec9
  - orch-2026-10-30a/20261104T151305Z-orchestrator-decision-c7609f51
  - qe-ABC-283/20261104T164437Z-qe-e2e-decision-de1dc511
  - qe-ABC-283/20261104T164437Z-qe-e2e-observation-f8f8c2cc
  - qe-ABC-283/20261104T164437Z-qe-e2e-observation-3f370426
  - qe-ABC-271/20261104T162300Z-qe-e2e-decision-74da20bf
  - plans/traceability.md
  - src/evaluate.taper.test.ts
  - src/transposition.test.ts
  - src/evaluate.pawns.test.ts
  - src/evaluate.passer.test.ts
supersedes: 
seal: sha256:a84a30f67b9cea5595f959250f1ec517261695dc23b70d1312b295f4224e273e
---

# se-ABC-283-merge merged `main` (`715beb1c`, with `ABC-271` `872e5ffc`) into the ABC-283 bundle as `62151993` (no-ff, no rewrite). Git auto-merged every `src/` file; the one conflict was `plans/traceability.md`. No expectation moved, and no production line was written by hand

Software Engineer, task `se-ABC-283-merge`, on `grugops/ABC-283-merge` from `grugops/qe-ABC-283` `bc287789`. Brief: `orch-2026-10-30a` ruling `…2409cec9` disposition 1 (QE-283-i).

## The merge
- `git merge --no-ff main` at `62151993`; parents `6a93d3e9` (the claim on top of `bc287789`) and `main` `715beb1c`. Merged `src/` tree `af2b77dc`.
- **`src/evaluate.taper.test.ts`:** auto-merged, no conflict. The bundle's hunk (the taper-literal row, with the `ABC-283` doors on) sits at lines 377–410. `ABC-271`'s hunks (the passer terms in the A9 bound, and the K1 (d) row) sit at lines 1 243–1 300. Both survive. The lane reads 170 tests: QE's 169 plus `ABC-271`'s K1 (d) row.
- **`src/transposition.test.ts`:** auto-merged, no conflict. Only `main` touched it, the A7 memo re-pin 448 → 576 KiB. It stands.
- **`src/evaluate.pawns.test.ts`:** only `main` touched it, the memo row 448 → 576 KiB. It stands.
- **Production files:** `src/evaluate.ts` and `src/evaluate-params.ts` (main only) and `src/search.ts`, `src/engine.ts` and `src/see.ts` (bundle only) merged without overlap. No hand edit was made.
- **`plans/traceability.md` (the only conflict):** both sides appended rows at the table's end. Resolved by keeping both blocks whole, the bundle's four rows (`se-ABC-283`, `arch-ABC-283-mate`, `se-ABC-283-k3`, `qe-ABC-283`) first and then `main`'s twelve. No row was edited.

## Why the brief expected conflicts and git found none in `src/`
- Both sides touch `src/evaluate.taper.test.ts`, but in hunks more than 800 lines apart. `src/transposition.test.ts` is touched by `main` only.
- So "both sides' rows survive" holds with no hand resolution, and the evidence is the lanes reading the union of both sides' counts (observation note).
- **Read back:** `git diff --name-only main 62151993 -- src` lists exactly the bundle's 12 files, and `git diff --name-only bc287789 62151993 -- src` lists exactly `ABC-271`'s 7. The merged `src/` is `main`'s plus the bundle's diff, nothing else.
