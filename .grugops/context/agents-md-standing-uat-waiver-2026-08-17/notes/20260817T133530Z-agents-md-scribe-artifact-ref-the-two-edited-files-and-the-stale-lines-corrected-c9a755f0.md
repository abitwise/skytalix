---
id: 20260817T133530Z-agents-md-scribe-artifact-ref-the-two-edited-files-and-the-stale-lines-corrected-c9a755f0
kind: artifact-ref
by: agents-md-scribe
at: 2026-08-17T13:35:30Z
verified_by:
confidence: high
refs:
  - AGENTS.md
  - memory-bank/60-progress.md
supersedes:
---

# The artifacts this hop produced — two files, and exactly what changed in each

## `memory-bank/60-progress.md` — THE AUTHORITY

One new section added, nothing else in the file touched:

> `## Standing directive — a ticket whose delivered diff carries ZERO PRODUCTION LINES has its UAT WAIVED, standing. 2026-08-17.`

Placed after "Standing directive — the owner's word in session IS the `In UAT` signature.
2026-08-16." and before "Standing directive — read before prioritising anything", matching the
file's existing newest-directives-together ordering. Six numbered parts: the verbatim quote and the
two-clause split; what the rule is; the git-measured criterion; the four limits; how it composes
with 2026-08-16 (a table — who signs vs which tickets need no signing); the precedence reasoning;
and the two-authorities close-out for `ABC-063` / `ABC-064`. Closed with a "what this entry does NOT
do" paragraph in the shape the 2026-08-15 and 2026-08-16 entries use.

## `AGENTS.md` § "Test and UAT authority" — THE POINTER

Four surgical edits, all inside that one section. Nothing else in the file changed.

1. **New pointer paragraph** stating the rule, the measured criterion with the exact command, the
   any-production-line boundary, "a waiver is not a signature", the compose-with-2026-08-16 line,
   the override verdict, and the section name in `memory-bank/60-progress.md` that holds it.
2. **A stale line corrected.** *"Every ticket CLOSED to date deferred UAT to `EPIC-006`"* was no
   longer true — `ABC-065`/`ABC-066` were accepted by the owner and five tickets were waived. Now
   reads *"Tickets closed before `ABC-042` all deferred UAT to `EPIC-006`"*.
3. **The precedence paragraph disambiguated.** Its *"this is NOT one of this project's kit
   overrides"* still refers to 2026-08-16 and is still correct; a sentence now says the 2026-08-17
   waiver IS one and points at `memory-bank/` for the reasoning rather than restating it. The
   sentence opening that paragraph was made explicit — *"The 2026-08-16 answer SATISFIES the kit's
   requirement"* — so the two verdicts can never attach to the wrong directive.
4. **The closing authority pointer** now names all three `memory-bank/60-progress.md` sections
   (2026-08-15, 2026-08-16, 2026-08-17).

## Untouched, deliberately

`plans/board.md`, `plans/traceability.md`, the ticket pages, `src/`, `.grugops/factory.config.json`,
and everything under `agent-factory/` (read-only KIT).
