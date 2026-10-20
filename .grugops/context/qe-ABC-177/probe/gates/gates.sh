#!/bin/bash
# qe-ABC-177 A12 gates at the tip (wt-qe-ABC-177 @ f81bf03c) + A3 at base (scratch archive). One at a time.
W=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-177; S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/c759514b-0b67-4176-b897-647bcb7478de/scratchpad
log(){ echo "== $1 $(date -u +%FT%TZ) procs $(ps -u $(id -u) | wc -l) load $(sysctl -n vm.loadavg) power $(pmset -g batt | head -1 | sed "s/.*'\(.*\)'.*/\1/")"; }
cd $W
log lint; npm run lint > $S/g-lint.log 2>&1; echo "lint rc=$?"
log typecheck; npm run typecheck > $S/g-tc.log 2>&1; echo "typecheck rc=$?"
log build; npm run build > $S/g-build.log 2>&1; echo "build rc=$?"
log npmtest-tip; npm test > $S/g-test-tip.log 2>&1; echo "npm test tip rc=$?"; cp .test-results/last-run.json $S/last-run-tip.json
log skipcap; N=$(NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'); echo "skip capture: $N"
log skipint; node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "$N"; echo "skip-integrity rc=$?"
log clideep; CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts > $S/g-clideep.log 2>&1; echo "CLI_DEEP rc=$? $(grep -E 'Tests ' $S/g-clideep.log)"
log perftdeep; PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts > $S/g-perft.log 2>&1; echo "PERFT_DEEP rc=$? $(grep -E 'Tests ' $S/g-perft.log)"
log npmtest-base; cd $S/par/B && npm test > $S/g-test-base.log 2>&1; echo "npm test base rc=$?"; cp .test-results/last-run.json $S/last-run-base.json
log m4plant; cd $S/gp/H; node -e '
const fs=require("fs"),p="src/uci-session.ts",o=fs.readFileSync(p,"utf8"),a="    held = null;\n    write(line);\n";
if(o.split(a).length!==2){console.log("M4 anchor count",o.split(a).length-1);process.exit(4)}
fs.writeFileSync(p,o.replace(a,()=>a+"    write(\"released\");\n"));
const r=require("child_process").spawnSync(process.execPath,["node_modules/vitest/vitest.mjs","run","src/uci-session.test.ts","--reporter=json","--outputFile=/dev/stdout"],{encoding:"utf8",maxBuffer:64<<20,env:{...process.env,NODE_OPTIONS:"--max-old-space-size=400"}});
fs.writeFileSync(p,o);console.log("restored",fs.readFileSync(p,"utf8")===o);
try{const j=JSON.parse(r.stdout.slice(r.stdout.indexOf("{")));const f=j.testResults.flatMap(t=>t.assertionResults).filter(a=>a.status==="failed").map(a=>a.title);console.log("M4 plant exit",r.status,"failed",f.length,"sweep red:",f.includes("every line written in every row starts with an M4 prefix"));console.log(f.join(" || "))}catch(e){console.log("parse",e.message,r.stdout.slice(0,300))}'
log end
