---
subtask: bapm-rule-QE-192
role: ba-pm
tickets: [ABC-192]
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-192/
width: 2 (beside qe-ABC-193)
---

# BA/PM (records only): rule QE-192-a (LOW) and QE-192-b/-c/-d (INFO) from ABC-192's QE gate. ABC-192 is merged; this gates nothing

## Read first
- QE verdict and gap register `.grugops/context/qe-ABC-192/notes/20261021T175649Z-qe-e2e-decision-21079de0.md`, mutants `…5eac2736`; the `## QE` section on ABC-192's page.
- SE design `.grugops/context/ticket-to-pr-ABC-192/notes/…8fd17c58`; your own `bapm-rule-QE-176` notes (`…73efba41`); ABC-173's page (A4–A6, "never runs uncapped"); `tools/grugops/heap-guard.js`.

## Do
- For each of QE-192-a (a `try/catch` around `setup`'s guard call survives every gate and the run is no longer stopped — against ABC-173's "never runs uncapped"; QE's suggested closure: A1 also requires the call to be a direct statement of `setup`'s body), QE-192-b (shadowing `process` inside `setup`; QE recommends accept), QE-192-c (row fails on equivalent refactors), QE-192-d (A2 reads only vitest's `package.json`): rule **cut** (sized, DoR-scored, measured at base on a scratch copy outside the repository where you can), **fold**, or **accept** (reason, owner, trigger).
- One `_Updated:` line at the top of `plans/board.md`; any new card in its column. Next free id: ABC-194.

## Fences
- Only `plans/` (board, any new ticket page, a dated line on ABC-192's page if needed) and your notes. No `src/`, `tools/`, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config. Commit nothing. A QE agent works in `../wt-qe-ABC-193`; touch nothing of theirs.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-192`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line. Put it in your done record (`.grugops/queue/done/bapm-rule-QE-192.md` + `.claim.md`, main's tree, uncommitted).

## Result (ba-pm, 2026-10-21T18:04:38Z): **QE-192-a is CUT → `ABC-194` (Ready, XS, P3, DoR 10/10). QE-192-b, -c and -d are ACCEPTED, each with an owner and a reopen trigger. Ready 0/8 → 1/8. Next free id: ABC-195.**

Records only, uncommitted on `main` (`7a2ec8bc` at start and finish). Notes in `.grugops/context/bapm-rule-QE-192/notes/`, sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` with this checkout's `.grugops/context` passed explicitly; all three read back through `readContext`:
- `20261021T180416Z-ba-pm-decision-09a201ba`: the ruling per gap;
- `20261021T180416Z-ba-pm-observation-027683e7`: the cut readings (parser prototype over base's heap-guard.js and 18 builds; peer pin; no coverage on any capture path);
- `20261021T180416Z-ba-pm-observation-8bf6d742`: the files touched.

| gap | ruling |
|---|---|
| QE-192-a (LOW) | **CUT → ABC-194.** `guardStreamFaultOf` also requires the `guard(…)` call to be a direct statement of `setup`'s body and `setup` to hold no `return`. The plant table grows 5 → 9; no new row (1994 stays). Measured: base green. try/catch, `if (false)`, an uncalled arrow, `return;` and two `HEAP_GUARD_OFF` off-switches (missed by the merged check too) are all red. Cut, not accepted, because the cost is the owner's 2 GB cap, silently (`ADR-0008`: "never runs uncapped"). |
| QE-192-b (INFO) | **ACCEPT.** The shadow is deliberate, and a parser view cannot resolve bindings, so closing one spelling leaves the class open (a `guard` shadow survives too, measured). Owner: QE/E2E on any `heap-guard.js` diff. Reopen: a new `process`/`globalThis`/`guard` binding there, or a refused capture that prints an integer. |
| QE-192-c (INFO) | **ACCEPT.** A pin fails closed; ABC-194 widens that (block, `void`, `\|\| 0` now red, measured). Owner: the refactoring hop's builder updates the row in the same diff; QE re-checks M4, M4b and try/catch. Reopen: the check is loosened to land a refactor without those three. |
| QE-192-d (INFO) | **ACCEPT.** `@vitest/coverage-v8` 4.1.11 peers `vitest` 4.1.11 exactly, and coverage is on no capture path. A manifest bump reds at install. The bundle/manifest drift needs a hand edit. A lockfile reader is weaker (QE). npm's refuse-or-warn on the peer is `UNKNOWN - verify`. Owner: the hop bumping any vitest-family package. Reopen: coverage joins the `test`/capture line, or coverage-v8 is bumped apart from vitest. |

Files: `plans/tickets/ABC-194-a-try-catch-or-an-off-switch-around-setups-guard-call-lets-an-uncapped-run-through.md` (new); `plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md` (+2 lines, a dated ruling block); `plans/board.md` (one `_Updated:` line; the ABC-194 card in Ready, WIP 1/8). Not touched: `src/`, `tools/`, `AGENTS.md`, `memory-bank/`, `plans/traceability.md` (the row is below, for the Orchestrator), `../wt-qe-ABC-193`, the pending file, the claim directory, git config. No stop.

### Trace row (10 cells, header order)

| ABC-192 (BA/PM QE-192 ruling) | ruled QE-192-a CUT into ABC-194 (ABC-192's call-site check also requires a direct statement and no return in setup; try/catch, if (false), uncalled arrow, return and two HEAP_GUARD_OFF off-switches go red, base green), QE-192-b ACCEPTED (deliberate shadow; no binding resolution; owner QE on heap-guard.js diffs), QE-192-c ACCEPTED (pin fails closed; the refactoring hop updates the row), QE-192-d ACCEPTED (coverage-v8 peers vitest 4.1.11 exactly, off the capture path; manifest bump reds at install) | — | — | QE-192-a, QE-192-b, QE-192-c, QE-192-d; ADR-0008; ABC-173; SEC-173-1; N8_SPAWN 28; notes …21079de0, …5eac2736, …8fd17c58, …09a201ba, …027683e7, …8bf6d742 | main @ 7a2ec8bc (uncommitted, records only)<br>plans/tickets/ABC-194-a-try-catch-or-an-off-switch-around-setups-guard-call-lets-an-uncapped-run-through.md, plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md, plans/board.md | — (records only; parser prototype at 7a2ec8bc on a scratch copy: base green, 14 shapes red under the tightened check vs green under the merged one, both shadows green; plant table merged [F,T,T,T,T,F,F,F,F] vs tightened [F,T×8]) | — (ABC-194 expects the waiver: 0 production lines) | — | ABC-194 cut → Ready (XS, P3, DoR 10/10; Ready 0/8 → 1/8); ABC-192 stays Done |
