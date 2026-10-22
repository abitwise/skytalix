---
id: 20261021T203559Z-orchestrator-decision-ed1933d8
kind: decision
by: orchestrator
at: 2026-10-21T20:35:59Z
verified_by: 
confidence: high
refs:
  - ABC-195
  - AR-193-HUNKHDR
  - AR-193-SPACEPATH
  - ADR-0036
  - QE-195-a
  - QE-195-b
  - QE-195-c
  - 20261021T203404Z-qe-e2e-decision-f36a06c3
supersedes: 
seal: sha256:9e263543921b897224cc4dd310ebc926943e541fbe2d44e23666d5595e1a4208
---

# ABC-195 merged to main; AR-193-HUNKHDR and AR-193-SPACEPATH CLOSED; the HUNKHDR stand-in retires

## Close
- QE `…f36a06c3` returned PASS_WITH_GAPS, read at the merge of main `88b03a37`.
- **AR-193-HUNKHDR is closed.** PP-TPL, PP-EDIT, PP-REDIR and RA-PLUS fire at head as the page's table says, and are silent on base. The 20 existing rows are unchanged.
- **AR-193-SPACEPATH is closed.** SP-N5 fires on all three limbs at head and is silent on base.
- **Retired with this merge** (`ADR-0036` § S1 (iv), ABC-195 block):
  - the HUNKHDR stand-in. Its last run, on the staged merge, printed nothing;
  - the SPACEPATH whitespace-path trigger rule.
- No clause (b) stand-in remains open.

## Merge
- `grugops/qe-ABC-195` (`78a52b1c`) is merged into `main` under the owner's per-ticket grant. The page needs no Security/NFR gate.
- Gates on the staged merge:
  - lint, typecheck and build all exit 0;
  - `npm test` passes 1994 of 1994 tests (`last-run.json`: success true, 0 failed);
  - the skip-count capture as spelled reads 0, and the gate reads `No findings.`;
  - CLI_DEEP 11/11 and PERFT_DEEP 32/32;
  - the waiver form (quotePath) printed nothing.
- UAT is waived: 0 production lines.

## Gaps carried
- **QE-195-a (LOW, proposed):** if PP-EDIT's in-place anchor drifts, the row silently becomes a control. The harness checks limbs 2/3 only by equality with the twin. BA/PM rules it in `bapm-rule-QE-195`.
- **QE-195-b (INFO):** retiring the stand-in loses nothing reachable. Accepted on QE's reading.
- **QE-195-c (INFO):** a cosmetic backticked id in the ADR heading. No edit.
