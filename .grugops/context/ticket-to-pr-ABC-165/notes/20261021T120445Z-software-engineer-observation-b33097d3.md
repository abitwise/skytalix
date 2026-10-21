---
id: 20261021T120445Z-software-engineer-observation-b33097d3
kind: observation
by: software-engineer
at: 2026-10-21T12:04:45Z
verified_by: 
confidence: high (every figure from a command run at the tip)
refs:
  - ABC-165
  - ABC-185
  - plans/traceability.md
  - plans/metrics.md
  - grugops/ABC-165
  - 49fce033
  - 9af98210
  - 20261021T115747Z-ba-pm-decision-d2b9bf09
  - 20261021T120500Z-orchestrator-decision-34da66ba
  - QE-040-c
  - QE-156-a
supersedes: 
seal: sha256:6c418bc4fd8f12fbecb54ff84f23a74e44919e2624d04b6bb2f728cef6b26c1d
---

# ABC-165 acceptance at the tip: A1–A7 met (A2 11 of 11); gates green 59/1987, equal to base; UAT waiver measured empty

**Acceptance (scripted, base `9af98210`).**
- `A1`: `A1-cells` prints 97 names at base and 86 at the tip; none of the 11 named Ticket cells. The command copied
  out of the new note prints the same 86.
- `A2`: for each of the 11 base rows, the row with `|`, `\`, `—` and whitespace removed matches exactly one tip row,
  and that row splits into 10. 11 of 11 equal: `:626→637`, `:627→638`, `:735→746`, `:951→962`, `:982→993`,
  `:1001→1012`, `:1006→1017`, `:1099→1110`, `:1101→1112`, `:1103→1114`, `:1121→1132`.
- `A3`: 685 lines start with `|` at base and at the tip. Every other row is byte-identical.
- `A4`: (a) A1's command, verbatim; (b) the template line, backticks removed, splits into 10; (c) no Ticket cell named
  as malformed; (d) `grep -c 'ABC-009 (12 cells)'` prints `0`.
- `A5`: the line above `| Ticket | Title |` (now `:435`) is empty.
- `A6`: `sed -n 3p plans/metrics.md` is empty; the diff is one added line.
- `A7`: `git diff --name-only 9af98210` lists exactly `plans/metrics.md`, `plans/traceability.md`.

**Gates at the tip.** `npm run lint` exit 0 (116 files), `npm run typecheck` exit 0, `npm run build` exit 0,
`npm test` exit 0: 59 files / 1987 tests passed, `.test-results/last-run.json` `success: true`, 0 pending, 0 todo
(base 59 / 1987, per the brief). `test-skip-integrity.js --skip-count 0`: `No findings.`, exit 0. No timing taken.

**UAT waiver.** `git diff --name-only HEAD~1 HEAD | grep -v '\.test\.ts$' | grep '^src/'` printed nothing, and the
same over `9af98210..HEAD`. The waiver applies.

**Left as found (out of scope; flagged for BA/PM or the Scribe).**
- The note's `:364` "MEASURED STATE 2026-08-13: every row gives 10" and `:371-372` "ELEVEN `|` characters" /
  plain `.split('|')` advice are stale against the escape-aware rule. Scope 2 kept `:370-376`.
- `ABC-150 (design)`'s NFR ids sit in Status, not NFRs: word order fixes them after the measurements.
