---
id: ABC-028
title: The history pane's three unreached input classes — a length-preserving mutation, an odd slid window, and the during-render clause over the whole GameHistory graph
status: in-development
column: In Development
size: S
priority: P1
epic: EPIC-002
feature: —
---

# ABC-028 — the history pane's three unreached input classes: a length-preserving mutation, an odd slid window, and the during-render clause over the whole `GameHistory` graph

> **Cut 2026-08-12 by BA/PM** (task `abc017-cut-2026-08-12`, subtask `refinement-ABC-017-cut`,
> Workflow 07), from the four accepted risks `ABC-017` **merged carrying**. `ABC-017` is `Done` and is
> **not re-opened, not moved, and not edited** by this hop — this ticket is the home its leftovers did
> not have.
>
> **THIS IS A HARDENING TICKET, NOT A DEFECT TICKET. The delivered pane is CORRECT on every input
> below**, and three roles measured that independently: QE found zero code defects twice, Security/NFR
> found zero, and `src/history-pane.ts` ~~is md5 `54fd4346dcc1a0060c4e66ae0149265d`~~ **carries ZERO
> bytes of change from this ticket** — unchanged from the
> Engineer's second dev hop, through two QE passes, a Security/NFR gate and the merge. **Every item
> here is a gap in what a criterion ASKS.**
> *(**Live digest corrected 2026-08-12 at `refinement-ABC-028-qe-gaps`:** the pane is
> **`c4653c4c263c4c417ea34969164ccd86`** on this branch tip. `54fd4346…` was its value at `8de988d`;
> `ABC-029`'s licensed one-line comment edit at `:30` moved it. **The zero-diff claim is unaffected and
> was re-verified** — see `## Out of scope`. **Dated blocks below keep `54fd4346…` on purpose**, as do
> the `:102-120` line-map references in the `refinement-ABC-028-a2` amendment above — **that number is
> superseded by `:103-120`; see `## Scope`.**)*
>
> **The expected production diff is ZERO lines.**
>
> | risk | what survives, and where it came from |
> |---|---|
> | `RISK-ABC017-01` ⭐ | **`WCACHE-LEN`** — a cache invalidated on `moves.length` — **passes `A14` exactly**. ~~and survives 744/744~~ **CORRECTED 2026-08-12 by BA/PM at `refinement-ABC-028-a2`, on the build hop's measurement: IT DOES NOT SURVIVE 744/744 — IT FAILS 2 OF 744**, both in `src/history-pane.nfr.test.ts` `A11`. Its only catcher in the whole project is the **incidental fixture sharing** in that file — that half was **TRUE** and is now proved **by construction** (rebuild those fixtures per test with `A1` absent and it goes to `744 passed`). **THE MECHANISM IS A `toSan` CALL COUNT, NOT A ROW COMPARISON: a cache HIT calls `toSan` ZERO times, and `A11`'s tests re-render the module-scope `AT_*` singletons, so by the fourth `it` the count assertion reads 0 where it expects 16. THAT IS WHY `A14` NEVER CAUGHT THIS BUILD** — `A14` compares ROWS across an append, and a length-keyed cache invalidates exactly on cue there. **A tidy-up to per-test fixtures would have silently removed the only guard in the project, through an instrument in a different file, by accident.** `ABC-017`'s merged text and the signed comment at `:106-112` both declared that sharing free to remove. **QE said in words it would not carry this one.** |
> | `RISK-ABC017-02` | **`WLEAD-ODD`** — the leading-half-row correction applied at **even** ply counts only — survives 744/744. `A6`'s fourth anchor is **20 plies, EVEN**, so the black-anchored **odd** slid window is reached by nothing. |
> | `RISK-ABC017-03` | **`WFENMID`, `WPOSMID`, `WBOARDMID`, `WMOVESWAP`** all survive 744/744. `A9`'s *"at no point DURING a render"* is closed for the **contents** of `moves` and open for `initialFen`, `position`, `position.board` and the `moves` property **binding**. |
>
> **`RISK-ABC017-01`'s text half is ruled here and it needs NO edit to merged text.** `ABC-017` says
> *"`A11` may be tidied to per-test fixtures freely and nothing is lost"* and the file comment says the
> same. That sentence is **FALSE today** — and `A2` below **makes it TRUE** rather than correcting it.
> Closing the gap that falsifies a sentence is better than editing the sentence, and it is the only
> repair that also removes the trap. **The interim exposure is real and is named in
> `## Dependencies`.**
>
> **[AMENDED 2026-08-12 by BA/PM at task `refinement-ABC-028-2026-08-12`, subtask
> `refinement-ABC-028-a4` (Workflow 07).** `A4` is **written** on an instrument QE built, armed, costed
> and bounded at `quality-gate-ABC-028-instrument`; its one surviving build is recorded as
> **`RISK-ABC028-01`** inside `A4` rather than in a context note; the `Object.freeze` blocker's number
> is **corrected from `Uint8Array(8)` to `Uint8Array(128)`** (`src/position.ts:76`, read at source —
> the conclusion does not move); the shared-file sequencing question is answered as **evidence in
> `## Dependencies`, not as a decision**; and the Definition of Ready is **re-scored item by item —
> 10 of 10 MET, 9 `✅` and 1 `⚠️` (item 3, INVEST *independent*)**, with the anti-smoothing check run
> explicitly and its direction of travel counted. **Board move `Backlog → Ready` is REQUESTED, not
> taken**: `plans/board.md` was not opened for edit. **No `src/` file was written. `ABC-017`,
> `ABC-029`, `ABC-019` and every ADR were left untouched.]**
>
> **[AMENDED 2026-08-12 by BA/PM at task `refinement-ABC-028-a2-2026-08-12`, subtask
> `refinement-ABC-028-a2` (Workflow 07), after the BUILD hop.** **`A2` IS RULED: IT CONTRADICTED
> ITSELF AND IT IS REWRITTEN.** Its literal `Given` demanded the `:113`+ fixtures be rebuilt per
> test; its own `## Out of scope` **forbids** that rebuild, and its own `## Test notes` 6 says the
> rebuild is **not required**. **Two of this ticket's three statements agreed and one did not — the
> `Given` was the defect, and it is conformed to the other two rather than the other two relaxed to
> it.** The Engineer did not fail `A2`; **`A2`-as-written could not be satisfied by any build.**
> **Under the repaired wording `A2` is MET by work already landed and NOTHING FURTHER MUST BE
> BUILT** — see `A2` for the ruling, the two obligations that were kept, the one that was removed
> and why, and `RISK-ABC028-02` for the residual. **Three corrections the build hop measured are
> written in: `WCACHE-LEN` does NOT survive 744/744 (it fails 2 of 744, and the mechanism is a
> CALL COUNT); `RISK-ABC028-01` is widened to any buffer-level write reverted before the next
> sampling point; the lane figures move from `748` / `1 failed, 747` to `750` / `1 failed, 749` for
> a six-`it` ticket.** A fourth correction fell due at this hop and is made: **the shared file's
> line map MOVED when `A2` landed** — the comment is now `:102-120` and the fixtures now begin at
> `:121`, so every `:106-112` / `:113` reference written before the build is stale. **`S` (2) and
> `P1` both RE-DERIVED; both hold, and `P1`'s ORIGINAL BASIS IS RECORDED AS DISCHARGED.**
> **Requested board move `In Development → In Review`; `plans/board.md` was NOT opened for edit.**
> **`N8-LANE`'s TOTAL was NOT re-derived here — it is `ABC-026`'s and was routed there.** No `src/`
> file written, `plans/nfr-catalog.md` not opened, no ADR opened, `ABC-017` / `ABC-019` / `ABC-029`
> untouched.**]**
>
> **[AMENDED 2026-08-12 by BA/PM at task `refinement-ABC-028-gaps-2026-08-12`, subtask
> `refinement-ABC-028-qe-gaps` (Workflow 07), on QE's `PASS_WITH_RISKS` gate.** QE returned **zero code
> defects and SIX criterion gaps, all BA/PM's**. All six are ruled below. **FIVE are text and are
> written at this hop. ONE — `G1` — IS NOT, AND THIS HOP RULES THAT WORK MUST BE BUILT:** a fifth
> criterion **`A5`** is added, it is the **Engineer's**, and the ticket **holds at `In Development`**.
> **A SEVENTH GAP WAS FOUND AT THIS HOP AND IT IS THIS TICKET'S OWN FENCE** — `## Out of scope`'s md5
> pin and `## Out of scope`'s hand-off of `src/history-pane.ts:30` to `ABC-029` **cannot both hold**,
> and `ABC-029` has landed, so the pin is **violated on the tip this ticket will merge from, by a
> change this ticket licensed.** It is repaired to the property it was trying to state. **EVERY
> VERDICT BELOW WAS RE-MEASURED ON THIS BRANCH TIP, NOT READ OUT OF QE'S NOTES** — and that mattered:
> **QE gated a tree two commits stale.** See `## Test notes` 11. **No `src/` file was written, no test
> weakened, `plans/board.md` / `plans/nfr-catalog.md` / every ADR / `ABC-017` / `ABC-019` / `ABC-029`
> not opened for edit.**]**

## Problem

*User*: two of them, and neither is hypothetical.

1. **The player who takes a move back.** `EPIC-006` owns `undo`, and `ABC-017`'s own `A7` already
   requires `takeBack` by name.
2. **The next engineer to open `src/history-pane.nfr.test.ts`** — which, on the current merge order,
   is `ABC-019`'s engineer, the next hop.

*Pain*:

- **A cache keyed on `moves.length` shows the player the move they just took back.** Measured on the
  delivered pane at this hop: after `playMove b8c6` the last row is `37. Nb1 Nc6`; after
  `takeBack(1)` and a **different** move `g8f6` it is `37. Nb1 Nf6` — **same `moves.length` of 21,
  different content**. `A14` renders the same object twice across an **append**, so a length-keyed
  cache satisfies it exactly.
- **The merged tree contains a signed instruction to delete the only guard that catches it.**
  `src/history-pane.nfr.test.ts:106-112` reads *"THE SHARING HERE IS NO LONGER LOAD-BEARING, and that
  is now measured rather than argued … So these may be rebuilt per test freely."* It is written in the
  form a later reader trusts **because it says it was measured** — and the measurement it reports is
  real but narrower than the claim drawn from it.
- **A black-anchored game of odd length gets a phantom empty white cell in row 1 and silently loses a
  ply**, under a build that renders `A6`'s brand-new fourth anchor perfectly.
- **`A9` has now been repaired three times and its class is still open.** See `## Test notes` for the
  pattern and why this ticket refuses a fourth per-field patch.

*Value*: the pane's two load-bearing promises — *it shows the caller's current game* and *it is
exactly `HISTORY_ROWS` rows* — keep working after the next tidy-up, the next undo, and the next
loaded FEN. **Nothing here adds a feature. It stops three measured wrong builds from being
indistinguishable from the right one.**

## Scope

**Test-side only, in the two files that already exist.** No production line, no new module, no new
test file, no new dependency.

- `src/history-pane.test.ts` — three new fixtures and their assertions (`A1`, `A3`, `A4`).
- `src/history-pane.nfr.test.ts` — the `A2` demonstration, and whatever the `A2` result obliges the
  fixture-sharing comment at ~~`:106-112`~~ ~~`:102-120`~~ **`:103-120` as it now stands** to say.
  > **[LINE MAP CORRECTED 2026-08-12 by BA/PM at `refinement-ABC-028-a2`, read at source.]** `A2`'s
  > comment edit was `+15 / -7`, so **every `:106-112` and `:113` reference written before the build
  > hop is stale by eight lines.** As landed: the comment block is ~~`:102-120`~~ **`:103-120`**, the
  > false sentence it replaced was at `:106-112`, and the `AT_0`…`AT_2000` module-scope fixtures now
  > begin at **`:121`** ~~(md5 `65f4f29ac930d7a7f432e14f2eef47f9`)~~. Historical, dated blocks
  > elsewhere on this page keep their original numbers **on purpose** — they are records of what was
  > read on the day, and rewriting them would falsify a dated measurement. **The live references are
  > corrected; the dated ones are flagged.**
  >
  > **[THE START LINE WAS STILL WRONG, AND THE md5 IS NOW STALE TOO — CORRECTED 2026-08-12 by BA/PM at
  > `refinement-ABC-028-qe-gaps`, read at source, `G6`.]** **Line 102 is BLANK.** The comment block is
  > **`:103-120`**, not `:102-120`; the fixtures still begin at **`:121`**, which was always right.
  > **This is the SECOND time this block's start line has been wrong in the record and BOTH errors were
  > written by a BA/PM hop** — the first stale by eight lines, this one by one. `## Test notes` 4 says
  > re-measure before writing a number; **a line number is a number.** The correction is applied to every
  > LIVE reference on this page (`## Scope`, `RISK-ABC028-02` ×2) and to none of the dated blocks.
  >
  > **The md5 is struck rather than updated, and that is a ruling, not laziness.**
  > `src/history-pane.nfr.test.ts` is **`796918f370e26d2cbc6055953edf06ae`** on this branch tip, not
  > `65f4f29a…`: **`ABC-029`'s build (`b7e1226`) landed `+146 / -43` in this file**, repairing the two
  > structural guards ~120 lines below the comment. **The comment block `:103-120` and the fixtures at
  > `:121` survived that change byte-for-byte** — verified at source at this hop — **so the line map
  > holds and only the whole-file digest moved.** A whole-file md5 is the wrong fence for a file two
  > tickets edit in different regions; it goes stale on a change that does not touch the region it is
  > guarding. **The line map is the fence; the digest was decoration.** Same defect as the
  > `src/history-pane.ts` md5 pin — see `## Out of scope`.

## Out of scope

- **Any production line.** `src/history-pane.ts` is correct on every input in this ticket and ~~its md5
  must be `54fd4346dcc1a0060c4e66ae0149265d` at the end~~ **this ticket's own net diff on it must be
  EMPTY**. If a criterion here appears to require a production change, **stop and report** — it means
  the criterion is wrong, which is this ticket's own subject.
  > **[THE FENCE WAS SELF-CONTRADICTORY AND IS REPAIRED — 2026-08-12 by BA/PM at
  > `refinement-ABC-028-qe-gaps`. THIS IS THE SEVENTH GAP, IT IS THIS TICKET'S OWN, AND NOBODY
  > REPORTED IT: I FOUND IT BY CHECKING THE FENCE INSTEAD OF QUOTING IT.]**
  >
  > **Measured on this branch tip: `src/history-pane.ts` is `c4653c4c263c4c417ea34969164ccd86`, NOT
  > `54fd4346dcc1a0060c4e66ae0149265d`.** The fence above, read literally, is **VIOLATED** — and it is
  > violated by a change **this ticket's own `## Out of scope` licensed three bullets below**:
  > *"`src/history-pane.ts:30`'s unqualified comment … is `ABC-029`'s"*. `ABC-029`'s build (`b7e1226`)
  > made exactly that edit — **one line, a comment, `+1 / -1`**, verified at source at this hop.
  >
  > **Two bullets of one section became mutually unsatisfiable the moment the second one's owner ran.**
  > A hop reading the fence literally on this tip would *"stop and report"* on a change this ticket asked
  > for. **That is a criterion that cannot be satisfied by any build, found in this ticket's own fences —
  > the same defect class as `A2`'s `Given`, at the sixth reading, in the section that exists to prevent
  > it.**
  >
  > **THE REPAIR, and it is not a softening.** The property the fence was reaching for is ***`ABC-028`
  > adds zero production lines***, not *"this file's bytes never change"*. **A fixed whole-file md5 is
  > the wrong instrument for a shared file on a linear stack** — it fails on any neighbouring ticket's
  > licensed edit, which is precisely what it did. The diff is the right instrument and it is strictly
  > stronger, because it survives rebasing and still catches a single added production line.
  >
  > **The obligation, restated so it is checkable:** `git diff` of `src/history-pane.ts` across
  > **`ABC-028`'s own commits** must be **empty**. Verified at this hop: the pane is
  > `54fd4346dcc1a0060c4e66ae0149265d` at `09d4515` (before this ticket), at `05217b7` and at `8de988d`
  > (this ticket's two build commits) — **`ABC-028` changed zero bytes of it**, which is what the fence
  > was for and it HOLDS. **`54fd4346…` is retained above as the dated value it was; it is not the
  > current tip and must not be quoted as one.**
- **Re-opening, editing or moving `ABC-017`.** It is `Done`. `A1`–`A14` are discharged and none of
  them moves. This ticket carries new criteria of its own; it does not amend theirs.
- **`src/history-pane.ts:30`'s unqualified comment, `A11`'s scope word, the load probe's roots and its
  stdout channel.** All four are **`ABC-029`'s**, deliberately — they are one subject (what
  `A11`'s clause covers and what its guard reaches) and this ticket is the other (what the pane's
  own output and caller contract require).
