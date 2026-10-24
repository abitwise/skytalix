---
id: 20261024T084131Z-qe-e2e-observation-cd83ece0
kind: observation
by: qe-e2e
at: 2026-10-24T08:41:31Z
verified_by: 
confidence: high: every reading as it ran, deterministic; no timing reading taken (battery, sibling hop)
refs:
  - qe-ABC-213
  - ABC-213
  - EPIC-006
  - ABC-203
  - AR-203-UNLINK
  - AR-203-LANEGAP
  - QE-203-b
  - QE-203-c
  - ADR-0047
  - ADR-0015
  - ADR-0036
  - NFR-008
  - grugops/ABC-213
  - 3dc70e20
  - e71c8901
  - 5a10b4b6
  - dfaa4cdc
  - adf6af38
  - src/pgn-file.ts
  - src/pgn.test.ts
  - ticket-to-pr-ABC-213/20261023T224721Z-software-engineer-decision-464bea64
  - ticket-to-pr-ABC-213/20261023T224721Z-software-engineer-observation-3ff2f272
  - arch-design-ABC-213/20261023T223723Z-architect-design-decision-d7ce173f
supersedes: 
seal: sha256:704e3567f0fa8c6e762d53d12bc6a17013a57eae9ceee2f630cc69d5b59d3fa5
---

# ABC-213 QE readings at merge 3dc70e20: A1–A7 MET; A5 by hand base exit 70 → head exit 0, stderr `PGN not saved: EFBIG`, full stdout = control; gates green (2044/2044, skips 0)

QE/E2E, task `qe-ABC-213`, branch `grugops/ABC-213` in `../wt-ABC-213`. **Merge `3dc70e20`** = `e71c8901` + `main` `adf6af38` (no conflict; `main` brought no `src/` and no non-record path). Own `npm ci --ignore-scripts`, Node 26.11.1, vitest 4.1.12. No `src/` edit. Every reading below is as it ran. **No timing reading was taken** (the host was on battery, with a sibling QE hop running), and the durations vitest printed are not readings.

## Criteria
- **A1** — `src/pgn.test.ts` rows green: write `EFBIG` + unlink `EACCES` → `{ok:false, code:"EFBIG"}`, unlink called once; close `EIO` + unlink `EACCES` → `EIO`, unlink called once. Nothing thrown.
- **A2** — green: write fault after 1 real byte → `EFBIG`, `games/` `[]` from the real root; close `EIO` after the whole text → `EIO`, `games/` `[]`.
- **A3** — green: a codeless unlink throw leaves `writePgnFile`.
- **A5** (`raw/a5-readings.txt`), scripts `qe-ABC-203/raw/scripts/unlinkfault{,-control}.mjs` unchanged:
  - base (`dfaa4cdc` `src`+`data`+`package.json` archived to the scratchpad): double fault gives exit 70 and `internal error: …`; a partial file remains. The control gives exit 0, `PGN not saved: EFBIG`, and 0 files.
  - head: double fault gives **exit 0** and stderr exactly `PGN not saved: EFBIG\n`. The full stdout sha256 `a2f144e4…` (516 B) equals the control's. `games/` holds 1 file (the injected unlink removes nothing). The control is unchanged: exit 0, `EFBIG`, 0 files.
- **A6** — `git diff dfaa4cdc HEAD -- src/pgn-file.ts` is one hunk `@@ -70 +70,5 @@` (cleanup branch). 1 `node:fs` import, same five bindings as base; 1 export; `process.`/`stdout`/`stderr` only on header lines 6–7. `src/cli.ts`, `src/pgn.ts`: 0-line diff to base and to `main`.
- **A7** — `pgn.test.ts` has 1 `spawnSync(` site. The only removed lines vs base are the two import lines. All ABC-203 rows are green with unedited expected values (21/21 in the file). `cli.test.ts` "guard — the neutral directory's games/ holds exactly one file per child that printed PGN saved" passed in `last-run.json`.

## Gates at 3dc70e20 (worktree)
- `npm run lint` 0 (125 files, no fixes); `npm run typecheck` 0; `npm run build` 0.
- `npm test` exit 0: 62 files, 2044 passed. `.test-results/last-run.json`: success true, 2044/2044, failed 0, pending 0, todo 0.
- Skip capture (AGENTS.md jq line) `0`; `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`, exit 0.
- `qe-hop-integrity.js --ticket ABC-213` before this verdict: exit 1, "No QE verdict note was found" + "not a row in ## Done" (expected before the decision note; re-read after sealing is in the decision note).
- No `games/` in the worktree after any run; `git status` clean apart from this hop's records.

## UAT reference measurement
`git -c core.quotePath=false diff --name-only 5a10b4b6~1 5a10b4b6 | grep -v '\.test\.ts$' | grep '^src/'` → `src/pgn-file.ts` (same over `dfaa4cdc..3dc70e20`). Not empty: the waiver does not apply.
