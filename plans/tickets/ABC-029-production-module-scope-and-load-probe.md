---
id: ABC-029
title: "\"Production module\" is undefined — the two guards of NFR-002's structural premise disagree about their own file set, and one of them shares a channel with the modules it measures"
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-002
feature: —
---

# ABC-029 — "production module" is undefined: the two guards of `NFR-002`'s structural premise disagree about their own file set, and one shares a channel with the modules it measures

> **Cut 2026-08-12 by BA/PM** (task `abc017-cut-2026-08-12`, subtask `refinement-ABC-017-cut`,
> Workflow 07), from `ABC-017`'s fourth accepted risk plus the three items of a **narrow Security/NFR
> re-gate that was scheduled and never ran** — the merge overtook it. `ABC-017` is `Done` and is
> **not re-opened, not moved and not edited** by this hop.
>
> **NOTHING IS BROKEN. Production runtime importers of `src/history.ts` are ZERO**, measured by
> module-graph closure with a positive control and an armed negative control — a stronger result than
> the `grep` the criterion originally asked for. **This ticket is about the two guards that protect
> that zero, and about one word that was never defined.**
>
> | item | what is wrong |
> |---|---|
> | `RISK-ABC017-04` | **`WPERFT-DYN`** — `void import("./history.ts")` inside `src/perft-bench.ts` — **survives 744/744**. `A11`'s regex guard classifies `perft-bench.ts` as a production module; the load probe's roots **exclude** it. **So the criterion and its own instrument disagree about what "production module" means**, and a build breaches `A11` as written while the suite is green. |
> | the stdout channel | The probe parses its child's **stdout** as JSON. A production root that prints at module scope makes the probe **the sole red in 744 tests**, reporting `is not valid JSON`. Reproducible today by adding `perft-bench.ts` as a root; the real trigger is `EPIC-006`'s CLI entry point. **A symptom in the wrong place — by the guard written to stop symptoms appearing in the wrong place.** |
> | `perft-bench.ts` as a root | The two facts above are **the same fact from two sides**: the root cannot simply be added, because adding it is what breaks the channel. |
> | the last unqualified comment | `src/history-pane.ts:30` still reads *"so `src/history.ts` keeps its zero runtime importers"* — the exact **unqualified** phrasing `A11` was corrected for at `D27`, and there are **four** importers. |
>
> **This is NOT a spike, and the brief offered one.** A spike is right when the uncertainty prevents
> criteria being written. Two of the three criteria here are writable **now and are
> ruling-independent** — `A1` (the two guards agree) and `A2` (the channel) hold whichever way the
> definition goes. Only `A3`'s content depends on the ruling, so the honest shape is a normal ticket
> carrying **one open design question**, exactly as `ABC-010` does. The difference from `ABC-010` is
> recorded in `## Definition of Ready` and it is the reason this ticket cannot reach `Ready` without a
> design hop: `ABC-010`'s question changes **where a check lives**, this one changes **what a
> criterion says**.

