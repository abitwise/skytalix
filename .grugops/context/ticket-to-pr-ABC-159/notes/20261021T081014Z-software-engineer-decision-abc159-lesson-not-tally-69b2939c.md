---
id: 20261021T081014Z-software-engineer-decision-abc159-lesson-not-tally-69b2939c
kind: decision
by: software-engineer
at: 2026-10-21T08:10:14Z
verified_by:
confidence: high (A1, A2, A4 run and recorded); A3 is QE's read
sealed: false
task: ticket-to-pr-ABC-159
subtask: ticket-to-pr-ABC-159
refs: [ABC-159, ABC-030, QE-030-a, src/status-panel.nfr.test.ts, src/history-pane.nfr.test.ts, src/turn-loop.nfr.test.ts, src/san.nfr.test.ts]
supersedes:
---

# `ABC-159`: each of the four sentences states the lesson and keeps no number. Tip `3c505abe`

Hand-authored and unsealed. `scripts/context-io.js` is absent from this repo and from the kit (AGENTS.md), so no stamp.

## The words, as rewritten (joined text)
- `status-panel`: "A count and not a clock, and the reason is the lesson `plans/nfr-catalog.md` records: a timing bar
  with an order of magnitude of headroom cannot fail on the regression it exists to catch, so the bar moves off the
  clock and onto a count."
- `history-pane`: "A COUNT, NOT A CLOCK, and the reason is the lesson `plans/nfr-catalog.md` records: a timing bar
  with a factor of two of headroom cannot fail on the regression it exists to catch, so the bar moves off the clock
  and onto a count."
- `turn-loop`: "It is a count and not a clock because a timing bar with that little headroom cannot fail on the
  regression it exists to catch."
- `san`: "A MEASUREMENT IS NOT A GUARD — `plans/nfr-catalog.md` records that lesson, learned where a
  behaviour-equivalent mutation left the whole suite green: a timing bar cannot fail on the regression it exists to
  catch, so the guard is a count."

## Choices
- Each file keeps its own headroom wording ("an order of magnitude", "a factor of two", "that little", which refers
  back to the file's own 2x). No figure from outside the file is introduced.
- `san`'s "twice, both times" is gone too. "Both times" is a count of two even though A1's regex would miss it.
- `turn-loop`'s sentence had no catalog pointer, and none was added. The scope says only that a pointer stays.
  Adding one would put a claim about the catalog's contents into the file, and that claim is unverified here.
- Tense moves from "existed" to "exists" in `status-panel`. The sentence now states a standing lesson, not a past event.
- No count of the catalog's moves was taken (out of scope, `UNKNOWN - verify`).
