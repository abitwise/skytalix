---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T13:34:59Z
subtask: arch-ABC-282
role: architect-design
ref: .grugops/context/arch-ABC-282/
branch: new grugops/arch-ABC-282 from main — worktree .claude/worktrees/arch-ABC-282
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Probes small: each ≤ 30 min, ≤ 1 h in all; no games beyond what a PREREG names. Host paths only as placeholders.
---
# Design ABC-282 (W1: time use under a clock)
Read plans/tickets/ABC-282*.md (scope 1–5, A0–A6, F1–F7, and what the ADR must fix), ABC-078 (A3, which W1 amends), ADR-0056 (W1), EPIC-011 § Phases W1, the clock modes in src (uci go wtime/btime/movestogo, the levels), and the BA/PM notes bapm-W1-bundle-cut …a5a31e4c.
Write an ADR PROPOSED (the next free id). It must fix:
- the "will the next iteration finish" rule;
- the soft and hard limits per mode;
- the test for keeping a partial iteration's root move;
- which modes it covers, (a) clock modes only or (b) every mode, with a recommendation;
- the ABC-078 A3 amendment;
- A0's node counts;
- A1 (c)'s corpus and clock;
- the read's control and its intent class.
Check whether ABC-255's game harness (tools/) can play games under a real clock (wtime/btime/inc). If it can't, say so and name the tools ticket that must come first. Take that ticket's scope as an owed line for BA/PM; do not cut it.
Note: ABC-283 (being built now on grugops/ABC-283) also edits the deepening loop in src/engine.ts. Design against main and name the merge interaction.
A PREREG goes before any measured probe.
Fences: memory-bank/50-decisions, your records, scratch. No committed src or tools; no ticket, EPIC or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-282, contextRoot = the worktree's .grugops/context, `at` from `date -u`), including a decision note with the owed lines for BA/PM; queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-04T14:02:07Z.

This was records work plus scratch probes on `git archive` copies of `main` `5853d17f` (`src/` tree `4fb3da04`), under
the host lock: about 4 min of runs, all exit 0. The PREREG `…5dbc040d` was committed at `6424c272` before any run.
Nothing was written to `src/` or `tools/`, and no ticket, EPIC or board page was edited. The scratch copies were
removed, and nothing is left running.

- **`ADR-0071` PROPOSED.** It fixes every item in row 10:
  - **Modes (D1):** reading (a), narrowed to `uci-clock-mode` with a clock and no `movetime`. `simple-tournament` is
    out: T binds every 40/15 move, so M2 would read 62.7 %. `level`, `movetime` and a bare `go` are node-identical to
    `main`.
  - **The rule and the limits (D2, D3):** no iteration starts once t − start ≥ hard ÷ 2.3. b = 2.3 is measured (P1's
    pooled median 2.3319). The hard limit is the mode's budget, unchanged.
  - **The partial move (D4):** kept only when its completed depth-(d + 1) score is strictly above the incumbent's,
    which is searched first. Mate scores take the same `>`.
  - **Reporting (D5):** `depth` is still the deepest completed iteration. A new optional `EngineChoice.partial?: true`
    and an `info string partial depth <d+1>` line.
  - **The seam (D6):** `EngineOptions.softMs`. No export, no door.
  - **The `ABC-078` A3 amendment (D7)** and the header text it replaces.
  - **A0's counts (D8)** and **A1 (c)'s corpus and clock (D9):** K25 × `virtualClock(1)`, H 25–400.
  - **The read (D10):** `tc=40/8`, `timemargin=0`, `uci-clock-mode` on both sides, intent **GAIN**, about 40 min.
- **Probes.** I0 was identical on 125 of 125 rows. The A1 (c) forecast is base median 0.3766 against head 0.0000. At a
  fixed budget the head is one ply shallower on 22 of 125 rows. 3 partial moves were kept.
- **M2 risk (R-0071-1).** At 40/15 the worst case is 72.5 %; measured use gives ≥ 85 %. A4 reads it, and F5 routes a
  miss.
- **Harness: it cannot play a clock on `main`.** `rating.ts` emits only `st=`, and `d` takes `--budget-ms` only. **A
  tools ticket comes first:** `d --tc 40/8` with `TimeMode uci-clock-mode`. Its scope is owed to BA/PM, not cut here;
  ABC-300 is the next free id.
- **`ABC-283` (D12).** The second to land rebases `deepen` and `runIteration`, generalises D4 per aspiration pass,
  re-reads b and A0, and writes the `ADR-0066` d5 line.
- **Owner question: OQ-0071-1, accept?** Options (a) as written, (b) plus the partial rule in every mode as a
  follow-up, (c) decline. The recommendation is (a). The build may start on PROPOSED.
- **Records:**
  - `ADR-0071` (new);
  - `ADR-0056` row W1;
  - `ADR-0052` A10 dated line;
  - notes `…5dbc040d` (PREREG), `…1938110b` (observation), `…0187186b` (decision, with the owed lines).
- **Owed:**
  - **BA/PM:** `ABC-282` page lines 1–12 (front matter, DoR row 10, scope 4 and 5, A0, A1 (c), A2 (c), A3 (b), A4, A6,
    dependencies and size L, test note 3, `NFR-008` lanes), the `ABC-078` A3 text, the harness ticket cut, and the
    `EPIC-011` rows.
  - **Orchestrator:** OQ-0071-1, the order (`ABC-282` after `ABC-283`; the harness ticket before A6), and the board.
  - **Scribe, at the build:** the `AGENTS.md` line.
