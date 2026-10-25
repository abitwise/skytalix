---
subtask: security-nfr-lic-pub-1
role: security-nfr
ref: .grugops/context/security-nfr-lic-pub-1/
branch: new grugops/security-nfr-lic-pub-1 from main, worktree ../wt-security-nfr-lic-pub-1
width: 2 of 3 (beside arch-design-ABC-207; records only, no timing)
---

# LIC-PUB-1 / OQ-214-4 dispositions at the tip; EPIC-008 path redaction; stale NFR row

## Do
- Per Orchestrator `orch-2026-10-25x/…26f4e001` and `orch-2026-10-25w/…ccf209d9`:
  1. Re-read `LIC-PUB-1` and `OQ-214-4` against `main` after ABC-215 merged at `5c91e2e4`, which ended the CC BY-SA carve-out. Record the evidence and dispose of `OQ-214-4`. For the owner-held `LIC-PUB-1`, write a recommended disposition the owner can close.
  2. Redact, at the tip only, the absolute host paths in EPIC-008 § Dependencies. Replace the owner's home-directory path to cutechess-cli with a neutral placeholder; keep the version and sha256. Treat the system-package Stockfish path the same way if ADR-0049 d4 calls for it. This applies ADR-0049 d4 forward to a live page. Dated history and sealed notes are not touched, and history is not rewritten (SEC-PUB-1 accepted).
  3. If `plans/nfr-catalog.md` still has the stale "no bin, ten modules" row noted after SEC-212-b, correct it with a dated line.

## Fences
- Only your worktree and `<scratchpad>/sec-lic/`. No `src/`. No npm/vitest/timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only. Copy no personal path, username or hostname into any record.

## Publish
- Commit on your branch. Seal notes (task security-nfr-lic-pub-1). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
