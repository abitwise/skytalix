---
id: 20261104T232552Z-software-engineer-observation-dd8e56d8
kind: observation
by: software-engineer
at: 2026-11-04T23:25:52Z
verified_by: 
confidence: high: read as run; R5 is a timing; P6 not read; -t lines not run singly
refs:
  - ABC-303
  - ABC-286
  - ABC-288
  - EPIC-011
  - ADR-0056
  - ADR-0072
  - ADR-0073
  - R-BUNDLE-1
  - R-283-LMR
  - NFR-005
  - NFR-008
  - NFR-009
  - orch-2026-10-30a/20261104T222400Z-orchestrator-decision-3c67d3c4
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
supersedes: 
seal: sha256:d45a3778a550f182d8788e93da87e54756c4f0bf35f22bcd50830bfab61ed94c
---

# se-ABC-303 observation: every offline row on the build reproduces the probe to the count. R1 93.58 %, 80 cp / 94.12 %, 79 cp; R2 288 of 1 886, 29, 9, 0. No safety or L4 red

Tip code `src/` tree `001d6c7c`; base `main` `1bcdbf2d`, `src/` tree `845f5662`, whose production `src/` equals `0cc9afd1`'s (empty diff outside `*.test.ts`), so a differing count would be a wiring defect. None differs. Driver `raw/read.ts`, built doors, each mode in its own process under the host lock. Raw lines in `raw/out/`. These are the Software Engineer's readings; QE re-reads with its own driver.

**Table 3 as asked (reported, ungraded).**
- **R1**, depth 5 on the 190, on P4's own door and all on: `search()` 93.58 %, 80 cp; `chooseMove` 94.12 %, 79 cp, on each. On `0cc9afd1`: the same.
- **R2**, audit on a scratch copy (`raw/audit_patch.py`, `raw/audit.ts`, nothing committed to `src/` or `tools/`): 288 of 1 886 flips, 15.27 %; errors ≥ 200 / 300 / 500 cp: 29 / 9 / 0. 18 869 fired. By depth: d1 22.97 %, d2 5.84 %, d3 15.24 %. On `0cc9afd1`: the same.
- **R3:** own door 1.0031 / 0.9999 / 1.0935 / 0.9989; alone over the all-off door 0.9848 / 0.9922 / 0.9298 / 1.1190. The same.
- **R4:** `chooseMove` d6 on the 287 0 / 209; `krk` 0 / 17, 17, 29. The same.
- **R5, timing, a report:** `G2` door / head 0.9817 / 1.0533, mean 1.0175, against 0.9921 / 1.0537, 1.0229. Best of five, one lock hold; a timing, so not a count.
- **R6:** d8 against `main` 0.5947 / 0.8106 / 0.6982 / 0.9358; reach +0.148; P4 fires at 5.91 nodes per 1 000, 7.47 % of eligible, 24.2 skipped each; the order changes at 8.74 %, a countermove is in the list at 33.55 %. The same.
- **R7:** d8 311 546 / 163 523, 573 518 / 94 911; reach 7.016. The same.

**Tables 1 and 2, the engineer's reading; QE grades.**
- **S1:** 12 of 12, nodes, score and move, d6–d8, both recursions, all-off door against the base. d8 523 847 / 234 214, 707 548 / 101 425.
- **S2:** 58 of 58: 17 `search` doors and 12 `chooseMove` doors, against the same door on the base, on kiwipete and position-6. `search` doors at d5, the three unpruned at d3; `chooseMove` doors at d6. Not read deeper here.
- **S3:** 0 on every row: B1 0 / 191, B2 0 / 189, B3 0 / 190, 189, 190, 189, 163 and 0 / 188. Also 0 on each part's own door.
- **S4:** 7 / 7 at recorded depths. **S5:** 54 / 58, none newly missed, none newly solved.
- **S6:** 0 sign changes and 0 mate flips, against all-off and each own door, both recursions.
- **S7:** 100 %, 9 cp / 100 %, 4 cp.
- **P1:** rule, door and source rows green. **P2:** by the ADRs; the counts above confirm. **P3:** 0.6039 / 0.8170 / 0.7509 / 0.8363 against ≤ 0.89. **P4:** +0.116 (6.900 → 7.016) against ≥ +0.10. **P5:** 3 072.
- **P6, `G6`: NOT READ.** It is a timed read at the level; QE's.
- **P7, ungraded:** the lane note.
- **P8:** typecheck, lint, build exit 0; skip count 0; `test-skip-integrity` and `lane-inventory` No findings. **The run rule's `-t` lines were not run one by one.** Their files' deep lanes were, except Levels.

**Deep lanes on the tip, Levels excluded by the brief** (`raw/out/deep-lanes-1.txt`, `-2.txt`; `-1` predates the `ABC-279` A3 re-point, `see` re-read in `-2`): green, `SEARCH_DEEP` bundle 49, search 57, ordering 43, pvs-lmr 29, null-move 46, futility 53, quiescence 116, transposition 40, see 52, taper 170, engine 69; `ENGINE_DEEP` engine 84, capacity 2, transposition 26, uci-session 243, quiescence 99, ordering 30, pvs-lmr 21, pawns 44, gameend 58, legal 50, moves 38; `PUZZLE_DEEP` 18; `UCI_DEEP` 13; `CLI_DEEP` 11.

**One lane is red, and it is red on the base too.** `SEARCH_DEEP` `src/evaluate.passer.test.ts`: `ABC-271` K0's seven counts, 7 failed of 28, on `1bcdbf2d` and on the tip alike. The rows pin `chooseMove` and `search()` at the pre-`ABC-283` figures (kiwipete d8 766 275, 605 117) on the shipped path, so `ABC-283`'s merge left them stale. Identity rows are never re-pinned and this is outside the ticket: untouched, for the Orchestrator. That lane is not on an `AGENTS.md` line. Not settled by the records: who owns it.

**`NFR-009`'s sum row** (`src/transposition.test.ts`) counts neither the history table nor this one. The history gap is `ABC-283`'s. P5's byte row stands in `src/search.bundle.test.ts`. Left as it is: that row is not named by the ticket. About 36 KiB of 16 MiB.

**Process, stated plainly.** One `npm test` (about 10 s, on a scratch arm, to learn why that arm exited 1) ran outside the host lock, against the dispatch rule. Nothing else did. It touched no other agent's run that I can see, and it fed no reading here.
