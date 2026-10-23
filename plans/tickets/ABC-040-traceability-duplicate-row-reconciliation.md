---
id: ABC-040
title: The duplicate ABC-028 / ABC-029 rows in plans/traceability.md — one pair is a lossless delete, the other is a 2404-byte merge, and three hops deferred both on a reason that fits only one
status: done
column: Done
size: S
priority: P2
epic: —
feature: —
---

# ABC-040 — reconcile the duplicate `ABC-028` / `ABC-029` rows in `plans/traceability.md`

> **Cut 2026-08-13 by BA/PM** (task `cut-039-040-2026-08-13`, subtask `refinement-cut-039-040`,
> Workflow 07) on the owner's ruling *"cut both"*.
>
> **THIS IS A RECORD TICKET, NOT A DEFECT TICKET.** No test fails and no user is affected. What is
> broken is a structural invariant of a live delivery file: **`plans/traceability.md` holds 40
> `ABC-` rows for 38 tickets.**
>
> **It has been deferred by three hops in a row, and this page names why.** The file's own comment
> block declines to repair it (rule 12, *flag don't delete*, plus a then-live `ABC-019` hop); the
> delivery audit called it *"THE DEBT WITH NO OWNER"*; the last refinement hop verified the pairs
> *"still present and untouched"* and moved on. **Every one of them deferred on the same recorded
> reason — and measured at the source, that reason is true of `ABC-029` and was written on
> `ABC-028`'s row.**

## Problem

*User*: every hop that appends to `plans/traceability.md` — which is every refinement hop — and
anyone who reads it as the requirement → ticket → code → test → release trail.

*Pain*, measured 2026-08-13 on `06c5427`:

- **40 rows matching `^| ABC-` for 38 distinct ticket ids and 38 files in `plans/tickets/`.** The
  id set and the file set are **identical** (symmetric difference empty), so the excess is entirely
  duplication.
- `ABC-028` appears at **lines 203 and 205**; `ABC-029` at **204 and 206**.
- **A reader who takes the LAST match for either id gets the stale copy** — the file's own comment
  says exactly this, and it is still true.
- Origin: commit **`5caef94`** (an `ABC-019` hop, `4+/1-` on this file) replaced its own `ABC-019`
  row and re-added `ABC-028`'s and `ABC-029`'s from a **pre-rebase copy** of the table.

*Value*: **one invariant — rows == distinct ids == ticket files — becomes true and checkable in a
single command**, and **2404 bytes of dated record that a naive delete would destroy are kept.**

> **A baseline correction, since this project's habit is that the next hop checks the last one.**
> The figure carried into this hop was *"32 `ABC-` rows for 30 tickets"*. That was true at
> `43d5a9d` and is **stale**: `69908cc` appended eight rows (`ABC-031`…`ABC-038`), so the file
> stands at **40 for 38**. The **defect shape is unchanged** — exactly two duplicate pairs, exactly
> `+2` rows over the ticket count — and the quoted line numbers (203/205, 204/206) are current.
> **Do not re-verify against 32/30.** After this page's own two rows land it is 42 for 40.

## The measurement that changes the disposition

Cells split **escape-aware**, per this file's own rule at `plans/traceability.md:152-156`
(`re.split(r'(?<!\\)\|', line.strip()[1:-1])`). All four rows are **well-formed 10-cell rows with
zero escaped pipes** — this is a duplication defect, **not** a malformation.

| pair | cols 0–4 (Ticket…NFRs) | col 5 `Code` | col 6 `Tests` | cols 7–8 (UAT, Release) | col 9 `Status` | disposition |
|---|---|---|---|---|---|---|
| **`ABC-028`** L203 / L205 | **byte-identical** | 2659 / **0** | 3683 / **0** | empty / empty | stale is a **BYTE-EXACT PREFIX** of live (2618 of 50168) | **LOSSLESS DELETE** |
| **`ABC-029`** L204 / L206 | **byte-identical** | 727 / **0** | 2885 / **0** | empty / empty | **diverges at char 2705**; stale holds **2404 bytes absent from live** | **MERGE** |

### The recorded reason is TRUE, and the inference drawn from it is not

The live `ABC-028` row ends with this sentence, and it is the reason three hops deferred:

> *"the stale `ABC-028` row is NOT a prefix (diverges at char 1619 into empty columns and a
> cut-time `Backlog` status), so it needs a RECONCILING hop, not a delete."*

