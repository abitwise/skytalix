NAME="R2p-compile-keyOf-skips-zobristKey"
CMD="npx vitest run tools/opening-book/book.test.ts"
EDITS=[("tools/opening-book/compile.ts",'const keyOf = (position: Position): string => zobristKey(position).toString(16).padStart(16, "0");',
'const keyOf = (position: Position): string => // PLANT: the key no longer calls zobristKey\n  [...toFen(position)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(16).padStart(16, "0");')]
