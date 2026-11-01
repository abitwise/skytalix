---
subtask: bapm-goal3000-o1-cut
role: ba-pm
ref: .grugops/context/bapm-goal3000-o1-cut/
branch: new grugops/bapm-goal3000-o1-cut from main (worktree .claude/worktrees/bapm-goal3000-o1-cut)
width: records only (no vitest, no engine, no games). qe-ABC-223 holds the host STRICTLY ALONE. An Architect analysis hop runs beside you (it edits ADRs only).
---
# BA/PM: goal → 3 000 Elo; cut ADR-0055 option O1's tickets (records only)
## Owner word
.grugops/context/orch-2026-10-30a/notes/20261101T120000Z-orchestrator-decision-74216a44.md (verbatim inside).
## Do
1. **Goal:** where the product goal is recorded (EPIC-010 Q2 block ~:654–:705, EPIC-004 if it carries it, any product brief), add a dated line: goal 3 000 Elo replaces "≥ 2 700 or more, aspirational", owner 2026-11-01, quoted verbatim. Keep the old text struck/kept. Scale stays UNKNOWN - verify (owner named none); name the measurement question (R today: 4 s vs Stockfish UCI_Elo 1910 at 0.5 s; UCI_Elo caps at 3 190) as an open item for the Architect's analysis (arch-algo-analysis) — do not settle it.
2. **O1 tickets** from ADR-0055 (read it in full; options O1-a…O1-e, the A1/A0 bars):
   - O1-a BigInt off the hot path; O1-b moves packed into integers in reused typed arrays; O1-c simpler inlinable helpers (O1-b and O1-c may be one ticket if ADR-0055 pairs them). Each value-identical, graded on nps like ABC-235/240 (S2, no smoke), DoR scored.
   - O1-d (legality shortcut) → Backlog, waits the owner's yes on amending ADR-0003 (Q-SP-3); write its acceptance now so it is ready.
   - O1-e: not cut (ADR-0055 says not proposed now); record that.
   - Place them: EPIC-010 milestone 1b or a small epic — your call, say why. Next free ticket id after ABC-249.