**As a whole-row measurement it is exactly right** — verified: whole-row divergence at char
**1619**, precisely where col 5 begins. **But the non-prefixness is produced entirely by the two
EMPTY cells, and an empty cell is an absence, not a disagreement.** Per cell, the stale `ABC-028`
row contains **zero bytes of information the live row does not already hold**.

**Verified across all eleven commits that have touched this file since the pair appeared**
(`5caef94` → `06c5427`): the `ABC-028` Status prefix relation has been **True at every one**, and
the `ABC-029` relation **False at every one**. **The property is stable, not a coincidence of
today's tip.**

### What the stale `ABC-029` row uniquely holds — the 2404 bytes

The divergent tail is a dated hop record, **AMENDED 2026-08-11 by BA/PM at
`refinement-ABC-019-a11`**, carrying four things found nowhere in the live row:

1. **`PRIORITY P2 -> P1`** with its derivation, and the correction of the cut-hop headline
   *NOTHING IS BROKEN*.
2. **The measurement** that `src/turn-loop.ts:52` imports `./history.ts` at runtime, so production
   runtime importers of `src/history.ts` are **ONE, not ZERO**.
3. **`A3` is internally contradictory** — first recorded here.
4. **The merge order decision**: `ABC-028` first, then `ABC-029`, then `ABC-019` rebases.

Absence confirmed by probe against the live cell: `AMENDED 2026-08-11`, `PRIORITY \`P2\` -> \`P1\``,
`NOTHING IS BROKEN`, `refinement-ABC-019-a11`, `ONE, not ZERO`, `turn-loop.ts:52` — **all present in
the stale cell, all absent from the live one.**

> **The subtlety that makes this a ruling and not a copy-paste:** the live row **does** say
> *"Size `S` and priority `P1` both RE-DERIVED and both HOLD"* (dated 08-12). So the *conclusion*
> survives in the live row — what is missing is **when it changed, who changed it, and on what
> measurement.** See `R4`.

## THE PRECEDENCE RULE — what wins when the two rows disagree

**This is the ruling this ticket carries.** Five clauses, applied in order.

**R1 — position never decides.** The file's own *"APPEND TO THE FIRST OF EACH PAIR"*
(`plans/traceability.md:167`) is a **write-routing** rule — it tells the next hop where to append.
It is **not** a truth rule and must never be read as *"the second row is discardable."* Measured,
that reading destroys 2404 bytes on `ABC-029`.

**R2 — an empty cell is an absence, never a disagreement.** Where one row's cell is empty and the
other's is not, the non-empty cell survives, with no judgement required. *(Resolves `Code` and
`Tests` in both pairs.)*

