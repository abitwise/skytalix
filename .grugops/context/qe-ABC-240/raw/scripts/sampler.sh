#!/usr/bin/env bash
# Runs beside a timed pair until killed: every 0.5 s, a cutechess-cli or a vitest anywhere on the host is written to <hits>.
# usage: sampler.sh <hits>
hits=$1
while :; do
  cc=$(pgrep -x cutechess-cli | wc -l)
  vt=$(pgrep -f "[/]vitest" | wc -l)
  if [ "$cc" -ne 0 ] || [ "$vt" -ne 0 ]; then echo "{\"at\":\"$(date -u +%FT%T.%3NZ)\",\"cutechess\":$cc,\"vitest\":$vt}" >> "$hits"; fi
  sleep 0.5
done
