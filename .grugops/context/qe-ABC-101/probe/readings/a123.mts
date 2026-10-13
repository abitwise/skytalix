const W = "/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-101/src/";
const { resolveOptions, ACCEPTED_ARGUMENTS, DEFAULT_DIFFICULTY } = await import(W + "cli-options.ts");
const { LEVELS, DEFAULT_LEVEL } = await import(W + "levels.ts");
const { isDeepStrictEqual: eq } = await import("node:util");
const f = resolveOptions(["--colour", "black", "--difficulty", "3"]), r = resolveOptions(["--difficulty", "3", "--colour", "black"]);
console.log("A1 forward", JSON.stringify(f)); console.log("A1 equal both orders:", eq(f, r));
for (const d of ["1","2","4","5"]) { const a = resolveOptions(["--colour","white","--difficulty",d]), b = resolveOptions(["--difficulty",d,"--colour","white"]); if (!eq(a,b) || !a.ok || a.options.difficulty !== Number(d)) console.log("A1 extra FAIL", d); }
console.log("A1 both orders for 1,2,4,5 with --colour white: checked");
const keys = Object.keys(LEVELS).map(Number).sort((a,b)=>a-b);
const d0 = resolveOptions([]);
console.log(`A2 default ${d0.ok && d0.options.difficulty}; DEFAULT_DIFFICULTY ${DEFAULT_DIFFICULTY}; middle of keys ${keys[(keys.length-1)/2]}; max ${Math.max(...keys)}; DEFAULT_LEVEL ${DEFAULT_LEVEL}`);
const inSet = keys.map(k => [k, resolveOptions(["--difficulty", String(k)])]).map(([k, x]) => `${k}:${x.ok && x.options.difficulty === k}`);
console.log("A3 members", inSet.join(" "));
for (const argv of [["--difficulty","0"],["--difficulty","6"],["--difficulty","-1"],["--difficulty","3.5"],["--difficulty","three"],["--difficulty"],["--ascii","--difficulty"]]) {
  const x = resolveOptions(argv); console.log("A3 refused", JSON.stringify(argv), "->", x.ok ? "ACCEPTED (FAIL)" : `ok:false offending ${JSON.stringify(x.offending)} options ${"options" in x ? "PRESENT" : "absent"}`);
}
const words = ACCEPTED_ARGUMENTS.filter(w => resolveOptions(["--difficulty", w]).ok);
console.log("A3 extended: accepted level words", JSON.stringify(words), "= Object.keys(LEVELS)", JSON.stringify(Object.keys(LEVELS)), eq([...words].sort(), Object.keys(LEVELS).sort()));
// also: no OTHER string (outside the enumeration) is accepted as a level among a sweep
let leaks = 0; for (let i = -20; i < 40; i++) for (const s of [String(i), ` ${i}`, `${i}.0`, `+${i}`, `0${i}`]) { const x = resolveOptions(["--difficulty", s]); if (x.ok && !["1","2","3","4","5"].includes(s)) leaks++; }
console.log("A3 sweep of 300 near-number spellings outside 1..5: accepted", leaks);
