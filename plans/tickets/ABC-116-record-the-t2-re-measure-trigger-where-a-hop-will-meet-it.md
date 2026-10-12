---
id: ABC-116
title: The `T2` re-measure trigger has a ruling and no carrier — record it where a hop that changes an existing child will actually meet it
status: ready
column: Ready
size: XS
priority: P2
epic: —
feature: —
---

# ABC-116 — give `T2` a carrier at the POINT OF CHANGE: comment prose only, zero production lines, zero assertions, zero new spawns

> **Cut 2026-08-21 by BA/PM** (task `cut-residual-followups-2026-08-21`, subtask
> `cut-residual-followups`, Workflow 07), on the project owner's instruction in session
> (*"cut those two tickets"*), out of Architect/Design's `G-QE115-3` ruling, which **named this
> ticket with a size, a priority and an owner and deliberately did not cut it** — *"cutting it and
> giving it an id are BA/PM's at a cut, and inventing an id here would be fabricating a board
> state."*
>
> **`ADR-0017`, `AR-N8SPAWN-DRIFT`, the `G-QE115-3` ruling, `ABC-115`, `ABC-108` and `NFR-008` ARE
> NOT RE-OPENED, NOT RE-SCORED AND NOT MOVED.** This ticket adds no bar, moves no bar, and argues
> with no ruling. It carries one that already exists to a place a hop will meet it.
> **`ABC-115` stays `Ready for UAT`, UNSIGNED, and this ticket does not sign it.**
>
> **NOTHING MECHANICAL IS BUILT AND NOTHING MECHANICAL IS OWED.** `ADR-0017` decision 1 rules the
> two time clauses non-mechanical **by design** and rejects the lane, the harness and the proxy on
> five priced grounds. A hop that reads this ticket as licence to build a guard has read it
> backwards — the falsifier that would earn one is `ADR-0017` `## Rollback`, and it is a runnable
> bar, not an argument.

## Problem

`ADR-0017` decision 2 opened **`T2`**: *a hop that changes WHAT AN EXISTING CHILD DOES — its argv,
its stdin script, its substitution hook, its settle — re-measures the per-child CPU clause, whether
or not the count moves.* It is the **only control** on `AR-N8SPAWN-DRIFT`, an accepted risk whose
teeth were measured rather than argued: deleting one substitution hook in `src/cli.test.ts` costs
**+2.68 s wall / +2.60 s CPU — 8.6x the `<= 0.30 s` per-child clause, from a single child — with
40 files / 1213 tests green and the count pin still armed.**

**The ruling exists in exactly one place and a hop that fires `T2` passes nowhere near it.** `T2` is
written in `plans/nfr-catalog.md`'s `G-QE115-3` section at **line ~1508 of a 1531-line file**, and in
`ADR-0017`. The `N8-SPAWN` account block itself — line ~1147, the part a checker reading the account
actually reads — **does not mention `T2` at all.** Re-derived at this cut: `grep -n "N8-SPAWN"
plans/tickets/*.md` finds the account named on 8 ticket pages and **`T2` on none of them**; `grep`
finds `T2` nowhere under `src/`.

**And `T1` is not the comparable it looks like.** `T1` works because the count pin **forces** the hop
to edit `const N8_SPAWN = 17 + 7` and write its reason. `T2` fires precisely when the count does
**not** move — so the one mechanism that makes `T1` self-enforcing is, by construction, absent for
`T2`.

**The measured precedent for why this matters:** `ABC-115` instantiated the `N8-SPAWN` account and
**never had a Security/NFR hop** — re-derived at this cut, there is no `security-nfr-ABC-115`
directory under `.grugops/context/` and no Security/NFR row in that ticket's traceability update log,
against 17 such directories for other tickets. The account's nominal checker did not act on the
ticket that created the account. **A trigger whose only carrier is "the checker will remember" has
already been tested here, and it failed.**

Measurements, the site inventory and the rejected carriers are in
`.grugops/context/cut-residual-followups-2026-08-21/notes/`, not on this page (`AGENTS.md`
`## Process rules` 2).

## The carrier ruling — WHERE it goes and WHO checks it, ruled here rather than left implicit

Architect/Design offered three candidates: *the gate checklist*, *the `## Security / NFR triggers`
block of future cuts*, **or both**. Re-derived at this cut, one of the three **does not exist in a
writable form** and the ruling changes shape accordingly.

**`C1` — REFUSED, and it is refused as IMPOSSIBLE rather than as unwanted.**
`agent-factory/checklists/security-nfr-checklist.md` — the file the Security/NFR role's own `## Reads`
names as *"the security/NFR gate checklist this role works through"* — is **read-only KIT**
(`AGENTS.md` `## Kit vs state`: `agent-factory/…` is never written) **and it is machine-generated**:
its own header reads `<!-- GENERATED — do not hand-edit. Re-run: node scripts/generate-asvs-checklist.js -->`,
and its body is the OWASP ASVS 5.0 requirement set — 345 rows, 17 chapters, **zero mentions of
`NFR-008`, `N8-SPAWN` or any budget of this project.** A `T2` line written there would be outside
this repository's state, would violate the kit fence, and would be **destroyed by the next
regeneration.** There is no project-side gate checklist to put it in either — `.grugops/` holds
`factory.config.json`, `install.json`, `test-skips.md` (human-owned), `context/` and `queue/`, and
nothing else.

**`C2` — THE POINT OF CHANGE, and this is the substantive carrier this ticket delivers.** The
surface `T2` names *is a named type in `src/cli.test.ts`*: `ChildOptions` (line 316 at `fcf12c1`) declares
`input` (the stdin script), `hook` (the substitution hook) and `timeout` (the settle), and `childOf` (line 333) takes the argv. **`T2`'s four spellings are that interface's fields plus that
function's arguments.** To change what an existing child does, a hop **must** edit one of them —
which makes this the one place a `T2`-firing hop provably passes through, and the count pin's
`T1`-equivalent for a trigger that has no count to move.

