---
id: 20260813T012500Z-qe-e2e-claim-verdict-ready-for-human-review-narrow-and-what-i-would-not-carry-2a8f61bd
kind: claim
by: qe-e2e
at: 2026-08-13T01:25:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - ABC-028-A3
  - ABC-028-A4
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-01
  - RISK-ABC028-02
  - RISK-ABC028-03
  - ABC-026
  - ABC-029
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/board.md
supersedes:
---

# NARROW RE-GATE VERDICT: `READY_FOR_HUMAN_REVIEW`. The amended text HOLDS on the tip, zero code defects, and THREE further live instances of this ticket's own defect class in `src/`

> **Hand-authored `claim`, deliberately NOT a `finding`.** `context.human_admission` is `off`, there
> is **no `§14-gate` verdict record under this task**, and no named human has granted a `human:<name>`
> stamp. **Workflow 05 step 5's `emitVerdict` carve-out cannot run here — `scripts/context-io.ts`
> does not exist in this repository** — so no green verdict note can be minted and therefore nothing
> on this hop, or downstream of it, can carry a `§14-gate#<id>`. The gate RESULT below is recorded as
> a measurement, never as a stamped verdict. **`confidence: high` refers to the measurements; it is
> not an admission status.**

**This does NOT supersede my `quality-gate-ABC-028-final` verdict — it narrows onto what moved under
it.** That gate ran on `41d204c` at `752` over five criteria and stands. This one runs on `6cd2507`
at `755` over the clauses whose TEXT changed.

## The verdict

**`READY_FOR_HUMAN_REVIEW`.** Every `mandatory_gate` passes on the branch tip — **lint 0, typecheck 0,
unit 755/755 on 26 files, build 0, skip 0** — owned lane `26/26`, nfr lane `11/11`, `ABC-028`'s own
production diff **zero bytes across two files, both `.test.ts`**, and **the two amended clauses were
tested rather than read.**

**Not a clean `PASS` and not `FAIL`, for the same reason as last time and with a sharper example.**
Nothing the Engineer built is wrong. No criterion is unmet. The gaps are in what the record CLAIMS —
and this hop found the first one that **this ticket itself falsified**.

## What I re-gated, and what I deliberately did not

| re-gated | result |
|---|---|
| **`F1` — `A5`'s new domain formula, BOTH parities** | **HOLDS EXACTLY.** `blackAnchorTo(21)` bound **15**, `blackAnchorTo(22)` bound **14** — the `14` was `UNKNOWN - verify` and is now MEASURED. Confirmed as real `A5` rows through the real suite (T=15 green, T=16 red; T=14 green, T=15 red) and located by a full sweep at four lengths, two per parity |
| **`F2` — `A4`'s restated lane clause (the SHAPE)** | **HOLDS.** `WPOSMID` → `1 failed / 755`, it is `A4`, **zero pre-existing tests break**. The repair survives the exact `+3` that broke the absolute |
| **`F4` — is the convention honestly labelled?** | **YES, at every site where the rule is stated.** Four explicit denials, the struck clause struck WITH its reason. One word (*"binds"*) still does control work; LOW, reported not actioned |
| **`F5` / the ledger's replacement** | consistent with everything measured here; nothing in it needed a word changed by me |
| **`:115`'s numerator, left `UNKNOWN - verify` by BA/PM** | **CLOSED. `WCACHE-LAST3` fails exactly 2 of 755**, both `toSan` spy assertions; `26/26` exact; the per-test rebuild green. Only the three totals are stale |
| **`## Test notes` 13's six citations** | **every one re-finds exactly as published** — first re-run by a role other than its author |
| **Security/NFR firing threshold at 755** | **still does NOT fire.** Zero production files, zero production lines, zero new files, file counts 42/26 unchanged. **Measured, not waived** |
| **the suite, lint, typecheck, build, skip on the tip** | reproduces the briefed baseline cell for cell |

**NOT re-run, by instruction and by judgment:** the **eight-subset-key enumeration** (conclusive; not
asked for twice; nothing here depends on it), the fifteen-cell kill matrix, `RISK-ABC028-01a`'s
`WBOARDBLIND` witness (its trigger is a change to `A4`'s *instrument*, and only the sentence
describing its lane moved), and `N8-LANE`'s TOTAL (`ABC-026`'s, still owed at the merge).

## CRITERIA GAPS vs CODE DEFECTS — the split, and which way I lean

**CODE DEFECTS: ZERO.** `src/history-pane.ts` is `c4653c4c…`, `ABC-028`'s own net production diff is
EMPTY, and the delivered pane is correct on every build run this hop — the four boundary rows, both
parities, `WPOSMID`, `WPOS`, `WCACHE-LAST3` and its per-test twin, and a null control at `755/755`.

**RECORD DEFECTS: THREE NEW, all in `src/`, none containing a banned string.**