3. Do not cut algorithm tickets: the Architect's analysis is running; the existing ABC-231…239 stay as they are until it reports.
## Fences
- plans/epics, plans/tickets only (plus your notes). No board, trace, ADRs, src/, tools/, data/, AGENTS.md. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-goal3000-o1-cut`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**2026-11-01, BA/PM. Done, records only. Branch `grugops/bapm-goal3000-o1-cut` (worktree `.claude/worktrees/bapm-goal3000-o1-cut`, from `main` `bae25131`). Records commit `59162b78`. Nothing run, built or timed (`qe-ABC-223` holds the host). Not pushed, not merged. No board, trace, ADR, `src/`, `tools/`, `data/` or `AGENTS.md` edit.**

- **1. Goal.** `EPIC-010` § Product goal: a dated 2026-11-01 block with the owner's verbatim word; **3 000 Elo replaces "2 700 Elo or more"**; the 2026-10-29 goal bullet is struck and kept. No ticket, gate or measure bound; M2 stays "not LOSS". Scale `UNKNOWN - verify`. **MQ-3000** named as open for `arch-algo-analysis` (R today: level 5 at 4 000 ms vs Stockfish 19 `UCI_Elo` 1 910 at `st=0.5`, 8× odds; head 72.00 % ≈ +164, BA/PM arithmetic; `UCI_Elo` caps at 3 190). Also dated: § Out of scope, the Q2 row, new Q6; `EPIC-004` top `_Updated:` line and a sub-bullet under the removed ~1700 non-goal. No goal text found in `memory-bank/*.md`; the board line still reads "goal >= 2 700" (Orchestrator's).
- **2. O1 tickets, `EPIC-010` milestone 1b** (all value-identical, S2, 0 games):
  - `ABC-250` O1-b part 1, packed moves in generation / legality / make-unmake, read on perft (`ADR-0055` D3 A1/A0: GO ≥ 1.25× merges; HOLD / NO-GO not merged): M, P2, **10/10**, Ready recommended. Pull 1.
  - `ABC-251` O1-b part 2 + O1-c (paired, as `ADR-0055` folds them): search on packed moves, `Move` at `chooseMove`'s return, inlined helpers; ≥ 1.10×, or O1-c alone ≥ 1.03× if `ABC-250` is dropped: L (S narrowed), P2, **9/10**, Backlog until `ABC-250` reads. Pull 2.
  - `ABC-252` O1-b part 3 (shell adapter): one generator via one converter; nps guard ≥ 0.98×: M, P3, **9/10**, Backlog; dropped if `ABC-250` is. Pull 3.
  - `ABC-253` O1-a, keys as u32 halves in the hot path, `bigint` at the API; ≥ 1.02×: M, P3, **10/10**, Ready recommended. Pull 4 (`ADR-0055` D4).
  - `ABC-254` O1-d, lazy legality (`ADR-0003` (c2)); ≥ 1.10×, in-check guard ≥ 0.97×; acceptance written: M, P2, **9/10**, **Backlog, waits the owner's yes (Q-SP-3)** and an ADR amending `ADR-0003`; first in 1b if in time, else after `ABC-252`.
  - **O1-e not cut** (`ADR-0055`: not proposed now); recorded in § Milestone 1b.
- **Placement:** `EPIC-010` milestone 1b, not a new epic: the S2 rule and its precedents live there; 1b collides with milestone 2 on files and § Dependencies orders them; `ADR-0055` D2's order is this epic's sequence; five S2 tickets do not earn an epic. No batch (value-identical). Cost ≈ 4–5 h ALONE (estimate), 0 games.
- **3. No algorithm ticket cut or changed** (`ABC-231`…`ABC-239`); milestone 2 has one dated line ("after 1b; content waits on `arch-algo-analysis`").
- **Owner calls:** Q-SP-3 (blocks `ABC-254` only); Q-SP-2 (bars apply as written unless reset); Q6 (scale / measure of 3 000, after `arch-algo-analysis`).
- **Owed to the Orchestrator:** board rows for `ABC-250`–`254`; `Backlog → Ready` for `ABC-250` and `ABC-253`; pull order; the board's "goal >= 2 700" lines; the trace render. **To the Architect:** value-identity at design; clause-1 reading of `ADR-0003` for `ABC-250`/`252`; the amending ADR on a Q-SP-3 yes.
- **Notes** (task `bapm-goal3000-o1-cut`, contextRoot = worktree; 3/3 read back): decision `…aa9e5760`, artifacts `…a5b00b8b` (observation: an `artifact-ref` needs a `gate_run`), owed `…9963a89f`.

### Trace row (10 cells, header order)

| EPIC-010 goal 3 000 / ABC-250..254 (cut) | owner 2026-11-01: goal 3 000 Elo replaces ≥ 2 700 (scale UNKNOWN - verify; MQ-3000 open for arch-algo-analysis); ADR-0055 O1 cut as milestone 1b: O1-b part 1 (ABC-250), O1-b part 2 + O1-c (ABC-251), O1-b part 3 (ABC-252), O1-a (ABC-253), O1-d (ABC-254, Backlog on Q-SP-3); O1-e not cut | EPIC-010, EPIC-004 | ADR-0055 (PROPOSED; option O1 chosen by the owner); ADR-0003 (amendment owed for ABC-254); ADR-0025, ADR-0054 kept (ABC-253) | NFR-001 INFO; NFR-004 G5; NFR-005 G6 ≥ base; NFR-008 ≤ 0.1 s per ticket; NFR-009 G7 growth 0; nps bars 1.25 (perft GO) / 1.10 / 1.03 / 1.02 / 1.10 | grugops/bapm-goal3000-o1-cut @ 59162b78: plans/epics/EPIC-010-…, plans/epics/EPIC-004-…, plans/tickets/ABC-250…ABC-254 (new) (records only) | none run (records only) | n/a (records); each ticket owes UAT, signed by its QE verdict | — | ABC-250 10/10, ABC-253 10/10 (Ready recommended); ABC-251, ABC-252, ABC-254 Backlog 9/10 |
