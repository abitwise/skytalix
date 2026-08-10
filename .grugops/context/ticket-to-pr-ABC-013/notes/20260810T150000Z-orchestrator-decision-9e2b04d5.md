---
id: 20260810T150000Z-orchestrator-decision-9e2b04d5
kind: decision
by: orchestrator
at: 2026-08-10T15:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - ABC-025
  - RISK-ABC013-04
  - EPIC-002
  - src/san.ts
  - plans/board.md
  - plans/traceability.md
supersedes: 
---

# `ABC-013` CLOSED — merged by the owner, gates re-run on `main`, `Ready for UAT` → `Done`

## The merge, verified rather than believed

The owner reported the merge. I checked it instead of recording it:

```
main before            eb706f9
main after             8dd8d22        (exactly the branch tip that was gated)
commits gained         14
merge commits          0              git log --merges eb706f9..main  → empty
branch                 DELETED        by the owner
src/san.ts on main     PRESENT
working tree           clean
```

A **clean fast-forward**, which is the branching model's requirement and not merely a nicety: it
means the commits `main` now carries are byte-for-byte the commits the gates ran against, so the
branch-tip verdicts transfer without an inference.

**The keystroke was denied to me by the host classifier and returned to the owner rather than routed
around** — the fourth such denial in this project and the fourth returned. The owner turned the key.
That is the control working exactly as designed: the decision was the owner's standing one, the
keystroke was the owner's too.

## Gates re-run ON `main` after the merge — the standing directive's limit 2

```
npm test              652 passed / 652 on 20 files
skip count            0
npm run lint          exit 0
npm run typecheck     exit 0
npm run build         exit 0
PERFT_DEEP=1          32/32 EXACT in 38.38 s
md5 src/san.ts        cbcc3be37c21414d16e8e6b4d0c68959
```

Both sides recorded, as the directive requires. Two of these deserve a sentence.

**The deep perft lane had not been run by anyone on this ticket.** Every hop said so honestly — the
engineer skipped it because nothing in his diff touched the generator, and Security/NFR recorded "not
run, no result reported." That reasoning was sound but it is an argument, and `32/32 exact` is a
measurement. It is the check that this ticket did not disturb the rules core, and it now exists.

**`src/san.ts`'s md5 is identical on `main` to the Engineer's delivery**, through QE's 40-mutant
sweep and Security/NFR's two-build benchmark. No gate repaired the thing it was measuring, and the
merge introduced nothing.

## Final shape of the work

`src/san.ts` — 148 lines, one export `toSan`, importing exactly `position.ts`, `moves.ts`,
`apply.ts`, `legal.ts`. No `parseSan`; `EPIC-003`'s half of the file is not foreclosed. The whole
delivered diff is **three new files, +628/−0, additions only**, with no pre-existing file under
`src/` modified at all.

`EPIC-002`'s SAN seam is closed, and `ABC-016` and `ABC-017` are unblocked on their `ABC-013`
dependency.

## UAT — deferred, and explicitly NOT passed

`src/san.ts` has **zero runtime importers** and `package.json` declares no `bin` and no `main`. There
is nothing a human can run. Deferred to `EPIC-006`, which is the same ruling every ticket since
`ABC-004` has taken for the same measured reason. **A UAT pass here would be a fabrication**, and
recording one to make a column look complete is the failure this project has been most careful about.

## What is owed, named so it cannot be lost

- **`ABC-025`** — close QE's five criteria gaps with the minimality property (*no shorter qualifier
  would also be unique*), which closes all five plus three more. Owner **BA/PM**, carried as
  `RISK-ABC013-04`, trigger **before `ABC-016`/`ABC-017` consume `toSan`**. **The gaps are open
  because of my own over-tight QE scoping, not because QE missed them** — QE proved all five and was
  told to hold the diff at three files.
- **`RISK-ABC013-01`** — `N4`'s measured cell is a mean labelled a worst; a human decides whether the
  14 µs bar moves. Owner BA/PM.
- **`RISK-ABC013-02`/`-03`** — `N1` is position-dependent; `toSan` is silently wrong on a broken
  caller obligation. Both owned, both triggered.
- **`memory-bank/30-architecture.md` still lacks `san.ts` AND `history.ts`**, which `ADR-0004`'s
  Consequences owe it. Predates this ticket; covering only half would leave the map half-true.
- **The test-integrity checker has exited 2 for three consecutive hops** (`.grugops/test-skips.md`
  absent). Pre-existing, recorded as an error and never as a pass.

## Found at the close, flagged and deliberately NOT fixed

**Three rows in `plans/traceability.md` carry the wrong cell count** against a 12-cell header:
`ABC-009` (14), `ABC-011` (13), `ABC-015` (13) — almost certainly unescaped `|` inside prose. All
three tickets are long merged. This is **pre-existing, unrelated to `ABC-013`, and outside this
task's scope**; rewriting prose I did not author risks damaging content to make a shape look right.
Flagged rather than deleted, per `AGENTS.md` rules 9 and 12. **`ABC-013`'s own row was checked
structurally and is clean** — 12 cells, leading and trailing empty, id cell `ABC-013` — which is the
check Security/NFR's repair earned, since a pipe *count* cannot see a pipe *move*.

I also updated `ABC-013`'s Status cell, which still read `In Review` and was three column moves
stale; the superseded text is archived verbatim in `history/`.

## The record this ticket leaves

Three Orchestrator errors are on it, all self-caught and corrected in place: a merge limit I asserted
that the owner's standing directive had already retired; a board close written **before** the merge
ran, false for the minutes it stood; and the QE scoping that left five proven gaps open. They are in
the board header and the superseded note rather than tidied away, because a factory that only records
the roles it audits is not auditing itself.

The single best thing on this ticket was not mine: **QE disbelieved a premise that BA/PM, the
Engineer and I had all written down** — that no external SAN oracle was available — and closed the
ticket's largest risk with 649,556 matched strings.
