---
id: ABC-104
title: `src/coordinate-move.ts`'s header claims total, and it is total over `text` only
status: done
column: Done
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

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-104`).
- Branch `grugops/ABC-104-coordinate-move-docblock`, from `b7cffc52`. The code is `7707f61f`.
- Not merged, not pushed.
- The decision, readings and probe are in `.grugops/context/ticket-to-pr-ABC-104/` (`…30823a98`,
  `…a2addac5`, `probe/probe.mts`) and are not restated here.

**The premise held at `b7cffc52`.** Both throws were re-measured before the edit. **`A1`–`A3` are met,
and no stop condition fired.** No test was added, and no other `src/` file was touched.

| # | verdict | reading |
|---|---|---|
| `A1` | MET | `:30-37` reads "TOTAL OVER `text`", "Totality is over `text` ONLY", and "`position` and `legal` are a caller obligation, in the same terms `ADR-0004` clause 2 states for `toSan` and `parseSan`". The phrase "TOTAL function" is gone |
| `A2` | MET | After the edit, `parseCoordinateMove(null, "e2e4")` still throws `TypeError` (reading `'blackToMove'`), and `(position, "e2e4", 42)` still throws `TypeError` (`.filter is not a function`). The docblock names both calls as the contract |
| `A3` | MET | `git diff -U0 7707f61f~1 7707f61f`: only `src/coordinate-move.ts`, one hunk `@@ -30,3 +30,8 @@`, inside lines 1–33. The header at base is identical to the one at `f76e041`. numstat `8 3`, all ` *` lines. lint/typecheck/build exit 0; `npm test` 51 files / 1583 passed; skips 0; `test-skip-integrity` `No findings.` |

**UAT cost, as § Size and priority predicted:** this ticket is **not** waived, so the owner's word is
needed at `In UAT` for one docblock paragraph.

**Fix-forward, 2026-10-10, Software Engineer** (subtask `fix-ABC-104`, QE-104-a/b/c).
- The code commit is `82180eae`. It is comment-only, in the header docblock only, and is not merged or
  pushed.
- The decision and readings are in `.grugops/context/fix-ABC-104/notes/` (`…2e7fbb75`, `…c73ed93e`) and
  are not restated here.

What changed:
- **a.** `:25` now reads "TWO CALLER OBLIGATIONS".
- **b.** Only the `legal`-list obligation is attributed to `ADR-0004` clause 2. "A real `Position`" is
  marked as this module's own.
- **c.** "a wrong type throws" became "CAN throw, and need not", with the read conditions and a quoted
  non-throwing call. The two throwing calls are unchanged.

Status:
- **`A1`–`A3` still MET.** QE's probe output is identical after the edit.
- The comment-stripped emit is byte-identical to `b7cffc52`.
- Gate: 51 files / 1583 passed, skips 0, integrity `No findings.`
- **UAT is still not waived.**

## QE

**2026-10-10, QE/E2E** (task `wave-2026-09-25`, subtask `qe-ABC-104`, Workflow 04 review exit). QE read
`b7cffc52..76237852` in its own worktree, `.claude/worktrees/qe-ABC-104`.

**Result: PASS_WITH_GAPS. `A1`–`A3` MET, and none of the gaps blocks.** The readings, gaps and probe are
in `.grugops/context/qe-ABC-104/` (`…1ad3f484` verdict, `…f3d29d14` readings, `…df369a19` gaps,
`probe/qe-probe.mts`). They are not restated here.

| # | verdict | QE's own reading |
|---|---|---|
| `A1` | MET | `:30` reads "TOTAL OVER `text`", and `:32` reads "over `text` ONLY". "TOTAL function" has 0 hits. `:33` states the caller obligation on `position` and `legal` |
| `A2` | MET | QE's own probe: `(null,"e2e4")` and `(startpos,"e2e4",42)` each throw `TypeError`, and the control returns `move`. 0 of 38 hostile `text` calls threw |
| `A3` | MET | One file and one hunk, `@@ -30,3 +30,8 @@`, inside `1–33`. Every changed line is a ` *` line. The comment-stripped emit is byte-identical between base and tip. 51 files / 1583 passed, skips 0, integrity `No findings.` |

**Gaps.** All three LOW gaps are in the same docblock. The repaired paragraph still differs from the
behaviour, or from the source it cites, by a small margin:
- **QE-104-a.** The "ONE CALLER OBLIGATION" heading at `:25` now disagrees with `:33-35`. Both
  obligations are "not validated here", so the Engineer's argument that "ONE" is still accurate does not
  hold. `src/san.ts:18` counts the same obligations as "TWO".
- **QE-104-b.** `ADR-0004` clause 2 states no "real `Position`" obligation.
- **QE-104-c.** "A wrong type throws" is unconditional, but 6 measured wrong-type calls return without
  throwing.

**Recommended:** one SE fix-forward on this branch before `In UAT`, which is about three comment lines.
**UAT is NOT waived (measured);** the owner signs this paragraph.

Not merged, not pushed.
