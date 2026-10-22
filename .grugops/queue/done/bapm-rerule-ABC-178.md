---
subtask: bapm-rerule-ABC-178
role: ba-pm
tickets: [ABC-178]
branch: main (records only; commit nothing, the Orchestrator commits)
ref: .grugops/context/bapm-rerule-ABC-178/
width: 3 (beside arch-build-ABC-196 and merge-prep-ABC-168; disjoint files)
---

# BA/PM (records only): re-rule ABC-178 now that its wait clause has fired. The owner said on 2026-10-22: "ABC-178, go ahead, send to BA/PM"

## Read first
- The ticket page `plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md`, especially § Dependencies: *"If it reads > 9.2 s (tranche 2, O3, opens), ABC-178 waits. BA/PM re-rules R2 against tranche 2's measured headroom before any pull. R1 can then go alone."*
- ABC-177's Done card in `plans/board.md`: NFR-008 MET at **9.395 s**, warm-flagged; A11 → O3, Architect `…ee7527cc` (not opened); Security/NFR `…b4d5793f`.
- Your own `bapm-rule-QE-177-ab` notes (`…7c41e9a2`), QE `qe-ABC-177` and `qe-ABC-177-timing` notes, the AC-power rule `…bfdc97e5`.
- `plans/nfr-catalog.md` NFR-008; the owner record `.grugops/context/uat-ABC-168/notes/20261022T133720Z-orchestrator-decision-0b63d92f.md`.