**R3 — a byte-exact prefix carries no independent information.** Where one cell is a byte-exact
prefix of the other, the longer survives and the shorter is deleted outright. *(Resolves
`ABC-028`'s `Status`, and is what makes that half a provable delete.)*

**R4 — where neither cell is a prefix of the other, the result is the UNION of DATED RECORDS, in
date order. No dated record may be dropped — including one whose conclusion is already stated
elsewhere in the surviving row.** A trace file records the **trail**, not just the destination.
That the live `ABC-029` cell already reports priority `P1` is **not** a reason to drop the
2026-08-11 record of it changing.

**R5 — where two dated records assert contradictory facts, the LATER DATED one is the current
state and the EARLIER IS RETAINED as record, marked with its date.** Correcting a fact never
authorises deleting the record that it was once believed. **If two contradictory records carry the
same date, this rule does not resolve them: stop and escalate rather than pick.**

## Scope

1. **Delete exactly one row** — the second `ABC-028` row (currently L205) — **after re-running the
   `R3` prefix check at repair time.**
2. **Splice** the stale `ABC-029` row's 2404-byte dated tail into the live `ABC-029` `Status` cell
   at its chronological position (`R4`), **then delete the stale row.**
3. **Update the file's own comment block** (currently `:159-169`) so it records the reconciliation
   instead of asserting the duplicates are open.

Nothing else in the file, and no other file.

## Out of scope

- **Every other row.** Named so they are not swept in: the four **known pre-existing
  malformations** flagged at `:157-158` — `ABC-009` (12 cells), `ABC-011`, `ABC-015`, `ABC-019` (11
  each). Flagged, not rewritten, under coding rule 12. **Different defect, different ticket.**
- **THE STATUS-CURRENCY DEFECT — measured here, refused here, and it needs an ID this hop could not
  allocate.** Of the **25 tickets in the board's `Done` column, 10 have a live trace `Status` cell
  containing no occurrence of the word `Done`**: `ABC-013`, `ABC-016`, `ABC-017`, `ABC-018`,
  `ABC-019`, `ABC-022`, `ABC-023`, `ABC-025`, `ABC-027`, `ABC-029`. *(Method: word-presence probe
  on the first row per id. The count is a measurement; reading it as staleness is a judgement —
  `UNKNOWN - verify`.)* **It is a different class — row-versus-board, ten rows — and folding it in
  would take this ticket past `S`, which is the signal to split, not to pad.** This hop held
  `ABC-039` and `ABC-040` only; **no ID is allocated here.** Routed to the Orchestrator.
- **Shortening any `Status` cell.** The live `ABC-028` cell is **50,168 characters**. That is a
  real problem and it is the delivery audit's problem — *the record is the waste* — **not this
  ticket's.** Deleting dated history to make a trace file shorter is the one thing this ticket must
  never do; `R4` forbids it.
- **Any `Done` ticket page** (`ABC-028`, `ABC-029` and every other), any ADR, `plans/metrics.md`,
  `plans/nfr-catalog.md`, `plans/board.md`, and anything under `src/`.

## Acceptance (Given/When/Then)

> Written to be executed with no interpretation and **no reviewer downstream**: criteria review now
> sits at the `Ready for Dev` exit, not at the QE gate.

**A1 — the invariant holds, stated without a hardcoded number. Given** the repaired file, **then**
all three of these are **equal**:

```
grep -cE '^\| ABC-'                      plans/traceability.md      # rows
grep -oE '^\| ABC-[0-9]{3}' plans/traceability.md | sort -u | wc -l # distinct ids
ls plans/tickets/ABC-*.md | wc -l                                   # ticket files
```

**and** `comm -3` over the id set and the filename-derived id set is **empty**. **No literal count
appears in this criterion, so it survives every future append** — including this ticket's own.

**A2 — the `ABC-028` delete is proven lossless AT REPAIR TIME, not on this page's authority.
Given** the two `ABC-028` rows immediately before the edit, **when** their `Status` cells are split
escape-aware, **then** the stale cell **must be a byte-exact prefix** of the live cell
(`live.startswith(stale)` is `True`) and the stale `Code` and `Tests` cells **must both be empty**.
**If either check fails, STOP and do not delete** — the `ABC-028` half is then a merge under `R4`,
and this page is wrong and says so.

**A3 — the `ABC-029` merge loses nothing, in either direction. Given** the reconciled `ABC-029`
row, **then** its `Status` cell contains, in this order and unmodified: **(i)** the old live
cell's characters `[0 : divergence]` as a prefix, **(ii)** the stale cell's 2404-byte divergent
tail, **(iii)** the old live cell's characters `[divergence : end]` as a suffix. **And** all six
probe strings — `AMENDED 2026-08-11`, ``PRIORITY `P2` -> `P1```, `NOTHING IS BROKEN`,
`refinement-ABC-019-a11`, `ONE, not ZERO`, `turn-loop.ts:52` — are present. **Re-derive the
divergence offset; do not paste 2705 from this page.**

**A4 — the splice sits in date order. Given** the reconciled cell, **then** the spliced 2026-08-11
block appears **immediately after** the text `` `HISTORY_COLS` HOLDS at 21.** `` and **immediately
before** the text `DESIGN HOP RUN 2026-08-12` — the 08-11 record preceding the 08-12 record that
followed it in the live row.

**A5 — the file stops asserting something untrue about itself. Given** the repaired file, **then**
its comment block contains **no sentence asserting the duplicate rows are open or unrepaired**
(`grep -c 'NOT repaired' plans/traceability.md` → **0**), and contains **one dated sentence**
recording the reconciliation, the rule each half was resolved under (`R3` / `R4`), and that the
`ABC-029` merge preserved 2404 bytes.

**A6 — nothing else in the file moved, byte for byte. Given** the file before and after, **when**
every row **except** the four `ABC-028`/`ABC-029` rows is compared, **then** every one is
**byte-identical**; **and** the `^| ABC-` row count dropped by **exactly 2**; **and**
`git diff --numstat` names **exactly one file**, `plans/traceability.md`.

## Dependencies

- **The blocker the file itself named is DISCHARGED.** `plans/traceability.md:168-169` declined to
  repair partly because *"a BA/PM hop was live on `ABC-019` at the time — whose row sits two lines
  away."* **Verified 2026-08-13: `ABC-019` is in `Done`.** That condition no longer holds.
- **The owner the file named still applies:** *"Owner: the Orchestrator, to sequence the
  de-duplication against that hop."* **This ticket is the reconciliation; the sequencing is still
  the Orchestrator's.** *(The delivery audit's "this debt has nobody" is slightly too strong — a
  **sequencing** owner was named at `:169`. What had no owner was the **reconciliation**.)*
