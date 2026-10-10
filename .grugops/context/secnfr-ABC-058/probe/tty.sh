#!/bin/bash
# Security/NFR ABC-058: a RED bar 3 run under a real pseudo-TTY (script(1)), closing QE's
# "TTY run UNKNOWN - verify" (…ebb74095). Out-of-tree `git archive` trees, node_modules symlinked,
# `npx vitest run src/cli.test.ts` alone. Counts BEL, DEL, ESC[2J, "purple" and the raw token bytes
# in the transcript the terminal would have received. Usage: tty.sh <scratch-dir>
set -u
SP=$1; PR=$SP/probe; OUT=$PR/tty.out.txt; : > "$OUT"
FILT='code < 0x20 || code === 0x7f) continue;'
restore() { local T=$SP/tree-$1; rm -rf "$T/src"; cp -R "$T.pristine" "$T/src"; /usr/bin/diff -r "$T/src" "$T.pristine" >/dev/null || { echo RESTORE FAILED; exit 2; }; }
probe() { # label tree [anchor replacement]
  local T=$SP/tree-$2 B=$PR/tty-$1.bin
  if [ $# -ge 4 ]; then node "$PR/mutate.cjs" "$T/src/cli.ts" "$3" "$4" || { echo "$1 ABORTED" >> "$OUT"; return; }; fi
  local L; L=$(sysctl -n vm.loadavg | awk '{print $2}')
  (cd "$T" && script -q "$B" npx vitest run src/cli.test.ts </dev/null >/dev/null 2>&1)
  restore "$2"
  printf "%-10s load1 %-5s %-34s BEL %s DEL %s ESC[2J %s 'purple' %s  BEL-ESC[2J-purple-DEL run %s\n" "$1" "$L" \
    "$(LC_ALL=C grep -aoE 'Tests +[0-9].*\)' "$B" | tail -1 | sed $'s/\033\\[[0-9;]*m//g')" \
    "$(LC_ALL=C tr -cd '\007' < "$B" | wc -c | tr -d ' ')" "$(LC_ALL=C tr -cd '\177' < "$B" | wc -c | tr -d ' ')" \
    "$(LC_ALL=C grep -ac $'\033\\[2J' "$B")" "$(LC_ALL=C grep -ac purple "$B")" \
    "$(LC_ALL=C grep -ac $'\007\033\\[2Jpurple\177' "$B")" >> "$OUT"
  LC_ALL=C grep -a -m1 -oE 'AssertionError: [^'$'\r'']*' "$B" | sed $'s/\033\\[[0-9;]*m//g; s/^/           first assertion: /' >> "$OUT"
}
echo "node $(node --version)  $(date -u +%FT%TZ)  stdout of vitest is a pty (script -q)" >> "$OUT"
probe ctl      head
probe M3h      head 'code < 0x20 || code === 0x7f' 'code < 0x20 && code !== 0x7f'
probe Q1-BEL   head "$FILT" '(code < 0x20 && character !== "\u0007") || code === 0x7f) continue;'
probe Q2-ESC   head "$FILT" '(code < 0x20 && character !== "\u001b") || code === 0x7f) continue;'
probe NOFILT-h head "$FILT" 'false) continue;'
probe NOFILT-b base "$FILT" 'false) continue;'
cat "$OUT"