## Do
- Rule the page as its own clause asks. Is R2 still worth its estimated lane cost at 9.395 s against the 10 s bound, does it change shape, or is it dropped or deferred? Does R1 go alone? Give the headroom arithmetic from published readings only (no new timing on this host).
- Leave the page Ready, with a re-scored DoR, only if it now passes 10 of 10. Otherwise it stays in Backlog, and you name the missing input and its owner. If the B7/B8 timing still needs a quiet AC window, say so as a precondition (the owner's call).
- One `_Updated:` line at the top of `plans/board.md` and the card; a dated block on ABC-178's page. Next free id ABC-197 if you cut anything.

## Fences
- Only `plans/` and your notes (context root: this repository's `.grugops/context`). No `src/`, harness, ADR, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config, `node_modules/`. Commit nothing. Run no lane and take no timing.
- Other hops run in parallel in other worktrees. Do not touch board cards other than ABC-178's, nor the pending file or the claim directory beyond writing your done record.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass the context root explicitly** (named under Fences), never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Notes are append-only; a wrong note gets a superseding note. Record artifacts as `observation` (no §14 gate run, no `finding`).
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |`, exactly 10 cells, as a plain table line. Put it in your done record: append `## Result` to this file and write `.grugops/queue/done/<subtask>.md` + `.claim.md` in main's tree, uncommitted. The Orchestrator appends the trace row and commits records.

## Result (ba-pm, 2026-10-22T13:47:06Z): **R1 goes alone: ABC-178 narrowed to R1 → Ready (XS, P2, DoR 10/10). R2 deferred, not dropped → ABC-197 (Backlog, XS, P3, DoR 9/10, shape unchanged). Ready 0/8 → 1/8; next free id ABC-198.**

Records only, uncommitted on `main` (`a7857e0b` at start and finish). No lane, no timing, no probe. Notes in `.grugops/context/bapm-rerule-ABC-178/notes/`, sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` with this checkout's `.grugops/context` passed explicitly, both read back through `readContext`:
- `20261022T134635Z-ba-pm-observation-d5e744dd`: the headroom arithmetic and the lane-input facts;
- `20261022T134641Z-ba-pm-decision-8165d1ba`: the ruling.

**Headroom (published readings only; row costs are estimates):** W 10.000 s − H 9.395 s (`f81bf03c`, warm-flagged 5/8, strict view VOID, AC; `…4bb78960`/`…b4d5793f`) = **0.605 s** (≈ 2.4 × R 0.250 s). Against ADR-0046 D4's 9.2 s it is **−0.195 s**. R2 ≈ 150 ms in-thread ≈ **+0.075 s wall** (≈ 12 %); R1 ≈ 4 ms ≈ **+0.002 s** (≈ 0.3 %). Both ≈ 9.47 s (headroom ≈ 0.53 s). R1 alone ≈ 9.40 s. **Caveat:** 14 lane-input merges since `4debc07d` (1 987 → 1 994 tests, `src/cli.test.ts` +307), none timed. Today's `main` lane wall is UNKNOWN - verify. Tranche 2 was never opened, so no tranche 2 headroom exists.

**Why R2 is not kept:** the 9.2 s fork was registered before the reading, and keeping R2 now would move it after the miss (Architect `…74d39535`). Today's headroom is unread, and R2 buys a LOW band for ≈ 12 % of the margin. **Why it is not dropped:** the reading that would justify a drop is not shown real. **ABC-197's pull:** an admissible full-lane reading of `main` ≤ 9.2 s. 9.2–10 s → O3/tranche 2 per the Architect; > 10 s → owner, drop R2. **Split cost:** ABC-197 needs its own B7/B8 hop later.

**ABC-178 changes:** B2 out; B3/B4/B5/B6 R1-only (N + 1 rows; QP0/QP1). **B8 now requires four arms (B/T, H/H2)** and doubles as the Architect's clean re-read (`…ee7527cc`). Its H is ABC-197's input.

**Preconditions on ABC-178's timing hop (owner's call; they do not block the pull or build):** P1 AC; P2 owner-quiet (pause `oeselg-labs/platform`); P3 the thermal rule for B8 (open since `…74d39535`; recommended "thermal kept and flagged", this reading only).

**Missing input:** ABC-178 has none for the pull. ABC-197 needs an admissible full-lane reading of `main` ≤ 9.2 s. QE/E2E reads it at ABC-178's B8, Security/NFR rules on its admissibility, and the owner supplies P1–P3 first. ABC-178 must also merge.

Files:
- `plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md`: frontmatter title/status/column, plus one dated block after the H1. The 2026-10-20 text is kept as the record;
- `plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md` (new);
- `plans/board.md`: one `_Updated:` line at the top; the ABC-178 card moved to Ready (WIP 0/8 → 1/8); the ABC-197 card in Backlog where ABC-178's was.

Not touched: `plans/traceability.md` (the row is below), `plans/nfr-catalog.md`, `src/`, the harness, ADRs, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config, `node_modules/`, other board cards, the pending file and the claim directory. The Orchestrator's uncommitted edits (board, ABC-168, ABC-196 pages) were left as found. No stop.

### Trace row (10 cells, header order)

| ABC-178 (BA/PM re-rule) | the wait clause fired on ABC-177's 9.395 s > 9.2 s; R1 goes alone (ABC-178 narrowed to R1, B8 four arms as the clean re-read); R2 deferred, not dropped, cut to ABC-197 (pulled on an admissible full-lane reading of main ≤ 9.2 s) | EPIC-007 | — | QE-177-a, QE-177-b; NFR-008, N8-LANE; ADR-0046 D4, ADR-0035 D6; O3; notes …4bb78960, …b4d5793f, …ee7527cc, …74d39535, …0b63d92f, …d5e744dd, …8165d1ba | main @ a7857e0b (uncommitted, records only)<br>plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md, plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md, plans/board.md | — (records only; headroom 0.605 s to 10 s at f81bf03c; R2 ≈ +0.075 s, R1 ≈ +0.002 s est.; today's main lane unread) | — (both expect the waiver: 0 production lines) | — | ABC-178 Backlog → Ready (DoR 10/10; Ready 0/8 → 1/8); ABC-197 cut → Backlog (DoR 9/10); next free ABC-198 |
