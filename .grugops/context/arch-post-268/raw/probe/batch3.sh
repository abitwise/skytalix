# Batch 3: ADR-0061's cut audit for decision 1, information only: search() d6 over the 190 + 6, every 10th marked node.
# Run as: flock <host-test.lock> timeout 300 bash batch3.sh <root> <out>.
here="$(cd "$(dirname "$0")" && pwd)"
bash "$here/job.sh" "$1" "$2" R0 audit D=6 AUD=10
