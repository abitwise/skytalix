---
id: 20261011T112015Z-ba-pm-decision-cut-abc150-lever-p1-sync-abc146-5996f107
kind: decision
by: ba-pm
at: 2026-10-11T11:20:15Z
verified_by:
confidence: high
refs:
  - ABC-150
  - ABC-147
  - ABC-146
  - ABC-144
  - ABC-149
  - ABC-085
  - ADR-0040
  - ADR-0008
  - ADR-0038
  - ADR-0035
  - NFR-008
  - RISK-ABC143-01
  - plans/tickets/ABC-150-vitest-runs-the-engine-5x-slower-than-node-find-why-then-cut-the-lanes-cpu.md
  - plans/tickets/ABC-146-abc085s-verdict-run-the-same-ladder-harness-under-plain-node-then-take-a1-a2-at-step-4.md
  - plans/traceability.md
  - .grugops/context/ticket-to-pr-ABC-147/notes/20261011T111107Z-software-engineer-decision-abc147-a4-rule-applied-r-lower-edge-29-7-pct-p1-lever-arm-d689c50d.md
  - .grugops/context/ticket-to-pr-ABC-147/notes/20261011T111107Z-software-engineer-observation-abc147-a2-a3-paired-ratio-and-r-band-a6122481.md
  - .grugops/context/ticket-to-pr-ABC-147/notes/20261011T111107Z-software-engineer-observation-abc147-caveats-load-heat-profiler-hangs-144c6b5d.md
  - .grugops/context/secnfr-ABC-144-window-a/notes/20261011T095343Z-security-nfr-observation-abc144-window-a-frontier-readings-a898a14a.md
  - .grugops/context/wave-2026-09-25/notes/20261011T103342Z-orchestrator-decision-owner-word-quiet-window-choking-cleanup-cb6772e0.md
  - .grugops/context/wave-2026-09-25/notes/20261011T102346Z-orchestrator-decision-owner-word-accept-adr0040-adr0038-addendum-7089c972.md
supersedes:
---

# BA/PM: `ABC-150` cut (`M`, `P1`, DoR 10/10) as `ABC-147` `A4`'s ≥ 15 % arm; `ABC-146` synced to the accepted addendum

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Branch:** `grugops/bapm-cut-abc147-lever`, from the wave tip `0b1a37c5`. Not merged, not pushed.
- **Nothing was measured.** No test, no timing, no CPU. The `ABC-147` notes were read from branch
  `grugops/ABC-147-vitest-overhead-probe` @ `4c634f09` with `git show`.
- **Not edited:** `src/`, `plans/board.md`, `AGENTS.md`, any page's `status`/`column`, and `ABC-147`'s page
  (it lives on its unmerged branch; a pointer there would conflict).
- **`ABC-150` was free** on every local branch's `plans/tickets/` and in `.grugops/queue/`.

## Decisions

| # | decision | why |
|---|---|---|
| 1 | **Cut `ABC-150`, `P1`, routed to Architect/Design** | `ABC-147` `A4`'s pre-registered arm: R's lower edge 29.7 % ≥ 15 % (`…d689c50d`). The rule fixed the arm and the priority before the reading |
| 2 | **Diagnosis before the lever, in one ticket** (`D1`–`D3`, then `L1`–`L6`) | The cause is `UNKNOWN - verify`. Candidates C1 transform/source maps, C2 worker flags, C3 module interop; the pool type is already ruled out (`ABC-085` `RUN.txt` item 4: threads ≈ forks) |
| 3 | **Not split** into a diagnosis ticket and a lever ticket | Same shape as `ABC-144` (Architect ruling + build + window). `D3`'s pre-registered split rule closes the ticket at the ruling if no runner setting removes the factor, so no long chain hides behind it |
| 4 | **"`ABC-144`'s base" read as: the tree with `ABC-144` merged (k = 3), read with `ABC-144`'s instrument** (`lane144.mjs`, `ADR-0035` d2, n ≥ 8, twin) | Composes with `ADR-0040` and credits the lever only with its own increment. **Rejected reading:** Window A's 7-worker base (27.15 s), which would count `ABC-144`'s −16.48 % twice. `ADR-0040` d5's straddle rule forbids a base before the cap and a head after it |
| 5 | **Bar: paired CPU ≤ −15 % of base**, `ADR-0040` d2's form | `ABC-147` `A4`'s and `ABC-144` `A1`'s own threshold. The 26.0–35.8 % band is an expectation only: it was read at 7 workers, and at 3 it is `UNKNOWN - verify`. A miss goes to the owner, never weakened silently |
| 6 | **Composition fences** | `ADR-0040`'s pin passes unchanged (a `poolOptions` key would need an `ADR-0040` amendment with r1/r2/r3/r3b re-armed); `isolate` and the isolation mechanism are untouched (`ADR-0008` d7); 20-run `*.nfr` screen (`ADR-0008` d8); 0 production lines; `RISK-ABC143-01` makes `ABC-149` a prerequisite if the setting is a vitest major |
| 7 | **Heat is reported, not barred** (`L4`) | The owner's "choking cpu and generating heat". `thermalpressurelevel` is system-wide; `CPU_Speed_Limit` is absent on this M3 (`ADR-0040` addendum). A count of runs at level ≥ 1 per arm is all the instrument supports |
| 8 | **Profiler caveat carried** (`L6`) | 5 of 18 `--cpu-prof` lane runs hit the 60 s bound, 0 of 18 unprofiled (`…144c6b5d`). No `L` reading is profiled |
| 9 | **`D1` stop rule at 1.67x** | Arithmetic: `ABC-147`'s formula at its lowest share (37.27 %) gives R = 15 % at ratio 1/(1 − 0.15/0.3727) = 1.674 |
| 10 | **`ABC-146` synced** | The `ADR-0038` addendum is ACCEPTED (`…7089c972`); `ABC-085` merged (`1031911b`). Struck words kept. A dated note says the same ~5x factor is why the verdict moves to `node`, and that `ABC-150` neither blocks nor re-opens that route. DoR stays 9/10: `ABC-083`'s merge is the only open part of item 10 |

## Recommended board moves (the Orchestrator's to make)

- **`ABC-150`:** new → `Ready` (DoR 10/10). → `In Design` once `ABC-147` leaves `In Review` with its arm
  intact (In Design WIP 0/2).
- **`ABC-146`:** stays `Backlog`. Replace the row's "page still says … PROPOSED — stale" note with "page synced".
- **`ABC-147`:** no move from this hop. At its exit, its page can gain a one-line pointer to `ABC-150`.

## Open questions

- None blocks the cut. If `ABC-147`'s Security/NFR review re-reads R's lower edge below 15 %, `ABC-150` returns
  here before it is pulled.
