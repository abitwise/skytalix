const root = process.argv[2];
const { renderBoard } = await import(`${root}/src/render.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
for (const o of ["white-bottom", "black-bottom"]) {
  for (const m of ["unicode", "ascii"]) {
    const rows = renderBoard(parseFen(START), m, o);
    console.log(`-- ${m} ${o} widths=${[...new Set(rows.map(r => [...r].length))]} utf16=${[...new Set(rows.map(r => r.length))]}`);
    for (const r of rows) console.log(r, "|", [...r].filter(c => c.codePointAt(0) > 0x7f).map(c => "U+" + c.codePointAt(0).toString(16).toUpperCase()).join(" "));
  }
}
// option (b) cost reading: one rank with an SGR foreground on each piece glyph
const row = renderBoard(parseFen(START), "unicode", "white-bottom")[7];
const sgr = row.replace(/[♔-♟]/gu, (g) => `\x1b[97m${g}\x1b[39m`);
console.log(`-- (b) SGR-wrapped rank 1: String.length ${row.length} -> ${sgr.length}; contains ESC[ ${sgr.includes("\x1b[")}`);