> ## AMENDED 2026-08-11 by BA/PM at task `abc019-rebase-2026-08-12`, subtask `refinement-ABC-019-a11` (Workflow 07)
>
> ### **THE HEADLINE ABOVE IS NOW FALSE, AND IT IS CORRECTED RATHER THAN DELETED. `NOTHING IS BROKEN` NO LONGER HOLDS: THIS TICKET'S TWO GUARDS ARE RED ON `ABC-019`'s BRANCH, AND THEY BLOCK A `P0`.**
>
> **What changed is the tree, not this ticket's analysis** — every measurement above was correct on
> the tree it was run against, which is the same sentence `ABC-017`'s `A11` earned four times.
>
> `ABC-019` (turn loop) rebased onto merged `main` on 2026-08-11 and **`src/turn-loop.ts:52` imports
> `./history.ts` at runtime**. Re-measured at this hop with this ticket's own instruments:
>
> | figure | before | now |
> |---|---|---|
> | production runtime importers of `src/history.ts` (`A11`'s regex, 17 non-test files) | **0** | **1** — `src/turn-loop.ts` |
> | `src/history-pane.nfr.test.ts` `:228` | green | **RED** — `expected [ 'turn-loop.ts' ] to deeply equal []` |
> | `src/history-pane.nfr.test.ts` `:275` (load probe) | green | **RED** — `history.ts was evaluated in a production closure` |
> | full suite on `grugops/ABC-019-turn-loop-skeleton` | 744/744 | **2 failed / 789 passed on 28 files**, skip 0 |
>
> **`NFR-002` IS STILL NOT BREACHED, AND THAT IS MEASURED HERE RATHER THAN ASSUMED.** The premise the
> catalog row states is scoped to **a renderer** and **a frame** — it voids itself *"if a **renderer**
> ever pulls the repetition derive into a frame"* and says *"the quantity belongs to the LOOP
> (`ABC-019`), not to a frame"*. Probed with the same `module.registerHooks` technique the `RF-1` probe
> uses, rooted at the five renderer modules (`frame.ts`, `render.ts`, `history-pane.ts`,
> `status-panel.ts`, `glyph-mode.ts`): **the render closure is 11 modules — `apply`, `fen`, `frame`,
> `glyph-mode`, `history-pane`, `legal`, `moves`, `position`, `render`, `san`, `status-panel` — and
> `history.ts` is NOT among them.** **The zero is armed:** the same probe rooted at `turn-loop.ts`
> **does** report `history.ts`. And **nothing in `src/` imports `turn-loop.ts`** (`grep` = 0), so the
> loop cannot be reached from a frame's assembly by any path.
>
> **SO THE UNDEFINED WORD HAS BITTEN A SECOND TIME, FROM THE OPPOSITE SIDE, AND IT IS THE SAME BITE.**
> `RISK-ABC017-04` is *a file the criterion covers and the instrument does not* (`perft-bench.ts`).
> This is *a file both instruments cover and the **property** does not* (`turn-loop.ts`). Both exist
> because *"production module"* was never defined, which is this ticket's whole subject.
>
> **`ABC-017` IS NOT RE-OPENED AND ITS `A11` STILL DOES NOT MOVE.** A criterion on a merged ticket is
> a statement about **that ticket's delivery**, discharged at its gate; it does not become false when a
> later ticket changes the tree, it becomes **stale as a standing invariant** — a defect of phrasing,
> not a breach. `A11` was MET. The two **instruments** are live code in the suite and are what this
> ticket repairs, which is exactly the split `## Out of scope` already drew.
>
> **`ABC-019` DOES NOT OWN THIS REPAIR AND DID NOT TAKE IT**, for three measured reasons recorded in
> its `## Dependencies`: a per-ticket exclusion writes a **third** hand-maintained filename into the
> two places `A1` forbids them; narrowing the regex's file set would remove `perft-bench.ts` from its
> reach and **destroy `WPERFT-STATIC`'s sole catcher**, which `## Out of scope` protects by name; and
> `A1`'s one-expression demand is **indivisible from `A2`** (the regex needs `perft-bench.ts` in, the
> probe needs it out until the channel is private). **No `src/` byte was written by that hop or this
> one.**

## Problem

*User*: `NFR-002`, and through it every frame `ABC-019`'s loop will render.

*Pain*: `NFR-002`'s `O(window)` claim rests on a **structural** premise — that nothing pulls the
repetition derive into a frame. That premise is guarded by two instruments in
`src/history-pane.nfr.test.ts`, and:

- **They disagree about which files they are guarding.** The regex guard at `:230-244` scans every
  `.ts` that is not a `.test.ts` — which includes `src/perft-bench.ts`. The load probe at `:277-283`
  builds its roots from the **same** list and then removes `history.ts` and `perft-bench.ts`. Neither
  exclusion is wrong; **the disagreement is, because the criterion above them says "production
  modules" and never says what one is.** `D27` defined *"runtime importer"* exhaustively and left the
  other half of the phrase open.
- **The stronger of the two instruments can be made to fail for a reason that has nothing to do with
  its subject.** It parses the child's stdout as JSON, and it shares that channel with the modules it
  loads.
- **The coverage is not nested, which is the trap.** QE measured it: `WPERFT-STATIC` is killed by the
  **regex alone** and `WQUERY`/`WDYNIMP`/`WBAREIMP` are killed by the **probe alone**. The delivered
  note claiming *"the regex is not load-bearing any more"* is **measurably false**, and it invites a
  later hop to delete a guard that is the sole catcher for one form.

*Value*: the premise an NFR row rests on is guarded by instruments that agree with each other and
with the criterion, and that fail for their own reason when they fail. **Nothing here changes what
the code does.**

## Scope

- **Define "production module"** for the purposes of the zero-runtime-importer property, and make the
  two guards derive their file sets from that one definition rather than from two hand-maintained
  exclusion lists.
- **Resolve `src/turn-loop.ts` under that definition — ADDED 2026-08-11, and this is the item that
  turned the ticket from latent to live.** The loop is unambiguously a **production module** by any
  file-level reading, and it is the **first** one in this project that is neither the rules core nor a
  renderer. It imports `src/history.ts` at runtime because `ADR-0002` clause 4 and `ABC-019`'s `A3`
  **require** it to: `gameStatusOf` (`src/history.ts:152`) is the single `positionCounts` supplier and
  the loop is the only place the repetition derive may live. **So the property cannot be *"no
  production module imports `history.ts`"* — that reading forbids the build the architecture
  mandates.** What the definition must produce is a set the property is actually about, and the
  catalog row already names it: **the frame path.**
