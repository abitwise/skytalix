# se-ABC-270 artifacts: branch `grugops/ABC-270`, code commit `795a6b61` (`src/` tree `0f393c18`), five files under `src/`: `evaluate-params.ts` (+3 pairs), `evaluate.ts` (walk flag, `kingExposure` flag, loader slots, test-only `kingExposureForTest`), and three test files. Not pushed or merged; the merge is human

- **Branch:** `grugops/ABC-270`, worktree `.claude/worktrees/se-ABC-270`, from `main` `8f086ee8` (`src/` `4cb84035`). `main` has since moved to `f920bb48` with records only; its `src/` is still `4cb84035`, so the K0 base did not move and one set of counts stands.
- **Commits:** `1f312412` (claim), `795a6b61` (code + tests, "feat(ABC-270): E3a structure only …"), then one records commit (notes, trace row, board, brief to `done/`).
- **Diff stat (`795a6b61`):** `src/evaluate-params.ts` +13; `src/evaluate.ts` +78 / −12; `src/evaluate.queen-on.test.ts` +867 (new; most of it QE's frozen rows and the `*_PRE` values); `src/evaluate.taper.test.ts` +23 / −3; `src/evaluate.king-mobility.test.ts` +48 / −9.
- **New exports:** `KING_SHELTER_MISSING_QUEEN`, `KING_FILE_HALF_OPEN_QUEEN`, `KING_FILE_OPEN_QUEEN` (data); `kingExposureForTest(position)` (TEST-ONLY, no production caller). No dependency, option, input or format change.
- **Fences kept:** no `src/search.ts` / `src/engine.ts` / `src/quiescence.ts` edit (se-ABC-279's files untouched); no `tools/` edit; `plans/nfr-catalog.md` untouched.
- **Scripts and outputs** (`.grugops/context/se-ABC-270/raw/`, host paths written as `<scratch>`):
  - `scripts/freeze-pre.ts`: the pre-ticket `evaluate` values for K1 (b), read on `git archive main src` before the build;
  - `scripts/twins.ts`: the scratch search that picked the phase-24 twins; `scripts/twins-base.ts`, `scripts/old-rows.ts`: twin and old-row readings on base and head;
  - `scripts/rows-equal.mjs`: QE_ROWS deep-equals `pairs.json`'s rows (sha256 `68769ea9…c681` read back);
  - `scripts/b0.ts`, `scripts/a2.ts`, `scripts/xbuild.ts`: copied from se-ABC-274 unchanged but for the first comment line;
  - `scripts/deep.sh`, `scripts/gates.sh`, `scripts/xb.sh`: run orchestration;
  - `scripts/timing/`: `g2.ts` (qe-ABC-274's shape, arms B, C, H), `nps.ts`, and qe-ABC-268's `g6.mjs` / `timed.mjs` / `host.mjs` with qe-ABC-274's `grade-g6.mjs`, unchanged;
  - `out/`: `b0-base.out`, `b0-head.out`, `a2.out`, `xbuild.out`, `twins.out`, `mutants.txt`, `gates/`, `deep-head/exits.txt`, `timing/`.
- **Environment:** the worktree had no `node_modules`; a symlink to the main checkout's was added (git-ignored, removed before the last commit). A detached `main` worktree was made under the scratchpad for the base `npm test` and removed afterwards. `npm run build` wrote `dist/` (git-ignored), removed afterwards.
- **Records:** board ABC-270 In Development → In Review (outgoing line archived in `plans/tickets/history/ABC-270-board-history.md`); trace row in `plans/traceability.md`; brief + claim in `.grugops/queue/done/`.
