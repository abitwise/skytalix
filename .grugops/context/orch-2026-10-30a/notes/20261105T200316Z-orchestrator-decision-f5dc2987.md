---
id: 20261105T200316Z-orchestrator-decision-f5dc2987
kind: decision
by: orchestrator
at: 2026-11-05T20:03:16Z
verified_by: 
confidence: high
refs:
  - ABC-307
  - NFR-008
  - R-CEN-1
  - qe-ABC-307/20261105T192123Z-qe-e2e-decision-da060cef
  - qe-ABC-307/20261105T195441Z-qe-e2e-observation-4a8dd8dc
  - qe-ABC-307/20261105T200227Z-qe-e2e-observation-d5cd6d19
supersedes: 
seal: sha256:b73209be3839d638bd32a8b2fc90d71edc5a80b5caa71cf0ed4230a49a219819
---

qe-ABC-307-a9 stopped (…d5cd6d19): read 3 VOID, 7 of 8 rounds flagged on a foreign grugops vitest first sampled 85 s into the hold; the re-read found no slot and is unspent. No verdict, no figure, not a miss. ABC-307 stays In Review. Branch grugops/qe-ABC-307 at f8dfd607 is held unmerged. Checked by me: the three notes, raw/n8-r3 and both clean trees exist; a grugops vitest (pid 3681070) was live at 20:03:10Z, 11 min 55 s old.

Ruling on QE's question 1: the unspent re-read needs a new PREREG on …da060cef's rules (same arms, same void line, read 3's void stated) and a new clock. The clock is no looser for having expired: …da060cef's stop stands.

Ruling on the trigger: the slot gate alone has now failed twice (reads 1 and 3 each passed it and lost the hold inside 90 s). So the next dispatch waits for the owner to say the whole host is quiet, not merely that a read may start, and my earlier "start" dispatch on a live foreign run was not that condition. Asked of him, with the other project and the second project named.

Not ruled, and not mine alone: merging ABC-307 with A9 still unread. The page has A9 read main after the merge, but the QE verdict signs this ticket and there is none. Any such order is put to the owner as an option, not taken.
