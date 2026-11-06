#!/bin/bash
cd <scratch>/arch289j
mkdir -p arms/lad; rm -rf arms/lad/*; cp -r arms/head/src arms/head/package.json arms/lad/
for s in 1 0.952380952 0.909090909 0.8 0.5 0.4 0.3 0.25 1.25; do
  python3 - "$s" <<'PY'
import json,sys
p="arms/lad/src/puzzle-suite.baseline.json"; d=json.load(open(p)); d["stepMs"]=float(sys.argv[1]); json.dump(d,open(p,"w"),indent=2)
PY
  echo "step=$s head $(flock <scratch>/host-test.lock timeout 300 node read.ts g1 <scratch>/arch289j/arms/lad)" >> out/ladder.txt
  echo "step=$s door $(G1DOOR=1 flock <scratch>/host-test.lock timeout 300 node read.ts g1 <scratch>/arch289j/arms/lad)" >> out/ladder.txt
done
