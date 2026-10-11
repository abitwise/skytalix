---
id: 20261011T105642Z-software-engineer-observation-abc083-merge-rows-14-15-reread-mutant-572x-a1c40e83
kind: observation
by: software-engineer
at: 2026-10-11T10:56:42Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ADR-0039
  - ADR-0028
  - ADR-0024
  - 0129c4c8
  - 547b5155
  - .grugops/context/fix-ABC-083-relevel/probe/r14-merge.jsonl
  - .grugops/context/fix-ABC-083-relevel/probe/r15-merge.jsonl
  - .grugops/context/fix-ABC-083-relevel/probe/r14-mutant.jsonl
  - .grugops/context/fix-ABC-083-relevel/probe/mutant-unordered-q.diff
  - .grugops/context/fix-ABC-083-relevel/probe/gates.txt
supersedes:
---

# ADR-0039 d3 conditions read on the merged tree: rows 14/15 unchanged (28.46x / 43.56%), the unordered-quiescence mutant reads 572.57x > 42x, and the re-level landed as `547b5155`

Hand-authored and unsealed: the sanctioned writer (`propose_note` / `context-io.js`) was not available
to this dispatch. These are deterministic node counts, not timing readings.

- **Merge, not rebase** (owner's call): `main` @ `5ed308a8` merged into the branch at `fa81b948`, giving
  merge commit `0129c4c8`. One conflict, `plans/traceability.md` (both sides appended rows), resolved as a
  union. No `src/` overlap. The merged `src/` differs from main by ABC-083's nine files only.
- **Row 15** (`r15.mjs`, position-6 d2): 3 871 / 8 887 = **43.56%**, sameScore true. It equals the build.
- **Row 14** (`r14.mjs`, position-6 d2): 3 871 / 136 = **28.46x**. It equals the build. The other five
  cells are unchanged: kiwipete 12.31 / 15.11 / 4.09x, position-6 d1 9.19x, d3 4.86x.
- **Proof (iii), row 14:** a scratch `git archive` copy of `0129c4c8`, with `captures.sort(...)` (the
  MVV-LVA sort, `src/quiescence.ts:112`) deleted. Position-6 d2 reads 77 870 / 136 = **572.57x > 42x**, so
  it stays red. Other mutant cells: kiwipete 97.59 / 103.13 / 27.00x; position-6 d1 54.87x, d3 27.13x.
- **Row 15's mutant** (the stopped comparator) is 100% by construction (ADR-0039 d3). It was not run
  separately.
- **Re-level commit `547b5155`:** two literals plus comments. Row 15: 0.405 → 0.65. Row 14: position-6
  d2 26 → 42. Gates are in `probe/gates.txt`: merge, 1 red (row 15 only); re-level, all green, and
  `SEARCH_DEEP` 75/75.
- **Not touched:** PUZZLE_DEEP seed 5061, N8-LANE CPU, A9 depth. No timing grades were taken. The ticket
  stays `Blocked` on those. Revert `547b5155` if mobility is cut (ADR-0039 d4/d5).
