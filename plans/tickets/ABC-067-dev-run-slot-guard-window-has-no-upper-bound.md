---
id: ABC-067
title: The `Dev / run` slot guard's window has no upper bound — an unterminated HTML comment silently extends the scored region from 9 lines to 16, the block's own comment claims a protection it does not have, and the suite ships green
status: backlog
column: Backlog
size: XS
priority: P2
epic: —
feature: —
---

# ABC-067 — a guard that cannot say where it stops looking

> **Cut 2026-08-16 by BA/PM** (task `refinement-Q8-slot-guard`, Workflow 07) from QE/E2E's **`Q8`**
> (`MEDIUM`) against the `ABC-065` guard merged the same day at `460b9f5`. The Orchestrator ruled
> `Q8` **a real defect that gets a ticket rather than a quiet patch**; QE ranked it first of three
> carry-forwards, *"worth a hop"*. **Every figure below was re-measured at this hop against the
> working tree at `5cf86d3`** — see `.grugops/context/refinement-Q8-slot-guard/notes/`. Where my
> measurement and QE's differ, **this ticket carries mine** and the difference is recorded in the
> notes, not hidden.

## Problem

*User*: every future hop that trusts `src/cli.test.ts`'s `ABC-065` block to tell it whether
`AGENTS.md`'s `Dev / run` slot is honest — and, one level up, every human or agent who reads that
slot because the guard said it was fine.

*Pain*: **the guard has a start and no end.** `devRunSlot()` (`src/cli.test.ts:898-907`) takes
`start = agents.indexOf("- Dev / run:")` and `end = agents.indexOf("-->", start)` — **the first `-->`
anywhere later in the file**, not the end of *this* slot's comment. Delete the slot's own closing
delimiter and the guard does not fail to look; it looks at **more**, silently:

