---
id: 20261030T003823Z-qe-e2e-decision-3a53bdfc
kind: decision
by: qe-e2e
at: 2026-10-30T00:38:23Z
verified_by: 
confidence: high: by the pre-registered verdict rule
refs:
  - ABC-225
  - EPIC-010
  - EPIC-008
  - tools/rating/rating.ts
  - tools/rating/pair.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-225
  - 9988a778
  - 83751dc0
  - 02fa9556
  - baf99a7c
  - se-ABC-225/20261029T210343Z-software-engineer-decision-e58c4d25
  - se-ABC-225/20261029T210343Z-software-engineer-observation-868049fb
  - se-ABC-225/20261029T210343Z-software-engineer-observation-14fdbedc
  - orch-2026-10-29g/20261029T210522Z-orchestrator-decision-561f1ef1
  - orch-2026-10-29g/20261030T001430Z-orchestrator-decision-3f5b9486
  - arch-epic008-rd/20261029T195200Z-architect-design-decision-0c5d62f4
  - ADR-0049
  - NFR-008
  - qe-ABC-225/20261030T002019Z-qe-e2e-decision-1c31ccc4
  - qe-epic008-close/20261029T014341Z-qe-e2e-observation-e8d5c13a
  - NOTICE
  - src/uci-session.ts
  - qe-ABC-225/20261030T003823Z-qe-e2e-observation-dd39468d
  - qe-ABC-225/20261030T003823Z-qe-e2e-observation-f5b1a86e
supersedes: 
seal: sha256:3e52da683b9cf0b909d536cc9d1018c859b43a2723301c8f969fc5333c594fe0
---

# qe-ABC-225 verdict: FAIL, because acceptance is not evidenced. A1–A4 MET, no tool defect found. A5 and A6 were not read: THERMAL STOP. The `id author` line is ACCEPTABLE.

QE/E2E, task `qe-ABC-225`. Pre-registration `…1c31ccc4`. Readings: A1–A4 and gates `…dd39468d`; A5 runs `…f5b1a86e`.

## Verdict: FAIL (blocking gap: A5 and A6 not read)
- By the pre-registered rule, FAIL means "A5 NOT MET after the one re-run". A5 was started twice and read neither
  time, so the rule gives FAIL.
- **What the FAIL is not:** QE found no defect in `rpair`. The argv, schedule, arithmetic, sampler, nps parser,
  build path and clone path all behaved as specified in everything QE could observe.
- **What it is:** the host ran too hot to finish 40 games at width 2 under the 85 °C stop line, and twice it was
  not ALONE. **`ABC-225` is not mergeable on this hop.** It stays In Review until A5 and A6 are read.

| criterion | result |
|---|---|
| A1 same pins as `r` | **MET** (QE dry-run comparison, 20 + 2 block-runs, 4 differing positions each) |
| A2 interleaving | **MET** (ABBA; 1–100 once per build; both colours) |
| A3 arithmetic | **MET** (−82.9 ± 73.8; −82.9 ± 64.28; QE's own script and formula copy) |
| A4 faults | **MET** offline (`pair-check` 22/22); the real halt path is not exercised |
| A5 host log, 40 real games | **NOT READ.** Run 1 VOID (foreign vitest, Tctl 90.9 °C); run 2 THERMAL STOP (median 87.05 °C / 30 samples); 4 of 40 games. Only "Tctl reads" is verified |
| A6 cost | **UNMEASURED**; no block finished |
| 40-game Elo (INFO) | **none.** 4 base games, 4–0 by mate; no pair figure |

## Ruling: `artifacts.txt`'s engine `id author Olger Oeselg` line is ACCEPTABLE, and not an A5 hit
- It is the engine's public UCI `id author` string. It is compiled from tracked source
  (`src/uci-session.ts:356`) and is the same name as `NOTICE`'s copyright line, on a public repository.
  It is attribution, not a host identifier.
- `ADR-0049` d4 and A5 target host paths, the login name and the host name. The login is matched case-sensitively
  as a whole word, and the harness redacts it. The author string matches the login only case-insensitively and in
  part.
- **Precedent:** the same line is already in 40 committed files across 19 context dirs on `main`, among them the
  rating records of `qe-ABC-204`, `qe-ABC-207`, `qe-epic008-close` and `qe-epic008-q4c`. The Orchestrator read it
  as fine (`…561f1ef1`).
- So the A5 scan is case-sensitive on the login, and this line does not count. If the owner wants it gone, that is
  a `src/` change (the UCI id), not a harness redaction.

## Gaps
- **QE-225-a (BLOCKING): A5 and A6 are unread.** Three of the SE's four real-run points stay `UNKNOWN - verify`:
  `start=S` for S > 1, an `nps.log` line per block, and the formula on a real block line. So do the redaction pass
  and the projection.
- **QE-225-b (HIGH, for the Orchestrator and the owner): an R run at width 2 runs above the 85 °C stop line on this host.**
  - The figures: run 2 reached 83–84 °C within 50 s while still ALONE, and its median was 87.05 °C once a foreign
    vitest joined. The earlier R readings recorded a median of 82–83 °C and a max of 84–87 °C over whole runs
    (`qe-epic008-close` `…e8d5c13a`).
  - So the A5 smoke (40 games, about 1 h) is at risk, and `EPIC-010`'s batch and M2 even more so: a 400-game
    `rpair` at width 2 for about 9 h. Run under this stop line, they may never finish.
  - The line and the heat are the owner's to set (NFR bound, his heat concern). QE does not move them.
  - Options for re-reading A5, QE's view only:
    - (i) a cooler host state (ambient or cooling) under the same line;
    - (ii) the owner sets the Tctl line for R runs explicitly;
    - (iii) read A5's tool-working points at `--concurrency 1`. That needs a new PREREG, and its wall cannot
      project the width-2 pair.
- **QE-225-c (MEDIUM, host): another project's vitest ran on this host twice during this hop** (from 00:05:18Z and
  from 00:30:31Z).
  - This factory cannot keep the host ALONE on its own. The Orchestrator should coordinate it.
  - The precheck must count `pgrep -f "[/]vitest"`, not `pgrep -x node`: the comm is `node-MainThread`. QE's
    session script does this now.
- **QE-225-d (LOW): the pentanomial's variance convention is unstated.** Population (n) matches `an1` and the tool;
  sample (n − 1) gives ± 64.60. A one-line comment in `pair.ts` would remove the doubt. Not a defect.
- **QE-225-e (LOW, INFO): Stockfish's nps was 1.44 M in the hot run, against r1/r2's 1.64 M (−12 %).**
  This is the speed gauge the ticket built; it moved as heat and load would make it move.

## Host-path scan of what QE commits
All files under `qe-ABC-225/` were scanned for every pattern below, case-sensitive and case-insensitive: home, temp
and session-scratch prefixes, the login, the host name, and the e-mail (address and local part).
- **0 hits**, except `/usr/bin/env` shebangs, which are not a host path.
- The dry-run print and the `npm test` log had their checkout and scratch paths replaced by `<repo>` and `<out>`
  before staging.
- The helper scripts resolve the plugin path at run time and hard-code no path.

## Next (the Orchestrator's)
- `ABC-225` stays In Review, not mergeable.
- Route QE-225-b to the owner (the heat and the stop line), and QE-225-c to host coordination.
- Re-queue A5 and A6 only after that; a new PREREG goes with the re-queue.
