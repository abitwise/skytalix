// qe-ABC-325: re-derive every figure the reworded README Levels paragraph states. Reads nothing, plays nothing.
// Inputs are the sealed values qe-ABC-324 used: L5 2412.9 +- 51.1, L4 2094.3 +- 47.9, Strength 1902.5 at 0.1 s.
const L5 = 2412.9, L5r = 2413, L4 = 2094.3, L4r = 2094, S01 = 1902.5;
const r = (x) => Math.round(x * 100) / 100;
const out = {};
// G-QE-324-3: the stated cost, 10 to 14 Elo a percentage point at level 4's 5 %
out.cost_at_5pct = [5 * 10, 5 * 14];
const cost = out.cost_at_5pct;
// L4 without blunders, from the README's rounded 2094 and from the recorded 2094.3
out.l4_nb_readme = [L4r + cost[0], L4r + cost[1]];
out.l4_nb_record = [r(L4 + cost[0]), r(L4 + cost[1])];
// "derived, not measured": 0.1 s -> 1 s is log2(10) doublings
const d01_1 = Math.log2(10);
out.rate_sub1s_readme = [r((L4r + cost[0] - S01) / d01_1), r((L4r + cost[1] - S01) / d01_1)];
out.rate_sub1s_record = [r((L4 + cost[0] - S01) / d01_1), r((L4 + cost[1] - S01) / d01_1)];
// top: level 4 (1 s, cost added back) -> level 5 (4 s) is 2 doublings
out.rate_l4nb_to_l5_readme = [r((L5r - (L4r + cost[1])) / 2), r((L5r - (L4r + cost[0])) / 2)];
out.rate_l4nb_to_l5_record = [r((L5 - (L4 + cost[1])) / 2), r((L5 - (L4 + cost[0])) / 2)];
// bottom +50 must sit below +73; top +125 must follow the step
out.bottom_below_sub1s = 50 < out.rate_sub1s_readme[0];
// L6/L7 projections unchanged from qe-ABC-324 (outward to tens)
const d56 = Math.log2(10 / 4), d67 = Math.log2(30 / 10);
const l6 = [L5 + d56 * 50, L5 + d56 * 125];
const l7 = [l6[0] + d67 * 40, l6[1] + d67 * 100];
const outward = (lo, hi) => [Math.floor(lo / 10) * 10, Math.ceil(hi / 10) * 10];
out.l6 = [r(l6[0]), r(l6[1])];
out.l7 = [r(l7[0]), r(l7[1])];
out.l6_outward = outward(...l6);
out.l7_outward = outward(...l7);
out.l5_rounded = `${Math.round(L5)} +- ${Math.round(51.1)}`;
// Strength: 1810 + 92.5
out.strength_x = 1810 + 92.5;
out.elo_from_63pct = r(-400 * Math.log10(1 / 0.63 - 1));
console.log(JSON.stringify(out, null, 1));
