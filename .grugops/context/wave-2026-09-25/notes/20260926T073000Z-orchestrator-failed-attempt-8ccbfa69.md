---
id: 20260926T073000Z-orchestrator-failed-attempt-8ccbfa69
kind: failed-attempt
by: orchestrator
at: 2026-09-26T07:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-121
  - qe-ABC-121
  - AGENTS.md
supersedes: 
---

# Self-matching `pgrep` wait loops never terminate

Owner spotted hung shells after the ABC-121 hops. Found three leftover loops (pids 23057, 27104, 32418) of the form:

    until ! pgrep -f "vitest run src/search.pvs-lmr.test.ts" > /dev/null; do sleep 10; done

`pgrep -f` matches the full command line, and the loop's own `bash -c` command line contains the same string, so `pgrep` always finds the loop itself and it never exits. They were idle sleepers (no vitest was running). Stopped with SIGTERM; `pgrep -fl "vitest|run-bounded"` then empty.

**Rule for every hop:** never wait on a process by `pgrep -f` of a string that appears in your own command. Wait on the PID you started (`wait <pid>`, or the tool's own background/completion notification), or use a pattern trick that cannot self-match (e.g. `pgrep -f "[v]itest run …"`). Run long lanes in the foreground with a timeout rather than polling. Worth a Scribe line in `AGENTS.md` once ABC-109 lands.