- **Make the probe's report channel private to the probe**, so a module that writes to stdout at
  import cannot corrupt it.
- **Resolve `src/perft-bench.ts`** under the definition — either it is in scope and the probe reaches
  it, or it is out of scope and the exclusion is stated as a rule rather than as two comments.
- **Correct the one remaining unqualified comment**, `src/history-pane.ts:30`.
- **Correct the delivered note that calls the regex redundant**, at the probe's site.

## Out of scope

- **Deleting, replacing or weakening the regex guard.** It is the **sole** catcher for
  `WPERFT-STATIC`. The Engineer kept it and was right; the note explaining why is what is wrong.
- **Re-opening, editing or moving `ABC-017`**, whose `A11` is discharged and does not move. The
  definition this ticket produces lives **here**.
- **Widening the probe's reach beyond `A11`'s property.** It already guards the whole production
  graph (`WINDIRECT`), which is stronger than the clause requires; that is an asset, not a licence.
- **Narrowing the probe's roots to save time.** Measured: 14 roots → 1 saves **3.6 ms of 55.7 ms
  (6.5%)** and costs the `WINDIRECT` kill. The dominant term is process spawn at **19.0 ms**.
- **Replacing the probe with a static transitive-import walk.** ~1 ms, and it loses `WQUERY`,
  `WDYNIMP` and `WBAREIMP` — three of the five forms `A11` enumerates — and cannot see a computed
  specifier at all.
- **An explicit `testTimeout` on the probe's `it`.** Measured margin is **~71× to ~88×**
  (56.9–70.0 ms against the 5,000 ms default). QE declined to request it and this ticket does not
  either; it is named in `## Test notes` so the omission is a decision.
- **`ABC-028`'s three input classes**, and **`G5`/`AR-4`**, which stays **deliberately unhomed**.
  `HISTORY_COLS` **HOLDS at 21**; `ADR-0009` and `ADR-0010` are `accepted` and **not re-opened**.
- **`NFR-002`'s bars.** No target, level or `UNKNOWN - verify` marker moves.

## Acceptance (Given/When/Then)

**A1 — the two guards agree about their own file set, and the agreement is MECHANICAL. Given** the
regex guard and the load probe in `src/history-pane.nfr.test.ts`, **when** the suite runs, **then**
both derive the set of files they consider from **one** expression, and **every** file omitted by
either is omitted by a **named rule stated at that one site** — not by a literal filename in two
places.

**and** the criterion's own vocabulary is stated where the guards can be checked against it: a
**production module** is defined, once, in this ticket and at that site.

*Today, measured at the cutting hop: the regex guard's filter is
`file.endsWith(".ts") && !file.endsWith(".test.ts")` (`:237-239`), and the probe applies exactly that
filter and then `file !== "history.ts" && file !== "perft-bench.ts"` (`:281-282`). **`history.ts`'s
exclusion is principled and both roles stated the reason** — importing the module under test as a root
is a self-inflicted load that proves nothing, and Security/NFR's own first probe had that defect and
discarded it. **`perft-bench.ts`'s is the one that is really a scope ruling wearing an implementation
comment.***

**and — ADDED 2026-08-11 — `A1` is now the criterion that makes `ABC-019` GREEN, so it carries one
more clause. Given** `src/turn-loop.ts`, **when** the suite runs, **then** it is **green**, **and**
the named rule that admits the loop is the **same one expression** `A1` already demands — **not a
`file !== "turn-loop.ts"` beside the two literals that are already there.**

> **A THIRD hand-maintained filename is the failure mode, not the fix.** `ABC-019`'s hop was offered
> exactly that shortcut and refused it, because it would leave this ticket a partly-done job and would
> put a literal filename in the two places this criterion forbids them.
>
> **One measured trap for whoever writes the expression: do NOT reach for the frame-path closure and
> apply it to BOTH guards unchanged.** The regex guard is `WPERFT-STATIC`'s **sole** catcher, and
> `perft-bench.ts` is not on the frame path — so a frame-path filter applied to the regex removes that
> kill, which `## Out of scope` forbids and `A3`'s closing sentence requires. **The one expression must
> therefore name a SET plus a per-guard rule about it, or it must be a definition that keeps
> `perft-bench.ts` reachable by the regex.** This is a real design constraint on `A1` and it is
> recorded here rather than discovered mid-build.

**A2 — a production module that writes to stdout at import does not change the probe's verdict.
Given** a build that adds `console.log(...)` at module scope in a production module inside the
probe's roots, **when** the full suite runs, **then** the suite is **green at its full count**, and
the probe reports **no JSON parse error**.

**Kills the wrong-reason-red route.** Today, `WSTDOUT` — a module-scope `console.log` in
`src/glyph-mode.ts` — makes the probe **the sole failing test of 744**, with
`SyntaxError: Unexpected token 'g', "glyph-mode"... is not valid JSON`. `WSTDERR` (module-scope
`console.error`) correctly survives 744/744, because stderr is not the channel.

