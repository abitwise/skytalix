---
id: 20260813T082500Z-qe-e2e-claim-final-regate-verdict-ready-for-human-review-five-gaps-and-the-one-i-would-not-carry-9c5f2a41
kind: claim
by: qe-e2e
at: 2026-08-13T08:25:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - ABC-028-A3
  - ABC-028-A4
  - ABC-028-A5
  - RISK-ABC028-01
  - RISK-ABC028-02
  - RISK-ABC028-03
  - RISK-ABC017-01
  - ABC-026
  - ABC-030
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/board.md
supersedes:
---

# FINAL RE-GATE VERDICT on the MERGED tip: `READY_FOR_HUMAN_REVIEW`. Five criteria MET, zero code defects, the `:493` mechanism HOLDS where it claims to and is falsified by two green commits where it over-claims

> **Hand-authored `claim`, deliberately NOT a `finding`.** `context.human_admission` is `off`,
> there is **no `§14-gate` verdict record under this task**, and no named human granted a
> `human:<name>` stamp. **Workflow 05 step 5's `emitVerdict` carve-out cannot run here —
> `scripts/context-io.ts` does not exist in this repository** — so no green verdict note can be
> minted and nothing on this hop can carry a `§14-gate#<id>`. The gate RESULT below is recorded as
> a measurement, never as a stamped verdict. **`confidence: high` refers to the measurements; it is
> not an admission status.** This ticket's record has caught five false statements inside published
> prose and I have not added a sixth.

**This does NOT supersede my `final` or `narrow` verdicts — it re-gates the WHOLE ticket on the
MERGED tip.** `final` ran on `41d204c` at `752` over five criteria; `narrow` ran on `6cd2507` at
`755` over the clauses whose text changed. **This one runs on `0ee148e` — which IS `main` — at
`807` on 28 files, over everything.**

## The verdict

**`READY_FOR_HUMAN_REVIEW`.** Every `mandatory_gate` is green on the merged tip — **lint 0
(49 files, 2 pre-existing `biome.json` infos), typecheck 0, unit 807/807 on 28 files, build 0,
runner skip count 0** — `src/history-pane.ts` is `c4653c4c…` and this ticket's net production diff
is **zero bytes**, and **`A1`, `A2`, `A3`, `A4` and `A5` are each MET as written**, re-broken on
this tip against their own named builds with a calibrated null control.

**Not a clean `PASS` and not `FAIL`, for the third time and for the same structural reason.**
Nothing the Engineer built is wrong. No criterion is unmet. **The one thing that was FALSE is now
TRUE** — `:493` was repaired and I confirmed the repair by mutant rather than by reading it. The
gaps are, again, in what the record CLAIMS.

**A gap found now does not re-open a merged ticket.** All five below are named with an owner and
routed; **none of them is build work and none of them is owed to the Engineer.**

## What the `:493` repair actually bought, put as a number rather than as praise

I broke the original sentence with a mutant; I gave the replacement the same treatment.

| | the DELETED sentence | the REPLACEMENT |
|---|---|---|
| true on the tip? | **NO — `ABC-028`'s own `A4` was already a catcher** | **YES — every clause** |
| what falsifies it | **any commit, anywhere in the tree** | **two commits, both to `src/history-pane.test.ts`** |
| can the reader see the falsifier | no | **yes — same file, same buffer** |
| tested or asserted | tested (by me, and it broke) | **the deduction is now TESTED and HOLDS** |

**`HOIST + WPOS` → `1 failed / 807`, `ABC-028` `A4` only: `A9`'s snapshot went blind exactly as the
mechanism sentence predicts.** That experiment had never been run — the Engineer measured that the
delivered arrangement works, which is a different proposition. **`HOIST` alone is GREEN at
`807/807`**, so the regression the comment warns about can be committed by anybody with nothing
going red: **the comment is the only protection there is, and obligation (iii) — preserve the
reason — was the load-bearing obligation, not a courtesy.**

## CRITERIA GAPS vs CODE DEFECTS — the split, and which way I lean

