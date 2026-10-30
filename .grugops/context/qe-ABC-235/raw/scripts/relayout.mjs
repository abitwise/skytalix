// Re-lays A1 rows as run-a1.sh would with n shards (no engine run): sha256 per n.
import { readFileSync } from "node:fs"; import { createHash } from "node:crypto";
const lines = readFileSync(process.argv[2], "utf8").trim().split("\n");
const objs = lines.map((l) => JSON.parse(l));
const corpus = objs.slice(1, 302).map((o) => o.name);
const idx = new Map(corpus.map((n, i) => [n, i]));
const head = lines.filter((l, i) => { const o = objs[i]; return !("fn" in o) || o.fn.startsWith("choose"); });
const part = (fn) => ["search","searchWithoutNullMove","searchWithoutReductions","searchWithoutPvsOrReductions"].includes(fn) ? "search" : ["searchWithoutTable","searchWithoutKillers","searchWithoutOrdering","searchWithoutQuiescence"].includes(fn) ? "doors" : "unpruned";
const searchRows = lines.map((l, i) => [l, objs[i]]).filter(([, o]) => "fn" in o && !o.fn.startsWith("choose"));
const order = { doors: 0, search: 1, unpruned: 2 };
const fnOrder = ["search","searchWithoutNullMove","searchWithoutReductions","searchWithoutPvsOrReductions","searchWithoutTable","searchWithoutKillers","searchWithoutOrdering","searchWithoutQuiescence","searchWithoutPruning","searchWithoutPruningOrQuiescence"];
for (let n = 1; n <= 32; n++) {
  const s = [...searchRows].sort(([, a], [, b]) => { const pa = order[part(a.fn)], pb = order[part(b.fn)]; if (pa !== pb) return pa - pb; const ia = idx.get(a.name), ib = idx.get(b.name); const sa = ia % n, sb = ib % n; if (sa !== sb) return sa - sb; if (ia !== ib) return ia - ib; return fnOrder.indexOf(a.fn) - fnOrder.indexOf(b.fn); });
  const text = [...head, ...s.map(([l]) => l)].join("\n") + "\n";
  const h = createHash("sha256").update(text).digest("hex");
  if (n === 6 || h.startsWith("812f86ae")) console.log(n, h, text === readFileSync(process.argv[2], "utf8") ? "(= file)" : "");
}
