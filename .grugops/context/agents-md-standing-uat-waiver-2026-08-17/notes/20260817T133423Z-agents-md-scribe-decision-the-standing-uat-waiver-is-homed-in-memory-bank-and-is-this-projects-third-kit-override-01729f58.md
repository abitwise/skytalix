---
id: 20260817T133423Z-agents-md-scribe-decision-the-standing-uat-waiver-is-homed-in-memory-bank-and-is-this-projects-third-kit-override-01729f58
kind: decision
by: agents-md-scribe
at: 2026-08-17T13:34:23Z
verified_by:
confidence: high
refs:
  - memory-bank/60-progress.md
  - AGENTS.md
  - ABC-063
  - ABC-064
  - agent-factory/workflows/06-uat-pack.md
  - agent-factory/roles/uat-planner.md
  - 20260817T163000Z-orchestrator-decision-the-owner-adopted-the-standing-uat-waiver-after-six-askings-and-what-it-does-not-reach-5d1c8b34
supersedes:
---

# The 2026-08-17 standing UAT waiver is written down — authority in `memory-bank/`, pointer in `AGENTS.md`, and it IS a kit override

## What was written and where

The house pattern was followed and NOT inverted: **`memory-bank/60-progress.md` carries the
authority; `AGENTS.md` § "Test and UAT authority" is a pointer to it.** The rule is stated once, not
three times.

- **New section in `memory-bank/60-progress.md`**, dated 2026-08-17, placed after the 2026-08-16
  signature directive and before "Standing directive — read before prioritising anything": *"Standing
  directive — a ticket whose delivered diff carries ZERO PRODUCTION LINES has its UAT WAIVED,
  standing. 2026-08-17."* It carries the owner's eleven words verbatim, the two-clause split (named
  waiver for `ABC-063`; the standing rule answering a question asked six times), the rule, the
  measured criterion, four limits, how it composes with 2026-08-16, the precedence verdict, and the
  two-authorities close-out.
- **`AGENTS.md` § "Test and UAT authority"** gained one pointer paragraph and two corrections. It
  stays a pointer.

The Orchestrator's measurements were **taken as given and not re-derived** — `e6697f6` `63 0`,
`9957ddf` `121 0`, `src/cli.test.ts` only. This hop measured nothing about those commits.

## The precedence verdict, reasoned rather than copied

**This IS a kit override — the third, alongside the branching model and the deployment posture.**
That is a DIFFERENT verdict from the 2026-08-16 directive, deliberately.

Checked at this hop against the read-only kit: `agent-factory/workflows/06-uat-pack.md` (steps 4,
board move, exit criteria, the "never self-sign or fake a pass — a named human signoff is required"
stop) and `agent-factory/roles/uat-planner.md` (§ responsibilities 3–4, board moves, hard limits)
make the `In UAT` exit a named human's signoff. **A grep for `waiv`, `skip.*uat`, `not applicable`
and `n/a` across both files returns nothing: the kit's UAT stage is UNCONDITIONAL and carries no
exempt class of ticket.**

- **2026-08-16 SATISFIED the kit.** A signature was required and the named human gave one; only a
  recording mechanism had been missing. Correctly not filed as an override.
- **2026-08-17 DISPENSES WITH the requirement** for a measured class. No signature is produced
  because no acceptance occurs. Calling that "satisfied" would be false. So it is named an override,
  scoped to zero-production-line tickets and nothing else; everywhere else — including UAT for every
  ticket carrying production code — the kit stands unchanged.
- **The counter-reading is recorded in the section rather than suppressed:** one could argue the man
  whose signature is required may decline in advance to require it, making this an exercise of the
  signing authority. That reading is available and weaker (2026-08-16 produces a per-ticket act by
  the named human; this produces none, for tickets not yet written). The stronger, more honest
  verdict was chosen. The owner's word settles it either way; the classification is what a future
  reader gets to check.

## What was deliberately NOT done

- **No config change.** `.grugops/factory.config.json` has no dial that can express this rule and
  none was invented — the same call the branching-model entry made about `autonomy`.
- **`plans/board.md`, `plans/traceability.md`, the ticket pages and `src/` were not touched.** The
  role's standing "append to traceability" responsibility was overridden by the task's explicit
  fence; flagged here rather than done silently.
- **No `finding` was written.** `context.human_admission` is `off` on this install.

## One honesty note on timestamps

This note's `at` is the real UTC clock at authoring (`13:34:23Z`). The sweep notes it depends on
carry `15:50Z` / `16:30Z`, i.e. LATER stamps for EARLIER work. Replay by `at` will therefore order
this hop before the decision it cites. Recorded rather than papered over by inventing a later stamp.
