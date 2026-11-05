#!/bin/bash
# secnfr-census-1105 foreign-load sampler. Every 3 s, inside the hold: each process whose args name vitest, whose command
# is node, npm or npx (so a flock waiter or a shell quoting the word is not one), and not under the arms dir (by /proc/<pid>/cwd). Logs utc, load1, pid, stat, etimes,
# pcpu, and the cwd's basename only, so no host path reaches a record. Usage: fsample.sh <arms dir> <out file>
A=$1; O=$2
while :; do
  t=$(date -u +%FT%TZ); l=$(cut -d' ' -f1 /proc/loadavg); n=0
  while read -r pid st et pc comm rest; do
    [ "$pid" = "$$" ] && continue
    case "$comm" in node*|npm*|npx*) ;; *) continue;; esac
    cwd=$(readlink /proc/$pid/cwd 2>/dev/null) || continue
    case "$cwd" in "$A"*) continue;; esac
    n=$((n+1)); printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$t" "$l" "$pid" "$st" "$et" "$pc" "$comm" "$(basename "$cwd")" >> "$O"
  done < <(ps -eo pid=,stat=,etimes=,pcpu=,comm=,args= | grep -E '[v]itest')
  [ $n = 0 ] && printf '%s\t%s\tnone\n' "$t" "$l" >> "$O"
  sleep 3
done
