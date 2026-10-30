---
id: 20261030T121003Z-ba-pm-observation-9ed549b7
kind: observation
by: ba-pm
at: 2026-10-30T12:10:03Z
verified_by: 
confidence: high: source and record reads at e42b637b; nothing run
refs:
  - bapm-ABC-228-merge-fold
  - ABC-228
  - EPIC-010
  - ADR-0053
  - ADR-0045
  - main e42b637b
  - qe-ABC-228-ii/20261030T115900Z-qe-e2e-decision-e39d190c
  - qe-ABC-228-ii/20261030T115900Z-qe-e2e-observation-2123617d
  - se-ABC-228-ii/20261030T093252Z-software-engineer-observation-0f553b17
  - ABC-229
  - ABC-243
  - ABC-241
  - ABC-220
  - EPIC-009
  - ADR-0044
  - NFR-009
supersedes: 
seal: sha256:19ed29e3ceb68cd61f155df0486e11754b33be3304583487e5484ebdd91f2a2e
---

# bapm-ABC-228-merge-fold: three loose ends seen while folding, none acted on (outside the brief)

- **ABC-229's wait is met.** Its page (DoR 9/10, Backlog) waits on "ABC-228 merged", which happened at e42b637b. It now owes a BA/PM re-score toward Ready, with its G6/G5 at 4 000 ms (both sides) and its smoke R at 4 000 ms (recorded, not pooled until the batch). This hop's brief did not name it, so its page is unedited.
- **ADR-0044 D4.2** (`… A bare \`go\` at the default level is therefore 3 000 ms …`) is stale from e42b637b. It is recorded in ADR-0045's fold block. ADR-0044's own text is unedited (fence: ADR text as named).
- **The NFR-009 catalog text and the transposition test header** both say "a 1 s and a 3 s search", but the reading uses DEFAULT_BUDGET_MS = 4 000. ABC-243 fixes the test's three labels. The catalog phrase is Security/NFR's, alongside their NFR-004/005 hop.
