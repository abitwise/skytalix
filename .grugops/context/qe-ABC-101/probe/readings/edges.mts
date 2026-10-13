const W = "/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-101/src/";
const { resolveOptions } = await import(W + "cli-options.ts");
const { createLevelSeam } = await import(W + "level-seam.ts");
const cases: string[][] = [
  ["--difficulty", "3", "--difficulty", "5"], ["--difficulty", "5", "--difficulty", "3"], ["--difficulty", "--colour", "black"],
  ["--difficulty", "--ascii"], ["--difficulty", "3", "3"], ["3"], ["--difficulty", "３"], ["--difficulty", "3\n"], ["--difficulty", "3\u0000"],
  ["--difficulty", "١"], ["--difficulty", "1e0"], ["--difficulty", "0x3"], ["--difficulty", "Infinity"], ["--difficulty", "NaN"],
  ["--colour", "--difficulty", "3"], ["--difficulty", "3", "--colour"], ["--DIFFICULTY", "3"], ["--difficulty", "toString"], ["--difficulty", "hasOwnProperty"],
];
for (const c of cases) { const r = resolveOptions(c); console.log(JSON.stringify(c), "->", r.ok ? `ok difficulty ${r.options.difficulty}` : `refused ${JSON.stringify(r.offending)} (${r.problem})`); }
for (const k of [1, 2, 3, 4, 5, "3", 3.0, -0, 1e0, "1", Number.POSITIVE_INFINITY, "valueOf", "hasOwnProperty", "isPrototypeOf", "length"]) {
  try { createLevelSeam(k as number, { seed: 1 }); console.log(`createLevelSeam(${JSON.stringify(k)}) -> built`); }
  catch (e) { console.log(`createLevelSeam(${JSON.stringify(k)}) -> ${(e as Error).constructor.name}`); }
}
