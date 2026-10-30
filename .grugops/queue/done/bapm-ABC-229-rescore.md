---
subtask: bapm-ABC-229-rescore
role: ba-pm
ticket: ABC-229
ref: .grugops/context/bapm-ABC-229-rescore/
branch: new grugops/bapm-ABC-229-rescore from main (worktree .claude/worktrees/bapm-ABC-229-rescore)
width: records only, no CPU
---
# BA/PM: ABC-229 re-score after ABC-228; ADR-0044 D4.2 stale default
## Do
1. ABC-229: its waits (ADR-0053 accepted; ABC-228 merged e42b637b with (ii), level 5 = 4 000 ms) are met. Re-score DoR,
   fold what (ii) changes in its rows (R smoke at 4 000 ms, the unpooled ledger, any 3 000 ms reference), and say if it
   is Ready. Note any shared-file ordering with ABC-241/ABC-220/ABC-243.
2. ADR-0044 D4.2 still says "a bare `go` at the default level is therefore 3 000 ms": add a dated fold line (4 000 ms
   since ABC-228, ADR-0053 d10, ADR-0045 FOLDED). Pointer only, no decision change.
## Fences
Records only (the ABC-229 page, ADR-0044, EPIC-010 table row if needed). No src/, tools/, data/. No board edits. Never push/force/amend/rebase/merge into main. No host paths.
## Publish
Sealed notes (task `bapm-ABC-229-rescore`), commit on the branch, `## Result` + trace row here, brief + claim to done/.

## Result

*BA/PM, 2026-10-30, task `bapm-ABC-229-rescore`. Records only, at `main` `ee3c7694`. Branch `grugops/bapm-ABC-229-rescore` @ `45982044` (records); this brief move sits on top.*

- **`ABC-229`: DoR 9/10 → 10/10, Ready.**
  - **The wait is met.** `ABC-228` merged at `e42b637b` under (ii): level 5 is 4 000 ms (`ADR-0053` d10, `ADR-0045` FOLDED). Rows 5 and 10 are ✅. Front matter is `ready` / `Ready`. The board move is the Orchestrator's.
  - **Folded from (ii), as dated marks:**
    - `A3`/`A4`: `G6` runs both sides at 4 000 ms. `G5` reads ≤ 4 s and the 5 s ceiling. `G9` reads against `main`'s (ii) values, with no waiver.
    - `A5`: R plays at 4 000 ms through the `rating.ts` literal already on `main`, so there is no `tools/` change. The R row is recorded and not pooled: there is no pooled score and no flag until milestone 1's batch sets the 4 000 ms reference. `G11` is reported at 4 s.
    - § NFR triggers: `NFR-005`'s referent is 4 s, and `NFR-004`'s default bar is ≤ 4 s. `G8` headroom was 0.39 s at `ABC-228`'s gate.
    - No 3 000 ms reference applies.
  - **A `G6` miss is not pre-answered.** OQ-228-1's (ii) is spent, and `ADR-0053` names no step past 4 000 ms. On a miss the SE stops, and the miss goes to the owner, as `A9`'s above-133 % stop did. None is forecast: the reference reads 1.019× / 1.000×.
  - **Test note 1 corrected.** No quiet-promotion `Q-SET` row was ever frozen; `ABC-228`'s freeze, `…06163ef3`, held in-check and mate rows only. QE freezes ≥ 6 of d9's kinds before the build. This is a pre-build step, not a blocker.
  - **Clarified:** `ADR-0053` d5–d9's `ABC-229` rows bind where the page is shorter: the one-pass spy, the d5 drift ≥ 95 % / ≤ 12 cp, the re-pointed oracle rows and the ladder.
- **Ordering (§ Dependencies). The predicted file set is `UNKNOWN - verify` until the SE greps.**
  - `ABC-241`: no production file is shared. Both edit `src/engine.test.ts`, but in different `describe`s (about `:907` against about `:500`), so the second to merge rebases. `ABC-241` is value-changing, so `ABC-229`'s smokes are read on a `main` that carries it, or are read again.
  - `ABC-220`: no shared file (it touches `src/uci-session.ts` and its test only). Whether it stales a level-5 smoke is the Orchestrator's ruling.
  - `ABC-243`: no shared file predicted. `src/transposition.test.ts` becomes shared only if a shipped-path pin moves.
  - The host: `ABC-229`'s QE reads run ALONE, behind `qe-ABC-241`.
- **`ADR-0044` D4.2: dated fold line.** It reads: "4 000 ms since `ABC-228`'s merge (`e42b637b`). Under `ADR-0053` d10, reading (ii), `LEVELS[5]` = `{ 4000, 0 }` and `DEFAULT_BUDGET_MS` = 4 000. `ADR-0045` is FOLDED in place, and that fold records D11. The rule and the code line are unchanged. A pointer only, with no decision change here."
- **`EPIC-010`:** row 5 now reads Ready 10/10, with its order-only note. A dated header block was added. Nothing else moved.
- **Notes** (sealed via the plugin's `admitAndAppend`, contextRoot = this worktree): `20261030T122346Z-ba-pm-decision-32277e7f`, `20261030T122346Z-ba-pm-observation-a2aef658`.
- **Seen, not acted on:**
  - `ADR-0044` D11's 2026-10-19 fold still says "at 3 s". `ADR-0045`'s fold records D11, but D11 itself has no dated mark.
  - The board's `ABC-229` line is stale (Orchestrator).
- **Checks:** `reference-check` No findings (3 files). The host-path scan found 0 hits. `git diff --check` is clean.
- **Not touched:** `src/`, `tools/`, `data/`, the board. Nothing was pushed or merged. The main checkout's `claimed/` copies are untouched; the tracked done/ copies are on this branch.

### Trace row (10 cells, header order)

| ABC-229 (re-score) | ABC-229 DoR 9/10 → 10/10, Ready: ABC-228 merged e42b637b under (ii); folded G5/G6 at 4 000 ms, R at 4 000 ms recorded not pooled, G9 no waiver, G6 miss → owner (OQ-228-1 spent), Q-SET promotion rows owed by QE pre-build; ADR-0044 D4.2 dated pointer (4 000 ms); ordering vs ABC-241/220/243 named | EPIC-010 | — | NFR-004 (≤ 4 s default, 5 s ceiling), NFR-005 (referent 4 s, floor 6), NFR-008 (G8 headroom 0.39 s); ADR-0053 d5–d10, ADR-0045 fold, ADR-0044 D4.2; notes …32277e7f, …a2aef658 | grugops/bapm-ABC-229-rescore @ 45982044 (records only): ABC-229, ADR-0044, EPIC-010, .grugops/context/bapm-ABC-229-rescore/notes/ (2) | none run (records only); reference-check No findings | — (UAT owed at build; QE verdict signs) | — | ABC-229 Ready 10/10 (board move: Orchestrator) |