- **`G5` / `AR-4` — the `HISTORY_COLS` self-comparison.** `WCOLS24R` still survives; it is
  **deliberately unhomed** by three roles and this hop upheld that. `HISTORY_COLS` **HOLDS at 21**. No
  widening, no criterion here or anywhere, **no constant-FRAME-width criterion** (`ADR-0010` cl. 5 and
  cl. 7 refuse it and `W` varies by design). `ADR-0009` and `ADR-0010` are `accepted` and **not
  re-opened**.
- **The supplied-FEN width and compute path (`AR-1`).** Ruled at the cutting hop: the **compute** half
  is closed by `ABC-010`, the **width** half is not. Neither is this ticket's. See
  `## Dependencies`.
- **Tidying `A11`'s fixtures to per-test.** `A2` establishes that it *may* be done; it does not ask
  for it. The Engineer declined it once with three measured reasons and that decision stands.

## Acceptance (Given/When/Then)

**Every criterion names the wrong build it must kill and the lane that build must die in.** ~~All four
builds below~~ **survive 744/744 on 26 files with skip 0** today — QE's measurement, on builds QE
constructed from its own definitions.

> **[COUNT CORRECTED 2026-08-12 by BA/PM at `refinement-ABC-028-a4` — the set below GREW at this hop
> and the old count would have gone false.]** `A4` now names **`WBOARDSET`, `WBOARDBUF` and
> `WBOARDBLIND` in addition to the original four**, and all three also survive the delivered suite.
> **The per-build verdict is stated in `A4`'s own table rather than counted here**, because the set is
> the thing that keeps changing. Two builds named below do **not** survive and never did — `WSPLICE`
> (dead on `A9`'s freeze) and naive `WCACHE` (dead in `A2`'s single-file lane, 1 of 18) — and they are
> named as *must stay dead*, which is a different obligation from *must start dying*.
>
> ~~**FLAGGED, NOT EDITED — a pre-existing tension in the header table, reported per the 12 coding
> rules.**~~ **RESOLVED BY MEASUREMENT 2026-08-12 — the flag below was raised at `refinement-ABC-028-a4`
> and is kept verbatim so the correction can be audited against what was actually predicted.** The
> header said `WCACHE-LEN` *"survives 744/744"* **and** that its only catcher is the incidental fixture
> sharing in `src/history-pane.nfr.test.ts`; `A2` says it *"survives 18/18"* with that file **not
> loaded**. Those two readings cannot both be literally true of the same full-suite run. **This hop did
> not measure `WCACHE-LEN` and therefore did not touch either sentence** — `A1`/`A2` are not this
> subtask's scope, the text is a merged-risk restatement, and guessing at it is exactly the defect
> `## Test notes` 4 exists to prevent. **Owner: the hop that measures `A1`/`A2`.**
>
> **[THE OWNER RAN. RULED 2026-08-12 by BA/PM at `refinement-ABC-028-a2` on the build hop's
> measurement.] THE FALSE SENTENCE IS *"survives 744/744"*.** `WCACHE-LEN` **fails 2 of 744** on the
> **unmodified** delivered tree, both in `src/history-pane.nfr.test.ts` `A11`. **The other sentence —
> *"its only catcher is the incidental fixture sharing"* — is TRUE**, and it is now proved **by
> construction** rather than by argument: rebuild those fixtures per test with `A1` absent and the
> build goes from `2 failed` to **`744 passed`**. **The flag was right that both could not hold; it
> was right about which way round only after somebody ran it, which is `## Test notes` 4 working
> exactly as intended.** The mechanism — a `toSan` **CALL COUNT**, not a row comparison — is in the
> header table and in `A1`, because it is the reason `A14` never caught this build.

**A1 — freshness across a mutation that does NOT change `moves.length`. Given** the black-to-move
anchor `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 27` carried to **20 plies** by the
knight cycle, **when** the pane renders it, then the caller plays `b8c6`, the pane renders **the same
object**, then the caller calls `takeBack(history, 1)` and plays a **different** legal move `g8f6`,
and the pane renders **the same object** a third time, **then** the second and third panes **differ**
— the last row moves from `37. Nb1 Nc6` to `37. Nb1 Nf6` — while `history.moves.length` is **21 at
both**.

*Witnessed at the cutting hop against the delivered pane, out of tree, so no number here is derived:*

```
render 1 (20 plies) last row:        "  37. Nb1            "   moves.length 20
after playMove b8c6:                 "  37. Nb1     Nc6    "   moves.length 21
after takeBack(1) + playMove g8f6:   "  37. Nb1     Nf6    "   moves.length 21
panes 2 and 3 differ: true
```

*This reproduces QE's measured consumer path exactly and is its **third** independent confirmation.*

**Kills `WCACHE-LEN`** — a pane memoising rows per `GameHistory`, invalidated when `moves.length`
changes. **It is the cache a competent engineer actually writes**, and it is more natural than the
naive `WeakMap` that never invalidates. It passes `A14` exactly. ~~and survives 744/744 today~~

> **[CORRECTED 2026-08-12 by BA/PM at `refinement-ABC-028-a2`, on the build hop's measurement —
> AND THIS IS THE MOST USEFUL THING THAT HOP FOUND, SO IT IS WRITTEN HERE AND NOT IN A FOOTNOTE.]**
>
> **`WCACHE-LEN` DOES NOT SURVIVE 744/744. IT FAILS 2 OF 744**, both in
> `src/history-pane.nfr.test.ts` `A11` — *"calls `toSan` exactly once per RENDERED ply"* (`toSan at
> 40: expected 16 times, got 0 times`) and *"hands `toSan` no legal move list"* (`expected "toSan" to
> be called at least once`). Measured against the **UNMODIFIED** delivered suite.
>
> **THE MECHANISM IS A CALL COUNT, NOT A ROW COMPARISON — and it is the answer to the question this
> ticket kept asking: why did `A14` never catch this build?** `A11`'s tests re-render the
> module-scope `AT_*` singletons, so by the time its fourth `it` asserts *"`toSan` called once per
> rendered ply"*, `AT_40` has **already been rendered by three earlier tests in the same file**. A
> cache **HIT** calls `toSan` **zero** times, and the count assertion reads `0` where it expects
> `16`. **`A14`, by contrast, compares ROWS across an APPEND — and a length-keyed cache invalidates
> exactly on cue there, so `A14` is structurally incapable of failing on it.** The build was caught
> in a **different file, by a different instrument, of a different kind, by accident.**
>
> **THIS IS WHY THE TIDY-UP WAS DANGEROUS AND WHY NOBODY COULD SEE IT.** A reader auditing *"is the
> freshness guard safe if I rebuild these fixtures?"* naturally looks at the freshness tests. The
> guard was never a freshness test. **`A1` is the first freshness guard that actually catches it**,
> and it catches it by the row comparison at `expect(third).not.toEqual(second)` — the honest
> instrument for the property, in the file that owns it.

> **The discriminator is the SAME LENGTH, and that is the whole criterion.** An append-based freshness
> check — which is what `A14` is — cannot fail on a length-keyed cache, because the key moves. Do not
> weaken this to a second `playMove`.

**A2 — the freshness guard does not depend on another file's fixtures.**

> **[REWRITTEN 2026-08-12 by BA/PM at task `refinement-ABC-028-a2-2026-08-12`, subtask
> `refinement-ABC-028-a2` (Workflow 07). THE CRITERION CONTRADICTED ITSELF AND COULD NOT BE
> SATISFIED BY ANY BUILD. THE PRIOR TEXT IS PRESERVED BELOW THE RULING SO THE REPAIR CAN BE
> AUDITED AGAINST WHAT IT REPLACED.]**

**Given** `A1` landed in `src/history-pane.test.ts`, **when** `WCACHE-LEN` and the naive `WCACHE`
are each run in **both** of these configurations —

- **(a) the single-file lane:** `npx vitest run src/history-pane.test.ts` **alone**, with
  `src/history-pane.nfr.test.ts` **not loaded at all**;
- **(b) the full suite in an OUT-OF-TREE replica** whose `src/history-pane.nfr.test.ts` module-scope
  fixtures (now at `:121` and following) are rebuilt **per test** —

**then** in **both** configurations **both builds die**, and ~~**every** surviving kill is in
`src/history-pane.test.ts` — **none** in `src/history-pane.nfr.test.ts`~~ **every surviving kill is in
`src/history-pane.test.ts`**;

> **[THE `none in the nfr file` HALF IS REMOVED — 2026-08-12 by BA/PM at `refinement-ABC-028-qe-gaps`,
> `G5`. I ADDED IT ONE HOP AGO AND IT CANNOT REPORT. THE REMOVAL IS PUBLISHED, NOT BURIED.]**
> I added this clause at `refinement-ABC-028-a2` to close *"a reading in which one stray kill in the nfr
> file would have passed."* **It closes a reading that cannot occur, in either configuration `A2`
> requires:** in **(a)** the nfr file is **not loaded**, so a kill there is impossible by construction;
> in **(b)** the fixture rebuild **IS** the transformation that disables the nfr file's only catcher.
>
> **And it is worse than merely unfalsifiable, which is the half QE did not state and I owe here.**
> Asserted over the **delivered** tree — the one configuration where it *could* report — **it is
> FALSE**: `WCACHE-LEN` fails `3 / 750` there and **two of those three kills are in the nfr file**
> (`A11` ×2). **The clause is true only where it cannot report and false everywhere it could.** That is
> a stronger reason to remove it than *"it never fires"*, and it is why this is a removal rather than a
> relocation. `AGENTS.md` rule 8.
>
> **Direction of travel at this hop is NET ADDED, counted rather than asserted: one clause removed
> against a whole new criterion (`A5`), a corrected `A4` clause 1, `RISK-ABC028-01` split into two, and
> a repaired `## Out of scope` fence.** The obligation the clause was standing in for — *the guard is
> owned in `src/history-pane.test.ts`* — is **not** dropped: it survives in the surviving half of this
> `Then` and, far more strongly, in `A5`.

**and** the comment at the trap site in `src/history-pane.nfr.test.ts` is left saying **only what is
true of that result**, naming `src/history-pane.test.ts` as the owner of the property, so a reader
looking for the guard finds it;

> **[THE COMMENT OBLIGATION IS NOT DISCHARGED. RE-OPENED 2026-08-12 by BA/PM at
> `refinement-ABC-028-qe-gaps` on `G1` + `G6`, MEASURED ON THIS TIP.]** The comment as landed says
> **more than is true**, at **TWO** sites, and carries **one stale number**. `A2` required *"only what
> is true"*; it is not met until all three are repaired. **This is the obligation `A5` inherits and it
> is listed there with its exact text.** QE named one of the two sites; the second is
> **`:106-108`** and it does the same job — *"a reader looking for the guard against a **memoising
> pane** finds it there, with this file not loaded at all"*. **Measured at this hop: with this file not
> loaded, `WCACHE-LAST` — a memoising pane — passes `24 / 24`. The reader does NOT find the guard
> there.** Rewording only the sentence QE named would have left the same false generalisation standing
> twelve lines above it.

**and** the measurements above are **recorded where a later reader can locate them**, because
configuration (b) does not exist in the repository and its evidence has no other home.

**Measured 2026-08-12 at the build hop, `ticket-to-pr-ABC-028-dev` — every figure RUN, none derived:**

```
configuration                                        WCACHE-LEN        WCACHE (naive)
(a) src/history-pane.test.ts ALONE, WITH A1          1 failed / 24     2 failed / 24
      before A1:                                     18 passed / 18    1 failed / 18
(b) nfr fixtures REBUILT PER TEST, WITH A1           1 failed / 750    2 failed / 750
      before A1:                                     744 passed        1 failed / 744  (A14)
kills in (b): src/history-pane.test.ts > ABC-028 acceptance > A1  (and A14 for WCACHE)
              NOT ONE kill is in src/history-pane.nfr.test.ts
comment:      md5 e27a8387d589adf21ba5b5dd2244225e -> 65f4f29ac930d7a7f432e14f2eef47f9
              one hunk, +15/-7, EVERY changed line begins `//`, no fixture line touched
