---
id: 20261010T103438Z-qe-e2e-observation-abc119-gap-register-b300968a
kind: observation
by: qe-e2e
at: 2026-10-10T10:34:38Z
verified_by:
confidence: high
refs:
  - ABC-119
  - QE-119-a
  - QE-119-b
  - QE-119-c
  - QE-119-d
  - QE-119-e
  - QE-119-f
  - A2
  - A3
  - N8-LANE
  - AR-N8SPAWN-DRIFT
  - ABC-130
  - plans/nfr-catalog.md
  - AGENTS.md
  - .grugops/context/qe-ABC-119/probe/a2ii-dispersion.txt
  - .grugops/context/qe-ABC-119/probe/probe-p2-space-in-path.txt
supersedes:
---

# `ABC-119` QE gap register: one MEDIUM (a measurement protocol limit), one LOW, four INFO. None is a criterion miss

Hand-authored, no seal. QE names owners and does not rule. **Nothing here re-opens `ABC-119`.**

| id | severity | gap | owner (proposed) |
|---|---|---|---|
| **QE-119-a** | **MEDIUM** | **`A2`(ii)'s CPU half is not resolvable on this machine under this load, and the admissibility rule cannot tell.** Two pre-registered, equally admissible sets (twin −0.32 % and −0.20 %, signs 5/5) read HEAD − base CPU at **−0.715 s** and **+0.725 s** against 0.30 s. The twin's own bootstrap 95 % CI of the median is −0.99..+1.57 s and −0.59..+0.92 s. The rule tests the null's **median**, which a symmetric spread centres near 0 whatever its width, and its 1.5 % at a ~33 s base is 0.50 s, wider than the bound it admits. **Suggestion, not a ruling:** make admissibility test the null's dispersion against the bound (for example, the CI of the twin's median within ±bound), or state that a per-ticket CPU bound under 0.5 s is checkable only on a reading whose null is that tight. **This is not a defect of the build.** Every independent estimate is well under 0.30 s, and wall is +0.035 s in both sets | BA/PM (the wording of `A2`(ii)); Architect/Design (`N8-LANE`'s admissibility clause in `plans/nfr-catalog.md`); **Security/NFR** checks `N8-LANE` against QE's raw files at its gate |
| QE-119-b | LOW | **The lane's only watcher is a human remembering to run it.** `M2` and `M3c` are green on the default lane and red only under `CLI_DEEP=1`, and the lane is not a mandatory gate (by precedent). Its trigger (*"after any change to `src/cli.ts` or `src/engine.ts`"*) is written only on the page and in the test file. The `AGENTS.md` `### Test` line is owed to the Scribe, so until it lands nobody reading `AGENTS.md` learns that the lane exists | `AGENTS.md` Scribe (already named owed; draft in `…2409b286`) |
| QE-119-c | INFO | **The `A3`(ii) blind band, measured.** A 4.5 s budget (`M3b`) passes the whole deep lane (children 4624–4643 ms). This is the page's own accepted risk, and the number is now on record | none, accepted under `## Risks` |
| QE-119-d | INFO | **The logged command is not quite reproducible by hand.** `[CLI_DEEP] <node> <path> --colour black --ascii <<< "…"` does not say the child runs with an **empty** environment. Re-running it from a shell inherits that shell's `NODE_OPTIONS` (P1's control shows a marker reaches the child that way). An `env -i` prefix in the log line would make `A1`'s "command verbatim" exact | Software Engineer, at the next hop that touches the file. Not owed now |
| QE-119-e | INFO | **Merge note.** `git merge-tree b62d1b6 a6453bc` shows an **add/add conflict** in `plans/tickets/ABC-130-…md` front matter (`status`/`column`: backlog vs in-development). The wave's side is the later one. A trial merge only: no ref was written | Orchestrator, at merge |
| QE-119-f | INFO | **A checkout path with a space reds the new default-lane test.** `new URL("cli.ts", import.meta.url).pathname` yields `%20`, and `lstatSync` throws `ENOENT`. **Pre-existing and inherited:** `src/cli.test.ts:51-52` uses the same idiom and fails to collect in the same path ("no tests"). The idiom is not this ticket's | backlog candidate, BA/PM (a repo-wide `fileURLToPath` sweep), not cut here |

**Checked and NOT a gap:**
- the `[CLI_DEEP]` line is absent with the variable unset (66 + 1 runs);
- the skip count is 0;
- `describe.runIf`/`skipIf` are not used;
- the file always defines a default-lane test that can fail (P2 shows it does fail);
- argv and stdin are fixed literals, with no concatenation from outside the file (ASVS L1);
- the `timeout` is 20 s;
- `child.error` throws;
- A3 asserts no move, score, depth or node count;
- the deep children were stable under load. At load1 38.9 they still read ~3.1 s, because the engine budget is wall-clock, so neither `A1`'s floor nor `A3`(ii)'s ceiling is load-sensitive within the measured range.
