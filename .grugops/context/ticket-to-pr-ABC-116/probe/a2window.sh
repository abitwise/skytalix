#!/bin/bash
# ticket-to-pr-ABC-116 A2: the one-line substitution-hook deletion's cost, paired, on today's stack.
# Shape: ADR-0035 decision 2 (three out-of-tree trees B / M / T, narrow set src/cli.test.ts, CPU = user + sys of the
# whole process tree via /usr/bin/time -l, one fresh process per run, rotated order, round 0 discarded, counts asserted),
# plus the subtask's window rules: 60 s idle before the first run, 20 s idle between runs, and BEFORE and AFTER every run
# a log of uptime load1, thermal pressure (notifyutil com.apple.system.thermalpressurelevel; kern.thermalpressurelevel
# does not exist on this host), foreign runner processes (pgrep -fl) and the power source (pmset -g batt | head -1).
# A background sampler (1 s) also logs any runner process that is NOT a descendant of this script during a run.
# A run with a foreign runner before, during or after it is recorded as DISCARDED_FOREIGN and re-taken once the
# foreign process is gone (+20 s idle). The script's own name and argv must not contain the runner's name.
# Usage: bash a2window.sh <workdir with arms/B arms/M arms/T> [ROUNDS=9] [GAP=20] [FIRST=60]
W="$1"; ROUNDS="${ROUNDS:-9}"; GAP="${GAP:-20}"; FIRST="${FIRST:-60}"
mkdir -p "$W/console"; OUT="$W/a2-runs.tsv"; LOG="$W/a2-window.log"; RUNNER="vites""t"
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
load1() { uptime | sed -E 's/.*load averages?: *([0-9.]+).*/\1/'; }
therm() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
power() { pmset -g batt | head -1 | sed -E "s/.*'(.*)'.*/\1/"; }
# foreign = runner processes that are not descendants of this script
foreign() {
  ps -Ao pid=,ppid=,command= | awk -v me=$$ -v pat="$RUNNER" '
    { pid=$1; pp[pid]=$2; $1=""; $2=""; cmd[pid]=$0 }
    END { for (p in cmd) { if (index(cmd[p], pat) == 0 || cmd[p] ~ /awk -v/) continue;
            q=p; mine=0; for (i=0;i<64 && q>1;i++) { if (q==me) { mine=1; break } ; q=pp[q] }
            if (!mine) print p " " cmd[p] } }'
}
nforeign() { foreign | grep -c . ; }
pgrepcount() { pgrep -fl "$RUNNER" | grep -vc "^$$ " ; }
{
  echo "utc_start $(ts)"; echo "host $(sysctl -n hw.model) $(sysctl -n machdep.cpu.brand_string) cpus $(sysctl -n hw.logicalcpu) $(uname -sr)"
  echo "node $(node --version) runner $(node -p "require('$W/arms/B/node_modules/$RUNNER/package.json').version")"
  for a in B M T; do echo "arm $a cli.test.ts sha256 $(shasum -a 256 "$W/arms/$a/src/cli.test.ts" | cut -c1-64)"; done
  echo "pmset -g therm:"; pmset -g therm; echo "power: $(pmset -g batt | head -1)"; echo "uptime: $(uptime)"
  echo "env ${RUNNER^^}_ vars: $(env | grep -c "^${RUNNER^^}_")"
} > "$LOG" 2>&1
printf 'seq\tround\tarm\tattempt\tutc_start\twall_s\tuser_s\tsys_s\tcpu_s\tmaxrss_b\texit\tfiles\ttests\tfailed\tskipped\tload1_before\tload1_after\tthermal_before\tthermal_after\tforeign_before\tforeign_during\tforeign_after\tpgrep_before\tpgrep_after\tpower_before\tpower_after\tstatus\n' > "$OUT"
waitclean() { # wait until no foreign runner, logging; then idle $1 s (GAP, or FIRST before the first run)
  local waited=0 idle="${1:-$GAP}"
  while [ "$(nforeign)" -gt 0 ]; do
    [ $waited -eq 0 ] && { echo "$(ts) WAIT foreign runner present:"; foreign; } >> "$LOG"
    waited=1; sleep 10
  done
  [ $waited -eq 1 ] && { echo "$(ts) foreign runner gone; idling ${idle}s" >> "$LOG"; sleep "$idle"; }
}
echo "$(ts) initial idle ${FIRST}s" >> "$LOG"; waitclean; sleep "$FIRST"
CONDS=(B M T); seq=0; declare -A EXPF EXPT
for ((round = 0; round < ROUNDS; round++)); do
  k=$((round % 3)); order=("${CONDS[@]:k}" "${CONDS[@]:0:k}")
  for a in "${order[@]}"; do
    attempt=1
    while :; do
      seq=$((seq + 1)); [ $seq -gt 1 ] && sleep "$GAP"
      if [ $seq -eq 1 ]; then waitclean "$FIRST"; else waitclean "$GAP"; fi
      cwd="$W/arms/$a"; res="$cwd/.test-results/a2.json"; rm -f "$res"; mkdir -p "$cwd/.test-results"
      lb=$(load1); tb=$(therm); fb=$(nforeign); pb=$(pgrepcount); wb=$(power); u=$(ts)
      SAMP="$W/samp.$seq"; : > "$SAMP"
      ( while :; do foreign >> "$SAMP"; sleep 1; done ) & sp=$!
      ( cd "$cwd" && /usr/bin/time -l npx "$RUNNER" run src/cli.test.ts --reporter=default --reporter=json \
          --outputFile.json="$res" > "$W/console/$seq-$a.out" 2> "$W/console/$seq-$a.time" ); ex=$?
      kill $sp 2>/dev/null; wait $sp 2>/dev/null
      la=$(load1); ta=$(therm); fa=$(nforeign); pa=$(pgrepcount); wa=$(power)
      fd=$(awk '{print $1}' "$SAMP" | sort -u | grep -c .)
      tf="$W/console/$seq-$a.time"
      read -r wall user sys < <(awk '/ real / {print $1, $3, $5}' "$tf")
      rss=$(awk '/maximum resident set size/ {print $1}' "$tf")
      cpu=$(awk -v u="$user" -v s="$sys" 'BEGIN{printf "%.2f", u+s}')
      if [ -f "$res" ]; then
        read -r files tests failed skipped < <(node -e 'const j=require(process.argv[1]);console.log(j.testResults.length,j.numTotalTests,j.numFailedTests+(j.numFailedTestSuites||0),(j.numPendingTests||0)+(j.numTodoTests||0))' "$res")
      else files=NA; tests=NA; failed=NA; skipped=NA; fi
      [ -z "${EXPF[$a]}" ] && { EXPF[$a]=$files; EXPT[$a]=$tests; }
      st=ok
      [ "$ex" = 0 ] && [ "$failed" = 0 ] && [ "$skipped" = 0 ] && [ "$files" = "${EXPF[$a]}" ] && [ "$tests" = "${EXPT[$a]}" ] || st=HARNESS_ERROR
      [ "$fb" -gt 0 ] || [ "$fd" -gt 0 ] || [ "$fa" -gt 0 ] && st=DISCARDED_FOREIGN
      printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
        $seq $round $a $attempt "$u" "$wall" "$user" "$sys" "$cpu" "$rss" $ex "$files" "$tests" "$failed" "$skipped" \
        "$lb" "$la" "$tb" "$ta" $fb $fd $fa $pb $pa "$wb" "$wa" $st >> "$OUT"
      [ "$fd" -gt 0 ] && { echo "$(ts) seq $seq foreign during run:"; sort -u "$SAMP"; } >> "$LOG"
      rm -f "$SAMP"
      [ "$st" = DISCARDED_FOREIGN ] && { attempt=$((attempt + 1)); continue; }
      break
    done
  done
done
echo "utc_end $(ts)" >> "$LOG"; echo DONE > "$W/DONE"
