---
id: 20261021T082900Z-security-nfr-decision-06c147db
kind: decision
by: security-nfr
at: 2026-10-21T08:29:00Z
verified_by: 
confidence: high
refs:
  - ABC-162
  - ABC-095
  - AR-095-CWD
  - AR-162-FALLBACK
  - AR-095-READ
  - AR-095-L1UNIT
  - QE-095-a
  - G-1
  - G-2
  - G-3
  - V5.3.2
  - V12.3.1
  - ADR-0036
  - EPIC-006
  - NFR-008
  - grugops/ABC-162
  - 3d05e230
  - 51503331
  - grugops/qe-ABC-162
  - 91f18689
  - src/cli.real-engine.test.ts
  - src/book-file.ts
  - plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md
  - 20261021T082210Z-qe-e2e-observation-567002e7
  - 20261021T082220Z-qe-e2e-observation-df4fc9ed
  - 20261021T082240Z-qe-e2e-decision-68554c31
  - 20261012T153000Z-security-nfr-decision-s3-result-pass-with-risks-qe095a-qe095e-ruled-b65b11b7
supersedes: 
seal: sha256:b4538a59eae0e7c61de7c2f5d1bb9d0b89d57a303c5b727d4d4538081966ff47
---

# Security/NFR `ABC-162` @ `3d05e230`: **PASS_WITH_RISKS**. `AR-095-CWD` closes as written; the cwd-first fallback (P6f) is carried as the narrower `AR-162-FALLBACK` (LOW, owner the Orchestrator); G-1 and G-2 go to one XS BA/PM cut

No `finding` is admissible here: no §14 gate stamp and no human grant. So every ruling here is a `decision`. It rests on QE's notes `…865e9bc6`, `…567002e7`, `…df4fc9ed` and `…68554c31`, and on my readings `…3ea2c883` in this task. ASVS L1 (pinned 5.0.0), `block_on: high`, no compliance regime. No timing was taken.

## 1. `AR-095-CWD`: CLOSED, with P6f carried as the narrower residual `AR-162-FALLBACK`
- **The close condition is met as written.** S3 (`…b65b11b7`) set it: "It closes when a test reds on P6b, read by QE with the plant."
  - QE read P6b **green at base** (11/11) and **red at head** (10/11). The only red was `A7`, at its stderr check.
  - P6c (`resolve(process.cwd(), …)`) and P6e (walk up from cwd) also go green → red.
- **The goalposts are not moved.** Keeping `AR-095-CWD` open on a form its own condition did not name would leave it with no condition that could ever close it.
- **The class is not fully covered, and I do not call it covered.** P6f reads the cwd first and falls back to the module URL. It passes the head test 11/11, because `A7`'s cwd is empty, so the fallback always fires.
  - Its exploit is the same as `AR-095-CWD`'s: whoever controls the launching directory chooses the book.
  - P6f is also the regression form most likely to arrive on purpose, as a "local override book" during packaging (`EPIC-006`).
