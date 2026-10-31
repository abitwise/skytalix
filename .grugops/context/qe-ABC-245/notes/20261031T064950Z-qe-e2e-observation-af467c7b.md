---
id: 20261031T064950Z-qe-e2e-observation-af467c7b
kind: observation
by: qe-e2e
at: 2026-10-31T06:49:50Z
verified_by: 
confidence: high for gates, names and G8 as measured (ALONE, wait-clear by PID, admissible); the H-B delta is attributed to noise by per-file medians at n = 3
refs:
  - qe-ABC-245
  - ABC-245
  - EPIC-010
  - ADR-0046
  - ADR-0054
  - ADR-0032
  - NFR-008
  - ABC-244
  - ABC-242
  - ABC-221
  - ABC-230
  - QE-242-b
  - SE-242-f
  - SE-245-a
  - SE-245-b
  - SE-245-c
  - QE-221-c
  - QE-245-a
  - QE-245-b
  - QE-245-c
  - QE-245-d
  - R1
  - R2
  - R4
  - arch-qe242a-ruling
  - bapm-ABC-245-rescore
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-93eb0bf9
  - se-ABC-245/20261031T061812Z-software-engineer-decision-69e64b77
  - se-ABC-245/20261031T061812Z-software-engineer-observation-c1655da6
  - se-ABC-245/20261031T061812Z-software-engineer-observation-bce18931
  - se-ABC-245/20261031T061812Z-software-engineer-observation-f0b04c75
  - grugops/ABC-245
  - 7e81732e
  - 7c1721ce
  - 9c008db4
  - 4387d4e8
  - c48a6f83
  - grugops/qe-ABC-245
  - d16c7505
  - src/levels.test.ts
  - src/levels.ts
supersedes: 
seal: sha256:a85a9b2588510ebbd331a55b8543bd953e498d6319790a24341f22e081de92e5
---

# `ABC-245` gates, names and `G8` at head `7e81732e` (base `9c008db4`): A4 and A5 MET. `G8` H **9.82 s** (B **9.44 s**), admissible. `NFR-008` ≤ 10 s MET, and `ABC-244`'s tranche-2 trigger (> 9.6 s) **FIRES on the raw head median**. The +0.38 s delta is host noise in byte-identical files, not the row. B 9.44 s is the clean re-read of `ABC-221`'s tree

## Gates (all at H = `git archive 7e81732e`; raw `raw/gates/`)
- `npm run lint` exit 0 (biome, 131 files, no fixes). `npm run typecheck` exit 0. `npm run build` exit 0 (22 files, `dist` removed after).
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed `No findings.` and exited 0.
- `npm test` ×3 = the three `G8` head runs. Each has rc 0, 63 files, **2 364 passed**, 0 failed, 0 pending, 0 todo. The three base
  runs: 2 363 passed, 0 skipped (`raw/g8/counts.txt`).
- **DIFF** (`raw/gates/diff.txt`): `9c008db4..7e81732e` touches `src/levels.test.ts` only. Hunks `@@ -15 +15 @@` (the header) and
  `@@ -747,0 +748,59 @@`, a pure insertion before the `ABC-242` describe's closing line. No existing row is edited.
  `7e81732e..7c1721ce` touches no `src/`, `tools/`, `data/` or `package*`. `c48a6f83..9c008db4` is equal on `src/`, `tools/`,
  `data/`, `package*` and `vitest.config.ts`.
- **NAMES** (`raw/g8/names.txt`, run-1 base against run-2 head): only at head **1**, the ABC-245 row. Only at base **0**. Count
  differs only for `src/levels.test.ts`, 45 → 46. The sorted-name hashes are equal once the added row is removed
  (`cbe630ae7e40`). **The names diff is +1.** All 40 `ABC-230`/`ABC-242` rows pass in every run, plus the new row at head.
- **A4:** header line 15 reads "DEFAULT (`npm test`, **46** tests)", and every head run reports 46 for `src/levels.test.ts`. MET.
- **Tree integrity:** after all runs, H and B were compared with `git archive 7e81732e` / `9c008db4` (tar `--compare`). Only uid,
  gid and mtime differ, so neither is written through a hard link (`raw/gates/tree-integrity.txt`).