**CODE DEFECTS: ZERO.** `src/history-pane.ts` is unmoved, `ABC-028`'s net production diff is EMPTY,
and the delivered pane is correct on every build run this hop — the whole `WCACHE` ladder at four
depths, `WLEAD-ODD`, `WPOSMID`, `WPOS`, both `A2` configurations, and a `0 / 807` null control.
**This is the eighth role to measure zero code defects on this pane.**

| # | gap | severity | owner | why |
|---|---|---|---|---|
| **`H1`** | **The `:493` replacement is a DEDUCTION for three of its four sentences and a CITATION for the fourth, and the fourth is falsified by two green commits.** `A4-RENAMED` → **`0 failed / 807`, total unmoved, nothing deleted, no coverage lost** — and the comment then cites a criterion letter that resolves to `ABC-017`'s `A4`, which does not kill `WPOS`. `A4-DELETED` → `0 failed / 806`, `WPOS` then dies at `A9` alone | **MEDIUM** | BA/PM | the block opens *"THE MECHANISM, … not a count of anything"* and `S1`–`S3` earn that; `S4` does not. **The Engineer's own note scopes this correctly — *"no falsifier outside the file it sits in"* — and BOTH my falsifiers are inside that file, so their published claim SURVIVED my attack.** The over-broad reading lives in the obligation-(iv) table row and in the routing brief. **One clause of scope, on a merged ticket: record it, do not re-open** |
| **`H2`** | **Workflow 05's test-integrity step CANNOT RUN in this repo, and three gates recorded it as a pass.** `tools/grugops/test-skip-integrity.js` exists; `.grugops/test-skips.md` does not; the checker exits **`2`** — which step 3 says is *"recorded as such, never read as a pass"*. My `final` gate, my `narrow` gate and the Engineer's done-condition line 4 each wrote *"skip 0"* as the test-integrity RESULT | **MEDIUM** | the human who owns `.grugops/test-skips.md`; Orchestrator to route | *"skip 0"* is the RUNNER's count and is correct; the CHECKER has no verdict here. **Non-blocking** — `quality.test_integrity` is `"warn"`, the step is not in `mandatory_gates`, and at 0 skips the property is vacuously satisfied. **What is missing is the mechanical signal, not the property.** I am the role that recorded it wrong twice |
| **`H3`** | **`A4`'s live lane figure is stale for the FOURTH time.** The page says `1 failed, 749 passed` against `750 passed (750)`; measured on the merged tip **`1 failed / 807 on 28` against `0 failed / 807`** | LOW | BA/PM | the SHAPE has held at 752, 755 and 807. `## Test notes` 4 already demotes the number to a claim. Changes no conclusion; recorded because this page is now its own standing example |
| **`H4`** | **The published `+4` drift rule contradicts itself at `:495`** — *"at `:495` or below is unchanged; at `:495` or above is `+4`"*. Their own table gives the exact rule: `:494` and below unchanged, `:495` and above `+4` | LOW | whoever next opens that note; Orchestrator to route | one character. The rule-rather-than-a-list argument only pays if the rule is exact, and the sentence is what a later hop will quote |
| **`H5`** | **`ABC-026`'s lane-content total / second-lander re-measurement is now owed PAST the merge and is still undischarged.** I deliberately took **no** timing measurement | LOW | `ABC-026` | the reason is specific, not conventional: **a Security/NFR hop is running concurrently in this same working tree**, so any lane number I took would be measuring that hop too. `UNKNOWN - verify` is the honest value and I did not guess one |

**Confirmed-still-open, not new and not re-derived:** `G2` (`src/zobrist.nfr.test.ts:18` says 13,
the runner reports **23**) and `G3` (`src/status-panel.nfr.test.ts:11` says 26, the runner reports
**29**) are `ABC-030`'s and the merge did not close them. `RISK-ABC028-03` is reproduced at `807`
(`WCACHE-LAST3` → 2 failures, **both in the nfr file**), and `src/history-pane.test.ts:1018`'s
prediction about it **HOLDS, tested**.

## THE POSITIVE FINDING, which is the one nobody has recorded

