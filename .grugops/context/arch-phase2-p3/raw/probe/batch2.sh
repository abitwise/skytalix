#!/bin/bash
# drift (both recursions), mate floor (same depth 5), zugzwang rows, firing at depth 6, per candidate.
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad
for cfg in "$@"; do
  $S/sweep.sh drift "REC=search D=5" "$cfg"
  $S/sweep.sh drift "REC=choose D=5" "$cfg"
  $S/sweep.sh mate "D=5 PLUS=0" "$cfg"
  $S/sweep.sh zug "ZN=7" "$cfg"
  $S/sweep.sh fire "D=6" "$cfg"
done
