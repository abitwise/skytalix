// Replicates deepen's Budget literal shape (src/engine.ts:705-720): 10 leading fields then ...heuristics, vs written out.
const H1 = { pvs: true, reductions: true, nullMove: true, priorKeys: true, quiescenceEvasions: true, quietPromotions: true };
const H2 = { pvs: false, reductions: false, nullMove: false, priorKeys: false, quiescenceEvasions: false, quietPromotions: false };
const spread = (h) => { const b = { now: Date.now, deadline: 1, maxNodes: Infinity, nodes: 0, nextCheck: Infinity, visit: () => 0, killers: {}, keys: new BigUint64Array(2), prior: [], ...h }; return b; };
const lit = (h) => ({ now: Date.now, deadline: 1, maxNodes: Infinity, nodes: 0, nextCheck: Infinity, visit: () => 0, killers: {}, keys: new BigUint64Array(2), prior: [], pvs: h.pvs, reductions: h.reductions, nullMove: h.nullMove, priorKeys: h.priorKeys, quiescenceEvasions: h.quiescenceEvasions, quietPromotions: h.quietPromotions });
const a = spread(H1), b = spread(H2), c = lit(H1);
a.nodes++; a.nextCheck = 5;
console.log(JSON.stringify({ spreadFast: %HasFastProperties(a), spreadSameMapAcrossDoors: %HaveSameMap(a, b), litFast: %HasFastProperties(c), spreadSameMapAsLiteral: %HaveSameMap(spread(H1), c) }));
