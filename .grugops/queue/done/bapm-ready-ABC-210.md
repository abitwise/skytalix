---
subtask: bapm-ready-ABC-210
role: ba-pm
ticket: plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
ref: .grugops/context/bapm-ready-ABC-210/
branch: new grugops/bapm-ready-ABC-210 from main, worktree ../wt-bapm-ready-ABC-210
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# ABC-210: Ready trigger met (ABC-209 closed) — DoR re-score; ABC-208 page front-matter sync

## Do
- Read Orchestrator `orch-2026-10-27c` (this hop's routing note) and BA/PM `bapm-s1-ABC-209/…492fb6ce`. Use `bapm-ready-ABC-209` (`…955d0031`) as the model.
- **Re-score the ABC-210 page's DoR** against the kit's `checklists/definition-of-ready.md` at main's tip. Re-check every `file:line` cite: ABC-208 moved `search.ts`/`engine.ts`, and ABC-209 never merged.
- **Carry the epic's reading rules onto the page as dated lines:**
  - D base = its own merge-base on main.
  - G6 by the EPIC-008 rule, with "≥ base" graded (rule A, the owner's word `…2ae5fc12`).
  - This ticket's own "≥ base − 1" clause: is it still consistent with rule A? Say so, and don't decide it.
  - One reading, final (`…4c3f7639`).
  - A frozen-clock d7/d8 pre-check.
  - The reading runs ALONE.
- **The ADR question:** the page names a reversal of `quiescence.ts:21-24` (a new ADR plus an ADR-0026 door), which goes to the owner. Say whether that is still needed as written. Don't decide it; flag it for Architect/Design's design hop.
- **ABC-208 page (LOW):** sync the front-matter `status`/`column` to Done (merged `b5c67ab7`). Nothing else on that page.
- Put the board card lines in your Result: Backlog → Ready if DoR is 10/10, otherwise say what is missing. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-ready-ABC-210`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-27T03:36Z): **ABC-210 DoR 10 of 10 → Ready. In Design comes first. An ADR is still needed, but "reverses `ABC-079`'s recorded decision" fits form (b) only; flagged for Architect/Design, not decided. The page's "≥ base − 1" `G6` clause is consistent with rule A on the graded axis and silent on the threshold; flagged for the Orchestrator, not decided. ABC-208 page front-matter synced to Done.**

Records only. Branch `grugops/bapm-ready-ABC-210` in `../wt-bapm-ready-ABC-210`, cut from `main` `3050d2b4`. One
commit, **`01b0c44c`**, not merged and not pushed. No npm, vitest, build or timing was run, and `src/` was not edited.
Scratch: `<scratchpad>/bapm210/` (the note bodies and the seal script).

Notes are in `.grugops/context/bapm-ready-ABC-210/notes/`. They were sealed with grugops 2.1.0 `context-io.js`
`admitAndAppend` (context root: the worktree's `.grugops/context`, `at` from `date -u`). `readContext` read back
2 of 2:
- `20261027T033612Z-ba-pm-decision-133465f3`: the call;
- `20261027T033612Z-ba-pm-observation-3bbfaa07`: the re-reads at `3050d2b4`.

| # | DoR item | verdict at `3050d2b4` |
|---|---|---|
| 1 | problem clear | ✅ unchanged. The cite `src/quiescence.ts:21-24` holds, byte-equal to the cut `55a8f4ef` |
| 2 | scope and out-of-scope clear | ✅ unchanged. Dated Scope 5: the sites after null move (`quiesce` at `src/search.ts:356`/`src/engine.ts:263`; `QUIESCENCE_MAX_PLY` `src/quiescence.ts:76`; check-reading predicates `src/search.ts:278-279`, `:305`; `KEY_ARRAY_CAPACITY` `:121`) |
| 3 | INVEST-shaped | ✅ re-scored: independent now that `ABC-209` is closed under S1 and nothing of it is on `main` |
| 4 | acceptance testable and measurable | ✅ re-scored. Criteria unchanged, plus dated lines: `G1` class B (`ADR-0034` d2); `G6` by the `EPIC-008` rule, graded by rule A; the flagged "≥ base − 1" question; `A5` one reading, final |
| 5 | dependencies known | ✅ re-scored: `ABC-209` closed (S1, `1c5fd14d`), `ABC-204` Done. D base = own merge-base on `main`, which carries `ABC-208` (`b5c67ab7`) and not `ABC-209` |
| 6 | security/NFR triggers with a measurable target | ✅ unchanged: `NFR-005` depth-6 floor, unmoved |
| 7 | test notes present | ✅ re-scored: four (3: frozen-clock d7/d8 pre-check; 4: ALONE, `QE-207-g` and `QE-209-f` open) |
| 8 | size assigned | ✅ `M` |
| 9 | priority assigned | ✅ `P3` |
| 10 | no major unresolved blocker | ✅ re-scored: the sequence hold is gone. The ADR is In Design's work; the owner's acceptance gates the ALONE reading and the merge. "≥ base − 1" is flagged for routing. `QE-207-g`/`QE-209-f` are the Orchestrator's. None blocks the pull |

- **Cites after `ABC-208`:** the page's only `file:line` cite (`src/quiescence.ts:21-24`, in the `adr:` line and the
  banner) holds. The file's one change since the cut is `ABC-206` `5ff2a129`, below the header. No commit since
  `b5c67ab7` touches `src/`, `data/` or `tools/`. The page cited no `search.ts`/`engine.ts` lines; Scope 5 now records
  the sites the design will touch, at the tip.
- **The reading rules, carried as dated lines:**
  - D base: own merge-base on `main` (§ Dependencies);
  - `G6` by the `EPIC-008` rule (`…8e51ba1e`), "≥ base" graded pass/fail (rule A, `…2ae5fc12` item 2). This ticket
    changes values, so `G6` reads the change (unlike `ABC-209`);
  - one reading, final (`…4c3f7639`), D budget 1 500 ms (`A5`);
  - frozen-clock d7/d8 pre-check (test note 3); its stop reads against the `G6` bar in force for this ticket;
  - the reading runs ALONE (test note 4).
- **"≥ base − 1" against rule A: flagged, not decided.**
  - **Consistent** on the axis the owner answered: the clause stays a graded pass/fail rule, and a miss is NOT MET.
  - **Silent** on the threshold: the clause was cut 2026-10-23, before rule A. `EPIC-008`'s `G6` row reads "≥ the base
    build's" with "No bound or reading rule moves", and `M3` reads `G6` green on `main` at close.
  - **For the Orchestrator:** whether a per-ticket − 1 stays BA/PM's ruling inside the epic or is a gate-bar change
    that is the owner's (`…5aaf7cec` item 3). The design probe's d7/d8 counts show whether it is ever exercised; if
    head is predicted to meet "≥ base", it is moot. Until answered, the page reads as written.
- **The ADR: still needed. "As written" fits form (b) only.**
  - **Form (b)** (checks in the first quiescence ply) reverses a fence held at `src/quiescence.ts:21-24` and in
    accepted `ADR-0024` decision 4 (owner 2026-09-19). Changing an accepted ADR is the owner's (`…5aaf7cec` item 3).
  - **Form (a)** (a full-width check extension) is named by neither fence, so it reverses nothing recorded. It still
    needs a new ADR as a new value-changing heuristic (`ADR-0026` d10; `ADR-0050` precedent), also the owner's.
  - The `ADR-0026` door fits inside decision 10; no door amendment. The text is reported when it lands
    (`…7feb0553` item 2).
  - **Flagged for Architect/Design's design hop:** which form(s), and so which ADR shape; the page's `adr:` line (names
    only (b)); the status at the reading and at merge (reading (b), `…d25ab770`, is the Orchestrator's routing). In
    Design also carries: the cap inside `KEY_ARRAY_CAPACITY` (`ADR-0025` d7); the meeting with `lateMoveReduction`
    (`ADR-0026` d6) and `nullMoveReduction` (`ADR-0050` d6); the door set incl. `ABC-208`'s pair; the oracle bar (a
    change to `ADR-0026` d9's 118 cp is the owner's); the d7/d8 counts.
- **ABC-208 page (LOW):** front-matter `status: done`, `column: Done` (merged `b5c67ab7`). Nothing else on the page.

Files on the branch:
- `plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md` (+90/−2);
- `plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md` (+2/−2);
- 2 notes (+102, +89).

Not touched: `src/`, `memory-bank/`, EPIC-008, `plans/board.md`, `plans/traceability.md`, the config. In main's
checkout, only this queue record and its claim moved, uncommitted, for the Orchestrator.

### Board card line (for the Orchestrator; ABC-210 Backlog → Ready; no other column moves; Ready 0/8 → 1/8)

- **ABC-210, Backlog → Ready**, appended to its card: `**2026-10-27: DoR 10/10 → Ready (bapm-ready-ABC-210, …133465f3): trigger met (ABC-209 closed unmerged under S1, …492fb6ce at 1c5fd14d; ABC-204 Done); D base = own merge-base on main (carries ABC-208 b5c67ab7, not ABC-209); G1 class B (ADR-0034 d2); G6 by the EPIC-008 rule, graded (rule A …2ae5fc12); page's "≥ base − 1" flagged vs rule A (graded: consistent; threshold: owner's word silent) → Orchestrator routes; one reading, final (…4c3f7639), D 1 500 ms; frozen-clock d7/d8 pre-check; reading ALONE (QE-207-g, QE-209-f open). In Design first: ADR still needed — form (b) reverses quiescence.ts:21-24 + ADR-0024 d4; form (a) a new ADR (ADR-0026 d10) → owner when written; form, adr: line, status at reading/merge = Architect/Design + Orchestrator routing (precedent …d25ab770).**`
- **ABC-208** (already Done on the board): no move. Its page front-matter now agrees (`done`/`Done`).

### Trace row (10 cells, header order)

| ABC-210 (bapm-ready-ABC-210) | DoR re-scored 10/10 → Ready: trigger met (ABC-209 closed under S1 at 1c5fd14d; ABC-204 Done); criteria unchanged, dated reading lines (G1 class B under ADR-0034 d2; EPIC-008 G6 rule graded by rule A; "≥ base − 1" flagged vs rule A; A5 one reading, final under …4c3f7639; pre-check and ALONE test notes); In Design first (ADR still needed; form (b) reverses ADR-0024 d4, form (a) new ADR) | EPIC-008 | check extension and/or checks in the first quiescence ply, ADR-0026 door, stated cap (not built) | NFR-005 depth ≥ 6 floor unmoved; A3 ≤ 1.5 × base nodes at d6; NFR-004/008 re-read; no bound moved; notes …133465f3, …3bbfaa07 | grugops/bapm-ready-ABC-210 @ 01b0c44c (records only) | — (records only) | — (UAT owed at delivery; QE signs) | Architect/Design: design hop (form, ADR shape, adr: line → owner when written; status flagged); Orchestrator: board, trace, In Design routing, the "≥ base − 1" question | Backlog → Ready, 2026-10-27 |
