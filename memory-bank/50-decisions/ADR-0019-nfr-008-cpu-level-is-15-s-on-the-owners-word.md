# ADR-0019: `NFR-008`'s CPU level is 15 s "for now", on the owner's word — the wall clause, the per-ticket bar and every instrument stay where they were

## Status

`accepted` — 2026-09-19, by Architect/Design at `ABC-110` (task `owner-rulings-2026-09-19`, subtask
`ruling-abc110-level-15s`), the owner of `NFR-008`, **recording a decision that is the project
owner's and not this role's.** Supersedes **`ADR-0014` on the LEVEL of the CPU clause only.**
`ADR-0014`'s measurement, its attribution of the gap to content, its reading rules and its
rejected alternatives all stand as history and are not re-derived here.

**Scope fence, first.** This ADR moves exactly one number — the CPU clause of `NFR-008`, 13 s → 15 s —
and it moves it because the owner said so, in words quoted below. **It does not touch the 3 s wall
clause** (the owner did not name it). **It does not move a test file between lanes** (lever (i) of
`ABC-110` is NOT taken). **It does not re-derive `N8-LANE`'s 5% or its 650 ms**, does not touch the
160 ms per-file floor, `N8-SPAWN`'s 0 ms, the CPU instrument, the paired-median statistic or the
identity null control. **`isolate: false` stays forbidden** — fourth time written into an ADR; see
`ADR-0008` decision 7 and `vitest.config.ts`'s own comment. Nothing under `src/` changed.

## Context

`ADR-0014` (2026-08-19) ruled `NFR-008`'s CPU clause **BREACHED at 14.480 s against 13 s** and named
the three ways out: an agent moving whole test files behind an opt-in lane (costs default-lane
coverage), re-deriving the per-ticket 5% (creates no headroom), or the owner moving his own level.
`ABC-110` was cut to size the agent's option and put the choice to the owner, and **`A5` fenced every
execution behind his verbatim, dated word.**

**The sizing was done first, as the ticket demanded.** QE measured `A1`–`A4` on 2026-08-20
(`.grugops/context/ticket-to-pr-ABC-110-a1a4-2026-08-20/notes/`, 150 runs, null control −0.34% at
6/8): the minimum whole-file set that closes the deficit is **two files** (`engine.test.ts` +
`perft.test.ts`, 2.550 s measured jointly) at a price of **12 acceptance criteria** leaving the
default lane; the largest single file falls 80 ms short. So the owner was shown a level against a
coverage price, with numbers on both sides, before being asked.

**The owner answered on 2026-09-19.** Six numbered questions were put to him in session; item 3 was
this one. His whole answer, verbatim and attributed, is transcribed in
`.grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md`.
The clause that decides this ADR:

> "3. raise to 15s for now"
> — Olger Oeselg, project owner, in session, 2026-09-19

**That is lever (ii) — the one `ABC-110` says is the owner's alone.** This ADR is the "HIS ADR
superseding `ADR-0014`, written on his quoted words" that `ABC-110` `## Out of scope` and
`ADR-0014` `## Rollback` both said would be the only legitimate carrier of a level move. **An agent
did not re-baseline a level; the owner moved his.**

**"For now" is load-bearing and is honoured as such** — the same way `ADR-0007` honoured "currently"
and "for now" on the deployment posture. It is a revisitable level with named triggers, not a
permanent one, and this ADR does not fill in a date he did not give.

## Decision

**1. `NFR-008`'s CPU clause is `≤ 15 s CPU (user + sys)` from 2026-09-19.** The `plans/nfr-catalog.md`
row carries the new figure, dated, citing this ADR, with the 13 s retained in the row's own text as
the level that held from 2026-08-11 to 2026-09-19. The row's derivation sentence for the 13 s
(3 s × the measured 4.15–5.07x CPU/wall conversion, low end) is **history**, not the derivation of
the 15 s — **the 15 s is the owner's figure and has no derivation other than his word.** Anyone who
wants to know why it is 15 and not 14 or 16 reads the quote, not this ADR.

**2. The WALL clause is `≤ 3 s`, UNCHANGED.** The owner named CPU and did not name wall. It stays
**UNRULED** — `ADR-0014` decision 2 refused to rule it on two samples that straddled 3 s, `ABC-111`
owns settling the warm/cold protocol, and **no wall figure this project produces, including the one
in this ADR's re-measurement, is a wall verdict until `ABC-111` `A4`/`A7` land.** Stated plainly
because the number reported below is large: it is REPORTED, not ruled.