## `G8` (ALONE; `raw/qe-scripts/g8.mjs`, order b h h b b h; raw `raw/g8/`)
Precondition (`raw/g8/pre-g8-top.txt`, top second sample): no foreign process at ≥ 50 % current CPU (max 16 %, 97.9 % idle),
0 vitest, 0 cutechess-cli. Wait-clear passed before every run: 0 foreign vitest (by PID, `kill -0`), load1 ≤ 2.0, Tctl ≤ 60 °C.

| run | tree | rc | wall s | cpu s | load1 before → after | Tctl before → after °C | tests |
|---|---|---|---|---|---|---|---|
| 1 | base | 0 | 9.08 | 29.65 | 1.66 → 2.11 | 40.4 → 75.6 | 2 363 |
| 2 | head | 0 | 9.44 | 30.09 | 2.00 → 2.24 | 52.5 → 73.4 | 2 364 |
| 3 | head | 0 | 10.19 | 33.11 | 1.82 → 2.39 | 44.1 → 71.1 | 2 364 |
| 4 | base | 0 | 9.44 | 30.34 | 1.87 → 1.80 | 40.8 → 75.1 | 2 363 |
| 5 | base | 0 | 9.58 | 30.84 | 1.40 → 1.57 | 41.0 → 73.3 | 2 363 |
| 6 | head | 0 | 9.82 | 31.93 | 1.30 → 1.41 | 44.4 → 62.3 | 2 364 |

- **Medians:** base **9.44 s**, head **9.82 s**, delta +0.38 s. CPU medians: base 30.34 s, head 31.93 s.
- **Admissible** (pre-registered rule): all 6 rc 0, load1 ≤ 8 before and after every run, and the precondition held. load1 ranged
  1.30–2.39. **Tctl median 57.4 °C** over the 12 readings (max 75.6), far from the 85 °C thermal stop. Per the PREREG there is no
  re-run, because the set is admissible.
- **Verdicts on the reading:** H 9.82 ≤ 10 s, so `NFR-008` is MET (A5) and there is no STOP. **H 9.82 > 9.6 s, so `ABC-244`'s
  tranche-2 trigger FIRES** on the raw head median. Reported only.
- **The delta is not the row's cost** (`raw/g8/g8-perfile.txt`, per-file medians H − B):
  - `src/levels.test.ts` +18 ms, the only file that differs. The SE read 1.67 ms in-thread for the row.
  - Files byte-identical between B and H moved more: `cli.test.ts` +80 ms, `engine.test.ts` +43, `uci-session.test.ts` +41,
    `history-pane.nfr.test.ts` +20. Others moved −13 ms.
  - Head run 3 (10.19 s, cpu 33.11 s) was slow across files: summed file spans 7.93 s against 7.08–7.42 s in the other five runs.
  - The ticket's estimate (< +0.05 s) is consistent with the in-file +18 ms. The wall delta is noise at n = 3.
- **Host notes** (`raw/g8/g8-wait.log`). The top-CPU snapshot before runs 1–3 shows short-lived foreign `node` processes
  (`node-MainThread`, elapsed 0–4 s, 20–100 % lifetime CPU) and a `weed` process. They were not vitest and not cutechess, and
  they were gone by runs 4–6. load1 stayed ≤ 2.0 at every start. Unlike `QE-221-c`, no orphan held a core. Each `npm test` heats
  Tctl to 71–76 °C, and the wait-clear restored ≤ 60 °C in one 15 s poll, except run 2, which started at 52.5 °C.
- **The clean re-read owed for `ABC-221`'s inadmissible 9.84 s.** B's `src/`, `tools/`, `data/`, `package*` and
  `vitest.config.ts` are byte-equal to `c48a6f83`, ABC-221's QE head. Here it reads **B median 9.44 s** (9.08 / 9.44 / 9.58),
  under 9.6 s, against QE-221's H 9.84 / B 9.82 on the host QE-221-c slowed. The head tree adds one 1.67 ms row and reads 9.82 s
  on the same host in the same window. **The tranche-2 question therefore rests on n = 3 noise of about ±0.4 s around 9.6 s.**
  That is the Orchestrator's or Architect's call under `ABC-244`, not this ticket's.
