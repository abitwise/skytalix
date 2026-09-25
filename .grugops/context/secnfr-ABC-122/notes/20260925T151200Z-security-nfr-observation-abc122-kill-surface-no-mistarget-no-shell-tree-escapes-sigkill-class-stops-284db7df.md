---
id: 20260925T151200Z-security-nfr-observation-abc122-kill-surface-no-mistarget-no-shell-tree-escapes-sigkill-class-stops-284db7df
kind: observation
by: security-nfr
at: 2026-09-25T15:12:00Z
verified_by:
confidence: high
refs:
  - ABC-122
  - ABC-081
  - secnfr-ABC-122
  - tools/grugops/run-bounded.js
  - tools/grugops/run-bounded.hang-fixture.js
  - tools/grugops/run-bounded.proof.js
  - package.json
  - src/search.capacity.test.ts
  - src/engine.capacity.test.ts
  - .grugops/context/qe-ABC-122/notes/20260925T225000Z-qe-e2e-observation-abc122-hostile-cases-mutants-gates-a11-base-8f1c4d02.md
  - .grugops/context/secnfr-ABC-081/notes/20260925T124400Z-security-nfr-observation-abc081-table-bounded-key-verified-moves-legal-capacity-guard-unreached-k4-low-80a49b24.md
  - .grugops/context/secnfr-ABC-122/notes/raw-harness-probes.mjs.txt
  - .grugops/context/secnfr-ABC-122/notes/raw-out-probes.txt
  - .grugops/context/secnfr-ABC-122/notes/raw-out-probes-run1-marker-bug.txt
  - .grugops/context/secnfr-ABC-122/notes/raw-harness-escape.mjs.txt
  - .grugops/context/secnfr-ABC-122/notes/raw-out-escape.txt
  - .grugops/context/secnfr-ABC-122/notes/raw-harness-pty.py.txt
  - .grugops/context/secnfr-ABC-122/notes/raw-out-pty.txt
supersedes:
---

# ABC-122 kill surface (ASVS L1, block on high): no mis-targeted kill, no shell, the exit codes hold. One new LOW: a SIGKILL-class stop of the wrapper leaves the test tree running with no bound

Hand-authored and unsealed. The subject is `tools/grugops/run-bounded.js` at `ca9f42d`. It is
unchanged at `9db8f2a`. It was read in full and probed on an arm-A copy (`git archive`, outside the
repo). Every probe ran under its own outer bound, and every survivor was killed and reported. At the
end of this hop, `ps` showed no `run-bounded`, fixture or `vitest` process of mine.

## 1. Kills a process that is not its own (pid reuse, group mis-targeting): **none found**

- **Target.** The wrapper signals only `-child.pid`. `detached: true` makes the child leader of
  its own group, distinct from the wrapper's. Measured: child `pid = pgid = 66552`, wrapper
  pgid 66551. Also measured: libuv's `detached` is `setsid()`, not only `setpgid`. The child shows
  STAT `Rs` on a real pty, which marks a session leader.
- **Pid reuse.** A pid, or a pgid still in use, cannot be reused while the child is unreaped.
  - The wrapper clears the timer and calls `process.exit` synchronously inside the `exit`
    handler.
  - libuv emits `exit` from the same loop turn in which it reaps, so no JS runs between the reap
    and the exit.
  - **So there is no window in which a reused pid is signalled.**
- **Errors.** `ESRCH` is swallowed; any other errno is rethrown. The one other errno possible is
  `EPERM`, when every member of the group belongs to another uid. That would crash the wrapper
  with exit 1 and leave the tree running. It is not reachable for a same-uid `vitest`.
  Informational.
- **Not a regression, not charged: a grandchild left behind on a normal exit.** When the child
  exits 0 but leaves a grandchild in its group, the wrapper returns 0 and the grandchild lives on.
  Measured: `grandchildAliveAfter: true`. Plain `vitest run` behaved the same way before this
  change.

## 2. Arguments and shell interpolation (ASVS **V1.2.5** [L1]): **PASS, measured**

- `spawn(command, args)` receives an argv array. There is no `shell` option anywhere in the three
  files (grep), and the ticket's firing threshold is not met.
- Probe: the argument `x; touch M; $(touch M) \`touch M\` | touch M` was echoed back
  byte-identical. The marker file M was **not** created.
- Probe: a whole command line passed as argv[0] (`"touch M"`) gives exit 2 with `ENOENT`. It is
  never split by a shell.
- QE's hostile case 5 (spaces and quotes) is consistent with this.
- The command is fixed by `package.json`: `vitest run` plus the arguments `npm test -- …`
  forwards. No external or player input reaches it.

## 3. Signal forwarding: **SIGINT and SIGTERM clean. SIGHUP, SIGQUIT and SIGKILL escape. This is the one new risk**

Each row: the wrapper runs at a 4 s bound around the hang fixture (fixture plus grandchild), and
the signal is sent 300 ms after the fixture reports its pids.

| stimulus | wrapper | tree 500 ms later | 5 s later (past the 4 s bound) |
|---|---|---|---|
| SIGINT → wrapper | exit 130 | gone | — |
| SIGTERM → wrapper | exit 143 | gone | — |
| SIGTERM → the wrapper's **group** (outer supervisor) | exit 143 | gone | — |
| **SIGHUP** → wrapper | killed by SIGHUP | **fixture + grandchild alive** | **still alive** |
| **SIGQUIT** → wrapper (Ctrl-\\) | killed by SIGQUIT | **alive** | **still alive** |
| **SIGKILL** → wrapper | killed | **alive** | **still alive** |
| **SIGKILL** → the wrapper's **group** (outer supervisor) | killed | **alive** | **still alive** |

