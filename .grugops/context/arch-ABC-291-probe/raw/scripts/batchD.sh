# Batch D (arch-ABC-291-probe): the timing rows ALONE, in one hold: PR8, then PR10's ns per node and per-call ratio with the
# memo bypassed. vmstat records the host beside them. Run as: flock <host-test.lock> timeout 1200 bash batchD.sh <scratch dir>
S=$1; out=$S/out; pgn="$S/main/.grugops/context/qe-ABC-279/raw/out/c2/d.pgn"
echo "D start $(date -u +%FT%TZ)" >> "$out/holds.txt"
vmstat -n 5 > "$out/D-vmstat.txt" & VM=$!
for o in B,C,H H,C,B; do { echo "start $(date -u +%FT%TZ) $(cut -d' ' -f1-3 /proc/loadavg)"; timeout 240 node "$S/scripts/g2.ts" "$S" $o "$pgn"; echo "exit $?"; echo "end $(date -u +%FT%TZ) $(cut -d' ' -f1-3 /proc/loadavg)"; } > "$out/D-PR8-${o//,/}.out" 2>&1; done
for o in B,C,H H,C,B; do { echo "start $(date -u +%FT%TZ) $(cut -d' ' -f1-3 /proc/loadavg)"; ENTRY=bypass timeout 240 node "$S/scripts/g2.ts" "$S" $o "$pgn"; echo "exit $?"; echo "end $(date -u +%FT%TZ) $(cut -d' ' -f1-3 /proc/loadavg)"; } > "$out/D-PR10-bypass-${o//,/}.out" 2>&1; done
for o in B,C,H H,C,B; do { echo "start $(date -u +%FT%TZ) $(cut -d' ' -f1-3 /proc/loadavg)"; timeout 300 node "$S/scripts/nsnode.ts" "$S" $o 8; echo "exit $?"; echo "end $(date -u +%FT%TZ) $(cut -d' ' -f1-3 /proc/loadavg)"; } > "$out/D-PR10-nsnode-${o//,/}.out" 2>&1; done
kill $VM
echo "D end $(date -u +%FT%TZ)" >> "$out/holds.txt"
