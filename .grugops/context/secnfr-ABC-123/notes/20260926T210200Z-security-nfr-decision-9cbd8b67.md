---
id: 20260926T210200Z-security-nfr-decision-9cbd8b67
kind: decision
by: security-nfr
at: 2026-09-26T21:02:00Z
verified_by:
confidence: high
refs:
  - ABC-123
  - ABC-122
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - secnfr-ABC-123
  - tools/grugops/run-bounded.js
  - tools/grugops/run-bounded.proof.js
  - plans/tickets/ABC-123-run-bounded-timeout-ceiling-and-stale-header.md
  - .grugops/context/secnfr-ABC-123/notes/20260926T210100Z-security-nfr-observation-9bf35cdd.md
  - .grugops/context/secnfr-ABC-122/notes/20260925T151300Z-security-nfr-decision-abc122-pass-with-accepted-risk-n8lane-met-k3-k4-closed-2749a2e6.md
  - .grugops/context/secnfr-ABC-122/notes/20260925T151200Z-security-nfr-observation-abc122-kill-surface-no-mistarget-no-shell-tree-escapes-sigkill-class-stops-284db7df.md
  - .grugops/context/wave-2026-09-25/notes/20260925T234000Z-orchestrator-decision-6a63f2b7.md
  - .grugops/context/ticket-to-pr-ABC-123/notes/20260926T205300Z-software-engineer-decision-02e24867.md
  - .grugops/context/ticket-to-pr-ABC-123/notes/20260926T205400Z-software-engineer-observation-35a5af66.md
supersedes:
---

# ABC-123 Security/NFR: **PASS**. R2 and R3 are discharged as `ABC-122`'s gate worded them. R1 is described accurately and not widened. `N8-LANE` is 0 ms and `N8-SPAWN` is 0 ms (confirmed). No required fixes and no new accepted risk

Hand-authored and unsealed: a `decision`, not a stamp (`human_admission` is `off`, and there is no
`context-io.ts` on this install). The gate reviewed `e57da89...3028933`, ASVS level `L1`,
`block_on: high`. The readings are in `9bf35cdd`.

## Result

