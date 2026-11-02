---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T17:02:26Z
subtask: se-ABC-265-fix
role: software-engineer
ref: .grugops/context/se-ABC-265-fix/
branch: new grugops/ABC-265-fix from grugops/qe-ABC-265 (6a4b0d37, on top of ABC-265 cad6ae13) — worktree .claude/worktrees/se-ABC-265-fix
width: wrap EVERY test/build run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core.
---
# Close QE-265-a: pin the non-zero data word in the hit rule
Add one row to src/transposition.shared.test.ts: after clearTable(), probeTable(0n) returns -1 (a zero data word never hits). Show QE plant QP4 (hit on a zero data word) red with it, head green. npm test (expect 2 388), lint, typecheck. Tests only; no production src edits. No push, force-push, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-265-fix, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result

**2026-11-02, Software Engineer. QE-265-a closed. Branch `grugops/ABC-265-fix`, worktree `.claude/worktrees/se-ABC-265-fix`, from `grugops/qe-ABC-265` `6a4b0d37`. Claim `4b0dce24`, code `7d9c8695`, then the records commit. Tests only. Nothing pushed or merged.**

- **Row (decision `…822a3168`):** in `src/transposition.shared.test.ts`, A2 describe: "a cleared slot never hits, even for key 0n whose XOR equations it satisfies (a zero data word is empty)". Body: `clearTable(); expect(wordsOf(0)).toEqual([0, 0, 0, 0]); expect(probeTable(0n)).toBe(-1);`. The file now has 12 rows.
- **Plant (observation `…24cf644c`):** QE's QP4 (`data === 0 ||` dropped) applied by QE's unchanged `plant.py` to a scratch copy (never `src/`): the file goes **1 failed | 11 passed**, the only red being the new row (`expected +0 to be -1`). Head: **12/12 green**.
- **Gates, under the lock:** `npm test` **2 388/2 388** (64 files), lint 0, typecheck 0. Build, deep lanes, A3 and G6/G7 were not run (not in the brief; a unit row with no search).
- **Notes (sealed, 3 read back):** row `…822a3168`; plant and gates `…24cf644c`; artifacts `…4e7143f9`. Raw evidence is in `.grugops/context/se-ABC-265-fix/raw/`.

### Trace row (10 cells, header order)

| ABC-265 | TH-1: one lockless shared transposition table, four Uint32 words a slot over a SharedArrayBuffer with an XOR check and the verified copy; node-for-node equal at Threads 1 | EPIC-011 | ADR-0025 amendment 2026-11-02 (PROPOSED); ADR-0057 D2.3 | unchanged by this fix (tests only) | grugops/ABC-265-fix @ 7d9c8695: src/transposition.shared.test.ts (+1 row) | src/transposition.shared.test.ts 12 rows; QE-265-a closed: QP4 red on the new row, head green; npm test 2 388, lint 0, typecheck 0 | QE verdict PASS_WITH_GAPS signs UAT (qe-ABC-265 …d9879b9c); QE-265-a fix by se-ABC-265-fix | — | In Review → toward merge (owner acceptance of the ADR-0025 amendment gates the merge) |
