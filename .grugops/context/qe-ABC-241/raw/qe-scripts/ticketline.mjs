// qe-ABC-241: the ticket's A3 line on both trees: first ply with a threefold claim, first fivefold, and the 1.e4 board's own count.
// usage: node ticketline.mjs <baseTree> <headTree>
for (const [name, tree] of [["base", process.argv[2]], ["head", process.argv[3]]]) {
  const H = await import(`${tree}/src/history.ts`);
  const C = await import(`${tree}/src/coordinate-move.ts`);
  const line = ["e2e4", ...Array(8).fill(["g8f6", "g1f3", "f6g8", "f3g1"]).flat()];
  const h = H.newGame("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  let claim = 0, five = 0;
  const e4 = [];
  for (const [i, t] of line.entries()) {
    H.playMove(h, C.parseCoordinateMove(h.position, t).move);
    const s = H.gameStatusOf(h);
    if (!claim && s.claimable) claim = i + 1;
    if (!five && s.reason === "fivefold-repetition") five = i + 1;
    if ((i + 1) % 4 === 1) {
      const l = (H.repetitionKeyHistory ?? H.keyHistory)(h);
      e4.push(`${i + 1}:${l.filter((k) => k === l.at(-1)).length}`);
    }
  }
  console.log(`${name}: first claim ply ${claim}, first fivefold ply ${five}; the 1.e4 board's count at plies ${e4.join(" ")}`);
}
