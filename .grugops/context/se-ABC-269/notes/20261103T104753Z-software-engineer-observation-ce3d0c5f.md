---
id: 20261103T104753Z-software-engineer-observation-ce3d0c5f
kind: observation
by: software-engineer
at: 2026-11-03T10:47:53Z
verified_by: 
confidence: high (commands and exits as they ran; paths and hashes read from git); recorded as an observation because an artifact-ref needs a section-14 gate run id this hop does not have
refs:
  - se-ABC-269
  - grugops/ABC-269
  - ABC-269
  - EPIC-011
  - E1
  - E3
  - ADR-0064
  - ADR-0061
  - ADR-0028
  - ADR-0056
  - ABC-231
  - ABC-232
  - ABC-215
  - ABC-268
  - ABC-228
  - ABC-229
  - ABC-230
  - ABC-249
  - ABC-170
  - ABC-208
  - B0
  - B1
  - B2
  - B3
  - B4
  - B6
  - F3
  - G1
  - G2
  - G3
  - G4
  - NFR-009
  - NFR-008
  - QE-269-a
  - QE-269-b
  - 58fa3eb4
  - b7a8fc3a
  - 8470d3f0
  - src/evaluate-params.ts
  - src/evaluate.ts
  - src/search.ts
  - src/engine.ts
  - src/quiescence.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.taper-corpus.ts
  - arch-ABC-269-rule/20261103T093305Z-architect-design-decision-8ccb561f
  - qe-ABC-269-freeze/20261102T222017Z-qe-e2e-decision-1b856350
  - qe-ABC-269-freeze/20261102T222129Z-qe-e2e-observation-aea4ceba
  - arch-E1/20261102T215541Z-architect-design-decision-d8150777
supersedes: 
seal: sha256:118ae6d916a124c3ef8bdc50160339ed23dbe245e0873871434179f3afac7c05
---

# se-ABC-269 artifacts, commands and gates. Branch `grugops/ABC-269`: claim `c0a4bd44`, code `b7a8fc3a`, deep follow-ups `8470d3f0`, then the records commit. typecheck 0, lint 0 (136 files), build 0. npm test 2 519 / 2 519, 66 files, 0 skipped, 9.2–9.8 s. 12 deep lanes green. QE's fixture sha256 05ed9e81…6e96339 unchanged. Nothing pushed, merged or left running

Software Engineer, task `se-ABC-269`. Recorded as an observation, not an artifact-ref: no §14-gate run id exists for this hop (QE's precedent).

## Files (git diff main -- src: 15 files, +2 169 / −260)
- **New:**
  - `src/evaluate-params.ts`: the data-only table.
  - `src/evaluate.taper.test.ts`: 90 default-lane rows, plus `SEARCH_DEEP=1` B0 (7) and B2 (2).
- **Production:** `src/evaluate.ts`, `src/search.ts`, `src/engine.ts`, `src/quiescence.ts`.
- **Tests migrated (the migration note has the classes):** `src/quiescence.test.ts`, `src/search.futility.test.ts`, `src/search.null-move.test.ts`, `src/engine.test.ts`, `src/search.test.ts`, `src/evaluate.test.ts`, `src/evaluate.pawns.test.ts`, `src/transposition.test.ts`.
- **Not touched:** `src/evaluate.taper-corpus.ts` (sha256 re-read `05ed9e81da4ad803a41c43e12c92d8ada9c23d52e91fa7fb770c871ae6e96339`), `AGENTS.md` and `plans/`.

## Raw (`.grugops/context/se-ABC-269/raw/`)
- **`scripts/`:**
  - `b0.ts` (B0 counts);
  - `kp.ts` (B1 (d) and S1–S3);
  - `xbuild.ts` (the G4 cross-build against `main`'s `src/`, from `git archive main src` in the scratchpad);
  - `g2.ts` / `g2b.ts` (B6 and the variants);
  - `nps.ts` (ns per node, a report);
  - `plants.py` / `plants3b.py` (the planted defects; each reverted by `git checkout`);
  - `eng.ts` / `e170.ts` (re-pin and re-find readings);
  - `run.sh` / `run2.sh` (the deep lanes).
- **`out/`:** `b0.out`, `kp.out`, `xbuild.out`, `g2.out`, `g2-variants.txt`, `nps.out`, `nps2.out`, `plants.out`, `deep-exits-1.txt`, `deep-exits-2.txt`, `deep-report-lines.txt`, `npm-test.txt`.
  - **Note on `deep-exits-1.txt`:** its `exit=` field reads the `date` substitution's status, not vitest's, a script bug. Read its Tests counts instead. Run 1's three reds (the taper B0 row timed out at 5 s; futility A3 (a) ×2 and A4 (a) on the shipped side) were fixed: a 600 s row timeout, and the d7 re-point. Run 2 (`deep-exits-2.txt`, real exit codes) is green.

## Commands (each under `flock <scratchpad>/host-test.lock`)
- `npx tsc --noEmit` → 0. `npx biome check .` → 0 (136 files). `npm run build` → 0.
- **`npm test`:**
  - Run 1: 55 failed / 2 464 passed, 8 files (the migration).
  - Final: **2 519 / 2 519**, 66 files, 9.24 s (N8-LANE: base 2 429 at 9.37 s, QE's freeze run).
- **Deep lanes:** `SEARCH_DEEP=1` / `ENGINE_DEEP=1` / `PUZZLE_DEEP=1` with `NODE_OPTIONS=--max-old-space-size=400 npx vitest run <file>`, one file at a time. The counts are in the migration note.
- **Scripts:** `node <script>.ts <worktree> [<scratch main src>]`. B0 wall 09:46:51 → 09:48:09Z.

## Owed elsewhere
- **The Scribe (AGENTS.md, 3 B headroom):** one lane line, `src/evaluate.taper.test.ts` under `SEARCH_DEEP=1` (B0 and B2, 9 rows), next to the futility line, in the form "Taper deep lane (ABC-269, B0 + B2): `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.taper.test.ts`".
- **BA/PM:** the 14-line page fold from `arch-ABC-269-rule` `…1c2ca5ff` is still owed. This hop adds nothing to it.
- **Architect/Design:** F3 on G2 (this task's design note).
- **QE:** B5, B7, B8, a G2 re-read, and UAT (the QE verdict signs it).
