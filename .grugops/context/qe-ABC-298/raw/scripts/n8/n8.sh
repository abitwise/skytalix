#!/bin/bash
# qe-ABC-298 NFR-008 twin read (ADR-0035 D1, ADR-0077 d11). qe-ABC-303's n8.sh; its changes are marked 298:
#  (1) 298: B = the merge-base (src/ bba42fb7) reads 71 files / 2 734 passed; H = the head (src/ b8d055c9) and H2 = cp -a of H
#      read 71 / 2 782; (6) 298: stage.inc.sh runs each arm as `taskset -c 0 npm test -- --maxWorkers=1`. The census's
#      changes (2) to (5) stand:
#  (2) every output file is checked non-empty before it is read; an empty or absent one leaves the run unscored (QE-282-b);
#  (3) per-run host CPU from /proc/stat, and foreign_cpu_s = host CPU over the run minus the run's own CPU (information);
#  (4) a foreign vitest count after the run as well as before it, and fsample.sh running for the hold (information);
#  (5) a stage clock: no new round starts past 1 200 s, so a stage cannot overrun the hop's 50 min of lock.
# Run ONCE, inside ONE flock hold of the host lock. Usage: n8.sh <arms dir holding B H H2> <out dir>
# Order rotates by round (r mod 3): B H H2 / H H2 B / H2 B H. Round 0 is discarded. Rounds continue until 8
# complete scored rounds or 12 rounds in all. 298: `npm test -- --maxWorkers=1` on one core, one fresh process per run.
# Host gate per run: wait up to 120 s for load1 <= 8; a run that starts at load1 > 8 is not scored.
A=$1; O=$2; mkdir -p $O/runs
HERE=$(cd "$(dirname "$0")" && pwd)
exp_of() { if [ "$1" = B ]; then printf "71\t2734\t0\t0"; else printf "71\t2782\t0\t0"; fi; } # 298
ARMS="B H H2"; ORD0="B H H2"; ORD1="H H2 B"; ORD2="H2 B H"; TAG=n8
. "$HERE/stage.inc.sh"
