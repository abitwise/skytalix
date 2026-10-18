---
id: 20261018T103417Z-architect-design-decision-adr-0044-accepted-d13-private-unlicensed-tables-attributed-fe0a5538
kind: decision
by: architect-design
task: arch-adr0044-accept
at: 2026-10-18T10:34:17Z
verified_by:
confidence: high
refs:
  - ADR-0044
  - EPIC-007
  - ABC-169
  - ABC-172
  - src/evaluate.ts
  - tools/grugops/
  - memory-bank/50-decisions/ADR-0044-the-engine-speaks-uci-through-a-second-entry-point-over-the-unchanged-core.md
  - .grugops/context/wave-2026-09-25/notes/20261018T113000Z-orchestrator-decision-owner-word-engine-private-adr0044-epic007-accepted-c3e81a57.md
  - .grugops/context/arch-licence-eval/notes/20261018T101627Z-architect-design-decision-agpl-3-0-or-later-tables-credited-kit-files-stay-mit-15c4fd4e.md
supersedes: 20261018T101627Z-architect-design-decision-agpl-3-0-or-later-tables-credited-kit-files-stay-mit-15c4fd4e
---

# ADR-0044 is ACCEPTED (2026-10-18, owner). D13 is rewritten to private: `UNLICENSED`, no LICENSE, tables kept with an attribution comment

This records the owner's word (note `…c3e81a57`). It is not legal advice. `ADR-0044` is authoritative,
and this note holds one line per decision. It supersedes `…15c4fd4e` on the licence choice only. That
note's evidence stays valid as the record of the option that was not chosen.

## Decision

- **Status.** `ADR-0044` is **accepted** 2026-10-18 by the owner, as revised. It is recorded in
  § Status the way `ADR-0038` was recorded: an `accepted` line first, with the earlier `proposed` text
  kept under "Previously". The ADR also gains the peers' frontmatter (`kind: adr`, `id: ADR-0044`).
- **D13: private, all rights reserved.** `"private": true` (already set) and `"license": "UNLICENSED"` in
  `package.json`. No `LICENSE` file and no `NOTICE` file. `ABC-169` is re-scoped to make that edit.
- **The kit files.** The four kit files (`reference-check.js`, `test-skip-integrity.js`,
  `uat-spec-integrity.js`, `host-protection.js`) stay MIT and keep their notice. At `50e081fc` none of
  them carries the MIT text, so the exact notice is `UNKNOWN - verify`. It is the kit's to supply, and it
  blocks nothing.
- **The tables.** The Michniewski tables stay as they are, with an attribution comment in the
  `src/evaluate.ts` header. The wording is in D13. This follows the Orchestrator's default reading, and
  the owner may correct it.
- **Distribution precondition.** Before any distribution of the engine to third parties (a bundle, a
  binary, `npm publish`, or a handed-over `dist/` or clone), our own evaluation values must be re-derived.
  That ticket is cut only on the owner's word.
- **Owner questions.** Q14 is answered: `npm run chess` keeps its name. Q15 is moot. Q12–Q15 are marked
  answered in a new table.
- **Withdrawn.** The AGPL "Source" link advice (the evaluation's item 4).
- **Kept.** The AGPL-3.0-or-later evaluation is kept in D13 as a dated "considered, not chosen"
  subsection, as the starting point if the owner later opens the licence.

## Scope and risks

- Records only. The only diff is `ADR-0044` and this note. `src/`, `tools/`, `package*.json`,
  `vitest.config.ts` and `plans/` are not touched, and no test was run.
- `UNKNOWN - verify`: whether a web player's moves reaching a privately hosted engine could count as
  "sharing" the CC BY-SA tables. Re-deriving the values removes this risk.
- *Clock note:* this host's UTC clock read `10:34:17Z`, while the owner-word note it answers is stamped
  `11:30:00Z`. The same skew was flagged by `…15c4fd4e`. The `refs` give the true order.