```

> ### THE RULING — what was wrong, what was kept, what was removed, and what was refused
>
> **THE DEFECT.** `A2`'s literal `Given` was *"the fixtures at `src/history-pane.nfr.test.ts:113` and
> following rebuilt **per test**"* — a statement about **the state of the repository**. This ticket's
> own `## Out of scope` **forbids** that rebuild (*"`A2` establishes that it may be done; it does not
> ask for it"*) and its own `## Test notes` 6 says it in terms (*"It does **not** require rebuilding
> those fixtures per test"*). **No build could satisfy the `Given` and the fences at the same time.**
> The Engineer discharged both measurement forms out of tree, wrote the comment, and declared `A2`
> **MET IN PART** rather than rounding up. **That was the correct call and it is upheld: the Engineer
> did not fail this criterion — the criterion could not be met as written.**
>
> **THE REPAIR, AND WHY IT IS NOT A SOFTENING.** Three statements in this ticket described `A2`'s
> obligation. **Two said no rebuild is required (`## Out of scope`, `## Test notes` 6) and one said
> the rebuild is the `Given`.** The minority statement is conformed to the majority. **The `Given`
> was the defect, not the fences** — and the repair names the configuration the measurement always
> had to be taken in, which is exactly what the Engineer did.
>
> **KEPT — every obligation the old text carried, all three:** both builds must die; every kill must
> be in `src/history-pane.test.ts` and none in the nfr file; the comment must say only what is true
> and must name the owning file. **Nothing was dropped to make a build pass.**
>
> **ADDED — four, so the direction of travel is counted rather than asserted:** (1) **both**
> configurations are now required, where the old text offered (b) as the `Given` and (a) as an
> *"equivalently and preferably"* aside — an *or* became an *and*; (2) *"the surviving kills"*
> becomes ***"every** surviving kill"*, closing a reading in which one stray kill in the nfr file
> would have passed; (3) the evidence must be **locatable**, which the old text never required and
> which is the whole reason configuration (b)'s result was nearly homeless; (4) the stale `:113` is
> corrected to `:121`, so the `Given` points at real lines — `## Test notes` 4's own rule, applied
> to this page.
>
> **REMOVED — ONE, and it is published rather than buried:** the reading in which the repository
> itself must be left with per-test fixtures. **It is removed because it is forbidden by this
> ticket's own `## Out of scope`**, not because it was expensive — and the cost is on record anyway
> (~9.3 ms per rebuild, 6.0 ms of it the 2,000-ply shuffle, buying nothing).
>
> **WHAT THE REPAIRED CRITERION DOES NOT CLAIM, stated plainly.** Configuration (b) is a
> **demonstration, not a standing guard**. Nothing in the repository re-runs it. That residual is
> named as **`RISK-ABC028-02`** below rather than left for a later hop to rediscover — the same
> handling `RISK-ABC028-01` gets inside `A4`.
>
> **THE STANDING IN-TREE GUARD EXISTS AND IT IS `A1` — this is the fact that decided the ruling.**
> `A1` is landed at `src/history-pane.test.ts:785`, runs on every `npm test`, and kills `WCACHE-LEN`
> at `expect(third, "the third pane must not repeat the second").not.toEqual(second)`. **Its
> independence from the nfr file is structural, not measured: `src/history-pane.test.ts` imports
> NOTHING from `src/history-pane.nfr.test.ts`** — verified by reading its seven imports, all of them
> production modules — **and vitest isolates per file.** The out-of-tree measurement therefore
> **corroborates a structural fact; it does not stand in for a missing guard.** That is a materially
> stronger position than *"we measured it once"*, and it is why the residual below is a note to the
> next reader rather than a hole.
>
> **THREE CLOSURES CONSIDERED AND REFUSED, priced rather than waved away** — because *"build a
> standing guard"* was a live option at this ruling and a later hop deserves to know it was costed:
>
> - **An import guard** — an `it` asserting `src/history-pane.test.ts` does not import from the nfr
>   file. **Refused: it guards a thing that cannot happen silently.** The hazard `RISK-ABC017-01`
>   names runs the other way (someone deletes the sharing believing nothing is lost), and an import
>   would be a visible refactor, not a tidy-up. `AGENTS.md` rules 5 and 8.
> - **A child-process probe** that runs `src/history-pane.test.ts` alone and asserts it green.
>   **Refused: it guards nothing.** That lane is green with or without the property, because
>   `WCACHE-LEN` is not in the tree. It would also cost roughly what `RF-1` costs (~102 ms) on a
>   lane whose content total is under active dispute at `ABC-026`.
> - **Landing `WCACHE-LEN` in-tree as a mutant fixture** so `A1`'s kill is asserted directly.
>   **Refused here, and it is the only one of the three with real merit.** It is a mutation-testing
>   harness — a pattern this project has never adopted, used by no criterion in `ABC-017`,
>   `ABC-023`, `ABC-024` or this ticket, all of which build mutants out of tree. **Introducing it
>   through the side door of one criterion, with unpriced lane cost, is a bigger decision than this
>   ticket is allowed to make.** If a hop ever wants it, this is the note that says it was on the
>   table and why it was not taken.
>
> ~~**CONSEQUENCE FOR THE BUILD: NONE. `A2` as repaired is MET by work already landed.**~~ Both
> configurations were run, both verdicts hold, the comment is written and mechanically verified
> comment-only. ~~**This ruling routes the ticket FORWARD to QE, not back to the Engineer** — no
> further production line, test line or measurement is owed by it.~~
>
> > **[MY OWN RULING, CORRECTED BY MEASUREMENT — 2026-08-12 by BA/PM at `refinement-ABC-028-qe-gaps`.
> > I WROTE THE SENTENCES BELOW AND TWO OF THEM ARE FALSE. THEY ARE STRUCK, NOT DELETED.]**
> >
> > **WHAT SURVIVES, and it is the load-bearing half:** `A1`'s **independence** from the nfr file is
> > structural, not measured — different file, no import, vitest isolates per file — and the
> > out-of-tree measurement *"corroborates a structural fact; it does not stand in for a missing
> > guard."* **Re-verified at this hop and unchanged.** `A2`'s **measurement** half is MET: both
> > configurations run, both named builds dead in both, every kill in `src/history-pane.test.ts`.
> >
> > **WHAT IS FALSE: `A2` is not MET, because its COMMENT half is not.** The comment says more than is
> > true at two sites (above). **`A2` is therefore MET IN PART — which is exactly the verdict the
> > Engineer returned and I overruled.** The Engineer was right twice on this criterion and I was
> > right once.
> >
> > **AND THE SENTENCE I MUST OWN IS IN MY `P1` RE-DERIVATION, NOT HERE:** *"The trap is defused, `A1`
> > is landed, and **the sharing genuinely is no longer load-bearing.** The hazard this ticket's `P1`
> > priced is GONE — because this ticket removed it."* **Measured on this branch tip: `WCACHE-LAST`
> > fails `2 / 750`, both kills the `A11` `toSan` call counts in the nfr file, and rebuilding those
> > fixtures per test takes it to `750 passed`. The sharing is still the sole load-bearing guard for
> > the next cache in the family. My sentence is FALSE.**
> >
> > **I wrote a measured-sounding certification that the sharing was free to delete, inside the ruling
> > whose entire subject was a measured-sounding certification that the sharing was free to delete.**
> > That is the third occurrence of `## Test notes` 1's pattern on this family and **the second one
> > this project produced on purpose.** It is corrected in `## Size and priority rationale`.
> >
> > **CONSEQUENCE FOR THE BUILD: NOT NONE.** `A5` is owed and the comment repair is owed. **This
> > ruling routes the ticket BACK TO THE ENGINEER, not forward to QE.**

**PRIOR TEXT, preserved verbatim for audit — superseded by the ruling above, NOT deleted:**

> ~~**Given** the fixtures at `src/history-pane.nfr.test.ts:113` and following rebuilt **per test**,
> **when** the full suite runs against `WCACHE-LEN` and against the naive `WCACHE`, **then** both
> still **die**, and the surviving kills are in `src/history-pane.test.ts` — **not** in
> `src/history-pane.nfr.test.ts`.~~
>
> ~~**Equivalently and preferably, measured the way QE measured it:** running
> `npx vitest run src/history-pane.test.ts` **alone**, with `src/history-pane.nfr.test.ts` **not
> loaded at all**, `WCACHE-LEN` **fails**. Today it **survives 18/18** in that configuration while
> naive `WCACHE` fails 1 of 18.~~

> **This is the criterion that MAKES A MERGED SENTENCE TRUE rather than correcting it.** `ABC-017`
> states *"`A11` can now be tidied to per-test fixtures freely and nothing is lost"* and
> `src/history-pane.nfr.test.ts:106-112` states the same. **Both are false today and both become true
> the moment `A1` lands.** The comment must then be re-read against this criterion and left saying
> only what is true of it — including that the property is now owned in
> `src/history-pane.test.ts`, so a reader looking for the guard finds it. **No merged ticket text is
> edited by this ticket.**
>
> **[DISCHARGED 2026-08-12 at the build hop, and it is worth recording that it worked.]** The
> sentence was made **TRUE BY CONSTRUCTION** and no merged text was edited by anybody. **Six roles
> read that trap and declined to act on it; the seventh edited it, sanctioned and required, and
> touched not one fixture line.** The three-site correction the `## Dependencies` conditional held in
> reserve **did not fall due.**

### `RISK-ABC028-02` — the residual `A2` leaves, named here rather than discovered later

**Configuration (b) is a demonstration and the repository does not re-run it.** If a later hop
rebuilds the `:121`+ fixtures per test, nothing in the tree re-checks that `WCACHE-LEN` still dies —
the evidence lives in this criterion and in the build hop's context notes, not in a test.

~~**The exposure is small and it is bounded by construction, which is why it is a named residual and
not a blocker.**~~ `A1` is in a different file, imports nothing from the nfr file, and vitest isolates
per file, so rebuilding those fixtures **cannot** reach `A1`'s verdict. Moreover, if that rebuild
ever happens, the counterfactual **becomes** the tree and `A1` runs in it.

> **[THE BOUND IS CORRECTLY DRAWN FOR THE BUILD IT NAMES AND UNDERSTATED FOR THE CLASS — CORRECTED
> 2026-08-12 by BA/PM at `refinement-ABC-028-qe-gaps`, `G4`, MEASURED ON THIS TIP.]**
>
> **Bounded for `WCACHE-LEN`: TRUE, and the mechanism was re-verified.** Everything above this block
> holds for the build the risk names.
>
> **Bounded for the CLASS: FALSE.** Measured at this hop on `WCACHE-LAST` — a cache keyed on
> `moves.length` **and** last-move identity, the fix an engineer writes the moment `A1` catches
> `WCACHE-LEN`:
>
> ```
> configuration                                        WCACHE-LAST
> delivered tree (26 files)                            2 failed / 750   <- A11 x2, the SHARING, only
> (a) src/history-pane.test.ts ALONE                   24 passed        <- A1, A3, A4 all silent
> (b) nfr :121+ fixtures REBUILT PER TEST              750 passed       <- the guard is GONE
> ```
>
> **The rebuild this risk calls harmless removes the only guard in the project for that build.** The
> exposure is not small and it is not bounded — it is `RISK-ABC017-01`'s own hazard, narrowed by
> exactly one build.
>
> **THE RESTATED BOUND, written so it tracks the criteria instead of needing a third correction:** the
> residual is **bounded by construction for every cache class that has an owned guard in
> `src/history-pane.test.ts`, and unbounded for every class that does not.** Today that is one class —
> the length-and-last-identity cache — and **`A5` is what closes it.** When `A5` lands, this risk
> returns to *small and bounded* **by construction rather than by assertion**.
>
> **AND THE HAZARD DOES NOT RUN ONLY THE OTHER WAY.** The paragraph below says the danger needs `A1`
> deleted. **It does not.** With `A1` present, landed and green, rebuilding those fixtures still loses
> a guard for the next cache. **A latent hazard was described as needing a trigger it does not need.**

~~**The real hazard runs the other way, and it is the one to watch: if `A1` is ever deleted, weakened
or folded into `A14`, the comment at `src/history-pane.nfr.test.ts:102-120` goes FALSE again and the
`RISK-ABC017-01` trap is RE-ARMED**~~ **A SECOND hazard, additional to the one above: if `A1` is ever
deleted, weakened or folded into `A14`, the comment at `src/history-pane.nfr.test.ts:103-120` goes
FALSE for `WCACHE-LEN` too** — with the same call-count mechanism that hid it for six roles.
**`## Test notes` 2 already forbids folding `A1` into `A14`**; this risk is why that note is
load-bearing rather than stylistic.

**Standing obligation:** any hop that deletes, weakens or relocates `ABC-028` `A1` **or `A5`** **must
re-read `src/history-pane.nfr.test.ts:103-120` and correct it in the same change**, because that
comment asserts they exist. **Owner: whoever touches `A1` or `A5`.** No date — this is a latent
hazard, and it is recorded as one rather than dressed up with a trigger it does not have.

**A3 — the black-anchored slid window at ODD length. Given** the same anchor and cycle carried to
**21 plies** (ODD), **when** the pane renders, **then** **row 1's white cell is NOT empty — it holds
`Nc3`**; the pane has exactly `HISTORY_ROWS` rows of `HISTORY_COLS` characters; its eight row numbers
are the ordered list **30, 31, 32, 33, 34, 35, 36, 37**; and the last row is **FULL** —
`37. Nb1 Nc6`, both cells populated.

*Witnessed at the cutting hop, out of tree:*

```
20 plies (EVEN — A6's fixture)      21 plies (ODD — this criterion)
[  30. Nc3     Nb8    ]             [  30. Nc3     Nb8    ]
  …                                   …
[  37. Nb1            ]             [  37. Nb1     Nc6    ]
row 1 white cell "Nc3    "          row 1 white cell "Nc3    "
last row full: false                last row full: true
```

**Kills `WLEAD-ODD`** — `const leadingHalfRow = blackToMoveAtAnchor && plies % 2 === 0 ? 1 : 0`.

> **READ THIS BEFORE WRITING THE TEST — the row count and the move numbers CANNOT be the
> discriminator here, and a criterion that cannot fail on the build it exists to catch is the `D22`
> defect this ticket's parent paid for twice.** Measured at the cutting hop: the delivered pane
> renders the **same eight numbers 30–37** at 20 and at 21 plies, and `WLEAD-ODD` renders **eight rows
> with those same eight numbers and a full last row** at 21 plies. **Its only visible defect is row
> 1's white cell**, which it leaves empty while silently dropping the `Nc3` ply off the top of the
> window. **The white-cell clause is the assertion that reports; the other three are context and must
> not be mistaken for guards.**

**A4 — the during-render clause, stated ONCE over the whole `GameHistory` graph.**

> **[WRITTEN 2026-08-12 by BA/PM at `refinement-ABC-028-a4` (Workflow 07), on an instrument QE BUILT,
> ARMED, COSTED and BOUNDED at `quality-gate-ABC-028-instrument`.** The prior text of this criterion
> was an **absolute** — *"no reachable slot differs at any point during the render"* — and it is
> replaced rather than extended, because **no instrument can hold that absolute for a synchronous
> callee.** The property below is what was actually measured; the one thing it does not cover is named
> as `RISK-ABC028-01` at the foot of this criterion rather than left for the fifth repair to find.
> **This criterion is written to be FAILABLE, not to be comprehensive.**]

**Given** any of `ABC-017` `A1`'s ten lengths — the **shared** `LENGTH_CASES` at
`src/history-pane.test.ts:139-154`, deliberately **not** freshly-built objects: `A4` asserts a
property of **its own** render, so `D23`'s rendered-too-early hazard does not reach it, and a rebuild
was measured at **~9.8 ms warm / ~20.3 ms cold** per call against a **~75 ms** ticket margin —

**when** the pane renders a **recording view** of the supplied `GameHistory` rather than the object
itself — an instrument that is **live across the interval**, not the before/after pair `D26` already
established cannot express this property —

**then all four of these hold at EVERY one of the ten lengths:**

1. **Zero writes recorded.** Every write reaching the supplied graph ~~through the reference the pane
   was handed~~ **through a reference the instrument WRAPPED** is reported **at the instant it
   happens** — so a mutation restored before the render returns is still on the record — and the
   reported-write count is **exactly `0`**.
   > **[CLAUSE 1's STATED PROPERTY WAS FALSE AND IS CORRECTED — 2026-08-12 by BA/PM at
   > `refinement-ABC-028-qe-gaps`, `G2`, RE-MEASURED ON THIS TIP WITH A CALIBRATION CONTROL.]**
   >
   > *"the reference the pane was handed"* was **falsified by measurement, not merely found narrow.**
   > Two builds do the **identical wrong thing to the identical slot** — write `position.fullmoveNumber`
   > mid-render and restore it:
   >
   > ```
   > build      how it reaches position          render digest      delivered suite (750)
   > WPOSMID    through the handed reference     c9faa3ec…  same    1 failed / 750   <- DIES at A4
   > WPOSRAW    Object.getOwnPropertyDescriptor  c9faa3ec…  same    750 passed       <- SURVIVES
   >            (history,"position").value
   > ```
   >
   > **One line of standard reflection on the handed reference yields the RAW node**, and `WPOSRAW`'s
   > write does reach the supplied graph, through the reference the pane was given, and **is not
   > reported.** `WPOSMID` dying in the same session is the calibration that makes this a measurement
   > rather than an assertion.
   >
   > **THE MECHANISM IS THE INSTRUMENT'S OWN `getOwnPropertyDescriptor` TRAP** at
   > `src/history-pane.test.ts:741-744`, read at source at this hop: it samples, then returns
   > `Reflect.getOwnPropertyDescriptor(target, property)` **verbatim**, and a descriptor's `.value` is
   > the raw child. **The `get` trap wraps children; the descriptor trap does not. A trap added to
   > WIDEN coverage is the one that hands out the escape** — note the shape, it is this family's
   > signature.
   >
   > **WHAT DOES NOT MOVE, and it is most of the criterion.** All four clauses' **obligations** are
   > **MET** and were re-verified: zero reported writes, the 128-byte digest at every access, the
   > sample counter `> 0` at all ten lengths, the tripwire, **eight** arming slots, the positive
   > control. **`A4` is MET. What was wrong is the PROPERTY the criterion claimed to establish, not
   > the measurements it takes** — which is this ticket's own thesis for the sixteenth time.
   >
   > **THE INSTRUMENT IS NOT CHANGED BY THIS CORRECTION, and that is deliberate.** `A4` says *"the
   > mechanism is the Engineer's"*. The escape IS closable — see `RISK-ABC028-01b`, where it is
   > **named, priced as unpriced, and given an owner** rather than quietly mandated here. **Growing a
   > green criterion's instrument in a text hop is the smoothing move wearing the opposite coat.**
2. **The board's 128 bytes never differ at a sampling point.** `position.board` is re-compared
   against its entry state at **every** access the pane makes through the view, and no sample differs.
