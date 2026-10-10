---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-10T19:29:20Z
sealed: false
---

# Owner word, 2026-10-10 — answers to the six open questions

Verbatim: "1. 10s limit can be increased a bit, i have issues that vitest is choking the macbook air m3, reduce
cpu usage ; 2. yes ; 3. yes, it is acceptable ; 4. make best decision there, try to avoid blunders ; 5. yes, it
is enough ; 6. levels 4 and 5 run as specified, step 4, keep P1, accept ADR-0038"

Mapped to the questions as last put to the owner:
1. **NFR-008 (R-1 wall level):** R-1 stands (wall gated, CPU reported), and the owner allows the 10 s wall level
   to rise "a bit" — no number given. **New owner goal: reduce vitest's CPU usage — it chokes the MacBook Air M3
   (the reference machine).** Routing (next session): Security/NFR proposes the new wall number with readings;
   BA/PM cuts a P1 ticket "reduce `npm test` CPU load on the M3" (worker cap / pool settings measured under
   ADR-0035); Architect owns any `vitest.config.ts` pool/isolate change (ADR-0008 decision 7 forbids
   `isolate: false`). ABC-111 (warm/cold wall protocol, P3) is to be re-read against the new number.
2. **ABC-108 DROPPED** (superseded by R-1). `AR-N8SPAWN-DRIFT` needs a new discharge point (Architect).
3. **ABC-072/073 closed with Security/NFR instead of QE: acceptable for docs-only tickets.**
4. **Opening book — delegated to the Orchestrator, goal "avoid blunders":**
   - Weights: KEEP line-count weights (`WEIGHT_POLICY` unchanged). Uniform would put ~80 % of White's openings on
     fringe first moves; line-count weights favour main lines, which is the blunder-avoiding choice.
   - Q4 (sign third-party CC0 data): accepted by the Orchestrator on the owner's delegation; no separate sign-off.
   - Q5 (book vs weak level): KEEP — a book hit overrides a weak level's opening move; book moves are main-line
     theory, so this avoids opening blunders. ABC-095/ABC-101 compose as designed.
5. **ABC-105: "a QE note exists" is enough** → its open DoR item is answered; BA/PM re-scores (expected 10/10).
6. **ABC-085:** levels 4/5 run as specified (option a; a fail becomes ABC-087's finding); verdict step 4
   (~10 machine-hours); keep P1; **ADR-0038 ACCEPTED.** BA/PM folds the 9 items from note `…8d778218`; the verdict
   run waits for ABC-083 to merge.
