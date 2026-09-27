---
id: 20260926T205300Z-software-engineer-decision-02e24867
kind: decision
by: software-engineer
at: 2026-09-26T20:53:00Z
verified_by:
confidence: high
refs:
  - ABC-123
  - ABC-122
  - ticket-to-pr-ABC-123
  - wave-2026-09-25
  - tools/grugops/run-bounded.js
  - tools/grugops/run-bounded.proof.js
  - plans/tickets/ABC-123-run-bounded-timeout-ceiling-and-stale-header.md
  - .grugops/context/wave-2026-09-25/notes/20260927T001000Z-orchestrator-decision-8c8aa8a9.md
  - .grugops/context/secnfr-ABC-122/notes/20260925T151300Z-security-nfr-decision-abc122-pass-with-accepted-risk-n8lane-met-k3-k4-closed-2749a2e6.md
supersedes:
---

# ABC-123 build decisions: one upper-bound clause in the existing guard (R2), header prose for R3, proof rows in the existing `row(...)` style

Hand-authored and unsealed. This is the degraded posture `AGENTS.md` records: no `context-io.ts`
and `human_admission` is `off`. Branch `grugops/ABC-123-run-bounded-r2r3`, from `e57da89`.

## D1: R2 is one more clause on the existing validation `if`

- `const MAX_TIMEOUT_MS = 2 ** 31 - 1` sits beside `TIMEOUT_EXIT`, with two comment lines naming
  why: Node clamps a larger delay to 1 ms.
- `timeoutMs > MAX_TIMEOUT_MS` is added to the same `if` that already rejects the other bad
  values. The failure shape is unchanged: exit 2, the same usage line, `process.exit` before
  `spawn`.
- The clause checks the parsed number, not the string. So `9007199254740993`, which parses to
  `9007199254740992`, is rejected like the other two values.
- The existing lenient parsing is not tightened (`1e3`, `0x3e8`, `" 1000 "` and so on). That is
  the ticket's own fence.
- The `if` is written over six lines. On one line it would be 108 characters, and the repo's
  formatter width is 100. Biome does not cover `tools/`, so this is style, not a gate.
- The Contract comment's `exit 2` line now names the ceiling. That comment belongs to R2's
  behavior change, not to R3.

## D2: the R3 wording (the ticket's DoR item 10 left this to this hop)

- **Status paragraph.** "NOT YET WIRED IN" and the "line is held until the ruling" sentences are
  replaced by: wired in since `ABC-122` `A4`, the exact `test` script line, and `src/cli.test.ts`'s
  `SCRIPTS_AT_HEAD` pin. The two delivery readings are kept, dated to `ABC-122`: 47/1446 green, and
  exit 124 at 60.23 s against the reverted root guard.
- **Process-model paragraph.** It says:
  - `detached: true` calls `setsid()`, so the child leads a new session, not merely a new process
    group. It also leads a process group whose id is its pid, which is what `kill(-pid)` targets.
  - A new session has no controlling terminal. That is the real reason Ctrl-C does not reach the
    tree. The old text said "off the terminal's foreground".
  - SIGINT and SIGTERM are forwarded. SIGHUP and SIGQUIT are not. This states what the code does
    and changes none of it.
  - A new bullet names the session as why `ABC-122`'s R1 exists (accepted risk, owner Olger
    Oeselg). It lists the stops that leave the tree unbound: SIGKILL to the wrapper, a supervisor's
    SIGKILL to the wrapper's group, and SIGHUP/SIGQUIT. It ends with the operating rule: Ctrl-C or
    SIGTERM, never SIGKILL. That rule is already `AGENTS.md`'s.
- **Not reopened:** R1 itself. No signal forwarding was added.

## D3: proof rows go in the existing `run-bounded.proof.js`, not a new file

- There are 16 `N` cases plus one no-argument case. Each runs `spawnSync(node, [WRAPPER, N, node,
  -e, <print marker>])`.
- **Rejected** means: exit 2, AND stderr byte-equal to the usage line, AND an empty stdout.
- **Accepted** means: exit 0, AND stdout equal to the marker, AND an empty stderr. An empty
  stderr also rules out a TimeoutOverflowWarning at the boundary.
- A3's cases are rows in the proof, not a one-off delivery run, so the boundary stays checkable
  each time the proof is run.
- **The limit, stated.** An empty stdout alone cannot tell "never spawned" from "spawned and killed
  before it printed". On the unfixed wrapper stdout was empty too. The discriminators are exit 2
  plus the usage-only stderr, which only the pre-`spawn` branch emits. A separate `spawn()`-count
  probe also exists (observation `35a5af66`), but it was run once and is not committed.
