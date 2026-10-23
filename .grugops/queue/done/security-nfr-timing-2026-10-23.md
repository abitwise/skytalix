---
subtask: security-nfr-timing-2026-10-23
role: security-nfr
tickets: plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md (N8-LANE, pre-merge); plans/tickets/ABC-201-on-a-fresh-git-clone-npm-install-then-npm-run-chess-starts-a-playable-game-and-the-first-board-in-under-2-s.md (build: fresh-clone AC1 + NFR-007)
ref: .grugops/context/security-nfr-timing-2026-10-23/
branch: grugops/qe-ABC-200 (55618845; merge d062d60e); main c91445e3
width: 1 (ALONE: the owner's quiet window; nothing else runs)
---

# Quiet-host timing pass: (1) ABC-200's N8-LANE, then (2) ABC-201's fresh-clone reading

## Preconditions (check before EVERY scored window, and record each one)
AC power (`pmset -g batt`); load1 ≤ 8; no foreign vitest (`pgrep -fl '[v]itest'`); thermal recorded ("thermal kept and flagged"). If a precondition fails, wait and re-check; do not score that window. If the host never qualifies, report UNRESOLVED with the readings.

## (1) ABC-200 N8-LANE
- Worktree `../wt-sec-timing-ABC-200` on `grugops/sec-timing-ABC-200`, from `grugops/qe-ABC-200`. **Merge `main` in first** (a merge, not a rebase). `main` now carries ABC-178 and ABC-199. Run your own `npm ci --ignore-scripts`, then a correctness check: `npm test` + `last-run.json` success (expect 61 files / 2 018 tests).
- Measure exactly as your own spelling in `…08e4152e` § 3:
  - the narrowest set: the new and edited test files plus `vitest related` for the changed sources;
  - at base, the new file is a one-assertion placeholder, with an identical twin as the noise control;
  - at least 8 interleaved rounds;
  - the bar is ≤ 0.650 s CPU.
- Pre-register before any reading. Result: MET, NOT MET or UNRESOLVED.
- If it is NOT MET or UNRESOLVED, a full-lane NFR-008 reading is owed (headroom 0.990 s, `…d0c770b5`). Take it in this window under the ABC-177 A9 protocol, if the host still qualifies.

## (2) ABC-201: you are the builder
- Build to the ABC-201 page: A1–A4 on a fresh `git clone` of `main` at `c91445e3`, with an empty npm cache and an empty user config.
  - A2: the piped smoke run.
  - A3: spawn to first frame under 2 000 ms on the max of at least 10 runs, using the instrument from `…8d3f6c15`. The first launch after install counts.
  - A4: one dated catalog insertion; the bar stays byte-identical.
- **If A3 is NOT MET, ADR-0018 Decision 3's revisit trigger fires.** Stop and say so: that goes to the owner.

## Fences
- Work only in your worktrees and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sectime/`. Records (`plans/nfr-catalog.md` insertions, ticket page sections) go on `grugops/security-nfr-timing-2026-10-23` (worktree `../wt-security-nfr-timing-2026-10-23` from `main`). No `src/` edits; no `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `security-nfr-timing-2026-10-23`), `at` from `date -u`, with a `kind: decision` for each part. Write `## Result` plus one trace row per ticket into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**(1) ABC-200 `N8-LANE`: MET. (2) ABC-201 `A1`–`A4`: MET; `NFR-007` MET; `EPIC-006` acceptance 1 MET. No STOP fired.** (Security/NFR,
2026-10-23. Records branch `grugops/security-nfr-timing-2026-10-23` @ `fff03004`. Pre-registrations `c9dd9d1f` (07:38:21Z) and
`52c15f56` (07:47:37Z), each committed before its readings.)

**Machine:** Apple M3 (Mac15,13), Darwin 25.6.0 / macOS 26.7.1, node v26.11.1, npm 11.20.0, git 2.56.0.

- **Preconditions.** Every check, before and during both scored windows, read AC, load1 ≤ 8 (range 1.82–4.36), 0 foreign vitest
  and thermal 0. No window was refused, and no stage needed a re-run. Every reading is in `…636a410f`.
