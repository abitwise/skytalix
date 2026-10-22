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

## Result

**PASS_WITH_RISKS.** The diff has no defect and no required code fix. **One item is owed before the merge:** the `AR-163-DELONLY` instrument fix. Its trigger (iv), "a second limb-1 holder", FIRED on `src/uci.ts`. The notes are in `.grugops/context/security-nfr-ABC-168/notes/`:
- the readings: `…edfed8cb` (observation);
- the result: `…75a45be0` (decision).

Records: `plans/nfr-catalog.md` gains 24 lines and loses none. That is one table row (`NFR-011`), one `_Updated` line and one closing section. `NFR-001`–`NFR-010` hash the same before and after. There is no addendum on the ABC-168 page: QE's page section sits on the branch, so an addendum on main would conflict at merge. Nothing is committed. No timing was taken. The only plants are in scratch extracts.

### 1. (b1): fired as predicted, and no finding
- **What fired** (`clause-b.mjs` on `c98509b3..b71f8902`):
  - Limb 1 FIRES: (b1) `uci.ts:25` `node:readline`; Ruling 2 on `uci.ts`; (b2) `uci.ts -> book-file.ts`.
  - Limb 2 FIRES on 7 lines. Limb 3 is silent. Nothing is disputed.
  - `book-file.ts` is unchanged, so Ruling 2 is silent on it.
- **Is the book read the same constant path as the CLI's? YES.** Both bind the unedited, parameterless `readBookFile`, which reads from the module URL.
  - Measured on `src/` and `dist/`: a cwd decoy is ignored, and a real book in the cwd is not picked up when the copy sits away from its clone (P1–P4).
  - The AR-095-CWD → AR-183-CWDARG chain stays closed. `ABC-184` is in the base, and `CLI_DEEP` A7 still guards `book-file.ts`.
- **§ Decision 3's "fifth holder" re-arm FIRED.** (b2) still gets no call-graph reach, because `uci.ts` exports nothing and has 0 importers. The residual stays LOW, owned by Architect/Design, re-armed at a sixth holder.

### 2. `AR-163-DELONLY`: trigger (iv) FIRED. Its fix is owed before ABC-168 merges (the risk's own term)
- **Measured:** QE's deletion-only mutants D1 (drop `exitCode = 70`) and D2 (drop the EPIPE arm) fire nothing on any limb, and they pass `npm test` and the lane. Only the by-hand check lists them.
- **Severity:** MEDIUM while it is unfixed. It is not a `block_on` block.
- **The widened ruling:** for limb 1, (b1) fires on any changed line, `+` or `−`, in a file that holds limb 1 at `<base>` or `<head>`. The empty-holder case is kept.
- **The fix (Architect/Design):** drop `!lines.size` and print the `−` count, then update the `ADR-0036` § S1 text. BA/PM cuts it as an XS now.
- **QE reads it** with G-1b, the import-line drop, the uncomment plant, the A3 empty case, and D1 and D2.
- **Interim:** the Orchestrator runs the by-hand `--name-only` check with holders `src/book-file.ts` and `src/uci.ts`.
- **If the owner merges first,** he accepts it at MEDIUM by name.

### 3. Clause (a): CONFIRMED, no finding
- No dependency or lifecycle script moves, and the lock is unchanged.
- The lock root still lacks `bin` and `license` (INFO). That rides the post-merge lock chore from `QE-172-a` (+4 root lines). Owner: the Orchestrator.
- Clause (c) does not fire: the lane uses the existing `spawnSync` argv form.

### 4. QE-168-b and QE-168-c
- **QE-168-b: ACCEPTED, LOW, as `AR-168-BINPIN`.** Owner: the Orchestrator.
  - **Compensating control:** any `package.json` edit fires clause (a), and the surviving mutant fails loudly.
  - **Follow-up to BA/PM:** an XS/P3, test-only ticket that adds a one-line `bin` value pin in `ABC-042` A10, red on QE's (iv-b).
  - **When the fix becomes owed before a merge:** packaging `dist/`, a backend dependency on `skytalix`, or any `bin` edit.
