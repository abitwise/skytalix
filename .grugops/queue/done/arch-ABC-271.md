---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T02:03:06Z
subtask: arch-ABC-271
role: architect-design
ref: .grugops/context/arch-ABC-271/
branch: new grugops/arch-ABC-271 from main — worktree .claude/worktrees/arch-ABC-271
width: wrap EVERY test/build/engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Probes small: each ≤ 30 min, hop ≤ 2 h; no games beyond what a PREREG names and ≤ 1 h total. Host paths only as placeholders.
---
# Design ABC-271 (E4a: passed pawns read the kings and the path — king distance, free path, rule of the square)
Why now: ABC-239's first pull closed NOT MET (…4c76bf7a); arch-ABC-239-f3f4 (…4eae0fd3, …69f22167) traced zugzwang.001's e1e5 to endgame halves of pawn/rook/king/passer and found no relation can hold it with today's features — the passer part needs free-path / king-distance terms.
Read plans/tickets/ABC-271*.md, ADR-0064 (mg/eg pairs), ADR-0067 (tuner; the second pull will fit E4a's terms), ADR-0068 (structure-only precedent), ADR-0069 (Q1 now in quiescence), ADR-0056 Phase 4.
Decide and write an ADR PROPOSED (next free id after ADR-0069): the terms (king distance own/enemy to the stop square, free path / blocked, unstoppable passer by the rule of the square, eg-weighted), cost per leaf (G2), whether ABC-271 ships hand values judged on play (100 games at 100 ms GAIN 50.0) or lands structure-only for the tuner (ADR-0068 form) — decide by a PREREG'd probe including zugzwang.001 at d9 and the mate floor; say which order (271 values → second pull, or structure → second pull) wins more for less host time. Also write ADR-0056's row E2 status line (first pull NOT MET; E4a before a second pull).
Fences: memory-bank/50-decisions + your records + scratch. No committed src/tools; no ticket/EPIC edits (BA/PM is closing ABC-239 in parallel). No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-271, contextRoot = worktree's .grugops/context, `at` from `date -u`); PREREG before any measured probe; queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-04T02:35:51Z. The PREREG `…eeb25cc6` (`029533f0`) and the addendum `…3a9eba86` (`904b3fff`) were sealed and committed before the runs they cover. The runs used scratch copies of `main`'s `src/` `8adb0a18` under the host lock, about 3 min of runs in all. No games were played, and nothing was committed to `src/` or `tools/`. The scratch copies and symlinks were removed, and nothing is left running.
- **ADR-0070, PROPOSED.** ADR-0070 was the next free id after ADR-0069; no other record used it.
  - **The terms:** king distance to the queening square, a free path, and the unstoppable passer by the rule of the square (U = 400, phase 0). They are endgame halves by rules on PASSED.eg, computed outside the pawn memo (memo 448 → 576 KiB), behind an off-door pair.
  - **The verdict: the rule values ship, judged on play, with intent GAIN.** The firing figure is 29.75 % at ≥ 10 cp.
- **The probe:**
  - I1 is exact. The mirror reads 0 / 226 and phase 24 reads 0 / 333.
  - The mate floor reads 0 / 163 and 0 / 190; zugzwang 7 / 7; `G1` 54 / 58, none newly missed; `G2` R = 1.0269. The endgame report set reads about 1.085 ×.
  - **`zugzwang.001` at depth 9:** e1f1, held by 191 cp, against 29 on `main`. On `26d06118` + E4a it reads e1f1 by +150, where the fit alone played e1e5. That is not a fit.
  - **E3 (generated relations) missed as pre-registered.** Every failure is explained: by king exposure, by the king leaving the path, or by trunc at phase 4 on 1 cp rank-2 steps. The relation domains and the resolution clause are restated, and no value moved.
  - **Taking choice rule 1 after that miss is a flagged judgment for the Orchestrator.** The fallback is structure only, in ADR-0068's form.
- **The order:** ABC-271 values → second pull. It costs about 0.7 h more host up front, and E4a's value is read independently of a second pull, which needs the owner's word on the bound form and B-T8.
- **Records:** ADR-0070; dated lines in ADR-0056 (D2 E2 status: first pull NOT MET, E4a before a second pull; E4; D6 item 5), ADR-0067 (item 5 and a log row) and ADR-0064 (d10). Notes `…eeb25cc6`, `…3a9eba86`, `…c9af6d84` (results) and `…bbc0a213` (decision, owed lines).
- **Owed lines** (BA/PM): the ABC-271 page (adr, intent GAIN, P0 counts, P1 (c)–(e) fixture conditions, the 576 KiB memo, the migration list, the order); EPIC-011 (rows E2 and E4, the Phase 4 order). The board is the Orchestrator's.
- **Owner question:** *"accept ADR-0070?"* Under reading (b) the build may start meanwhile.
