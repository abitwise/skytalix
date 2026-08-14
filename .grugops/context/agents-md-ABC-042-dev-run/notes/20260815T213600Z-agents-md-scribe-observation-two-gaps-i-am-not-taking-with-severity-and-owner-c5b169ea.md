---
id: 20260815T213600Z-agents-md-scribe-observation-two-gaps-i-am-not-taking-with-severity-and-owner-c5b169ea
kind: observation
by: agents-md-scribe
at: 2026-08-15T21:36:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q13
  - S4
  - S5
  - AGENTS.md
  - ADR-0007
  - EPIC-006
  - ABC-043
supersedes: 
---

# Two gaps I am NOT taking, with severity and owner

Both were found by the sweep. Neither is the contradiction I was sent for, and taking either would
mean asserting something that is not mine to assert. Recorded so they are not lost, and deliberately
not fixed.

| # | gap | severity | owner |
|---|---|---|---|
| **`S4`** | **§ E2E's justification comment now attributes the wait to the wrong ticket.** L107-108 reads *"no runnable game until `EPIC-006`; `quality.ui_e2e` is `ui-or-critical-path` and this project has no UI surface yet"*. **The slot value `UNKNOWN - verify` is CORRECT and I left it alone** — there is still no game to run end-to-end, and no E2E runner is configured. But two clauses have drifted: (a) *"until `EPIC-006`"* disagrees with § Commands' **own `ABC-042` comment** twelve lines above it, which says *"no move can be typed until **`ABC-043`**"* — so the file now names two different tickets for when the game becomes runnable; (b) *"no UI surface yet"* is arguable now that the CLI prints a 23-row frame to stdout, which bears on whether `quality.ui_e2e: ui-or-critical-path` has started to bite | **LOW** | **(a) BA/PM** — which ticket makes the game runnable is a scheduling fact on the board, not the Scribe's to declare. **(b) Security/NFR with QE** — whether a terminal frame counts as a "UI surface" under `quality.ui_e2e` is a gate-scope call. **A Security/NFR hop is live on this base right now; `AGENTS.md` is outside its scope and I did not touch its files** |
| **`S5`** | **`ADR-0007` falsifier `D2`'s headline and its check have started to diverge.** `D2`'s headline is *"the package becomes publishable or **exposes an executable**"*; its stated check is narrower and mechanical — *"`package.json` gains `bin`, `main` or `exports`, or loses `private: true`"*. **The check has NOT fired: I verified all four at this tip and none moved.** But `scripts.chess` is now an invocable entry point, so a reader testing the *headline* rather than the *check* could reasonably ask whether `D2` fired. **My reading is that it did not** — a run-script is reachable only from inside a checked-out repo, produces no artifact and cannot be installed, so the posture is unmoved and `ADR-0007` needs no supersession today | **LOW** | **Architect/Design.** `ADR-0007` is the authority and **I did not amend it** — the subtask forbids it and I agree with the limit. If anyone wants `D2`'s headline tightened to match its own check, that is one clause in a superseding or amending ADR, and it is theirs |

## Why `S4` is a flag and not an edit

Every literal clause at L107-108 survives a strict reading of the tip: you still cannot play a game
(`npm run chess` prints the start position and exits 0 — no move can be typed), and "UI surface" is
undefined in this repo. **So it is not the contradiction I was sent for, and it is not false.** To
"fix" it I would have to write down *which* ticket makes the game runnable and *whether* a terminal
frame is a UI — two assertions owned by BA/PM and by Security/NFR respectively. Coding rules 9-12:
that comment was placed by another hop for its own reasons. **Fix the contradiction, do not tidy the
neighbourhood.**

## What I checked and am NOT raising, so the list is not padded

- **The four other `UNKNOWN - verify` command slots.** Genuinely unknown; unrelated to a CLI
  existing; I ran none of them and filled none of them in.
- **The `ABC-008` provenance comment dating the command table to 2026-07-22.** It is a historical
  statement about that hop and stays true; `ABC-042` added its own dated comment inline rather than
  rewriting it. Correct as-is.
- **`default_stack`'s five wrong keys** (`node-fastify`, `vue`, `postgresql`, `playwright`,
  `docker`). Already named and deliberately not taken by `ADR-0007`'s Consequences. Not mine, not
  this ticket, and not in `AGENTS.md`.
- **`plans/board.md` and `plans/traceability.md`.** Reserved to the Orchestrator on this ticket. **I
  wrote neither.** My role file would normally have me append a traceability row for an `AGENTS.md`
  update; the subtask overrides that for this hop and I followed the override. **The trace row for
  this edit is therefore owed by the Orchestrator, not skipped** — recording that here so it is not
  silently lost.
