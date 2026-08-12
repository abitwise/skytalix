---
id: 20260812T064800Z-ba-pm-decision-dor-rescore-10-of-10-and-the-anti-smoothing-check-e12d53f6
kind: decision
by: ba-pm
at: 2026-08-12T06:48:00Z
verified_by:
confidence: medium
refs:
  - ABC-028
  - ABC-029
  - ABC-019
  - ABC-024
  - ABC-026
  - EPIC-002
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# DoR RE-SCORE: 10 of 10 MET — 9 `✅` and 1 `⚠️` (item 3). Size `S` and priority `P1` both re-derived and both HOLD

> **Hand-authored, no stamp**, and deliberately **`confidence: medium`, not `high`** — unlike the
> criterion note, this one contains **one item scored by judgment rather than by measurement** (item 3),
> and it is flagged as disputable in the ticket. Nine items are scored on evidence; one is a call.

## The score

| # | item | cut | **now** |
|---|---|---|---|
| 1 | problem clear — user, pain, value | ✅ | **✅** |
| 2 | scope and out-of-scope clear | ✅ | **✅** |
| 3 | INVEST-shaped | ⚠️ | **⚠️** ← **THIS IS THE `⚠️`** |
| 4 | acceptance clear, testable + measurable | ❌ | **✅ CLEARED** |
| 5 | dependencies known | ✅ | **✅** |
| 6 | security/NFR triggers, each measurable | ✅ | **✅** |
| 7 | test notes present | ✅ | **✅** (seven → ten) |
| 8 | size assigned | ✅ | **✅** (`S`, re-derived) |
| 9 | priority assigned | ✅ | **✅** (`P1`, re-derived) |
| 10 | no major unresolved blocker | ✅ | **✅** |

**The board row does not name which item the `⚠️` is; the ticket now does, and so does this note.**
**It is item 3, INVEST-shaped, on the *independent* facet ONLY.** *Valuable*, *negotiable* and *small*
are clean; *estimable* got **stronger** (the instrument is built, run and costed rather than
hypothesised); *testable* now covers **all four** criteria, up from three of four. *Independent* is
still not clean because `A2` touches `src/history-pane.nfr.test.ts:104-112` — located criterion by
criterion in the sibling `observation` note.

**Item 4 cleared** because `A4` now names an exact fixture (`LENGTH_CASES`,
`src/history-pane.test.ts:139-154`), exact expected values (`0` writes, samples `> 0`, byte-identical
render), **seven** named discriminating builds with required verdicts, and the lane each dies in
(`1 failed, 747 passed` per wrong build against `748 passed (748)`; `tsc` 0; biome clean; 26 files;
skip 0; zero pre-existing failures).

**The route's own condition, checked on its own terms.** The cutting hop wrote *"demonstrate an
instrument that discriminates all five builds in `A4`, or split `A4` off"*. **All five die**
(`WFENMID`, `WPOSMID`, `WBOARDMID`, `WMOVESWAP` newly; `WSPLICE` stays dead), plus two more.
**`WBOARDBLIND` is NOT one of the five** — QE built it after the five were dead, to locate the
boundary. **The split branch is therefore not taken**; `A1`–`A4` stay one ticket.

## Why the `⚠️` does not block, stated rather than assumed

The cutting hop's own *"Route to `Ready`: one item"* named the `❌` and **did not route through item
3** — a documented prior decision of this ticket, not a ruling invented under pressure at this hop.
`ABC-029` reached `Ready` on 2026-08-12 carrying the **same `⚠️`, on the same facet, for the same
file**, so scoring it blocking here would retroactively invalidate that promotion. **Flagged as the
one judgment call on the page: if a reader scores item 3 `❌`, `ABC-028` returns to `Backlog`.**

## THE ANTI-SMOOTHING CHECK — direction of travel, counted

**The pressure is real and named: `ABC-019` is `P0` and waits on this ticket and then `ABC-029`.**
`ABC-024`, `ABC-026`, `ABC-029` and this ticket's own first cut all recorded NOT MET and stayed put.

**13 obligations ADDED. 1 REMOVED.**

**Added:** (1) reported-write count **exactly `0`**, at the instant of the write; (2) a **second
independent detector** — 128 board bytes re-compared at every access; (3) the arming **counter `> 0` at
every one of the ten lengths**, which the old text did not require; (4) a **tripwire** — the instrument
must change no rendered byte; (5) arming **PER SLOT across eight named slots** where the old text said
*"a control"*; (6) a **positive control**; (7) **two new discriminating builds**, `WBOARDSET` and
`WBOARDBUF`, **both surviving 744/744 today**; (8) coverage **extended** to `castling`, `epSquare`,
`halfmoveClock` and every `Move` field; (9) **`RISK-ABC028-01`** recorded in the ticket with a standing
re-run obligation; (10) **three new test notes** (8, 9, 10); (11) `A4`'s **lane delta with its three
limits**; (12) **sequencing evidence** locating `A2`'s shared-file touch; (13) a **size condition named
in advance**.

