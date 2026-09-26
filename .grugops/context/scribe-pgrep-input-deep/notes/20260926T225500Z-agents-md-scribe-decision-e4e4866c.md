---
id: 20260926T225500Z-agents-md-scribe-decision-e4e4866c
kind: decision
by: agents-md-scribe
at: 2026-09-26T22:55:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
supersedes:
---

# Two owed AGENTS.md edits, made narrowly, per ABC-109's byte-budget structure

Hand-authored per AGENTS.md's own header (`context-io.ts` / `claim.js` / `propose_note` all absent
from this repo and the kit; `context.human_admission` is `off`; no `finding` is admissible on this
install) — same admission-refusal reason the ABC-109 restructure notes recorded.

**1. Wait-loop rule.** Added one short line to `AGENTS.md § Commands § Test`, right before the
command list: never wait on a lane with `pgrep -f "<text>"` / `until ! pgrep -f …` — the pattern
matches the waiting shell's own command line and never exits; wait on the PID you started or the
tool's completion notification, or bracket one character (`[v]itest`) if a pattern is unavoidable.
Sourced from the orchestrator's failed-attempt note
`.grugops/context/wave-2026-09-25/notes/20260926T073000Z-orchestrator-failed-attempt-8ccbfa69.md`
(three hung self-matching loops, pids 23057/27104/32418). Placed in the Test section (not a new
top-level section) — it is a testing-workflow hazard, not a command, and the ABC-109 shape keeps
directive material condensed in place rather than adding new top-level sections.

**2. INPUT_DEEP receipt correction.** `AGENTS.md`'s Input-seam deep lane line said "33 passed";
measured today (`INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts`,
foreground, twice for stability) it is **34 passed, ~0.3-0.4s**. Also measured, to keep the
"32/33 means NODE_OPTIONS dropped" trap accurate: without `NODE_OPTIONS`, `INPUT_DEEP=1` alone
gives **33 passed** (was 32) — a test was added to `src/line-input.test.ts` since the 2026-08-19
RUN receipt. Corrected the AGENTS.md line's numbers (34 / 33) and RUN date (2026-09-26). Corrected
the fuller receipt in `memory-bank/90-agents-md-command-log.md` § "Input-seam deep lane" the same
way, and also noted the default lane (no env vars) is now 30 (was 29) for the same reason, since
leaving that number stale beside a corrected 34/33 pair would have been a fresh inaccuracy of the
same shape as the one being fixed.

**Not done:** no ABC-121 deep-lane lines were added — ABC-121 is not on the wave yet, per the
task's own instruction.

## Bytes and test result

- `AGENTS.md` before: 21,786 B (ABC-109 restructure baseline). After both edits: **22,090 B** —
  2,486 B (11.2%) under the ticket's own ≤ 24,576 B budget, 10,678 B under the inherited 32,768 B
  reader cap.
- `npm test` (`node tools/grugops/run-bounded.js 60000 vitest run`, foreground): exit 0, **47 files,
  1447 tests** (was 1446 at the 2026-09-25 receipt — the +1 is the line-input test added between
  2026-08-19 and now, now correctly reflected in the receipt rather than hidden). The byte-guard
  test (`ABC-109 — AGENTS.md stays inside its byte budget`, `src/cli.test.ts:2133`) passed.
- No `pgrep -f` wait loop was used anywhere in this hop; all commands ran to completion in the
  foreground with a bounded timeout, no background process left running.