| | measured at `5cf86d3` |
|---|---|
| slot, unmutated | **9 lines, 800 bytes**, 0 further `- ` bullets inside it |
| slot, its own `-->` deleted (QE's mutant `N4`) | **16 lines, 1089 bytes**, **4** further `- ` bullets inside it — it swallows the two Perft bullets, the Spike bullet, the `### Test` heading and `- Test (all): \`npm test\`` |
| suite under `N4` | **GREEN, 32/32** |

**It stays green by accident of prose, not by construction**: none of the swallowed text happens to
carry a `--`-prefixed token. **Measured, not argued** — delete the *next* closer as well and the
window reaches the `Coverage` bullet, the collector picks up `--coverage` as a fourth documented
option, and `A3`'s set equality reds:
`['--ascii','--colour','--coverage','--unicode'] ≠ ['--ascii','--colour','--unicode']`.
**A guard whose scored region is decided by text it does not know it is reading has results that are
not reproducible.**

*And the block says otherwise in writing.* `src/cli.test.ts:902-903` reads *"A GUARD MUST NEVER PASS
BY BEING UNABLE TO LOOK: a renamed slot, **or one whose comment never closes**, would otherwise
arrive as an empty string."* The renamed half is true and proved (mutant `N13` reds). **The
never-closes half is false.** `end < 0` requires **no `-->` anywhere after `start` in the whole
file**, and `AGENTS.md` carries **14** of them on 13 lines — **13 of them after the slot's own** —
the last being the file's final line. **The branch is dead in practice, and a comment asserting an
untrue protection is worse than no comment: it is what the next reader will trust instead of
measuring.**

*Value*: `ABC-065` bought one thing — that `AGENTS.md`'s documented option list is compared to
`ACCEPTED_ARGUMENTS` instead of to nothing. **That purchase is only worth what the guard's boundary
is worth.** This ticket makes the boundary a property of the code rather than a property of whatever
prose happens to sit below the slot. It is the cheapest hop in the carry-forward set and it touches
no production file.

## Scope

- **`src/cli.test.ts`, the `ABC-065` describe block only.** Bound the slot window so the scored
  region cannot extend past this slot's own comment, and make the failure **loud** — a throw or a
  red row — rather than a silent enlargement.
- **The block's own comment at `:902-903`**: correct the never-closes clause so it states the
  protection the delivered code actually has.
- **Mutants that prove it**, added as assertions or exercised and reverted per the engineer's
  judgement: the one-closer-removed case must no longer ship green, and the two-closer case must be
  shown to be the reason the one-closer case was never safe.

## Out of scope

- **`AGENTS.md` is not edited.** The file is correct as it stands; the defect is in the reader, not
  the read. **Repairing this by rewording `AGENTS.md` — moving the slot, adding a sentinel, changing
  a comment so the current locator happens to stop in the right place — is FORBIDDEN**: it makes the
  guard's correctness depend on prose again, which is the defect.
- **No production file.** Zero files under `src/` other than `src/cli.test.ts`; zero lines outside
  `.test.ts`.
- **`Q7` — the second-`Dev / run`-slot blindness — is NOT in this ticket**, and it is the same root
  cause (an unanchored locator) seen from the other end. **It is being cut concurrently by the
  `refinement-abc065-wording` hop in `ABC-068`…`ABC-071`.** It needs a **uniqueness clause added to
  `ABC-065`'s merged `A1`**, which is merged ticket prose and a separate decision. **Flagged to the
  Orchestrator, not folded in silently.** See § Dependencies — **the two tickets touch the same six
  lines.**
- **`Q10`/`G8` — `ABC-065`'s `A2` line-range fence naming the wrong block — is NOT repaired here.**
  Same lane, different ticket's prose, outside this hop's single-id range, and also in
  `refinement-abc065-wording`'s five-item list.
- **No new test file, no new child process, no dependency change.**

## Acceptance (Given/When/Then)

- **`A1` (the window is bounded — the one-closer case reds).** **Given** `AGENTS.md` with the
  `Dev / run` slot's own `-->` removed and the rest of the file unchanged, **when** the `ABC-065`
  block runs, **then** it **FAILS** — by a throw naming the unterminated slot, or by a red row.
  *(Today: **GREEN 32/32**, measured at `5cf86d3`.)*
- **`A2` (the bound is a measurable property of the captured region, not a line count).** **Given**
  the unmutated `AGENTS.md`, **when** the slot is captured, **then** the captured text contains
  **0** occurrences of a further top-level list bullet (`"\n- "`), and under `A1`'s mutant that same
  count is **≥ 1**. *(Measured today: **0** unmutated, **4** mutated — the invariant is already
  true and simply unasserted.)* An engineer may satisfy the bound differently — by requiring the
  `-->` to precede the next `"\n- "`, or by matching the comment's own `<!--` … `-->` pair — but the
  criterion is scored on this observable, not on the technique.
- **`A3` (the dead branch becomes live, or stops claiming to exist).** **Given** the delivered
  block, **then** either (i) an input exists, exercised by a test, on which the
  "cannot locate the slot" failure path fires, **or** (ii) the comment at `:902-903` no longer
  claims the never-closes protection. **Both is acceptable; neither is not.** The measurable
  outcome: **0** sentences in the block asserting a protection with **0** tests behind it.
- **`A4` (the over-capture is proved harmful, not merely untidy).** **Given** `AGENTS.md` with the
  slot's closer **and** the next `-->` both removed, **then** the guard fails, and the recorded
  reason is the **unterminated slot** — **not** `--coverage`. *(Today, with `A1`'s fix absent, this
  input reds for the wrong reason: `A3`'s set equality picks up `--coverage` as a fourth documented
  option. A guard that reds for the wrong reason is the same instrument as one that greens for the
  wrong reason.)*
- **`A5` (`ABC-065`'s six merged criteria stay green and their subject is unchanged).** **Given**
  the delivered commit, **then** `src/cli.test.ts`'s `A1` and `A3` rows for `ABC-065` still pass
  against the **unmutated** `AGENTS.md`, `ABC-042`'s `AGENTS.md` row still passes, the captured slot
  on the unmutated file is still **9 lines / 800 bytes**, and the suite is green with skip **0**.
  **No merged criterion is re-opened and no merged row is deleted.**
- **`A6` (nothing else moved).** `git diff --name-only <delivered>~1 <delivered>` shows **exactly
  one** path — `src/cli.test.ts` — with **0** production lines, **0** new files, and `spawned` still
  **10**.

## Dependencies

- **`ABC-065` is merged to `main` @ `460b9f5`** and sits in `Ready for UAT`. This ticket **changes
  the guard `ABC-065` delivered**. **Sequencing is the Orchestrator's call and is not resolved
  here**: building `ABC-067` before `ABC-065`'s UAT changes the UAT's subject underneath the UAT
  Planner. Named, not decided by inference.
- **`Q7`'s ticket, cut in `ABC-068`…`ABC-071` by a hop concurrent with this one, WILL COLLIDE WITH
  THIS ONE IN `devRunSlot()`.** `Q7` (the locator has no *start* anchor — `indexOf` takes the first
  match) and `Q8` (it has no *end* bound) are one unanchored locator seen from two ends, and both
  repairs land in the same six lines. **This was discovered at the cut, not at the merge, and it is
  named here so it is not discovered at the merge.** **Recommendation: build the two in ONE hop, or
  fold them before either is pulled** — built separately, the second hop rewrites the first hop's
  function. **The Orchestrator decides; do not widen this ticket's scope on your own authority, and
  do not assume the sibling ticket's id — I could not read it.**
- **`Q10`/`G8` (`ABC-065`'s `A2` stale line-range fence) is open and in that same sibling's list.**
  `A2` fences `src/cli.test.ts:193-204` by line number. **This ticket edits that file**, so an
  insertion above line 193 moves what `A2` names. **Whoever holds `ABC-067` re-reads `A2`'s current
  wording from `main` before writing a line, and does not assume the fence still says `:193-204`.**
- **No product dependency.** `src/cli.test.ts` exists on `main`; nothing under `src/` other than the
  test file is read or written.

## Security / NFR triggers

- **`N8-LANE`, inherited by name — ≤ 650 ms CPU for the lane.** **0 new test files, 0 new files
  under `src/`, 0 new child processes.** The added work is bounded-string arithmetic on a
  `readFileSync` the block already performs; if the engineer adds fixture-based cases they operate
  on in-memory strings and read no additional file. **Target: the lane stays at or below its
  `ABC-065` figure of 152.5 ms (0.23× the 650 ms bar); a measured increase above 650 ms fails this
  ticket.**
- **`NFR-002` not triggered.** No frame path; no production module opened.
- **Security: not triggered.** `ABC-041`'s four clauses, answered rather than waved: **(a)** no
  manifest touch — `package.json` is neither read nor written; **(b)** no non-`.test.ts` file under
  `src/` is touched — this is the clause `ABC-066`'s Security/NFR hop showed is a **state**
  predicate, and the state here is that the single changed path ends `.test.ts`; **(c)** no network,
  no write, no spawn — read-only `node:fs` over the repository's own markdown, merged precedent;
  **(d)** blast radius is **one** path, a test file. **This ticket carries no fail-safe "run it
  anyway" sentence and that is deliberate — if the Orchestrator wants Security/NFR run, it is a
  scheduling decision, not something this page should pre-authorise.**

## Test notes

1. **`devRunSlot()` reads `AGENTS.md` from disk inside itself, so none of `A1`/`A4`'s inputs can be
   exercised without either mutating the repository's own `AGENTS.md` on disk or splitting the
   locator from the reader.** **Split it** — a pure function over a string, called by a one-line
   reader — and drive the mutants as in-memory fixtures. **Do NOT write a test that mutates
   `AGENTS.md` and restores it**: the shared working tree and single git index have already bitten
   four hops (`G5`), and a test that leaves the repo dirty on failure is a worse instrument than the
   one being repaired.
2. **Write the mutant first and watch it go GREEN before you fix anything.** `A1`'s input ships
   green today, 32/32. A hop that fixes the bound without first reproducing the green has not
   demonstrated it fixed this defect.
3. **Do not assert `AGENTS.md`'s prose.** `ABC-065`'s own test note 3 applies unchanged: the
   invariant is about the *shape* of the captured region, never about which sentences follow the
   slot. If your assertion would break when someone adds an honest bullet to `### Development`, it
   is the wrong assertion.
4. **`A4` is a second-order mutant and it is the point.** Removing one closer is not obviously
   harmful; removing two shows why the first was already unsafe. Record which row fires and on what
   message — "reds for the wrong reason" is the finding, and it must be visible in the failure text
   after the fix, not just in the notes.
5. **Re-measure the baselines rather than quoting this page.** 9 lines / 800 bytes / 0 bullets, and
   14 `-->` in `AGENTS.md`, were measured at `5cf86d3`. `AGENTS.md` changes often; if your figures
   differ, yours are the true ones and this page is stale.

## Lane cost — how many test FILES this ticket implies

**Zero.** One existing block in one existing file; no child process; fixtures are in-memory strings.

## Size and priority rationale

**Size `XS` (1).** One file, one hand, one function. The bound is a few characters of string
arithmetic; the largest real item is splitting the locator from the file read (test note 1), which is
a **move**, not new logic. **Not `S`**: `ABC-065` earned `S` for spanning two files and two pens
(Scribe + Engineer) — neither applies here. **If an engineer finds the split cannot be done without
touching `ABC-066`'s adjacent helpers, stop and re-size rather than widening.**

**Priority `P2`.** Nothing is broken for a user today and no product code is involved; the escape
needs the guard to be wrong *and* the file it reads to be wrong simultaneously. **Not `P3`**: the
instrument's results are not reproducible and `AGENTS.md` grows every few hops, so the luck this
currently rides on has a shrinking margin — and the block's comment actively misinforms the next
reader in the meantime. **Not `P1`**: `ABC-065`'s value is delivered and holding; this protects it,
it does not restore it.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 9 of 10 — item 10 carries a ⚠️ (two sequencing questions, neither a
blocker); the other nine are MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** user, pain and value stated; 9 → 16 lines, 800 → 1089 bytes, 0 → 4 bullets, GREEN 32/32, and the false comment quoted from source — all re-measured at this hop |
| 2 | scope and out-of-scope clear | **✅** one file; three named exclusions (`AGENTS.md` untouched, `Q7`, `Q10`) and the forbidden repair spelled out |
| 3 | INVEST-shaped | **✅** independent of every open ticket, small, and testable by an input that ships green today |
| 4 | acceptance testable and measurable | **✅** six criteria on numbers and states: fails-vs-32/32-green, bullet count 0 vs ≥1, 9 lines / 800 bytes preserved, 1 path, 0 production lines, `spawned` 10 |
| 5 | dependencies known | **✅** four named — and the two that are genuinely open (`ABC-065`'s UAT sequencing, `Q7`'s ownership) are handed to the Orchestrator rather than resolved by inference |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms against 152.5 ms; `NFR-002` untriggered; `ABC-041`'s four clauses answered individually |
| 7 | test notes present | **✅** five, including the disk-mutation prohibition and "watch the mutant go green first" |
| 8 | size assigned | **✅** `XS` (1), with the re-size trigger named |
| 9 | priority assigned | **✅** `P2`, with the reasons it is neither `P1` nor `P3` |
| 10 | no major unresolved blocker | **⚠️ TWO, both sequencing, neither scope.** (a) `ABC-065` is merged and in `Ready for UAT`, and this ticket edits the guard that UAT will exercise. (b) `Q7`'s ticket in `ABC-068`…`ABC-071`, cut concurrently, repairs the **same function**, and `Q10`/`G8` re-fences `A2` against the **same file**. **Both orderings are the Orchestrator's ruling and NEITHER is made here.** Neither is a *blocker* — the ticket is buildable at any moment — so they do not hold it in `Backlog`; they must be read before it is pulled. |