**Removed — one, and it is published rather than buried:** the **absolute** *"no reachable slot differs
at any point during the render"*. `A4` no longer claims to catch a board mutation applied and reverted
through an `ArrayBuffer` alias with no intervening graph access. **Removed because no instrument can
hold it for a synchronous callee**, not because it was inconvenient: three closures were rejected with
reasons and **one of them — copying the `ArrayBuffer` — would report GREEN on the wrong build.** *A
false negative is worse than a stated limit.* The hole is named, witnessed and given a standing re-run
obligation, and **the build it gives up on is not one of the five the criterion names.**

**Counterfactual: would item 4 have cleared with no `P0` behind it? YES.** It failed because the
instrument was undemonstrated and the obvious candidate was measurably unavailable. An instrument was
then **built and run**, reproducible from `artifacts/`. That is a defect repaired, not a bar lowered.

**What was NOT taken on trust.** QE's results are `claim` / `observation` — **no §14 gate ran,
`human_admission` is `off`, nothing backing this score is a stamped `finding`**, and the ticket says so
in those words. Two load-bearing facts were re-checked **at source** at this hop rather than read out
of a note: `src/position.ts:76` reads `new Uint8Array(128)`, and the shared file's line map
(`:103-112` comment, fixtures from `:113`). The DoR asks for criteria that are testable, not for
gate-stamped evidence; **the stamp falls due at the build hop's gate, which is `blocking`.**

## Size `S` (2) — re-derived, with the counterweight recorded

`A4`'s **text** grew; the **work shrank in risk**, which is what a size prices. The largest unknown —
*build an instrument that discriminates all five builds* — is now solved with a ~125-line worked
reference that typechecks 0, lints clean, **adds no file, module or dependency**, and costs nothing
measurable in the lane. Everything else is unchanged: two existing files, zero production lines, zero
new modules, zero new test files, zero new dependencies, no architecture change. `ABC-024` (`S`)
remains the closest calibration.

**The honest counterweight: had the instrument stayed undemonstrated I would have argued `M` at this
hop.** An unestimated invention risk in the middle of a ticket is exactly what a size exists to price,
and *"`S`, and by the way nobody knows if the central criterion is buildable"* is the smoothing move in
the size field rather than the DoR field. **`SPLIT_REQUIRED` still does not apply** (bites at `XL` = 8;
this is 2). **Condition named in advance that would move it:** a new module or file, or any criterion
forcing a production line — which fires Security/NFR's stated threshold at the same moment.

## Priority `P1` — re-derived, and the `P0` behind it was NOT allowed to move it

- **Not `P0`.** Nothing is broken. The delivered pane is correct on **all seven** wrong builds now
  constructed against it; `src/history-pane.ts` md5 is still `54fd4346dcc1a0060c4e66ae0149265d`
  (re-checked at source this hop); no consumer observes any of it.
- **`ABC-019` being `P0` and waiting is scheduling pressure on the queue, not severity on this
  ticket.** Priority ranks the work, not the queue behind it. **Promoting to `P0` so that pulling it
  sooner looks justified would be the DoR-smoothing defect committed in a different field.**
- **Not `P2`.** The trigger is dated and is **nearer** than at the cutting hop: `ABC-029` moved
  `Backlog → Ready` on 2026-08-12 and is now a named, pullable ticket whose build hop edits guards
  ~120 lines below the comment. The trigger acquired a schedulable owner; it did not change in kind.
- The recorded counter-argument (`P2` is defensible if the Orchestrator judges `ABC-019`'s brief
  sufficient mitigation) **stands unchanged and was not quietly dropped.**

## Requested board move, and the front matter

**`Backlog → Ready` is REQUESTED, not taken.** `plans/board.md` was **not opened for edit** — it is
the Orchestrator's. `Ready` stands at **1/8**, so the WIP limit is not a constraint.

**The ticket's front matter deliberately still reads `status: backlog` / `column: Backlog`**, and the
ticket says why: a ticket header disagreeing with the board is the two-records-disagree defect this
project keeps paying for, so **the front matter moves when the board does, by the role that owns the
board.** This is the identical handling `ABC-029` received on 2026-08-12 and it is a deliberate
disagreement-avoidance, not an oversight.

**`Ready` is not `pull it now`.** The two build hops share one file and must not run concurrently; the
DoR does not override that, and the sequencing call is the Orchestrator's.
