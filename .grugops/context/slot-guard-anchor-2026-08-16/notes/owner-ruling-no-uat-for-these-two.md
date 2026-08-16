---
type: decision
task: slot-guard-anchor-2026-08-16
author: Orchestrator (transcribing the owner)
date: 2026-08-16
subject: the owner's UAT ruling for ABC-067 and ABC-071 — scope is THESE TWO TICKETS
---

# The owner ruled: merge without UAT. His words, and their exact reach.

## What he was asked

He was given a real choice, both branches named, with the recommendation and its grounds stated:

> *"**merge these to `main` and close them as `Done` without a UAT pass, on the grounds that there is
> no user-facing behaviour to accept?** Or would you rather they take the full `Ready for UAT` →
> `In UAT` route and get your word like the last two did?"*

## What he answered, verbatim

> **"merge them without UAT, no user-facing change"**

He took the first option and **restated the reason in his own words** rather than merely assenting to
mine. That matters: the ground of the ruling is his, not a rationale I supplied and he waved through.

## What this ruling IS

- **Authority to merge `ABC-067` and `ABC-071` to `main` and close them `Done` without an `In UAT`
  pass.** Named tickets, this hop.
- **A ruling on scope, not on rigour.** He did not soften a gate. `quality.gate_enforcement` is still
  `blocking`, the gate was green on the branch tip before the merge and is re-run on `main` after,
  and both results are recorded.

## What this ruling is NOT — and this is the misreading to expect

**It is NOT a standing directive, and I am deliberately not filing it as one.**

He ruled on **two named tickets** with **a reason attached**. He did not say "standing", he was not
asked for a policy, and he was not offered one. The reason he gave — *no user-facing change* — is
obviously generalisable, and **that is exactly the temptation**: a future hop will want to read this
sentence as *"the owner ruled that zero-production-line tickets skip UAT"*. **He did not rule that.**
Turning one sentence about two tickets into a project policy would be inventing authority he never
gave, which is the same failure mode the board already names for the `In UAT` signature ruling.

Consequently:

- **This note is NOT copied into `memory-bank/60-progress.md` § Standing directives**, where the
  2026-08-06, 2026-08-15 and 2026-08-16 standing grants live. It stays here, with its task.
- **It is NOT added to `AGENTS.md`.** No project rule changed.
- **The next zero-production-line ticket asks him again.** It is one sentence to ask. If he wants a
  standing rule he can give one, and then it goes in `60-progress.md` with his words — as the others
  did.

## Fidelity of this record — unchanged from every other acceptance here

`context.human_admission` is **`off`** and he did not flip it. There is **no `human:<name>` stamp**,
**no `finding`**, and **no `§14-gate` verdict**. This is a hand-authored `decision` note carrying an
agent's transcription of the owner's word in session, preserved in git. That is the same fidelity
level as his `ABC-065`/`ABC-066` acceptance, and it should be described that way and no higher.

**Note the difference from those two, because it is real:** on `ABC-065`/`ABC-066` his word WAS the
`In UAT` exit signature — the kit's named-human requirement satisfied. Here there is **no signature at
all**, because there is **no UAT**. He waived the step for these tickets rather than signing it.
**Do not record this as a UAT that passed. No UAT was conducted.**