- **Must not run concurrently with any hop that appends to `plans/traceability.md`** — that is
  every refinement hop, and **two lanes were live on 2026-08-13** (`ABC-021` build, `ABC-026`
  measurement). `ABC-026`'s reporting lands in this file. **A concurrent append while a 19 KB cell
  is being spliced is a merge conflict in the one file that records what was built.**
- **Independent of `ABC-039`.** Different files, no shared line; either order, or one alone.

## Security / NFR triggers

**NONE FIRE. Threshold stated so the claim is falsifiable rather than asserted.**

- **Firing threshold: any production line at all, or any new file under `src/`.** This ticket adds
  **zero** of both — it edits one markdown file under `plans/`. **Measure at the gate:**
  `git diff --numstat -- src/` must be **empty**.
- **`NFR-008` / `N8-LANE`: delta is ZERO BY CONSTRUCTION.** No test file added, changed or removed;
  `ADR-0008`'s paired protocol has nothing to resolve and **must not be run for it**. `ABC-026`
  still owns the lane total.
- **No a11y, latency or data surface.** No UI, deploys nowhere (`ADR-0007`).

## Test notes

1. **Split escape-aware, always.** `plans/traceability.md:152-156` states the rule and the reason:
   splitting on `|` without stripping gives 12 fields for a correct row, and **two roles have
   already filed a FALSE malformation report on this exact row pair** by doing so. Verified here:
   these four rows carry **zero** escaped pipes, so a naive split happens to agree **today** — do
   not rely on that.
2. **Every character offset and line number on this page was measured at `06c5427` and WILL move.**
   Re-derive them. Address rows by **id plus ordinal-within-file**, never by line number.
