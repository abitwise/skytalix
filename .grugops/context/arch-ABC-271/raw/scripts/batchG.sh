# Batch G (arch-ABC-271): G2, two sessions in reverse order, one flock hold. Run as: flock <lock> timeout 900 bash batchG.sh <scratch dir> <pgn>
S=$1; out=$S/out
for o in B,C,H H,C,B; do { echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) $(uptime)"; node $S/scripts/g2.ts $S $o $2; echo "exit $?"; echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ) $(uptime)"; } > "$out/G-${o//,/}.out" 2>&1; done
