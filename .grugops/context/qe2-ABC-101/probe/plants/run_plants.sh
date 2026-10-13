#!/bin/bash
# qe2-ABC-101 plants. Each plant: a fresh `git archive d22a709f` copy OUTSIDE the repository, one node_modules symlink, one edit
# (plant_edits.py), the FULL default lane (`npx vitest run`, *_DEEP unset, JSON result file), then the failing tests listed.
# Copies are counted before and after and removed by exact path. Runs only after the N8-LANE master has ended (never in a window).
R=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe2-ABC-101
P=$R/.grugops/context/qe2-ABC-101/probe/plants
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qe2101/plants
NM=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules
mkdir -p "$S"
echo "plants start $(date -u +%FT%TZ); copies under $S before: $(ls -1 "$S" | wc -l | tr -d ' ')"
for name in "$@"; do
  C="$S/$name"; mkdir "$C" || exit 2
  git -C "$R" archive d22a709f | tar -x -C "$C" && ln -s "$NM" "$C/node_modules"
  python3 -I "$P/plant_edits.py" "$C" "$name" || exit 2
  echo "--- $name: diff vs d22a709f src/render.ts"; git -C "$R" show d22a709f:src/render.ts | diff - "$C/src/render.ts" | sed 's/^/    /'
  ( cd "$C" && env -u CLI_DEEP -u SEARCH_DEEP -u ENGINE_DEEP -u ZOBRIST_DEEP -u PUZZLE_DEEP -u INPUT_DEEP -u LADDER_DEEP -u VITEST_MAX_WORKERS \
      npx vitest run --reporter=json --outputFile.json=.qe2-result.json > .qe2-console.txt 2>&1; echo "exit $?" > .qe2-exit )
  python3 -I - "$C/.qe2-result.json" "$(cat "$C/.qe2-exit")" "$name" <<'EOF'
import json, sys
sys.stdout.reconfigure(errors="backslashreplace")  # a lone surrogate in a failure message (p3b) must not crash the printer
r = json.load(open(sys.argv[1]))
print(f"=== {sys.argv[3]}: {sys.argv[2]}; files {len(r['testResults'])}; tests {r['numTotalTests']} passed {r['numPassedTests']} failed {r['numFailedTests']} pending {r['numPendingTests']} todo {r['numTodoTests']}")
for f in r["testResults"]:
    bad = [a for a in f["assertionResults"] if a["status"] == "failed"]
    if bad or f["status"] == "failed":
        print(f"  FILE {f['name'].split('/qe2101/plants/')[1].split('/', 1)[1]}: {len(bad)} failed" + ("" if bad else f" (file status {f['status']}: {f.get('message','')[:160]})"))
        for a in bad:
            msg = (a.get("failureMessages") or [""])[0].split("\n")[0][:150]
            print(f"    - {' > '.join(a['ancestorTitles'] + [a['title']])[:200]}\n        {msg}")
EOF
  rm -rf "$C"
done
echo "plants end $(date -u +%FT%TZ); copies under $S after: $(ls -1 "$S" | wc -l | tr -d ' ')"
