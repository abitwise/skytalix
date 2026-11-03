---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T10:49:53Z
subtask: arch-ABC-269-F3
role: architect-design
ref: .grugops/context/arch-ABC-269-F3/
branch: grugops/arch-ABC-269-F3 — worktree .claude/worktrees/arch-ABC-269-F3 (from main; read the build with `git show grugops/ABC-269:<path>` or a scratch checkout — do not commit src)
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core. The ABC-239 design shares the lock. Timing reads only if you record the window; prefer the Engineer's paired same-session readings.
---
# F3 fired on ABC-269: order the one allowed cost cut
se-ABC-269 (grugops/ABC-269 110292d4; notes …7445784f, …669f366c, …ce3d0c5f in .grugops/context/se-ABC-269, now also on main): E1 built; B0 exact 11/11 (0.96–1.03×), zugzwang 7/7, mate floor 0, G1 54/58, B1 (d) D1–D6 all ≥ 20, S1–S3 = forecast; npm test 2 519/2 519. **G2 = 1.0711× / 1.0672× > 1.05×** → ADR-0064 F3: STOP to Architect/Design; one value-identical cost cut allowed (incremental phase or packed score), node-equal by B0, then one new reading; a second miss = not merged.
- Engineer's localisation: the per-piece phase add in the board walk; a scratch copy without it reads 1.003×; six same-value micro-variants read 1.065–1.086×.
Rule: (1) is the G2 miss real (shared-host micro-benchmark; the internal 1.003× control) or should QE re-read B6 first in a recorded window — decide, don't loosen; (2) which single cut (incremental phase in make/unmake vs packed score vs other value-identical form), with file list, the B0 node-equality proof rows, and exactly which reading follows (G2 re-read protocol, pre-registered; under Q-3K-4 (b) G6 is reported, B7 graded on the depth-6 floor); (3) update ADR-0064 § Decision log.
Fences: memory-bank/50-decisions + your records + scratch. No committed src. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-269-F3, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result; brief + claim to done/.

## Result

**2026-11-03T11:00:52Z, Architect/Design (claude-opus-5-5), on `grugops/arch-ABC-269-F3` from `main` `47084b6a`.** Records only. No `src/` or `plans/` was touched, and no timing was taken. The one run (sealing the notes) went under `flock host-test.lock`. Nothing was pushed or merged, and nothing is left running.

- **(1) The miss is real. QE does not re-read the uncut build.**
  - `G2` read 1.0711 / 1.0672 ×. Their mean, 1.069, is `ADR-0031` d3's verdict, and it is above 1.05.
  - Five sessions of the build read 1.067–1.112. In the same sessions, a second copy of `main` read 0.9888 (the noise control), and the build without the walk's phase and king adds read 1.0032.
  - A re-read could only pass by noise, which would be shopping for a reading. F3 fires.
- **(2) The cut ordered: C1, the phase leaves the walk** (O1-e-style incremental phase, carried by the recursion).
  - The recursion carries the phase as one integer: seeded by `phaseOf` at the root; each child is `phase − PHASE_WEIGHT[captured & 7] + PHASE_WEIGHT[promotion]`; a null move keeps it.
  - The tapered evaluation takes the phase as an argument. The king Δ is read after the walk. So the walk is `main`'s walk again, which is v2's measured 1.0032 form.
  - Files: `src/evaluate.ts`, `src/quiescence.ts`, `src/search.ts`, `src/engine.ts`, and the tests that call `quiesce` / `futilityNode` directly. `position.ts`, `apply.ts`, `legal.ts`, `moves.ts`, `zobrist.ts`, `evaluate-params.ts` and QE's fixture are untouched.
  - **Not on `Position`:** that would break `ADR-0002` clause 1, and it is `ADR-0020` d3's rejected alternative.
  - **Not the packed score:** it packs Δ, not the phase, and v8 read 1.0726.
  - **Node-equality proof, P1–P7:**
    - P1, B0 exact (5 + 2 + door counts);
    - P2, a phase oracle walk over the perft set;
    - P3, `evaluate` `Object.is`-equal to the uncut build;
    - P4, cross-build equal trees (190 positions) and doors (8 360 rows);
    - P5, a guard against a per-call phase walk, with 4 planted defects;
    - P6, zero re-pins in every lane (a re-pin means a defect, STOP);
    - P7, the gates.
  - The Engineer takes no timing of the cut.
- **The one reading:** `G2`, by QE, under the PREREG `…e36ee7ca`.
  - The miss's instrument (`g2b.ts`): two sessions, reverse arm order.
  - Arms: `main` B, a `main`-copy control C (a session is void outside 0.970–1.030; one re-run at most), the cut's shipped entry H with the phase supplied, and the uncut build U as a report.
  - **MET iff the two-session mean of H/B ≤ 1.0500.** ns per node is reported beside it.
  - **If it is met:** B5, B7 (`Q-3K-4` = (b): every run ≥ 6, median reported) and B8.
  - **If it is not met:** the second miss, **not merged**.
- **(3) `ADR-0064`:** a Status bullet, two § Decision log rows and a dated block, and dated lines at d6, B6, F3 and § Alternatives (the packed score and O1-e). No bar text changed.
- **Notes (sealed):**
  - decision `20261103T105957Z-architect-design-decision-a0468a78` (the ruling and cut C1);
  - decision `20261103T105957Z-architect-design-decision-e36ee7ca` (the PREREG of the `G2` re-read).
- **Next (Orchestrator):** `se-ABC-269-cut` (C1 plus P1–P7, no timing), then `qe-ABC-269` (the PREREG `G2` first). A BA/PM fold line on the `ABC-269` page at F3 / B6 is owed, and it is not blocking.
