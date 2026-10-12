---
id: ABC-117
title: The record says a failed non-`EPIPE` stdout write exits `1` = `USAGE_EXIT_CODE` — it does not, and the fix a future hop would reach for cannot work
status: ready
column: Ready
size: XS
priority: P2
epic: EPIC-006
feature: —
---

# ABC-117 — correct SEVEN sites that state a mechanism the build does not have: append-only, zero production lines, zero assertions

> **Cut 2026-08-21 by BA/PM** (task `cut-residual-followups-2026-08-21`, subtask
> `cut-residual-followups`, Workflow 07), on the project owner's instruction in session
> (*"cut those two tickets"*), out of QE/E2E's `G-QE115-5` hop, which **found the false sentence,
> reproduced the true mechanism in eleven lines, named this ticket with a size, a priority and an
> owner, and deliberately refused to cut it** — *"Notes are append-only, so this cannot be a silent
> edit, which is exactly why it needs an owner."*
>
> **THIS IS A CORRECTION OF RECORD. IT DOES NOT RE-OPEN THE RESIDUAL, AND THAT IS A CRITERION
> (`A5`), NOT A COURTESY.** The knowingly-accepted stdout-write residual stays accepted. `ADR-0016`
> clause 3's *"behaves exactly as it does today"* stays true and untouched. `ABC-115`'s criteria,
> its `A10` row, QE's PASS, the exit-code ruling and `ADR-0017` are **not re-opened, not re-scored
> and not moved.** **`ABC-115` stays `Ready for UAT`, UNSIGNED, and this ticket does not sign it,
> move it or mention it as accepted.**
>
> **ZERO PRODUCTION LINES ARE OWED — ruled on this page, not left to the delivering hop.** See
> `## Ruling — is anything in `src/` owed?`. A product change **is** owed by whoever eventually
> closes the residual, and it is **named and sized there and deliberately not cut**.

## Problem

Seven sites of record state that on a **failed non-`EPIPE` stdout write** the product exits `1`
**because `USAGE_EXIT_CODE` was assigned**. It was not. That `1` is **Node's default status for an
unhandled exception**, which merely collides with `USAGE_EXIT_CODE`'s value.

**Re-derived at this cut against the delivered build at `main` @ `fcf12c1`, not inherited from the
QE note** (`human_admission` is `off`; that note is an unstamped `observation` and was treated as a
claim):

```
node src/cli.ts 1</dev/null </dev/null   ->  exit 1
stderr: file:///…/src/cli.ts:159
            if ((error                         ).code !== "EPIPE") throw error;
        Error: EBADF: bad file descriptor, write
grep -c "Usage"          on that stderr  ->  0
grep -c "internal error" on that stderr  ->  0
```

**Those two zeroes are what decides it.** An assignment at `src/cli.ts:140` is reached only after
`process.stderr.write(…${USAGE}\n)` at `:135`, so `USAGE_EXIT_CODE` cannot have been assigned
without a usage line. And `main`'s `catch` at `:193` writes `INTERNAL_ERROR`, so it did not run
either. **The status came from Node, not from this product.**

**WHY THE CATCH CANNOT RUN, AND THIS IS THE PART THAT MATTERS BEYOND BOOKKEEPING.** `main`'s
`try`/`catch` (`src/cli.ts:166-196`) wraps the loop, and the failing write happens inside it — the
stack even names `at main` — so it *looks* catchable. It is not: Node's stream machinery emits
`'error'` on a **later tick**, and the re-throw at **`src/cli.ts:159`** therefore fires from a tick
with no `try` on the stack. Reproduced at this cut in QE's eleven lines, outside this product, so it
is Node's shape and not the product's: **`CAUGHT:` never prints, the banner does, status `1`.**

**The consequence, and the reason this is not merely tidy-up.** The standing note tells a future hop
*"A future ticket routing non-`EPIPE` to `70` leaves `A10` green and needs no re-cut of this page."*
`A10` does stay green — it asserts non-zero and non-empty by design. **But such a hop cannot do the
routing with a `try`/`catch`**, and would find that out only after writing one. **The record does not
merely misdescribe the past; it mis-designs work that has not been cut yet.**

The full site inventory, both re-runs and the true/false split below are in
`.grugops/context/cut-residual-followups-2026-08-21/notes/`, not on this page (`AGENTS.md`
`## Process rules` 2).

## The split that governs this ticket — TWO claims wearing one sentence

**This is the trap, and getting it wrong would re-open `ABC-115`.** Fourteen sites say
`1` is `USAGE_EXIT_CODE`. They are not saying the same thing.

