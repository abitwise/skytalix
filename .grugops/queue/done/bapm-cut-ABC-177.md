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

## Result

**done_at 2026-10-20T18:01Z. CUT. Records only.**
- No lane was run and nothing was timed. Nothing was committed, pushed or merged.
- `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` and `plans/nfr-catalog.md` are untouched.
- `src/uci-session.test.ts`, `src/levels.ts` and `src/virtual-clock.ts` were read for line ranges and budgets only.

### 1. `ADR-0046`: ACCEPTED
§ Status gains one dated paragraph: **ACCEPTED** 2026-10-20 by Olger Oeselg, verbatim *"accept"* (`…9fc95cac`), a
transcription, not a stamp. It also says that where the proposed text below calls the ticket uncut and the step word
owed, this line wins. No other byte of the ADR moved.

### 2. `ABC-177` cut
`plans/tickets/ABC-177-npm-test-back-under-nfr-008s-10-s-adr-0046.md`: Backlog, **S**, **P1**, **EPIC-007** (every
changed row is an `ABC-167` / `ABC-171` row).
- **Scope:** one file, 15 rows in 8 change units, by line range at `a0b145dc`.
  - U1: the A6 fold rows, class H.
  - U2–U5: A6-e1, j1, e4 and e5, class H.
  - U6: A7-i5 and i6, class H.
  - U7: the six dropped-token rows, class L.
  - U8: `ABC-171` A7 "two sessions…", class H′.
  - A unit is one call site, so a loop's rows move together.
- **Criteria:**
  - A1: the fold. One `talk` call on `[position, go infinite, R, R]`, plus three named facts.
  - A2: the coarsest admitted step that keeps parity, never finer than today.
  - A3: 126 tests at base and tip, all passing, with identical sorted names. The lane total is equal at base and tip.
  - A4: outside U1, the diff changes step literals only. No `expect`, title, budget or bound changes.
  - A5: hunks only inside U1–U8, and `git diff --name-only` is exactly the one file.
  - A6: the same killed mutant ids per changed row, against a list frozen before any head run.
  - A7: the node census. Strictly fewer nodes on each changed row.
  - A8: `N8-LANE` on the ONE-FILE set, flag 400, B/T/H, `lane174.mjs`; ≤ 650 ms CPU.
  - A9: a full-lane B/T + H/H2 twin. Each of the four arms gets its own `npm ci`. Quiet window by `window.mjs`,
    load1 ≤ 8, and **power recorded per scored run**. `R-173-1` and `R-173-2` are not read.
  - A10: the readout. The `NFR-008` state, H−B with intervals, and the twin R per pair.
  - A11: **≤ 9.2 s**. If it reads > 9.2 s, `NFR-008` is MET and O3 goes to BA/PM under a **new** ticket. If it reads
    > 10 s, it goes to the owner and the ticket holds.
  - A12: gates green, 0 skips, and the `ABC-167` A11 M4 sweep still kills M4.

### 3. Ruling on step 1 000
**Admitted for classes H and L (U1–U7). Not for H′ (U8).** There are three conditions:
1. kill-set parity picks the step, never finer than today;
2. 1 000 never turns a search of 2 or more clock-check intervals into a one-interval search;
3. the mutant list is frozen first.

**Why:**
- On H and L no bound can see the step, so parity is the only guard.
- What a coarse step loses is search, and parity counts only named mutants.
- U8 runs on level 1's 100 ms budget, which is 1 interval at 1 000. It keeps the owner-accepted {10, 100}.
- The set closes at 1 000, because 10 000 exceeds every governing budget in the file.

### 4. DoR: **10 / 10**
- OQ-177-1 (AC power) is a dependency of the `A9` twin hop, not a `Ready` blocker. The build, census, parity and
  `N8-LANE` do not depend on it.
- **Recommended: `Backlog → Ready`.** Column moves are the Orchestrator's.

### Owner question
- **OQ-177-1.** Must `NFR-008` readings be taken on AC power (`SEC-174-2`)?
  - **Open, and not decided here.** The word "accept" answered `ADR-0046` only.
  - Architect/Design recommends AC, forward-only.
  - **Ask before QE dispatches `A9`.** A battery reading taken first would need re-taking if he rules AC-only.

### Trace row (for the Orchestrator to append; columns: Ticket | Title | Epic | Feature | NFRs | Code | Tests | UAT | Release | Status)
| ABC-177 | `npm test` back under NFR-008's 10 s (ADR-0046): fold the A6 prefix dialogues; coarsest kill-set-preserving step in {1, 10, 100, 1 000} for class H/L units (1 000 not for H′). Owner word `…9fc95cac`. Cut by BA/PM, subtask `bapm-cut-ABC-177` | EPIC-007 | — | `NFR-008` (≤ 10 s at load1 ≤ 8; `R-174-1` discharge), `N8-LANE` ≤ 650 ms CPU (ONE-FILE), design target ≤ 9.2 s (`ADR-0046` D4) | `src/uci-session.test.ts` only (U1–U8, 15 rows); 0 production lines | A1 fold, A2 steps, A3 126 rows + identical names, A4/A5 diff shape, A6 kill-set parity, A7 node census, A8 `N8-LANE`, A9/A10 full-lane twin with own `npm ci` and power per run, A11 ≤ 9.2 s, A12 gates + M4 sweep | standing waiver if 0 production lines (measured at delivery) | — | Backlog (DoR 10/10; OQ-177-1 owed before `A9`) |

### Published
- `.grugops/context/bapm-cut-ABC-177/notes/20261020T180000Z-ba-pm-decision-abc177-cut-step-1000-ruled-for-h-and-l-not-h-prime-e7b3c210.md`
  (`kind: decision`)
- `.grugops/context/bapm-cut-ABC-177/notes/20261020T180100Z-ba-pm-artifact-ref-abc177-ticket-and-adr0046-status-4d81a9f6.md`
  (`kind: artifact-ref`)
- Both are hand-authored and unsealed, because the sanctioned writer is absent.
