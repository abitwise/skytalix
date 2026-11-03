# Batch 3: reports (d7 and d9 on kiwipete / position-6; reach at 20 000). Counts only.
here="$(cd "$(dirname "$0")" && pwd)"
{ for f in A25 A50 A100 A50F; do
    printf '%s\n' "$f nodes D=7" "$f nodes D=9" "$f reach ALL=1 N=20000"
  done; } | xargs -P 1 -L 1 bash "$here/job.sh" "$1" "$2"
