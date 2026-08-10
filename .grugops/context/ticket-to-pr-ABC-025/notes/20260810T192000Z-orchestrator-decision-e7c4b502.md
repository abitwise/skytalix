---
id: 20260810T192000Z-orchestrator-decision-e7c4b502
kind: decision
by: orchestrator
at: 2026-08-10T19:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-026
  - RISK-ABC013-04
  - N5
  - src/san.ts
  - plans/board.md
supersedes: 
---

# `ABC-025` CLOSED — merged on the owner's explicit instruction, gates re-run on `main`, `Ready for UAT` → `Done`

## The merge, verified rather than recorded

```
main before            995d398
main after             59b0aa6        (exactly the branch tip that was gated)
commits gained         14
merge commits          0              git log --merges 995d398..HEAD  → empty
branch                 DELETED        git branch -d, reported "was 59b0aa6"
working tree           clean
```

A **clean fast-forward**: the commits `main` now carries are byte-for-byte the commits the gates ran
against, so every branch-tip verdict transfers without an inference.

**The keystroke was denied by the host classifier and returned to the owner — the fifth such denial in
this project and the fifth returned.** The owner then instructed the merge explicitly, which is the one
path that crosses the *humans hold merge* line without breaking it: **the human holds the decision, the
agent holds the keystroke.** The retry after that instruction was a straightforward re-run of the same
command, not a route around the control.

## Gates re-run ON `main` — the standing directive's limit 2

```
npm run lint           exit 0
npm run typecheck      exit 0
npm run build          exit 0
npm test               676 passed / 676 on 22 files
skip count             0
PERFT_DEEP=1           32/32 EXACT in 37.31 s
md5 src/san.ts                          cbcc3be37c21414d16e8e6b4d0c68959
md5 src/san.qualifier.hardening.test.ts 856ebab15128d8b5945c3038401eeda5
md5 src/san.suffix.hardening.test.ts    c8beb69c1c4169bde319196c3e138eac
```

Both sides recorded, as the directive requires. Two deserve a sentence.

**`src/san.ts` hashes identically on `main` to its pre-ticket state** — through seven hops, four
mutation sweeps totalling over 100 mutants, and three independent gates. **No gate ever repaired the
thing it was measuring, and this ticket delivered exactly what it promised: zero production lines.**

**The deep lane is 32/32 on `main`** — the check that a ticket which touched nothing in the rules core
did in fact touch nothing in the rules core. Measured, not argued.

## Final shape

`+823 / −0` across **two new files**, both `*.test.ts`, additions only, no pre-existing file under
`src/` modified and no existing test row edited. 652 → **676 tests**, +24.

## What this ticket actually closed

`RISK-ABC013-04` — and it closed more than it was cut for:

- the **five** criteria gaps `ABC-013`'s QE hop proved,
- a **sixth** wrong build BA/PM found at the cut, which the five's own fix does not catch,
- a **seventh class** QE found at the gate — a qualifier and a check/mate suffix on the same string,
  four builds passing 672/672 because **zero of the repository's 111 hand-typed rows carried both
  parts**.

All four behaviour-equivalent controls survived every new criterion, killed count **zero** — the rows
pin behaviour, not implementation shape.

## `N5` — closed as an accepted breach, and the corpus kept

Merged at **+7.3% / +8.2% net** against a `≤5%` bar. The full decision space was measured before the
ruling: the assisted-only middle path reads **+5.2% net — over** and additionally loses a constructible
wrong build; the only compliant change deletes 184 positions from the property. **A ticket that exists
because a net was too thin does not pay for its own ratio with net.**

Owned by BA/PM with a named trigger. `plans/nfr-catalog.md` untouched, no catalog target moved. The
lane's real health question is `ABC-026`.

## UAT — deferred, explicitly NOT passed

`src/san.ts` has zero non-test runtime importers; `package.json` declares no `bin` and no `main`.
Deferred to `EPIC-006`, the same ruling every ticket since `ABC-004`. **A UAT pass would be a
fabrication.**

## The record this ticket leaves

Seven hops, five roles, and **the largest single finding was that a bar was unmeetable by
construction** — `≤5%` gross could not be met by two *empty* test files, because nobody had measured
the floor. Four instruments measured the delta before anyone measured what the delta was against.

**Five Orchestrator errors are on this ticket**, all self-caught or caught by the role I was checking:
a prescription at `ABC-013`'s close that was measurably false; **`N5` passing through the
Definition-of-Ready gate I personally re-ran** — the gate that exists to catch an unmeasurable
acceptance target; two invented timestamps; a grep that read a comment as an import; and **an
arithmetic error in my own favour** — subtracting a two-file floor from a one-file gross to make a
candidate look compliant that never was.

The best thing on this ticket was not mine either: **the Engineer built the mutant that killed my own
proposal, and then argued against his own finding as too contrived to carry the refusal.** He was
right on both counts, and the refusal stood on arithmetic he had already found.

## Owed, carried forward

- **`ABC-026`** — cumulative default-lane budget. `Backlog`, DoR explicitly not met.
- **Two false evidence parentheticals in `ABC-025`** (`A5`'s "no mutant turns it red"; `A1`'s timing
  figure). Non-normative, BA/PM's, not created after the cut.
- **`ABC-016` / `ABC-017`** are unblocked and consume `toSan`; `EPIC-003` opens `src/san.ts` next.
  These rows now stand between that edit and a silently non-standard move list.
- **No `scripts/context-io.*` and no `claim.*` in this install** — six consecutive hops verified it at
  the source. Substrate gap, mine to carry.
