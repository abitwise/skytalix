---
subtask: qe-ABC-164
role: qe-e2e
ticket: plans/tickets/ABC-164-agents-md-sits-at-its-byte-budget-with-two-stale-test-receipts.md
ref: .grugops/context/qe-ABC-164/
branch: grugops/ABC-164 (tip 3971302c; code e82a3798; base 49dc490c); Scribe worktree ../wt-ABC-164 (read only)
width: 1
---

# QE gate for ABC-164 (the owner's Option A split of `AGENTS.md`; 0 `src/` lines)

## Do
- Verify `A1`–`A7` against the page with your own scripts, on joined text, before opening the Scribe's notes (`.grugops/context/scribe-ABC-164/` on the branch).
- **The owner's goal is the yardstick:** `AGENTS.md` keeps what every role session needs; nothing becomes unreachable. Read the new `AGENTS.md` as a fresh role session would (Orchestrator, SE, QE, Security/NFR, BA/PM) and say, per role, whether anything it needs on start now sits behind a pointer. Name it.
- **`A4` strictly.** The Scribe says a literal whole-run match cannot reach 0 under Option A (each lane's command stays, its comment moves) and checked at token level; the only misses are the O3 rewording, three re-pointed `## X` references, and lines replaced by pointers. Run your own check, list every removed line not found word for word in a target file, and rule whether each is one of the page's named kinds.
- **Reachability:** every moved block is reached by one pointer from `AGENTS.md` or an index row in `memory-bank/00-index.md`; old `§` headings resolve in `memory-bank/45-standing-rulings.md`; 17 roles' `§ Kit vs state` citations and `src/`'s "AGENTS.md rule N" citations still resolve.
- **Pinned tests:** the `ABC-042`, `059`, `065`, `067`, `071`, `109` and `173` rows green; exactly 17 vitest commands parsed; no new backticked `npx vitest` text.
- **O1** (writer `contextRoot` pointer; the Scribe worded it for "the checkout you work in"), **O2**, **O3**: landed where the page says, and true.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. No timing. UAT waiver in AGENTS.md's form. `wc -c AGENTS.md` (Scribe: 15,606).
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-164` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-164 page there.
- No edits to `AGENTS.md`, `memory-bank/`, `src/`, `plans/board.md`, `plans/traceability.md` or other ticket pages.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-164`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-164.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (rule `…d2b9bf09`); do NOT append it yourself:
  `| ABC-164 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**Tip `224ddd38`** on `grugops/qe-ABC-164` (local, not pushed; worktree `../wt-qe-ABC-164`), branched from `3971302c` (code tip `e82a3798`, base `49dc490c`). Not merged with `main`. `main` `dc8a5f8e` touched none of the five files since `49dc490c`, and `git merge-tree --write-tree main 3971302c` is clean. **Verdict: PASS_WITH_GAPS.** A1–A7 are MET at the code tip; 0 gaps block; 1 is LOW and 8 are INFO.

**Per criterion.** QE's own scripts ran on joined text before it opened the Scribe's notes (observation `…observation-2593d786`).
- **A1 MET.** 24,575 → **15,606 B** (373 → 216 lines). The `90` entry's figures check: 8,970 B = 7.74 edits at 24,576 B, and 2,826 B = 2.44 edits at 18,432 B.
- **A2 MET.**
  - (a) all five headings 0, base 1 each.
  - (b) all four references 0, base 1/2/1/2.
  - (c) one `<!--` in § Test, on `npm test`'s line; base 10.
  - (d) all 20 canaries 0, and every base count equals the page's bracket.
  - (e) one `## Standing rulings` line. All 11 listed strings are present, and every sentence of its 6 bullets is verbatim in `45`.
- **A3 MET.**
  - `45`'s five headings match 1 each.
  - In `90`, the three new headings match 1 each (base 0) and the four existing ones still match 1. `40` "Conventions" matches 1, and the moved comment sits inside it.
  - All six pointers are present, plus § Memory bank & plans and the `00-index` row.
  - The lane table has 15 rows, and every heading it names matches 1.
- **A4 MET, read strictly** (`…observation-71f134f6`).
  - Per run: 19 removed runs, 8 found whole. The other 11 are command-plus-comment runs or pointer edits, and each of their pieces is found.
  - Per line: 182 removed lines: 140 found, 6 split (command stays, comment found), 28 blank, **8 misses**:
    - 7 of the page's named kinds: 1 O3, 2 re-pointed references, 4 pointers;
    - 1 unnamed: the O1 insertion split the `installed_plugins.json` line, and both halves stay in AGENTS.md.
  - 0 words lost. The old O3 sentence is quoted verbatim in the `90` entry.
- **A5 MET.** Every string is present where the page asks (`90`: `NOT DEFINED, not skipped` 4, `Run at QE` 5, `RISK-ABC152-NEGWORKERS` 2).
- **A6 MET, and each owed line is true.**
  - O1 checked against `context-io.js:55-56`, where `DEFAULT_CONTEXT_ROOT` sits under the plugin's own directory.
  - O2 checked against `…7b9ef6a7`:38 and :50 and `…9fd3189b`:26.
  - O3 checked against `…4c1d8e27`:42 (40,823 s), `…b7e2c915`:17 (4.1.11, 17/17) and ADR-0038:18-21 (route V; route N is the fallback).
- **A7 MET.**
  - `vitestCommandsIn` (the logic from `src/cli.test.ts:3733`) gives 17 at base and 17 at head. The two sets are equal, with one `PERFT_DEEP=1`.
  - No new backticked `npx vitest`: the 3 `+` lines carrying it are lane commands re-emitted without their comments.
  - 5 files at the code tip, 0 `src/` lines, `AGENTS_MD_BUDGET_BYTES = 24_576`.

**Owner's goal: met.** Each role session reads 15,606 B on start instead of 24,575 B, and nothing is unreachable (`…observation-be05dcb3`).
- **SE:** no second document on start. Before changing a lane-guarded file it needs `90` § On-demand commands, because the lane triggers moved there.
- **QE:** needs that table on every hop, 2,929 B more. The puzzle rule "red = QE FAIL", its baseline rule and the `weakened` reading are two hops away: table → § Puzzle-suite strength gate.
- **Orchestrator:** needs `45` (8,683 B) on most hops. Behind that pointer: the criteria re-read procedure, `Ready for UAT` → `Done`, "agent-run UAT … never a stamp", the config trap, QE's forward-only rule. The QE-hop exit codes are in `40`.
- **Security/NFR:** none on start. It needs `45` § Deployment posture when deploy is touched, and `RISK-ABC152-NEGWORKERS` is in `90`.
- **BA/PM:** needs `45` § Process rules when writing a ticket: what stays in it, and the ≤ 300-line control.

**Gates.** Run at `3971302c`, whose code tree equals `e82a3798`'s (`…observation-5177d77f`).
- lint rc 0 (116 files); typecheck rc 0; build rc 0.
- `npm test` rc 0, 59 files / 1987 tests. `.test-results/last-run.json`: `success: true`, 0 failed / pending / todo.
- `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts -t "AGENTS.md"` rc 0, 8 passed (the other 80 are the filter's exclusions). The ABC-042 A1, 059, 065 A1/A3, 067, 071, 109 A5 and 173 A3 rows are green by name.
- Skip-count capture 0; `test-skip-integrity.js --skip-count 0`: "No findings.", rc 0.
- `wc -c AGENTS.md` 15,606, equal to the Scribe's figure. No timing was taken.

**UAT waiver** (AGENTS.md form): `git diff --name-only e82a3798~1 e82a3798 | grep -v '\.test\.ts$' | grep '^src/'` prints nothing, and `49dc490c..3971302c` also prints nothing. 0 production lines, so the waiver holds. A waiver is not a signature. Re-measure on the delivered commit.

**Gap register** (verdict `…decision-47cae669`; none blocks):
- **QE-164-a (LOW).** `90` keeps present-tense claims this pass made false:
  - § Dev / run: "`AGENTS.md` carries the rules in the slot's own comment; this entry is their receipt."
  - § Regenerate the opening book: "`AGENTS.md` carries the line and one fact".
  - the preamble's "keeps each command line" and the Reader's "one-line-per-command index".
  - Fix: a records-only Scribe amend of `90`.
- **QE-164-b (INFO).** The A4 miss list in the `90` entry leaves out the O1 line split. It also lists the QE-hop comment, which is found whole in `40`.
- **QE-164-c (INFO).** O1 reads "the checkout you work in". The page row says "the main checkout's". QE rules the AGENTS.md wording true and correct, so the page row can be amended at close.
- **QE-164-d (INFO).** 8 live citations still name `AGENTS.md` § <moved heading>: `70-runbook.md:83`, `60-progress.md:167/335/464/974`, `ADR-0018:48/157`, `ADR-0037:561`. Each resolves in one hop via § Standing rulings.
- **QE-164-e (INFO).** The per-role costs above. By design; nothing is unreachable.
- **QE-164-f (INFO).** A7 read literally at the branch tip lists 7 files: the 5 plus 2 Scribe context notes. At the code tip it lists 5.
- **QE-164-g (INFO).** The ABC-173 A3 pin asserts `>= 17`, not `== 17`. "Exactly 17" is held by QE's reading, not by a test.
- **QE-164-h (INFO).** The comment at `src/cli.test.ts:2242` says "13 further closers". There are now 8. No assertion depends on it; already flagged in `…d197dcbd`.
- **QE-164-i (INFO).** Scribe decision `…d9ab58b9` says "Seven operative bullets"; there are 6.

**Recommended move** (the Orchestrator's): `In Review` → `Ready for UAT`. Security/NFR is not triggered (per the page). After merge, the standing waiver applies and the ticket goes to `Done`. QE-164-a is a follow-up Scribe line, not a blocker.

**Notes** (task `qe-ABC-164`, committed on the QE branch in `224ddd38`, sealed by `admitAndAppend` with the worktree's context root `../wt-qe-ABC-164/.grugops/context`, `at` 2026-10-21T13:29:11Z): `20261021T132911Z-qe-e2e-observation-2593d786` (criteria), `…-observation-71f134f6` (A4), `…-observation-5177d77f` (gates), `…-observation-be05dcb3` (role sessions), `…-observation-89fca9e3` (break attempts and O1–O3 truth), `…-decision-47cae669` (verdict). No `finding`: `human_admission` is off and there is no §14 stamp. Nothing was written to the plugin cache.

**Fences held:**
- No edit to `AGENTS.md`, `memory-bank/`, `src/`, `plans/board.md`, `plans/traceability.md` or any other ticket page.
- No merge, push, force, amend or rebase.
- `node_modules` in the worktree is a git-ignored symlink to the main checkout's copy.
- `pending/qe-ABC-164.md` and `claimed/qe-ABC-164/` are left for the Orchestrator's close.

**Trace row** (10 cells, not appended):
`| ABC-164 (QE) | QE gate at code tip e82a3798: A1–A7 MET by own joined-text scripts; A4 read strictly per line (8 misses, 7 named kinds + the O1 split, 0 words lost); 5 role sessions read fresh, nothing unreachable | — | — | QE-164-a (LOW); QE-164-b, QE-164-c, QE-164-d, QE-164-e, QE-164-f, QE-164-g, QE-164-h, QE-164-i (INFO) | grugops/qe-ABC-164 @ 224ddd38 (from 3971302c)<br>ABC-164 page (## QE) + 6 notes; no AGENTS.md, memory-bank or trace edit | lint, typecheck, build rc 0; npm test 59 / 1987 passed; skip-integrity 0; 17 vitest commands (= base); AGENTS.md 15,606 B | waiver (0 production lines) | — | PASS_WITH_GAPS; In Review → Ready for UAT (Orchestrator's move) |`
