---
id: 20260926T210100Z-security-nfr-observation-9bf35cdd
kind: observation
by: security-nfr
at: 2026-09-26T21:01:00Z
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
  - .grugops/context/secnfr-ABC-122/notes/20260925T151200Z-security-nfr-observation-abc122-kill-surface-no-mistarget-no-shell-tree-escapes-sigkill-class-stops-284db7df.md
  - .grugops/context/secnfr-ABC-122/notes/20260925T151300Z-security-nfr-decision-abc122-pass-with-accepted-risk-n8lane-met-k3-k4-closed-2749a2e6.md
  - .grugops/context/ticket-to-pr-ABC-123/notes/20260926T205400Z-software-engineer-observation-35a5af66.md
  - .grugops/context/secnfr-ABC-123/notes/raw-harness-boundary.mjs.txt
  - .grugops/context/secnfr-ABC-123/notes/raw-harness-spawn-spy.cjs.txt
  - .grugops/context/secnfr-ABC-123/notes/raw-out-boundary.txt
  - .grugops/context/secnfr-ABC-123/notes/raw-harness-sid.py.txt
  - .grugops/context/secnfr-ABC-123/notes/raw-out-sid.txt
  - .grugops/context/secnfr-ABC-123/notes/raw-harness-sig.mjs.txt
  - .grugops/context/secnfr-ABC-123/notes/raw-out-sig.txt
supersedes:
---

# ABC-123 Security/NFR readings: R2 closed at and around the boundary with 0 spawns on rejection, `setsid()` confirmed, SIGINT/SIGTERM clean, no code change outside the R2 guard, lane unchanged at 48 files

Hand-authored and unsealed. `human_admission` is `off` and there is no `context-io.ts` on this
install (`AGENTS.md`), so these are readings and not a stamped `finding`. Subject: `e57da89...3028933`
on `grugops/ABC-123-secnfr`. macOS Darwin 25.5.0, Node v24.12.0, 2026-09-26 around 20:55–21:00 UTC.
1-minute load average about 3.3.

## Integrity of the subject

- The scratch copy of the unfixed wrapper is blob-identical to `e57da89:tools/grugops/run-bounded.js`
  (`7952850f`). The worktree file is blob-identical to `HEAD` (`46967a37`).