- **(1) `N8-LANE`.**
  - **Trees:** merge `5bf1e3d6` on `grugops/sec-timing-ABC-200` = `55618845` + `main` `1d5316e0` (that is, `c91445e3` plus records
    only). Correctness: 61 files / 2 018 tests, `success: true`.
  - **Set:** 5 files (`cli.real-engine`, `cli`, `engine`, `line-input`, `startup-questions`), resolved at HEAD. B has the
    placeholder (174 tests), T is a clean twin, H has 195 tests. 8 scored rounds.
  - **Readings:** **H−B CPU +0.030 s [−0.010, +0.060]**, sign 6/8. Twin −0.005 s, admissible, **R 0.050 s**. MET in all three
    readout views.
  - **Full lane:** the `NFR-008` full-lane reading is **not owed** before merge.
  - **Floor:** the provisional F for this new set (1.316 s) sits above b. That does not change the state. Re-reading F is
    Architect/Design's job (same class as `R-178-1`).
- **(2) ABC-201** (fresh clone at `c91445e3`, empty cache, empty user config):
  - **`A1`:** `npm install` exited 0 (66 packages, 1.87 s, porcelain empty).
  - **`A2`:** exit 0, 0 stderr bytes, `1. e4      e5` (2 plies), `input ended` × 1.
  - **`A3`:** min 188.3 / median 192.6 / **max 220.9 ms** < 2 000 ms, n = 10. **The first launch after the install was 220.9 ms**,
    the max.
  - **`A4`:** one dated insertion in `NFR-007`, with the bar and every other row byte-identical; the `EPIC-006` line; the ABC-201
    `## Reading`.
  - **Not fired:** `ADR-0018` D3's trigger.
- **Install scripts: acceptable.** npm 11.20.0 ran neither (`allowScripts`). The audit shows AR-1's 3 dev-only pairs, and
  `--omit=dev` finds 0.
- **Notes** (`.grugops/context/security-nfr-timing-2026-10-23/notes/`, sealed by grugops 2.1.0 `admitAndAppend`, seals ok):
  - `20261023T075206Z-security-nfr-observation-636a410f` (preconditions and readings);
  - `20261023T075206Z-security-nfr-decision-f636dfd0` (ABC-200);
  - `20261023T075206Z-security-nfr-decision-9da46c78` (ABC-201).
- **Not touched:** `src/`, `tools/`, `package*.json`, `AGENTS.md`, `plans/board.md` and `plans/traceability.md`. The rows below are
  for the Orchestrator. Nothing was pushed or merged into `main`. Column moves, the `EPIC-006` card and the merges are the
  Orchestrator's.

### Trace rows (10 cells, header order)

| ABC-200 (security-nfr-timing-2026-10-23) | N8-LANE read (owed by …08e4152e § 3): MET, H−B CPU +0.030 s [−0.010, +0.060] vs 650 ms, twin R 0.050 s admissible, 8 rounds, 5-file set at merge 5bf1e3d6; full-lane NFR-008 not owed; provisional F 1.316 s > b noted for Architect/Design | EPIC-006 | — | NFR-008; N8-LANE; ADR-0035 | `grugops/sec-timing-ABC-200` @ `5bf1e3d6` (merge-up, no edits)<br>`grugops/security-nfr-timing-2026-10-23` @ `fff03004` (page § N8-LANE reading; probe/p1)<br>notes …636a410f, …f636dfd0 | lane174 / readout200 / 174a / 174 on B/T/H, pre-registered c9dd9d1f; npm test 61/2018 success | — | — | N8-LANE MET; merge decision the Orchestrator's |
| ABC-201 (security-nfr-timing-2026-10-23) | Fresh-clone reading at c91445e3: A1 install exit 0; A2 playable (exit 0, 0 stderr, 1. e4 e5, input ended ×1); A3 NFR-007 MET max 220.9 ms (first launch, counted), median 192.6, n 10; A4 records; ADR-0018 D3 trigger not fired | EPIC-006 | — | NFR-007; ADR-0018 D3/D4; AR-096-DISKCOLD (unchanged) | `grugops/security-nfr-timing-2026-10-23` @ `fff03004` (nfr-catalog NFR-007 insertion, EPIC-006 line, page ## Reading, probe/p2)<br>notes …636a410f, …9da46c78 | nfr007-201.mjs (derivative of …8d3f6c15 series (b)) + readout201.py, pre-registered 52c15f56; raw a2.stdout 96a13b85f6f4…, child-1.stdout 4e7ace1164fb… | waiver (0 production lines) | — | A1–A4 MET; EPIC-006 AC1 MET; card moves the Orchestrator's |
