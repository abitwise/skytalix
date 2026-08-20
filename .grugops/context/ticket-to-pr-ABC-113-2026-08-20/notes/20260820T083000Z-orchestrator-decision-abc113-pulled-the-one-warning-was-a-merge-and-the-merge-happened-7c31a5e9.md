---
id: 20260820T083000Z-orchestrator-decision-abc113-pulled-the-one-warning-was-a-merge-and-the-merge-happened-7c31a5e9
kind: decision
by: orchestrator
role: orchestrator
task: ticket-to-pr-ABC-113-2026-08-20
at: 2026-08-20T08:30:00Z
verified_by:
confidence: high
refs:
  - ABC-113
  - ABC-044
  - ABC-043
  - EPIC-006
  - agent-factory/workflows/04-ticket-to-pr.md
  - agent-factory/checklists/definition-of-ready.md
supersedes:
---

# `ABC-113` is pulled to `In Development`. Its one ⚠️ was a MERGE, not a decision — and the merge happened

## The blocker is discharged by measuring the tree, exactly as BA/PM said it would be

BA/PM scored `ABC-113` **9/10 ⚠️x1, "NOT PULLABLE TODAY"**, and wrote on the page that the single ⚠️
(DoR item 10) *"is a merge, not a question — the ticket becomes pullable the moment `ABC-044` merges."*

`ABC-044` merged at `55f85d4` (`Merge branch 'grugops/abc044-the-result-screen'`) after the owner
accepted it in session. Measured at this pull, not assumed:

- `git ls-tree --name-only main -- src/result-screen.test.ts` → **present**. It was not on `main`
  when the ticket was cut; that absence WAS the ⚠️.
- `src/cli.test.ts`, `src/cli.ts`, `src/result-screen.ts` → all present on `main`.
- Both edit targets exist at the stated shape: `src/cli.test.ts` holds `ABC-043` `A1`'s three rows
  (initializer, window-anchored shorthand, once-only `newGame` count); `src/result-screen.test.ts`
  holds the two whole-screen `not.toContain` rows in the `NEITHER STRING IS A SUBSTRING` block.

**DoR is 10/10 in substance. The page is NOT re-scored — that pen is BA/PM's and stays theirs.**

## The pre-registered CANCELLATION CONDITION did NOT fire — checked, not skipped

The ticket pre-registered: *"if `ABC-044` is returned from UAT and its `src/result-screen.test.ts` is
rewritten, re-cut `A2` rather than delivering this half blind."* `ABC-044` was **accepted**, not
returned, and `src/result-screen.test.ts` is the file QE exited on. **Both halves deliver as written.**
The demotion trigger to `P3` rested on the same condition and likewise does not fire — `P2` stands.

## `A4`'s pin is measured at the pull, so a drift later is the ticket's and not the baseline's

`npx vitest run --dir src` on `main` @ `55f85d4`: **40 files / 1207 tests / 0 skipped**, green.
That is `A4`'s number, taken now rather than quoted from `ABC-044`'s exit note.

`A1`'s green side is also re-measured independently: `src/cli.ts` holds exactly one `history` binder
(`:153 const history = newGame(START_FEN);`) — `:157` is the shorthand, `:171` an argument, `:3` a
comment the executable view strips. **Delivered → 1. The row is green before the decoys go in.**

## THE WAIVER RULE DEFECT BITES HERE, AND I AM FENCING IT AT THE PULL RATHER THAN AT THE EXIT

The open rule defect escalated at `ABC-044`'s UAT (note `d40b71c9`, unanswered by the owner) is that
the zero-production-lines UAT waiver is measured over `<tip>~1..<tip>` — a range a test-only final
commit can trivially empty. **`ABC-113` is a genuinely zero-production-line ticket, so it is the first
ticket where a WRONG instrument would reach a RIGHT answer for the wrong reason.**

Pre-registered now, so nobody has to decide it under pressure later: **when `ABC-113` reaches the
`Ready for UAT` exit, the waiver is measured over the WHOLE BRANCH — `git diff --name-only main...HEAD
-- src/` — which is `A3`'s own expression, and never over `<tip>~1`.** If that range lists anything
but `src/cli.test.ts` and `src/result-screen.test.ts`, the waiver is unavailable AND `A3` has failed,
and the ticket stops. The rule defect itself remains OPEN and unruled; this fences one ticket, it does
not repair the rule.

## Routing and width

Workflow 04 (`ticket-to-pr`) is a chain, not a fan-out: QE cannot read code that does not exist.
**Width 1 of 3.** Software Engineer now; QE/E2E owns the `In Review` exit after.

**Security/NFR is NOT activated and that is a measured call, not an omission.** The ticket's own
falsifiable firing threshold is *"it fires if the diff touches any file under `src/` other than the
two test files"* — `A3` is exactly that threshold as an assertion. If `A3` goes red, the engineer
stops and this routing is re-opened.

## What this pull does NOT touch

- **`ABC-043` stays in `In Review`.** Its exit is a separate decision and was not in scope here. It
  holds `In Review` at 1/3 — no WIP pressure on anything.
- **`ABC-043` and `ABC-044` are NOT re-opened, re-scored or amended.** This ticket edits two of their
  delivered assertions and neither of their pages, exactly as its scope says.
- **The three items QE ruled NOISE** (`A1` set-row softness, the `A3` word-boundary reading, the
  zero-ply blank row) stay uncut. So does the `ABC-044` scroll finding the owner left OPEN.

## WIP at the pull, measured

`In Development` **0/3** → 1/3. `In Review` 1/3. Every other column 0. `pending/` and `claimed/` both
**EMPTY** — nothing stale to sweep. Branch `grugops/abc113-two-instrument-residuals`, base `main` @
`55f85d4`.

**NOT passed through `Ready` / `Ready for Dev`** — both are empty and this project has never staged
work there. Recorded as it happened rather than split into two tidy-looking transitions.
