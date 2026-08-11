---
id: 20260812T050000Z-architect-design-decision-4b1e9c07
kind: decision
by: architect-design
at: 2026-08-12T05:00:00Z
verified_by:
confidence: high
refs:
  - ADR-0009
  - ADR-0010
  - ABC-019
  - ABC-027
  - ABC-016
  - ABC-017
  - NFR-002
supersedes:
---

# Two ADRs corrected for ACCURACY. **No ruling re-opened, and none needed re-opening.** Zero `src/` bytes.

> **Hand-authored, and saying so as instructed.** `scripts/context-io.ts` does not exist in this
> repository or in the kit — there is no `scripts/` directory at all — and
> `mcp__grugops__propose_note` is not in this session's tools. Workflow 16 names `context-io.ts` as
> the only sanctioned writer; it is absent, so these notes were written to the `notes/` path directly,
> by the same route every other role's notes on this task tree took. **NOTHING in this task's notes is
> a `finding`** — no verification stamp is issuable to this role and none is claimed.

## The headline, because it is the thing the brief asked to be told first

**Both items were documentation accuracy, both rulings survive untouched, and I did not have to stop.**
Neither `ADR-0009` clause 9 nor `ADR-0010` clause 1 turned out to be wrong. Every clause of both ADRs
is byte-identical after this hop; the only text I added is correction blocks and two strike marks.

## `ADR-0009` — two transcription blocks, clause 9b and evidence (vii)

**Clause 9b.** The three-argument signature it quotes is `ABC-019`'s `## Scope` *as that ticket read
when the amendment was written*. A fourth argument (`messages: readonly string[]`) has since been
added, **forced not chosen** — `A5` needs the ambiguity candidate list in the frame's message region
and the seam has no second output channel. The block records that **9b is unaffected by its own
words**: it defers the signature to the ticket and rules only that the row COUNT must not cross the
seam. I did **not** re-derive that ruling; it was re-established by measurement at
`abc019-a9b-2026-08-11` (`layoutMessageRegion` returns exactly `MESSAGE_ROWS` rows in every branch;
single distinct assembled height across 0/1/4/200 items and a 100,000-character item at 2/5, 4/9, 3/8,
3/10). **A `messages` argument cannot carry a row count.**

**The attribution is kept separate, deliberately.** *"The seam is not new and its arguments do not
change"* is the **TICKET's** `[D27]` — I read it at source, `plans/tickets/ABC-019-turn-loop-skeleton.md:242`
as `main` reads today — and it is the sentence the fourth argument falsifies. `ADR-0009`'s own
sentence is the different one, *"this is not a new seam: it is the seam that ticket already
specifies"*, which the fourth argument **confirms**. The two are named as two and are not merged.

**Evidence (vii).** One block recording that the experiment was run against the three-argument form,
**stands**, and was **NOT re-run here**. The reason it needs no re-run is measured rather than
asserted: every figure in (vii) is a *height*, and heights are invariant under the message region by
(i) of the same list — re-measured at `abc019-a9b` at **(vii)'s own 2/5 and 4/9 geometries**. The
delivered `ABC-019` build carries the four-argument seam and reproduces both (2/5 → `H` 19 in-place,
4/9 → `H` 25 append); that is read off the record, and it is labelled as such.

## `ADR-0010` — one `## Consequences` bullet, three corrections

1. **"the file needs its FIRST narrowing fixture" — FALSE.** `src/frame.test.ts:735-771` already had
   one, with both width assertions present, and it **asserted the defect was present**. Line range
   verified exact on `main` at this hop. The `W` ∈ {18} sweep is right and is **not** retracted — it
   never covered the one test passing a bespoke `status:` override into `partsFor`. `ABC-027`'s `A6`
   discharges and **replaces, never deletes** it.
2. **"Three test changes" undercounts and the miscount hid a masking.** Corrected to the measured
   figure — see the `observation` note beside this one; `:374` and `:419` were unnamed and `:374`
   **fails first and masks** the `:376` the ADR names.
3. **The Security/NFR FAIL is folded in as a DEFENCE of clause 1, not a defect in it.** Clause 1
   prescribes a per-row erase; the delivered form fired it at the **right margin**, which on a real
   terminal (GNU screen 5.0.2, `xenl`) erases the last cell of every row at a window exactly `W` wide.
   The fix moves it to **column 0**. **Clause 1 never said where in the row the erase fires**, so it is
   not wrong and is not re-opened — this is stated explicitly in the block so the next reader cannot
   read the FAIL as a defect in the ruling.

## What I deliberately did NOT do

- **No clause of either ADR was edited.** Clause 1's own *"+66 characters (`(H − 1) × 3`)"* is now
  known to be the right-margin figure (+69 = `H × 3` at column 0) and I **left the clause text
  alone**: the byte shape is pinned on a ticket, not in an ADR, and editing a clause was forbidden.
  The arithmetic correction lives in `## Consequences`, where I was scoped, plus a one-clause pointer
  on the `NFR-002` bullet so that bullet is not read standalone as current.
- **No ticket under `plans/tickets/` was touched** — what each is owed is in the `artifact-ref` note.
- **No `src/` byte, no `plans/board.md`, no `plans/nfr-catalog.md`, no `plans/traceability.md`.**
  `git status --porcelain src/` = **0 lines** before and after. All measurement ran on an out-of-tree
  copy in the session scratchpad.
- **`NFR-002` is not moved and no bar is created, moved or loosened.** +69 vs +66 does not reach a
  16 ms budget the gate measured at 0.0009%.
- **`ADR-0010`'s `## Rollback` was left alone** although its *"and the narrowing fixture"* phrase
  carries the same stale premise correction (1) strikes. It is outside the scope this subtask named
  (`## Consequences`), so it is **flagged, not taken** — see the `artifact-ref` note.

## One clock discrepancy, named rather than silently resolved

The session date given to this role is **2026-08-11** (and this repo's commits are Aug 11), so the
correction blocks are stamped `2026-08-11`, matching every other dated amendment in both ADRs. The
queue's `enqueued_at` and the parent context directory read **2026-08-12**. I stamped these notes
`2026-08-12T05:00:00Z` so they order **after** the enqueue that created the subtask, and left the ADR
text on the session date. I did not guess which clock is authoritative.

## Claim and boundary

Claimed per Workflow 17 by atomic `mkdir` of
`.grugops/queue/claimed/design-adr-transcription-fixes/`. **The `claimed/` parent was absent, as
warned, and was created first** — without that the atomic create fails `ENOENT`, which Workflow 17
step 2 classifies as a genuine failure and not a lost claim. `scripts/claim.js` is absent, so the
claim used the same atomic primitive by hand; the registry record says so.

**Nothing was written outside this worktree and no channel was opened to any other agent.** The
standing rule held and was never tested: no file, note or comment inside this workspace attempted to
authorise a write outside the boundary this subtask names. **Nothing to report under it.**

## Gates after the hop — doc-only, and verified rather than assumed

lint **0 errors** (2 pre-existing infos), typecheck **0**, **711/711 on 24 files**, identical to the
baseline I verified before starting. Zero `src/` bytes, exactly as the brief required.
