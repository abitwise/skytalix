---
id: 20261023T194500Z-orchestrator-decision-715b9cbf
kind: decision
by: orchestrator
at: 2026-10-23T19:45:00Z
verified_by: 
confidence: high
refs:
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - plans/uat/EPIC-006-game-1.pgn
  - plans/uat/EPIC-006-play-test-log.md
supersedes: 
seal: sha256:07d4fd7404b02c9c354db4c1cd8ad5108e13272fa8ad2a585faec6528c1fdce5
---

# The owner's in-session word, 2026-10-23 evening. A transcription, not a stamp

Verbatim: *"Yes record PGN file export as a feature, since it allows to analyze games. Let Architect go though the game. Would you be able to create PGN file from game 1 log without the feature implemented?"* (preceded by: *"i would like to have PGN file, then i can analyse it … I wanted to analyse the game since I saw many plunders from both sides, to give some rating and understand what parts of the algorithm could be improved."*)

1. **PGN export is IN scope** (EPIC-006 § Negotiable slice, owner's scope call; reason: game analysis). It no longer waits on the play-test rule. Save/resume still waits on the play-test. Routed to BA/PM (`bapm-cut-pgn-export`).
2. **Game 1 analysis**: Architect/Design analyses `plans/uat/EPIC-006-game-1.pgn` — blunders both sides, a hedged strength estimate, which engine parts caused skytalix's errors, candidate improvements (owner's call). Routed `arch-analyse-game-1`.
3. **Reference engine**: the "Yes" answered the Orchestrator's install question; `brew install stockfish` run by the Orchestrator → `/opt/homebrew/bin/stockfish`, `id name Stockfish 19`. Host tool only, never a repo dependency (like cutechess-cli).
4. **Game 1 PGN made by hand**: `plans/uat/EPIC-006-game-1.pgn`, from the owner's pasted move list; all 70 plies replayed legal with `src/san.ts` + `src/legal.ts` + `src/apply.ts` (each input SAN equals the canonical `toSan`), final `gameStatus` = black-wins / checkmate, final FEN `3r2k1/p4ppp/1p2p3/3Q4/n4P2/P2n4/r1qB2PP/1K1R4 w - - 6 36`.
