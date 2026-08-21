# ADR-0017: `N8-SPAWN`'s time clauses are cut-time and role-checked BY DESIGN — a budget clause on a DELTA cannot be asserted by a test inside the tree

## Status

accepted

Written 2026-08-21 by Architect/Design at task `residual-G-QE115-3-2026-08-21`, the owner of
`NFR-008`, its per-file floor account and its spawn account, ruling the residual **`G-QE115-3`** that
QE raised at `ABC-115`'s re-verification and handed to this role and to `ABC-108` by name.

**Scope fence, first.** `NFR-008`'s `<= 3 s wall / <= 13 s CPU` level is **Olger Oeselg's**, ratified
in person 2026-08-11. **This ADR does not touch it, re-baseline it or argue it obsolete.** It does
not move `N8-SPAWN`'s ceilings, its three stops, its charging test, its owner, its checker or its
`0 ms` balance; it does not move `N8-LANE`'s 5%, CPU instrument, paired-median statistic, identity
null control or 160 ms floor. **It amends no clause of `ADR-0008` and no clause of `ADR-0014`** — it
records how one class of clause under them is CHECKED, which neither ADR ever stated.
`ADR-0016` and `ABC-115` are untouched; `ABC-115` stays in `Ready for UAT`, **unsigned**.

## Context

**Every measurement below was taken at this hop**, in a `git worktree` at `e4a5c48` and in a copy of
`src/` outside the repository, both with `node_modules` symlinked. Machine: Apple M3 (Mac15,13) /
8 logical cores / Darwin 25.5.0 arm64 / Node v24.12.0, 1-min load average 4.30 — **not a quiet
machine, and the readings are reported on that basis.** The QE and BA/PM notes this residual comes
from are **unstamped** (`context.human_admission` is `off`, no `finding` is admissible on this
install), so they were treated as claims and re-derived. Raw data:
`.grugops/context/residual-G-QE115-3-2026-08-21/notes/`.

`ABC-115` instantiated the `N8-SPAWN` account with three clauses in force:

> **`<= 7 added children` AND `<= 2.0 s added wall` AND `<= 0.30 s added CPU (user + sys) PER ADDED
> CHILD`**, on `npx vitest run --dir src`, measured as the **median of >= 5 interleaved paired runs
> against the immediate base commit**, sign agreeing on **>= 4 of 5**.

Only the first is asserted by anything that runs: `expect(spawned).toBe(17 + 7)` and
`expect(Object.keys(CHILDREN)).toHaveLength(...)` in `src/cli.test.ts`. QE ruled the other two a
knowingly-open residual, correctly declined to convert a gap into a ticket, and named the design
question rather than inventing a mechanism at a gate. **This ADR answers that question.**

## Decision

**1. The two time clauses are NON-MECHANICAL BY DESIGN. An `N8-SPAWN` account whose only mechanical
pin is its COUNT is the correct and intended shape.** No default-lane assertion, no opt-in lane, no
harness and no proxy is owed, and none is built.

**The reason is a difference in KIND, not in effort.**

- **The count clause is a STATE property of one tree** — observable in-process, machine-independent,
  deterministic, free at the single `childOf` call site, and **it survives the merge as a live
  invariant.** That is why it is pinnable and pinned.
- **The two time clauses are DELTA properties BETWEEN TWO COMMITS.** Their referent is not the
  delivered tree but the difference between it and a named base. A test inside the tree has one
  tree.

Three consequences follow, each independently sufficient:

- **(a) Self-defeating cost.** Asserting the delta requires checking out the base commit, provisioning
  it, and running the whole default lane ten times — *from inside the default lane*. At ~4.6 s wall /
  ~16.6 s CPU per run (measured here) that is **~46 s wall and ~166 s CPU against a total of 3 s and
  13 s — ~12.8x the budget it guards, spent inside it.**
- **(b) No admissible instrument.** This catalog's standing rule is *"no wall-clock assertion belongs
  in the suite: it would be a test that passes or fails on the machine that runs it."* Verified at
  this hop rather than quoted: **the default lane contains ZERO real-clock assertions** — every
  `performance.now` / `process.hrtime` case in `src/` sits behind `ENGINE_DEEP=1`. The escape used
  everywhere else is an **injected clock**, unavailable here because the quantity named IS the real
  machine's real time.
