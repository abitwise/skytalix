---
subtask: bapm-ABC-242-225-owner
role: ba-pm
ticket: ABC-242, ABC-225
ref: .grugops/context/bapm-ABC-242-225-owner/
branch: new grugops/bapm-ABC-242-225-owner from main 8a5984c7
width: records only
---
# BA/PM: fold the owner's ABC-242 accept and ABC-225 width-1 approval
Owner words verbatim in `orch-2026-10-30a/…65848126`.
- ABC-242: record the accept; fix A8 per the Architect (`…f3b8d750`/ticket header: the ladder lane hands no prior keys → an identity
  row, not a check of the change; A1–A5 are the checks); fold the Architect's recommended extra A1 fixture (third-occurrence move
  last in legalMoves order); re-score DoR → Ready if 10/10. Note it shares src/levels.ts / tests with nothing in flight except ABC-243 (uci-session.test.ts, cli.test.ts for A4).
- ABC-225: unblock — A5 runs at `--concurrency 1` by the owner's word (resolves the thermal block); state the width-1 wall (~2× the
  width-2 ~1 h); keep the rpair budget 3 000 → 4 000 line; DoR stays 10/10.
- EPIC-010 tickets table rows for both.
Fences: records only. No src/, tools/, data/, board. Never push/force/amend/rebase/merge into main. No host paths. Run no builds, tests or node (a QE times ALONE on this host); if sealing needs node, draft + a seal script calling only context-io admitAndAppend and give me the command. Never `while pgrep -f` loops.
Publish: notes (task `bapm-ABC-242-225-owner`), commit, `## Result` + trace row here, brief + claim to done/.

## Added 18:12Z (owner, `orch-2026-10-30a/…f4673b9f`)
- Whole-second reading CONFIRMED ("≤ 22 s" = < 22 500 ms): close the open owner confirmation in ABC-220's FOLDED note, EPIC-009,
  ABC-222 (PREREG reads A5 against < 22 500 ms) and ABC-221's ≤ 60 s analogue if it references the same reading. Dated, quote the owner.

## Result

*BA/PM, 2026-10-30, task `bapm-ABC-242-225-owner`; records only, branched from `main` `5090a4d6` (carries the 18:12Z addition). Branch `grugops/bapm-ABC-242-225-owner` @ `ecb705a3` (records); this brief move is on top. Nothing was run, built, timed or played, because a QE is timing ALONE.*

- **`ABC-242`: DoR 9/10 → 10/10, Backlog → Ready** (S, P3, S2 with no smoke). The owner's accept is recorded verbatim (`…65848126`).
  - **A1** gains the skipped child search (4 child searches for 5 moves on the probe; entries 1–4 `UNKNOWN - verify`, not pinned). It also gains the Architect's extra fixture, with the third-occurrence move **last** in `legalMoves` order, which pins the whole list exactly.
  - **A4** is re-worded to the Architect's determinism reading: same move from the CLI seam, UCI and a direct `createLevel`; UCI `nodes` and `depth` equal the direct call's; the direct list carries the 0. No surface prints the list.
  - **A8** is corrected: the ladder lane is an identity row, and **A1–A5 are the checks**.
  - The `NFR-004` line reads ≤ 49 comparisons. The `NFR-008` line names ≤ 10 s and the headroom watch. The parent-root count is ruled out.
  - Dependencies are met, including `ABC-241`, which is Done.
  - It shares only `src/uci-session.test.ts`, with `ABC-243`, which is rebase order only. It shares nothing with `ABC-229`.
- **`ABC-225`: Blocked → In Development, DoR stays 10/10.**
  - **A5 runs at `--concurrency 1`** by the owner's word. `rpair` already takes the flag (default 2), so no tool change is owed.
  - **The width-1 wall is about 2 h**, double the width-2 figure of about 1 h. By the recorded 4 000 ms width-1 R smokes, it is about 2.2–2.4 h.
  - The `rpair` budget 3 000 → 4 000 line stands. `se-ABC-225-main` takes `main` in by merge, which is what "rebase" means in the earlier lines.
  - **A6 is re-worded:** it projects the 400-game pair at width 1 (about 22–24 h, estimated) and no longer grades the width-2 ≤ 10 h estimate (QE-225-b (iii)).
