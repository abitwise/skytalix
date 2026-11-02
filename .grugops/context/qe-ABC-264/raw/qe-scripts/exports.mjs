// qe-ABC-264 A1 export diff: names head's search.ts / engine.ts export that base's do not, and the reverse.
const [B, H] = process.argv.slice(2);
for (const m of ["search", "engine"]) {
  const kb = Object.keys(await import(`${B}/src/${m}.ts`)), kh = Object.keys(await import(`${H}/src/${m}.ts`));
  console.log(JSON.stringify({ module: `src/${m}.ts`, base: kb.length, head: kh.length, added: kh.filter((k) => !kb.includes(k)), removed: kb.filter((k) => !kh.includes(k)) }));
}