- **(c) Nothing left to protect.** These are **cut-time** clauses, adjudicated once against one base
  commit; after merge the delta is history and cannot drift. The live invariant a later hop can break
  is the count — and the count is pinned.

**This is not an exception carved for `N8-SPAWN`. It is how every budget clause here already works:**
`N8-LANE`'s 650 ms, the 160 ms per-file floor and `NFR-008`'s own 3 s / 13 s are each asserted by
nothing mechanical and each ruled by a role at a hop. **`N8-SPAWN` is not the account that lost its
guard; it is the only one that ever had one, because one of its three clauses happened to be a state
property.** Generalising from that exception is the misreading this ADR exists to stop.

**2. What replaces the gate is a RE-MEASURE OBLIGATION ON TWO NAMED TRIGGERS — not nothing.** Owner
and checker are **UNCHANGED**: BA/PM at each cut, Security/NFR at each gate, exactly as the account
already says. No new role, no new hop, no new gate command, no config change.

- **`T1` — a hop that CHANGES THE NUMBER OF CHILDREN re-measures both time clauses** under the
  account's protocol. Already effectively enforced, because the count pin forces such a hop to edit
  the literal and write its reason. It fired twice on `ABC-115`. This clause only writes it down.
- **`T2` — a hop that changes WHAT AN EXISTING CHILD DOES** — its argv, its stdin script, its
  substitution hook, its settle — **re-measures the per-child CPU clause, whether or not the count
  moves.** **This trigger existed nowhere before this ADR**, and it is the substantive addition.

**3. `AR-N8SPAWN-DRIFT` is opened and accepted, with `T2` as its only control. Owner:
Architect/Design.** An existing criterion-forced child can be made arbitrarily more expensive with no
mechanical signal whatever. **Measured here:** deleting one substitution hook in `src/cli.test.ts`
(one line) makes an existing child run the real engine — **+2.68 s wall, +2.60 s CPU, 8.6x the
`<= 0.30 s` per-child clause from a single child — and the lane stays 40 files / 1213 tests green,
count pin included.** Discharge: at `ABC-108`'s remedy, as one input among many, on the pattern
`AR-N8LANE-078` was discharged. **Reported to `ABC-108`, not charged to it; `N8-SPAWN`'s balance
stays 0 ms.**

**4. THE FINDING THAT DECIDES CLAUSE 1, stated separately because it is the counter-intuitive part.**
The clauses are written on **ADDED** children. **The mutant above adds none.** So a faithful
mechanical implementation of the clauses as written — the 166 s harness — **would report compliance
on the one mutant that matters.** Building it would convert an honest known gap into a false
assurance, against this project's hardest-won test rule: **never ship a guard you have not watched go
RED** (`AGENTS.md`, learned at `ABC-037`).

## Alternatives

1. **An opt-in lane with an interleaved-paired-run harness** — the shape QE named as the only
   arguable one, and it is. **Rejected on five grounds:** the ~46 s / ~166 s cost above; it would
   need a base-commit checkout, `node_modules` provisioning, a portable CPU instrument, a median-of-5
   with sign agreement and an identity null control — **substantially the harness the `ABC-108`
   ruling built and deliberately did NOT commit**; an opt-in lane runs at no gate, so it catches
   drift only when a human chooses to run it, **which is today's state at the price of building and
   maintaining all of it**; every existing opt-in lane here holds *repetitions of criteria also
   answered in the default lane*, so this would be the project's first clause answered only behind a
   flag; and **it is green on the §4 mutant.**
