---
id: 20260925T151300Z-security-nfr-decision-abc122-pass-with-accepted-risk-n8lane-met-k3-k4-closed-2749a2e6
kind: decision
by: security-nfr
at: 2026-09-25T15:13:00Z
verified_by:
confidence: high
refs:
  - ABC-122
  - ABC-081
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ADR-0007
  - ADR-0019
  - AR-N8LANE-079
  - tools/grugops/run-bounded.js
  - package.json
  - src/search.capacity.test.ts
  - src/engine.capacity.test.ts
  - plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
  - .grugops/context/secnfr-ABC-122/notes/20260925T151100Z-security-nfr-observation-abc122-n8lane-met-plus-670ms-gross-350ms-net-sign-8of8-wrapper-unresolvable-2ff3a7b8.md
  - .grugops/context/secnfr-ABC-122/notes/20260925T151200Z-security-nfr-observation-abc122-kill-surface-no-mistarget-no-shell-tree-escapes-sigkill-class-stops-284db7df.md
  - .grugops/context/qe-ABC-122/notes/20260925T225500Z-qe-e2e-decision-abc122-pass-with-findings-1a9b3e6f.md
  - .grugops/context/secnfr-ABC-081/notes/20260925T124400Z-security-nfr-observation-abc081-table-bounded-key-verified-moves-legal-capacity-guard-unreached-k4-low-80a49b24.md
supersedes:
---

# ABC-122 Security/NFR: **PASS-WITH-ACCEPTED-RISK**. No high finding and no ASVS L1 failure. `N8-LANE` is MET. K3 and K4 are closed. One new LOW needs the owner's word

Hand-authored and unsealed: a `decision`, not a stamp (`human_admission` is `off`). The
gate reviewed `0bc31e1...ca9f42d -- tools package.json src` at the review tip `9db8f2a`.
`security.asvs_level` is `L1` and `block_on` is `high`.

## Result

**PASS-WITH-ACCEPTED-RISK.**
- Nothing is at or above `high`, so nothing blocks.
- The one new LOW (R1) is an accepted risk. It carries a named owner, and it **waits on that
  owner's word**. It does not go ahead on this note alone.

## `N8-LANE` (queue item 1)

**MET: +670 ms gross CPU, +350 ms net of the 320 ms floor, against 650 ms. Sign 8/8, null −0.09 %.**
- The build's +475 / ≈ +155 (sign 5/8) is confirmed as MET and corrected upward.
- **The wrapper's own spawn is not charged.** `N8-LANE` charges lane files on the contained lane,
  which invokes the runner directly, and the wrapper is not a lane file. It was measured anyway:
  W − A is −10 ms, sign 3/8, which cannot be told apart from zero, and its isolated cost is about
  10 ms CPU. Charged in full it gives +355 net, so MET either way.
- **`N8-SPAWN`: 0, confirmed.**
- Load median 11.8, so confidence is medium. The figures are in `2ff3a7b8`.

## Risks, each with severity (queue item 2)

