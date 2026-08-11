---
id: 20260811T173500Z-software-engineer-observation-2f9c4d18
kind: observation
by: software-engineer
at: 2026-08-11T17:35:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-027-dev
  - ABC-027
  - ABC-018
  - ABC-019
  - ADR-0010
  - EPIC-002
  - NFR-002
  - NFR-007
  - NFR-008
  - src/frame.ts
  - src/frame.test.ts
supersedes:
---

# GATES GREEN on delivered code, every criterion witnessed FAILING on three mutants ON THIS BRANCH, and what the ticket said that the build confirmed or corrected

> **Hand-authored** — `scripts/context-io.ts` absent from this repository and from the kit,
> `mcp__grugops__propose_note` not in this session's tools. **No `finding` in this task's notes**; no
> verification stamp is issuable to this role. Every number below was RUN on branch
> `grugops/ABC-027-frame-clearing` at commit `194a9bc`, in the dedicated worktree
> `/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-ABC-027`. Machine: **Apple M3
> (Mac15,13), Node v24.12.0, darwin/arm64** — `UNKNOWN - verify` on any other hardware.

## 1. The gate, run on delivered code

| stage | command | result |
|---|---|---|
| baseline, before a byte was written | `npm test` | **676/676 on 22 files** — the stated baseline, re-run rather than trusted |
| lint | `npm run lint` | **0 errors.** 2 infos, both the pre-existing `biome.json` `recommended`-field deprecation; `biome.json` is NOT touched |
| typecheck | `npm run typecheck` | **0** |
| build | `npm run build` (`tsc --noEmit`) | **0** |
| unit | `npm test` | **681/681 on 22 files** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |

**681/681 on 22 files, skip 0 — exactly BA/PM's out-of-tree projection, met on delivered code.**
`src/frame.test.ts` went 27 → **32** tests: five added (`A1`–`A5`), `A6` replaced in place, **zero
test files added**.

One lint round-trip was needed and taken inside the self-fix budget (1 of 2): `npx biome check
--write` reflowed one over-long line in `A4` and escaped the fixture's em dash to `—`. No
assertion changed.

## 2. Emission accounting, measured on delivered code

For a 23-row frame on a 24-row TTY (`messages: ["check"]`):

| | `write()` calls | characters | `\x1b` | `\x1b[0J` | `\x1b[K` |
|---|---|---|---|---|---|
| before | 1 | **425** | 2 | 1 | 0 |
| delivered | 1 | **491** | **24** = `H + 1` | **1** | **22** = `H − 1` |

**+66 characters exactly = `(H − 1) × 3`.** Confirms `ADR-0010` and BA/PM to the character. Still one
`write()` per frame, so `NFR-007`'s single-write constraint is untouched, and `NFR-002`'s 16 ms
target does not move — **`plans/nfr-catalog.md` is NOT edited and no bar was created, moved,
loosened or re-derived.** No wall-clock assertion was added to the suite (this project's standing
rule); `A1`'s byte delta is a character count, deliberately.

The narrowing fixture's widths, measured through the delivered assembler: **`W` = 37, 18, 39, 18** —
two narrowings and one widening, every frame exactly `H` = 23 rows, only the status stub's THIRD row
moving so every panel keeps its reference row count. The residues the un-cleared emission leaves at
80 columns are `hreefold repetition` and ` to move out of check`, character for character what BA/PM
measured.

## 3. EVERY criterion was witnessed FAILING, on this branch, not inherited from the cut

Three mutants, each applied to the delivered tree, run, and reverted with `git checkout --`:

| build / mutant | `A1` | `A2` | `A3` | `A4` | `A5` | `A6` | red |
|---|---|---|---|---|---|---|---|
| delivered (clause 1) | PASS | PASS | PASS | PASS | PASS | PASS | **0** |
| **merged writer** — rows joined by a bare newline | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 5 |
| **partial fix** — only the first 5 rows cleared | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 5 |
| **degenerate fixture** — claim strings shortened so `W` never moves | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | 2 |

This reproduces BA/PM's witness table exactly, and adds the `A6` column the cut could not fill (the
discharged test is red on both broken writers, which is the property `A6` is for). **The degenerate
mutant is the one that matters most**: `ADR-0010` measured the merged file's entire fixture space at
`W` ∈ {18}, so a fixture that quietly stops narrowing would turn `A2` green forever — `A2`'s explicit
narrowing assertion and `A3` both reject it. `A3` passes on both writers by construction; it tests
the FIXTURE, not the build, which is the point.

