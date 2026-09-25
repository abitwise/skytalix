---
id: 20260925T142200Z-software-engineer-decision-abc122-k3-mock-driven-chain-no-door-k4-process-group-wrapper-60s-621c1465
kind: decision
by: software-engineer
at: 2026-09-25T14:22:00Z
verified_by:
confidence: high
refs:
  - ABC-122
  - ABC-081
  - ABC-042
  - ABC-078
  - wave-2026-09-25
  - ticket-to-pr-ABC-122
  - plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
  - src/search.capacity.test.ts
  - src/engine.capacity.test.ts
  - tools/grugops/run-bounded.js
  - tools/grugops/run-bounded.hang-fixture.js
  - tools/grugops/run-bounded.proof.js
  - src/search.test.ts
  - src/engine.test.ts
  - src/cli.test.ts
supersedes:
---

# ABC-122 build decisions: K3 through the real APIs with mocked collaborators (zero production lines), K4 as a process-group wrapper at 60000 ms, and the proof kept outside the lane

Hand-authored and unsealed, which is the degraded posture `AGENTS.md` records. Branch
`grugops/ABC-122-gate-hardening`, code commit `43565e7`, from `66a45d1`.

## D1 — K3 seam: mock two collaborators in-file; add NO test door

**Chosen.** Each new test file mocks two collaborators, in that file only:
- `legalMoves`, to return the first legal move only;
- `zobristKeyAfterMove`, to return a fresh key on every call.

With branching 1, the real shipped `search(position, 200)` and `chooseMove` walk one line from
the start position, and the only thing that can stop it at ply 128 is the capacity guard. A probe
ran the first-move line to ply 210: no mate, no stalemate, still in progress at ply 128. Unique
keys mean nothing repeats and no table probe hits.
- **Spies.** The write spy is the `zobristKeyAfterMove` call count: exactly one call per
  `keys[ply + 1] =` write. The node spy is `search()`'s own `nodes`, and for the engine it is
  `repeatsInPath`, which is called at every full-width node entry with its ply.
- **Oracle.** The return value is checked against an independent replay: the same line walked to
  ply 128 by hand, then `quiesce` with a full window.
- **The root depth guard stands and is irrelevant here** (depth 200 ≥ 1). The ticket says to
  neither rely on it nor alter it, and this does neither.

**Rejected: a `TEST-ONLY` door export in each file** (`searchNodeAtPly` / `engineNodeAtPly`,
built and run first). It turned two EXISTING rows red:
- `src/search.test.ts` "exports exactly the search core…" (an exact `Object.keys` list);
- `src/engine.test.ts` `A4` "exports … nothing that takes a depth".

Keeping them green would have meant editing those files, and `A11`'s `src/` fence does not cover
them. The engine row is also a real contract (`RISK-002`: the engine takes no depth). A door that
takes `remaining` breaks it even as a test door. The doors were reverted and never committed.

**Consequence:** the delivered `src/` diff has **zero production lines**. `src/search.ts` and
`src/engine.ts` are byte-identical to `66a45d1`, so `A10` holds by construction. It also means
the UAT waiver criterion (zero production lines under `src/`) now comes back EMPTY for `src/`.
`package.json` and `tools/` are outside that grep, and that is the Orchestrator's to read.

## D2 — K4 wrapper: `detached` process group + `process.kill(-pid, "SIGKILL")`, exit 124

- `spawn(command, args, { stdio: "inherit", detached: true })`. There is no shell and no string
  interpolation (the ASVS firing threshold is not met). The child leads a new process group.
  On timeout, the whole group gets SIGKILL and one stderr line names the bound and the command.
  Exit **124** (GNU `timeout(1)`'s number).
- Pass-through: otherwise the command's own code is returned, or `128+n` for a signal the wrapper
  did not send. Exit `2` means it could not run.
- SIGINT and SIGTERM are forwarded to the group. Detaching takes the group off the terminal
  foreground, so without the forward a Ctrl-C would orphan vitest.
- Stated limits:
  - A grandchild that calls `setsid` or makes its own group escapes.
  - On Windows (`win32`) the fallback is `child.kill()`, direct child only. It was not exercised.
- `node:` built-ins only: `child_process`, `os`, `timers`.

## D3 — `A4`'s constant: **60000 ms**

Median default-lane wall **7.45 s**: n = 7, range 7.16–7.88 s, 47 files, 1446 tests, 1-minute
load average 13.6–23.5 (`raw-out-lane-wall.txt`). 5× the median is 37.3 s. **60 s = 8.1×**, and
it is ≤ 120 s. The headroom is for a machine loaded even worse than this. It is stated in
`tools/grugops/run-bounded.js`'s header. JSON cannot carry a comment in `package.json`.

## D4 — the `A3` proof lives in `tools/grugops/run-bounded.proof.js`, OUTSIDE the lane

`A12` fixes the lane's additions at "exactly 2 new test files, both under `src/` (`A6`/`A8`'s)".
A third test file for the wrapper would break that. So would a wrapper test folded into a
capacity-guard file, which would also be misplaced. This is the same reasoning and the same
shape as `tools/grugops/lane-inventory.js`. The proof is committed, exits 0/1, and is run by hand:
`node tools/grugops/run-bounded.proof.js`.

**The other reading, named rather than picked silently:** `A3` says "a committed test" and the
page's `N8-SPAWN` line says spawn is "engaged", which could mean the proof was meant to run in
the lane. If the Orchestrator reads it that way, it conflicts with `A12`'s count, and that is a
BA/PM re-cut, not a build call.
