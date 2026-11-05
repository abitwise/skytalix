# The stage loop shared by n8.sh and probe.sh; secnfr-nfr008-1104's loop with the changes n8.sh's header lists.
HZ=$(getconf CLK_TCK)
busy() { awk '/^cpu /{print $2+$3+$4+$7+$8}' /proc/stat; }
fv() { # foreign vitest: command node, npm or npx, not under the arms: "<any> <busy>"
  ps -eo pid=,pcpu=,comm=,args= | grep -E '[v]itest' | while read -r pid pc comm rest; do
    case "$comm" in node*|npm*|npx*) ;; *) continue;; esac
    cwd=$(readlink /proc/$pid/cwd 2>/dev/null) || continue
    case "$cwd" in "$A"*) continue;; esac
    echo "$pc"
  done | awk '{n++; if ($1>1.0) b++} END{printf "%d %d", n, b}'
}
"$HERE/fsample.sh" "$A" "$O/foreign.tsv" & SAMPLER=$!
trap 'kill $SAMPLER 2>/dev/null' EXIT
trap 'exit 143' TERM INT
T0=$(date +%s)
w0=0; while awk -v l="$(cut -d' ' -f1 /proc/loadavg)" 'BEGIN{exit !(l>2.0)}' && [ $w0 -lt 300 ]; do sleep 5; w0=$((w0+5)); done
echo "hold start $(date -u +%FT%TZ); wait-clear: ${w0} s, load1 $(cut -d' ' -f1 /proc/loadavg); tmp free kB $(df --output=avail -k /tmp | tail -1)"
T=$O/a8.tsv
echo -e "round\tseq\tarm\tstart_utc\tload1\tload_wait_s\tvitest_run_foreign\tvitest_busy_foreign\tpower\texit\twall_s\tuser_s\tsys_s\tcpu_s\tfiles\tpassed\tskipped\tfailed\tscored\thost_cpu_s\tforeign_cpu_s\tvitest_after\tvitest_busy_after" > $T
seq=0; complete=0; r=0
while [ $complete -lt 8 ] && [ $r -lt 12 ] && [ $(( $(date +%s) - T0 )) -lt 1200 ]; do
  case $((r % 3)) in 0) order="$ORD0";; 1) order="$ORD1";; 2) order="$ORD2";; esac
  ok_round=1
  for arm in $order; do
    w=0; while awk -v l="$(cut -d' ' -f1 /proc/loadavg)" 'BEGIN{exit !(l>8)}' && [ $w -lt 120 ]; do sleep 5; w=$((w+5)); done
    l1=$(cut -d' ' -f1 /proc/loadavg)
    read vr vb < <(fv)
    pw=$(ls /sys/class/power_supply 2>/dev/null | tr '\n' ','); [ -z "$pw" ] && pw="no-power-supply-entry(mains)"
    st=$(date -u +%FT%TZ)
    b0=$(busy)
    (cd $A/$arm && /usr/bin/time -f "%e %U %S" -o $O/runs/time-$seq.txt npm test > $O/runs/out-$seq.txt 2>&1); ex=$?
    b1=$(busy)
    read va vba < <(fv)
    wall=NA; u=NA; s=NA; cpu=NA; cnt=$(printf "NA\tNA\tNA\tNA"); hc=NA; fc=NA; sc=1; [ $r = 0 ] && sc=0
    J=$A/$arm/.test-results/last-run.json
    if [ -s $O/runs/time-$seq.txt ] && [ -s $O/runs/out-$seq.txt ] && [ -s $J ]; then
      read wall u s < <(tail -1 $O/runs/time-$seq.txt)
      cnt=$(node -e 'const j=require(process.argv[1]);const f=j.testResults.length;console.log([f,j.numPassedTests,j.numPendingTests+(j.numTodoTests||0),j.numFailedTests].join("\t"))' $J)
      cp $J $O/runs/json-$seq-$arm.json
      [ -s $O/runs/json-$seq-$arm.json ] || { sc=0; ok_round=0; }
      cpu=$(echo "$u + $s" | bc)
      hc=$(echo "scale=2; ($b1 - $b0) / $HZ" | bc); fc=$(echo "scale=2; $hc - $cpu" | bc)
    else
      sc=0; ok_round=0; echo "EMPTY OUTPUT at seq $seq arm $arm"
    fi
    [ "$ex" = 0 ] && [ "$cnt" = "$(exp_of $arm)" ] && awk -v l=$l1 'BEGIN{exit !(l<=8)}' || { sc=0; ok_round=0; }
    echo -e "$r\t$seq\t$arm\t$st\t$l1\t$w\t$vr\t$vb\t$pw\t$ex\t$wall\t$u\t$s\t$cpu\t$cnt\t$sc\t$hc\t$fc\t$va\t$vba" >> $T
    seq=$((seq+1))
  done
  [ $r -ge 1 ] && [ $ok_round = 1 ] && complete=$((complete+1))
  r=$((r+1))
done
echo "$TAG done: rounds $r, complete scored rounds $complete, $(date -u +%FT%TZ), hold $(( $(date +%s) - T0 )) s; tmp free kB $(df --output=avail -k /tmp | tail -1)"
