const W = "/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-secnfr-ABC-101/src/";
const { resolveOptions, ACCEPTED_ARGUMENTS } = await import(W + "cli-options.ts");
const { createLevelSeam } = await import(W + "level-seam.ts");
const { LEVELS } = await import(W + "levels.ts");
const values = ["__proto__","constructor","toString","valueOf","hasOwnProperty","isPrototypeOf","__defineGetter__","length",
  "３","٣","3\u0000","3\n","3 ","\t3","0x3","3e0","0b11","0o3","Infinity","NaN","-0","1,2","3​","\u001b[2J3","",
  "3.","03","+3","3.0","0","6","-1","3.5","three","1 2","１"];
let accepted = 0; const acc = [];
for (const v of values) { const r = resolveOptions(["--difficulty", v]); if (r.ok) { accepted++; acc.push(JSON.stringify(v)); } }
console.log(`--difficulty <v> over ${values.length} hostile values: accepted ${accepted}${acc.length ? " " + acc.join(",") : ""}`);
const argvs = [["3"],["1"],["--difficulty=3"],["--DIFFICULTY","3"],["-d","3"],["--difficulty","--difficulty","3"],["--difficulty","3","--difficulty","5"],
  ["--difficulty","5","--difficulty","1"],["--difficulty","3","3"],["--colour","3"],["--difficulty","white"],["--difficulty","--ascii"]];
for (const a of argvs) { const r = resolveOptions(a); console.log(`${JSON.stringify(a)} -> ${r.ok ? `ok difficulty ${r.options.difficulty}` : `refused: ${r.problem} [${r.offending.map((x)=>JSON.stringify(x)).join(",")}]`}`); }
let okCount = 0; for (const w of ACCEPTED_ARGUMENTS) if (resolveOptions(["--difficulty", w]).ok) okCount++;
console.log(`accepted words after --difficulty, of ACCEPTED_ARGUMENTS: ${okCount}; Object.keys(LEVELS) = ${JSON.stringify(Object.keys(LEVELS))}`);
const keys = [1,2,3,4,5,"3",3.0,0,6,-0,3.5,NaN,Infinity,-1,"constructor","__proto__","toString","valueOf","hasOwnProperty","03"," 3"];
for (const k of keys) { let out; try { createLevelSeam(k, { seed: 1 }); out = "built"; } catch (e) { out = `${e.constructor.name}: ${e.message}`; } console.log(`createLevelSeam(${typeof k === "string" ? JSON.stringify(k) : Object.is(k,-0) ? "-0" : String(k)}) -> ${out}`); }
console.log(`prototype keys visible by bracket: constructor=${typeof LEVELS["constructor"]}, __proto__=${typeof LEVELS["__proto__"]}; hasOwn: ${Object.hasOwn(LEVELS,"constructor")}/${Object.hasOwn(LEVELS,"__proto__")}; frozen: ${Object.isFrozen(LEVELS)}`);
