---
subtask: bapm-rule-QE-176
role: ba-pm
tickets: [ABC-176]
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-176/
width: 2 (beside security-nfr-QE-191-a)
---

# BA/PM (records only): rule QE-176-a/-b (LOW) and QE-176-c/-d (INFO) from ABC-176's QE gate. ABC-176 is merged; this gates nothing

## Read first
- QE verdict and gap register `.grugops/context/qe-ABC-176/notes/20261021T164420Z-qe-e2e-decision-75bc28e0.md`, mutants `…fbdf5a60`, ordering `…c9b3023e`; the `## QE` section on ABC-176's page.
- SE residuals `.grugops/context/ticket-to-pr-ABC-176/notes/20261021T162606Z-software-engineer-observation-74594565.md`; the ABC-176 page; `tools/grugops/heap-guard.js` and `result-file-reporter.js` headers.

## Do
- For each of QE-176-a (no test pins `setup` passing `process.stdout`; the call-site stderr mutant survives the suite), QE-176-b (line-before-JSON order rests on vitest internals; nothing re-runs the capture on a vitest upgrade), QE-176-c, QE-176-d: rule **cut** (a new ticket, sized, DoR-scored, measured at base where you can), **fold** into an existing ticket, or **accept** (with reason, owner, trigger). Prefer one small ticket if a and b share a home.
- QE-176-d: a dated erratum line on ABC-176's page (budget is 18,432 per ABC-187; A2 feasibility settled by SE and QE). Do not rewrite history on the page. Do not edit the `bapm-cut-ABC-176` notes; say what you'd do about their `sealed: false` state.
- One `_Updated:` line at the top of `plans/board.md`; any new card in its column. Next free id: ABC-192.

## Fences
- Only `plans/` (board, ABC-176 page, any new ticket page) and your notes. No `src/`, `tools/`, `AGENTS.md`, `memory-bank/`, branches or worktrees. Commit nothing. Another agent (Security/NFR) writes notes under `.grugops/context/security-nfr-QE-191-a/`; touch nothing of theirs.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-176`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/bapm-rule-QE-176.md` + `.claim.md`, main's tree, uncommitted).

## Result (ba-pm, 2026-10-21T16:55:30Z): **QE-176-a and QE-176-b are CUT into one ticket, `ABC-192` (Ready, XS, P3, DoR 10/10). QE-176-c is ACCEPTED. QE-176-d is a dated erratum on ABC-176's page. Ready 0/8 → 1/8. Next free id: ABC-193.**

Records only, uncommitted on `main`. `main` was `03ac8bc4` at the start and `3e899a52` at the finish; the one commit
between them touched only `plans/traceability.md`, so every reading holds. The notes are in
`.grugops/context/bapm-rule-QE-176/notes/`. They were sealed with the grugops 2.1.0 `context-io.js` `admitAndAppend`,
with the context root passed explicitly as this checkout's `.grugops/context`, and all four read back through `readContext`:
- `20261021T165442Z-ba-pm-decision-73efba41`: the ruling per gap, and the sealed pointer to the two unsealed `bapm-cut-ABC-176` notes;
- `20261021T165442Z-ba-pm-observation-af4186af`: the cut readings at `03ac8bc4`;
- `20261021T165442Z-ba-pm-failed-attempt-ef39afc9`: the in-process `vi.doMock` route does not reach `heap-guard.js`;
- `20261021T165451Z-ba-pm-observation-ae67fdf1`: the files touched. It was first tried as an `artifact-ref`; the writer
  refused it for the lack of `sha`/`gate_run`/`content_hash`, which a records-only hop does not have, so it was
  re-recorded honestly as an observation.

| gap | ruling |
|---|---|
| QE-176-a (LOW) | **CUT → ABC-192 A1.** One parser-view row: `setup`'s one `guard(…)` call passes `process.stdout`. Prototyped at base: base ok, M4 (`process.stderr`) fault, M4b (a no-op stream) fault. The spawned row is not taken (it would make `N8_SPAWN` 29 for a LOW gap). The in-process route failed. |
| QE-176-b (LOW) | **CUT → ABC-192 A2** (same file). A row pins installed `vitest` 4.1.11; its red message is the bump re-run list (capture arm on both shapes; the 7 reporter rows; RISK-ABC173-STATE and RISK-ABC143-01; re-pin with reason). Scope cut: no header edit, because changing `heap-guard.js` triggers the reporter's 7-run re-run and still fires nothing on a bump. |
| QE-176-c (INFO) | **ACCEPT** (`ABC-149` design: the hop-run rows killed M2a/M3). Owner: QE/E2E, on the header's trigger. Reopen: a regression the 7 rows catch reaches `main`, or a hop changes those files with no 7-row comparison. |
| QE-176-d (INFO) | **ERRATUM** on ABC-176 (one dated block, cut text unchanged): A5 budget 18,432 (ABC-187); A2 feasible (SE `…d7694ffa`, QE `…be90087e`); the unsealed notes are pointed to; a/b → ABC-192, c accepted. The `sealed: false` notes are not edited or re-sealed (re-sealing would forge when they were sealed); `…73efba41` is their sealed pointer. |

Files: `plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md` (new),
`plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md` (+8 lines, erratum),
`plans/board.md` (one `_Updated:` line; the ABC-192 card in Ready, WIP 1/8). Not touched: `src/`, `tools/`, `AGENTS.md`,
`memory-bank/`, `plans/traceability.md` (the trace row is below, for the Orchestrator), and `.grugops/context/security-nfr-QE-191-a/`.

### Trace row (10 cells, header order)

| ABC-176 (BA/PM QE-176 ruling) | ruled QE-176-a/-b CUT into ABC-192 (one parser-view row pins setup's guard(…, process.stdout); one row pins installed vitest 4.1.11 and its red names the bump re-run list), QE-176-c ACCEPTED (ABC-149 design; owner QE; reopen trigger named), QE-176-d dated erratum on ABC-176 (A5 18,432 per ABC-187; A2 feasible; unsealed bapm-cut-ABC-176 notes given a sealed pointer) | — | — | QE-176-a, QE-176-b, QE-176-c, QE-176-d; SEC-173-1; RISK-ABC173-STATE; RISK-ABC143-01; ABC-149; ABC-187; N8_SPAWN 28; notes …75bc28e0, …fbdf5a60, …c9b3023e, …73efba41, …af4186af, …ef39afc9, …ae67fdf1 | main @ 03ac8bc4 → 3e899a52 (uncommitted, records only)<br>plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md, plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md, plans/board.md | — (records only; prototypes at 03ac8bc4 on scratch copies: parser view base ok / M4 fault / M4b fault; Node child stdout 79/0/0 B; vitest 4.1.11 locked and installed) | — (ABC-192 expects the waiver: 0 production lines) | — | ABC-192 cut → Ready (XS, P3, DoR 10/10; Ready 0/8 → 1/8); ABC-176 stays Done |
