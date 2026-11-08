# Batch H (arch-ABC-292-probe), STAGE B ONLY and LAST, on a held host: PR10's lane read. Arms B (the `main` copy), B2
# (B again, a second cp -a of the `main` copy) and H (the `cand` copy: production files changed, no test file changed).
# `npm test` as spelled, one fresh process per run, 8 complete scored rounds (round 0 dropped), at most 12 rounds and
# 1 200 s. Expected counts per arm are stage A's PR11 readings (G-main.json, G-cand.json). A report; it decides nothing,
# and the Orchestrator may drop it (ADR-0076 d13). Run as: flock <host-test.lock> timeout 1500 bash batchH.sh <scratch dir>
S=$1; out=$S/out; A=$S/lane
echo "H start $(date -u +%FT%TZ)" >> "$out/holds.txt"
rm -rf "$A"; mkdir -p "$A"; cp -a "$S/main" "$A/B"; cp -a "$S/main" "$A/B2"; cp -a "$S/cand" "$A/H"
bash "$S/scripts/lane.sh" "$A" "$out/H-lane" "$out/G-main.json" "$out/G-cand.json" > "$out/H-lane.log" 2>&1; echo "H-lane exit $?" >> "$out/exits.txt"
echo "H end $(date -u +%FT%TZ)" >> "$out/holds.txt"
