---
task: wave-2026-09-19
subtask: security-ABC-034
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md (per-ticket review at `In Security/NFR`)
ticket: plans/tickets/ABC-034-rejections-that-teach.md
ref: .grugops/context/security-ABC-034/
build_ref: .grugops/context/ticket-to-pr-ABC-034/
qe_ref: .grugops/context/qe-ABC-034/
enqueued_by: orchestrator
enqueued_at: 2026-09-19T20:00:00Z
branch: grugops/security-ABC-034
base: grugops/wave-2026-09-19 (build 6ee7cde + QE ee97935 merged; lane 42 / 1291 / 0)
---

# Subtask: Security/NFR review of `ABC-034` — the ticket's own threshold fired (a second `src/` file touched)

QE PASSED the build at `ee97935`. The ticket page's security clause says a review fires when the
diff touches a `src/` file beyond `src/rejection.ts`/its test; `src/move-input.ts` (+10/−11, one
call site) did. Read the ticket's security/NFR section, the Engineer's notes (`build_ref:`), QE's
`decision` note and its "For Security/NFR" list (`qe_ref:`), then the diff
`git diff 4f0ef01 6ee7cde -- src/`.

## Review
- **The sink.** User text reaching a rendered sentence: QE measured only `text.trim()` of SAN the
  reader ACCEPTED, bounded at 7 chars + one check suffix, into `src/frame.ts:202`. Verify that
  bound yourself from the regexes in `src/san.ts` and the classifier; confirm no raw line reaches
  the frame from this path; confirm no direct stream write in `src/rejection.ts`. Escape bytes:
  the `ABC-018` bar (no escape byte from third-party/user text reaches the terminal) — does a
  sentence built from an accepted SAN token ever carry one? Probe, do not reason.
- **NFR-003 one-derive claim (QE G3).** `src/rejection.ts` imports `legalMoves` directly; the
  `ABC-033` `A5` spy cannot see it. Measure: how many `legalMoves` calls per rejected prompt now,
  vs. before the build? If > 1, that is a real NFR-003 charge — state it with the number; the
  fix (pass the list, do not re-derive) is the Engineer's on a re-hop, not yours.
- **NFR-002 per-frame path** — does any classifier work run on the per-FRAME path, or only on
  the rejected-prompt path? Measure, cite the call graph.
- **Dependencies**: `package.json` unchanged (verify byte-identical vs `main`).
- **ASVS L1** items the change plausibly touches (input handling, output encoding) — answer each
  with a probe or "not applicable, because".
- **NFR-008**: DO NOT rule it. Two readings under load ≥ 7 were handed up as non-conforming; the
  quiet re-measure is a separate hop. You may note whether this ticket's +215 ms gross / +55 ms
  net N8-LANE figure was measured to the protocol.

## Output
A result with **required fixes** (blocking, with the probe that proves each) and **accepted
risks** (each with an `AR-` id, owner, re-check trigger) — the project's existing shape (see
`AR-1`, `AR-N8SPAWN-DRIFT` in `plans/nfr-catalog.md`). Verdict: PASS / PASS-WITH-AR / FAIL.

## Fences
- Zero files under `src/` in your final diff; every probe reverted. Do not touch `plans/board.md`,
  `AGENTS.md`. `plans/nfr-catalog.md` only to add an `AR-` row if you accept a risk.
- No merge, no deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED scratchpad file
  and `git commit -F`; probes through node scripts (hook refuses `$?`, `npm run`, heredocs).

## Publish
Verdict as a `decision` note, probes as `observation` (no `finding` admissible), trace row, ticket
page § Security/NFR. Claim by hand per Workflow 17: `mkdir .grugops/queue/claimed/security-ABC-034`,
move this file in, then out to `done/`. Report: verdict, required fixes, ARs, the NFR-003 call
count before/after, sha, numstat.
