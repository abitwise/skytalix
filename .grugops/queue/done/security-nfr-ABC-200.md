---
subtask: security-nfr-ABC-200
role: security-nfr
ticket: plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
ref: .grugops/context/security-nfr-ABC-200/
branch: grugops/ABC-200 (tip 0a07df04; code 1efd2cee; base bd745ac9)
width: 2 (beside qe-ABC-200)
---

# Security/NFR hop for ABC-200: ADR-0036 (b1) fires on the new `cli.ts` handle lines

## Do
- Review the diff `bd745ac9..1efd2cee` in full: the new `line-reader.ts` and `startup-questions.ts`, plus the edits to `line-input.ts`, `cli-options.ts` and `cli.ts`. Read the Architect's ruling (`…f612277c`) and the SE's decision (`…11628f2f`).
- Rule on the ADR-0036 (b1) clause for `const sink = process.stdout;` and `const stdin = process.stdin;`.
- Rule on the input-handling surface:
  - the echo sanitising (ESC, C0, DEL, over-length);
  - the line limit (`MAX_LINE_LENGTH`);
  - the shared reader's single waiting slot;
  - the new exit-70 path that comes before the loop.
- Rule whether an `NFR-003` or `NFR-008` reading is owed. If one is, spell out the measurement but **do not take it**: timing runs wait for ABC-178's hop.
- Re-check AR-1 premise checks 5a–5d and 5e on the tip (no new package import; built-ins still `node:fs node:readline`). This ticket adds production modules.
- Result: PASS, PASS_WITH_RISKS or FAIL, with required fixes and accepted risks.

## Fences
- Records only, plus scratch reads and runs of the tip in a clone under `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec200/`. No vitest timing. Work on `grugops/security-nfr-ABC-200` (worktree `../wt-security-nfr-ABC-200` from `main`). No `src/`, `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `security-nfr-ABC-200`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result (security-nfr, 2026-10-22T19:43:46Z): **PASS_WITH_RISKS**. No required fixes. An `N8-LANE` reading is owed before merge, after `ABC-178`'s hop

Records only: no vitest, no timing. Commit `8654814e` on `grugops/security-nfr-ABC-200` (worktree `../wt-security-nfr-ABC-200`, from `main` `be70482f`). It is not pushed and not merged. The scratch clone of tip `0a07df04` is under `scratchpad/sec200/`.

- **ADR-0036 (b1): FIRES on limb 2 only, and adds no capability.**
  - **The (b1) lines:** the canonical `clause-b.mjs` lists three `cli.ts` lines:
    - `:150`, the `process.argv` read, with its binding renamed;
    - `:167`, the new `const stdin = process.stdin;`;
    - `:200`, the book probe's `process.stderr.write` warn, moved into the `try`.
  - **Limbs 1 and 3, and (b2), do not fire:** the 4 new edges reach no holder. No new holder exists, so neither § 3's trigger nor S1's re-armed one fires.
  - **No new capability:** the `process.*` multiset in `cli.ts` code is identical at base and head (10 tokens).
  - **Record correction** (for the Orchestrator to fold into the page): `const sink = process.stdout;` is **not** a (b1) line. git shows it unchanged; only its line number moved.
- **Input surface: holds at L1** (`V2.2.1`, `V2.1.1`, `V2.3.1`, `V1.3.2`: MET).
  - **Validation:** a closed allow-list, matched exactly. 9 look-alikes are rejected, and strict `isTTY === true` gates the questions.
  - **The echo:** C0, ESC and DEL are dropped (probe, and a real pty). An over-cap line echoes `""`. Out/in is 1.053.
  - **The line limit:** 1 024 units, moved unchanged. A 1 MiB line with no newline is freed.
  - **The single slot:** safe as wired, because there are 2 sequential callers. Overlapping reads orphan a read and leak a listener (measured).
  - **The exit-70 path:** a generic line with no stack, which is acceptable.
  - **Ctrl-D at either question on a real pty:** exit 0, 0 stderr bytes, no frame, no hang.
- **NFR:**
  - **`N8-LANE`: OWED.** It adds a test file; the precedent is `R-173-2`. The measurement is spelled out in `…08e4152e` § 3. It is to be taken after `ABC-178`'s hop on the merged-up branch, ≤ 0.650 s CPU, with the narrow set, a placeholder and an identity twin, n ≥ 8.
  - **`NFR-008` full lane:** owed before merge only if `N8-LANE` reads NOT MET or UNRESOLVED.
  - **`NFR-003`: NOT OWED.** Line mode, the tty echoes keystrokes, and the read path is unchanged.
  - **`NFR-007`:** no reading owed by this ticket.
- **AR-1 premise checks on the tip:**
  - **5a–5d over `F` (44 files):** empty, empty, `node:fs node:readline`, empty.
  - **Check 4:** rc 0, exactly `> !! dist/`.
  - **5e over `dist/` (22 files):** empty ×3, then `node:fs node:readline`.
  - **The rest:** neither new module is in `dist/`, there is no new package import, and `package*.json` is untouched.
  - **Instrument note for the RM:** spell check 4's `diff` as `command diff`. A host `diff` shell function blinds the `grep '^[<>]'` filter, and it fails toward a drift alarm, never toward a pass.
- **Accepted risks** (all LOW; the Orchestrator accepts them under `…5aaf7cec` item 1):
  - **`AR-200-C1ECHO`:** C1 and bidi code points are echoed. The filter matches `printableOf`, and the precedent is `AR-096-C1CP`. Owner: the Orchestrator.
  - **`AR-200-SLOT`:** the shared reader's single waiting slot. Trigger: a new caller of `lineReaderOf`, or a read that is not awaited. Owner: the Orchestrator; fix by Architect/Design.
  - **`AR-200-NOSTACK`:** a pre-loop defect exits 70 with no stack, the same as `[D31]`. Owner: the Orchestrator.
  - **`AR-200-EPIPEQ`:** `EPIPE` at a question is unreachable while stdout is a TTY. Owner: the Orchestrator.
- **Notes** (`.grugops/context/security-nfr-ABC-200/notes/` on my branch, sealed by grugops 2.1.0 `context-io.js` `admitAndAppend`, read back as 2 notes with 0 skipped, index rendered):
  - `20261022T194345Z-security-nfr-observation-efa18ef6` (the readings);
  - `20261022T194346Z-security-nfr-decision-08e4152e` (the rulings and the result).
- **Not touched:** `src/`, `package*.json`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` (the row below is for the Orchestrator), the ticket page and the catalog. No column was moved. QE's verdict (`A1`–`A9`) is still owed.

