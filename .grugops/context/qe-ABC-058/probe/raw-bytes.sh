#!/bin/bash
# Clause (c) input for Security/NFR: when bar 3 goes RED, which raw control bytes does the run's own
# output carry? Reuses the pristine trees mutants.sh built (tree-head = fb914ded, tree-base = b21ec7cf).
# Output captured to a file (non-TTY). Counts BEL, ESC, DEL, ESC[2J, the literal "purple", and the
# distinct ESC sequences. Usage: raw-bytes.sh  (after mutants.sh has run for head and base)
set -u
SP=$(cd "$(dirname "$0")" && pwd)
FILT='code < 0x20 || code === 0x7f) continue;'
probe() { # label tree anchor replacement
  local T=$SP/tree-$2 B=$SP/raw-$1.bin
  node "$SP/mutate.cjs" "$T/src/cli.ts" "$3" "$4" || return
  (cd "$T" && npx vitest run src/cli.test.ts > "$B" 2>&1)
  rm -rf "$T/src"; cp -R "$T.pristine" "$T/src"; /usr/bin/diff -r "$T/src" "$T.pristine" > /dev/null || { echo RESTORE FAILED; exit 2; }
  printf "%-12s %-26s BEL %s  ESC %s  DEL %s  ESC[2J %s  'purple' %s  ESC-seqs: %s\n" "$1" "$(grep -E '^ +Tests +[0-9]' "$B" | sed 's/^ *//')" \
    "$(LC_ALL=C tr -cd '\007' < "$B" | wc -c | tr -d ' ')" "$(LC_ALL=C tr -cd '\033' < "$B" | wc -c | tr -d ' ')" \
    "$(LC_ALL=C tr -cd '\177' < "$B" | wc -c | tr -d ' ')" "$(LC_ALL=C grep -c $'\033\\[2J' "$B")" "$(LC_ALL=C grep -c purple "$B")" \
    "$(LC_ALL=C grep -ao $'\033\\[[0-9;]*[A-Za-z]' "$B" | sed 's/\x1b/ESC/' | sort | uniq -c | awk '{printf "%sx%s ", $1, $2}')"
  LC_ALL=C grep -a -m1 "AssertionError" "$B" | sed 's/^/             first assertion: /'
}
probe head-ctl  head 'const INTERNAL_ERROR_EXIT_CODE = 70;' 'const INTERNAL_ERROR_EXIT_CODE = 70;'
probe head-M3h  head 'code < 0x20 || code === 0x7f' 'code < 0x20 && code !== 0x7f'
probe head-Q1   head "$FILT" '(code < 0x20 && character !== "\u0007") || code === 0x7f) continue;'
probe head-Q2   head "$FILT" '(code < 0x20 && character !== "\u001b") || code === 0x7f) continue;'
probe base-Q2   base "$FILT" '(code < 0x20 && character !== "\u001b") || code === 0x7f) continue;'
