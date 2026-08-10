---
id: 20260810T141500Z-orchestrator-decision-c4f10ba7
kind: decision
by: orchestrator
at: 2026-08-10T14:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - ABC-025
  - RISK-ABC013-04
  - src/san.ts
  - plans/board.md
  - memory-bank/60-progress.md
supersedes: 20260810T121500Z-orchestrator-decision-6b93ce41
---

# `ABC-013` is gated green and NOT merged — the merge keystroke was DENIED and returned to the owner. Three Orchestrator errors are corrected here rather than absorbed.

## Terminal state

```
main                            eb706f9   UNCHANGED
grugops/ticket-to-pr-ABC-013    47b5b93   13 ahead, 0 behind, no merge commit
branch-tip gates                lint 0 · typecheck 0 · build 0 · 652/652 on 20 files · skip 0
delivered diff under src/       3 NEW files, +628/-0, additions only
src/san.ts md5                  cbcc3be37c21414d16e8e6b4d0c68959  (delivery → both gates, identical)
board                           Ready for UAT 1/4 — NOT Done, because Done means merged
```

Three gates ran and none required a fix: QE **PASS** (0 code defects), Security/NFR
**PASS_WITH_RISKS** (nothing high or medium, four accepted risks each with an owner and a trigger),
and the branch-tip quality gate green. UAT is **DEFERRED → `EPIC-006` and explicitly NOT PASSED**:
`src/san.ts` has **zero runtime importers** and `package.json` declares no `bin` or `main`, so no
human can exercise it and a UAT pass would be a fabrication. That is the same ruling every ticket
since `ABC-004` has taken, for the same measured reason.

## The merge was denied, and denial is returned, never routed around

`git merge --ff-only` was refused by the host permission classifier. **This is the fourth such denial
in this project's history and the fourth returned to the owner** (`ABC-014`, `ABC-015`, `ABC-009`).
The standing practice is exact and it held: the decision is the owner's, the keystroke is the host's,
and an agent that engineers around a denial has converted a human control into a speed bump. Nothing
was retried by another path. `main` is untouched.

**The fast-forward is clean and waiting**: 0 behind, 0 merge commits, `git rev-list --count HEAD..main`
is 0. Whenever the owner turns the key it is a pure fast-forward, and the gates should be re-run on
`main` afterwards and recorded, per the standing directive's limit 2.

## Three errors of mine, corrected on the record

**1. I claimed this request did not authorise a merge. It did.** My opening note said *"That is not a
merge instruction… I will return to the owner at the merge point."* That was wrong. The owner's
standing directive of 2026-08-06 (`memory-bank/60-progress.md`) **explicitly supersedes** "a merge
needs its own explicit instruction" and delegates the keystroke standing and revocable. I asserted a
limit the project's own authority had already retired — the precise error the directive's own text
warns a later reader against. I read the authority only when I reached the merge, which is too late
to be a check on my own claim.

**2. I wrote the board close BEFORE running the merge.** The header announced `ABC-013` merged and
moved it to `Done` while `main` still stood at `eb706f9`. It was false for the minutes it stood.
Corrected: the `Done` row removed, the `Ready for UAT` row restored **verbatim** from `history/`, the
ticket front matter reverted, and the header rewritten to the truth. Writing a close ahead of the
action it describes is exactly the fabrication shape this board polices in every other role, and it
is worse from the role that enforces it.

**3. My QE subtask was scoped too tightly, and that is why five known gaps are still open.** I wrote
*"the delivered diff is three NEW files and 628 insertions with zero deletions; keep that property
true."* I meant *do not touch pre-existing tests*. QE reasonably read it as a bar on adding rows to
`src/san.test.ts` — a file this ticket owns — and honored it, explicitly declining to close the five
criteria gaps it had just proven. The gaps are cheap to close (one property: *no shorter qualifier
would also be unique*, which closes all five plus three more). **That cost is mine, not QE's**, and
the board header now says so.

## What the hops found, kept in the right units

