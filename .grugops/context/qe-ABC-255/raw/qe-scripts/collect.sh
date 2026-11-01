#!/usr/bin/env bash
# copy one read's small records into the worktree context raw dir, host paths -> placeholders; debug log as .xz
# usage: collect.sh <label a3|a4|a5> <mode d|r>
set -eu
SP=<scratch>
Q=$SP/qe-255; W=<worktree>
L=$1; M=$2; O=$Q/out-$L; D=$W/.grugops/context/qe-ABC-255/raw/$L
mkdir -p $D
red() { sed -e "s#$SP#<scratch>#g" -e "s#$W#<worktree>#g" -e "s#<cutechess-cli>#<cutechess-cli>#g" -e "s#/usr/local/bin/stockfish#<stockfish>#g" -e "s#<home>/.nvm/versions/node/v26.12.1/bin/node#<node>#g" -e "s#<home>#<home>#g" -e "s#\bolger\b#<user>#g" -e "s#$(hostname)#<host>#g"; }
for f in SHA256SUMS artifacts.txt cmd.txt host.log machine.txt summary.txt $M.pgn $(cd $O && ls build-*.log); do red < $O/$f > $D/$f; done
mv $D/SHA256SUMS $D/SHA256SUMS.unredacted-originals
red < $O/$M.out | xz -9 -T1 > $D/$M.out.xz
for f in skytalix.stderr base.stderr stockfish.stderr; do [ -e $O/$f ] && echo "$f $(stat -c %s $O/$f) bytes" >> $D/stderr-sizes.txt; done
red < $Q/run/$L-read.txt > $D/read.txt
mkdir -p $D/block; for f in block.log samples.log; do red < $Q/run/$L-block/$f > $D/block/$f; done
red < $Q/run/$L.lock.txt > $D/block/lock.txt
grep -rl "<home>\|$SP" $D && echo "LEAK" || echo "no host paths in $D"
du -sh $D
