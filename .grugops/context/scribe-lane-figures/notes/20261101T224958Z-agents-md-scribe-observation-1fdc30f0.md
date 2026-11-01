---
id: 20261101T224958Z-agents-md-scribe-observation-1fdc30f0
kind: observation
by: agents-md-scribe
at: 2026-11-01T22:49:58Z
verified_by: 
confidence: high
refs:
  - scribe-lane-figures
  - QE-E010C-c
  - EPIC-010
  - ADR-0056
  - qe-EPIC-010-close
  - 20261101T224603Z-qe-e2e-observation-388b3044
  - memory-bank/90-agents-md-command-log.md
supersedes: 
seal: sha256:1d99b8353c313252a44977a0224ff8875f23127136ed8690bb0df5e52218623e
---

# Stale lane figures outside the Scribe's fence (for the Architect and BA/PM)

## Observation
Old figures (Levels "41 tests ~555 s" / "41 passed"; ladder short "848 s on a loaded host"; UCI session "about 5 min (estimate)") still stand in files the Scribe may not edit. Current figures: Levels 57 passed of 57, 577 s; ladder short 18 passed of 18, 23.4 s; UCI session 241 passed of 241, 291 s (QE note ...388b3044).
- `memory-bank/50-decisions/ADR-0056-...md`: line 812 (41 tests, about 555 s), 826 (exit 0 with 41 passed), 830 (848 s on a loaded host), 833-834 (about 5 min, estimate). Architect owns it.
- `plans/epics/EPIC-010-...md`: line 79 (41 at the ADR's count), 81 (848 s on a loaded host), 83 (about 5 min, estimate). BA/PM owns it.
- `plans/epics/EPIC-011-...md`: line 292 (41 at the ADR's count), 295 (848 s loaded), 296 (about 5 min, estimate). BA/PM owns it.
- Not stale, left alone: `plans/tickets/ABC-146-...md` line 240 and `plans/tickets/ABC-085-...md` (848 s is a dated reading of ladder file-only / verdict-era runs); dated history entries in the command log and in done/ briefs.
