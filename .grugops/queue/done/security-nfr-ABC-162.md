---
subtask: security-nfr-ABC-162
role: security-nfr
ticket: plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md
ref: .grugops/context/qe-ABC-162/
branch: grugops/qe-ABC-162 @ 91f18689 (over SE 3d05e230; base 51503331); QE worktree ../wt-qe-ABC-162 (read only)
width: 3 (beside bapm-rule-QE-159 and scribe-agents-md-2026-10-21)
---

# Security/NFR: rule on AR-095-CWD's close for ABC-162

QE passed ABC-162 with gaps (`…68554c31`); the plants and decoy probe are in `…567002e7`. P6b, the close condition, is now red at head. But **P6f**, which tries the working directory first and falls back to the module path, still passes the head test (G-1).

## Read first
- The ABC-162 page and the ABC-095 page.
- AR-095-CWD wherever it is recorded (`plans/tickets/ABC-095-*`, `plans/traceability.md`).
- QE notes `…865e9bc6`, `…567002e7`, `…df4fc9ed` and `…68554c31`.

## Decide
1. **AR-095-CWD.** Close it outright, or close it with P6f carried as a narrower named residual (state owner and trigger)? Or does it stay open?
2. **G-1 and G-2.** G-1: P6f survives; QE's decoy-file fix contradicts A1's "no `data/`" wording. G-2: the kill rests on the single stderr assertion. Accept each as a risk, or recommend a BA/PM cut, naming the fix shape.
3. **Security surface.** Confirm the change is test-only (`src/cli.real-engine.test.ts`). Check that `mkdtemp` under `os.tmpdir()` with removal by exact path raises no temp-file concern (symlink, shared-dir) at ASVS L1.

## Fences
- Records only, plus the AR-095-CWD record and the risk lines.
- No `src/`, `AGENTS.md` or worktree edits. Run no timing. Never push or merge.

## Publish
- Seal notes with `/Users/olgeroeselg/.claude/plugins/cache/grugops/grugops/2.1.0/scripts/context-io.js` (`admitAndAppend`, task `security-nfr-ABC-162`).
- Write `.grugops/queue/done/security-nfr-ABC-162.md` (brief + `## Result`: verdict PASS / PASS_WITH_RISKS / FAIL, rulings, trace row) and `.claim.md`, uncommitted on main.

## Result (security-nfr, 2026-10-21 08:30Z): **PASS_WITH_RISKS**. Required fixes before merge: none

These are records only, uncommitted on `main`.
- **What was written:**
  - 2 sealed notes;
  - a dated `AR-095-CWD` addendum at the end of `ABC-095` § Security/NFR;
  - this done record and `.claim.md`.
- **What was not touched:** `src/`, `AGENTS.md`, every worktree, `plans/board.md` and `plans/traceability.md`.
- No timing. No push, no merge.

### Rulings
- **The change is test-only (confirmed).**
  - `git diff --name-only 51503331 3d05e230` lists only `src/cli.real-engine.test.ts`, and the non-test `src/` list is empty.
  - `src/book-file.ts` is unchanged, so `ADR-0036` Ruling 2 does not fire.
- **The temp directory: no concern at ASVS L1.** I measured it in scratch on Node v26.11.1:
  - `mkdtemp` makes a `0700` directory with a random suffix inside a per-user `0700` `os.tmpdir()`;
  - `rmSync(recursive, force)` on the exact path did not follow an inner symlink, nor a path swapped for a symlink (the victim file survived both);
  - on a shared sticky `/tmp`, `mkdtemp`'s atomic create, `0700` mode and unpredictable name block pre-planting and swapping by other users. Same-user `TMPDIR` is outside the threat model (G-3, INFO);
  - `afterAll` removes the directory even when `beforeAll` throws (QE traced this).
