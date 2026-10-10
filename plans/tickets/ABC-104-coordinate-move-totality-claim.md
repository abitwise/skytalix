---
id: ABC-104
title: `src/coordinate-move.ts`'s header claims total, and it is total over `text` only
status: in-review
column: In Review
size: XS
priority: P3
epic: EPIC-003
feature: —
---

# ABC-104 — a docblock guarantee one word wider than the behaviour, in the file the next parser gets copied from

> **Cut 2026-08-17 by BA/PM** (task `refinement-abc031-qe-repairs-2026-08-17`) from `ABC-031`'s QE
> gap **5**, `OPEN`, severity **low**. **A ticket rather than a page repair because the defect is a
> comment in production code**, and neither QE nor BA/PM edits `src/`.
>
> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-batch-2-2026-10-10`)
> at wave tip `f76e041`. **The premise holds; nothing fixed it.** `src/coordinate-move.ts` has one
> commit (`c59e1e8`, 2026-08-17), and the sentence is still at `:30`. Both throws were re-run on
> Node v26.11.0: `null` position → `TypeError`, `legal = 42` → `TypeError`. **The audience has
> moved:** the two "next parser" tickets are `Done`. `ABC-032`'s `src/san.ts:219-221` scoped its
> own totality to `text` correctly without copying this sentence, so the harm the page predicted
> did not happen. The remaining reader is a maintainer. `A3`'s build clause was vacuous
> (`npm run build` is `tsc --noEmit` and emits nothing) and is re-worded. **DoR 10/10 → `Ready`,
> `P3`, and pull it LAST.** See § Size and priority for the UAT cost.

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
- **`A3` (comment-only; re-worded 2026-10-10).** **Given** the delivered commit, **when**
  `git diff -U0 <commit>~1 <commit>` is read, **then** the only file changed is
  `src/coordinate-move.ts`, **every hunk lies inside the module header docblock** (lines 1–33 at
  `f76e041`), the suite is green, and the skip count is **0**. *(Was: "`npm run build` output is
  byte-identical", but that command is `tsc --noEmit` and emits nothing. Also "`PERFT_DEEP=1`
  32/32", but a docblock in an input parser cannot move a perft count. Both dropped as vacuous.)*

## Dependencies

~~**Blocked on `ABC-031` merging.**~~ **`ABC-031` — `Done`.** None open. No in-flight branch and no
open ticket touches `src/coordinate-move.ts` (checked 2026-10-10, including `ABC-129`'s 15 sites).

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
suite signal. **It is not `P4`/dropped:** the sentence is still false as written, and this repo has
already paid twice for prose that was read as a guarantee. The "next parser author" it was written
for has come and gone (2026-10-10), which is why it does not rise. **It should ride the next touch
of this file** rather than be pulled on its own.

**UAT cost, stated before anyone pulls it (2026-10-10).** The standing zero-production-lines waiver
is measured as `git diff --name-only … | grep -v '\.test\.ts$' | grep '^src/'`, which must be empty.
That command lists `src/coordinate-move.ts` even for a comment-only diff. **So this ticket is NOT
waived: it needs the owner's word at `In UAT` for one docblock sentence.** Pull it only alongside
another ticket that already needs his word, or as a ride-along.

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM at `f76e041`. Result: 10 of 10 — MET → `Ready` (`P3`, pull last).**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the sentence at `:30` is unchanged; both throws re-measured; the audience is now a maintainer, stated |
| 2 | scope and out-of-scope clear | **✅** one docblock; behaviour fenced out |
| 3 | INVEST-shaped | **✅** independent (`ABC-031` `Done`, no overlap with any open or in-flight work), small, testable |
| 4 | acceptance testable and measurable | **✅** `A3` re-worded to a hunk-location check; the two vacuous clauses dropped |
| 5 | dependencies known | **✅** none open |
| 6 | security/NFR triggers | **✅** `N8-LANE` zero files and zero effect; security not triggered |
| 7 | test notes present | **✅** two, including *do not add a test* |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3`, with the UAT cost named |
| 10 | no major unresolved blocker | **✅** none. The UAT word is a cost, not a blocker |
