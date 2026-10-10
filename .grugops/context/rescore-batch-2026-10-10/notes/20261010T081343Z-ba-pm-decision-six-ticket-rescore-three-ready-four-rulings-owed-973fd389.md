---
id: 20261010T081343Z-ba-pm-decision-six-ticket-rescore-three-ready-four-rulings-owed-973fd389
kind: decision
by: ba-pm
at: 2026-10-10T08:13:43Z
verified_by:
confidence: high
refs:
  - ABC-126
  - ABC-083
  - ABC-036
  - ABC-038
  - ABC-010
  - ABC-087
  - ABC-084
  - ABC-082
  - ABC-101
  - ABC-037
  - AR-NFR005-082
  - NFR-002
  - NFR-005
  - ADR-0003
  - ADR-0026
  - ADR-0027
  - plans/traceability.md
  - .grugops/context/wave-2026-09-25/notes/20261010T075200Z-orchestrator-decision-e47a1c08.md
  - .grugops/context/wave-2026-09-25/notes/20261009T193639Z-orchestrator-decision-8e3f0b17.md
  - .grugops/context/refinement-post-abc030/notes/20260812T181000Z-ba-pm-observation-i-re-verified-five-dor-scores-and-three-of-them-moved-6b2d5f81.md
  - .grugops/context/rescore-batch-2026-10-10/probe/RUN.txt
supersedes:
---

Six-ticket DoR re-score, task `wave-2026-09-25`, subtask `rescore-batch-2026-10-10`, Workflow 07,
against wave tip `71be48b`. Since `7b54dae`, `src/` has changed only in test data and tests
(`ABC-084`, `ABC-125`). No production file moved.

| ticket | DoR | Ready? | ⚠️ and owner |
|---|---|---|---|
| ABC-126 XS P2 | 10/10 | **page Ready** | none |
| ABC-036 S P1 | 10/10 | **page Ready** | none |
| ABC-010 M P2 (was P1) | 10/10 | **page Ready**; the pull goes to In Design | none; the design question is a routing step |
| ABC-083 M (was S) P1 | 9/10 | no | item 10: Architect/Design (needed for Ready); owner (optional now) |
| ABC-087 M P1 | 9/10 (was 7) | no | item 10: Architect/Design |
| ABC-038 S P2 | 8/10 (was 9) | no | items 2 and 10: owner (Architect/Design only if re-cut) |

Decisions BA/PM took on its own authority (the Orchestrator may reverse any of them):
1. **ABC-126.** The scope gains dropping `ABC-084`'s carve-out (`src/puzzle-suite.test.ts:130`–`:133`).
   Its comment becomes false once the pair is re-found. The fence is now three files. Option B's
   trigger does not fire (no listed file changes), but the suite still runs as the ticket's own
   `A4`, because 2 of its 40 inputs change. "Not below baseline" means 40/40.
2. **ABC-036.** `A4` named "the same array `ABC-033` generated". On the merged path a `moves` line
   never reaches `resolveMoveInput`, so that array does not exist. The criterion is re-worded:
   one `legalMoves` per `moves` line, that array passed to every `toSan`, and both spied through
   `MoveInputDeps` (`toSan` falls back to its own derive, which QE's M11 showed). The 2026-08-13
   delegated ruling on the reduced promise closes item 10.
3. **ABC-083.** Re-pinning is added to the scope, with `A10` (`ABC-082` `A8` applied here). The
   ledger also covers rows that cannot move under a pawn term but can under mobility and king
   safety (pawnless boards). Re-sized S → M for the same reason `ABC-082` was.
4. **ABC-087.** The EPIC-006 vocabulary mismatch is closed by adopting `ABC-101`'s published
   ordinals (1–5; easiest 1, default 3, hardest 5). `ABC-101` is not edited.
5. **ABC-010.** Item 6's bar is re-derived: validated `parseFen` ≤ 10 µs per call. There are 2 calls
   per frame, so that is ≤ 0.125% of NFR-002's 16 ms. Measured today: 1.85 µs per parse, 0.15 µs
   per in-check probe (Apple M3, Node v26.11.0, load1 4.8; probe under `probe/`). **Re-prioritised
   P1 → P2.** The P1 argument was "goes live when EPIC-003 accepts a user FEN". EPIC-003's scope
   accepts no FEN, no other epic does, and `src/cli.ts:166` is `newGame(START_FEN)`. The trigger
   back to P1: a FEN input ticket, or ABC-093/094 choosing a FEN-carrying book format.

Rulings owed (the Orchestrator dispatches them):
- **R1, Architect/Design, ABC-083 (gates Ready):** "If `A5`'s total leaf cost exceeds 1,100 ns with
  every mobility form measured (legal count, pseudo-legal count, attack-map count), which ships:
  (i) king safety alone, with mobility re-cut to Backlog, or (ii) nothing until ADR-0003's depth
  model is re-derived?"
- **R2, owner, ABC-083 (optional now; reserved by AR-NFR005-082):** "If `A9` shows kiwipete at depth
  6 but not 7 at DEFAULT_BUDGET_MS on an uncontended M3, does depth 7 stay a level (the ticket
  stops, and the terms are cheapened or cut), or is depth 7 retired on kiwipete with the depth-6
  floor kept?"
- **R3, Architect/Design, ABC-087 (gates Ready):** "Under PVS only the first root move is exact
  (`src/engine.ts:314`–`:336`). Which blunder construction ships: (a) separate candidate scoring
  inside the per-move budget, or (b) a widened root window under ADR-0026 decision 10? Does a
  blunder pick the n-th best or a uniform non-worst move? What is 'worst-scoring' for `A4` on
  that construction's scores?" Under (b) the ticket is re-sized, likely to L.
- **R4, owner (or Orchestrator under delegation), ABC-038:** "Tab-completion cannot work on the
  merged prompt. `src/line-input.ts` reads stdin in canonical mode: there is no `setRawMode` or
  `node:readline` in `src/`, so a Tab is just a character until Enter. Do you want (a) a re-cut
  with a keystroke reader (M/L, an Architect pass on raw echo against the in-place frame, a new
  Security/NFR surface), or (b) ABC-038 dropped, as the epic's drop-first slice, with EPIC-003's
  scope line amended?" BA/PM recommends (b).

File overlap (cannot build in parallel):
- ABC-126 × ABC-083: `src/quiescence.test.ts` (ABC-083's `A10` re-pins rows there). ABC-126 goes first.
- ABC-126 × the harder-puzzles cut (`cut-harder-puzzles`, unnumbered): `src/puzzle-corpus.ts`,
  and likely `src/puzzle-suite.test.ts`.
- ABC-083 × ABC-087: only under R3 (b) (`src/engine.ts` and its pinned tests). Under (a) there is
  no shared file, but ABC-087's `A3`/`A6` read results ABC-083 moves.
- ABC-036 (`src/command-input.ts` and its test) and ABC-010 (`src/fen.ts`, `src/fen.test.ts`) share
  no file with any other ticket in this batch. ABC-038 is required to leave
  `src/command-input.ts` byte-identical.
Parallel-safe now: ABC-126, ABC-036 and ABC-010 (via In Design) are pairwise disjoint.
