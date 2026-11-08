# Batch D (arch-ABC-292-probe), STAGE B ONLY, on a later brief line citing the owner's held-host word: the timing rows
# ALONE, in one hold. PR8 (cand and cut against main, one session list, B,C,H,X then X,H,C,B; a void session, c_s outside
# [0.970, 1.030] or no c_s figure, is re-run once, and only once), then PR10's per-call ratio with the memo bypassed and
# ns per node, each in two sessions of reverse order and never re-run. vmstat records the host beside them.
# Run as: flock <host-test.lock> timeout 1500 bash batchD.sh <scratch dir>
S=$1; out=$S/out; pgn="$S/main/.grugops/context/qe-ABC-279/raw/out/c2/d.pgn"
echo "D start $(date -u +%FT%TZ)" >> "$out/holds.txt"
vmstat -n 5 > "$out/D-vmstat.txt" & VM=$!
sess() { local f=$1 o=$2; shift 2; { echo "start $(date -u +%FT%TZ) $(cut -d' ' -f1-3 /proc/loadavg)"; env "$@" timeout 300 node "$S/scripts/g2.ts" "$S" $o "$pgn"; echo "exit $?"; echo "end $(date -u +%FT%TZ) $(cut -d' ' -f1-3 /proc/loadavg)"; } > "$f" 2>&1; }
void() { local c; c=$(grep -o 'c_s=[0-9.]*' "$1" | cut -d= -f2); [ -z "$c" ] && return 0; awk -v c="$c" 'BEGIN{exit !(c<0.970||c>1.030)}'; }
for o in B,C,H,X X,H,C,B; do
  f="$out/D-PR8-${o//,/}.out"; sess "$f" $o ENTRY=hot
  if void "$f"; then echo "D-PR8-${o//,/} void, re-run once" >> "$out/exits.txt"; sess "$out/D-PR8-${o//,/}-rerun.out" $o ENTRY=hot; fi
done
for o in B,C,H,X X,H,C,B; do sess "$out/D-PR10-bypass-${o//,/}.out" $o ENTRY=bypass; done
for o in B,C,H,X X,H,C,B; do { echo "start $(date -u +%FT%TZ) $(cut -d' ' -f1-3 /proc/loadavg)"; timeout 400 node "$S/scripts/nsnode.ts" "$S" $o 8; echo "exit $?"; echo "end $(date -u +%FT%TZ) $(cut -d' ' -f1-3 /proc/loadavg)"; } > "$out/D-PR10-nsnode-${o//,/}.out" 2>&1; done
kill $VM
echo "D end $(date -u +%FT%TZ)" >> "$out/holds.txt"
