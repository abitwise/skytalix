# qe-ABC-283 correction to the verdict's "no re-base is owed": `main`'s `src/` MOVED after this read. `ABC-271` merged at `872e5ffc` (2026-11-04T16:24:54Z), so `main`'s `src/` is now `08e56302`, not `4fb3da04`. ABC-283 now merges second, and by the ticket's Dependencies it **re-reads its counts on the merged tree before the merge.** Gap QE-283-i, MEDIUM, owed before the merge. The verdict and every reading stand

QE/E2E, task `qe-ABC-283`. This note corrects one sentence in the verdict `…de1dc511` and the gaps note `…f8f8c2cc`, which are sealed and not edited. The sentence is "main's `src/` is still `4fb3da04`, so no re-base is owed". It was true when the read was planned (`main` `0f0adfe3`), and it is no longer true.

- **What moved:** `0f0adfe3..main` brings `ABC-271` (E4a, "structure only at 0", `ADR-0070` form (a)). It changes `src/evaluate.ts`, `src/evaluate-params.ts`, the new `src/evaluate.passer.test.ts` with its fixtures, and three test files: `evaluate.pawns`, `evaluate.taper` and `transposition`.
  - There is no overlap with ABC-283's production files (`src/search.ts`, `src/engine.ts`, `src/see.ts`).
  - `src/evaluate.taper.test.ts` and `src/transposition.test.ts` are touched on both sides, so a textual conflict is possible there.
- **What stands:** the B4 read is by its sealed form: the candidate `ab0a37b6` against the merge-base `09694a4e`, C2′ 66.0 / 100, never re-played. Every offline bar was read on `ab0a37b6`. None of that changes.
- **What is owed (QE-283-i, MEDIUM, before the merge):**
  - **Who:** the Orchestrator routes it (Software Engineer or a QE re-check).
  - **What:** merge `main` into `grugops/ABC-283` with no rewrite, then re-read the counts on the merged tree: P0 (the all-off doors against `main` at `08e56302`), the mate floor d5 in both recursions, zugzwang 7 / 7, G1, the deep lanes, `npm test`, NFR-008 and the gates.
  - **Expected, not assumed:** ABC-271's pitch is a zero-weight structure (its K1 reports no evaluation diff), so the counts are expected to be unchanged. That is for the re-read to show.
  - **NFR-008:** ABC-271 adds about 0.1 s (`…c7609f51` 3) on top of this read's 9.60 s, which leaves about 0.3 s of headroom. That is QE-283-a's concern, made sharper.
  - The game read is not re-run (B4: one read, never re-played).
