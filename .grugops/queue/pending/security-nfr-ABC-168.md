---
subtask: security-nfr-ABC-168
role: security-nfr
ticket: plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
ref: .grugops/context/qe-ABC-168/
branch: grugops/qe-ABC-168 @ 7e831392 (main merged at 6d27dc9e; delivery tip b71f8902); QE worktree ../wt-qe-ABC-168 (read only)
width: 3 (beside qe-ABC-187 and bapm-rule-QE-168)
---

# Security/NFR: ABC-168 — `ADR-0036` (b1) (process, `node:readline`, the new import of the capability holder `book-file.ts`), `ABC-041` clause (a) (`package.json`), and `ADR-0044`'s three candidate NFR rows

QE passed with gaps (`.grugops/context/qe-ABC-168/notes/` on the branch). A6, one counted probe run (Apple M3, Node v26.11.1, load1 3.85): `uciok` 86.1 ms (≤ 2,000), first `readyok` 6.9 ms (≤ 1,000), idle `readyok` 0.2 ms (≤ 100), all met. Gaps: QE-168-a (LOW, A12 file list; BA/PM rules in parallel), **QE-168-b (LOW): nothing pins `bin`'s value** (a plant pointing it at `src/uci.ts` passes the pin and A7's `npm link` check), **QE-168-c (INFO): A1–A4 have no vitest test** (argument accepted, exception path exit 0, EPIPE arm removed all pass `npm test`), QE-168-d/-e INFO.

## Decide
1. **(b1):** run the clause (b) instrument on the delivery diff and read every limb; Ruling 2 (holders at base and head) for `book-file.ts`'s new importer. Is the launch path's cwd/module-URL book read the same constant path as the CLI's (the closed AR-095-CWD / AR-162-FALLBACK / AR-180-VALIDATED / AR-183-CWDARG chain)?
2. **Clause (a):** `package.json` gains `bin`, `build`, `uci`; `package-lock.json` unchanged (A12). Confirm no dependency moves; note the lock's missing `bin`/`license` lines (the lock-regeneration chore cut after this merge).
3. **QE-168-b, QE-168-c:** accept, or require a fix before merge (shape and owner), or route to BA/PM as follow-ups.
4. **NFR rows:** place `ADR-0044`'s candidate rows (i) idle responsiveness (A6, QE's probe as instrument) and the others in `plans/nfr-catalog.md`, or say why not yet.
5. **Verdict:** PASS / PASS_WITH_RISKS / FAIL, with required fixes and accepted risks (owner, trigger, close condition).

## Fences
- Records only: notes, `plans/nfr-catalog.md` rows, a dated Security/NFR addendum where the project keeps risk records. No `src/`, `package*.json`, `AGENTS.md`, board, `plans/traceability.md` or worktree edits. No timing. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-ABC-168`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/security-nfr-ABC-168.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**:
  `| ABC-168 ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
