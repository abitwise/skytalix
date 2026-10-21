---
subtask: security-nfr-ABC-183
role: security-nfr
ticket: plans/tickets/ABC-183-a7-pins-that-the-decoy-is-written-before-the-booked-spawn.md
ref: .grugops/context/qe-ABC-183/
branch: grugops/qe-ABC-183 @ 3ab055f4 (over SE 7bd2b54f/c4c6d36e; base 19abbdb1); QE worktree ../wt-qe-ABC-183 (read only)
width: 2 (beside qe-ABC-182)
---

# Security/NFR: AR-180-VALIDATED close, and QE-183-a / QE-183-b

QE (verdict `…be7c2c82`) read part (ii) of `AR-180-VALIDATED`'s close condition met: TMO + P6f is 11/11 green on the base test and 10/11 on the head test, red `A7` at the new assertion, `AR-162-FALLBACK` in the output. Part (i) was met at `ABC-163`'s merge (`…8d0de2f4`). QE also found two survivors (plant evidence in the `qe-ABC-183` notes on the branch):
- **QE-183-a (LOW, pre-existing since `ABC-162`):** drop the `neutral` cwd argument from the `booked` spawn and the lane stays 11/11 under P6f. `A7` checks the variable, not the child's working directory.
- **QE-183-b (INFO):** move the capture line together with the decoy write and the lane stays green; only `A1`'s static grep catches it.

## Decide
1. **AR-180-VALIDATED.** Close it as written, or close it and carry a narrower named residual (owner, trigger, close condition), or keep it open. The Orchestrator owns the risk and records the close per your ruling.
2. **QE-183-a.** Is this a new risk (and under which id), an extension of an existing one (`AR-162-FALLBACK` is closed; `AR-095-CWD` is closed), or accepted? If a fix is wanted, name its shape so BA/PM can cut it, with a priority and promotion trigger. Say whether it blocks this merge (the page says it is outside scope).
3. **QE-183-b.** Accept or route.
4. **Security surface.** Confirm the change is test-only (`src/cli.real-engine.test.ts`, 0 production lines) and raises no new concern.

## Fences
- Records only, plus the risk record where `AR-180-VALIDATED` lives (the Security/NFR addenda on the ABC-095 page).
- No `src/`, `AGENTS.md`, board or worktree edits. No timing. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-ABC-183`).
- Write `.grugops/queue/done/security-nfr-ABC-183.md` (brief + `## Result`: verdict, rulings, trace row as one `| ABC-183 | … |` line) and `.claim.md`, uncommitted on main.

## Result

**PASS_WITH_RISKS.** There are no required fixes before merge. The notes are `.grugops/context/security-nfr-ABC-183/notes/`: decision `…41f70925` and readings `…d5fd47e1`. There is an addendum on the `ABC-095` page, where the risk records live. Nothing is committed on `main`. No timing was taken.

### 1. `AR-180-VALIDATED`: CLOSED, as written
- Part (i) was met at `ABC-163`'s merge (`…8d0de2f4`).
- Part (ii): QE read TMO + P6f as base 11/11 green and head 10/11, red `A7` at the new assertion (`…5e544b3e`).
- No narrower residual is carried. G-1 (P6g) was accepted by design inside the close condition. Its standing control is Ruling 2 (mechanical since `ABC-163`) plus S3 item 2.
- The Orchestrator records the close.

### 2. QE-183-a: a NEW risk, `AR-183-CWDARG` (LOW; owner the Orchestrator). It does not block this merge
- **Not an extension.** `AR-095-CWD` and `AR-162-FALLBACK` closed when their written conditions were met. This gap dates from `ABC-162`: `RealChild` has no `cwd`, and `A7` asserts the variable, not the child.
- **I reproduced it** with the byte-identical plant `008c4e79…`: TCWD + P6f is 11/11 green.
- **Why LOW:** `V5.3.2` [L1] is met at the tip. This is a missing detective control, and it needs a test edit plus a cwd-reading production edit, which Ruling 2 routes here.
- **Fix: BA/PM cuts one XS P3 test-only ticket now.** `RealChild` gains `readonly cwd`, `spawnNode` returns it, and `A7` asserts `booked.cwd` is `neutral` with a labelled message. It adds 0 spawns and 0 tests.
- **Measured in scratch:**
  - FIX alone: 11/11;
  - FIX + P6f: red at the existing stderr detector;
  - FIX + TCWD + P6f: 10/11, red at the new assertion.

  The fix's typecheck was not read (`UNKNOWN - verify`, the SE's gates).
- **Promotion trigger:** the same as `AR-180-VALIDATED`'s (`ABC-168` fires it). When it fires: raise the ticket to P2; the fix is owed before that ticket merges, and the gate reads the launch path for a cwd book read. Any ticket that edits `A7`, `spawnReal`, `spawnNode` or `RealChild` first carries the fix.
- **Closes when** QE reads TCWD + P6f red at head.

### 3. QE-183-b: ACCEPTED (INFO)
- No record and no cut.
- A1's `grep -B1` stays a QE read at any hop that edits `A7`'s `beforeAll`.
- Pinning the order absolutely would mean instrumenting `spawnNode`, which is gold-plating at L1.

### 4. Security surface: test-only confirmed
- The only `src/` file changed is `src/cli.real-engine.test.ts` (+11/−0).
- The waiver form is empty, `src/book-file.ts` is unchanged, and Ruling 2 is silent.
- The change adds one read-only `existsSync` under the `mkdtemp` directory. It adds no write, spawn, import, environment read or logging change.
- `NFR-008` is 0/0/0. No new concern.

### Owed
- **The Orchestrator:** record the `AR-180-VALIDATED` close; open `AR-183-CWDARG`; move the ticket from `In Security/NFR` to `Ready for UAT`, or merge under the measured waiver.
- **BA/PM:** the `AR-183-CWDARG` cut, pulled ahead of `ABC-168`.

### Trace row
| ABC-183 (Security/NFR) | test-only (1 src file +11/−0, 0 prod lines; waiver form empty; Ruling 2 silent); one read-only existsSync under mkdtemp, no write/spawn/import/env/logging change; security-nfr-ABC-183 …41f70925 / …d5fd47e1 | AR-180-VALIDATED CLOSED (part (i) …8d0de2f4; part (ii) TMO + P6f base 11/11 green → head 10/11 red A7 :503, QE …5e544b3e) → AR-183-CWDARG (LOW, owner Orchestrator; QE-183-a TCWD: booked's neutral cwd arg droppable, 11/11 under P6f; fix RealChild.cwd + A7 asserts booked.cwd = neutral, measured red on FIX+TCWD+P6f; XS P3 cut now; promotes with ABC-168) / QE-183-b INFO accepted / V5.3.2 [L1] met | grugops/ABC-183 @ c4c6d36e (code 7bd2b54f; base 19abbdb1); QE grugops/qe-ABC-183 @ 3ab055f4 | src/cli.real-engine.test.ts | NFR-008 0/0/0; CLI_DEEP 11 & 6 children = base (QE); no timing | Security/NFR PASS_WITH_RISKS: no required fixes; non-blocking |
