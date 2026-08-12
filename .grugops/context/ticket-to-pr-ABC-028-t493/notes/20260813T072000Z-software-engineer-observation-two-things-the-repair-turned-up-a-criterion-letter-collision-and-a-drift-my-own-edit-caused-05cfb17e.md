---
id: 20260813T072000Z-software-engineer-observation-two-things-the-repair-turned-up-a-criterion-letter-collision-and-a-drift-my-own-edit-caused-05cfb17e
kind: observation
by: software-engineer
at: 2026-08-13T07:20:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - ABC-017
  - ABC-017-A4
  - src/history-pane.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/traceability.md
supersedes:
---

# Two things the repair turned up: `A4` is an AMBIGUOUS name in this file, and my four added lines moved every anchor below them by exactly four

> **Hand-authored, no stamp.** Both were measured with `/usr/bin/grep` on this tree. The first
> changed what I wrote; the second is **flagged, not repaired**, and one instance of it was in my own
> first draft.

## 1. `A4` names TWO different criteria in `src/history-pane.test.ts`

Obligation (v) told me to name the catcher as a criterion. Written bare, *"it dies again at `A4`"*
would have been **ambiguous in the file it was written in**:

```
/usr/bin/grep -n 'it("A4 —' src/history-pane.test.ts
  351   A4 — 19 plies: the last row carries the white ply ALONE and no black ply sits in a white cell
  950   A4 — no write reaches the caller's graph during a render, at all ten lengths

/usr/bin/grep -n '^describe(' src/history-pane.test.ts
  260   describe("ABC-017 acceptance", ...)     <- contains :351, AND contains the A9 block I edited
  770   describe("ABC-028 acceptance", ...)     <- contains :950
```

**The `A9` doc comment lives inside the `ABC-017` describe.** A bare `A4` read from there resolves
most naturally to `ABC-017`'s `A4`, forty lines above it — **the wrong criterion, and one that does
not kill `WPOS`.** So the comment says `` `ABC-028` `A4` ``, which is also the form this file already
uses for a cross-ticket criterion reference (`:981`, `` `ABC-017` `A14` ``).

**This is a small thing that would have been a real defect**: a reader who resolved it to `:351` and
found a criterion about 19-ply row layout would conclude the comment was wrong, and the repair would
have re-created a confusion of exactly the kind it was sent to remove. **It is recorded because
`## Test notes` 1 on this page forbids describing a hole per witness** — the general fact is that
**criterion letters are ticket-scoped and this file holds two tickets**, so any bare `A<n>` in it is
ambiguous by construction, not just this one.

## 2. My own edit drifted every live anchor below it by exactly `+4`

Four comment lines became eight. Everything in `src/history-pane.test.ts` below `:494` therefore
**moved down by four**, and this file is heavily cited by line number.

```
                                       pre-edit   post-edit
describe("ABC-028 acceptance")           766        770
it("A4 — no write reaches …")            946        950
`ABC-017` `A14` reference                977        981
"survives both rows below" (instance 2) 1014       1018
interface EditShape                     1017       1021
it("A4 — 19 plies …")  (above the edit)  351        351   unchanged
```

**The rule is mechanical and complete: an anchor into this file at `:495` or below is unchanged; an
anchor at `:495` or above is `+4`.** Stating the rule rather than a list is deliberate — a list of
six goes stale on the next edit, the rule does not.

**Measured drift on the published record**, instrument named and its scope stated:

```
/usr/bin/grep -oE 'history-pane\.test\.ts[`]?:[0-9]+' <file>     <- FULLY-QUALIFIED citations only
  plans/tickets/ABC-028-…md   11 citations:  :139 x3, :493 x3, :741 x2, :785, :1014, :1017
                              -> the 3 at :139 are unaffected; the other 8 are at or above :495
  plans/tickets/ABC-017-…md    2 citations:  both :193-208  -> unaffected
  src/history-pane.nfr.test.ts, src/history-pane.ts, src/history-pane.test.ts   0 citations
```

**The instrument's limit, stated rather than hidden: it only counts anchors that carry the file
name.** Bare `` `:NNN` `` anchors in prose are far more common on the `ABC-028` page and **cannot be
attributed to a file by grep alone**. The bound is `99` bare anchors at or below `:494` and `9` above
it — **an upper bound on the affected bare anchors, not a count of them**, because not all of them
point at this file. **How many actually drifted is `UNKNOWN - verify`** and I did not guess it.

**The three `:493` citations are a different case and worth separating**: they do not merely drift,
they now point at *different text* — the sentence they quote no longer exists anywhere. They are
records of a repaired defect, so the right disposition is almost certainly to leave them as historical
citations, not to re-point them.

## What I did about it

- **In my own writing: corrected before commit.** My first draft of the `plans/traceability.md`
  append cited `` `:946` ``. **I re-derived it after the edit and it is `:950`.** Writing a stale
  anchor into the record, on the hop whose entire subject is records that went stale, would have been
  the defect committing itself.
- **On the `ABC-028` page: flagged, NOT repaired.** The brief scopes this hop to
  `src/history-pane.test.ts` comment text only; `## Test notes` 15 itself cites `` `:766` `` and
  `` `:946` ``, both now `+4`. **Correcting a ticket page is a text hop and this is a two-line fix**
  — the same argument BA/PM used to keep `:1014` out of this repair. Owner: whoever next opens that
  page, with the `+4` rule above.
- **Nothing else touched.** `ABC-017`'s page is a merged ticket's and is unaffected anyway.

**This is not an argument against the edit.** Any edit to this file drifts anchors below it; the
alternative was leaving a false sentence in the tree. It is recorded so the next reader is not
surprised, and so the `+4` is applied once rather than re-derived six times.
