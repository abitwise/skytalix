---
id: 20260817T113000Z-orchestrator-observation-gate-re-run-and-both-mutants-reproduced-2e70b9c5
kind: observation
by: orchestrator
at: 2026-08-17T11:30:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-061-resolver-accepting-path-asserts-only-ok.md
  - src/cli.test.ts
  - src/cli-options.ts
  - 74900e79a00caafa1ddfb1622c565c1a1b1ca938
supersedes: 
---

# `ABC-061` — the gate re-run BY ME, and BOTH MUTANTS REPRODUCED BY ME

The engineer is the party with an interest in the answer. On this ticket that matters more than
usual: `A1` and `A4` are **RED/not-RED verdicts about a mutation**, and a verdict is exactly the kind
of claim that cannot be audited from a diff. So I ran them. Branch tip `84f8ed9`, delivered `74900e7`.

## The mutants, run in a throwaway worktree OUTSIDE the repository, then removed

`src/cli-options.ts:153` is byte-exact as the page quotes it, so both mutants were applied verbatim.

| tree | `flags: { ascii: false, unicode }` (`A1`) | `flags: { ascii, unicode: false }` (`A4`) |
|---|---|---|
| **pre-guard** (`main`'s `src/cli.test.ts`) | **861/861 GREEN** — the witness reproduces | **2 failed / 859 passed of 861** — already red |
| **with the guard** (delivered) | **RED — 1 failed / 862 of 863**, the failure is `ABC-061 A2` | **RED — 3 failed / 860 of 863**, `ABC-061 A2` among them |

**`A1` — MET, and the falsifying witness is confirmed at first hand.** A one-word production change
ships a fully green suite before this ticket and reds after it. That is the entire argument of the
page, and it is now measured rather than quoted.

The worktree was checked clean (`git status` empty after revert) and removed. **No mutant was ever
committed and the repository tree is clean.**

## `A4` was ALREADY SATISFIED BEFORE THE TICKET STARTED — a criterion defect, and MY MISS

`A4` says: *given the `unicode: false` mutant, then the suite is RED.* **On `main`, before any work,
that mutant already produced 2 failures** — `A7` (`--unicode` on a pipe) and `A4` (colour from the
human's side), both from the spawned `white` child, which carries `--colour white --unicode`.

**So `A4` as written was vacuous: it could be reported MET by doing nothing.** The criterion's own
prose knows this — it says `--unicode`'s wiring "is pinned today only by the byte-exact `white`
child… this pins it at the resolver, alone" — but the **Given/When/Then it actually states** asks
only for RED, which was already true.

Two things follow and I am recording both plainly:

- **The engineer did the real work anyway and disclosed the gap unprompted.** It reported the
  pre-existing 2 failures rather than presenting "RED" as its own achievement. That is the behaviour
  this factory wants, and it is the reason the defect is visible at all.
- **My rule-1 criteria re-read at the pull MISSED this.** I checked six things against the built
  tree and did not check whether `A4`'s stated condition was already true. **A vacuous criterion is
  precisely what that review exists to catch, and this one was catchable — it needed one mutant run,
  which I only performed after delivery.** Recorded as a miss of mine, not a defect of the ticket's
  author, and it belongs in the next retro's input: *the review reads criteria against the tree, but
  does not yet run the criteria that are RUNNABLE.*

The delivered guard fires at the resolver alone, which is the work `A4` meant to buy. **Verdict: the
INTENT is MET and measured; the criterion AS WRITTEN was already met on arrival.**

## The gate, on the branch tip

| gate | result |
|---|---|
| `npm run lint` | `Checked 54 files in 91ms. No fixes applied.` exit 0 |
| `npm run typecheck` | no output, exit 0 |
| `npm run build` | no output, exit 0 |
| `npm test` | `Test Files 30 passed (30)`, `Tests 863 passed (863)`, `src/cli.test.ts (36 tests)` |
| skip count | **0** |
| test integrity | `No findings.` exit 0 |

Baseline measured by me in the mutant worktree before mutating: **863** with the guard, **861** on
`main` without it — +2 tests, which is the two new `it` blocks and nothing else.

## Scope and the remaining criteria, re-measured from git

- **`A6` — ONE path.** `git diff --name-only 74900e7~1 74900e7` excluding `.grugops/` is exactly
  `src/cli.test.ts`. **0** non-test files under `src/` ⇒ **zero production lines**. `spawned` still
  **10** (now at `:933`).
- **`A5` — MET, verified by `cmp`, not by hash comparison with the engineer.** I extracted the
  `it("A6(i) — every documented spelling resolves in its legal argv position")` block from `main` and
  from the delivered tree independently: both 12 lines, both SHA-256 `d0875c23f8b5a245…`, and `cmp`
  reports them **byte-identical**. `src/cli-options.ts` is absent from the diff entirely, so
  `ACCEPTED_ARGUMENTS` is untouched. **The block was protected by IDENTITY; the page's `:359` was
  correctly ignored.**
- **`A2` — 6 of 6 by value, 0 by `.ok`.** Read: five deterministic rows compare
  `resolution.options` whole via `toEqual`; `.ok` appears only as a narrowing `throw`, never as an
  assertion. **The `.options`-not-the-result trap named in my pull note was avoided**, and the
  comment at the site says why in the engineer's own words.
- **`A3` — MET, and non-vacuous by construction.** The expectation table is the TEST's own; only
  *which row* applies is read off the build, and the whole object is compared. A build returning
  `black` with `white-bottom` reds. One call, no seeding, no 1000 iterations — Test note 3 honoured.

## The style trade, ratified

`toEqual` rather than `toStrictEqual`, on coding rule 11 (match existing style). **Verified: `src/`
contains 0 uses of `toStrictEqual` and 263 of `toEqual`.** The trade is real — `toEqual` would not
red on a newly-added `undefined` field — and it is the right call at this repo's consistency bar.
Recorded so a later hop that wants strictness changes it deliberately, everywhere, rather than here.

## A clerical error OF MINE, caught by the engineer

The queue file I wrote said `base: main @ 86594fb`; `main`'s tip was already `a1f3643` because I
wrote the queue file before merging the pull commit. **The engineer noticed the contradiction with my
activation message, diffed the two (`board`/`context`/`queue` only, no `src/` change), branched off
`a1f3643`, and recorded the resolution instead of silently picking one.** Correct handling. **The
error was mine: write the queue item AFTER the board merge, or name no sha at all.**

## Verdict

**`A1`, `A2`, `A3`, `A5`, `A6` MET and independently verified. `A4`'s intent MET and measured; the
criterion as written was already met before the ticket began, which is recorded above as my miss.
Gate green on the branch tip. NOT merged — the UAT question is the owner's and is being asked.**
