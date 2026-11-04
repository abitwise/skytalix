// se-ABC-270 K1 (b): the pre-ticket evaluate (tree B = main 4cb84035) on G3's 184 (buildCorpus order), QE's ABC-269 door corpus
// (176, in order) and QE's ABC-270 pair positions (unique A/B FENs, then their mirrors). Prints TS literals.
const [B, pairsPath] = process.argv.slice(2);
const { readFileSync } = await import("node:fs");
const ev = await import(`${B}/src/evaluate.ts`);
const { parseFen, toFen } = await import(`${B}/src/fen.ts`);
const { buildCorpus, mirrorPosition } = await import(`${B}/src/evaluate.mirror-corpus.ts`);
const { TAPER_DOOR_CORPUS } = await import(`${B}/src/evaluate.taper-corpus.ts`);
const lit = (v: number) => (Object.is(v, -0) ? "-0" : String(v));
const g3 = buildCorpus().map((e: any) => ev.evaluate(e.position));
const door = TAPER_DOOR_CORPUS.map((r: any) => ev.evaluate(parseFen(r.fen)));
const pairs = JSON.parse(readFileSync(pairsPath, "utf8"));
const fens = [...new Set(pairs.rows.flatMap((r: any) => [r.A, r.B]))] as string[];
const qp = [...fens.map((f) => [f, ev.evaluate(parseFen(f))] as const), ...fens.map((f) => { const m = mirrorPosition(parseFen(f)); return [toFen(m), ev.evaluate(m)] as const; })];
const negz = [...g3, ...door, ...qp.map((x) => x[1])].filter((v) => Object.is(v, -0)).length;
console.log(`// g3 ${g3.length} door ${door.length} queen ${qp.length} negzero ${negz}`);
console.log(`const G3_PRE: readonly number[] = [${g3.map(lit).join(", ")}];`);
console.log(`const DOOR_PRE: readonly number[] = [${door.map(lit).join(", ")}];`);
console.log(`const QUEEN_PAIR_PRE: ReadonlyArray<readonly [string, number]> = [\n${qp.map(([f, v]) => `  [${JSON.stringify(f)}, ${lit(v)}],`).join("\n")}\n];`);
