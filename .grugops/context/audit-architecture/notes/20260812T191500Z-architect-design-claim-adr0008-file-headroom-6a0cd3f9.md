---
id: 20260812T191500Z-architect-design-claim-adr0008-file-headroom-6a0cd3f9
kind: claim
by: architect-design
at: 2026-08-12T19:15:00Z
verified_by:
confidence: medium
refs:
  - arch-audit-2026-08-12
  - ADR-0008
  - NFR-008
  - ABC-026
  - plans/nfr-catalog.md
supersedes:
---

# How many more test FILES fit under the ratified budget: ~14 planning, ~27 ceiling — and CPU binds, not wall

> **Hand-authored, not a `finding`.** `confidence: medium` **because today's CPU total is an
> INFERENCE, not a reading.** **The lane total was deliberately NOT re-measured** — `ABC-026`'s `H5`
> owns that measurement, it is `UNKNOWN - verify`, it has been owed past two merges, and running it
> here would collide with open work. Every figure below is arithmetic on numbers already recorded in
> `plans/nfr-catalog.md`.

## The inference, stated so it can be attacked

`nfr-catalog.md` records the lane at **22 files / 7.640 s CPU / 1.765 s wall**. `src/` now holds
**28 test files** (counted). At the catalog's own **160 ms CPU per file**, six added files put the
floor account **+0.96 s → an inferred ~8.6 s CPU**, band **8.24–9.01 s** across the recorded
100–229 ms marginal range.

**Two honest caveats.** Test *content* added since is not in that number (tests are near-free —
0.35–0.43 ms each — so it is small but not zero), and the catalog itself warns the same tree drifted
**+22% inside one hour** under load. **Absolutes here are session properties; the ratios are what
replicate.**

## The headline: the CPU clause binds first, and the wall framing understates the problem

| clause | consumed | note |
|---|---|---|
| wall, 3 s | ~53–59% | the figure usually quoted |
| **CPU, 13 s** | **~66%** | **the one that binds** |

**A test FILE is a CPU phenomenon, not a wall phenomenon** — the catalog measured wall moving
**−15 to +3 ms** per added file (indistinguishable from zero) against CPU moving **100–229 ms**.
**Reading headroom off the wall clock therefore overstates it**, and that is the correction worth
carrying forward.

## Headroom in the unit a ticket author spends

```
remaining CPU under the 13 s clause          ~4.4 s
files if each were EMPTY (floor only)          ~27      band 19-44
files at TODAY's all-in average (307 ms/file)  ~14      floor + content, today's own mix
tickets at N8-LANE's full 650 ms content each   ~6      before the floor those files also cost
absolute ceiling, CPU = 0.852 + 0.1593K         76 files total (zero content; unreachable)
```

**Use ~14 as the planning number and ~27 as the hard ceiling.** `EPIC-003` (M) and `EPIC-004` (L)
are both file-adding, and `EPIC-002` — the one epic this board has decomposed — produced **nine
tickets**. **The budget does not comfortably admit both epics at today's per-file cost.** That is
`ADR-0008`'s own *"tight, not comfortable"* verdict restated six files later and closer to the wall,
**not** a new alarm.

## Is `pool: "threads"` the right lever? Yes — and it is not enough on its own

**It is the right lever.** It is the only measured saving that touches **no guard**:
**−13.97% wall / −10.78% CPU** for a two-line config change (and there is **no `vitest.config.ts`
today**, so it really is two lines). The larger lever, `--no-isolate` at −30–36% CPU, is
**unavailable**: it is green in only 4 of 21 runs and fails exactly in the spied call-count files —
**the lane's dominant cost is buying the module-registry isolation this project's guards depend on**,
which is the most important sentence in `ADR-0008` and it is unchanged.

**But threads buys ~0.8 s CPU ≈ 5 more test files.** It moves the ceiling from ~14 to ~19 planning
files. **It is a one-time discount, not a change in the slope** — the per-file floor is still the
structural driver afterwards. **Anyone treating threads as "the answer" will be back inside two
epics.**

**NOT adopted here, and deliberately.** `ADR-0008` Decision 8 hands it to **`ABC-026`'s development
hop** with a required screen, owner Architect/Design. **An audit does not adopt a runner change**,
and *"green 24 times"* is precisely the evidence `--no-isolate` produced before it was caught.

## The one actionable defect found: the screen's census is stale

Decision 8's screen says **"all four `*.nfr.test.ts` files"**. **There are seven.** The four were
correct at authoring (2026-08-10: `gameend`, `zobrist`, `glyph-mode`, `san`); `history-pane`,
`status-panel` and `turn-loop` landed **2026-08-11**, the day it was ratified. **Whoever runs the
screen must read it as "every `*.nfr.test.ts` file".** Recorded in `plans/nfr-catalog.md`; **no target,
bar or level moved** (eight rows hash-verified byte-identical, `sha256 325c5c03…f6d4`) and
**`ADR-0008` was not edited**.

## What I did not do

**No lane measurement, no median, no interleaved harness, no `npm test` timing recorded as a lane
figure.** The suite was not run at all in this worktree — `node_modules` is not installed here — so
**the brief's 807/807 green is NOT independently confirmed by me** and remains the Orchestrator's
single-run reading. Nothing in this audit depends on it: every structural finding came from source
text and the module graph.
