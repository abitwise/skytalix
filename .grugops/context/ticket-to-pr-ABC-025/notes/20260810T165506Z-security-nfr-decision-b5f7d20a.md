---
id: 20260810T165506Z-security-nfr-decision-b5f7d20a
kind: decision
by: security-nfr
at: 2026-08-10T16:55:06Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-013
  - ABC-023
  - RISK-ABC013-04
  - N5
  - N6
  - EPIC-003
  - src/san.ts
  - src/san.qualifier.hardening.test.ts
  - src/san.suffix.hardening.test.ts
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
supersedes: 
---

# Security/NFR gate on `ABC-025`: **PASS_WITH_RISKS**, `In Security/NFR` → `Ready for UAT`. The security half did NOT fire and found nothing when read anyway; **`N5` is NOT MET on a fourth instrument, and `N5` is ALSO NOT MEASURABLE AS WRITTEN — those are two separate rulings and I am not blurring them**

The numbers are in the two `observation` notes beside this one and are not repeated. This note is
the ruling, the risks and the board move.

```
security half   NOT TRIGGERED (823 of 900, both files *.test.ts under src/) — read anyway,
                nothing found. No required fix. No finding at any severity.
N5              NOT MET.  +12.1% CPU / +13.6% CPU for the whole delta / +16.5% by the file's own
                isolated test time, against <= 5%.  Wall clock — the instrument the bar names —
                CANNOT DECIDE: +0.0% to +8.6% across defensible aggregators, with a null control
                on a byte-identical tree reading +0.7% to +6.0% and a 95% CI to +14.3%.
N6              MET.  PERFT_DEEP=1 32/32 exact in 36.55 s, skip count 0. Verified directly.
A6              HOLDS, re-verified mechanically on my own instrument.
gates           676/676 on 22 files, skip 0; lint / typecheck / build exit 0.
```

## Ruling 1 — is the bar met? **No.**

Not met, and not marginally. Every instrument that can **resolve** a delta of this size puts the
cost at **2.4x to 3.3x** the bar, with the sign positive in 18 of 18 interleaved rounds and a null
control of 0.4-0.5%. The breach is real; it is not an artefact of a noisy lane.

The bar is **not waived, not moved and not softened**. `plans/nfr-catalog.md` is untouched and no
target in it moved — `N5` and `N6` are ticket-level bars and are not rows in that file. **A gate
does not move a target**, which is this board's standing rule, applied to `ABC-013`'s `N4` earlier
today and applied to itself here.

## Ruling 2 — is the bar measurable as written? **No, and this is the more serious of the two.**

QE reported that the within-condition spread of the *unchanged* lane (~330 ms) exceeds the budget
the bar is worth (~85 ms). **That holds, and I put a sharper instrument on it: a null control by
identity.** The bar's own comparison procedure, run on a **byte-identical tree** — a change that is
literally nothing — reports **+0.7% to +6.0%** depending on the aggregator, with a 95% bootstrap
interval reaching **+14.3%**. A procedure that reports a 6% cost for a no-op cannot adjudicate a 5%
bar in either direction. On this instrument a "pass" would have been as unsupportable as a "fail".

