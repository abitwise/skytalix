---
id: 20260806T201000Z-agents-md-scribe-decision-50e5913f
kind: decision
by: agents-md-scribe
at: 2026-08-06T20:10:00Z
verified_by: 
confidence: high
refs:
  - agents-md-branching-model
  - AGENTS.md
  - memory-bank/60-progress.md
  - .grugops/factory.config.json
supersedes: 
---

# `AGENTS.md` carries the branching model as a POINTER, and the false safety line is replaced rather than deleted

## What was decided, and the one thing it is not

The owner's directive of 2026-08-06 is recorded in `memory-bank/60-progress.md` § *"Standing
directive — the branching model, and who turns the merge key"*. **That section is the authority and
this hop did not re-decide any part of it.** What was decided here is only *how much of it belongs
in the substrate file every agent loads*, and the answer is: the rule and its three limits in
compressed form, plus a named pointer — never the reasoning, which already exists once.

`AGENTS.md` gained a `## Branching model` section between `## Delivery` and `## Safety rules`.
Placement is not decorative: branching is delivery mechanics, and a reader who has just read where
the board and the trace live is in the right frame for where work lands. It sits immediately above
`## Safety rules` because the two now cross-reference each other.

## The false line, and why it was replaced in place

`## Safety rules` read:

> `- Never merge a protected branch. Never deploy prod without human confirmation.`

The first sentence is **false for this project as of 2026-08-06** and contradicts the owner
directly. The second is still true. Deleting the whole line would have taken the deploy limit down
with it, so the line was **split into two bullets** — merge, now authorized standing with the gate
condition attached; deploy, unchanged and stated as *not* implied by merge approval.

The three unchanged limits are carried **by reference, not by restatement**: deploy excluded
(`production_requires_human_confirmation: true`), the gate still binds
(`quality.gate_enforcement: blocking`, run on the tip before and on `main` after, record both), and
the authority is the owner's and revocable. Each is one clause pointing at
`memory-bank/60-progress.md`. A second full copy of that reasoning in `AGENTS.md` is precisely the
second document that would later disagree with the first.

## The config was NOT edited, and that is the decision rather than an omission

`.grugops/factory.config.json` still reads `autonomy: "pr"`. The kit defines `pr` as *"branch +
open a PR (agents never merge)"* (`agent-factory/config/factory.config.md:14`, read at this hop).
The dial admits only `diff` / `branch` / `pr`, **no value expresses "agents may merge", and no
`branching_model` key exists.** Adding either would put a control in the first file every role reads
that nothing reads back and nothing enforces — a fake dial, and the exact
two-documents-disagree shape this project spent 2026-08-04 untying out of `ABC-015`.

So the trap is **named in `AGENTS.md` as visible prose**, not hidden in an HTML comment: a reader
who finds `autonomy: "pr"` is told in the same file where the real authority lives. It was drafted
as a comment first and changed deliberately — the reader this line protects is the one skimming
rendered markdown, who never sees a comment.

## What was deliberately NOT touched

The 12 coding rules, the Mission, `## Kit vs state`, `## How to work here`, every command slot
(including every `UNKNOWN - verify`), `## Stack`, `## Definition of ready / done`, `## Memory bank &
plans` and `## When uncertain`. **No command was added at this hop** — a merge or branch command
stated here would have to be run first to be honest, and the branch guard's `git switch -c` is
already the single source in `agent-factory/_commit-convention.md`. Restating it would be the
duplication this role exists to remove.

Total diff: one file, additive except for the single false line it replaces.