3. **The delete is authorised by a check, not by this page.** `A2` is written so that the ticket
   fails safe: if the prefix relation is not there at repair time, the correct outcome is to
   **stop**, not to proceed on a three-week-old measurement.
4. **The two halves are not the same job and must not be done with the same motion.** `ABC-028` is
   a delete of a strictly redundant row; `ABC-029` is a splice into the middle of a 16 KB cell.
   **Doing the `ABC-029` half "the same way" as the `ABC-028` half is the failure mode**, and it is
   precisely the mistake the deferred reason would have led a hop into.
5. **Why this went unfixed for three hops is worth inheriting.** The reason recorded on the
   `ABC-028` row was measured on **whole rows**; the disposition it implied needed a measurement of
   **cells**. One true sentence, one wrong inference, three deferrals. **When a record says "this
   needs a reconciling hop", check what was actually measured before inheriting the conclusion.**

## Size and priority rationale

**Size `S` (2).** One row deleted, one 2404-byte block spliced into one cell, one comment block
rewritten, in one file. No code, no test, no fixture, no instrument, no dependency change.
**Not `XS`** — `ABC-030`'s `XS` is four one-sentence edits with nothing to decide; this hop must
apply a precedence rule, place a block chronologically inside a 16 KB cell, and prove a delete
lossless before making it. **Not `M`** — the analysis is done and on this page; what remains is
execution and verification. `SPLIT_REQUIRED` bites at `XL` (8); this is 2.

> **The size is also the scope guard.** The status-currency defect (10 rows) was measured during
> this cut and **refused** rather than folded in — precisely because folding it in takes this past
> `S`, and an oversized records ticket hides exactly the unestimated work that has already made
> this defect survive three hops.

**Priority `P2`, and the reasoning is stated so it can be argued with.**

- **Not `P0`/`P1`** — nothing is blocked, no criterion is unmet, no test fails, no user exists.
  Every hop that has appended to this file appended to the correct row.
- **Not `P3`** — unlike `ABC-030`'s comment debt, this is a **live structural invariant that is
  false right now** in a file **every refinement hop writes**, and the mis-read is active: taking
  the last match for either id returns stale data silently. It also **grows**: each duplicate row
  is another cell that future appends may land in.
- **`P2`, and it must not be pulled ahead of anything user-facing.** It is cheap, bounded, and its
  main value is that the file stops lying about itself.
- **The falsifiable statement:** *if any hop appends to the STALE row of either pair — the failure
  the duplication exists to cause — this becomes `P1` immediately, because two divergent histories
  then need reconciling instead of one.*

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**, item by item. **Result: 10 of 10 MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear — user, pain, value stated | **✅** every hop appending to the trail; 40 rows for 38 tickets with the last match returning stale data; the invariant becomes true and checkable in one command |
| 2 | scope and out-of-scope clear | **✅** three writes in one file; four exclusions, each with a measurement — including the 10-row status-currency defect **measured and refused**, and the 50 KB cell **named and refused** |
| 3 | INVEST-shaped | **✅** independent (of `ABC-039` and of everything else), negotiable, valuable, estimable, small, testable. It touches a file that merged tickets wrote — which is exactly why it is its own page and not work inside `ABC-028`, which is in `Done` and is not re-opened |
| 4 | acceptance testable and measurable | **✅** six criteria: a three-way count equality with **no literal number in it**, a boolean prefix check with a **fail-safe stop**, a three-part containment check, two exact positional anchors, a `grep -c` → 0, and a byte-identity comparison of every untouched row. **No criterion says "works"** |
| 5 | dependencies known | **✅** the file's own stated blocker verified **discharged** (`ABC-019` is `Done`); the sequencing owner named and still the Orchestrator's; the concurrent-append hazard named with the two live lanes that create it |
| 6 | security/NFR triggers marked with a measurable target | **✅** threshold *any production line, or any new file under `src/`*, measured zero, **checkable at the gate by `git diff --numstat -- src/`**; `N8-LANE` delta zero by construction |
| 7 | test notes present | **✅** five, including the escape-aware split rule that has already produced two false reports, and the whole-row-versus-cell inference error that caused three deferrals |
| 8 | size assigned | **✅** `S`, calibrated against `ABC-030` (`XS`), with the size used as an explicit scope guard |
| 9 | priority assigned | **✅** `P2`, argued against both `P1` and `P3`, with a falsifiable statement of what would raise it |
| 10 | no major unresolved blocker | **✅** none. The precedence question that blocked three hops — *what wins when the two rows disagree* — is **RULED on this page** (`R1`–`R5`), including an explicit escalation valve at `R5` for same-dated contradictions. The `UNKNOWN - verify` on the page (whether the 10-row status probe means staleness) is **out of scope and cannot block**, because nothing in `A1`–`A6` reads it |

