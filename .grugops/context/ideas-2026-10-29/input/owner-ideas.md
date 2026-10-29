# Owner input, 2026-10-29 (verbatim transcription; UNVERIFIED claims)

> Transcribed by the Orchestrator (orch-2026-10-29g) from the owner's message in session. The owner's own words are
> in § A. § B is a summary the owner got from external chat models; he says: "these improvement ideas should be
> checked (don't take them as valid instantly)". Every claim in § B is **UNKNOWN - verify** until a role checks it
> against the code at main. Main's `src/`, `data/` and `tools/` are byte-identical to `3ad6bc10`, the commit § B reviewed.

## A. Owner's words

"I have new ideas for improvements that can be analyzed and split into tickets. First is to add new difficulty to
allow 40/15 move rule of tournaments: https://computerchess.org.uk/4040/index.html , basic solution would be to use
22.5 seconds per move, currently difficulty level 7 allows 30s per move. New difficulty could be named "tournament"
or 40-15 ; I analyzed some chess engines and skytalix with chatgpt models 6.1 Terra and 6.1 Luna, these improvement
ideas should be checked (don't take them as valid instantly) and based on these we could improve skytalix.
Researching and ticket creation needed, here is the summary of findings:"

## B. External summary (as given; links point at commit 3ad6bc10)

Based on Skytalix's current code, your match results, and your interest in CCRL-style play, my top priority is to
**make tactical search and measurement more reliable**, then improve its handcrafted evaluation and time management.

The list assumes **no neural network** and keeps the current 2000–2100 estimate on the Stockfish `UCI_Elo` test
scale as the starting point.

| Rank | Improvement | Why it ranks here | Relative effort |
|---:|---|---|---|
| 1 | Correct quiescence search | Addresses a concrete tactical weakness around checks, mate and promotions | Medium |
| 2 | Strengthen the evaluation process | Resolves conflicting self-play and external results before optimizations accumulate | Medium |
| 3 | Carry game history into search | Improves repetition and draw decisions in actual games | Medium |
| 4 | Add tournament clock management | Allows Skytalix to use a CCRL-style clock effectively | Medium |
| 5 | Make evaluation aware of game phase | Gives the engine a better basis for king activity and passed pawns in endings | Medium |
| 6 | Improve move ordering | Makes its existing PVS and late move reductions more effective | Medium |
| 7 | Profile and reduce cost per node | Allows more useful search within a fixed time budget | Medium–high |
| 8 | Tune handcrafted evaluation weights offline | Improves positional judgment without a runtime neural network | High |
| 9 | Improve transposition-table use and test aspiration windows | Can reduce repeated search and improve depth | Medium |
| 10 | Add Syzygy endgame tablebases | Provides exact results in supported endgames | Medium–high |

1. **Correct quiescence search.** In `src/quiescence.ts` (~L91) the engine evaluates stand pat and searches
   captures. When the side to move is in check it cannot legally stand pat: it must evade, possibly with a quiet move.
   A capture inside quiescence can give check or mate, and the recursive quiescence does not detect terminal
   positions. Quiet promotions are excluded. Proposed: search all legal evasions when in check; detect mate and
   stalemate inside quiescence; include quiet promotions; keep the search bounded and measure the added cost.
   Success: solves dedicated positions (quiet check evasions, capture-mates, promotions) without unacceptable time growth.
2. **Strengthen the evaluation process.** Main beat `3497aad2` in the direct 1.5 s match but scored lower against the
   limited-strength Stockfish at 3 s. For each serious candidate, measure candidate vs baseline, and both against the
   same external opponents, with paired openings and matching clocks; test at 3 s and, for promising changes, longer.
3. **Carry game history into search.** Search detects repetition only inside its own path; it does not receive the
   game's earlier positions. The UCI parser applies a move sequence and keeps the resulting position without passing
   the history into search (`src/engine.ts` ~L57, `src/uci-session.ts` ~L119). Also revisit the en-passant
   repetition-key behaviour that `src/zobrist.ts` (~L9) says can count some repetitions late. Success: known repeated
   positions handled correctly via CLI and UCI; a bare FEN cannot supply history (keep that explicit).
4. **Add tournament clock management.** UCI time allocation is capped by the difficulty: 3 s per move at level 5 and
   30 s at level 7, with a 32 s engine ceiling, so the engine cannot spend more of a 40/15 clock on a critical move.
   Proposed: a distinct tournament mode that uses the UCI clock and `movestogo`, keeps the human-facing levels, with
   a safety margin and a hard stop on the real remaining clock. Success: no time forfeits in long-clock matches.
5. **Make evaluation aware of game phase.** The king PST is untapered and favours shelter all game. Start with king
   activity, then phase-dependent passed pawns and rook activity. ABC-205 (king safety/tapering) was closed unmerged
   after a regression gate; a new attempt should inspect those failing positions and test a different, more isolated design.
6. **Improve move ordering.** Hash, captures, promotions and killers already come first. Test a history heuristic for
   quiet moves and SEE as an ordering tool (SEE pruning is a separate, riskier change).
7. **Profile and reduce cost per node.** 0x88 board; legality by make/unmake; the evaluator walks the board. Candidates:
   direct tactical-move generation for quiescence, incremental material/PST, fewer temporary allocations in ordering.
   Measure on the owner's host (HX 370) on a fixed position set. Success is playing results, not nps alone.
8. **Tune handcrafted evaluation weights offline** (no runtime NN): optimise existing weights, emit constants; after
   the phase-aware design settles; separate training and validation; verify by matches. ABC-207 (mobility/early queen)
   measured about −18.3 ± 16.5 over 800 games.
9. **TT use and aspiration windows.** The TT (`src/transposition.ts` ~L11) is 4 MiB, always-replace, and allows score
   cutoffs only at exactly the stored depth. Try depth-aware replacement and using deeper entries; aspiration windows.
   Retaining the TT across a game was tested (+8.7 ± 18.3 over 800 games), so do not just re-run that.
10. **Syzygy tablebases.** Exact results in supported endgames; storage, probing and Node integration cost. Later.

Suggested first milestone: #1–#3, then tournament clock management and endgame evaluation.
