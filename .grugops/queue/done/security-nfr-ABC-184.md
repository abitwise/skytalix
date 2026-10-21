---
subtask: security-nfr-ABC-184
role: security-nfr
ticket: plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md
ref: .grugops/context/qe-ABC-184/
branch: grugops/qe-ABC-184 @ 2c65403b (over SE 442d1e57/c6f80c81; base 5277babd); QE worktree ../wt-qe-ABC-184 (read only)
width: 2 (beside qe-ABC-165)
---

# Security/NFR: AR-183-CWDARG close, and QE-184-a / -b / -c

QE (verdict `…7b9ef6a7`) read `AR-183-CWDARG`'s close condition met: TCWD + P6f is 11/11 green on the base test and 10/11 on the head test, `A7` red at `:504`, `AR-183-CWDARG` in the output. QE also recorded three INFO gaps (plant evidence in the `qe-ABC-184` notes on the branch):
- **QE-184-a (TSPWN):** a one-line edit inside `spawnNode`, changing only the `spawnSync` `cwd` option for the neutral child, survives P6f. The page names this residual but calls it a "two-place helper edit"; QE measured one line.
- **QE-184-b (TFORGE):** a forged record on the `booked` line, `{ ...spawnReal(…), cwd: neutral }`, survives P6f.
- **QE-184-c:** child counting from `[CLI_DEEP]` lines needs `--reporter=verbose` in an agent session (vitest agent detection).

## Decide
1. **AR-183-CWDARG.** Close it as written, close it with a narrower named residual (owner, trigger, close condition), or keep it open. The Orchestrator owns the risk and records the close per your ruling.
2. **QE-184-a and QE-184-b.** Accept, or name a fix shape for BA/PM with priority and trigger. Say whether either undercuts the close (QE says neither does), and whether the page's "two-place" wording needs an erratum.
3. **QE-184-c.** Accept or route (it touches how the `N8-LANE` child count is read).
4. **Security surface.** Confirm the change is test-only (`src/cli.real-engine.test.ts`, +7/−0, 0 production lines) and raises no new concern.

