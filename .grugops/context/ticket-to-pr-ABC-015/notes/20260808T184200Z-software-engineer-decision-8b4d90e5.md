---
id: 20260808T184200Z-software-engineer-decision-8b4d90e5
kind: decision
by: software-engineer
at: 2026-08-08T18:42:00Z
verified_by: 
confidence: medium
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - RISK-005
  - src/glyph-mode.ts
  - src/glyph-mode.test.ts
  - plans/tickets/ABC-015-glyph-mode-selection.md
supersedes: 
---

# An EMPTY locale variable counts as UNSET — a behaviour the nine tuples never specify, decided here

Flagged rather than buried, because it is the kind of quiet judgement call that later reads as if the
ticket had asked for it.

## What was underspecified

The signal table says *"the first **set** of `LC_ALL` / `LC_CTYPE` / `LANG`"*. Row 4 fires on **set
and not UTF-8**; row 5 covers **unset or UTF-8**. None of the nine acceptance tuples ever constructs
an **empty** variable, and `LC_ALL=` is constructible in the wild — CI images and shell wrappers set
it. So "set" had to be defined before a line could be written, and the two readings give opposite
answers:

- **literal** (`!== undefined`): `LANG=""` is set and does not match `/utf-?8/i` → **ascii**;
- **POSIX** (empty is null, i.e. unset): fall through to the next variable → usually **unicode**.

## Ruled: empty counts as UNSET, and precedence falls through

Two reasons, and the first is the ticket's, not mine:

1. **This ticket's own rationale for row 4 requires it.** It reads: *"Row 4 tests set and not UTF-8,
   never unset. Unset is the normal Windows case and carries no information; treating it as a
   negative signal would smuggle the platform rule back in through the side door."* An empty
   `LANG=` carries no information either. The literal reading turns a content-free variable into a
   negative signal — the exact move that rationale forbids.
2. **It is what POSIX says**, and what glibc and gettext do: a locale variable that is set but null
   is skipped in favour of the next in precedence.

Confidence is `medium` rather than `high` on purpose: the reasoning is sound but the ticket does not
say it, so this is an inference from an adjacent rationale, not a specification.

## Where it is recorded and who owns it now

Two tests pin it (`falls through an empty variable to the next one in precedence order`, and
`treats all three empty as none set`), the module carries the assumption in a comment at the line
that implements it, and it is flagged on `plans/board.md`, in the ticket's `## Implementation`
section and in `plans/traceability.md`.

**It is not this role's to ratify.** If QE or Security/NFR reads it the other way, the fix is one
condition and two test rows. What must not happen is it passing unnoticed because nine green tuples
made the module look fully specified.
