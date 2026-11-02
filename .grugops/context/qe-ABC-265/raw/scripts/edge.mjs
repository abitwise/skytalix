// qe-ABC-265 boundary probes (not acceptance rows): the table module BEFORE its first clearTable, and key 0n on a
// cleared table, base against head, each in a fresh process. usage: node edge.mjs <tree>
const [tree] = process.argv.slice(2);
const T = await import(`${tree}/src/transposition.ts`);
const mv = { from: 0x14, to: 0x34, piece: 0, captured: 0, flags: 0, promotion: 0 };
const tryIt = (f) => { try { return JSON.stringify(f()); } catch (e) { return `throws ${e.constructor.name}`; } };
const out = { tree: tree.split("/").pop() };
out.preByteLength = tryIt(() => T.tableByteLength());
out.preBuffer = tryIt(() => (typeof T.tableBuffer === "function" ? T.tableBuffer() : "no tableBuffer export"));
out.preProbe0n = tryIt(() => T.probeTable(0n));
out.preProbeK = tryIt(() => T.probeTable(0x1234_5678_9abc_def0n));
out.preStore = tryIt(() => T.storeEntry(0x1234_5678_9abc_def0n, 3, T.BOUND_EXACT, 5, 0, mv));
out.preProbeKAfterStore = tryIt(() => T.probeTable(0x1234_5678_9abc_def0n));
T.clearTable();
out.postProbe0n = tryIt(() => T.probeTable(0n));
T.storeEntry(0n, 3, T.BOUND_EXACT, 5, 0, mv);
out.store0nThenProbe = tryIt(() => T.probeTable(0n));
out.cut0n = tryIt(() => T.tableCutoff(T.probeTable(0n), 3, -1e9, 1e9, 0));
// a key at or above 2^64 and a negative key (out of the zobrist range): both builds should miss
T.clearTable();
T.storeEntry((1n << 64n) + 5n, 3, T.BOUND_EXACT, 5, 0, mv);
out.bigKeyProbe = tryIt(() => T.probeTable((1n << 64n) + 5n));
out.bigKeyProbeTrunc = tryIt(() => T.probeTable(5n));
console.log(JSON.stringify(out));
