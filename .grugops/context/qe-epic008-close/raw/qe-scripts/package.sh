#!/bin/bash
# usage: package.sh <scratch> <reading-dir> <dest-raw-dir>   (R mode)
# qe-epic008-close (qe-ABC-208 package.sh, R mode, Linux): redacts personal and host paths (ADR-0049 d4), gzips the .out,
# copies the small raw files, writes SHA256SUMS. Every path to redact is computed at run time, so this file carries none.
set -eu
SCR=$1; DIR=$2; DEST=$3; MODE=r; WTDIR=${WTDIR:?set WTDIR}; REPO=${REPO:?set REPO}
. "$SCR/scripts/redact.sh"
mkdir -p "$DEST"
OUT=$DIR/out
red "$OUT/SHA256SUMS" > "$DEST/SHA256SUMS.harness-unredacted"
for f in $(cd "$OUT" && ls -p | grep -v / | grep -v SHA256SUMS); do
  case "$f" in
    $MODE.out) red "$OUT/$f" > "$DEST/$f.redacted"; gzip -9 -n -c "$DEST/$f.redacted" > "$DEST/$f.gz" ;;
    *) red "$OUT/$f" > "$DEST/$(echo $f | sed -E 's/\.log$/.log.txt/')" ;;
  esac
done
for f in wait.log sampler.log games.log harness.stdout; do [ -f "$DIR/mon/$f" ] && red "$DIR/mon/$f" > "$DEST/mon-$f.txt"; done
for f in qe-analysis.json analyse.txt; do [ -f "$DIR/$f" ] && red "$DIR/$f" > "$DEST/$f"; done
RAWSHA=$(sha256sum "$OUT/$MODE.out" | cut -d' ' -f1)
REDSHA=$(sha256sum "$DEST/$MODE.out.redacted" | cut -d' ' -f1)
rm "$DEST/$MODE.out.redacted"
( cd "$DEST" && { echo "# $MODE.out unredacted (scratchpad only): $RAWSHA";
  echo "# $MODE.out redacted (= gunzip of $MODE.out.gz): $REDSHA";
  sha256sum $(ls | grep -v '^SHA256SUMS$' | sort); } > SHA256SUMS )
if leaks "$DEST"; then echo "REDACTION LEAK"; exit 4; else echo "redaction clean"; fi
