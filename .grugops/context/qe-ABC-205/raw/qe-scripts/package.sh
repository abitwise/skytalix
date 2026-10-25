#!/bin/bash
# usage: package.sh <scratch> <reading-dir> <dest-raw-dir>   (D mode only)
# ABC-204 QE package.sh: redacts personal paths (ADR-0049 d4), gzips the .out, copies the small raw files, writes SHA256SUMS.
# Every path to redact is computed at run time, so this file carries none.
set -eu
SCR=$1; DIR=$2; DEST=$3; MODE=d; WTDIR=${WTDIR:?set WTDIR to the worktree}
HOST=$(hostname -s); USERN=$(whoami); TMPROOT=$(dirname "$(dirname "$(dirname "$SCR")")")
red() { sed -e "s#$SCR#<scratchpad>#g" -e "s#$WTDIR#<worktree>#g" -e "s#$TMPROOT#<tmp>#g" \
            -e "s#$HOME#<home>#g" -e "s#<tmp>#<tmp>#g" -e "s#$HOST#<host>#g" -e "s#$USERN#<user>#g" "$1"; }
mkdir -p "$DEST"
OUT=$DIR/out
cp "$OUT/SHA256SUMS" "$DEST/SHA256SUMS.harness-unredacted.tmp"; red "$DEST/SHA256SUMS.harness-unredacted.tmp" > "$DEST/SHA256SUMS.harness-unredacted"; rm "$DEST/SHA256SUMS.harness-unredacted.tmp"
for f in $(cd "$OUT" && ls -p | grep -v / | grep -v SHA256SUMS); do
  case "$f" in
    $MODE.out) red "$OUT/$f" > "$DEST/$f.redacted"; gzip -9 -n -c "$DEST/$f.redacted" > "$DEST/$f.gz" ;;
    *) red "$OUT/$f" > "$DEST/$f" ;;
  esac
done
for f in wait.log sampler.log games.log harness.stdout; do [ -f "$DIR/mon/$f" ] && red "$DIR/mon/$f" > "$DEST/mon-$f"; done
[ -f "$DIR/qe-analysis.json" ] && red "$DIR/qe-analysis.json" > "$DEST/qe-analysis.json"
RAWSHA=$(shasum -a 256 "$OUT/$MODE.out" | cut -d' ' -f1)
REDSHA=$(shasum -a 256 "$DEST/$MODE.out.redacted" | cut -d' ' -f1)
rm "$DEST/$MODE.out.redacted"
( cd "$DEST" && { echo "# $MODE.out unredacted (scratchpad only): $RAWSHA";
  echo "# $MODE.out redacted (= gunzip of $MODE.out.gz): $REDSHA";
  shasum -a 256 $(ls | grep -v '^SHA256SUMS$' | sort); } > SHA256SUMS )
if grep -l -r -E "$USERN|$HOST|<tmp>|/Users/" "$DEST"; then echo "REDACTION LEAK"; exit 4; else echo "redaction clean"; fi
