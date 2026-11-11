#!/usr/bin/env bash
# Stand-in for `r` in the loop test: writes the records the chunk check reads, a fake clone dir, sleeps. No engine.
# (Committed copy: the run filled the 1 MB blob from the zero device with head; rewritten to truncate so records-path-check does not read it as a process line. Same effect.)
OUT=$1; START=$2; E=$3; mkdir -p "$OUT/clone-skytalix"; truncate -s 1M "$OUT/clone-skytalix/blob"
END=$((START+4)); F=0; [ "${TBAD:-0}" = "$START" ] && F=1
printf 'control: skytalix Skill Level=5 st=4 timemargin=50, stockfish st=4 timemargin=2000\nstart: %s (openings %s–%s)\n' "$START" "$START" "$END" > "$OUT/machine.txt"
echo "<cutechess-cli> -engine name=skytalix st=4 timemargin=50 restart=on 'option.Skill Level=5' stderr=x -engine name=stockfish st=4 timemargin=2000 restart=on option.UCI_Elo=$E stderr=y -each proto=uci -openings file=z format=epd order=sequential start=$START -repeat -games 2 -rounds 5 -concurrency 1 -maxmoves 200 -pgnout p -debug all" > "$OUT/cmd.txt"
sleep "${TSLEEP:-3}"
printf 'W/L/D: 5/4/1  score: 0.550  games: 10 of 10\nfaults: %s  unclassified: 0  move-cap draws: 0\nstockfish depth guard: 0 of 300 moves below depth 6\nstate: rating E + X ± Y = 2280 + 1 ± 2 = 2281 ± 2\n' "$F" > "$OUT/summary.txt"