> **The trigger is dated, not hypothetical.** `AGENTS.md` records there is no CLI entry point until
> `EPIC-006`; **the first module that prints at import lands there.** And the failure is reproducible
> today by adding `perft-bench.ts` as a root:
> `CHILD FAILED: Unexpected token 'A', "ABC-006 pe"... is not valid JSON`.

**A3 — `src/perft-bench.ts` is resolved under the definition, and `WPERFT-DYN` stops being a silent
breach.** ***This criterion has TWO forms and the ruling picks one. It is deliberately not pre-picked
here — see `## Open design question`.***

- **Form (a), if the benchmark harness IS a production module for this property. Given**
  `void import("./history.ts")` in `src/perft-bench.ts`, **when** the suite runs, **then** it **fails**,
  and the failing assertion names **the module evaluation** — not a channel error. *(This form is
  reachable only with `A2` satisfied first: `perft-bench.ts` calls `main()` at module scope
  (`src/perft-bench.ts:114`) and prints, which is what breaks the channel today.)*
- **Form (b), if it is NOT. Given** the same build, **when** the suite runs, **then** it **passes**,
  **and** `A11`'s property as restated by this ticket says in its own words that the benchmark harness
  is excluded, **and** the regex guard excludes it too — so no instrument reports a file the criterion
  does not cover, in either direction.

**Either way, `WPERFT-STATIC` must still die**, and it must die on the **regex**, which is its sole
catcher today.

> **[FLAGGED 2026-08-11 by BA/PM — `A3` CONTRADICTS ITSELF AND IT IS FLAGGED HERE RATHER THAN PICKED,
> because picking it IS the design ruling.]** Form (b) says the regex guard **excludes**
> `perft-bench.ts` *"so no instrument reports a file the criterion does not cover"*. The sentence
> immediately above says `WPERFT-STATIC` **must still die on the regex**. **A guard that excludes the
> file cannot kill a mutant in it** — the two cannot both hold. So form (b) as written is not
> buildable, and it needs one of two repairs at the design hop: either (b) keeps the file in the
> **regex**'s reach while excluding it from the **probe**'s roots — which is a per-guard rule and must
> be reconciled with `A1`'s one-expression demand — or the *"either way"* sentence is dropped and
> `WPERFT-STATIC` is accepted as a non-breach under (b), which **loses a measured kill** and must be
> stated as a loss rather than discovered. **Not decided here. This is the second item for the
> Architect/Design hop and it was invisible until `A1` gained the `turn-loop.ts` clause.**

**A4 — the retired vocabulary is gone from production, and every site was AUDITED rather than the
named one patched. Given** `src/history-pane.ts:30`, **when** it is read, **then** it no longer claims
`src/history.ts` *"keeps its zero runtime importers"* unqualified — the measured count is **four**, all
test files — and it states the module's **own contribution**, which is the true and useful statement.

*Swept exhaustively at the cutting hop rather than asserted: `grep -rn 'runtime importer' src/` returns
**three** sites, and only `src/history-pane.ts:30` is unqualified.
`src/history-pane.nfr.test.ts:228` already reads "among the production modules" and is correct;
`:269` is the file describing itself and is correct.* **`src/status-panel.ts:24`'s
`IT ADDS NO RUNTIME IMPORTER OF src/history.ts` is the phrasing that should win** — it is scoped to the
module's own contribution and is already merged and true.

**and** the note at the probe's site that calls the regex *"not load-bearing any more"* is corrected:
measured, **`WPERFT-STATIC` is killed by the regex and by nothing else**, so the two instruments'
coverage is **not nested** and neither is redundant.

> **`ABC-016`'s `R1`/`D27` is the precedent and its lesson is applied here rather than cited.** There,
> a repair was *"audited on the site it names, not the site it points at"* — `D27` named one of three
> sites carrying a retired vocabulary and two survived into `main`. **This ticket's sweep was run
> first and its result is written above**, so the count is a measurement and not a hope.

## Open design question — hand to Architect/Design at the design hop, do not decide in dev

**Is `src/perft-bench.ts` a production module for the purposes of `NFR-002`'s structural premise?**

The two honest readings, stated so neither is smuggled in:

- **In scope.** `NFR-002` is about the module graph, and `perft-bench.ts` is a shipped, non-test `.ts`
  file that imports `fen.ts` and the generator. If it ever pulled `history.ts`, the repetition derive
  would be in a production closure. Under this reading the regex guard is already right and the probe
  is under-rooted.
- **Out of scope.** `NFR-002`'s subject is *a frame*. `perft-bench.ts` renders nothing, runs a
  benchmark at module scope, is invoked only by `npm run perft`, and is already excluded from the
  14-root production count that every role has used. Under this reading the probe is right and the
  criterion's word is what needs the qualifier.

