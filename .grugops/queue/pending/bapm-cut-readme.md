---
subtask: bapm-cut-readme
role: ba-pm
ref: .grugops/context/bapm-cut-readme/
branch: new grugops/bapm-cut-readme from main, worktree ../wt-bapm-cut-readme
width: 1 of 3 (beside qe-ABC-204 ALONE and arch-accept-adr0049; records only — no npm, vitest or build)
---

# Cut the README ticket; cut the test-hardening follow-up; apply BA/PM's ADR-0049 rows

## Do
1. **README ticket (next free id, ABC-216).** Owner word `owner-word-2026-10-24/…619938c5` item 4: the public GitHub repo has no README. Analyse what a first-time visitor needs (what it is, how to play, how to plug into a UCI GUI, difficulty levels 1–7 with default 5, PGN files under `games/`, Node ≥ 22, how to run the tests, licence) from the code, `package.json` scripts, the runbook and EPICs — read only. Owner's shape: **clean and short, a nice-looking title, ASCII art welcome**. Write testable criteria (e.g. every command shown runs as written; length bound; ASCII art renders in GitHub's monospace, ≤ 80 columns; no claim that an npm package is published (ADR-0049 d3); Apache-2.0 + NOTICE pointer (ADR-0048); no infrastructure names or personal paths (ADR-0049 d4)). Size, priority, epic, DoR. Say whether any test pins README content (e.g. a licence or docs guard) and whether `AGENTS.md`/runbook should point to it.
2. **Test-hardening follow-up (ABC-217, XS, Backlog→Ready if DoR met):** QE-206-a (two plain-move discovered-check FENs in the `givesCheck` lane row), QE-206-b (count `makeMove` through the `apply.ts` spy for `hasLegalMove`/`legalCaptures`), QE-206-e + SEC-206-a (stale `gameStatus` wording at `src/gameend.ts:17` and the describe title at `src/gameend.nfr.test.ts:68`), QE-212L-a (budget-read stub asserts `options.now`). Sources: `qe-ABC-206/…809cd42a`, `security-nfr-note-ABC-206/…322a594a`, `qe-lane-ABC-212/…db746b16`, Orchestrator `…cb10c36c`, `…4cf9da50`.
3. **ADR-0049 § Records rows whose "by" is BA/PM (5):** apply as each disposition says (dated lines). Owner accepted ADR-0049 (item 1).
- Do not touch the board (the Orchestrator places cards) or rows owned by other roles.

## Fences
- Only your worktree and `<scratchpad>/bapm216/`. No `src/` edits, no README written (the ticket's SE does it). Do NOT run npm, vitest or builds. Never push, force, amend or rebase; never merge into main. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task bapm-cut-readme). `## Result` + 10-cell trace rows into this brief in main's queue, then move it and its claim.md to done/.
