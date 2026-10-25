---
subtask: bapm-amend-ABC-215
role: ba-pm
ticket: plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
ref: .grugops/context/bapm-amend-ABC-215/
branch: new grugops/bapm-amend-ABC-215 from main (after the design merge), worktree ../wt-bapm-amend-ABC-215
width: 1 of 3 (records only)
---

# ABC-215 scope line: README licence sentence (before Ready for Dev)

## Do
- Per Architect `arch-design-ABC-215/…e04234f4`: `README.md:84-86` (ABC-216) says the evaluation values are CC BY-SA 3.0; that becomes false at this ticket's merge. Amend A8 (dated) so the build also updates that README sentence (and only it), keeping ABC-216's A2/A3/A7 true (Apache-2.0, LICENSE/NOTICE links, kit files MIT). No other scope change.
- Re-score DoR; give the board card line for In Design → Ready for Dev.

## Fences
- Only your worktree and `<scratchpad>/bapm215/`. No `src/`. No npm/vitest. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task bapm-amend-ABC-215). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-25T05:06Z): **`A8` amended (dated, old text kept). The build also corrects `README.md`'s licence sentence, and only that sentence (`A8a`). DoR 10 of 10. In Design → Ready for Dev. No other scope change. No STOP.**

Records only. Branch `grugops/bapm-amend-ABC-215` in `../wt-bapm-amend-ABC-215`, cut from `main` `da480b78`. One
commit, **`7d203017`**, not merged and not pushed. No npm or vitest ran. No edit to `src/` or `README.md`. Scratch:
`<scratchpad>/bapm215/` (a README simulation on a scratch copy, and the seal script).

Notes are in `.grugops/context/bapm-amend-ABC-215/notes/`. They were sealed with grugops 2.1.0 `context-io.js`
`admitAndAppend` (context root: the worktree's `.grugops/context`), and `readContext` read back 2 of 2:
- `20261025T050544Z-ba-pm-observation-879ae9d0`: the re-reads at `da480b78`;
- `20261025T050544Z-ba-pm-decision-fb4f7c9c`: the amendment and the DoR.

**The amendment** (page § Acceptance, under `A8`):
- **`A8` (as amended):** the name-only diff lists only `NOTICE`, `src/evaluate.ts`, **`README.md`**, and the
  `src/*.test.ts` / `src/__snapshots__/*` files that `A2` or `A5` explains. The `tools data src/levels.ts
  src/status-panel.ts` fence is unchanged.
- **`A8a`:** at the tip the sentence reads "skytalix is licensed under Apache-2.0; see [LICENSE](LICENSE). Some parts
  are under other / terms, and [NOTICE](NOTICE) lists them: four grugops kit files (MIT)." Line 84 is unchanged, and
  lines 85–86 become one line. The rest of `README.md` is byte-equal to `<base>`.
  - Checks: one `-U0` hunk `@@ -85,2 +85 @@`; 0 `michniewski|by-sa|chessprogramming` hits; 1 `four grugops kit
    files (MIT)` hit.
  - `ABC-216` `A7` (Apache-2.0, the `LICENSE`/`NOTICE` links, "other terms", no all-Apache sentence), `A2` (87 lines,
    8 headings) and `A9` hold.
  - If `<base>` moves the sentence, the result text is the same. If it changes it or removes it: STOP to BA/PM.
- **Dated pointers:** Scope 3 (the sentence goes too), and Security (d) (prose only, no limb, no trigger).
- **Re-reads:** the tree-wide `michniewski|by-sa` grep outside the records hits only `NOTICE`, `src/evaluate.ts` and
  `README.md:86`. No `src/` or `tools/` file reads the root README, so no pin moves. A scratch simulation confirmed
  the hunk, 87 lines and 8 headings.

**DoR: 10 of 10 → Ready for Dev.** Rows 2, 3, 4, 8 and 10 were re-scored. `QE-205-c` is open and does not block.

**Board card line** (for the Orchestrator; In Design 1/2 → 0/2, Ready for Dev 0/6 → 1/6). Append to the ABC-215 card
and move it to Ready for Dev:
> **2026-10-25: design ruled (`…e04234f4`): seven stated rules (c2), relations green, 16 pins move in 5 files by re-pin / ADR-0028 d2 / oracle rule; no level, no bound; G6 predicted MET (position-6 d8 −6.65 %, UNKNOWN - verify); one L, no split, no ADR, no owner word. BA/PM A8 amended (`…fb4f7c9c`): README.md licence sentence only (A8a: "…lists them: four grugops kit files (MIT)."; one hunk @@ -85,2 +85 @@; ABC-216 A2/A7/A9 hold). DoR 10/10 → Ready for Dev.**

Files on the branch:
- `plans/tickets/ABC-215-…md` (+56/−0);
- 2 notes.

Not touched: `src/`, `README.md`, `NOTICE`, ADRs, `memory-bank/`, `plans/board.md`, `plans/traceability.md`, other
worktrees, the remote and git config. The page frontmatter still reads `column: Ready`, left for the Orchestrator's
move. In main's checkout, only this queue record and its claim moved, uncommitted, for the Orchestrator.

No stop.

### Trace row (10 cells, header order)

| ABC-215 (bapm-amend-ABC-215) | A8 amended (dated): README.md joins the fence list, limited to the licence sentence (A8a: "…lists them: four grugops kit files (MIT)."; one -U0 hunk @@ -85,2 +85 @@; ABC-216 A2/A7/A9 hold); DoR 10/10 | EPIC-008 | own evaluation values by rule; CC BY-SA carve-out removed from NOTICE, the src/evaluate.ts header and the README sentence | NFR-005 G6 unchanged (predicted MET, UNKNOWN - verify); no bound moves; notes …879ae9d0, …fb4f7c9c | grugops/bapm-amend-ABC-215 @ 7d203017 (records only)<br>plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md (A8 amendment, A8a) | — (records only; README change simulated on a scratch copy) | owed at build (QE verdict signs) | — | In Design → Ready for Dev |
