---
id: 20260817T133000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-4b1e77a2
kind: observation
by: orchestrator
at: 2026-08-17T13:30:00Z
verified_by:
confidence: high
refs:
  - plans/tickets/ABC-062-refusal-usage-line-and-two-uncovered-argvs.md
  - src/cli.test.ts
  - src/cli-options.ts
  - src/cli.ts
supersedes:
---

# `ABC-062` criteria re-read against the built tree — the `Ready for Dev` exit (project process rule 1)

Read on `main` @ `48a00cf`, working tree clean, no unmerged branches. The page was cut **2026-08-15**;
since then `ABC-065`, `ABC-066`, `ABC-067`, `ABC-068`, `ABC-071` and `ABC-061` have all landed in
`src/cli.test.ts`, which now runs **36 tests in that file, 863 across 30 files**.

**Applying the `ABC-061` retro lesson recorded as mine — "the criteria review reads criteria against
the tree but does not yet RUN the ones that are runnable" — I RAN both mutants this page names,
in a throwaway git worktree at `/tmp/abc062-probe`, outside the repository, removed afterwards.
Everything below is a first-hand measurement, not a reading.**

**Verdict: 2 of 6 criteria carry real work. 3 are VACUOUS — already satisfied by `ABC-066`, which
landed after this page was cut. This is the `ABC-061` shape a second time, caught before the pull
this time instead of disclosed by the engineer during it.**

## The measurements

Baseline, unmutated, `main` @ `48a00cf`: `src/cli.test.ts` **36/36 green**; full suite **863/863**.

| # | the page claims | measured today | verdict |
|---|---|---|---|
| `A1` | `next ?? token` → `next as string` at `cli-options.ts:130` ships **green** (defect live) | **GREEN, 36/36 and 863/863 with the mutant applied** | **STANDS — real, unasserted** |
| `A2` | `resolveOptions(["white"])` resolved by no test | `grep` for a bare `["white"]` argv across `src/*.test.ts`: **zero hits** | **STANDS — real, unasserted** |
| `A3` | a refusal writes the usage line; 6 of 6 refusal children | `src/cli.test.ts:954-961` (`ABC-066`) already derives the refusal children from the capture, asserts **`toHaveLength(6)`**, and reads the **last non-empty stderr line** via `usageLineOf` | **LARGELY MET** — see `G-2` |
| `A4` | usage tokens equal `ACCEPTED_ARGUMENTS` element for element, both ways, never transcribed | `src/cli.test.ts:982` is **that assertion verbatim**: `expect([...new Set(invocations.flat())].sort()).toEqual([...ACCEPTED_ARGUMENTS].sort())`, read at run time | **VACUOUS** |
| `A5` | deleting `${USAGE}` from the rejection write reds the suite. *Page: "(Today: green.)"* | **RED today**: mutant applied to `src/cli.ts:82`, `1 failed | 35 passed` | **VACUOUS — the page's parenthetical is stale** |
| `A6` | one path, zero production lines, `spawned` still `10` | `spawned` pin present, now at `src/cli.test.ts:933` | **STANDS (process criterion)** |

**`A4` and `A5` could each be reported MET by doing nothing.** That is the exact `ABC-061` failure —
except there the engineer disclosed it unprompted mid-ticket and my review had missed it. Here the
review caught it, which is the control rule 1 asks for.

## The M2 crash witness, reproduced at first hand

Under the `A1` mutant, `node src/cli.ts --colour` prints a Node stack trace out of `printableOf`
(`src/cli.ts:69`, `for (const character of text)`) **where the usage sentence belongs**. Unmutated it
prints the two correct lines. **The ticket's central value claim is true and the defect is live on
`main` today.** This is why the page does not collapse to "already done" — `A1`/`A2` are the ticket.

## Gaps to correct before dev

- **`G-1` — `A4` and `A5` are vacuous.** `ABC-066` (`src/cli.test.ts:949-983`) landed both. They must
  be struck or restated as something the tree does not already do; leaving them invites an engineer
  to report two criteria MET for no diff.
- **`G-2` — `A3` is met on its first clause and NOT on its second.** `ABC-066`'s block asserts the
  stderr line over the six refusal children but does **not** assert their stdout carries zero frame
  rows. That absence property is asserted at `:418` over a **different, hand-listed** set of four
  cases, not over the derived six. The residue of `A3` is real but is one line, not a block.
- **`G-3` — the `USAGE` string on the page is stale.** The page quotes
  `usage: npm run chess [--colour …]`; `src/cli.ts:58` reads `usage: npm run chess -- [--colour …]`.
  The `--` separator is `ABC-066`'s subject and is load-bearing. Prose only; no criterion reads it.
- **`G-4` — `## Scope` bullet 2 is spent.** "A new `it` block asserting the usage line over the
  refusal children already captured at module scope" is `ABC-066`'s block, already written.
- **`G-5` — line references have drifted.** `:401` → `:410`; `:780` (the `spawned` pin) → `:933`;
  `:477` → `:545` region. `cli-options.ts:130` is **still correct**.

**Recorded gaps at this exit: 5.** Backward moves caused: 0. None of these is a defect in delivered
code — every one is page drift caused by five tickets landing in the same file after the cut.
