---
id: 20261030T161257Z-ba-pm-observation-dd1f9a71
kind: observation
by: ba-pm
at: 2026-10-30T16:12:57Z
verified_by: 
confidence: high for the read facts; nothing re-measured
refs:
  - bapm-ABC-220-merge-fold
  - ABC-220
  - ABC-221
  - ABC-222
  - ABC-223
  - EPIC-009
  - ADR-0044
  - ADR-0045
  - ADR-0052
  - ADR-0053
  - NFR-004
  - NFR-008
  - NFR-011
  - AR-NFR004-A
  - AR-UCI-BUSY
  - QE-220-a
  - QE-220-b
  - QE-220-c
  - QE-220-d
  - QE-220-e
  - QE-220-f
  - SEC-220-a
  - SEC-220-b
  - SEC-220-c
  - SEC-228-a
  - qe-ABC-220/20261030T152147Z-qe-e2e-decision-7a09c5e1
  - qe-ABC-220/20261030T152147Z-qe-e2e-observation-c6bdd364
  - qe-ABC-220/20261030T152147Z-qe-e2e-observation-58af5b6a
  - secnfr-ABC-220
  - main ec1e835b
  - main 18485bae
  - main 4ac4f3bb
  - D3
  - D4
  - D4.5
  - D5
  - D11
  - A11
  - A12
  - A13
  - A14a
  - A14b
  - UAT
supersedes: 
seal: sha256:c78aadfefd18a0483f67be7835fd7b1772c8db638e2848c2ca5a317157f7637c
---

# bapm-ABC-220-merge-fold: what was not folded, and what is still open

BA/PM, records only, at `main` `4ac4f3bb`.

## Not folded, by design
- **QE-220-b, QE-220-d, QE-220-e (INFO):** no ticket. QE-220-d confirms the ASVS L1 line and backs SEC-220-b's "safe on every branch". QE-220-e (a clock for the other side only gives T) is ADR-0052 D3 as written, and a GUI sends both clocks.
- **SEC-220-c (INFO):** QE's, at the next `NFR-011` re-read. No ticket.
- **QE-220-c (INFO):** the `NFR-008` watch is the Orchestrator's (catalog watch line, `secnfr-ABC-220`). It is named in ABC-221's NFR triggers only.
- **Test note 4, Scribe item:** the `TimeMode` line in `AGENTS.md` and SE F3 (the A11 lane command) belong to `scribe-agents-md-timemode`, claimed beside this hop. This hop does not touch them.
- **`uci-clock-mode` halves of the ADR-0044 folds, and `ADR-0045` A3's clamp line:** they wait for `ABC-221`'s merge (ADR-0052 § Status: a fold takes effect at the merge of the ticket that builds it). They are listed in ABC-221 test note 4.

## Open, blocks nothing
- **The owner's confirmation of the whole-second reading** (≤ 22 s means < 22 500 ms). It has been open since `bapm-owner-adr-fold`. QE: every reading also meets the strict reading except the stated overshoot (max +1.0 ms). Only `AR-UCI-BUSY`'s text, ABC-220 A11's bound and ABC-222 A5's bound would move if he declines it.
- **SEC-228-a:** the owner's call (the catalog names the M3 reference, while readings come from the Linux host). It gates nothing.

## Seen, not acted on (outside the brief)
- **`ADR-0052` D4** says `CLOCK_MODE_MAX_BUDGET_MS` = 60 000 − 500 is "the same 500 ms margin as D3". Since the owner's amendment, D3's margin is 0 ms. D4's own figures (59.5 s under 60 s) are unchanged by § Status, so only the comparison is stale. That is the Architect's text and was left as it is. ABC-221 does not depend on it.
- **EPIC-009's front matter** still reads `status: backlog` / `column: Backlog` while a child ticket is Done. The epic's card is the Orchestrator's, and it was left as it is.
- **The `secnfr-ABC-220` notes** are drafted but unsealed (their seal needs `node`). This hop cites the Security/NFR Result in `.grugops/queue/done/secnfr-ABC-220.md` and the catalog at `main`, not those notes.
