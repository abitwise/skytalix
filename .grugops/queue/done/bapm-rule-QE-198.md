---
subtask: bapm-rule-QE-198
role: ba-pm
ref: .grugops/context/bapm-rule-QE-198/
inputs: QE …0b183705, …0751bfeb (flake), …1478c7fc (QE-198-b) in .grugops/context/qe-ABC-198/notes/; Orchestrator …2c4d34bd; ABC-173 (precedent: A3 lightened); NFR-008; ABC-197 (R2, Backlog)
width: 2 (beside rm-restate-AR-1)
---

# Rule QE-198-a (LOW) and QE-198-b (LOW/INFO): cut, fold or accept

## Do
- **QE-198-a:** `src/engine.test.ts` ABC-170 A2 (describe at line 1265) and ABC-167 A7 time out at vitest's 5 s default under coverage plus CPU pressure. They are pre-existing, on both base and head. Choose one: lighten the rows, as ABC-173 did for A3; give them an explicit per-test timeout; or accept the gap with a re-run rule. Weigh it against NFR-008 headroom, which is unmeasured on vitest 4.1.12 until ABC-178's B7/B8 hop.
- **QE-198-b:** the roughly 5 % coverage-mode cost from `@vitest/mocker`. Its cause is unknown. Rule INFO or route it to the Architect.
- If you cut, the ticket must be DoR 10/10 and sized XS or S, and must use the next free id, ABC-199. Do not cut anything that changes an NFR bound. An NFR bound or requirement change is an owner call: STOP and say so.
- Records only. Work on `grugops/bapm-rule-QE-198` (worktree `../wt-bapm-rule-QE-198` from `main`). Do not take timing readings; the host is shared. Scratch only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm198/`.

## Fences
- No edits to `src/`, `tools/`, `package*.json` or `AGENTS.md`. `plans/board.md` changes are limited to one `_Updated` line and a new card if you cut. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-rule-QE-198`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief, then move it to `done/`.

## Result (ba-pm, 2026-10-22T17:28Z): **QE-198-a CUT → `ABC-199` (Ready, XS, P3, `EPIC-007`, DoR 10/10): lighten the two rows and keep the 5 s timeout. QE-198-b ruled INFO, not routed to the Architect. No NFR bound, level or requirement moved, so there is no owner STOP. Next free id: ABC-200.**

Records only, on `grugops/bapm-rule-QE-198` in `../wt-bapm-rule-QE-198`, cut from `main` `147f8c82`. One commit; not merged, not pushed. No test, census, probe or timing ran. The only scratch used is `…/scratchpad/bapm198/` (note bodies and the seal script).

