// design-ABC-152: appends one line per test-module start and end, so a killed lane still names the files
// that never finished. Reads no clock. Works on vitest 3.2.x and 4.1.x (both call these two hooks).
// Usage: PROGRESS=<file outside the tree> vitest run --reporter=<this file> ...
import { appendFileSync } from "node:fs";

const FILE = process.env.PROGRESS;

export default class ProgressReporter {
  onTestModuleStart(m) {
    if (FILE) appendFileSync(FILE, `start ${m.moduleId}\n`);
  }
  onTestModuleEnd(m) {
    if (FILE) appendFileSync(FILE, `end ${m.moduleId} ${m.state()}\n`);
  }
}
