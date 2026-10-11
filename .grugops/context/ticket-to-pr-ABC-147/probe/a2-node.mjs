// ABC-147 A2, plain-node side. Usage: WHICH=E|S OUT_JSON=<file> node a2-node.mjs
import { writeFileSync } from "node:fs";
import { measure } from "./workload.mjs";
writeFileSync(process.env.OUT_JSON, JSON.stringify({ runner: "node", ...measure(process.env.WHICH) }));
