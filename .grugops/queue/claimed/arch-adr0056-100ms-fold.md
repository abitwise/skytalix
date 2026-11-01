---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:10:49Z
subtask: arch-adr0056-100ms-fold
role: architect-design
ref: .grugops/context/arch-adr0056-100ms-fold/
branch: new grugops/arch-adr0056-100ms-fold from main (worktree .claude/worktrees/arch-adr0056-100ms-fold)
width: records only. Two SE hops (ABC-249, ABC-254) run tests under the host lock; a BA/PM records hop (bapm-100-400-rule) edits plans/ beside you.
---
# Architect: fold the owner's 100/400-at-100 ms rule and the probe readings into ADR-0056
## Inputs
- Owner word (verbatim inside): .grugops/context/orch-2026-10-30a/notes/20261101T125800Z-orchestrator-decision-2896c6eb.md — no SPRT; per strength change 100 games at 100 ms (new vs base); per epic 400 games at 100 ms. Claim reading stays at 40/15 vs SF E3000 (ADR-0056).
- qe-tc-depth-probe readout (merged 1d4e1649): .grugops/context/qe-tc-depth-probe/ (decision …b505d675, observations …1889e3b0, …07357280, …9fd1fdce, …f440e5f5). Key: skytalix 100 ms → depth median 6 (500 ms → 8, 4 s → 10); overshoot max 4 ms, 0 losses; 259 self-play games/h at 100 ms; SF pick-depth p95 ≤ 19.1 ms up to E2600 (100 ms gives ≥ 5× headroom; C1's 4×p95 rule met, its 0.5 s floor is your call); E > 2600 unmeasured; 100 games ≈ ±48 Elo, 400 ≈ ±24 Elo. Readings SHARED (foreign vitest) — lower bounds.
## Do
- Supersede ADR-0056 C2/C3 (SPRT lane) with the owner's fixed-count rule: what "pass" means for a 100-game change read and a 400-game epic read (state the decision rule and its known blind spot honestly: ±48 / ±24 Elo), opponent for each (self-play new-vs-base for per-change; state the per-epic opponent and SF move time — 100 ms per the probe, or keep/drop the 0.5 s floor with reason), restart/warm-up handling (first move cold under restart=on).
- Note what is needed before SF at E > 2600 can be used at 100 ms (unmeasured).
- Correct C2's depth estimate with the measured table.
- Say whether ABC-255 (M0 SPRT lane) should be re-scoped to a fixed-count 100/400 mode, so BA/PM can act (they are told to follow your ruling if it lands first; otherwise they word it as pending your ruling).
## Fences
memory-bank/50-decisions/ADR-0056* and your notes only. No plans/, board, src/, tools/, data/, AGENTS.md. Run nothing (no tests, no engines). No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task arch-adr0056-100ms-fold, contextRoot = worktree), commit, ## Result + trace row here, brief + claim to done/.
