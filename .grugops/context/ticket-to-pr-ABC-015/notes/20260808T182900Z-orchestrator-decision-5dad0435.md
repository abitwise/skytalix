---
id: 20260808T182900Z-orchestrator-decision-5dad0435
kind: decision
by: orchestrator
at: 2026-08-08T18:29:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - ABC-014
  - ABC-018
  - EPIC-002
  - EPIC-006
  - RISK-005
  - NFR-007
  - plans/tickets/ABC-015-glyph-mode-selection.md
  - plans/board.md
  - plans/traceability.md
  - 20260808T181100Z-orchestrator-decision-915c585e
  - 20260808T182200Z-ba-pm-decision-69e00126
  - 20260808T182300Z-ba-pm-decision-a57fe151
supersedes: 
---

# `ABC-015` pulled `Ready` → `In Development` — and this role's own pre-check was wrong

## The correction that matters most, first

The routing note this role published earlier today (`20260808T181100Z-orchestrator-decision-915c585e`)
carried a Definition-of-Ready pre-check table. **Two of its rows were green and should not have
been.** BA/PM found both at the `Backlog → Ready` exit and fixed them before promoting.

**How the error was made, because the mechanism is the reusable part:** the pre-check's
"acceptance testable" row said *"nine enumerated input tuples, each with one exact output"*. That
phrase was **copied from the ticket's own `## Definition of Ready` line** — a self-assessment — and
recorded as if it were a count taken from the criteria. **It was eight tuples plus one session
property.** Recounted here from the pre-correction bullets rather than accepted from BA/PM's report:
flag-beats-signal ×2, non-TTY, `LC_ALL` precedence, `LC_CTYPE` spelling, all-unset, `ISO-8859-1`,
`win32` guard — **eight** — then the mid-session criterion, which is not a tuple at all.
**BA/PM is right and the pre-check was wrong.**

This is the same failure as the *"7 standing perft FENs"* that were 6, caught during `ABC-014`:
**a document's summary of itself is not evidence about itself.** It is recorded here, in the ticket
and on the board rather than quietly dropped, because a pre-check that is trusted next time will
make it again.

**The procedural point, and the reason it did not reach an engineer.** `ABC-015` was in `Backlog`
and the `Backlog` exit belongs to BA/PM, so this role routed the promotion to them instead of
pulling the ticket straight through. **That hop is what caught both defects.** Skipping it to save a
round-trip — the tempting move with an owner waiting — would have handed both to the Software
Engineer.

## The two defects, verified independently rather than ratified

- **An input tuple with no stated output.** `--ascii` and `--unicode` arrive as **two independent
  booleans** (argv is `EPIC-006`'s), so `(true, true)` is constructible, and table rows 1 and 2
  **both** match it. The ticket said "mutually exclusive" and put the rejection in `EPIC-006`, which
  is **undecomposed and merges later** — so nothing merged holds that precondition at this
  function's first caller. Three defensible guesses, no ruling. **BA/PM ruled row order → ASCII, no
  throw, no print.** That is a product call and it is theirs; this role notes only that it is the
  fail-safe direction and costs zero code.
- **A criterion no implementation could fail.** With the signals injected as arguments — which the
  ticket's own `## Test notes` **require** — the old mid-session criterion admits only
  `const m = select(…); process.env.LANG = "C"; expect(m).toBe(…)`, which asserts that a `const`
  does not mutate. Its one failing form is the module-level `process.env` accessor those same notes
  forbid. Replaced by two criteria written against a **named mutant**.

## Definition of Ready, re-applied AT the pull (Workflow 04 step 1)

Against the ticket **as corrected today** — not the version pre-checked this morning, and not from
BA/PM's report. All ten hold:

| Check | State |
|---|---|
| problem clear | ✅ |
| scope / out-of-scope | ✅ |
| INVEST | ✅ dependency merged; `GlyphMode` exported at `src/render.ts:61` on `main` |
| acceptance testable + measurable | ✅ **only after correction** — 9 tuples + 2 falsifiable session criteria |
| dependencies known | ✅ `ABC-014` discharged; merge-order binds at `ABC-018`, which is unstarted |
| NFR triggers, measurable | ✅ zero filesystem + zero process operations, inside `NFR-007` |
| test notes | ✅ incl. the named mutant the session tests must kill |
| size | ✅ `S` (2) — **not `XL`, no `SPLIT_REQUIRED`** |
| priority | ✅ `P1` |
| no unresolved blocker | ✅ `Blocked` empty |

## Board move and WIP

`Ready` **4/8 → 3/8**, `In Development` **0/3 → 1/3**, queue width **1 of 3**. No limit approached,
**no override taken, no written reason owed.** `In Analysis` 0/2 and `In Design` 0/2 untouched — no
design hop, for the reason recorded on the board: one pure function, a five-row table already
written out, and a return type a merged module declares.

## What this pull does NOT authorize

- **It does not decide where the cached session value lives.** BA/PM left that open in those words
  and this role does not close it. It is the engineer's structure call, and it is the one real
  design decision in the ticket: acceptance criterion 10 requires the **rule** to read no ambient
  global, while the NFR bar permits the **session accessor** to read `process.stdout.isTTY` and
  `process.env`. Both must hold at once.
- **It does not touch `EPIC-006` or `ABC-018`.** The conflict-rejection message stays `EPIC-006`'s.
- **It does not re-open the owner's pull-order call**, nor de-prioritise `ABC-009` / `ABC-022`.
- **It authorizes no merge.** The gate binds; the owner's standing directive governs what happens
  after green, not instead of it.

## Next action

Software Engineer implements `ABC-015` on `grugops/ticket-to-pr-ABC-015`, owning the
`In Development → In Review` exit.
