# Claim: ticket-to-pr-ABC-031-2026-08-17

- role: software-engineer
- task: ticket-to-pr-ABC-031-2026-08-17
- claimed: 2026-08-17T18:36:00Z
- done: 2026-08-17T18:45:00Z

Built `ABC-031` on branch `grugops/ticket-to-pr-ABC-031-2026-08-17` (`c59e1e8`, `05eecc1`). ONE new
production module, `src/coordinate-move.ts` (+103), plus `src/coordinate-move.test.ts` (+193, 26
rows) and a 20 -> 21 inventory count in `src/cli.test.ts` (+3/-1, a TEST file). `A7`'s fence measured
from git: `coordinate-move.ts` is the only non-test file under `src/` in the diff. Gates on the branch
tip: lint 0, typecheck 0, `npm test` 895/895, build 0, skip count 0, test-integrity `No findings.`,
`PERFT_DEEP=1` 32/32. `A1` `A3` `A4` `A5` `A6` `A7` MET; **`A2` MET in substance, NOT-MET as printed —
its FEN has the kings adjacent (e2/e1) and no promotion is legal in it**, routed to BA/PM, unpicked.
NOT merged, no board column moved, no traceability Status edited (one appended evidence row), and the
MANDATORY `qe-e2e` hop has NOT run. Notes:
`.grugops/context/ticket-to-pr-ABC-031-2026-08-17/notes/`.
