---
subtask: scribe-ABC-164
role: agents-md-scribe
tickets: [ABC-164]
branch: grugops/ABC-164 (from main @ the main tip at your start); worktree ../wt-ABC-164
ref: .grugops/context/scribe-ABC-164/
width: 2 (beside qe-ABC-186; disjoint files)
---

# Scribe: ABC-164: split `AGENTS.md` per the owner's Option A — keep what every role session needs, move the rest word for word to named files reachable by a pointer. ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-164-agents-md-sits-at-its-byte-budget-with-two-stale-test-receipts.md` (DoR 10/10 after `bapm-fold-A-ABC-164`): every criterion `A1`–`A7`, the 39-block Scope table, the fixed keeps, the corrections C1 (the `PERFT_DEEP=1` line stays) and C2 (`## Safety rules` stays whole), and the trap (no new backticked `npx vitest` text in `AGENTS.md`).
- The audit `.grugops/context/scribe-audit-agents-md/notes/` (`…ffbb746f`, `…38d2af93`), BA/PM `…d197dcbd`, `…a7cd9ce2`, and the owner record `…18e4ada0`.

## Do
- Create the worktree `../wt-ABC-164` on `grugops/ABC-164` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Read every criterion at base first, with scripts, on joined text.
- Implement exactly the page's Scope: move text **byte for byte** (no rewording beyond what the page names), keep headings so `§` citations resolve, land O1 in `AGENTS.md`, O2 and O3 in the command log.
- Show `A4` (every removed line is found in a target file) with a script and list any miss.
- Gates on the tip: lint, typecheck, build; `npm test` + `.test-results/last-run.json` success (59 / 1987, equal to base; the `ABC-042`, `ABC-059`, `ABC-065`, `ABC-067`, `ABC-071`, `ABC-109` and `ABC-173` rows must stay green); skip-integrity `--skip-count 0`. `npm test` sets heap 128 itself; one run at a time. No timing.
- Measure the UAT waiver in AGENTS.md's form (must print nothing). Report `wc -c AGENTS.md` before and after, and the headroom in edits at 1,159 B/edit.

## Fences
- Exactly the 5 files the page allows. No `src/`, `plans/` (except nothing), or other worktrees. The budget constant stays.
- Commit on `grugops/ABC-164` only. Never push or merge.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `scribe-ABC-164`. **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`. Write notes inside your worktree. Include a `kind: decision`.
- Write `.grugops/queue/done/scribe-ABC-164.md` (brief + `## Result`: tip, per-criterion results, bytes, gates, waiver) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (rule `…d2b9bf09`); do NOT append it yourself:
  `| ABC-164 (Scribe) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**Branch `grugops/ABC-164` (worktree `../wt-ABC-164`), from `main` `49dc490c`.**
- Code tip: **`e82a3798`** (the five files). Branch tip: **`3971302c`** (adds only `.grugops/context/scribe-ABC-164/`, two sealed notes). `git diff --name-only 49dc490c e82a3798` lists exactly the five files; `A7`'s five-file fence is read at `e82a3798`.
- Notes (sealed with `admitAndAppend`, worktree as context root, `at` from `date -u`): `.grugops/context/scribe-ABC-164/notes/20261021T132050Z-agents-md-scribe-observation-41a428be.md` (readings) and `…T132051Z-agents-md-scribe-decision-d9ab58b9.md` (rulings, flags).
- `node_modules` symlink: removed before finishing (it is ignored anyway). Nothing pushed or merged.

**Bytes.** `AGENTS.md` 24,575 B -> **15,606 B** (373 -> 216 lines). Headroom at the unchanged 24,576 B budget constant: **8,970 B = 7.74 edits** at 1,159 B/edit (page needs ≥ 5.3). Against 18,432: 2,826 B (2.44 edits). Base: 1 B.

**Criteria (my readings, joined text, scripts).**
- `A1` met (15,606 ≤ 18,432; the `90` entry states the figure and both headrooms).
- `A2` met: (a) 0 of the five heading lines (base 1 each); (b) 0 backticked self-references (base 1/2/1/2); (c) 1 comment between `### Test` and `### Acceptance` (base 10); (d) all 20 canaries 0; (e) one `## Standing rulings`, all 11 listed strings present, every other non-pointer sentence verbatim in `45`.
- `A3` met: `45` exists, five headings 1 each; `90`'s three new headings 1 each, the four old ones still 1, `40` "Conventions" 1; six pointers present, Memory bank & plans names `45` and `90`, `00-index.md` row added; lane table 15 rows, every heading it names matches exactly 1.
- `A4`: whole-run matching cannot reach 0 under Option A (a lane line's command stays at head while its comment moves). Token-level check of what the added lines do not carry: every moved comment, command line and section found word for word. Misses, all three named kinds, listed in the `90` entry: the O3 rewording (old sentence quoted there, so nothing is lost), the three re-pointed `## X` references, and lines replaced by pointers (Dev / run receipts lead, worker-cap "1..2", the QE-hop comment's replacement, the budget pointer).
- `A5` met (all strings in the file the page names). `A6` met (`contextRoot` in `AGENTS.md`; O2 and O3 in `90`; no `plain node` / `not run here` in the ladder section or `AGENTS.md`; `AGENTS.md` has 0 `LADDER_DEEP=verdict`).
- `A7` met: `vitestCommandsIn(AGENTS.md)` = 17 including the `PERFT_DEEP=1` line; five files only; 0 `src/` lines; `AGENTS_MD_BUDGET_BYTES` untouched at `24_576`.

