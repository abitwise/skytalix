---
id: 20261022T155037Z-qe-e2e-observation-dea0917d
kind: observation
by: qe-e2e
at: 2026-10-22T15:50:37Z
verified_by: 
confidence: high (QE's own runs; outputs in probe/build, probe/gates)
refs:
  - ABC-178
  - qe-ABC-178b
  - 0036e5c6
  - fb00ad68
  - 7b87e5de
  - 43e4996f
  - 66fd8e1b
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
  - B1
  - B3
  - B4
  - B5
  - B9
  - QE-178-b
  - 20261022T152530Z-ba-pm-decision-1f4936b2
  - 20261022T151717Z-qe-e2e-observation-140515b9
supersedes: 20261022T155019Z-qe-e2e-observation-fdb7ccca
seal: sha256:dc54d42de780c25ab2e30da4582280265c8648cc0486df7162b675a67c0414f3
---

# `ABC-178` QE re-read after the QE-178-b fold: amended B1, B3, B4, B5 and B9 are all MET at the tip `0036e5c6` and at the QE merge `7b87e5de`. No timing taken

The ticket page's 2026-10-22 15:25Z BA/PM block (`bapm-rule-QE-178` `…1f4936b2`) governs. QE ran every check below **before** opening the SE's `ticket-to-pr-ABC-178b` notes (opened at 15:47:57Z). This was a non-timing re-read. The durations vitest prints are incidental and are not claimed.

**Trees.** QE branch `grugops/qe-ABC-178` (was `d781e5e5`). Merge 1: **`fb00ad68`** = `d781e5e5` + `grugops/ABC-178` tip `0036e5c6`. Merge 2: **`7b87e5de`** = `fb00ad68` + `main` `66fd8e1b`. Both are merges, not rebases, and neither had a conflict. `src/` at `7b87e5de` equals the tip (`git diff 0036e5c6 7b87e5de -- src` is empty). Against `main`, only `src/uci-session.test.ts`, the page and QE's own context differ. The base is `43e4996f`: `git diff --name-only 43e4996f 66fd8e1b` lists only `.grugops/` and `plans/`, so `main`'s code has not moved. Scratch copies: B = `git archive 43e4996f`, H = `git archive 7b87e5de`, each with its own `npm ci`.

## B1 (with the added limb): MET
- Scratch replay `probe/build/b1-recheck.ts` on H, with the options `dialogue` uses:
  - **check 1:** session 1 (`position startpos`, `go infinite`, step 1 000) wrote `info depth 3 … nodes 655 time 4000 … pv e2e4` and **no `bestmove`**;
  - **session 2** is a separate `createUciSession` (`two.out === one.out` is false), and its `out` is `[]`;
  - **re-check:** `held.out` (the same array) is still 1 line long and holds 0 `bestmove`;
  - session 1 still holds its answer: its own `stop` then writes `bestmove e2e4`.
- `talk` returns `dialogue`'s live `out` array, and session 1's `write` pushes into it. So the re-check reads what a cross-session release would write, and it is not vacuous (QP1c and QP1e below prove this).

## B3: MET
- `git diff --name-only 43e4996f 0036e5c6`, outside `.grugops/` and `plans/` (the tip carries `main` merges): `src/uci-session.test.ts` only. The same holds against `d12831c6` (the tip's `main` parent) with no filter.
- `-U0` against base: **0 `-` lines**, one hunk `@@ -282,0 +283,9 @@`, 9 `+` lines: the comment citing `ABC-178`/`QE-177-a`, R1's 5 lines with its closing line, the `QE-178-b` comment, the re-check line, and the blank separator (inside "additive only", `…65ce53ef`).
- Against `efaa0a76`: 0 `-` lines, +2 (the comment and the re-check). The re-check is byte-equal to R1's first check.

## B4: MET
- File run: B 126/126, H **127/127**, 0 failed, 0 pending, 0 todo. Sorted names (`LC_ALL=C`): 0 base-only names, and the one tip-only name is `ABC-167 A6 — infinite waits for stop ABC-178 R1: a hold left in one session is not released by a fresh session`. H's list is `cmp`-equal to QE's earlier `names-file-H.txt` (`efaa0a76`), and B's to `names-file-B.txt`.
- Lane (`npm test`, `last-run.json`): B 60 files / **1 995** passed, `success: true`; H 60 / **1 996** passed, `success: true`. The lane name sets differ by R1 alone.

## B5: MET
- `ticket-to-pr-ABC-177/probe/census.mjs`, byte copy (`cmp` equal, sha256 `2b4c3535…`), on a throwaway clone of H: 127/127 passed, **R1 = 655**, 127 rows, **sum 608 965**.
- Sorted under `LC_ALL=C`, it is **`cmp`-equal to QE's `qe-ABC-178/probe/census/census-H.tsv`** (`80493be0`). The re-check searches nothing. The census stays in scratch.

## B9 (gates at the merge `7b87e5de`, QE worktree): MET
| gate | result |
|---|---|
| `npm run lint` | exit 0, 119 files, no fixes |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0; 60 files, **1 996 passed**; `last-run.json` `success: true`, 0 failed, 0 pending, 0 todo |
| skip-count capture as spelled (`NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null \| jq '.numPendingTests + .numTodoTests'`) | `0` |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts` | 1 file, 5/5, exit 0 |
| `ABC-167` A11 M4 sweep row | green in the lane |
| M4 plant (`write("released")` after each release; scratch clone of H, restored, `diff -r` equal) | 13/127 red, **the sweep row among them**. R1 is not among them, as expected: its hold is never released |

**UAT waiver form** (AGENTS.md, unfiltered, `git -c core.quotePath=false diff --name-only <a> <b> | grep -v '\.test\.ts$' | grep '^src/'`): it printed **nothing** (grep exit 1) for `0036e5c6~1 0036e5c6`, for `fb00ad68~1 fb00ad68` and for `7b87e5de~1 7b87e5de`. **Zero production lines: UAT is waived.**

_Re-issue of `20261022T155019Z-qe-e2e-observation-fdb7ccca`. The body is unchanged. That note's refs named the BA/PM decision with a wrong timestamp (`20261022T153506Z-…`). Its real id is `20261022T152530Z-ba-pm-decision-1f4936b2`._
