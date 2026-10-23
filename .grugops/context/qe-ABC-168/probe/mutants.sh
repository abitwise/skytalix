#!/usr/bin/env bash
# ABC-168 QE mutation reads (brief items i-iv). Plants ONLY in a scratch extract passed as $1
# (git archive of the QE merge, git-initialised, node_modules symlinked). Never run in a worktree.
# Usage: bash mutants.sh <scratch extract> <scratch dir for npm link prefix>
set -u
X="$1"; G="$2"
cd "$X" || exit 2
unset NODE_OPTIONS
[ -d .git ] && [ ! -e .git/QE-SCRATCH ] && touch .git/QE-SCRATCH
[ -e .git/QE-SCRATCH ] || { echo "refusing: not a QE scratch extract"; exit 2; }

restore() { git checkout -q -- . && rm -rf dist; }
rep() { # rep <file> <from> <to>  (literal, must match exactly once)
  node -e 'const fs=require("fs");const [f,a,b]=process.argv.slice(1);const s=fs.readFileSync(f,"utf8");const n=s.split(a).length-1;if(n!==1){console.error("PLANT FAILED: "+n+" matches in "+f);process.exit(3)}fs.writeFileSync(f,s.replace(a,()=>b))' "$1" "$2" "$3"
}
suite() { npm test >/dev/null 2>&1; echo "  npm test rc=$? $(node -e 'const j=require("./.test-results/last-run.json");process.stdout.write(`passed ${j.numPassedTests}/${j.numTotalTests} failed ${j.numFailedTests}`)')"
  UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts >/dev/null 2>&1; echo "  UCI_DEEP lane rc=$?"; }
a1() { node src/uci.ts x </dev/null >out.a1 2>err.a1; echo "  A1: rc=$? stdout_bytes=$(wc -c <out.a1 | tr -d ' ')"; }
a3() { for i in 1 2 3; do printf 'uci\nisready\nquit\n' | node src/uci.ts 2>err.a3 | head -1 >/dev/null; echo "  A3 run $i: rcs=${PIPESTATUS[*]} stderr_bytes=$(wc -c <err.a3 | tr -d ' ') stack_lines=$(grep -c '    at ' err.a3)"; done; }
fault() { rep src/uci-session.ts 'handleLine(line: string): "continue" | "quit" {' 'handleLine(line: string): "continue" | "quit" { if (line === "qe-boom") throw new Error("qe planted fault");'; }
a4() { printf 'uci\nqe-boom\nisready\n' | node src/uci.ts >out.a4 2>err.a4; echo "  A4 live (fault injected): rc=$? stderr=[$(tr '\n' '|' <err.a4)] stack_lines=$(grep -c '    at ' err.a4) readyok_after=$(grep -c readyok out.a4)"; }
pin() { NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts >out.pin 2>&1; echo "  cli.test.ts rc=$? $(grep -E 'Tests ' out.pin | tr -s ' ')"; }
linkrun() { npm run build >/dev/null 2>&1; echo "  build rc=$?"; rm -rf "$G" && mkdir -p "$G"; npm_config_prefix="$G" npm link >/dev/null 2>&1; echo "  npm link rc=$? bin -> $(readlink "$G/bin/skytalix")"; (cd "$G" && printf 'uci\nquit\n' | PATH="$G/bin:$PATH" skytalix >out.link 2>err.link; echo "  skytalix: rc=$? first=[$(head -1 out.link)] stderr_head=[$(head -1 err.link)]"); }

echo "== BASE (no plant)"; suite; a1; a3; pin
echo "== BASE + fault injection only (A4 live)"; fault; a4; restore

echo "== M-i-a: EPIPE arm installed after the first line's writes"
rep src/uci.ts '  sink.on("error", (error) => {' '  const arm = () => sink.on("error", (error) => {'
rep src/uci.ts '    end();
  });

  const write' '    end();
  });
  let armed = false;

  const write'
rep src/uci.ts '      if (session.handleLine(line) === "quit") end();' '      const r = session.handleLine(line); if (!armed) { armed = true; arm(); } if (r === "quit") end();'
suite; a3; restore

echo "== M-i-b: EPIPE arm removed"
rep src/uci.ts '  sink.on("error", (error) => {
    if ((error as NodeJS.ErrnoException).code !== "EPIPE") throw error;
    end();
  });' ''
suite; a3; restore

echo "== M-ii: an argument accepted (argv > 3)"
rep src/uci.ts 'process.argv.length > 2' 'process.argv.length > 3'
suite; a1; restore

echo "== M-iii: exception path exits 0"
rep src/uci.ts '      process.exitCode = INTERNAL_ERROR_EXIT_CODE;
' ''
suite; fault; a4; restore

echo "== M-iv-a: bin -> dist/cli.js"
rep package.json '"skytalix": "dist/uci.js"' '"skytalix": "dist/cli.js"'
pin; linkrun; restore

echo "== M-iv-b: bin -> src/uci.ts"
rep package.json '"skytalix": "dist/uci.js"' '"skytalix": "src/uci.ts"'
pin; linkrun; restore

echo "== BASE link (control)"; linkrun; restore
rm -f out.* err.*
