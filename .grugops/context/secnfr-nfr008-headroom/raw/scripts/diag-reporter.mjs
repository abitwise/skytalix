import { writeFileSync } from "node:fs";
const t = {}; let t0 = 0;
export default class Diag {
  onTestRunStart() { t0 = Date.now(); }
  onTestModuleQueued(m) { (t[m.moduleId] ??= {}).queued = Date.now() - t0; }
  onTestModuleStart(m) { (t[m.moduleId] ??= {}).start = Date.now() - t0; }
  onTestModuleEnd(m) { (t[m.moduleId] ??= {}).end = Date.now() - t0; }
  onTestRunEnd(mods) {
    const rows = mods.map((m) => { const d = m.diagnostic(); const imp = Object.values(d.importDurations ?? {}).reduce((a, x) => a + (x.selfTime ?? x.totalTime ?? 0), 0);
      return { file: m.moduleId.replace(/.*secnfr-nfr008-headroom\//, ""), prepare: d.prepareDuration, collect: d.collectDuration, setup: d.setupDuration, env: d.environmentSetupDuration, tests: d.duration, ...t[m.moduleId] }; });
    writeFileSync(process.env.DIAG_OUT, JSON.stringify({ total: Date.now() - t0, rows }, null, 1));
  }
}
