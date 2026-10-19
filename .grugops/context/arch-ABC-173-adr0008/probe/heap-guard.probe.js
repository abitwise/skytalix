import v8 from "node:v8";
import { isMainThread } from "node:worker_threads";
export default function setup(project) {
  const mib = v8.getHeapStatistics().heap_size_limit / 1048576;
  const files = project.vitest.state.getPaths().length;
  process.stderr.write(`[guard-probe] isMainThread=${isMainThread} pid=${process.pid} heapMiB=${mib} files=${files}\n`);
  project.provide("heapRowMiB", files === 1 ? 496 : 224);
  if (process.env.GUARD_PROBE_THROW) throw new Error(`[guard-probe] refusing: heapMiB=${mib}`);
}
export function teardown() {}
