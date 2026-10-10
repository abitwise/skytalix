// secnfr-ABC-127: plant ONE ABC-083-shaped evaluation term into an OUT-OF-TREE copy's src/evaluate.ts.
// Usage: node plant-eval.mjs <arm dir> <variant>|restore. Keeps the original as evaluate.ts.orig.
// These are probes of "does a plausible, non-weakening value change move the gate", never proposals.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const [arm, variant] = process.argv.slice(2);
if (!arm.includes("/scratchpad/secnfr-ABC-127/arms/")) throw new Error(`refusing to plant outside the scratch arms: ${arm}`);
const file = `${arm}/src/evaluate.ts`;
const orig = `${file}.orig`;
if (!existsSync(orig)) copyFileSync(file, orig);
const base = readFileSync(orig, "utf8");
if (variant === "restore") {
  writeFileSync(file, base);
  process.exit(0);
}
const RET = "  return position.blackToMove ? 0 - score : score;\n}";
if (base.split(RET).length !== 2) throw new Error("anchor not found exactly once");
const mob = (w) =>
  `  const own = legalMoves(position).length;\n` +
  `  position.blackToMove = !position.blackToMove;\n` +
  `  const opp = legalMoves(position).length;\n` +
  `  position.blackToMove = !position.blackToMove;\n` +
  `  return (position.blackToMove ? 0 - score : score) + ${w} * (own - opp);\n}`;
const variants = {
  E1_tempo10: "  return (position.blackToMove ? 0 - score : score) + 10;\n}",
  E2_mob3_own: "  return (position.blackToMove ? 0 - score : score) + 3 * legalMoves(position).length;\n}",
  E3_mob1_sym: mob(1),
  E4_mob3_sym: mob(3),
  E5_mob5_sym: mob(5),
};
const body = variants[variant];
if (!body) throw new Error(`unknown variant ${variant}`);
let out = base.replace(RET, body);
if (variant.includes("mob")) out = `import { legalMoves } from "./legal.ts";\n${out}`;
writeFileSync(file, out);
