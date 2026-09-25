---
task: wave-2026-09-25
subtask: amend-abc122-a4-pin
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (scope amendment on a build stop)
ticket: plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
ref: .grugops/context/amend-abc122-a4-pin/
stop_ref: .grugops/context/ticket-to-pr-ABC-122/notes/   (claim 7883fd4a — the A4 stop)
enqueued_by: orchestrator
enqueued_at: 2026-09-25T21:30:00Z
branch: grugops/amend-abc122
base: grugops/ABC-122-gate-hardening @ 4f3e1c0 (the build; its ticket page carries § Delivery)
---

# Subtask: rule the `ABC-122` `A4` stop — widen `A11` by the one pin, or re-cut `A4`

The Engineer stopped on `A4`: pointing `package.json`'s `test` at the wrapper
(`"test": "node tools/grugops/run-bounded.js 60000 vitest run"`) reds `src/cli.test.ts:1661`
(`ABC-042` `A10`), which pins `scripts.test` to `"vitest run"`. `A11`'s file fence forbids that
edit. A two-line patch (the `package.json` line + the matching pin) was measured green (47 / 1446)
and reverted.

The Orchestrator's recommendation: **widen `A11` by exactly that one pin**, re-pointing it to the
wrapped command — the pin's purpose (`ABC-042` `A10`: the test script is what `AGENTS.md` says it
is) survives, and `A4` is the ticket's core. Say whether the pin should assert the whole wrapped
string or the wrapped command plus the bound. Re-cutting `A4` instead leaves K4 open, which is the
ticket's reason to exist; rule it out explicitly if you do not choose it.

Also record on the ticket page (not scope changes, facts for downstream):
- The `*_DEEP` lanes must not go through `npm test` (`ENGINE_DEEP` ≈ 98.7 s > the 60 s bound) —
  owed to the Scribe's `Test (all)` follow-up.
- `lane-inventory.js` exits 1 on a tracked `.grugops/context/ruling-abc079-oracle/probe/vt/oracle.test.ts`
  (since `b324cb6`) — pre-existing, not this ticket; name it for QE.

## Fences
No `src/`, `package.json`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never
merge; never push. Own `git worktree` under `.claude/worktrees/`; commit messages via a scratchpad
file and `git commit -F`.

## Publish
The ticket amendment, a trace row, a `decision` note under `ref:`. Queue pending → claimed → done
per Workflow 17. Report: the ruling in one line, the amended `A4`/`A11` text, DoR, sha, numstat.
