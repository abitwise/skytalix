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