- **CLAIM A — TRUE, AND OUT OF SCOPE.** On the **argument-refusal** path, `1` **is**
  `USAGE_EXIT_CODE`: `src/cli.ts:90` defines it, `:140` assigns it, `:135` prints the usage line.
  This is the basis on which `ABC-115` was cut. **Sites: `plans/tickets/ABC-115-…md:62` and `:117`,
  `ADR-0016:112`, and the two `cut-epipe-regression-2026-08-20` notes. NOT TOUCHED. Correcting one
  of these WOULD re-open `ABC-115` and is a `FAIL` of `A5`.**
- **CLAIM B — FALSE, AND THE WHOLE SCOPE.** On the **non-`EPIPE` stdout-write** path, the observed
  `1` is `USAGE_EXIT_CODE` **being assigned**. Seven sites, each located by content at this cut.

## Scope — the seven CLAIM-B sites, measured at `main` @ `fcf12c1`

| | site | the false clause |
|---|---|---|
| S1 | `.grugops/context/rule-ABC-115-residuals-2026-08-21/notes/…-8a4b2e69.md:20` | *"`1` is `USAGE_EXIT_CODE`"* — **the standing note the briefs are written off** |
| S2 | the same note, `:41` | *"A future ticket routing non-`EPIPE` to `70` … needs no re-cut"* — **true but incomplete**; silent on the `try`/`catch` being out of reach |
| S3 | `.grugops/context/rule-ABC-115-residuals-2026-08-21/notes/…-9d3a7e52.md:43` | *"(`1` is `USAGE_EXIT_CODE`, the very collision the ticket was cut for)"* |
| S4 | `.grugops/context/qe-ABC-115-2026-08-21/notes/…-8c04b19d.md:66` | the `EBADF` reading, same clause |
| S5 | `.grugops/context/repair-ABC-115-2026-08-21/notes/…-6b1e4c72.md:46` | *"path is `1` = `USAGE_EXIT_CODE`"* |
| S6 | `plans/board.md:168` | *"on that `EBADF` path the delivered build exits `1` = `USAGE_EXIT_CODE`"* |
| S7 | `plans/tickets/ABC-115-…md:302` | *"the delivered build exits **`1`**, which is `USAGE_EXIT_CODE`"* (the `## RESIDUAL` block) |
| S8 | `src/cli.test.ts:2980` | *"The delivered status on this path is `1`, which is `USAGE_EXIT_CODE`"* — **a delivered comment; `ABC-114`'s defect class exactly** |

*(Eight rows, seven sites: S1 and S2 are two clauses of one note.)*

- **Comment prose in `src/cli.test.ts` only (S8).** **Zero production lines, zero assertions changed,
  zero `it` blocks touched, zero new spawns, zero new tests.**
- **Append-only corrections** to `plans/board.md` (S6) and `plans/tickets/ABC-115-…md` (S7).
- **New notes** for S1–S5 (see the shape ruling below). **No note file is edited or deleted.**

## Out of scope

- **Every CLAIM-A site.** Named above so nobody re-discovers them and "fixes" one.
- **Re-opening the accepted residual, `ABC-115`, `ABC-066`, `ABC-108`, `ADR-0016`, `ADR-0017`, QE's
  PASS or the exit-code ruling.** Proposing a wider product arm. Signing or moving `ABC-115`.
- **`plans/nfr-catalog.md`** — no bar, account or row is touched; the eight rows must still hash to
  `63f66795…ca31` (`A6`).
- **`AGENTS.md`** — `ABC-109` is live against it under a byte cap. Its `## Dev / run` `EXIT CODES`
  sentence (*"1 for a refused command line, 70 for an internal error"*) is **TRUE as written and is
  NOT a CLAIM-B site** — it describes what the product assigns, and this path assigns nothing.
- **`plans/traceability.md`'s `ABC-115` row** — checked at this cut and it carries **no CLAIM-B
  clause**; it says *"flips from exit `1` + 1542 bytes of stack to SILENT exit `0`"*, which is a
  reading, not a mechanism. **Verified rather than assumed, and left alone.**

## The shape ruling — HOW an append-only record gets corrected without un-accepting a ruling

`supersedes` is a **single note id**, and superseding a note **folds it out of replay**. S1 lives in
`…-8a4b2e69.md`, which is the note that **accepts the residual**. **Superseding it naively would
fold the acceptance out with the false sentence — a correction that silently re-opens the thing it
promised not to.** So the shape is ruled here rather than left to the bench:

