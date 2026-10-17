// usage: node run.mjs <tree> <outdir>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const [tree, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const file = `${tree}/src/moves.ts`;
const orig = readFileSync(file, 'utf8');
const LINE = 'if ((position.castling & option.right) === 0) continue;';
const M = {
  'NONE': LINE,
  'X-any-right': 'if (position.castling === 0) continue;',
  'W-own-colour-any-wing': 'if ((position.castling & (black ? 12 : 3)) === 0) continue;',
  'W-same-wing-either-colour': 'if ((position.castling & (option.right | (black ? option.right >> 2 : option.right << 2))) === 0) continue;',
  'W-colour-swap-same-wing': 'if ((position.castling & (black ? option.right >> 2 : option.right << 2)) === 0) continue;',
  'W-wing-swap-own-colour': 'if ((position.castling & (option.right ^ (black ? 12 : 3))) === 0) continue;',
  'W-kingside-either-colour-only': 'if ((position.castling & ((option.right & 5) !== 0 ? 5 : option.right)) === 0) continue;',
  'W-queenside-either-colour-only': 'if ((position.castling & ((option.right & 10) !== 0 ? 10 : option.right)) === 0) continue;',
  'W-white-any-right': 'if ((position.castling & (black ? option.right : 15)) === 0) continue;',
  'W-black-any-right': 'if ((position.castling & (black ? 15 : option.right)) === 0) continue;',
  'W-mixed-own-other-plus-opp': 'if ((position.castling & option.right) === 0 && !((position.castling & (black ? 12 : 3)) !== 0 && (position.castling & (black ? 3 : 12)) !== 0)) continue;',
};
const only = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(M);
const env = { ...process.env };
for (const k of Object.keys(env)) if (k.endsWith('_DEEP')) delete env[k];
const summary = [];
try {
  for (const name of only) {
    if (!orig.includes(LINE)) throw new Error('anchor missing');
    writeFileSync(file, orig.replace(LINE, M[name]));
    const jf = `${out}/${name}.json`;
    spawnSync('npx', ['vitest', 'run', '--reporter=json', `--outputFile=${jf}`], { cwd: tree, env, stdio: 'ignore' });
    let r;
    try { r = JSON.parse(readFileSync(jf, 'utf8')); } catch { summary.push(`${name}\tNO-RESULT`); continue; }
    const failed = [];
    for (const f of r.testResults) for (const a of f.assertionResults) if (a.status === 'failed') failed.push(`${f.name.replace(tree + '/', '')} :: ${a.fullName}`);
    const line = `${name}\tfiles=${r.numTotalTestSuites ?? '?'} tf=${r.testResults.length} total=${r.numTotalTests} passed=${r.numPassedTests} failed=${r.numFailedTests} pending=${r.numPendingTests + r.numTodoTests}`;
    summary.push(line);
    writeFileSync(`${out}/${name}.failed.txt`, failed.join('\n') + '\n');
    console.log(line);
  }
} finally {
  writeFileSync(file, orig);
}
writeFileSync(`${out}/summary.txt`, summary.join('\n') + '\n');
