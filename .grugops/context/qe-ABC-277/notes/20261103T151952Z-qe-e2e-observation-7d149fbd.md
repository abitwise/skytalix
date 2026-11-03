---
id: 20261103T151952Z-qe-e2e-observation-7d149fbd
kind: observation
by: qe-e2e
at: 2026-11-03T15:19:52Z
verified_by: 
confidence: high on the facts (run and counted); severities and owners are QE's judgement
refs:
  - ABC-277
  - EPIC-011
  - qe-ABC-277
  - grugops/ABC-277
  - 861de9c5
  - 0f188473
  - se-ABC-277/20261103T150937Z-software-engineer-decision-95af648e
  - se-ABC-277/20261103T150937Z-software-engineer-observation-0bad1e32
  - se-ABC-277/20261103T150937Z-software-engineer-observation-f71efacd
  - ADR-0049
  - sec-host-paths/20261103T144802Z-security-nfr-decision-72b4070b
  - SEC-HP-1
  - SEC-HP-2
  - SEC-HP-3
  - SEC-177-1
  - QE-274-d
  - NFR-008
  - QE-277-a
  - QE-277-b
  - QE-277-c
  - QE-277-d
  - QE-277-e
  - QE-277-f
  - QE-277-g
  - tools/grugops/records-path-check.js
  - tools/grugops/records-path-check.proof.js
  - .grugops/context/qe-ABC-277/raw/scripts/harness.mjs
  - .grugops/context/qe-ABC-277/raw/scripts/fprate.mjs
  - .grugops/context/qe-ABC-277/raw/out/harness-run.txt
supersedes: 
seal: sha256:4bbd060a731e74d41a917dd9ac737e84094345594c0dd140ad6de588d5744ba1
---

# QE gaps for ABC-277: QE-277-a MEDIUM (attribute-dependent blind spot), QE-277-b..e LOW, QE-277-f/g INFO. None blocks the merge

Facts as run (`raw/out/harness-run.txt`, rows b01–b26, fp01–fp08). Severities are QE's judgement.

- **QE-277-a MEDIUM. Owner: Software Engineer, via BA/PM as a follow-up ticket.**
  - **What fails.** The text diff obeys `.gitattributes` from the checkout the check runs in. A branch that adds `*.md -diff` (or `binary`) at the repo root, which lies outside the three scanned paths, hides every added `.md` line. Git prints "Binary files differ", and the check says clean.
  - **Measured.** Same branch: exit 0 from its own checkout (the runbook's first form, with `--head` defaulted or explicit), exit 1 from main's checkout. The verdict depends on where it runs.
  - **Same mechanism.** A record git classes as binary (NUL byte, b13) is never read. The SE's header documents that half.
  - **Exposure today: 0.** The repo has no `.gitattributes`.
  - **Fix hint, not built:** `--text` on the `-U0` diff, or flag any change to `.gitattributes` as a finding.
- **QE-277-b LOW. Owner: BA/PM (scope).** `.xz` is not decompressed. 5 `.xz` records are committed under `.grugops/context/*/raw/` today (0 class hits in them, counted). A new `.xz` carrying the home path passes. The ticket names only `.gz`, so this is not an AC miss.
- **QE-277-c LOW. Owner: Software Engineer.** Foreign-argv false negatives on realistic process lines:
  - bare command, then a flag, then the path (`<pid> node --<flag>=<n> <abs>`, `<pid> python3 -u <abs>`);
  - an absolute executable with no argument;
  - `ps -ef` lines (the SE named only `ps aux`).
  - **Mitigation, measured:** 75 of the 77 foreign-argv lines at main also hit home/slug/scratch. A foreign project under the owner's home is still caught by home-path, as SEC-HP-2's own line is.
- **QE-277-d LOW. Owner: Software Engineer.** home-path is not matched when the home is followed by `.`, `-` or `_`. The realistic case is a sentence ending in `<home>.`, and 0 such lines are at main (counted). JSON-escaped slashes (`\/`) are not matched either (INFO).
- **QE-277-e LOW. Owner: Software Engineer. Cosmetic, no leak.**
  - For a path git quotes (a TAB in the name), the `+++` header ends in a TAB after the closing quote. `unquote` slices off the TAB, not the quote.
  - Result: the line hit prints the path with a stray `"`, unlike the same file's `(file path)` hit. A name with a space would print with a trailing TAB.
  - The class values in the path are still redacted (b25). `unquote` is the check's untested block (coverage).
- **QE-277-f INFO. Owner: Orchestrator.** `os.homedir()` follows `$HOME`. Run with `HOME` overridden, the home-path and home-slug classes test the override: the A1 branch shows 9 of 17 hits, with no warning. Run the check with the real `HOME`. A runbook line would cover it.
- **QE-277-g INFO. Owner: none (accepted).**
  - Two extra accepted false positives: a number before a URL route (`GET <n> /api/games/<id> <t>ms`).
  - Editing a legacy `.gz` (M or R<100) re-reads it whole and re-flags old values. That is the ticket's scope ("whole decompressed content"), so the branch must redact the touched `.gz`.