- `run-bounded.js` did not change between `ca9f42d` (the tip `ABC-122`'s gate measured) and
  `e57da89`. So every `ABC-122` signal reading applies to this ticket's base.
- **The only non-comment lines in the diff of `run-bounded.js` are the R2 lines:** the new
  `const MAX_TIMEOUT_MS = 2 ** 31 - 1;` and the validation `if` widened by one clause,
  `timeoutMs > MAX_TIMEOUT_MS`. The `spawn(...)`, `killTree`, timer, `process.on(signal …)`,
  `error` and `exit` lines are byte-identical to `ca9f42d`.

## R2, the boundary (`raw-out-boundary.txt`)

A `spawn()` spy was preloaded into the wrapper process, and the target was a node one-liner that
prints `ran`. The harness is the Engineer's spy idea re-written and re-run independently, with a
wider value set.

| N | unfixed `e57da89`: exit, spawns, target, overflow | fixed `3028933`: exit, spawns, target, stderr |
|---|---|---|
| `2147483646` | 0, 1, ran, – | 0, 1, ran, empty |
| **`2147483647`** | 0, 1, ran, – | **0, 1, ran, empty** |
| `2147483647.0`, `0x7fffffff`, `2.147483647e9` | 0, 1, ran, – | 0, 1, ran, empty |
| **`2147483648`** | **124, 1, killed, OVERFLOW** | **2, 0, –, usage-only** |
| `2147483649`, `0x80000000`, `2.147483648e9`, `4294967296`, `4294967297` | 124, 1, killed, OVERFLOW | 2, 0, –, usage-only |
| **`99999999999`**, **`9007199254740993`** | 124, 1, killed, OVERFLOW | 2, 0, –, usage-only |
| `1e21` | 124, 1, killed, OVERFLOW | 2, 0, –, usage-only |
| `2147483647.5`, `-0`, `-2147483648` | 2, 0, –, – | 2, 0, –, usage-only |

- **Every value the unfixed wrapper clamped to 1 ms is now rejected. Every rejection makes 0
  `spawn()` calls**, so the target is never started.
- **Nothing that the fixed wrapper accepts can overflow the timer.** The accepted set is now
  exactly the integers from 1 to 2^31 − 1. Node's clamp applies only above 2^31 − 1.
- **The boundary did not move.** `2147483647` and its lenient spellings are accepted on both
  wrappers, with an empty stderr, so there is no overflow warning.
- Reject-before-spawn also holds statically: the `if` ends in `process.exit(2)` before the
  `spawn(...)` line, and `process.exit` is synchronous.

## The committed proof, re-run at HEAD

`node tools/grugops/run-bounded.proof.js`: **exit 0, "all rows held"**, 24 rows. They are the
2 ABC-122 pass-through rows, 17 ABC-123 rows and the 5 ABC-122 hang rows. The 17 are 3 A1, 1 A2
and 13 A3, and the 13 include the no-argument row. The hang row killed the tree in 533.0 ms, and fixture, grandchild and group
were all ESRCH 250 ms later. Real time 1.56 s, user 1.09 s, sys 0.18 s.

## R3, the process model (`raw-out-sid.txt`)

The HEAD wrapper ran a python target that reports its own ids and its parent's:

| process | pid | pgid | sid |
|---|---|---|---|
| harness | 81033 | 81033 | 81031 |
| wrapper | 81036 | 81033 | 81031 |
| **child (the target)** | **81038** | **81038** | **81038** |

- **The child leads a new session (`sid = pid`) and a new process group (`pgid = pid`),
  distinct from the wrapper's.** That is `setsid()`, which is exactly what the new header says.
  It agrees with `ABC-122`'s pty reading (STAT `Rs`).
- **One limit, stated.** The target could not open `/dev/tty` (ENXIO). That reading does not
  discriminate here, because the harness itself had no controlling terminal. The header's "the
  new session has no controlling terminal" rests on `setsid(2)` semantics, which define it.
  It is not a measurement of this hop.

## R1's operating rule, re-checked on HEAD (`raw-out-sig.txt`)

HEAD wrapper, 4000 ms bound, around the `ABC-122` hang fixture (fixture plus idle grandchild),
signal sent to the wrapper only:

| stimulus | wrapper exit | ms to exit | fixture and grandchild 500 ms later |
|---|---|---|---|
| SIGINT → wrapper | 130 | 3 | both gone |
| SIGTERM → wrapper | 143 | 3 | both gone |

**Not re-sent at this hop: SIGHUP, SIGQUIT and SIGKILL.** This hop stops processes with
Ctrl-C/SIGTERM only. Those rows rest on `ABC-122`'s measurement (`284db7df` §3). The code they
exercise is byte-identical at HEAD, as stated above. **The close-the-terminal-during-a-hang case
stays `UNKNOWN - verify`.** It is a recorded failed attempt at `ABC-122`, and it was not retried.

## Lane

`npm test` at HEAD, through the wrapper at 60000 ms, with a temporary `node_modules` symlink to the
main checkout (`package-lock.json` identical by `cmp`; the symlink was removed and never staged):
**exit 0, 48 files, 1467 tests passed**, 6.06 s. That equals the wave baseline. The proof was not
collected: it is a `.js` under `tools/`, which matches neither `*.test.*` nor `*.spec.*`.
`git diff --name-only e57da89...HEAD -- src/` is empty.

## Shell and dynamic code

- `git grep` for `shell|execSync|exec(|eval(|new Function` in `tools/grugops/` at HEAD matches
  only comment text (the wrapper's SECURITY comment, and a comment in `uat-spec-integrity.js`).
- The proof's 17 new rows use `spawnSync(process.execPath, [WRAPPER, n, process.execPath, "-e",
  <constant>])`. That is an argv array with no shell. The `-e` source is a constant built from
  `JSON.stringify(MARKER)`, and no external string reaches it.

## Probe hygiene

- No process of mine was left alive: a `ps` check for `vitest`, `run-bounded` or `hang-fixture`
  at the end found none.
- One foreign process, `node …/scratchpad/variants/offbyone/run-bounded.proof.js`, was seen
  mid-hop under the shared session scratchpad. It is not mine, most likely QE's parallel mutant
  run, and it was not touched. It was gone by the final check.
- The project's deploy guard refused three harmless command forms: a `git show … > file`
  redirect, a `$(…)` substitution and `$?`/`${PIPESTATUS}`. I worked around each one without
  changing what was measured. The unfixed copy was re-created from the printed blob and verified
  by blob hash.