## Fences
- Records only, plus the risk record where `AR-183-CWDARG` lives (the Security/NFR addenda on the ABC-095 page).
- No `src/`, `AGENTS.md`, board, `plans/traceability.md` or worktree edits. No timing. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-ABC-184`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/security-nfr-ABC-184.md` (brief + `## Result`: verdict, rulings) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (forward row rule `…d2b9bf09`):
  `| ABC-184 (Security/NFR) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
  `—` for an empty cell; a literal `|` is `\|`, inside code spans too; join facts with `<br>` or `; `.

## Result

**PASS_WITH_RISKS.** There are no required fixes before merge. The notes are in `.grugops/context/security-nfr-ABC-184/notes/`: the decision `…2fe79772` and the readings `…5a43b236`. I added an addendum to the `ABC-095` page, where the risk records live. Nothing is committed on `main`. No timing was taken.

**My own readings** were taken in the session scratchpad with plants byte-identical to QE's, including P6f `afeab577…`:
- TCWD + P6f on the base test: 11/11 green.
- TCWD + P6f on the head test: 10/11, red at A7 `:504` (`AR-183-CWDARG`, 3 times in the output).
- TSPWN + P6f on the head test: 11/11 green.
- 6 children in each cell.
- The fences: `src/` +7/−0 in the test file only, and the waiver form is empty.

### 1. `AR-183-CWDARG`: CLOSED as written, effective at `ABC-184`'s merge
- The close condition is met. The page's TCWD + P6f row is green on the base test and red at the new assertion on the head test. QE read it, and I re-read it.
- No narrower residual is named. TSPWN was the page's own INFO residual inside the close design, the same as G-1 at `AR-180-VALIDATED`.
- The promotion trigger lapses with the risk. Ruling 2 and S3 item 2 stand on their own.
- The Orchestrator records the close.

### 2. QE-184-a (TSPWN) and QE-184-b (TFORGE): ACCEPTED, INFO, owner the Orchestrator. Neither undercuts the close
- **QE-184-a.**
  - It is a deliberate, path-conditional helper edit: it has to name the `mkdtemp` prefix. The accidental form is killed by four other rows.
  - The only control that would see it is a child-side cwd read, which would be gold-plating at L1. There is no cut.
  - A standing QE read is owed at any hop that edits `spawnNode`: the `spawnSync` `cwd` option and the returned `cwd` must be the same unmodified parameter.
  - **An erratum is needed:** the page's "two-place helper edit" is one line. The Orchestrator adds one dated line to the `ABC-184` page when it records the close. This is not a re-cut, and BA/PM is not needed.
- **QE-184-b.** It is a forged input on the `booked` line. Any assertion can be defeated that way. No record and no fix.

### 3. QE-184-c: ROUTED to the Orchestrator (brief wording), INFO, no ticket
- In an agent session, the default reporter prints 0 `[CLI_DEEP]` lines at base and at head. A "children equal base" check would then pass vacuously (0 = 0).
- From now on, any brief or acceptance that counts `CLI_DEEP` children names `--reporter=verbose` (or `--silent=false`) and states a floor of at least 1 (6 today).
- A clause on `AGENTS.md`'s `CLI_DEEP` line is optional, and it is a Scribe decision for the Orchestrator (byte budget, `ABC-164`).
- This ticket's own reading of 6 children stands.

### 4. Security surface: test-only confirmed, no new concern
- `src/cli.real-engine.test.ts` is the only file changed, +7/−0.
- `src/book-file.ts` is unchanged, so Ruling 2 is silent, and `V5.3.2` [L1] is met.
- The change is one field, one returned property and one `expect`. It adds no I/O, spawn, import, environment read, write or logging change.
- `NFR-008` / `N8-LANE`: 0/0/0, with 11 tests and 6 children.

### Owed
- **The Orchestrator:**
  - record the `AR-183-CWDARG` close at the merge;
  - add the one-line erratum to the `ABC-184` page;
  - adopt the QE-184-c brief wording;
  - move `ABC-184` from `In Security/NFR` to `Ready for UAT`, or merge under the measured UAT waiver;
  - append the trace row below. It splits into 10 under the `A1` rule: I counted it.
- **Unchanged:** `AR-095-READ` (LOW, Security/NFR), `AR-163-DELONLY` (LOW, the Orchestrator) and `AR-163-UNCOMMENT` (LOW, Architect/Design).

### Trace row
| ABC-184 (Security/NFR) | Security/NFR gate on the AR-183-CWDARG fix: re-read TCWD + P6f (base 11/11 green → head 10/11 red A7 `:504`) and TSPWN + P6f (11/11 survives) with byte-identical plants; test-only confirmed; security-nfr-ABC-184 …2fe79772 / …5a43b236 | EPIC-005 | — | AR-183-CWDARG CLOSED as written (effective at merge); QE-184-a TSPWN INFO accepted (owner Orchestrator; standing QE read at `spawnNode` edits; page "two-place" erratum → one line); QE-184-b TFORGE INFO accepted; QE-184-c routed to Orchestrator (name `--reporter=verbose` + floor ≥ 1 when counting children); V5.3.2 [L1] met; NFR-008 / N8-LANE 0/0/0 | grugops/qe-ABC-184 @ 2c65403b (SE c6f80c81; code 442d1e57; base 5277babd)<br>src/cli.real-engine.test.ts (+7/−0; 0 production lines); records: ABC-095 page risk addendum | CLI_DEEP 11 tests / 6 children in 3 scratch cells (verbose reporter); waiver form empty; no timing | UAT waiver holds (non-test src list empty, no .snap) | — | Security/NFR PASS_WITH_RISKS: no required fixes; In Security/NFR → Ready for UAT (Orchestrator) |