*Correction (BA/PM, 2026-10-12, `QE-116-a`/`QE-116-b`; the words above are kept). Line cites are at
`main` `d8794608`.*
- *"`timeout` (the settle)" is **false**. `timeout` is the hang bound that `childOf` passes to
  `spawnSync` (`:390`). The settle is a `sleep` in a child's shell argv: `sleep ${A9_SETTLE_SECONDS}`
  in A9's `/bin/sh -c` argv (`:498`). So the settle is reached through the argv, which is one of the
  four spellings, and not through a `ChildOptions` field. The delivered comment says this since fix
  `be6882b8`.*
- *Whether a change to the hang bound fires `T2` is **not ruled here**. See § BA/PM fold below.*
- *"A hop **must** edit one of them … provably passes through" is **stronger than the code**. A hop
  that changes what a child does edits one of these:*
  - *a `CHILDREN` entry (QE's measured mutant edits `black`'s hook, now `:698`);*
  - *a builder body (`closedReader`, `heldOpenReaderClosed`, `unwritableStdout`);*
  - *a constant that an argv reads (`A9_SETTLE_SECONDS`, `FIRST_LEGAL_ENGINE`).*

  *Each of these is a value that is typed by, or passed to, `ChildOptions`/`childOf`. It is not the
  interface or the function. The comment sits on the type that every child spawns through. That is
  next to the path of change, not on it.*

**`C3` — THE CUT, carried forward by copy.** `N8-SPAWN` rows propagate between tickets by being
copied from the most recent page that has one (8 pages today). This ticket writes a **canonical
`N8-SPAWN` row form that states `T1` and `T2` inline**, so the next cut that copies a row copies the
triggers with it. **Stated as a limit, not a promise: `C3` is only observable at a later cut**, which
is why `A3` measures what this ticket delivers and `A4` pre-registers what the later cut owes.

**Who checks it, at which hop: UNCHANGED — Security/NFR at the gate, BA/PM at the cut**, exactly as
`ADR-0017` decision 2 and the account already say. **No new role, no new hop, no new gate command, no
config change, and this ticket proposes none.**

**What makes this one different from the residuals this factory has lost** — the question the ruling
asked to be answered on the page rather than assumed: **every other carrier for `T2` is a document
someone must decide to read; `C2` is a line someone must edit in order to fire the trigger at all.**
It is the only candidate where the reader and the trigger-er are the same agent by construction.

*Correction (BA/PM, 2026-10-12, `QE-116-b`; the words above are kept): "by construction" is **weaker
than written**. The reader and the trigger-er are the same agent only when the hop reads the type of
the value it edits, and nothing forces that read. So `C2` is still a document someone must read. It
is the one placed nearest to the edit, on the type every child spawns through, and its own text now
says where the edit lands (fix `be6882b8`). It is closer to the path than `C1` or `C3`, and it is not
a mechanical guarantee. The carrier ruling still stands: `C1` is impossible, and `C2` and `C3` are
the carriers delivered. `C2` is the nearer of the two to the edit.*

## Scope

- **Comment prose in `src/cli.test.ts` only** — at the `ChildOptions` / `childOf` surface, stating
  `T2` and `T1` and pointing at `ADR-0017` and the catalog section by name.
- **The canonical `N8-SPAWN` row form on this page**, `T1` and `T2` inline, for the next cut to copy.
- **Zero production lines, zero assertions changed, zero `it` blocks added or removed, zero new
  spawns, zero new tests, zero new files under `src/`.**

## Out of scope

- **Any mechanical assertion, lane, harness, instrument or proxy for the two time clauses.**
  `ADR-0017` decision 1 rejects all four; `A5` forbids one being added here.
- **`plans/nfr-catalog.md` — NOT EDITED BY THIS TICKET.** See `## The edit owed elsewhere` below:
  one is named and it is not this ticket's to make.
- **`AGENTS.md`** — `ABC-109` is live against it under a byte cap. `ADR-0017` already named one
  sentence owed there (a reader could expect a fifth opt-in lane). **This ticket does not overlap
  it and does not duplicate it:** that sentence is about the `## Test` lane inventory; this ticket
  writes no lane and adds none.
- **Re-opening, re-scoring or moving** `ADR-0017`, `AR-N8SPAWN-DRIFT`, `ABC-115`, `ABC-108`,
  `NFR-008`, `N8-LANE` or `G-QE115-3`.
- **`AR-N8SPAWN-DRIFT`'s discharge**, which `ADR-0017` places at `ABC-144` § Scope 4 (re-pointed 2026-10-11
  from the dropped `ABC-108`'s remedy, `ADR-0017` § Pointers 2026-10-11). This ticket
  carries the control; it does not discharge the risk, and it must not be read as having reduced it.

## The edit owed elsewhere — NAMED, with its owner, and NOT MADE HERE

**One edit is owed to `plans/nfr-catalog.md` and this ticket does not make it:** a **one-line forward
pointer** from the `N8-SPAWN` account block (≈ line 1147) to the `T1`/`T2` subsection (≈ line 1508),
so a checker who reads the account meets the triggers. **Owner: Architect/Design**, who owns that
row, owns the account, and whose `G-QE115-3` section **reserves restatement in that file to that
role** in its own words. It is **not a target, bar, level, floor, account, instrument, statistic,
null control or `UNKNOWN - verify` marker**, and it moves none of them — but the pen is still not
BA/PM's. **The eight rows `NFR-001`–`NFR-008` hash to `63f66795…ca31`, verified by hashing at this
cut (8 matched lines), and this ticket requires that they still do afterwards (`A5`).**

## Acceptance criteria

- **`A1` (the trigger reaches the point of change, and it is grep-able).** **Given** the delivered
  branch tip, **when** `grep -n "T2" src/cli.test.ts` runs, **then** it returns **at least one line
  inside the comment block attached to `ChildOptions` or `childOf`**, and that block states, in
  words: (i) that changing an existing child's **argv, stdin script, substitution hook or settle**
  fires `T2`; (ii) that `T2` obliges a **re-measure of `N8-SPAWN`'s per-child CPU clause whether or
  not the count moves**; (iii) that the count pin **cannot** see it; and (iv) `ADR-0017` and
  `plans/nfr-catalog.md`'s `G-QE115-3` section, named. **A block missing any of the four FAILS.**