- **`AR-095-CWD`: CLOSED as written.** The S3 condition was "a test reds on P6b, read by QE with the plant". QE `…68554c31` met it: P6b went base 11/11 → head 10/11 on `A7`'s stderr check, and P6c and P6e red too.
- **New residual `AR-162-FALLBACK` (LOW; owner the Orchestrator).**
  - **The gap:** P6f, a cwd-first read with a module-URL fallback, is undetected. It has the same exploit class: the launching directory chooses the book.
  - **Severity:** LOW at the tip, because `V5.3.2` [L1] is met. If P6f landed, it would be an L1 fail, HIGH by default, and blocking.
  - **Compensating controls:** `ADR-0036` Ruling 2 and S3 item 2 by hand; `A7` kills P6b, P6c and P6e.
  - **Closes when** a `CLI_DEEP` row is green on the clean build and red on P6f, read by QE with the plant at base and head.
  - **Promotion trigger:** a ticket that edits `src/book-file.ts`, or `EPIC-006` (packaging/`bin`) being cut or pulled. Either makes the fix owed before that ticket merges.
- **G-1: recommend one XS P3 test-only BA/PM cut.**
  - In `A7`'s existing `beforeAll`, write **non-book** bytes (not JSON) to `<neutral>/data/opening-book/book.json`. It is removed with the directory by the same exact path. 0 new spawns, 0 new tests.
  - Amend `A1` from "holds no `data/` entry" to "holds a decoy `data/opening-book/book.json` that is not the delivered book", and swap the test's no-`data/` assertion to match.
  - Add P6f to `A2`.
  - The decoy must not be a valid book. Then P6f stays loud on stderr, and the kill does not rest on book membership, which does not discriminate.
  - QE's scratch run of this shape: clean 11/11; P6b and P6f red.
- **G-2: fold into the same cut, with no separate id.** Give `A7`'s `expect(booked.stderr).toBe("")` an assertion label and a one-line comment naming it the `AR-095-CWD` / `AR-162-FALLBACK` detector. The test file is not a capability holder, so Ruling 2 never routes its edits here, and the label is the cheap guard. Until the cut lands, it is accepted inside `AR-162-FALLBACK`. If BA/PM declines the cut, both stay accepted there.
- **ASVS citation drift.** The AR-095 records cite `V12.3.1` [L1], the ASVS 4.0.3 id. The pinned checklist is 5.0.0, where `V12.3.1` is TLS [L2] and the matching requirement is `V5.3.2` [L1]. The ruling does not change, and earlier notes are not edited.
- **NFR:** `NFR-008` / `N8-LANE` hold on QE's counts (0 / 0 / 0; `CLI_DEEP` 11 = base; 6 children = base). Nothing was timed, and nothing needed to be.

### Notes (task `security-nfr-ABC-162`, sealed by `context-io.js` `admitAndAppend`, read back by `readContext`)
- `20261021T082800Z-security-nfr-observation-3ea2c883`: readings (test-only, temp directory, ASVS id).
- `20261021T082900Z-security-nfr-decision-06c147db`: rulings and result.

### Owed
- **BA/PM:** the XS P3 test-only cut for G-1 and G-2, from `AR-162-FALLBACK`.
- **Orchestrator:**
  - record the `AR-095-CWD` close and append the trace row below;
  - own `AR-162-FALLBACK`;
  - make the column move out of `In Security/NFR`. The UAT waiver holds, as QE measured;
  - the merge stays a human's.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-162 (Security/NFR) | test-only (1 file, 0 prod lines; Ruling 2 silent); mkdtemp 0700 + exact-path rmSync, no symlink follow (measured): no L1 temp concern; security-nfr-ABC-162 …06c147db / …3ea2c883 | AR-095-CWD CLOSED (P6b/P6c/P6e red on A7) → AR-162-FALLBACK (LOW, Orchestrator; P6f) / QE-095-a / V5.3.2 [L1] | grugops/ABC-162 @ 3d05e230 (base 51503331); QE grugops/qe-ABC-162 @ 91f18689 | src/cli.real-engine.test.ts | NFR-008 0/0/0, CLI_DEEP 11 = base, 6 children = base (QE counts; no timing) | Security/NFR PASS_WITH_RISKS: no fix before merge; G-1 + G-2 → one XS P3 BA/PM cut (non-book decoy in A7's neutral cwd, A1/A2 reworded, stderr assertion labelled as the detector) |
