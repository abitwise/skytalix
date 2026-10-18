// qe2-ABC-167 probe: dialogues on the keyword boundary and release order. Usage: node probe.ts <tree>
const tree = process.argv[2];
const { createUciSession } = await import(`${tree}/src/uci-session.ts`);
const { virtualClock } = await import(`${tree}/src/virtual-clock.ts`);
const scripts: string[][] = [
  ["position startpos", "go movetime depth 3"],
  ["position startpos", "go wtime 1000 btime 1000 movestogo depth 3"],
  ["position startpos", "go depth infinite", "stop"],
  ["position startpos", "go searchmoves e2e4 infinite", "stop"],
  ["position startpos", "go movetime winc 1000 depth 2"],
  ["position startpos", "go infinite", "position startpos moves e2e5"],
];
for (const lines of scripts) {
  const out: string[] = [];
  const s = createUciSession({ write: (l: string) => out.push(l), now: virtualClock(100) });
  const per = lines.map((l) => { const b = out.length; s.handleLine(l); return out.slice(b).map((x) => x.replace(/ score .* nodes \d+ /, " … ").replace(/ nps \d+/, "")); });
  console.log(JSON.stringify(lines.at(-1)), "->", JSON.stringify(per.slice(1)));
}