### Requested board move 2026-08-13 by BA/PM at `refinement-cut-039-040`: `Backlog` (placement REQUESTED, not taken)

**`plans/board.md` was NOT opened for edit** — it is the Orchestrator's. This page exists and is
DoR-complete; **placing it is the Orchestrator's call.**

**`Backlog`, not `Ready`, and the DoR being met is not a reason to promote it.** `Ready` stands at
2/8 with two lanes already pulled from it; adding records debt would make a thin column look
stocked. **The DoR score is recorded so that the day someone does want to pull it, no refinement
hop is needed.**

## Re-score — 2026-10-12 (BA/PM, subtask `bapm-rescore-backlog-process`, `main` @ `1eb2edbc`)

**Verdict: DoR 10/10, recommend `Ready`. Size `S` kept. Priority `P2` → `P3` (front matter not
edited here: this hop is append-only, so the Orchestrator applies it with the move).** The repair plan
still applies byte for byte. `A1`'s premise is gone, and two criteria would have failed on a correct
repair. Readings and commands: `.grugops/context/bapm-rescore-backlog-process/notes/` (observation
note, § ABC-040). `plans/traceability.md` at this tip: 1069 lines, md5 `eb3233b22053441f60f6f91cf4f479f8`.

**What still holds (measured):**
- The four `ABC-028`/`ABC-029` rows are now L460/L462 and L461/L463. They are **byte-identical to
  `06c5427`**: nothing has been appended to the stale rows in two months. All four still split to 10
  cells, with zero escaped pipes.
- `A2`: the stale `ABC-028` `Status` is a byte-exact prefix (2618 of 50168 chars). Its `Code`/`Tests`
  cells are empty.
- `A3`: the `ABC-029` divergence is still at char **2705**. All six probe strings are in the stale cell
  and absent from the live one. **Unit correction:** the stale tail is **2404 characters = 2418 UTF-8
  bytes**. Every "2404-byte" on this page means characters.
- The blocker at the comment block is still discharged (`ABC-019` `Done`). The block now sits at
  L378–388. The escape-aware rule is at L349–370.

**What changed:**
- **"40 rows for 38 tickets" is obsolete.** Since `05eecc1a` (2026-08-17), every hop appends its own
  suffixed row (`ABC-xxx (build)`, `(QE)`, …). Today the file has **482** `^| ABC-` rows: 129 bare and
  353 suffixed. It has **143** distinct ids against **145** ticket files. `ABC-052` and `ABC-155` have
  no row. **`A1`'s three-way equality can never hold again, and it is struck below.**
- **Two more bare-id pairs exist: `ABC-100` (L658/L679) and `ABC-154` (L1066/L1067). They are NOT this
  defect.** Their cells 0–4 differ: each is two different hops' rows, one of which omitted a suffix.
  **Out of scope; do not reconcile them.**
- The out-of-scope malformation list is stale. `ABC-009`/`011`/`015`/`019` all split to 10 today. The
  rows that do not split to 10 are L630 `ABC-065` (11), L631 `ABC-066` (13), L739 `ABC-109 (UAT)` (11),
  L986 `ABC-094 (accepted)` (6) and L1010 `ABC-150 (design)` (2). **Still out of scope.** They are
  routed to the Orchestrator in the note.