**3. The CPU clause is RE-MEASURED under the row's own protocol at the new level, and it reads MET —
by 60 ms.** At `2c96dbd` (tracked tree; `src/` and every config file `git diff`-identical to that
commit), **40 test files / 1213 tests / skip 0**, contained lane `npx vitest run --dir src`, one
fresh OS process per run, condition order rotated every round, 9 rounds with round 0 discarded,
**n = 8**, every run asserting its own file and test counts, identity null control recorded first:

```
A   the lane          median CPU 14.940 s  (range 14.76-15.16)   median wall 4.385 s  (4.32-4.75)
N   byte-identical    median CPU 14.915 s  (range 14.69-15.21)   median wall 4.380 s  (4.31-4.61)
NULL CONTROL N-A      median -55 ms = -0.37% CPU, sign 3/8      -> <= 1.5%, sign at chance: ADMISSIBLE

NFR-008 CPU  <= 15 s  ->  14.940 s =  99.6%   UNDER by 0.060 s        <- MET, on the protocol median
             (vs 13 s ->  14.940 s = 114.9%   over by 1.940 s)         <- what the old level would read
NFR-008 WALL <=  3 s  ->   4.385 s = 146.2%   REPORTED, NOT RULED     <- ABC-111 gates this reading
```

Machine: Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / macOS 26.5.2 / Node v24.12.0
/ npm 11.7.0 / vitest 3.2.7 — **`UNKNOWN - verify` on any other hardware.** 1-min load average
before each run: min 4.02 / median 4.44 / max 7.46 — **not a quiet machine, and not claimed as one**;
sibling hops of this same wave were live. Raw per-run TSV, load log and the harness as text:
`.grugops/context/ruling-abc110-level-15s/notes/`.

**4. The verdict is MET and it is NOT ROBUST, and both halves are the decision.** The margin is
**0.4% of the level**, smaller than the instrument's measured load sensitivity (**+1.1%** across the
load rise inside this sample; +1.63% / −1.90% in `ADR-0014`'s). **4 of the 16 usable lane runs
individually read over 15 s** (15.16, 15.13, 15.04, 15.21) while both medians sit under. **A
slightly busier session reads BREACHED at the new level with the same tree.** The level the owner
gave is therefore **exhausted on arrival**: the lane grew from 39 files / 1181 tests to 40 / 1213
between `ADR-0014` and this reading (+1 file ≈ +370 ms all-in), and one more average test file puts
the median over 15 s.

**5. `N8-LANE` stays at 650 ms and stays denominated as it was — the owner moved the level, not the
per-ticket bar.** 5% of 15 s would be 750 ms; **that arithmetic is NOT run into the bar.** 650 ms is
retained as `ADR-0014` decision 4 left it, now reading as 4.33% of the level, and re-deriving the 5%
remains the row's standing, unexercised invitation. **No ticket's `N8-LANE ≤ 650 ms` line is re-cut.**
`ADR-0014` decision 4's rate-limit reading **lapses by its own rollback clause** — a conforming
reading has the lane under the (owner-moved) clause — **but the headroom it grants is 60 ms in
substance**, so the standing sentence is unchanged: write the measured milliseconds, then the ruled
clause state. `N8-LANE MET` still may not be written to mean "the lane is within budget"; it means
"under 650 ms", and the budget's state is whatever the last conforming reading says.

**6. Nothing else moved — verified, not promised.** `NFR-001`–`NFR-007`'s table rows are
byte-identical (hashed individually before and after); `NFR-008`'s row changed only in the level and
its dating; `src/` is byte-identical; `vitest.config.ts`, `AGENTS.md`, `package.json` untouched; no
test added, deleted, trimmed or moved between lanes (**1213 before and after, skip 0**);
`N8-SPAWN` stays 0 ms; the harness ran outside the repository and is not committed.

## Alternatives

- **Take lever (i) — move `engine.test.ts` + `perft.test.ts` behind an opt-in lane (QE's `OPT-1`,
  2.550 s, 12 criteria).** Measured, admissible, and **not taken, because the owner chose the other
  lever.** It stays on the table as the sized remedy if the 15 s is ever breached: the numbers are
  in QE's `A2`/`A4` notes and do not need re-measuring unless the lane changes shape.
