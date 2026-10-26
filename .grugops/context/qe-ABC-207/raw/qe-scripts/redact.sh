# qe-ABC-207 redaction (ABC-204 QE package.sh's red(), ADR-0049 d4): every path to redact is computed at run time, so
# this file carries none. Source it with SCR, WTDIR and REPO set; then `red <file>` prints the redacted text.
HOST=$(hostname -s); USERN=$(whoami); EMAIL=$(git -C "$WTDIR" config user.email); TMPROOT=$(dirname "$(dirname "$(dirname "$SCR")")")
CUTEDIR=$(dirname "$(grep -o '^const CUTECHESS = "[^"]*"' "$WTDIR/tools/rating/rating.ts" | sed -E 's/.*"(.*)"/\1/')")
red() { sed -e "s#$SCR#<scratchpad>/qe207#g" -e "s#$WTDIR#<worktree>#g" -e "s#$REPO#<repo>#g" -e "s#$CUTEDIR#<local build dir>#g" \
            -e "s#$TMPROOT#<tmp>#g" -e "s#$HOME#<home>#g" -e "s#$HOST#<host>#g" -e "s#$USERN#<user>#g" "$1"; }
leaks() { grep -l -r -F -e "$USERN" -e "$HOST" -e "$EMAIL" -e "<tmp>" -e "<home>" -e "/Users/" -e "/private/" "$1"; }
