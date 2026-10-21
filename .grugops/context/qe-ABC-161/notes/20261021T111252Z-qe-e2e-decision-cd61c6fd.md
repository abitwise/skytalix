---
id: 20261021T111252Z-qe-e2e-decision-cd61c6fd
kind: decision
by: qe-e2e
at: 2026-10-21T11:12:52Z
verified_by: 
confidence: high
refs:
  - ABC-161
  - grugops/ABC-161
  - 5e755bcb
  - ee1818bb
  - 35788fd4
  - grugops/qe-ABC-161
  - src/cli.test.ts
  - plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
  - A1
  - A2
  - A3
  - A4
  - QE-101-a
  - QE-101-b
  - SEC-101-a
  - QE-161-a
  - QE-161-b
  - QE-161-c
  - QE-161-d
  - QE-161-e
supersedes: 
seal: sha256:096a3643a844869f2e7c17a7267e2753cc260a97470670e678f0ad208819a161
---

# QE verdict for ABC-161: PASS_WITH_GAPS; A1–A4 met on QE's own runs; gaps QE-161-a (LOW), QE-161-b..e (INFO)

- **Verdict: PASS_WITH_GAPS.**
- **Criteria.** Each is met on QE's own plants and readings, which were taken before the SE's notes were opened. The SE's notes agree cell for cell.
  - A1: P11-L1..L3 green → red 3/3; P11 and P11-L4 red on both; non-vacuity block kept and green.
  - A2: S2c green → red; `"3\n"` refused with `offending: ["3\n"]`.
  - A3: P9a–e green → red 5/5; the real `AGENTS.md` green.
  - A4: one file outside the context records; all hunks inside the three named rows; 59/1987 = base; skips 0; `CLI_DEEP` 11/11.
- **Gates** on tip `5e755bcb` (code `ee1818bb`), all green: lint, typecheck, build, `npm test` 59/1987 with `last-run.json` success, skip count 0, skip-integrity clean, `CLI_DEEP` 11/11, `PERFT_DEEP` 32/32.
- **A1's comment claim** (seed 7 draws 0.0117, 0.0620, 0.9769; a rebuild at any level 1–4 differs by call 2) was verified against `seededRandom` and `createLevel` directly.
- **Gaps.** None blocks. `QE-161-a` (LOW): fix 3's list capture does not read past the first non-word character, with 6 scratch survivors. `QE-161-b..e` (INFO): over-strict but loud list forms, last-line comment wording, A4 literal wording, and fix 1's residual rate window (0.0117, 0.9769].
- **UAT waiver:** the reading is empty in AGENTS.md's form, with `.snap` not filtered. 0 production lines.
- **Board:** `ABC-161` may leave `In Review`. There is no Security trigger beyond test-only, and `NFR-008` is 0/0/0. The Orchestrator makes the move.
