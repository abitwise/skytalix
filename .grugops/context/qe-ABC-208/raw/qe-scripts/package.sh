#!/bin/bash
# usage: package.sh <scratch> <reading-dir> <dest-raw-dir>   (D mode only)
# qe-ABC-208 (qe-ABC-207 package207.sh; ABC-204 QE package.sh; red() in redact.sh): redacts personal paths (ADR-0049 d4), gzips the .out, copies the small raw files, writes SHA256SUMS.
# Every path to redact is computed at run time, so this file carries none.
set -eu
SCR=$1; DIR=$2; DEST=$3; MODE=d; WTDIR=${WTDIR:?set WTDIR to the worktree}
. "$SCR/scripts/redact.sh"
mkdir -p "$DEST"
OUT=$DIR/out
cp "$OUT/SHA256SUMS" "$DEST/SHA256SUMS.harness-unredacted.tmp"; red "$DEST/SHA256SUMS.harness-unredacted.tmp" > "$DEST/SHA256SUMS.harness-unredacted"; rm "$DEST/SHA256SUMS.harness-unredacted.tmp"
for f in $(cd "$OUT" && ls -p | grep -v / | grep -v SHA256SUMS); do
  case "$f" in
    $MODE.out) red "$OUT/$f" > "$DEST/$f.redacted"; gzip -9 -n -c "$DEST/$f.redacted" > "$DEST/$f.gz" ;;
    *) red "$OUT/$f" > "$DEST/$(echo $f | sed -E 's/\.log$/.log.txt/')" ;;
  esac
done
for f in wait.log sampler.log games.log harness.stdout; do [ -f "$DIR/mon/$f" ] && red "$DIR/mon/$f" > "$DEST/mon-$f.txt"; done
[ -f "$DIR/qe-analysis.json" ] && red "$DIR/qe-analysis.json" > "$DEST/qe-analysis.json"
for f in analyse.txt qe-load-free.txt overlap.txt; do [ -f "$DIR/$f" ] && red "$DIR/$f" > "$DEST/$f"; done
RAWSHA=$(shasum -a 256 "$OUT/$MODE.out" | cut -d' ' -f1)
REDSHA=$(shasum -a 256 "$DEST/$MODE.out.redacted" | cut -d' ' -f1)
rm "$DEST/$MODE.out.redacted"
( cd "$DEST" && { echo "# $MODE.out unredacted (scratchpad only): $RAWSHA";
  echo "# $MODE.out redacted (= gunzip of $MODE.out.gz): $REDSHA";
  shasum -a 256 $(ls | grep -v '^SHA256SUMS$' | sort); } > SHA256SUMS )
if leaks "$DEST"; then echo "REDACTION LEAK"; exit 4; else echo "redaction clean"; fi
