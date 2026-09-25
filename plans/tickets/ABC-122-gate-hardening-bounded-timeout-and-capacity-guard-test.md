---
id: ABC-122
title: Gate hardening — a bounded-time test command (K4) and a direct capacity-guard test (K3)
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-004
feature: —
---

# ABC-122 — close two named gaps from `ABC-081`'s gate before `ABC-121` touches the recursion

> **Cut 2026-09-25 by BA/PM** (task `wave-2026-09-25`, subtask `cut-abc122-gate-hardening`,
> Workflow 07), on the owner's word, verbatim: *"go, cut the hardening ticket and run it
> through"*. Bundled as **one** `S` ticket rather than two tickets, on the Orchestrator's
> recommendation, because both are small, disjoint-file, gate-reliability fixes traced to the
> same gate hop and the same owner instruction to land them together, before `ABC-121` (PVS +
> LMR) rewrites the recursion where the hang class lives.
>
> **Source: `ABC-081`'s own gate, not re-derived.** QE's verdict
> (`.grugops/context/qe-ABC-081/notes/…-d4e6a1b7.md`) named both gaps under its own
> `K3`/`K4` mutant ids. Security/NFR's follow-up
> (`.grugops/context/secnfr-ABC-081/notes/…-80a49b24.md`) rated both **LOW** (no live
> exposure, no ASVS finding) and split the ownership: K3 to the Software Engineer at the next
> licensed touch of `src/search.ts`; K4 (the wrapper) to the Orchestrator, adopted in principle
> by the owner (`…aa98a05d` § 3(c)) as a Node-based wrapper, "owed, not built this session."
> **This ticket is that owed work, ticketed.**

## Problem

*User*: every role that runs `npm test` and reads its result — every gate hop, every future QE
and Security/NFR pass — and, behind them, the correctness guard that stops the key array
(`src/search.ts:98` `KEY_ARRAY_CAPACITY = 128`, mirrored in `src/engine.ts`) from being written
past its bound.

*Pain*, two independent gaps, both measured at `ABC-081`'s gate and neither touched since:

1. **K4 — the gate can hang instead of failing red.** `npm test` is a plain `vitest run`
   (`package.json`) with no process-level timeout, and Vitest's own `testTimeout` is a timer
   inside the worker that a synchronous CPU-bound computation never yields to. Both the build
   hop and QE needed `spawnSync`'s own `timeout` option to stop a deliberately-hung mutant
   (reverting the root depth guard, `!(depth >= 1)` in `src/search.ts`) — plain `npm test` does
   not stop it. Security/NFR confirmed: a real regression of this class stalls the gate rather
   than reporting red, rated **LOW** because the failure is *closed* (a hung gate never reports
   a false green) but costs gate availability and diagnosis time.
2. **K3 — the capacity guard itself is untested.** `ply >= KEY_ARRAY_CAPACITY` in both
   `src/search.ts:287` and `src/engine.ts:235` is real code with no direct test. It survives
   every mutant lane today only because the *other*, independently-tested guard (the root depth
   guard, `ABC-081` decision 6a) keeps recursion shallow in practice — Security/NFR measured the
   deepest completed iteration across ~600,000 probed boards at **40**, against a capacity of
   **128**, and rated the guard **defense-in-depth with no live exposure today**. That measured
   safety is exactly why the guard is worth testing directly rather than left to rely on a
   different guard never regressing.

*Value*: a future regression of either guard turns something red, in bounded time, instead of a
silent pass or a stalled machine. Neither gap is a security finding (Security/NFR: no ASVS L1
requirement fails on either) and nothing is broken at `main` today — this is control debt on a
gate the project runs on every hop, closed before the next ticket rewrites the recursion it
guards.

## Scope

1. **K4 — a Node-only wrapper that bounds `npm test`'s wall time and kills the whole process
   tree it spawned.** `node:child_process` + `node:timers` only (no dependency on a `timeout(1)`
   binary — Security/NFR named this: it exists on this machine only via Homebrew, and stock
   macOS has none). `package.json`'s `test` script is changed to invoke the wrapper around
   `vitest run`.
2. **K3 — a direct test of the `ply >= KEY_ARRAY_CAPACITY` guard, in *each* of `src/search.ts`
   and `src/engine.ts`**, independent of the root depth guard standing — i.e. reachable without
   relying on `!(depth >= 1)` / `depth <= 0` being absent. A test-only means of reaching the
   boundary (e.g. an injectable/overridable capacity, or driving the test-only `search()`/
   equivalent API to the boundary directly) is the delivering hop's design call, on the page.