### Trace row (10 cells, header order)

| ABC-200 (security-nfr) | Security/NFR gate: ADR-0036 (b1) FIRES limb 2 only (`cli.ts:150` argv rename, `:167` stdin alias, `:200` moved stderr warn; `const sink` not a b1 line), no capability added (process.* multiset unchanged, b2 0 holders); input surface holds at L1 (closed set exact match, C0/ESC/DEL echo filtered, 1 024 cap, exit-70 generic); N8-LANE OWED after ABC-178 (spelled, not taken); NFR-003 not owed; AR-1 5a–5e clean | EPIC-006 | G6 | N8-LANE (owed, not read); NFR-008 (full lane only if N8-LANE NOT MET/UNRESOLVED); NFR-003 (not owed); NFR-007 (not owed here); ADR-0036; ADR-0035; AR-1; V2.2.1; V2.1.1; V2.3.1; V1.3.2 | `grugops/security-nfr-ABC-200` @ `8654814e` (records only)<br>`.grugops/context/security-nfr-ABC-200/notes/` (…efa18ef6, …08e4152e) | records only; no vitest, no timing; clause-b.mjs on `bd745ac9..1efd2cee` (L2 fires, L1/L3 not); 12/12 input probes; pty Ctrl-D ×2 exit 0, 0 stderr bytes; AR-1 4/5a–5e as expected at `0a07df04` | — | — | PASS_WITH_RISKS (no required fixes; AR-200-C1ECHO, AR-200-SLOT, AR-200-NOSTACK, AR-200-EPIPEQ LOW, owner Orchestrator); N8-LANE reading owed before merge; QE A1–A9 still owed; column moves are the Orchestrator's |
