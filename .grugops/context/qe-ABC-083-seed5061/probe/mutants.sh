#!/usr/bin/env bash
# QE ABC-083 mutants: each is ONE perl substitution on a scratch copy of the branch's src/evaluate.ts.
# needs bash >= 4 (associative array); macOS /bin/bash is 3.2.
# usage: mutants.sh <branch-tree> <scratch-root> <outdir> <scope: eval|all> [ids...]
set -u
BR=$1; SC=$2; O=$3; SCOPE=$4; shift 4
declare -A M
M[K1-shelter-sign]='s/if \(!sheltered\) penalty \+= KING_SHELTER_MISSING_PENALTY;/if (!sheltered) penalty -= KING_SHELTER_MISSING_PENALTY;/'
M[K2-own-file-only]='s/const fromFile = kingFile === 0 \? 0 : kingFile - 1;/const fromFile = kingFile;/; s/const toFile = kingFile === 7 \? 7 : kingFile \+ 1;/const toFile = kingFile;/'
M[K3-half-open-free]='s/penalty \+= enemy \? KING_FILE_HALF_OPEN_PENALTY : KING_FILE_OPEN_PENALTY/penalty += enemy ? 0 : KING_FILE_OPEN_PENALTY/'
M[K4-black-step]='s/kingExposure\(board, blackKing, BLACK_PAWN, PAWN, -1\)/kingExposure(board, blackKing, BLACK_PAWN, PAWN, 1)/'
M[K5-no-edge-clamp]='s/const fromFile = kingFile === 0 \? 0 : kingFile - 1;/const fromFile = kingFile - 1;/; s/const toFile = kingFile === 7 \? 7 : kingFile \+ 1;/const toFile = kingFile + 1;/'
M[K6-shelter-rank1-only]='s/\(shelterRank2 >= 0 && shelterRank2 <= 7 && board\[shelterRank2 \* 16 \+ file\] === ownPawn\)/false/'
M[K7-file-scan-2to5]='s/for \(let rank = 1; rank <= 6; rank\+\+\)/for (let rank = 2; rank <= 5; rank++)/'
M[K8-ks-off]='s/^const KING_SHELTER_MISSING_PENALTY = 15;/const KING_SHELTER_MISSING_PENALTY = 0;/m; s/^const KING_FILE_HALF_OPEN_PENALTY = 10;/const KING_FILE_HALF_OPEN_PENALTY = 0;/m; s/^const KING_FILE_OPEN_PENALTY = 20;/const KING_FILE_OPEN_PENALTY = 0;/m'
M[M1-no-clamp]='s/Math\.max\(-MOBILITY_CAP, Math\.min\(MOBILITY_CAP, mobilityWeight \* mobility\)\)/mobilityWeight * mobility/'
M[M2-white-only]='s/mobility \+= black \? -reached : reached;/mobility += black ? 0 : reached;/'
M[M3-sign]='s/mobility \+= black \? -reached : reached;/mobility += black ? reached : -reached;/'
M[M4-count-own]='s/if \(target === EMPTY \|\| isBlack\(target\) !== black\) count\+\+;/count++;/'
M[M5-no-capture-square]='s/      if \(isBlack\(target\) !== black\) count\+\+;\n      break;/      break;/'
M[M6-mobility-off]='s/^const MOBILITY_WEIGHT = 4;/const MOBILITY_WEIGHT = 0;/m'
M[M7-cap-per-side-200]='s/^const MOBILITY_CAP = 100;/const MOBILITY_CAP = 200;/m'
M[P1-impure]='s/(  const board = position\.board;\n  let score = 0;\n  let mobility = 0;)/$1\n  board[8] = ((board[8] as number) + 1) & 0xff;/'
M[D1-door-weight]='s/const score = whiteMinusBlack\(position, 0\);/const score = whiteMinusBlack(position, MOBILITY_WEIGHT);/'
M[E8-right-file-only]='s/\(\(\(1 << file\) << 1\) \| \(\(1 << file\) >> 1\)\) & 0xff/((1 << file) << 1) & 0xff/'
M[E9-left-file-only]='s/\(\(\(1 << file\) << 1\) \| \(\(1 << file\) >> 1\)\) & 0xff/((1 << file) >> 1) & 0xff/'
ids=("$@"); [ ${#ids[@]} -eq 0 ] && ids=($(printf '%s\n' "${!M[@]}" | sort))
for id in "${ids[@]}"; do
  d="$SC/mut-$id"; rm -rf "$d"; mkdir -p "$d"
  git -C "$BR" archive HEAD | tar -x -C "$d"; ln -s "$BR/node_modules" "$d/node_modules"
  perl -0pi -e "${M[$id]}" "$d/src/evaluate.ts"
  n=$(/usr/bin/diff "$BR/src/evaluate.ts" "$d/src/evaluate.ts" | grep -cE '^[<>]')
  if [ "$n" -eq 0 ]; then echo -e "$id\tNOT-APPLIED"; continue; fi
  if [ "$SCOPE" = eval ]; then files="src/evaluate.king-mobility.test.ts src/evaluate.pawns.test.ts src/evaluate.test.ts"; else files=""; fi
  ( cd "$d" && npx vitest run $files ) > "$O/mut-$SCOPE-$id.log" 2>&1; ec=$?
  red=$(grep -E '^\s+(×|FAIL) ' "$O/mut-$SCOPE-$id.log" | sed -E 's/^\s+(×|FAIL) //; s/ [0-9]+ms$//' | sort -u | head -12 | paste -sd '|' -)
  tot=$(grep -E '^\s+Tests ' "$O/mut-$SCOPE-$id.log" | tr -s ' ')
  echo -e "$id\tlines=$n\texit=$ec\t$tot\tRED: ${red:-none}"
done
