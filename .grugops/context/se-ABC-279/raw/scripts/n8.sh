for r in 1 2 3; do
  for t in <scratch>/q1/main-snap <worktree>; do cd $t; o=$(timeout 300 npm test 2>&1); echo "$t r$r exit=$? $(echo "$o" | grep -E '^ +Tests ' | tr -s ' ') |$(echo "$o" | grep -E '^ +Duration' | tr -s ' ')"; done
done
