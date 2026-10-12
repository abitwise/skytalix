#!/bin/bash
# QE ABC-116 A2 spot check: alternating base/mutant pairs of
#   /usr/bin/time -l npx vitest run src/cli.test.ts
# Round 0 = warm-up (discarded). Rounds 1..PAIRS = paired readings; odd rounds base-first, even mutant-first.
# 60 s idle before the first run, >= 20 s before every later run.
# Logged before AND after each run (and polled each second during it): load1, thermal pressure, power source,
# foreign vitest processes (any process matching vitest not in this run's own process tree).
# A run with a foreign vitest seen at any point is DISCARDED and re-taken.
S="$1"; PAIRS="${2:-5}"
TSV="$S/qe-a2-runs.tsv"; LOG="$S/qe-a2-window.log"; OUT="$S/out"; mkdir -p "$OUT"
printf 'round\tslot\ttree\tattempt\tstart_utc\tload1_pre\tthermal_pre\tpower_pre\tforeign_pre\tforeign_during\tload1_post\tthermal_post\tpower_post\tforeign_post\treal_s\tuser_s\tsys_s\tcpu_s\texit\ttests\tverdict\n' > "$TSV"
: > "$LOG"
log() { echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $*" >> "$LOG"; }
load1() { sysctl -n vm.loadavg | awk '{print $2}'; }
thermal() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
power() { pmset -g batt | head -1 | sed -E "s/.*'(.*)'.*/\1/" | tr ' ' '_'; }
# descendants of $1 (inclusive), space-separated
tree_of() {
  ps -axo pid=,ppid= | awk -v r="$1" '{p[$1]=$2} END{s[r]=1; ch=1; while(ch){ch=0; for(k in p) if(!(k in s) && (p[k] in s)){s[k]=1; ch=1}} for(k in s) printf "%s ", k}'
}
# foreign vitest pids from ONE ps snapshot: matching [v]itest and not a descendant of root $1 (empty = none own)
foreign() {
  ps -axo pid=,ppid=,command= | awk -v r="${1:-0}" -v me="$$" '{p[$1]=$2; if ($0 ~ /[v]itest/) m[$1]=1}
    END{ for (k in m) { x=k; own=0; n=0; while (x!="" && x!=0 && n<64) { if (x==r) {own=1; break}; x=p[x]; n++ } if (!own && k!=me) printf "%s,", k } }'
}
foreign_detail() { ps -axo pid=,command= | awk '/[v]itest/' | cut -c1-200 >> "$LOG"; }

idle() { log "idle $1 s"; sleep "$1"; }

one_run() { # round slot tree
  local round=$1 slot=$2 tree=$3 attempt=0
  while :; do
    attempt=$((attempt+1))
    local waited=0
    while [ -n "$(foreign "")" ]; do
      [ "$waited" -ge 40 ] && { log "GIVING UP r$round $tree: foreign present for 40 waits"; return 1; }
      log "foreign present before r$round $tree (not launched): $(foreign "")"; foreign_detail; idle 30; waited=$((waited+1))
    done
    [ "$waited" -gt 0 ] && idle 20
    local start; start=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    local l1=$(load1) th=$(thermal) pw=$(power) fpre=$(foreign "")
    [ -n "$fpre" ] && { log "FOREIGN pre r$round $tree: $fpre"; foreign_detail; }
    local o="$OUT/r${round}-${tree}-a${attempt}"
    ( cd "$S/$tree" && exec /usr/bin/time -l -o "$o.time" npx vitest run src/cli.test.ts > "$o.out" 2>&1 ) &
    local root=$! fdur=""
    while kill -0 "$root" 2>/dev/null; do
      local f; f=$(foreign "$root")
      if [ -n "$f" ]; then fdur="$fdur$f"; log "FOREIGN during r$round $tree: $f"; foreign_detail; fi
      sleep 1
    done
    wait "$root"; local ex=$?
    local l1b=$(load1) thb=$(thermal) pwb=$(power) fpost=$(foreign "")
    [ -n "$fpost" ] && { log "FOREIGN post r$round $tree: $fpost"; foreign_detail; }
    local real user sys
    read -r real user sys < <(awk 'NR==1{print $1, $3, $5}' "$o.time")
    local cpu; cpu=$(awk -v u="$user" -v s="$sys" 'BEGIN{printf "%.2f", u+s}')
    local tests; tests=$(grep -E '^ +Tests ' "$o.out" | sed -E 's/\x1b\[[0-9;]*m//g' | tr -s ' ' | sed 's/^ //' | tr ' ' '_')
    local verdict=kept
    [ "$round" = 0 ] && verdict=warmup
    if [ -n "$fpre$fdur$fpost" ]; then verdict=DISCARD_foreign; fi
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
      "$round" "$slot" "$tree" "$attempt" "$start" "$l1" "$th" "$pw" "${fpre:--}" "${fdur:--}" "$l1b" "$thb" "$pwb" "${fpost:--}" \
      "$real" "$user" "$sys" "$cpu" "$ex" "${tests:-NONE}" "$verdict" >> "$TSV"
    log "r$round $slot $tree a$attempt real=$real cpu=$cpu exit=$ex tests=$tests verdict=$verdict load1 $l1->$l1b thermal $th->$thb power $pw->$pwb"
    if [ "$verdict" = DISCARD_foreign ]; then
      [ "$attempt" -ge 10 ] && { log "GIVING UP r$round $tree after 10 attempts"; return 1; }
      idle 30; continue
    fi
    return 0
  done
}

log "window start; host $(sysctl -n hw.model) ncpu $(sysctl -n hw.ncpu) node $(node -v); pairs=$PAIRS"
idle 60
first=1
for round in $(seq 0 "$PAIRS"); do
  if [ $((round % 2)) -eq 1 ] || [ "$round" -eq 0 ]; then order="base mutant"; else order="mutant base"; fi
  slot=0
  for t in $order; do
    slot=$((slot+1))
    if [ $first -eq 0 ]; then idle 20; fi
    first=0
    one_run "$round" "$slot" "$t" || exit 3
  done
done
log "window end"
