---
id: 20261103T145738Z-ba-pm-decision-e7e7beb7
kind: decision
by: ba-pm
at: 2026-11-03T14:57:38Z
verified_by: 
confidence: high: ticket text from Security/NFR's sealed sec-host-paths notes (…72b4070b, …45ef018a); rating.ts read at 5222a9b4, not run; the added-lines refinement and the usage re-reading are BA/PM's, stated; priority P2 is the Orchestrator's brief
refs:
  - bapm-sec-cut
  - grugops/bapm-sec-cut
  - ABC-276
  - ABC-277
  - ABC-273
  - ABC-274
  - ABC-275
  - ABC-239
  - EPIC-011
  - R1
  - R2
  - R3
  - G2
  - E2-pre
  - ADR-0049
  - ADR-0067
  - ADR-0056
  - NFR-008
  - SEC-HP-1
  - SEC-HP-2
  - SEC-HP-3
  - SEC-177-1
  - QE-273-a
  - QE-273-b
  - QE-273-c
  - QE-273-d
  - QE-274-a
  - QE-274-b
  - QE-274-c
  - QE-274-d
  - QE-275-a
  - QE-275-b
  - QE-275-c
  - QE-275-d
  - tools/rating/rating.ts
  - tools/grugops
  - memory-bank/45-standing-rulings.md
  - memory-bank/70-runbook.md
  - memory-bank/40-contributing.md
  - 5222a9b4
  - 20d539e1
  - 85a304ff
  - 2a2e1e02
  - sec-host-paths/20261103T144802Z-security-nfr-decision-72b4070b
  - sec-host-paths/20261103T144802Z-security-nfr-observation-45ef018a
  - sec-host-paths/20261103T144802Z-security-nfr-observation-acbfc4d3
  - qe-ABC-273/20261103T135141Z-qe-e2e-decision-07b3c794
  - qe-ABC-273/20261103T135141Z-qe-e2e-observation-334a1bf6
  - qe-ABC-274/20261103T143139Z-qe-e2e-decision-fa87f74d
  - qe-ABC-274/20261103T143139Z-qe-e2e-observation-d4c26218
  - qe-ABC-275/20261103T130342Z-qe-e2e-decision-8d38c358
supersedes: 
seal: sha256:fdbad5ab510a1157ad053cd3df33a2f0d047649d5515200b5963f2cf478f96ca
---

# bapm-sec-cut: two host-path tickets cut, both P2, DoR 10/10, Ready. **`ABC-276`** (S, tools only): `rating.ts r` / `d` redact their records like `rpair`, `SHA256SUMS` after redaction, the played argv byte-equal, `usage()` names 100 (folds `QE-275-a`). **`ABC-277`** (M, low end): a diff-scoped records path check (five classes, `.gz`, renames pass, never prints the value), run by the Orchestrator before each merge, and the placeholder rule as a standing ruling with the hostname exemption

BA/PM, task `bapm-sec-cut`, records only, at `main` `5222a9b4`. Nothing run. Authority: the ticket pages' `## Scope` and `## Acceptance criteria` (cited, not restated here). Source: Security/NFR `sec-host-paths` decision `…72b4070b` (recommendations (a) and (b), REQUIRED; ticket text T1 / T2) and observation `…45ef018a`.

## Value
- **User:** every role that commits records, QE first. **Pain:** `ADR-0049` D4 (no personal path) is breached in 816 tip files, all added after its acceptance; `r` / `d` force a hand redaction that leaves `SHA256SUMS` describing uncommitted bytes. **Value:** the breach stops growing, and an `r` / `d` out dir commits as written.

## ABC-276 (T1), S, P2
- Scope: `r` / `d` records through the same redaction `rpair` uses, every record before `SHA256SUMS`, redacted stdout of `machine.txt` / `summary.txt`, and `usage()`'s two strings (`QE-275-a`).
- Measurable acceptance: A1 0 occurrences of 8 named values in any record; A2 `sha256sum -c` 0 FAILED and the same file set as today; A3 the executed argv byte-equal at every `r` / `d` budget (existing rows unedited); A4 an offline planted-fixture row, no game; A5 the exact usage strings; A6 0 lines under `src/` / `data/` / `vitest.config.ts`.
- **BA/PM re-reading of `ABC-275` A3 item 3 (recorded on the page):** rpair's refusal is "the usage text", whatever its current bytes, so the new usage text is intended, not a regression.
- Read in `tools/rating/rating.ts` at `5222a9b4` (not run): `r` / `d` write `machine.txt` and `cmd.txt` raw and sum top-level files raw; `rpair` redacts and then sums; `usage()` says "R 500 only". This confirms Security/NFR's source reading.

## ABC-277 (T2), M (low end), P2
- Scope: a `tools/grugops/` check over **added lines** (text) and whole added or changed `.gz` under `.grugops/`, `plans/`, `memory-bank/`, against the merge base, with rename detection; five classes; exit 0 / 1 / 2; wiring in `memory-bank/70-runbook.md` and `40-contributing.md` § Conventions; one dated entry in `memory-bank/45-standing-rulings.md`.
- **Added lines, not whole changed files** (a BA/PM refinement of Security/NFR's "files a branch adds or changes"): a whole-file scan would fail any touch of the 816 legacy files and any queue move; A2 items 2 and 3 pin that it does not.
- Measurable acceptance: A1 5 / 5 classes plus `.gz`, exit 1, 0 bytes of any planted value in the output; A2 five exit-0 cases; A3 exit 0 on its own branch, exit 2 without a merge base; A4 / A5 named lines; NFR ≤ 1.0 s lane or 0 lane rows, ≤ 10 s at ≤ 200 files.
- Size M, not S: the diff mechanics (added lines, renames, `.gz`) are the work. Split point: the ruling entry can ship alone.

## Fences kept
- Out of both: history rewrite, bulk redaction (accepted risk, owner Olger Oeselg), `AGENTS.md` (18 404 of 18 432 B), the hostname as a class (SEC-HP-3 exempt), the brief template (not a repo file).
- SEC-HP-2's one-line redaction is `ABC-277` A7 **only on the owner's yes** (pending, recommended yes).
