---
id: 20260820T222000Z-qe-e2e-claim-one-followup-ticket-is-worth-cutting-one-is-noise-and-none-of-the-three-coverage-limits-blocks-uat-e5b71c33
kind: claim
by: qe-e2e
role: qe-e2e
task: qe-ABC-044-recheck-2026-08-20
at: 2026-08-20T22:20:00Z
verified_by:
confidence: high
refs:
  - ABC-044
  - ABC-044/A1
  - ABC-044/A2
  - ABC-044/A6
  - ABC-043/A1
  - EPIC-006
  - NFR-002
supersedes:
---

# What is worth a ticket, what is noise, and which of the three coverage limits should reach the owner rather than stop him

The Orchestrator asked four straight questions and these are four straight answers. **Confidence
high on each, and each rests on a measurement already recorded in this folder.**

## 1. `A2`'s dominated non-substring rows — CUT A FOLLOW-UP. It is a row that can never fail

The criterion's own words are instrumented on the WHOLE SCREENS (headline plus the identical move
list), so a substring relation reduces to equality, which `A1`'s set-of-8 row already buys. The
ticket's own named wrong build (`## Test notes` 2) turned the naming and claimed/automatic rows red
and left these two **green** — measured, not argued. `A2`'s substance IS delivered, by the four word
rows, which are stronger than the criterion asked for. **The criterion passes; two of its rows are
dead weight, and a dead row is a small lie the next reader inherits.** The close is one expression:
compare `screen.split("\n")[1]` — the headline — instead of the joined screen.

## 2. `A1`'s set row not catching a phrase-shared pair whose `result` differs — NOISE. Do not cut

`M4` (giving `resignation` `checkmate`'s phrase) is caught by the naming row; six of the eight carry
`draw`, so the set row covers all fifteen draw-pairs and the naming row covers the rest. **Combined,
the criterion is fully instrumented and there is no build in this ticket's reach that neither row
sees.** I recorded it as a reading, not a gap, and it should stay a reading. Same for `A3`'s
word-boundary note (`drawn`/`winner` would slip a `\b`-anchored word list): the criterion says
"words", the instrument tests words, and no build in this diff produces those tokens. **No ticket.**

## 3. What the ONE follow-up should be, if BA/PM cut only one

**Bundle both instrument residuals into a single `XS` test-only ticket against `EPIC-006`** — there
is no production change in it and both rows live in test files this epic already owns:
- `ABC-043` `A1`: add `expect(entry.match(/\bhistory\s*[:=]/g)).toHaveLength(1)` — closes the
  name-shadowing survivor `D3`, measured green on the delivered build and red on both decoys.
- `ABC-044` `A2`: move the two non-substring rows onto the headline so the criterion's own words are
  the thing asserted.
**Neither is a defect in shipped behaviour and neither should hold a merge.** If the choice is one or
zero, take the `A1` row: it is the one with a witnessed green wrong build behind it.

## 4. The three coverage limits — NONE of them blocks business acceptance. All three must be DISCLOSED

I am giving the read, not the routing.

**(a) `resignation` unreachable through the entry point — DISCLOSE, DO NOT BLOCK.** `COMMAND_TABLE`
is `help`, `board`, `quit`, `claim`, and its own header says `resign` belongs to `EPIC-006`'s later
command set. `ABC-044` was cut to render a merged type's eight values and it renders all eight
correctly; a path that does not exist yet is not this ticket's hole and no test can close it.
**What WOULD be a failure is UAT reporting "eight reasons seen".** It will have seen at most three
end to end. Put that sentence in the UAT pack in those words.

**(b) The two claimed draws never driven end to end — DISCLOSE, DO NOT BLOCK.** They are reachable by
construction (`claim` is in the table and the loop adjudicates it against the ply's own status), but
I could not force one: the engine does not repeat, so shuffling one side does not produce a threefold,
and a fifty-move claim is worse. **A human at UAT is in the same position I was** — this is not a
thing a business scenario can reliably reach either, so it should be recorded as `UNKNOWN - verify`
rather than written into a UAT script that will fail to execute. The underlying adjudication is
`src/gameend.ts`, which is `Done` and mutation-tested and byte-identical in this diff.

**(c) The TTY path — DISCLOSE, DO NOT BLOCK, AND MAKE IT THE FIRST THING UAT DOES.** Every `A6`
measurement is on a **pipe**. On a TTY, `src/frame.ts` repaints in place (`CURSOR_HOME` + erase,
gated on `sink.isTTY`), and the result screen is written straight after the final frame with no
session and no cursor control of its own; a 120-ply game is 60 rows of move list and **will scroll
the final frame off a short terminal**. No criterion covers it, nothing in this diff is wrong for it,
and there is no TTY harness in this repository — so it is precisely the observation a pipe cannot
make and a human at a real terminal can. **It is the strongest argument for sending this to UAT, not
against it.** If UAT is conducted only through a pipe, the one thing UAT was uniquely able to check
goes unchecked — and THAT would be worth refusing an acceptance over.

## The one cosmetic edge, restated so it is not mistaken for a defect

A screen for a **zero-ply** game ends with a blank row (the separator before an empty move list), so
a fault child emits one trailing empty line. No criterion forbids it; `A4`'s zero-bytes rule is a
different path. **Reported, not raised, and not worth a ticket.**

## Standing of this note

**No `finding` and no `§14-gate#<id>` stamp** — this install has no `scripts/context-io.ts`, no
`mcp__grugops__propose_note` and no stamp issuer, so this is a hand-authored `claim` in the folder's
convention. The judgements above are mine and are routing advice, not verified results; the
measurements they rest on are in the sibling `observation` notes.
