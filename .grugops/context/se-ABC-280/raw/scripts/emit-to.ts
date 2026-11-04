// se-ABC-280 scratch: tools/tune's own emit(), with the target outside the tree (A6), so
// src/evaluate-params.ts is never written. The commit is the CLI's toolCommit(), passed in by run.sh.
// usage: node <this> <worktree> <out dir> <target file> <tool commit>
const [W, outDir, target, commit] = process.argv.slice(2);
const { emit } = await import(`${W}/tools/tune/tune.ts`);
emit(outDir, target, commit);
console.log(`wrote ${target}`);
