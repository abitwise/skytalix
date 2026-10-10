// Usage: node perm-plant.mjs <tree> <variant>
// Plants the Node permission model onto the probe child's argv (no fs write, no net, no child
// process, no worker; fs read only under <tree>/src). Variant adds one capability use to the child
// as a control: none | write | net | spawn | readout.
import { readFileSync, writeFileSync } from "node:fs";
const [tree, variant = "none"] = process.argv.slice(2);
const file = `${tree}/src/history-pane.nfr.test.ts`;
let src = readFileSync(file, "utf8");
const anchor = '"--input-type=module",';
if (src.split(anchor).length !== 2) throw new Error("anchor count != 1");
src = src.replace(anchor, `"--permission", "--allow-fs-read=${tree}/src/*", ${anchor}`);
const controls = {
  none: "",
  write: `(await import("node:fs")).writeFileSync(${JSON.stringify(tree + "/perm-write-control.txt")}, "x");`,
  net: `await fetch("http://127.0.0.1:65530/");`,
  spawn: `(await import("node:child_process")).spawnSync("/usr/bin/true");`,
  readout: `(await import("node:fs")).readFileSync("/etc/hosts");`,
};
const line = "      const perFrame = seen();";
if (controls[variant] === undefined) throw new Error("unknown variant");
if (variant !== "none") {
  if (src.split(line).length !== 2) throw new Error("perFrame anchor count != 1");
  src = src.replace(line, `      ${controls[variant]}\n${line}`);
}
writeFileSync(file, src);
console.log(`planted ${variant} in ${file}`);
