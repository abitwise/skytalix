// qe-ABC-225-w1: does cutechessArgs() read spec.budget on the r path? usage: node budget-probe.mjs <checkout>
import { join } from "node:path";
const { cutechessArgs } = await import(join(process.argv[2], "tools/rating/rating.ts"));
for (const budget of [1000, 3000, 4000, 9999]) {
  const a = cutechessArgs({ mode: "r", files: "/o", clones: ["/c"], elo: 1910, budget, rounds: 10, concurrency: 1, start: 11 });
  const st = a.filter((t) => t.startsWith("st=") || t.startsWith("timemargin="));
  console.log(`r budget=${budget}: ${st.join(" ")}`);
}
const d = cutechessArgs({ mode: "d", files: "/o", clones: ["/c", "/b"], elo: 1910, budget: 1500, rounds: 10, concurrency: 1 });
console.log(`d budget=1500: ${d.filter((t) => t.startsWith("st=") || t.startsWith("timemargin=")).join(" ")}`);
