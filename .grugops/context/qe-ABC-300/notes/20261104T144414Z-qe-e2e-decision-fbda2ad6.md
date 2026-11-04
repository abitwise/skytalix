---
id: 20261104T144414Z-qe-e2e-decision-fbda2ad6
kind: decision
by: qe-e2e
at: 2026-11-04T14:44:14Z
verified_by: 
confidence: high: A1-A5 and A7 MET on QE's own runs (83-case dry-run matrix cut vs branch, 14-refusal process probe, cut rows vs branch 39/40, one fake-tool real run, 7 mutants, gates); A6 UNKNOWN - verify by design; merge stays human or Orchestrator-on-green
refs:
  - qe-ABC-300
  - grugops/ABC-300
  - ABC-300
  - ABC-282
  - ABC-276
  - EPIC-011
  - ADR-0071
  - ADR-0056
  - NFR-008
  - QE-300-a
  - QE-300-b
  - QE-300-c
  - QE-300-d
  - 9835859d
  - 50f30cba
  - 19581ca1
  - 6af55341
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - se-ABC-300/20261104T142409Z-software-engineer-decision-a0bef530
  - se-ABC-300/20261104T142409Z-software-engineer-observation-b0b970ed
  - se-ABC-300/20261104T142409Z-software-engineer-observation-33a60189
supersedes: 
seal: sha256:87bfaf6fe671abb7384e0a30d7a2a3e96d5ccb6e077c00f6122d48506bfa8c69
---

# qe-ABC-300 verdict: PASS_WITH_GAPS. A1–A5 and A7 MET on QE's own runs; A6 `UNKNOWN - verify` carried to `ABC-282` A6 (QE-300-a); QE-300-b LOW, QE-300-c and QE-300-d INFO. Nothing blocks merge

This verdict signs acceptance. The ticket is tools only, so there is no UAT (test note 3; the zero-production-lines waiver: `git diff --name-only 6af55341 9835859d | grep -v '\.test\.ts$' | grep '^src/'` is empty).
- **Read:** branch `grugops/ABC-300` at `50f30cba` (code `9835859d`), against the cut `19581ca1`.
- **Merge:** human, or the Orchestrator on green per the standing ruling.
- **Sources broken here:** the ticket's `## Scope` / `## Acceptance criteria`, and the SE notes `…a0bef530`, `…b0b970ed` and `…33a60189`.

- **A1 MET.**
  - `d <c> <b> <out> --tc 40/8 --rounds 50 --concurrency 1 --dry-run` exits 0 and never creates `<out>`. It prints one argv of 40 tokens.
  - Against the `--budget-ms 100` print at the same flags, the only differences, in each engine block, are: `st=0.1` → `tc=40/8` and `timemargin=50` → `timemargin=0`, in place; and `option.TimeMode=uci-clock-mode` added right after `restart=on`.
  - The same holds against `d`'s default 3000 print (`st=3`, `timemargin=2000`) with no `--rounds` or `--concurrency`.
  - The same print comes back byte-equal with `--tc` first, `--tc` between the positionals, `--tc` after `--dry-run`, and `--tc 40/8` given twice.
- **A2 MET.**
  - (1) `40/15`, `40/8+0.1`, `10+0.1` and `x`, plus 15 more hostile values, each exit 1 with an empty stdout and the message `--tc <value>: d takes only 40/8`. The values: empty, leading or trailing space, newline, `40/08`, `40/8.0`, `40/8+0`, `0/8`, `8`, `inf`, `40/480`, a full-width slash, `40/8 st=0.1`, and a swallowed `--dry-run`.
  - (2) `--tc 40/8` with `--budget-ms` at each of the six D budgets, in both orders, and with `--budget-ms 999`, exits 1 with `--tc and --budget-ms: d takes one or the other, not both`.
  - (3) `r` and `rpair` with `--tc`, good or bad value, with or without `--dry-run`, exit 1 with an empty stdout. Their stderr is the cut's usage text but for A4's two lines.
  - All 14 refusals probed start no child process: `git` and `npm` were wrapped on `PATH` and logged 0 calls, while the probe logs 2 on an accepted run. None writes `<out>`. Scope 4's "before any build or process start" holds.
- **A3 MET.**
  - 17 dry-run prints are byte-equal to the cut in stdout, stderr and exit code, from the same tree path and out path. These are the ticket's 11 (`r` default/500/100, `d` default/3000/2500/2000/1500/1000/100, `rpair` default) and 6 more.
  - 7 existing refusals are equal but for stack-frame line numbers. 6 usage cases differ only by A4's line pair.
  - The cut's own unedited `pair-check.ts`, run against the branch's `rating.ts`, gives 39/40. The one failure is `ABC-276` A5's usage row, A4's named exception.
- **A4 MET.** `usage()` changes `d`'s line to `[--budget-ms B | --tc 40/8]` and adds one `--tc:` line. No other usage byte changes, in all 6 usage cases plus 11 more. `ABC-276` A5 is the one existing row edited, and both its cases pass.
- **A5 MET.**
  - `git diff --name-only 19581ca1 9835859d -- src/ data/ vitest.config.ts` prints 0 lines. The same holds against `main` `6af55341`.
  - The code diff is `tools/rating/rating.ts` and `tools/rating/pair-check.ts` only.
  - In the A1 vector, each skytalix block's keys are exactly name, cmd, arg, dir, tc, timemargin, restart, option.TimeMode and stderr. The one `option.` token is `TimeMode=uci-clock-mode`, which both built artifacts advertise in their UCI handshake.
- **A6 `UNKNOWN - verify`, QE-300-a.** It is read at `ABC-282` A6. The supporting fake-tool run is in the gaps note.
- **A7 MET.**
  - `npm run lint` (146 files), `typecheck` and `build`: exit 0.
  - `npm test`: 69 files, 2 650/2 650, 0 skipped. That is the same count as the SE's, so the lane gained 0 rows (NFR-008).
  - `node --test tools/rating/pair-check.ts`: 45/45.
  - The skip-integrity check returns `No findings.` at skip count 0.
  - Code exists at one commit (`9835859d`); the others are records only.
- **Mutants:** 7 mutants, in a scratch clone only. M4, M5, M6, M10 and M11 are killed by the ABC-300 rows. M7 (no `control:` line) and M8 (refusals after `git rev-parse`) survive pair-check and are killed by QE's real run and probe respectively (QE-300-b).
