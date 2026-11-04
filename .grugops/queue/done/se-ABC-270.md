---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T22:27:55Z
subtask: se-ABC-270
role: software-engineer
ref: .grugops/context/se-ABC-270/
branch: new grugops/ABC-270 from main — worktree .claude/worktrees/se-ABC-270
width: wrap EVERY test/build/engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core; the lock is shared with se-ABC-279. No games. Hop host ≤ 1 h. Host paths only as placeholders.
---
# Build ABC-270 (E3a structure only) per ADR-0068 (ACCEPTED)
Read plans/tickets/ABC-270*.md (K0–K4), ADR-0068 in full, QE's frozen rows: .grugops/context/qe-ABC-270-freeze/notes/20261103T222633Z-qe-e2e-decision-fa82b3f3.md and raw/pairs.json (sha256 68769ea9…c681) — copy the rows unchanged; QE-270-a: add a test-only per-king exposure read (behind the existing seam style, ABC-274 S1–S3 conditions) so QP2 can be graded per king.
- Three queen-on pairs at {0,0} in src/evaluate-params.ts; the flags from the walk's existing king test (type >= QUEEN), no new per-piece op; linear terms the tuner can fit.
- K0 node identity (counts in the ticket / ADR-0068 d6), K1 unit rows incl. the frozen pairs at ×2 through the seam, K2 zero re-pins in every lane, K3 G2 ≤ 1.05× (ALONE-ish: run it when the lock is yours, two sessions as ABC-274 did), K4 G6 ≥ base with every run at depth ≥ 6. S2 nps reported only.
- Phase-24 re-find of ABC-083 A2 (b) and A3 (b) per scope 5.
- Gates: lint, typecheck, unit, build, npm test, the deep lanes AGENTS.md names for evaluation changes.
## Fences
src/evaluate.ts, src/evaluate-params.ts, their tests, your records. No search edits (se-ABC-279 is in src/search.ts). No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-270, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.

## Result
- **by:** software-engineer (claude-opus-5-5), **at:** 2026-11-04T00:09:25Z, **branch:** `grugops/ABC-270`, **code:** `795a6b61` (`src/` `0f393c18`); base `main` `src/` `4cb84035` (unmoved since the cut, so one K0 set).
- **Built (ADR-0068 d1–d3):** three queen-on pairs at `{ 0, 0 }` with the ADR's rule comment; packed in `PACKED_TERMS` 5–7, loaded by `loadParameters` (so the seam and the tuner's file shape cover them); the walk's `type === KING` → `type >= QUEEN` gathers both queen flags (no new per-piece op); `kingExposure(…, enemyQueen)` adds the queen-on terms once per king, before its file loop; C1 intact. QE-270-a: test-only `kingExposureForTest` (per-king, unpacked).
- **K0:** 7/7 exact (1 296 788 / 2 733 330; 404 930 / 926 005 / 1 692 669; 839 514 / 1 533 901) + 4 door counts; base and build output byte-identical. Cross-build 0 / 9 120.
- **K1:** (a) mirror 0 mismatches at 0 and at 2 × base; (b) `evaluate` `Object.is` the pre-ticket values on G3 184 + door 176 + QE 28, and 0 / 25 620 cross-build; (c) QE's 7 pairs exactly 3 × per king in each half, other king and QC8 unmoved, evaluate nets = QE's (rows deep-equal `pairs.json` 68769ea9…); (d) A9 reads the queen-on maxima (|Σ mg| ≤ 15 910, |Σ eg| ≤ 17 510 at 0); (e) A2 (b) / A3 (b) phase-24 twins green on base and build, red with the term zeroed; source row green. Six mutants each red.
- **K2:** 0 re-pins. npm test 2 588 → 2 604 / 2 604 (+16). Deep lanes all green (taper 169, null-move 44, futility 53, search 57, quiescence 116, tt 40 / 26, PVS/LMR 29, ordering 43, engine 82, pawns 44, levels 57, puzzle 18 at 54 / 58); puzzle-weakened red by design. Lint, typecheck, build exit 0.
- **K3 / K4 (Engineer pre-reads, host not ALONE: foreign `abtop` on one core):** G2 R = 0.9899 (r 0.9987 / 0.9811, control c 1.0042 / 0.9867). G6 MET: kiwipete 9 × 5 / 9 × 5, position-6 10 × 5 / 10 × 5, every run ≥ 9, 0 WARN; Tctl wait relaxed 60 → 75 °C (stated). S2 nps H / B 0.98–1.02 (report). N8-LANE 9.53 → 9.69 s (report).
- **Owed:** QE K3 under its PREREG, K4, UAT verdict; Architect's view on the per-king test export (UNKNOWN - verify).
- **Notes:** se-ABC-270 `…007dc90a` (decision), `…15cac083` (acceptance), `…bd09c051` (tests), `…77fd2bd9` (artifacts).
