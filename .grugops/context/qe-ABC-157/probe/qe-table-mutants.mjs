// usage: node run2.mjs <tree> <outdir>  — table-level mutants, [from,to] edits, anchor count 1
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const [tree, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const file = `${tree}/src/moves.ts`;
const orig = readFileSync(file, 'utf8');
const M = {
  'T-WK-reads-BK': [['{ right: CASTLE_WK, kingFrom: 4', '{ right: CASTLE_BK, kingFrom: 4']],
  'T-WQ-reads-BQ': [['{ right: CASTLE_WQ, kingFrom: 4', '{ right: CASTLE_BQ, kingFrom: 4']],
  'T-BK-reads-WK': [['right: CASTLE_BK,', 'right: CASTLE_WK,']],
  'T-BQ-reads-WQ': [['right: CASTLE_BQ,', 'right: CASTLE_WQ,']],
  'T-WK-reads-WQ': [['{ right: CASTLE_WK, kingFrom: 4', '{ right: CASTLE_WQ, kingFrom: 4']],
  'T-BQ-reads-BK': [['right: CASTLE_BQ,', 'right: CASTLE_BK,']],
};
const env = { ...process.env };
for (const k of Object.keys(env)) if (k.endsWith('_DEEP')) delete env[k];
const summary = [];
try {
  for (const [name, edits] of Object.entries(M)) {
    let src = orig;
    for (const [a, b] of edits) { const n = src.split(a).length - 1; if (n !== 1) throw new Error(`${name} anchor ${n}`); src = src.replace(a, b); }
    writeFileSync(file, src);
    const jf = `${out}/${name}.json`;
    spawnSync('npx', ['vitest', 'run', '--reporter=json', `--outputFile=${jf}`], { cwd: tree, env, stdio: 'ignore' });
    const r = JSON.parse(readFileSync(jf, 'utf8'));
    const failed = [];
    for (const f of r.testResults) for (const a of f.assertionResults) if (a.status === 'failed') failed.push(`${f.name.replace(tree + '/', '')} :: ${a.fullName}`);
    const line = `${name}\ttf=${r.testResults.length} total=${r.numTotalTests} passed=${r.numPassedTests} failed=${r.numFailedTests} abc157=${failed.filter((x) => x.includes('ABC-157')).length} pending=${r.numPendingTests + r.numTodoTests}`;
    summary.push(line); console.log(line);
    writeFileSync(`${out}/${name}.failed.txt`, failed.join('\n') + '\n');
  }
} finally { writeFileSync(file, orig); }
writeFileSync(`${out}/summary.txt`, summary.join('\n') + '\n');
