const { parseFen } = await import(`${process.argv[2]}/src/fen.ts`);
const r = parseFen("4k3/8/8/8/8/8/8/4K3 w - - 0 10000");
console.log("fullmoveNumber =", r.fullmoveNumber ?? r.position?.fullmoveNumber ?? Object.keys(r));
