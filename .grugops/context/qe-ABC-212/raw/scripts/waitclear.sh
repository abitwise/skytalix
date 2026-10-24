#!/bin/bash
# Pause until the owner preconditions hold; poll every 90 s, give up after ~60 min (exit 4 = UNRESOLVED).
# usage: waitclear.sh <logfile>
d=$(dirname "$0"); n=0
until "$d/precheck.sh" >> "$1"; do n=$((n+1)); [ $n -ge 40 ] && { echo "UNRESOLVED after $n polls" >> "$1"; exit 4; }; sleep 90; done