## Out of scope

- **The root depth guard (`ABC-081` decision 6a) itself.** Load-bearing, independently tested,
  not touched. This ticket adds a *second* guard's own test; it does not re-test or alter the
  first.
- **`ABC-121` (PVS + LMR) and any change to the search algorithm.** This ticket lands *before*
  it, per the owner's word, and touches nothing of the recursion's decision logic.
- **`AGENTS.md`'s `### Test` command line.** The Scribe's, in a follow-up pass — named as a
  dependency below, not written here. `npm test`'s underlying behavior changes; the documented
  command line is a separate, deliberately deferred edit.
- **`plans/nfr-catalog.md`, `plans/board.md`, any ADR.** Fenced from this cutting hop; nothing
  here amends `NFR-008`'s level, `N8-LANE`'s wording, or any accepted risk.
- **`ABC-050`, `ABC-105`, `ABC-108`, `ABC-110`, `ABC-118`.** Checked for overlap at this cut:
  none touch a test-command timeout or the key-array capacity guard. `ABC-050` guards
  `vitest.config.ts` itself (a different file, a different failure mode); `ABC-105` detects a
  missing QE note; `ABC-108`/`ABC-110` own the lane's CPU/wall *total*, not its bound-in-time
  behavior; `ABC-118` guards the lane's *inventory*. Disjoint scope, confirmed by reading each
  page's `## Scope` and `## Out of scope` at this cut, not merely by name.
- **A CI job, a pre-commit hook, or any control that is not hand-run.** This project has no CI
  and no git remote (`AGENTS.md` § Deployment posture); `npm test` invoked by hand or by a role
  is the only "when it runs" this ticket assumes, matching every prior tool in
  `tools/grugops/`.

## Acceptance (Given/When/Then)

**K4 — the wrapper**

- **`A1` (bounded, kills the tree, distinct non-zero exit).** **Given** a target command and a
  timeout in milliseconds, **when** the command's wall time exceeds the timeout, **then** the
  wrapper terminates the *entire* process tree it spawned (not merely its own immediate child)
  and exits with one documented, distinct non-zero code, within **timeout + ≤ 250 ms** of
  overhead, printing one stderr line naming both the timeout value and the target command.
- **`A2` (a green run passes through unchanged).** **Given** a command that exits 0 quickly,
  **when** run through the wrapper with a timeout well above its runtime, **then** stdout,
  stderr and the exit code are **identical** to running the command directly (byte-for-byte, on
  a small deterministic command).
- **`A3` (armed proof: the wrapper actually reds on a synthetic hang, demonstrated, not
  claimed — and without adding a hanging test to the default lane).** **Given** a synthetic
  fixture that never exits on its own (a tiny standalone script, not a Vitest test), **when**
  the wrapper runs it with a **short** timeout (≤ 1 s), **then** a committed test asserts: exit
  code equals the wrapper's own timeout code (`A1`), wall time is **≤ timeout + 250 ms**
  (bounded, not "eventually"), and — checked, not assumed — **no process from that spawn is
  still alive** a fixed grace period after the assertion. *The fixture and its wrapper
  invocation run and complete inside this criterion's own short timeout, so this proof does not
  itself hang the lane it is testing.*
- **`A4` (`npm test` is wrapped, with a stated, bounded default).** `package.json`'s `test`
  script invokes the wrapper around `vitest run` (forwarding any further CLI args unchanged).
  The default timeout is a number **N ms**, stated and justified on the delivering page:
  **N ≥ 5 × the median default-lane wall time measured at delivery**, and **N ≤ 120,000** (two
  minutes) so a real hang is diagnosed promptly rather than merely "eventually caught."
- **`A5` (portability stated, not assumed).** The wrapper depends on `node:` built-ins only —
  **no** `timeout(1)`, `pkill`, or any other external binary. The delivering page states the
  Node version and OS the criteria above were run on, and that no platform-specific API (e.g. a
  Windows-only process-group call) was used without a stated fallback.

**K3 — the capacity guard, in each file**

