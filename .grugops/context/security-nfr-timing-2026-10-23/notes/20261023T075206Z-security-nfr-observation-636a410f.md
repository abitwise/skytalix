---
id: 20261023T075206Z-security-nfr-observation-636a410f
kind: observation
by: security-nfr
at: 2026-10-23T07:52:06Z
verified_by: 
confidence: high (every figure read in this window; disk-cold and other machines not read)
refs:
  - security-nfr-timing-2026-10-23
  - ABC-200
  - ABC-201
  - EPIC-006
  - NFR-007
  - NFR-008
  - N8-LANE
  - ADR-0035
  - ADR-0018
  - c91445e3
  - 1d5316e0
  - 5bf1e3d6
  - 55618845
  - c9dd9d1f
  - 52c15f56
  - 20261022T194346Z-security-nfr-decision-08e4152e
  - 20261017T131800Z-security-nfr-observation-abc096-timing-a4-nfr007-window-w1-clean-8d3f6c15
  - 20261011T231055Z-security-nfr-observation-abc152-v12-dependency-review-daf38cf7
  - 20261022T173538Z-security-nfr-observation-a8796ea3
  - AR-1
  - AR-096-DISKCOLD
supersedes: 
seal: sha256:6f8e1c4f22afd179652fad8005475e29988310a04e931fb6e35580803b605767
---

# Quiet-host timing pass 2026-10-23: every precondition reading, (1) ABC-200's N8-LANE window and (2) ABC-201's fresh-clone readings

Security/NFR, task `security-nfr-timing-2026-10-23`, width 1 in the owner's quiet window. Raw files and instruments are in
`probe/p1/` and `probe/p2/` beside these notes. Pre-registrations were committed before any reading: `c9dd9d1f` at 07:38:21Z
(part 1) and `52c15f56` at 07:47:37Z (part 2). Machine: Apple M3 (Mac15,13), Darwin 25.6.0 (macOS 26.7.1), node v26.11.1,
npm 11.20.0, git 2.56.0, host MacBook-Air.local.

## Preconditions (AC; load1 ≤ 8; no foreign vitest; thermal recorded)
| when (UTC) | power | load1 | vitest | thermal |
|---|---|---|---|---|
| 07:34:02 claim-time check | AC | 2.54 | 0 | 0 |
| 07:38:26–07:39:28 part 1 start gate, 13 polls, 62 s span | AC on all | 2.93–4.36 | 0 | 0 |
| 07:39:28 pre-window | AC | 2.94 | 0 | 0 |
| 07:39:28–07:42:28 window.mjs 180 s, 181 polls | AC 37/37 (5 s polls) | max 3.10 | 0 foreign polls | — |
| 07:42:35 post-window | AC | 2.72 | 0 | 0 |
| 27 lane runs (per run, before/after) | AC 27/27 | 2.72–3.68 | 0 foreign before and after; sampler 0 foreign rows | 0→0 on all 27 |
| 07:44:46 post-lane | AC | 2.73 | 0 | 0 |
| 07:45:26 part 2 pre-check | AC | 2.04 | 0 | 0 |
| 07:47:41 pre-clone / 07:47:43 pre-install / 07:47:46 post-install | AC | 2.48 / 2.36 / 2.36 | 0 | 0 |
| 07:47:46–07:48:48 part 2 start gate, 13 polls, 61 s span | AC on all | 1.82–2.36 | 0 | 0 |
| 07:48:48–07:48:50 before each of the 10 A3 children | AC | 1.84–1.85 | 0 | 0 |
| 07:48:51 post-A3 / post-A2 | AC | 1.85 | 0 | 0 |
No window failed a precondition, and no stage needed a re-run. The host poller logged only this hop's own vitest processes (`vit_other` 0).