**`ABC-028`'s `A4` cannot be blinded green.** My first falsifier for `S4` was to stop `A4`'s
recording view recursing into nested nodes — the clause would still assert, still arm, still pass,
and would stop seeing `WPOS`. **It does not land: a separate arming tripwire fires** (`A4-BLIND
alone` → `1 failed / 807`, *"A4 arming — the instrument reports a write to every slot A4 names"*).
That defence is not claimed anywhere on the ticket page and it is the strongest single property I
measured. **It is also why the two falsifiers that DO land are a rename and a deletion — visible,
reviewable acts — rather than a silent weakening.**

## THE ONE I WOULD NOT CARRY, in words

**The brief's own restatement: *"the new sentence is asserted to be a DEDUCTION, so nothing anyone
commits can falsify it."*** Not the Engineer's sentence — theirs is careful and it survived — **the
compressed version that is already circulating one hop later.**

**The compression is the defect this ticket exists to stop, caught in the act.** A precisely-scoped
claim (*"no falsifier outside the file it sits in"*) became an absolute (*"nothing anyone commits
can falsify it"*) in the single hop between the Engineer writing it and me being sent to gate it.
Nobody lied; a qualifier was dropped in a summary. **That is exactly how `732/732 on 26 files`
became load-bearing** — it was a measurement, correctly taken, that later readers used as a
standing fact.

**And the absolute is the more dangerous form here, because it retires the instrument.** A reader
who believes the comment cannot be falsified has no reason to ever re-check it — which is the one
behaviour that would have caught `:493` in the eight days it sat there false. **The scoped version
tells you where to look: one file, 450 lines below.**

**The counter-argument, recorded rather than buried:** the residual is one sentence in one comment
whose other three sentences are genuinely durable, the falsifiers are a deliberate rename and a
deliberate deletion (neither is an accident anyone commits absent-mindedly), and the repair moved
the falsifier set from the whole tree to one file — a large, real reduction. A reader who weighs
that heavily can call `H1` bookkeeping. **I take that view for `H3`, `H4` and `H5`. I do not take
it for `H1`**, for this ticket's own reason: the hazard was never the cache and is not the comment
— **it is the sentence that stops being checked.**

## Security/NFR — the threshold, measured at `807`, not waived

**Zero production files, zero production lines, zero new files** across `ABC-028`'s own commits;
`src/history-pane.ts` md5 `c4653c4c263c4c417ea34969164ccd86` unmoved; `45` `src/*.ts` / `28`
`src/*.test.ts` unchanged by this ticket. **NEITHER half of the stated threshold fires.** The
scoped Security/NFR hop running in parallel is the role that rules on that; **I am not the role
that waives it and I did not.**

## Things I explicitly did NOT do

- **I did not mutate `src/` in this tree.** `git diff -- src/` in the shared working tree is EMPTY.
  Every mutant lived in my own detached scratch worktree, pinned by md5, restored in a `finally`
  with the pins **re-verified** after each restore, and the worktree removed at the end.
- **I did not `git commit`, `git checkout` or `git stash` in this tree.** A Security/NFR hop is live
  in it.
- **I did not open `plans/board.md`, `plans/traceability.md`, the ticket file, any ADR,
  `plans/nfr-catalog.md`, `ABC-029`, `ABC-019`, `ABC-030` or any merged ticket** — for edit or
  otherwise-than-read. The Orchestrator owns those this hop.
- **I did not amend a criterion.** Not one character of `plans/tickets/ABC-028-*.md` was written.
- **I did not repair `:1018`, `src/zobrist.nfr.test.ts` or `src/status-panel.nfr.test.ts`.** I gate;
  I do not repair.
- **I did not take a timing measurement**, and I did not repeat the inherited `±390 ms` as measured.
- **I did not record a `finding` and I invented no stamp.**
- **I did not merge, push or deploy.**

## Requested — the board is not mine this hop

**No board move requested.** `ABC-028` is already `Done` and merged; the `In Review` exit this role
normally owns has nothing left to move. **This verdict is the record of what shipped.**

**`H1` routes to BA/PM and is the only one I would spend a hop on** — and it is a one-clause record
edit, not build work. `H2` needs a human (the skip registry is human-owned by design and an agent
may not self-author a justification to clear its own gate). `H3`, `H4` and `H5` are recorded as
latent. **Nothing is owed to the Engineer, and nothing here re-opens `ABC-028`.**
