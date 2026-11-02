# Batch E (a REPORT added after batch D, not pre-registered; decides nothing): the default test lane on two full scratch
# copies of the tree (git archive HEAD, node_modules linked): lb = patched with E1CFG.on 0 (main), ll = on 1 (form L).
# Reds in ll and not in lb are the rows E1 moves (migration impact for BA/PM). Sequential, one lane at a time.
# (NODE_OPTIONS=--max-old-space-size=128 as AGENTS.md spells it; the first attempt omitted it and the heap guard refused both runs.)
# Run as: flock <host-test.lock> timeout 300 bash batchE.sh <scratch e1 dir>
d=$1
for v in lb ll; do (cd "$d/$v" && NODE_OPTIONS=--max-old-space-size=128 timeout 140 npx vitest run --reporter=json --outputFile="$d/out/E-$v.json" > "$d/out/E-$v.log" 2>&1; echo "E-$v exit $?" >> "$d/out/exits.txt"); done
