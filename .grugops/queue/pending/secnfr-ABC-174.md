---
subtask: secnfr-ABC-174
role: security-nfr
ticket: ABC-174
branch: grugops/ABC-174 @ be6a5599 (from bd480c99)
ref: .grugops/context/secnfr-ABC-174/
---

# Security/NFR gate on ABC-174 (lean)

## Read first
Ticket page `plans/tickets/ABC-174-*.md` (§ Security / NFR triggers, § Owed), ADR-0045, `plans/nfr-catalog.md`
(NFR-004, NFR-005, NFR-008, NFR-010, R-173-1/-2), the SE done file `ticket-to-pr-ABC-174.md`, and the QE done file
`qe-ABC-174.md` with its notes under `.grugops/context/qe-ABC-174/` (timing `…5d9a0f63`, verdict `…e7b3c218`).

## Decide
1. **NFR-004** clauses A/B and **NFR-005** referent at `be6a5599` (from the data and QE's A6 readings; ABC-087 A5 max 3007 ms on 30/30).
2. **QE-174-b (MEDIUM): full-lane `npm test` 10.01 s median vs NFR-008's 10 s bar** (R 0.28 s, CPU 27.73 s, load1 3.10–6.01; this ticket's own N8-LANE charge MET at +0.115 s CPU / +0.03 s wall). Rule: attributable to this ticket or not; blocking or accepted risk (name it `R-174-*`); whether this discharges `R-173-1`; whether QE's new spread should replace the pre-cap noise floor. If a ruling needs the owner, say so plainly with the options.
3. **Catalog lines owed at this gate:** edit the `NFR-004` lines in `plans/nfr-catalog.md` that name the old table (`AR-NFR004-A` "level 3 = `DEFAULT_BUDGET_MS`", and the line near `:1364`) → the level-5 default. Edit only those lines; hash every other row before/after and report byte-identical.
4. R-167-1 grep (already empty per SE) — confirm.

## Timing
Take no new timing unless you need it; if so, only in a foreground-verified quiet window (180 s, no foreign vitest, no `oeselg-labs/platform` process, no other hop — a `scribe-ABC-174` hop may run briefly). Else OWED; never estimate.

## Fences
- Catalog edit on **main's** working tree, `plans/nfr-catalog.md` only; leave it uncommitted for the Orchestrator.
- Do not touch: `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-174`, any process you did not start. Never push, merge or self-sign.

## Publish
Notes under `ref:` (a `kind: decision` by `security-nfr`); sanctioned writer if available, else hand-authored and say so.
`.grugops/queue/done/secnfr-ABC-174.md` (brief + `## Result`) and `.claim.md`, uncommitted: verdict (PASS / PASS_WITH_RISKS / FAIL), required fixes, accepted risks, catalog diff summary, trace row.
