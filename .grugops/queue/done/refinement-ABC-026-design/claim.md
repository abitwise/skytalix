---
task: refinement-ABC-026-design
by: architect-design
at: 2026-08-10T19:59:22Z
---

Claimed by hand: `scripts/claim.js` does not exist in this repository or in the kit at
`/Users/olgeroeselg/.grugops/agent-factory`, and no `mcp__grugops__*` tool is in this session's
tool set (re-verified at this hop, the fifth consecutive hop to record it). Atomic `mkdir` per
Workflow 17 step 2; the directory IS the claim.

## Outcome (recorded at the transition to `done`, 2026-08-10T20:33:37Z)

**THE DEFAULT LANE HAS A TOTAL BUDGET FOR THE FIRST TIME.** `NFR-008` seeded in
`plans/nfr-catalog.md` and `ADR-0008` written (`proposed`): `npm test` with `PERFT_DEEP` unset,
**≤ 3 s WALL and ≤ 13 s CPU**, medians of ≥ 7 interleaved runs, reference machine named,
`UNKNOWN - verify` elsewhere. Today **1.565–1.765 s / 7.205–7.640 s = 52–59% of the wall clause —
MET, and it BINDS.** **The 3 s is ADOPTED from `ABC-026`'s own promotion trigger, not invented; the
LEVEL is `PROVISIONAL` (ratifier Olger Oeselg via the Orchestrator) and the SHAPE is not.**

Standing per-ticket bar **`N8-LANE`**: **≤ 5% of the TOTAL, not of the current lane** — BA/PM's
re-derived `N5` with **exactly ONE clause changed**, the denominator, because *n* tickets at 5% of
the current lane multiply it by `1.05ⁿ` with every ticket green. **Per-file floor measured as a
CURVE (`CPU = 0.85 s + 159 ms × files`, `R² 0.9999`, files = 1…128): a test FILE costs 368–504x a
test, so 22 files is NOT the lever and NO test is proposed for deletion, narrowing or merging.**
**~70–90% of the per-file cost is per-file process ISOLATION (−30.7%/−36.5% CPU) and that saving is
NOT AVAILABLE — green in 4 of 21 runs, failing only in the four `*.nfr.test.ts` spied guards; the
FIRST observed run was green.** `pool: "threads"` priced as a CANDIDATE (−13.97% wall, 676/676 green
24 of 24), **not adopted**.

**`NFR-002`: `ABC-017`'s flag STALE** (the rewrite landed 9.5 h after the ticket was cut; struck in
place on `ABC-017`) **and `ABC-016`'s CARRIED**; the row is BYTE-IDENTICAL. **`ABC-026` sized `S`;
DoR 8 of 10 with 2 open — BA/PM's acceptance criteria and the OWNER's ratification; no further
Architect/Design hop needed before `Ready`.** **ZERO production lines, ZERO test lines, `src/`
byte-identical (37 md5s), `NFR-001`–`NFR-007` byte-identical, NO target moved, `plans/board.md` not
edited, no git write command run.** Nothing merged, nothing deployed.
