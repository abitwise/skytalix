# qe-ABC-247 verdict: QE PASS. rpair gives skytalix `Skill Level` 6 on both builds; base `ca6e675c` and head both search 4 000 ms under block 01's argv, and the control without the token reads 3 000 ms

QE/E2E, task `qe-ABC-247`. Branch `grugops/qe-ABC-247` from the SE's tip `cec9c252` (code `02f4f3d4`). The PREREG
(`raw/PREREG.txt`, commit `3050c636`) was committed before any check, mutation, build or game. A2 ran ALONE; a records-only
Architect hop ran beside it. Nothing was edited under `src/`, `tools/` or `data/`, and the board was not touched. Not merged,
nothing pushed. Tools only, so there is **no UAT**: this verdict closes the ticket's QE gate.

| criterion | result | evidence |
|---|---|---|
| A1 (a) pair-check | MET: 25 tests, 25 pass, 0 fail, 0 skipped, 0 todo | `raw/a1/pair-check.txt` |
| A1 (d) mutation M1, the token removed | MET: 22 pass / **3 fail** | `raw/a1/mut-M1.txt` |
| A1 M2 (level 5), M3 (the token leaked into r/d) | 3 fail / 2 fail (informative) | `raw/a1/mut-M2.txt`, `mut-M3.txt` |
| A1 (c) r/d argvs, main vs tip, 4 commands | MET: all 4 byte-equal; 0 `Skill Level` in any r/d print | `raw/a1/dry-{r1,r2,d1,d2}.{M,T}.txt` |
| A1 (b)/(d) rpair, main vs tip (the batch command) | MET: +20 lines `option.Skill Level=6`, −0; 20/20 argvs: once, right after `restart=on` in skytalix, none in stockfish | `raw/a1/rpair.diff.txt`, `argv-check.T.txt` |
| A2 base `ca6e675c` + token | **PASS**: setoption L6 ×2 (once per instance, before its first go); go = `go movetime 4000` ×88; clocks **0 at 3.0 s, 84 at 4.0 s**; 0 faults, 0 time losses | `raw/a2/read-B.txt` |
| A2 head `cec9c252` + token | **PASS**: setoption L6 ×2; `go movetime 4000` ×128; **0 at 3.0 s, 125 at 4.0 s**; 0 faults | `raw/a2/read-H.txt` |
| A2 control, base, no token | MET: no setoption; `go movetime 4000` ×97; **95 at 3.0 s, 0 at 4.0 s**; 0 faults | `raw/a2/read-C.txt` |
| A3 the SE's file:line readings | MET: every cited line holds the content claimed at both SHAs | `raw/a3/a3-read.txt` |
| A4 gates | MET: lint, typecheck, build 0; `npm test` 63 files / 2 364 passed, 0 failed, 0 skipped; skip-integrity `No findings.`; `git diff --stat main -- src data` empty | `raw/a4/` |

**Findings:** none blocking, and none at HIGH or MEDIUM. QE-247-a to QE-247-e are all INFO (see the findings note).
