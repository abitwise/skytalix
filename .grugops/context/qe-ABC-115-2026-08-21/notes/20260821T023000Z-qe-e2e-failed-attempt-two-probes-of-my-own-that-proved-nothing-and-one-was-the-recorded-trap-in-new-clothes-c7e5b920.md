---
id: 20260821T023000Z-qe-e2e-failed-attempt-two-probes-of-my-own-that-proved-nothing-and-one-was-the-recorded-trap-in-new-clothes-c7e5b920
kind: failed-attempt
by: qe-e2e
at: 2026-08-21T02:30:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A9
supersedes:
---

# TWO INSTRUMENTS I BUILT AT THIS HOP AND THREW AWAY — neither is one of the four already recorded

Four dead ends were on file before this hop (timing the pipeline; an open stdin that supplies
nothing; no settle delay; the orphan holding the capture pipe) and **none was re-run** — they were
read and avoided by construction. These two are new.

## 1. CLOSING FD 1 IS NOT A STDOUT FAILURE — it looks like the perfect non-`EPIPE` probe and it is a no-op

Reaching for a non-`EPIPE` stdout error, the first idea was the cheapest:

```
node src/cli.ts --ascii </dev/null 1>&-
```

**Measured: exit 0, stderr 0 bytes.** No error arm fires at all. Node re-opens a closed standard fd
onto `/dev/null` during bootstrap, so the child writes 24 lines into the void and exits cleanly. Had
I stopped there I would have recorded "non-`EPIPE` stdout errors are unreachable" and never found
`G-QE115-1`.

**What works instead: a read-only fd handed to the child as stdout** (`fs.openSync(path, "r")` in
the `stdio` array). The first write fails `EBADF`, the arm fires, and the two builds separate
1542 bytes to 0. **The general rule: to fail a write you must make the WRITE illegal, not the fd
absent.**

## 2. THE PIPELINE-TIMING TRAP, IN NEW CLOTHES — it caught me once on the pty probe

The recorded trap is "never time the pipeline, time the child". I obeyed it inside the suite and
then walked straight into it in a **different shape** on my own TTY probe: I put the timer on the
whole `{ sleep 0.6; echo zz; sleep 10; } | script ... ` command line, and every build read

```
NODE_EXIT=0    real 10.63
```

— because the reading is my **own writer's** `sleep 10`, on the left of a pipe feeding `script`,
exactly as the design hop's reading was the writer's sleep on the left of a pipe feeding `node`. The
delivered build was in fact ending at 0.61 s.

**The fix is the design hop's, applied one layer out:** put `/usr/bin/time -p` on `node` *inside*
the pty and send its stderr to a file. **The generalisation, which is what makes this worth
recording separately: the trap is not about pipelines. It is about timing any process that outlives
the one you are asking about — and wrapping the instrument in a pty puts a fresh candidate for that
role between your timer and your subject.**
