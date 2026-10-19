---
id: 20261019T123001Z-software-engineer-observation-mutants-and-gates-a171r002
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-171-rows
at: 2026-10-19T12:30:01Z
verified_by:
confidence: high
refs: [ticket-to-pr-ABC-171-rows, ABC-171, R-167-1]
supersedes:
---

# Mutants and gates at b62baabc

Hand-authored, unsealed.

- QE harness `.grugops/context/qe-ABC-171/probe/mutants3.mjs` on a scratch copy of the tip, file mode, ids S12,S25,S31,S32,S33,S38,S39: all 7 KILLED, each by the intended row (S12: A13d; S25, S31: A13b levels 1 and 2; S32: A13a k=2,4,6,...; S33: A13a k=2,3,4,...; S38: both A13c rows; S39: A13c combined row).
- Gates on `b62baabc`: lint, typecheck, build exit 0; `npm test` 59 files, 1962/1962; `last-run.json` `success: true`, 1962 total, 0 failed, 0 pending; skip-integrity `--skip-count 0`: `No findings.`; `CLI_DEEP=1` 10/10; `PERFT_DEEP=1` 32/32; `git merge-tree` with main clean.
- R-167-1 grep on this hop's added `src` lines: no hits. On `src/uci-session.ts` versus main: no hits.
- No timing readings were taken.
