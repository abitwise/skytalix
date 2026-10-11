// ABC-083 A10 (pawnless, ABC-081 G6 knight pair): pre-ABC-121 search score, table on and off, by depth.
// Usage: node g6.mjs <tree-root> <label>
const [root, label] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
for (const [n, f] of [["knight-g1 w K", "4k3/8/8/8/8/8/8/4K1NR w K - 0 1"], ["knight-g1 w -", "4k3/8/8/8/8/8/8/4K1NR w - - 0 1"]])
  for (const d of [3, 4, 5]) {
    const on = S.searchWithoutPvsOrReductions(parseFen(f), d), off = S.searchWithoutTable(parseFen(f), d), sh = S.search(parseFen(f), d);
    console.log(JSON.stringify({ label, name: n, depth: d, on: on.score, off: off.score, search: sh.score }));
  }
