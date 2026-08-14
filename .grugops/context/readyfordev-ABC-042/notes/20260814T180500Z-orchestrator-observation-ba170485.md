---
id: 20260814T180500Z-orchestrator-observation-ba170485
kind: observation
by: orchestrator
at: 2026-08-14T18:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/render-seam.test.ts
  - src/history-pane.nfr.test.ts
  - src/turn-loop.ts
supersedes: 
---

# `A12`'s premise reproduced independently, before it goes to an engineer

Architect/Design ruled that `ABC-042`'s correct build **reds a merged licence guard**, and measured
it out of tree. That ruling now sits in `A12` and tells an engineer to expect a red and not to
"fix" it. **A claim that pre-authorises a red is exactly the claim that must not be taken on trust**,
so I reproduced its premise from the merged tree. I did not rebuild Architect's three-way matrix —
that is their measurement — only the facts it rests on.

| premise | measured at HEAD | verdict |
|---|---|---|
| the seam may not import the history module | `src/render-seam.test.ts:299` asserts `source` does **not** contain `from "./history.ts"` | ✅ holds |
| …and not even type-only | same test's comment: *"not even a type-only one, because `RenderSeam` already carries `GameHistory` in"* | ✅ explicit |
| the seam therefore takes a history in | `src/turn-loop.ts:97-102` — `RenderSeam = (history: GameHistory, status: GameStatus, thinking, messages) => readonly string[]` | ✅ holds |
| the seam does not import it today | `src/render-seam.ts:41-45` — five imports, none of them `./history.ts` | ✅ holds |
| the licence is a one-element list | `src/history-pane.nfr.test.ts:213` — `LICENSED_DRIVERS = ["turn-loop.ts"]` | ✅ holds |

**The conclusion follows and I accept the ruling.** The entry point must obtain a `GameHistory` to
call the seam; the seam is forbidden to obtain one; so the entry point imports `newGame` from
`src/history.ts` directly and becomes a **second runtime importer** of that module while the licence
names one. The red is structural, not a mistake, and `A12` bounds the repair to one array element
plus its citation.

**One thing I checked that could have refuted it, and did not.** The comment above `LICENSED_DRIVERS`
(`:205-212`) says *"THE LICENCE IS FILTERED TO THE ENTRIES THAT EXIST, so a driver that has not been
built yet is vacuous rather than red."* That filter runs in the direction of a **licensed** name
whose file is absent — it cannot absorb an **unlicensed** importer that is present. It therefore does
not soften the red `A12` predicts.

**Consequence for the `Ready for Dev` exit, which is mine.** `A12` licenses exactly one edit to a
merged file under `src/`. That is a real widening of this ticket's blast radius versus the page as
cut, which forbade touching `src/` at all — and it is the reason `A10`'s deleted halves were
unbuildable rather than merely awkward. The widening is **bounded, cited and anticipated**, so it
does not by itself hold the exit; whether it survives the security re-check is Security/NFR's call,
and I have asked them specifically whether the delete lost a property.