- **`A2` (the risk is named at the site with its measured teeth, and the number is re-derived not
  copied).** **Then** the same block names `AR-N8SPAWN-DRIFT` and states the measured cost of the
  one-line hook deletion. **The figure is re-measured at the delivering hop** — base copy and mutant,
  both outside the repository, `node_modules` symlinked, both readings recorded — **and if it
  disagrees with `ADR-0017`'s +2.68 s wall / +2.60 s CPU, the comment states THIS hop's measurement
  and the disagreement is written down.** Copying the ADR's number without a run **FAILS this
  criterion**, which is `ABC-114` `A3`'s discipline applied here.
- **`A3` (the canonical row exists and is copyable).** **Then** this page carries an `N8-SPAWN` row
  form that states `T1` and `T2` inline, and it is **quoted verbatim in the delivering hop's own
  `## Security / NFR triggers` block** — the first instance of the form is the ticket that creates
  it. Observable: the two blocks match on the trigger sentences.
- **`A4` (the propagation obligation, pre-registered because it is NOT measurable at this delivery).**
  **Then** the delivery note states, in one sentence, that **the next cut carrying an `N8-SPAWN` row
  owes `T1` and `T2` inline**, and names this ticket as where the form lives. **This criterion is met
  by the sentence existing, not by the later cut happening** — a criterion that could only pass at
  someone else's hop is not a criterion, and this page says so rather than pretending otherwise.
- **`A5` (the fence, checkable from git and from a hash — this is the row that makes "carries a
  ruling, moves nothing" a measurement).** **Then** `git diff --name-only main...HEAD -- src/` lists
  **exactly** `src/cli.test.ts`; `git diff --numstat main...HEAD -- 'src/' ':!src/*.test.ts'` is
  **empty**; **every added and removed line under `src/` is a `//` or `*` comment line** — zero
  assertion lines moved in either direction; `git diff --numstat main...HEAD -- plans/nfr-catalog.md
  AGENTS.md` is **empty**; and `grep -E '^\| NFR-00[1-8] \|' plans/nfr-catalog.md | shasum -a 256`
  returns **`63f667958eeabcaa884d45b18b513c7bbe9855266c4959dfd16f87b0802eca31`** on **8** matched
  lines. **Hashed, never promised.**
- **`A6` (the lane and the account do not move).** **Then** `npx vitest run --dir src` reports the
  **same file count, test count and skip count** before and after, both green, both readings
  recorded; `spawned` and `Object.keys(CHILDREN)` are both **unchanged**; and `const N8_SPAWN` is
  **byte-identical**. *Base measured at this cut on `main` @ `fcf12c1`: **re-measure at pull time
  rather than quoting this** — the lane has moved four times this week.* **`T2` does NOT fire on
  this ticket's own delivery** and the delivery note says so with the reason: a comment-only diff
  changes no child's argv, script, hook or settle. **A delivery that claims a re-measure it did not
  owe FAILS this criterion as surely as one that skipped a re-measure it did.**

## Dependencies

- **None blocking. Pullable today.** `ADR-0017` is merged (`9c56a6f`), the catalog section is
  merged, and the `ChildOptions` surface exists at `main` @ `fcf12c1` — all three verified at this
  cut rather than assumed.
- **Ordering, not a block:** `ABC-144` § Scope 4 holds `AR-N8SPAWN-DRIFT`'s discharge (re-pointed
  2026-10-11 from `ABC-108`/`ABC-110`, `ADR-0017` § Pointers 2026-10-11).
  This ticket does not wait on it and does not touch it.
- **`ABC-109` (`AGENTS.md` byte cap):** mutual awareness, neither blocking — this ticket writes zero
  bytes to that file (`A5`).
- **`ABC-114` shares `src/cli.test.ts`.** Comment-only edits rebase cheaply; a delivering hop that
  finds the surrounding block moved **re-measures rather than re-uses** `A2`.

## Risks

- **The comment is read as licence to build the guard `ADR-0017` refused.** This is the misreading
  the ADR exists to stop, and a fifth re-derivation of it is exactly what this project keeps paying
  for. Mitigated by `A1`(iv) requiring the ADR named at the site and by `## Out of scope`;
  **not eliminated**, and the page says so.
- **A comment is still a document someone must read.** `C2` is better than the alternatives because
  the reader and the trigger-er coincide — it is **not** a mechanism, and this ticket claims no
  mechanical guarantee. **`AR-N8SPAWN-DRIFT` stays exactly as accepted and exactly as large.**
  *Correction (BA/PM, 2026-10-12, `QE-116-b`): the reader and the trigger-er coincide only when the
  hop reads the type of the value it edits. See the correction under `C2`'s carrier paragraph. The
  rest of this bullet stands.*
- **The named checker may again not show up.** `ABC-115` had no Security/NFR hop at all. This ticket
  changes nothing about who is dispatched, and it cannot; naming that limit is the honest thing
  available to it.
- **The delivering hop authors a false sentence about a measurement it did not take.** The recursion
  that produced `ABC-113` and then `ABC-114`. `A2` mitigates it by requiring the run.

## Test notes

- Lane is `npx vitest run --dir src` and **never** the repo root (`AGENTS.md` `## Test notes` 5).
- **No test is added, deleted, trimmed, moved or re-titled.** The mutant of `A2` is planted in a
  **copy of the tree outside the repository**, `node_modules` symlinked, base measured first, and
  the repository's `src/` is byte-identical afterwards (`git status --porcelain -- src/` empty).
- Mandatory gates: `npm run lint`, `npm run typecheck`, `npm run build`, unit — all four, on the
  branch tip before merge and on `main` after, both recorded.
- **Test integrity:** `.grugops/test-skips.md` is **human-owned** — an agent may read it and run the
  check, never write a row into it. `quality.test_integrity` is `warn`.
