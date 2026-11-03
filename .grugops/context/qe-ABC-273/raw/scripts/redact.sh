#!/usr/bin/env bash
# qe-ABC-273 (written after the seal; records handling only, not the read method): copy a run's records (not the clone)
# into raw/out with host paths, user and host name as placeholders (ADR-0049 d4). The originals' sha256 list is kept as
# SHA256SUMS.unredacted-originals. A cutechess -debug .out keeps its sha256 and only its non-debug lines
# (<name>.summary.out), as qe-ABC-269 did; the full log stayed in scratch. usage: redact.sh <src-dir> <dst-dir> <run-out-dir>
set -eu
SRC=$1; DST=$2; RUN=$3; mkdir -p "$DST"
SCR=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad
red() { sed -e "s#$RUN#<out>#g" -e "s#$SCR#<scratch>#g" \
  -e "s#$HOME/projects/public/skytalix/.claude/worktrees/qe-ABC-273#<repo>#g" \
  -e "s#$CUTECHESS_CLI#<cutechess-cli>#g" -e "s#$STOCKFISH#<stockfish>#g" -e "s#$(command -v node)#<node>#g" \
  -e "s#$HOME#<home>#g" -e "s#$(hostname)#<host>#g" -e "s#\b$(id -un)\b#<user>#g"; }
( cd "$SRC" && find . -maxdepth 1 -type f -printf '%f\n' | sort | xargs sha256sum ) > "$DST/SHA256SUMS.unredacted-originals"
for f in $(cd "$SRC" && find . -maxdepth 1 -type f -printf '%f\n' | sort); do
  case "$f" in
    *.out) grep -Ev '^[0-9]+ [<>]' "$SRC/$f" | red > "$DST/${f%.out}.summary.out" ;;
    *) red < "$SRC/$f" > "$DST/$f" ;;
  esac
done
