---
id: 20261103T145738Z-ba-pm-observation-9dc842bc
kind: observation
by: ba-pm
at: 2026-11-03T14:57:38Z
verified_by: 
confidence: high: routing read from the notes and pages at 5222a9b4; open items are routing, not findings; board read only
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
seal: sha256:be8b1e0c7650437c93d7522e9dfb174e4184ed0544bd86eeb2a92ce6605ff219
---

# bapm-sec-cut: open items after this hop. **Orchestrator:** board cards for `ABC-276` / `ABC-277` (Ready) and the Done moves already on the board; `QE-274-d` (`.gitignore` `node_modules` symlink) has no owner in this fence; `QE-274-a`'s order rule is now on `EPIC-011` § Test notes. **Owner:** SEC-HP-2 one-line redaction (pending, recommended yes); "accept ADR-0067" (pending). **Architect (optional):** an `ADR-0049` D4 dated line naming the hostname exception. **Scribe (optional):** an `AGENTS.md` command row for `ABC-277`'s check, if the byte budget allows

BA/PM, task `bapm-sec-cut`, records only, at `main` `5222a9b4`. Board read only.

- **Proposed board lines** are in this task's `## Result` (queue done copy) and the hand-back. Not written to `plans/board.md` (fence).
- **Not verified here (`UNKNOWN - verify`, carried from Security/NFR, the owner's):** whether the remote's refs equal the local remote-tracking copies; the hosting provider's secret scanning; forks and clones.
- **A tension stated, not resolved:** `ABC-276` A1 redacts the host name to `<host>` (as `rpair` does today), while SEC-HP-3 exempts the owner-ruled hostname label from `ABC-277`'s check. They do not conflict: one is what the harness writes, the other what the check flags. No action.
- **`ABC-277`'s ordering note:** if `ABC-277` merges first, `ABC-276`'s own branch must pass the check; its test note 2 already requires generated fixtures.
- **No `UNKNOWN - verify` added** beyond those carried. No estimate added.
