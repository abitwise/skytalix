#!/bin/bash
# secnfr-census-1105 probe (an estimate, never a grade): n8.sh's stage with arms H, P1, P2; expected counts in expected.env.
# Run ONCE, inside ONE flock hold of the host lock. Usage: probe.sh <arms dir holding H P1 P2> <out dir> <expected.env>
A=$1; O=$2; mkdir -p $O/runs
HERE=$(cd "$(dirname "$0")" && pwd)
. "$3"
exp_of() { case "$1" in H) printf "71\t2709\t0\t0";; P1) printf "%s" "$EXP_P1";; P2) printf "%s" "$EXP_P2";; esac; }
ARMS="H P1 P2"; ORD0="H P1 P2"; ORD1="P1 P2 H"; ORD2="P2 H P1"; TAG=probe
. "$HERE/stage.inc.sh"
