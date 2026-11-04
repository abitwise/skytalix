# Step D, the default lane on a scratch full-tree copy that counts clearHistory calls. bash batchD.sh <lane copy> <out>
export LANE_CLEAR_LOG="$2/lane-clears.log"
: > "$LANE_CLEAR_LOG"
start=$(date +%s)
(cd "$1" && npm test) > "$2/d-lane.txt" 2>&1
echo "lane exit=$? seconds=$(( $(date +%s) - start )) clears=$(wc -c < "$LANE_CLEAR_LOG")" >> "$2/exits.txt"
