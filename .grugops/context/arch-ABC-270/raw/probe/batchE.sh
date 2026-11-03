# Batch E (arch-ABC-270): the default test lane on the patched copy at BASE and on a copy with QX hard-wired at load
# (`setK3Form(true, true)` appended to src/evaluate.ts). Report only: the reds in the QX copy alone.
# Run as: flock <host-test.lock> timeout 1500 bash batchE.sh <scratch k3 dir> <out>
# Attempt 1 (20:29Z) was refused at load: vitest.config.ts imports tools/grugops/heap-guard.js, not archived. Both copies then got `git archive HEAD tools/grugops`.
k3=$1 out=$2
for c in base qx; do
  ( cd "$k3/$c" && NODE_OPTIONS=--max-old-space-size=128 timeout 600 npx vitest run --reporter=json --outputFile="$out/E-$c.json" > "$out/E-$c.log" 2>&1; echo "E-$c exit $?" >> "$out/exits.txt" )
done