**This is a design decision and it is flagged here, not answered here.** It has a real consequence
either way: reading (a) forces `A2` to land first, and makes the probe pay a benchmark run or a
`main()`-guard question it does not have today.

*This project's own posture is the input, not the answer: `AGENTS.md` records the perft harness as a
first-class command (`npm run perft`), and `plans/nfr-catalog.md`'s `NFR-001` treats it as the
throughput instrument.*

> **[2026-08-11 by BA/PM at `refinement-ABC-019-a11` — ONE OF THE TWO READINGS IS NOW REFUTED BY
> CONSTRUCTION. THE QUESTION IS NOT ANSWERED AND THE DESIGN HOP IS NOT SKIPPED; IT IS SHORTER.]**
>
> **The "in scope / `NFR-002` is about the module graph" reading is dead, and `ABC-019` is what killed
> it.** Applied to the tree as it now stands, that reading says a **production module** importing
> `src/history.ts` at runtime breaches the property. `src/turn-loop.ts` does exactly that, and it does
> it because `ADR-0002` clause 4 makes `gameStatusOf` the single `positionCounts` supplier and
> `ABC-019`'s `A3` names it. **A reading under which the correct, architecture-mandated build breaches
> the property is not a live reading of the property** — it is a reading of a proxy that has outlived
> its scope.
>
> **The "out of scope / `NFR-002`'s subject is a frame" reading survives, and the catalog row already
> says it in its own words** — *"if a **renderer** ever pulls the repetition derive into a frame … this
> row's `O(window)` statement is void"* and *"the quantity belongs to the LOOP (`ABC-019`), not to a
> frame"*. **No catalog edit is needed for this and none was made.**
>
> **WHAT IS STILL OPEN, AND IT IS NARROWER THAN IT WAS.** The surviving reading answers *what the
> property is about* (the frame path). It does **not** by itself answer **`perft-bench.ts`'s
> membership**, because that question is about **a GUARD's reach** rather than about the property:
> `perft-bench.ts` is not on the frame path either, so the frame reading pushes `A3` toward form (b) —
> **and form (b) is the form that contradicts *"`WPERFT-STATIC` must still die"*.** See the flag at
> `A3`. **That is now the design hop's real question, and it is a smaller one than the hop was cut
> for.**
>
> **BA/PM DID NOT TAKE THIS RULING AND IS NOT ENTITLED TO.** Recorded as an input, measured, with the
> owner unchanged: **Architect/Design** rules; **Security/NFR** still owns `NFR-002`'s `MET`/`MISS`;
> `plans/nfr-catalog.md` and every ADR were **read, not edited**.

## Dependencies

- **`ABC-017` is merged**; nothing here is blocked by it, and nothing here may edit it.
- **`ABC-028` shares `src/history-pane.nfr.test.ts` with this ticket.** ~~They must not run
  concurrently in two worktrees; either order works and the second to land rebases.~~ **CORRECTED
  2026-08-11: either order no longer works. `ABC-028` should land FIRST.** Its `A2` makes the false
  *"may be rebuilt per test freely"* sentence at `src/history-pane.nfr.test.ts:106-112` **TRUE**
  rather than correcting it, so with `ABC-028` first **no merged text is edited at all**. If this
  ticket opens that file first, `ABC-028`'s own board row records the consequence: **the correction
  falls due at three sites and it is BA/PM's, not the Engineer's.** The non-concurrency rule is
  unchanged.
- **`ABC-019` is BLOCKED ON THIS TICKET — added 2026-08-11, and it is the reason the priority moved.**
  `ABC-019` is `P0`, is the only ticket in flight, is rebased and **RED** on this ticket's two guards,
  and `quality.gate_enforcement` is `blocking`, so it **cannot merge until this lands**. The
  dependency runs one way only: this ticket needs nothing from `ABC-019` and is not blocked by it.
  **`ABC-019` measured the collision, refused the shortcut fix and routed it here rather than
  half-doing it** — see its `[D52]` and its `## Dependencies`.
  > **The whole ordering, stated once so nobody re-derives it:**
  > **design hop on this ticket → `ABC-028` → `ABC-029` → `ABC-019` rebases → `A20` + `ADR-0009`
  > cl. 9f's real-panel run → `ABC-019`'s gate.** The design hop can run in parallel with `ABC-028`;
  > the two BUILD hops cannot, because they share one file.
- **A design hop is a genuine prerequisite for `Ready`** — see `## Open design question`. This mirrors
  `ABC-026`, which sat in `Backlog` until an Architect/Design hop produced the number its criteria
  needed.
