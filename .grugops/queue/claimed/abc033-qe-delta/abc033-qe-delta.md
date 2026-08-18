---
task: quality-gate-ABC-033-delta-2026-08-18
subtask: abc033-qe-delta
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md
ref: .grugops/context/quality-gate-ABC-033-delta-2026-08-18/
parent_ref: .grugops/context/repair-ABC-033-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T16:00:00Z
branch: grugops/quality-gate-ABC-033-delta
base: grugops/abc033-repair @ ab5e102
---

# Subtask: QE delta check on `ABC-033`'s repair — NARROW BY DESIGN

You already gated `ABC-033` and found six gaps. The engineer repaired four of them and a second
engineer audited that repair. **This hop is not a re-gate and it is not a re-litigation.** It exists
because the `G2` fix is a **production behaviour widening that no QE hop has ever looked at**, and I
will not merge a behaviour change on the strength of the people who wrote it.

Branch off `grugops/abc033-repair` @ `ab5e102`. Read `parent_ref:` — eight notes, five inherited
from a hop an API outage killed mid-write and three from the finisher that audited them.

## The ONE question

**`G2` widened what the module accepts. Did it widen anything it should not have?**

The claim to attack: *"widens what is asked, never what is accepted."* The finisher measured, on
its own 12-position / 3073-line corpus: **90 outcomes changed, all 90 `rejected` → `move`, all 90
promotion spellings, 0 `move` → anything else, 0 new `ambiguous`, 0 positions mutated.** A previous
run on a different corpus gave 52/1942 with identical ratios.

**Build your own corpus and try to break that invariant.** The dangerous direction is not a
promotion that now works — it is:

- a previously-`rejected` string that now resolves to a **move the player did not mean**;
- a previously-unambiguous line that now returns `ambiguous`, or the reverse;
- a **legal position mutated** by the resolve path (`toFen` must be byte-identical);
- any input where the fourth variant (lowercase-all + uppercase-last-char) collides with a real SAN
  string that means something else.

That last one is the whole risk of a blind whole-line variant, and it is why I want an adversarial
corpus rather than a confirmatory one.

## The declared residue — confirm it is bounded, do not fix it

`E8=Q+`, `e8=q+`, `E8=q+`, `exd8=q+`, `EXD8=Q+` remain `rejected: unreadable` (`e8=Q+` resolves as
exact SAN). The engineer deliberately left these **unpinned by any test** so a future grammar fix in
`ABC-032` does not fight this file. **Say whether you agree that is the right boundary**, and
whether the residue is what the engineer says it is or larger.

## One flagged-but-unproved claim

The finisher flagged that the **`G5` disjointness argument is not proved** — its corpus found no
counterexample, but the note carries `confidence: high` on a claim over all strings. **Say whether
that confidence is earned.** You do not have to prove it; you have to say whether the record
overclaims.

## Explicitly OUT of scope — do not spend a minute here

- `G1` / the seven-knight overflow. Cut as `ABC-107`, merged to `main`, `EPIC-002`'s.
- `A4`. Falsified, re-scoped by BA/PM, on `main`. Not yours to re-open.
- `NFR` bars, `ABC-050`'s lane contamination, `ABC-032`'s grammar.
- Re-running the whole mutation battery. The finisher re-ran M6/M11/M12 with diffs and they red
  5 / 3 / 1. **Spot-check one of the three and move on.**

## Fences

You do not fix. Do not weaken a guard. Do not merge, do not deploy, do not move a board column.

## Gate

Confirm the tip still gates green in a contained lane (baseline **1047 tests / 36 files, skip 0**)
and that `A7` still holds — `git diff --stat 8c84265..HEAD -- src/` shows only `src/move-input.ts`
and `src/move-input.test.ts`. Do not chase the contaminated repo-root run (`ABC-050`).

**Commit incrementally.** An outage killed two hops today with everything saved to the end.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/abc033-qe-delta`.

Commit on `grugops/quality-gate-ABC-033-delta`, never on `main`.
