---
id: 20261022T152530Z-ba-pm-observation-34bf730b
kind: observation
by: ba-pm
at: 2026-10-22T15:25:30Z
verified_by: 
confidence: high (QE's recorded outputs and files read directly); estimate (every node and wall cost); UNKNOWN - verify (NFR-008 headroom today)
refs:
  - ABC-178
  - qe-ABC-178
  - QE-178-a
  - QE-178-b
  - QE-178-e
  - efaa0a76
  - 80493be0
  - 43e4996f
  - 5d3832ef
  - 823a9885
  - d781e5e5
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
  - NFR-008
  - N8-LANE
  - 20261022T151717Z-qe-e2e-observation-f910b911
  - 20261022T151738Z-qe-e2e-decision-1ad5f522
  - 20261022T151728Z-qe-e2e-observation-0d723663
supersedes: 
seal: sha256:4c30136b38e09a7c68f678e1d8342fe76bf303344562dbe51f3f5dbeed8669fa
---

# `bapm-rule-QE-178` readings (read-only; no vitest, no timing, no probe run by this hop)

Every figure is QE's own output (`grugops/qe-ABC-178` @ `d781e5e5`, `.grugops/context/qe-ABC-178/`) or a file read at `main` `823a9885`. Nothing here is estimated unless it says so.

## The two LOW gaps, as QE measured them
- **`variant-semantics.out`** (direct replays, before any run):
  - QP1b, R1 shape: session 1 `before=0 after=0`, session 2 `out=[]` (no leak). Two-hold shape: session 2 `out=["bestmove e2e4"]` (leaks).
  - QP1c, R1 shape: session 1 `before=0 after=1` (gains a `bestmove` once session 2 sends `stop`), session 2 `out=[]`.
- **`qe178-gp-*.jsonl`:** QP1b and QP1c are 0 red at base file (0/126), base lane (0/1 995), tip file (0/127) and tip lane (0/1 996). On the file before `ABC-177` (`ff1e375f`) they are 0/126 as well. **Neither one is a regression.**
- **`gp-r1recheck-file.jsonl`** (a scratch copy of R1 plus one line, `r1recheck.diff`, sha256 `e8d59c8e…`): QP0 0/127 red; QP1, QP1a and **QP1c** each 1/127 red, on R1 alone; QP1b 0/127. The added line is `expect(held.out.filter((line) => line.startsWith("bestmove"))).toEqual([]);`, placed after session 2's line. **File mode only; the lane was not run on the re-check copy.**
- **The QP1b and QP1c wrong builds** are the entries in `gp-qe178.mjs` (sha256 `12c0b8db…`). QP1b adds a module-scope `leaked` that is set only when a session's hold count reaches 2. QP1c adds a module-scope `lastRelease` that a fresh session's `stop`/`ponderhit` calls when it holds nothing itself.

## R1 at the tip (`grugops/ABC-178` @ `efaa0a76`, `src/uci-session.test.ts` lines 283–289)
`held = talk(["position startpos", "go infinite"], 1_000)`, then a check that `held.out` holds no `bestmove`, then `expect(talk(["stop", "ponderhit"]).out).toEqual([])`. Session 1's output is read only **before** session 2 runs. R1's title is "a hold left in one session is not released by a fresh session". QP1c is exactly a release by a fresh session, so R1 does not yet check its own title. B1 never said *when* session 1 is read. That gap is in this page's wording, not in the SE's build.

## Production today
`createUciSession` has one non-test caller: `src/uci.ts:76`, one session per process. No production path runs two sessions in one module instance, so neither leak class can show today (QE says the same).

## `main` since QE's base
`git diff --name-only 5d3832ef 823a9885` lists only `.grugops/` and `plans/` paths. No `src/`, config or lane file has changed since then, so QE's measured lane figures (base 1 995, tip 1 996) are still today's figures.

## Cost (estimates, not readings; ≈ 5.9 µs/node and the 2-slot model, as on `ABC-178`'s page)
- The QE-178-b re-check: **0 nodes** (it filters an array already captured). **≈ 0 s.**
- A QE-178-a row (session 1 holds twice, then a fresh session sends `stop`/`ponderhit`): ≈ 2 × 655 = **≈ 1 310 nodes, ≈ 8 ms in-thread, ≈ +0.004 s wall.** That would be a new row with its own timing hop.
- **`NFR-008` headroom today: `UNKNOWN - verify`.** The last admissible reading is still t3-r1, 9.395 s on `f81bf03c`. `qe-ABC-178`'s B8 stage reads NOT APPLICABLE, and its printed medians are not readings (QE `…0d723663`). This hop does not use them.
