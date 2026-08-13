---
id: 20260813T120000Z-ba-pm-decision-the-ordinal-claim-is-confirmed-the-audits-remedy-is-refuted-and-the-repair-has-a-live-home-7c4d1e93
kind: decision
by: ba-pm
at: 2026-08-13T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-039
  - ABC-009
  - ABC-011
  - ABC-016
  - ABC-019
  - ABC-025
  - plans/board.md
  - plans/metrics.md
  - plans/tickets/history/ABC-009-board-history.md
  - plans/tickets/history/ABC-011-board-history.md
  - plans/tickets/history/ABC-016-board-history.md
  - plans/tickets/history/ABC-019-board-history.md
  - plans/tickets/history/ABC-025-board-history.md
  - plans/tickets/ABC-039-backward-move-ordinal-register.md
supersedes:
---

# The ordinal claim: CONFIRMED on its core, its REMEDY refuted, and the repair has a live home the brief did not list

> **Hand-authored, no stamp.** No `scripts/context-io.ts` in this repo or the kit (re-verified this
> hop: no `scripts/` directory in either), no `mcp__grugops__propose_note` in this session,
> `human_admission` is `off`, no `§14-gate` verdict under this task. **No `finding` on this hop** —
> every measurement below is recorded as `decision` or `observation`, which is the honest kind. The
> brief forbade `kind: finding` and an invented stamp, and nothing here works around that.

## The verification I was asked to do: CONFIRMED

The delivery audit recorded this as a `claim`, and the brief was right to make me re-check it rather
than inherit it. **Its core is true, and I verified it at source on `06c5427`, not by re-reading the
audit.**

`plans/tickets/history/ABC-011-board-history.md:1338-1342`:

```
SENT BACK 2026-08-03 by the Orchestrator on the project owner's explicit instruction: "fix the
  medium defect before merging". ABC-011 moved Ready for UAT -> In Design. ...
  THIS IS A BACKWARD MOVE AND IT IS RECORDED AS ONE.
```

`plans/tickets/history/ABC-009-board-history.md:814` labels a **2026-08-09** move *"FIRST BACKWARD
MOVE IN THIS PROJECT'S HISTORY"*. **2026-08-03 precedes it by six days. The label is false.**

## The correction: the audit's REMEDY does not work, and that is the more useful result

The audit wrote *"every ordinal after it is off by one"* and *"Next action: one correcting line."*
**Both are wrong, because there are TWO independent defects and the audit found one.**

**(b) THE DOUBLE-BOOKED SECOND.** Two different moves, two different dates, both labelled
**"SECOND"**:

| file:line | label | labels the move | date |
|---|---|---|---|
| `…/ABC-025-board-history.md:37` | *"the SECOND backward move in this project's history"* | `ABC-025` `Ready for UAT` → `In Development` | **2026-08-10** |
| `…/ABC-019-board-history.md:24` | *"the SECOND backward move in this project's history"* | `ABC-016` `In Review` → `In Development` | **2026-08-11** |

It is **not a typo — it is a dropped move.** The 2026-08-11 author shows the arithmetic in the same
sentence (`…/ABC-016-board-history.md:52`, *"the THIRD backward move … and BOTH concurrent tickets
have now made one"*), which only reaches `THIRD` by counting `ABC-009`=1, `ABC-016`=2, `ABC-019`=3
and omitting `ABC-025`'s 08-10 move entirely.

**Therefore a uniform `+1` leaves the series reading `2, 3, 3, 4` — the collision survives it.** One
correcting line cannot repair a series that double-books a position. The correction requires an
actual chronology, which is why `ABC-039` is `S` and not `XS`.

## Where the repair belongs — and the brief's three options were missing the answer

The brief offered: *the board history files, `plans/metrics.md`'s rework row, or nowhere.* **I
checked all three and then found a fourth, which is the right one.**

- **`plans/metrics.md`: VERIFIED ALREADY CORRECT — it needs no repair.** Its Rework row (`:23`)
  carries `ABC-011` at 08-03 **and** `ABC-009` at 08-09, and already flags this defect with an
  owner. It is the one record in the project that got this right. (Also out of bounds for me, but
  the measurement is the reason, not the boundary.)
- **The board history files: FORBIDDEN, and correctly so.** Seven of the eight statements are
  archived `_Updated:` headers belonging to `ABC-009`, `ABC-016`, `ABC-019` and `ABC-025` — all in
  `Done`. Editing them would rewrite a merged record, against this project's own standing rule.
- **"Nowhere" — which is where I was heading until I measured the board.**

**`plans/board.md:185` carries a LIVE, false ordinal**, in the `ABC-009` row of the `Done` column:

```
**FIRST BACKWARD BOARD MOVE IN THIS PROJECT'S HISTORY** — Ready for UAT -> In Review on 2026-08-09
```

**That is where the repair belongs.** `AGENTS.md` has every role read `plans/board.md` on start, so
this false sentence is read by every hop, not by an archaeologist. It is also **the Orchestrator's
file**, so `ABC-039` specifies the exact one-clause edit and routes it rather than taking it.

**The precedent is this project's own, not something I invented:** `ABC-030` § *Security / NFR
triggers* — *"`ABC-028` is in `Done` and is not re-opened, so the two false sentences on that page
stand as a closed record and the correction is applied here, where the clause is still live."*
Same rule, applied to ordinals.

**Had I stopped at the brief's three options I would have ruled "nowhere" and been wrong.** The
lesson is the one this project keeps re-learning: check the live file, not only the archive.

## What the repair must NOT touch

The seven archived statements (`…/ABC-009…:17`, `:451`, `:786`, `:814`; `…/ABC-025…:37`;
`…/ABC-019…:24`; `…/ABC-016…:52`), every `Done` ticket page, every ADR, `plans/metrics.md`
(already correct), and anything under `src/`. **`ABC-009`'s own file holds FOUR of the eight and a
single grep finds one** — three are lowercase or parenthesised.

## Two bounds that keep this ticket small

1. **The series is CLOSED.** `plans/metrics.md:23` counts 13 backward moves across 9 tickets; only
   **four** were ever labelled and **none after 2026-08-11** — the practice was abandoned. Nobody is
   being signed up to maintain a counter.
2. **I ruled the counting basis rather than leaving it open**: the unit is the individual backward
   **column move**, counted chronologically — already the project's live definition, since
   `plans/metrics.md` reports moves and tickets as separate numbers. An unstated basis is exactly
   the DoR item-4 failure this project keeps paying for; two readers would have built two registers.

**Eight of the thirteen move dates are `UNKNOWN - verify`** and are the hop's work, not a blocker —
the sources are named on the ticket and reading them requires no decision from anyone.

## Scope refused

**19 claims of the form *"in this project's history"* exist across `plans/`** — 8 are this
backward-move series, **11 are other claims** (*the first FAIL*, at `plans/board.md:177` and also
live; *the second design hop*; *first entry to a column*). **They are unaudited and `ABC-039` does
not audit them.** A general ordinal register is unrequested and unmeasured. If it is wanted it is
its own ticket with its own measurement.
