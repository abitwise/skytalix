---
subtask: secnfr-ABC-228-catalog
role: security-nfr
ticket: ABC-228
ref: .grugops/context/secnfr-ABC-228-catalog/
branch: new grugops/secnfr-ABC-228-catalog from main (worktree .claude/worktrees/secnfr-ABC-228-catalog)
width: records only, no CPU
---
# Security/NFR: catalog text after ABC-228 (ii) — level 5 = 4 000 ms
## Read
ABC-228 ticket § NFR triggers, § Follow-ups and "State at the merge"; ADR-0053 d10; ADR-0045 FOLDED block; qe-ABC-228-ii
verdict `…e39d190c` (G5 4 001 ms; G8 +0.70 s); plans/nfr-catalog.md.
## Do
Amend, dated, in plans/nfr-catalog.md: NFR-004 (default ≤ 4 s; 5 s ceiling at levels 1–5 unchanged), NFR-005, and
NFR-009's "1 s and a 3 s search" wording (now DEFAULT_BUDGET_MS = 4 000). Re-state AR-NFR004-A only if its reading
changes. Rule whether any of this is a NFR-bound change needing the owner (the owner accepted (ii) on 2026-10-30).
## Fences
plans/nfr-catalog.md and your notes only. No src/, tools/, data/. No board edits. Never push/force/amend/rebase/merge into main. No host paths.
## Publish
Sealed notes (task `secnfr-ABC-228-catalog`), commit on the branch, `## Result` + trace row here, brief + claim to done/.

## Result

*Security/NFR, 2026-10-30, task `secnfr-ABC-228-catalog`; records only, at `main` `09060f67`. Branch `grugops/secnfr-ABC-228-catalog`: catalog commit `0c54910e`; notes and this brief move are on top.*

- **Result: PASS (text placed; no required fix).** No bound moved beyond the owner's word (ii) (`…c4ab73de`; `ADR-0053` d10).
- **`NFR-004`:** Target "≤ 3 s at default difficulty (level 5)" struck and kept, now **≤ 4 s**. The ceilings (5 s at levels 1–5, 7 s at 6, 32 s at 7) are unchanged. The mechanism line's "at least 2 000 ms under it" is dated: level 5 sits 1 000 ms under its ceiling. Verified by: dated `G5` line at 4 000 ms (max 4 001 ms; clause A still NOT MET in the letter, covered by `AR-NFR004-A`; ceiling MET at 5, 6 and 7).
- **`NFR-005`:** "within the 3 s budget" (twice) struck and kept, now **4 s**. The depth-6 FAIL, depth-7 WARN and 5 s ceiling are unchanged. Verified by: dated status (plain node, kiwipete 8 ×5, position-6 10 ×5).
- **`NFR-009`:** "a 1 s and a 3 s search" now reads "a 1 s search and one at `DEFAULT_BUDGET_MS` (4 s from 2026-10-30)", in Target and Verified by. Not loosened; the instrument always read the constant.
- **`AR-NFR004-A`: stands with its number, not re-stated.** Its reading does not change: same mechanism, ≤ 31 ms bound, owner and scope; max +1 ms at the new 4 000 ms call.
- **Owner ruling: no owner decision is needed for this text.** For his information only: a depth in 4 s asks less than in 3 s, and level 5's ceiling margin is now 1 000 ms. Both are what (ii) means. **One item is his and gates nothing: `SEC-228-a`.**
- **`SEC-228-a` (LOW, records; route: Orchestrator → owner):** the catalog's "M3 reference only" scope and Node v26.11.x runtime are stale since the 2026-10-28 host move. The 4 000 ms readings are from the current Linux host (Node v26.12.1). They are recorded with their host and do not re-base any row; re-basing is the owner's word.
- **`SEC-228-b` (INFO; Security/NFR, next catalog hop):** `NFR-009` `Verified by` "not built yet" is stale. Not edited (outside the brief).
- **`G8` recorded, not ruled:** +0.70 s, head 9.61 s, 0.39 s under R-1's 10 s. The split is not on record (`UNKNOWN - verify`). `NFR-008` not edited.
- **Notes** (sealed via the plugin's `admitAndAppend`, rendered): `20261030T122100Z-security-nfr-decision-d3394d72`, `20261030T122130Z-security-nfr-observation-b1ead5bf`.
- **Checks:** every NFR row hashed before and after, compared cell by cell. Only `NFR-004`, `NFR-005` and `NFR-009` `Target` and `Verified by` changed. Host-path scan of the added text found 0 hits. `reference-check` was NOT run (records only, two SEs on the host).
- **Not touched:** `src/`, `tools/`, `data/`, tests, ADRs, the board, the trace, tickets, `AGENTS.md`. Nothing pushed or merged. The main checkout's `claimed/` copies are untouched (tracked done/ copies on this branch).

### Trace row (10 cells, header order)

| ABC-228 (Security/NFR catalog) | NFR text after ABC-228 (ii), level 5 = 4 000 ms: NFR-004 clause A ≤ 4 s (ceilings 5/7/32 s unchanged; level-5 margin 1 000 ms dated); NFR-005 referent 4 s (floor 6, WARN 7 unchanged); NFR-009 second search = DEFAULT_BUDGET_MS; AR-NFR004-A stands (max +1 ms), not re-stated; PASS; SEC-228-a LOW (M3 reference stale since host move, owner's to re-base), SEC-228-b INFO | EPIC-010 | — | NFR-004, NFR-005, NFR-009 (text only, on owner's word (ii) …c4ab73de, ADR-0053 d10); AR-NFR004-A; notes …d3394d72, …b1ead5bf | grugops/secnfr-ABC-228-catalog @ 0c54910e (plans/nfr-catalog.md: 6 cells, 1 _Updated line, closing section); .grugops/context/secnfr-ABC-228-catalog/notes/ (2) | none run (records only); readings cited from qe-ABC-228-ii …3fac6579 (G5, G8), …269152b2 (G6) | — (ABC-228 UAT signed by QE verdict …e39d190c) | — | ABC-228 Done; catalog follow-up closed; SEC-228-a to the owner (non-gating) |
