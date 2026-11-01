P=$1
for j in "$P"/*.json; do n=$(basename $j .json); echo "== $n $(jq -r '"pass=\(.numPassedTests) fail=\(.numFailedTests) skip=\(.numPendingTests) total=\(.numTotalTests)"' $j)"
jq -r '.testResults[].assertionResults[] | select(.status!="skipped" and .status!="pending") | "  \(.status) \(.fullName[0:45]) :: \((.failureMessages[0] // "")|split("\n")[0][0:150])"' $j; done