## (1) ABC-200 N8-LANE (spelled in `…08e4152e` § 3)
- **Trees.** Merge `5bf1e3d6` = `55618845` (grugops/qe-ABC-200) + `main` `1d5316e0` (= `c91445e3` + records only). Own `npm ci --ignore-scripts`, vitest 4.1.12. `npm test` exit 0, `last-run.json` `success: true`, 61 files / 2 018 tests.
- **Set.** Resolved at HEAD: the new and edited test files, plus `vitest related --run` on `src/cli.ts`, `src/cli-options.ts`, `src/line-input.ts`, `src/line-reader.ts` and `src/startup-questions.ts`. That gives 5 files: `cli.real-engine.test.ts`, `cli.test.ts`, `engine.test.ts`, `line-input.test.ts` and `startup-questions.test.ts`.
- **Arms** (each its own archive and `npm ci`):
  - B: `1d5316e0` + placeholder `f730fdb27019`, 174 tests.
  - T: identical to B (`diff -r` clean).
  - H: `5bf1e3d6`, 195 tests.
- **Instruments.** QE's `qe-timing-ABC-178` set, byte-equal, plus `readout200.py` (= 174a with thermal kept and flagged).
- **Run.** 9 rounds rotated; round 0 discarded; 8 scored; 0 harness errors.
- **CPU (user + sys).**
  - Medians: B 8.225 s, T 8.225 s, H 8.245 s.
  - **H − B +0.030 s, interval [−0.010, +0.060], sign 6+/2−.**
  - Twin T − B: median −0.005 s (−0.061 %), limit 123.4 ms, sign 4+/4− (p 1.000), admissible, **R 0.050 s**.
- **Wall.** H − B −0.020 s [−0.070, +0.050]; twin R 0.050 s.
- **State at 650 ms.**
  - MET in readout200 (grading).
  - MET in 174a: 0 thermal rounds, so it is the same set.
  - MET in 174 (strict).
- **F.** Provisional F (16 % of B) is 1.316 s. It prints `650 ms >= F: False`. It is not read by the state test.

## (2) ABC-201 (fresh clone at S = `c91445e3`)
- **Clone.** HEAD `c91445e3`, detached; origin/main `1d5316e0`; `git status --porcelain` empty before the install, after it and at the end.
- **A1.** `npm install` with no flags, an empty cache (0 entries before) and an empty user config (0 bytes): **exit 0**. Reported:
  - wall 1.87 s (user 1.02, sys 1.02);
  - `added 66 packages, and audited 67 packages in 2s`;
  - npm 11.20.0 warns `2 packages have install scripts not yet covered by allowScripts` (`esbuild@0.28.1`, `fsevents@2.3.3`), the same as `…daf38cf7`;
  - the audit reports 3 (1 moderate, 2 high).
- **A3** (10 children, run one after another, `npm run --silent chess -- --colour white --difficulty 5`, stdin ended after frame 0). Frame 0 is 23 newlines, pinned from child 1's raw stdout: 22 rows, a blank line, then `> input ended`. Spawn to frame 0, in ms, children 1–10:
  - children 1–5: 220.9, 191.0, 188.3, 188.5, 201.4;
  - children 6–10: 196.2, 196.5, 192.9, 191.9, 192.2.
  - **min 188.3 / median 192.6 / max 220.9 ms; the first launch after the install (child 1) = 220.9 ms**, the max.
  - Every child exited 0 with 0 stderr bytes; none timed out.
- **A2** (after A3). `printf 'e4\n' | npm run --silent chess -- --colour white --difficulty 5`:
  - exit 0 and stderr 0 bytes;
  - 3 frames; the last move-list row is `   1. e4      e5` (2 plies), with the opening name `King's Pawn Game`;
  - `input ended` once, after the last frame.
- **Kept, sha256:** `a2.stdout` `96a13b85f6f4…`; `a3/child-1.stdout` `4e7ace1164fb…`.
- **Audit** (read-only, in the clone, after the readings):
  - `npm audit --json`: nanoid GHSA-2v37-7h3g-55p8 (high), postcss GHSA-fxqj-rqcc-2cmp (moderate), source-map-js GHSA-68fv-2mgg-jv7q (high). These are the three pairs on AR-1's record (`…a8796ea3` § 4).
  - `--omit=dev`: 0.
- **Not read:** a page-cache-cold launch (`AR-096-DISKCOLD`), or any other machine or Node major.
