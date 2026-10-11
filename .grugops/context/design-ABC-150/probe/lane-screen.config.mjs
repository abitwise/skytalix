// ABC-150 D3 admissibility screen (correctness only; METHOD.md § D3). The lane's own vitest.config.ts,
// read unchanged and layered with ONE setting when SCREEN=C4. SCREEN=ctl layers nothing (it proves the
// probe-config path itself is green). Never `npm test`, never profiled; no wall or CPU figure is taken.
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vitest/config";
import lane from "../../../../vitest.config.ts";
const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SCREEN = process.env.SCREEN ?? "ctl";
const layer = { root: repo, test: {} };
if (SCREEN === "C4") layer.test.server = { deps: { external: [new RegExp(`${esc(repo)}/src/(?![^/]*\\.test\\.ts$)[^/]+\\.ts$`)] } };
else if (SCREEN !== "ctl") throw new Error(`unknown SCREEN ${SCREEN}`);
export default mergeConfig(lane, layer);
