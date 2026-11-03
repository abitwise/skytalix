#!/bin/bash
# R3 (a): Stockfish 19 depth 26, Threads 1, Hash 64; root free, forced e1f1, forced e1e5. Ends on bestmove.
FEN="8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1"
for mv in "" "searchmoves e1f1" "searchmoves e1e5"; do
  echo "=== go depth 26 $mv"
  coproc SF { timeout 1800 stockfish; }
  printf 'uci\nsetoption name Threads value 1\nsetoption name Hash value 64\nucinewgame\nisready\nposition fen %s\ngo depth 26 %s\n' "$FEN" "$mv" >&"${SF[1]}"
  while IFS= read -r line <&"${SF[0]}"; do
    case "$line" in
      "id name"*|"info depth 2"[0-6]" "*) echo "$line" ;;
      bestmove*) echo "$line"; break ;;
    esac
  done
  echo quit >&"${SF[1]}"; wait "$SF_PID" 2>/dev/null
done
