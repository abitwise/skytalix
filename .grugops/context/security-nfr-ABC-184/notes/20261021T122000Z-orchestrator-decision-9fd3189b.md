---
id: 20261021T122000Z-orchestrator-decision-9fd3189b
kind: decision
by: orchestrator
at: 2026-10-21T12:20:00Z
verified_by: 
confidence: high
refs:
  - AR-183-CWDARG
  - ABC-184
  - ABC-168
  - QE-184-a
  - QE-184-b
  - QE-184-c
  - 20261021T121248Z-security-nfr-decision-2fe79772
  - 20261021T102200Z-orchestrator-decision-bc2b06ce
supersedes: 
seal: sha256:d52026392a3bac3e943a255da39bcf7ebc02bf3acc06f40ae5aadc54bd534602
---

Orchestrator, as owner, records per Security/NFR …2fe79772:

- AR-183-CWDARG is CLOSED on the merge of ABC-184 to main. Close row: QE …7b9ef6a7 and Security/NFR's own re-run — TCWD + P6f green on the base test, red at A7's new `booked.cwd` assertion on the head test, label in the output.
- Its ABC-168 promotion trigger lapses with the risk. ADR-0036 Ruling 2 and S3 item 2 stay in force on their own; no book-read risk now holds an ABC-168 owed item from this chain (AR-095-CWD, AR-162-FALLBACK, AR-180-VALIDATED, AR-183-CWDARG all closed).
- QE-184-a (TSPWN) accepted INFO, owner Orchestrator: QE owes a standing read at any hop that edits `spawnNode` — the `spawnSync` `cwd` option and the returned `cwd` are the same unmodified parameter. QE-184-b (TFORGE) accepted INFO, no record.
- QE-184-c adopted: every brief that counts CLI_DEEP children names `--reporter=verbose` and requires a count ≥ 1 (6 today). Read at ABC-184's merge: 6 `[CLI_DEEP]` lines with `--reporter=verbose`, 11/11.
- Erratum added to the ABC-184 page (one line, not a re-cut): the residual costs one line, not a two-place edit.
