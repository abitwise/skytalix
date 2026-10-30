---
id: 20261030T202446Z-architect-design-decision-1bd86221
kind: decision
by: architect-design
at: 2026-10-30T20:24:46Z
verified_by: 
confidence: high: records-only status fold on the owner's verbatim words as transcribed in orch-2026-10-30a/…65848126; A4/A5 added verbatim as the amendment's On-acceptance clause prescribes; nothing run (host held ALONE by QE)
refs:
  - arch-ABC-242-accept
  - ABC-242
  - EPIC-010
  - ADR-0054
  - ADR-0032
  - QE-230-a
  - arch-ABC-242-reading
  - arch-ABC-242-reading/20261030T152301Z-architect-design-decision-fec766ee
  - orch-2026-10-30a/20261030T180500Z-orchestrator-decision-65848126
  - 5090a4d6
supersedes: 
seal: sha256:dd734bc1103d1321a5bdad32e6285768730fcc2aea93cc8a06a569029e9facc0
---

# Architect/Design decision, arch-ABC-242-accept: ADR-0054 § Proposed amendment 2026-10-30 is ACCEPTED, and in force on `main` at `ABC-242`'s merge

Records only, on branch `grugops/arch-ABC-242-accept` from `main` `5090a4d6`. Nothing was built, run or timed,
because a QE holds the host alone. No `src/`, `tools/`, `data/`, ticket or board file was touched.

## The owner's word
- Verbatim, 2026-10-30: *"ABC-242: accept, ABC-225 - approve to run one at a time"*. This is the Orchestrator's
  transcription in `orch-2026-10-30a/…65848126`, and it is not a stamp.
- The first clause answers the amendment's question. The answer form asked for was *"ADR-0054 ABC-242: accept"*.
  The owner's *"ABC-242: accept"* names the one open question on `ABC-242`, and the Orchestrator's note maps it to
  this amendment. There is no ambiguity, so it is read as acceptance.

## What changed (status only, plus the amendment's own pre-written additions)
- **`ADR-0054` § Status:** the 2026-10-30 pointer changes from PROPOSED to ACCEPTED, with the quote, the note id
  and "in force on `main` at `ABC-242`'s merge". The PROPOSED pointer is kept as "Previously".
- **`ADR-0054` § Proposed amendment 2026-10-30:** the heading ends "ACCEPTED, not in force on `main`", which is the
  `ADR-0025` precedent. Its § Status gains an ACCEPTED block, and the PROPOSED paragraph becomes "Was:". A1–A6 and
  the rest of the text are unchanged.
- **`ADR-0054` decision 2, blunder bullet:** A5's sentence is added verbatim and marked
  *(added 2026-10-30, `ABC-242`, accepted; in force on `main` at `ABC-242`'s merge)*.
- **`ADR-0032` § Status:** the 2026-10-30 pointer changes from PROPOSED to ACCEPTED, and the PROPOSED pointer is
  kept as "Previously".
- **`ADR-0032` decision 1:** A4's bullet is added verbatim, with the same marker. It sits after "A move's score is
  minus its child's score" and before the no-legal-move bullet, because A3 puts the repetition test first.
- **Why these are not new decision text:** the amendment's own "On acceptance" bullet prescribes exactly these two
  additions, word for word, and the owner accepted that amendment. This is the `ADR-0026` "applied as proposed"
  form.

## Unchanged
- Every other decision in `ADR-0054` (1–8) and in `ADR-0032` (2–5, and the other bullets of decision 1).
- A6: the parent-root count stays out of `ABC-242`.
- The engine path. `src/engine.ts` and `src/search.ts` are not touched by the amendment.

## Who acts next (not this hop's work)
- BA/PM: the `ABC-242` `A8` wording fix and the DoR re-score (Orchestrator `…65848126`, item 1).
- SE and QE: build and verify per the Architect block on `ABC-242`. The QE verdict decides the merge, and the
  amendment is in force from that merge.