**On the real `npm test`,** with GNU `timeout -s KILL 2` as the supervisor (it signals its own
process group):
- arm B (`vitest run`, before this change): **0 survivors**;
- arm A (wrapped): **the `vitest` leader survived**, reparented to pid 1, in its own group
  (`raw-out-escape`).
- In the first run, stdout was piped. The supervisor's caller returned at **5 078 ms** in arm A
  against **2 040 ms** in arm B, because the escaped `vitest` held the pipe open and ran to
  completion. That is the same fact seen from outside.

**On a real controlling terminal** (`pty.fork`, `raw-out-pty`):
- `npm test` runs to exit 0 in both arms;
- a real Ctrl-C keystroke gives exit 130 with 0 survivors in both arms, because the wrapper's
  forwarding does its job;
- closing the terminal with a green lane left 0 survivors in both arms.
- **The case of closing the terminal during a HANG is `UNKNOWN - verify`.** The probe for it
  matched its own shell's command line in its cleanup filter and killed that shell after the
  control case. The attempt is recorded, not retried. The direct-SIGHUP row above is the
  measured stand-in.

**Reading.**
- **Why it happens.** The child is in a new session, so nothing aimed at the wrapper's group
  reaches it. Only what the wrapper forwards does, and the wrapper forwards SIGINT and SIGTERM
  only. Once the wrapper itself dies, its 60 s timer dies with it.
- **What it costs.** For a green or red lane, the orphan finishes on its own in about 5 s. For
  the hang class K4 exists to catch, it is **an unbounded CPU-burning orphan**.
- **It is a regression the wrapper introduced.** Before this change, a supervisor's group kill
  took `vitest` down.
- **Severity: LOW, with a stated reason.** No ASVS L1 requirement fails. The failure is *closed*:
  the supervisor still reports a failure, never a false green. It needs a SIGKILL-class stop AND
  a hang. It is local-only (`ADR-0007`).
- **What can be fixed.** Forwarding SIGHUP and SIGQUIT closes 2 of the 4 paths, by adding two
  names to the wrapper's signal list. The SIGKILL paths cannot be closed from inside the wrapper,
  so that part is a residual to accept.
- **Operational note for every hop:** stop `npm test` with SIGTERM first. SIGTERM is forwarded
  and measured clean.

## 4. Exit-code mapping: **as documented**

| case | exit |
|---|---|
| the child exits 0 / 7 | 0 / 7 |
| the child exits 124 on its own | 124, **the same number as a timeout** (the stderr line tells them apart; GNU `timeout` has the same property). Informational |
| the child dies of its own SIGABRT / SIGBUS | 134 / 138 (128 + n) |
| the bound is crossed | 124 (build, QE and proof) |
| SIGINT / SIGTERM forwarded | 130 / 143 |
| missing command, or no arguments | 2, with a usage line or `could not start … ENOENT` |

## 5. Malformed `N`

- **Rejected with exit 2:** `""`, `0`, `-5`, `abc`, `1.5`, `NaN`, `Infinity`, and a missing `N`.
- **Accepted as 1000**, because `Number()` is lenient: `1e3`, `0x3e8`, `" 1000 "`, `1000.0`,
  `0b1111101000`. They are all a positive integer number of ms, so this is harmless.
  Informational.
- **Found: `N` > 2 147 483 647 is accepted.** Node then prints `TimeoutOverflowWarning` and sets
  the timer to **1 ms**. The healthy target is killed at once, with exit 124, measured at
  2147483648, 99999999999 and 9007199254740993.
  - **The failure is closed:** a false red, never a hang or a false green.
  - It is unreachable with the committed 60000, and `A4` caps `N` at 120 000.
  - **LOW.** Fix at the next touch by adding `timeoutMs > 2147483647` to the usage check.

## 6. The rest of ASVS L1 on `0bc31e1...ca9f42d -- tools package.json src`

| requirement | result | evidence |
|---|---|---|
| V1.2.5 [L1] OS command injection | PASS | section 2, measured |
| V1.3.2 [L1] dynamic code | PASS | no `eval`, `new Function` or `exec*` in the three tool files. The two test files use only `vi.mock` / `importOriginal`, and `isolate` stays `true` in `vitest.config.ts`, so the mocks are file-scoped. The build and QE mutant runs agree: each mutant turns red only its own row, and 1 445 other tests stay green |
| V2.2.1 [L1] input validation | PASS, with the LOW in section 5 | `N` is validated as a positive integer, but not against the timer's 2^31 − 1 ceiling |
| V15.2.1 [L1] components | PASS | `package-lock.json` has 0 lines changed. `package.json` changes only `scripts.test`, and no dependency is added |
| all other L1 chapters (HTTP, files, auth, sessions, tokens, OAuth, crypto, logging, deployment) | n/a | there is no such surface. `src/cli.ts` and every player-reachable input path are unchanged, and `src/search.ts` / `src/engine.ts` have 0 lines changed |

**Findings at high: none. No ASVS L1 requirement fails.** The LOW items are in the decision
note.

## Probe honesty

- The first probe run's survivor filter missed the fixture's grandchild, because its command line
  contains spaces that the marker lacked. Four grandchildren were orphaned; I found them with `ps`
  and killed them by pid. The filter was fixed and the probes re-run; `raw-out-probes` is the
  re-run.
- `raw-out-probes-run1-marker-bug` is kept, not hidden. Its readings agree with the re-run except
  that the grandchild is not listed.
- Every kill a probe made itself checks the target's command line first, so a reused pid is never
  hit. The one exception is the pty hang probe above, which was abandoned.
