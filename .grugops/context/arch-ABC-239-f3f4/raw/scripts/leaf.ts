// arch-ABC-239-f3f4 D2: per-family contribution (White's view, blended at the position's phase) at the base and
// candidate tables, through the tracer's model. usage: node leaf.ts <candworktree> <tabsdir> <label=fen>...
const [wt, tabs, ...items] = process.argv.slice(2) as [string, string, ...string[]];
const T = await import(`${wt}/tools/tune/tracer.ts`);
const { parseFen } = await import(`${wt}/src/fen.ts`);
const tabsOf = { base: T.tableOf(await import(`${tabs}/base.ts`)), cand: T.tableOf(await import(`${tabs}/cand.ts`)) };
const fam = (t: number): string => {
  if (t < T.T_PST) return "MAT";
  if (t < T.T_PASS) return ["P", "NB", "NB", "R", "Q", "K"][Math.floor((t - T.T_PST) / 64)] as string;
  if (t < T.T_DBL) return "PASS";
  if (t <= T.T_ISO) return "STRUCT";
  return "KFILE";
};
for (const it of items) {
  const i = it.indexOf("=");
  const label = it.slice(0, i);
  const tr = T.trace(parseFen(it.slice(i + 1)));
  const out: Record<string, Record<string, number>> = {};
  for (const [k, th] of Object.entries(tabsOf) as [string, any][]) {
    const c: Record<string, number> = {};
    for (let j = 0; j < tr.f.length; j += 2) {
      const t = tr.f[j], n = tr.f[j + 1];
      const f = fam(t);
      c[f] = (c[f] ?? 0) + ((tr.w * th.mg[t] + (24 - tr.w) * th.eg[t]) * n) / 24;
    }
    const mm = Math.max(-th.cap, Math.min(th.cap, th.wmg * tr.m));
    const me = Math.max(-th.cap, Math.min(th.cap, th.weg * tr.m));
    c.MOB = (tr.w * mm + (24 - tr.w) * me) / 24;
    c.TOTAL = T.model(tr.f, tr.m, tr.w, th);
    for (const key of Object.keys(c)) c[key] = Math.round(c[key] * 100) / 100;
    out[k] = c;
  }
  console.log(JSON.stringify({ label, w: tr.w, m: tr.m, ...out }));
}
