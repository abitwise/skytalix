---
id: 20260819T003500Z-qe-e2e-observation-A7-headroom-re-measured-W-is-21-but-the-wall-is-the-eighth-item-not-the-seventh-e6b81d40
kind: observation
by: qe-e2e
at: 2026-08-19T00:35:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - ABC-036
  - ABC-045
  - ABC-046
  - ABC-107
  - EPIC-002
  - EPIC-003
  - EPIC-006
  - src/frame.ts
  - src/command-input.ts
supersedes:
---

# `A7`'s headroom, re-measured independently — **`W = 21` is confirmed; "a seventh item overflows" is FALSIFIED.** The wall is the **eighth** item, and `ABC-036` does not hit it

The subtask asks me to confirm the engineer's headroom measurement and to say plainly whether
`ABC-036` is walking into `ABC-107`'s failure mode in a second place. I measured it myself, with a
throwaway probe driving the **delivered** `assembleFrame` at the **delivered** panel width (written,
run, deleted; tree verified clean).

## The measurement

Message region read exactly as `A7`'s own guard reads it —
`frame.slice(len - PROMPT_ROWS - MESSAGE_ROWS, len - PROMPT_ROWS)` — at the **start position**, which
the engineer names as the narrowest frame this project draws (empty history pane, no claim cell).

**`W` = 21 columns. CONFIRMED**, on both rows of the region.

The delivered `help` at the delivered table:

```
row 0: "commands: help board "   (20 of 21 used)
row 1: "quit claim           "   (10 of 21 used)
```

## The ladder — where the wall actually is

Adding short tokens one at a time (`moves`, `undo`, `new`, `resign`, …) to the five delivered items:

| items | tokens | region rows | hidden marker | overflows |
|---|---|---|---|---|
| 5 | 4 (delivered) | `commands: help board` / `quit claim` | — | no |
| 6 | 5 (`+moves`) | `commands: help board` / `quit claim moves` | — | **no** |
| **7** | **6 (`+undo`)** | `commands: help board` / `quit claim moves undo` | — | **NO — fits, at exactly 21/21** |
| **8** | **7 (`+new`)** | `commands: help board` / `quit claim (+3 more)` | **`(+3 more)`** | **YES** |
| 9 | 8 | … | `(+4 more)` | yes |
| 10 | 9 | … | `(+5 more)` | yes |

**The engineer's specific claim — *"A seventh item, or any token longer than about five characters,
overflows and `A7` goes red"* — is wrong in both of its clauses:**

1. **A seventh item does NOT overflow.** `commands: help board` / `quit claim moves undo` is
   `4+1+5+1+5+1+4 = 21` — it fits at **exactly** the width, hidden count 0. The **eighth** item is
   the first that overflows, and when it does it drops **three** items at once (the packer places an
   item whole or not at all, and reserves room for the marker on the last row).
2. **Token length alone does not decide it.** I substituted a 9-character token for `claim` at the
   delivered item count (`commands: help board` / `quit surrender`) — **no overflow**, because row 1
   has 11 columns spare. The binding constraint is a **packed character budget across two 21-column
   rows with whole-item wrapping**, not an item count and not a token length.

**So the headroom is TWO more short tokens, not one.** The engineer under-counted by one. That makes
the position slightly *better* than reported — and it does not make it comfortable, because the
seventh item lands on 21 of 21 with **zero columns of slack**: at 7 items, changing `undo` to any
5-character token overflows immediately.

## `ABC-036` — the plain answer

**No. `ABC-036` alone does not walk into `ABC-107`'s failure mode.** Adding `moves` makes six items
and the region still hides nothing. `A7`'s guard will stay green through that ticket.

**`EPIC-006` does, and the trip-point is nameable today.** `ABC-045` adds `resign` and `ABC-046` adds
`quit`-with-confirmation and `new` — both tickets say in `plans/traceability.md` that they add rows
to *this ticket's delivered command module*. `moves` + `resign` + `new` is nine items. **The failure
lands on the second token added after `ABC-036`, whichever it is.**

## Whether this is `ABC-107`'s failure mode — yes, and in one respect worse

`ABC-107` is the same defect: the 2-row message region packs `(+N more)` for what it cannot fit, the
player has no way to see the rest, and nothing scrolls, pages or re-prompts. Its measured wall is
**6 candidates is the last size that fits**; mine is **7 items is the last size that fits** — the
same budget, differing only because SAN candidates are longer than command tokens.

**The respect in which this instance is worse is worth stating plainly.** `ABC-107` fires on a rare
position (seven identical pieces attacking one square). This one would fire on **`help`** — the
command whose entire purpose is to enumerate the vocabulary — **deterministically, on every
invocation**, from the day the table reaches eight items. A player typing `help` would be told there
are three commands they may not see, by the feature that exists to tell them what the commands are.
It also silently falsifies `A4` in spirit (*"`help` names every token in the table"*) while `A4`'s
own guard stays green, because `A4` asserts over `helpMessages()` and not over the rendered region.

`A7`'s standing instruction is the mitigation and it is already written on the page: **shorten the
help, never widen the frame** — widening breaks `EPIC-002` acceptance `4a` (identical row count on
every frame). Option 3 on `ABC-107`'s page (a narrower rendering) is the analogous move here and it
would likewise **move the threshold rather than remove it**.

## What is guarded and what is not

- **Guarded:** `A7`'s row asserts hidden count 0 at the *delivered* table, at two positions. It is a
  **real tripwire** — the ticket that adds the eighth item will go red rather than ship a silently
  truncated `help`. That is the outcome `A7` was written for and it works.
- **NOT guarded, and this is the handoff fact:** nothing anywhere records **where the wall is**. The
  guard says "today's table fits"; it does not say "7 items is the maximum". The ticket that trips it
  will have to re-derive the boundary from scratch, exactly as this hop did. A single row asserting
  the region overflows at 8 items would pin it — cheap, and it is `ABC-036`'s natural home since that
  ticket must re-measure its `A7`-equivalent anyway.

## Recommendation (routed, not ruled)

1. **`ABC-036`** — proceed; its `A7`-equivalent must be **re-measured, not assumed**, and it will
   pass. Ask it to pin the boundary while it is there.
2. **`ABC-045` / `ABC-046`** — carry this measurement onto both pages **before** either is pulled.
   The second of the two to land overflows `help`.
3. **`ABC-107`** — this is a **second instance of the same underlying defect** and the two should be
   decided together. `ABC-107`'s Architect/Design hop already owns four options for the frame's
   overflow behaviour; whichever is chosen governs `help` too. Recording it against `ABC-107` is the
   Orchestrator's/BA-PM's call, not mine — I do not cut tickets and I do not move columns.

**I do not rule the `EPIC-002` `4a` constraint or any NFR bar here.** `A7` is an acceptance criterion
of this ticket and it is **MET**; the overflow is a future-ticket exposure, not a defect in the
delivered build.