1. **S1/S2 — SUPERSEDE, AND CARRY FORWARD.** One new `decision` note, `supersedes:` the id of
   `…-8a4b2e69`, which **restates the acceptance ruling and its named trigger in the original's own
   words**, corrects only the mechanism clause, and states in terms that the residual is **not**
   re-opened. **A superseding note that does not carry forward what it folds out FAILS `A2`.**
2. **S3–S5 — CORRECT WITHOUT SUPERSEDING.** One new `observation` note naming all three ids on its
   `refs`, stating the true mechanism once. **These are hop records whose conclusions do not depend
   on the mechanism** — QE's verdict, the engineer's `A10` decision and BA/PM's `A10` shape all
   stand on *non-zero and non-empty*, which is exactly what `A10` asserts. Superseding a closed
   hop's verdict to fix a parenthesis would damage the audit trail to no end.
3. **S6–S8 — APPEND, NEVER OVERWRITE.** The board header and the `ABC-115` page take an added
   correction that names the superseded clause and states the true one; **not one word of the
   original is deleted.** S8's comment is rewritten in place (a comment is not an append-only
   record) with the correction declared at the site — **`ABC-114`'s own discipline, applied here.**

## Ruling — is anything in `src/` owed?

**No. This ticket is documentation-only and that is ruled, not deferred.** The residual was accepted
knowingly; the correction changes what the record *says*, not what the build *does*. `ADR-0016`
clause 3 chose *"exactly as today"* for every non-`EPIPE` errno deliberately, and this measurement
does not disturb that choice — it describes it accurately for the first time.

**But a product change IS owed by whoever closes the residual, and it is sized here so the next cut
is made from a measurement instead of from a wrong mechanism. IT IS NOT CUT — one ticket, and this
is not it.**

> **Named, not cut: *route a non-`EPIPE` stdout-write failure to `70`*.** **The shape is forced:
> the arm at `src/cli.ts:159` must carry the outcome itself** — set the status and write
> `INTERNAL_ERROR` inside the listener — **because the throw arrives on a later tick and no
> `try`/`catch` in `main` can reach it.** Anything built as *"widen `main`'s catch"* is dead on
> arrival. **Size `S`**, not `XS`: it changes a delivered production line in the error arm, it needs
> a criterion child on a read-only fd (an `N8-SPAWN` **count** raise, +7 → +8, which is BA/PM's word
> and fires **`T1`**), and it needs a watched-RED mutant. **It also re-opens an accepted residual,
> so it needs the owner's word before it is cut at all** — which is why it is named here and left to
> the Orchestrator to route.

## Acceptance criteria

- **`A1` (the mechanism is re-derived, never copied).** **Given** the delivered build at the branch
  tip, **when** the delivering hop runs it with a **read-only fd as stdout** and, separately, runs
  the eleven-line out-of-product reproduction, **then** it records for both: the **exit status**, the
  **count of `Usage` lines on stderr**, the **count of `internal error` lines**, and whether
  **`CAUGHT:` printed**. **Every corrected sentence is written from THIS hop's readings.** If they
  disagree with this page, **the sentence follows this hop's measurement and the disagreement is
  written down.** Quoting this page's numbers without a run **FAILS this criterion.**
- **`A2` (S1/S2 — supersede AND carry forward).** **Then** `…-8a4b2e69.md` is **unmodified on disk**
  and a new `decision` note exists whose `supersedes` is that note's id, which (i) states that the
  `1` is Node's unhandled-exception status and **not** an assignment of `USAGE_EXIT_CODE`, citing
  the two zero counts; (ii) states that a hop routing non-`EPIPE` to `70` **cannot use a
  `try`/`catch`** and must carry the outcome in the `:159` arm; (iii) **restates the acceptance
  ruling and its named trigger in the original's own words**; and (iv) says the residual is **not**
  re-opened. **All four, or FAIL.**
- **`A3` (S3–S5 — corrected, not folded).** **Then** one new `observation` note carries all three
  ids on `refs`, states the true mechanism, and its `supersedes` is **empty**; and all three original
  files are **byte-identical** (`git diff --numstat` empty for each).
- **`A4` (S6–S8 — appended, and nothing deleted).** **Then** for S6 and S7, `git diff main...HEAD`
  shows **only added lines** in `plans/board.md` and `plans/tickets/ABC-115-…md` — **zero deletions**
  — and each added block names the clause it corrects. For S8, the `src/cli.test.ts` diff is
  **comment lines only** and the replacement sentence declares that it corrects an earlier one.