- **QE-168-c: ACCEPTED, INFO, as designed.** Owner: the Orchestrator.
  - **Compensating control:** QE hand-reads A1–A4 on every `uci.ts` edit. Once § 2 lands, every `uci.ts` edit, deletion-only included, routes to Security/NFR.
  - **Optional, not owed:** A1 and A2 rows in the opt-in `UCI_DEEP` lane.

### 5. NFR rows
- **(i) PLACED as `NFR-011`.** M3's numbers (2 000 / 1 000 / 100 ms) are unchanged. The instrument is the A6 probe, and the first reading is 86.1 / 6.9 / 0.2 ms, MET. It is not M3's proof until the owner confirms `…20cc2ffe`.
- **(ii) NOT YET.** Its instrument is unpinned until A8's first UAT run. It gets placed after A8/A9. Owner: Security/NFR.
- **(iii) NOT placed.** M4 is already pinned in the default lane and the opt-in lane.
- **Unchanged:** `NFR-004`, `NFR-006`, `NFR-008` (`N8-SPAWN` stays at 0), `NFR-009` and `NFR-010`.

### 6. INFO: the stdin trust boundary
The engine trusts its launcher. A web backend that relays browser input must bound line length and command rate, keep one process per session, and kill the process on disconnect. Owner: the owner (web project). Trigger: the backend's design.

### Owed
- **The Orchestrator:**
  - move the card In Security/NFR → Ready for UAT (A8–A10 are owed to the owner; the waiver does not apply);
  - **hold the merge for § 2**;
  - route the § 2 and § 4 cuts to BA/PM;
  - run the by-hand check until § 2 lands;
  - commit `plans/nfr-catalog.md` and the notes;
  - append the trace row below (10 cells, counted).
- **Architect/Design:** the § 2 fix and the § S1 wording.
- **Security/NFR:** row (ii) after UAT.
- **Unchanged:** QE-168-a (BA/PM rules on it), QE-168-d and QE-168-e.

### Trace row
| ABC-168 (Security/NFR) | clause (b) instrument on c98509b3..b71f8902 (L1 FIRES: node:readline, Ruling 2 on uci.ts, (b2) uci.ts -> book-file.ts; L2 FIRES 7 lines; L3 silent); book read module-URL on src and dist (P1–P4); deletion-only D1/D2 silent on every limb; clause (a) clean; NFR-011 placed; security-nfr-ABC-168 …edfed8cb / …75a45be0 | EPIC-007 | — | ADR-0036 (b1)/(b2) fired, no finding; § Decision 3 fifth holder: no call-graph reach (LOW, Architect/Design); AR-163-DELONLY trigger (iv) FIRED (MEDIUM until fixed; fix owed before merge; owner Orchestrator, fix Architect/Design); AR-168-BINPIN (QE-168-b) LOW accepted, owner Orchestrator; QE-168-c INFO accepted; ABC-041 (a) confirmed, (c) not fired; QE-172-a lock chore INFO; AR-095-CWD / AR-162-FALLBACK / AR-180-VALIDATED / AR-183-CWDARG stay closed; NFR-011 placed, rows (ii) not yet, (iii) not placed; V1.2.5, V5.3.2, V15.1.1, V15.2.1 [L1] met | grugops/qe-ABC-168 @ 7e831392 (merge 6d27dc9e; code b71f8902; base c98509b3)<br>records: plans/nfr-catalog.md (+24/−0), context notes | no gate re-run (QE's stand: npm test 1988/1988, UCI_DEEP 5/5); npm run build rc 0 in scratch; plants P1–P4, D1, D2; no timing | UAT owed (A8–A10, owner); waiver does not apply | — | Security/NFR PASS_WITH_RISKS: In Security/NFR → Ready for UAT; merge held for the AR-163-DELONLY fix |
