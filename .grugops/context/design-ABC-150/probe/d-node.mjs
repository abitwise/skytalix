// ABC-150 D1/D2, plain-node side. Identical for every candidate. Usage: WHICH=E|S|P OUT_JSON=<file> node d-node.mjs
// NODE_SIDE=bundle is used ONLY by c3-control.mjs (the supplementary bundle control), never by d-pairs.mjs.
import { writeFileSync } from "node:fs";
const mod = process.env.NODE_SIDE === "bundle" ? await import("./bundle/workload150.bundle.mjs") : await import("./workload150.mjs");
writeFileSync(process.env.OUT_JSON, JSON.stringify({ runner: process.env.NODE_SIDE === "bundle" ? "node-bundle" : "node", ...mod.measure(process.env.WHICH) }));