- **`EPIC-006` is the dated trigger** for `A2`: the first module that prints at import lands there.
- **Node >= 22.15** for `module.registerHooks`; the project runs v24.12.0 and `AGENTS.md` declares
  >= 22. On an older 22.x the child throws and the test **fails loudly**, which is correct for a
  guard — it must never pass by being unable to look. **It is deliberately not wrapped in a skip.**

## Security / NFR triggers

- **`NFR-008` / `N8-LANE` — this ticket owns the single most expensive item in the lane's recent
  growth.** The `RF-1` child process is **~102 ms** of the **~575 ms of a 650 ms** content allowance
  (~88%) that `ABC-017`'s fixture hop left behind. **Measurable target: after this ticket the total
  is ≤ 650 ms**, measured by `N8-LANE`'s own method — CPU (user + sys), median of paired per-round
  deltas, n ≥ 7 interleaved rounds, null control by identity — and `ADR-0008`'s ratified clauses still
  hold: `npm test` with `PERFT_DEEP` unset ≤ **3 s wall**, ≤ **13 s CPU**. **File count stays TWO.**
  > **~75 ms of margin, and `ABC-028` is competing for the same margin.** Whichever ticket lands
  > second **re-measures the TOTAL, not its own delta.** If form (a) of `A3` is chosen, rooting
  > `perft-bench.ts` may add a benchmark run to the probe — **price it before writing it.** `ABC-026`
  > owns the lane total and is the escalation route. **No bar is re-derived by this ticket.**
- **The probe must stay DETERMINISTIC.** Measured: **12 consecutive runs, 12 passed, 0 flaky**,
  56.9–70.0 ms, and the reason is structural — **there is no wall-clock assertion, no concurrency and
  no ordering dependence anywhere in it**, so a loaded machine costs it time and not correctness.
  **Measurable target: 12/12 identical after the change, and no duration is compared to anything.**
- **The probe's three controls must stay FALSIFIABLE** — two positive (`history-pane.ts` and `san.ts`
  in the closure) and one arming (`history.ts?arming` reported). Proven falsifiable by standalone
  re-execution: `roots = []` fails both positive controls. **A change that makes any control
  unfalsifiable is a regression even if the suite is green.**
- **`NFR-002` — no bar, target or level moves.** Production runtime importers must still measure
  **ZERO**, and the pane's runtime closure must still be exactly **seven** modules (`apply`, `fen`,
  `history-pane`, `legal`, `moves`, `position`, `san`).
- **Security: NONE, and it is not pre-waived.** No new dependency (`dependencies` is `{}`), no network,
  no file write outside the test's own reads of `src/`. **Firing threshold: any change that makes the
  probe's child accept input from outside the repository, or that adds a dependency.**
- **Skip count must be `0`**; `quality.gate_enforcement` is `blocking`.

## Test notes

1. **The two instruments are NOT nested and neither may be deleted.** Measured by QE:
   `WPERFT-STATIC` dies on the **regex alone**; `WQUERY`, `WREEXPORT`, `WINDIRECT`, `WDYNIMP` and
   `WBAREIMP` die on the **probe alone**. Any change that removes one because the other "covers it"
   loses a measured kill.
2. **The `?arming` query is load-bearing** and the comment at its site says so. A distinct URL is a
   distinct module instance, so the arming control produces a fresh load event regardless of what the
   closure phase already cached. **Without it the guard announces *"the instrument is broken"* when
   the truth is *"the property is violated"*** — the Engineer's own first version did exactly that.
   Do not "tidy" it.
3. **Re-run the five reach mutants after any channel change**, not just the two in the criterion:
   `WDYNIMP`, `WBAREIMP`, `WQUERY` (`import("./history.ts?v=2")`), `WREEXPORT`
   (`export { newGame } from "./history.ts"`) and `WINDIRECT` (a bare import inside `glyph-mode.ts`,
   a **transitive** pull through a non-pane production module). `WINDIRECT` is the one that proves the
   probe guards the whole production graph.
4. **`WSTDERR` must keep surviving.** Module-scope `console.error` is benign and correctly invisible.
   A channel fix that starts failing on stderr has over-reached.
5. **No explicit `testTimeout` is requested, and that is a decision.** `execFileSync` blocks the event
   loop, and vitest **can** still time it out — a synchronous 8 s body fails with
   `Error: Test timed out in 5000ms` under this repo's default (there is no `vitest.config.*`). The
   margin is ~71×–88×. If it ever fires, the message names neither `history.ts` nor the property.
   **Recorded so the omission is not mistaken for an oversight.**
6. **Do not re-derive the importer count.** It is **FOUR** test-file importers and **ZERO** production
   importers, counted independently four times (QE, Security/NFR, BA/PM, QE again), each time with the
   textual surface swept exhaustively first — zero re-exports, zero bare imports, zero extensionless
   paths.
