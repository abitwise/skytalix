---
id: 20261010T154029Z-qe-e2e-decision-abc132-verdict-29eca70d
kind: decision
by: qe-e2e
at: 2026-10-10T15:40:29Z
verified_by:
confidence: high
refs:
  - ABC-132
  - ADR-0029
  - QE-051-d
  - src/render-seam.ts
  - src/result-screen.ts
  - src/cli.ts
  - 20261010T141247Z-orchestrator-decision-owner-word-uat-q4-5c8e2a17
  - 20261010T154029Z-qe-e2e-observation-abc132-readings-exit-gates-b8a8159b
  - 20261010T154029Z-qe-e2e-observation-abc132-gap-register-b5412758
  - 20261010T154029Z-qe-e2e-artifact-ref-abc132-probe-ec024f29
supersedes:
---

# QE `ABC-132`: PASS_WITH_GAPS. `A1`–`A4` are MET. One sentence was over-broad and QE fixed it in a comment. The Q4 exit holds on all 3 files

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install.

| item | value |
|---|---|
| subtask | `qe-ABC-132` |
| worktree | `.claude/worktrees/qe-ABC-132` |
| branch | `grugops/ABC-132-stale-docblocks` |
| base | `3159ab68` |
| SE tip | `9f8db35a` (code `1416a069`) |
| QE fix | `7387c65a` |

Every reading was taken by QE. The SE's notes (`…02fdd27a`, `…b830b38d`) were used as pointers only.

## Verdict

**PASS_WITH_GAPS.** `A1`–`A4` are MET at `7387c65a`. The gaps are 1 LOW, now fixed, and 2 INFO. None
blocks (`…b5412758`). **QE added no test.** The ticket is comment-only and has no behaviour to break.

## Each new sentence, judged against the code and `ADR-0029`

1. **`render-seam.ts`: "the declared `COMPOSITION_ROOT` in `src/history-pane.nfr.test.ts`" — TRUE.**
   - `src/history-pane.nfr.test.ts:218` reads `const COMPOSITION_ROOT = "render-seam.ts";`.
   - `src/render-seam.test.ts` `A9` pins that line.
   - "the root's load closure plus every module a frame call loads" is `ADR-0029` decision 1's own
     definition, and the probe docblock's too.
2. **`result-screen.ts`: "NOT on the frame path … neither in the load closure … nor loaded by a frame
   call" — TRUE, measured.**
   - QE's own child (`probe/closure.mjs`) loaded `render-seam.ts`. Its closure is **11 modules**, which
     matches `ADR-0029`'s count, and `result-screen.ts` and `cli.ts` are both absent.
   - QE then drew frames under **all four** mode × orientation pairs. The probe draws only
     `ascii`/`white-bottom`. Those frames loaded **0** modules.
   - Positive control: the same recorder does see `result-screen.ts` when it is imported directly.
3. **"(only `src/cli.ts` imports it)" — FALSE as written. Over `src/` there are FOUR importers:**
   `cli.ts:76`, `cli.test.ts:48`, `command-input.test.ts:28` and `result-screen.test.ts:31`.
   - The sentence is true over production modules (`ADR-0011` clause 1), which is the set the frame
     path is defined on.
   - The fence allows a fix when a sentence is wrong, so QE made a comment-only fix at `7387c65a`:
     "(of the production modules, only `src/cli.ts` imports it)" (`QE-132-a`).
   - The fix stays inside the ticket's site and outside `A3`'s kept sentence. All gates were re-run
     after it.
4. **`cli.ts`: "production 18 -> 20, entry points 1 -> 2 (`ABC-042`'s reading)" — ACCURATE.**
   - `ABC-042` § `:235` states exactly 18 → 20 and 1 → 2.
   - The line was written by `ABC-042`'s commit `e1403550`.
   - "`ADR-0029` derives it from one declared root" matches the ADR.
   - The new text holds no `eval`, so `cli.test.ts` bar 1 is safe.

## Exit (owner Q4, `…5c8e2a17`)

Range `3159ab68..7387c65a`, per production file. Both measures hold on all 3 files:
- every changed line is a comment;
- the `transpileModule` `removeComments` emit is byte-identical.

The negative controls go red on every file, and a type-only edit is caught only by the conjunction.
**On QE's reading, the UAT waiver applies (WAIVED, not accepted).** The Orchestrator applies it at
`Done`. Readings: `…b8a8159b`.

## Next

- The Orchestrator moves the ticket out of `In Review`.
- The `src/` side and the ticket file merge clean onto wave tip `92516128` (`git merge-tree`, exit 0).
- QE has not merged and has not pushed.