- **Set the level at 5% headroom above the reading (≈ 15.7 s) or re-derive it from the wall clause
  (3 s × today's measured 3.41x = 10.2 s, which is absurd under load).** Rejected: **an agent does not
  pick a level.** The owner said 15 and 15 it is. The revisit triggers below are how "for now" is
  carried, not a quietly different number.
- **Re-derive `N8-LANE` to 750 ms alongside the level.** Rejected: the owner did not name it, it
  would loosen a per-ticket bar on a lane with 60 ms of headroom, and it creates no headroom for the
  lane (`ADR-0014` alternative 3). Left as the row's standing invitation.
- **Rule the wall clause on the 4.385 s.** Rejected: `ABC-110` `A6` and `ABC-111` both say the wall
  figure cannot be read as a verdict until warm/cold is settled, and `ADR-0014` decision 2 refused a
  wall ruling on far less disagreement than this. Reported with its size instead — see Consequences.
- **`isolate: false`.** Not an option. Fourth ADR write-down; `ADR-0008` decision 7.

## Consequences

- **`ABC-110` closes on its CPU half.** `A5` is satisfied by the transcribed word; `A1`–`A4` were
  answered by QE on 2026-08-20 and are cited, not repeated; `A6`'s CPU half is ruled MET at 15 s;
  `A7` and `A8` are verified on the diff and the counts; `A9` is not applicable because no lane was
  created. **The residual is `A6`'s WALL half, and it is `ABC-111`'s by the ticket's own dependency
  graph.** Recommendation to the Orchestrator: close `ABC-110` with that residual named on
  `ABC-111`, not left implicit.
- **The wall figure is a warning even though it is not a verdict.** 4.385 s is **46% over** the wall
  clause. `ABC-111`'s warm/cold straddle was 2.805 s vs 3.120 s — a ±0.3 s question. **A 1.4 s
  excess is not a warm/cold question.** The CPU/wall ratio in this sample is **3.41x** against 5.29x
  warm / 4.64x cooled on 2026-08-19, at a 1-min load of 4–7.5 on 8 cores with the harness itself
  contributing ~3.4 of that: the consistent reading is **core contention from concurrent work on the
  machine** — sibling hops of this wave were live — and it is labelled a **candidate, not a cause**,
  exactly as `ADR-0014` labelled the cache. `ABC-111` should be pulled soon, and its `A5`
  reproducibility run is the thing that separates "the lane's wall grew" from "the machine was busy".
- **Every ticket that adds a test file from here is likely to re-breach the CPU clause at 15 s.**
  That is the honest reading of 60 ms of headroom against a 370 ms average per-file cost. BA/PM cuts
  and Security/NFR gates should expect it, write the measured milliseconds and the clause state, and
  **not** treat the re-breach as news requiring a fresh escalation — the sized remedy (`OPT-1`) is
  already on the table and the owner's "for now" already anticipates revisiting.
- **`ADR-0014` reads `superseded by ADR-0019` on its level and nothing else.** Its measurement at
  `54cbb23`, its content attribution, its sizing and its `A1`-unsatisfiable finding are the record
  this ADR builds on and does not restate.
- **`A7`'s hash now has a defined byte range**, closing the gap QE named on 2026-08-20: it is the
  sha256 of the eight lines matching `^\| NFR-00[1-8] \|` in `plans/nfr-catalog.md`, concatenated
  in file order — that reproduces `63f66795…ca31` before this hop's edit. After it, `NFR-001`–`NFR-007`
  hash individually as before and the eight-row hash is the new figure recorded in the catalog
  section.

## Rollback

**This ADR records the owner's level and a reading against it. Rolling it back means the owner
speaking again, or the lane moving — never an agent editing the number.**

- **Revisit trigger (a) — a breach at 15 s.** A reading under `NFR-008`'s own protocol (CPU user+sys,
  fresh process per run, rotated order, round 0 discarded, **n ≥ 7**, identity null control ≤ 1.5%
  at sign at chance, counts asserted per run) whose **median CPU is > 15 s** at a named commit. Then
  the CPU clause is **BREACHED at the owner's level**, `N8-LANE` is a rate limit again by `ADR-0014`
  decision 4's own terms, and the question goes back to the owner with the sized remedy (`OPT-1`)
  beside it. **No agent moves the 15 s.** Given decision 4 above, expect this trigger to fire on the
  next ticket that adds a test file.
- **Revisit trigger (b) — the old level becomes restorable.** A conforming reading whose median CPU
  is **≤ 13 s** (e.g. after lever (i) is taken, or after the lane shrinks). Then Architect/Design
  recommends restoring 13 s to the owner; **his word, not the reading, supersedes this ADR.**
- **Revisit trigger (c) — `ABC-111` lands.** When the warm/cold protocol is settled, this ADR's
  wall figure is re-read under it. If the settled protocol implies a different CPU figure than the
  warm-interleaved one used here (this reading IS the warm-interleaved state, by the row's own
  round-0 rule), the CPU verdict is restated on that figure — it may flip, because the margin is
  60 ms, and that flip is trigger (a).
- **To overturn decision 3 as a measurement**, produce a conforming reading at `2c96dbd` whose median
  contradicts it; **a single run over 15 s is not that** — four such runs are already in this
  sample and are reported.
- **Nothing to revert in code or config.** No production file, no dependency, no `vitest.config.ts`
  key, no `AGENTS.md` byte and no test was touched by the hop that wrote this.
