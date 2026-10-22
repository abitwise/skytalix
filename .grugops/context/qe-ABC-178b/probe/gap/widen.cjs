const fs = require("fs"); const p = process.argv[2]; const t = fs.readFileSync(p, "utf8");
const a = '    expect(held.out.filter((line) => line.startsWith("bestmove"))).toEqual([]);\n    expect(talk(["stop", "ponderhit"]).out).toEqual([]);\n';
const b = '    expect(held.out.filter((line) => line.startsWith("bestmove"))).toEqual([]);\n    expect(talk(["stop", "ponderhit", "position startpos", "ucinewgame"]).out).toEqual([]);\n';
if (t.split(a).length !== 2) throw new Error("anchor " + (t.split(a).length - 1)); fs.writeFileSync(p, t.replace(a, () => b));
