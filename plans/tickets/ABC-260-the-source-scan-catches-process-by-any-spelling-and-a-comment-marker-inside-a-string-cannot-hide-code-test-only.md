---
id: ABC-260
title: "The R-TC source scan catches `process` by any spelling, and a comment marker inside a string literal cannot hide code from it or from `ABC-087` A8 (test-only, from QE-259-a and QE-259-b)"
status: done
column: Done
closed: "2026-11-01, merged to main at 59842f9f; QE PASS_WITH_GAPS (qe-ABC-260, b38c86b3); test-only, UAT waived; front matter aligned to the board by bapm-epic010-close"
size: XS
priority: P2
epic: EPIC-010
feature: —
---

# ABC-260: close two holes in the source scan `ABC-259` added (QE-259-a, QE-259-b)

> **Cut 2026-11-01 by BA/PM** (task `bapm-qe-gaps-1101`, records only, at `main` `661828d5`; nothing run, built or
> timed). Source: `qe-ABC-259` gaps note `…1aca1753` (verdict `…f47bc0aa`, PASS_WITH_GAPS). `EPIC-010` milestone 1b,
> row 31. **DoR 10/10. Recommended `Backlog → Ready`.** Column moves are the Orchestrator's.

## Problem

- **User:** the owner, whose condition is *"Make sure engine is not changed internally"* (`orch-2026-10-30a`
  `…43098cef`), and the reviewer of every milestone 1b rewrite.
- **Pain:** `ABC-259`'s scan (`src/levels.test.ts`, block "ABC-259 — R-TC item 2") holds `ADR-0056` R-TC item 2 on
  every `npm test`. QE planted past it twice:
  - **QE-259-a (MEDIUM):** the environment rule matches `process.`, `argv` and `import.meta.env`. Idiomatic ESM,
    `import { env } from "node:process"` then `env.X`, holds none of them, so plant Q5 survived. It is the plain way
    to do what R-TC item 2 forbids.
  - **QE-259-b (LOW):** the comment strip (`/\/\*[\s\S]*?\*\/|\/\/.*$/gm`) does not know strings. A `/*` inside a
    string starts a "comment" that runs to the next real `*/` (Q6); a `//` inside a string hides the rest of its
    line (Q7). `ABC-087`'s A8 row in the same file strips `src/levels.ts` with the same regex.
- **Fact at `main` `661828d5`** (a raw `grep` of the files, no test run): `\bprocess\b` occurs in `src/evaluate.ts`
  (2 lines) and `src/transposition.ts` (2 lines), all in comments (`ABC-259` § Problem); 0 in the other four. No line
  of `src/engine.ts`, `src/search.ts`, `src/quiescence.ts`, `src/evaluate.ts`, `src/transposition.ts` or
  `src/levels.ts` holds a quote followed by `//` or `/*` before the next quote. QE probed the stripped five the same
  way (0 and 0).
- **Value:** the owner's condition is held against the unobfuscated spellings, at the cost of one regex term and one
  guard.

## Scope

1. **Environment rule widened:** in the `ABC-259` block, `process\.` becomes a whole-word `process` (for example
   `\bprocess\b`), so `node:process`, `globalThis.process` and a bare `process` are caught. `argv` and
   `import.meta.env` stay.