- **QE hop is owed** (owner's standing rule, 2026-08-17) before `In Review` is exited. **QE is not
  UAT.** The delivered diff is expected to carry **zero production lines**, so the 2026-08-17 UAT
  waiver is expected to apply — **measured from git at the exit, never asserted here.**

## NFR / security

- **`N8-SPAWN`: 0 ms, 0 added children, and `T2` NOT FIRED** — comment-only; no child's argv, stdin
  script, substitution hook or settle changes (`A6`). **`T1` not fired**: the count literal is
  byte-identical. *This row is the canonical form `A3` names — a cut copying it copies both
  triggers.*
- **`N8-LANE`: no line is claimed, deliberately.** `ABC-108` is open and `NFR-008` is **BREACHED on
  the CPU clause by 1.480 s and UNRULED on wall**; a 5% slice of a spent total is not a slice. Same
  posture as `ABC-110`, `ABC-113` and `ABC-114`, for the same reason.
- **Falsifiable zeroes instead of a budget:** 0 production lines, 0 assertions changed, 0 new tests,
  0 new test files, 0 new spawns, 0 bytes to `AGENTS.md`, 0 bytes to `plans/nfr-catalog.md`, and the
  eight rows hashing to `63f66795…ca31` (`A5`).
- **Security: not engaged.** No input path, no process boundary, no filesystem write outside
  `plans/` and a comment, no network. ASVS L1 has nothing to bite on in a comment diff.

## Size and priority — the argument, not the label

**`XS`, and I agree with Architect/Design's `XS` on my own arithmetic rather than on their word.**
One comment block, one row form on this page, one mutant re-run that already exists as a one-line
diff. **The comparable is `ABC-114` (`S`), which is four comment sites plus three planted builds with
controls plus a FIFO harness a QE hop had shown cannot terminate.** This is one site and one mutant.
**Not `S`:** nothing is constructed, nothing is watched red, no control run is needed.

**`P2`, agreeing with the proposing role's label on a different argument — and the difference is
worth recording because it cuts both ways.** Architect's case was that the ruling has no carrier.
Mine is narrower and harder: **the specific carrier they named is unavailable** (`C1` — kit,
generated, regenerated away), so without this ticket the trigger's only home stays one dated section
at line ~1508 of a 1531-line file, while `AR-N8SPAWN-DRIFT` is live and `NFR-008` is already breached
by 1.480 s. That pulls **towards** `P2`. Pulling the other way, and stated rather than smoothed:
**`T2` IS written down today** in the catalog and in a merged ADR, and Security/NFR's role `## Reads`
already names the catalog — so this is a **discoverability** defect, not an absent control.

- **NOT `P1`:** nothing is blocked, no gate is wrong, no product behaviour is affected, no player
  sees anything, and the risk this controls is **accepted with a named owner and a named discharge**.
- **NOT `P3`:** the control is the only one `AR-N8SPAWN-DRIFT` has, the mutant that defeats it is one
  line, and the account's own nominal checker has already been measured absent once.
- **`P1` PROMOTION TRIGGER:** any hop measured changing an existing child's argv, stdin script,
  substitution hook or settle **without** a `T2` re-measure — i.e. the drift happening once for real.
- **`P3` DEMOTION TRIGGER:** Architect/Design makes the catalog pointer edit named above **and** a
  `T2` re-measure is observed happening unprompted at a real gate. Two events, not one: the pointer
  alone is a document, and this ticket's whole case is that documents were not enough.

*Re-statement (BA/PM, 2026-10-12, after `QE-116-a`/`QE-116-b`; the words above are kept): **NOT `P3`
still holds, and the `P3` demotion trigger has not fired.***
- *The three reasons in the NOT-`P3` bullet are: the only control, a one-line mutant, and a checker
  that was measured absent. None of them rests on `C2`'s "by construction". So the weaker premise
  does not move this ticket to `P3`.*
- *What it weakens is the `P2` case's contrast between `C2` and "a document". `C2` is a document,
  placed next to the edit. That makes the demotion trigger's second event, a `T2` re-measure
  observed happening unprompted at a real gate, the **only** evidence that the carrier works. So the
  trigger keeps both events. The catalog pointer edit alone (owed to Architect/Design, and in
  flight under `design-2026-10-12-fold`) does not demote anything. No unprompted `T2` re-measure
  has been observed: this ticket's own `A2` run measured a mutant, not a `T2` re-measure.*
- *`ABC-116` is `Done`, so its priority no longer orders any work. Both triggers survive as signals.
  If the `P1` promotion trigger fires, the next cut adds the one-line pointers that `QE-116-b`
  suggested, at the `CHILDREN` block and at `A9_SETTLE_SECONDS`. They are not cut today.*

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-21**. **Result: 9 of 10, ⚠️x1 — PULLABLE TODAY. The ⚠️ is item 4 and it is a CONSEQUENCE
authorised on the page, not an open question.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the user is the next hop that changes an existing child; the pain is a control with no checkpoint at the point of change, measured — `T2` on 0 of 8 `N8-SPAWN`-bearing ticket pages, 0 occurrences under `src/`, and `ABC-115` had no Security/NFR hop at all; the value is stated without overclaiming — the risk stays exactly as accepted |
| 2 | scope and out-of-scope clear | **✅** seven fences, including the mechanism `ADR-0017` refused, the catalog (named-and-not-made, with its owner), `AGENTS.md` under `ABC-109`'s cap with the overlap explicitly disclaimed, and `AR-N8SPAWN-DRIFT`'s discharge |
| 3 | INVEST-shaped | **✅** independent (`ADR-0017` merged, the surface exists at `fcf12c1`, both verified here), small, and every criterion is answerable at one hop by one agent. No split trigger is registered because there is nothing to split |
| 4 | acceptance testable and measurable | **⚠️ FIVE OF SIX ARE, AND `A4` IS NOT — NOT SMOOTHED.** `A1` is a `grep` with four named contents; `A2` is a paired run with a disagreement clause; `A3` is a text match between two blocks; `A5` is three git predicates, a comment-line-kind check and a **sha256 on 8 lines**; `A6` is three counts and two literals. **`A4` is an obligation on a LATER cut and cannot be measured at this delivery** — it is written as *the sentence must exist*, which IS measurable, and the page says outright that the propagation itself is not. **A page scoring ✅ here would be promising enforcement it has no mechanism for** |
| 5 | dependencies known | **✅** four, each with its direction: none blocking, `ABC-108`/`ABC-110` ordering only, `ABC-109` mutual and non-blocking, `ABC-114` a shared file with a re-measure instruction |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-SPAWN` **0 ms / 0 children / `T1` and `T2` both explicitly NOT FIRED with the reason**, in the canonical form this ticket creates; `N8-LANE` written in `ADR-0014` decision 4's form — 0 ms measured **and** the clause state BREACHED, so it cannot be read as a pass; security not engaged with the reason; and the eight rows pinned by hash |
| 7 | test notes present | **✅** five, including the out-of-repository mutant discipline, the human-owned skips file, the owed QE hop, and the UAT waiver named as **measured at the exit, never asserted here** |
| 8 | size assigned | **✅** `XS`, with the `ABC-114` comparable and the not-`S` argument |
| 9 | priority assigned | **✅** `P2`, with the not-`P1` and not-`P3` arguments, both directions of the case stated including the one that argues against this ticket, and two named triggers |
| 10 | no major unresolved blocker | **✅** none. The one edit this ticket implies elsewhere is **named with its owner and deliberately not made**, which is a disclosed hand-off rather than a blocker — the same stop `ADR-0017` `§7` and `ABC-108`'s `A5` recorded |

Column moves are the Orchestrator's.

## Re-score — 2026-10-10 (BA/PM, subtask `bapm-rescore-backlog-r1-2026-10-10`, wave tip `39d87491`)

**Verdict: READY. DoR 10/10. `XS`, `P2` kept.** `column`/`status` are not moved here; `Backlog → Ready`
is the Orchestrator's. The cut text above is history and stands, **except where the amendments below
supersede it**. Where they conflict, this section wins.

**Premise re-measured at `39d87491`, and it HOLDS:**
- `grep -cw T2 src/cli.test.ts` = **0**. `interface ChildOptions` is at `:319` and `const childOf` at
  `:336`.
- `ABC-138` (`Done`, the spawn-pin holes ticket) carries `T2` **0** times, so it did not absorb this one.
- **The need grew.** `AR-N8SPAWN-DRIFT`'s only recorded discharge point was *"at `ABC-108`'s remedy"*.
  `ABC-108` is recommended DROP at this hop, and no discharge is recorded anywhere. `T2` is now the only
  thing standing on that risk, with no end date.

**Amendments — each stale against the tip or against accepted `ADR-0035`:**
- **`A1`(ii), re-read:** `T2` obliges a re-measure **on the narrow file set, `src/cli.test.ts`, by
  `ADR-0035` decision 2**. It reports the median, the twin's `R` and the state (MET / NOT MET /
  UNRESOLVED, decision 1) against the per-child clause. The comment names **decision 3's per-set `F`** as
  the floor to read, and **does not quote `F`'s number**: `F` is data that moves, and a live number in a
  comment is `ABC-030`'s defect class.
  - **Disclosed limit, not hidden:** that file's `F` is **1.097 s**, above the **0.30 s** per-child
    clause. A small drift therefore reads UNRESOLVED.
  - The measured failure mode (**+2.60 s CPU**, one deleted hook) reads **NOT MET at any `R`**, so `T2`
    still catches the drift it exists for.
- **`A2`, re-read:** the hook-deletion re-measure is a paired reading on `ADR-0035` decision 2's harness:
  base, mutant and identity twin, n ≥ 8, round 0 discarded, load1 logged. It is reported with its `R`.
  This stays `XS`: one file, ~27 runs.
- **`A5`'s hash pin is VOID.** `63f66795…ca31` is no longer the tip's value. The `NFR-005` and `NFR-008`
  rows moved on the owner's word (`…d1e00b44`), and the hash at `39d87491` is `c74e7426…0d3b`. **Read
  `A5` as:** the 8-line hash is **identical at the branch base and the tip**, both values recorded.
- **`A6` and test notes, the lane:** read `npx vitest run --dir src` as **`npm test`**.
  - Since `ABC-093` merged, `tools/opening-book/book.test.ts` sits outside `src/`, so `--dir src`
    collects 52 files where `npm test` collects 53 (`QE-093-d`).
  - The cited *"`AGENTS.md` `## Test notes` 5"* no longer exists. Drop that cite.
- **`## NFR / security`, `N8-LANE`, re-read:** `NFR-008` is now R-1 (wall ≤ 10 s gate, CPU reported).
  This diff is comment-only, so **the count is the pin** (`ADR-0035` decision 3): 0 test files, 0 tests,
  0 spawns, and **no timing bound written**. The *"BREACHED by 1.480 s / UNRULED on wall / `ABC-108` open"*
  sentence is history.
- **Dependencies, re-read:**
  - `ABC-108`/`ABC-110` ordering is void.
  - `ABC-115` and `ABC-109` are `Done`. Still 0 bytes go to `AGENTS.md`.
  - `ABC-114` and `ABC-117` share `src/cli.test.ts`. All three are comment-only. Whichever lands second
    rebases and re-reads its own sites.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** re-measured: 0 `T2` at the point of change; the discharge orphaned |
| 2 | scope and out-of-scope clear | **✅** unchanged |
| 3 | INVEST-shaped | **✅** independent; `XS` holds with the `A2` harness (one file) |
| 4 | acceptance testable and measurable | **✅** — *was ⚠️.* `A4` is met by a sentence existing, and that **is** measurable. The propagation it cannot measure is not claimed by `A4` and is disclosed in `## Risks`. The ⚠️ marked a limit, not an untestable criterion |
| 5 | dependencies known | **✅** re-read above |
| 6 | security/NFR triggers with a measurable target | **✅** count pin (0/0/0) per `ADR-0035` decision 3; `A1`(ii) carries decision 1's three states |
| 7 | test notes present | **✅** lane re-pointed to `npm test` |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P2`. The `P1` trigger (an observed un-re-measured child change) has not fired |
| 10 | no major unresolved blocker | **✅** none |

## Canonical `N8-SPAWN` row form (`A3`) — copy this row whole; fill only the angle brackets

Written 2026-10-12 by the Software Engineer at the delivering hop (`ticket-to-pr-ABC-116`). The two
trigger sentences are fixed text. A cut or a delivery that carries an `N8-SPAWN` row copies them
unchanged and fills in only the readings and the fired / not-fired verdicts.

> - **`N8-SPAWN`: `<n>` added children, `<ms>` charged.**
>   **`T1` — a hop that changes the NUMBER of children re-measures both time clauses; the count pin forces the `N8_SPAWN` edit.** `T1` `<FIRED | NOT FIRED>`: `<reason>`.
>   **`T2` — a hop that changes WHAT AN EXISTING CHILD DOES (its argv, its stdin script, its substitution hook or its settle) re-measures the per-child CPU clause on `src/cli.test.ts`, whether or not the count moves (`ADR-0035` decision 2: median, the twin's `R`, MET / NOT MET / UNRESOLVED against that set's `F`); the count pin cannot see it.** `T2` `<FIRED | NOT FIRED>`: `<reason>`.
>   Ruling: `ADR-0017` decision 2; `plans/nfr-catalog.md` § `G-QE115-3`; carrier at the point of change: the comment on `ChildOptions` in `src/cli.test.ts` (`ABC-116`).

## Delivery

Software Engineer (Claude Opus 5.5), 2026-10-12, subtask `ticket-to-pr-ABC-116`, run at width 1.
- **Branch.** `grugops/ABC-116-t2-carrier` from `main` @ `3c38a8ea` (the subtask frontmatter says
  `cc2d4cdc`, which is the parent of `3c38a8ea`; `3c38a8ea` only moves the board and the queue).
- **Commits.** The carrier commit is `9b8c38ec`. This section, the notes and the trace row follow it.
- **Status.** Not pushed, not merged, and no column moved. **QE is owed.**
- **Where the evidence is.** Readings: `.grugops/context/ticket-to-pr-ABC-116/notes/`. Raw TSV of
  every timed run: `…/probe/a2-runs.tsv`.

- **`A1`.** `grep -n "T2" src/cli.test.ts` hits `:322`, `:324`, `:330` and `:336`. All four are inside
  the JSDoc on `interface ChildOptions` (`:321-346`, the interface at `:347`). The block states each
  of the four parts:
  - (i) argv / stdin script / substitution hook / settle, named as `args`/`productArgv`, `input`,
    `hook` and `timeout`;
  - (ii) the per-child CPU re-measure whether or not the count moves, on the narrow set, with the
    median, the twin's `R`, the three states and decision 3's per-set `F` (named, no number);
  - (iii) the count pin cannot see it;
  - (iv) `ADR-0017` decision 2 and `plans/nfr-catalog.md`'s `G-QE115-3` section, both named.
- **`A2` — measured at this hop; the readings are in note `…55c8efb6`.**
  - **Mutant:** `black`'s `FIRST_LEGAL_ENGINE` hook deleted, one line.
  - **Set-up:** base / mutant / identity twin, outside the repository, with `node_modules` symlinked.
    `npx vitest run src/cli.test.ts` on vitest 4.1.11, 2 workers, module runner off.
  - **Order:** rotated, 9 rounds with round 0 discarded, so n = 8. 60 s idle before the first run
    and 20 s before each later run.
  - **Paired medians: +3.08 s wall and +3.12 s CPU.** The intervals are +2.91..+3.19 and
    +3.00..+3.27, and the sign is 8/8 on both.
  - **Twin:** R = 0.18 s wall / 0.10 s CPU, admissible.
  - **State: NOT MET** against the 0.30 s per-child clause, at any R.
  - **Every run:** 1 file / 69 tests, all green. Thermal 0 before and after every run. AC power.
    load1 2.4–9.3, logged and not gated.
  - **Discarded:** 3 runs, for another project's runner (`oeselg-labs/platform/repos/shared`); each
    was re-taken. One earlier start was aborted before any run.
  - **Disagreement with `ADR-0017` (+2.68 s / +2.60 s), written down:** this hop reads +0.40 s more
    wall and +0.52 s more CPU. The instrument, runner, worker cap, Node and tree all differ, and no
    single cause is claimed. The comment states this hop's figures and the disagreement.
- **`A3`.** The canonical form is the section above. Its trigger sentences are quoted unchanged
  below.
- **`A4`. The next cut that carries an `N8-SPAWN` row owes `T1` and `T2` inline, in the canonical
  row form that lives on this page (`ABC-116`, § Canonical `N8-SPAWN` row form).**
- **`A5`.**
  - `git diff --name-only main...HEAD -- src/` lists exactly `src/cli.test.ts`.
  - The non-test `src/` numstat is empty.
  - `src/cli.test.ts` is +25/−0, and every added line is a ` * ` comment line.
  - The numstat for `plans/nfr-catalog.md` and `AGENTS.md` is empty.
  - **8-row hash: `c74e7426…0d3b` at base `3c38a8ea` AND at the tip, on 8 lines.** That is equal.
  - **Drift from this page, written down:** the page's `63f66795…ca31` is stale. It was taken at
    `fcf12c1`, and the rows have moved twice since.
  - **Named and NOT made:** the one-line `plans/nfr-catalog.md` pointer from the `N8-SPAWN` account
    block (now `:1192`) to the `T1`/`T2` bullets (now `:1629-1630`). Its owner is Architect/Design.
- **`A6`.**
  - **Counts:** `npm test` read **56 files / 1743 tests / 0 skipped** at base (`main` checkout) and
    at head (worktree). Both exit 0, and both have `success: true`.
  - **Pin lines:** the non-comment `N8_SPAWN` / `spawned` / `Object.keys(CHILDREN)` lines hash the
    same at `main` and the tip (`2f156443…`). `const N8_SPAWN = 17 + 7 + 1 + 2;` is byte-identical.
  - **`T2` does NOT fire on this delivery.** The diff is comment-only, so no child's argv, stdin
    script, substitution hook or settle changes.
  - **The `A2` reading is not a `T2` re-measure.** It measures a mutant that was never delivered.
- **Gates at the tip, run after the window and never during it:**
  - `npm run lint`, `typecheck` and `build` exit 0;
  - `npm test` exits 0, and `.test-results/last-run.json` reads `success: true`;
  - skip integrity at 0 reads `No findings.`
- **UAT-waiver reading:** `git diff --name-only main...HEAD | grep -v '\.test\.ts$' | grep '^src/'`
  is **empty**, so 0 production lines. The waiver applies at the exit, and it is not a signature.
- **2026-10-12, repair of QE-116-a/b (Software Engineer, subtask `fix-ABC-116`, comment lines only).**
  - **QE-116-a.** "its settle (`timeout`)" now reads "its settle (a `sleep` in a child's shell argv,
    e.g. `A9_SETTLE_SECONDS`) … `timeout` is the hang bound, not the settle". Checked in the code:
    `timeout` is `spawnSync`'s bound in `childOf`, and `A9_SETTLE_SECONDS` is a `sleep` in A9's
    `/bin/sh -c` argv. Neither `ADR-0017` decision 2 nor the catalog's `G-QE115-3` says whether a
    change to the hang bound fires `T2`. The comment does not rule on it, and the question is named
    for BA/PM.
  - **QE-116-b.** "on the surface such a hop has to edit" now says that the block sits on the options
    type of `childOf`, which every child spawns through. The edit itself lands in a `CHILDREN` entry
    or in a constant a child's argv reads, not in this block.
  - **QE-116-c/d.** The two logs were renamed to `a2-window.log.txt` (`git mv`, no `-f` needed). The
    rename, and the logs' add commit `d39618d1`, are recorded in a note under
    `.grugops/context/fix-ABC-116/notes/`.
  - **`C2` is NOT edited.** This page does not say the Engineer may edit it. Its "`timeout` (the settle)" and
    "the reader and the trigger-er are the same agent by construction" are named for BA/PM.
  - The `src/` diff is still `src/cli.test.ts` only, now +28/−0 against `main`, and every line is a
    comment line. `N8_SPAWN` is byte-identical. `T2` does not fire.

### Security / NFR triggers

> - **`N8-SPAWN`: 0 added children, 0 ms charged.**
>   **`T1` — a hop that changes the NUMBER of children re-measures both time clauses; the count pin forces the `N8_SPAWN` edit.** `T1` NOT FIRED: `const N8_SPAWN = 17 + 7 + 1 + 2;` is byte-identical.
>   **`T2` — a hop that changes WHAT AN EXISTING CHILD DOES (its argv, its stdin script, its substitution hook or its settle) re-measures the per-child CPU clause on `src/cli.test.ts`, whether or not the count moves (`ADR-0035` decision 2: median, the twin's `R`, MET / NOT MET / UNRESOLVED against that set's `F`); the count pin cannot see it.** `T2` NOT FIRED: the diff is 25 comment lines; no child's argv, stdin script, substitution hook or settle changed.
>   Ruling: `ADR-0017` decision 2; `plans/nfr-catalog.md` § `G-QE115-3`; carrier at the point of change: the comment on `ChildOptions` in `src/cli.test.ts` (`ABC-116`).
- `N8-LANE`: the count is the pin (`ADR-0035` d3): 0 test files, 0 tests, 0 spawns, no timing bound written.
- Security: not engaged (comment diff; no input path, process boundary, network or write outside `plans/` / `.grugops/`).

## QE

QE/E2E (Claude Opus 5.5, subagent of the Orchestrator), 2026-10-12, subtask `qe-ABC-116`, on branch
`grugops/qe-ABC-116` off tip `d39618d1`. **Verdict: PASS_WITH_GAPS.**
- **Order.** QE's own A1 and A2 readings were taken before the build notes and the TSV were read.
- **Notes.** `.grugops/context/qe-ABC-116/notes/`; raw TSV in `.grugops/context/qe-ABC-116/probe/`.
- **Status.** This is an agent `decision`, not a stamp.

- **A1 MET as written.** All four parts (i)–(iv) are present inside the `ChildOptions` JSDoc
  (`:322`, `:324`, `:330`, `:336`). Checked claim by claim against the code, two are not true:
  - **QE-116-a (MEDIUM, recommended repaired before merge).** "its settle (`timeout`)" is wrong.
    `timeout` is the `spawnSync` hang bound. The settle is `A9_SETTLE_SECONDS` (`:484`), a `sleep`
    inside A9's shell argv (`:495`).
  - **QE-116-b (LOW).** "the surface such a hop has to edit" overclaims. The block's own mutant edits
    `CHILDREN.black` at `:695`, not the interface or `childOf`.
  - Both are inherited from this page's `C2`.
- **A2 MET; QE's spot check PASSES.** These are two out-of-tree trees of the tip with the same
  one-line hook deletion: `/usr/bin/time -l npx vitest run src/cli.test.ts`, 5 alternating pairs after a
  warm-up round, 60 s idle first, ≥ 20 s between runs.

  | pair | order | Δ wall (s) | Δ CPU (s) |
  |---|---|---|---|
  | 1 | B-M | +3.21 | +3.21 |
  | 2 | M-B | +3.11 | +3.20 |
  | 3 | B-M | +3.15 | +3.13 |
  | 4 | M-B | +3.09 | +3.21 |
  | 5 | B-M | +3.46 | +3.58 |

  - **Medians: +3.15 s wall, +3.21 s CPU, with sign 5/5.** Against the Engineer's +3.08 / +3.12, that is
    +0.07 / +0.09, inside ±0.5 s.
  - Every kept run read 69/69 green, thermal 0 and AC power. load1 ran 2.51–4.58.
  - 8 runs were discarded for another session's runner (`oeselg-labs/platform`). The first window was
    aborted and re-taken.
  - The Engineer's TSV recomputes exactly: +3.080 / +3.115, x(2)..x(7) +2.91..+3.19 / +3.00..+3.27,
    8/8, twin R 0.180 / 0.100.
  - Their 3 discards each carry a foreign count, and no kept row does. Their mutant is the one line.
  - The comment's figure and the disagreement sentence claim no cause beyond what was measured.
- **A3 MET.** The `T1` and `T2` sentences and the `Ruling:` line are `cmp`-equal between the canonical
  form and the triggers quote.
- **A4 MET.** The sentence is at `## Delivery` `:392`.
- **A5 MET.**
  - The `src/` diff is `src/cli.test.ts` only: +25/−0, 0 non-comment lines.
  - Non-test `src/`, the catalog and `AGENTS.md` are all empty.
  - The 8-row hash is `c74e7426…0d3b` at base and at tip.
  - The pointer is named and not made, and `:1192` / `:1629-1630` are correct.
- **A6 MET.**
  - `npm test` reads 56 / 1743 / 0 at base and at tip, both `success: true`.
  - The `N8_SPAWN` pin lines and the `CHILDREN` block are hash-identical.
  - `T2` did not fire, and the mutant run is not claimed as a `T2` re-measure.
- **Gates at the tip, run after the timed runs.**
  - Lint, typecheck and build exit 0.
  - `npm test` exits 0.
  - The skip count is 0, and the integrity check reads `No findings.`
- **UAT waiver.** The production `src/` diff is empty, measured, so the waiver applies. It is not a signature.
- **The force-added `*.log` files (QE-116-c, LOW).** Acceptable as a record, but rename them to
  `*.log.txt`. They are the only tracked `*.log` files, `.gitignore` still matches them, and `rg`
  does not list them.
- **QE-116-d (INFO).** Note `…ae9de9b2` places the logs in `9b8c38ec`. They were added at `d39618d1`.

### QE — addendum, 2026-10-12: re-check of the QE-116-a..d repair (`qe2-ABC-116`)

QE/E2E (Claude Opus 5.5, subagent of the Orchestrator), subtask `qe2-ABC-116`, branch
`grugops/qe2-ABC-116` off tip `ffe52710`. This agent did not author the repair, and it read the code
and git before the Engineer's notes. **Verdict: PASS_WITH_GAPS** (INFO only, none blocking). Notes are in
`.grugops/context/qe2-ABC-116/notes/` (`…a0f3e853` readings, `…43bb8876` commands, `…6a1c2b14` verdict).
This is an agent `decision`, not a stamp. No timing readings were taken.

- **QE-116-a and QE-116-b CLOSED.** Every changed sentence is true of the code:
  - `timeout` is the bound `childOf` passes to `spawnSync` (`:390`).
  - The settle is `sleep ${A9_SETTLE_SECONDS}` in A9's `/bin/sh -c` argv (`:498`).
  - `spawnSync(` occurs once, inside `childOf` (`:374`), and every child spawns through it.
  - A1's (i)–(iv) are still present.
  - **QE2-116-a (INFO):** "where the edit lands" omits the builder bodies (`closedReader`,
    `heldOpenReaderClosed`, `unwritableStdout`). (i) still fires `T2` on any argv change.
- **The refusal to add "or its bound (`timeout`)" is CORRECT.** `ADR-0017` decision 2 names four things,
  and the bound is not among them. QE's input for the routed question: on a green lane a bound change is
  either a cost no-op, or a visible red, because a reached bound returns `ETIMEDOUT` and `childOf`
  throws. It is never silent drift. The ruling stays with BA/PM and Architect/Design.
  - **QE2-116-b (INFO):** note `…16a8ee37`'s "two orders of magnitude" does not hold for A9's 4 s bound.
- **QE-116-c and QE-116-d CLOSED.**
  - Both logs are `R100`-renamed to `*.log.txt`; `git ls-files '*.log'` is empty, and neither new name
    is ignored.
  - `d39618d1` is the correct add commit.
  - No committed note was edited.
  - **QE2-116-c (INFO):** note `…79e292cc`'s "traceability does not name them" is overtaken by the same
    commit's row.
- **Fence MET against `3c38a8ea`.**
  - `src/` changes only `src/cli.test.ts`: +28/−0, all comment lines, with the non-comment hash equal.
  - The catalog, `AGENTS.md` and the board are untouched.
  - The NFR hash is `c74e7426…0d3b` at base and at tip.
  - `N8_SPAWN` is byte-identical. `T1` and `T2` did not fire.
- **Gates at the tip.**
  - Lint, typecheck and build exit 0.
  - `npm test` reads 56 files / 1743 tests, `success: true`.
  - The skip count is 0, and the integrity check reads `No findings.`
  - `host-protection.js` exits 2 (`UNKNOWN - verify`, no remote).
- **UAT waiver** applies, measured over the tip, the fix commit and `main...HEAD`. It is not a signature.
- **Still owed:** `C2`'s "`timeout` (the settle)" (BA/PM); the hang-bound question (BA/PM and
  Architect/Design); the `In Review` exit (Orchestrator).

