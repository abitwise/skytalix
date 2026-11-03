---
id: 20261103T093305Z-architect-design-decision-8ccb561f
kind: decision
by: architect-design
at: 2026-11-03T09:33:05Z
verified_by: 
confidence: high on the ruling's arithmetic (QE's forecast re-checked by hand on S1 from KING_TABLE, the 40-15m rule and kingExposure; base -117 is QE's main reading) and on 'no bar moved, written before any E1 code' (grugops/ABC-269 c9c27910 src differs from main only by the fixture; its worktree clean); the scope of Q-3K-4 (b) beyond evaluation tickets is the Orchestrator's/owner's to widen
refs:
  - arch-ABC-269-rule
  - grugops/arch-ABC-269-rule
  - ABC-269
  - EPIC-011
  - E1
  - E3
  - ADR-0064
  - ADR-0056
  - ADR-0060
  - NFR-005
  - Q-3K-4
  - QE-269-a
  - QE-269-b
  - QE-269-c
  - B1
  - B7
  - 17725732
  - c9c27910
  - d6a57653
  - src/evaluate.taper-corpus.ts
  - orch-2026-10-30a/20261102T221500Z-orchestrator-decision-cc7db847
  - qe-ABC-269-freeze/20261102T222129Z-qe-e2e-observation-34cbabaf
  - qe-ABC-269-freeze/20261102T222129Z-qe-e2e-observation-aea4ceba
  - qe-ABC-269-freeze/20261102T222017Z-qe-e2e-decision-1b856350
  - arch-E1/20261102T215541Z-architect-design-decision-d8150777
  - arch-E1/20261102T214348Z-architect-design-decision-01c2d6a5
supersedes: 
seal: sha256:3d42f5a7526fe0bc780657c00e17ad2654f0fded231f118a2961b25bb2169610
---

# arch-ABC-269-rule decisions: `QE-269-a` ruled (a), the claim narrowed and no bar loosened. B1 (d)'s ≥ 20 cp covers the corner king that is NOT behind both of its shelter pawns (QE's D1–D6, `cornerShelter` none / partial). The castled corner (S1–S3, forecast +13 / +13 / +23) is a report that E3 owns. No PREREG addendum is needed. The owner's "64 yes, Q-3K-4 b" is folded into `ADR-0064` (ACCEPTED, not in force until `ABC-269` merges; B7 graded on `NFR-005`'s floor) and into `ADR-0056` (status, D2 E1 / E3, D6 order with P1 parked after P3, D7 Q-3K-4 answered)

Architect/Design, task `arch-ABC-269-rule`, records only, on `grugops/arch-ABC-269-rule` from `main` `17725732`. No `src/` was touched and nothing was run. Inputs:
- QE's freeze on `grugops/ABC-269` `c9c27910`: gaps `…34cbabaf`, forecasts `…aea4ceba`, PREREG `…1b856350`, and the fixture `src/evaluate.taper-corpus.ts` at `d6a57653`;
- the owner's word `orch-2026-10-30a` `…cc7db847`;
- `ADR-0064`, `ADR-0056` and the `ABC-269` page.

## 1. `QE-269-a` (MEDIUM): ruling (a), the claim narrowed
- **The narrowed claim, exact** (`ADR-0064` § Decision log, 2026-11-03):
  - B1 (d)'s ≥ 20 cp bar covers king-and-pawn endings at phase 0 where the corner king is **not** behind its own pawns on both files of its shelter (`cornerShelter` `"none"` or `"partial"`). These are QE's six graded rows D1–D6, unchanged.
  - "The king walks" means: the centre beats that corner by ≥ 20 cp.
  - The castled corner is not covered: the corner king behind its own pawns on both shelter files, with the centre king's three files bare (`"full"`, S1–S3). E1 grades nothing there.
- **Why the line falls there:**
  - At E1 only the king's square table tapers. `kingExposure` keeps equal halves (d10).
  - At phase 0, centre minus corner moves by base + 130 at the king's own corners and by base + 90 at the opponent's corners. So the bar holds where base ≥ −110 (own corner) or ≥ −70 (far corner).
  - The castled corner reads −117 on `main` (exposure −105), so E1 forecasts +13 / +13 / +23.
  - Checked by hand on S1: the swing from `KING_TABLE` and the 40 − 15 m rule, and the 105 cp from `kingExposure`. The −117 base is QE's reading on `main`.
  - The sign turns (the centre is preferred); only the margin is short.
