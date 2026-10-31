---
subtask: qe-ABC-247
role: qe-e2e
ticket: ABC-247
ref: .grugops/context/qe-ABC-247/
branch: new grugops/qe-ABC-247 from grugops/ABC-247 cec9c252 (worktree .claude/worktrees/qe-ABC-247); code 02f4f3d4
width: ALONE for the probe games; only a records-only Architect hop beside you
---
# QE ABC-247 (XS, P1, tools only): rpair passes Skill Level 6; the A2 probe
## Read
The ticket page (A1–A4, Test notes 1–3); qe-EPIC-010-m1-batch's notes and raw/probe/ (the 3 000 ms evidence and the method); se-ABC-247's notes; ABC-225's page (rpair).
## Do
- PREREG first.
- A1: re-check pair-check (25/25) and mutate the token out to confirm red; check the `r`/`d` argvs byte-equal to main.
- A2, ALONE: block 01's dry-run argv through cutechess-cli at `-rounds 1`.
  - Run it once at base ca6e675c and once at head (built from the branch tip; src equals main), 2 games each.
  - The log must show `setoption name Skill Level value 6` and only `go movetime 4000`.
  - Skytalix must read 0 moves at 3.0 s and ≥ 20 at 4.0 s, with 0 faults and 0 time losses.
  - Control without the token at base: 3.0 s.
- A3: spot-check the SE's file:line readings. A4: gates, `npm test` with 0 skips, empty src/data diff.
- Verdict PASS / PASS_WITH_GAPS / FAIL (no UAT, tools only).
## Fences
- No edits to src/, tools/, data/ or the board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`.
- Thermal stop: Tctl median > 85 °C. Scratch `qe-247/`, kept small and removed at the end. Leave no process running.
## Publish
Sealed notes (task `qe-ABC-247`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-31, QE/E2E. QE verdict: PASS** at `cec9c252` (code `02f4f3d4`). Branch `grugops/qe-ABC-247` from the SE's tip. The PREREG `3050c636` was committed before any check, build or game. Notes are in commit `6ff161a8`. A2 ran ALONE, beside a records-only Architect hop. Nothing was edited under `src/`, `tools/` or `data/`, and the board was not touched. Not merged, nothing pushed. Tools only, so no UAT: this verdict closes the QE gate.

- **Notes** (task `qe-ABC-247`): decision `…236bbe39`; A1/A4 `…47dcfb73`; A2 `…17c50af0`; A3 `…4d0b3017`; findings `…07d2a834`; artifacts `…91d364c5`.
- **A1 MET.**
  - pair-check: **25/25 pass**, 0 fail, 0 skipped.
  - M1 (token removed): **3 red**. M2 (level 5): 3 red. M3 (token leaked into r/d): 2 red.
  - `r`/`d` dry runs, main vs tip, 4 commands: **byte-equal**, with no `Skill Level`.
  - rpair (the batch command): **+20 `option.Skill Level=6`, −0**. In all 20 argvs the token appears once, right after `restart=on` in skytalix, and never in Stockfish.
- **A2 MET** (block 01's dry-run argv, `-rounds 1`, 2 games each, `--concurrency 1`):
  - **Base `ca6e675c` + token:** `setoption name Skill Level value 6` once per instance, before its first `go`. Every skytalix go is `go movetime 4000` (×88). Clocks: **0 at 3.0 s, 84 at 4.0 s**.
  - **Head `cec9c252` + token:** the same setoption. `go movetime 4000` ×128. Clocks: **0 at 3.0 s, 125 at 4.0 s**.
  - **Control (base, no token):** no setoption. `go movetime 4000` ×97. Clocks: **95 at 3.0 s, 0 at 4.0 s**.
  - Every run had 0 faults, 0 time losses and an empty skytalix stderr. The engine's `info … time` agrees: max 4 001 / 4 001 / 3 001 ms.
  - Tctl median 74–75 °C, max 77.0 °C.
- **A3 MET:** every file:line the SE cites holds at both SHAs. Two off-path lines are not listed (INFO).
- **A4 MET:**
  - lint, typecheck and build exit 0.
  - `npm test`: 63 files / **2 364 passed, 0 skipped**. Skip-integrity: `No findings.`
  - `git diff --stat main -- src data` is empty.
- **Findings:** QE-247-a to -e, all **INFO**:
  - -a: a reader regex fixed after run B, count 83 → 84, no criterion moved;
  - -b: the dry-run print keeps the out-dir unredacted by design;
  - -c: A3's list leaves out the setoption dispatch line;
  - -d: probe builds used `git archive` and a symlink, not `npm ci`;
  - -e: the head was built from the tip, engine-equal to `72a65fb7`.
- No STOP. The thermal stop never fired. Scratch removed; no process left running.

### Trace row (10 cells, header order)

| ABC-247 | rpair passes Skill Level 6 to skytalix on both builds, so a base before ABC-228 searches 4 000 ms; r and d unchanged (tools only) | EPIC-010 | ADR-0053 d10 (intent kept; route (A), no amendment) | NFR-008 untouched (no vitest file); ADR-0049 d4 redaction unchanged | grugops/ABC-247 @ 02f4f3d4: tools/rating/rating.ts, tools/rating/pair-check.ts | QE PASS: pair-check 25/25, mutation red 3; r/d argv byte-equal; A2 base/head 0 at 3.0 s, 84/125 at 4.0 s, control 95 at 3.0 s; npm test 2 364, skips 0 | no UAT (tools only); QE verdict closes | — | QE PASS (branch, not merged; to the Orchestrator for merge routing) |