**Gates (no timing).** lint exit 0; typecheck exit 0; build exit 0; `npm test` exit 0, **59 files / 1987 tests** (equal to base), `.test-results/last-run.json` `success` true; the `ABC-042` (31 rows), `ABC-059`, `ABC-065` (4), `ABC-067`, `ABC-071`, `ABC-109` and `ABC-173` (9) rows all green; `test-skip-integrity.js --skip-count 0`: `No findings.` `npm test` was run twice (before and after the `90` entry was appended; same counts).

**UAT waiver.** `git diff --name-only e82a3798~1 e82a3798 | grep -v '\.test\.ts$' | grep '^src/'` prints nothing (0 production lines, no `.snap`).

**Rulings and flags for QE / the Orchestrator** (full text in the decision note):
- O1 is worded for "the checkout you work in" (covers worktree hops), not only "the main checkout".
- `## Standing rulings` carries four sentences beyond the 11 required (green report is not acceptance; unfiltered form is the reference; a waiver is not a signature; a reader who counts four is wrong), each verbatim in `45`.
- `src/cli.test.ts:2242` comment ("13 further closers") is now stale (8 remain): `src/`, out of fence, flagged.
- Budget constant still `24_576`; lowering it (to 18,432 or lower) is the open owner decision and an Engineer ticket.
- A QE hop is owed. Recommended move: In Development -> In Review (Orchestrator's call).

**Trace row (10 cells; NOT appended by me):**
`| ABC-164 (Scribe) | Option A split of `AGENTS.md`: 24,575 -> 15,606 B; five governance sections to new `45`, lane comments, slot writing rules, worker-cap detail, book and perft lines to `90`, QE-hop comment to `40`; O1 in `AGENTS.md`, O2 and O3 in `90` | — | — | ADR-0038 | grugops/ABC-164 @ e82a3798 (notes @ 3971302c)<br>`AGENTS.md`, `memory-bank/45-standing-rulings.md`, `memory-bank/90-agents-md-command-log.md`, `memory-bank/40-contributing.md`, `memory-bank/00-index.md` | lint, typecheck, build exit 0; `npm test` 59 / 1987 green; skip-count 0 | UAT waiver: 0 production lines (form prints nothing) | — | In Development -> In Review (QE owed) |`
