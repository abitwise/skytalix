#!/bin/bash
cd <scratch>/arch289j
for a in head mcoff cmoff bothoff; do
  flock <scratch>/host-test.lock timeout 600 node rows.ts <scratch>/arch289j/arms/$a 5 > out/rows-$a-d5.jsonl 2> out/rows-$a-d5.err; echo "rows $a rc=$?" >> out/exits.txt
  flock <scratch>/host-test.lock timeout 300 node read.ts g1 <scratch>/arch289j/arms/$a > out/g1-$a.jsonl 2> out/g1-$a.err; echo "g1 $a rc=$?" >> out/exits.txt
  G1DOOR=1 flock <scratch>/host-test.lock timeout 300 node read.ts g1 <scratch>/arch289j/arms/$a > out/g1door-$a.jsonl 2> out/g1door-$a.err; echo "g1door $a rc=$?" >> out/exits.txt
done
