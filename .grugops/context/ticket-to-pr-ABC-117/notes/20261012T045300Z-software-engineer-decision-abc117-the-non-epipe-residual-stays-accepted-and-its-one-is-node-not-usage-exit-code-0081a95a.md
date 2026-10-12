---
id: 20261012T045300Z-software-engineer-decision-abc117-the-non-epipe-residual-stays-accepted-and-its-one-is-node-not-usage-exit-code-0081a95a
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-117
at: 2026-10-12T04:53:00Z
verified_by:
confidence: high
refs:
  - ABC-117
  - ABC-115
  - ADR-0016
  - A10
  - A1
  - A2
  - 20260821T033000Z-ba-pm-decision-the-non-epipe-exit-one-collision-is-a-knowingly-accepted-residual-with-a-named-trigger-8a4b2e69
supersedes: 20260821T033000Z-ba-pm-decision-the-non-epipe-exit-one-collision-is-a-knowingly-accepted-residual-with-a-named-trigger-8a4b2e69
---

# THE NON-`EPIPE` RESIDUAL STAYS ACCEPTED, WITH ITS TRIGGER — AND ITS `1` IS NODE'S, NOT AN ASSIGNMENT OF `USAGE_EXIT_CODE`

This note supersedes BA/PM's `…8a4b2e69` (`rule-ABC-115-residuals-2026-08-21`) for one reason only: two
of its clauses state a mechanism the build does not have (`ABC-117` sites S1 and S2). Superseding folds
the whole of that note out of replay, so **everything it ruled is carried forward below in its own
words**, and only the two clauses are corrected. That file is not edited.

## (iv) Not a re-opening

**The residual is NOT re-opened.** It stays knowingly accepted, its trigger is unchanged, `ADR-0016`
clause 3's *"behaves exactly as it does today"* stays true, and `A10` is not touched. This note proposes
no wider arm and grades nothing. What it changes is the record's account of *how* the `1` arises.

## (i) The corrected mechanism — S1

The superseded note said, of the read-only-fd run: *"`1` is `USAGE_EXIT_CODE`."* **The exit status is
`1`, but nothing assigns `USAGE_EXIT_CODE` on this path. The `1` is Node's default status for an
unhandled exception**, which only collides with `USAGE_EXIT_CODE`'s value. Measured at this hop
(Node v26.11.0, `main` @ `3537fe48`, readings in this task's `observation` note `…5d86529e`):
`node src/cli.ts 1</dev/null </dev/null` exits `1`, with **0** `usage:` lines on stderr (a refused
command line prints 1 on the same instrument, and `USAGE_EXIT_CODE` is assigned only after that line
is written) and **0** `internal error` lines (so `main`'s `catch` did not run either). Stderr is Node's
uncaught-exception banner, caret on the re-throw at `src/cli.ts:160`.

*(The cut page and QE's note cite `grep -c "Usage"` as the first zero. That pattern reads 0 on the
refusal path as well, because the line is lower-case `usage:`. The zero that decides it is the
`usage:` count above.)*

## (ii) What a hop routing non-`EPIPE` to `70` must know — S2

The superseded note said: *"A future ticket routing non-`EPIPE` to `70` leaves `A10` green and needs no
re-cut of this page."* **True as far as it goes, and incomplete.** Such a hop **cannot do the routing
with a `try`/`catch`**: the stream emits `'error'` on a later tick, so the re-throw at
`src/cli.ts:160` fires with no `try` on the stack, and `main`'s `try`/`catch` (`:169`-`:193`) cannot
reach it. Reproduced at this hop outside the product with QE's script (`…d2c79dc9`): `CAUGHT:` never
printed, exit `1`. **The outcome would have to be carried in the error arm at `:160` itself.** That is
a fact about a ticket nobody has cut, stated so it is not mis-designed; it is not a proposal to cut it.

## (iii) The acceptance ruling and its named trigger, in the original's own words

Carried forward verbatim from `…8a4b2e69` (lines 24-49), nothing altered:

> **This is accepted knowingly. It is NOT a criterion failure and NOT a defect of the delivery.**
> `## Out of scope` scopes this ticket to the `EPIPE`-shaped Given, `ADR-0016` clause 3 chose *"behaves
> exactly as it does today"* for every other errno **on purpose**, and `A1`/`A2` are written against
> that Given. A hop reading this note as a reason to re-open the exit code is reading it wrong: **I did
> not re-open `ADR-0016`, I did not propose a wider arm, and I did not grade the delivery down.**
>
> **Why accepting is defensible today.** No non-`EPIPE` stdout failure has ever been observed on this
> product outside a deliberately constructed probe; the ordinary shapes — `| head`, `| less` + `q`, a
> closed pager — are all `EPIPE`, and `EPIPE` is the one this ticket fixes. Widening the arm now would
> mean deciding what `ENOSPC` and `EIO` owe the shell, which is a fourth-code question (`## Ruling` 4
> sent that class to Architect/Design and the owner) and a different ticket's value.
>
> **The accepted risk in one sentence, so nobody has to reconstruct it:** on a genuine failed stdout
> write that is not `EPIPE`, this product prints a stack that discloses its checkout path and returns
> `1`, which a shell cannot tell from a refused command line.
>
> **`A10` is deliberately shaped so this can be closed later without touching it** — it asserts
> *non-zero and non-empty*, never `1`. A future ticket routing non-`EPIPE` to `70` leaves `A10` green
> and needs no re-cut of this page.
>
> **What would make it a cut, pre-registered so it is not a silent inheritance:** a real non-`EPIPE`
> stdout failure observed outside a probe, **or** any hop, gate or script measured taking a wrong
> routing decision off this path's `1`. That is the same trigger shape `## Priority` already carries
> for `P0` promotion. **Until one fires, it stays a written-down residual and not a ticket** — this
> board already carries three items that went unowned by drifting, and this one is owned by being
> written down with a trigger.

The rest of the superseded note's opening (lines 19-22) also stands except for the corrected sentence:
the read-only-fd run exits `1` with a raw Node stack naming the absolute checkout path (1507 bytes then,
1148 at this hop), and the path disclosure `A1` closes on the `EPIPE` path still exists off it. The
`A10` paragraph quoted above stands, read together with (ii).