- **`A6` (`src/search.ts`'s guard is exercised directly, independent of the root depth guard).**
  **Given** a test-only means of driving recursion to `ply >= KEY_ARRAY_CAPACITY` that does
  **not** rely on the root depth guard (`!(depth >= 1)` / `depth <= 0`) being absent or altered,
  **when** the guard fires, **then** the function returns a leaf-style score for that node — no
  further recursive call, no key-array write past the declared capacity — asserted directly
  against the return value **and** against a call-count/write-count spy, not inferred.
- **`A7` (mutant on `src/search.ts`'s guard reds `A6`, watched not claimed).** A mutant that
  removes the `ply >= KEY_ARRAY_CAPACITY` condition, or weakens it by one (`>` for `>=`), turns
  `A6`'s test **RED**, demonstrated in the delivering hop's own report, then reverted.
- **`A8` (`src/engine.ts`'s own guard, same shape).** `A6` repeated against `src/engine.ts:235`'s
  independent guard instance.
- **`A9` (mutant on `src/engine.ts`'s guard reds `A8`).** `A7` repeated against `src/engine.ts`.
- **`A10` (production path unaffected).** `KEY_ARRAY_CAPACITY` (and its `src/engine.ts`
  equivalent) is **128** in both files, unchanged, on the delivered diff; the real,
  non-test-seam call path (`chooseMove`, `search()` called as production calls it) is
  behaviorally unchanged — the full existing suite is green at the same test results it had
  before this ticket, plus exactly the rows this ticket adds.

**Both halves**

- **`A11` (the fence, checkable from git).** `git diff --numstat <base>...HEAD -- src/` touches
  only `src/search.ts`, `src/engine.ts`, and the test file(s) this ticket adds under `src/`.
  Any wrapper file is confined to `tools/grugops/`, plus the one line in `package.json`.
  `AGENTS.md`, `plans/nfr-catalog.md`, `plans/board.md` and every ADR are byte-identical.
- **`A12` (gates and lane, reported together).** `npm run lint`, `npm run typecheck` and
  `npm run build` each exit 0. The default lane (run **through** the new wrapper, proving `A4`
  end-to-end) is green, skip count 0, with **exactly 2 new test files, both under `src/`**
  (`A6`/`A8`'s), their added test counts stated. `N8-LANE`'s net CPU charge (2 files ⇒ net of
  320 ms floor, per the standing bar) is measured and reported against the ≤ 650 ms bar.

## Dependencies

- **None blocking.** `ABC-081` is `Done` and merged; `src/search.ts` and `src/engine.ts` carry
  no other in-flight ticket at this cut (checked against `## Out of scope` above).
- **Ordering only, owner-named: before `ABC-121`.** `ABC-121` (PVS + LMR) rewrites the
  recursion both guards live in; landing this first means the new tests exist before that
  rewrite, not after.
- **`AGENTS.md`'s `### Test` line is NAMED OWED to the Scribe once `package.json`'s `test`
  script changes** (`A4`) — the same shape as `ABC-118`'s `AGENTS.md` hand-off under `ABC-109`'s
  byte cap. Not written here; the delivering hop must say so on its own page rather than leave
  the doc silently stale.
- **QE hop owed** before `In Review` is exited (owner's standing rule, 2026-08-17). UAT:
  production lines are expected to be **> 0** (`src/search.ts`, `src/engine.ts`, `package.json`,
  `tools/grugops/`), so the 2026-08-17 zero-production-lines UAT waiver is **not** expected to
  apply — measured from git at the exit, never assumed here.

## Security / NFR triggers

- **`N8-LANE` ≤ 650 ms net CPU, standing bar, 2 new files (net of 320 ms floor).** Both new
  files are under `src/`, matching the bar's scope; reported at delivery against the median of
  paired per-round deltas, n ≥ 7, with an identity null control.
- **`N8-SPAWN` — engaged, and it must be re-derived, not assumed 0.** `A3`'s proof spawns at
  least one child (the wrapper spawning its target) and the wrapper itself is spawned by the
  proof's own harness — the delivering hop states the exact child count `A3` forces and checks
  it against `N8-SPAWN`'s charging test, its four exclusions and its three stops
  (`plans/nfr-catalog.md` § `N8-SPAWN`) rather than assuming the account nets to zero.
- **Security: ASVS L1, ONE real item.** The wrapper spawns a **fixed, developer-specified**
  command (`vitest run`, forwarded args) — never a string built from external or user input, and
  never `shell: true`. **Firing threshold, falsifiable:** any spawn in the delivered diff that
  interpolates an external string into a shell command, or sets `shell: true`. No network, no
  new dependency, no secret, no change to any input path a player can reach (`src/cli.ts`
  unchanged).

## Test notes

1. **`A3`'s fixture is the criterion that decides whether K4 was worth doing.** A wrapper that
   is never watched actually killing a live hang is an assertion of intent, not a demonstration.
2. **`A7`/`A9` are the criteria that decide whether K3 was worth doing**, for the same reason —
   a guard test that cannot be shown red on the guard's own removal proves nothing about the
   guard.
3. **Do not let `A6`/`A8`'s test seam become a second production behavior.** `A10` exists
   because a seam that changes what the *real* call path does would trade one untested guard for
   one contaminated one.
4. **Report which OS/Node combination `A1`–`A5` were exercised on** (Security/NFR's own
   disclosed limit at `ABC-081`'s gate: `timeout(1)` was Homebrew-only on that machine). This
   ticket's whole value is a wrapper that does **not** repeat that assumption.

## Size and priority rationale

**Size `S`.** Two independent, small, disjoint-file fixes: one wrapper script plus a
`package.json` line and one proof test; one guard-exercising test seam repeated across two
files with its own mutant. No new production feature, no algorithm change, no new dependency.
Calibrated against `ABC-050` (also `S`: two config globs, one comment, one assertion, one armed
control) — this ticket has one more moving part (the wrapper) but each part is small and none
touches the search algorithm itself.

**Priority `P1`.** Not `P0`: nothing is broken at `main` today, both gaps are rated **LOW** by
Security/NFR, and the guard the ASVS review actually leaned on (the root depth guard) is
independently tested and standing. Not `P2`: the owner named this ticket explicitly ahead of
`ABC-121` in the same breath as commissioning it (*"go, cut the hardening ticket and run it
through"*, then *"land before `ABC-121`"* on the board's own update line) — an ordering
directive from the owner is a priority signal this page should not smooth over by defaulting to
`P2`.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at this cutting hop,
**2026-09-25**. **Result: 9 of 10 MET, 1 ⚠️ — PULLABLE TODAY.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two independently-sourced, independently-rated gaps, each traced to `ABC-081`'s own gate notes (QE and Security/NFR), neither re-derived; the value (bounded-red instead of a silent pass or a stall) is stated without overclaiming — Security/NFR rated both LOW and nothing is broken today |
| 2 | scope and out-of-scope clear | **✅** two scoped deliverables, seven fences including the root depth guard, `ABC-121`, `AGENTS.md`'s doc line, and the five named tickets checked for overlap and found disjoint by reading their own `## Scope`/`## Out of scope`, not by name alone |
| 3 | INVEST-shaped | **✅** independent of every ticket in flight (checked); the two halves are disjoint in file (K4: `tools/grugops/`, `package.json`; K3: `src/search.ts`, `src/engine.ts`) and bundled into one ticket on the owner's and Orchestrator's explicit instruction rather than BA/PM's default; small; each criterion below is a runnable, falsifiable check |
| 4 | acceptance testable and measurable | **✅** twelve criteria: exact codes and timing bounds for the wrapper (`≤ timeout + 250 ms`), a byte-for-byte green pass-through, an armed RED proof with an orphan-process check, a formula-bounded default timeout (`≥ 5×` measured, `≤ 120 s`), direct-and-mutant-tested guards in both files, a production-path-unchanged check, and a git-diff fence |
| 5 | dependencies known | **✅** none blocking; the `ABC-121` ordering stated as the owner's word, not inferred; the `AGENTS.md` Scribe hand-off named owed rather than silently deferred; the QE hop and the (expected-inapplicable) UAT waiver both stated |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms net CPU for 2 files (standing bar, correctly scoped since both new files sit under `src/`); `N8-SPAWN` flagged as engaged rather than assumed zero, with the check named; security firing threshold falsifiable (shell interpolation / `shell: true`) |
| 7 | test notes present | **✅** four, each naming the criterion that actually decides the ticket's worth (`A3`, `A7`/`A9`, `A10`) rather than restating the acceptance list |
| 8 | size assigned | **✅** `S`, calibrated against `ABC-050` with the one added moving part named |
| 9 | priority assigned | **✅** `P1`, with the not-`P0` and not-`P2` arguments both stated, the latter anchored to the owner's own words rather than BA/PM's judgment alone |
| 10 | no major unresolved blocker | **⚠️ ONE, and it is a DESIGN CALL left open on purpose, not a blocker.** `A4`'s default timeout is a **formula** (`≥ 5× median lane wall`, `≤ 120 s`), not a fixed constant BA/PM can supply today — the "5x" multiplier and the two-minute ceiling are this page's own judgment calls, not measured on this codebase's wrapper (which does not exist yet). **Not smoothed to ✅**: a page scoring 10/10 here would be asserting a number it cannot yet measure. The formula is falsifiable and boundable either way, so it does not block the pull — it is a delivery-time measurement, the same shape `ABC-105`'s own DoR ⚠️ used for a self-authorship ceiling that did not block that ticket either. |

Column moves are the Orchestrator's.

## Delivery

**2026-09-25, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-122`). Branch
`grugops/ABC-122-gate-hardening`, code commit `43565e7` from `66a45d1`. Not merged, not pushed.
Run on macOS 26.5.2 / Node v24.12.0. Readings, mutants and raw files are in
`.grugops/context/ticket-to-pr-ABC-122/notes/`, not restated here.

**PARTIAL: 11 of 12 criteria met. `A4` is HANDED UP.** `package.json` is unchanged, because its
one line reds `src/cli.test.ts`'s `ABC-042` `A10` row, which pins `scripts.test = "vitest run"`.
That file is outside `A11`'s fence. The two-line patch and its reading are in claim `7883fd4a`.

| # | verdict | reading |
|---|---|---|
| `A1` | MET | exit 124; the tree killed with process-group SIGKILL, in 527–536 ms at a 500 ms bound; one stderr line naming the bound and the command |
| `A2` | MET | stdout, stderr and exit byte-identical, direct vs wrapped, for exit 0 and exit 3 |
| `A3` | MET | `node tools/grugops/run-bounded.proof.js` exits 0. The orphan check is ARMED: fixture, grandchild and group seen alive, then ESRCH 250 ms after the exit. The proof reds on a child-only kill and on no kill. It runs OUTSIDE the lane (decision `621c1465` D4). |
| `A4` | **NOT MET — handed up** | Constant chosen: **60000 ms** = 8.1× the median lane wall of 7.45 s (n = 7, load 13.6–23.5); 5× is 37.3 s, and the ceiling is 120 s. Wired temporarily and reverted: the lane was green 47 / 1446, and the reverted root depth guard gave exit 124 at 60.23 s. |
| `A5` | MET | `node:child_process` / `os` / `timers` only. The Windows fallback (`child.kill`, direct child only) is stated and was not exercised. |
| `A6` / `A8` | MET | The real `search(pos, 200)` and `chooseMove` are driven to ply 128 along a single-move line, with `legalMoves` and `zobristKeyAfterMove` mocked in-file. Asserted on the score, the key-write count (= 128) and the node count. No test door: one would red the existing export-set rows (decision `621c1465` D1). |
| `A7` / `A9` | MET | 6 mutants: guard removed, `>` for `>=`, and `>= CAP-1`, in each file. Each reds only its own row; the other 1445 tests stay green. |
| `A10` | MET | `src/search.ts` and `src/engine.ts` are byte-identical to base: zero production lines. 1444 earlier tests green, plus 2 new rows. |
| `A11` | MET | Under `src/`, only 2 new test files (+114, +94). `tools/grugops/` +96 / +18 / +141. `AGENTS.md`, `plans/nfr-catalog.md`, `plans/board.md` and the ADRs are untouched. |
| `A12` | MET | lint, typecheck and build exit 0 through the wrapper. Lane 47 files / 1446 passed, skips 0, skip-integrity `No findings.` Exactly 2 new files, 1 test each. `N8-LANE`: +475 ms gross, ≈ +155 ms net of the 320 ms floor, against 650 ms. The null is +0.66 % (5/8) and the load median is 17, so confidence is medium. `N8-SPAWN`: 0 ms, nothing spawned in the lane. |

**Owed:** `AGENTS.md` `### Test` to the Scribe once `A4` lands (claim `7883fd4a`); a QE hop.
`lane-inventory.js` is red at this tree on a pre-existing tracked file,
`.grugops/context/ruling-abc079-oracle/…/oracle.test.ts`. That is not this ticket's.
