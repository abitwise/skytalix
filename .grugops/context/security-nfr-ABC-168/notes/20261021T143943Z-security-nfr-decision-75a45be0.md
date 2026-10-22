---
id: 20261021T143943Z-security-nfr-decision-75a45be0
kind: decision
by: security-nfr
at: 2026-10-21T14:39:43Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - EPIC-007
  - grugops/ABC-168
  - grugops/qe-ABC-168
  - b71f8902
  - 6d27dc9e
  - c98509b3
  - f6020ae9
  - ADR-0036
  - ADR-0036 S1
  - ADR-0044
  - ADR-0044 D8
  - ADR-0011
  - ADR-0016
  - ABC-041
  - AR-163-DELONLY
  - AR-168-BINPIN
  - AR-095-CWD
  - AR-162-FALLBACK
  - AR-180-VALIDATED
  - AR-183-CWDARG
  - QE-168-a
  - QE-168-b
  - QE-168-c
  - QE-168-e
  - QE-172-a
  - ABC-182
  - ABC-184
  - NFR-011
  - NFR-004
  - NFR-006
  - NFR-008
  - NFR-010
  - EPIC-007 M3
  - EPIC-007 M4
  - V1.2.5
  - V5.3.2
  - V15.1.1
  - V15.2.1
  - plans/nfr-catalog.md
  - 20261021T143759Z-security-nfr-observation-edfed8cb
  - 20261021T093522Z-security-nfr-decision-3e4b4a08
  - 20261021T142929Z-qe-e2e-observation-1c648c1a
  - 20261021T142929Z-qe-e2e-observation-1b96c204
  - 20261021T142929Z-qe-e2e-observation-b1a6b8ef
supersedes: 
seal: sha256:3062d6b25096fb906c3537430956d879b93adf9bece19a47898973cd893ac903
---

# Security/NFR on ABC-168: **PASS_WITH_RISKS**. The diff has no defect and no required code fix. **One item is owed before the merge:** `AR-163-DELONLY`'s trigger (iv), a second limb-1 holder, FIRED on `src/uci.ts`, and its instrument fix lands first. `NFR-011` is placed; rows (ii) and (iii) are not

ASVS L1, `block_on: high`, `compliance_regime` empty. The readings are in `…edfed8cb`. The pair is `c98509b3..b71f8902`; QE's merge `6d27dc9e` has the same code.