- **The residual is named `AR-162-FALLBACK`** (LOW).
  - **What it is.** A `readBookFile` that tries a cwd-relative path first and falls back to the module-URL read is not detected by any automated test.
  - **Severity: LOW at the tip.** The delivered read is a constant path resolved from the module URL, so `V5.3.2` [L1] is met (the 4.0.3 id was `V12.3.1`, see `…3ea2c883` § 3). **If P6f landed, it would FAIL `V5.3.2` [L1], whose default severity is HIGH, and that blocks.** The residual is a missing detective control, not a failing one.
  - **Compensating controls:**
    - `ADR-0036` § S1 Ruling 2 routes any edit to `src/book-file.ts` to `In Security/NFR`;
    - S3 item 2 reads the file by hand there (by hand until `AR-095-L1UNIT`'s fold lands);
    - `A7` now kills P6b, P6c and P6e automatically at QE.
  - **Owner: the Orchestrator**, who routes the fix. This is the same owner as `AR-095-CWD`.
  - **Closes when** a `CLI_DEEP` row is green on the clean build and red on P6f, read by QE with the plant at base and head, and the P6b/P6c/P6e kills still hold.
  - **Promotion trigger:** a ticket that edits `src/book-file.ts`, or `EPIC-006` (packaging/`bin`) being cut or pulled. Either makes the fix **owed before that ticket merges**. This matches `ABC-162`'s P2 trigger.

## 2. G-1 and G-2: one XS BA/PM cut (P3, test-only); accepted inside `AR-162-FALLBACK` until it lands
- **G-1 (P6f survives). Recommend a BA/PM cut.** The fix is QE's measured decoy row (`…567002e7`).
  - **The decoy.** In `A7`'s existing `beforeAll`, write a file at `<neutral>/data/opening-book/book.json` whose bytes are **not a book**. Non-JSON bytes will do. It sits inside the same `mkdtemp` directory and goes with it on the same exact-path `rmSync`. There are 0 new spawns and 0 new tests.
  - **Why the decoy must not be a book.** A non-book decoy reds every read-level fallback through the probe's fixed warning, `opening book is not valid UTF-8 JSON; …`. A valid alternate book would make P6f silent, and the kill would then rest on book membership, which does not discriminate (G-2).
  - **Amend `A1`.** Replace "holds no `data/` entry" with "holds a decoy `data/opening-book/book.json` that is not the delivered book". Swap the test's no-`data/` assertion for a decoy-present one.
  - **Amend `A2`.** Add P6f to P6b: green on the base test, red on the head test, at `A7`.
  - **Keep `A3`.** The decoy goes with its directory.
  - QE's scratch run of exactly this shape: clean 11/11, P6b red, P6f red.
  - **The wording conflict is real, not a defect.** The cut resolves it. It is not owed before `ABC-162` merges.
- **G-2 (the kill rests on one assertion). Fold it into the same cut; no separate risk id.**
  - **The fix.** Label `A7`'s `expect(booked.stderr).toBe("")` with an assertion message, and put a one-line comment above it, both naming it **the `AR-095-CWD` / `AR-162-FALLBACK` detector**. A future edit that relaxes it then sees what it removes.
  - **Why this matters.** The test file is not a capability holder, so Ruling 2 never routes its edits here. The label is the only cheap guard.
  - **Owner until the cut lands: the Orchestrator**, inside `AR-162-FALLBACK`. Its record names this line as the detector.
  - **Not required.** A non-stderr discriminator (a book position whose book reply differs from the searched reply) is gold-plating at L1.
- **If BA/PM declines the cut,** both stay accepted under `AR-162-FALLBACK`, with the owner and triggers above.
- **G-3 (INFO):** agreed, no action. `TMPDIR` is set by the same user, so it is not a security boundary (`…3ea2c883` § 2).
- **G-4:** the Scribe's, not this gate's.

## 3. Security surface and NFR
- **Test-only.** One file, 0 production lines. Ruling 2 does not fire.
- **The temp directory.** `mkdtemp` mode `0700`, random suffix, exact-path `rmSync` that does not follow symlinks (measured). **No concern at L1.** This holds on a shared `/tmp` as well (`…3ea2c883` § 2).
- **`NFR-008` / `N8-LANE`.** QE's counts: default lane 0 new files, 0 new tests, 0 new spawns; `CLI_DEEP` 11 = base and 6 children = base. Nothing was timed, and nothing needed to be.
- **Logging.** The failure mode the detector reads is the probe's one fixed warning on stderr. It carries no path or bytes, so it is unchanged and fine.

## Result
**PASS_WITH_RISKS.**
- **Required fixes before merge:** none.
- **Closed:** `AR-095-CWD` (its close condition was met by QE `…68554c31`).
- **Accepted risks:**
  - `AR-162-FALLBACK` (LOW; owner the Orchestrator; triggers as above; holds G-1 and G-2);
  - `AR-095-READ` (LOW, Security/NFR, unchanged);
  - `AR-095-L1UNIT` (LOW, the Orchestrator, unchanged).
- **Owed:**
  - **BA/PM:** the XS P3 test-only cut (G-1 decoy and `A1`/`A2` wording, G-2 label);
  - **Orchestrator:** record the `AR-095-CWD` close on the trace, own `AR-162-FALLBACK`, and make the column move. QE measured that the UAT waiver holds.
- `plans/board.md` and `plans/traceability.md` are not edited here. The trace row is in the done record.
