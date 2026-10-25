#!/bin/bash
# usage: package.sh <reading-dir> <mode r|d> <dest-raw-dir>
# Redacts personal paths (ADR-0049 d4), gzips the .out, copies the small raw files, writes SHA256SUMS.
set -eu
DIR=$1; MODE=$2; DEST=$3
SCR=<scratchpad>
HOST=$(hostname -s)
red() { sed -e "s#$SCR#<scratchpad>#g" -e "s#<worktree>#<worktree>#g" \
            -e "s#<home>#<home>#g" -e "s#$HOST#<host>#g" "$1"; }
mkdir -p "$DEST"
OUT=$DIR/out
# the harness's own SHA256SUMS, over the unredacted bytes (kept in the scratchpad)
cp "$OUT/SHA256SUMS" "$DEST/SHA256SUMS.harness-unredacted"
for f in $(cd "$OUT" && ls -p | grep -v / | grep -v SHA256SUMS); do
  case "$f" in
    $MODE.out) red "$OUT/$f" > "$DEST/$f.redacted"; gzip -9 -n -c "$DEST/$f.redacted" > "$DEST/$f.gz" ;;
    build-*.log) red "$OUT/$f" > "$DEST/$f" ;;
    *) red "$OUT/$f" > "$DEST/$f" ;;
  esac
done
for f in wait.log sampler.log games.log harness.stdout; do red "$DIR/mon/$f" > "$DEST/mon-$f"; done
[ -f "$DIR/qe-analysis.json" ] && red "$DIR/qe-analysis.json" > "$DEST/qe-analysis.json"
[ -f "$DIR/dist-manifest.txt" ] && cp "$DIR/dist-manifest.txt" "$DEST/"
# raw .out sha (unredacted) and redacted sha, then the gz; the redacted plain .out is not committed
RAWSHA=$(shasum -a 256 "$OUT/$MODE.out" | cut -d' ' -f1)
REDSHA=$(shasum -a 256 "$DEST/$MODE.out.redacted" | cut -d' ' -f1)
rm "$DEST/$MODE.out.redacted"
( cd "$DEST" && { echo "# $MODE.out unredacted (scratchpad only): $RAWSHA";
  echo "# $MODE.out redacted (= gunzip of $MODE.out.gz): $REDSHA";
  shasum -a 256 $(ls | grep -v '^SHA256SUMS$' | sort); } > SHA256SUMS )
grep -l -r -E "<user>|$HOST|/private/tmp" "$DEST" && { echo "REDACTION LEAK"; exit 4; } || echo "redaction clean"