2. **A source-level proxy** — grep the test file for settle budgets or un-hooked `play()` calls and
   assert a ceiling. Cheap, machine-independent, default-lane-legal. **Rejected: it asserts a proxy
   for time, not time**, and this project has been burned by that twice — `ABC-115`'s own `<= 0.5 s
   CPU` clause, derived by carrying **wall** milliseconds into a **CPU** budget and therefore
   impossible from the day it was written; and `ABC-037`'s `heapUsed` memory guard, green on both
   builds, **deleted rather than shipped green.** A third is the same mistake in a new costume. The
   bar for reviving this: watch it go RED on the mutant first.
3. **A default-lane wall or CPU assertion.** Rejected outright — it contradicts a standing rule this
   catalog states twice, and the lane is already breached by 1.480 s.
4. **Do nothing and carry `G-QE115-3` forward as an open residual.** Rejected as **not honest
   enough**: it leaves the real hole (`T2`) unnamed, and names as open a thing that is actually
   closed. QE's disposition — *name it with an owner* — was correct for a QE hop; **the owner's job
   is to answer it, and the answer is that the mechanism was never owed and a different control is.**
5. **Widen the clauses to cover existing children** (e.g. *"no child costs more than 0.30 s"*).
   **Not taken, and this is the closest call in this ADR.** It would make `AR-N8SPAWN-DRIFT` a clause
   rather than a risk — but re-wording a per-ticket budget clause is **BA/PM's at a cut**, it would
   still be non-mechanical for the same reasons, and it would need the clause re-derived against
   measured per-child costs. **Named here as available and left to BA/PM, not decided by fiat.**

## Consequences

- **Nothing is looser than it was.** No ceiling, level, instrument, statistic, null control or floor
  moved. The count pin still binds. The three stops still bind. `N8-SPAWN`'s balance is still 0 ms.
  **One control is ADDED (`T2`) and one risk is OPENED (`AR-N8SPAWN-DRIFT`).**
- **`G-QE115-3` is DISPOSITIONED, not carried.** A later hop must not re-raise *"two clauses are
  unasserted"* as a defect. It is TRUE and it is the design. **The live successor is
  `AR-N8SPAWN-DRIFT`**, which is a different and larger hole.
- **A budget clause on this project may be role-checked without being weak.** That sentence is now on
  the record and it applies to `N8-LANE` and the per-file floor as much as to this account.
- **The risk this ADR accepts is real and live.** `NFR-008` is already breached by 1.480 s; a single
  hook deletion would nearly double that breach silently. It is accepted because the cheapest honest
  guard costs ~12x the budget and is green on the mutant anyway — **not because it is small.**
- **An edit is OWED to `AGENTS.md` and is NOT made here.** Its `## Test` section documents the four
  opt-in lanes and their rationale; a reader could reasonably expect a fifth. **The edit owed is one
  sentence — that `N8-SPAWN`'s time clauses are cut-time and role-checked and no lane exists for
  them — and its owner is whoever holds `AGENTS.md` next. `ABC-109` is live against that file and
  under a byte cap**, so it is named as owed and left alone. Nothing in `AGENTS.md` is false today.
- **One ticket is NAMED and NOT CUT** (cutting is BA/PM's pen): *record the `T2` trigger in the gate
  checklist and in the `## Security / NFR triggers` block of future cuts*, **`XS` / `P2` / owner
  BA/PM.** An id is not invented here; that would be fabricating a board state.
- **No board column moved, no ticket moved, no test added, deleted, trimmed or moved, and `src/` is
  byte-identical across this hop.** This hop's own charge against the lane is **0 ms** — the mutant
  lived and died outside the repository.

## Rollback

**Overturn this ADR by producing the guard, not by re-arguing the gap.** The falsifier is stated so
it can be run: **a mechanical assertion, runnable in the default lane in under ~50 ms, machine-
independent, that goes RED on the one-line mutant** (`black: play(["--colour", "black"])` with the
`FIRST_LEGAL_ENGINE` hook deleted, `src/cli.test.ts:626`) **and GREEN on the unmutated tree.** If
that exists, clause 1 is wrong, the time clauses should be mechanised, and `AR-N8SPAWN-DRIFT`
closes with it.

Rolling back costs nothing else: this ADR added no code, no lane, no dependency and no config. Delete
the `T2` trigger from `plans/nfr-catalog.md`'s `N8-SPAWN` section and close `AR-N8SPAWN-DRIFT` there,
and the account is byte-equivalent to its 2026-08-15 state. **`NFR-008`'s level, `N8-LANE`'s clauses
and `ADR-0008` are untouched by this ADR and are unaffected by its rollback.**
