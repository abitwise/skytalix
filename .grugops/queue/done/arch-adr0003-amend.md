---
subtask: arch-adr0003-amend
role: architect-design
ref: .grugops/context/arch-adr0003-amend/
branch: new grugops/arch-adr0003-amend from main (worktree .claude/worktrees/arch-adr0003-amend)
width: records only. qe-ABC-223 holds the host STRICTLY ALONE; a BA/PM records hop runs beside you (plans/ only).
---
# Architect: amend ADR-0003 for lazy legality (ABC-254, ADR-0055 O1-d) — owner said yes
## Owner word
.grugops/context/orch-2026-10-30a/notes/20261101T131000Z-orchestrator-decision-f7a50e95.md (verbatim inside): "ABC-254: yes".
## Do
- Amend ADR-0003 (clauses 1 and 3, as ABC-254's page and ADR-0055 O1-d / ADR-0003 menu item (c2) name): make/test/unmake only for king moves, en passant, pinned pieces and moves out of check; value-identical (same legal-move set on every position); the falsifiers (perft 32/32 exact, the six standard positions, in-check position-4 bar ≥ 0.97×) as ABC-254's acceptance states.
- Also rule BA/PM's open reading: does ADR-0003 clause 1 ("src/legal.ts is not changed") read as "make/test/unmake stays the strategy" for ABC-250 and ABC-252? State it so those tickets are not blocked.
- Mark ABC-254's design gate met (or name what is missing) in your Result for the Orchestrator.
## Fences
- memory-bank/50-decisions/ADR-0003* and your notes only. No plans/, board, src/, tools/, data/, AGENTS.md. Run nothing. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-adr0003-amend`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**2026-11-01, Architect/Design. Done, records only.** Branch `grugops/arch-adr0003-amend` (worktree `.claude/worktrees/arch-adr0003-amend`, from `main` `0ca365b3`). The ADR and notes are in commit `8d38ff68`. Nothing was run, built or timed; the only process run was the seal script. Not pushed, not merged. Only ADR-0003 (dated lines and status), my own context and this brief were edited.

- **Status: ACCEPTED, clauses 1 and 3 AMENDED 2026-11-01**, on the owner's word ("ABC-254: yes", `…f7a50e95`, quoted verbatim). Q-SP-3 is answered yes. Clause 2 and `NFR-005` are not touched. The 2026-07-30 text is kept word for word above each amendment.
- **(1-A), clause 1.** Make/test/unmake stays the test, but it runs only where a move can be illegal.
  - Each call works out the king square, the in-check flag and the pinned set once.
  - The full test runs for king moves (castling included), en-passant captures, moves by a pinned piece, and every move in check.
  - **Value-identical:** same list, same order, `hasLegalMove` agrees, 0 mutations.
  - The classes may include too much, never too little; the completeness argument is on the ADR.
  - The full filter stays in `src/` as fallback and oracle.
  - (c3), the board-only test, may be folded in if it handles the en-passant victim, the castling rook and the promoted piece. Otherwise that move takes the full `makeMove`.
  - It covers `legalMoves`, `hasLegalMove`, `legalCaptures` and `legalCapturesAndQueenPromotions`.
  - Signatures are unchanged, nothing is cached on `Position`, and the scratch is fixed-size (`G7`, growth 0).
- **(1-R), the clause-1 ruling for `ABC-250` and `ABC-252`: they are NOT blocked.**
  - Clause 1 governs how legality is decided. It does not freeze the bytes of `src/legal.ts` or govern how moves and undo records are stored. This is `OD-206-1`, which the owner did not veto on 2026-10-24; it is now written on the ADR.
  - Their list-equality oracles are the clause-1 guard.
  - ADR-0003's July (c4) rejection does not block `ABC-250`. `ADR-0055` O1-b and `ABC-250` A4 decide it.
  - Whichever ticket lands first, the other carries the strategy as it stands.
- **(3-A), clause 3.**
  - (c2), with (c3) allowed, is authorized now, without the trigger. Only `ABC-254` delivers it.
  - (c1) and (b) are unchanged: unauthorized, behind the same trigger.
  - **The falsifiers come from `ABC-254`:**
    - perft 32/32 exact with `PERFT_DEEP=1`;
    - the differential over the six standard roots (≥ 518,474 nodes) plus the 285,074 walk, 0 mismatches and 0 mutations;
    - in check, `position-4` ≥ 0.97×. The designed response to a miss: when in check, skip the pin set;
    - the speed bar, ≥ 1.10× on two boards and ≥ 1.00× on the third. A miss means the ticket is dropped and the authorization stays on record unused;
    - after merge, any list difference means reverting `ABC-254`.
- **Consequences.**
  - No NFR moves.
  - `ADR-0002` needs no edit. Its re-measurement is not a gate on `ABC-254`.
  - `ABC-009` is unchanged.
  - Rolling back means reverting `ABC-254`'s commits.
- **ABC-254's design gate is MET once this branch merges.** The amendment is its design ruling. I recommend no separate In Design hop; that is the Orchestrator's call. What is left is not design:
  1. BA/PM flips DoR row 10 to ✅, then the Orchestrator moves it `Backlog → Ready`.
  2. *Optional, BA/PM:* name `legalCapturesAndQueenPromotions` in scope item 3.
  3. Pull order is the Orchestrator's. `ABC-250` is still in Ready, so `ADR-0055` D4 and both pages put `ABC-254` first. `arch-adr0056-owner-fold`'s "ABC-250 first" came before Q-SP-3 was answered. (1-R) makes either order safe.
- **Notes** (task `arch-adr0003-amend`, contextRoot = worktree; 3/3 sealed and read back): decision `20261101T123526Z-architect-design-decision-c314772c`, observation `…observation-909876c0` (facts), observation `…observation-f598aa16` (artifacts).

### Trace row (10 cells, header order)

| arch-adr0003-amend (records) | owner 2026-11-01 `…f7a50e95`: "ABC-254: yes" (Q-SP-3) | EPIC-010 milestone 1b (ABC-254 unblocked; ABC-250/252 not blocked) | ADR-0003 clauses 1 and 3 AMENDED: (1-A) lazy legality, (1-R) clause-1 reading, (3-A) (c2) authorized + falsifiers; Consequences, Rollback dated | NFR-005 (G6 ≥ base), NFR-001 (INFO), NFR-009 (G7 growth 0); no level moved | grugops/arch-adr0003-amend @ 8d38ff68: memory-bank/50-decisions/ADR-0003-legality-strategy.md (records only) | none run (records) | n/a | — | no board move; ABC-254 design gate met on merge → DoR 10/10 (BA/PM), Ready (Orchestrator) |
