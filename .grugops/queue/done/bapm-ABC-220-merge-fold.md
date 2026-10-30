---
subtask: bapm-ABC-220-merge-fold
role: ba-pm
ticket: ABC-220
ref: .grugops/context/bapm-ABC-220-merge-fold/
branch: new grugops/bapm-ABC-220-merge-fold from main (commit this brief's sha or later)
width: records only, no CPU
---
# BA/PM: ABC-220 merged (ec1e835b) — fold
## Read
ABC-220 ticket Test note 4 + FOLDED blocks; qe-ABC-220 verdict `…7a09c5e1` and gaps `…c6bdd364`; secnfr-ABC-220 Result in
.grugops/queue/done/secnfr-ABC-220.md; EPIC-009; ABC-221, ABC-222.
## Do
- Close ABC-220 (Done, merge ec1e835b; QE verdict signs UAT; gate PASS_WITH_RISKS).
- ADR-0044: dated fold lines in D3, D4 (new D4.5), D5, D11 per ADR-0052 § Consequences (Test note 4).
- SEC-220-a: ADR-0052's quoted NFR-004 sentence still says "≤ 3 s" — dated pointer to 4 s (ADR-0045 FOLDED).
- QE-220-a (LOW): fold into ABC-221 as a row (QE-A3a's 4 asymmetric-increment rows into src/uci-session.test.ts); SEC-220-b (comment) as an ABC-221 note.
- EPIC-009: milestone-1 state (ABC-220 Done; ABC-222 now pullable). Re-score ABC-222 DoR (wait met).
## Fences
Records only. No src/, tools/, data/. No board edits. Never push/force/amend/rebase/merge into main. No host paths.
Run no builds, tests or node scripts (an SE is timing); if sealing needs node, draft + seal script and give me the command.
Waiting rule: never `while pgrep -f …` loops.
## Publish
Notes (task `bapm-ABC-220-merge-fold`), commit, `## Result` + trace row here, brief + claim to done/.

## Result

*BA/PM, 2026-10-30, task `bapm-ABC-220-merge-fold`; records only, at `main` `4ac4f3bb` (carries the `ABC-220` merge `ec1e835b` and `18485bae`). Branch `grugops/bapm-ABC-220-merge-fold` @ `69e92f9b` (records); this brief move is on top. Nothing run, built, timed or played.*

- **`ABC-220` closed:** front matter `done` / `Done` with `closed:` (merge `ec1e835b`; QE PASS_WITH_GAPS `…7a09c5e1` signs UAT; Security/NFR PASS_WITH_RISKS). A MERGED block records:
  - A1–A14 MET: A11 max 22 001.0 ms, A14b R1 0.38 ms, A12 9.69 s;
  - the `NFR-004` text, `AR-NFR004-A` standing at 22 s, and `AR-UCI-BUSY`;
  - Test note 4's three owed items: BA/PM's done on this hop, the SE's header line on `main`, and the Scribe's with `scribe-agents-md-timemode`;
  - each gap's disposition.

  A closing line sits under the DoR.
- **`ADR-0044`:** dated fold lines for what is in force at `ec1e835b`:
  - D3's `uci` row (the `TimeMode` combo, two values) and `setoption` row (exact tuple match, the refusal text, not reset by `ucinewgame`);
  - D4's new item 5, **D4.5** (`C` and `simple-tournament`'s `min(x, T)` / `min(T, C)` / T, at 22 000);
  - D5 (≤ 22 s read to the whole second, no worker, `AR-UCI-BUSY`);
  - D11 (`Skill Level` governs only while `TimeMode` is `level`);
  - one line in § Status's `ADR-0052` block.

  The `uci-clock-mode` halves wait for `ABC-221`'s merge, and are listed in its test note 4.
- **`SEC-220-a`:** `ADR-0052` § Consequences has a dated pointer. The quoted clause A reads ≤ 4 s since `e42b637b` (`ADR-0053` d10, `ADR-0045` FOLDED). The pointer also covers the level-5 comparisons in § Status, D3 and the `AR-NFR004-A` bullet. No decision changes.
- **`ABC-221`:**
  - **A12 (QE-220-a):** four rows in the `simple-tournament` A7 block. Each is `go wtime 10000 btime 10000 movestogo 10`: B `winc 0 binc 2000` → 2 800; B `winc 2000 binc 0` → 800; W `winc 2000 binc 0` → 2 800; W `winc 0 binc 2000` → 800. The same four inputs give the same budgets in `uci-clock-mode`.
  - **Test note 5 (`SEC-220-b`):** fix the `milliseconds` comment, not the rule; no row.
  - **A11** is re-worded to A13 + A14a + A14b in the mode. The existing A14a row's option line moves with A1.
  - An `NFR-008` headroom line (0.27–0.31 s) is added.
  - **DoR 9/10 → 10/10, Ready.** Pull it after `ABC-222` (owner: "later"). M (12 rows), P3.
- **`ABC-222`: DoR 9/10 → 10/10, Ready.** The wait was met by `ec1e835b`. The build sha is pinned. `ABC-220`'s overshoot reading (≤ 1.0 ms) is recorded for the PREREG, and these games are `AR-NFR004-A`'s next reading at 22 s. A5 is unchanged (< 22 500 ms).
- **`EPIC-009`:** a header block says milestone 1 is half done. The tickets table now reads: row 1 Done, row 2 Ready 10/10, row 3 Ready 10/10 (pull order only). The § Scope fold line is dated.
- **Not folded:**
  - QE-220-b, -d, -e and `SEC-220-c`: INFO, no ticket.
  - QE-220-c: the Orchestrator's `NFR-008` watch.
  - The Scribe's `AGENTS.md` items, including SE F3: `scribe-agents-md-timemode`.
  - The whole-second confirmation: the owner's; it blocks nothing.
- **Seen, not acted on:**
  - `ADR-0052` D4's "the same 500 ms margin as D3" is stale (D3 is 0 ms since the amendment). It is the Architect's text.
  - `EPIC-009`'s front matter still says Backlog. The card is the Orchestrator's.
- **Notes: drafted, NOT sealed** (sealing needs `node`). Run from the worktree root:
  `node .grugops/context/bapm-ABC-220-merge-fold/raw/seal.mjs .grugops/context bapm-ABC-220-merge-fold .grugops/context/bapm-ABC-220-merge-fold/raw/seal-spec.json`
  It calls only context-io `admitAndAppend`, then `render` and `readContext`. It admits one decision and one observation, both stampless.
- **Checks:**
  - `git diff --check` is clean.
  - The host-path scan of the added lines found 0 hits.
  - `reference-check` was not run (it needs `node`): `UNKNOWN - verify`.
- **Not touched:** `src/`, `tools/`, `data/`, the board, the trace files and `AGENTS.md`. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-220 (merge fold) + ABC-221, ABC-222 (re-score) | ABC-220 Done at ec1e835b (QE PASS_WITH_GAPS signs UAT; Security/NFR PASS_WITH_RISKS); ADR-0044 D3/D4.5/D5/D11 simple-tournament fold lines; ADR-0052 SEC-220-a pointer (clause A ≤ 4 s); QE-220-a folded into ABC-221 as A12 (four asymmetric-increment rows), SEC-220-b as ABC-221 test note 5, A11 → A13 + A14a + A14b | EPIC-009 | — | NFR-004 (22 s; text placed at secnfr-ABC-220), AR-NFR004-A (stands at 22 s), AR-UCI-BUSY (ADR-0044 D5 fold), NFR-008 (headroom 0.27–0.31 s named in ABC-221); notes drafted (seal pending) | grugops/bapm-ABC-220-merge-fold @ 69e92f9b (records only): ADR-0044, ADR-0052, EPIC-009, ABC-220, ABC-221, ABC-222, .grugops/context/bapm-ABC-220-merge-fold/raw/ (2 drafted notes, seal script) | none run (records only); figures cited from qe-ABC-220 …7a09c5e1, …c6bdd364, …58af5b6a | — (ABC-220 UAT signed by QE verdict …7a09c5e1) | — | ABC-220 Done; ABC-222 Ready 10/10; ABC-221 Ready 10/10 (pull after ABC-222); board moves the Orchestrator's |
