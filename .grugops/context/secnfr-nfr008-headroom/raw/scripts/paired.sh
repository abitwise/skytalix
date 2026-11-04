#!/bin/bash
S=$1; OUT=$S/n8h; B=<worktree>; P=$S/n8h/probe
echo -e "seq\tarm\tload1\texit\twall_s\tcpu_s\tpassed\tskipped" > $OUT/P.tsv
i=0
for arm in b p p b b p p b b p p b b p p b; do
  [ $arm = b ] && d=$B || d=$P
  l1=$(cut -d' ' -f1 /proc/loadavg)
  (cd $d && /usr/bin/time -f "%e %U %S" -o $OUT/P-time-$i.txt npm test > $OUT/P-out-$i.txt 2>&1); ex=$?
  read w u s < $OUT/P-time-$i.txt
  tl=$(grep -E "^ +Tests " $OUT/P-out-$i.txt | tr -s ' ')
  echo -e "$i\t$arm\t$l1\t$ex\t$w\t$(echo "$u+$s"|bc)\t$tl" >> $OUT/P.tsv
  i=$((i+1))
done
