---
id: 20261106T210025Z-ba-pm-observation-cd569ec9
kind: observation
by: ba-pm
at: 2026-11-06T21:00:25Z
verified_by: 
confidence: high that each line reads as quoted and each stale line stands as stated; the owner and (b) rows points are absence on the record as searched, not proof; nothing run
refs:
  - bapm-ABC-291-k1-lines
  - grugops/bapm-ABC-291-k1-lines
  - ABC-291
  - ABC-282
  - ADR-0075
  - ADR-0072
  - ADR-0071
  - ADR-0056
  - ADR-0028
  - EPIC-011
  - NFR-008
  - K1
  - K2
  - K3
  - K7
  - e460342e
  - 9e496e4a
  - 5baf45a2
  - orch-2026-10-30a/20261106T202213Z-orchestrator-decision-a7dc99cb
  - orch-2026-10-30a/20261106T203809Z-orchestrator-decision-5a2d8753
  - qe-ABC-291-k1/20261106T202814Z-qe-e2e-decision-2e186a33
  - qe-ABC-291-k1/20261106T203639Z-qe-e2e-observation-b850a2ad
  - qe-ABC-291-k1/20261106T203639Z-qe-e2e-observation-a223d29a
  - qe-ABC-291-k1/20261106T203702Z-qe-e2e-observation-5de6a358
  - se-ABC-291-repair/20261106T204802Z-software-engineer-decision-fd2ea321
  - se-ABC-291-repair/20261106T204802Z-software-engineer-observation-2cddd25a
  - se-ABC-291-k1rows/20261106T205243Z-software-engineer-decision-96abeaf8
  - se-ABC-291-k1rows/20261106T205243Z-software-engineer-observation-c4360feb
  - se-ABC-291/20261106T201944Z-software-engineer-decision-d68ef14e
  - se-ABC-291/20261106T201944Z-software-engineer-observation-cb124720
  - se-ABC-291/20261106T201944Z-software-engineer-observation-668c63b4
  - arch-ABC-291-stop/20261106T203245Z-architect-design-decision-2d2c2bad
  - arch-ABC-291-stop/20261106T203300Z-architect-design-observation-77dd9228
  - arch-records-1106/20261106T193911Z-architect-design-decision-860a0dbd
  - bapm-ABC-291-stop-lines/20261106T203925Z-ba-pm-observation-9118767a
supersedes: 
seal: sha256:5d0a9de2ad0fc74077f545bcf6230dda33de026404ac5ccef037d8c58c13df71
---

# bapm-ABC-291-k1-lines: what stays open on `ABC-291`'s page after these lines

BA/PM, task `bapm-ABC-291-k1-lines`. Read from the records at `main` `e460342e` and `grugops/ABC-291` at `9e496e4a`, read only. Nothing run. No value, rule, definition, ratio, intent or level moved.

## For the Orchestrator
- **K1 (c)'s "before the build" has no reading on the record.** The miss is recorded (`…a7dc99cb`), and a freeze after the build is "recorded as such". No note reads what the bar then says, and no note says the owner was told. It is a bar's words in an ADR he accepted, and K1 (h) took an Architect's dated line and a word to him. My recommendation: the same route, in one line each. Nothing on this page assumes the answer.
- **Test note 1's "(b) rows":** the same note asks QE to freeze them before the build. `qe-ABC-291-k1` did not read them, `qe-ABC-291`'s brief does not name them, and no freeze of them is on the record. `UNKNOWN - verify` whether K1 (b)'s "frozen corpora" answers this, or whether anything is owed.
- **K1 (h):** the owner's answer is still not on the record (`…5c911039`).

## Owed to others
- **QE (`qe-ABC-291`):** K0 to K3 and K7 at the tip, which closes "K3 is unread" and the "QE's read is owed" clauses on K1 (c), K2, A2 (b) and the row count. `D8`'s leak plant. The file-flip call in `…96abeaf8`.
- **Architect, next hop:** whether PR10's figure earns a dated line (`…a223d29a`, `…5a2d8753`).
- **`UNKNOWN - verify`:** why M3 reacts, whether it reacts this way to any small evaluation change, and whether it costs play. No control term ran.

## Left stale, outside the brief's list
- **K1 (h)'s dated line says the added read "lands with the repair".** It landed at `a3474306`, red on 4 of 4 plants (`…2cddd25a`). Scope 4's new line names the row. K1 (h) itself has no mark.
- **Scope 5's "the last commit on the branch":** `ADR-0075` d11 (a)'s dated line names `e76d22f3` and the STOP's repair as test-only commits after it. `70d931ab` is a third, and that line does not name it. By `git`, `src/`'s three test files alone changed. The reason for "last" reads the same, and no line is added.
- **§ NFR triggers' `NFR-008` line** stays `UNKNOWN - verify`. `…c4360feb`'s +9 ms is a reported figure on an unheld host, not a read, so I added no line.
- **DoR row 10** still reads "goes to `ADR-0028` d2". The closing dated line answers it.
- **`ADR-0075` § `UNKNOWN - verify`** still lists the row count. Outside this hop's fences.

## Order of merges
The page cites `a3474306`, `70d931ab` and notes that stand on `grugops/ABC-291`, not on `main`. If this branch merges first, those citations reach `main` only when `ABC-291`'s branch does.

## One slip in `…486ad0bd`
It says "29 lines added, 2 struck and kept". `git` counts 29 insertions and 2 deletions, so that is 27 lines added and 2 replaced, the 2 being the struck lines. Nothing else changes.
