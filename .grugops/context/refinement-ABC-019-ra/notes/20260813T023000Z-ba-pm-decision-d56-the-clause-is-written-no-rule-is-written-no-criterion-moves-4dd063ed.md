---
id: 20260813T023000Z-ba-pm-decision-d56-the-clause-is-written-no-rule-is-written-no-criterion-moves-4dd063ed
kind: decision
by: ba-pm
at: 2026-08-13T02:30:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-018
  - ABC-028
  - ABC-029
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - NFR-002
  - NFR-008
  - plans/tickets/ABC-019-turn-loop-skeleton.md
  - src/frame.ts
supersedes:
---

# `[D56]` — the clause is written, NO rule is written, and no criterion moves

## The decision, in one line

**The over-broad sentence is repaired in place with the clause that makes it true, and nothing is
built to police the shape it belongs to.**

## What is now in the ticket

The single bullet became two, each one checkable on its own, plus a `[D56]` record block:

1. **"No security BAR of its own — which is NOT the same as 'no security trigger'."** The loop adds
   no security control and no injection of its own (message strings pass through untouched; its only
   originated notice is `INPUT_ENDED_NOTICE`). What it **does** add is two trust boundaries, so the
   Security/NFR half **is** triggered here — and it ran, 2026-08-13, `PASS_WITH_RISKS`, no required
   fix, ASVS L1 `V2.1.1` / `V2.2.1` / `V2.2.2` / `V2.3.1` / `V15.3.1` / `V1.3.2` all PASS.
2. **"The loop places strings and `ABC-018` sanitizes them — ALL of them in `ascii` glyph mode; in
   `unicode` mode only C0 and `U+007F`."** With the source citation (`src/frame.ts:123-132`,
   `:195-202`), the C1 block named explicitly including `U+009B` (CSI), the `UNKNOWN - verify` on
   whether a real terminal acts on `C2 9B`, the `L2`-vs-`L1` reason it does not block, and `R-A`
   carried with its owners and trigger unchanged.

**The old bullet is quoted verbatim inside `[D56]` rather than deleted** — this file's own convention
is to refute a sentence with measurement rather than replace it quietly, and the repair is only
legible beside the original.

## What was deliberately NOT done, and why

**No rule, checklist, lint or instrument was written to police the over-broad-sentence shape.** This
is the **seventh** instance of it on this stack (after *"non-static"*, *"the maximum"*, *"unreachable
by any pattern"*, *"exactly one"*, *"the trees differ by exactly one file"*, *"the fd-3 channel cannot
be forged"*). `ABC-028`'s repair for exactly this shape was **demoted to a convention one hop ago**
because nothing enforced it and its false-positive count grew while its own rule was being discussed.
**Writing a second one here is the same trade at a worse price.** The clause is the repair, and it is
paid one sentence at a time. Recorded in the ticket as flag 28 — a refusal, not an omission.

**No criterion moved.** All **27** stand; none added, amended, renumbered or deleted; the acceptance
table stays **18 rows**. `A9`/`A9b`/`A10`/`A10b`/`A14` were re-read against `R-B` and `R-C` and
explicitly **not** amended. **I did not conclude that a criterion is wrong** — the defect was in
`## Security / NFR triggers` prose, which is what this hop was scoped to.

**No production line is owed and `src/` was not opened for edit.** `src/turn-loop.ts` md5
`bd793612476c9d0eac28b75e1e3297cc` — re-checked at the start and the end of this hop, unchanged, and
equal to the value the brief pinned.

**No bar moved.** `NFR-002`'s three ply clauses, `A3b`'s spied counts, `N8-LANE`'s ≤ 650 ms allowance
and `NFR-004`'s async contract are all unedited; `plans/nfr-catalog.md` was **not opened**. `R-A`'s
severity, owners and trigger are carried verbatim from the gate, not re-priced.

## Size and priority — RE-DERIVED AN EIGHTH TIME, BOTH UNMOVED

**Size `L` (5) HOLDS. Priority `P0` HOLDS. `SPLIT_REQUIRED` does NOT fire.**

The ticket's standing tripwire (*"a hop that adds production scope beyond one guard should re-derive
size against `SPLIT_REQUIRED` seriously rather than by precedent"*) answered on its own terms:

- **Production scope added: ZERO, in the strong form.** `src/` not opened for edit, md5 unchanged, 27
  criteria and 18 test rows untouched.
- **Test scope added: ZERO.** No file, no row, no assertion — so `N8-LANE`'s binding risk, the test
  FILE count, does not move either.
- **Risk: DOWN, in one specific place.** The security justification now states the control it
  actually delegates to, so a future `EPIC-006` hop inherits a scoped obligation instead of a slogan.
- **`XL` (8) is still exactly one thing away** — `ABC-021`'s claim outcome, `ABC-018`'s frame output,
  or `ABC-012`'s history module — and nothing moved toward it. The one candidate this hop could have
  created (an instrument policing the sentence shape) is **not a ticket**, per the refusal above.
- **`P0`: nothing here touched value.** There is still no game without the loop. **No other ticket's
  priority was touched** — `ABC-028` and `ABC-029` were not opened.

**The brief asked me to re-derive `S` and `P1`. Those are `ABC-029`'s size and priority**, and
`ABC-029` sits beside this ticket in `## Ready for UAT (WIP 2/4)` on `plans/board.md`. This ticket is
`L` / `P0` in its front matter, on its board row, and in all seven previous derivations. **I did not
move either to match the brief**, and I recorded the mismatch as flag 26 rather than silently
resolving it in either direction. **Owner: the Orchestrator, as the brief's author.**

## Requested board move

**NONE — `Ready for UAT` STANDS.** The ticket entered it on the 2026-08-13 gate's merits; this hop
repaired prose, added no scope and moved no bar, so there is nothing here to advance or hold it.
`plans/board.md` was **not opened for edit** — it is reserved to the Orchestrator by this brief. The
front matter (`ready-for-uat` / `Ready for UAT`) and the board **agree**, checked by reading both, so
the drift the gate flagged is closed.

## What routes onward

- **To the Engineer: NOTHING.** No production line is owed by this hop.
- **To the Orchestrator: three items** — the `S`/`P1` mismatch in the brief (flag 26); the
  `plans/traceability.md` COLUMN INVARIANT measurement in the sibling `observation` note; and `R-D`,
  the merge-order question, which is unchanged, untouched and was already the Orchestrator's.
