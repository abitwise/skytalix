---
id: 20261021T144140Z-orchestrator-decision-e37f4a1a
kind: decision
by: orchestrator
at: 2026-10-21T14:41:40Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - AR-163-DELONLY
  - AR-168-BINPIN
  - QE-168-b
  - QE-168-c
  - NFR-011
  - 20261021T143943Z-security-nfr-decision-75a45be0
supersedes: 
seal: sha256:153fec315ce6117cee952c000ccba46ea1080493d8a51368cbcad56b4bf2c84e
---

Orchestrator, as owner, records per Security/NFR …75a45be0 (ABC-168 PASS_WITH_RISKS):

- AR-163-DELONLY: trigger (iv) FIRED — ABC-168 makes `src/uci.ts` a second limb-1 holder. Severity MEDIUM until fixed. Per the risk's own terms the fix is owed before ABC-168 merges: limb 1 fires on `+` and `−` lines and the `!lines.size` skip is dropped (Architect/Design builds; BA/PM cuts; QE reads the ABC-182 harness plus Security/NFR's D1/D2 deletion plants; the harness's G1-* rows flip on purpose). ABC-168's merge is HELD on it unless the owner accepts the risk at MEDIUM by name. Until it lands, the Orchestrator runs the by-hand `--name-only` check on `src/book-file.ts` and `src/uci.ts` at every merge.
- AR-168-BINPIN OPENED (LOW, owner Orchestrator), from QE-168-b: nothing pins `bin`'s value. Fix: an XS/P3 one-line value pin (BA/PM cuts). Owed before merge of any ticket that packages `dist/`, makes a backend depend on `skytalix`, or edits `bin`.
- QE-168-c accepted INFO: QE hand-reads A1–A4 on every `src/uci.ts` edit.
- NFR-011 placed (idle responsiveness, M3 numbers; QE's probe the instrument; first reading 86.1 / 6.9 / 0.2 ms met). Not cited as M3's proof until the owner confirms the rewording.
- Lock-regeneration chore (QE-172-a + ABC-168's `bin`): cut after ABC-168 merges.
- ABC-168 moves In Security/NFR → Ready for UAT; owner UAT A8–A10 owed (cutechess-cli, En Croissant).