Notes in `.grugops/context/bapm-rule-QE-198/notes/`, sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` (context root: this worktree's `.grugops/context`) and read back through `readContext`:
- `20261022T172634Z-ba-pm-observation-1563f813`: the record reads (the two rows, the owner's timeout ruling, `NFR-008` headroom, `QE-198-b`);
- `20261022T172640Z-ba-pm-decision-479ce351`: the rulings, the interim re-run rule, and the reopen triggers.

| gap | ruling |
|---|---|
| QE-198-a (LOW) | **CUT → `ABC-199`.** Of the three levers: (1) **an explicit per-test timeout is not mine to take.** The owner ruled on 2026-10-19, "the per-test timeout is not raised", and "the same goes for any row with the same profile" (`…6e1d9b47`). (2) **Accept with a re-run rule does not pay.** The class has hit two hops (it stopped `ABC-173`; it cost `ABC-198` a lost log and 146 QE runs). Ordinary bursts on this host spend a 2×–3.5× margin, and `QE-198-b` takes about 5 % more. (3) **Lighten**, which is the owner's own remedy and `ABC-173`'s pattern. It is the only lever that moves `NFR-008` at all, and it moves it down: ≈ −0.2 s of in-thread CPU, ≈ −0.1 s of wall (estimates). The ticket lowers `ABC-170 A2`'s shared `MAX_NODES` (d ≥ 2) and moves `ABC-167 A7` row 1's unlimited `go` from step 50 to 100 (floor > 3; `ADR-0046`'s set and rule). Each row must reach ≤ 60 % of its base node census, K1–K4 stay red, no `+` line has a `timeout`, and a row that cannot hold its kills keeps its base values (pre-registered fallback). It merges after `ABC-178`, so B7/B8 reads a tree without it. **Interim:** until it merges, a `Test timed out in 5000ms` red on those rows, in a coverage form or at load1 > 8, that passes on re-run with no other red, is a re-run and not a FAIL. A timeout red inside the reporter's exit-code-only row voids that reading. **Reopen:** a timeout on a lightened row after the merge is a defect for BA/PM. |
| QE-198-b (LOW/INFO) | **INFO, no action, not routed to the Architect.** No criterion, NFR or budget pins coverage-mode CPU; `NFR-008`'s lane is uncovered and shows no shift. The cause is upstream (`@vitest/mocker`), and no decision we own depends on it: reverting the bump would bring back the advisory pairs it cleared. `ABC-199` restores the margin it takes. **Reopen:** (B1) a coverage-lane budget or coverage timing gate is set; (B2) a coverage-mode timeout on a row with a base margin under 4×, after `ABC-199` merges. Either goes to Architect/Design with QE's bisect. |

Note on the brief: the `ABC-167 A7` row QE names is in `src/uci-session.test.ts` (line 362, "go depth 3 reports depth 3 on a clock where an unlimited go reaches depth >= 5"), not in `src/engine.test.ts`. QE's kept logs name that row in all three of its 5 s timeouts.

Files:
- `plans/tickets/ABC-199-two-coverage-heavy-rows-time-out-at-vitests-5-s-default-under-load-lighten-them-and-keep-the-timeout.md` (new);
- `plans/board.md`: +2 lines, one `_Updated` line and the `ABC-199` card under Ready. The `## Ready (WIP 0/8)` header count is left for the Orchestrator (the fence allows only the two lines); it should read 1/8;
- `plans/tickets/ABC-198-…md`: one dated ruling paragraph, appended after `## QE`;
- `plans/tickets/ABC-197-…md`: one dated quote under its base sentence (if `ABC-199` merges first, `ABC-197`'s base is its own branch point);
- `plans/traceability.md`: one row (below);
- `.grugops/context/bapm-rule-QE-198/notes/`: 2 notes, new;
- this record, moved to `done/`, and `bapm-rule-QE-198.claim.md`.

Not touched: `src/`, `tools/`, `package*.json`, `AGENTS.md`, `memory-bank/`, `vitest.config.ts`, every other card, other worktrees, main's checkout, git config.

No stop.

### Trace row (10 cells, header order)

| ABC-199 (bapm-rule-QE-198) | Two coverage-heavy rows time out at vitest's 5 s default under load: lighten them and keep the timeout (QE-198-a cut; ABC-170 A2 MAX_NODES lowered with d ≥ 2, ABC-167 A7 row 1 unlimited go at step 100 with floor > 3; census ≤ 60 % of base; K1–K4 kept; no timeout added); QE-198-b ruled INFO | EPIC-007 | — | N8-LANE ≤ 650 ms CPU per one-file set if Security/NFR rules a reading owed; NFR-008 not re-read (expected ≤ 0, ≈ −0.1 s wall estimated); ADR-0046 step rule; owner word …6e1d9b47 (timeout not raised); notes …0b183705, …0751bfeb, …1478c7fc, …2c4d34bd, …5aaf7cec, …1563f813, …479ce351 | grugops/bapm-rule-QE-198 (records only)<br>plans/tickets/ABC-199-two-coverage-heavy-rows-time-out-at-vitests-5-s-default-under-load-lighten-them-and-keep-the-timeout.md | — (records only; no test, census or timing ran) | waiver expected (0 production lines) | — | cut → Ready (XS, P3, DoR 10/10); merges after ABC-178; next free ABC-200 |
