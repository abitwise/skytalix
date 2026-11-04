// arch-ABC-239-f3f4 D4: R1 through the shipped evaluate of one table's src. usage: node d4.ts <srcdir> <label>
const [srcdir, label] = process.argv.slice(2) as [string, string];
const { evaluate } = await import(`${srcdir}/evaluate.ts`);
const { parseFen } = await import(`${srcdir}/fen.ts`);
const A = "8/8/8/k2p4/3P4/8/8/5K2 w - - 0 1";
const B = "5K2/8/8/k2p4/3P4/8/8/8 w - - 0 1";
const a = evaluate(parseFen(A)); // white to move: white's view
const b = evaluate(parseFen(B));
console.log(`${label}: R1 A(Kf1) ${a} B(Kf8) ${b} A-B ${a - b} |A-B|<=20 ${Math.abs(a - b) <= 20 ? "GREEN" : "RED"}`);
