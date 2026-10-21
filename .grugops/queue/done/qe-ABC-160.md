---
subtask: qe-ABC-160
role: qe-e2e
ticket: plans/tickets/ABC-160-the-book-sha256-test-never-offers-a-hash-that-differs-only-in-its-first-character.md
ref: .grugops/context/qe-ABC-160/
branch: grugops/ABC-160 (tip 1d2fd467; base 51503331); SE worktree ../wt-ABC-160 (read only)
width: 3 (beside ticket-to-pr-ABC-162 and -159; other worktrees, other files)
---

# QE gate for ABC-160

## Do
- **Mutants.** Verify A1–A3 against the page. Re-plant the mutants yourself in scratch copies **outside** the repository, testing each at base and head:
  - `Q-SUFFIX8`, `Q-SKIP8`, `Q-PREFIX`, `Q-CASE`;
  - `M05`, `M-SWAP`, `M06`.
- **Independence.** Do not copy the SE's readings in `.grugops/context/ticket-to-pr-ABC-160/`. You may read its decision note for the case shape only.
- **Gates.** Re-run them on the tip: lint, typecheck, build, `npm test`, `last-run.json` success, skip-integrity `--skip-count 0`, `CLI_DEEP`, `PERFT_DEEP`. Every vitest call takes `NODE_OPTIONS=--max-old-space-size=400`, one at a time.
- **UAT waiver.** Measure it: `git diff --name-only 51503331...1d2fd467 | grep -v '\.test\.ts$' | grep '^src/'`.
- **Verdict.** Return PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-160` on a branch from the tip. Commit typed notes and a QE section on the ABC-160 page there.
- No production files, `plans/board.md`, or other ticket pages. No timing.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal the notes with the sanctioned writer: `/Users/olgeroeselg/.claude/plugins/cache/grugops/grugops/2.1.0/scripts/context-io.js` (`admitAndAppend`, task `qe-ABC-160`). It sits in the plugin cache, not in the repo or the kit.
- Finish with `.grugops/queue/done/qe-ABC-160.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.

## Result

**Verdict: PASS_WITH_GAPS.** `A1`–`A3` are MET on QE's own readings. All 16 match the SE's (`…381bd855`), compared
only after QE's runs.

- **Readings** (scratch copy `git archive 1d2fd467`, outside the repo; lane `NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/opening-book/book.test.ts`):
  - unmutated: green on base and head.
  - `Q-SUFFIX8` and `Q-SKIP8`: **green → red**. The killer is the new 3-of-3 at `book.test.ts:352`, failing on `a.tsv`.
  - `Q-PREFIX`, `M05`, `M-SWAP` and `M06`: red / red. `Q-CASE`: green / green.
- **QE's own plants:**
  - `Q-SKIP1` (drops only the first char): green → red.
  - `Q-MID`, `Q-ENDS` and `Q-SPARE-AE`: survive (`QE-160-a`, fenced out by the page).
  - `T-NOOPFIRST`, `T-NOFIRSTCASE` and `T-NOOPLAST`: fail loud.
- **`A3`:** 1 path and 0 new files. One hunk, `+336,18`, inside the `A1/A2` `it` (`:274`–`:354`). `compile.ts`
  and `book.json` are `cmp` 0. 0 spawns. 59 files and 1987 tests at base = head, with 0 pending and 0 todo.
- **Gates on `1d2fd467`:**
  - lint, typecheck, build and `npm test` exit 0. `last-run.json` reads `success: true`.
  - `test-skip-integrity --skip-count 0` gives `No findings.`
  - `CLI_DEEP` 11/11 and `PERFT_DEEP` 32/32, with 0 skipped.
- **UAT waiver:** `git diff --name-only 51503331...1d2fd467 | grep -v '\.test\.ts$' | grep '^src/'` gives **0 lines**
  (grep exit 1). The waiver applies by its rule. Applying it is the Orchestrator's.
- **Gap register (all INFO):**
  - `QE-160-a` (BA/PM): arbitrary-subset compares survive. The page fences them out. Accept, with the same
    promotion trigger.
  - `QE-160-b` (Orchestrator): the `npm test` script's inline `--max-old-space-size=128` overrides a `400`
    prefix, so the unit gate ran at 128.
  - `QE-160-c` (Orchestrator): the SE's notes are hand-authored and unsealed, while QE's are sealed by the
    plugin-cache writer. `AGENTS.md:29` does not mention that copy.
- **Closed:** `QE-155-a`.
- **Branch:** `grugops/qe-ABC-160` (worktree `../wt-qe-ABC-160`), tip `a8017af9` on top of `1d2fd467`. It holds
  records only: 5 sealed notes and the page's `## QE`. It was not pushed or merged.
- **Notes** (`.grugops/context/qe-ABC-160/notes/`): decision `20261021T081227Z-qe-e2e-decision-1500918a`;
  observations `…-d1069a4d` (readings), `…-769bac49` (plants), `…-d1cf1c14` (gates, `A3` and waiver), and
  `…-09620a26` (gap register).
- `qe-hop-integrity --ticket ABC-160` on the QE branch gives `covered (qe-e2e)`. No timing was taken.

### Trace row (for `plans/traceability.md`; the Orchestrator appends it)

| ABC-160 (QE) | Book sha256 test, first-char near-miss refusal; QE/E2E (Claude Opus 5.5, subtask `qe-ABC-160`, branch `grugops/qe-ABC-160` tip `a8017af9` on `grugops/ABC-160` tip `1d2fd467`, base `51503331`). **No timing read.** | EPIC-005 | — | `NFR-008` count pin held: 59 files and 1987 tests at base = head, 0 spawns, 0 skips | no code changed by QE. Read `tools/opening-book/book.test.ts` (19/19). 12 mutant builds and 4 test plants in scratch copies outside the repo | **PASS_WITH_GAPS.** `A1`–`A3` MET. `Q-SUFFIX8`/`Q-SKIP8` green → red; `Q-PREFIX`/`M05`/`M-SWAP`/`M06` red/red; `Q-CASE` green/green. `QE-155-a` closed. Gaps: `QE-160-a`/`-b`/`-c` INFO | waiver measured: 0 `src/` production lines, so it applies (the Orchestrator's to apply) | — | **In Review; the next column is the Orchestrator's call.** Notes `.grugops/context/qe-ABC-160/notes/` (decision `…1500918a`, sealed) |
