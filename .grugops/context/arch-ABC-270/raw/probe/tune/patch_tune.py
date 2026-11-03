#!/usr/bin/env python3
# arch-ABC-270 D5: derive extract.ts / diag5.ts from arch-ABC-239's prototype (extract.ts, diag2.ts; logic unchanged)
# by adding three queen-on exposure features (the king's shelter / half-open / open counts while the ENEMY has a
# queen), at base value 0, so the identity gate and D4 reproduce exactly. Usage: patch_tune.py <proto dir> <out dir>
import sys
src, dst = sys.argv[1], sys.argv[2]

def edit(s, old, new, count=1):
    assert s.count(old) == count, (old, s.count(old))
    return s.replace(old, new)

e = open(f"{src}/extract.ts").read()
e = edit(e, "export const T_DBL = 395, T_ISO = 396, T_SHEL = 397, T_HALF = 398, T_OPEN = 399;",
         "export const T_DBL = 395, T_ISO = 396, T_SHEL = 397, T_HALF = 398, T_OPEN = 399;\n"
         "export const T_SHELQ = 400, T_HALFQ = 401, T_OPENQ = 402; // arch-ABC-270 D5: queen-on exposure counts\n"
         "export const N_TERMS = 403;")
e = edit(e, "  let m = 0, phase = 0, wk = -1, bk = -1;", "  let m = 0, phase = 0, wk = -1, bk = -1, wq = false, bq = false;")
e = edit(e, "    if (t === KING) { if (bl) bk = sq; else wk = sq; } else phase += P.PHASE_WEIGHT[t];",
         "    if (t === 5) { if (bl) bq = true; else wq = true; }\n"
         "    if (t === KING) { if (bl) bk = sq; else wk = sq; } else phase += P.PHASE_WEIGHT[t];")
e = edit(e, "  add(T_SHEL, eb[0] - ew[0]); add(T_HALF, eb[1] - ew[1]); add(T_OPEN, eb[2] - ew[2]);",
         "  add(T_SHEL, eb[0] - ew[0]); add(T_HALF, eb[1] - ew[1]); add(T_OPEN, eb[2] - ew[2]);\n"
         "  // the black king's counts while White has a queen, minus the white king's while Black has one\n"
         "  add(T_SHELQ, (wq ? eb[0] : 0) - (bq ? ew[0] : 0)); add(T_HALFQ, (wq ? eb[1] : 0) - (bq ? ew[1] : 0)); add(T_OPENQ, (wq ? eb[2] : 0) - (bq ? ew[2] : 0));")
e = edit(e, "const mg = new Float64Array(400), eg = new Float64Array(400);", "const mg = new Float64Array(N_TERMS), eg = new Float64Array(N_TERMS);")
open(f"{dst}/extract.ts", "w").write(e)

d = open(f"{src}/diag2.ts").read()
d = edit(d, 'replace(/diag2\\.ts$/, "extract.ts")', 'replace(/diag5\\.ts$/, "extract.ts")')
# layout: [sc mg (NS=19), sc eg (19), wmg, weg, PST]; material frozen; queen terms frozen at 0 in D4r only
d = edit(d, "let MODE: \"ce\" | \"mse\" = \"ce\"; let FREEZE = false; const FROZEN = new Set([0, 1, 2, 3, 4, 16, 17, 18, 19, 20]);",
         "let MODE: \"ce\" | \"mse\" = \"ce\"; let FREEZE = false; const NS = 19;\n"
         "const FROZEN_MAT = [0, 1, 2, 3, 4, NS, NS + 1, NS + 2, NS + 3, NS + 4];\n"
         "const QIDX = [16, 17, 18, NS + 16, NS + 17, NS + 18];\n"
         "let FROZEN = new Set(FROZEN_MAT);")
d = edit(d, "const BOUNDED = new Set<number>([...Array.from({length: 11}, (_, i) => 5 + i), ...Array.from({length: 11}, (_, i) => 21 + i), 32, 33, ...Array.from({length: 12}, (_, i) => 34 + i)]);",
         "const BOUNDED = new Set<number>([...Array.from({length: 14}, (_, i) => 5 + i), ...Array.from({length: 14}, (_, i) => NS + 5 + i), 2 * NS, 2 * NS + 1, ...Array.from({length: 12}, (_, i) => 2 * NS + 2 + i)]);")