And the noise is only the first of five unnamed degrees of freedom. `N5` leaves the **statistic**,
the **sample size**, the **numerator** (whole-lane delta vs the file's own time — a factor of 2.2),
the **isolated-or-in-lane** reading of that numerator (a factor of 2.6), the **denominator** (lane
with or without the tests; `npm test` literally includes npm's own startup) and the **scope** of
"the tests this ticket adds" (the delivered file, or both hardening files) to the reader. Four of
the five move the answer by more than the 5% the bar is about.

**This is a defect in the bar, not in the ticket and not in the work** — and it is the same defect,
on the same ticket, as the one in its security trigger (whose clause 2, read literally, fires on
every ticket this board has ever run). Both are recorded as risks with the same owner.

## Ruling 3 — who decides. **BA/PM decides `N5`. I report the number and I do not move the bar.**

- **The number and whether it is met: mine, and it is delivered here.** NOT MET, on the record,
  with its method and its machine.
- **The bar itself — its statistic, its sample, its numerator, its denominator, and whether 5% was
  ever the right figure: BA/PM's.** They wrote `N5` at the cut; `plans/nfr-catalog.md`'s ownership
  line puts NFR targets with Architect/Design to seed and this role to check against, and a
  ticket-level bar belongs to the role that cut the ticket. A gate that re-specifies the bar it just
  failed has adjudicated its own case.
- **Whether `ABC-025` merges carrying a breached `N5`: the Orchestrator's, at the close, with the
  owner.** This gate does not hold the ticket for it — see "why not BLOCKED" below.
- **`EPIC-003`'s ticket must inherit the re-specified bar, not this one.** If `N5`'s wording is
  copied forward unchanged, the next gate will re-run this whole argument.

## Ruling 4 — the coverage question, and why it turns out not to be a question

The record carries a disagreement I was asked to be the third instrument on. **QE is right and the
Engineer's argument is void:** *"across all 13 mutants the assisted-only and unassisted-only
mismatch counts are identical"* is not evidence about the clause, because none of those 13 can
distinguish the call forms by construction — the measurement could not have come out any other way.
QE's four purpose-built call-form mutants (`CF1`-`CF4`) are real evidence, and they say the clause
is not the sole killer of anything.

**But the recommendation the argument was offered for is moot, and I measured why.** I built the
narrowed variant myself — one line, out of tree — and ran it as its own condition in the same
interleaved harness: **`A1` assisted-only costs +5.3% wall / +7.4% CPU. It breaches the bar too.**

So the trade on offer is: give up call-form coverage over **207 positions**, keep it over **41**,
and **still not meet `N5`**. **My recommendation is therefore to narrow nothing.** No coverage is
cut at this gate, `A1` stands as written and as delivered, and the Engineer's refusal to quietly
narrow an acceptance criterion to protect someone else's bar was the right call — confirmed here
rather than merely endorsed. The open question is the bar, not the criterion.

## Why PASS_WITH_RISKS and not FAIL / BLOCKED

- **Every mandatory gate is green** (`quality.mandatory_gates`: lint, typecheck, unit, build — all
  exit 0; 676/676, skip 0) and `quality.gate_enforcement` is `blocking` on those, not on this.
- **No security finding at any severity.** `security.block_on` is `high`; there is no high, no
  medium and no low. Zero production lines, no danger surface, nothing to fix.
- **`N5` is breached, and I am not calling that a FAIL — with the reason stated so it can be
  disagreed with.** The harm is ~250 ms on a ~1.5 s inner loop, it is fully reversible, the only
  measured way to reduce it does not reach the bar either, and the bar has just been shown unable to
  adjudicate itself. Failing a ticket on an instrument I have proved reports a breach for a no-op
  would be the wrong use of the word.
- **It is emphatically not a PASS.** `N5` is NOT MET, it is not waived, and it leaves this gate as a
  live open risk with a named owner. That is precisely what PASS_WITH_RISKS is for.

## Why PASS_WITH_RISKS and not a clean PASS

`N5` is breached at 2.4x-3.3x; the bar and the ticket's security trigger both carry specification
defects; and QE's four-blind-spot finding (the qualifier-and-suffix class) is closed but stands as
evidence that the honest prior on this net is that more classes exist.

## Risks — QE's six re-adjudicated on my own instrument, plus four of mine. Every one has an owner and a trigger.

**1. `N5` is breached.** **CONFIRMED**, fourth instrument, and my number is the largest on the
record. Owner **BA/PM** (who wrote the bar). Trigger: **fired now**; and again at the `EPIC-003`
`parseSan` cut if the wording is copied forward. Ruling delivered here: NOT MET.

**2. `N5` is not measurable as written.** **CONFIRMED AND STRENGTHENED** — QE's noise-floor argument
now has a null control by identity under it, and four further unnamed degrees of freedom beside it.
Owner **BA/PM**. Trigger: before the next ticket sets a ratio bar against the default lane, and at
`EPIC-003`'s cut. What would fix it: name the statistic, the sample size, the numerator, whether it
is isolated or in-lane, and the denominator. QE's *"median of N >= 7 interleaved runs, or the file's
own reported test time"* is the right shape and is **still short by one clause** — the file's own
reported test time is 253 ms isolated and 647 ms in-lane.

**3. The evidence offered for dropping `A1`'s unassisted half is not evidence.** **CONFIRMED
(QE is right), and the risk is CLOSED at this hop** by the ruling above: the narrowed variant
breaches the bar anyway, so nothing is narrowed and nothing is traded. No carry-forward owner.

**4. 49 mutants is still not the complete set.** **CONFIRMED, stands untouched.** Owner **QE/E2E**
at the next hop that touches `src/san.ts`. Trigger: `EPIC-003`'s `parseSan` ticket entering `Ready`.
Two derivation routes found a class the first route missed; a third may find another. I added no
mutant at this hop and claim no improvement to the score.

**5. `A2`'s grid size is not pinned.** **CONFIRMED on my own reading, and sharper than recorded.**
`UNREACHABLE_CELLS` **is** asserted at 4, but `REACHABLE_CELLS.length` is never asserted at 44 —
and the failing message of the `44 of 44` row hard-codes the string `of 44`, so a grid that lost a
piece type would print a **false** *"33 of 44 cells filled"* and still be green. The leave-one-out
row is the only guard. Owner **Software Engineer**. Trigger: any edit to `CELL_TYPES` or
`allCells()` in `src/san.qualifier.hardening.test.ts`. One row closes it; I did not edit the
delivered file to add it, for the same reason QE did not.

**6. `san.nfr.test.ts`'s `N1` rows will go red on a sanctioned optimisation of `toSan`.**
**CONFIRMED structurally** (`N1` is five spied call-count assertions; `EQ1`/`EQ2` die there and
nowhere else). **Owner DISPUTED and re-assigned: BA/PM at the `EPIC-003` `parseSan` cut**, with
Security/NFR adjudicating at that ticket's gate. QE assigned it to Security/NFR alone; a warning
whose only owner is a gate that runs *after* the work arrives too late to stop the engineer deleting
the row. It has to be written into the ticket the engineer reads. Trigger: `EPIC-003`'s `parseSan`
ticket entering `Ready`.

**7. `ABC-025`'s security trigger has an unnamed denominator, and clause 2 read literally fires on
every ticket.** NEW. Measured: the branch's whole diff is **+3,560 / -2 across 26 files that are not
`*.test.ts` under `src/`**, against `+823 / -0` under the code-diff reading every hop used. Owner
**BA/PM**. Trigger: the next ticket that writes a line-count security trigger. The fix is one word —
say *"the diff under `src/`"*.

**8. The delivered diff is 1.5x its own prediction and sits at 91.4% of the threshold.** NEW.
Predicted ~+550, delivered +823 against a +900 trigger. It did **not** fire and I did not treat
proximity as firing — but the margin is 77 lines, and **any further row added to this ticket before
merge crosses it and fires the security half for real**. Owner **Orchestrator** (who schedules any
further hop on `ABC-025`). Trigger: a third file, or any addition to either hardening file, before
this ticket closes.

**9. There is no cumulative budget on the default lane — only per-ticket ratios.** NEW, and it is
the risk `N5` was invented to prevent and does not. Measured: `san.qualifier.hardening.test.ts` is
now the **second most expensive file in the repository at 20.1% of the suite's test time**, behind
only `perft.test.ts` (40.1%) and costing **2.1x** the castling-hardening, en-passant-hardening and
gameend files combined (275 tests). Every future hardening ticket can pass its own 5% and the lane
still doubles, because each is measured against a baseline the previous one already inflated. Owner
**BA/PM** with **Architect/Design** (who seeds `plans/nfr-catalog.md`). Trigger: the next hardening
ticket cut against `EPIC-002` or `EPIC-003`. **Not fixed here — a gate does not add a bar any more
than it moves one.**

**10. This install still has no sanctioned context writer and no claim script.** NEW at this hop
only in the sense that it was **re-verified rather than inherited**: there is no `scripts/`
directory in the repository, no `context-io.*` or `claim.*` anywhere in the repository or in the kit
at `/Users/olgeroeselg/.grugops/agent-factory`, and no `mcp__grugops__propose_note` tool in this
session's tool set. Workflow 16's stop condition is therefore live on every hop of this install.
**These notes were hand-written into `notes/` in the `agent-factory/contracts/context-note.md`
format**, as every prior note on this task did; the claim was taken by hand with an atomic
`mkdir .grugops/queue/claimed/ticket-to-pr-ABC-025-sec` exactly as Workflow 17 step 2 specifies.
Nothing mechanically validated any of it and `index.md` / `index.jsonl` do not exist for this task.
Owner **Orchestrator**. Trigger: the next task started on this install. BA/PM recorded this at the
cut; it is repeated because it has not changed and because it bears on how much weight any reader
should put on these notes.

## Board move

`In Security/NFR` → **`Ready for UAT`** (In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4). No
WIP limit is approached.

**I am not pre-judging UAT.** `ABC-025` adds zero production lines to a module with no runtime
importer and there is no user surface until `EPIC-006` — which is exactly the position that led
`ABC-013` to record **UAT DEFERRED, explicitly NOT PASSED**. That call is the UAT hop's and the
Orchestrator's, not mine; I move the ticket to the column my role owns the exit to and say what the
next hop will find.

`RISK-ABC013-04` is **not** closed by this hop — it closes when this ticket is gated and merged.

Nothing merged. Nothing deployed — `production_requires_human_confirmation` is `true` and a human
holds both.