2. **Strings cannot hide code**, over the five core files and `src/levels.ts` (A8's file). The SE picks one form at
   design and names it in the build note:
   - **(a) a guard row** that fails if any string or template literal in those six files holds `//` or `/*`; or
   - **(b) string literals blanked before the strip**, in both the `ABC-259` block and A8.
3. All in `src/levels.test.ts`.

## Out of scope

- Any production line; `tools/`, `data/`, config, `AGENTS.md`, the board.
- QE-259-c (computed-key reads of the budget, thresholds on `deadline - start`): an AST question, carried as a review
  note on `ABC-251`.
- Widening the file list (`ABC-259` test note 2, the Architect's open question).
- A8's other rules (`argv`, `readline`, `console.` and the rest) and its imports row: unchanged.
- Obfuscated reads (`globalThis["pro" + "cess"]`, dynamic `import()` of a built string): review's.

## Acceptance criteria

The base is `main` at the commit the build branches from; the tip is this ticket's delivered commit. Plants are made
in a scratch copy of the tip.

- **`A1` (green at production).** **Given** the tip, **when** `npm test` runs, **then** every row of the `ABC-259`
  block, A8, and any new row pass, with the comment mentions of `process` in `src/evaluate.ts` and
  `src/transposition.ts` present.
- **`A2` (the named import turns red).** **Given** `import { env } from "node:process";` and a read of
  `env.SKYTALIX_FAST` added to `src/search.ts`, **then** the environment row fails, naming `src/search.ts` and the
  rule (QE's Q5, `qe-ABC-259` raw `plants/Q5-env-named-import-search.diff`). **And given** `ABC-259` A3's plant
  (`process.env.SKYTALIX_FAST` in `src/search.ts`), **then** it still fails.
- **`A3` (a `/*` in a string cannot hide code).** **Given** in `src/search.ts` a string literal holding `/*`, then a
  line reading `process.env.SKYTALIX_FAST`, with the next real `*/` further down (QE's Q6:
  `const qeGlob = "src/*.ts";`), **then** at least one row fails, naming `src/search.ts`.
- **`A4` (a `//` in a string cannot hide code).** **Given** in `src/engine.ts` one line holding a string with `//`
  followed by `if (options.budgetMs <= 100) {}` on the same line (QE's Q7: `const qeUrl = "http://x"; …`),
  **then** at least one row fails, naming `src/engine.ts`. **And given** in `src/levels.ts` one line holding a
  string with `//` followed by `process.stdout.write("")`, **then** at least one row fails, naming `src/levels.ts`.
- **`A5` (comments still do not trip it).** **Given** `ABC-259` A5's comment plant in `src/quiescence.ts`
  (`budgetMs`, `process.env`, `ENGINE_DEEP`), plus a comment in `src/search.ts` that holds a quoted `"//"` and the
  word `process`, **then** every row stays green.
- **`A6` (plants never committed).** A2–A5 are read out of tree by the SE and re-read by QE; the build note lists
  each plant and the failing row's message. No plant is in any commit.
- **`A7` (what the diff may touch).** **Given** `git diff <base> <tip> --name-only`, **then** it prints only
  `src/levels.test.ts`. No `expect(` line changes except the environment row's match. Only the environment row's
  title may change (to name `process` in place of `process.`). Under form (b), A8's `code` line may change, and
  nothing else in A8. The header test count is raised by the rows added. Added comments cite only `ABC-260`,
  `ABC-259`, `ABC-087`, `ADR-0056`, R-TC, QE-259-a or QE-259-b.
- **`A8` (cost).** **Given** the vitest JSON reports of three head runs of `npm test`, **then** the summed duration
  median of the `ABC-259` block, A8 and any new row is **≤ 20 ms**.
- **`A9` (gates).** **Given** the tip, **then** lint, typecheck and build exit 0; `npm test` is green with 0 skips and
  the count is base + the rows added; `test-skip-integrity` reports no findings; `G8` head median ≤ 10 s
  (`NFR-008`).

**If A1 and A3–A5 cannot hold together** (a literal in the six files that form (a) or (b) cannot read), the SE
stops and reports the case. It comes back to BA/PM; no rule is loosened silently.

## NFR triggers

- **`NFR-008`:** default lane **≤ 10 s** (A9); these rows **≤ 20 ms** (A8). `G8` read H 9.15 s at `qe-ABC-259`.
- **`ADR-0046` R1–R4:** not triggered (no clock). **`NFR-004` / `G5` / `NFR-009`:** no production line moves.
- **Security (ASVS L1):** not triggered; test-only, no input surface.

## Test notes

1. **The plants are examples.** Any plant that shows the hole closed will do, as long as each of A2–A4 names its file.
2. **No ADR change:** R-TC item 2 already forbids reading the environment; the widened term reads that sentence
   as written. QE named the Architect as a second carrier; BA/PM's reading is that no ruling is owed. If the SE
   finds a reason that one is, the build stops and asks.
3. **No production line, so no smoke and no UAT:** the waiver (`AGENTS.md`, 2026-08-17) holds if
   `git -c core.quotePath=false diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`
   is empty at delivery. QE's verdict is the gate (`qe-e2e` hop owed).
4. **Rollback:** revert the delivered commit.

## Size and priority

- **Size: `XS`.** One regex term, one guard or one blanking step, one file, five plants. **Not `S`:** no fixture,
  no search, no timing.
- **Priority: `P2`.** QE-259-a is MEDIUM and guards the owner's explicit condition through milestone 1b's
  rewrites, as `ABC-259` (P2) does. **Not `P1`:** nothing reads the environment in core code today (§ Problem).

## Dependencies

- `ABC-259` merged (`2091d301`). No ADR of its own (`ADR-0056` R-TC, merge `a0f9297e`).
- **Order (recommended, not binding):** before `ABC-251`, which rewrites the scanned search files, so the rewrite is
  read by the tightened scan. Independent of `ABC-254` and `ABC-261`.
- **Shared file:** `src/levels.test.ts`; no other open ticket edits it that BA/PM knows of at `661828d5`
  (`UNKNOWN - verify` against the board at pull).
- **Owners:** SE: A1–A8. QE: re-read of A2–A5 and A9. No owner question.

## Definition of Ready

BA/PM, 2026-11-01, at `main` `661828d5`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ two holes, each shown by a QE plant (Q5; Q6/Q7); today's counts read |
| 2 | scope and out-of-scope clear | ✅ one term, one of two named forms, one file; QE-259-c, list widening, AST out |
| 3 | INVEST-shaped | ✅ independent of every open ticket; XS; testable by plants |
| 4 | acceptance testable and measurable | ✅ green at production; red on four named plants, naming the file; comment controls green; one file; ≤ 20 ms; 0 skips; `G8` ≤ 10 s |
| 5 | dependencies known | ✅ `ABC-259` merged; before `ABC-251` recommended |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-008` ≤ 10 s; rows ≤ 20 ms; others not triggered |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `XS` |
| 9 | priority assigned | ✅ `P2`, both directions argued |
| 10 | no major unresolved blocker | ✅ none; the stop rule is stated |
