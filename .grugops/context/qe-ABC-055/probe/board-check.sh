#!/bin/bash
# QE ABC-055 board checker. Read-only. Run from the repository root.
#
#   bash .grugops/context/qe-ABC-055/probe/board-check.sh <board.md> <factory.config.json> [<ref-rev>]
#
# A1  the column H2 headings (every `^## ` except `## Columns` and `## Conventions`, with the
#     ` (WIP …)` / ` (visible, time-tracked)` suffix stripped) equal the first cell of the
#     `## Columns` table rows: same names, same order.
# A2  each limited heading's right number equals `.wip_limits[<name>]` in the config; columns with no
#     dial key read `(WIP unlimited)`, and `Blocked` reads `(visible, time-tracked)`.
# A3  each limited heading's left number equals the count of `- [` rows up to the next H2.
# REF (only with <ref-rev>) every `- [` row line and every `_Updated:` line of `<ref-rev>:plans/board.md`
#     is still present in <board.md>, in the same order. This is the post-merge check: A1-A3 alone
#     PASS a resolution that drops a row together with its count.
# Exit 0 when every check holds, 1 otherwise.
B="$1"; C="$2"; REF="$3"
[ -f "$B" ] && [ -f "$C" ] || { echo "usage: board-check.sh <board.md> <config.json> [<ref-rev>]" >&2; exit 2; }
EXCL='^## (Columns|Conventions)'
strip() { sed -E 's/^## //; s/ \((WIP [^)]*|visible, time-tracked)\)$//'; }
fail=0

heads=$(grep '^## ' "$B" | grep -Ev "$EXCL" | strip)
table=$(awk '/^## Columns/{f=1;next} f&&/^## /{exit} f&&/^\| *[A-Z]/&&!/^\| *Column/{print}' "$B" \
  | awk -F'|' '{gsub(/^ +| +$/,"",$2); print $2}')
echo "A1 headings=$(echo "$heads" | wc -l | tr -d ' ') table=$(echo "$table" | wc -l | tr -d ' ')"
if [ "$heads" == "$table" ]; then echo "A1 PASS"; else echo "A1 FAIL"; diff <(echo "$heads") <(echo "$table"); fail=1; fi

while IFS= read -r line; do
  name=$(echo "$line" | strip)
  paren=$(echo "$line" | sed -nE 's/.*\(([^)]*)\)$/\1/p')
  lim=$(jq -r --arg k "$name" '.wip_limits[$k] // "none"' "$C")
  rows=$(awk -v h="$line" '$0==h{f=1;next} f&&/^## /{exit} f&&/^- \[/{n++} END{print n+0}' "$B")
  if [ "$lim" = "none" ]; then
    exp="WIP unlimited"; [ "$name" = "Blocked" ] && exp="visible, time-tracked"
    if [ "$paren" = "$exp" ]; then s=ok; else s=BAD; fail=1; fi
    echo "  $name | ($paren) | dial=none | rows=$rows | A2 $s"
  else
    live=${paren#WIP }; live=${live%/*}; l=${paren#*/}
    if [ "$l" = "$lim" ]; then a2=ok; else a2=BAD; fail=1; fi
    if [ "$live" = "$rows" ]; then a3=ok; else a3=BAD; fail=1; fi
    echo "  $name | ($paren) | dial=$lim | rows=$rows | A2 $a2 | A3 $a3"
  fi
done < <(grep '^## ' "$B" | grep -Ev "$EXCL")

for k in $(jq -r '.wip_limits | keys[] | @base64' "$C"); do
  k=$(echo "$k" | base64 --decode)
  grep -q "^## $k (" "$B" || { echo "  dial key with no heading: $k"; fail=1; }
done

if [ -n "$REF" ]; then
  ref=$(git show "$REF:plans/board.md") || exit 2
  for pat in '^- \[' '^_Updated:'; do
    n=$(diff <(echo "$ref" | grep "$pat") <(grep "$pat" "$B") | grep -c '^<')
    echo "REF $REF: lines matching $pat missing or reordered = $n"
    [ "$n" = 0 ] || fail=1
  done
fi

if [ $fail = 0 ]; then echo "ALL PASS"; else echo "FAIL"; fi
exit $fail
