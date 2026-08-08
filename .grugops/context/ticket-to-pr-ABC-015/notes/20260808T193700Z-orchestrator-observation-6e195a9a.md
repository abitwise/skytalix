---
id: 20260808T193700Z-orchestrator-observation-6e195a9a
kind: observation
by: orchestrator
at: 2026-08-08T19:37:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - src/glyph-mode.ts
  - plans/tickets/ABC-015-glyph-mode-selection.md
  - plans/board.md
  - NFR-007
  - EPIC-006
supersedes: 
---

# BA/PM's spec hop verified — the criteria are settled and the gate can now be spent

## Checked, not inherited

| Claim | Verified |
|---|---|
| `src/` untouched | `git diff --stat 2168406..HEAD -- src/` **empty** |
| suite unchanged | `npm test` **277/277, 13 files**; lint/typecheck/build exit **0**; tree clean |
| ticket did not move | frontmatter `column: In Security/NFR`; board `## In Security/NFR (WIP 1/2)` |
| criteria count | **15** `**Given**` bullets, machine-counted — matches BA/PM's "12 tuples + 3 session" |

**No renumbering happened**, so every existing citation across the notes — QE's *"dies to criterion
11 alone"* among them — is still true. That was worth checking: renumbering criteria after three
roles have cited them is how a correct audit trail turns into a misleading one.

## What this hop actually produced

BA/PM upheld all three items **against their own morning's work**, added a fourth they found
themselves, and — the one that could have changed code — **ratified** the empty-locale reading on
evidence rather than deference: they ran `env -i LC_ALL= LANG=en_US.UTF-8 locale` **on this machine**
and observed the empty variable fall through while `LC_ALL=C` wins.

That matters to this role's routing decision. This role put BA/PM **before** the gate specifically
because item 3 could invalidate a gate run against it. **The risk did not materialise, and the order
was still right** — the reason to settle a spec before spending a gate is not that it will change,
it is that nobody could say it wouldn't.

**Every amendment ratifies what was built**, each new criterion pinned by a test that already exists
and passes. Nothing is owed back to the Engineer or QE except one cosmetic re-labelling that is
QE's.

## Three counts have now been wrong on this one ticket

The Orchestrator's "nine tuples" (was eight-plus-one), the Engineer's traceability cell count (the
pipe was escaped), and BA/PM's own "sixteen notes" (its own itemisation summed to seventeen). **Each
was caught by a different role and each was corrected in place with the correction recorded.** None
reached the gate. Named here because it is the pattern that has done the most work on this ticket,
not because any one of them was serious.

## What the gate is being asked to do

`security.asvs_level` is **L1**, `security.block_on` is **high**, `compliance_regime` is `[]` — so
**no Compliance Officer hand-off is owed**. Two things this role explicitly does not pre-decide:

- **The ticket's "no security trigger" claim is NOT ratified here.** This module reads
  `process.env` — a real ambient data source — and `ABC-014`'s gate corrected exactly such a claim
  rather than accepting the ticket's wording. Re-deriving it is the gate's.
- **`NFR-007`'s zero-filesystem / zero-process bar is NOT taken from the delivered guard.** QE
  widened that guard after finding it blind to `node:fs/promises`. A guard that was already wrong
  once is a thing to re-derive, not to cite.

On UAT: every ticket in this project has deferred it to `EPIC-006`, and `ABC-014` deferred it
**explicitly rather than passing it** because zero importers and no CLI entry point mean a human can
exercise nothing. `ABC-015` has the same shape. The gate should rule that honestly; a pass would be
a fabrication.

## Next action

Security/NFR gates `ABC-015` and owns the `In Security/NFR` exit.