**PASS.**
- Nothing is at or above `high`, and no ASVS L1 requirement fails.
- This ticket needs no new accepted risk.
- `ABC-122`'s R1 stays the owner's standing accepted risk on this file (`6a63f2b7`: *"R1
  accept"*). It is carried, neither closed nor widened, and it is not re-accepted here.

## R2: **DISCHARGED**, as worded ("reject `N` > 2^31 − 1")

- **At the three values this role measured at `ABC-122`** (`2147483648`, `99999999999`,
  `9007199254740993`): unfixed, exit 124 with the overflow warning and the target killed; fixed,
  exit 2 with only the usage line and **0 `spawn()` calls**.
- **At the boundary:** `2147483647` is accepted on both wrappers with an empty stderr. `2147483648`
  is the first value rejected.
- **Around it:** 6 more values above the ceiling are rejected with 0 spawns, among them
  `2147483649`, `0x80000000`, `2.147483648e9`, `2^32`, `2^32 + 1` and `1e21`. Lenient spellings of
  the ceiling are still accepted.
- **Reject-before-spawn is confirmed twice:** by the spy (0 calls) and by code order
  (`process.exit(2)` precedes `spawn`).
- The accepted set is now exactly the integers 1 … 2^31 − 1, so no accepted `N` can reach Node's
  1 ms clamp. **ASVS V2.2.1: PASS**, and the LOW from `ABC-122` is closed.

## R3: **DISCHARGED**, as worded

- "NOT YET WIRED IN" is gone (the Engineer's `grep -c` gives 0, and the diff agrees).
- The header now says `detached: true` → `setsid()` → a new **session**, and names that session as
  why R1 exists. **This is measured true at HEAD:** the child has `sid = pgid = pid`
  (81038/81038/81038), and the wrapper is in session 81031.
- **The comment-only discipline holds (A6).** The only non-comment lines in the diff are R2's
  constant and `if`.

## R1: **the header is accurate, and nothing in the diff widens R1**

- **Accurate.**
  - The header lists the same four escape paths as this role's `ABC-122` wording: SIGKILL to the
    wrapper, a supervisor's SIGKILL to the wrapper's group, SIGHUP, and SIGQUIT.
  - It says SIGINT and SIGTERM are forwarded and SIGHUP and SIGQUIT are not. That matches the
    code: `["SIGINT", "SIGTERM"]`.
  - Its operating rule is "Ctrl-C or SIGTERM, never SIGKILL". It was re-measured clean on HEAD:
    130 and 143, 0 survivors.
  - "The new session has no controlling terminal" is `setsid(2)` semantics. This hop's `/dev/tty`
    reading could not discriminate it, and the note says so.
- **Not widened.**
  - The signal, kill, spawn, timer and exit code is byte-identical to `ca9f42d`, where R1 was
    measured.
  - R2 only narrows the accepted `N`.
  - No signal forwarding was added or removed.
- **Informational, no fix.** The header says `detached: true`, and the code says
  `detached: process.platform !== "win32"`. The header's "On POSIX" makes that exact. The
  close-the-terminal-during-a-hang case stays `UNKNOWN - verify` from `ABC-122`. The header's
  claim ("not a hang-up") agrees with the mechanism and with the direct-SIGHUP measurement, and it
  errs toward warning.

## `N8-LANE`: **0 ms charged, against 650 ms**

- 0 files were added under `src/`, and the lane is 48 files / 1467 tests at HEAD, the same as the
  baseline.
- The proof is not collected, because it is a `.js` under `tools/` matching neither `*.test.*` nor
  `*.spec.*`. That was checked on the run, not assumed.
- The wrapper sits on the lane's invocation path, but `ABC-122` ruled it not a lane file. This diff
  adds one numeric comparison to it.
- **Per the 2026-08-19 ruling (A6), this says nothing about `NFR-008`'s CPU clause** beyond this
  ticket adding 0 ms to it. The clause's state is Architect/Design's, and it is unchanged by this
  ticket.

## `N8-SPAWN`: **the Engineer's 0 ms is CONFIRMED**

- The account attributes the CPU of criteria-forced children **inside the default lane**, where it
  is subtracted from the ticket's `N8-LANE` charge. None of this ticket's children runs in the lane.
  Every one of them is in the `tools/` proof, which the lane does not collect.
- So there is nothing to attribute. **The charge is 0 ms, and the account's running balance does
  not move.**
- **The Engineer's child count is correct by independent count:**
  - 23 per proof run: 17 wrapper spawns (16 `N` cases plus the no-argument case) and 6 targets
    (A2's 1 plus A3's 5 lenient cases).
  - 26 on the unfixed wrapper, because each of the 3 A1 cases also starts its target.
- That count is outside-lane cost (1.56 s real per proof run) and is informational only.

## ASVS L1 (70 requirements, filtered at read time; applicable ones listed)

| requirement | result | evidence |
|---|---|---|
| V1.2.5 OS command injection | **PASS** | argv-only `spawn`/`spawnSync`; no `shell` option in `tools/grugops/`; the proof's `-e` source is a constant |
| V1.3.2 dynamic code | **PASS** | no `eval`, `new Function` or `exec*` |
| V2.2.1 input validation | **PASS** (R2 closed) | the boundary table in `9bf35cdd` |
| V15.2.1 components | **PASS** | `package.json` and `package-lock.json` untouched |
| every other L1 chapter | n/a | there is no such surface; no `src/` line changed |

## Required fixes: **none.** Draft accepted risk: **none needed.**

## Informational

- **`npm run lint` and `typecheck` do not read `tools/`** (Biome `files.includes`, as the Engineer
  stated). This is pre-existing and not introduced here. The committed proof is the only automated
  guard on these two files, and it catches a regression only when someone runs it. That is the
  same limit the proof's header states.

## Board

**Recommend `In Security/NFR → Ready for UAT`.** That move is the Orchestrator's; this hop is fenced
from `plans/board.md`.

The UAT-waiver literal measurement comes back **empty**:
`git diff --name-only e57da89...HEAD | grep -v '\.test\.ts$' | grep '^src/'`. The same reading
question `ABC-122` flagged applies to a diff whose behavior change is under `tools/`. It is the
Orchestrator's reading, not this gate's.

## For the Orchestrator to fold (this hop did not edit the ticket or the trace)

### Proposed ticket section: `## Security/NFR — 2026-09-26 (task secnfr-ABC-123, Workflow 05/15)`

> **Result: PASS.** ASVS L1, `block_on: high`. No required fixes. No new accepted risk. `ABC-122`
> R1 remains the owner's standing accepted risk, unchanged.
>
> | item | ruling | evidence |
> |---|---|---|
> | R2 | **Discharged.** `2147483648`, `99999999999` and `9007199254740993` give exit 2, usage only, and 0 `spawn()` calls (unfixed: exit 124, overflow, target killed). `2147483647` is still accepted. 6 more values above the ceiling are rejected, and lenient spellings of the ceiling are still accepted | `secnfr-ABC-123` `9bf35cdd` |
> | R3 | **Discharged.** The header now says new **session** (`setsid()`) and names it as R1's cause. Measured: the child's `sid = pgid = pid`, distinct from the wrapper's. The comment-only rule holds: the only code lines are R2's | `9bf35cdd` |
> | R1 | **The header is accurate; not widened.** Signal, kill and spawn code is byte-identical to `ca9f42d`. SIGINT gives 130 and SIGTERM 143 on HEAD, with 0 survivors | `9bf35cdd`, `ABC-122` `284db7df` |
> | `N8-LANE` | **0 ms of 650 ms.** 0 new `src/` files; the lane is 48 / 1467 at HEAD | `9bf35cdd` |
> | `N8-SPAWN` | **0 ms, confirmed.** No child runs in the lane. 23 per proof run (26 unfixed), all outside the lane | `9cbd8b67` |
> | ASVS | V1.2.5, V1.3.2, V2.2.1 and V15.2.1 **PASS**; the rest are n/a | `9cbd8b67` |
>
> **Recommend `In Security/NFR → Ready for UAT`.** The UAT-waiver measurement is empty.

### Proposed `plans/traceability.md` row

`| ABC-123 (Security/NFR) | Security/NFR gate on the ABC-123 build (e57da89...3028933). **PASS**, no required fixes, no new AR. R2 discharged: N > 2^31−1 rejected with exit 2 and 0 spawns at the 3 ABC-122 values and 6 more; 2147483647 still accepted. R3 discharged: header says new session (setsid), measured sid = pgid = pid. R1 (owner-accepted) header accurate, not widened: signal code byte-identical to ca9f42d, SIGINT/SIGTERM 130/143 with 0 survivors on HEAD | EPIC-004 | — | N8-LANE 0 ms of 650 (0 src files, lane 48/1467); N8-SPAWN 0 ms confirmed (23 children per proof run, none in the lane); ASVS L1 V1.2.5 / V1.3.2 / V2.2.1 / V15.2.1 PASS | Branch grugops/ABC-123-secnfr (notes only). No code change by this hop | proof exit 0 (24 rows); npm test 48/1467 exit 0; boundary, setsid and signal probes | — | — | Recommend In Security/NFR → Ready for UAT (Orchestrator's move). UAT-waiver measurement empty. Notes: .grugops/context/secnfr-ABC-123/notes/ |`
