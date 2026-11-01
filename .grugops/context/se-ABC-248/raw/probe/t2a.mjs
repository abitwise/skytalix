// se-ABC-248 T2a, PREREG order: which of A5's six rows may leave the default lane under default-lane kill
// parity, read from the base kill sets. Usage: node t2a.mjs kill-base-uci.jsonl
import { readFileSync } from "node:fs";

const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => JSON.parse(l));
const A5 = "ABC-167 A5 — the D4 time rule, read from the info line's time > ";
const ORDER = ["a bare go: ", "G = 3 500, under the default level 5's 4 000: ", "movetime 100: ", "A5-b3: ", "white reads wtime: ", "black reads btime: "];
const ctl = rows.find((r) => r.id === "CONTROL");
console.log("CONTROL ran", ctl.ran, "failed", ctl.failed.length);
const killed = rows.filter((r) => r.id !== "CONTROL" && r.failed.length > 0);
const survived = rows.filter((r) => r.id !== "CONTROL" && r.failed.length === 0).map((r) => r.id);
console.log(`killed ${killed.length} / ${rows.length - 1}; survivors: ${survived.join(" ") || "-"}`);
const full = (prefix) => {
  const all = new Set(rows.flatMap((r) => r.failed));
  return [...all].filter((n) => n.startsWith(A5 + prefix));
};
for (const p of ORDER) {
  const name = full(p);
  const ids = killed.filter((r) => r.failed.some((f) => f.startsWith(A5 + p))).map((r) => r.id);
  const sole = killed.filter((r) => r.failed.length === 1 && r.failed[0].startsWith(A5 + p)).map((r) => r.id);
  console.log(`row "${p.slice(0, -2)}" (${name.length} name) kills {${ids.join(",")}} sole killer of {${sole.join(",") || "-"}}`);
}
const moved = [];
for (const p of ORDER) {
  const trial = [...moved, p];
  const lost = killed.filter((r) => r.failed.every((f) => trial.some((q) => f.startsWith(A5 + q)))).map((r) => r.id);
  if (lost.length === 0) {
    moved.push(p);
    console.log(`MOVE  "${p.slice(0, -2)}"`);
  } else console.log(`STAY  "${p.slice(0, -2)}": its move (with ${moved.length} already moved) loses {${lost.join(",")}}`);
}
console.log("moved set:", moved.map((p) => p.slice(0, -2)).join(" | "));
