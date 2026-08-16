---
id: 20260816T143000Z-agents-md-scribe-decision-the-owners-word-is-the-in-uat-signature-recorded-in-two-files-c4f1e0d7
kind: decision
by: agents-md-scribe
at: 2026-08-16T14:30:00Z
verified_by: 
confidence: high
refs:
  - memory-bank/60-progress.md
  - AGENTS.md
  - ABC-065
  - ABC-066
  - U1
supersedes: 
---

# The owner's word IS the `In UAT` signature — recorded in the two files that carry authority

**Project owner Olger Oeselg, 2026-08-16, in session, verbatim and complete:**

> *"I accept both, my word is the signature"*

Asked directly by the Orchestrator, from three offered options (his word in session, a file he writes
himself, or a redefinition of the exit), having been told explicitly that **a green agent report
would NOT be treated as his acceptance**.

## What I wrote, and where

1. **`memory-bank/60-progress.md`** — new section, inserted after the 2026-08-15 directive and before
   "Standing directive — read before prioritising anything":
   **`## Standing directive — the owner's word in session IS the `In UAT` signature. 2026-08-16.`**
   It carries the quote verbatim, the date, the question he was answering, and splits the sentence
   into its two separable halves (per-ticket acceptance of `ABC-065` + `ABC-066`; the standing
   ruling), then three limits.
2. **`AGENTS.md` § Test and UAT authority** — the closing paragraph that called the signature
   question *"genuinely open"* and instructed *"Do not resolve it by inference"* is **replaced**,
   because the question was put to the owner and answered. The section's existing correct content is
   preserved: the conduct grant, the two limits (gate binds; authority is the owner's and revocable),
   and that an agent-run UAT is not itself an acceptance signature. It remains a pointer;
   `memory-bank/60-progress.md` is the authority.

## The ruling, as worded

> **The owner's word in session IS this project's `In UAT` exit signature.** Standing, and revocable
> by one sentence like every other authority he has delegated here.

## What this deliberately does NOT do

- **The kit is NOT overridden.** `agent-factory/workflows/06-uat-pack.md` and
  `agent-factory/roles/uat-planner.md` require a **named human's** signoff. The owner **is** that
  named human and he gave it. What was missing was never his authority — only a mechanism to record
  it. This is a **kit requirement SATISFIED**, and both files say so explicitly. It must not be filed
  with the branching model or the deployment posture as a project-overrides-the-kit section.
- **An agent still may not self-sign.** The ruling says the **owner's word** signs. It does not say a
  green agent report signs, and it licenses no agent to sign on his behalf. Both files refuse this
  reading in advance, on the ground that he was told a green report would not count *before* he
  answered.
- **`context.human_admission` is still `off` and he did NOT flip it.** No `finding` is admissible and
  no `human:<name>` stamp exists. The acceptance is therefore an **agent's transcription of his word
  in session, carried as a `decision` note in git** — not a cryptographic stamp. That fidelity level
  is recorded in both files. Flipping the flag is his word to give and is not proposed.
- **Nothing else moved.** `quality.gate_enforcement` still `blocking`;
  `production_requires_human_confirmation` still `true`; merge/deploy posture unchanged. No config
  value, ADR, gate, ticket or board column touched. Scope is the `In UAT` exit signature only.

## Gap `U1` (MEDIUM)

Raised at `uat-ABC-065-2026-08-16` — the `In UAT` exit was **unreachable by construction**, since no
file this project could write would constitute a signature. **Resolved** by the owner naming a
signature this project can actually produce.

## Not repaired (named, not fixed)

- `plans/tickets/ABC-067-…md:219` still lists *"`ABC-065`'s UAT sequencing"* among things *"genuinely
  open … rather than resolved by inference"*. That is a DoR row about sequencing, not the signature,
  and `plans/tickets/` is out of this hop's scope — the Orchestrator owns it.
- The `uat-ABC-065-2026-08-16` notes quote the old `AGENTS.md` wording. Notes are **append-only
  history** and are correctly left as they were written.
- `memory-bank/60-progress.md` § "Next action" still reads *"an agent-run UAT reports a result; it is
  NOT a named human's acceptance signature"*. **That is still true** under this ruling and was left
  alone; the section's board state is the Orchestrator's to update.
