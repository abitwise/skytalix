const root = process.argv[2];
const { BOUNDS } = await import(`${root}/tools/tune/bounds.ts`);
const { readBound } = await import(`${root}/tools/tune/tune.ts`);
const { SHIPPED } = await import(`${root}/tools/tune/tracer.ts`);
let held = 0, min = Infinity;
for (const r of BOUNDS) {
  const v = readBound(r, SHIPPED);
  const ok = r.strict ? v < r.rhs : v <= r.rhs;
  held += ok ? 1 : 0;
  const slack = r.rhs - v - (r.strict ? 1 : 0);
  min = Math.min(min, slack);
  console.log([ok ? "HOLDS" : "BROKEN", r.file, r.row, r.part ?? "", `read=${v}`, `rhs=${r.rhs}`, r.strict ? "strict" : "le", `slack=${slack}`].join("\t"));
}
console.log(`TOTAL rows=${BOUNDS.length} held=${held} minslack=${min}`);
