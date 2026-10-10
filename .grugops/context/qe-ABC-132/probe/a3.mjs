// QE ABC-132 A3: header docblock, ' * ' stripped, whitespace collapsed; required words + kept sentences.
import { execFileSync } from "node:child_process";
const [repo, base, tip] = process.argv.slice(2);
const show = (rev, f) => execFileSync("git", ["-C", repo, "show", `${rev}:${f}`], { encoding: "utf8" });
const doc = (s) => { const m = s.match(/\/\*\*([\s\S]*?)\*\//); return m[1].split("\n").map((l) => l.replace(/^\s*\*\s?/, "")).join(" ").replace(/\s+/g, " ").trim(); };
const span = (d, a, z) => { const i = d.indexOf(a); if (i < 0) return null; const j = d.indexOf(z, i); return j < 0 ? null : d.slice(i, j + z.length); };
const cases = [
  ["src/render-seam.ts", ["COMPOSITION_ROOT", "ADR-0029"], "The one runtime edge that could breach the premise", "must STAY `import type`."],
  ["src/result-screen.ts", ["ADR-0029", "NOT on the frame path"], "`INPUT_ENDED_NOTICE`", "non-frame write to the sink."],
];
for (const [f, words, a, z] of cases) {
  const b = doc(show(base, f)), t = doc(show(tip, f));
  const kb = span(b, a, z), kt = span(t, a, z);
  console.log(f);
  for (const w of words) console.log(`  contains ${JSON.stringify(w)}: base=${b.includes(w)} tip=${t.includes(w)}`);
  console.log(`  kept sentence present base=${!!kb} tip=${!!kt} identical=${kb !== null && kb === kt} (${kt?.length} chars)`);
  console.log(`  tip kept: ${kt}`);
}
