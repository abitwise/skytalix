---
id: 20261101T233711Z-software-engineer-observation-7ebea1d7
kind: observation
by: software-engineer
at: 2026-11-01T23:37:11Z
verified_by: 
confidence: high: pointer note (filed as observation; artifact-ref needs gate_run)
refs:
  - se-ABC-238
  - ABC-238
  - ADR-0058
  - ABC-081
  - EPIC-011
  - ADR-0056
  - ADR-0026
  - ADR-0025
  - ABC-229
  - ABC-249
  - NFR-005
  - NFR-008
  - NFR-009
  - grugops/ABC-238
  - 3abaefdd
  - b19af469
supersedes: 
seal: sha256:2f0b0eedabcbb3c88aaad66177e006ad902998cce3bcb6b671ebce402ad0616d
---

# se-ABC-238 artifacts: branch grugops/ABC-238, code 3abaefdd

- **Branch and worktree:** branch `grugops/ABC-238` in worktree `.claude/worktrees/se-ABC-238`, from main `b19af469`. Not pushed, not merged.
- **Commits:**
  - `4a3184dc`: claim (queue only).
  - `3abaefdd`: code.
  - The records commit: these notes, `raw/`, and the brief to done/.
- **Production files:**
  - `src/transposition.ts`: `tableCutoff` gains `deeper`; the doc comment is rewritten.
  - `src/search.ts`: the `deeperCutoffs` switch, the header paragraph and the door `searchWithoutDeeperCutoffs`.
  - `src/engine.ts`: the `deeperCutoffs` heuristic, the header paragraph and the door `chooseMoveWithoutDeeperCutoffs`.
- **Test files:**
  - `src/transposition.test.ts`: the predicate rows, the literal rows, the liveness row and the deep oracle; the `tableCutoff` call-through wrap; the describe title "cutoffs only at the stored depth" is now scoped to the doors.
  - `src/quiescence.test.ts`: ABC-229 A3 and drift re-pointed; two literal rows re-pinned.
  - `src/search.null-move.test.ts`: the QE-208-c map + 2.
  - `src/search.test.ts` and `src/engine.test.ts`: export lists + 1 each.
- **Evidence (`.grugops/context/se-ABC-238/raw/`):**
  - `a1.txt` (the A1 cross-build);
  - `a4.txt` (d8 nodes);
  - `probe-counts.txt` (deeper cuts per board at d4-6);
  - `deep/` (14 lanes and `summary.txt`);
  - `gates/`;
  - `scripts/` (`a1.mjs`, `oracle.mjs`, `deep.sh`, `gates.sh`).
- **Rollback:** before acceptance, drop the branch. After a merge, set `deeperCutoffs: false` in `search()` and `chooseMove`, or revert `3abaefdd`.
- **Owed by QE, after the owner's word on ADR-0058:**
  - the A6 100-game read at 100 ms;
  - the S′ Stockfish smoke;
  - the Levels deep lane;
  - the graded G6 and the G5 real clock;
  - G11;
  - UAT.
