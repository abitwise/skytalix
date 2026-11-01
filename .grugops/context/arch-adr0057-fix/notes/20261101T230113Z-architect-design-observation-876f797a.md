---
id: 20261101T230113Z-architect-design-observation-876f797a
kind: observation
by: architect-design
at: 2026-11-01T23:01:13Z
verified_by: 
confidence: high
refs:
  - memory-bank/50-decisions/ADR-0056
  - EPIC-010
  - qe-EPIC-010-close
  - scribe-lane-figures
  - arch-adr0057-fix
supersedes: 
seal: sha256:d6fa1964837f41e1348008c447a9067bbf49ceb096f3e1337f4c2583d06dcdce
---

# ADR-0056 R-TC part 2: lane figures refreshed (dated, figures only)

## Observation
In ADR-0056's R-TC part 2 section, the old text is kept in each "was" marker, and a dated line names the source.
- **Levels deep lane:** "41 tests and takes about 555 s" is now 57 tests, 577 s. "41 passed" is now 57 passed. "About 9 min" is now about 10 min.
- **Ladder short mode:** "848 s on a loaded host" is now 18 tests, 23.4 s with the host alone.
- **UCI session deep lane:** "About 5 min (estimate)" is now 241 tests, 291 s with the host alone.
- **The three lanes together:** "about 30 min" is now about 15 min.
- **Source:** QE readings on EPIC-010's closing head (qe-EPIC-010-close ...388b3044: worktree at 608ebfa4, src/ equal to 053733d2). The Scribe's list is scribe-lane-figures ...1fdc30f0. Nothing was run in this hop.

## Scope
Figures only. No rule, lane, command or duty changed. EPIC-010 and EPIC-011 carry the same stale figures (Scribe list), and they are BA/PM's, out of this fence.

## Risks
None.
