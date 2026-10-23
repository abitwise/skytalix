---
subtask: security-nfr-ABC-203
role: security-nfr
ticket: plans/tickets/ABC-203-at-game-end-npm-run-chess-writes-the-game-as-a-standard-pgn-file-under-games.md
ref: .grugops/context/security-nfr-ABC-203/
branch: grugops/qe-ABC-203 (730666fb; merge 8fa09e14)
width: 3 of 3 (records + light reads)
---

# Security/NFR gate for ABC-203 (the CLI's first file write)

## Do
- Rule the Architect's five items (`…e6de1e00` / the page's Design ruling): ADR-0036 clause (b) via `clause-b.mjs`; § Decision 3 re-arm (sixth holder, first caller value to a capability); the `games` symlink-to-directory behaviour (Architect proposes LOW); ASVS L1 V12; NFRs (write ≤ 50 ms read by QE at 8.39 ms max; NFR-008 +1 file +1 spawn — is an N8-LANE reading owed?).
- Rule QE's findings: **QE-203-c** (unguarded cleanup `unlinkSync` → exit 70 + leftover file; against ADR-0047 D5) — required fix before merge, or accepted risk with severity? **QE-203-a/-b** (no CLI-level A10 test, no "no partial file" test; each +1 spawn) — required, or accepted residual?
- Result: PASS / PASS_WITH_RISKS / FAIL with required fixes and accepted risks (severity). A HIGH goes to the owner.

