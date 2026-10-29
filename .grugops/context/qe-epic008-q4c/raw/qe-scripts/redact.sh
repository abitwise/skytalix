# qe-epic008-q4c redaction (from qe-epic008-close) (qe-ABC-208 redact.sh, Linux; ADR-0049 d4): every path to redact is computed at run time,
# so this file carries none. Source it with SCR, WTDIR, REPO, CUTECHESS_CLI and STOCKFISH set; `red <file>` prints the redacted text.
HOST=$(hostname -s); USERN=$(whoami); EMAIL=$(git -C "$WTDIR" config user.email); NODEBIN=$(readlink -f "$(command -v node)")
TMPROOT=$(echo "$SCR" | cut -d/ -f1-3); CUTEDIR=$(dirname "$CUTECHESS_CLI")
red() { sed -e "s#$SCR#<scratchpad>/qeq4c#g" -e "s#$WTDIR#<worktree>#g" -e "s#$REPO#<repo>#g" \
            -e "s#$CUTECHESS_CLI#<cutechess-cli>#g" -e "s#$CUTEDIR#<local build dir>#g" -e "s#$STOCKFISH#<stockfish>#g" \
            -e "s#$NODEBIN#<node>#g" -e "s#$TMPROOT#<tmp>#g" -e "s#$HOME#<home>#g" -e "s#$HOST#<host>#g" -e "s#$USERN#<user>#g" "$1"; }
leaks() { grep -l -r -F -e "$USERN" -e "$HOST" -e "$EMAIL" -e "<tmp>" -e "<home>" -e "/home/" -e "/tmp/" -e "/usr/local" -e ".nvm" "$1"; }
