---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-18T10:30:00Z
sealed: false
refs: [EPIC-007, ADR-0044]
---

# Owner word, 2026-10-18: Q12 is AGPL-3.0, and Q13 renames to skytalix

The owner's reply, verbatim:

> *"Q12: AGPL v3 if possible, grugops has MIT license. Evaluate if it is ok to use the evaluation tables and reference them and still use
> AGPL v3 for the built software. ; Q13: rename yes."*

- **Q12.** This supersedes the Q8 reading of GPL-3.0. The licence is **AGPL-3.0**, "if possible".
  - (b) The kit files in `tools/grugops/` are MIT, per the owner. They stay MIT, with their notice kept.
  - (a) The Architect evaluates whether the Michniewski tables (Chess Programming Wiki, CC BY-SA 3.0) can be used and credited under an AGPL-3.0 build.
  - (c) Whether to use `-only` or `-or-later` is still not stated. The default is `AGPL-3.0-or-later`, and the owner may correct it.
  - This is a licence evaluation, not legal advice. The owner makes the final call.
- **Q13.** Yes: rename the package, the repo and the terminal game to `skytalix`.
  - BA/PM cuts this as its own ticket.
  - Renaming the repo directory or a remote is the owner's job, because humans hold the repo and deploys. The ticket covers in-repo names only.
