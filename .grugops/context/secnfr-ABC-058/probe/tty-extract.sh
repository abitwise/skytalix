#!/bin/bash
# Re-reads tty-*.bin (written by tty.sh) with ESC sequences removed for the summary and the first
# assertion only; the byte counts are taken on the RAW transcript. Usage: tty-extract.sh <probe-dir>
cd "$1" || exit 2
for B in tty-ctl.bin tty-M3h.bin tty-Q1-BEL.bin tty-Q2-ESC.bin tty-NOFILT-h.bin tty-NOFILT-b.bin; do
  P=$(LC_ALL=C sed $'s/\033\\[[0-9;?]*[A-Za-z]//g' "$B" | tr -d '\r')
  printf "%-16s %-40s raw: BEL %s DEL %s ESC[2J %s 'purple' %s\n" "$B" "$(echo "$P" | grep -aE '^ +Tests ' | tail -1 | sed 's/^ *//')" \
    "$(LC_ALL=C tr -cd '\007' < "$B" | wc -c | tr -d ' ')" "$(LC_ALL=C tr -cd '\177' < "$B" | wc -c | tr -d ' ')" \
    "$(LC_ALL=C grep -ac $'\033\\[2J' "$B")" "$(LC_ALL=C grep -ac purple "$B")"
  echo "$P" | grep -a -E "AssertionError" | sed 's/^/                 assertion: /'
done
