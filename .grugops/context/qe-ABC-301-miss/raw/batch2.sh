#!/bin/bash
# qe-ABC-301-miss batch 2: F4's defect check. Each stage takes the host lock on its own, so the other agent can run between stages.
# usage: batch2.sh <lock> <cand clone at dd88560f> <repro clone at b297ab89> <lichess pgn.zst> <outdir> <rawdir>
L=$1; C=$2; P=$3; LI=$4; O=$5; D=$6
mkdir -p $O/gate $O/repro
stage() { # name tree args...
  local n=$1 t=$2; shift 2
  echo "$(date -u +%FT%TZ) $n start" >> $D/batch2.log
  (cd $t && flock $L /usr/bin/time -v timeout 3500 node --max-old-space-size=3000 tools/tune/tune.ts "$@" > $O/$n.out 2> $O/$n.err)
  local rc=$?
  echo "$(date -u +%FT%TZ) $n exit $rc wall $(grep 'Elapsed (wall' $O/$n.err | awk '{print $NF}')" >> $D/batch2.log
  return $rc
}
: > $D/batch2.log
stage gate-extract $C extract $O/gate --lichess $LI
stage repro-extract $P extract $O/repro --lichess $LI || exit 1
stage repro-fit $P fit $O/repro || exit 1
stage repro-emit $P emit $O/repro || exit 1
echo "cand  $(sha256sum < $C/src/evaluate-params.ts)" >> $D/batch2.log
echo "repro $(sha256sum < $P/src/evaluate-params.ts)" >> $D/batch2.log
echo "cmp $(cmp $C/src/evaluate-params.ts $P/src/evaluate-params.ts && echo byte-identical)" >> $D/batch2.log
