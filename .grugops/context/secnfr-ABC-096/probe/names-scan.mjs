import { readFileSync } from "node:fs";
const book = JSON.parse(readFileSync(process.argv[2], "utf8"));
const pos = Object.values(book.positions);
let named = 0, nonStr = 0; const cps = new Map(); let maxLen = 0;
const cls = { c1: 0, cf: 0, bidi: 0, mn: 0, wide: 0, above7f: 0, astral: 0 };
const ex = {};
for (const e of pos) {
  if (!("n" in e)) continue;
  if (typeof e.n !== "string") { nonStr++; continue; }
  named++; maxLen = Math.max(maxLen, e.n.length);
  for (const ch of e.n) {
    const c = ch.codePointAt(0);
    const hit = (k) => { cls[k]++; ex[k] ??= `${e.n} U+${c.toString(16)}`; };
    if (c > 0x7f) { hit("above7f"); cps.set(ch, (cps.get(ch) ?? 0) + 1); }
    if (c >= 0x80 && c <= 0x9f) hit("c1");
    if (/\p{Cf}/u.test(ch)) hit("cf");
    if ((c >= 0x202a && c <= 0x202e) || (c >= 0x2066 && c <= 0x2069) || c === 0x200e || c === 0x200f || c === 0x61c) hit("bidi");
    if (/\p{M}/u.test(ch)) hit("mn");
    if (/[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/u.test(ch) || c >= 0x1f300) hit("wide");
    if (c > 0xffff) hit("astral");
  }
}
console.log(JSON.stringify({ entries: pos.length, named, nonStr, maxLen, cls, ex, distinctAbove7f: [...cps.entries()].map(([k, v]) => `U+${k.codePointAt(0).toString(16)}(${k}) x${v}`) }, null, 1));
