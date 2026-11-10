#!/usr/bin/env bash
# qe-ABC-316 (written after the seal; records handling only, not the read method). Adapted from qe-ABC-295's redact.sh.
# Copy one level's records (not the clone) into raw/out with host paths, user and host name as placeholders (ADR-0049 d4).
# The level's out dir is written <out>, the stage-B out-root <out-root>, the session scratch dir <scratch>. The originals'
# sha256 list is kept as SHA256SUMS.unredacted-originals. A cutechess -debug .out keeps its sha256 and only its non-debug
# lines (<name>.summary.out); the full log stays in scratch.
# usage: CUTECHESS_CLI=... STOCKFISH=... redact.sh <src-dir-or-file...> -- <dst-dir> <level-out> <out-root> <scratch> <repo>
set -eu
SRCS=(); while [ "$1" != "--" ]; do SRCS+=("$1"); shift; done; shift
DST=$1; RUN=$2; ROOT=$3; SCR=$4; REPO=$5; mkdir -p "$DST"
red() { sed -e "s#$RUN#<out>#g" -e "s#$ROOT#<out-root>#g" -e "s#$SCR#<scratch>#g" -e "s#$REPO#<repo>#g" \
  -e "s#$CUTECHESS_CLI#<cutechess-cli>#g" -e "s#$STOCKFISH#<stockfish>#g" -e "s#$(command -v node)#<node>#g" \
  -e "s#$HOME#<home>#g" -e "s#$(hostname)#<host>#g" -e "s#\b$(id -un)\b#<user>#g"; }
files=(); for s in "${SRCS[@]}"; do
  if [ -d "$s" ]; then for f in $(find "$s" -maxdepth 1 -type f | sort); do files+=("$f"); done; else files+=("$s"); fi
done
: > "$DST/SHA256SUMS.unredacted-originals"
for f in "${files[@]}"; do
  b=$(basename "$f"); echo "$(sha256sum < "$f" | cut -c1-64)  $b" >> "$DST/SHA256SUMS.unredacted-originals"
  case "$b" in
    *.out) grep -Ev '^[0-9]+ [<>]' "$f" | red > "$DST/${b%.out}.summary.out" ;;
    *) red < "$f" > "$DST/$b" ;;
  esac
done
