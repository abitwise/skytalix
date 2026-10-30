---
id: 20261030T004100Z-orchestrator-decision-6db452d1
kind: decision
by: orchestrator
at: 2026-10-30T00:41:00Z
verified_by: 
confidence: high
refs:
  - ABC-225
  - ABC-240
  - EPIC-010
  - qe-ABC-225/20261030T003823Z-qe-e2e-decision-3a53bdfc
  - plans/board.md
supersedes: 
seal: sha256:c530188d7c0f6dd9a8882da8e4ee4ab2eeda157005a4d4638aae122955001a00
---

RESUME NOTE (night plan …c2534968, thermal stop clause).

qe-ABC-225 ended FAIL (…3a53bdfc): A1–A4 were met, and no defect was found in rpair. A5 and A6 were never read.
- Run 1 was voided by a foreign vitest from another project on the host.
- Run 2, ALONE at width 2, tripped the 85 °C line: Tctl median 87.05 °C over 30 samples, after 4 of 40 games.

Decisions:
- ABC-225 → Blocked, on the owner. The QE records stay on grugops/qe-ABC-225 @ 3da78303 (unmerged, because the branch carries ABC-225's code).
- No further cutechess games run tonight.
- The EPIC-010 R-pair batch (about 9 h at width 2) carries the same thermal risk (QE-225-b HIGH).

Owner options for re-reading A5:
- (a) set an explicit Tctl line for R runs (e.g. 90 °C);
- (b) run A5 at --concurrency 1 with a new PREREG, which can't project the width-2 batch;
- (c) a cooler host state (cooling or fan profile), keeping 85 °C.

My recommendation: (b) for the A5 tool check, and an owner call on (a) or (c) before the milestone batch.

QE-225-c: the owner's other project runs vitest as node-MainThread, which `pgrep -x node` misses. Future prechecks count `pgrep -f "[/]vitest"`, and runs wait-clear.

The night continues with ABC-240 (value-identical; SE plus QE; no games). Its QE timing reads wait for a clear host.