**The two extra red tests on the writer mutants are the repaired sites doing their job**: `:374`+
(`toContain` of the joined rows, which fails BEFORE and masks the escape count) and `:419`+
(`toBe(frame.join(...))`).

## 4. What the ticket said, and what the build confirmed or corrected

| claim | source | measured here |
|---|---|---|
| the screen model must learn `\x1b[K` or the suite goes red — **5 tests THROW** | `ADR-0010`, BA/PM | **CONFIRMED EXACTLY.** Delete the model's `\x1b[K` case on the delivered tree and the five merged tests BA/PM named throw `screen model: unmodelled escape`; with the new criteria present, `A2` and `A4` throw too (7 red) |
| **five** assertion sites across four tests, not the ADR's three | BA/PM | **CONFIRMED.** `:374`, `:376`, `:419`, `:768`, and `:376`'s count is masked by `:374` |
| *"the file needs its FIRST narrowing fixture"* | `ADR-0010` `## Consequences` | **FALSE, confirmed.** `:735-771` already built one — `widthOf(wide)` 24, `widthOf(narrow)` 18 — and **asserted the defect was PRESENT.** `A6` discharges it; it is replaced, never deleted |
| a trailing `\x1b[K` on the last row is redundant | `ADR-0010` cl. 1 | **CONFIRMED by construction** — the join emits `H − 1`, and `\x1b[0J` clears the rest of the cursor's row; the prompt-row cursor criterion still reads `{row: H − 1, column: 0}` |
| `F1` (`rowsOnlyIn`) false-positives on the CORRECT build at `W`(frame 1) | BA/PM | **NOT re-measured here — taken as given and simply not reused.** `A2` is `F3`. `UNKNOWN - verify` from this hop |
| both append paths byte-identical, 0 escape bytes | `ADR-0010` cl. 8 / `4c` | **CONFIRMED** — `A5` asserts both, and both were green under every mutant above |

## 5. What was NOT done, and why

- **No constant-frame-width criterion or assertion, anywhere.** `ADR-0010` clause 5's PROHIBITION;
  `W` varies by design ({37, 18, 39, 18} measured above) and form `F4` fails the CORRECT build. The
  prohibition is also written into the new section's header comment so a future hop reads it before
  reaching for the form.
- **`assembleFrame` untouched** (`ADR-0010` cl. 2). `W` is still the per-frame max at
  `src/frame.ts:179`. Every frame VALUE is byte-identical; `A5` asserts the structural reason.
- **`src/status-panel.*` and `src/turn-loop.*` not touched, not read for content, not imported.**
  Neither exists on `main`; `ABC-027` goes green ALONE, re-confirmed by the 681/681 above.
- **`plans/board.md` not written** — the Orchestrator's. The move is requested in the `artifact-ref`
  note.
- **`memory-bank/50-decisions/` not written**, including `ADR-0010`, whose `## Consequences` this
  hop confirms is wrong in two places. **Flagged, not applied** — see below. `ADR-0010` and
  `ADR-0009` are accepted and neither was re-litigated.
- **`plans/nfr-catalog.md` not written**, `plans/epics/` not written, `plans/tickets/ABC-019-*.md`
  and `plans/tickets/ABC-016-*.md` not touched (agents are live in both worktrees; **nothing was
  relayed to them and no channel was opened**).
- **Nothing merged, pushed or deployed. `main` never checked out.**

## 6. Two flags carried, neither taken, each with an owner, neither blocking

1. **`ADR-0010`'s `## Consequences` under-counts the test changes (three → five) and its *"the file
   needs its first narrowing fixture"* clause is FALSE.** Both re-confirmed on delivered code at this
   hop. **Nothing in the ruling changes** and `A6` covers the consequence. **Owner:
   Architect/Design**, whenever `memory-bank/50-decisions/` is free. Non-blocking.
2. **Epic `4b`'s *"zero rows from frame N"* wording stays blind to this defect at any real terminal
   width.** `ADR-0010` clause 8 covers it at ticket level on purpose. **Owner: BA/PM**, and only if
   the owner reads *"in one operation"* as forbidding the additional erase — a reading `ADR-0010`
   explicitly does not take, and the delivered emission keeps one `\x1b[0J`, no count, no cursor
   movement and one `write()`. Non-blocking.

**A third fact worth carrying rather than flagging:** the screen model now implements `\x1b[H`,
`\x1b[0J` and `\x1b[K` and throws on everything else. That is deliberate and it means any future
writer change is gated by a model edit — a feature, not a defect, and it should not be read as one
when the suite goes red. **Owner: whoever changes the writer next.**
