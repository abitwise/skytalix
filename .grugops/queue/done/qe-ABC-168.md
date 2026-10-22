---
subtask: qe-ABC-168
role: qe-e2e
ticket: plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
ref: .grugops/context/qe-ABC-168/
branch: grugops/ABC-168 (tip b71f8902; SE code 6232cfa7/825b21d1, merges of main 683129f7 and 8b1e1c67; Scribe a347902b); worktree ../wt-ABC-168 (read only)
width: 2 (beside qe-ABC-187)
---

# QE gate for ABC-168 (`skytalix`: UCI entry point, `dist/` artifact + `bin`, `UCI_DEEP` lane, ABC-042 A10 pin edits, Scope 5 lines)

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha and any conflict.
- Verify every criterion against the page **as amended** (ruling (a), `ADR-0044` § Addendum 2026-10-21; A6 route (2), BA/PM `…eb53fbfe`), with your own runs before opening the SE's and Scribe's notes.
- **`A6` is yours:** one run of an async probe under `.grugops/context/qe-ABC-168/probe/` with plain `node` (never vitest; `C2` stays untouched), against `node src/uci.ts` at the tip, default options, per the page's test note 6: clock points, one counted run, 10,000 ms miss bound, record host chip, Node version, load1, tip sha, met/missed per number. A miss is reported, not trimmed, and goes to Security/NFR.
- **`A7` on a fresh clone** of the tip: `npm ci && npm run build`, shebang, the `dist/` contents (four type-only emits allowed, not loaded), `grep -l 'import(' dist/*.js` empty, the away-from-clone run after `rm -f` of the four.
- **Pending owner confirmations:** EPIC-007 M9's and M3's rewordings are not yet confirmed. Read `A7` and `A6` regardless; record that their M9/M3 link is pending.
- **Mutation reads:** plant at least: (i) `src/uci.ts` writes before the `EPIPE` arm; (ii) an argument accepted instead of exit 1; (iii) the exception path exiting 0; (iv) `bin` pointing elsewhere; show each is caught by a test or a criterion, or record the survivor.
- **Standing reads:** if `spawnNode`/`RealChild` or a sibling helper is used, its `spawnSync` `cwd` option equals the returned `cwd` (QE-184-a); child counts with `--reporter=verbose`, ≥ 1 (QE-184-c).
- **Gates** on the tip/merge: lint, typecheck, build; `npm test` + `last-run.json` success (60 / 1988); skip-integrity `--skip-count 0`; `UCI_DEEP` (5/5), `CLI_DEEP` (11/11, 6 children), `PERFT_DEEP` (32/32). Heap 400 one-file, 128 multi-file; one at a time. No timing beyond A6's probe.
- **UAT:** production lines are present; UAT is owed to the owner (A8–A10 need cutechess-cli and En Croissant on his Mac). Measure the waiver form anyway and report it.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-168` on a branch from the tip. Plants only in scratch copies; the probe only under `.grugops/context/qe-ABC-168/probe/`.
- Commit typed notes, the probe and its output, written inside your worktree, and a `## QE` section on the ABC-168 page there.
- No edits to `src/`, `AGENTS.md`, `EPIC-007`, ADRs, `plans/board.md`, `plans/traceability.md` or other ticket pages.
- Never push, `--force`, `--amend` or rebase; never merge into `main`. Touch no process you did not start.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-168`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-168.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-168 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**QE, 2026-10-21T14:30:19Z. Verdict: PASS_WITH_GAPS (QE-168-a, QE-168-b LOW; QE-168-c, QE-168-d, QE-168-e INFO; 0 blocking). UAT OWED to the owner (A8–A10). Recommend In Review → In Security/NFR (triggered). Column moves are the Orchestrator's.**

- Branch `grugops/qe-ABC-168` in `../wt-qe-ABC-168`, from tip `b71f8902`. **Merge of main `649b3f82` → `6d27dc9e`**, ort, no conflict; only queue records, board, trace and the ABC-168 page came in (`src/`, `package.json`, `tsconfig*`, `data/` identical to the tip). QE tip (notes, probe, `## QE` page section): `7e831392`.
- Own runs before the SE/Scribe notes were opened. **A1, A2, A3 MET; A4 MET by review** against `src/cli.ts:212-216` (no test seam), plus a live planted-fault check in scratch (rc 70, fixed line, no stack); **A5 MET** (`UCI_DEEP` 5/5); **A7 MET** in a fresh clone of `b71f8902` (`npm ci && npm run build` 0, shebang, 22 files incl. the four type-only emits, none forbidden, `import(` grep empty, `node dist/uci.js` and linked `skytalix` rc 0, check-ignore and typecheck hold, away-from-clone after `rm -f` of the four: 1 book warning, `bestmove g1f3`, rc 0; negative control `ERR_MODULE_NOT_FOUND`). `npm link` used a scratch `npm_config_prefix`; the user's global prefix was not touched. **A11 MET** (D2 list unchanged; 4/2; `npm run chess` starts; pin armed: 1/88 red, ABC-042 A10 only). **A12 not met literally** (QE-168-a). A8–A10 UNKNOWN - verify.
- **A6 (one counted run, `.grugops/context/qe-ABC-168/probe/a6-probe.mjs`, plain node, against `node src/uci.ts`, default options):** Apple M3, Node v26.11.1, load1 3.85, sha `6d27dc9e` (src = `b71f8902`). spawn → uciok **86.1 ms** (≤ 2 000) **met**; first isready → readyok incl. book load **6.9 ms** (≤ 1 000) **met**; idle isready → readyok **0.2 ms** (≤ 100) **met**; quit → exit 0. No miss. The probe was dry-run once against a stub (not uci.ts) first; that is not a reading. M3 link pending the owner; M9 link (A7) pending the owner.
- **Gates at `6d27dc9e`:** lint 0, typecheck 0, build 0; `npm test` 60 files 1988/1988, `last-run.json` success true; skip count 0, integrity `No findings.`; lane-inventory 60 = 60; `UCI_DEEP` 5/5 (1 child, verbose); `CLI_DEEP` 11/11 (6 children, verbose); `PERFT_DEEP` 32/32. Heap 400 one-file, 128 multi-file; one at a time. No timing beyond the probe.
- **Mutation reads (scratch extract only; `probe/mutants.sh`, `mutants-output.txt`):** (i-a) arm after the first writes: survives all, caught by review only (arm precedes every write at the tip); (i-b) arm removed: suite green, caught by A3; (ii) argument accepted: suite green, caught by A1; (iii) exception → 0: suite green, caught by A4 review only; (iv-a) bin → dist/cli.js: pin green, caught by A7 npm link; (iv-b) bin → src/uci.ts: survives the pin and A7 (QE-168-b).
- **Standing reads:** QE-184-a not applicable (no spawnNode/RealChild or sibling helper; the lane's spawnSync uses cwd REPOSITORY and returns no cwd). QE-184-c holds (CLI_DEEP 6, UCI_DEEP 1 with `--reporter=verbose`).
- **Gaps:** QE-168-a (LOW) A12's list omits `memory-bank/90-agents-md-command-log.md`, changed by the Scribe's Scope 5 hop (`a347902b`); records, not code; BA/PM to rule. QE-168-b (LOW) bin's value is unpinned; `bin → src/uci.ts` survives the suite and A7 (a link resolves outside node_modules); read by hand as `dist/uci.js`. QE-168-c (INFO) A1–A4 have no vitest row; three mutants pass npm test. QE-168-d (INFO) ABC-171 A1's page text says `default 3`; ADR-0045 made it 5. QE-168-e (INFO) owner's M9 and M3/RISK-EPIC007-05 confirmations owed.
- **UAT waiver (AGENTS.md form):** `git diff --name-only 825b21d1~1 825b21d1 | grep -v '\.test\.ts$' | grep '^src/'` prints `src/uci.ts` (90 production lines over `c98509b3..b71f8902`) → waiver does NOT apply; UAT owed to the owner. The tip-commit-only form prints nothing and would mislead.
- Notes (sealed observations, committed on the branch), `.grugops/context/qe-ABC-168/notes/`: `…observation-1b96c204` (A6), `…observation-7547ac22` (criteria), `…observation-537e343b` (gates), `…observation-b1a6b8ef` (mutants), `…observation-1c648c1a` (verdict + gap register). No `finding` (human_admission off).
- **Disclosure:** A1–A3 hand-run stdout/stderr captures briefly went to `/tmp/claude-a*` instead of the session scratchpad; removed at once.

Trace row (10 cells, not appended):

| ABC-168 (QE) | QE re-ran A1–A7, A11, A12 and the gates at the merge of main; read A6 once by the async probe; planted 6 mutants in scratch | EPIC-007 | — | ADR-0044 D2/D8/D9 + Addendum 2026-10-21, ADR-0016, ADR-0045, ADR-0036 (b1) + ABC-041 (a) → Security/NFR; candidate row (i) A6 86.1/6.9/0.2 ms met; QE-168-a, QE-168-b (LOW), QE-168-c, QE-168-d, QE-168-e (INFO) | grugops/qe-ABC-168 @ 7e831392 (merge of main 649b3f82 at 6d27dc9e)<br>.grugops/context/qe-ABC-168/notes/ (5), probe/ (6), ABC-168 page § QE | lint 0, typecheck 0, build 0; npm test 60 files 1988/1988, last-run success; skip-count 0, integrity No findings; UCI_DEEP 5/5; CLI_DEEP 11/11 (6 children); PERFT_DEEP 32/32; A7 fresh clone npm ci 0 | UAT OWED to the owner (A8–A10; waiver form prints src/uci.ts) | — | PASS_WITH_GAPS; In Review → In Security/NFR |
