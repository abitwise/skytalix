---
id: 20260815T135000Z-agents-md-scribe-observation-four-things-nobody-asked-about-including-a-coverage-run-from-day-one-d487b2e3
kind: observation
by: agents-md-scribe
at: 2026-08-15T13:50:00Z
verified_by: 
confidence: high
refs:
  - memory-bank/70-runbook.md
  - plans/traceability.md
  - AGENTS.md
  - .gitignore
  - agent-factory/workflows/06-uat-pack.md
supersedes: 
---

# Observation — five things nobody asked about, four of them outside my file

Each one was checked with a command before it was written down. None was fixed except where the file
is mine.

## 1. Coverage HAS been run in this project before — on day one, and it deleted production code

The parent note records *"nothing had ever invoked it"* and the subtask calls this *the first
coverage measurement ever taken*. **That is exactly right about the instrument's plumbing and not
right about the act.** Verified in git:

- `coverage/` was **tracked**, and updated across **seven** commits between **2026-07-22**
  (`226c2e3`, `ABC-001`) and **2026-07-24** (`76ca714`) — clover, `coverage-final.json` and the full
  HTML report.
- **`ABC-001`'s own commit message says two functions were deleted because *"Coverage showed them
  never called"*.** A coverage run changed `src/` on the first day of this project.
- It was untracked and ignored on **2026-08-13** (`96ec343`) — the run that wiped 22 tracked files
  is what exposed it.

**So what has never existed is a recorded coverage COMMAND** — no npm script, no `vitest.config.ts`
key, no `AGENTS.md` slot, no gate. That gap is real and it is what I just closed. The stronger
version of the parent's point: **this project ran the instrument, acted on it, committed its output
for three weeks, and still never wrote the command down.**

**And the denominator problem is older than anyone thought.** The report committed at `8d0a8f7`
(2026-07-22) already carried `coverage/tools/grugops/*.html` rows — tooling files sitting in the
project's own coverage total, in a committed artifact, **three weeks before anybody noticed the
denominator was the whole question.**

## 2. `memory-bank/70-runbook.md` is now stale about who holds deploy, and nobody in this fan-out owns it

Two live rule-lines contradict the 2026-08-15 grant:

- **line 61** — *"`production_requires_human_confirmation` is `true`, and a human holds deploy."*
  The first half is still true; the second is the clause that moved.
- **lines 63–64 and 89** — *"Merge approval is not deploy approval"*, sourced to the 2026-08-06
  directive's *"DEPLOY IS NOT INCLUDED"*, and *"The project owner … holds deploy"*.

This hop owns `AGENTS.md`; the parallel hop owns `ADR-0007`. **The runbook is in neither scope and I
did not touch it.** It is the operational file a role reads when it is about to do something to a
running system, so a stale key-holder line there is worth a subtask, not a footnote.

## 3. My role file says to append to `plans/traceability.md`; my subtask says do not touch `plans/`

`agent-factory/roles/agents-md-scribe.md` § "Trace updates" makes a trace row a standing duty of this
role. The subtask's hard limits say *"do not touch `plans/`"*. **I obeyed the subtask** — it is
authoritative for scope, and `plans/board.md` / `plans/traceability.md` are being written by other
hops on other branches, where a fourth writer would collide. **The row is therefore OWED, not
skipped**, and whoever merges this branch inherits it. Recorded here so it cannot be discovered later
as a silent omission.

## 4. `AGENTS.md`'s `### E2E` comment is drifting, and I left it alone deliberately

It reads *"no runnable game until `EPIC-006`"*. There has been a runnable entry point since
`ABC-042` (`npm run chess`), and the thing that is missing is **move entry** (`ABC-043`), not
packaging. The slot's value — `UNKNOWN - verify` — is still honest, so nothing is fabricated by
leaving it; but the reason attached to it is aging. **Outside this subtask's five items; flagged, not
edited.**

## 5. The kit requires a named human's UAT signature, and the grant does not supply one

`agent-factory/workflows/06-uat-pack.md` (steps 4, board move, done condition) and
`agent-factory/roles/uat-planner.md` (§ Hard limits: *"an agent that self-signs has removed the one
human the gate exists for"*) make the `In UAT` → `Ready to Release` exit a **named human's signoff**.
The owner granted the **conduct** of UAT. **These do not collide — but a role at that exit, holding a
fresh grant and a kit that demands a signature, will either stall or self-sign.** This one I *could*
fix, because `AGENTS.md` is mine: the new `## Test and UAT authority` section carries a precedence
paragraph that says conduct, report, never self-sign, and **names the signature question as the
owner's to answer** rather than answering it. `ABC-042` is the first ticket in this project's history
that can actually reach that exit, so it stops being hypothetical on the next board move.
