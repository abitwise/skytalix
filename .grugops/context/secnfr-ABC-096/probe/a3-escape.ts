// secnfr-ABC-096 A3 / G7 independent read: adversarial names through the REAL seam at <tree>, counted on the EMITTED
// frame encoded as the UTF-8 bytes a terminal receives. node a3-escape.ts <tree-root>. Not a timing instrument.
const R = process.argv[2];
const { makeRenderSeam } = await import(`${R}/src/render-seam.ts`);
const { newGame, gameStatusOf } = await import(`${R}/src/history.ts`);
const h = newGame("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
const s = gameStatusOf(h);
const names: Record<string, string> = {
  "ESC CSI clear": "\x1b[2J\x1b[HEvil",
  "OSC title + BEL": "\x1b]0;pwned\x07Name",
  "OSC 52 clipboard": "\x1b]52;c;ZWNobyBoaQ==\x07Clip",
  "C0 all": Array.from({ length: 32 }, (_, i) => String.fromCharCode(i)).join("") + "C0",
  "DEL": "A\x7fB",
  "newline / CR": "Line1\nLine2\rLine3",
  "C1 CSI U+009B": "\u009b2JEvil",
  "C1 OSC U+009D + ST U+009C": "\u009d0;pwned\u009cName",
  "C1 all U+0080-U+009F": Array.from({ length: 32 }, (_, i) => String.fromCharCode(0x80 + i)).join("") + "C1",
  "bidi RLO U+202E": "abc‮dcba",
  "zero-width U+200B / BOM U+FEFF": "Ruy​Lopez﻿",
  "lone surrogate": "Ruy\uD800Lopez",
  "accented": "Grünfeld Defense",
  "ESC flood 100,000": "\x1b".repeat(100_000) + "Z",
};
const count = (bytes: Buffer, f: (b: number) => boolean) => bytes.reduce((n, b) => n + (f(b) ? 1 : 0), 0);
const rows: string[] = [];
for (const mode of ["ascii", "unicode"] as const) {
  const base = makeRenderSeam(mode, "white-bottom", { openingName: () => undefined })(h, s, false, []);
  for (const [label, name] of Object.entries(names)) {
    const f = makeRenderSeam(mode, "white-bottom", { openingName: () => name })(h, s, false, []);
    const text = f.join("\n");
    const bytes = Buffer.from(text, "utf8");
    const cps = [...text].map((c) => c.codePointAt(0) as number);
    const baseCps = [...base.join("\n")].map((c) => c.codePointAt(0) as number);
    const c1 = cps.filter((c) => c >= 0x80 && c <= 0x9f).length - baseCps.filter((c) => c >= 0x80 && c <= 0x9f).length;
    const bidi = cps.filter((c) => (c >= 0x202a && c <= 0x202e) || (c >= 0x2066 && c <= 0x2069)).length;
    rows.push(
      [mode, label, `rows ${f.length}/${base.length}`, `ESC ${count(bytes, (b) => b === 0x1b)}`,
       `C0-not-LF ${count(bytes, (b) => b < 0x20 && b !== 0x0a)}`, `DEL ${count(bytes, (b) => b === 0x7f)}`,
       `cp>7F ${cps.filter((c) => c > 0x7f).length - baseCps.filter((c) => c > 0x7f).length}`, `C1cp ${c1}`, `bidi ${bidi}`,
       `row1 ${JSON.stringify((f[f.length - 3] as string).trimEnd())}`].join("\t"),
    );
  }
}
console.log(rows.join("\n"));
