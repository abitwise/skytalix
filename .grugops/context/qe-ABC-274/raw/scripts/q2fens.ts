const [S] = process.argv.slice(2);
const { buildCorpus } = await import(`${S}/H/src/evaluate.mirror-corpus.ts`);
const { TAPER_DOOR_CORPUS } = await import(`${S}/H/src/evaluate.taper-corpus.ts`);
const { MATE_CORPUS } = await import(`${S}/H/src/search.mate-corpus.ts`);
const { parseFen, toFen } = await import(`${S}/H/src/fen.ts`);
const C = [...buildCorpus().map((e: any) => [e.name, toFen(e.position)]), ...TAPER_DOOR_CORPUS.map((r: any) => [r.id ?? "door", r.fen]), ...MATE_CORPUS.map((f: string) => ["mate", toFen(parseFen(f))])];
for (const i of [70,71,72,73,74,75,238,239,240,241,288,289,290,291,300,301,360,361,363,364,366,367,186,187,202,203]) console.log(i, C[i][0], C[i][1]);
