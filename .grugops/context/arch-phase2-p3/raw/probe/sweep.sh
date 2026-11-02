#!/bin/bash
# usage: sweep.sh <mode> <envs> <cfg>... ; each config one node run, each under flock + timeout 300
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad
cd $S/p3main
mode=$1; envs=$2; shift 2
for cfg in "$@"; do
  echo "== $mode $envs $cfg"
  flock $S/host-test.lock timeout 300 env $envs node probe3.ts $mode "$cfg" 2>&1
done
