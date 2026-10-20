---
subtask: bapm-cut-ABC-177
role: ba-pm
tickets: [ABC-177]
ref: .grugops/context/bapm-cut-ABC-177/
---

# BA/PM: ADR-0046 accepted → cut ABC-177 (records only)

The owner said "accept" to ADR-0046 on 2026-10-20 (note in `.grugops/context/wave-2026-09-25/`, owner-word ADR-0046).

## Read first
- `memory-bank/50-decisions/ADR-0046-*.md`
- The Architect's decision note `.grugops/context/arch-lane-under-10s/notes/…58fa35f0.md`, which holds the scope and draft criteria, and its probe tables.
- `plans/nfr-catalog.md`: NFR-008 and the R-174-1 block.
- `.grugops/queue/done/arch-lane-under-10s.md`.

## Do
1. Set ADR-0046's status to **ACCEPTED**, with a dated line citing the owner's word. Make no other edit to the ADR.
2. Cut **ABC-177**: "`npm test` back under NFR-008's 10 s (ADR-0046)". It is test-only, touches `src/uci-session.test.ts` only, and is size S, priority P1, under EPIC-004 or the right epic.
   - Write testable acceptance criteria that cover:
     - the A6 dialogue merge;
     - coarsest-step moves for rows whose bounds read no step;
     - a row count of 126;
     - no assertion bound or title changed;
     - step-pinned rows kept byte-identical;
     - the same mutant kill set per changed row;
     - the node-count check;
     - N8-LANE on the one-file set;
     - a full-lane base-vs-head twin, each arm with its own `npm ci`, in a quiet window with power recorded per run;
     - the target ≤ 9.2 s;
     - the escalation path: over 9.2 s → O3 ruling; over 10 s → owner.
   - Rule on adding **1000** to the allowed step set, and say why.
   - Score the ticket against the DoR (`agent-factory/checklists/definition-of-ready.md` under the kit).
3. **Open question for the owner:** whether NFR-008 readings require AC power is not answered. Write it on the page as an owner question and do not decide it. If the DoR needs it, say so.

## Fences
- Edit only ADR-0046's status line, the new ticket page under `plans/tickets/`, and your notes. Leave them uncommitted.
- No `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or `nfr-catalog.md`.
- No lane runs and no timing. Never push or merge.

## Publish
- Notes under `ref:`, including a `kind: decision`. Use the sanctioned writer if available.
- `.grugops/queue/done/bapm-cut-ABC-177.md` (brief + `## Result` with the DoR score and a trace row) and `.claim.md`, uncommitted.