## BA/PM fold — 2026-10-12

BA/PM, subtask `bapm-fold-2026-10-12`, branch `grugops/bapm-fold-2026-10-12` from `main` @ `d8794608`.
Nothing was measured, and no timing was taken. The line cites are a read of `src/cli.test.ts` at
`d8794608`. The QE verdicts and `Done` are unchanged. The reasons are in
`.grugops/context/bapm-fold-2026-10-12/notes/`.

- **`C2` corrected with dated lines.** "`timeout` (the settle)" is false: `timeout` is the hang
  bound, and the settle is a `sleep` in a child's argv. "The reader and the trigger-er are the same
  agent by construction" is weaker than written (`QE-116-b`). Nothing is struck. The `## Risks` bullet
  that repeats the claim has a pointer.
- **`P3` re-stated under § Size and priority.** NOT `P3` still holds, and the demotion trigger has not
  fired.
- **The hang-bound `T2` question: routed, not ruled.** The question is whether a change to a child's
  hang bound (`timeout` in `childOf`) fires `T2`. It belongs to Architect/Design, which owns
  `ADR-0017` decision 2. It is being ruled in parallel as an `ADR-0017` addendum (subtask
  `design-2026-10-12-fold`, item 1). QE's input is in `.grugops/context/qe2-ABC-116/notes/…6a1c2b14`:
  on a green lane, a bound change is either a cost no-op or a visible red, and never silent drift.
  - **BA/PM's part once it is ruled:** if the addendum adds the bound to `T2`, BA/PM appends that to
    § Canonical `N8-SPAWN` row form on this page, as a dated line, because the row form is this
    page's. The comment line in `src/cli.test.ts` is an SE hop that the Architect names.
  - If the addendum does not add the bound, nothing on this page changes.
  - Until it is ruled, this page reads the four spellings exactly as `ADR-0017` decision 2 names
    them.
