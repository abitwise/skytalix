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