7. **`A4` is one production line and it moves `src/history-pane.ts`'s md5.** That is expected and
   correct: the md5-stability constraint was evidence for four roles **while the ticket was open**,
   and it died at the merge — gates were re-run on `main` after the fast-forward. **It is the only
   production line this ticket is permitted.**

## Size and priority rationale

**Size `S` (2).** One instrument change and one comment, in **one existing test file plus one comment
line in one existing production file**; no new module, no new test file, no new dependency, no new
input, no architecture change. Calibrated against `ABC-024` (`S`: five criteria with named
discriminating mutants in one existing file) and against the `RF-1` probe itself, which was **built
from nothing** inside `ABC-017`'s `S`. Changing a channel on an instrument that already exists is
smaller than writing the instrument.

**Not `M`, with the honest caveat.** The one thing that could move it is form (a) of `A3`: rooting a
module that runs a benchmark at import may require a `main()` guard or an equivalent, which is a
production change in `src/perft-bench.ts` and a different conversation. **If the design hop chooses
form (a), this size is re-derived rather than inherited** — and that is stated now rather than
discovered mid-build.

**`SPLIT_REQUIRED` does not apply** — the rule bites at `XL` (8) and this is 2. The check a number
cannot answer: **a split must produce two independently valuable tickets**, and `A1`, `A2` and `A3`
are one subject (what the guards cover) reached through one file by one engineer; `A2` is a
**prerequisite** for one form of `A3`, which is the opposite of independence.

~~**Priority `P2`.** Applying the latent/live test:~~

- ~~**Not `P0`/`P1`.** Nothing is broken and nothing is imminent. Production runtime importers are
  **zero, measured**; `WPERFT-DYN` breaches `A11` **as literally worded** while the property `NFR-002`
  depends on is intact; and the stdout route's trigger is **`EPIC-006`**, which is `P2`, undecomposed,
  and not next. Unlike `ABC-028`, **nothing in the merged tree instructs anyone to remove a guard** —
  the one misleading note here calls a guard redundant, which invites deletion but does not measure
  it as safe.~~
- **Not `P3`.** `P3` is "someday". This has a **named, dated trigger** and a **measured breach of a
  merged criterion's literal words**, and the definition it produces is what the next role reading
  `A11` needs.

~~**Promote to `P1`** when `EPIC-006` is decomposed, or when any production module gains a module-scope
write to stdout — whichever comes first.~~

**RE-DERIVED 2026-08-11 by BA/PM at `refinement-ABC-019-a11`: `P2` → `P1`. The struck text above is
kept as the record, because the `P2` derivation was correct and it died on its own premise rather
than on a change of mind.**

- **The `P2` argument rested on one figure and that figure has changed.** It reads *"Production
  runtime importers are **zero, measured**"*. **Measured at this hop: ONE** — `src/turn-loop.ts`. The
  latent/live test therefore returns the other answer: this is **live**, not latent.
- **Neither of the two recorded promotion triggers fired, and a third one did.** `EPIC-006` is still
  undecomposed and no production module writes to stdout at import. What fired is stronger than
  either: **a merged criterion's two instruments are RED on a `P0` ticket's branch, and a `blocking`
  gate means that `P0` cannot merge until this ticket lands.** That trigger was not foreseen at the
  cutting hop and it is written down now so the next reader sees why the priority moved.
- **Not `P0`, and this is the line that is worth holding.** `P0` is *"there is no product without
  it"*. Nothing user-facing is broken: the pane is correct, the loop is correct, `NFR-002`'s premise
  is intact and measured, and no frame pulls the repetition derive. **This is a guard-scope defect
  blocking a `P0`, which is `P1` — being on a `P0`'s critical path does not make a ticket `P0`.**
- **The `S` size does NOT move with the priority** — see `## Size and priority rationale`. Priority is
  urgency; nothing about the work got bigger. The one condition that could move the size is still form
  (a) of `A3`, unchanged.

**Promote to `P0`** only if the frame path itself gains a runtime importer of `src/history.ts` — that
is `NFR-002`'s actual void-condition and it has never fired.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-12**. **Result: 7 of 10 clean, 1 ⚠️ and 2 ❌ — the Definition of Ready is NOT met, this
ticket stays in `Backlog`, and it needs an Architect/Design hop before it can reach `Ready`.** That is
`ABC-026`'s exact shape and it is the standard here.

- **problem clear — user, pain, value stated** ✅ — the user is `NFR-002`; the pain is three measured
  disagreements between a criterion and its own instruments; the value is stated without claiming
  anything is broken.
- **scope and out-of-scope clear** ✅ — five scope items; `## Out of scope` draws nine fences, each
  with a reason, including the four most tempting adjacent jobs (delete the regex, narrow the roots,
  replace the probe with a static walk, add a timeout) — **each refused with a measurement, not a
  preference**.
