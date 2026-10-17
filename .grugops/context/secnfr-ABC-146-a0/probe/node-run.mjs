// ABC-146 A0, the plain-node arm: `node node-run.mjs`. Writes one JSON object to the path in A0_OUT.
import { writeFileSync } from "node:fs";
import { runWorkload } from "./workload.mjs";

const out = process.env.A0_OUT;
if (!out) throw new Error("A0_OUT is not set");
const r = runWorkload();
writeFileSync(out, JSON.stringify({ runner: "node", node: process.version, ...r }));
