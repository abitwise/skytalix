---
id: 20261021T153240Z-orchestrator-decision-9f5ca4b4
kind: decision
by: orchestrator
at: 2026-10-21T15:32:40Z
verified_by: 
confidence: high
refs:
  - AR-163-DELONLY
  - AR-188-BINARY
  - AR-163-UNCOMMENT
  - ABC-188
  - ABC-168
  - QE-188-a
  - 20261021T153032Z-security-nfr-decision-f5843a71
  - 20261021T144140Z-orchestrator-decision-e37f4a1a
supersedes: 
seal: sha256:4154280c1337d6e068fff7f1ecbaec8ad0d2a9fa9e37e6de336d251e0c7e21ff
---

Orchestrator, as owner, records per Security/NFR …f5843a71:

- AR-163-DELONLY is CLOSED on the merge of ABC-188 to main (QE …bfbbb83f read A2–A7: G1-IMP, G1-GRD, G1B, UNC1, REN, D1, D2 fire; limbs 2/3 identical to 341da4c1 on 29 plants). ABC-168's merge hold on it (…e37f4a1a) is LIFTED.
- AR-163-UNCOMMENT: limb 1 now covered; limbs 2/3 stay open, LOW, owner Architect/Design.
- AR-188-BINARY OPENED (LOW, owner Orchestrator; fix Architect/Design; BA/PM cuts XS/P3 now): a NUL byte in a holder, or a checked-out `.gitattributes` `-diff` line, makes git treat a file as binary and blinds every limb. MEDIUM without the stand-in check. Stand-in, from now until the fix lands: the Orchestrator runs `git diff --numstat <base> <head> -- src | awk '$1=="-"'` (must print nothing) at every routing and merge, in the same checkout as the instrument. Run at ABC-188's merge: empty. Fix: the instrument's diff call reads `--text --no-textconv`; the harness gains a NUL plant and a `-diff` plant.
- The by-hand `--name-only` check is retired per ADR-0036 § S1 (iv), replaced by the `--numstat` stand-in above.
