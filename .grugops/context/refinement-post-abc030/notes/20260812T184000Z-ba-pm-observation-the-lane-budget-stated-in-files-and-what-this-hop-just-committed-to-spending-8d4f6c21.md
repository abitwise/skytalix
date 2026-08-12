---
id: 20260812T184000Z-ba-pm-observation-the-lane-budget-stated-in-files-and-what-this-hop-just-committed-to-spending-8d4f6c21
kind: observation
by: ba-pm
at: 2026-08-12T18:40:00Z
verified_by:
confidence: medium
refs:
  - NFR-008
  - N8-LANE
  - ADR-0008
  - ABC-026
  - ABC-031
  - ABC-032
  - ABC-033
  - ABC-034
  - ABC-035
  - ABC-036
  - ABC-037
  - ABC-038
  - plans/nfr-catalog.md
supersedes:
---

# The budget in **FILES**, not percent — because a percentage is not actionable at a cutting hop and a file count is. **This is arithmetic over published measurements. It is NOT a new measurement and it does not discharge `H5`**

> **Hand-authored, no stamp.** No `scripts/context-io.ts`, no `mcp__grugops__propose_note`,
> `human_admission` `off`, no `§14-gate` verdict under this task — **no `finding` on this hop**.
>
> **`confidence: medium`, deliberately lower than my other notes on this hop, and here is exactly
> why.** Every input below is a figure somebody else measured and published; the only new thing is the
> division. **I did not re-measure the lane — that is `ABC-026`'s job, it is `H5`, and it is
> `UNKNOWN - verify` past two merges.** The precedent for this posture is `EPIC-002`'s `NFR-002` note:
> *"This is BA/PM arithmetic over someone else's measurement, not a new measurement."*

## The inputs, each with its source

```
NFR-008, ratified 2026-08-11 by Olger Oeselg directly    <= 3 s WALL and <= 13 s CPU
                                                          (npm test, PERFT_DEEP unset)
lane CPU published at ABC-028's merge hop                 8.82 - 8.85 s
lane WALL published at the same hop                       1.63 - 1.74 s
per-file floor (plans/nfr-catalog.md)                     CPU = 0.85 s + 159 ms x files, R^2 0.9999
                                                          use 160 ms; band 100-229 ms in the real lane
N8-LANE per-ticket share                                  5% of the TOTAL = 650 ms CPU
```

## The arithmetic

```
CPU headroom      13 s - 8.85 s          = 4.15 s
files it admits   4150 ms / 160 ms       = ~26 more test FILES
        band      4150 / 229 = 18   ...   4150 / 100 = 41
```

**The 13-second CPU clause admits roughly 26 more test files, band 18 to 41.** That is the number a
cutting hop can actually use, and it is the number I used.

## What this hop committed to spending

**Eight tickets, and I priced each one on its own page rather than in aggregate.** Every one implies
**one** new test file and **none** implies a `*.nfr.test.ts`:

```
ABC-031  1 file    ABC-035  1 file
ABC-032  0-1 file  ABC-036  1 file
ABC-033  1 file    ABC-037  1 file
ABC-034  1 file    ABC-038  1 file
                   ------------------
                   7-8 files = 1.12 - 1.28 s CPU at 160 ms
                             = 8.6 - 9.8% of the 13 s clause
                             = 27 - 31% of the remaining headroom
                             leaving ~18-19 files after EPIC-003
```

**`ABC-010`, already under this epic, is expected to add 0** — its table tests belong in the existing
`src/fen.test.ts`.

## The design choice that kept the bill down, and it was a design choice

**Not one of the eight tickets adds a `*.nfr.test.ts` file.** That was not luck. A second file per
ticket is forced by a **hoisted `vi.mock` factory**, which re-routes the module graph for every test in
the file it sits in — that is the reason all four existing `*.nfr.test.ts` files exist, and the reason
`ABC-030` exists to fix their comments. **So every call-count property in these eight tickets is
written to be observable WITHOUT a module mock:**

- `ABC-031` `A6` — a caller-supplied `legal` array plus **reference identity**. A function that
  generated its own list returns a reference-distinct object and fails. `ADR-0004`'s own falsification
  argument, reused as a call-count guard with no spy at all.
- `ABC-033` `A5`, `ABC-035` `A2`/`A3`/`A6`, `ABC-036` `A4`, `ABC-037` `A4`/`A5`/`A7`, `ABC-038` `A3` —
  `vi.spyOn` over an **injected seam**, not a hoisted mock.

**Had each ticket taken the four existing files' shape, this epic would cost 14–16 files instead of
7–8** — roughly 2.4 s CPU, more than half the remaining headroom, on a lane whose total is
`UNKNOWN - verify`.

## What I refused to do

- **I did not re-measure the lane.** `H5` is owed past two merges, `ABC-026` owns it, and the previous
  hop's Security/NFR refused even `ADR-0008`'s cheap clauses because a QE hop was live on the same
  cores. **That refusal was right**, and I did not quietly take the measurement it declined.
- **I did not quote the Orchestrator's `npm test` reading as a median.** It was one run, 1.59 s wall,
  and it is quoted as one run everywhere I used it.
- **I did not invent a tighter per-ticket bar for any of the eight.** `N8-LANE`'s rule is that a
  ticket may state a tighter bar and may never state a looser one; **every one of the eight cites
  `N8-LANE` by name with its number and states no tighter bar.** Re-deriving a lane bar per ticket is
  the practice `ABC-026` exists to end, and it has already cost this board two ruling hops.

## One consequence for `ABC-026`, routed into its acceptance criteria

**A budget expressed only as a percentage cannot be checked at a cutting hop, and this is the hop that
proves it** — I needed a file count and had to derive one. So `ABC-026`'s new `A2` requires the record
to state **how many more test FILES the CPU clause admits, with its band and the arithmetic shown**.
The estimate above is what a BA/PM can produce from published figures; `A2` replaces the 8.85 with a
measured number and the estimate with a reading.