3. **The instrument LOOKED — the sample counter is `> 0` at every one of the ten lengths.** This is an
   assertion, not a hope: without it, **a pane the instrument cannot see is indistinguishable from a
   pane that mutates nothing**, which is the failure this ticket's parent shipped once and the exact
   shape `D27` bars.
4. **The instrument changes no rendered byte.** Rendering through the view produces output identical
   to rendering the bare object — checked at **ONE** length (20 plies, the length every other clause
   of this file already uses). Ten lengths were checked out of tree and cost **~14 ms** of the margin
   for no additional information; one length is what the lane pays for.

**and it is ARMED PER SLOT, NOT IN AGGREGATE** — so a hole in one slot cannot hide behind another.
A control writes to each slot below through the handed-out view and the instrument **must report it**;
measured, each does:

| # | a control writes to … | reported by |
|---|---|---|
| 1 | `initialFen` | write trap |
| 2 | `position.fullmoveNumber` | write trap |
| 3 | `position.blackToMove` | write trap |
| 4 | a `position.board` **element** | write trap **and** board digest |
| 5 | `position.board` **through `.buffer`** | board digest |
| 6 | the `moves` **slot** | write trap |
| 7 | the `moves` **contents** | write trap |
| 8 | a `Move`'s **own field** | write trap |

**and the POSITIVE control**: a run that mutates nothing reports **nothing** — and still samples
`> 0`. An instrument that cries on a clean render is as worthless as one that cannot look.

> **The aggregate form is the thing this ticket family got wrong once.** `A4`'s previous text asked
> for *"a control"*, singular. **Per-slot is the only version that would have caught the pre-fix bug in
> QE's own instrument** — a board mutation by TypedArray method threw `TypeError: this is not a typed
> array` and recorded **ZERO** violations, i.e. *"instrument broken"* announced where the truth was
> *"property violated"*, which is the `ABC-017` fixtures-hop failure shape exactly. **The arming
> controls MUST use FRESH fixtures**, not `LENGTH_CASES`: controls 2, 4, 7 and 8 do not restore, and a
> shared object makes the next assertion's baseline the previous control's damage. **QE's own harness
> produced one false clean this way and it is recorded here so the test does not.**

**The builds this criterion must kill, with the verdict each was measured at — all ten lengths, all
run, none reasoned:**

| slot | wrong build | today (delivered suite) | under `A4` |
|---|---|---|---|
| `initialFen` | `WFENMID` — rewritten mid-render, restored before return | survives 744/744 | **RED** (write trap) |
| `position`'s scalars (`fullmoveNumber`, `blackToMove`) | `WPOSMID` | survives 744/744 | **RED** (write trap) |
| `position.board` — a `Uint8Array` | `WBOARDMID` | survives 744/744 | **RED** (write trap **and** digest) |
| the `moves` property **binding** (not its contents) | `WMOVESWAP` — swaps the slot to a copy and back | survives 744/744 | **RED** (write trap) |
| the `moves` **contents** | `WSPLICE` — **already dead** on `A9`'s freeze | dies on `A9` | **RED** — and it must STAY dead |
| `position.board` by TypedArray **method** | `WBOARDSET` — `board.set(…)` | **survives 744/744** | **RED** (digest) |
| `position.board` through an **`ArrayBuffer` alias** | `WBOARDBUF` | **survives 744/744** | **RED** (digest) |
| — | `WCLEAN`, the delivered pane | 744/744 | **GREEN**, and the counter is non-zero at all ten lengths |

**`WBOARDSET` and `WBOARDBUF` are NEW to this ticket** — QE constructed them, and they are named here
because they are **the two shapes that would have made a write-trap-only instrument a false green**.
Both survive the delivered suite today.

**Lane, and what "RED" means concretely:** on each wrong build the full suite reports **exactly one**
failure and it is this criterion — ~~`1 failed, 747 passed` against `748 passed (748)`~~ **`1 failed,
749 passed` against `750 passed (750)`** on the delivered pane, `tsc` **0**, `biome` clean, **26
files**, skip **0**. **It fails ZERO pre-existing tests.**

> **[FIGURES CORRECTED 2026-08-12 by BA/PM at `refinement-ABC-028-a2`, on the build hop's
> measurement.]** The old numbers were **QE's `A4`-ONLY** figures: `A4` is four `it`s, so the lane
> read `744 + 4 = 748`. **This ticket lands `A1` and `A3` as well — SIX `it`s, not four — so the
> lane is `744 + 6 = 750`.** Both figures were correct for what they measured; the ticket carried
> the narrower one after its own scope had grown, which is how a stale number goes false without
> anybody writing anything untrue. **THE SHAPE THIS CRITERION ASSERTS IS UNCHANGED AND WAS RE-RUN:
> exactly one failure, it is this criterion, and zero pre-existing tests break — verified on all six
> `A4` builds.**
>
> **TWO BUILDS DO NOT PRODUCE EXACTLY ONE FAILURE, and that is a property of the delivered tree
> rather than of this criterion.** `WCACHE-LEN` reports **3 failed / 747** and naive `WCACHE`
> **4 failed / 746**, because each also trips the two pre-existing `A11` `toSan` count assertions —
> the same fact the header table's correction rules on. **Neither is an `A4` build**; both are
> `A1`'s, and `A1` is the failure that matters on them.

**Coverage this criterion gets at no extra cost, and states deliberately:** the same property covers
`position.castling`, `position.epSquare`, `position.halfmoveClock` and **every field of every `Move`**
— slots no table above names. **That is what `## Test notes` 1 asked for: the property stated ONCE
over the graph instead of once per node.** A per-slot restatement is what guarantees the fifth repair.

### `RISK-ABC028-01` — the one build that survives `A4`, named here rather than discovered later

**`WBOARDBLIND` SURVIVES and is accepted.** It mutates `position.board` through an `ArrayBuffer` alias
and reverts it **with no intervening access to the graph**, so no sample falls inside the window in
which the board differs. Measured: `clean` at all ten lengths, ~~`748 passed (748)`~~ **`750 passed
(750)`** on the lane — it is invisible to this instrument and to the delivered suite alike.

> ### **[WIDENED 2026-08-12 by BA/PM at `refinement-ABC-028-a2` — AND THE WIDENING CAME FROM THIS RISK'S OWN STANDING OBLIGATION, WHICH IS THE POINT.]**
>
> **The standing re-run below ACTUALLY RAN.** The build hop changed the instrument (it samples on
> **write** traps as well as reads, and adds a `getOwnPropertyDescriptor` trap), so the obligation
> fired. **Verdict unchanged and re-measured: `WBOARDBLIND` still survives — `clean` at all ten
> lengths, `750 passed (750)`.** A standing obligation that fires, runs and reports is worth more
> than one that is merely written down, and this is the first time this one has been exercised.
>
> **THE HOLE IS BROADER THAN THE WORDING NAMES.** Stressing the instrument beyond this ticket's eight
> arming slots reproduced the same silence with a **`DataView` over `board.buffer`**, mutated and
> restored with no intervening graph access. **Same class, different mechanism.** The
> `ArrayBuffer`-alias wording named **one witness and read as if it named the class.**
>
> **THE HONEST STATEMENT OF THE HOLE IS THEREFORE: *any buffer-level write reverted before the next
> sampling point*** — not *"a `Uint8Array` alias"*, not *"an `ArrayBuffer` alias"*. `WBOARDBLIND` and
> the `DataView` shape are **two witnesses to one class**, and any future witness of that class is
> already inside this risk rather than a new discovery. **This is the same defect shape `## Test
> notes` 1 names for `A9`: a hole described per node instead of over the class is a hole that gets
> re-found once per mechanism.** Naming the class here is what stops `RISK-ABC028-03` from being a
> `DataView` ticket.
>
> **What does NOT move:** the risk is still **accepted**, still **not closable by a better proxy**
> (the three rejected closures below stand, including the one that would have reported GREEN on a
> wrong build), and `A4`'s four clauses, eight arming slots and positive control are **unchanged**.
> **This widens the description of a known hole; it does not admit a new one.**

> ### **[WIDENED A SECOND TIME AND SPLIT IN TWO — 2026-08-12 by BA/PM at `refinement-ABC-028-qe-gaps`,
> `G3`. THE STANDING OBLIGATION FIRED AGAIN AND REPORTED AGAIN, AND THAT IS THE SECOND TIME THIS RISK
> HAS BEEN WIDENED AND STILL BEEN NARROWER THAN THE MEASUREMENT.]**
>
> ***"any buffer-level write reverted before the next sampling point"* is STILL narrower than the
> class.** Measured on this branch tip, all rendering byte-identically to the delivered pane
> (`c9faa3ec…`), against a `WPOSMID` control dying `1 / 750` in the same session:
>
> ```
> build          mechanism                                   buffer-level?  revert needed?  suite
> WBOARDSUB      board.subarray(0, 8) — a fresh view that     NO             yes            750 passed
>                never passed a trap
> WBOARDCACHED   one cached bound TypedArray mutator          NO             yes            750 passed   (QE)
> WPOSRAW        getOwnPropertyDescriptor(...).value          NO             NO             750 passed
> WMOVEFIELDRAW  the same escape, a Move's own field          NO             NO             750 passed   (QE)
> ```
>
> **`board.subarray()` is not buffer-level and never touches `.buffer` at any point.** The wording
> named a *level of the memory model* where the real class is a *provenance of the reference*. **Third
> occurrence of `## Test notes` 1's pattern inside this one risk: witness → mechanism → still not the
> class.** The fix is the same fix, applied one level up.
>
> **AND IT IS TWO STRUCTURALLY DIFFERENT HOLES DESCRIBED AS ONE.** They defeat different detectors,
> need different things to hide, and — decisively — **only one of them is unclosable.** They are split
> so that the closable one cannot keep sheltering under the unclosable one's accepted status:
>
> **`RISK-ABC028-01a` — the DIGEST escape (defeats D2), ACCEPTED, NOT CLOSABLE.** *Any write reaching
> `position.board` through a view the instrument did not wrap — `.buffer`, a `DataView` over it,
> `subarray()`, or a cached bound TypedArray mutator — **and reverted before the next sampling
> point**.* Witnesses: `WBOARDBLIND`, the `DataView` shape, `WBOARDSUB`, `WBOARDCACHED`. **The revert
> is load-bearing: without it the digest catches them.** This is the genuinely unclosable half — a
> callee is observable only where it touches instrumented state, sampling is defeatable by a short
> enough window, and **the three closures priced below stand, including the one that would report GREEN
> on a wrong build.**
>
> **`RISK-ABC028-01b` — the WRITE-TRAP escape (defeats D1), OPEN, AND IT IS CLOSABLE.** *Any write
> reaching any **non-board** slot through a raw reference **the instrument itself hands out** — today,
> `getOwnPropertyDescriptor().value`.* Witnesses: `WPOSRAW`, `WMOVEFIELDRAW`. **No revert is needed —
> it is invisible whether or not it puts the value back**, which makes it strictly worse than `01a`.
>
> **THE HONEST NEGATIVE, reported as prominently as the survivors because it is the one place the
> escape is closed:** `WMOVESRAW` — the same descriptor escape reaching the `moves` **array
> contents** — **DIES**, `1 / 750`. **Its killer is `ABC-017` `A9`'s freeze, not `A4`.** So that one
> slot is covered **by the older, narrower, per-node instrument `A4` was written to supersede.** A
> per-node instrument covering a slot the whole-graph one misses is worth writing down.
>
> **A FOURTH CLOSURE, NAMED AND EXPLICITLY *NOT* REFUSED — this is the first of the four with a
> plausible cheap implementation and it has never been priced.** Wrap the descriptor's `.value` in the
> same `wrap()` the `get` trap already uses, at `src/history-pane.test.ts:741-744`. **Unlike the three
> below, this does not report GREEN on a wrong build, does not constrain implementations, and does not
> move the criterion into another file.** *Claimed: it is not obviously refusable. **NOT** claimed:
> that it is cheap, correct, or free of lane cost — none of that has been measured, and this hop did
> not measure it.* **It is NOT mandated by `ABC-028`:** the ticket is built and green, `A4` says the
> mechanism is the Engineer's, and growing a green instrument from a text hop is out of scope here.
> **Owner: the hop that next opens `A4`'s instrument — or a ticket cut for `RISK-ABC028-01b`. This is
> the note that says it was on the table and was not taken.**
>
> **What does NOT move:** `01a` stays **accepted**; `A4`'s four clauses, eight arming slots and
> positive control are **unchanged**; **no new hole is admitted** — `WPOSRAW` and `WBOARDSUB` are
> boundary probes built after everything the ticket asked for was already dead. **Neither set is
> certified complete.**

**It is NOT one of the five builds this criterion names.** QE built it deliberately to find the
boundary, having already killed everything the ticket asked for.

**It is not closable by a better proxy, and that is a property of synchronous calls, not of this
instrument.** A callee is observable only where it touches instrumented state; `board.buffer` yields
the real buffer and a view built on it passes no trap, so `.buffer` aliasing is detectable only by
**sampling**, and sampling is defeatable by a short enough window. **Three closures were considered
and rejected:**

- **Return a copied `ArrayBuffer` from the `buffer` getter** — makes the wrong build **invisible while
  reporting green**. *A false negative is strictly worse than a stated limit*, and this ticket exists
  because of criteria that claimed more than their instrument could see.
- **Flag any read of `.buffer` during a render** — over-strict: it fires on a legitimate build that
  reads the board, and the criterion would then constrain **implementations** rather than behaviour.
- **`vi.mock` `makeMove` / `toSan` to add sampling points inside the loop** — adds points, closes
  nothing (any two points leave a gap), and moves the criterion into `src/history-pane.nfr.test.ts`,
  which `## Scope` forbids.

