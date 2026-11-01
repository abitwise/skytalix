# qe-EPIC-010-m1-batch-2 findings: none blocking. QE-M1B2-b MEDIUM (QE method, fixed in-hop), QE-M1B2-c MEDIUM (host contamination from another repository), QE-M1B2-a and -d INFO

- **QE-M1B2-a, INFO, QE harness (fixed in-hop).** The watcher's foreign-skytalix filter matched our own `cutechess-cli`,
  because its argv carries `arg=…/dist/uci.js`.
  - Fixed at 07:53Z in run 1, before any reading. The committed `raw/scripts/watch.mjs` carries the fix, marked.
  - The fix could only drop a false positive. It never hid a real foreign engine.
- **QE-M1B2-b, MEDIUM, QE method (fixed in-hop; no tool defect).** Run 1 was started as a background task of the agent's
  shell. When the watcher paused it with SIGSTOP (PREREG, median 85.20 °C), the task runner tore the process tree down, and
  the run was VOID at 48 min (`…3fb3b1fd`).
  - The re-run was started with `setsid -f` (ppid 1). A SIGSTOP/SIGCONT test passed before the re-run.
  - **For every later batch PREREG:** start the harness detached from any agent job-control parent, or the thermal pause
    becomes a kill.
  - The re-run never needed a pause, so the pause path is still **unexercised on a real batch** (only the stop/continue
    test). The tool still has no pause or resume of its own.
- **QE-M1B2-c, MEDIUM, host / scheduling (records).** The batch was briefed STRICTLY ALONE, but another repository on the
  host (`<home>/projects/public/grugops`) ran `vitest` in bursts: run 1 from 08:16Z, and the re-run at 08:44–09:10Z, around 17:00Z,
  around 18:40Z and around 20:40Z.
  - It covered 7.7 % of the re-run's ticks, and three block-runs were > 25 % (base b01, base b04, candidate b05).
  - It drove Tctl into the high 80s and caused run 1's pause, and through QE-M1B2-b its VOID.
  - It was logged and never killed. Under the PREREG it is not a cause, and no block shows a fault, a time loss or a clock
    off 4.0 s.
  - Its effect on the scores is unknown and probably small, since it hit both sides (2 base runs and 1 head run).
    `UNKNOWN - verify`.
  - **Route:** the Orchestrator and the owner. The lane rule covers skytalix hops, but the host is shared with other
    repositories' agents.
- **QE-M1B2-d, INFO, the reading.** NOT LOSS by the rule (X + Y = +19.6), but the point estimate is −58.3 Elo: the head scored
  72.00 % against the base's 78.25 %.
  - The pair's ± 77.9 cannot tell "no change" from a fall of tens of Elo (EPIC-010: "Tens of Elo stay invisible").
  - Information for BA/PM's fold and the owner. The epic's bigger batch (400 + 400) or longer-thinking games run only on the
    owner's word.
- **Regression risk:** the head is the batch's reference from here on. A later batch measures against this head's 72.00 %
  at 4 000 ms.
- **Not covered:**
  - Engine strength beyond E 1 910 at 4 000 ms.
  - The pause path on a real batch (QE-M1B2-b).
  - Byte equality of the tool-built `dist/` with QE's earlier probe builds (QE-247-d). Not needed here: the tool built and
    played its own clones, and their dist trees are in `artifacts.txt`.