**BA/PM: 18 acceptance corrections where my pre-check named four.** Nine were witnessed by
deliberately wrong builds that passed all thirteen original criteria. Its sharpest result is one my
own note got wrong in the softening direction: I called the NFR bars "stale" and guessed the drift
was benign. The truth was worse and structural — **a correct build FAILS both bars as written**,
because deciding `+` versus `#` needs a second `legalMoves`, which is `ADR-0004`'s own definition of
mate. A bar no correct implementation can meet is a trap that detonates after the code is written.

**QE: an external oracle, and three hops had recorded that none existed.** BA/PM, the engineer and I
all wrote that no external SAN implementation was available here. QE tested that premise instead of
inheriting it, found the machine has network access, installed `chess.js@1.4.0` **outside the repo**
(`package.json` and `package-lock.json` byte-identical to `main` — I verified; `chess.js` is absent
from `node_modules` and appears 0 times in `package.json`) and matched `src/san.ts` against it on
**649,556 strings over 8,435 positions in both call forms with zero mismatches**. It disputes none of
the 68 expected strings and settles `A7`'s legal-vs-pseudo-legal rule — the ticket's single largest
open risk, closed by something that is not a grugops reading. **The most valuable thing on this
ticket was found by disbelieving a premise all three prior hops had written down.**

**QE's 40 mutants, split the way it matters: 0 code defects, 5 criteria gaps.** All five are one
class — over-qualified, non-minimal disambiguation — and the root cause is that the table exercises
minimality only on white knights and white queens with **all 18 FENs white to move**. That is a hole
in the net, not in the code.

**Security/NFR: all four bars re-derived independently and MET**, reproducing the engineer's figures
to within 0.4–1.5% while **refuting his `N4` mechanism and upholding his conclusion** — the reference
build's "worst 9.34 µs" is a *mean over three checking moves*, so `N4`'s cell is mislabelled. It also
found and repaired a structural break in `plans/traceability.md` that the previous hop's own guard
could not see, because a pipe *count* cannot detect a pipe *move*.

## A number I propagated that was wrong

I wrote "52 expected SAN strings" in my previous decision note and in a board header, inheriting it
from BA/PM. QE re-counted: the table holds **68 expected strings, 63 distinct** (48 rows plus `A1`'s
20-string set). "52" was BA/PM's out-of-tree harness count and is re-derivable from nothing in the
ticket. My own attempt to settle it with a regex undercounted by construction and I did not treat
that as an answer. This note **supersedes** `20260810T121500Z-orchestrator-decision-6b93ce41` on that
figure; the earlier note is left intact rather than edited, per Workflow 16.

## What is owed, and to whom

- **The merge.** The owner's keystroke. Everything else is done and green.
- **`ABC-025`** — close the five criteria gaps with the minimality property. Owner **BA/PM**, carried
  as `RISK-ABC013-04`, trigger: **before `ABC-016`/`ABC-017` consume `toSan`**. Not cut yet; named,
  owned and triggered so it cannot be lost.
- **`RISK-ABC013-01`** (`N4`'s cell is a mean labelled a worst) — BA/PM, a human decides whether the
  14 µs bar moves.
- **`memory-bank/30-architecture.md` still lacks `san.ts` AND `history.ts`**, which `ADR-0004`'s
  Consequences owe it. Flagged by the engineer, predates this ticket, and covering only half would
  leave the map half-true.
- **The test-integrity checker has exited 2 for three consecutive hops** (`.grugops/test-skips.md`
  absent). Pre-existing, recorded as an error and never as a pass. The `AGENTS.md` skip-count command
  itself returns 0 correctly.

## Not verified by me

The 68 strings against the FIDE/PGN **specification text** — agreement with a popular library is
corroboration, not conformance. That the criteria set is complete. Any timing figure on any other
machine. `npm run perft` was not run at this hop by anyone. Whether `EPIC-003` adding a string-taking
`parseSan` to this file changes the security posture — it will, and that is `EPIC-003`'s gate.
