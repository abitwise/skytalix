---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T22:05:41Z
subtask: qe-ABC-269-freeze
role: qe-e2e
ref: .grugops/context/qe-ABC-269-freeze/
branch: new grugops/ABC-269 from main (at dispatch) — worktree .claude/worktrees/qe-ABC-269-freeze (the Engineer builds on top of your commit on this same branch)
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core.
---
# Freeze ABC-269's QE positions before the build
Read plans/tickets/ABC-269*.md (QE freezes section), ADR-0064, arch-E1 notes (…d8150777) and raw/probe.
- Freeze, as committed fixtures plus a sealed PREREG note, BEFORE any E1 code exists: the 6 king-and-pawn endings for B1(d), the passer readings by phase for B1(e), ≥ 15 mirror positions for B1(a), and any other set the page names. Choose them independently of the probe where the page allows; record why each is in.
- No production code; fixtures/test data only (tests that need E1 code are written by the Engineer).
Fences: test fixtures + your records only. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-269-freeze, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result

**2026-11-02, QE/E2E (claude-opus-5-5), on `grugops/ABC-269` from `main` `3e55c6a4`, `src/` tree `58fa3eb4`.**
- Freeze only: no E1 code exists and none was written. No production line was touched, and no test that needs E1 was added.
- Every run was under `flock host-test.lock`, one at a time. Nothing was pushed or merged, and nothing is left running.

**Done: the sets are frozen.** They are in `src/evaluate.taper-corpus.ts` (test-only data; sha256 `05ed9e81…6339`). PREREG `20261102T222017Z-qe-e2e-decision-1b856350` was sealed and committed with the file (`d6a57653`) before the Engineer's first commit.

- **B1 (a), `TAPER_MIRROR_POSITIONS`: 30 rows** (the bar asks for ≥ 15).
  - One row per phase, 0–24, from removal ladders on position-4 and position-5 (`G3` roots). The kings are asymmetric, so Δ ≠ 0, and on 26 of the 30 rows Δ × (24 − w) is not a multiple of 24.
  - Two clamp rows (raw phase 28 and 32).
  - Two −0 traps: mg = 0 and |Δ × (24 − w)| < 24. The full-form blend fails them by `Object.is`; d2's delta form passes.
  - One row with an en-passant square at phase 9.
- **B1 (b):** the rows with `rawPhase ≥ 24`, plus `G3`'s rows at phase 24.
- **B1 (c), `TAPER_DOOR_CORPUS` (176) and `G3_CORPUS_MAIN_EVALUATE` (184):** the pre-ticket `evaluate`, recorded before the ticket.
- **B1 (d), `TAPER_KP_ENDINGS`: 6 graded.** 3 white and 3 black walking kings, every corner and every centre square, corner shelter none or partial. Pre-ticket readings −35 to −96. **Forecast by the rule: +34 to +85.**
- **`TAPER_KP_SHELTER_STRESS`: 3, a report until the Architect rules (`QE-269-a`).** The castled corner with both files sheltered, forecast **+13, +13, +23**: 2 of 3 are below the 20 cp bar by the design's own arithmetic.
- **B1 (e), `TAPER_PASSER_PAIRS`: 36,** plus the `TAPER_PASSER_PHASES` grid.
  - The kings sit on a8 / h1, where the king's two halves are equal, so a pair isolates the passer exactly.
  - Forecast: ≥ 1.6 × at phase ≤ 6, exactly 1.0 × at 24, and ≤ 1.25 × at 18 (equality on ranks 4, 6 and 7, which also catches the wrong rounding).
- **Checks on `main`:**
  - `verify.ts` on the committed file: 0 failures.
  - Typecheck exit 0, lint exit 0.
  - `npm test` **2 429 / 2 429** (65 files, 0 skipped, 9.37 s). The first run went red on `ABC-082` `A7`'s text guard, because the fixture's comment named the mirror corpus's file; the comment was reworded.
- **Gaps:**
  - **`QE-269-a` (MEDIUM, the Architect):** does B1 (d) cover the castled corner? (i) Out: a dated line scopes "the king walks", with E3 as the fix. (ii) In: S1–S3 join as frozen, E1 misses B1 (d), and the ADR re-opens. It does not block the build start.
  - **`QE-269-b` (LOW, Engineer):** build d2's delta form. The full form returns −0 against +0 (the frozen traps catch it).
  - **`QE-269-c` (INFO, Architect):** "(≥ 1.75 × by construction)" reads 1.6 × at rank 2.
  - **`QE-269-d` and `QE-269-e` (INFO, Engineer):** how to read each set; the forecasts are not readings; no coverage claim.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`; 4 of 4 read back):
  - PREREG `…decision-1b856350`;
  - forecasts `…observation-aea4ceba`;
  - gaps `…observation-34cbabaf`;
  - artifacts `…observation-32b171c7`.
  - The artifacts note went in as an observation: `artifact-ref` needs a §14-gate run id, and this freeze has none. No `finding`.
- **Commits:** claim `d4127f14`; fixture + PREREG `d6a57653`; notes `fbea0760`; then this closing commit.
- **For the Orchestrator:**
  - The Engineer may build on this branch.
  - Route `QE-269-a` to the Architect. The ruling is needed before B1 (d) is graded, not before the build.
  - `QE-269-b` goes to the Engineer as a note on the build.

### Trace row (10 cells, header order)

| qe-ABC-269-freeze | QE freeze of ABC-269's (E1 taper) B1 position sets before the build: B1 (a) 30 mirror rows over phases 0–24 (+ clamp, −0 traps, ep), B1 (b) raw ≥ 24 rows, B1 (c) pre-ticket evaluate on 176 + 184, B1 (d) 6 graded endings (forecast +34 to +85) + 3 shelter-stress (report), B1 (e) 36 passer pairs + phase grid | EPIC-011 | ADR-0064 (proposed; unchanged by QE) | none graded here (NFR-008: npm test 9.37 s, 2 429 / 2 429) | `grugops/ABC-269` (fixture + PREREG `d6a57653`; notes `fbea0760`) | `src/evaluate.taper-corpus.ts` (test-only data); verify.ts 0 failures; typecheck / lint exit 0 | UAT owed at the build (production lines); not signed by the freeze | QE-269-a MEDIUM (Architect ruling: sheltered corner in B1 (d)?); QE-269-b LOW; QE-269-c/d/e INFO | freeze done; the Engineer's build may start on this branch |
