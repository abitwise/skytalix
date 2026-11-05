#!/bin/bash
# se-ABC-305 N8-LANE read (ABC-305 A5; ADR-0035 D1). secnfr-census-1105's n8.sh, and only the per-arm expected counts differ:
# B = main a21136b0, 71 files / 2 709; H = the tip and H2 its identity twin, 71 / 2 710 (both read by one preflight run).
# Run ONCE, inside ONE flock hold of the host lock. Usage: n8.sh <arms dir holding B H H2> <out dir>
# Order rotates by round (r mod 3): B H H2 / H H2 B / H2 B H. Round 0 is discarded. Rounds continue until 8
# complete scored rounds or 12 rounds in all. `npm test` as spelled, one fresh process per run.
# Host gate per run: wait up to 120 s for load1 <= 8; a run that starts at load1 > 8 is not scored.
A=$1; O=$2; mkdir -p $O/runs
HERE=$(cd "$(dirname "$0")" && pwd)
exp_of() { if [ "$1" = B ]; then printf "71\t2709\t0\t0"; else printf "71\t2710\t0\t0"; fi; }
ARMS="B H H2"; ORD0="B H H2"; ORD1="H H2 B"; ORD2="H2 B H"; TAG=n8
. "$HERE/stage.inc.sh"
