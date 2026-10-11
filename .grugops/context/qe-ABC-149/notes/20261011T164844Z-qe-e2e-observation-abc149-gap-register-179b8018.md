---
id: 20261011T164844Z-qe-e2e-observation-abc149-gap-register-179b8018
kind: observation
by: qe-e2e
at: 2026-10-11T16:48:44Z
verified_by:
confidence: high
refs:
  - ABC-149
  - ABC-143
  - ABC-152
  - QE-149-a
  - QE-149-b
  - QE-149-c
  - RISK-ABC143-01
  - 20261011T163050Z-software-engineer-observation-abc149-suite-count-a1eff3dc
  - 20261011T164844Z-qe-e2e-observation-abc149-readings-1d736a15
  - 20261011T164844Z-qe-e2e-observation-abc149-mutants-918a2941
supersedes:
---

# QE `ABC-149`: gap register (1 LOW, 2 INFO; none is an unmet criterion, none blocks)

This note is hand-authored and unsealed. The readings are in `…1d736a15` and `…918a2941`.

| id | severity | owner | gap |
|---|---|---|---|
| `QE-149-a` | LOW | BA/PM (fold into the next ticket that edits the reporter's header; `ABC-152` is the next one named) | **The READ IT query, as wrapped in the header, does not run as pasted.** The block says "run the READ IT query above". Header lines 24-28 hold it across five comment lines, and the closing `'` ends line 27. Pasted with its line breaks (prefixes stripped), bash ends the command there: `jq` reads empty stdin and prints nothing, then `.test-results/last-run.json` runs as a command. Exit **126** and 0 query lines on all 28 row files of this hop (head, `M1`, `M9`, `M9b`, base). Joined into one line, it is correct (every reading in `…1d736a15`). **No false pass follows:** a hop that pastes it sees every red row disagree, loudly. The green row's 0 lines is right anyway. The cost is a misdiagnosis on the first run. The READ IT text dates from `ABC-143`; `ABC-149` added the instruction that sends the hop to it. Fix: one comment sentence ("one command; join the lines") or a re-wrap. Comment-only |
| `QE-149-b` | INFO | none (resolved) | **The SE's `UNKNOWN - verify` on `numFailedTestSuites` 2 is resolved: traced in source and confirmed by plant.** vitest 3.2.7 counts `getSuites(files)` in state `fail` (`vitest/dist/chunks/index.VByaPkjc.js:1703`). `getSuites` recurses over each file (a suite-type task) and every nested `describe` (`@vitest/runner/dist/chunk-hooks.js:1329`). So one failing test gives 1 for the file plus 1 for each enclosing `describe`. QE's plants: top-level test **1**, one `describe` **2** (`gameend:280` and the `ABC-142` `fen:54` shape alike), two `describe`s **3**. A throw in a `describe` body fails at collection, so it gives **1** at any depth (a nested throw read 1). The block's assertion row correctly names no suite count, and its suite row's `1` holds wherever the hop plants it. The SE's stated risk stands: never add a suite count to the assertion row |
| `QE-149-c` | INFO | BA/PM / Architect (attach to `ABC-152`'s `V2`) | **`M9b`, a report-time write that fills `runState` and `exitCode` from `process.exitCode`, passes five of six rows and `ABC-143` `A1`–`A5`. Only the exit-code-only row kills it** (`success` true, `exitCode` 0, while `npm test` exits 1). That is not a gap of this ticket: the set catches it, which is the ticket's point. It is the rewrite most likely when `ABC-152` moves the reporter to vitest 4.1. `ABC-152` `V2` should run the set **including** the exit-code-only row, and should not substitute `ABC-143`'s `A1`–`A6` for it |

**No gap:**
- the six rows, the two commands cut from the block (the stamp and the coverage run) and the
  block's verbatim unhandled example all run as written;
- the comment-only filter catches code edits (three mutations shown);
- the counts and the `ABC-143` page pointer are as the criteria ask.