## 1. (b1)/(b2): fired as the page predicted. Each limb was read on its merits, and no finding
- **Limb 1, `node:readline`:** stdin is read line by line. It opens no file and no socket.
- **Limb 1, the edge to `book-file.ts` (§ S1 Ruling 1's second importer, (b2) fires):** `uci.ts` binds the same parameterless `readBookFile` that `cli.ts` binds.
  - It reads one fixed path from the module URL. Plants P1–P4 show a cwd decoy ignored and a cwd real book not picked up, on both `src/` and `dist/`. **It is the same constant read as the CLI's.**
  - **The closed chain stays closed:** `AR-095-CWD`, `AR-162-FALLBACK`, `AR-180-VALIDATED` and `AR-183-CWDARG`.
    - `book-file.ts` is unchanged. `CLI_DEEP` A7 still guards it, with a neutral cwd, a decoy and the `booked.cwd` assertion. `ABC-184`'s merge `f6020ae9` is in this base.
    - Any new cwd read would either edit `book-file.ts` or add a read in `uci.ts`, and Ruling 2 routes both here.
  - **INFO:** the `UCI_DEEP` lane runs with `cwd: REPOSITORY`, so it is not a cwd detector by itself. No action.
- **Limb 2:**
  - Only argv's length is read. Its value never reaches anything.
  - stderr gets two fixed lines, and the thrown value is never echoed.
  - The exit codes are 0, 1 and 70. A non-EPIPE stdout error is re-thrown, as `ADR-0016` cl. 4 says.
- **Limb 3:** silent.
- **Book warning (`V5.3.2`, `V16`):** the text is fixed, and no file byte or `fs` path reaches the GUI.
- **§ Decision 3's "fifth holder" re-arm FIRED** (5 holders at `<head>`). **Ruling: (b2) still gets no call-graph reach.**
  - `uci.ts` exports nothing (`ADR-0011` cl. 4) and has 0 importers.
  - Any import of it would be a new bare edge, and (b2) already fires on that.
  - So a new call over an existing edge cannot reach its capabilities.
  - The residual stays LOW, owned by Architect/Design. It is re-armed at a sixth holder, or at a holder that exports a function taking a caller value that reaches a capability.
- **Ruling 2 now fires on every `+` line of `uci.ts`, comments included.** That over-fires, which is the safe direction, and it is accepted. Every edit to the entry point routes here.

## 2. `AR-163-DELONLY`: trigger (iv) FIRED. Its fix is **owed before ABC-168 merges**
- **The term being applied:** `security-nfr-ABC-163` `…3e4b4a08` § 2, written into `ADR-0036` § S1. "When it fires, owed before that ticket merges." I hold this term and do not move it.
- **Why it is not theoretical here:** QE's mutants (iii) and (i-b) are deletion-only edits to `uci.ts`. The first drops `exitCode = 70`; the second drops the EPIPE arm.
  - Measured: both fire nothing on any limb.
  - Both pass `npm test` and the lane (QE).
  - Only the by-hand `--name-only` check, or QE's hand A3/A4, sees them.
- **Severity:** MEDIUM while it is unfixed at the trigger (`…3e4b4a08`). `block_on: high` means this is not a dial block. The pre-merge condition comes from the accepted risk's own term.
- **The widened ruling, worded at this gate as the term asks:**
  - For limb 1, (b1) fires on any changed line, `+` or `−`, comments included, in a production file that holds limb 1 in code at `<base>` or `<head>`.
  - With no holder at either end, it adds nothing and runs no pathspec diff.
  - Folding this into `ADR-0036` § S1 is Architect/Design's job, done with the fix.
- **The fix (Architect/Design; BA/PM cuts it now, XS, and it gates a P1 merge):**
  - In `clause-b.mjs`, a holder file that has only `−` hunks fires. That means dropping the `!lines.size` skip and printing the `−` count.
  - QE reads it with G-1b, the import-line drop, the limb-1 uncomment plant and A3's empty case. QE also reads my D1 and D2, which must FIRE.
  - `ABC-182`'s G1 rows flip by design.
- **Interim control (the Orchestrator):** the by-hand check at every routing, with holders at `<base>` ∪ `<head>`: `src/book-file.ts` and `src/uci.ts`.
- **Close:** as written in the term, and D1 and D2 must fire.
- **The owner's option:** he may merge ABC-168 before the fix. That is his own acceptance of `AR-163-DELONLY` at MEDIUM, by name. This role does not waive its own term.

## 3. Clause (a): CONFIRMED, no finding
- No dependency moves. `devDependencies` equal base, there is no `dependencies` key, and no lifecycle script was added.
- `private` and `UNLICENSED` stay. The lock is unchanged (A12).
- The lock root lacks `bin` and `license`. That is INFO and lands in the post-merge lock chore already ruled at `QE-172-a` (+4 root lines). Owner: the Orchestrator.
- `V15.1.1` and `V15.2.1` [L1] are met, as they were at ABC-172.

## 4. Clause (c): does not fire
The lane uses the `spawnSync` argv form, with no shell, `process.execPath`, an empty env and a timeout. That is the existing kind. `V1.2.5` is met.

## 5. QE-168-b: ACCEPTED, LOW, as `AR-168-BINPIN`. Owner: the Orchestrator. Routed to BA/PM as a follow-up, not a pre-merge fix
- **The compensating control:**
  - any `package.json` edit fires clause (a), and this gate reads `bin` against `ADR-0044` D8;
  - the surviving mutant fails loudly, never silently, in the `node_modules` case.
- **The fix:** BA/PM cuts an XS/P3, test-only ticket. It adds one value assertion to `ABC-042` A10 in `src/cli.test.ts`: `bin` equals `{ skytalix: "dist/uci.js" }`, red on QE's (iv-b). It is not in ABC-168, because A12 fences `cli.test.ts` to Scope 6.
- **Trigger, after which the fix is owed before that ticket merges:**
  - packaging `dist/` for anyone else;
  - a backend taking `skytalix` as a dependency (D8 revisit, `ADR-0018`);
  - any `bin` edit.
- **Close:** the pin lands and QE reads it red on (iv-b).

## 6. QE-168-c: ACCEPTED, INFO, as designed (test note 1). Owner: the Orchestrator
- Exit codes and EPIPE silence are not L1 controls.
- **The compensating control:** QE hand-reads A1–A4 at any hop that edits `uci.ts`. Once the § 2 fix lands, every `uci.ts` edit routes here, deletion-only edits included.
- **Optional for BA/PM, not owed:** A1 and A2 rows in the opt-in `UCI_DEEP` lane, using `spawnSync`, with 0 default spawns. A3 and A4 stay hand readings, because there is no seam.

## 7. NFR rows
- **(i) is PLACED as `NFR-011`**, under the owner-accepted `EPIC-007` M3 ("Security/NFR places it … and may change the numbers").
  - **The numbers are unchanged:** 2 000 / 1 000 / 100 ms. The reading is 86.1 / 6.9 / 0.2 ms. A tighter bar from one host reading would be flaky.
  - **The instrument is QE's A6 probe** (route (2), now in force).
  - The reading is recorded but not cited as M3's proof until the owner confirms (`…20cc2ffe`). If he declines, the instrument becomes route (1)'s lane.
- **(ii) is NOT YET placed.**
  - Its instrument is not pinned: the flag spellings and termination strings are pinned on the first UAT run (A8). There is no reading yet.
  - It gets placed after A8/A9 with the pinned command line. Owner: Security/NFR, at the post-UAT catalog hop.
  - `NFR-004`'s 5 s ceiling binds each move meanwhile.
- **(iii) is NOT placed.**
  - M4 is a binary functional invariant. It is already pinned in the default lane (`uci-session.test.ts:1147`) and in the opt-in lane (`uci.real-engine.test.ts:190`).
  - A catalog row would give the same pin a second home.
  - It re-opens if a stdout writer appears outside the session's `write` (a Worker build, for example).
- **The other rows:**
  - `NFR-004`, `NFR-006` (the same file and cap) and `NFR-009`: unchanged.
  - `NFR-008`: +1 file, whose default row spawns nothing, so `N8-SPAWN` stays at 0.
  - `NFR-010`: the lane runs in the one-file shape at heap 400.

## 8. The stdin trust boundary: INFO. Owner: the owner (web project). Trigger: the web backend's design
- The engine trusts its launcher. stdin has no line-length cap, and `go infinite` holds until `stop`.
- A backend that relays browser input to stdin must, before the bytes reach stdin:
  - bound the line length and the command rate;
  - keep one process per session;
  - kill the process on disconnect.
- That is the web project's input boundary (D8). It is not a defect here.

## Owed
- **The Orchestrator:**
  - move the card In Security/NFR → Ready for UAT. A8–A10 are owed to the owner; the waiver does not apply.
  - hold the merge for § 2;
  - route the § 2 cut and the § 5 cut to BA/PM;
  - run the by-hand check until § 2 lands;
  - append the trace row.
- **Architect/Design:** the § 2 fix and the `ADR-0036` § S1 wording.
- **Security/NFR (next catalog hop):** place row (ii) after UAT.