- **`A5` (the fence that keeps this a correction — the criterion the ticket is most likely to fail).**
  **Then** no CLAIM-A site is edited: `git diff main...HEAD` touches **no** line containing
  `USAGE_EXIT_CODE` in `plans/tickets/ABC-115-…md` other than **`:302`**, and touches
  `memory-bank/50-decisions/ADR-0016-…md` **not at all** (`git diff --numstat` empty). **And** the
  delivered wording nowhere proposes a wider arm, re-scores `ABC-115`, moves it, or describes it as
  accepted.
- **`A6` (the fence, checkable from git and from a hash).** **Then**
  `git diff --name-only main...HEAD -- src/` lists **exactly** `src/cli.test.ts`;
  `git diff --numstat main...HEAD -- 'src/' ':!src/*.test.ts'` is **empty**; every added and removed
  line under `src/` is a `//` comment line; `git diff --numstat main...HEAD -- plans/nfr-catalog.md
  AGENTS.md` is **empty**; and
  `grep -E '^\| NFR-00[1-8] \|' plans/nfr-catalog.md | shasum -a 256` returns
  **`63f667958eeabcaa884d45b18b513c7bbe9855266c4959dfd16f87b0802eca31`** on **8** matched lines.
- **`A7` (the lane and the account do not move).** **Then** `npx vitest run --dir src` reports the
  **same file count, test count and skip count** before and after, both green, both recorded;
  `const N8_SPAWN`, `spawned` and `Object.keys(CHILDREN)` are **byte-identical / unchanged**; and
  **`T2` does NOT fire** — the delivery note says so with the reason, since a comment-only diff
  changes no child's argv, stdin script, substitution hook or settle. *Base at this cut on `main` @
  `fcf12c1`: **re-measure at pull time rather than quoting it.***

## Dependencies

- **None blocking. Pullable today.** All eight rows of the site table were located by content at
  this cut, at `main` @ `fcf12c1`.
- **`ABC-115` is `Ready for UAT` and UNSIGNED**, and S7 is on its page. **This is an ordering
  hazard, not a block** — see `## Risks`. If `ABC-115` is signed or moved first, **nothing here
  changes**: the correction is still append-only and still not a re-opening.
- **`ABC-114` shares `src/cli.test.ts`** and is in `Backlog`. Its four sites (`S1`–`S4` on that page)
  and this ticket's S8 are **disjoint** — verified by line region at this cut. Whichever delivers
  second rebases; both are comment-only.
- **`ABC-109`** (`AGENTS.md` byte cap): zero bytes written to that file (`A6`).

## Risks

- **The correction is read as a re-opening.** The single largest risk, and the reason `A5` is a
  criterion rather than a fence. **Mitigated** by the CLAIM-A/CLAIM-B split, by `A2`(iii)-(iv)
  requiring the acceptance carried forward verbatim, and by `A5` naming the two files a re-opening
  would have to touch. **Not eliminated.**
- **A naive supersede folds the acceptance out of the record.** This is a real property of the note
  contract, not a hypothetical: `supersedes` folds the whole note. `A2` is written against it.
- **S7 edits a page whose ticket is awaiting the owner's word.** A reader could take a mid-flight
  page edit as an amendment to what is being accepted. **Mitigated** by append-only with zero
  deletions (`A4`) and by the correction being about a `## RESIDUAL` paragraph that is explicitly
  *not* a criterion. **Named rather than smoothed: if the Orchestrator prefers, S7 may be deferred
  until `ABC-115` closes — that is a routing call and this page does not pre-empt it.**
- **The delivering hop authors a new false sentence about a mechanism it did not run.** The
  recursion that produced `ABC-113` and then `ABC-114`. `A1` mitigates it by requiring both runs.

## Test notes

- Lane is `npx vitest run --dir src` and **never** the repo root (`AGENTS.md` `## Test notes` 5).
- **No test is added, deleted, trimmed, moved or re-titled**, and **`A10` is not touched** — it
  asserts non-zero and non-empty by design and stays green through every wording of this path. A
  hop that "improves" `A10` to pin a status has broken the row `ABC-115` deliberately built.
- The read-only-fd instrument is `node src/cli.ts 1</dev/null </dev/null`, run by hand, outside the
  suite. **It adds no child** and charges nothing.
- Mandatory gates: `npm run lint`, `npm run typecheck`, `npm run build`, unit — all four, on the
  branch tip before merge and on `main` after, both recorded.