- **INVEST-shaped** ⚠️ — **valuable**, **small** (`S`), and **negotiable**. **NOT fully independent**
  (shares one file with `ABC-028`), and **estimable only under one of the two rulings** — form (a) of
  `A3` may pull a production change into `src/perft-bench.ts`. Recorded rather than claimed clean.
- **acceptance criteria clear, testable and measurable** ❌ — **`A1`, `A2` and `A4` meet the bar**:
  each names an exact site, a named discriminating build (`WSTDOUT`, `WSTDERR` as the negative
  control, `WPERFT-STATIC`), and a measured today-value. **`A3` does not, and it is not a wording
  problem**: its content is literally undecided, and the two forms assert **opposite** verdicts on the
  same build. **The contrast with `ABC-010` is the point** — `ABC-010` carries an open design question
  and still scores this item ✅, because its criteria do not depend on the answer. **Here they do.**
- **dependencies known** ✅ — one file-sharing dependency, one design-hop prerequisite, one dated
  consumer trigger, one runtime version floor.
- **security/NFR triggers marked, each with a measurable target** ✅ — `N8-LANE` with numbers
  (**≤ 650 ms content, ≤ 3 s wall, ≤ 13 s CPU**, ~75 ms margin, contention with `ABC-028` named), the
  probe's determinism (**12/12, no clock**) and its three falsifiable controls as bars in their own
  right; security **not pre-waived**, with a firing threshold.
- **test notes present** ✅ — seven, including the non-nested-coverage trap that would otherwise cost a
  measured kill, and the `testTimeout` omission recorded as a decision.
- **size assigned** ✅ — `S` (2), with the one condition that would move it named in advance.
- **priority assigned** ✅ — `P2`, derived from the latent/live test, with a stated promotion trigger.
- **no major unresolved blocker** ❌ — **the design question is a blocker for this ticket**, and that
  is the second ❌ rather than a restatement of the first: item 4 fails because a criterion cannot be
  written, and item 10 fails because **the thing that would let it be written is outside this role**.
  A dev hop that answered it in passing would be deciding architecture in development, which
  `ABC-010`'s own flag exists to prevent.

**Route to `Ready`: one hop.** An Architect/Design ruling on the open design question, after which
`A3` is written in one form, the size is re-derived if form (a) is chosen, and items 4 and 10 are
re-assessed. **No owner input and no new measurement are needed beyond that.**

### DoR re-assessment 2026-08-11 by BA/PM at `refinement-ABC-019-a11` — still NOT met, still 7 of 10, and the design hop is SHORTER

**The score does not move and that is deliberate: a ticket does not become Ready because it became
urgent.** What changed is the content of the two `❌`s and the length of the hop that clears them.

| # | Item | Before | Now | Why |
|---|---|---|---|---|
| 1 | problem clear | ✅ | ✅ | the user is still `NFR-002`; the pain is now **two** measured instances of the undefined word rather than one, arriving from opposite sides |
| 3 | INVEST-shaped | ⚠️ | ⚠️ | unchanged in kind, worse in degree — **not independent**: it now shares a file with `ABC-028` **and** gates `ABC-019` |
| 4 | acceptance testable + measurable | ❌ | ❌ | **still `A3`, and it is now `A3` for TWO reasons.** Its two forms still assert opposite verdicts on the same build, **and** form (b) is now recorded as **internally contradictory** with the *"either way `WPERFT-STATIC` must still die"* sentence. `A1` gained a clause and stays measurable |
| 9 | priority | ✅ | ✅ | **`P2` → `P1`**, re-derived from a premise that died rather than from a preference |
| 10 | no major unresolved blocker | ❌ | ❌ | **still the design question, and it is still outside BA/PM.** What changed: **one of its two readings is refuted by construction** (see `## Open design question`), so the hop is a narrower ruling than the one this ticket was cut for |

**Items 2, 5, 6, 7 and 8 are unchanged.** `## Scope` gained one item and `## Dependencies` gained the
`ABC-019` edge — both are *more* stated, not less. **No security or NFR target, bar or level moved**;
`plans/nfr-catalog.md` was **read and not edited**, and no ADR was re-opened.

> **THE HONEST TENSION, NAMED RATHER THAN RESOLVED BY SCORING.** This is `P1`, it blocks a `P0`, and
> its Definition of Ready is **not met** — so it cannot be pulled, and neither can the thing behind it.
> **Smoothing the DoR to unblock the `P0` is exactly the defect this project has recorded four times**
> (`ABC-024`, `ABC-026`, `ABC-028`, and this ticket at its own cutting hop), and it is refused again.
> **The way out is to run the Architect/Design hop NOW, not to pretend it already ran.** That
> scheduling call is the Orchestrator's; the input it needs is that the hop is now smaller and has two
> named questions rather than one open-ended one: **(i)** `perft-bench.ts`'s membership under the
> surviving frame-path reading, and **(ii)** `A3`'s internal contradiction.
