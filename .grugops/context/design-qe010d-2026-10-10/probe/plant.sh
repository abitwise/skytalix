#!/bin/bash
# Architect's own harness for QE-010-d. Usage: plant.sh <repo> <sha> <trees-dir> <plant-name> <out-dir>
# Builds a fresh out-of-tree `git archive` of <sha>, applies one plant, then reads:
#   guard = the 9(e) guard alone (src/fen.test.ts, -t "parseFenGrammarOnly guard")
#   suite = the whole vitest suite (failing test names)
#   lint  = biome check .      tsc = tsc --noEmit
set -u
REPO=$1; SHA=$2; TREES=$3; P=$4; OUT=$5
T="$TREES/$P"
rm -rf "$T"; mkdir -p "$T"
git -C "$REPO" archive "$SHA" | tar -x -C "$T"
ln -s "$REPO/node_modules" "$T/node_modules"
H="$T/src/history.ts"
EXP='export { parseFenGrammarOnly as __qePlant } from'
case "$P" in
  CONTROL) ;;
  POS-flat-ts) printf '\n%s "./fen.ts";\n' "$EXP" >> "$H" ;;
  N1-nested-ts) mkdir -p "$T/src/qeplant"; printf '%s "../fen.ts";\n' "$EXP" > "$T/src/qeplant/x.ts" ;;
  N1-nested-ts-live) mkdir -p "$T/src/qeplant"; printf '%s "../fen.ts";\n' "$EXP" > "$T/src/qeplant/x.ts"
     printf '\nexport { __qePlant } from "./qeplant/x.ts";\n' >> "$H" ;;
  N1-nested-mts) mkdir -p "$T/src/qeplant"; printf '%s "../fen.ts";\n' "$EXP" > "$T/src/qeplant/x.mts" ;;
  N2-flat-mts) printf '%s "./fen.ts";\n' "$EXP" > "$T/src/qeplant.mts" ;;
  N2-flat-mts-live) printf '%s "./fen.ts";\n' "$EXP" > "$T/src/qeplant.mts"
     printf '\nexport { __qePlant } from "./qeplant.mts";\n' >> "$H" ;;
  N2-flat-js-live) printf '%s "./fen.ts";\n' "$EXP" > "$T/src/qeplant.js"
     printf '\nexport { __qePlant } from "./qeplant.js";\n' >> "$H" ;;
  N3-concat) sed -i '' '1i\
import * as qeFen from "./fen.ts";
' "$H"; printf '\nexport const __qePlant = (qeFen as Record<string, unknown>)["parseFen" + "GrammarOnly"];\n' >> "$H" ;;
  N3-template) sed -i '' '1i\
import * as qeFen from "./fen.ts";
' "$H"; printf '\nconst qeKey = `parseFen${"GrammarOnly"}` as const;\nexport const __qePlant = qeFen[qeKey];\n' >> "$H" ;;
  N3-escape) sed -i '' '1i\
import * as qeFen from "./fen.ts";
' "$H"; printf '\nexport const __qePlant = qeFen.parseFen\\u0047rammarOnly;\n' >> "$H" ;;
  *) echo "unknown plant $P"; exit 2 ;;
esac
cd "$T" || exit 2
{
  echo "plant $P  sha $SHA  at $(date -u +%Y-%m-%dT%H:%M:%SZ)  load1 $(sysctl -n vm.loadavg | awk '{print $2}')"
  echo "--- diff vs archive (src only)"
  ( cd "$T" && find src -newer package.json -type f | sort ) | sed 's/^/  touched-or-new: /'
  ./node_modules/.bin/vitest run src/fen.test.ts -t "parseFenGrammarOnly guard" > "$OUT/$P.guard.txt" 2>&1; echo "guard exit $?  $(grep -E '^ +Tests ' "$OUT/$P.guard.txt" | tr -s ' ')"
  ./node_modules/.bin/vitest run > "$OUT/$P.suite.txt" 2>&1; echo "suite exit $?  $(grep -E '^ +Test Files ' "$OUT/$P.suite.txt" | tr -s ' ') | $(grep -E '^ +Tests ' "$OUT/$P.suite.txt" | tr -s ' ')"
  grep -E '^ +(×|FAIL) ' "$OUT/$P.suite.txt" | sed 's/^ */  red: /' | sort -u | head -8
  ./node_modules/.bin/biome check . > "$OUT/$P.lint.txt" 2>&1; echo "lint exit $?  $(grep -E '^Checked' "$OUT/$P.lint.txt")"
  ./node_modules/.bin/tsc --noEmit > "$OUT/$P.tsc.txt" 2>&1; echo "tsc exit $?  $(head -2 "$OUT/$P.tsc.txt" | tr '\n' ' ')"
} | tee "$OUT/$P.summary.txt"
