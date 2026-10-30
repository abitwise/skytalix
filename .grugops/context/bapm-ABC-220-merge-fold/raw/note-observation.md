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
