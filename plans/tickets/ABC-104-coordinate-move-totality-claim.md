---
id: ABC-104
title: `src/coordinate-move.ts`'s header claims total, and it is total over `text` only
status: backlog
column: Backlog
size: XS
priority: P3
epic: EPIC-003
feature: —
---

# ABC-104 — a docblock guarantee one word wider than the behaviour, in the file the next parser gets copied from

> **Cut 2026-08-17 by BA/PM** (task `refinement-abc031-qe-repairs-2026-08-17`) from `ABC-031`'s QE
> gap **5**, `OPEN`, severity **low**. **A ticket rather than a page repair because the defect is a
> comment in production code**, and neither QE nor BA/PM edits `src/`.

## Problem

*User*: the engineer who writes the **third** parser — `ABC-032`'s SAN reader, or `ABC-033`'s
dispatcher — and reaches for this module as the worked example. `ADR-0004` (2a)'s
divergence-from-`parseFen` paragraph is exactly the prose that gets copied by reflex.

*Pain*: **`src/coordinate-move.ts:30` reads *"It is a TOTAL function and does not throw"*,
unqualified, and that is not true of the function.** Measured by QE at the `ABC-031` gate:

- `parseCoordinateMove(null, "e2e4")` → **throws** `TypeError`
- `parseCoordinateMove(position, "e2e4", 42)` → **throws** `TypeError`

**The behaviour is correct and `A4` is genuinely MET** — `A4` scopes totality to `text`, and **0 of
34** hostile text inputs threw, including a 10,000,000-character string, `Symbol`, `BigInt`, a
throwing `toString`, a throwing `Proxy`, lone surrogates and RTL overrides. **The code is right; the
sentence above it is wider than the code.** The caller-obligation paragraph four lines earlier
qualifies it for a careful reader, which is why this is a precision defect and not a defect.

*Value*: the guarantee the next author copies says what it means — **total over `text`**, with
`position` and `legal` a caller obligation. **Cheap now, and it is prose that outlives the module.**

## Scope

- **The docblock of `src/coordinate-move.ts` only.** Qualify the totality sentence to name its
  domain — `text` — and to state that `position` and `legal` are the caller's obligation, in the
  same terms `ADR-0004` clause 2 uses for `toSan` / `parseSan`.

## Out of scope

- **Changing the behaviour.** No guard, no `try`, no widening of totality to `position` or `legal`.
  **`A4` is MET and stays MET;** making the function total over all three arguments would change the
  contract `ADR-0004` clause 2 sets, and that is an ADR question, not a comment repair.
- **Any other module's docblock.** `ABC-032` and `ABC-033` write their own.
- **`plans/tickets/ABC-031-coordinate-move-input.md`.** Repaired separately at the cutting hop.

## Acceptance (Given/When/Then)

- **`A1` (the claim names its domain).** **Given** the repaired docblock, **when** it is read,
  **then** the totality sentence names **`text`** as the domain and does not assert totality
  unqualified, and it states that `position` and `legal` are a caller obligation.
- **`A2` (the two measured throws are still the behaviour, and are now documented as such).**
  **Given** the repaired module, **when** `parseCoordinateMove(null, "e2e4")` and
  `parseCoordinateMove(position, "e2e4", 42)` are called, **then** each still **throws** — the
  contract is unchanged — and the docblock is consistent with that.
- **`A3` (comment-only).** **Given** the delivered diff, **when** `git diff --numstat` is read,
  **then** the only file changed is `src/coordinate-move.ts`, **no executable line changed**
  (`npm run build` output is byte-identical, or the diff is visibly inside the docblock), the suite
  is green with a skip count of **0**, and `PERFT_DEEP=1` is **32/32** exact.

## Dependencies

**Blocked on `ABC-031` merging.** The module does not exist on `main` until it does.

## Security / NFR triggers

- **`N8-LANE`**: **no test file added, no executable line changed.** Expected lane effect **zero**.
  No measurement owed.
- **Security: no trigger.** A comment.

## Test notes

1. **Do not add a test.** There is nothing executable to assert; `A2` is a re-measurement of existing
   behaviour, and `ABC-031`'s `A4` rows already cover the `text` domain.
2. **Quote the measurement in the commit**, so the next reader sees why the word moved.

## Lane cost — how many test FILES this ticket implies

**Zero.**

## Size and priority rationale

**Size `XS` (1).** One docblock sentence. **What would make it larger:** deciding the function
*should* be total over `position` too — that is a contract change and belongs in an ADR, not here.

**Priority `P3`.** Documentation precision on a correct function, with no user-visible effect and no
suite signal. **It is not `P4`/dropped** because the audience is the next parser author and this repo
has already paid twice for prose that was read as a guarantee. **It should ride the next touch of
this file** rather than be pulled on its own.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM, **2026-08-17**.
**Result: 10 of 10 MET. Requesting `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the next parser's author; two measured throws under an unqualified claim |
| 2 | scope and out-of-scope clear | **✅** one docblock; behaviour explicitly fenced out |
| 3 | INVEST-shaped | **✅** independent once `ABC-031` merges, small, testable by reading and by two calls |
| 4 | acceptance testable and measurable | **✅** three criteria; `A3` is diff-shaped with numbers |
| 5 | dependencies known | **✅** one, named and blocking: `ABC-031` merge |
| 6 | security/NFR triggers | **✅** `N8-LANE` zero-file with expected effect zero; security not triggered |
| 7 | test notes present | **✅** two, including an explicit *do not add a test* |
| 8 | size assigned | **✅** `XS` (1), with the condition that would grow it |
| 9 | priority assigned | **✅** `P3`, with the reason it is not dropped |
| 10 | no major unresolved blocker | **✅** none |
