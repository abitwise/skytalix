---
id: 20261020T192200Z-qe-e2e-observation-abc177-criteria-a1-a5-a7-a12-reconfirmed-4c92197e
kind: observation
by: qe-e2e
task: qe-ABC-177
at: 2026-10-20T19:22:00Z
verified_by:
confidence: high (every figure below was run in this hop); no timing in this note
sealed: false
refs:
  - ABC-177
  - ADR-0046
  - ABC-167
  - ABC-171
  - plans/tickets/ABC-177-npm-test-back-under-nfr-008s-10-s-adr-0046.md
  - 20261020T185816Z-software-engineer-observation-abc177-parity-census-gates-03c6e9de
  - .grugops/context/qe-ABC-177/probe/gates/
  - .grugops/context/qe-ABC-177/probe/census/
---

# `ABC-177` A1–A5, A7 and A12, re-confirmed independently at `f81bf03c` (base `ff1e375f`): all MET

Hand-authored and unsealed: `scripts/context-io.js` is absent from this repo and from the kit, and no `propose_note`
tool was available. The ticket page's § Scope and § Acceptance criteria are authoritative; this note reports what ran.

**Trees.**
- Tip: a detached worktree `../wt-qe-ABC-177` at `f81bf03c`.
- Base and tip archives: `git archive ff1e375f` and `git archive f81bf03c`, in the session scratchpad.
- `/usr/bin/diff -rq` shows exactly one differing file between the archives: `src/uci-session.test.ts`.
- `node_modules` is symlinked to main's. Only the A9 twin needs its own `npm ci`.

| crit | grade | evidence |
|---|---|---|
| A1 (the fold) | **MET** | Both U1 rows call `talk` once, on `["position startpos", "go infinite", R, R]` at step 1 000. The asserts are: (a) `perLine[0..1]` have no `bestmove`; (b) `perLine[2]` has exactly one, and it is its last line; (c) `perLine[3]` is `[]`. Both armed reds hold: frozen `H1` and `H2` are in both U1 rows' kill sets at the tip (parity note `…e1dfd431`). The fold's one loss, a cross-session check, is graded in `…02deb2e2` (`QE-177-a`) |
| A2 (step per unit) | **MET** | U1–U7 100 → 1 000, U8 10 → 100. Each is the coarsest admitted step, and each unit's kill set equals base (`…e1dfd431`) |
| A3 (126, names) | **MET** | `npm test` at base (scratch archive) and at the tip (worktree): 59 files, **1 987/1 987**, `success: true`, 0 failed / pending / todo at each. `src/uci-session.test.ts` has **126** rows, all passed, at each. The sorted names (ancestor titles + title, joined with " > ") are **byte-identical** (`probe/gates/names-*.txt`, sha256 `55785e96…` at both). The SE's `a9875b13…` uses another joiner, so the two hashes are not comparable |
| A4 (step literal only) | **MET** | `git diff -U0 ff1e375f f81bf03c`: 9 hunks. Outside U1, the 7 hunks (base lines 294, 325, 333, 349, 409, 506, 831) each change exactly one line, and normalising the step literal makes old = new. 294 and 349 are `talk`'s second argument, and 831 is `rig({ k, stepMs })`. No `it(` or `describe(` line is touched anywhere. No `expect(` line is touched outside U1. The U1 title is untouched (it is not in any hunk) |
| A5 (one file, in range) | **MET** | `--name-only` prints only `src/uci-session.test.ts`. Every hunk lies inside its unit's base range (U1 264–275, U2 291–303, U3 324–330, U4 332–337, U5 339–356, U7 400–416, U6 501–513, U8 829–844). The one added comment cites `ABC-177` and `ADR-0046 D2a`. No census code is committed |
| A7 (node census) | **MET**, reproduced exactly | The SE's `census.mjs` (scratch only) ran on fresh archives. U1 76 863 → 655 ×2, U2 25 642 → 676, U3–U7 25 621 → 655 ×11, U8 75 207 → 34 247. **Sum 536 406 → 43 438 (−492 968)**. All 15 rows are fewer, and the 111 other rows are unchanged node for node (`probe/census/census-qe.out`) |
| A12 (gates) | **MET** | At `../wt-qe-ABC-177`, one at a time: lint 0, typecheck 0, build 0; `npm test` 1 987/1 987; skip capture (AGENTS.md's command as spelled) **0**; `test-skip-integrity.js --skip-count 0` "No findings."; `CLI_DEEP` **11/11**; `PERFT_DEEP` **32/32**. The M4 sweep row is green at the tip. Under a QE plant (`write("released")` after the held bestmove in `release()`, on the very path the fold de-duplicated), **the sweep row reds**, with 12 hold rows. The source was restored and compared (`probe/gates/m4plant.json`) |

**Host while these ran:** battery power throughout, load1 3.9–6.0, user processes 371–421. None of this is timing.
