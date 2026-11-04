# Step 0, the instrument check. bash batch0.sh <root> <out> <base>
here="$(cd "$(dirname "$0")" && pwd)"
bash "$here/run.sh" "$1" "$2" s0-check check MAIN "" BASE="$3"
