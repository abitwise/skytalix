#!/bin/bash
# secnfr-nfr008-1104 probe (an estimate, never a grade): n8.sh with arms H, P1, P2 (probe plan …39f73707).
#  (1) the per-arm expected counts (B = ebd1263f 69 files / 2 650; H = main fd6b595f and H2 71 / 2 687);
#  (2) every run's .test-results/last-run.json is kept (runs/json-<seq>.json) for the per-row census;
#  (3) a wait-clear before round 0: up to 300 s for load1 <= 2.0 (logged, not a gate).
# Run ONCE, inside ONE `flock <scratch>/host-test.lock` hold. Usage: n8.sh <arms dir holding B H H2> <out dir>
# Order rotates by round (r mod 3): B H H2 / H H2 B / H2 B H. Round 0 is discarded. Rounds continue until 8
# complete scored rounds or 12 rounds in all. `npm test` as spelled, one fresh process per run.
# Host gate per run: wait up to 120 s for load1 <= 8; a run that starts at load1 > 8 is not scored.
A=$1; O=$2; mkdir -p $O/runs
exp_of() { case "$1" in H) printf "71\t2687\t0\t0";; P1) printf "71\t2680\t7\t0";; P2) printf "71\t2678\t9\t0";; esac; }
w0=0; while awk -v l="$(cut -d' ' -f1 /proc/loadavg)" 'BEGIN{exit !(l>2.0)}' && [ $w0 -lt 300 ]; do sleep 5; w0=$((w0+5)); done
echo "wait-clear: ${w0} s, load1 $(cut -d' ' -f1 /proc/loadavg), $(date -u +%FT%TZ)"
T=$O/a8.tsv
echo -e "round\tseq\tarm\tstart_utc\tload1\tload_wait_s\tvitest_run_foreign\tvitest_busy_foreign\tpower\texit\twall_s\tuser_s\tsys_s\tcpu_s\tfiles\tpassed\tskipped\tfailed\tscored" > $T
seq=0; complete=0; r=0
while [ $complete -lt 8 ] && [ $r -lt 12 ]; do
  case $((r % 3)) in 0) order="H P1 P2";; 1) order="P1 P2 H";; 2) order="P2 H P1";; esac
  ok_round=1
  for arm in $order; do
    w=0; while awk -v l="$(cut -d' ' -f1 /proc/loadavg)" 'BEGIN{exit !(l>8)}' && [ $w -lt 120 ]; do sleep 5; w=$((w+5)); done
    l1=$(cut -d' ' -f1 /proc/loadavg)
    vr=$(ps -eo args | grep -c '[v]itest run')
    vb=$(ps -eo pcpu,args | awk '/[v]itest/ && $1>1.0' | wc -l)
    pw=$(ls /sys/class/power_supply 2>/dev/null | tr '\n' ','); [ -z "$pw" ] && pw="no-power-supply-entry(mains)"
    st=$(date -u +%FT%TZ)
    (cd $A/$arm && /usr/bin/time -f "%e %U %S" -o $O/runs/time-$seq.txt npm test > $O/runs/out-$seq.txt 2>&1); ex=$?
    read wall u s < $O/runs/time-$seq.txt
    cnt=$(node -e 'const j=require(process.argv[1]);const f=j.testResults.length;console.log([f,j.numPassedTests,j.numPendingTests+(j.numTodoTests||0),j.numFailedTests].join("\t"))' $A/$arm/.test-results/last-run.json)
    cp $A/$arm/.test-results/last-run.json $O/runs/json-$seq-$arm.json
    cpu=$(echo "$u + $s" | bc)
    sc=1; [ $r = 0 ] && sc=0
    [ "$ex" = 0 ] && [ "$cnt" = "$(exp_of $arm)" ] && awk -v l=$l1 'BEGIN{exit !(l<=8)}' || { sc=0; ok_round=0; }
    echo -e "$r\t$seq\t$arm\t$st\t$l1\t$w\t$vr\t$vb\t$pw\t$ex\t$wall\t$u\t$s\t$cpu\t$cnt\t$sc" >> $T
    seq=$((seq+1))
  done
  [ $r -ge 1 ] && [ $ok_round = 1 ] && complete=$((complete+1))
  r=$((r+1))
done
echo "probe done: rounds $r, complete scored rounds $complete, $(date -u +%FT%TZ)"
