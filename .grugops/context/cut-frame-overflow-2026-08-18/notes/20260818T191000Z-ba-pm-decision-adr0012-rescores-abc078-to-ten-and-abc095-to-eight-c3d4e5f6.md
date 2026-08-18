---
id: 20260818T191000Z-ba-pm-decision-adr0012-rescores-abc078-to-ten-and-abc095-to-eight-c3d4e5f6
kind: decision
by: ba-pm
at: 2026-08-18T19:10:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - ABC-095
  - ADR-0012
  - EPIC-004
  - EPIC-005
supersedes:
---

# `ADR-0012` re-scored two pages: `ABC-078` → **10/10**, `ABC-095` → **8/10 ⚠️x2**

`ADR-0012` is `accepted` and merged (`3f73d7e`): the book is a **decorator** of `EngineSeam`
(`EngineSeam → EngineSeam`), built by `EPIC-005` as a separate module, wired by `EPIC-006`'s
composition root; the **seam-widening shape was rejected**; `src/turn-loop.ts` is unmodified.
Architect/Design recorded it on both pages and left the scoring to this pen. This is that scoring.

## `ABC-078`: 9/10 ⚠️x1 → **10/10, 0 ⚠️. Discharged by RULING, not by a merge**

⚠️(5) was *"the `EPIC-005` composition point is a cross-epic contract question with no owner"*. It
now has an answer, and the answer costs this ticket nothing: **no criterion on the page changed**.
`A6`'s byte-identical pin on `src/turn-loop.ts` stands verbatim and is **strengthened in role** — it
is now the criterion that protects the composition point. The forward rework risk the ⚠️ carried is
what is gone: **the contract change it feared cannot arrive, because the shape that would have
caused it was rejected.**

I also **struck the stale sentence** Architect/Design left me: *"Owner: whoever decides the
`EPIC-005`/`EPIC-004` composition point."* It is struck in place, with the reason, not deleted — the
composition point has an owner and a ruling.

**`A1` is NOT re-scored here and I did not rule on it.** It came back not literally met on delivery
(worst case **3027 ms**, **29/30** over the 3 s clause by ≤ 27 ms, **0/30** over the 5 s ceiling).
That is an **`NFR-004` bar**, it is **Security/NFR's at the gate after QE**, it is not a DoR item,
and it does not move this score. Recording the boundary explicitly on the page so the next reader
does not mistake a 10/10 DoR for `A1` having been accepted — **it has not been**.

## `ABC-095`: 7/10 ⚠️x3 → **8/10 ⚠️x2. One discharged, two half-discharged, and a half is not a ✅**

- **⚠️(5) → ✅.** All three named unknowns are answered: **(a) the id is `ABC-078`**; **(b)
  wrappable from outside: YES** — `EngineSeam` is a function type and `ABC-078` `A6` requires
  assignability; **(c) spy-able: YES** — the inner seam is an argument, so `A1`/`A3` count calls with
  a stub and need no module mocking. **`A6` cannot fire.** No id was guessed at any point; the ADR
  supplied it, which is what the cut-hop's refusal to guess was holding out for.
- **⚠️(10) STANDS, reduced from two blockers to one.** Blocker (b) — *where the short-circuit lives*
  — is closed. Blocker (a) is not: **`ABC-078` is `In Review` and unmerged**, and `ABC-093` /
  `ABC-094` — the artifact and the probe, both hard blockers on the page — are **unbuilt, in
  `Backlog`**. Nothing to wrap, nothing to probe with. **The ruling moved the architecture question,
  not the build order**, and scoring it as ✅ would make the board claim this is pullable.
- **⚠️(3) STANDS**, same reason: still not independent, now of three merges rather than of an unmade
  decision.
- **Item 8's conditional IS discharged.** `S` was priced on the assumption of a wrappable function
  seam; the ADR rules that true, so the re-size trigger (*"a seam this ticket must reach inside"*)
  cannot fire. `S` stands unconditionally.
- **Recorded, not scored:** `ADR-0012` clause 6 flags that one of this ticket's "two or three call
  sites" is `ABC-043`'s composition root, which does not exist. That blocks **`EPIC-005`'s user
  value**, not this ticket's criteria — a distinction worth keeping, because collapsing the two is
  how the board starts lying about what an epic delivers.

**`G3` on the `epic-to-tickets-EPIC-005` gaps note is CLOSED by this hop**, on the board row and on
the ticket page.