d = edit(d, "const { T_MAT, T_PST, T_PASS, T_DBL, T_ISO, T_SHEL, T_HALF, T_OPEN } = X;",
         "const { T_MAT, T_PST, T_PASS, T_DBL, T_ISO, T_SHEL, T_HALF, T_OPEN, T_SHELQ, T_HALFQ, T_OPENQ } = X;")
d = edit(d, "T_PASS + 5, T_DBL, T_ISO, T_SHEL, T_HALF, T_OPEN];", "T_PASS + 5, T_DBL, T_ISO, T_SHEL, T_HALF, T_OPEN, T_SHELQ, T_HALFQ, T_OPENQ];")
d = edit(d, "  const nSc = 34;", "  const nSc = 2 * NS + 2;")
d = edit(d, "  SC.forEach((t, i) => { z0[i] = E1.mg[t]; z0[16 + i] = E1.eg[t]; });\n  z0[32] = E1.wmg; z0[33] = E1.weg;",
         "  SC.forEach((t, i) => { z0[i] = E1.mg[t]; z0[NS + i] = E1.eg[t]; });\n  z0[2 * NS] = E1.wmg; z0[2 * NS + 1] = E1.weg;")
d = edit(d, "      if (s !== undefined) { add(s, wm * c); add(16 + s, we * c); e += wm * c * z[s]! + we * c * z[16 + s]!; continue; }",
         "      if (s !== undefined) { add(s, wm * c); add(NS + s, we * c); e += wm * c * z[s]! + we * c * z[NS + s]!; continue; }")
d = edit(d, "    const am = z[32]! * p.m, ae = z[33]! * p.m;\n    if (Math.abs(am) < CAP) { add(32, wm * p.m); e += wm * am; } else e += wm * Math.sign(am) * CAP;\n    if (Math.abs(ae) < CAP) { add(33, we * p.m); e += we * ae; } else e += we * Math.sign(ae) * CAP;",
         "    const am = z[2 * NS]! * p.m, ae = z[2 * NS + 1]! * p.m;\n    if (Math.abs(am) < CAP) { add(2 * NS, wm * p.m); e += wm * am; } else e += wm * Math.sign(am) * CAP;\n    if (Math.abs(ae) < CAP) { add(2 * NS + 1, we * p.m); e += we * ae; } else e += we * Math.sign(ae) * CAP;")
d = edit(d, "    SC.forEach((t, i) => { mg[t] = z[i]!; eg[t] = z[16 + i]!; });", "    SC.forEach((t, i) => { mg[t] = z[i]!; eg[t] = z[NS + i]!; });")
d = edit(d, "    return { mg, eg, wmg: z[32]!, weg: z[33]!, cap: CAP };", "    return { mg, eg, wmg: z[2 * NS]!, weg: z[2 * NS + 1]!, cap: CAP };")
d = edit(d, "for (let j = 34; j < cfg.n; j++)", "for (let j = 2 * NS + 2; j < cfg.n; j++)")
d = edit(d, "for (let j = 34; j < n; j++)", "for (let j = 2 * NS + 2; j < n; j++)")
d = edit(d, "halfOpen: pick(T_HALF), open: pick(T_OPEN), mobility",
         "halfOpen: pick(T_HALF), open: pick(T_OPEN), shelterQ: pick(T_SHELQ), halfOpenQ: pick(T_HALFQ), openQ: pick(T_OPENQ), mobility")
d = edit(d, '["open", T_OPEN]] as const) if', '["open", T_OPEN], ["shelQ", T_SHELQ], ["halfQ", T_HALFQ], ["openQ", T_OPENQ]] as const) if')
# runs: D4r = D4 with the queen terms frozen at 0 (must reproduce D4); D5 = the queen terms free and bounded >= 0
d = edit(d, 'for (const [name, mode, freeze] of [["D4", "ce", true]] as const) {\n  MODE = mode; FREEZE = freeze;',
         'for (const [name, mode, freeze, qfree] of [["D4r", "ce", true, false], ["D5", "ce", true, true]] as const) {\n'
         '  MODE = mode; FREEZE = freeze; FROZEN = new Set(qfree ? FROZEN_MAT : [...FROZEN_MAT, ...QIDX]);')
open(f"{dst}/diag5.ts", "w").write(d)
print("ok")