- **Why not (b), re-open:**
  - The residual sits in a term E1 leaves alone on purpose (d10, and § Alternatives already named the 105 cp).
  - Fixing it now means an endgame half with no rule, or the `ADR-0031` shelter gate (`ABC-205`'s tree growth).
  - Either would void B0's counts, the `arch-E1` form choice and QE's forecasts. It would also need a new probe and a second acceptance, for a slice of positions that ± 56 cannot resolve.
  - Said plainly: since `Q-3K-4` = (b), `G6` is no longer a reason against the shelter taper. The two remaining grounds are no rule and king-safety scope (E3 under the tuner).
- **Not a loosening:**
  - B1 (d) was always "6 endings QE freezes", at ≥ 20 cp. The six graded rows are unchanged byte for byte.
  - S1–S3 were frozen apart, with both outcomes written into QE's PREREG.
  - The text is written before any E1 code exists. `grugops/ABC-269` `c9c27910` differs from `main` under `src/` only by the fixture, its worktree is clean, and `se-ABC-269` has not been dispatched.
- **S1–S3:**
  - They stay a report (the PREREG's branch "if it is out, they stay a reported reading").
  - The Engineer prints the three readings in the PR beside B1 (d), and QE reads them in its verdict against +13 / +13 / +23. A difference is explained, not graded. B0 already binds the build to the arithmetic, so a graded sign row would add nothing.
  - They are offered to E3 as its first graded rows, at ≥ 20 cp.
- **PREREG / fixture addendum: none, and nobody writes one.**
  - No row, bar or byte changes; the sha256 stays `05ed9e81…6e96339`.
  - The fixture docblock's "a REPORT until the Architect rules" stays as frozen. Editing it would force a QE re-freeze, which is not owed.
  - `arch-E1`'s PREREG `…01c2d6a5` (the probe's form choice) is untouched.
  - QE pulls this note at the verdict.

## 2. `QE-269-b` and `-c` (INFO): wording, no bar moved
- **d2, "bit for bit":** the same value, but not the same bits. With mg = 0 and |Δ × (D − w)| < D, the full form gives −0 against +0. **Only the delta form is built.** Dated line at d2.
- **B1 (e), "by construction ≥ 1.75 ×":** the lowest ratio under trunc is 1.6 × (rank 2 at phases 5–6). At phase 18, ranks 4, 6 and 7 meet ≤ 1.25 × at equality. The bars are unchanged. Dated line at B1 (e).
- `QE-269-d` and `-e` are the Engineer's and need no ADR line.

## 3. The owner's answers, folded (verbatim "64 yes, Q-3K-4 b", `…cc7db847`)
- **`ADR-0064`:**
  - § Status reads ACCEPTED 2026-11-02, NOT IN FORCE until `ABC-269` merges. It releases B8 and the merge, after the build and QE. The proposed text is kept below it.
  - New § Decision log: five dated rows plus the `QE-269-a` ruling.
  - Dated lines at:
    - B7: the alternative binds; every run at depth ≥ 6 (FAIL below), depth 7 a WARN; the median against base is reported. B0 stays the instrument check.
    - F3: the `G6` median clause no longer fires. F3 fires on `G2` > 1.05 × or on a B7 run below depth 6, with one value-identical cost cut and one new reading. A second miss: not merged. The "put `Q-3K-4` to the owner" step is moot.
    - § Alternatives: "so the king walks" scoped.
- **`ADR-0056`:**
  - Status fold block 2026-11-03. Still open (his): Q-3K-6, 7 and 8.
  - D2: row E1 (`ADR-0064` accepted; `QE-269-a`) and row E3 (inherits the castled-corner residual; S1–S3 offered as its first rows; judged on play under (b)).
  - D6: the order as worked. Phase 2 closed: P2 dropped, P3 done, **P1 parked after P3**, P5 deferred, P4 and P6 stubs. E1 pulled forward; R1 after E1. **The owed "P1 parked after P3" line:** `arch-E1` had already written it in D2 (`3d20d917`). D6's order lines still read "P2 then P1 → P4…", so this fold adds the D6 line.
  - D7: Q-3K-4 answered (b). Graded: C2′ + S′ + Levels and `NFR-005`'s floor at `LEVELS[5]`. Reported: `G6`'s median against base.
- **Scope of (b), as recorded:** D7's question said "value-changing tickets". The Orchestrator recorded "value-changing evaluation tickets". This fold keeps the narrower scope. Every other value-changing ticket keeps `G6` "≥ base" binding until a wider reading is recorded. An open point for the Orchestrator, not blocking.

## 4. Fences kept
- Only `memory-bank/50-decisions/ADR-0064…` and `ADR-0056…`, plus this task's records and queue moves, were edited.
- No `src/`, no `plans/`, no board.
- `ADR-0031`, `ADR-0061`, `ADR-0060` and `ADR-0063` are untouched.
- The page lines owed to BA/PM are the observation note of this task.

## Board move
None by this role. `ABC-269` stays where the Orchestrator has it. The next hop is `se-ABC-269` on `grugops/ABC-269`, once BA/PM's page fold lands or alongside it (the Orchestrator's call). Nothing in this ruling blocks the build.
