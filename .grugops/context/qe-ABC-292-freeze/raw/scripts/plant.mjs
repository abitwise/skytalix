// qe-ABC-292-freeze: writes a copy of fixtures.json with four planted errors, to show verify.mjs bites.
//  1 RD1: doubled rooks counted per rook (40), not per file;  2 RW1: the "ahead of the rook" reading (open 20);
//  3 P3-W: a third bishop adding a second pair (100);        4 FB4: stm with the wrong sign.
// usage: node plant.mjs <fixtures.json> <out.json>   (the copy goes to scratch, never to the records)
import { readFileSync, writeFileSync } from "node:fs";
const d = JSON.parse(readFileSync(process.argv[2], "utf8"));
const g = (id) => d.k1c.find((r) => r.id === id);
Object.assign(g("RD1-doubled-open").white, { openFiles: ["a", "a"], parts: { ...g("RD1-doubled-open").white.parts, ROOK_OPEN_FILE: { mg: 40, eg: 40 } } });
Object.assign(g("RD1-doubled-open"), { net: 40, stm: 40 });
Object.assign(g("RW1-ownbehind").white, { openFiles: ["e"], parts: { ...g("RW1-ownbehind").white.parts, ROOK_OPEN_FILE: { mg: 20, eg: 20 } } });
Object.assign(g("RW1-ownbehind"), { net: 20, stm: 20 });
Object.assign(g("P3-W-three").white, { parts: { ...g("P3-W-three").white.parts, BISHOP_PAIR: { mg: 100, eg: 100 } } });
Object.assign(g("P3-W-three"), { net: 100, stm: 100 });
g("FB4-largest").stm = -90;
writeFileSync(process.argv[3], JSON.stringify(d, null, 2));
