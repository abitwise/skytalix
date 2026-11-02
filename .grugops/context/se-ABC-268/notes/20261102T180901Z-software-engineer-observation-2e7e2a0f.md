---
id: 20261102T180901Z-software-engineer-observation-2e7e2a0f
kind: observation
by: software-engineer
at: 2026-11-02T18:09:01Z
verified_by: 
confidence: high: pointer note (filed as observation; artifact-ref needs gate_run)
refs:
  - se-ABC-268
  - ABC-268
  - ADR-0061
  - ADR-0026
  - ADR-0050
  - ADR-0058
  - ADR-0059
  - ADR-0056
  - EPIC-011
  - ABC-229
  - ABC-228
  - ABC-208
  - NFR-005
  - NFR-008
  - grugops/ABC-268
  - df984484
  - ca6e8506
  - aa652215
  - arch-phase2-p3/20261102T171413Z-architect-design-decision-004b35ed
  - arch-phase2-p3/20261102T171413Z-architect-design-observation-55f7725e
  - bapm-P3-page/20261102T173205Z-ba-pm-decision-9018d111
supersedes: 
seal: sha256:45bc483c670d4c7a257d09c3248f5bf8ea22a661dc2832e3c445a942a92c1b2a
---

# se-ABC-268 artifacts (filed as observation; artifact-ref needs a gate_run): branch grugops/ABC-268, claim aa652215, code df984484

- **Branch:** `grugops/ABC-268`, worktree `.claude/worktrees/se-ABC-268`, from `main` `ca6e8506`. Nothing pushed or merged.
- **Commits:** claim `aa652215`; code `df984484`; then the records commit (these notes, `raw/`, the brief's Result, queue moves).
- **Production files:** `src/search.ts` (header, `MATE_FLOOR` import, `Switches.futility`, `FUTILITY_MARGIN`, `futilityNode`, `futileMove`, the node test and skip in `negamax`, `searchWithoutFutility`, `futility: false` in 11 older doors); `src/engine.ts` (header, imports, `Heuristics.futility`, the node test and skip in `negamax`, `chooseMoveWithoutFutility`, `futility: false` in 5 older doors).
- **Test files:** new `src/search.futility.test.ts`; export lists in `src/search.test.ts` and `src/engine.test.ts`; literal maps in `src/search.null-move.test.ts` and `src/quiescence.test.ts`; re-points of the `ABC-229` deep ratio and drift rows in `src/quiescence.test.ts`.
- **Commands** (each under `flock <host lock>`): `npm test`; `npm run lint`; `npm run typecheck`; `npm run build`; `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`; `node tools/grugops/lane-inventory.js`; the deep lanes in `raw/scripts/deep.sh` plus `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/search.futility.test.ts`; `node raw/scripts/a1.mjs <base src tree> <worktree>`; the audit `node audit-driver.ts fire|audit` on a scratch copy patched by `raw/scripts/audit-patch.py` (outside the repo, deleted after); `raw/scripts/plants.py`; `raw/scripts/g8.sh`; `raw/scripts/g6.sh`.
- **Migration, docs, dependencies:** none. No new deep lane spelling: the new file's deep rows run under `SEARCH_DEEP=1` single-file. Owed to the scribe: one `AGENTS.md` line naming `src/search.futility.test.ts` beside the null-move lane.
- **Remaining (QE / owner):** owner acceptance of ADR-0061 ("accept ADR-0061" / "decline it"); then QE: A1 out of tree (own run), A3 (d) graded, A6 (C2′ 100 games at 100 ms, S′ smoke, the Levels deep lane), G5 / graded G6 / G11, UAT (QE verdict signs). Merge waits on the owner. If P1 merges first, this branch re-reads its door counts on the new base (ADR-0061 d9).