## Fences
- Work on `grugops/security-nfr-ABC-203` (worktree `../wt-security-nfr-ABC-203` from `grugops/qe-ABC-203`). Records only (+ catalog insertion if yours). No `src/` edits. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec203/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes via the plugin writer (task `security-nfr-ABC-203`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**PASS_WITH_RISKS** (Security/NFR, 2026-10-24, branch `grugops/security-nfr-ABC-203` @ `14e4f061` from `grugops/qe-ABC-203` `730666fb`; records only: no lane, no timing, no `src/` edit).

- **1. ADR-0036 clause (b): FIRES as predicted, no finding.** Canonical `clause-b.mjs` (sha256 `24b963b1…`) on `55a8f4ef..5e23e249`; QE's merge `8fa09e14` has the same `src/`.
  - Limb 1: (b1) `pgn-file.ts:23` and Ruling 2 (74 `+` lines); (b2) `cli.ts -> pgn-file.ts`.
  - Limb 2: (b1) `cli.ts:245`.
  - Limb 3: silent.
  - The other 6 new edges reach no holder. There are 6 distinct holders at `<head>`.
- **2. § Decision 3 (sixth holder; first export taking a caller value): (b2) still gets no call-graph reach.** I agree with the Architect.
  - Only a `Date` reaches the path. Even an invalid or extreme `Date` gives only `[A-Za-z0-9-]` (probed).
  - `text` reaches only the bytes of a new, exclusive file.
  - Env text in a new call would fire limb 2, and an extra write reds the neutral-`games/` guard.
  - The residual stays LOW, owner Architect/Design. Re-armed at a seventh holder, or at an export whose caller value reaches a path, command, URL or read.
- **3. `games` symlink to a directory: ACCEPTED, LOW, `AR-203-SYMLINK`.**
  - Owner: the Orchestrator. If a trigger fires, the `lstat` fix is Architect/Design's.
  - Planting the link needs write access to the package root, which already runs `src/`.
  - The create stays exclusive: a link at the file name to an existing file gave EEXIST and the victim was untouched (probed). The bytes are product-made, mode 0644.
  - Triggers: a non-package-root launch path (a CLI `bin`, a global install, packaging), any mode beyond exclusive create, or typed/env/secret bytes in the file.
- **4. ASVS L1 "V12": MET where it applies.**
  - The kit pins ASVS 5.0.0, where V12 is TLS. Its L1 rows are N/A (no network).
  - The file rows are V5: `V5.3.2` MET; `V5.2.1` and `V5.3.1` N/A; `V1.2.x` and `V15.3.1` MET.
  - D5 is MET: `catch {` prints only `INTERNAL_ERROR`.
  - INFO: `ADR-0047`'s `V12.3.1` and the page's "V12" are ASVS 4.0.3 numbers.
- **5. NFRs: an `N8-LANE` reading IS OWED before merge** (a reading, not a code fix). The ticket adds `src/pgn.test.ts` and edits `src/cli.test.ts`; precedent `ABC-200` `…08e4152e`.
  - The arms, set and bound are in `…eaaa1133` § 6. The Orchestrator schedules a quiet window.
  - The writer's child is not chargeable to `N8-SPAWN`: no criterion names it. It is carried gross, as `SEC-203-a` (LOW, owner BA/PM).
  - The full-lane `NFR-008` reading is owed only if `N8-LANE` reads NOT MET or UNRESOLVED, or exceeds the headroom.
  - The write is MET at 8.39 ms max against 50 ms. No row is placed. `NFR-007` and `NFR-002` are unchanged.
- **QE findings:**
  - **QE-203-c: ACCEPTED, LOW, `AR-203-UNLINK`. Not a pre-merge fix.**
    - Why: a double fault that fails closed (exit 70, fixed text, no leak). No L1 row fails.
    - Fix: an XS follow-up. Guard the unlink and report the first code. The red plant is QE's resolve hook.
    - Required before any later ticket that edits `src/pgn-file.ts` merges.
    - Owner: the Orchestrator.
  - **QE-203-b: ACCEPTED residual, LOW, `AR-203-LANEGAP` (b).** Ruling 2 routes any edit to the holder (X1 included) here. Recommended: fold its pin into the `AR-203-UNLINK` follow-up, one fault-injection child for both.
  - **QE-203-a: ACCEPTED residual, LOW, `AR-203-LANEGAP` (a).** A regression would fail closed; P7 pins the stderr text; QE hand-reads A10 on a wiring edit. Optional in the same follow-up.
  - **QE-203-d, -e: INFO, agreed.**
- **No HIGH, so nothing goes to the owner.**
- **Notes** (`.grugops/context/security-nfr-ABC-203/notes/` on my branch, sealed by grugops 2.1.0 `admitAndAppend`, read back as 2, index rendered):
  - `20261023T211544Z-security-nfr-observation-37c4164f` (readings)
  - `20261023T211544Z-security-nfr-decision-eaaa1133` (rulings and the result)
- **Not touched:** `src/`, `package*.json`, `plans/board.md`, `plans/traceability.md` (the row below is the Orchestrator's), the catalog, the page, the ADRs. No column moved. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-203 (security-nfr) | Security/NFR gate on the CLI's first file write: ADR-0036 (b) fires as predicted (L1 b1 pgn-file.ts + Ruling 2, b2 cli.ts->pgn-file.ts; L2 b1 cli.ts:245; L3 silent); § Decision 3 re-armed twice, no call-graph reach; games symlink accepted LOW; QE-203-a/b/c accepted LOW; N8-LANE owed before merge | EPIC-006 | PGN export | ADR-0047; ADR-0036 (6 holders); V5.3.2 [L1] MET (V12 L1 N/A under ASVS 5.0.0); NFR-008 / N8-LANE OWED (SEC-203-a: writer child not N8-SPAWN-chargeable); write 8.39 ms ≤ 50 ms MET; NFR-007, NFR-002 unchanged; AR-203-SYMLINK, AR-203-UNLINK, AR-203-LANEGAP (all LOW) | `grugops/security-nfr-ABC-203` @ `14e4f061` (records only); pair `55a8f4ef..5e23e249` (QE merge `8fa09e14`)<br>`.grugops/context/security-nfr-ABC-203/notes/` (…37c4164f, …eaaa1133) | clause-b.mjs (sha `24b963b1…`) 3 limbs on the pair; holder probe in scratch (link-at-name EEXIST, victim intact; games->dir followed; mode 644; Date edges `[A-Za-z0-9-]` only); no lane or timing run | signed by QE PASS_WITH_GAPS `…f28588e1` under `…5aaf7cec` | — | PASS_WITH_RISKS (no required code fix; N8-LANE reading owed before merge; full-lane NFR-008 only if N8-LANE NOT MET/UNRESOLVED); In Security/NFR → Ready for UAT is the Orchestrator's |
