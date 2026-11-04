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
