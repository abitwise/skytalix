---
id: 20260819T170000Z-ba-pm-decision-abc043-a5-and-a2-are-satisfiable-as-written-1a2b3c4d
kind: decision
by: ba-pm
at: 2026-08-19T17:00:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-042
  - ABC-037
  - ABC-078
  - ADR-0011
  - ADR-0013
  - ADR-0009
supersedes:
---

# `ABC-043` `A5` and `A2` are SATISFIABLE AS WRITTEN. No criterion is weakened and no ADR moves.

## The ruling

**Both criteria stand exactly as cut.** `A5`'s discriminating requirement is preserved, `A2`'s frame
formula and its `reason: "checkmate"` assertion are preserved, `ADR-0011` clause 4 is untouched —
`src/cli.ts` still exports **nothing**, and this ruling *depends* on it continuing to export nothing.
**Nothing goes to Architect/Design on this question.** The authoritative statement is on the ticket
under `## The ruling on `A5` and `A2`'s testability`; this note records the reasoning and the
refusals, per this project's process rule 2.

## Why the flag was right to be raised and still resolves to YES

Architect/Design flagged (`design-p0-chain-rulings-2026-08-18`) that `A5` asks for a faulty
`EngineSeam` *"through the real entry point rather than through a stub harness"* while the entry point
exports zero symbols, and `ADR-0013` clause 7 handed the criterion question here by name.

**The clause constrains the DRIVER, not the SEAM.** `A5` cannot be asking for a real engine that
really throws — it asks for *"an `EngineSeam` that throws"* and *"one that returns a move
`legalMoves` did not produce"*. Those are constructed faults: **test doubles at the seam, by
definition**. What *"rather than through a stub harness"* forbids is proving them by calling a handler
in-process with a hand-built options bag, because then the exit code and the frame stream are the
harness's rather than the process's. **A double at the engine seam plus a real spawned entry point
satisfies both halves at once.** The real question was never *may the entry point export an injection
point* — it is *can the child be given a different `./engine.ts` with no production line changing*.

**It can. Measured, not reasoned** — see this task's observation note for the four probes, run on
Node **v24.12.0** against a throwaway replica outside the repository. Node's module customization
hooks (`node:module`'s `registerHooks`), loaded into the child with `--import`, substitute the module;
a `data:text/javascript,…` URL carries the hook, so the whole rig is a **string inside
`src/cli.test.ts`** and **no new file exists anywhere**.

## The three candidate shapes, and what happened to each

1. **Spawned-process fault induction without an export — ADOPTED.**
2. **Env- or argv-gated fault injection — REFUSED, and this is the refusal that matters.** It would
   put a fault path *in `src/cli.ts`*: production behaviour a human can reach by setting a variable.
   By `ADR-0013` clause 3's own discriminator (*"exercisable by a human running the delivered
   product"*) that is **not a stub at all** — it is an undelivered feature, needing its own criterion
   and **the owner**. The adopted rig is squarely the other class: only a test can exercise it,
   because a human running `npm run chess` never passes `--import`, and `ADR-0009` clause 9c is
   satisfied because the double lives **in the test file**.
3. **Re-scoping `A5` to what the entry point can be driven through — REFUSED.** Unnecessary now, and
   forbidden by the ticket's own text: a build that catches the throw and reports a chess outcome
   passes every other criterion and must fail this one (`ABC-019` `A10` at the top level).

## `A2` gains a REQUIREMENT it did not have, and it is not a weakening

`A2`'s *"deterministic opponent"* must be the same substituted double, **never the merged search**.
The merged engine is **iterative deepening against a wall clock** (`src/engine.ts:83,305`), so the
depth it reaches — and therefore its move — is hardware and load dependent: a scripted mating line
asserted against it is **flaky by construction**, and at `DEFAULT_BUDGET_MS` = 3 s per engine ply it
would breach `NFR-008`'s 3 s **wall** clause on its own. The criterion already said *deterministic*;
this makes the only way to be deterministic explicit.

## Three limits, so the ruling is not read wider than it is

- **No production line, no export, no flag, no env var in `src/`.** The moment a build needs one, this
  ruling has been left behind and the question goes back to Architect/Design.
- **The rig is licensed for the ENGINE seam under `A2`/`A5` only.** Substituting `./line-input.ts`,
  `./frame.ts` or `./turn-loop.ts` would test the harness instead of the product.
- **`--import` is child-only.** It never enters `npm run chess`, `package.json` or `AGENTS.md`.

## The honest gap this creates, recorded rather than papered over

With `A2` and `A5` both driven by doubles, **no criterion on the page runs the REAL engine end to
end.** That is deliberate — 3 s of wall per ply against a 3 s lane clause — and a real-engine row
belongs in an **opt-in lane** (`ENGINE_DEEP` precedent). **No ticket is cut for it here.**

## Risks

- **The misread to expect:** *"BA/PM licensed module substitution, so mock anything."* The three
  limits above are the answer, and they are on the ticket page too.
- **The first thing the engineer should build is the `A5`-throws child.** If the substitution does not
  take against the real tree, **stop and escalate** — do not reach for an export or an env gate.