- **Priority falls to `P3`.** Both of the page's not-`P3` arguments are gone. The invariant it called
  "live" is dead by convention. "It grows" is false: hops append rows, not cells, and the stale rows
  are unchanged since `06c5427`. The page's `P1` trigger (a hop appends to a stale row) has **not
  fired**.
- **Why it sat in `Backlog` at 10/10:** the cutting hop asked for `Backlog`, not `Ready` (`Ready` was
  2/8 and "records debt would make a thin column look stocked"). Its sequencing owner (the Orchestrator)
  never had a window with no trace-appending hop. **That window is no longer needed.** Hops now append
  at the file's tail (L1069). This ticket edits L378–388 and L460–463, so a concurrent tail append is a
  separate git hunk.

**Criteria amendments (2026-10-12; old text struck, kept for one re-score):**
- **`A1`** ~~rows == distinct ids == ticket files, and `comm -3` empty~~ → **Given** the repaired file,
  **then** (i) no two `^| ABC-` rows have byte-identical cells 0–4 under the escape-aware split. Today
  exactly two pairs do: the `ABC-028` and `ABC-029` pairs. (ii) Among rows whose first cell is exactly
  `ABC-028` or `ABC-029`, each id occurs **once**. No literal count.
- **`A3`** ~~the cell contains (i), (ii), (iii) in this order~~ → the reconciled `ABC-029` `Status`
  cell **equals** `live[:d] + stale[d:] + " **" + live[d:]`, byte for byte, with `d` re-derived. **The
  three-byte separator is required.** Without it the junction reads `bytes.DESIGN HOP RUN` and the cell
  has an odd number of `**` markers (205; it has 206 with the separator). The six probes are still
  present.
- **`A4`** ~~immediately after … immediately before~~ → the spliced block begins `AMENDED 2026-08-11`
  right after `` `HISTORY_COLS` HOLDS at 21.** ** ``, and ends `ZERO `` `src/` `` bytes.` right before
  ` **DESIGN HOP RUN 2026-08-12`.
- **`A5`** ~~`grep -c 'NOT repaired'` → 0~~. That reads **5** today, and four of the hits are other
  tickets' prose (L117, L192, L470, L479). → `grep -cF 'KNOWN DUPLICATE ROWS — flagged 2026-08-12 by
  BA/PM at `` `refinement-ABC-028-shape` ``, NOT repaired.' plans/traceability.md` → **0** (today 1),
  plus the one dated sentence as before.
- **`A6`** unchanged: every other row is byte-identical, the row count drops by exactly 2, and one file
  is in the diff. Since this ticket's own trace row is appended in the same diff, read "drops by 2" as
  the count before the hop's own appended row.

**DoR 10/10:** 1 ✅ (the pain is narrowed to the last-bare-match misread), 2 ✅ (two new out-of-scope
exclusions named), 3 ✅, 4 ✅ (A1/A3/A4/A5 amended to pass on a correct repair), 5 ✅ (the
concurrent-append hazard reduced to tail hunks), 6 ✅ (0 `src/` lines, `N8-LANE` zero), 7 ✅, 8 ✅ `S`,
9 ✅ `P3`, 10 ✅.

## Delivery — 2026-10-17 (Software Engineer, subtask `ticket-to-pr-ABC-040`, branch `grugops/ABC-040-trace-dedup` from `main` `b84dc637`)

**Delivered on branch; recommend `In Review`.** Code commit `8d2e4f8b` touches `plans/traceability.md`
only (+9/−13): the second `ABC-028` row is deleted (`R3`), the second `ABC-029` row is merged into the first (`R4`)
and deleted, the comment paragraph is replaced by one dated sentence, and this hop's `ABC-040 (build)` row
is appended. Every figure was re-derived at `b84dc637`, and all of them match the 2026-10-12 re-score. The rows sat at
L461/L463 and L462/L464 (they had moved by one). Readings and the commit split:
`.grugops/context/ticket-to-pr-ABC-040/notes/`.