| # | gap | severity | owner | why |
|---|---|---|---|---|
| **G1** | **`src/history-pane.test.ts:493` claims `WPOS` passes *"with zero catchers anywhere in the project"*. FALSE: `ABC-028`'s own `A4` catches it.** Measured: `WPOS` → `2 failed / 755`, `A9` **and** `A4`. The denominator (`732/732`) is stale too | **MEDIUM** | BA/PM (page), whoever next opens the block | **the first instance whose falsifier is this ticket** — written `0b508a2` 2026-08-11, falsified by `8de988d` 2026-08-12, in the same file, unnoticed by three hops including my own. A claim of EXHAUSTIVENESS going stale needs a mutant to detect; a number does not |
| **G2** | **`src/zobrist.nfr.test.ts:18` — *"all 13 tests there"*; `zobrist.test.ts` is 23** | LOW | whoever next opens it | exactly right at `584defa`; `2efe9ac` and `862c687` each added an `it.each`. Twelve lines above it, `:12` is a DATED witness and is immune — the repair demonstrated inside one file |
| **G3** | **`src/status-panel.nfr.test.ts:11` — *"all 26 tests there"*; `status-panel.test.ts` is 29** | LOW | whoever next opens it | exactly right at `695a2e7`; `dc06b40` took it to 29 **and edited the nfr file in the same commit** |
| **G4** | **`A5`'s domain clause says *"a future row that changes the builder"* — a row cannot change the builder** | LOW | BA/PM | `EditShape` has no fixture field and the `it` body hardcodes `blackAnchorTo(21)`/`toHaveLength(21)`; measured — the row's data alone dies with *"no legal move a2a3"*. **The inaccuracy is CONSERVATIVE and I recommend recording it, not re-opening the page** |
| **G5** | **The page carries *"`src/` scores 0"* (strings) and does not carry *"`src/` scores 5"* (shape)** | LOW-MED | BA/PM | one sentence. `gameend.nfr.test.ts:13` HOLDS at 45, so the instrument discriminates and the number is trustworthy |

**I lean to CRITERIA again, and this time the reason is not the count — it is `G1`.** Seven roles have
now measured zero code defects on this pane. **`G1` is the first gap on this stack where the ticket's
own new criterion silently falsified a sentence in the file it edited.** That is the ticket's thesis
turned all the way around on itself: *every finding here is a gap in what a criterion ASKS* — and here
a criterion, by being ADDED, made an existing record false. **No convention, no blacklist and neither
candidate control would have caught it. A mutant did.**

## THE ONE I WOULD NOT CARRY, in words

**Not a sentence this time — a method.** The page now says, correctly and with a measurement behind
it, that `src/` contains **zero** occurrences of the four banned formulations. **I would not carry
that number forward without the one beside it.** Measured on this tip: **`src/` scores 0 on strings
and 5 on shape.** The first number is true and the second is the one that matters, and a hop reading
only the first will conclude the merged tree is clean when five live instances sit in it — one of
them false rather than merely stale.

**The counter-argument, recorded rather than buried:** every one of the five is latent, none breaks a
test, none misleads a *user*, and four of them are stale numbers in justifications whose ARGUMENT is
untouched. A reader who weighs that heavily can call the whole class documentation debt. **I do not
take that view for `G1` specifically** — *"zero catchers anywhere in the project"* is the reason a
test is structured the way it is, and it is now false — **and I do take it for `G2` and `G3`**, which
is why I lean to leaving those two alone rather than refreshing them.

## Security/NFR — the threshold is MEASURED at 755, not waived

Zero production files, zero production lines, zero new files, `42`/`26` file counts unchanged,
`package.json` and `package-lock.json` byte-untouched. **NEITHER half fires. The review is owed, it
should be short, and I am not the role that waives it.**

## Things I explicitly did NOT do

- **I did not amend a criterion.** Not one character of `plans/tickets/ABC-028-*.md` was written. All
  five gaps are reported and routed.
- **I did not repair either of BA/PM's two instances, or any of my three.** `src/` is fenced for a
  gate — **I gate, I do not repair.** `git diff -- src/` is EMPTY.
- **I did not re-run the eight-subset-key enumeration**, as instructed.
- **I did not turn the `N8-LANE` floor into a number**, and I marked the inherited `±390 ms` as
  `UNKNOWN - verify` at this hop rather than repeating it as measured.
- **I did not open `plans/board.md`**, any ADR, `plans/nfr-catalog.md`, `ABC-029`, `ABC-019`,
  `ABC-017` or any merged ticket. The front matter was **not** moved.
- **I did not merge, push, deploy, or `git checkout main`**, and I entered **no other worktree** — a
  Security/NFR gate is live on `ABC-019`.

## Requested — the `In Review` exit is mine, the board is not

**`ABC-028`: `In Review` → `In Security/NFR`.** `In Security/NFR` is `1/2`, so the move fits. The
threshold does not fire and that is measured, but the ticket states it as falsifiable rather than
pre-waived, so the look is owed.

**`G1` routes to BA/PM first** and is the only one I would spend a hop on. `G2`, `G3` and `G4` are
latent and recorded as latent; `G5` is one sentence. **Nothing routes to the Engineer.**
