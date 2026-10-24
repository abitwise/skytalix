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

## Result

**Done 2026-10-24 by BA/PM.** Branch `grugops/bapm-cut-readme` @ `573523c9` (worktree `../wt-bapm-cut-readme`, from
`main` `2a1a7c93`). Records only. Not merged, not pushed. Notes (`bapm-cut-readme`): observation
`20261024T154310Z-ba-pm-observation-514ce8a5`, decision `20261024T154312Z-ba-pm-decision-50c55e37`. Both seals read
back `ok`, 0 validation faults. No npm, vitest, build or CLI ran.

`git diff --stat 2a1a7c93..573523c9 -- src tools package.json package-lock.json AGENTS.md memory-bank` prints nothing.
Files: the two ticket pages, EPIC-006, EPIC-007, EPIC-008, and the task context (README + 2 notes).

- **`ABC-216`** (`EPIC-006`, `XS`, `P2`, DoR **10/10**, page `ready`/`Ready`). One `README.md`, outline of 9 sourced
  rows. Bounds: ≤ 100 lines, ≤ 9 `## `; art ≤ 12 lines, ≤ 80 columns, ASCII 0x20–0x7E, in a `text` fence, original.
  Every command runs as written on a fresh clone. 0 publish-path hits (`ADR-0049` d3). `LICENSE` + `NOTICE` links
  (`ADR-0048`). 0 personal paths, IPv4 addresses or e-mails (`ADR-0049` d4). UAT waived by measurement; no security
  clause fires. **No test pins README content. No `AGENTS.md` pointer; a runbook pointer is optional (Architect or
  Scribe).** Assumption stated: the repo's own public HTTPS URL is not infrastructure under d4; fallback
  `<repository URL>`.
- **`ABC-217`** (`EPIC-008`, `XS`, `P3`, DoR **10/10**, page `ready`/`Ready`). `QE-206-a` (two discovered-check
  FENs), `QE-206-b` (`makeMove` counts: 1 and N), `QE-212L-a` (`options.now` identity), `QE-206-e` + `SEC-206-a`
  (0 "cheap at a search leaf"). Four pre-registered plants. `src/gameend.ts` comment-only by the Q4 two checks
  (`…5c8e2a17`), so UAT is waived when they hold. `NFR-008` sentinel at merge.
- **`ADR-0049` rows 20–24:** one dated paragraph in the `EPIC-007` acceptance box. Each row's disposition is
  `ADR-0048`, already applied by `bapm-epic007-licence-line`. The paragraph names each row and adds row 20's reading:
  "private" now means `"private": true` (no publish), not "not shared". No measure, status or column moves.
- **For the Orchestrator:**
  - Both cards are Ready (0/8 → 2/8 if placed). Both need npm or vitest, so they wait until no ALONE reading runs.
  - The Architect's sibling hop owns `ADR-0049` § Status and its 14 rows. This branch touches no ADR.
  - Merge order with `arch-accept-adr0049`: either. No shared file.
  - **Next free id: `ABC-218`.**
- **Not touched:** `src/`, `tools/`, `package*.json`, ADRs, runbook, `AGENTS.md`, the board, the trace. In main's
  checkout only this record and its claim moved, and both are uncommitted.

### Board card lines

`- [ABC-216] A short README.md with an ASCII-art title tells a first-time visitor what skytalix is, how to play it, how to plug it into a UCI GUI, and its licence  (owner: software-engineer, size: XS, priority: P2, epic: EPIC-006, since: 2026-10-24, DoR 10/10 — Ready; cut in \`bapm-cut-readme\` (\`…50c55e37\`) on owner word \`…619938c5\` item 4. One file; ≤ 100 lines; art ≤ 12 lines × ≤ 80 cols, ASCII only; every command runs as written on a fresh clone; 0 publish path (ADR-0049 d3); LICENSE + NOTICE (ADR-0048); 0 paths/IPs/e-mails (ADR-0049 d4). No security hop; UAT waived by measurement; QE hop owed, A4 on a quiet host)`

`- [ABC-217] Test hardening: the ABC-206 and ABC-212 guards also see a missed discovered check, an in-module rebuild on legalMoves, and a dropped session clock; two stale gameStatus texts reworded  (owner: software-engineer, size: XS, priority: P3, epic: EPIC-008, since: 2026-10-24, DoR 10/10 — Ready; cut in \`bapm-cut-readme\` (\`…50c55e37\`) from QE-206-a/-b/-e, SEC-206-a, QE-212L-a (\`…cb10c36c\`, \`…4cf9da50\`). 3 test files + gameend.ts comment-only (Q4 two checks); plants P-a, P-b1, P-b2, Q1 red; NFR-008 sentinel at merge. No security hop; UAT waived if A6 holds)`

### Trace rows (10 cells, header order)

| ABC-216 (bapm-cut-readme) | A short README.md with an ASCII-art title tells a first-time visitor what skytalix is, how to play it, how to plug it into a UCI GUI, and its licence | EPIC-006 | — | none moves; ADR-0049 d3/d4 and ADR-0048 as criteria (A6–A8); no security clause fires | grugops/bapm-cut-readme @ 573523c9 (records only)<br>plans/tickets/ABC-216-a-short-readme-tells-a-first-time-visitor-what-skytalix-is-and-how-to-play-it.md<br>notes …514ce8a5, …50c55e37 | — | expected WAIVED by measurement (0 src files) | — | cut → Ready (XS, P2, DoR 10/10) |
| ABC-217 (bapm-cut-readme) | Test hardening: the ABC-206 and ABC-212 guards also see a missed discovered check, an in-module rebuild on legalMoves, and a dropped session clock; two stale gameStatus texts reworded | EPIC-008 | — | NFR-008 sentinel at merge (≤ 10 s); NFR-001 text already noted (security-nfr-note-ABC-206); no security clause fires | grugops/bapm-cut-readme @ 573523c9 (records only)<br>plans/tickets/ABC-217-the-abc-206-and-abc-212-guards-see-discovered-checks-in-module-rebuilds-and-the-session-clock.md<br>notes …514ce8a5, …50c55e37 | — | expected WAIVED under Q4 (…5c8e2a17) when A6 holds; else QE signs | — | cut → Ready (XS, P3, DoR 10/10) |
| EPIC-007 (bapm-cut-readme) | ADR-0049 § Records rows 20–24 answered on EPIC-007 (one dated paragraph; disposition ADR-0048, applied by bapm-epic007-licence-line) | EPIC-007 | public posture | none moves; ADR-0049 accepted by owner (…619938c5) | grugops/bapm-cut-readme @ 573523c9 (records only)<br>plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md<br>notes …514ce8a5, …50c55e37 | — | — | — | records placed; epic stays Done (no reopen) |