| criterion (as amended 2026-10-12) | reading |
|---|---|
| A1 | no two rows share cells 0–4 (pre-edit: exactly the two pairs); `ABC-028` ×1, `ABC-029` ×1 — **MET** |
| A2 | prefix True (2618 of 50168), stale Code/Tests empty, checked before the delete — **MET** |
| A3 | `d` = 2705; cell equals `live[:d] + stale[d:] + " **" + live[d:]`; 206 `**`; six probes present — **MET** |
| A4 | both anchors occur once; the block between them equals `stale[d:]` (2404 chars, 2418 bytes) — **MET** |
| A5 | old sentence `grep -cF` → 0; one dated `RECONCILED 2026-10-17` sentence naming R3, R4, 2404 bytes — **MET** |
| A6 | 508 other rows byte-identical; 512 → 510 before the own row; `8d2e4f8b` numstat names one file; 0 `src/` lines — **MET** (on the code commit; this section and the notes are a separate docs commit, as the brief requires) |

**Gates on tip `8d2e4f8b`:** `npm run -s lint`, `typecheck` and `build` all exit 0. `npm test` exit 0, **58 files /
1792 tests** (= base). `.test-results/last-run.json` `success` true, 0 pending, 0 todo.
`test-skip-integrity --skip-count 0` returns `No findings.` (exit 0). No timing reading taken. UAT waiver measurement:
0 `src/` lines.

## QE

QE/E2E, 2026-10-17 (subtask `qe-ABC-040`, tip `08bbdf2c`, code `8d2e4f8b`, base `b84dc637`; width 3, beside the
SE on `ABC-024` and QE on `ABC-030`). **Verdict: PASS_WITH_GAPS.** The detail is in
`.grugops/context/qe-ABC-040/notes/` (decision `…5ded03e3`).

- **`A1`–`A6` MET, as amended 2026-10-12, each re-derived by QE before reading § Delivery.**
  - **Pairs.** Exactly two groups at base share byte-identical cells 0–4: `ABC-028` L461/L463 and `ABC-029`
    L462/L464. There are none at the tip. `ABC-100` and `ABC-154` share an id but not cells 0–4.
  - **`A2`.** The prefix holds: 2618 of 50168. Stale Code and Tests are empty. **`A3`.** `d` = 2705. The cell equals
    the formula, and it has 206 `**`. **`A4`.** Both anchors occur once, and the records run in date order (08-11,
    then 08-12).
  - **`A5`.** The amended `grep -cF` gives 0, and one dated sentence names R3, R4 and 2404.
  - **`A6`.** 508 other rows are byte-identical and in order. The count goes 512 → 510 before the build row. The code
    commit names one file.
  - QE's figures equal the SE's on every reading.
- **Gates at the tip.** lint, typecheck and build exit 0. `npm test` passes 58 files, 1792/1792. The skip count is 0,
  and the test-integrity check reports `No findings.`
- **Gaps.**
  - **`QE-040-a` (LOW).** Read literally, `A6`'s *"names exactly one file"* holds on `8d2e4f8b` only. The branch range
    also carries the brief-required page section and notes.
  - **`QE-040-b`–`d` (INFO).**
    - Dated records outside the comment block still call the pairs open. They are kept as record under R4/R5.
    - The adjacent malformation paragraph is stale. It is out of scope and already routed.
    - The front matter still says `Backlog`/`P2`. That is the Orchestrator's.
- **UAT waiver.** The `b84dc637...08bbdf2c` reading is empty, so the waiver applies to UAT only. The branch merges
  into `main` @ `fb2c207a` with no conflict. **The next column is the Orchestrator's.**
