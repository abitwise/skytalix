---
id: 20260821T002000Z-uat-planner-decision-the-uat-result-for-abc044-and-the-signature-that-is-not-mine-to-give-71f3f5b3
kind: decision
by: uat-planner
role: uat-planner
task: uat-ABC-044-2026-08-20
at: 2026-08-21T00:20:00Z
verified_by:
confidence: high
refs:
  - ABC-044
  - ABC-044/A1
  - ABC-044/A2
  - ABC-044/A3
  - ABC-044/A4
  - ABC-044/A5
  - ABC-044/A6
  - ABC-044/A7
  - EPIC-006
  - plans/uat/ABC-044-uat-pack.md
  - plans/uat/ABC-044-signoff-checklist.md
supersedes:
---

# The UAT result for `ABC-044`, and the signature that is not mine to give

## The result

**8 business scenarios conducted against the real build. 6 PASS, 1 PASS-with-a-finding (`S5`), 1
PARTIAL (`S6`), 0 FAIL.** Six of the eight ran on a **real pty**, one is the pipe baseline, one
compares the two. Details are in `plans/uat/ABC-044-uat-pack.md` and in this task's `observation`
notes; they are not restated here.

**THAT SENTENCE IS NOT AN ACCEPTANCE, AND IT IS WRITTEN SO IT CANNOT LATER BE READ AS ONE.**
`context.human_admission` is `off`, no `finding` is admissible on this install, and the owner's ruling
of 2026-08-16 makes **his word in session** the `In UAT` exit signature — a ruling given after he was
told explicitly that a green agent report would **not** be treated as his acceptance
(`AGENTS.md` § *Test and UAT authority*). This note is a `decision`, carries no stamp, and asserts
nothing about what any human thinks of the work.

## The waiver, measured

The 2026-08-17 zero-production-lines waiver **does not apply**, and the instrument matters:

```
$ git diff --name-only 10811cf~1 10811cf | grep -v '\.test\.ts$' | grep '^src/'   # tip: EMPTY
$ git diff --name-only db38961~1 db38961 | grep -v '\.test\.ts$' | grep '^src/'
src/cli.ts
src/result-screen.ts
```

**The tip commit is test-only, so measuring at the tip would have waived this ticket straight to `Done`
with no UAT ever conducted.** The delivered commit is `db38961`, and the whole-branch measurement
(`30482cd..10811cf`) returns the same two production files. **Production lines shipped ⇒ the owner's
word is required.**

## Board

`ABC-044` moved **`Ready for UAT` → `In UAT`** at the start of this hop. **It is NOT moved out.** The
`In UAT` exit is the owner's word, it has not been given, and neither this role nor the Orchestrator
may supply it. `Ready for UAT` is now 0/4; `In UAT` is 1/4.

## The three things the owner is being asked to accept, not the eight scenarios that passed

The passes are the cheap half. These are the ones that need a person:

1. **One ending of eight was seen by a player — checkmate. Not eight.** Six more are reachable only by
   playing to them and were not reached. **`resignation` cannot be reached at all**: there is no
   `resign` command and there will not be one until `EPIC-006` cuts it. That ending renders correctly
   from a value nothing but a test can supply. It is not a hole in this ticket; it is also not
   something accepting this ticket fixes.
2. **On a long game at a standard 24-row terminal, the line saying who won is liable to scroll off the
   top**, pushed by the move list beneath it. Threshold measured at a 43-ply game; a 44-ply game was
   played on that terminal. **No criterion of `ABC-044` covers this and nothing in the delivered diff
   is wrong for it** — the gap is in what was asked for. The mechanism and the length were each
   measured but never in one run: `UNKNOWN - verify`.
3. **Neither claimed draw was ever driven to its end.** The wordings are right and cite the FIDE
   articles; what a player would actually see is `UNKNOWN - verify`. **No UAT step was written that
   would fail to execute.**

## What this role deliberately did NOT do

- **Did not self-sign, and did not write a green summary that could be quoted as a signature.**
- **Did not report "eight reasons seen"** — QE asked for that sentence in those words and it is honoured.
- **Did not write a scenario for the claimed draws that would fail to execute**, and did not build a
  scripted-engine child to force one: that would test `src/gameend.ts`, which is `Done`,
  mutation-tested and byte-identical here, and it is not what a UAT is for.
- **Did not cut a ticket for the scroll observation.** Cutting is BA/PM's at the Orchestrator's
  routing, and cutting one before the owner has been asked would pre-empt his answer to `Q6`.
- **Did not quietly conduct this through a pipe.** QE said that would be worth refusing an acceptance
  over; the harness was built instead.
- **Did not touch `src/`, did not merge, did not deploy.**

## The exact question the owner has to answer

> **"Do you accept `ABC-044` — the result screen — as it stands, knowing that (1) only checkmate was
> actually seen and `resignation` cannot be reached by any player until `EPIC-006` cuts `resign`,
> (2) on a long game at a 24-row terminal the line saying who won can scroll off the top and no
> criterion covers that, and (3) neither claimed draw was ever driven to its end?"**

Full wording, with the observations attached to each question, is
`plans/uat/ABC-044-signoff-checklist.md`. **Silence is not acceptance. Until he answers, `ABC-044`
stays in `In UAT`.**

## Standing of this note

Hand-authored, unstamped `decision`, in the convention of
`.grugops/context/ticket-to-pr-ABC-044-2026-08-20/notes/`. No `finding`, no `§14-gate#<id>`, no forged
`human:<name>` — this install has no `scripts/context-io.ts`, no `mcp__grugops__propose_note` and no
stamp issuer, and none was invented.
