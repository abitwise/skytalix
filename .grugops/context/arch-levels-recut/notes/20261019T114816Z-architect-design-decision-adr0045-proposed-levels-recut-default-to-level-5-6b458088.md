---
id: 20261019T114816Z-architect-design-decision-adr0045-proposed-levels-recut-default-to-level-5-6b458088
kind: decision
by: architect-design
at: 2026-10-19T11:48:16Z
verified_by:
confidence: medium
sealed: false
task: wave-2026-09-25
subtask: arch-levels-recut
refs: [ABC-087, ABC-085, ABC-101, ABC-171, ABC-173, ADR-0045, ADR-0044, ADR-0038, NFR-004, NFR-005]
---

# ADR-0045 PROPOSED: the levels become 100/0.4, 180/0.2, 330/0.1, 1 000/0.05 and 3 000/0, and `DEFAULT_LEVEL` moves from 3 to 5, where it plays as today

Hand-authored and unsealed. The owner's word was menu (b), note `…b2e6d4a9`. **Owner acceptance is owed.** The full text and the
evidence are in `memory-bank/50-decisions/ADR-0045-…md`. Its scope comes from `ABC-085` § Dependencies, "Named risk to `A2`", and its
risk from the verdict note `…4c1d8e27`.

- **Context.**
  - Over a 3 000 ms default, `NFR-004`'s ceiling leaves 1.67x, which buys +0.36 ply. One ply costs 2.67x.
  - No blunder rate makes a level stronger than rate 0.
  - So no level can be reliably stronger than the shipped engine at 3 s. Levels 4 and 5 sat in that gap and played as one engine.
- **The chosen design.**
  - **The table (D1)** is data only. Each step halves the blunder rate. In time, it adds about one ply at the top two steps and about
    0.6–0.8 ply at the bottom two.
  - **`DEFAULT_LEVEL` = `HARDEST_LEVEL` = 5 (D2).** `LEVELS[5]` is `{ 3000, 0 }` = `DEFAULT_BUDGET_MS`, which is today's level 3.
    `DEFAULT_BUDGET_MS` does not move. `DEFAULT_DIFFICULTY` follows `DEFAULT_LEVEL`.
  - **The mechanism is unchanged (D3).** No depth or node field is added to a level.
  - **UCI (D4).** `Skill Level` defaults to `DEFAULT_LEVEL` (5). Levels 3 and 4 now take the `createLevel` path, so `go depth`,
    `nodes` and `mate` are ignored there and no score is sent.
- **The cost to the default player: none in play.** A no-flag game or a GUI default plays the same moves. What changes is the label,
  and that no level sits above the default. Today none does in measured terms either: level 4 scored 32.5 % against level 3.
- **Alternatives rejected** (ADR § Alternatives):
  - **(a) the default kept at 3, at 500 ms.** The runner-up. Its default plays about 1.9 plies shallower and breaks `NFR-005`'s
    referent.
  - **(b) rates at 3 and 4 on today's budgets.** The rate gap is the only separation, and the default blunders 10 % of its moves.
  - **(c) `maxDepth` and (d) `maxNodes` per level.** Each adds a third field and breaks `ABC-101` `A7` and the `Level` pin. (d) is the
    budget dial twice on the virtual clock.
  - **(e) the default at level 4 with 5 at 4 500 or 5 000 ms.** Predicted RED again (+0.20 / +0.36 ply).
  - **(f) fewer levels.**
  - **(g) menu (c).**
- **NFR impact.**
  - `NFR-004` clause A is unchanged. Clause B is still enforced by the clamp, though no level reaches it.
  - `NFR-005`'s referent is unchanged.
  - `NFR-008` gets no new lane.
  - Security/NFR rules the catalog line at `ABC-173`'s gate. The catalog is not edited here.
- **The re-measure (D6).**
  - The full 180-game verdict at step 4, with the harness unchanged and route V with `--reporter=verbose`.
  - All five pairs re-run, because each contains a changed level. The staleness rule makes the old verdict STALE on `ABC-173`'s merge
    anyway.
  - It runs on a commit whose `src/` equals what merges. The `A0` pre-flight comes first.
  - About 5.5 h, roughly 3.5–7.5 h. That is an estimate from run 2's recorded rates.
  - It is one pre-registered shot with no tuning loop.
- **Open questions.**
  - **Q1:** default at the top, overturning `ABC-101` ruling 2, or take (a).
  - **Q2:** rates 0.1 / 0.05 at levels 3 and 4, or 0.
  - **Q3:** the verdict before UAT, on the QE-passed branch, or after the merge.
- **Test strategy, for `ABC-173`.**
  - The table and default pins.
  - A byte-equal default move, the old level 3 against the new level 5, on virtual clocks.
  - `git diff --numstat` shows 0 lines in `src/engine.ts`, `src/search.ts` and `src/virtual-clock.ts`.
  - The UCI option line.
  - At QE: `ENGINE_DEEP=1` on the levels lane, and `LADDER_DEEP=1` (`A3`/`A4`/`A5` only).
  - The verdict as a separate run.
- **Migration impact.** No data and no persisted state. The level is chosen per session (`ABC-101` ruling 3).