- **Test integrity:** `.grugops/test-skips.md` is **human-owned** — read it and run the check, never
  write a row into it. `quality.test_integrity` is `warn`.
- **QE hop is owed** (owner's standing rule, 2026-08-17) before `In Review` is exited. **QE is not
  UAT.** The delivered diff is expected to carry **zero production lines**, so the 2026-08-17 UAT
  waiver is expected to apply — **measured from git at the exit, never asserted here.**

## NFR / security

- **`N8-SPAWN`: 0 ms, 0 added children, `T1` and `T2` both NOT FIRED** — comment-only; the count
  literal is byte-identical and no child's argv, stdin script, substitution hook or settle changes
  (`A7`). *Written in the form `ABC-116` makes canonical.*
- **`N8-LANE`: no line is claimed, deliberately.** `ABC-108` is open and `NFR-008` is **BREACHED on
  the CPU clause by 1.480 s and UNRULED on wall**; a 5% slice of a spent total is not a slice. Same
  posture as `ABC-110`, `ABC-113`, `ABC-114` and `ABC-116`.
- **Falsifiable zeroes instead of a budget:** 0 production lines, 0 assertions changed, 0 new tests,
  0 new test files, 0 new spawns, 0 note files edited or deleted, 0 deleted lines in `plans/board.md`
  and `plans/tickets/ABC-115-…md`, 0 bytes to `AGENTS.md`, `ADR-0016` and `plans/nfr-catalog.md`,
  and the eight rows hashing to `63f66795…ca31` (`A6`).
- **Security: not engaged** — no input path, no process boundary, no network. **One thing is worth
  naming and is NOT this ticket's to fix:** the accepted residual's raw stack **discloses the
  absolute checkout path** on stderr. That is part of the residual, it is already recorded on
  `ABC-115`'s page, and it closes with the residual, not with this correction.

## Size and priority — the argument, not the label

**`XS`, agreeing with QE's `XS` — but on a WIDER scope than they framed, which is the disagreement
worth recording.** QE described the work as *"a superseding note"*. Located by content at this cut,
it is **seven sites across five files and two substrates**, one of them a delivered test-file comment
of `ABC-114`'s exact class. **It is still `XS`:** there is no build to plant, no control run, no
harness, and the entire evidence base is two commands that finish in under a second. **Not `S`:** the
comparable is `ABC-114` (`S`), which is four comment sites **plus three planted builds with controls
plus a FIFO harness a QE hop had shown cannot terminate**. Nothing here is constructed.

**`P3`, agreeing with QE's label — and the argument that nearly moved it to `P2` is written down
rather than dropped.** Against `P3`: this is not bookkeeping; the sentence is **directly upstream of
a design decision** and would send a hop to write a `try`/`catch` that structurally cannot fire.
For `P3`, and it decides it: **that hop does not exist.** No ticket to close the residual is cut, none
is queued, and nothing on `main` behaves wrongly because of these sentences. `ABC-114` earned `P2`
for sentences that mis-price guards **on `main` today**; these mis-design work **that has not been
started**. **A priority is about when, not about whether.**

- **NOT `P1`/`P2` today:** nothing is blocked, no gate is wrong, no criterion is affected, no player
  sees anything, and `A10` is green under every wording of this path.
- **NOT lower than `P3` / not "no page at all":** the false clause is on `main`, it is in a
  **delivered comment** as well as in notes, and it survived four hops that each read it.
- **`P1` PROMOTION TRIGGER, pre-registered so nobody re-argues it:** **the moment a ticket is cut to
  close the non-`EPIPE` residual**, this becomes `P1` and should be delivered **before** it — at that
  instant the false clause stops being a record and becomes a live design input.
- **`P2` PROMOTION TRIGGER:** any second site of the same clause found outside this inventory, or any
  hop measured reasoning from S1 or S2.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-21**. **Result: 9 of 10, ⚠️x1 — PULLABLE TODAY. The ⚠️ is item 5 and it is a DISCLOSED
ORDERING HAZARD with a named fallback, not an open question.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the user is the hop that eventually closes the residual; the pain is a mechanism claim falsified at this cut by two zero counts on the delivered build **and** by an eleven-line out-of-product reproduction; the value is stated without overclaiming — the record is wrong, and the wrongness has a named future cost |
| 2 | scope and out-of-scope clear | **✅** an eight-row site table located by content, a CLAIM-A/CLAIM-B split that names the five sites a careless fix would break, and six fences — including `plans/traceability.md` and `AGENTS.md`'s `EXIT CODES` sentence, both **checked and found TRUE** rather than assumed out |
| 3 | INVEST-shaped | **✅** independent, small, one hop, one agent; every site exists at `fcf12c1` and was located at this cut. No split trigger: seven sites of one sentence are one ticket, and splitting them would produce two half-corrections of one record |
| 4 | acceptance testable and measurable | **✅** seven: two runs with four recorded quantities each and a disagreement clause; a **byte-identical** original plus a four-part superseding note; an **empty** `supersedes` on the second note; a **zero-deletion** diff predicate; a CLAIM-A fence expressed as *which lines the diff may touch*; three git predicates plus a **sha256 on 8 lines**; and three unchanged counts with `T2` explicitly not fired |
| 5 | dependencies known | **⚠️ ONE IS AN ORDERING HAZARD ON AN UNSIGNED TICKET, and it is not smoothed.** S7 is on `ABC-115`'s page while that ticket sits in `Ready for UAT` **awaiting the owner's word**, so this ticket edits a page that is mid-acceptance. It is **not** a blocker — the edit is append-only, zero-deletion, and lands in a `## RESIDUAL` paragraph that is not a criterion — and a fallback is named on the page (**defer S7 until `ABC-115` closes**, which is the Orchestrator's call). **Not marked ✅ because the risk is real and belongs to a human's decision, not to this page** |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-SPAWN` **0 ms / 0 children / `T1` and `T2` explicitly NOT FIRED with the reason**; `N8-LANE` in `ADR-0014` decision 4's form — 0 ms measured **and** the clause state BREACHED, so it cannot be read as a pass; the eight rows pinned by hash; security not engaged, **with the path-disclosure exposure named as the residual's and NOT claimed closed here** |
| 7 | test notes present | **✅** six, including the explicit instruction **not** to "improve" `A10`, the out-of-suite instrument that charges nothing, the human-owned skips file, the owed QE hop, and the UAT waiver named as **measured at the exit, never asserted here** |
| 8 | size assigned | **✅** `XS`, with the `ABC-114` comparable, the not-`S` argument, and the scope disagreement with the proposing role recorded |
| 9 | priority assigned | **✅** `P3`, with the `P2` case that nearly won written out rather than dropped, the not-`P1` argument, the not-lower argument, and two named promotion triggers |
| 10 | no major unresolved blocker | **✅** none. The product change this correction implies is **named, sized (`S`), shape-forced and deliberately NOT cut**, and it is flagged as needing the owner's word before it is cut at all — a disclosed hand-off, not a blocker |

Column moves are the Orchestrator's.

## Re-score — 2026-10-10 (BA/PM, subtask `bapm-rescore-backlog-r1-2026-10-10`, wave tip `39d87491`)

**Verdict: READY. DoR 10/10. `XS` kept; priority `P3` → `P2`, because this page's own `P2` trigger
FIRED.** `column`/`status` are not moved here.

**The mechanism was re-measured, not inherited, on Node v26.11.0 at `39d87491`:**
`node src/cli.ts 1</dev/null </dev/null` → **exit 1**, `Usage` lines **0**, `internal error` lines
**0**, `EBADF` thrown from **`src/cli.ts:160`** (was `:159`; the arm is unchanged). **CLAIM B is still
false on the current runtime.**

**THE `P2` TRIGGER FIRED.** The trigger reads *"any second site of the same clause found outside this
inventory"*.
- `plans/board.md`'s **`ABC-115` row** says *"on that path the delivered build still exits `1` =
  `USAGE_EXIT_CODE`"*.
- That row is now `:791`. It was **`:279` at the cut's own commit `fcf12c1`**, added at `3b2ac088`
  (2026-08-20).
- **The cut missed it.** It becomes **S9**, in the same append-only class as S6, under `A4`.

**Site lines re-located at `39d87491` (they drifted; the content did not):**
- **S6:** board `:588`.
- **S7:** `ABC-115` page `:302`, unmoved.
- **S8:** `src/cli.test.ts:3342`.
- **S9:** board `:791` (new).
- **S1–S5:** all five note files present.

**Amendments:**
- **`A4`** covers S9: only added lines in `plans/board.md`, each naming the clause it corrects.
- **`A5`, re-read:** `ABC-115` is now **`Done`**, so the ordering hazard on its page is **gone**. Keep
  the CLAIM-A fence (no CLAIM-A line, `ADR-0016` untouched, no wider arm proposed). Drop the clauses
  about "moving" `ABC-115` or "describing it as accepted": they guarded an unsigned ticket that is now
  closed.
- **`A6`'s hash pin is VOID**, for the same cause as `ABC-116` `A5`. Read it as: the 8-line hash is
  **identical at base and tip**, both recorded (`c74e7426…0d3b` at `39d87491`).
- **`A7` and test notes, the lane:** read `npx vitest run --dir src` as **`npm test`** (52 vs 53 files
  since `ABC-093`). The *"`AGENTS.md` `## Test notes` 5"* cite is gone.
- **`## NFR / security`, `N8-LANE`:** comment-only, so **the count is the pin** (`ADR-0035` decision
  3): 0 files, 0 tests, 0 spawns, no timing bound. The *"`ABC-108` open / BREACHED 1.480 s"* sentence is
  history.

**Unchanged:** the `P1` trigger has not fired; no ticket closes the non-`EPIPE` residual. `ABC-114` and
`ABC-116` share `src/cli.test.ts`, and whichever lands second rebases.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** re-measured on v26.11.0 |
| 2 | scope and out-of-scope clear | **✅** S9 added to the same append-only class |
| 3 | INVEST-shaped | **✅** still one record, one ticket |
| 4 | acceptance testable and measurable | **✅** hash pin re-read as base = tip |
| 5 | dependencies known | **✅** — *was ⚠️.* The ordering hazard was `ABC-115` unsigned, and `ABC-115` is `Done` |
| 6 | security/NFR triggers with a measurable target | **✅** count pin 0/0/0 |
| 7 | test notes present | **✅** lane re-pointed |
| 8 | size assigned | **✅** `XS`. One extra board append does not move it |
| 9 | priority assigned | **✅** `P2`, by the page's own trigger |
| 10 | no major unresolved blocker | **✅** none |

## Delivery

Software Engineer (Claude Opus 5.5, subagent of the Orchestrator), 2026-10-12, subtask
`ticket-to-pr-ABC-117`. Branch `grugops/ABC-117-exit-one-correction` from `main` @ `3537fe48`
(the subtask frontmatter says `61aef6e6`; the dispatch said `3537fe48`, which is `main`). Corrections
commit `59000c87`; this section, the trace row and the `artifact-ref` follow it. Not pushed, not
merged, no column moved. **This hop wrote every corrected sentence and has not validated them; the
`In Review` verdict is a separate QE hop's.** Readings and rulings: `.grugops/context/ticket-to-pr-ABC-117/notes/`.

- **`A1` — both runs made here (Node v26.11.0).** `node src/cli.ts 1</dev/null </dev/null`: exit `1`,
  **0** `usage:` lines, **0** `internal error` lines, no `CAUGHT:`, Node's banner on `src/cli.ts:160`.
  QE's out-of-product script with `1</dev/null`: exit `1`, **no `CAUGHT:`**; writable control exit 0.
  **Disagreement with this page, written down:** its `grep -c "Usage"` reads 0 on the refusal path
  too (`node src/cli.ts --nonsense` → exit 1, 0 matches), because the line is lower-case `usage:`
  (`src/cli.ts:88`, and `:87` at `fcf12c1`). That zero decides nothing. `grep -c '^usage: '` reads 1
  on the refusal and 0 on `EBADF`, and the corrected sentences cite that one. The conclusion holds.
- **Sites, re-located by content at `3537fe48`.** S1 `…8a4b2e69:20`, S2 `:41`, S3 `…9d3a7e52:43`,
  S4 `…8c04b19d:66`, S5 `…6b1e4c72:46`, all unmoved. **S6 board `:659`** (was `:168` at the cut,
  `:588` at the re-score). **S7** `ABC-115` page `:302`, unmoved. **S8** `src/cli.test.ts:3366` (was
  `:2980`, then `:3342`). **S9** board `:871` (was `:791`).
- **`A2`.** `…8a4b2e69` byte-identical. A new `decision` `…0081a95a` supersedes it and carries (i)
  Node's status with the two zero counts, (ii) no `try`/`catch` can route it, so the outcome goes in
  the `:160` arm, (iii) the ruling and trigger verbatim (original lines 24-49, `cmp` equal), and (iv)
  the residual is not re-opened.
- **`A3`.** One `observation` `…92514474`, all three ids on `refs`, `supersedes` empty. `git diff
  --numstat` is empty for all three originals, and no existing note file is touched.
- **`A4`.** `plans/board.md` +2/−0, `ABC-115` page +14/−0. Each block quotes the clause it corrects.
  **S9 rides the one S6 block**, named there by its entry, because the subtask fences the board to
  one correction (decision `…7f8b9026`). S8 is comment lines only (+7/−3) and says it corrects the
  earlier sentence.
- **`A5`.** `ADR-0016` numstat empty. On the `ABC-115` page the only lines touched are the 14 added
  after the `## RESIDUAL` paragraph (S7). They quote `:302`'s clause, and no existing line changed.
  No wider arm is proposed. `ABC-115` is not described as re-scored, moved or re-opened.
- **`A6`.** `src/` lists only `src/cli.test.ts`. The non-test numstat is empty, 0 non-`//` lines are
  changed, and `nfr-catalog.md`/`AGENTS.md` numstat is empty. 8 rows hash
  **`c74e7426…0d3b` at base AND head** (equal). That is the re-score's value and differs from this
  page's `63f66795…ca31`, which was taken at `fcf12c1`.
- **`A7`.** `npm test`: **56 files / 1741 tests / 0 skipped, before and after**, both exit 0. The
  `N8_SPAWN`/`spawned`/`Object.keys(CHILDREN)` lines hash the same at base and head. **`T2` does not
  fire:** the diff is comments only, so no child's argv, stdin script, substitution hook or settle
  changes, and the count literal is byte-identical.
- **Gates at the tip:** lint, typecheck, build and `npm test` all exit 0, and
  `.test-results/last-run.json` reads `success: true`. Skip integrity reads `No findings.` at 0.
  **UAT-waiver reading:** `git diff --name-only main...HEAD | grep -v '\.test\.ts$' | grep '^src/'`
  is empty.
- **Left alone, flagged:** `src/cli.test.ts:3251` (`EPIPE`, pre-`ABC-115`, not CLAIM-B as written)
  and the `A10` comment's stale `src/cli.ts:159` cite (now `:160`).

## QE

QE/E2E (Claude Opus 5.5, subagent of the Orchestrator), 2026-10-12, subtask `qe-ABC-117`, branch
`grugops/qe-ABC-117` off tip `d5afab3f`. **Verdict: PASS_WITH_GAPS.** The readings were taken at
QE's own hand before the build notes were read. Notes: `.grugops/context/qe-ABC-117/notes/`. This is
an agent `decision`, not a stamp.

- **A1 MET.** Tip, `node src/cli.ts 1</dev/null </dev/null`: exit `1`, `^usage: ` 0,
  `internal error` 0, Node's banner on `src/cli.ts:160`. QE's out-of-product script: exit `1`,
  `CAUGHT:` never printed. Control `--bogus`: exit `1`, `^usage: ` **1**, `Usage` **0**. Every
  corrected sentence agrees.
- **The instrument: the Engineer's substitution is SOUND.** This page's `grep -c "Usage"` reads 0 on
  both paths and decides nothing; `^usage: ` reads 1 against 0. **That is a gap for BA/PM
  (QE-117-b, LOW):** amend A1's quantity to the `usage:` line.
- **A2 MET (all four).** `cmp` of the original's lines 24-49 against the carried quote: equal, 26 lines.
- **A3 MET.** **A4 MET.** The S9 board block names both S6 and S9, as the Orchestrator ruled.
- **A5 MET.** No CLAIM-A line touched, `ADR-0016` numstat empty, and every re-open / re-score / arm
  word in the added text is a negation.
- **A6 MET.** `c74e7426…0d3b` at base == head. **A7 MET.** 56 / 1741 / 0 at both ends, N8 lines
  hash-equal, `T2` not fired.
- **QE-117-a (MEDIUM, routed to BA/PM): two CLAIM-B clauses this page's inventory missed, false at
  the tip.** First, `plans/traceability.md`'s `ABC-115` row: *"the non-`EPIPE` path still exits `1`
  (= `USAGE_EXIT_CODE`)"*. `## Out of scope` above says that row was checked and carries no CLAIM-B
  clause, and it does. Second, `…0391186e:69-70`. QE recommends widening by two rows and an SE delta
  hop before merge.
- **Left alone, agreed:** `src/cli.test.ts:3251`. Measured: the pre-`ABC-115` `EPIPE` `1` was also
  Node's, and the sentence is a value statement in the CLAIM-A register. Also left alone: the dated
  `src/cli.ts:159` reading at `:3376`. QE-117-c (INFO): the S8 rewrite's "this ticket" now reads
  ambiguously and means `ABC-115`.
- **UAT-waiver reading, measured:** production `src/` is empty over the range and for each of
  `59000c87`, `00741431` and `d5afab3f`, so the waiver applies.