**Standing obligation:** any future change to `A4`'s instrument **re-runs `WBOARDBLIND`** and updates
this record. **[EXTENDED 2026-08-12 at `refinement-ABC-028-a2`: it re-runs the `DataView`-over-
`board.buffer` witness too, because one witness of a class does not test the class** — that is what
this hop's widening cost, and re-running only `WBOARDBLIND` would re-learn it.**]** If a cheap
closure is ever found, this is the risk it closes. ~~**Until then the honest statement of the property
is *"every write that reaches the supplied graph through the reference the pane is given is reported,
and the board's contents are sampled at every access"* — not *"nothing can differ"*.**~~

> **[EXTENDED AGAIN AND THE CLOSING STATEMENT CORRECTED — 2026-08-12 at `refinement-ABC-028-qe-gaps`.]**
> The standing re-run now covers **four** witnesses, not two: `WBOARDBLIND`, the `DataView` shape,
> **`WBOARDSUB`** and **`WBOARDCACHED`** for `01a`, and **`WPOSRAW`** + **`WMOVEFIELDRAW`** for `01b`.
> **`WMOVESRAW` re-runs too and must STAY DEAD** — it is the honest negative, and its killer is
> `A9`'s freeze, so it is the one that would break if a hop ever relaxed that freeze.
>
> **THE CORRECTED HONEST STATEMENT OF THE PROPERTY** — the old one is struck because it is the exact
> sentence `G2` falsified:
>
> > **Every write that reaches the supplied graph through a reference the instrument WRAPPED is
> > reported at the instant it happens, and the board's contents are sampled at every access the pane
> > makes through the view.** A raw reference the instrument itself hands out —
> > `getOwnPropertyDescriptor().value`, `board.buffer`, `board.subarray()`, a bound TypedArray
> > mutator — is **outside** it.
>
> Not *"nothing can differ"*, and **not** *"through the reference the pane is given"* either.

> ***Why `Object.freeze` is NOT the instrument — CORRECTED 2026-08-12 at this hop.*** *Measured twice,
> independently, at the cutting hop and again by QE: **`Object.freeze` throws
> `TypeError: Cannot freeze array buffer views with elements` on a `Uint8Array` of ANY non-empty
> length**, so `position.board` is not merely uncovered by `A9`'s instrument — it is **uncoverable by
> that instrument's kind**. And freezing `history.moves` leaves the **slot writable**
> (`{writable: true, enumerable: true, configurable: true}`): reassigning `history.moves` after the
> freeze **succeeds**, which is `WMOVESWAP` mechanically.*
>
> ***THE NUMBER IN THE EARLIER TEXT WAS WRONG AND IS FIXED HERE.*** *This ticket, the board row and the
> traceability row all said `Object.freeze(new Uint8Array(8))`. **The real board is
> `new Uint8Array(128)` — `src/position.ts:76`, read at source at this hop** (`0x88` board, 128 bytes,
> not 8). **The conclusion does not move**: freeze throws at `1`, `8` and `128` alike and returns
> without throwing only at `0`, where there are no indexed elements. `## Test notes` 4 is the rule that
> says to check, and it was applied to this ticket's own text.*

> **The worked implementation is an EXISTENCE PROOF, NOT A MANDATE.** QE's `~125` lines
> (`.grugops/context/quality-gate-ABC-028-instrument/artifacts/a4-instrument-and-criterion.ts.txt`) are
> the exact text that produced every verdict above and they are reproducible, not a design ruling.
> **The mechanism is the Engineer's.** Any instrument satisfying the four clauses, the eight arming
> controls and the positive control discharges this criterion. **The shape below is adopted as the
> criterion's evidence, not as its implementation** — but a different mechanism owes the same
> measurements, including `WBOARDSET` and `WBOARDBUF`.

**A5 — freshness across a length-preserving edit that PRESERVES THE LAST MOVE'S IDENTITY. Stated over
the AXIS, not over one witness.**

> **[ADDED 2026-08-12 by BA/PM at `refinement-ABC-028-qe-gaps` (Workflow 07), on QE's `G1`. THIS IS
> THE ONE GAP OF THE SIX THAT IS NOT TEXT.** QE proposed a one-sentence reword and explicitly did not
> recommend re-opening the build. **I am overruling that, and the reason is this ticket's own
> `## Test notes` 1.** Rewording the three sites makes the RECORD honest; it does not make the TREE
> safe. After the reword, the project's only guard against the next cache in the family is still an
> **accidental `toSan` call count in another file**, through the same mechanism, in the same file,
> that `RISK-ABC017-01` was cut to remove. **`A1` replaced the accident for ONE witness and left the
> accident load-bearing for the next.** Ruling *"reword only"* would do to `A1` exactly what four hops
> did to `A9`: describe the hole per witness and guarantee the next repair. **THIS CRITERION IS THE
> ENGINEER'S AND THE TICKET HOLDS AT `In Development`.**]

**Given** the black-to-move anchor `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 27` carried
to **21 plies** by the knight cycle — **its OWN object**, a third call to the builder, sharing nothing
with `A1`'s or `A3`'s fixtures (`## Test notes` 3) —

**when** the caller **saves the last `Move` object** (`history.moves[20]`, `Nb8-c6`), the pane renders,
the caller then calls `takeBack(history, 2)`, plays a **different** ply 19 (`c3e4` instead of `c3b1`),
**re-plays the SAVED `Move` object** — which is still legal — and the pane renders **the same
`GameHistory` object** a second time,

**then** the two panes **DIFFER** — the last row moves from `37. Nb1 Nc6` to `37. Ne4 Nc6` — while
**both** of these hold at **both** renders: `history.moves.length` is **21**, and
`history.moves[20] === ` the saved object is **`true`**.

*Witnessed at this hop against the delivered pane on this branch tip, out of tree, through the public
API only (`newGame` / `legalMoves` / `playMove` / `takeBack` — no redo stack, no `EPIC-006` code):*

```
                                   delivered pane          WCACHE-LAST
moves.length      before / after   21 / 21                 21 / 21
last move identity preserved       true                    true
render 1 last row                  "  37. Nb1     Nc6 "    "  37. Nb1     Nc6 "
render 2 last row                  "  37. Ne4     Nc6 "    "  37. Nb1     Nc6 "   <- STALE
panes differ                       TRUE                    FALSE
```

**The identity is preserved because `playMove` pushes the caller's object VERBATIM** —
`moveListOf(history).push(move)` at `src/history.ts:85-88`, read at source at this hop. **That is not
an exotic path: it is what any redo stack does**, and `EPIC-006` owns undo — the same consumer `A1`'s
`## Dependencies` bullet already names.

**Kills `WCACHE-LAST`** — a pane memoising rows per `GameHistory`, invalidated when **either**
`moves.length` **or the identity of the last move** changes. **It is the fix an engineer writes the
moment `A1` catches `WCACHE-LEN`**: `A1` teaches *"the caller took a move back and played a different
one"*, and *"key on the last move as well"* is the obvious response.

**Measured on THIS branch tip, every cell run, with a calibration control:**

```
configuration                                          WCACHE-LAST    what kills it
delivered tree (26 files)                              2 failed/750   A11 x2 — the SHARING, and NOTHING else
(a) src/history-pane.test.ts ALONE, nfr not loaded     24 passed      NOTHING — A1, A3, A4 all silent
(b) nfr :121+ fixtures rebuilt per test                750 passed     NOTHING — the guard is GONE
render digest, 12 fixtures                             c9faa3ec869bc4d272ca9eff0403e078 — IDENTICAL
control: WPOSMID on the same harness                   1 failed/750   A4 — the harness is calibrated
```

**Neither `ABC-017` `A14` nor `ABC-028` `A1` can fail on it, and the reason is structural rather than
accidental:** `A14`'s key moves because it **appends**; `A1`'s key moves because take-back-and-play-a-
**different**-move produces a **fresh `Move` object**. **`A5`'s edit moves neither key.**

**Lane, and what RED means concretely:** on `WCACHE-LAST` the full suite must report a failure **in
`src/history-pane.test.ts`** — not only the two pre-existing `A11` counts. Today it reports
`2 failed / 750` and **both are in the nfr file**; with `A5` landed the count rises and **at least one
kill is in the file that owns the property.** On the **delivered** pane `A5` is **GREEN**, and in
configuration (a) — `src/history-pane.test.ts` alone — `A5` **still kills `WCACHE-LAST`**, which is the
whole point: *the guard stops being an accident in another file.*

> **THE CLASS, STATED — AND WHAT THIS CRITERION DOES *NOT* CLOSE. READ THIS BEFORE WRITING THE TEST.**
>
> **`A1` and `A5` are two points on ONE axis**, not two unrelated criteria: *a length-preserving edit
> whose cache key does not move.* `A1` pins the axis where the **last move's identity changes**; `A5`
> pins it where the **last move's identity is preserved and an earlier ply changes**.
>
> **The class is: ANY cache keyed on a PROPER SUBSET of the move list.** `WCACHE` (no key) dies at
> `A14`. `WCACHE-LEN` (length) dies at `A1`. `WCACHE-LAST` (length + last identity) dies at `A5`.
>
> **`A5` DOES NOT CERTIFY THE CLASS CLOSED, and saying so is the entire lesson of this page.**
> `WCACHE-LAST2` — keyed on length plus the last **two** identities — **survives `A5`**, because `A5`'s
> edit changes ply 19. **It is named here so it is inside the record rather than a future discovery.**
> It is recorded as **`RISK-ABC028-03`** below.
>
> **THEREFORE: WRITE `A5` AS A TABLE OVER EDIT SHAPES, NOT AS A SINGLE FIXTURE.** One `it.each`-style
> row per shape, each row a **fresh** fixture. **Closing a future member of the class must be a NEW ROW,
> never a new criterion** — a per-witness criterion is what `## Test notes` 1 forbids and what `A9` paid
> for four times. **The row is the unit of extension. That is the whole design of this criterion.**
>
> **Minimum ONE row at landing** — the shape measured above. A second row is welcome and not required;
> **do not invent a row whose expected value nobody ran** (`## Test notes` 4).

> **AND `A5` DOES NOT REPLACE `A1`.** `A1` is landed, green, and does exactly what it says.
> `## Test notes` 2 forbids folding it into `A14` and **this criterion does not disturb it either** —
> two diagnoses, two verdicts. **`A5` is a sibling of `A1`, not a supersession of it.**

**and — THE COMMENT HALF, which `A2` owns and which is NOT discharged.** The comment at
`src/history-pane.nfr.test.ts:103-120` is left saying **only what is true**, which today it does not, at
**three** places measured at this hop:

| line | what it says now | why it is false / stale |
|---|---|---|
| **`:118-120`** | *"With `A1` landed the cache dies in `src/history-pane.test.ts` **either way**, so rebuilding these per test would **no longer lose a guard**"* | **FALSE for the class.** Rebuild them and `WCACHE-LAST` goes `2 failed` → **`750 passed`**. A guard is lost. This is the sentence QE said it would not carry |
| **`:106-108`** | *"a reader looking for the guard against **a memoising pane** finds it there, with this file not loaded at all"* | **FALSE for the class.** With this file not loaded, `WCACHE-LAST` passes **`24 / 24`**. QE did not name this one; it does the same job twelve lines above |
| **`:112`** | *"passes the whole suite **744/744**"* | **STALE, and not rescued by its date.** The `A2` ruling corrected `744` → `750` for this six-`it` ticket **everywhere else on this page** and missed it here. QE re-derived that cell at **`749`**. **Do not transcribe any of the three — RE-MEASURE and write what you measure** (`## Test notes` 4) |

**The repair is to the WITNESS, not the class** — *"a cache keyed on `moves.length` dies in
`src/history-pane.test.ts`"* — plus whatever `A5` makes true once it lands. **No merged ticket text is
edited.**

> **SEQUENCING — THE TWO HALVES OF `A5` GO IN DIFFERENT HOPS AND THE SPLIT IS DELIBERATE.**
> **The test half touches `src/history-pane.test.ts` ONLY** — the file `ABC-029` does **not** open —
> so it is buildable **immediately**. **The comment half touches `src/history-pane.nfr.test.ts`, which
> `ABC-029`'s hop is in RIGHT NOW.** `## Dependencies` says these two tickets must not run
> concurrently in that file, and that rule is not suspended for a comment. **Build the test half now;
> the comment half waits for `ABC-029` to clear the file.** The scheduling call is the
> Orchestrator's — this is the evidence for it, not the decision.

### `RISK-ABC028-03` — the next member of the cache class, named at the hop that added `A5` rather than discovered by the hop after it

**`WCACHE-LAST2` — a pane keyed on `moves.length` plus the identities of the last TWO moves — survives
`A5`**, because `A5`'s edit changes ply 19. **NOT MEASURED at this hop: it was derived from `A5`'s own
fixture and is recorded as a prediction, not as a verdict.** `UNKNOWN - verify` until somebody runs it.

**It is accepted, and the reason is that it is contrived where its predecessors were natural.** `WCACHE`
is what a careless engineer writes; `WCACHE-LEN` is what a **competent** one writes; `WCACHE-LAST` is
what a competent one writes **after `A1` fails**. **Nobody keys a cache on "the last two moves."** Each
step up the axis buys a strictly less plausible build.

**What this risk exists to prevent is a SIXTH criterion.** If `WCACHE-LAST2` or any successor is ever
measured live, **it is closed by a new ROW in `A5`'s table** — not by `A6`. **Owner: whoever measures
one.** No date: latent, and recorded as latent.

## Dependencies

- **`ABC-017` is merged.** Nothing here is blocked by it, and nothing here may edit it.
- **`ABC-029` shares one file with this ticket** — `src/history-pane.nfr.test.ts`. **They must not run
  concurrently in two worktrees.** ~~Either order works; the second to land rebases.~~ **CORRECTED
  2026-08-11 by BA/PM at `refinement-ABC-019-a11`: the order is now DECIDED — THIS TICKET FIRST.**
  `ABC-029` is now the hop that edits that file (it repairs the two guards `ABC-019` turned red), so
  it is *"the next hop into the file"* the bullet below names. With `A2` landed first the false
  sentence becomes **true** and no merged text is edited by anyone; with `ABC-029` first, the
  conditional at the foot of this section fires. This is the one reason `INVEST`'s *independent* is
  recorded ⚠️ rather than ✅.
  > **[SEQUENCING EVIDENCE, 2026-08-12 by BA/PM at `refinement-ABC-028-a4` — A FLAG, NOT A DECISION.
  > THE ORDER RECORDED ABOVE IS UNCHANGED BY THIS BLOCK.]** With all four criteria now written, the
  > question *"does this ticket's build hop open `src/history-pane.nfr.test.ts` at all?"* is answerable
  > file by file and criterion by criterion. **It is answerable YES, and here is exactly where.**
  >
  > | criterion | file(s) its build hop opens | opens the shared file? |
  > |---|---|---|
  > | `A1` | `src/history-pane.test.ts` — one fixture pair + assertions | **no** |
  > | `A2` | **`src/history-pane.nfr.test.ts`** + `src/history-pane.test.ts` | **YES — see below** |
  > | `A3` | `src/history-pane.test.ts` — one fixture + assertions | **no** |
  > | `A4` | `src/history-pane.test.ts` — instrument + four `it`s | **no — MEASURED, not assumed** |
  >
  > **`A4` is measured clean and that is the new fact.** QE built and ran the whole criterion as an
  > append to `src/history-pane.test.ts`: **no new file, no new module, no new dependency, file count
  > stays 26**, and `src/history-pane.nfr.test.ts` was **never opened**. Its `Given` is `LENGTH_CASES`,
  > defined in the **same** file at `src/history-pane.test.ts:139-154`, so it imports nothing from the
  > shared file either. **`A4` does not re-open what `A2` closes.**
  >
  > **`A2` touches it, at ONE region, and the region is the trap.** Read at source this hop:
  > - the comment block is **`:103-112`**, its load-bearing false sentence **`:106-112`**, and the
  >   `AT_0`…`AT_2000` module-scope fixtures begin at **`:113`** — exactly as `A2` states;
  > - **the fixture rebuild is NOT required** — `## Out of scope` says `A2` *"establishes that it may be
  >   done; it does not ask for it"*, and `A2`'s **preferred** form measures the property by running
  >   `npx vitest run src/history-pane.test.ts` **alone with this file not loaded at all**, which opens
  >   zero lines of it;
  > - **what remains is the comment.** `A2`'s own blockquote requires it *"left saying only what is true
  >   of it — including that the property is now owned in `src/history-pane.test.ts`"*. That sentence is
  >   **not in the comment today**, so discharging `A2` as written is an **EDIT to `:104-112`** — and
  >   `RISK-ABC017-01`'s trigger *"is the EDIT, not the READ"*. **This ticket's own `A2` is therefore the
  >   first hop scheduled to edit the trap lines** — which is intended (it is what makes the sentence
  >   true), but it means the shared-file touch is real and not eliminable by re-reading the scope.
  >
  > **Two facts offered without the conclusion drawn, because the conclusion is the Orchestrator's.**
  > (i) The two tickets' regions in this file are **disjoint**: `ABC-028` `A2` at `:104-112` (a comment),
  > `ABC-029`'s build at `A11`'s two structural guards **~120 lines below**. (ii) The ordering rule above
  > is **semantic, not merely mechanical** — with `A1` landed first the false sentence becomes true and
  > no merged text needs correcting; with `ABC-029` first, the three-site conditional at the foot of this
  > section fires. **Disjoint regions do not by themselves make concurrent worktrees safe, and this hop
  > does not claim they do.**
- **`ABC-019` is in flight and is the next hop into `src/history-pane.nfr.test.ts`.** That is this
  ticket's trigger and its interim exposure: **until `A1`/`A2` land, the comment at `:106-112` is a
  live invitation to delete the sole catcher for `WCACHE-LEN`.** The Orchestrator has put the hazard
  into `ABC-019`'s brief; **a brief is transient and the comment is permanent**, which is why this is
  `P1`.
  > **[UPDATED 2026-08-11 by BA/PM at `refinement-ABC-019-a11` — THE TRIGGER FIRED, THE HOP DECLINED,
  > AND THE OWED CORRECTION DID NOT FALL DUE.]** `ABC-019`'s rebase turned `A11`'s two structural
  > guards RED, so that hop **did** open this file. It **read** the comment at `:106-112` and **did
  > not act on it**: no fixture was rebuilt, no line of `src/history-pane.nfr.test.ts` was written,
  > and the ruling it produced requires nobody to touch those fixtures. **The trigger this risk names
  > is the EDIT, not the READ** — a comment saying *"these may be rebuilt freely"* is only dangerous
  > to someone who acts on it — so the conditional below **has not fired**. It fires at **`ABC-029`'s
  > BUILD hop**, which edits the two guards ~120 lines below the comment. **That is the hop this
  > ticket must land before.** The brief was transient exactly as this bullet predicted and the
  > comment is still there; what changed is that the next reader is now a **named ticket** rather than
  > *"whoever comes next"*, which is the first time this hazard has had a schedulable owner.
- **`EPIC-006` owns `undo`** and is the consumer that makes `A1`'s path a product path rather than a
  test path.
- **Not dependent on `ABC-010`.** `AR-1`'s width and compute path is ruled separately and is neither
  this ticket's nor `ABC-029`'s.

> **The one conditional this ticket carries, stated with an owner rather than left implicit.** If this
> ticket is **not** scheduled before the next hop opens `src/history-pane.nfr.test.ts`, then
> `RISK-ABC017-01`'s text half needs the correction after all — the false sentence lives at **three
> sites** (`ABC-017`'s amendment header, `ABC-017`'s `A14` block, and
> `src/history-pane.nfr.test.ts:106-112`), and `ABC-016`'s `R1`/`D27` is the precedent for what
> happens when a repair is audited at the site it names rather than every site it points at.
> **Owner: BA/PM, who authored the sentence. Not this hop's, and not the Engineer's.**

## Security / NFR triggers

- **`NFR-008` / `N8-LANE` — and this is the one with a live margin, not a formality.** The lane's
  running total is **~575 ms of the 650 ms content allowance (~88%)** after `ABC-017`'s fixture hop,
  of which **~102 ms is the `RF-1` child process**. **Measurable target: this ticket's delta, measured
  by `N8-LANE`'s own method — CPU (user + sys), median of paired per-round deltas, n ≥ 7 interleaved
  rounds, with a null control by identity — must leave the total ≤ 650 ms**, and `ADR-0008`'s ratified
  clauses must still hold: `npm test` with `PERFT_DEEP` unset ≤ **3 s wall** and ≤ **13 s CPU**.
  **File count must stay TWO** — no new test file — so the ~320 ms floor allowance does not move.
  > **The margin is ~75 ms and TWO tickets are competing for it.** `ABC-029` touches the ~102 ms item.
  > **If both land without measuring, the bar is plausibly breached, and the ticket that lands second
  > pays.** Whichever lands second must re-measure the total, not its own delta alone. `ABC-026` owns
  > the lane total and is the escalation route if it breaks. **No bar is re-derived by this ticket.**
  > **[`A4`'s DELTA MEASURED 2026-08-12 at `quality-gate-ABC-028-instrument`, recorded here with the
  > three limits that travel with it.]** `A4`'s criterion costs **−21.9 ms** median CPU at sign
  > **3/8**, against an **identity null control reading −71.0 ms at 3/8 in the same session** — i.e.
  > **below `N8-LANE`'s own resolution**. *Claimed: no cost is demonstrable at n = 8 on that machine.
  > NOT claimed: zero.* `ADR-0008`'s ratified clauses re-run and hold with room (`laneD` **1.69–1.74 s**
  > wall against ≤ 3 s, **8.93–8.99 s** CPU against ≤ 13 s), file count **TWO**, so the ~320 ms floor
  > allowance does not move and the 160 ms-per-added-file subtraction does not apply. **The three limits,
  > because a figure that travels without them has already produced a defect on this pane twice:**
  > **(1)** it is `A4`'s criterion **ALONE** — `A1`, `A2` and `A3` add their own and are not in it, while
  > the ~75 ms margin is for the **whole** ticket; **(2)** it is a **DELTA**, and the ticket's own rule
  > stands unchanged — whichever of `ABC-028` / `ABC-029` lands second **re-measures the TOTAL**;
  > **(3)** it was measured on the **16-file** tree (`../cli-chess-ABC-029`, no `src/turn-loop.ts`) and
  > is **`UNKNOWN - verify` on `ABC-019`'s 17-file tip**. **A one-file tree difference produced a real
  > defect two hops ago.** Machine for every figure: Apple M3 (`Mac15,13`), 8 cores, macOS 26.5.2, node
  > `v24.12.0`, vitest `3.2.7` — `UNKNOWN - verify` on any other. **The rejected first shape is recorded
  > because it is the finding:** four `it`s with two fixture rebuilds and the distortion check at ten
  > lengths cost **+252.7 ms at 8/8 positive — 3.4x the whole remaining margin.** It was rejected on the
  > measurement, not on appearance, and the shape `A4` now specifies is what remains after it.
- **`NFR-002` — untouched, and this ticket must not touch it.** Its `O(window)` structural premise is
  about production runtime importers, measured **ZERO** by module-graph closure. This ticket adds
  **zero production lines** and imports nothing new into `src/history-pane.ts`. The 150 µs pane bar,
  the 3x ratio and the `< 16 ms` frame target are all untouched.
- **Security: NONE, and it is not pre-waived.** Test-only, zero production lines, no new dependency
  (`package.json` `dependencies` is `{}`), no input reaches the process from outside it. **Firing
  threshold, so this is falsifiable rather than a shrug: any production line at all, or any new
  file.** Either means the ticket has changed shape and Security/NFR is owed a look.
- **Skip count must be `0`** and `quality.gate_enforcement` is `blocking` — a criterion that cannot be
  satisfied is left **failing or unwritten**, never skipped. `ABC-019`'s `A20` is the precedent.

## Test notes

1. **`A9` HAS BEEN REPAIRED THREE TIMES AND THE PATTERN NEEDS NAMING — this is the note that is
   supposed to end the series.** `D10`/`D11` moved a snapshot taken too late; `D23` moved fixtures
   rendered too early; `D26` changed the *kind* of measurement from a point-pair to an interval
   instrument. The Engineer's own reading was that a fourth would not arrive because the kind had
   changed. **He was right about the kind and wrong about the coverage**, and the honest name for the
   pattern is not *"`A9` keeps being wrong"* — it is: **`A9`'s subject is an OBJECT GRAPH, and it has
   been repaired once per node of that graph.** `GameHistory` is `{ initialFen, moves, position }` and
   `position` carries a `Uint8Array`. Four repairs, four slots. **The pattern predicts the fifth
   repair exactly: whichever slot the instrument does not reach.** That is why `A4` above is written
   **once over the whole graph** instead of as three more clauses — a per-slot repair is what
   guarantees a fifth.
2. **Do not put `A1` inside `A14`.** `A14` is discharged on a `Done` ticket and does not move; more to
   the point, `A14`'s object is mutated by an **append** and `A1`'s by a **length-preserving** edit.
   One test asserting both would report one verdict for two different diagnoses, which is the rule
   `## Test notes` on `ABC-017` set and this ticket inherits.
3. **`A1`'s and `A3`'s fixtures must be SEPARATE objects**, built by two calls to the 20/21-ply
   builder. `A1` plays moves on its object; a shared one would corrupt `A3` depending on test order —
   a hazard this pane has already paid for twice.
4. **Re-measure before writing an expected value.** Every number in this ticket was witnessed against
   the delivered pane at the cutting hop and is quoted with its measurement, but the standing rule on
   this pane is that **a criterion carrying a number nobody ran is how it has been wrong before.**
   Measure, then write.
5. **The `A4` instrument is the risk in this ticket, not the fixtures.** Build it and arm it before
   writing the criterion's assertions; if no instrument discriminates all five builds, **report that
   and stop** rather than writing a criterion that covers four. A criterion that cannot discriminate
   its own guard is `D27`'s defect.
6. **`A2` is a measurement, not a refactor.** It requires demonstrating that the sharing is no longer
   load-bearing. It does **not** require rebuilding those fixtures per test — measured at the
   `ABC-017` fixture hop, that costs ~9.3 ms per rebuild (6.0 ms of it the 2,000-ply shuffle) and
   buys nothing.
7. **Expect nine survivors to stay dead.** `WLEAD-A/B/C`, `WFENSET`, `WSPLICE`, `WFREEZE`, `WCACHE`,
   `WDYNIMP`, `WBAREIMP` are all killed on the merged tree. Re-run them; do not trust this list.
8. **`A9`'s freeze and `A4`'s recording view must NEVER be applied to the same object in the same
   test.** Measured: `Object.freeze(view.moves)` records **21** write-trap violations, because a freeze
   is a `defineProperty` per element plus a `preventExtensions` — the instrument correctly reports the
   *test's own* writes and the criterion goes red for the wrong reason. **They do not collide today**
   (every fixture is freshly built), but this is the first hop where both instruments live in one repo
   and the next hop into this file must know.
9. **`A4`'s ARMING controls use FRESH fixtures; `A4`'s ten-length clause uses the SHARED
   `LENGTH_CASES`.** This is not a style choice: four of the eight arming controls (`fullmoveNumber`,
   the board element, the `moves` contents, the `Move` field) **do not restore**, so a shared object
   would make the next assertion's baseline the previous control's damage. **QE's own harness produced
   a false clean exactly this way** — `fill(0)` read clean on a board an earlier probe had already
   zeroed. This is `## Test notes` 3's rule, extended to `A4`.
10. **A view's methods must be bound to the raw board, or a TypedArray-method build CRASHES instead of
    being REPORTED.** Every `%TypedArray%.prototype` method throws `TypeError: this is not a typed
    array` when `this` is a `Proxy`. Left unhandled, `WBOARDSET` announces *"instrument broken"* where
    the truth is *"property violated"* — the `ABC-017` fixtures-hop failure shape. **Equally: the write
    trap must PERFORM the write (`Reflect.set`), not block it** — blocking turns a detection into a
    crash and changes the wrong build's behaviour. Detect, pass through, report.
11. **A WHOLE-FILE md5 IS NOT A TREE IDENTITY, AND THIS TICKET WAS GATED ON A TREE IT WILL NOT MERGE
    FROM.** *Added 2026-08-12 at `refinement-ABC-028-qe-gaps`. This is the finding behind the seventh
    gap and it is a process note, not a criterion.* **Measured on this branch tip:**

    ```
    file                          this tip     QE / this ticket recorded    same?
    src/history-pane.ts           c4653c4c…    54fd4346…                    NO
    src/history-pane.nfr.test.ts  796918f3…    65f4f29a…                    NO
    src/history-pane.test.ts      110ebc0b…    110ebc0b…                    yes
    ```

    **Both stale digests are `ABC-029`'s build `b7e1226`**, which landed **after** `ABC-028`'s build and
    **before** `ABC-028`'s gate: `+1 / -1` on the pane (the `:30` comment this ticket assigned it) and
    `+146 / -43` on the nfr file (the two structural guards ~120 lines below the trap). **QE's harnesses
    hard-throw on an md5 mismatch and QE reported them running, so QE measured a tree at `ABC-028`'s own
    build commit — two commits behind this branch's tip.** *A second reading, recorded because I cannot
    enter QE's worktree to settle it: QE ran on this tip and transcribed the digests from this page. The
    harnesses' own `throw` makes that reading hard to sustain, but it is not excluded —* `UNKNOWN - verify`.

    **NO CONCLUSION MOVED, and that is measured rather than hoped.** Every consequential cell was re-run
    here on the tip: baseline `750 / 750` on 26 files, `WCACHE-LAST` `2 failed / 750`, config (a)
    `24 passed`, config (b) `750 passed`, `WPOSRAW` and `WBOARDSUB` `750 passed`, control `WPOSMID`
    `1 failed / 750`, render digest `c9faa3ec…` throughout. **The reason the finding survives the tree
    change is that the guards it depends on — the `:103-120` comment, the `:121` fixtures and both `A11`
    `toSan` counts — are byte-identical across `b7e1226`.** That was luck, not design.

    **THE LESSON: pin the REGION, not the FILE.** A whole-file digest on a file two tickets edit in
    disjoint regions goes stale on a change that does not touch what it guards, and a stale fence is
    worse than none — it fails loudly for the wrong reason and gets quoted forward. **The line map is the
    fence.** Same defect, same hop, as `## Out of scope`'s `src/history-pane.ts` md5 pin.

## Size and priority rationale

**Size `S` (2).** Three fixtures, one instrument, one measurement, in **two files that already
exist**; **zero production lines, zero new modules, zero new test files, zero new dependencies, no
architecture change.** Calibrated against this project's own band: `ABC-017` carried `S` through seven
re-derivations for *"layout and numbering over a slice of an existing list"* **including its 145-line
production module**, and its fixture hop — `A6`'s fourth anchor, two `A9` clauses, `A14` **and** a
child-process module-graph load probe — was absorbed inside that same `S`. A test-only successor to
part of that work is not larger than the whole of it. **`ABC-024` (`S`) is the closer calibration:
five criteria, named discriminating mutants, one existing file, zero production lines.**

**Not `M`.** The one thing that would move it is a production line or a criterion forcing one, and
`## Out of scope` refuses both — the delivered pane passes every criterion here today.
**`SPLIT_REQUIRED` does not apply**: the rule bites at `XL` (8) and this is 2, four sizes clear. The
useful check is the one the number cannot answer — **a split must produce two independently valuable
tickets** — and `A1`/`A2` are one property with its demonstration, while `A3` and `A4` land in the
same file, in the same hop, guarding the same module. Splitting would manufacture tickets that can
only be worked in one place by one engineer.

**Priority `P1`, and the reason is a DATE, not a severity.** Applying this project's latent/live test:

- **Not `P0`.** Nothing is broken. The delivered pane is correct on all four builds, verified by two
  gates independently, and no consumer observes any of it today.
- **Not `P2`.** `ABC-024` and `ABC-026` are the `P2` calibration and both are passive gaps waiting for
  someone to walk into them. **This one is not passive.** The merged tree carries a signed,
  measured-sounding instruction to delete the only remaining catcher for `WCACHE-LEN`, and the next
  hop into that file is **`ABC-019`, which is unblocked and last in the merge order**. The trigger is
  dated and it is now.

> **One objection, recorded rather than buried, because this ticket's parent refused this exact move
> three times.** `ABC-017` ruled — at `ADR-0009`, at `D23` and again at the gaps hop — that **letting
> a guard gap re-rank a product is the same error as letting a checklist defect do it.** That ruling
> is not breached here and the distinction is worth stating: those refusals protected the **product**
> rank of a droppable feature. **`ABC-028` is not a feature and has no product rank to distort** — it
> is a guard ticket, and a guard ticket's priority is set by its trigger date. If the Orchestrator
> judges the warning already in `ABC-019`'s brief to be sufficient mitigation, `P2` is defensible;
> **I do not take that view, because a brief expires at the end of a hop and the comment does not.**

### Size and priority RE-DERIVED 2026-08-12 by BA/PM at `refinement-ABC-028-a4` — both HOLD

**`S` (2) HOLDS, re-derived rather than carried.** `A4`'s *text* grew — one sentence became four
clauses, eight arming controls, a positive control, a tripwire and seven named builds — but **the
work shrank in risk, which is what a size prices.** The single largest unknown this ticket carried
was *"build an instrument that discriminates all five builds"*, and it is now a solved problem with a
**~125-line worked reference** that typechecks `0`, lints clean, **adds no file, no module and no
dependency**, and costs nothing measurable in the lane. The Engineer's job moved from *invent an
instrument* to *write a criterion whose shape is demonstrated*. Everything else is unchanged: **two
existing files, zero production lines, zero new modules, zero new test files, zero new dependencies,
no architecture change.** `ABC-024` (`S`) remains the closest calibration.

**The honest counterweight, stated because it nearly went the other way:** had the instrument stayed
undemonstrated, I would have argued **`M`** at this hop — an unestimated invention risk sitting in the
middle of a ticket is precisely what a size exists to price, and *"`S`, and by the way nobody knows if
the central criterion is buildable"* is the smoothing move in the size field rather than the DoR
field. It did not stay undemonstrated. **`SPLIT_REQUIRED` still does not apply** — it bites at `XL`
(8), this is 2, and the split-value test is unchanged: `A1`/`A2` are one property with its
demonstration, and `A3`/`A4` land in the same file, in the same hop, guarding the same module.

**The one condition that would move the size, named in advance:** if the Engineer's chosen instrument
needs a **new module or a new file** (the reference implementation needs neither, and `## Scope`
forbids both), or if any criterion forces a **production line**. Either fires Security/NFR's stated
threshold at the same moment, so the two re-open together or not at all.

**`P1` HOLDS, and the `P0` behind it was explicitly NOT allowed to move it.** The latent/live test is
re-applied, not inherited:

- **Not `P0`.** Nothing is broken. The delivered pane is correct on **all seven** wrong builds now
  constructed against it, `src/history-pane.ts` md5 is still `54fd4346dcc1a0060c4e66ae0149265d`, and
  no consumer observes any of it today.
- **`ABC-019` being `P0` and waiting is scheduling pressure on the queue, not severity on this
  ticket.** Priority ranks the work; it does not rank the queue behind it. **Promoting this to `P0` so
  that pulling it sooner looks justified would be the DoR-smoothing defect committed in a different
  field** — and this project has refused that four times (`ABC-024`, `ABC-026`, `ABC-029`, and this
  ticket's own first cut).
- **Not `P2`.** Unchanged: `ABC-024` and `ABC-026` are passive gaps; this one has a dated trigger, and
  the trigger is **nearer than at the cutting hop** — `ABC-029` moved `Backlog → Ready` on 2026-08-12
  and is now a **named, pullable** ticket whose build hop edits guards ~120 lines below the comment.
  The trigger did not change in kind; it acquired a schedulable owner.
- The counter-argument recorded above **stands unchanged and was not quietly dropped.**

### Size and priority RE-DERIVED 2026-08-12 by BA/PM at `refinement-ABC-028-a2` — both HOLD, and `P1`'s ORIGINAL BASIS IS DISCHARGED

**This is the first re-derivation taken AFTER the build**, so for the first time the numbers can be
checked against what the work actually cost rather than against what it was predicted to cost.

**`S` (2) HOLDS, and it is now the easiest of the three re-derivations to defend.** The build landed
at **zero production lines**, in the **two files that already existed**: `src/history-pane.test.ts`
**+365 / −0, a pure append** (the pre-existing 607 lines verified byte-identical to `HEAD`), and
`src/history-pane.nfr.test.ts` **+15 / −7, comment-only, one hunk, every changed line beginning
`//`**. **Zero new files, zero new modules, zero new imports, zero new dependencies; file count stays
26; `package.json` and `package-lock.json` byte-unchanged; `src/history-pane.ts` md5
`54fd4346dcc1a0060c4e66ae0149265d` unchanged.** The predicted shape and the delivered shape **match
item for item.** `ABC-024` (`S`) remains the closest calibration.

**And this hop's own ruling adds NO build work** — `A2` as repaired is met by what is already landed
— so nothing in the size moves on account of it.

**The honest counterweight, stated because it was genuinely live at this hop and nearly went the
other way.** Had I ruled that `A2` needs a **standing in-tree guard** — the third refused closure, a
mutant landed in-tree so `A1`'s kill is asserted directly — that is a **mutation-testing harness**,
a pattern this project has never adopted, with **unpriced lane cost on a lane whose content total is
under active dispute at `ABC-026`**. **That is an `M` at least, and it would have routed the ticket
BACK to the Engineer rather than forward to QE.** I refused it on **value** — the property is
guarded by `A1` and independent by construction — **not on size**, and the refusal is priced in
`A2`'s ruling so a later hop can overturn it on the merits rather than rediscover it.

**`SPLIT_REQUIRED` does not fire.** It bites at `XL` (8); this is 2. The split-value test is moot in
the same direction it always pointed: the work is **done**, in one hop, in two files.

**`P1` HOLDS AS RECORDED — and its ORIGINAL BASIS IS DISCHARGED, which is stated rather than
glossed.** The `P1` was derived from a **dated trigger**: the comment at
`src/history-pane.nfr.test.ts:106-112` was a live, signed, measured-sounding invitation to delete the
sole catcher for `WCACHE-LEN`, and the next hop into that file was named and imminent. **`A2` has now
edited that comment. The trap is defused, `A1` is landed, and the sharing genuinely is no longer
load-bearing. The hazard this ticket's `P1` priced is GONE — because this ticket removed it.**

- **Not `P0`.** Unchanged and re-checked: nothing is broken, the pane is correct on **all twelve**
  wrong builds now constructed against it, its md5 is unchanged, and no consumer observes any of it.
- **The `P0` waiting behind this ticket is STILL not a reason.** `ABC-019` is `P0` and `ABC-029` is
  `P1`, and both sit behind this one. **This ticket's own prior hop ruled that queue pressure is not
  severity** — *"Priority ranks the work; it does not rank the queue behind it"* — and that ruling
  binds me here in the direction it inconveniences me. **I did not use it to hold `P1`.**
- **On SEVERITY ALONE, a ticket cut TODAY for what remains would be `P2`.** The residual is
  `RISK-ABC028-02`: a latent hazard with **no date**, of exactly the shape `ABC-024` and `ABC-026`
  are the `P2` calibration for. **That is stated as the falsifiable half of this derivation.**
- **`P1` nonetheless holds, because the field no longer ranks anything that is left.** Priority
  ranks **unstarted work for pull order**, and this ticket's work is **built and green**. Re-ranking
  a built ticket downward by what it would be worth if it had not been built would mean every
  ticket's priority collapses at the moment it is delivered — inverting the board's pull order and
  stranding finished work behind unstarted work. **The remaining transitions (review, gate) are not
  priced by priority.**
- **The falsifiable statement this leaves, which is more use than a bare "`P1` holds": if this ticket
  were ever returned to `Backlog` unbuilt, it should be re-cut at `P2`, not `P1`** — because the
  dated trigger that earned the `P1` would have been discharged by `A2` on the way. If a reader
  disagrees, that is the sentence to dispute.
- The counter-argument recorded at the cut **stands unchanged and was not quietly dropped.**

### Size and priority RE-DERIVED 2026-08-12 by BA/PM at `refinement-ABC-028-qe-gaps` — `S` HOLDS on a CHANGED PREMISE, and `P1`'s ORIGINAL BASIS IS UN-DISCHARGED

**The previous two re-derivations both rested on *"nothing further must be built."* That premise is
now FALSE** — `A5` is added and the comment half of `A2` is not discharged — **so neither number is
carried; both are re-derived from the new shape.**

**`S` (2) HOLDS.** The increment `A5` adds is: **one `it` (a table with a minimum of one row), one
fresh fixture built by a third call to a builder that already exists, and assertions**, in
`src/history-pane.test.ts` — **a file that already exists, which this ticket has already appended 365
lines to** — plus a **comment-only** repair in the second existing file. **Zero production lines, zero
new modules, zero new test files, zero new dependencies, file count stays 26.** That is the same shape
as `A1`, which was absorbed inside this `S` without argument. `ABC-024` (`S`) remains the closest
calibration.

**The invention risk is ZERO, and that is measured rather than asserted — it is the fact that decided
the size.** `A5`'s entire mechanism was **run at this hop through the public API only**: `newGame`,
`legalMoves`, `playMove`, `takeBack`, a saved `Move` object, two `renderHistory` calls and a row
comparison. **No instrument, no mutant in the tree, no `EPIC-006` code, no new module.** The
discriminating assertion is the same `expect(second).not.toEqual(first)` shape `A1` already carries.
**The Engineer's job is to transcribe a measured path, not to invent one.**

**The honest counterweight, stated because it is the thing that would move the number.** Had `A5`
required a **mutant landed in-tree** so the kill is asserted directly — the third closure refused at
`A2` — that is a mutation-testing harness, a pattern this project has never adopted, with unpriced
lane cost on a total under dispute at `ABC-026`. **That is `M` at least.** It is not required: `A5`
asserts a property of the **delivered pane's own output** across two renders, and is GREEN on the
delivered pane and RED on `WCACHE-LAST` **without `WCACHE-LAST` ever entering the repository.** I
checked that by running it rather than by reasoning about it.

**`SPLIT_REQUIRED` does not fire** — it bites at `XL` (8); this is 2. The split-value test points the
same way it always has: `A1` and `A5` are **two points on one axis** and belong in one file, in one
hop, guarding one module. Splitting `A5` out would manufacture a ticket whose only content is the
second half of another ticket's criterion.

**`N8-LANE`: `A5`'s delta is `UNKNOWN - verify` and is OWED at the build hop.** This hop added **no
test, no file and no line** to the repository, so its own delta is **zero** and `ADR-0008`'s protocol
was not run. **`A5` is one `it` and will have a real cost.** The ~75 ms margin, the ≤ 650 ms content
allowance, the ≤ 3 s wall / ≤ 13 s CPU clauses, the **file count TWO** rule and the *"whichever of
`ABC-028` / `ABC-029` lands second re-measures the TOTAL"* rule are **all unchanged and all still
bind.** **No bar is re-derived here and `plans/nfr-catalog.md` was not opened.** `ABC-026` still owns
the total.

**`P1` HOLDS — and unlike last hop, it holds for its ORIGINAL reason, because that reason was never
discharged.**

**I recorded a falsifiable statement one hop ago and asked for it to be disputed. I am disputing it,
and the disputant is its author.** The statement was: *"if this ticket were ever returned to `Backlog`
unbuilt, it should be re-cut at `P2`, not `P1` — because the dated trigger that earned the `P1` would
have been discharged by `A2` on the way."* **Its premise is FALSE.** The `P1` was earned by a live,
signed, measured-sounding invitation to delete the sole catcher for a wrong build. **Measured on this
tip, that invitation is still live and still wrong**: `:118-120` says rebuilding the fixtures *"would
no longer lose a guard"*, and rebuilding them takes `WCACHE-LAST` from `2 failed` to **`750 passed`**.
**The trap was narrowed by one build. It was not defused. A ticket cut today for what remains is `P1`,
not `P2`.**

**And the trigger is NEARER than at any prior hop.** At the cut it was *"whoever comes next"*; at
`refinement-ABC-028-a4` it was a named ticket in `Ready`; **today `ABC-029`'s build has LANDED
(`b7e1226`, `+146 / -43` in that very file) and its QE hop is in the file now.** The next reader is
not scheduled — the next reader is reading.

- **Not `P0`.** Unchanged and re-checked at this hop: nothing is broken. **The delivered pane renders
  `37. Ne4 Nc6` — correct — on the exact redo path that breaks `WCACHE-LAST`**, and no consumer
  observes any of this today. The pane's production text is untouched by this ticket.
- **The `P0` waiting behind this ticket is STILL not a reason, and it now costs me something to say
  so.** `ABC-019` is `P0` and waits on this ticket; this hop **adds** work and pushes it further out.
  **That is precisely when the rule matters.** *"Priority ranks the work; it does not rank the queue
  behind it"* — this ticket's own ruling, binding me in the direction that hurts.
- **Not `P2`.** `ABC-024` and `ABC-026` are passive gaps with no date. This one has a dated trigger
  that is live **today**, on a file that is open **today**.
- The counter-argument recorded at the cut **stands unchanged and was not quietly dropped**, and QE's
  counter-argument — that `WCACHE-LAST` needs `EPIC-006`'s redo, so a reader may reasonably call `G1`
  `LOW` — **is recorded here rather than buried too.** I do not take it, for QE's own reason: **the
  hazard is not the cache, it is the sentence, and a sentence outlives a brief.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-12**. **Result: 8 of 10 clean, 1 ⚠️ and 1 ❌ — the Definition of Ready is NOT met and this
ticket stays in `Backlog`.** It is recorded item by item rather than smoothed, because a ticket that
fails the DoR belongs in `Backlog` and not in "almost ready" — the standard `ABC-024` and `ABC-026`
both set here.

- **problem clear — user, pain, value stated** ✅ — two named users (the player who takes a move back;
  the next engineer into the file), the pain measured on delivered code at this hop, and the value
  stated as the two promises the pane already makes.
- **scope and out-of-scope clear** ✅ — scope is two existing files and zero production lines;
  `## Out of scope` draws seven fences, each with an owner, including the three most tempting adjacent
  jobs (`G5`, `A11`'s scope word, tidying `A11`'s fixtures).
- **INVEST-shaped** ⚠️ — **valuable**, **estimable** (four builds already constructed and measured by
  QE; three fixtures witnessed here), **small** (`S`), **testable** for three of four criteria, and
  **negotiable**. **It is NOT fully independent**: it shares `src/history-pane.nfr.test.ts` with
  `ABC-029` and with `ABC-019`'s next hop. Recorded rather than claimed clean.
- **acceptance criteria clear, testable and measurable** ❌ — **`A1`, `A2` and `A3` meet the bar**:
  each names an exact fixture, an exact expected value witnessed at this hop, a **named discriminating
  build**, and the lane it must die in — and `A3` carries the measurement showing which of its four
  clauses is the discriminator, so it cannot be written vacuously. **`A4` does not.** Its instrument
  is undemonstrated, and measurement at this hop shows the obvious candidate is **unavailable**:
  `Object.freeze` throws on a non-empty `Uint8Array`, so `position.board` cannot be covered the way
  `moves` was. **A criterion that cannot yet discriminate its own guard is not testable** — the exact
  bar `D27` set on this family — so this is ❌ and not ⚠️. On this ticket's parent a ⚠️ was twice the
  shape a defect hid in.
- **dependencies known** ✅ — one file-sharing dependency in the direction it runs, one in-flight
  consumer, and one explicit non-dependency (`ABC-010`).
- **security/NFR triggers marked, each with a measurable target** ✅ — `N8-LANE` with a numeric
  target (**≤ 650 ms content, ≤ 3 s wall, ≤ 13 s CPU**), the measurement **method** named, the
  **~75 ms margin** stated, and the cross-ticket contention with `ABC-029` written down; security
  **not pre-waived**, with a firing threshold (**any production line, or any new file**).
- **test notes present** ✅ — seven, including the `A9` pattern this hop was asked to name and the
  vacuity warning on `A3` that a naive reading would have walked into.
- **size assigned** ✅ — `S` (2), calibrated against `ABC-017` and `ABC-024`, with `SPLIT_REQUIRED`
  checked explicitly rather than by precedent.
- **priority assigned** ✅ — `P1`, derived from a dated trigger, with the counter-argument recorded.
- **no major unresolved blocker** ✅ — nothing external blocks it. The `A4` instrument question is
  **inside** the ticket, and it is counted once, above, rather than twice.

**Route to `Ready`: one item.** Demonstrate an instrument that discriminates all five builds in `A4`,
or split `A4` off and take `A1`–`A3` alone. **That is a BA/PM call at the next refinement hop and it
is deliberately not pre-made here**, because the honest answer depends on a measurement nobody has
taken.

### DoR RE-SCORE 2026-08-12 by BA/PM at `refinement-ABC-028-a4` (Workflow 07) — item by item

**The measurement the route named was TAKEN, and it delivered. Result: 10 of 10 items MET — 9 clean
`✅` and 1 `⚠️` met-with-caveat (item 3). THE DEFINITION OF READY IS MET.**

**QE reported item 4's technical blocker gone and deliberately did NOT score it. That was a claim
about inputs. This is the score, and every item below was re-assessed rather than carried forward.**

| # | item | cut | **now** | why |
|---|---|---|---|---|
| 1 | problem clear — user, pain, value | ✅ | **✅** | unchanged. Two named users (the player who takes a move back; the next engineer into the file), the pain measured on delivered code, the value stated as the two promises the pane already makes. Nothing at this hop claims anything is broken |
| 2 | scope and out-of-scope clear | ✅ | **✅** | unchanged in content and **verified against the new `A4` rather than assumed**: the criterion lands entirely in `src/history-pane.test.ts`, adds **no file, no module, no dependency**, keeps the file count at **26**, and the *zero production lines* fence was checked against a **built** reference implementation, not against an intention |
| 3 | INVEST-shaped | ⚠️ | **⚠️** | **THIS IS THE `⚠️`, and it is the *independent* facet ONLY.** *Valuable*, *negotiable*, *small* (`S`); *estimable* is now **stronger** (the instrument is built, run and costed rather than hypothesised); and **testable now covers all FOUR criteria, up from three of four**. *Independent* is still not clean — `A2` touches `src/history-pane.nfr.test.ts:104-112`, evidenced file-by-file in `## Dependencies`. **Unchanged in kind, better in degree.** Scored by judgment, flagged as such |
| 4 | acceptance clear, testable + measurable | ❌ | **✅** | **CLEARED.** `A4` is written on an instrument that was **BUILT and RUN**: nine builds × ten lengths, eight per-slot arming controls, a positive control, a full-suite verdict per build (~~`1 failed, 747 passed` on each wrong build; `748 passed (748)` on the delivered pane~~ — **QE's `A4`-ONLY figures; CORRECTED at `refinement-ABC-028-a2` to `1 failed, 749 passed` against `750 passed (750)` for this SIX-`it` ticket**), and a lane cost by `N8-LANE`'s own method with an identity null control. It names an exact fixture (`LENGTH_CASES`, `src/history-pane.test.ts:139-154`), exact expected values (`0` writes, samples `> 0`, byte-identical render), **seven** named discriminating builds with required verdicts, and the lane each must die in. **Its one boundary is named as `RISK-ABC028-01` rather than left for the fifth repair to find** |
| 5 | dependencies known | ✅ | **✅** | unchanged, **plus** the sequencing evidence added to `## Dependencies` — criterion by criterion, with line numbers read at source. That is *more* stated, not less; the recorded order is untouched |
| 6 | security/NFR triggers, each measurable | ✅ | **✅** | **no target, bar or level moved at this hop** and `plans/nfr-catalog.md` was **not opened**. `N8-LANE` ≤ **650 ms** content, `ADR-0008` ≤ **3 s** wall / ≤ **13 s** CPU, file count **TWO**, skip **0**, security **not pre-waived** with its firing threshold — all unchanged. `A4`'s **−21.9 ms** delta added **with its three limits attached** |
| 7 | test notes present | ✅ | **✅** | seven → **ten**. Notes 8, 9 and 10 added: the `A9`-freeze / `A4`-view collision (**21** spurious violations), the fresh-vs-shared fixture rule for the arming controls, and the `Proxy`/TypedArray crash trap that turns *"property violated"* into *"instrument broken"* |
| 8 | size assigned | ✅ | **✅** | `S` (2), **re-derived** this hop with the counterweight recorded (it would have been `M` had the instrument stayed undemonstrated) and the one condition that would move it named in advance |
| 9 | priority assigned | ✅ | **✅** | `P1`, **re-derived** this hop. The `P0` test was re-applied and **did not fire**; the recorded counter-argument stands |
| 10 | no major unresolved blocker | ✅ | **✅** | nothing external blocks it. The `A4` instrument question was **inside** the ticket — counted once, at item 4 — and it is now answered |

**The route's own condition, checked on its own terms.** The cutting hop wrote *"demonstrate an
instrument that discriminates all five builds in `A4`"*. **All five die** — `WFENMID`, `WPOSMID`,
`WBOARDMID`, `WMOVESWAP` newly, and `WSPLICE` stays dead — **plus two more the ticket never asked
for.** **`WBOARDBLIND` is not one of the five**: QE built it *after* the five were dead, specifically
to locate the boundary. **The second branch of the route — split `A4` off and take `A1`–`A3` alone —
is therefore NOT taken**, and `A1`–`A4` stay one ticket.

**Why item 3's `⚠️` does not block, stated rather than assumed.** The cutting hop's own route named
**ONE** item and did not route through item 3 — that is a documented prior decision of this ticket, not
a ruling invented under pressure at this hop. `ABC-029` reached `Ready` on 2026-08-12 carrying the
**same `⚠️` on the same facet for the same shared file**, so scoring it blocking here would
retroactively invalidate that promotion. **This is the single item on this page scored by judgment
rather than by measurement; it is flagged so it can be disputed, and if a reader scores it `❌` the
ticket returns to `Backlog`.**

> **THE ANTI-SMOOTHING CHECK, RUN EXPLICITLY BECAUSE THE PRESSURE IS REAL AND WAS NAMED IN THE BRIEF.**
> `ABC-019` is `P0` and is waiting on this ticket and then `ABC-029`. **That is pressure, not a reason.**
> `ABC-024`, `ABC-026`, `ABC-029` and this ticket's own first cut all recorded NOT MET and stayed put.
>
> **DIRECTION OF TRAVEL — 13 obligations ADDED, 1 REMOVED.** Smoothing removes obligations and hides
> the removal. Counted rather than asserted:
>
> **Added (13):** (1) the reported-write count is **exactly `0`**, reported at the instant of the
> write; (2) a **second, independent detector** — the 128 board bytes re-compared at **every** access;
> (3) the arming **counter must be `> 0` at every one of the ten lengths**, which the old text did not
> require; (4) a **tripwire** — rendering through the instrument must change no rendered byte;
> (5) arming **PER SLOT across eight named slots**, where the old text asked for *"a control"*,
> singular; (6) a **positive control** — a clean run must report nothing; (7) **two new discriminating
> builds with required verdicts**, `WBOARDSET` and `WBOARDBUF`, **both of which survive 744/744 today**;
> (8) coverage **extended** to `castling`, `epSquare`, `halfmoveClock` and every `Move` field, none of
> which the old table named; (9) **`RISK-ABC028-01` recorded in the ticket**, with a standing
> obligation to re-run `WBOARDBLIND` on any instrument change; (10) **three new test notes**;
> (11) `A4`'s **lane delta with its three limits**; (12) **sequencing evidence** that makes `A2`'s
> shared-file touch explicit and located instead of implied; (13) a **size condition named in advance**.
>
> **Removed (1), and it is published rather than buried:** the **absolute** — *"no reachable slot
> differs at any point during the render"*. `A4` no longer claims to catch a board mutation applied and
> reverted through an `ArrayBuffer` alias with **no** intervening graph access. **It is removed because
> no instrument can hold it for a synchronous callee**, not because it was inconvenient: a callee is
> observable only where it touches instrumented state, three closures were considered and rejected with
> reasons, **and one of them — copying the `ArrayBuffer` — would report GREEN on the wrong build.** *A
> false negative is worse than a stated limit.* The hole is named, witnessed, and given a standing
> re-run obligation. **The build it gives up on is not one of the five the criterion names.**
>
> **The counterfactual test: would item 4 have cleared if `ABC-019` were not behind it? YES.** It failed
> because the instrument was undemonstrated and the obvious candidate was measurably unavailable. An
> instrument was then **built and run** — not argued — and every verdict is reproducible from
> `.grugops/context/quality-gate-ABC-028-instrument/artifacts/`. **That is a defect repaired, not a bar
> lowered**, and nothing in the repair depends on who is waiting.
>
> **What was NOT taken on trust.** QE's results are `claim` / `observation` notes — **no §14 gate ran
> and `context.human_admission` is `off`, so nothing backing this score is a stamped `finding`**, and
> that is stated rather than glossed. Two load-bearing facts were therefore re-checked **at source** at
> this hop rather than read out of a note: **`src/position.ts:76` reads `new Uint8Array(128)`** (the
> correction below), and the shared file's line map — **comment `:103-112`, fixtures from `:113`** —
> which is what makes the sequencing answer **YES** instead of a guess. The DoR asks for criteria that
> are testable, not for gate-stamped evidence; **the stamp falls due at the build hop's gate, which is
> `blocking`.**

> **`Ready` IS NOT `pull it now`.** The two build hops share one file and **must not run concurrently
> in two worktrees**; `## Dependencies` records the order and this hop did not change it. **That
> sequencing is the Orchestrator's call and the DoR does not override it.**

**Requested board move: `Backlog → Ready`.** **This page's front matter still reads `status: backlog` /
`column: Backlog`, and that is deliberate, not an oversight** — `plans/board.md` is the Orchestrator's
and was **not opened for edit** at this hop, and a ticket header that disagrees with the board is the
two-records-disagree defect this project keeps paying for. **The front matter moves when the board
does, by the role that owns the board** — the same handling `ABC-029` received on 2026-08-12.

### DoR item 4 RE-CHECKED 2026-08-12 by BA/PM at `refinement-ABC-028-a2` — the ONE item this hop moved

**The Definition of Ready is a `Backlog → Ready` gate and this ticket is past it; this is NOT a
re-score and the 10-of-10 above is not re-opened.** One item is re-checked because **this hop edited
a criterion**, and a criterion edit is exactly what item 4 scores.

**Item 4 — acceptance clear, testable and measurable: `✅` HOLDS, and it holds for a better reason
than before.** `A2` previously scored `✅` on a `Given` that **no build could satisfy** — the score
was clean because nobody had tried to discharge it. **That is the defect this ticket exists to catch,
found in this ticket's own acceptance section, at the fifth reading, by the hop that built it.** As
repaired, `A2` names two runnable configurations, exact expected verdicts for two named builds in
each, an md5 for the comment half, and a home for the evidence. **It is now testable in the sense the
DoR means: somebody can run it and get a verdict.** `A1`, `A3` and `A4` are unchanged.

**Item 3 — INVEST *independent*, `⚠️`: UNCHANGED IN SCORE, IMPROVED IN FACT.** The shared-file
concern was `A2`'s touch on `src/history-pane.nfr.test.ts`. **That touch has happened, is one
comment-only hunk, and is verified mechanically.** The `⚠️` stays because the shared file is still
shared with `ABC-029` — but the ordering hazard it stood for is **discharged by construction**.

**No other item was re-assessed, and none is claimed to have been.**

### Requested board move 2026-08-12 by BA/PM at `refinement-ABC-028-a2`: `In Development → In Review`

**All four criteria are MET at zero production lines.** `A1`, `A3` and `A4` were met at the build
hop; **`A2` is MET under the repaired wording, and the repair adds no build work.** Gates on the
branch tip, run by the Engineer and independently verified by the Orchestrator: **lint 0, typecheck
0, 750/750 on 26 files, skip 0**, production `src/` diff **zero bytes**, `src/history-pane.ts` md5
`54fd4346…` unchanged.

**This routes FORWARD to QE, not back to the Engineer.** The `In Review` exit is QE/E2E's and this
hop does not claim it.

**FRONT MATTER: MOVED AT THIS HOP, and the reason is a defect found rather than a rule applied.**
This page's front matter read `status: backlog` / `column: Backlog` while `plans/board.md` has
carried `ABC-028` under `## In Development` since the pull — **the two records disagreed, and they
disagreed in every commit on this branch.** The build hop reported moving it, but that change was
uncommitted in another worktree and **never landed**; it does not exist on this branch's history.
The front matter is now **`in-development` / `In Development`, which agrees with the board TODAY** —
it is deliberately **not** advanced to `In Review`, because **the front matter moves when the board
does, by the role that owns the board.** `plans/board.md` was **NOT opened for edit** at this hop.

### DoR items 3 and 4 RE-CHECKED 2026-08-12 by BA/PM at `refinement-ABC-028-qe-gaps` — the TWO this hop moved

**The Definition of Ready is a `Backlog → Ready` gate and this ticket is long past it. This is NOT a
re-score and the 10-of-10 is not re-opened.** Two items are re-checked because **this hop added a
criterion and repaired two others**, and a criterion edit is exactly what items 3 and 4 score.

**Item 4 — acceptance clear, testable and measurable: `✅` HOLDS, for `A5` as well as for `A1`–`A4`.**
`A5` names an exact anchor and ply count, an exact fixture-construction rule, exact expected values
**witnessed on this branch tip and not derived** (`21 / 21` length, identity `true`, `37. Nb1 Nc6` →
`37. Ne4 Nc6`, panes differ), a **named discriminating build** (`WCACHE-LAST`) with its measured
verdict in **three** configurations, the lane it must die in, and a **render-digest identity check**
that proves the build is a genuine survivor rather than a broken one. **It also states what it does
NOT close (`RISK-ABC028-03`) — which is the clause that stops it becoming `A6`.** `A4`'s clause 1 and
`RISK-ABC028-01`'s statement were **corrected toward what is measurable**, and `A2` lost a clause that
**could not report in any configuration it was asserted over**. **Every one of those moves makes the
acceptance section more falsifiable, not less.**

**Item 3 — INVEST *independent*, `⚠️`: UNCHANGED IN SCORE, and honestly it is now BETTER and WORSE in
different halves.** **Better:** `A5`'s **test half lands entirely in `src/history-pane.test.ts`** — the
file `ABC-029` never opens — so the new work adds **no** shared-file coupling. **Worse:** `A2`'s
comment obligation is **re-opened**, and the shared file is currently held by `ABC-029`'s live hop, so
the coupling this `⚠️` has always stood for is **active rather than latent** for the first time.
**Net: `⚠️` is still the right score and it is still the single item on this page scored by judgment
rather than measurement.** It is flagged so it can be disputed. **It does not block:** the ticket is
past the `Backlog → Ready` gate this item guards, and the sequencing remedy is written in `A5`
(build the test half now, hold the comment half for `ABC-029`).

**No other item was re-assessed, and none is claimed to have been.**

### Requested board move 2026-08-12 by BA/PM at `refinement-ABC-028-qe-gaps`: **NONE — HOLD at `In Development`**

**I am not requesting a move, and that is the ruling rather than an omission.** The Orchestrator moved
this ticket `In Review → In Development` **backward** ahead of this hop, over QE's requested
`In Security/NFR`. **That call is upheld by what this hop measured, and it is upheld more strongly than
when it was made:** the six gaps were not six wordings. **One of them is a criterion that must be
built.**

**`ABC-028` stays in `In Development` until `A5`'s test half is built and green.** It advances on the
Engineer's verdict, not on mine.

- **Routes to the ENGINEER: `A5`'s test half**, in `src/history-pane.test.ts`. **Buildable now** — it
  touches no file `ABC-029` holds.
- **Routes to the ENGINEER, but NOT YET: `A5`'s comment half**, in `src/history-pane.nfr.test.ts`
  `:103-120`. **Blocked on `ABC-029` clearing that file**; `## Dependencies` forbids concurrent work in
  it and a comment is not an exception.
- **Routes to NOBODY: `G2`, `G3`, `G4`, `G5`, `G6`'s line map, and the `## Out of scope` fence.** All
  five are text and **all five are written at this hop.** No build work, no re-measurement owed.
- **Owed to the ORCHESTRATOR, not absorbed here:** the scheduling of the two halves; the `## Test
  notes` 11 finding that **`ABC-028` was gated on a tree two commits behind this branch's tip**; and
  the fact that **the `54fd4346…` md5 quoted in this hop's brief is not this tip's pane** — it is
  `c4653c4c…`, and the difference is `ABC-029`'s licensed one-line comment.
- **Owed to SECURITY/NFR, unchanged:** its firing threshold is *any production line at all, or any new
  file*. **`A5` fires NEITHER** — zero production lines, no new file, file count stays 26. **The
  threshold is measured, not waived, and it is measured against a criterion that is specified but not
  yet built**, so it falls due again at the build hop's gate.

**FRONT MATTER: NOT MOVED, and it is already correct.** It reads `status: in-development` /
`column: In Development`, which agrees with `plans/board.md` today. **`plans/board.md` was NOT opened
for edit at this hop** — the front matter moves when the board does, by the role that owns the board.
