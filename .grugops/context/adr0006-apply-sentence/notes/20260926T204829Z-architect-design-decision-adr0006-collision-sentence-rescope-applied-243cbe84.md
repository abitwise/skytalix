---
id: 20260926T204829Z-architect-design-decision-adr0006-collision-sentence-rescope-applied-243cbe84
kind: decision
by: architect-design
at: 2026-09-26T20:48:29Z
verified_by:
confidence: high
refs:
  - ADR-0006
  - ADR-0025
  - ABC-081
  - memory-bank/50-decisions/ADR-0006-castling-rights-stay-rights-in-the-hash.md
  - 20260927T001000Z-orchestrator-decision-8c8aa8a9
  - 20260926T204400Z-architect-design-decision-adr0006-amendment-sentence-rescope-not-strike-proposed-text-9c4d2b18
  - 20260926T204300Z-architect-design-observation-availability-key-collides-inside-one-search-no-root-score-moved-5e1a7c30
supersedes:
---

# `ADR-0006`'s 2026-09-25 collision sentence is rescoped as proposed in `…9c4d2b18`

Hand-authored, no `seal`. This repo ships no `context-io` writer, and no `propose_note` tool was
available at this hop. The note follows the `…b7e41c92` precedent. It is a `decision`, so it
needs no stamp. No test was run and nothing was re-measured. Every number is cited from
`…5e1a7c30`.

## Scope

- In scope: `ADR-0006` § "Amendment — 2026-09-25" (one sentence), one erratum paragraph at the
  end of the file, one trace row, and this note.
- Out of scope: the Decision, the "REQUIRED" lead, the three measured bullets, the rest of the
  amendment paragraph, the `G6` row and its 2026-09-26 erratum, `src/`, and `plans/board.md`.

## Whose word

The Orchestrator accepted the text under the owner's delegation (`…8c8aa8a9`, item 1). The
owner's words, Olger Oeselg, 2026-09-26, verbatim: *"i will delegate these decisions to you.
Contact me when big decision is needed or input context for your session goes over 500k"*. The
erratum says the text was accepted under that delegation. It does not say the owner accepted
the text himself.

## What was applied

- A check before editing: the wave file (at `e57da89`) carried the sentence exactly as
  `…9c4d2b18` §2 quotes it. The `G6` erratum was the last paragraph of the file, as §3 assumes.
- §2: the sentence was replaced in place with the proposed text, word for word. `<date>` became
  `2026-09-27`. The following sentence ("So the "Consequences" bullet …") and everything after it
  are unchanged. Only the line wrap moved.
- §3: the erratum was appended after the `G6` erratum, word for word, with the placeholders
  filled in. Date: `2026-09-27`. Owner's word: the delegation quoted above, credited as
  delegated. Note id: `20260927T001000Z-orchestrator-decision-8c8aa8a9`.

## Risks

- Date: the Orchestrator's note is stamped `2026-09-27T00:10Z`, and the caller told me to use
  `2026-09-27` for the ADR. This hop's host clock read `2026-09-26T20:48Z`, and this note's `at`
  uses that reading. The mismatch comes from upstream timestamps. It was not re-derived here.
- `UNKNOWN - verify` still stands, as the erratum says: nobody measured whether any foreign
  cutoff was wrong for its node.
- Date corrected: on the Orchestrator's instruction, the two `ADR-0006` date stamps (the
  `*(amended …)*` marker and the erratum heading) now read `2026-09-26`, matching the real clock.
  The `2026-09-27` in "What was applied" above records what was first written. The note-id
  reference `20260927T001000Z-orchestrator-decision-8c8aa8a9` is unchanged.