- **The whole-second closures** (owner `…f4673b9f`, dated, the whole-second clause quoted):
  - **`ABC-220`:** a CONFIRMED block, plus inline closures on the MERGED "still open", the FOLDED wall reading, the `AR-UCI-BUSY` NFR bullet, and DoR row 10.
  - **`ABC-222`:** a CONFIRMED block saying **the PREREG reads A5 against < 22 500 ms**, plus inline closures in the RE-SCORED and FOLDED blocks, A5 and DoR row 10.
  - **`EPIC-009`:** a CONFIRMED block, inline closures in the MILESTONE 1 and FOLDED blocks, and the § Owner questions line and heading marked answered.
  - **`ABC-221`: unchanged.** Its ≤ 60 s is read exactly, so it does not use the whole-second reading.
- **`EPIC-010`:**
  - a FOLDED header block;
  - tickets table rows 3 (`ABC-225`) and 10 (`ABC-242`);
  - width-1 figures in the cost table's `ABC-225` and batch rows;
  - the `ABC-242` footnote dated, and a fold line under the table.
- **For the Orchestrator:**
  - Milestone 1's batch is about 9 h at width 2 and **about 22–24 h at width 1** (estimated). The owner's word covers `ABC-225`'s A5, not the batch's width. Scheduling it, or asking the owner, is yours.
  - LOW, other roles' text:
    - `ADR-0052` D7's "if the owner rejects it" (Architect);
    - `nfr-catalog.md` `AR-UCI-BUSY`'s re-open condition and the "open confirmation" line (Security/NFR, which fit `secnfr-catalog-rebase`).
- **Notes: drafted, NOT sealed**, because sealing needs `node`. Run from the worktree root:
  `node .grugops/context/bapm-ABC-242-225-owner/raw/seal.mjs .grugops/context bapm-ABC-242-225-owner .grugops/context/bapm-ABC-242-225-owner/raw/seal-spec.json`
  It calls only context-io `admitAndAppend`, then `render` and `readContext`. It admits one decision and one observation, both stampless.
- **Checks:**
  - `git diff --check` is clean.
  - The host-path, login and host-name scan of the added lines found 0 hits. The owner's catalog clause names the host and was not re-quoted.
  - `reference-check` was not run, because it needs `node`: `UNKNOWN - verify`.
- **Not touched:** `src/`, `tools/`, `data/`, the board, the trace files, the ADRs and the catalog. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-242 (owner accept, re-score) + ABC-225 (owner width 1) + ABC-220/222, EPIC-009 (whole-second confirmed) | Owner 2026-10-30 "ABC-242: accept, ABC-225 - approve to run one at a time" (…65848126) and "Whole-second reading of "≤ 22 s" - confirm" (…f4673b9f); ABC-242 A1 +last-in-order fixture and no-child-search pin, A4 by determinism, A8 corrected (A1–A5 the checks); ABC-225 A5 at --concurrency 1, A6 projects at width 1, rpair budget 3 000 → 4 000 line kept | EPIC-010, EPIC-009 | — | NFR-004 (≤ 49 comparisons/root move, G5; 22 s read < 22 500 ms CONFIRMED), NFR-008 (≤ 10 s, headroom watch), AR-UCI-BUSY (confirmation closed on the ticket side); notes drafted (seal pending) | grugops/bapm-ABC-242-225-owner @ ecb705a3 (records only): ABC-242, ABC-225, ABC-220, ABC-222, EPIC-009, EPIC-010, .grugops/context/bapm-ABC-242-225-owner/raw/ (2 drafted notes, seal script) | none run (records only); width-1 walls estimated from qe-ABC-228-ii …2123617d and qe-ABC-241 …5d70bb7c | — (ABC-242 UAT owed at build, QE verdict signs) | — | ABC-242 Ready 10/10; ABC-225 In Development 10/10 (se-ABC-225-main then QE A5/A6 ALONE at width 1); ABC-222 Ready 10/10 (PREREG A5 < 22 500 ms); board moves the Orchestrator's |
