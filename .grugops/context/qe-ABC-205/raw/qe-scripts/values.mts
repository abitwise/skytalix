const tree = process.argv[2];
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { evaluate } = await import(`${tree}/src/evaluate.ts`);
const s = (f: string) => evaluate(parseFen(f));
const d = (a: string, b: string) => s(a) - s(b);
const r = (f: string) => f.replace("q", "r");
const G1 = "r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 1";
const E1 = "r1bqk2r/pp2bppp/2n1pn2/3p4/8/2NBPN2/PP1P1PPP/R1BQK2R w KQkq - 0 1";
const pairs: [string,string,string][] = [
 ["g1 g2 missing", G1, "r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3P1P/R1BQ1RK1 w - - 0 1"],
 ["g1 g4", G1, "r1bq1rk1/pp2bppp/2n1pn2/3p4/3P2P1/2NBPN2/PP3P1P/R1BQ1RK1 w - - 0 1"],
 ["g1 f2 missing", G1, "r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP4PP/R1BQ1RK1 w - - 0 1"],
 ["g1 h4", G1, "r1bq1rk1/pp2bppp/2n1pn2/3p4/3P3P/2NBPN2/PP3PP1/R1BQ1RK1 w - - 0 1"],
 ["e1 d gone", E1, "r1bqk2r/pp2bppp/2n1pn2/3p4/8/2NBPN2/PP3PPP/R1BQK2R w KQkq - 0 1"],
 ["e1 e open", "r1bqk2r/pp1nbppp/2n5/3p4/8/2NBPN2/PP1P1PPP/R1BQK2R w KQkq - 0 1", "r1bqk2r/pp1nbppp/2n5/3p4/8/2NB1N2/PP1P1PPP/R1BQK2R w KQkq - 0 1"],
 ["e1 f4", E1, "r1bqk2r/pp2bppp/2n1pn2/3p4/5P2/2NBPN2/PP1P2PP/R1BQK2R w KQkq - 0 1"],
 ["e1 d4", "r1bqk2r/pp2bppp/2n1pn2/8/8/2NBPN2/PP1P1PPP/R1BQK2R w KQkq - 0 1", "r1bqk2r/pp2bppp/2n1pn2/8/3P4/2NBPN2/PP3PPP/R1BQK2R w KQkq - 0 1"],
];
const out: Record<string, unknown> = {};
for (const [l, a, b] of pairs) out[`A1 ${l} q|r`] = `${d(a, b)} | ${d(r(a), r(b))}`;
out["A2 ending e4|g1"] = `${s("k7/5ppp/8/8/4K3/8/PPP5/8 w - - 0 1")} | ${s("k7/5ppp/8/8/8/8/PPP5/6K1 w - - 0 1")}`;
out["A2 mg g1|e2"] = `${s(G1)} | ${s("r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP2KPPP/R1BQ1R2 w - - 0 1")}`;
out["A3 queens-only drop"] = d("3q3k/pppp1ppp/8/8/8/8/PPPP4/1K1Q4 w - - 0 1", "3q3k/pp3ppp/8/8/8/8/PP6/1K1Q4 w - - 0 1");
out["A3 full drop"] = d("r1bq1rk1/pppnbppp/4pn2/8/8/2N1PN2/PPPPBPPP/1KBRQ2R w - - 0 1", "r1bq1rk1/pp1nbppp/4pn2/8/8/2N1PN2/PP2BPPP/1KBRQ2R w - - 0 1");
out["A3b drop"] = d("r1b2rk1/pp2bppp/2n1pn2/8/8/2NBPN2/PP3PPP/R1B2RK1 w - - 0 1", "r1b2rk1/pp2bppp/2n1pn2/8/6P1/2NBPN2/PP3P1P/R1B2RK1 w - - 0 1");
console.log(JSON.stringify(out, null, 0));