| id | risk | severity | disposition |
|---|---|---|---|
| **R1** | The wrapper's child runs in a **new session**. SIGHUP, SIGQUIT, a SIGKILL to the wrapper, or a supervisor's group SIGKILL leaves the test tree **running with no bound**. Measured on the real `npm test`: `timeout -s KILL` gave 0 survivors before the change and 1 surviving `vitest` after it. For the hang class, that is an unbounded CPU-burning orphan. | **LOW**. The reason, since the default map does not apply (no ASVS requirement fails): the failure is closed (never a false green), it needs a SIGKILL-class stop AND a hang, and it is local-only | **Accepted risk. Owner: Olger Oeselg (word owed).** Recommended partial fix: forward `SIGHUP` and `SIGQUIT` (2 of 4 paths). The SIGKILL paths are the residual. Operational rule meanwhile: stop `npm test` with SIGTERM first (measured clean) |
| R2 | `N` > 2 147 483 647 is accepted. Node clamps the timer to 1 ms, so a healthy run is killed at once with exit 124 | LOW. Fails closed (a false red). Unreachable with the committed 60000 | Accepted note, to be fixed at the next licensed touch of `tools/grugops/`: reject `N` > 2^31 − 1. **Owner: Software Engineer** |
| R3 | The header of `run-bounded.js` is stale. It says "NOT YET WIRED IN", and "leader of a NEW process group" understates a new **session**, which is exactly why R1 exists (QE gap 1) | LOW | **Required fix, non-blocking**, at the same next touch as R2 (fenced from this hop). **Owner: Software Engineer; the Orchestrator schedules it** |
| I1 | A child exiting 124 on its own shares the timeout's number (the stderr line tells them apart) | info | none |
| I2 | A grandchild left behind when the child exits normally is not killed. Plain `vitest run` behaved the same way | info, not a regression | none |
| I3 | `N` parsing is lenient (`1e3`, `0x3e8`, `" 1000 "`) | info | none |
| — | Mis-targeting and pid reuse | **none found**. The only target is the child's own pgid, signalled only while the child is unreaped | — |
| — | Shell interpolation (V1.2.5) | **none**. Argv spawn, measured with metacharacters | — |
| — | Exit-code mapping 124 / 130 / 143 / 128 + n / pass-through / 2 | **holds**, measured | — |

**Required fixes before this ticket may leave `In Security/NFR`: none.** R3 is required but not
blocking. QE's six hostile cases agree with every row above.

## K3 and K4 from `ABC-081` (queue item 3), said explicitly

- **K3 (the capacity guard had no test of its own): CLOSED.**
  - Both guards are now exercised directly through the real `search()` / `chooseMove`, with zero
    production lines.
  - 6 of 6 mutants turned red (build), and 2 were re-applied independently by QE with the same
    signatures. This gate did not re-apply mutants, so the closure rests on those two hops.
  - The mocks are file-scoped under `isolate: true`.
- **K4 (the gate could hang instead of failing red): CLOSED for its stated scope.**
  - `npm test` now fails red with exit 124 within the 60 s bound. The build measured it at
    60.23 s and again at 60.17 s against the reverted root guard.
  - The deep lanes are outside the bound by design; the amendment covers that and the Scribe
    owes the doc line.
  - **The fix introduces R1**, a narrower LOW: the bound does not survive a SIGKILL-class stop
    of the wrapper itself. R1 is not K4 reopened. K4 was "nothing bounds the gate". R1 is
    "the thing that bounds the gate can itself be killed out from under the tree".

## QE's gap 1 (queue item 4)

**Rated LOW, a required fix, non-blocking.** It is R3 above. A security-relevant tool's own header
misstating its status, and its process model, is worth one line. It is not worth holding the
ticket: the behaviour is verified, and the fix is fenced from both this hop and QE's.

## What the owner must decide

1. **R1: accept the residual, or order the one-line follow-up.** The follow-up forwards
   `SIGHUP` and `SIGQUIT`, and it could land with R2 and R3 in one touch of `tools/grugops/`.
   Either way, the SIGKILL-class residual has to be his accepted risk. This note does not accept
   it for him.
2. **Possibly the UAT-waiver reading** (see `## Board`), if the Orchestrator cannot read the
   2026-08-17 rule unambiguously for a diff whose behaviour changes sit outside `src/`.
3. `N8-LANE` needs no new word. `AR-N8LANE-079` covers the lane level, and this ticket meets the
   per-ticket bar.

## Board

Recommend `In Security/NFR → Ready for UAT`, which is the Orchestrator's move (this hop is fenced
from `plans/board.md`).

**Flagged, not ruled: whether the UAT waiver applies.** The 2026-08-17 rule's literal
measurement, `git diff --name-only 0bc31e1...ca9f42d | grep -v '\.test\.ts$' | grep '^src/'`,
comes back **empty**, because every `src/` file in the diff is a `.test.ts`. That contradicts the
ticket's cut-time expectation that "production lines > 0". But `package.json` and
`tools/grugops/run-bounded.js` change what `npm test` does for every role, and the measurement
does not see them. Whether they count is the Orchestrator's reading of the owner's rule, or the
owner's own. It is not this gate's.
