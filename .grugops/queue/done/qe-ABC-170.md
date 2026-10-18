---
done_at: 2026-10-18T13:30:00Z
branch: grugops/ABC-170 (worktree ../wt-ABC-170, untouched; base 358810ac; code e29f7951; reviewed tip 64b07741)
tip: 64b07741 (unchanged; QE committed nothing to the branch)
result: PASS_WITH_GAPS
---

QE ran from a scratch worktree `../wt-qe-ABC-170` (detached at `64b07741`), which has since been removed. **No timing reading was taken.**
**A6 (NFR-005) stays OPEN.** The notes and probes are in `.grugops/context/qe-ABC-170/` in main's working tree and are uncommitted.

- **Criteria:** A1, A2, A3, A4, A5 and A7 MET. A6 OPEN.
  - A3 was checked against the **base** engine on 72 positions (60 seeded random walks), 6 budgets, 3 doors and 4 tip variants.
    That is 6 768 comparisons with 0 mismatches in move, score, depth, nodes and elapsedMs.
  - A2's discard held in a 102-row `maxNodes` sweep. 30 of the 78 aborts landed in quiescence, the FEN was restored every time,
    and the bound held in 102/102 rows.
- **Gates at 64b07741:**
  - lint, typecheck and build exit 0.
  - `npm test` exit 0 on the **first run** (the 60 s bound was not hit, so there was no re-run): 58 files, 1839/1839,
    success true. Integrity `No findings.` at skip 0.
  - merge-tree is clean against main `b4645a82`, and against `7174997d`, which merges ABC-169. The lane was not re-run on that
    merge result.
  - Coverage of `src/engine.ts` is 99.02 % of lines. The uncovered line is the base rethrow.
  - The UAT waiver does **not** apply: production `src/engine.ts` is in the diff.
- **Mutants:** 23 over the whole default lane at `--testTimeout=120000`. 15 killed and 8 survived.
  - The survivors are M04 (countNode order swap), M08/M08b/M08c (`maxNodes` default 10M/200k/60k), M10b/M10c (body depth
    cap at 200 or 130), and M12/M14 (near-equivalent).
  - The header clock-last swap (M05) and the dropped header `maxNodes` term (M02) are killed only by A4's text pin.
- **Gaps:**
  - QE-170-a MEDIUM: the `ABC-170 A3` row runs 3.4-4.8 s against the 5 s default testTimeout, and it timed out in 11 of 18
    lane runs under load. Fix it before the gate.
  - QE-170-b LOW: the `maxNodes` default is unpinned.
  - QE-170-c LOW, already there before this ticket: a body depth cap evades A4.
  - QE-170-d LOW: the countNode clock-first order is unpinned.
  - QE-170-e INFO: the `search(p, d)` oracle is a fixture coincidence.
  - QE-170-f INFO: the new A3 row cannot see a clock read added on both paths; older exact-count rows catch it.
  - QE-170-g INFO, for ABC-167: edge semantics.
- Decision: `.grugops/context/qe-ABC-170/notes/…-09d90757`. `plans/board.md` and `plans/traceability.md` were not touched,
  and the trace row is in the handoff.
